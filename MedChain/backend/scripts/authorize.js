require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

async function main() {
    const rpcUrl =
        process.env.LOCALHOST_URL || 'http://127.0.0.1:8545';

    const provider = new ethers.JsonRpcProvider(rpcUrl);

    const signer = new ethers.Wallet(
        process.env.PRIVATE_KEY,
        provider
    );

    const artifactPath = path.join(
        __dirname,
        '..',
        'artifacts',
        'contracts',
        'MedicineChain.sol',
        'MedicineChain.json'
    );

    const artifact = JSON.parse(
        fs.readFileSync(artifactPath, 'utf8')
    );

    const contract = new ethers.Contract(
        process.env.CONTRACT_ADDRESS,
        artifact.abi,
        signer
    );

    const distributorAddress =
        '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

    const retailerAddress =
        '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC';

    const distributorTx = await contract.authorizeDistributor(
        distributorAddress,
        true
    );

    console.log(
        `[blockchain] distributor authorization transaction sent: ${distributorTx.hash}`
    );

    const distributorReceipt = await distributorTx.wait();

    console.log(
        `[blockchain] distributor authorized in block ${distributorReceipt.blockNumber}`
    );

    const nonce = await provider.getTransactionCount(
        await signer.getAddress(),
        'latest'
    );

    const retailerTx = await contract.authorizeDistributor(
        retailerAddress,
        true,
        { nonce }
    );


    console.log(
        `[blockchain] retailer authorization transaction sent: ${retailerTx.hash}`
    );

    const retailerReceipt = await retailerTx.wait();

    console.log(
        `[blockchain] retailer authorized in block ${retailerReceipt.blockNumber}`
    );

}

main().catch((error) => {
    console.error(
        `[blockchain] authorization failed: ${error.message}`
    );
    process.exitCode = 1;
});
