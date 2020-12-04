import React, {useEffect} from 'react';
import * as d3 from 'd3';
import casesFactor from '../CasesFactors.json';
import {CorrelationMatrix} from "../DataProcessing/CorrelationTable";
import TSNE from 'tsne-js';
import init from "../WebGL/Init";
import AxesScrollingList from "./AxesControlUI.js";
import disease_correlation from "../../HeatMapViz/DiseaseCorr2.json";
import Axes from "./../PCPComponent/Axes";

export default function CovidCasesBrush(props) {
   // console.log(props.items);

    var keys = [];
    for(let key in props.items){
        if(props.items[key]["id"] !== 'cases')
            keys.push(props.items[key]["id"]);
    }

    var inputData = [];
    var inputLabel = [];
    for(var i=0; i<casesFactor.length; i++){
        inputLabel.push(casesFactor[i]["states"]);
        var examples = [];
        for(var key of keys){
            examples.push(casesFactor[i][key]);
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

    // rerun without re-calculating pairwise distances, etc.
  //  let [error, iter] = model.rerun();

// `output` is unpacked ndarray (regular nested javascript array)
    let output = model.getOutput();

// `outputScaled` is `output` scaled to a range of [-1, 1]

    let outputScaled = model.getOutputScaled();
   // console.log(outputScaled);
    for(let i=0; i<outputScaled.length; i++){
        outputScaled[i].push(inputLabel[i]);
    }
 //   console.log(outputScaled);

    useEffect(() => {
        var margin = {top: 5, right: 30, bottom: 15, left: 30},
            width = 340 - margin.left - margin.right,
            height = 350 - margin.top - margin.bottom;

        d3.select("#pcp-cases-brush-wrapper>svg").selectAll("g").remove();

        var svg = d3.select("#pcp-cases-brush-wrapper>svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // console.log(correlation_info);
        // var side_margin = (width - 0)/(2 * props.items.length);
        var side_margin = (width - 0) / (2 * casesFactor.length);

        // Add X axis
        var x = d3.scaleLinear()
            .range([side_margin, width - side_margin])
            .domain([-1.05, 1.05]);

        var xScaleLabels = d3.scalePoint().domain([-1, 1]).range([side_margin, width - side_margin]);

        // svg.append("g")
        //     .attr("transform", "translate(0,  "+ height+" )")
        //     .call(d3.axisBottom(xScaleLabels));

        svg.selectAll("text")
            .style("text-anchor", "start");

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([-1, 1])
            .range([height, 0]);

        // svg.append("g")
        //     .attr("transform", "translate(" + 0 + ", 0 )")
        //     .call(d3.axisLeft(y));


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
                return "red"
            })
            .style("opacity", 0.5);

        console.log(myCircle);

        var myText = svg.selectAll("g")
            .data(outputScaled)
            .enter()
            .append("text")
            .text(function (d) {
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


        // var selected_axes ={};
        // var selected_axes = props.selectedAxes;
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
//    }, [props.items]);

    return (
        <div id="pcp-cases-brush-wrapper" height="400">
            <svg></svg>
        </div>

    );
}

// var margin = {top: 5, right: 30, bottom: 15, left: 30},
//     width = 340 - margin.left - margin.right,
//     height = 350 - margin.top - margin.bottom;
//
// d3.select("#pcp-cases-brush-wrapper>svg").selectAll("g").remove();
//
// var svg = d3.select("#pcp-cases-brush-wrapper>svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform",
//         "translate(" + margin.left + "," + margin.top + ")");
//
// // console.log(props.items);
// let [labels, corrMat] = CorrelationMatrix(casesFactor);
// let correlation_info = [];
// var id_list = [];
// for (let i = 0; i < props.items.length; i++) {
//     //console.log(corrMat);
//     id_list.push(props.items[i]["id"] );
//     //  console.log(props.items[i]);
//     for (let j = 0; j < corrMat.length; j++) {
//         //    console.log(props.items[i]["id"], corrMat[j]["x_feature"]);
//         if (props.items[i]["id"] === corrMat[j]["x_feature"]){ // && props.items[i]["id"] !== corrMat[j]["y_feature"]) {
//             corrMat[j]["x"] = i+1 ;
//             corrMat[j]["y"] = corrMat[j]["coeff"];
//             correlation_info.push(corrMat[j]);
//         }
//     }
// }

// console.log(correlation_info);
// var side_margin = (width - 0)/(2 * props.items.length);
// var side_margin = (width - 0)/(2 * casesFactor.length);
//
// // Add X axis
// var x = d3.scaleLinear()
//     .range([side_margin, width - side_margin])
//     .domain([1, props.items.length]);
//
// console.log(id_list);
// var xScaleLabels = d3.scalePoint().domain(id_list).range([side_margin, width - side_margin]);
//
// svg.append("g")
//     .attr("transform", "translate(0",  height + ")")
//     .call(d3.axisBottom(xScaleLabels));
//
// svg.selectAll("text")
//     .attr("transform", "rotate(90)")
//     .style("text-anchor", "start");
//
// // Add Y axis
// var y = d3.scaleLinear()
//     .domain([-1, 1])
//     .range([height, 0]);
//
// svg.append("g")
//     .attr("transform", "translate(" + 0 + ", 0 )")
//     .call(d3.axisLeft(y));
//
// var myCircle = svg.selectAll('g')
//     .data(correlation_info)
//     .enter()
//     .append("circle")
//     .attr("cx", function (d) {
//         return x(+d["x"]);
//     })
//     .attr("cy", function (d) {
//         return y(d["coeff"]);
//     })
//     .attr("r", 8)
//     .style("fill", function (d) {
//         return "red"
//     })
//     .style("opacity", 0.5);
//
// // var selected_axes ={};
// // var selected_axes = props.selectedAxes;
// // Add brushing
// svg.call(d3.brush()                 // Add the brush feature using the d3.brush function
//     .extent([[0, 0], [width, height]]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
//     .on("start brush", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
// )
//
// // Function that is triggered when brushing is performed
// function updateChart(event) {
//     let extent = event.selection
//
//     let selected_axes = {};
//     myCircle.classed("selected", function (d) {
//         if (isBrushed(extent, x(+d["x"]), y(+d["coeff"])) === true) {
//             selected_axes[d["x_feature"]] = "true";
//             return true;
//         } else {
//             return false;
//         }
//     });
//     props.setSelectedAxes(selected_axes);
// }
//
// // A function that return TRUE or FALSE according if a dot is in the selection or not
// function isBrushed(brush_coords, cx, cy) {
//     var x0 = brush_coords[0][0],
//         x1 = brush_coords[1][0],
//         y0 = brush_coords[0][1],
//         y1 = brush_coords[1][1];
//     return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
// }
// }, [props.items]);
//
// return (
//     <div id="pcp-cases-brush-wrapper" height="400">
//         <svg></svg>
//     </div>
//
// );