import PCPViz from "./PCPViz/PCPViz";
import React from "react";

export default function CovidMain() {

    return (
        <div className="Covid">
            <header className="App-header">
                COVID-19 Data Visualization in USA - MS Capstone Project
            </header>
                <PCPViz/>
        </div>
    );
}