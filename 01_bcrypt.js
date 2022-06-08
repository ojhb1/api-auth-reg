'use strict'

const bcrypt = require('bcrypt');

const miPass = "miContraseña";
const badPass = "miOtraContraseña";

bcrypt.genSalt(10,(err,salt)=>{
    console.log(`Salt 1: ${salt}`);
    bcrypt.hash(miPass,salt,(err,hash)=>{
        if(err) console.log(err);
        else console.log(`hash 1: ${hash}`);
    });
});

bcrypt.hash(miPass,10,(err,hash)=>{
    if(err) console.log(err);
    else {
        console.log(`Hash 2: ${hash}`);
        bcrypt.compare(miPass,hash,(err,result)=>{
            console.log(`Result 2.1: ${result}`);
        });
        bcrypt.compare(miPass,badPass,(err,result)=>{
            console.log(`Result 2.2: ${result}`);
        })
    }
});
