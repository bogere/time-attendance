import React from 'react'
import {BrowserRouter as Router, Switch, Route,Link, Routes } from 'react-router-dom'
import AttendanceList from "./containers/AttendanceList";
import Home from "./containers/Home";


const Navigator = (props)=>{
    return (
       <Router>
          <Routes>
              <Route  path="/" component={Home} />
              <Route path="/attendance" component={AttendanceList} />
           </Routes>
       </Router>
    )
}

export default Navigator
