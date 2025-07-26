const {assert, expect} = require('chai')
const {ethers} = require('hardhat')

describe('Ping', () => {
    let Will, will, owner, testator, benefiaiary1

    beforeEach(async () => {
        Will = await ethers.getContractFactory('CreateWill')
        will = await Will.deploy();
        await will.deployed();

        [owner, testator, benefiaiary1] = await ethers.getSigners()

        const beneficiaries = [benefiaiary1.address]
        const amounts = [ethers.utils.parseEther('2')]
        const deathTimeout = 120

        await will.createWill(
            beneficiaries,
            amounts,
            deathTimeout,
            {value: ethers.utils.parseEther('4')}
        )
    })

    it('should update lastPing for the testator', async () => {
        const tx = await will.ping()
        const receipt = await tx.wait()

        const userWill = await will.usersWill(owner.address)
        const block = await ethers.provider.getBlock(receipt.blockNumber)

        assert.equal(userWill.lastPing, block.timestamp)
    })
    it('should revert if non-owner calls ping()', async () => {
        await expect(will.connect(testator).ping()).to.be
                .revertedWith("Will not found")
    })
})