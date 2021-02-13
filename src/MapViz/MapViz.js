import React, {useEffect, useState} from 'react';
import * as d3 from "d3";
import uStates from "./uStates";
import data from './DailyStats091513.json';
import './style.css';


function MapViz(){
    const usMapContainerVis={

    };
    const usMapContainerDetails={

    };
    const refTextStyle= {
        "height": "50px",
        "width": "90%",
        "textAlign": "right",
        "position": "relative"
    }

    const [cstate, setCstate] = useState("cases");
    // onSelect event
    const handleOnSelect = (event) => {
        const value = event.currentTarget.value;
       // console.log(value);
        setCstate(value);

    }

    function tooltipHtml(n, d){	// function to create html content string in tooltip div.
        return "<h4>"+n+"</h4><table>"+
            "<tr><td>Cases</td><td>"+(d.sum)+"</td></tr>"+
            "<tr><td>Deaths</td><td>"+(d.death)+"</td></tr>"+
            "</table>";
    }

    var sampleData ={};	/* Sample random data. */

    data.forEach(function(d){
        if(!cstate.localeCompare("cases")) {
            sampleData[d[""]] = {
                sum: d["sum"], color: d3.interpolate("#ffffcc", "#800026")(+(d["sum"]) / 500000), death: d["death"]
            };
        }
        else{
            sampleData[d[""]] = {
                sum: d["sum"], color: d3.interpolate("#ddc5cc", "#88314b")(+(d["death"]) / 8000), death: d["death"]
            };
        }
    });


    useEffect(() => {

        const usMapElement = d3.select("#my-usmap-viz");
        usMapElement.select("svg").remove();
        usMapElement.append("svg")
            .attr("width", 950)
            .attr("height", 600)
            .append("g")
            .attr("id", "statesmap")

        uStates.draw("#statesmap", sampleData, tooltipHtml);
    }, [cstate])

    return (
        <div className="cases">
            <h2>
                Confirmed Cases / Deaths
            </h2>
                <form>
                    <select cstate={cstate} onChange={handleOnSelect}>
                        <option value ="cases">confirmed cases</option>
                        <option value ="death">deaths</option>
                    </select>
                </form>

            <div className="usmap-container-vis" id="my-usmap-viz" style={usMapContainerVis}>
                <div id = "usmap_tooltip"></div>
            </div>
            <div className="usmap-container-details" style={usMapContainerDetails}> </div>
            <div  style={refTextStyle}> updated 8/26, Source: google Coronavirus disease overview</div>
        </div>
    );
}

export default MapViz;
