# api-auth-reg

# Backend CRUD API REST

_Ejemplo de WS REST con NodeJS que proporciona un API CRUD para gestionar una DB MongoDB._

-Primero de todo comenzaremos con instalarnos mongodb
-Posterior a esto crearemos un servicio CRUD(Crear,Leer,Actualizar,Eliminar) mediante API REStful y MongoDb
-Y por ultimo probaremos el nuevo servicio creado.

## Comenzando 馃殌

_Estas instrucciones te permitir谩n obtener una copia del proyecto en funcionamiento en tu m谩quina local para prop贸sitos de desarrollo y pruebas._


Ver **Deployment** para conocer c贸mo desplegar el proyecto.


### Pre-requisitos 馃搵

_Qu茅 cosas necesitas para instalar el software y c贸mo instalarlas_

Antes de todo necesitaras tener un repositorio creado ya sea en github o en bitbucket para poder continuar e implementar
adecuadamente una base de datos.

Una vez que ya tenemos una cuenta procederemos a instalar el nodemon para ir actualizando el repositorio sin tener que estar actualizandolo constantemente

$ npm i -D nodemon

Utilizando nuestro editor (recomendacion Visual Studio Code)incluimos una l铆nea (resaltada en negrita: "start": "nodemon index.js",) en la secci贸n scripts del archivo package.json para crear un script de inicio que invoque nodemon

El comando para poner en marcha el index.js ser谩:

$ npm start

Se sustituye este nuevo comando por el antiguo ya node index.js

Ahora procederemos con la instalacion de morgan 

$ npm i -S morgan

Gracias a morgan tendremos mas informacion sobre lo que esta ocurriendo cuando realizemos las operaciones de CRUD o cualquier otro tipo de accion.


Por ultimo utilizaremos postman para las operaciones CRUD para ello ser谩 necesario crearse una cuenta y vincularla con nuestro 
repositorio remoto, utilizando postman crearemos distintas colecciones para llevar a cabo las operaciones de CRUD.


Proporciona un ejemplo
```

### Instalaci贸n 馃敡

Primero procederemos a instalar mongodb con las siguientes instrucciones:

$ sudo apt update
$ sudo apt install -y mongodb

Los comandos basicos de mongo los podremos utilizar con "systemctl" lo que nos quedaria el siguiente comando

$ sudo systemctl start mongodb

Para verificar si mongo esta funcionando correctamente usaremos:

$ mongo --eval 'db.runCommand({ connectionStatus: 1 })'

Finalmente, en otra terminal podemos abrir el gestor de la base de datos (cliente mongo) y probar
directamente desde la terminal comandos para gestionarla

$ mongo --host 127.0.0.1:27017
> show dbs

Ahora tendremos que instalar el cliente de mongo en nuestra carpeta proyecto

$ cd
$ cd node/api-rest
$ npm i -S mongodb
$ npm i -S mongojs

En este caso utilizaremos la libreria de mongojs

Una vez al haber instalado mongojs lo iniciaremos, al igual que nuestro api-rest.
Para aumentar la seguridad de nuestro api tendremos que implementar varias funciones, en este caso
implementaremos un sistema que os permita crear tokens con una fecha de caducidad para asi gestionar 
de una mejor manera a los usuarios de nuestro api.
Para ello primero tendremos que instalarnos jwt en nuestro entorno de desarrollo, ya que utilizaremos esta libreria
para crear los tokens.
A continuacion pondr茅 un ejemplo de una de las infinitas funciones que existen para crear un token:

function creaToken(user){
    const payload={
        sub:user._id,
        iat: moment().unix(),
        exp: moment().add(EXP_TIME,'minutes').unix()
    }
    return jwt.encode(payload,SECRET);
}

Para descodificar un token implementaremos la siguiente funcion:

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
La funcion descodificatoken recibe por parametro un token, primero de todo haremos una comprobacion con try catch para ver si el token
efectivamente es valido, si no lo es le enviaremos un mensaje al usuario, si el token es valido utilizaremos una funcion de jwt que se llama "decode" para descodificarlo y posteriormente comprobaremos si ha caducado o aun no, si ha caducado le enviaremos un mensaje al usuario

Las funciones anteriores las podemos realizar en un nuevo archivo js y exportarlos pero tambien se puede realizar en el index.js


## Ejecutando las pruebas 鈿欙笍

Para ejecutar las pruebas iremos a postman y crearemos distintas colecciones con get,delete,put y post, iniciaremos con el comando:

$ npm start

Y procederemos a utilizar los comandos anteriormente mencionados en el Postman

### Analice las pruebas end-to-end 馃敥

_Explica qu茅 verifican estas pruebas y por qu茅_

```
El servicio tendr谩 dos tipos de rutas o endpoints: los destinados a gestionar el registro y la DB de
usuarios (/api/user) y los destinados a gestionar la autorizaci贸n (/api/auth).

