const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying contracts with account:', deployer.address);

  const Factory = await hre.ethers.getContractFactory('ReactiveNewsFactory');
  const factory = await Factory.deploy();
  await factory.deployed();

  console.log('ReactiveNewsFactory deployed to:', factory.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
