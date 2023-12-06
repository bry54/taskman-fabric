import path from "path";
import {TextDecoder} from "util";

/**
 * envOrDefault() will return the value of an environment variable, or a default value if the variable is undefined.
 */
export const envOrDefault = (key: string, defaultValue: string): string => {
    return process.env[key] || defaultValue;
}

export const channelName = envOrDefault('CHANNEL_NAME', 'mychannel');

export const chaincodeName = envOrDefault('CHAINCODE_NAME', 'taskmanager');

export const mspId = envOrDefault('MSP_ID', 'Org1MSP');

// Path to crypto materials.
export const cryptoPath = envOrDefault('CRYPTO_PATH', path.resolve(__dirname, '..', '..', 'emulator','test-network', 'organizations', 'peerOrganizations', 'org1.example.com'));

// Path to user private key directory.
export const keyDirectoryPath = envOrDefault('KEY_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore'));

// Path to user certificate.
export const certPath = envOrDefault('CERT_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts', 'User1@org1.example.com-cert.pem'));

// Path to peer tls certificate.
export const tlsCertPath = envOrDefault('TLS_CERT_PATH', path.resolve(cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt'));

// Gateway peer endpoint.
export const peerEndpoint = envOrDefault('PEER_ENDPOINT', 'localhost:7051');

// Gateway peer SSL host name override.
export const peerHostAlias = envOrDefault('PEER_HOST_ALIAS', 'peer0.org1.example.com');

export const utf8Decoder = new TextDecoder();