const { assert } = require('chai')
const { ethers } = require('hardhat')

describe('Digital Will Contract', () => {
    let Will, will, owner, user1, user2;

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
   
})