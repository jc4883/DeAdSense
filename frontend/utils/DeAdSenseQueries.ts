import { BigNumber, ethers  } from 'ethers';
import { Framework } from '@superfluid-finance/sdk-core';
import Operation from '@superfluid-finance/sdk-core/dist/module/Operation'
import { DeAdSense__factory } from '../typechain-types/factories/contracts/DeAdSense__factory';
import { DeAdSense } from '../typechain-types/contracts';

const API_URL = "https://polygon-mumbai.g.alchemy.com/v2/Sc6ox39EF8WqiAxTOrCXe5LDWiw5TeZt";
const TOKEN = "fUSDCx"

type ctx = {
    contract: DeAdSense,
    provider: ethers.providers.Provider
}

export async function getContext(contractAddress: string, provider: ethers.providers.Provider = new ethers.providers.JsonRpcProvider(API_URL)) : Promise<ctx> {
    return {contract: DeAdSense__factory.connect(contractAddress, provider), provider: provider};
}

export async function getLink(contractAddress: string, provider: ethers.providers.Provider = new ethers.providers.JsonRpcProvider(API_URL)) : Promise<string> {
    var contract = (await getContext(contractAddress, provider)).contract;
    return await contract.link();
}

export async function getOwner(contractAddress: string, provider: ethers.providers.Provider = new ethers.providers.JsonRpcProvider(API_URL)) : Promise<string> {
    var contract = (await getContext(contractAddress, provider)).contract;
    return await contract.owner();
}

export async function getStartDate(contractAddress: string, provider: ethers.providers.Provider = new ethers.providers.JsonRpcProvider(API_URL)) : Promise<Date> {
    var contract = (await getContext(contractAddress, provider)).contract;
    var dateInSecs = await contract.startdate();
    return new Date(dateInSecs.toNumber() * 1000);
}

export async function getEndDate(contractAddress: string, provider: ethers.providers.Provider = new ethers.providers.JsonRpcProvider(API_URL)) : Promise<Date> {
    var contract = (await getContext(contractAddress, provider)).contract;
    var dateInSecs = await contract.enddate();
    return new Date(dateInSecs.toNumber() * 1000);
}

export async function getCampaignActive(contractAddress: string, provider: ethers.providers.Provider = new ethers.providers.JsonRpcProvider(API_URL)) : Promise<Boolean> {
    var contract = (await getContext(contractAddress, provider)).contract;
    return await contract.campaignActive();
}

export async function getCampaignAmount(contractAddress: string, provider: ethers.providers.Provider = new ethers.providers.JsonRpcProvider(API_URL)) : Promise<BigInt> {
    var contract = (await getContext(contractAddress, provider)).contract;
    return (await contract.campaignAmount()).toBigInt();
}

export async function getReffererUnits(contractAddress: string, reffererAddress: string, provider: ethers.providers.Provider = new ethers.providers.JsonRpcProvider(API_URL)) : Promise<BigInt> {
    var contract = (await getContext(contractAddress, provider)).contract;
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

export async function addFundsToContractTransaction(contractAddress: string, amount: number, provider: ethers.providers.Web3Provider): Promise<ethers.ContractTransaction> {
    var ctx = await getContext(contractAddress, provider);
    var connectedContract = await ctx.contract.connect(provider.getSigner());
    var nonce = await ctx.contract.connect(provider.getSigner()).signer.getTransactionCount();
    var sendFunds = await connectedContract.addFunds(BigNumber.from(10).pow(18).mul(amount), {nonce: nonce});
    return sendFunds;
}

export async function approveSuperTokenOperation(contractAddress: string, amount: number, provider: ethers.providers.Web3Provider): Promise<Operation> {
    var ctx = await getContext(contractAddress, provider);
    const sf = await Framework.create({
        chainId: provider.network.chainId,
        provider
    });
    const fUSDCx = await sf.loadSuperToken(TOKEN);
    return fUSDCx.approve({amount:(BigNumber.from(10).pow(18).mul(amount).add(1)).toString(), receiver: ctx.contract.address})
}

export async function impressionRollupTransaction(contractAddress: string, refferers: string[], count: number[], provider: ethers.providers.Web3Provider): Promise<ethers.ContractTransaction> {
    var contract = (await getContext(contractAddress, provider)).contract;
    var nonce = await provider.getSigner().getTransactionCount();

    var rollupTx = contract.connect(provider.getSigner()).impressionRollup(refferers, count, {nonce: nonce});

    return rollupTx;
}

export async function distributeFinalFundsTransaction(contractAddress: string, provider: ethers.providers.Web3Provider): Promise<ethers.ContractTransaction> {
    var contract = (await getContext(contractAddress, provider)).contract;
    var nonce = await provider.getSigner().getTransactionCount();

    var distributeTx = contract.connect(provider.getSigner()).distributeFinalFunds({nonce: nonce});

    return distributeTx;
}
