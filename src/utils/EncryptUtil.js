const secp256k1 = require('secp256k1')
const {randomBytes} = require('crypto')
const createKeccakHash = require('keccak')
const NodeRSA = require('node-rsa')

function createKeys() {
    let key = new NodeRSA({b:512})
    let publicKey = key.exportKey('pkcs8-public')
    let privateKey = key.exportKey('pkcs8-private')
    let keyMap = new Map()
    keyMap.set('publicKey',publicKey)
    keyMap.set('privateKey',privateKey)
    return keyMap
}

function signPrivate(privateKey,data) {
    let key = new NodeRSA(privateKey, 'pkcs8-private')
    return key.sign(data,'buffer','buffer')
}

function verifyPublic(publicKey,data,sign) {
    let key = new NodeRSA(publicKey,'pkcs8-public')
    return key.verify(data,sign)
}

function encryptPublickey(publickey,data) {
    let pubKey = new NodeRSA(publicKey,'pkcs8-public')
    return pubKey.encrypt(data, 'buffer','buffer')
}

function decryptPrivate(privateKey,data) {
    let key = new NodeRSA(privateKey,'pkcs8-private')
    return key.decrypt(data,'utf8')
}

function keccak256(input) {
    return createKeccakHash('keccak256').update(input).digest().toString('hex')
}

function genPrivateKey () {
    while (true) {
        const privateKey = randomBytes(32)
        if (secp256k1.privateKeyVerify(privateKey)) return privateKey
    }
}
function getStringByLength(length) {
    let target = '';
    for (let i = 0; i < length; i++) {
        target += '0'
    }
    return target
}
function getMerkleRoot(transactions){
    let count = transactions.length
    let previousTreeLayer = []
    for (let i of transactions){
        previousTreeLayer.push(i.transactionId)
    }
    let treeLayer = []
    while (count > 1){
        for (let i = 1;i<previousTreeLayer.length;i++){
            let key = previousTreeLayer[i-1] +previousTreeLayer[i]
            treeLayer.push( keccak256(key))
        }
        count = treeLayer.length
        previousTreeLayer = treeLayer
    }
    return (treeLayer.length === 1) ? treeLayer[0] : ''

}

module.exports = {
    keccak256,
    getStringByLength,
    genPrivateKey,
    createKeys,
    signPrivate,
    verifyPublic,
    encryptPublickey,
    decryptPrivate,
    getMerkleRoot
}