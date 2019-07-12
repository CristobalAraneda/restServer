//===========================
// PUERTO
//===========================

process.env.PORT = process.env.PORT || 3000;

//===========================
// ENTORNO
//===========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===========================
// Vencimiento 
// s * m * h * d
//===========================
process.env.CADUCIDADA_TOKEN = 60 * 60 * 24 * 30;
//===========================
// Seed
//===========================
process.env.SEED = process.env.SEED || 'seed-de-dev'
    //===========================
    // DATA BASE
    //===========================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;