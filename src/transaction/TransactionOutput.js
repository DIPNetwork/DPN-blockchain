const {EventEmitter} = require('events')
const util = require('../utils/EncryptUtil')

class TransactionOutput extends EventEmitter{
    constructor(reciepientPublicKey,value,parentTransactionId){
        super()
        this.reciepientPublicKey = reciepientPublicKey
        this.value = value
        this.parentTransactionId = parentTransactionId
        this.id = util.keccak256(reciepientPublicKey.toString('hex') + value + parentTransactionId)
    }

    isMine(publicKey){// if the output list is yours?
        return (publicKey === this.reciepientPublicKey)
    }
}

module.exports = TransactionOutput