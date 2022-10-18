const { MongoClient } = require("mongodb");
const Db = 'mongodb+srv://vuhvp:Pringles2022@computerscienceproject.wa7xkfg.mongodb.net/ComputerScienceProjectDB?authSource=admin'
const client = new MongoClient(Db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

var _db;

module.exports = {
    connectToServer: function (callback) {
        client.connect(function (err, db) {
            if (db) {
                _db = db.db("ComputerScienceProjectDB");
                console.log("Successfully connected to MongoDB.");
            }
            return callback(err);
        });
    },

    getDb: function () {
        return _db;
    },
};