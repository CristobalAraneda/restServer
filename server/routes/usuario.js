const express = require('express')
const app = express()

app.get('/usuario', function(req, res) {
    res.json('get usuarios local')
});
app.post('/usuario', function(req, res) {

    let persona = req.body;

    if (persona.nombre === undefined) {

        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es nesesario'
        });

    } else {
        res.json({
            persona
        });
    }

});
app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;

    res.json({
        id
    });


});
app.delete('/usuario', function(req, res) {
    res.json('delete usuarios')
});

module.exports = app;