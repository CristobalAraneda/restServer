const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');


const app = express()

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        // FIXME: eliminar en produccion
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mesasge: '(Usuario) o contraseña incorrectos'
                }
            });
        }
        // FIXME: eliminar en producion
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    mesasge: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDADA_TOKEN });

        res.json({
            ok: true,
            Usuario: usuarioDB,
            token
        })
    })


});


module.exports = app;