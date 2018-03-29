var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var mongo = require('mongodb');
var constants = require('../constants')

function retrieveKey(request_body) {
    var body_string = JSON.stringify(request_body)
    var string_array = body_string.split(":")
    var string_array2 = string_array[0].split('"')
    return string_array2[1]
}

function checkKeyExists(data_base, json_key) {
    return new Promise(function (resolve, reject) {
        data_base.collection(constants.key_value_collection).findOne({ "key": json_key }, function (error, result) {
            if (error) throw error;
            (error) ? reject(error) : resolve(result)
        });
    })
}

function insertKeyValuePairs(data_base, json_key, timestamp) {
    return new Promise(function (resolve, reject) {
        var obj = { "key": json_key, "value": req.body[json_key], "timestamp": timestamp }
        data_base.collection(constants.key_value_collection).insertOne(obj, function (error, result) {
            if (error) throw error;
            (error) ? reject(error) : resolve(result)
        });
    })
}

function retrieveKeyValuePairs(data_base, json_key, id) {
    return new Promise(function (resolve, reject) {
        var o_id = new mongo.ObjectID(id);
        data_base.collection(constants.key_value_collection).findOne({ "_id": o_id, "key": json_key }, function (error, result) {
            if (error) throw error;
            (error) ? reject(error) : resolve(result)
        });
    })
}

/**
 * POST request
 */
router.post('/', function (req, res) {

    if (req.body != undefined || req.body != null) {

        res.status(400);
        res.json({ message: "Bad Request" });

    } else {

        MongoClient.connect(constants.mongodb_url, function (err, database) {
            if (err) throw err;

            var json_key = retrieveKey(req.body) // retrieve key from request body string

            data_base = database.db(constants.vaultdragon_coding_test_db)

            // check if key exists in db
            checkKeyExists(data_base, json_key).then(function (result) {
                return insertKeyValuePairs(data_base, json_key, new Date().getTime()); // insert key value into db
            }).then(function (result) {
                return retrieveKeyValuePairs(data_base, json_key, result.insertedId); // retrieve key value into db
            }).then(function (result) {
                res.json({ "key": result["key"], "value": result["value"], "timestamp": result["timestamp"] });
                database.close();
            }).catch(function (error) {
                // error handle
                res.json({ status: error });
            });

        });

    }

});

module.exports = router;