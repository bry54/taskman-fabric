import path from "path";
import {connect, Gateway, Identity, Signer, signers} from "@hyperledger/fabric-gateway";
import {promises as fs} from "fs";
import {
    certPath,
    chaincodeName,
    channelName,
    cryptoPath,
    keyDirectoryPath,
    mspId,
    peerEndpoint,
    peerHostAlias,
    tlsCertPath
} from "./configs";
import * as grpc from "@grpc/grpc-js";
import crypto from "crypto";

export const newIdentity = async (): Promise<Identity> => {
    const credentials = await fs.readFile(certPath);
    return { mspId, credentials };
}

export const newGrpcConnection = async(): Promise<grpc.Client> => {
    const tlsRootCert = await fs.readFile(tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(peerEndpoint, tlsCredentials, {
        'grpc.ssl_target_name_override': peerHostAlias,
    });
}

 export const newSigner = async (): Promise<Signer> => {
    const files = await fs.readdir(keyDirectoryPath);
    const keyPath = path.resolve(keyDirectoryPath, files[0]);
    const privateKeyPem = await fs.readFile(keyPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}

export const newGateway = async (client): Promise<Gateway> => {
    return connect({
        client: client,
        identity: await newIdentity(),
        signer: await newSigner(),
        // Default timeouts for different gRPC calls
        evaluateOptions: () => {
            return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        endorseOptions: () => {
            return { deadline: Date.now() + 15000 }; // 15 seconds
        },
        submitOptions: () => {
            return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        commitStatusOptions: () => {
            return { deadline: Date.now() + 60000 }; // 1 minute
        },
    });
}