const hre = require("hardhat");

async function main() {

  const Blokemon = await hre.ethers.getContractFactory("Blokemon");
  const blokemon = await Blokemon.deploy()

  await blokemon.deployed();

  console.log(
    ` deployed to ${blokemon.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
