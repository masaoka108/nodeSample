var passowrd = 'passw0rd';
var crypto = require("crypto");

module.exports = {

  // 暗号化(AES192)
  getCiphered: function (password) {
    console.log("password:" + password);


    var planeText = password;
    var passowrd = 'passw0rd';

    // console.log('暗号化するテキスト : ' + planeText);
    // console.log('暗号化キー        : ' + passowrd);

    // 暗号化
    var cipher = crypto.createCipher('aes192', passowrd);
    cipher.update(planeText, 'utf8', 'hex');
    var cipheredText = cipher.final('hex');

    // console.log('暗号化(AES192) :');
    // console.log(cipheredText);

    return cipheredText;
  },
  // 復号化(AES192)
  getDeciphered: function (cipheredText) {
    var decipher = crypto.createDecipher('aes192', passowrd);
    decipher.update(cipheredText, 'hex', 'utf8');
    var dec = decipher.final('utf8');

    // console.log('復号化(AES192) : ');
    // console.log(dec);

    return dec
  }



}
