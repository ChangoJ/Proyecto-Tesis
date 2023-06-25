'use strict';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var validator = require('validator');

var fs = require('fs');

var path = require('path');

var _require = require('mongodb'),
    MongoClient = _require.MongoClient,
    ObjectId = _require.ObjectId; // URL de conexión a la base de datos


var url = 'mongodb://localhost:27017';
var dbName = 'sistema_creacion_horariosV2';
var controller = {
  exportar: function exportar(req, res) {
    var client, db, databaseName, dbExport, collections, exportData, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, collection, collectionName, documents, fechaHoraActual, exportFileName;

    return regeneratorRuntime.async(function exportar$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap(MongoClient.connect(url));

          case 3:
            client = _context.sent;
            db = client.db(dbName);
            databaseName = dbName; // Reemplaza con el nombre de tu base de datos específica

            dbExport = client.db(databaseName);
            _context.next = 9;
            return regeneratorRuntime.awrap(dbExport.listCollections().toArray());

          case 9:
            collections = _context.sent;
            exportData = {};
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 14;
            _iterator = collections[Symbol.iterator]();

          case 16:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 26;
              break;
            }

            collection = _step.value;
            collectionName = collection.name;
            _context.next = 21;
            return regeneratorRuntime.awrap(dbExport.collection(collectionName).find().toArray());

          case 21:
            documents = _context.sent;

            if (documents.length > 0) {
              exportData[collectionName] = documents.map(function (doc) {
                return _objectSpread({}, doc, {
                  _id: doc._id.toString()
                });
              });
            }

          case 23:
            _iteratorNormalCompletion = true;
            _context.next = 16;
            break;

          case 26:
            _context.next = 32;
            break;

          case 28:
            _context.prev = 28;
            _context.t0 = _context["catch"](14);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 32:
            _context.prev = 32;
            _context.prev = 33;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 35:
            _context.prev = 35;

            if (!_didIteratorError) {
              _context.next = 38;
              break;
            }

            throw _iteratorError;

          case 38:
            return _context.finish(35);

          case 39:
            return _context.finish(32);

          case 40:
            fechaHoraActual = new Date().toLocaleString().replace(/[/\s:]/g, '-');
            exportFileName = "".concat(fechaHoraActual, "_").concat(databaseName, ".json");
            fs.writeFileSync(exportFileName, JSON.stringify(exportData));
            console.log("Se export\xF3 la base de datos ".concat(databaseName, " completa a ").concat(exportFileName));
            client.close();
            return _context.abrupt("return", res.status(200).send({
              status: 'success',
              message: 'Datos exportados exitosamente.'
            }));

          case 48:
            _context.prev = 48;
            _context.t1 = _context["catch"](0);
            return _context.abrupt("return", res.status(500).send({
              status: 'error',
              message: 'Error al exportar la base de datos.'
            }));

          case 51:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 48], [14, 28, 32, 40], [33,, 35, 39]]);
  },
  importar: function importar(req, res) {
    var client, db, data, collectionName, documents, updatedDocuments;
    return regeneratorRuntime.async(function importar$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log("req");
            _context2.prev = 1;
            _context2.next = 4;
            return regeneratorRuntime.awrap(MongoClient.connect(url));

          case 4:
            client = _context2.sent;
            db = client.db(dbName);
            data = req.body;
            _context2.next = 9;
            return regeneratorRuntime.awrap(db.dropDatabase());

          case 9:
            _context2.t0 = regeneratorRuntime.keys(data);

          case 10:
            if ((_context2.t1 = _context2.t0()).done) {
              _context2.next = 18;
              break;
            }

            collectionName = _context2.t1.value;
            documents = data[collectionName];
            updatedDocuments = documents.map(function (doc) {
              return _objectSpread({}, doc, {
                _id: new ObjectId(doc._id)
              });
            });
            _context2.next = 16;
            return regeneratorRuntime.awrap(db.collection(collectionName).insertMany(updatedDocuments));

          case 16:
            _context2.next = 10;
            break;

          case 18:
            client.close();
            return _context2.abrupt("return", res.status(200).send({
              status: 'success',
              message: 'Datos importados exitosamente.'
            }));

          case 22:
            _context2.prev = 22;
            _context2.t2 = _context2["catch"](1);
            return _context2.abrupt("return", res.status(500).send({
              status: 'error',
              message: 'Error al importar los datos.'
            }));

          case 25:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[1, 22]]);
  }
};
module.exports = controller;