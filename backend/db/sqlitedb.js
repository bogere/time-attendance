const {app} = require('electron')
const path = require('path')
const electronPath = path.join(app.getPath("userData"), './data/database.sqlite');
console.log('electron path', electronPath)
const knex = require('knex')({
    client: "sqlite3", //client DBMS driver
	connection: {
        filename: path.join(app.getPath("userData"), './data/database.sqlite')
	},
    useNullAsDefault: true,//ncessary when using sqlite3
    pool: {
      min: 1,
      max: 100,
      //disposeTimeout: 360000 * 1000,
      idleTimeoutMillis: 360000 * 1000
  }
})

// const options = {
//     client: 'mysql2',
//     connection: {
//         host: '127.0.0.1',
//         user: 'root',
//         password: 'hello12345bob',
//         database: 'bizwatch_test'
//     }
// }

// const knex = require('knex')(options);


// function getUsers(){
//     return new Promise((resolve,reject)=>{
//          let users = knex.select('Firstname').from('User')
//          users.then((rows)=>{
//             resolve(rows)
//          })
//          .catch(err=>{
//              reject(err)
//          })
//     })
// }



//module.exports.getUsers = getUsers
module.exports.knex = knex

