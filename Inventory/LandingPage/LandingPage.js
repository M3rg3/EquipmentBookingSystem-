module.exports = {

    CreateUserDatabase: function () {

        const Mongoclient = require('mongodb');

        const uri = "mongodb+srv://ReadWriteUser:I1XkHEg1QMdbWNfg@cluster0.wjsoi.mongodb.net/EquipmentManagerDB?retryWrites=true&w=majority";

        // string to connect to local host while testing
//        const uri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";


        Mongoclient.connect(uri, function (err, db) {
            if (err) throw err;
            console.log("database connected!")

            var udb = db.db("accounts");
        });

        return
    },

    Register: function (NewUser, _callback) {

        const Mongoclient = require('mongodb');
        const uri = "mongodb+srv://ReadWriteUser:I1XkHEg1QMdbWNfg@cluster0.wjsoi.mongodb.net/EquipmentManagerDB?retryWrites=true&w=majority";
        var results;


        Mongoclient.connect(uri, function (err, db) {
            if (err) throw err;

            console.log("database searching")



            var udb = db.db("accounts");
            var str = NewUser.split("'");
            console.log(str[5]);




            udb.collection('accounts').find({ email: str[5] }, { $exists: true }).toArray(function (err, doc) {
                if (doc.length === 1) // if email is linked to account
                {
                    console.log("user exists");
                    console.log(doc.length);
                    console.log(doc);

                    results = "Email Address Already linked to account";

                    _callback(results)
                }
                else if (doc.length === 0) {
                    console.log("Email not linked to account");

                    results = "New Account Has been Created, Please Login!"

                    var AddNewUser = {
                        username: str[1],
                        password: str[3],
                        email: str[5],
                        admin: 'False'
                    }

                    console.log(AddNewUser);


                    udb.collection('accounts').insertOne(AddNewUser);

                    _callback(results)

                }
            })
        });
    },

    login: function (User, _callback) {

        const Mongoclient = require('mongodb');
        const uri = "mongodb+srv://admin:admin@cluster0.wjsoi.mongodb.net/accounts?retryWrites=true&w=majority";
        var results

        Mongoclient.connect(uri, function (err, db) {
            if (err) throw err;

            var udb = db.db("accounts");

            console.log("inside of Landingpage.js Users equals")
            console.log(User)

            var str = User.split(",")

            console.log("first split");

            console.log(str[0]);
            var str0 = str[0];
            console.log(str[1]);
            var str1 = str[1];

            console.log("second split");

            var emailstr = str0.split(" ");
            var passwordstr = str1.split(" ");

            var test = emailstr[2];

            console.log(emailstr);
            console.log(test);

            //  console.log(passwordstr[2]);



            var userperamiters = {
                password: passwordstr[2],
                email: emailstr[2]

            }

            console.log("user peramiters test");
            console.log(userperamiters);



            udb.collection('accounts').find(userperamiters, { $exists: true }).toArray(function (err, doc) {
                if (doc.length === 1) // if email is linked to account
                {
                    console.log("Retriving user information");
                    console.log(doc.length);
                    console.log(doc);

                    var dbresults = JSON.stringify(doc);

                    var resultSegments = dbresults.split('"')

                    results = resultSegments[3];

                    _callback(results);
                }
                else if (doc.length === 0) {

                    console.log("User Account doesn't exist in user database!")

                    results = "User Account doesn't exist in user database!";

                    _callback(results)

                }
            })



        })






    }




}

