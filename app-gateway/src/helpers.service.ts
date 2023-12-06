import path from "path";
import {TextDecoder} from "util";
import {Identity, Signer, signers} from "@hyperledger/fabric-gateway";
import {promises as fs} from "fs";
import {
    certPath,
    chaincodeName,
    channelName, cryptoPath,
    keyDirectoryPath,
    mspId,
    peerEndpoint,
    peerHostAlias,
    tlsCertPath
} from "./configs";
import * as grpc from "@grpc/grpc-js";
import crypto from "crypto";

/**
 * envOrDefault() will return the value of an environment variable, or a default value if the variable is undefined.
 */
export const envOrDefault = (key: string, defaultValue: string): string => {
    return process.env[key] || defaultValue;
}

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

/**
 * displayInputParameters() will print the global scope parameters used by the main driver routine.
 */
export const displayInputParameters = async (): Promise<void> => {
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