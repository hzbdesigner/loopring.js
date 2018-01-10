// require('babel-polyfill')
import * as apis from './common/apis'
import * as abis from './common/abis'
import Transaction from './transaction'
import Loopring from './index'


function testLoopring(){
	new Loopring('https://relay1.loopring.io/rpc')
	console.log('LOOPRING_PROVIDER_HOST',LOOPRING_PROVIDER_HOST)
}

testLoopring()


let payload = {}
let address = '0xebA7136A36DA0F5e16c6bDBC739c716Bb5B65a00'
let amount = '1000'
let tag = 'latest'


// testApi()
function testAbi(){
	let result = abis.generateApproveData(address,amount)
	console.log('abis.generateApproveData result',result)
}

testApi()
function testApi(){
	apis.getTransactionCount(address,tag).then(res=>{
	  // console.log("getTransactionCount res",res)
	})

	let signedTx_hex = '0x0101010'
	apis.sendRawTransaction(signedTx_hex).then(res=>{
	  // console.log("sendRawTransaction res",res)
	})
}

async function testModel(){
	payload = {
		to:'0xebA7136A36DA0F5e16c6bDBC739c716Bb5B65a00',
		value:'111',
		gasPrice:'111',
		gasLimit:'111',
	}
	let tx = new Transaction(payload)
	console.log('tx',tx)
	
	payload = {
		method:'approve',
		address,	
		amount,
	}
	tx.setData(payload)
	console.log('tx.data',tx.getTx().data)
	await tx.setNonce(address,tag)
	console.log('tx.nonce',tx.getTx().nonce)
	await tx.sign()
	console.log('tx.signed',tx.getTx().signed)
	const res = await tx.send()
}

// testModel()








// import Schema from 'async-validator'

// const schema = new Schema({
//   name: {
//     type: 'number',
//     validator(rule,value,cb){
//       console.log('value',value)
//       cb(false)
//     }
//   }
// })

// schema.validate({
//   name: 'hello',
// }, (errors, fields) => {
//   console.log('errors',errors)
//   console.log('fields',fields)
// })