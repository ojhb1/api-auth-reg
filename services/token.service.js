'use strict'
//Header (Esto solo funciona con el formato jwt)

/*{
  "alg": "HS256",
  "typ": "JWT"

  //PayLoad
/*{
    "sub": "1234567890",
    "name": "John Doe",
    "iat": 1516239022
  }*/
//Verify Signature 


 /* HMACSHA256(
    base64UrlEncode(header) + "." +
    base64UrlEncode(payload),
    
  ) */

  /*El token generado en este fomrato es:

  
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3
  ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Sfl
  KxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

  */
const jwt = require('jwt-simple');

const moment = require('moment');


const SECRET = require('../config').secret;

const EXP_TIME = require('../config').tokenExpTmp;

function creaToken(user){
    const payload={
        sub:user._id,
        iat: moment().unix(),
        exp: moment().add(EXP_TIME,'minutes').unix()
    }
    return jwt.encode(payload,SECRET);
}

function decodificaToken(token){
    return new Promise((resolve,reject)=>{
        try{
            const payload= jwt.decode(token,SECRET,true);
            if(payload.exp<=moment().unix()){
                reject({
                    status: 401,
                    messge: 'El token ha caducado'
                });
                console.log(payload);
                resolve(payload.sub);
            }
        }catch{
            reject({
                status:500,
                messge: 'El token no es valido'
            });
        }
    })
}

module.exports={
    creaToken,
    decodificaToken
}