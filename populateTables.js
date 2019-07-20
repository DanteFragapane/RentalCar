const request = require('request')

module.exports = {
  //  POPULATES THE VEHICLES TABLE
  populateVehicles: function () {
    request('https://my.api.mockaroo.com/vehicles.json?key=' + config.apiKey, { json: true }, (err, res, body) => {
      if (err) {
        console.error(err)
      } else {
        console.log('\nVehicles')
        console.log(body)
        for (var i = 0; i < 1000; i++) {
          pool.query(
            `insert into vehicles (id, vin, make, model, year, color, mileage) values (?,?,?,?,?,?,?)`,
            [ body[i].id, body[i].vin, body[i].make, body[i].model, body[i].year, body[i].color, body[i].mileage ],
            (err) => {
              if (err) {
                console.error(err)
              }
            }
          )
        }
      }
    })
  },

  //  POPULATES THE CUSTOMER TABLE
  populateCustomer: function () {
    request('https://my.api.mockaroo.com/customers.json?key=' + config.apiKey, { json: true }, (err, res, body) => {
      if (err) {
        console.error(err)
      } else {
        console.log('\nCustomers')
        console.log(body)
        for (var i = 0; i < 1000; i++) {
          pool.query(
            `insert into customers (first_name, last_name, email, address, company) values (?,?,?,?,?)`,
            [ body[i].first_name, body[i].last_name, body[i].email, body[i].address, body[i].company ],
            (err) => {
              if (err) {
                console.error(err)
              }
            }
          )
        }
      }
    })
  },

  //  POPULATES THE RESERVATION TABLE
  populateReservation: function () {
    request('https://my.api.mockaroo.com/reservations.json?key=' + config.apiKey, { json: true }, (err, res, body) => {
      if (err) {
        console.error(err)
      } else {
        console.log('\nReservations')
        console.log(body)
        pool.query('SELECT * FROM customers', (err, results, fields) => {
          if (err) console.error(err)
          else if (!results == []) {
            console.log(results)
            for (var i = 0; i < 1000; i++) {
              let data = [
                body[i].start_date,
                body[i].end_date,
                results[i].last_name,
                results[i].id,
                body[i].vehicle_class,
                body[i].location
              ]
              pool.query(
                `insert into reservations (start_date, end_date, renter_name, renter_id, vehicle_class, location) values (?,?,?,?,?,?)`,
                data,
                (err) => {
                  if (err) console.error(err)
                }
              )
            }
          } else if (results == []) {
            console.error('RESULTS EQUALS []')
          }
        })
      }
    })
  }
}
