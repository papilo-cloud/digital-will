const {assert, expect} = require('chai')
const {ethers} = require('hardhat')


describe('Execute Will', () => {
    let Will, will, owner, testator, benefiaiary1, benefiaiary2, benefiaiary3

    beforeEach(async () => {
        Will = await ethers.getContractFactory('CreateWill')
        will = await Will.deploy()
        await will.deployed();

        [owner, testator, benefiaiary1, benefiaiary2, benefiaiary3] = await ethers.getSigners()

        const beneficiaries = [benefiaiary1.address, benefiaiary2.address]
        const amounts = [ethers.utils.parseEther('10'), ethers.utils.parseEther('10')]
        const deathTimeout = 120;

        await will.connect(testator).createWill(
            beneficiaries,
            amounts,
            deathTimeout,
            {value: ethers.utils.parseEther('22')}
        )
    })

    it('should revert if testator is still alive', async () => {
        await expect(will.connect(benefiaiary1).executeWill(testator.address))
                .to.be.revertedWith('Testator still alive')
    })

    it('should distribute funds to beneficiaries if timeout passed', async () => {
        await ethers.provider.send('evm_increaseTime', [120+2])
        await ethers.provider.send('evm_mine')

        const initBalance1 = await ethers.provider.getBalance(benefiaiary1.address)
        const initBalance2 = await ethers.provider.getBalance(benefiaiary2.address)

        await will.connect(benefiaiary3).executeWill(testator.address)

        const finalBalance1 = await ethers.provider.getBalance(benefiaiary1.address)
        const finalBalance2 = await ethers.provider.getBalance(benefiaiary2.address)

        assert(finalBalance1.gt(initBalance1))
        assert(finalBalance2.gt(initBalance2))

        const userWill = await will.usersWill(testator.address)

        assert.equal(userWill.executed, true)
        assert.equal(userWill.balance, 0)
    })

    it('should revert if will is already executed', async () => {
        await ethers.provider.send('evm_increaseTime', [120 + 2])
        await ethers.provider.send('evm_mine');
        await will.executeWill(testator.address)

        const userWill = await will.usersWill(testator.address)
        expect(userWill.executed).to.be.revertedWith("Will already executed")
    })

    it('should revert if will is cancelled', async () => {

        await ethers.provider.send('evm_increaseTime', [120 + 2])
        await ethers.provider.send('evm_mine');
        await will.connect(testator).cancelWill();

        const userWill = await will.usersWill(testator.address)

        expect(userWill.cancelled).to.be.revertedWith('Will already cancelled')
    })
})