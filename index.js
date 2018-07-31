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



pool.getConnection((err, success) => {
    if (err) console.error(err)
    else console.log("Successfully connected!")
})

/* POPULATES THE VEHICLES TABLE
request('https://my.api.mockaroo.com/vehicles.json?key=126468d0', {json : true} , (err, res, body) => {
  if (err) { return console.log(err); }
  console.log(body);
  for (var i = 0; i < 1000; i++) {
      pool.query(`insert into vehicles (id, vin, make, model, year, color) values (?,?,?,?,?,?)`, [body[i].id, body[i].vin, body[i].make, body[i].model, body[i].year, body[i].color] , (err) => {
          if(err) {console.err(err);}
      });
  }
});
*/

/* POPULATES THE CUSTOMER TABLE
request('https://my.api.mockaroo.com/customers.json?key=126468d0', {json : true} , (err, res, body) => {
  if (err) { return console.log(err); }
  console.log(body);
  for (var i = 0; i < 1000; i++) {
      pool.query(`insert into customers (id, first_name, last_name, email, address, company) values  (?,?,?,?,?,?)`, [body[i].id, body[i].first_name, body[i].last_name, body[i].email, body[i].address, body[i].company] , (err) => {
          if(err) {console.log(err);}
      });
  }
});
*/

