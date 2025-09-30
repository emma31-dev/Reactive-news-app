const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('ReactiveNewsValidator', function() {
  it('emits ReactiveCallback on submitNews', async function() {
    const ReactiveNewsValidator = await ethers.getContractFactory('ReactiveNewsValidator');
    const validator = await ReactiveNewsValidator.deploy();
    await validator.deployed();

    const tx = await validator.submitNews('Test', 'Content', 'General');
    const receipt = await tx.wait();

    // search for ReactiveCallback event
    const event = receipt.events.find(e => e.event === 'ReactiveCallback');
    expect(event).to.not.be.undefined;
    expect(event.args[1]).to.equal('news_submitted');
  });
});
