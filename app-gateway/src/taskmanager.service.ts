import {faker} from '@faker-js/faker';
import {Contract} from "@hyperledger/fabric-gateway";
import {
    certPath,
    chaincodeName,
    channelName,
    cryptoPath,
    keyDirectoryPath,
    mspId,
    peerEndpoint,
    peerHostAlias,
    tlsCertPath,
    utf8Decoder
} from "./configs";


/**
 * displayInputParameters() will print the global scope parameters used by the main driver routine.
 */
export const displayConnectionParameters = async (): Promise<void> => {
    console.log(`channelName:       ${channelName}`);
    console.log(`chaincodeName:     ${chaincodeName}`);
    console.log(`mspId:             ${mspId}`);
    console.log(`cryptoPath:        ${cryptoPath}`);
    console.log(`keyDirectoryPath:  ${keyDirectoryPath}`);
    console.log(`certPath:          ${certPath}`);
    console.log(`tlsCertPath:       ${tlsCertPath}`);
    console.log(`peerEndpoint:      ${peerEndpoint}`);
    console.log(`peerHostAlias:     ${peerHostAlias}`);
}

async function seedTasks(contract: Contract): Promise<void> {
    console.log('\n--> Submit Transaction: seedTasks, function creates the initial set of tasks on the ledger');

    await contract.submitTransaction('seedTasks');

    console.log('*** Transaction committed successfully');
}

export const createResource = async (contract: Contract): Promise<void> => {
    console.log('\n--> Submit Transaction: createTask, creates new asset with ID, Color, Size, Owner and AppraisedValue arguments');
    //title: string, description: string, status: string, createdAt: string, updatedAt: string, deletedAt: string

    await contract.submitTransaction(
        'createTask',
        faker.lorem.sentence(5),
        faker.lorem.paragraph(2),
        'open',
        faker.date.past().toISOString(),
        '-',
        '-'
    );

    console.log('*** Transaction committed successfully');
}

async function readAssetById(contract: Contract): Promise<void> {
    console.log('\n--> Evaluate Transaction: ReadAsset, function returns asset attributes');

    const resultBytes = await contract.evaluateTransaction('ReadAsset');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log('*** Result:', result);
}

export const readAllResources = async (contract: Contract): Promise<any[]> => {
    console.log('\n--> Evaluate Transaction: GetAllTasks, function returns all the current tasks on the ledger');

    const resultBytes = await contract.evaluateTransaction('readAllTasks');

    const resultJson = utf8Decoder.decode(resultBytes);
    return JSON.parse(resultJson);
}

async function updateResource(contract: Contract): Promise<void>{
    console.log('\n--> Submit Transaction: UpdateAsset asset70, asset70 does not exist and should return an error');

    try {
        await contract.submitTransaction(
            'UpdateAsset',
            'asset70',
            'blue',
            '5',
            'Tomoko',
            '300',
        );
        console.log('******** FAILED to return an error');
    } catch (error) {
        console.log('*** Successfully caught the error: \n', error);
    }
}