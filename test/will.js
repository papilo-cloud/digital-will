const { assert, expect } = require('chai')
const { ethers } = require('hardhat')

describe('Digital Will Contract', () => {
    let Will, will, owner, user1, user2, DEATH_TIMEOUT;

    beforeEach(async () => {
        Will = await ethers.getContractFactory('CreateWill')
        will = await Will.deploy({value: ethers.utils.parseEther('100')})
        await will.deployed();

        [owner, user1, user2, user3] = await ethers.getSigners()

    })

    describe('Deployment', () => {
        it('Should set the right owner', async () => {
            assert.equal(await will.owner(), owner.address, 'Not the owner')
        })
    })
    describe('Create Will', () => {
        it('should should create a valid will with correct inputs', async () => {
            const beneficiaries = [user1.address, user2.address];
            const amount = [ethers.utils.parseEther('20'), ethers.utils.parseEther('10')]
            await expect(will.createWill(beneficiaries, amount)).to.emit(will, 'WillCreated')
        })
        it('should fail if benefiaiary and amount length mismatch', async () => {
            const beneficiaries = [user1.address, user2.address];
            const amount = [ethers.utils.parseEther('20')]
            await expect(will.createWill(beneficiaries, amount))
                    .to.be.revertedWith('Bebeficiaries and amount must be of the same length')
        })

        it('should fail if arrays are empty', async () => {
            await expect(will.createWill([], [])).to.be
                .revertedWith('At least one beneficiary and one amount is required')
        })

        it('should fail if addresses are more than 10 entries', async () => {
            const beneficiaries = Array(12).fill(user1.address)
            const amount = Array(12).fill(ethers.utils.parseEther('10'))

            await expect(will.createWill(beneficiaries, amount)).to.be
                    .revertedWith('Maximum of 10 beneficiaries and amounts allowed')
        })

        it('should fail if one of the addresses is 0', async () => {
            const beneficiaries = [user1.address, user2.address, '0x0000000000000000000000000000000000000000']
            const amount = [ethers.utils.parseEther('10'), ethers.utils.parseEther('10'), ethers.utils.parseEther('10')]
            await expect(will.createWill(beneficiaries, amount)).to.be
                    .revertedWith("Beneficiary address must be a valid address")
        })

        it('should fail if amount is less than 0 ether', async () => {
            const beneficiaries = [user1.address]
            const amount = [ethers.utils.parseEther('0')]
            await expect(will.createWill(beneficiaries, amount)).to.be
                    .revertedWith('Amount must be greater than zero')
        })

        it('should fail if amount is greater than 100 ether', async () => {
            const beneficiaries = [user1.address]
            const amount = [ethers.utils.parseEther('101')]
            await expect(will.createWill(beneficiaries, amount)).to.be
                    .revertedWith('Amount must be less than 100 ether')
        })
    })

    describe('Ping functionality', () => {
        it('should update lastPing when owner calls ping()', async () => {
            const tx = await will.ping()
            const receipt = await tx.wait();

            const block = await ethers.provider.getBlock(receipt.blockNumber)
            const willData = await will.will();

            assert.equal(willData.lastPing, block.timestamp)
        })
        it('should revert if non-owner calls ping()', async () => {
            await expect(will.connect(user1).ping()).to.be
                    .revertedWith("Not the owner")
        })
    })

    describe('Execute-will functionality', () => {
        beforeEach(async() =>{
            DEATH_TIMEOUT = 120;
            await will.createWill([user1.address], [ethers.utils.parseEther('20')])
            await will.ping()
        })

        it('should revert if death timeout has not passed', async () => {
            await expect(will.executeWill()).to.be
                .revertedWith("Death timeout not reached")
        })
        it('should execute will and send ETH to beneficiaries after timeout', async () => {
            await ethers.provider.send('evm_increaseTime', [DEATH_TIMEOUT + 1])
            await ethers.provider.send('evm_mine');

            const initAddr1Bal = await ethers.provider.getBalance(user1.address)

            await will.executeWill()

            const finalAddr1Bal = await ethers.provider.getBalance(user1.address)

            expect(finalAddr1Bal.sub(initAddr1Bal)).to.equal(ethers.utils.parseEther('20'));

            const willData = await will.will()
            assert.equal(willData.executed, true)
        })
        it('should revert if will is already executed', async () => {
            await ethers.provider.send('evm_increaseTime', [DEATH_TIMEOUT + 1])
            await ethers.provider.send('evm_mine');

            // const willData = await will.will()
            await will.executeWill()
            expect(will.executed).to.be.revertedWith("Will already executed")
        })
        it('should revert if will is cancelled', async () => {

            await ethers.provider.send('evm_increaseTime', [DEATH_TIMEOUT + 1])
            await ethers.provider.send('evm_mine');
            await will.cancelWill();

            const willData = await will.will()

            expect(will.cancelled).to.be.revertedWith('Will already cancelled')
        })
    })

    describe('Cancel Will', () => {
        it('should revert if already executed', async () => {
            await will.executeWill()

            await expect(will.cancelWill()).to.be
                .revertedWith("Will already executed")
        })
        it('should revert if already calcelled', async () => {
            await will.cancelWill()

            await expect(will.cancelWill()).to.be
                .revertedWith("Will already cancelled")
        })
        it('should cancel the will and refund the owner', async () => {
            const initBalance = await ethers.provider.getBalance(owner.address)

            const tx = await will.cancelWill()
            const receipt = await tx.wait()
            const willData = await will.will()

            const contractBalance = await ethers.provider.getBalance(will.address)
            const finalBalance = await ethers.provider.getBalance(owner.address)

            // check that the will was cancelled
            assert.equal(willData.cancelled, true)

            // check that the contract balance is 0
            assert.equal(contractBalance, 0)

            // check that the owner got refunded (considering gas cost)
            // assert(finalBalance.gt(initBalance))
            expect(finalBalance).to.be.above(initBalance.sub(receipt.gasUsed.mul(receipt.effectiveGasPrice)));
        })
    })
})