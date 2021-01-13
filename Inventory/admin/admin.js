const { sync } = require('pouchdb');

module.exports = {

    Additem: function (newitem) {

        console.log(newitem);

        const Mongoclient = require('mongodb');
        const uri = "mongodb+srv://admin:admin@cluster0.wjsoi.mongodb.net/accounts?retryWrites=true&w=majority";

        var item = JSON.parse(newitem)


        Mongoclient.connect(uri, function (err, db) {
            if (err) throw err;

            var idb = db.db("inventory");

            idb.collection('inventory').insertOne(item, function (err, response) {
                if (err) throw err;

                console.log("sucsesse")
            });

            console.log("JSON item:")
            console.log(item);


        })
    },

    populateEquipmentTable: function (_callback) {

        const Mongoclient = require('mongodb');
        const uri = "mongodb+srv://admin:admin@cluster0.wjsoi.mongodb.net/accounts?retryWrites=true&w=majority";

        Mongoclient.connect(uri, function (err, db) {

            var idb = db.db("inventory");

            idb.collection("inventory").find().toArray(function (err, inventory) {

                _callback(inventory)
            })
        })
    },

    populateAccountsTable: function (_callback) {

        const Mongoclient = require('mongodb');
        const uri = "mongodb+srv://admin:admin@cluster0.wjsoi.mongodb.net/accounts?retryWrites=true&w=majority";

        Mongoclient.connect(uri, function (err, db) {

            var udb = db.db("accounts");

            udb.collection("accounts").find().toArray(function (err, inventory) {

                _callback(inventory)
            })
        })
    },

    getitemdict(_callback) {

        const Mongoclient = require('mongodb');
        const uri = "mongodb+srv://admin:admin@cluster0.wjsoi.mongodb.net/accounts?retryWrites=true&w=majority";


        Mongoclient.connect(uri, function (err, db) {

            var idb = db.db("inventory");

            idb.collection('inventory').find().toArray(function (err, results) {

                var inventorydict = {};
                var i = 0
                while (i < results.length) {

                    var resultsstr = JSON.stringify(results[i])

                    var strsplit = resultsstr.split('"');

                    var itemid = strsplit[3]
                    console.log("item id = " + itemid);
                    var itemname = strsplit[7]
                    console.log("item name = " + itemname);
                    console.log('\n');

                    inventorydict[itemid] = itemname;
                    console.log("this is the next test " + JSON.stringify(inventorydict));
                    i++;
                }

                _callback(inventorydict);
            })

        })

    },

    getaccountdict(_callback) {

        const Mongoclient = require('mongodb');
        const uri = "mongodb+srv://admin:admin@cluster0.wjsoi.mongodb.net/accounts?retryWrites=true&w=majority";


        var accountsdict = {}

        Mongoclient.connect(uri, function (err, db) {

            var udb = db.db("accounts");

            udb.collection('accounts').find().toArray(function (err, results) {

                var accountsdict = {}
                var i = 0
                while (i < results.length) {

                    var resultsstr = JSON.stringify(results[i])

                    var strsplit = resultsstr.split('"');


                    var userid = strsplit[3]
                    console.log('user id = ' + userid);
                    var username = strsplit[7]
                    console.log('username = ' + username);
                    accountsdict[userid] = username;
                    console.log('\n');
                    i++;
                }
                _callback(accountsdict);
            })
        })

    },



    getbookingresults: function (_callback) {

        const Mongoclient = require('mongodb');
        const uri = "mongodb+srv://admin:admin@cluster0.wjsoi.mongodb.net/accounts?retryWrites=true&w=majority";

        Mongoclient.connect(uri, function (err, db) {

            var bdb = db.db("Bookings");

            bdb.collection('Bookings').find().toArray(function (err, results) {
                _callback(results)
            })


        })
    },

    togglestatus(email, _callback) {

        console.log( email);

        const Mongoclient = require('mongodb');
        const uri = "mongodb+srv://admin:admin@cluster0.wjsoi.mongodb.net/accounts?retryWrites=true&w=majority";

        Mongoclient.connect(uri, function (err, db) {

            var udb = db.db("accounts");

            var objectemail = { email: email };

            udb.collection('accounts').findOneAndUpdate(objectemail, {$set: {admin: 'True'}}, function (err,results) {
               if (err) throw err;
                _callback("user updated, Reload page to see update!")
            })

        }


        )
    }


}






