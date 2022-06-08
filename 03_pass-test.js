'use strict'

const PassSservice = require('./services/pass.service');
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

PassSservice.encriptaPassword(usuario.password)
.then(
    hash=>{
        usuario.password = hash;
        console.log(usuario);
        PassSservice.comparaPassword(miPass, usuario.password)
        .then(
            isOk=>{
                if(isOk)
                    console.log('p1: El pass es correcto')
                else
                    console.log('p1: El pass no es correcto')

            
        })
        .catch(err=> console.log(err));

        PassSservice.comparaPassword(badPass, usuario.password)
        .then(
            isOk=>{
                if(isOk)
                    console.log('p2: El pass es correcto')
                else
                    console.log('p2: El pass no es correcto')

            
        })
        .catch(err=> console.log(err));
});