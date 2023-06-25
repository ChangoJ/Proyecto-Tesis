'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

// URL de conexión a la base de datos
const url = 'mongodb://localhost:27017';
const dbName = 'sistema_creacion_horariosV2';

var controller = {

    exportar: async (req, res) => {
        try {
            const client = await MongoClient.connect(url);
            const db = client.db(dbName);

            const databaseName = dbName; // Reemplaza con el nombre de tu base de datos específica

            const dbExport = client.db(databaseName);

            const collections = await dbExport.listCollections().toArray();

            const exportData = {};

            for (const collection of collections) {
                const collectionName = collection.name;
                const documents = await dbExport.collection(collectionName).find().toArray();
                if (documents.length > 0) {
                    exportData[collectionName] = documents.map(doc => ({ ...doc, _id: doc._id.toString() }));
                  }
            }

            const fechaHoraActual = new Date().toLocaleString().replace(/[/\s:]/g, '-');
            const exportFileName = `${fechaHoraActual}_${databaseName}.json`;
            fs.writeFileSync(exportFileName, JSON.stringify(exportData));
            console.log(`Se exportó la base de datos ${databaseName} completa a ${exportFileName}`);

            client.close();
            return res.status(200).send({
                status: 'success',
                message: 'Datos exportados exitosamente.'
            });
        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: 'Error al exportar la base de datos.'
            });
        }

    },

    importar: async (req, res) => {
        console.log("req")
        try {
            const client = await MongoClient.connect(url);
            const db = client.db(dbName);
            const data = req.body;

            await db.dropDatabase(); // Elimina la base de datos existente si es necesario

            for (const collectionName in data) {
                const documents = data[collectionName];
                const updatedDocuments = documents.map(doc => ({ ...doc, _id: new ObjectId(doc._id) }));
                await db.collection(collectionName).insertMany(updatedDocuments);
            }


            client.close();
            return res.status(200).send({
                status: 'success',
                message: 'Datos importados exitosamente.'
            });
        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: 'Error al importar los datos.'
            });
        }
    }

}

module.exports = controller;