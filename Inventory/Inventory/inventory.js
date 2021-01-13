const { ObjectId } = require('mongodb');
const { mongo, Mongoose, Schema } = require('mongoose');

module.exports = {


    GetInventory: function (_callback) {

        const Mongoclient = require('mongodb');
        const uri = "mongodb+srv://admin:admin@cluster0.wjsoi.mongodb.net/accounts?retryWrites=true&w=majority";


        Mongoclient.connect(uri, function (err, db) {
            if (err) throw err;

            var idb = db.db("inventory");

            idb.collection("inventory").find().toArray(function (err, d) {
                console.log(d.length);

                console.log(d.length);

                _callback(d)
            })

        })

    },

    CreatBooking: function (Booking, _callback) {


        console.log(Booking);

        str = Booking.split("'");

        var date = str[1];
        var productid = str[3];
        var userid = str[5];


        console.log("date is ----> " + date);
        console.log("product id is ----> " + productid);
        console.log("user id is -----> " + userid);

        const Mongoclient = require('mongodb');
        const uri = "mongodb+srv://admin:admin@cluster0.wjsoi.mongodb.net/accounts?retryWrites=true&w=majority";


        Mongoclient.connect(uri, function (err, db) {
            if (err) throw err;

            var idb = db.db("inventory");
            var udb = db.db("accounts");
            var bdb = db.db("Bookings");

            var query = {
                date: date,
                inventoryId: productid
            }

            bdb.collection('Bookings').find(query, { $exists: true }).toArray(function (err, doc) {
                if (doc.length === 1) // if item is already booked for this date
                {
                    console.log("Equipment already booked for selected day")
                    var message = "This equipment has already been booked out for the selected date!"

                    _callback(message);
                }
                else if (doc.length === 0) {

                    var entry = {
                        date: date,
                        inventoryId: productid,
                        userid: userid
                    }

                    console.log("no entry detected");


                    bdb.collection('Bookings').insertOne(entry);

                    var message = "Booking has been made for " + date + ". Please make a note of this. you may collect this equipment on you're selected date from the Equipment technician."

                    _callback(message);
                }
            })




        })






    },


    validation: function (userid, _callback) {

        const Mongoclient = require('mongodb');
        const uri = "mongodb+srv://admin:admin@cluster0.wjsoi.mongodb.net/accounts?retryWrites=true&w=majority";

        Mongoclient.connect(uri, function (err, db) {

            var udb = db.db("accounts");

            var message

            udb.collection("accounts").find().toArray(function (err, results) {

                console.log(results.length);

                var i = 0;

                while (i < results.length) {

                    var user = results[i]


                    i = i + 1;

                    if (user._id == userid) {

                        if (user.admin == "True") {

                            message = "Authorised"

                            console.log("user is authorised");
                        }

                    }
                }

                _callback(message)

            }



            )
        })


    }


};
