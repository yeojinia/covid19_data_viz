import React, {useState} from 'react';
import BarChart from "./BarChart";
import * as d3 from "d3";
import SelectOption from "./SelectOption";
import cases from './ConfirmedCases2.json';
import {Checkbox} from "rsuite";

function BarViz() {

    // state-variable & setter
    const [usState, setUSState] = useState("OR");
    // onSelect event
    const handleOnSelect = (event) => {
        const value = event.currentTarget.value;
        console.log(value);
        setUSState(value);
    }
    const dailyChanges = {
        margin: "auto",
    };
    const barchartContainerStyle = {
        border: "1px solid #ccc"
    };
    const refTextStyle= {
        "height": "50px",
        "width": "90%",
        "text-align": "right",
        "position": "relative"
    }

    return (
        <div className="daily-changes" style={dailyChanges}>
            <h2>
                Daily Changes,
                State :{usState}
            </h2>

            <div className="interaction-container" width="500px">
                <div className="interaction-container-slider">
                </div>

                <div className="interaction-container-state-select">
                    {/*send the state-value and onSelect*/}
                    <SelectOption usState={usState} handleOnSelect={handleOnSelect}></SelectOption>
                    <Checkbox style={{float:"left"}}> Temperature </Checkbox>
                    <Checkbox style={{float:"left"}}> Humidity </Checkbox>
                </div>

            </div>
            &nbsp;
            <div className="barchart-container" >
                <div className="barchart-wrapper" width="800px" height="400px" >
                    <svg id="barchart-group-container" width="800px" height="400px" style={barchartContainerStyle} > </svg>
                    <BarChart usState={usState}></BarChart>
                </div>
                {/*send the state-value*/}

            </div>

        </div>
    );
}

export default BarViz;
