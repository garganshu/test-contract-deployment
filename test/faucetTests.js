const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("Faucet", function() {

async function deployContractAndSetVariables() {
    const Faucet = await ethers.getContractFactory("Faucet");
    const faucet = await Faucet.deploy() ; 

    const [owner, signer1] = await ethers.getSigners();

    const withdrawAmount = ethers.utils.parseUnits("1", "ether"); 

    const provider = await ethers.provider;

    return { faucet, owner, withdrawAmount, signer1, provider}

}

it("should set the owner correctly at deployment", async function() {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables); 
    expect(await faucet.owner()).to.equal(owner.address);
});

it("should not withdraw more than .1 ether at a time", async function() {
    const { faucet, withdrawAmount } = await loadFixture(deployContractAndSetVariables); 
    await expect(faucet.withdraw(withdrawAmount)).to.be.reverted
});

it("should not withdraw all if not called by owner", async function() {
    const { faucet, signer1 } = await loadFixture(deployContractAndSetVariables); 
    await expect(faucet.connect(signer1).withdrawAll()).to.be.reverted
});

it("should withdraw all if called by owner", async function() {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables); 
    await expect(faucet.withdrawAll()).to.be.fulfilled
});

it("should not selfDestruct if not called by owner", async function() {
    const { faucet, signer1 } = await loadFixture(deployContractAndSetVariables); 
    await expect(faucet.connect(signer1).destroyFaucet()).to.be.reverted
});

it("should selfDestruct if called by owner", async function() {
    const { faucet, provider } = await loadFixture(deployContractAndSetVariables); 
    await faucet.destroyFaucet(); 
    const afterDestroyCode = await provider.getCode(faucet.address);
    expect(afterDestroyCode).to.equal('0x')
});

});