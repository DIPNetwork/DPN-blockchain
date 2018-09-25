const {EventEmitter} = require('events')

class TransactionInput extends EventEmitter{
    constructor(transactionOutputId){
        super()
        this.transactionOutputId = transactionOutputId
        this.UTXO = null
    }
}

module.exports = TransactionInput