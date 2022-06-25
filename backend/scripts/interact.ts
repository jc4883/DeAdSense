import { ethers } from 'hardhat';
import { Framework } from '@superfluid-finance/sdk-core';
import * as dotenv from "dotenv";

import {DeAdSense} from "../typechain-types/contracts";
import { DeAdSenseInterface } from '../typechain-types/contracts/DeAdSense';
import { BigNumber } from 'ethers';

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

  //var op = fUSDCx.approve({amount:(BigNumber.from(10).pow(18).mul(5).add(1)).toString(), receiver: process.env.CONTRACT_ADDRESS?process.env.CONTRACT_ADDRESS:""});
  //const txn = await op.exec(signer);

  const dasContractFactory = await ethers.getContractFactory(
    "DeAdSense",
    signer
  );
   const contract = dasContractFactory.attach(process.env.CONTRACT_ADDRESS?process.env.CONTRACT_ADDRESS:"");
   //var op1 = await contract.connect(signer).addFunds(BigNumber.from(10).pow(18).mul(5));
  //console.log(op1);
  // console.log("finished")

  //var op2 = await contract.connect(signer).impressionRollup(["0xF0a0D2E77ADBeD1A675eBD5Aa70d8BA86d698161", "0x7881018A79686bF07b1476864215E070D1Fe33C5"], [5, 10]);
  //var op2 = await contract.connect(signer).getReffererUnits("0x7881018A79686bF07b1476864215E070D1Fe33C5")
  var op2 = await contract.connect(signer).distributeFinalFunds();
  console.log(op2);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

