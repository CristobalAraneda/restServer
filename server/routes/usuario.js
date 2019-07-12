const express = require('express')
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_rol } = require('../middelewares/autenticacion');


const app = express()

app.get('/usuario', verificaToken, (req, res) => {

    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email

    // })

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    desde = Number(desde);
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({ estado: true }, (err, cuantos) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos
                })
            });
        });
});
app.post('/usuario', [verificaToken, verificaAdmin_rol], function(req, res) {

    let persona = req.body;

    let usuario = new Usuario({

        nombre: persona.nombre,
        email: persona.email,
        password: bcrypt.hashSync(persona.password, 10),
        role: persona.role

    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        // usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


});
app.put('/usuario/:id', [verificaToken, verificaAdmin_rol], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });



});
//FIXME: la eliminación no ES recomendable en un app , solo para mantenimiento
// app.delete('/usuario/:id', function(req, res) {

    //     let id = req.params.id;
    //     Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    
    //         if (err) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 err
    //             });
    //         };
    //         if (!usuarioBorrado) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 err: {
    //                     message: 'Usuario no encontredo'
    //                 }
    //             });
    //         }
    
    //         res.json({
    //             ok: true,
    //             usuarioBorrado
    //         })
    //     });
    
    // });
    

app.delete('/usuario/:id', [verificaToken, verificaAdmin_rol], function(req, res) {

    let id = req.params.id;

    let cambioEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambioEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontredo'
                }
            });
        }

        res.json({
            ok: true,
            usuarioBorrado
        })
    });

});



module.exports = app;