import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./containers/Home";
//import Navigator from "./navigator";


var destination = document.querySelector("#container");

ReactDOM.render(
    <div>
         <Home />
    </div>,
    destination
);