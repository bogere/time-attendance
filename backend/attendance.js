const ZKLib = require('node-zklib')
const { knex } = require('./db/sqlitedb')

const zkInstance = new ZKLib('192.168.100.158', 4370, 10000, 4000)


function createAttendanceDB(){
    //https://knexjs.org/#Schema-decimal
    knex.schema.createTable('attendances', (table)=>{
        table.increments('id').primary()
        table.string('personId') //deviceUserId
        table.string('ip')
        table.integer('dailyCount')
        table.datetime('recordTime')
        table.string('shopId')
        table.boolean('synced')
        table.boolean('closed')
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())

}).then(() => console.log(" attendance table created"))
    .catch((err) => { console.log(err); throw err })
    // .finally(() => {
    //      knex.destroy(); //causes  Error: Unable to acquire a connection 
    // });
}


function createUsersDB(){
    //https://knexjs.org/#Schema-decimal
    knex.schema.createTable('persons', (table)=>{
        table.increments('id').primary()
        table.string('name') //deviceUserId
        table.string('role')
        table.string('password')
        table.string('userId').unique()
        table.integer('classId')
        table.string('student_no')
        table.boolean('synced')
        table.boolean('closed')
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())

}).then(() => console.log(" persons table created"))
    .catch((err) => { console.log(err); throw err })
    // .finally(() => {
    //      knex.destroy(); //causes  Error: Unable to acquire a connection 
    // });
}

function dropAttendanceDB(){
    knex.schema.dropTableIfExists('attendances')
       .then(()=> console.log('Dropped the attendance table'))
       .catch((err) => console.log(err))
}

//dropAttendanceDB()
//createAttendanceDB()
//createUsersDB()


function enrollStudents(){
    return new Promise(async(resolve,reject)=>{

        try {
            // Create socket to machine 
            await zkInstance.createSocket()
    
    
            // Get general info like logCapacity, user counts, logs count
            // It's really useful to check the status of device 
            console.log(await zkInstance.getInfo())
        } catch (e) {
            console.log('attendance connection  error ',e)
            reject('attendance connection  error ' + e)
            if (e.code === 'EADDRINUSE') {
                console.log('yeah the attendance machine port is in use')
                
            }
        }

         // Get users in machine 
        const users = await zkInstance.getUsers()
        console.log('enrolled users',users)

        if (users.data) {
            saveStudentData(users.data, 4)
              .then(result=>{
                  resolve(users.data)
              })
              .catch(err=>{
                 reject('Failed to save the enrolled students')
              })
        } else {
           reject('Failed to retrieve the enrolled users') 
        }

        resolve('enrolled student successful') 
    })
}


function saveStudentData(users, classId){
    return new Promise((resolve,reject)=>{
        
        users.forEach(user=>{
            const newUser = {
                name: user.name,
                role: user.role,
                password: user.password,
                userId: user.userId,
                classId:classId,
                student_no: 'U12345',
                synced:false,
                closed: false
            }
            knex('persons').insert(newUser).then((response) => { 
                 console.log('enrolled student', response)
            })
            .catch(err=>{
                console.log('failed to save student' + err)
            })
        })
        resolve('saved the enrolled students in system')
    })
}

function registerAttendance(){
    return new Promise(async(resolve,reject)=>{

        try {
            // Create socket to machine 
            await zkInstance.createSocket()
    
    
            // Get general info like logCapacity, user counts, logs count
            // It's really useful to check the status of device 
            console.log(await zkInstance.getInfo())
        } catch (e) {
            console.log('attendance connection  error ',e)
            reject('attendance connection  error ' + e)
            if (e.code === 'EADDRINUSE') {
                console.log('yeah the attendance machine port is in use')
                
            }
        }

        // delete the data in machine
        // You should do this when there are too many data in the machine, this issue can slow down machine 
        //zkInstance.clearAttendanceLog();


        // Get all logs in the machine 
        // Currently, there is no filter to take data, it just takes all !!
        const logs = await zkInstance.getAttendances()
        const attendance_info  = transformAttendanceData(logs)

        //register the attendance data..
        if(attendance_info){
            saveAttendanceData(attendance_info, 4)
               .then(result=>{
                    resolve(attendance_info)
               })
               .catch(err=>{
                   reject('failed to save the attendance data' + err)
               })
        }else{
           reject('Failed to register attendance data from  attendance machine')
        }
    })
}


