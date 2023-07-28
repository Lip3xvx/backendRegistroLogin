const express = require('express')

const dotenv = require ('dotenv')

require('dotenv').config()

const path = require ('path')

const cookieParser =require('cookie-parser')


const router = require('./routes/router')

const app = express()

app.set('view engine', 'ejs');

app.set('views' , path.join(__dirname, 'views'));

//seteo carpeta public para archivos estaticos

app.use(express.static('public'))

//procesador de datos enviados desde formularios

app.use(express.urlencoded({extended: true}))
app.use(express.json())

//seteo de variables de entorno

dotenv.config({path: './env/env'})

//cookies

app.use(cookieParser()); 

app.use('/', router);

/* app.get('/', (req,res) =>{
    res.render('index')
}) */


app.listen(4200, ()=>{
    console.log('SERVER UP running in http://localhost:4200/ ')
})