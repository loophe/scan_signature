const {web3Ws} = require('./providerWs.js')
const {getCode} = require('./getCode.js')
// const { selectorsFromBytecode } = require('@shazow/whatsabi');

var JaguarDb = require('./lib/jaguarDb').JaguarDb;
var options = {logging: false};
var db = new JaguarDb(options);

const fs = require('fs')
const path = require('path')

const { isTheSig } = require('./isTheSig.js')
// const { estimateGas } = require('./estimateGas');
// const { simulate } = require('./simulate.js');
// require('dotenv').config()

function pending(sig,n){

  db.connect(sig,n, function(err) {

    if(err) {
        console.log('Could not connect: ' + err);
        return;
    }
    else{
      console.log(`JaguarDb ${db.dbPath}/table${n}.json connected!`);
      fs.readFile(path.join(sig,`table${n}.json`), function(err, data) {
        if(err){
          console.log(err)
        }
        else
        {      
          const dataArr = JSON.parse(data)
          // console.log(db.indexData)
          var i = true 
          // console.log(dataArr.length)
          var subscription = web3Ws.eth.subscribe('pendingTransactions', async function(error, result){
          
            if(!error && i){
              console.log(`Scubscribe 0x${n}... succesfully!\nSubscription Id:`,subscription.id)
              i = false;//Log only once.
            }
            if (error){
              console.log(error);
              console.log('Reconnection to Robot.')
            }
          }).on("data", async function (transactionHash) {
    
            let transaction = await web3Ws.eth.getTransaction(transactionHash);
            if (transaction != null && transaction.to != null ){
              let toAddress = sliceAddress(transaction.to)
              let nString = n.toString()
              if (toAddress === nString ){             
                let isAddress = writeTable(sig, dataArr, transaction.to, n)
                // console.log(db.indexFile)
                // let isAddress = db.update(db, transaction.to)
                if (isAddress){
                  const sigArry = await getCode(transaction.to)
                  // console.log(sigArry[0], typeof(sigArry))
                  if (typeof(sigArry) === 'object' && isTheSig(sigArry,transaction.to)){
                    console.log('Found address :'+transaction.to)
                    // estimateGas(transaction.to)
                    // simulate(transaction.to)
                  }
                }
              }   
            }       
          })
        }
      })  
    }    
  });
} 

function writeTable(folder, dataArr, string, n){
  let isAdded = IsInArray( dataArr, string)
  if ( !isAdded ){
    dataArr.push(string)
    var content = JSON.stringify(dataArr)
    fs.writeFile(`${folder}/table${n}.json`, content, err => {
      if (err) {
        console.error(err)
        return false
      }        
    }) 
    return true
  }else{return false} 
}

function IsInArray(arr,val){
  var testStr=','+arr.join(",")+",";
  return testStr.indexOf(","+val+",")!=-1;
}

function sliceAddress(address){
    return address.substring(2, 3)
}


module.exports = {
  pending
}

// pending('./_tables', '4')