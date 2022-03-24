'use strict'
var http = require('http');
const port = process.env.PORT || 3000;
const express = require('express');
const logger = require('morgan');
const app = express();

app.use(logger('dev')); 

http.createServer( (request, response) => {
response.writeHead(200, {'Content-Type': 'text/plain'});
response.end('Hola a todas y a todos!\n');
}).listen(8080);

app.get('/hola/:unNombre', (req, res) => {
    res.status(200).send({ mensaje: `Hola ${req.params.unNombre} desde SD!` });
    });
app.listen(port, () => {
    console.log(`API REST ejecutándose en http://localhost:${port}/hola/:unNombre`);
    });