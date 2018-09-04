const path = require('path');
const config = require(path.join(__dirname, 'config.json'));
const popTables = require(path.join(__dirname, 'populateTables.js'));
const MySQL = require('mysql');
const pool = MySQL.createPool({
    multipleStatements: true,
    connectionLimit: config.limit,
    host: config.host,
    user: config.user,
    password: config.pass,
    database: config.db,
});


//  Audits the array of `results`, either for the current day, or the day provided as an argument
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
    return reservationsToday;
}

//  Counts the number of reservations by car class
let countClass = function (reservationsToday) {
    let vehicleClasses = { "PCAR": 0, "FCAR": 0, "SCAR": 0, "ICAR": 0, "CCAR": 0, "ECAR": 0, "PFAR": 0, "FFAR": 0, "SFAR": 0, "IFAR": 0, "SSAR": 0 };
    reservationsToday.forEach(reservation => {
        vehicleClasses[reservation.vehicle_class] += 1;
    });
    return vehicleClasses;
}

// Performs the audits
let performAudits = function () {
    pool.query(`SELECT * FROM reservations`, (err, results, fields) => {
        if (err) { console.error(err); }
        else {
            let reservationsToday;
            if (process.argv[2] == undefined || process.argv[3] == undefined || process.argv[4] == undefined) {
                let date = new Date();
                reservationsToday = auditResults(results, date.getFullYear(), date.getMonth(), date.getDate());
            } else {
                reservationsToday = auditResults(results, process.argv[2], process.argv[3] - 1, process.argv[4]);
            }
            console.log(reservationsToday);
            console.log(reservationsToday.length);
            console.log(countClass(reservationsToday));
        }
    });
}


let sim = function () {
    let today = new Date('2018-9-01');
    pool.query(`SELECT * FROM vehicles`, (err, results) => {
        for (let i = 0; i < results.length; i++) {
            let newMileage = results[i].mileage + Math.floor(Math.random() * 300) + 20;
            // console.log(results);
            if (results[i].mileage < 5000 && newMileage > 5000) {
                pool.query(`UPDATE vehicles SET mileage = ${newMileage}, holdCode = 'PM' WHERE id = ${results[i].id}`, (err) => { if (err) console.error(err); });
            } else {
                pool.query(`UPDATE vehicles SET mileage = ${newMileage} WHERE id = ${results[i].id}`, (err) => { if (err) console.error(err); });
            }
        }
    })
}




//  Test to ensure we get a connection to the mySQL server
pool.getConnection((err) => {
    if (err) console.error(err)
    else console.log("Successfully connected!");
})


// performAudits();
for (let i = 0; i < 100; i++) {
    sim();
}