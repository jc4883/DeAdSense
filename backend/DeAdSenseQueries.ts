import { BigNumber, ethers } from 'ethers';
import { Framework } from '@superfluid-finance/sdk-core';
import { DeAdSense__factory } from './typechain-types/factories/contracts/DeAdSense__factory';
import { DeAdSense } from './typechain-types/contracts';

const API_URL = "https://polygon-mumbai.g.alchemy.com/v2/Sc6ox39EF8WqiAxTOrCXe5LDWiw5TeZt";

export async function getContract(contractAddress: string) : Promise<DeAdSense> {
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    await provider.getNetwork(); // wait for this to ensure network info is available

    return await DeAdSense__factory.connect(contractAddress, provider);

}

export async function getLink(contractAddress: string) : Promise<string> {
    var contract = await getContract(contractAddress);
    return await contract.link();
}

export async function getStartDate(contractAddress: string) : Promise<Date> {
    var contract = await getContract(contractAddress);
    var dateInSecs = await contract.startdate();
    return new Date(dateInSecs.toNumber() * 1000);
}

export async function getEndDate(contractAddress: string) : Promise<Date> {
    var contract = await getContract(contractAddress);
    var dateInSecs = await contract.enddate();
    return new Date(dateInSecs.toNumber() * 1000);
}

export async function getCampaignActive(contractAddress: string) : Promise<Boolean> {
    var contract = await getContract(contractAddress);
    return await contract.campaignActive();
}

export async function getCampaignAmount(contractAddress: string) : Promise<BigInt> {
    var contract = await getContract(contractAddress);
    return (await contract.campaignAmount()).toBigInt();
}

export async function getReffererUnits(contractAddress: string, reffererAddress: string) : Promise<BigInt> {
    var contract = await getContract(contractAddress);
    return (await contract.getReffererUnits(reffererAddress)).toBigInt();
}
