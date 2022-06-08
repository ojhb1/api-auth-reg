'use strict'

const bcrypt = require('bcrypt');

function encriptaPassword(password){
    return bcrypt.hash(password,10);
}

function comparaPassword(password,hash){
    return bcrypt.compare(password,hash);
}

module.exports = {
    encriptaPassword,
    comparaPassword
};