import PCPViz from "./PCPViz/PCPViz";
import BarViz from "./BarViz/BarViz";
import MapViz from "./MapViz/MapViz";
import HeatMapViz from "./HeatMapViz/HeatMapViz";
import SphericalPCPViz from "./ExtraPCP/SphericalPCP";
import CylindricalPCPViz from "./ExtraPCP/CylindricalPCP";
import Home from "./Home";
import React from "react";
import TestText from "./ExtraPCP/TestText";

export default function CovidMain() {

    return (
        <div className="Covid">
            <header className="App-header">
                COVID-19 Data Visualization in USA
            </header>

                <PCPViz></PCPViz>
                {/*<BarViz></BarViz>*/}
                {/*<MapViz></MapViz>*/}
                {/*<HeatMapViz></HeatMapViz>*/}
                {/*<SphericalPCPViz></SphericalPCPViz>*/}
                {/*<CylindricalPCPViz></CylindricalPCPViz>*/}
                {/*<TestText></TestText>*/}

        </div>
    );
}