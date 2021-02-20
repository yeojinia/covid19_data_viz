import deathsFactor from '../../Data/DeathsFactors.json';

import TSNE from "tsne-js";
import React, {useEffect, useState} from "react";
import * as d3 from "d3";
import {Button} from "react-bootstrap";

function simulateNetworkRequest(){
    return new Promise((resolve) => setTimeout(resolve, 500));
}

function ReleaseButton(props){
    const buttonStyle ={
        color: "#fff",
        fontSize: '10px',
        backgroundColor: "#5a6268",
        borderColor: "#6c757d",
        width:"100px",
        height:"30px",
    };

    const [isLoading, setLoading] = useState(false);
    useEffect(() => {
        if(isLoading){
            simulateNetworkRequest().then(() => {
                setLoading(false);
            });
        }
    }, [isLoading]);

    const handleClick = () => {
        setLoading(true);
        releaseBrushes();
    }

    function releaseBrushes () {
        for(var i =0; i<brushes.length-1; i++){
//            d3.select("g#brush-"+i+".brush").remove();
            d3.select("#brush-"+i).remove();
        }
    }

    return(<>
            <Button
                variant ="primary"
                disabled ={isLoading}
                onClick = {!isLoading? handleClick:null}
                style={buttonStyle}>
                {isLoading? 'Releasing...':'Release Brushes' }

            </Button>
        </>
    );
}

// We also keep the actual d3-brush functions and their IDs in a list:
var brushes = [];


export default function DeathsMultiBrushes(props) {
    var keys = [];
    for(let key in props.items){
        if(props.items[key]["id"] !== 'covid19')
            keys.push(props.items[key]["id"]);
    }

    var inputData = [];
    var inputLabel = [];

    for(var i=0; i<deathsFactor.length; i++){

        inputLabel.push(deathsFactor[i]["state"]);
        var examples = [];
        for(var key of keys){
            examples.push(deathsFactor[i][key]);
        }
        inputData.push(examples);
    }

    // inputData;
    let model = new TSNE({
        dim: 2,
        perplexity: 30.0,
        earlyExaggeration: 4.0,
        learningRate: 100.0,
        nIter: 1000,
        metric: 'euclidean'
    });

    model.init({
        data: inputData,
        type: 'dense'
    });

    // note: computation-heavy action happens here
    let [error, iter] = model.run();

// `output` is unpacked ndarray (regular nested javascript array)
    let output = model.getOutput();

// `outputScaled` is `output` scaled to a range of [-1, 1]

    let outputScaled = model.getOutputScaled();
    for(let i=0; i<outputScaled.length; i++){
        outputScaled[i].push(inputLabel[i]);
    }
   // console.log(outputScaled);

    useEffect(() => {
        var margin = {top: 5, right: 30, bottom: 15, left: 30},
            width = 340 - margin.left - margin.right,
            height = 350 - margin.top - margin.bottom;

        d3.select("#pcp-deaths-brush-wrapper>svg").selectAll("g").remove();

        var svg = d3.select("#pcp-deaths-brush-wrapper>svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var side_margin = (width - 0) / (2 * deathsFactor.length);

        // Add X axis
        var x = d3.scaleLinear()
            .range([side_margin, width - side_margin])
            .domain([-1.05, 1.05]);

        var xScaleLabels = d3.scalePoint().domain([-1, 1]).range([side_margin, width - side_margin]);

        svg.selectAll("text")
            .style("text-anchor", "start");

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([-1, 1])
            .range([height, 0]);

        var myCircle = svg.selectAll('g')
            .data(outputScaled)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                //console.log(d[2], "x ", d[0], x(d[0]*1.0));
                return x(d[0] * 1.0);
            })
            .attr("cy", function (d) {
                //console.log(d[2], "y ", d[1], y(d[1]*1.0));
                return y(d[1] * 1.0);
            })
            .attr("r", 6)
            .style("fill", function (d) {
                return "#EE786E"//"red"
            })
            .style("opacity", 0.5);

        //console.log(myCircle);

        var myText = svg.selectAll("g")
            .data(outputScaled)
            .enter()
            .append("text")
            .text(function (d) {
                //console.log(d);
                return d[2]
            })
            .attr("x", function (d) {
                return x(d[0] * 1.0);
            })
            .attr("y", function (d) {
                return y(d[1] * 1.0);
            })
            .style("fill", "black")
            .style("font-size", "10px");

        // Add brushing
        svg.call(d3.brush()                 // Add the brush feature using the d3.brush function
            .extent([[0, 0], [width, height]]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            .on("start brush", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
        )

        // Function that is triggered when brushing is performed
        function updateChart(event) {
            let extent = event.selection

            let selected_data = {};
            let selected_axes = {};
            myCircle.classed("selected", function (d) {
                if (isBrushed(extent, x(d[0] * 1.0), y(d[1] * 1.0)) === true) {
                    selected_axes[d["x_feature"]] = "true";
                    selected_data[d[2]] = "true";
                    //console.log(selected_data);
                    return true;
                } else {
                    return false;
                }
            });
            //props.setSelectedAxes(selected_axes);
            props.setSelectedData(selected_data);
        }

        // A function that return TRUE or FALSE according if a dot is in the selection or not
        function isBrushed(brush_coords, cx, cy) {
            var x0 = brush_coords[0][0],
                x1 = brush_coords[1][0],
                y0 = brush_coords[0][1],
                y1 = brush_coords[1][1];
            return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
        }
    }, []);
    return (
        <div id="pcp-deaths-brush-wrapper" height="400">
            <svg></svg>
        </div>

    );

}