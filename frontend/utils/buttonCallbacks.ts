import { BigNumber, ethers  } from 'ethers';
import { getNewContractTransaction, addFundsToContractTransaction, approveSuperTokenOperation, distributeFinalFundsTransaction, impressionRollupTransaction } from './DeAdSenseQueries';

export async function createCampaign(link: string, amount: number, provider: ethers.providers.Web3Provider) : Promise<string> {
    var startDate = new Date();
    var endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    var createContractTxInstruction = await getNewContractTransaction(startDate, endDate, link);
    var createContractTx = await provider.getSigner().sendTransaction(createContractTxInstruction);
    var createContractTxFinal = await provider.waitForTransaction(createContractTx.hash)
    var contractAddress = createContractTxFinal.contractAddress;
    
    var approveOp = await approveSuperTokenOperation(contractAddress, amount, provider);
    var approveTransaction = await approveOp.exec(provider.getSigner());
    var approveTransactionFinal = await provider.waitForTransaction(approveTransaction.hash);

    var addFundsTxInstruction = await addFundsToContractTransaction(contractAddress, amount);
    var addFundsTx = await provider.getSigner().sendTransaction(addFundsTxInstruction);
    var addFundsTxFinal = await provider.waitForTransaction(addFundsTx.hash);

    return contractAddress;
}

export async function distributeFunds(contractAddress: string, provider: ethers.providers.Web3Provider) {
    var distributeFundsTxInstruction = await distributeFinalFundsTransaction(contractAddress, provider);
    var distributeFundsTx = await provider.getSigner().sendTransaction(distributeFundsTxInstruction);
    var distributeFundsTxFinal = await provider.waitForTransaction(distributeFundsTx.hash);
}

export async function addFunds(contractAddress: string, amount: number, provider: ethers.providers.Web3Provider) {
    var approveOp = await approveSuperTokenOperation(contractAddress, amount, provider);
    var approveTransaction = await approveOp.exec(provider.getSigner());
    var approveTransactionFinal = await provider.waitForTransaction(approveTransaction.hash);

    var addFundsTxInstruction = await addFundsToContractTransaction(contractAddress, amount);
    var addFundsTx = await provider.getSigner().sendTransaction(addFundsTxInstruction);
    var addFundsTxFinal = await provider.waitForTransaction(addFundsTx.hash);
}

export async function impressionRollupCallback(contractAddress: string, refferers: string[], count: number[], provider: ethers.providers.Web3Provider) {
    var rollupTxInstruction = await impressionRollupTransaction(contractAddress, refferers, count, provider);
    var rollupTx = await provider.getSigner().sendTransaction(rollupTxInstruction);
    var rollupTxFinal = await provider.waitForTransaction(rollupTx.hash);
}