function saveAttendanceData(attendanceItems, classId){
    return new Promise((resolve,reject)=>{
        
        attendanceItems.forEach(attendance=>{
            const newItem = {
                personId: attendance.deviceUserId,
                recordTime: attendance.recordTime,
                ip: attendance.ip,
                dailyCount: attendance.studentCount,   
                synced:false,
                closed: false
            }
            knex('attendances').insert(newItem).then((response) => { 
                 console.log('recorded attendance item', response)
            })
            .catch(err=>{
                console.log('failed to save attendance item' + err)
            })
        })
        resolve('saved the attendance data in system')
    })
}


function getAllAttendance(timePeriod){

    return new Promise((resolve,reject)=>{
        const attendanceItems = []
        // knex.from('attendances').select('*')
        //      .where('closed', false)
        //      .orderBy('created_at', 'desc').limit(2000)
        //      .then((rows) => {
        //           rows.forEach(row=>{
        //              attendanceItems.push(row)
        //           })
        //           resolve(attendanceItems)
        //       })
        //       .catch((err) => { console.log( err); reject(err) })

            //   knex.raw('select * from attendances where id = ?', [1])
            //        .then(function(resp) { /*...*/ });
            knex.raw('select a.id,a.personId,a.ip,a.dailyCount,a.recordTime,a.created_at, p.name,p.userId,p.classId from attendances a inner join persons p on a.personId = p.userId order by a.created_at desc')
                    .then(function(rows) {
                        rows.forEach(row=>{
                            attendanceItems.push(row)
                         })
                         resolve(attendanceItems)
                     })
                     .catch( (err) => {console.log(err); reject(err)})
        // .finally(() => {
        //     knex.destroy();
        // });
    })

}


//sales metrics.. top selling items
function getAttendancesByDate(input){
        
    let startDate = new Date(input.startDate), 
        endDate = new Date(input.endDate)

 return new Promise((resolve,reject)=>{
    const sales = []
    knex.from('attendances').select('*').where('closed', false) ////for now discard the sales that have closed:true in productStore.salesList
        .whereBetween('created_at', [startDate, endDate])
        .then((rows) => {
            rows.forEach(row=>{
              sales.push(row)
            })
            resolve(sales)
        })
    .catch((err) => { console.log( err); reject(err) })
    // .finally(() => {
    //     knex.destroy();
    // });
})

}


function getAllEnrolledStudentsInDb(input){
        
    let startDate = new Date(input.startDate), 
        endDate = new Date(input.endDate)

 return new Promise((resolve,reject)=>{
    const users = []
    knex.from('persons').select('*').where('closed', false) ////for now discard the sales that have closed:true in productStore.salesList
        //.whereBetween('created_at', [startDate, endDate])
        .then((rows) => {
            rows.forEach(row=>{
              users.push(row)
            })
            resolve(users)
        })
    .catch((err) => { console.log( err); reject(err) })
    // .finally(() => {
    //     knex.destroy();
    // });
})

}


//utility functions
function reformatUTCDates(dateStr){
    const dateObj = new Date(dateStr)
    // Specify the EAT timezone offset (UTC+3)
    const eatDateString = dateObj.toLocaleString("en-US", {
        timeZone: "Africa/Nairobi", // Specify EAT timezone
        hour12: false, // Use 24-hour format
      });
    
    console.log("EAT time:", eatDateString); // Output: 2023-12-22 20:35:35
    return eatDateString
}

function transformAttendanceData(info){
    const attendanceList = []
    const dateObj = new Date().toLocaleString()
    info.data.forEach(item=>{
        attendanceList.push({
            studentName: item.deviceUserId,
            studentCount: item.userSn,
            recordTime: reformatUTCDates(item.recordTime),
            ip: item.ip,
            deviceUserId: item.deviceUserId, // regisered userId
            dateCreated: dateObj
        })
    })

    return attendanceList;
       
}



module.exports.enrollStudents = enrollStudents
module.exports.registerAttendance = registerAttendance
module.exports.getAttendancesByDate = getAttendancesByDate
module.exports.getAllAttendance = getAllAttendance
module.exports.getAllEnrolledStudentsInDb = getAllEnrolledStudentsInDb