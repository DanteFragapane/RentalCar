const path = require('path');
const config = require(path.join(__dirname, 'config.json'));
const request = require('request');
const MySQL = require('mysql');
const pool = MySQL.createPool({
    multipleStatements: true,
    connectionLimit: config.limit,
    host: config.host,
    user: config.user,
    password: config.pass,
    database: config.db,
});



let auditResults = function (results, year, month, day) {
    let reservationsToday = [];
    let checkdate;
    if (year == undefined || month == undefined || day == undefined) {
        console.log("One of the variables isn't present");
        checkDate = new Date();
    } else {
        console.log("All present");
        console.log(year + " " + month + " " + day);
        checkDate = new Date(year, month, day);
    }
    console.log(checkDate);
    console.log("\nRESULTS!");
    results.forEach(element => {
        let resultDate = new Date(element.start_date);
        // console.log(resultDate);
        if (resultDate.getDate() == checkDate.getDate() && resultDate.getMonth() == checkDate.getMonth() && resultDate.getFullYear() == checkDate.getFullYear()) {
            console.log("Same date! " + resultDate);
            reservationsToday.push(element);
        }
    });
    console.log(reservationsToday);
    console.log("There are " + reservationsToday.length + " reservations for today!");
}

pool.getConnection((err, success) => {
    if (err) console.error(err)
    else console.log("Successfully connected!")
})


//  POPULATES THE VEHICLES TABLE
// request('https://my.api.mockaroo.com/vehicles.json?key='+config.apiKey, {json : true} , (err, res, body) => {
//     if (err) { console.error(err); }
//     else {
//         console.log("\nVehicles")
//         console.log(body);
//         for (var i = 0; i < 1000; i++) {
//             pool.query(`insert into vehicles (id, vin, make, model, year, color) values (?,?,?,?,?,?)`, [body[i].id, body[i].vin, body[i].make, body[i].model, body[i].year, body[i].color] , (err) => {
//                 if(err) {console.error(err);}
//             });
//         }
//     }
// });

//  POPULATES THE CUSTOMER TABLE
// request('https://my.api.mockaroo.com/customers.json?key='+config.apiKey, {json : true} , (err, res, body) => {
//     if (err) { console.error(err); }
//     else {
//         console.log("\nCustomers");
//         console.log(body);
//         for (var i = 0; i < 1000; i++) {
//             pool.query(`insert into customers (id, first_name, last_name, email, address, company) values  (?,?,?,?,?,?)`, [body[i].id, body[i].first_name, body[i].last_name, body[i].email, body[i].address, body[i].company] , (err) => {
//                 if(err) {console.error(err);}
//             });
//         }
//     }
// });

// //  POPULATES THE RESERVATION TABLE
// request('https://my.api.mockaroo.com/reservations.json?key='+config.apiKey, {json : true} , (err, res, body) => {
//   if (err) { console.error(err); }
//   else {
//     console.log("\nReservations");
//     console.log(body);
//         pool.query('SELECT * FROM customers', (err, results, fields) => {
//             if (err) console.error(err);
//             else if (!results == []) {
//                 console.log(results);             
//                 for (var i = 0; i < 1000; i++) {
//                     let data = [body[i].start_date, body[i].end_date, results[i].last_name, results[i].id, body[i].vehicle_class, body[i].location];
//                     pool.query(`insert into reservations (start_date, end_date, renter_name, renter_id, vehicle_class, location) values (?,?,?,?,?,?)`, data, (err) => {
//                         if (err) console.error(err);
//                     });
//                 }
//             }
//             else if (results == []) {
//                 console.error("RESULTS EQUALS []");
//             }
//         });
//     }
// });



pool.query(`SELECT * FROM reservations`, (err, results, fields) => {
    if (err) { console.error(err); }
    else {
        if (process.argv[2] == undefined || process.argv[3] == undefined || process.argv[4] == undefined) {
            let date = new Date();
            auditResults(results, date.getFullYear(), date.getMonth(), date.getDate());
        } else {
            auditResults(results, process.argv[2], process.argv[3] - 1, process.argv[4]);
        }
    }
});