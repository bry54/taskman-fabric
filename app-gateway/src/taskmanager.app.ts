import {
    createResource,
    displayConnectionParameters,
    readAllResources,
} from "./taskmanager.service";
import {newGateway, newGrpcConnection} from "./helpers";
import {chaincodeName, channelName} from "./configs";
import {Gateway} from "@hyperledger/fabric-gateway";
import {Client} from "@grpc/grpc-js";

export async function main(): Promise<void> {
    console.log(' ********** Start of application ********** ');

    await displayConnectionParameters().catch(err => console.log(err));

    const client: Client = await newGrpcConnection();

    const gateway: Gateway = await newGateway(client);

    try{
        const network = await gateway.getNetwork(channelName);

        const contract = network.getContract(chaincodeName);

        const resources: any[] = await readAllResources(contract)
            .then(result => {
                console.log('*** Result:', result);
                return result;
            })
            .catch(err => {
                console.log(err)
                return []
            });

        if (!resources?.length) {
            //await createResource(contract).catch(err => console.log(err));
        }


    } finally {
        gateway.close();
        client.close();
    }
}