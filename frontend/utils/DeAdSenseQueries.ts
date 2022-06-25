import { BigNumber, ethers  } from 'ethers';
import { Framework } from '@superfluid-finance/sdk-core';
import { DeAdSense__factory } from '../typechain-types/factories/contracts/DeAdSense__factory';
import { DeAdSense } from '../typechain-types/contracts';

const API_URL = "https://polygon-mumbai.g.alchemy.com/v2/Sc6ox39EF8WqiAxTOrCXe5LDWiw5TeZt";
const TOKEN = "fUSDCx"

type ctx = {
    contract: DeAdSense,
    provider: ethers.providers.JsonRpcProvider
}

export async function getContext(contractAddress: string) : Promise<ctx> {
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    await provider.getNetwork(); // wait for this to ensure network info is available

    return {contract: DeAdSense__factory.connect(contractAddress, provider), provider: provider};

}

export async function getLink(contractAddress: string) : Promise<string> {
    var contract = (await getContext(contractAddress)).contract;
    return await contract.link();
}

export async function getStartDate(contractAddress: string) : Promise<Date> {
    var contract = (await getContext(contractAddress)).contract;
    var dateInSecs = await contract.startdate();
    return new Date(dateInSecs.toNumber() * 1000);
}

export async function getEndDate(contractAddress: string) : Promise<Date> {
    var contract = (await getContext(contractAddress)).contract;
    var dateInSecs = await contract.enddate();
    return new Date(dateInSecs.toNumber() * 1000);
}

export async function getCampaignActive(contractAddress: string) : Promise<Boolean> {
    var contract = (await getContext(contractAddress)).contract;
    return await contract.campaignActive();
}

export async function getCampaignAmount(contractAddress: string) : Promise<BigInt> {
    var contract = (await getContext(contractAddress)).contract;
    return (await contract.campaignAmount()).toBigInt();
}

export async function getReffererUnits(contractAddress: string, reffererAddress: string) : Promise<BigInt> {
    var contract = (await getContext(contractAddress)).contract;
    return (await contract.getReffererUnits(reffererAddress)).toBigInt();
}

export async function getNewContractTransaction(startDate: Date, endDate: Date, link: string): Promise<ethers.providers.TransactionRequest> {
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    await provider.getNetwork(); // wait for this to ensure network info is available

    const sf = await Framework.create({
        chainId: provider.network.chainId,
        provider
    });
    const hostAddr = sf.host.contract.address;  
    const fUSDCx = await sf.loadSuperToken(TOKEN);

    const dasContractFactory = new DeAdSense__factory();
    var startDateInSecs = Math.floor(startDate.getTime() / 1000);
    var endDateInSecs = Math.floor(endDate.getTime() / 1000);
    return dasContractFactory.getDeployTransaction(startDateInSecs, endDateInSecs, link, fUSDCx.address, 0, hostAddr);
}

export async function addFundsToContractTransaction(contractAddress: string, amount: number): Promise<ethers.providers.TransactionRequest[]> {
    var ctx = await getContext(contractAddress);
    var provider = ctx.provider;
    const sf = await Framework.create({
        chainId: provider.network.chainId,
        provider
    });
    const fUSDCx = await sf.loadSuperToken(TOKEN);

    var approveOp = fUSDCx.approve({amount:(BigNumber.from(10).pow(18).mul(amount).add(1)).toString(), receiver: ctx.contract.address})

    var approveTx = await approveOp.populateTransactionPromise;

    var sendFunds = await ctx.contract.addFunds(BigNumber.from(10).pow(18).mul(amount));
    return [approveTx, sendFunds as ethers.providers.TransactionRequest];
}

export async function impressionRollupTransaction(contractAddress: string, refferers: string[], count: number[]): Promise<ethers.providers.TransactionRequest> {
    var contract = (await getContext(contractAddress)).contract;

    var rollupTx = contract.impressionRollup(refferers, count);

    return rollupTx as ethers.providers.TransactionRequest;
}

export async function distributeFinalFundsTransaction(contractAddress: string): Promise<ethers.providers.TransactionRequest> {
    var contract = (await getContext(contractAddress)).contract;

    var distributeTx = contract.distributeFinalFunds();

    return distributeTx as ethers.providers.TransactionRequest;
}
