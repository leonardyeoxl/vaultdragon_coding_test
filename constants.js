function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("mongodb_url", "mongodb://tester:tester@ds223019.mlab.com:23019/vaultdragon_coding_test");
define("key_value_collection", "key_value_pairs");
define("vaultdragon_coding_test_db", "vaultdragon_coding_test");