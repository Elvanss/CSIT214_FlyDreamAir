import express from 'express';
import path, { dirname } from 'path';

const __dirname = path.resolve();

const configViewEngine = (app) => {
    app.use(express.static('./src/public'))   
    app.use(express.static('./src/views'))
    app.set("views", "./src/views")
    app.use(express.static('public'));
    app.use(express.static(__dirname));


}

export default configViewEngine;