GET /api/user Obtenemos todos los usuarios registrados en el sistema.
GET /api/user/{id} Obtenemos el usuario indicado en {id}.
POST /api/user Registramos un nuevo usuario con toda su informaci贸n.
PUT /api/user/{id} Modificamos el usuario {id}.
DELETE /api/user/{id} Eliminamos el usuario {id}.

Para gestionar las autorizaciones de los usuarios.

GET /api/auth Obtenemos todos los usuarios registrados en el sistema. Mostramos versi贸n
reducida de GET /api/user.
GET /api/auth/me Obtenemos el usuario a partir de un token v谩lido.
POST /api/auth Realiza una identificaci贸n o login (signIn) y devuelve un token v谩lido.
POST /api/user Realiza un registro m铆nimo (signUp) de un usuario y devuelve un token v谩lido.
```
Estas pruebas verifican que nuestro api-auth-reg funciona correctamente
### Y las pruebas de estilo de codificaci贸n 鈱笍

_Explica qu茅 verifican estas pruebas y por qu茅_

```
Proporciona un ejemplo
```

## Despliegue 馃摝

_Agrega notas adicionales sobre c贸mo hacer deploy_

## Construido con 馃洜锔?

_Menciona las herramientas que utilizaste para crear tu proyecto_

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - El framework web usado
* [Maven](https://maven.apache.org/) - Manejador de dependencias
* [ROME](https://rometools.github.io/rome/) - Usado para generar RSS

## Contribuyendo 馃枃锔?

Por favor lee el [CONTRIBUTING.md](https://gist.github.com/tu/tuProyecto) para detalles de nuestro c贸digo de conducta, y el proceso para enviarnos pull requests.

## Wiki 馃摉

Puedes encontrar mucho m谩s de c贸mo utilizar este proyecto en nuestra [Wiki](https://github.com/tu/proyecto/wiki)

## Versionado 馃搶

Usamos [SemVer](http://semver.org/) para el versionado. Para todas las versiones disponibles, mira los [tags en este repositorio](https://github.com/tu/proyecto/tags).

## Autores 鉁掞笍

_Menciona a todos aquellos que ayudaron a levantar el proyecto desde sus inicios_

* **Paco Maci谩** - *Trabajo Inicial* - [pmacia](https://github.com/pmacia)
* **Omar Hsiba Busquets** - *Documentaci贸n* - [fulanitodetal](#fulanito-de-tal)

Tambi茅n puedes mirar la lista de todos los [contribuyentes](https://github.com/your/project/contributors) qui茅nes han participado en este proyecto. 

## Licencia 馃搫

Este proyecto est谩 bajo la Licencia (Tu Licencia) - mira el archivo [LICENSE.md](LICENSE.md) para detalles

## Expresiones de Gratitud 馃巵

* Comenta a otros sobre este proyecto 馃摙
* Invita una cerveza 馃嵑 o un caf茅 鈽? a alguien del equipo. 
* Da las gracias p煤blicamente 馃.
* etc.