var path = require('path');
var fs = require('fs');

var JaguarDb = function(options) {
    this.dbPath = null;
    this.indexFile = null;
    this.indexData = [];//Modified!
    this.log = function(message) {};
  
    if(options != null && options.logging === true) {
      this.log = function(message) {
        console.log('jaguarDb: %s', message);
      }
    }
}  
  
  // ----------------------------------
  // Connect to a database
  // ----------------------------------
JaguarDb.prototype.connect = function(dbPath,i, cb) {
    // this.log('Connecting to: ' + dbPath);
    this.dbPath = dbPath;     
    this.indexFile = path.join(this.dbPath, `table${i}.json`);
    var _this = this;    
    // Check if the path exists and it's indeed a directory.
    fs.stat(dbPath, function(err, stat) {
      if (err) {
        if(err.code == 'ENOENT') {
          _this.log('Creating directory ' + _this.dbPath)
          try{
            fs.mkdirSync(_this.dbPath);  // FYI: blocking call
          }catch(e){}          
        }
        else {
          cb(err);
          return;
        }     
      }
      else {
        if(!stat.isDirectory()) {
          cb(_this.dbPath + " exists but it's not a folder!");
          return;
        }
      }  
      _this._loadIndexData(_this, cb, i);
    });
}  
  
// Internal method.
// Loads the "index.json" file to memory.
JaguarDb.prototype._loadIndexData = function(_this, cb, i) {
    fs.exists(`${_this.dbPath}/table${i}.json`, function(exists) {
      if (exists) {  
        fs.readFile(`${_this.dbPath}/table${i}.json`, function(err, data) {
          if(err) {
            _this.log('Index file already exists, but could not be read.');
            cb(err);
          }
          else {
            _this.log('Index file read');
            // _this.indexData = JSON.parse(data);
            cb(null);
          }
        });  
      }
      else {  
        // create index file   
        _this.log('Creating index file: ' + `table${i}.json`);
        fs.writeFile(`${_this.dbPath}/table${i}.json`, JSON.stringify(_this.indexData), function(err) {
          if (err) {
            _this.log('ERROR', 'Could not create index file. Error: ' + err);
            cb(err);
          }
          else {
            _this.log('Index file created');
            cb(null);
          }
        }); 
      }
    });
}
//
// External method.
// Write the address string to "index.json" file if not existing in file.
// JaguarDb.prototype.update = function (_this,string, i){  
//   let isAdded = IsInArray( _this.indexData, string)
//   if ( !isAdded ){
//     _this.indexData.push(string)

//     var content = JSON.stringify(_this.indexData)

//     fs.writeFile(_this.indexFile, content, err => {
//       if (err) {
//         console.error(err)
//         return false
//       }        
//     }) 
//     return true
//   }else{return false}  
// }


  
exports.JaguarDb = JaguarDb;