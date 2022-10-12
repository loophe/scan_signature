const { selectorsFromBytecode } = require('@shazow/whatsabi');
const {web3Ws} = require('./providerWs.js')

async function getCode(address){
    const byte_code = await web3Ws.eth.getCode(address)
    const code = byte_code.substring(0,12)
    // console.log(code+'...')
    if(code === '0x6080604052'){
      const selectors = selectorsFromBytecode(byte_code); // Get the callable selectors
      // console.log(selectors);
      return selectors
    }  
}
module.exports = {
    getCode
}

// getCode('0xe7ed52F82C0cb36673E0Ae3790d0Eb65d639B5Fa')