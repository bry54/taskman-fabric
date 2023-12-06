import path from "path";
import {TextDecoder} from "util";
import {envOrDefault} from "./helpers.service";

export const channelName = envOrDefault('CHANNEL_NAME', 'mychannel');

export const chaincodeName = envOrDefault('CHAINCODE_NAME', 'basic');

export const mspId = envOrDefault('MSP_ID', 'Org1MSP');

// Path to crypto materials.
export const cryptoPath = envOrDefault('CRYPTO_PATH', path.resolve(__dirname, '..', '..', 'emulator','test-network', 'organizations', 'peerOrganizations', 'org1.example.com'));

// Path to user private key directory.
export const keyDirectoryPath = envOrDefault('KEY_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore'));

// Path to user certificate.
export const certPath = envOrDefault('CERT_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts', 'cert.pem'));

// Path to peer tls certificate.
export const tlsCertPath = envOrDefault('TLS_CERT_PATH', path.resolve(cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt'));

// Gateway peer endpoint.
export const peerEndpoint = envOrDefault('PEER_ENDPOINT', 'localhost:7051');

// Gateway peer SSL host name override.
export const peerHostAlias = envOrDefault('PEER_HOST_ALIAS', 'peer0.org1.example.com');

export const utf8Decoder = new TextDecoder();