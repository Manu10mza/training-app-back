const CryptoJS = require('crypto-js');


//Estas funciones sirven para encriptar cualquier dato y viceversa
const encrypt = (data)=>{
      const dataCrypt = CryptoJS.AES.encrypt(data, process.env.PASSWORD_KEY).toString()
      return dataCrypt;
}
const decrypt = (data)=>{
      const dataDecrypt = CryptoJS.AES.decrypt(data, process.env.PASSWORD_KEY).toString(CryptoJS.enc.Utf8);
      return dataDecrypt;
}

module.exports = {
      encrypt,
      decrypt
}