
const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const path = require('path');
const router = express.Router();
const inventory = require('./Inventory/inventory');
const LandingPage = require('./LandingPage/LandingPage');
const admin = require('./admin/admin');



app.ws("/Register", function (ws, req) {
    ws.on("message", function (event) {
        console.log((event));

        LandingPage.Register(event, function (results) {
            console.log(results);

            ws.send(results);
        });


    })
});




app.ws("/login", function (ws, req) {
    ws.on('message', function (event) {

        console.log("data recivted from login")
        console.log(event);

        LandingPage.login(event, function (results) {

            console.log(results);

            ws.send(results);


        })
    })
})

app.ws("/populate", function (ws, req) {
    ws.on('message', function (event) {

        console.log("test recived");

        inventory.GetInventory(function (results) {
            console.log(results.length);

            for (i = 0; i < results.length; i++) {
                var product = results[i];


                var productstr = JSON.stringify(product);

                ws.send(productstr);


            }
        })


    })

})


app.ws("/additem", function (ws, req) {
    ws.on('message', function (event) {
        console.log("new item data recived");


        admin.Additem(event);
    })
})

app.ws("/createbooking", function (ws, req) {
    ws.on("message", function (event) {

        console.log("booking request recived")

        console.log(event);

        inventory.CreatBooking(event, function (results) {


            console.log(results)

            ws.send(results)
        });
    })

})

app.ws("/validation", function (ws, req) {
    ws.on("message", function (event) {

        console.log("validating if user is admin");

        inventory.validation(event, function (results) {

            console.log("message = " + results);

            ws.send(results)
        })



    })
})

app.ws("/EquipmentTable", function (ws, req) {
    ws.on("message", function (event) {

        admin.populateEquipmentTable(function (results) {
            console.log("PopulateEquipmentTable results = " + results.length);

            var i = 0
            while (i < results.length) {

                var sendresults = JSON.stringify(results[i]);
                ws.send(sendresults)
                i++
            }
        })
    })
})

app.ws("/AccountTable", function (ws, req) {
    ws.on("message", function (event) {

        admin.populateAccountsTable(function (results) {
            console.log("Accounts results = " + results.length);

            var i = 0
            while (i < results.length) {
                var sendresults = JSON.stringify(results[i]);
                ws.send(sendresults);
                i++
            }
        })
    })
})

app.ws("/bookingTable", function (ws, req) {
    ws.on("message", function (event) {

        var itemdict
        var accountsdict
        var bookingresults

        admin.getbookingresults(function (results) {
            console.log("booking data acquired");
            extreactedresults = results
            bookingresults = JSON.stringify(results);

            console.log("-------------" + bookingresults + "--------------");
        });

        admin.getaccountdict(function (results) {
            console.log("account dictionry acquired!")
            accountsdict = results;
        });

        admin.getitemdict(function (results) {
            console.log("item Dictionary acquired!")
            itemdict = results

            admin.getaccountdict(function (results) {
                console.log("account dictionry acquired!")
                accountsdict = results;

                admin.getbookingresults(function (results) {
                    console.log("booking data acquired");
                    bookingresults = JSON.stringify(results);

                    var i = 0
                    while (i < results.length) {

                        var resultstr = JSON.stringify(results[i]);

                        var resultstrsplit = resultstr.split('"');

                        var date = resultstrsplit[7];
                        var itemid = resultstrsplit[11];
                        var userid = resultstrsplit[15];

                        console.log("date = " + date);
                        console.log("itemid = " + itemid);
                        console.log("userid =" + userid);
                        console.log('\n');

                        console.log("translates to");
                        console.log('\n');

                        var itemvalue = itemdict[itemid];
                        var uservalue = accountsdict[userid];

                        console.log("data = " + date);
                        console.log("itemvalue = " + itemvalue);
                        console.log("uservalue = " + uservalue);


                        var itemvalue = itemdict[itemid];
                        var uservalue = accountsdict[userid];

                        console.log("data = " + date);
                        console.log("itemvalue = " + itemvalue);
                        console.log("uservalue = " + uservalue);

                        var message = "'" + date + "'" + itemvalue + "'" + uservalue + "'";

                        console.log(message);

                        ws.send(message);

                        i++;
                    }



                });
            });
        });
    })
})

app.ws('/Toggle', function(ws, res){
    ws.on("message", function (event) {

        console.log(event);

        admin.togglestatus(event, function(results){
            ws.send(results);
        })
    })
    
})

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/LandingPage/LandingPage.html"));
    console.log("Host Connected");

});

app.get('/inventory', function (req, res) {
    res.sendFile(path.join(__dirname + "/Inventory/Inventory.html"));
});

app.get('/admin', function (req, res) {
    res.sendFile(path.join(__dirname + "/admin/admin.html"))
});


app.use(express.static("Inventory/Equipment"));

app.use('/', router);
app.listen(process.env.PROT || 4000, () => console.log('App Avalible on port 4000'));




