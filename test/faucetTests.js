const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("Faucet", function() {

async function deployContractAndSetVariables() {
    const Faucet = await ethers.getContractFactory("Faucet");
    const faucet = await Faucet.deploy() ; 

    const [owner] = await ethers.getSigners();

    return { faucet, owner }

}

it("should set the owner correctly at deployment", async function() {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables); 
    expect(await faucet.owner()).to.equal(owner.address);
});

});