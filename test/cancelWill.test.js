const {assert, expect} = require('chai')
const {ethers} = require('hardhat')


describe('Cancel Will', () => {
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
    
    it('should revert if already executed', async () => {
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

    it('should cancel the will and refund the owner', async () => {
        const initBalance = await ethers.provider.getBalance(testator.address)

        await will.connect(testator).cancelWill()

        const finalBalance = await ethers.provider.getBalance(testator.address)

        const userWill = await will.usersWill(testator.address)
        assert.equal(userWill.cancelled, true)
        assert.equal(userWill.balance, 0)

        assert(finalBalance.gt(initBalance))
    })
})