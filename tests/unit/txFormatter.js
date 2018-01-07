import * as apis from '../../2.0/common/apis'
import * as abis from '../../2.0/common/abis'
import Transaction from '../../2.0/transaction'
import utils from './utils'

const approveTxInput = {
	// token,
	// amount,
}
const transferTxInput = {
	// address,
	// gasLimit,
	// amount,
	// token,
	// data,
}
const convertTxInput = {
	// fromToken,
	// gasLimit,
	// amount,
}
const cancelOrderInput = {
	// signedOrder
}
const cancelAllOrdersInput = {
	// empaty object
}

const inputTx = approveTxInput || transferTxInput || convertTxInput || cancelOrderInput || cancelAllOrdersInput
const type = 'approve' || 'approveCancel' || 'transfer' || 'convert' || 'cancelOrder' || 'cancelAllOrders'

export default class txFormatter {
  constructor(type,inputTx) {
  	this.type=type
  	this.input=inputTx
  	this.raw={}
  	this.raws=[]
		this.setToken()
		this.setGasLimit()
		this.setGasPrice()
		this.setTo()
		this.setValue()
		this.setData()
		this.setUI()
		this.setRaws()
  }
  setToken(){
  	if(this.type === 'convert'){
  		this.token = utils.getTokenByName('WETH') // token.address , token.name  , token.digits, token.allowance
  	}
  	if(this.input.token){
  		this.token = this.input.token
  	}
  }
  setGasLimit(){
  	const gasLimit = this.input.gasLimit || 8400  // TO CONFIRM
  	this.raw.gasLimit = utils.getGasLimit()  
  }
  setGasPrice(){
  	this.raw.gasPrice = utils.getGasPrice() 
  }
  setTo(){
  	const token = this.token
  	const address = this.input.address
  	if(this.type === 'approve' || this.type === 'convert' || this.type === 'approveCancel'){
  		this.raw.to = token.address	 // token address
  	}
  	if(this.type === 'transfer'){
  		if(token.name ===' ETH'){ 
  			this.raw.to = address  // user address
  		}else{
  			this.raw.to = token.address
  		}
  	}
  	if(this.type ==== ('cancelOrder' || 'cancelAllOrders') ){
  		this.raw.to = utils.getContractAddress() // TO CONFIRM: loopring contract address 
  	}
  }
  setValue(){
  	if(this.type === ('approve' || 'approveCancel' || 'cancelOrder' || 'cancelAllOrders')){
  		this.raw.value = utils.getAmount(0)
  	}
  	if(this.type === ('transfer' || 'convert')){
  		if(token.name==='ETH'){
  			this.raw.value = utils.getAmount(amount)
  		}else{
  			this.raw.value = utils.getAmount(0)
  		}
  	}
  }
  setData(){
  	const digits = this.token.digits
  	const amount = this.amount && utils.getAmount(this.amount,digits)

  	if(this.type === 'approve'){
  		const spender = utils.getDelegateAddress()
  		this.raw.data = abis.generateTransferData(spender, amount)
  		if(token.allowance >0 ){
  			const cancelRawTx = {...this.raw}
  			cancelRawTx.data = abis.generateTransferData(spender, '0x0')
  			this.raws.push(cancelRawTx)
  		}
  	}
  	if(this.type === 'transfer'){
  		const address = this.address // user address ,not token address
  		if(token.name==='ETH'){
  			this.raw.data = data || '0x'
  		}else{
  			this.raw.data = abis.generateTransferData(address, amount) 
  		}
  	}
  	if(this.type === 'convert'){
  		if(fromToken === 'ETH'){
  			this.raw.data = '0xd0e30db0' 
  		}else{
  			this.raw.data = abis.generateWithdrawData(amount)
  		}
  	}
  	if(this.type === 'cancelOrder'){
  		const signedOrder = this.input.signedOrder
  		this.raw.data = abis.generateCancelOrderData(signedOrder)
  	}
  	if(this.type === 'cancelAllOrders'){
  		const timestamp = utils.toHex(Date.parse(new Date()) / 1000)
  		this.raw.data = abis.generateCutOffData(timestamp)
  	}
  }
  setRaws(){
  	this.raws.push(this.raw)
  }

}

// const WETHConfig = this.appConfig.tokenMap['WETH'];
// convertTx.data = '0xd0e30db0';
// convertTx.gasPrice = gasPrice;
// convertTx.gasLimit = gasLimit;
// convertTx.to = WETHConfig.address;
// const value = Number(this.buyAmount) * this.buyPrice - this.tokenbBalance ;
// convertTx.value = '0x' + new BigNumber(Number('1e' + WETHConfig.digits)).times(value.toString(10)).toString(16);
// const subTitle = 'Convert ETH to  WETH';
// const description = 'Convert ' + Math.floor((Number(this.buyAmount) * this.buyPrice - this.tokenbBalance) * Number('1e'+this.eth.precision))/ Number('1e'+this.eth.precision) + ' ETH to WETH with gas is ' + Number(convertTx.gasLimit) + ' and gasPrice  is ' + Number(convertTx.gasPrice) / 1e9 + 'Gwei';
// raws.push({
//     "raw": JSON.stringify(convertTx),
//     "subTitle": subTitle,
//     "description": description
// });