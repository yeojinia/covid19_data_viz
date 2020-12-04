import React, {Component} from 'react';
import {Router, Route, Switch} from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Home from "./Home";
import CovidMain from "./CovidMain";
import OtherVis from "./MyOthers";
import history from "./history";

function App() {

    return (
        <div className="App">
            <div className="main">
                <Router history={history}>
                    <Switch>
                <Route path ="/" exact component={CovidMain}/>
                <Route path ="/Others" component={OtherVis}/>
                    </Switch>
                <Home />
                </Router>
            </div>
        </div>
    );
}

export default App;
