const { assert, expect } = require('chai')
const { ethers } = require('hardhat')

describe('Digital Will Contract', () => {
    let Will, will, owner, testator, benefiaiary1, benefiaiary2;
// {value: ethers.utils.parseEther('100')}
    beforeEach(async () => {
        Will = await ethers.getContractFactory('CreateWill')
        will = await Will.deploy()
        await will.deployed();

        [owner, testator, benefiaiary1, benefiaiary2] = await ethers.getSigners()

    })

    describe('CreateWill', () => {
        it('should allow a testator to create a will', async () => {
            const beneficiaries = [benefiaiary1.address, benefiaiary2.address]
            const amounts = [ethers.utils.parseEther('5'), ethers.utils.parseEther('5')]
            const deathTimeout = 120 // 2 minutes

            await will.connect(testator).createWill(
                beneficiaries,
                amounts,
                deathTimeout,
                {value: ethers.utils.parseEther('11')}
            )

            const userWill = await will.usersWill(testator.address)

            assert.equal(userWill.cancelled, false)
            assert.equal(userWill.executed, false)
            assert.equal(userWill.deathTimeout, deathTimeout)
            assert.equal(userWill.balance.toString(), ethers.utils.parseEther('11').toString())
        })
        it('should fail if benefiaiary and amount length mismatch', async () => {
            const beneficiaries = [benefiaiary1.address, benefiaiary2.address];
            const amount = [ethers.utils.parseEther('2')]
            const deathTimeout = 120;

            await expect(will.connect(testator).createWill(beneficiaries, amount, deathTimeout,
                {value: ethers.utils.parseEther('10')}
            ))
                    .to.be.revertedWith('Bebeficiaries and amount must be of the same length')
        })
        it('should revert if will already exists', async () => {
            const beneficiaries = [benefiaiary1.address, benefiaiary2.address];
            const amounts = [ethers.utils.parseEther('2'), ethers.utils.parseEther('2')]
            const deathTimeout = 120;

            await will.connect(testator).createWill(beneficiaries, amounts, deathTimeout, 
                {value: ethers.utils.parseEther('10')}
            )

            await expect(will.connect(testator).createWill(beneficiaries, amounts, deathTimeout, 
                {value: ethers.utils.parseEther('10')}
            )).to.be.revertedWith('Will already exists')
        })

        it('should revert if amount is less than 1 ether', async () => {
            const beneficiaries = [benefiaiary1.address, benefiaiary2.address];
            const amounts = [ethers.utils.parseEther('2'), ethers.utils.parseEther('2')]
            const deathTimeout = 120;
            
            await expect(will.connect(testator).createWill(beneficiaries, amounts, deathTimeout, 
                {value: ethers.utils.parseEther('0.5')}
            )).to.be.revertedWith('Minimum of 1 ether required to create will')
        })

        it('should fail if addresses are more than 10 entries', async () => {
            const beneficiaries = Array(12).fill(benefiaiary1.address)
            const amount = Array(12).fill(ethers.utils.parseEther('1'))
            const deathTimeout = 120;

            await expect(will.connect(testator).createWill(beneficiaries, amount, deathTimeout, 
                {value: ethers.utils.parseEther('10')}
            )).to.be
                    .revertedWith('1 to 10 beneficiaries allowed')
        })

        it('should fail if one of the addresses is 0', async () => {
            const beneficiaries = [benefiaiary1.address, '0x0000000000000000000000000000000000000000'];
            const amounts = [ethers.utils.parseEther('2'), ethers.utils.parseEther('2')]
            const deathTimeout = 120;
            
            await expect(will.connect(testator).createWill(beneficiaries, amounts, deathTimeout, 
                {value: ethers.utils.parseEther('5')}
            )).to.be.revertedWith('Beneficiary address must be a valid address')
        })

        it('should fail if amount is less than 0 ether', async () => {
            const beneficiaries = [benefiaiary1.address, benefiaiary2.address];
            const amounts = [ethers.utils.parseEther('0'), ethers.utils.parseEther('2')]
            const deathTimeout = 120;
            
            await expect(will.connect(testator).createWill(beneficiaries, amounts, deathTimeout, 
                {value: ethers.utils.parseEther('5')}
            )).to.be.revertedWith('Invalid mount')
        })

        it('should fail if amount is greater than 100 ether', async () => {
            const beneficiaries = [benefiaiary1.address, benefiaiary2.address];
            const amounts = [ethers.utils.parseEther('2'), ethers.utils.parseEther('102')]
            const deathTimeout = 120;
            
            await expect(will.connect(testator).createWill(beneficiaries, amounts, deathTimeout, 
                {value: ethers.utils.parseEther('5')}
            )).to.be.revertedWith('Invalid mount')
        })
        it('should revert if total amount exceeds ether sent', async () => {
        const beneficiaries = [benefiaiary1.address, benefiaiary2.address];
        const amounts = [ethers.utils.parseEther('4'), ethers.utils.parseEther('2')] // total = 4
        const deathTimeout = 120;
        
        await expect(will.connect(testator).createWill(beneficiaries, amounts, deathTimeout, 
            {value: ethers.utils.parseEther('5')}
        )).to.be.revertedWith('Insufficient ether sent')
    })
    })
})