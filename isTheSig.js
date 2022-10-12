const {web3Ws} = require('./providerWs.js')
const { simulate } = require('./simulate.js')

function isTheSig(arr,address){
    const hash1 = web3Ws.eth.abi.encodeFunctionSignature('_transfer(address,address,uint256)')
    const hash2 = web3Ws.eth.abi.encodeFunctionSignature('_approve(address,uint256,address)')
    const hash3 = web3Ws.eth.abi.encodeFunctionSignature('_mint(address,uint256)')
    const _mintAbi = {
        "inputs":[
            {                
                "name":"",
                "type":"address"
            },
            {
                "name":"",
                "type":"uint256"
            }
        ],
        "name":"_mint"    
    }
    // const _transferAbi = {
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
    //     "name":"_transfer"
    // }
    // const hash = web3Ws.eth.abi.encodeFunctionSignature(ABI[0])
    // console.log(hash)
    // return hash
    if(isInArray(arr, hash1)){ 
        console.log('_transfer()')        
        return true 
    }
    if(isInArray(arr, hash2)){
        console.log('_approve()')
        return true
    }  
    if(isInArray(arr, hash3)){          
        console.log('_mint()')
        simulate(address,_mintAbi)
        return true
    } 
    return false 
}

function isInArray(arr,val){
    var testStr=','+arr.join(",")+",";
    return testStr.indexOf(","+val+",")!=-1;
}

module.exports = {
    isTheSig
}