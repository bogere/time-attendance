const {app, BrowserWindow, Menu,shell, ipcMain, globalShortcut, 
    dialog, nativeImage
}  = require('electron')

const path = require('path');
const isDev = require('electron-is-dev');
const { sqlite3 } = require('sqlite3');
const Promise = require('bluebird');

const {
    enrollStudents, registerAttendance, getAllAttendance,
     getAttendancesByDate,getAllEnrolledStudentsInDb
} = require('../backend/attendance')

let mainWindow;

function createWindow() {
    var image = nativeImage.createFromPath('favicon.png'); 
    image.setTemplateImage(true);

    mainWindow = new BrowserWindow({
        width: 900,
        height: 680,
        webPreferences: {
            nodeIntegration: true
        },
        icon: image
    });
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
    if (isDev) {
        // Open the DevTools.
        //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
        mainWindow.webContents.openDevTools();
    }

    mainWindow.setMenu(null);
    mainWindow.on('closed', () => mainWindow = null);

    //yeah start listening to the events from here.
    ipcMain.on('enroll-students', (evt,data)=>{
        enrollStudents(data)
               .then(result=>{
                   evt.sender.send('after-enroll-students', result)
             })
             .catch(err=>{
                  evt.sender.send('after-enroll-students', 'error')
            })
    })

    ipcMain.on('register-attendance', (evt,data)=>{
        registerAttendance()
           .then(result=>{
              evt.sender.send('after-register-attendance', result)
           })
           .catch(err=>{
              evt.sender.send('after-register-attendance', 'error')
           })
    })

    ipcMain.on('fetch-attendance', (evt,data)=>{
        getAllAttendance(data)
           .then(result=>{
              evt.sender.send('after-fetch-attendance', result)
           })
           .catch(err=>{
              evt.sender.send('after-fetch-attendance', 'error')
           })
    })

    ipcMain.on('fetch-students', (evt,data)=>{
        getAllEnrolledStudentsInDb(data)
           .then(result=>{
              evt.sender.send('after-fetch-students', result)
           })
           .catch(err=>{
              evt.sender.send('after-fetch-students', 'error')
           })
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});