var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var constants = require('../constants')

function retrieveKeyValuePairs(data_base, key) {
    return new Promise(function (resolve, reject) {
        data_base.collection(constants.key_value_collection).find({ "key": key }).toArray(function (error, result) {
            if (error) throw error;
            (error) ? reject(error) : resolve(result)
        });
    })
}

function retrieveKeyValuePairsBasedOnTimestamp(data_base, key, time_stamp) {
    return new Promise(function (resolve, reject) {
        data_base.collection(constants.key_value_collection).find({
            $and: [
                { "key": key },
                { "timestamp": { $lte: parseInt(time_stamp) } }
            ]
        }).toArray(function (error, result) {
            if (error) throw error;
            (error) ? reject(error) : resolve(result)
        });
    })
}

/**
 * GET request
 */
router.get('/:mykey', function (req, res) {

    if (!req.params) {

        res.status(400);
        res.json({ message: "Bad Request" });

    } else {

        MongoClient.connect(constants.mongodb_url, function (err, database) {
            if (err) throw err;

            data_base = database.db(constants.vaultdragon_coding_test_db)

            if (req.query.timestamp != null || req.query.timestamp != undefined) {
                // retrieve key value into db based on key and timestamp
                retrieveKeyValuePairsBasedOnTimestamp(data_base, req.params.mykey, req.query.timestamp).then(function (result) {
                    var last_element = result[result.length - 1]
                    res.json({ "value": last_element["value"] });
                    database.close();
                }).catch(function (error) {
                    // error handle
                    res.json({ status: error });
                });
            } else {
                // retrieve key value into db based on key
                retrieveKeyValuePairs(data_base, req.params.mykey).then(function (result) {
                    var last_element = result[result.length - 1]
                    res.json({ "value": last_element["value"] });
                    database.close();
                }).catch(function (error) {
                    // error handle
                    res.json({ status: error });
                });
            }

        });

    }

});

module.exports = router;