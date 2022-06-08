'use strict'

const port = process.env.PORT || 3000;

const moment = require('moment');
const TokenService = require('./services/token.service');
const PassService = require('./services/pass.service.js');

const https = require('https'); 
const fs = require('fs');    

const OPTIONS_HTTPS = { 
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem')
};

// Poner en el postman en vez de token -> Authorization y en vez de password1234 -> Bear JWT

const cors = require('cors');
const express = require('express');
const mongojs = require('mongojs');
const { defaultConfiguration } = require('express/lib/application');
const logger = require('morgan');
const req = require('express/lib/request');

const app = express();

var helmet = require('helmet');

var allowMethods = (req, res, next) => {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    return next();
};                      // tanto esta variable como la de abajo aparecerán en los headers
                        // de la respuesta de las solicitudes hechas en el postman
var allowCrossTokenHeader= (req, res, next) => {
    res.header("Access-Control-Allow-Headers", "token");
    return next();
};

function auth (req, res, next) { 
    
   const jwt = req.headers.authorization.split(' ')[1]; 
   TokenService.decodificaToken(jwt)
   .then (userId =>{
       req.user = {
           id :userId,
           token : jwt
       }
       return next();
   })
    .catch (err =>
        res.status(400).json({
            result: 'Error',
            msg: err
        })
        );
    
}
var db = mongojs("SD");         
var id = mongojs.ObjectID;      

//middlewares
app.use(helmet());
app.use(cors());
app.use(allowCrossTokenHeader);
app.use(allowMethods);

app.use(logger('dev'));        
app.use(express.urlencoded({extended:false})) 
app.use(express.json())         

/*
app.get('/api/user', (req, res, next) => {
    console.log('GET /api/user');//Estas cosas salen en la terminal 
    console.log(req.params); // cuando ejecutamos el npm start
    console.log(db.users);

    db.getCollectionNames((err, colecciones) => {
      if (err) return next(err);
     res.json(colecciones);
    });
});
*/
app.get('/api/user', (req, res, next) => {
    db.user.find((err, user) => {   
        if (err) return next(err);           
        res.json(user);
    });
});
   

app.get('/api/user/:id', (req, res, next) => {
    db.user.findOne({_id: id(req.params.id)}, (err, usuario) => {
        if (err) return next(err);
        res.json(usuario); //Para sacar un elemento concreto
    });
});

app.post('/api/user', (req, res, next) => {
    const usuario = req.body;
    if (!usuario.nombre) {
        res.status(400).json ({
        error: 'Bad data',
        description: 'Se precisa al menos un campo <nombre>'
         });
    } 
    else if(!usuario.pass){
        res.status(400).json ({
            error: 'Bad data',
            description: 'Se precisa al menos un campo <pass>'
             });
    }
    else if(!usuario.email){
        res.status(400).json ({
            error: 'Bad data',
            description: 'Se precisa al menos un campo <email>'
             });
    }
    else {
        db.user.save(usuario, (err, usuarioGuardado) => {
            if(err) return next(err);
            res.json(usuarioGuardado);
        });
    }
});

app.put('/api/user/:id', (req, res, next) => {        
    let elementoId = req.params.id;        
    let elementoNuevo = req.body;          
    db.user.update({_id: id(elementoId)},  
            {$set: elementoNuevo}, 
            {safe: true, multi: false}, 
            (err, elementoModif) => {
        if (err) return next(err);
        res.json(elementoModif);
    });
});

app.delete('/api/user/:id', (req, res, next) => {
    let elementoId = req.params.id;

    db.user.remove({_id: id(elementoId)}, (err, resultado) => {
        if (err) return next(err);
        res.json(resultado);
    });
});

app.delete('/api/borrar/', (req, res, next) => {
    db.comida.drop((err, resultado) => {
        if (err) return next(err);
        res.json(resultado);
    });
});

app.get('/api/auth', (req, res, next) => {
    db.user.find({lastLogin:{$exists: true}}, (err, user) => {  
        if (err) return next(err);         
        res.json(user);
    });
});
   
app.get('/api/auth/me', auth, (req, res, next) => {
  
    db.user.findOne({email : req.email}, (err, usuario) => {
        if (err) return next(err);
        res.json(usuario); //Para sacar un elemento concreto
    });
});

app.post('/api/auth', (req, res, next) => {
    const elemento = req.body;
    if (!elemento.email) {
        res.status(400).json ({
            error: 'Bad data',
            description: 'Se precisa al menos un email'
        });
    } else if (!elemento.pass) {
        res.status(400).json ({
               error: 'Bad data',
               description: 'Se precisa al menos un pass'
           });
    } else {
        db.user.findOne({email: (elemento.email)}, (err, usuario) =>{
            if (err) return next(err);
            if(!usuario) {
                res.status(400).json({error:'User not Found',
                description:'El usuario no existe'});
                } 
            else {
                PassService.encriptaPassword(elemento.pass)
                .then( hash => {
                    db.user.update({"email" : elemento.email}, 
                    {$set : {lastLogin: moment().unix()}}, 
                    (err, usuarioGuardado) => {
                    if(err) return next(err);
                        const token = TokenService.creaToken(usuarioGuardado);
                        res.json({
                            result: 'OK',
                            token: token,
                            usuarios: usuario
                            
                        });
                    });
                });
            }
        });
    }
});

app.post('/api/auth/reg', (req, res, next) => {
    const elemento = req.body;
    
    if (!elemento.nombre) {
        res.status(400).json ({
            error: 'Bad data',
            description: 'Se precisa al menos un nombre'
        });
    } else if (!elemento.email) {
        res.status(400).json ({
            error: 'Bad data',
            description: 'Se precisa al menos un email'
        });
    } else if (!elemento.pass) {
        res.status(400).json ({
            error: 'Bad data',
            description: 'Se precisa al menos un pass'
        });
    } else {
        db.user.findOne({email: (elemento.email)}, (err, usuario) =>
            { 
            console.log(req.params.id);
            console.log(usuario);
            if (err) return next(err);
            if(usuario) {// si este usuario está ya registrado:
                res.status(400).json({error:'User Found',
                description:'El usuario ya existe'});
            } 
            else  {// si no:
                PassService.encriptaPassword(elemento.pass)
                .then( hash => {
                    const nuevoUsuario = {
                        email: elemento.email,
                        pass: hash,
                        nombre: elemento.nombre,
                        fechaAlta: moment().unix(),
                        lastLogin: moment().unix()
                    }
                    // para guardar en la base de datos
                    db.user.save(nuevoUsuario, (err, usuarioGuardado) => {
                        if(err) return next(err);
                        const token = TokenService.creaToken(usuarioGuardado);
                        res.json({
                            result: 'OK',
                            token: token,
                            usuarios: usuarioGuardado
                        });
                    });
                });
            }
        });
       
    }
});


// Iniciamos la aplicación

https.createServer( OPTIONS_HTTPS, app).listen(port, () => {
    console.log(`SEC WS API REST ejecutándose con DB en http://localhost:${port}/api/:coleccion/:id`);
}); 