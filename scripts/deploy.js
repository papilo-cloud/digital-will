const { ethers } = require('hardhat')
// 0x4537421997284D7C3f5926776fcE759eE1c071cc

async function main() {
    const [deployer] = await ethers.getSigners()
    console.log(`Deployer account: ${deployer.address}`)

    const Will = await ethers.getContractFactory('CreateWill')
    const will = await Will.deploy();
    await will.deployed();

    console.log(`Contract deployed to: ${will.address}`)
}

main()
    .then(() => process.exit())
    .catch(err => {
        console.error(err);
        process.exit(1);
    })