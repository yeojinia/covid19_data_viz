import PCPViz from "./PCPViz/PCPViz";
import BarViz from "./BarViz/BarViz";
import MapViz from "./MapViz/MapViz";
import HeatMapViz from "./HeatMapViz/HeatMapViz";
import Home from "./Home";
import React from "react";


export default function CovidMain() {

    return (
        <div className="Covid">
            <header className="App-header">
                COVID-19 Data Visualization in USA
            </header>

                <PCPViz></PCPViz>
                <BarViz></BarViz>
                <MapViz></MapViz>
                <HeatMapViz></HeatMapViz>
        </div>
    );
}