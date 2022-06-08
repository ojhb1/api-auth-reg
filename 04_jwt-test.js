'use strict'

const TokenServic = require('./services/token.service');
const moment = require('moment');

const miPass = "miContraseña";
const badPass = "miOtraContraseña";
const usuario = {
    _id:'123456789',
    email:'ojhb1@alu.ua.es',
    password: miPass,
    signUpDate: moment().unix(),
    lastLogin: moment().unix()
};

console.log(usuario);

const token = TokenServic.creaToken(usuario);


//console.log(token);


TokenServic.decodificaToken(token)
.then(userId =>{
    return console.log(`ID1: ${userId}`);
})
.catch(err => console.log(err));

const badToken = 'dhfdfdhfg37g3g07rg4rg8fg084730y374y0HDBOHBDFY747494y579444795748479874589745894754cffv'
TokenServic.decodificaToken(badToken)
.then(userId =>{
    return console.log(`ID2: ${userId}`);
})
.catch(err => console.log(err));