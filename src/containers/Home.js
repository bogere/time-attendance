import React, {useState, useEffect, Component} from "react";
import MenuButton from "./MenuButton";
import Attendance from "../components/Attendance";
import Persons from "../components/Persons";


const {ipcRenderer} = window.require('electron')

class Home extends Component{
    constructor(props){
        super(props)
        this.state = {
           attendanceList: [],
           students: [],
           screen: 'Home'
        }

        this.startEnrollment = this.startEnrollment.bind(this)
        this.registerAttendance = this.registerAttendance.bind(this)
        this.getAllAttendance = this.getAllAttendance.bind(this)
        this.getAllEnrolledStudents = this.getAllEnrolledStudents.bind(this)
        this.goBackButton = this.goBackButton.bind(this)

    }
 
    startEnrollment(){
        console.log('test enrollment')
        ipcRenderer.send('enroll-students', 'start-command');
        ipcRenderer.on('after-enroll-students', (evt,data)=>{
            if (data === 'error') {
                alert('Failed to enroll the students from the attendance machine')
            } else {
               alert(data)
            }
        }) 
    }


    registerAttendance(){
        console.log('test attendance')
        ipcRenderer.send('register-attendance', 'start-command');
        ipcRenderer.on('after-register-attendance', (evt,data)=>{
            if (data === 'error') {
                alert('Failed to retrieve attendance data from the attendance machine')
            } else {
               alert(JSON.stringify(data))
            }
        }) 
    }

    getAllAttendance(){
        ipcRenderer.send('fetch-attendance', 'start-command');
        ipcRenderer.on('after-fetch-attendance', (evt,data)=>{
            if (data === 'error') {
                alert('Failed to retrieve attendance data from the database')
            } else {
               //alert('successful retrieved attendance data from machine')
               this.updateScreenState('attendance')
               this.setState({attendanceList: data })
            }
        })  
    }

    getAllEnrolledStudents(){
        ipcRenderer.send('fetch-students', 'start-command');
        ipcRenderer.on('after-fetch-students', (evt,data)=>{
            if (data === 'error') {
                alert('Failed to retrieve students  data from the database')
            } else {
               //alert('successful retrieved students data from machine')
               console.log('enrolled students', data)
               this.updateScreenState('students')
               this.setState({students : data })
            }
        })  
    }

    goBackButton(){
        this.updateScreenState('Home')
    }

    updateScreenState(screen){
       this.setState({
        screen: screen
       })
    }

    
     
    render(){

        const {screen, attendanceList, students} = this.state
        if(screen === 'Home'){
            return (
        
            <MenuButton
                startEnrollment = {this.startEnrollment}
                registerAttendance = {this.registerAttendance}
                getAllAttendance = {this.getAllAttendance}
                getAllEnrolledStudents = {this.getAllEnrolledStudents}
              /> 
            )
        }else if (screen === 'attendance') {
            return (
                <Attendance  
                   items = {attendanceList}
                   goBackButton = {this.goBackButton}
                />
            )
        }else if(screen === 'students'){
             return (
                <Persons 
                  items = {students} 
                  goBackButton = {this.goBackButton}
                  />
             )
        } else{
            return (
                <h4>Yes see attendance </h4>
            )
        }

       
    }
}

export default Home