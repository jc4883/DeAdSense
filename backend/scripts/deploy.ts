import { ethers } from 'hardhat';
import { Framework } from '@superfluid-finance/sdk-core';
import * as dotenv from "dotenv";

dotenv.config();

async function main() {

  const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL);
  await provider.getNetwork(); // wait for this to ensure network info is available
  console.log(`Connected to network ${provider.network.name} with chainId ${provider.network.chainId}`);

  const sf = await Framework.create({
    chainId: provider.network.chainId,
    provider
  });

  const hostAddr = sf.host.contract.address;  
  const fUSDCx = await sf.loadSuperToken("fUSDCx");

  console.log(`Superfluid: host address ${hostAddr}, fUSDCx address ${fUSDCx.address}`);

  const signer = (await ethers.getSigners())[0];
  const signerBalance = await provider.getBalance(signer.address);

  console.log(`Using signer ${signer.address} with native token balance: ${signerBalance.toString()}`);

  const dasContractFactory = await ethers.getContractFactory(
      "DeAdSense",
      signer
  );

  const dateInSecs = Math.floor(new Date().getTime() / 1000);
  const tomorrow = dateInSecs + (24*60*60);
  
  console.log("Deploying...");
  const dasPromise = await dasContractFactory.deploy(
    dateInSecs,
    tomorrow,
    "www.hobinrood.app",
    fUSDCx.address,
    0,
    hostAddr
  );
  const das = await dasPromise.deployed();
  console.log("DeAdSense deployed to:", das.address);

  console.log("You can verify the contract with:");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});