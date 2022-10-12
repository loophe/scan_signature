const {web3Ws} = require('./providerWs.js')
const ABI = require('./myContractABI.json')
// const transferOwnershipABI = require('./ABI.json')

async function simulate(address,abi){
    const myAddress  =  '0x6113d6ecc7414437533568c803acfd477b7d800a'
    const owner = '0x08908a69D3Ff4C42DcF5ddA856e25f3602e7f37A'
    const myContract = new web3Ws.eth.Contract(ABI,myAddress)
    const amount = '123'
    const callData = web3Ws.eth.abi.encodeFunctionCall(abi, [owner,amount])
    // console.log(callData)
    const res = await myContract.methods.sim(address,callData).call()
    if (res[0]){
        console.log('Attack it!', address)
    }else{
        console.log('Not what we need...')
    }
    // console.log(res[0])
}
module.exports = {
    simulate
}
// simulate('0x3F4fA26f8a54F67db5d584bedA8e196B8D2AAe7e',{
//     "inputs":[
//         {                
//             "name":"",
//             "type":"address"
//         },
//         {
//             "name":"",
//             "type":"uint256"
//         }
//     ],
//     "name":"_mint"
// })