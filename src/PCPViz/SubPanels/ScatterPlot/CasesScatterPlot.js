import React, { useEffect } from 'react';
import * as d3 from 'd3';
import casesFactor from './../../Data/CasesFactors.json';
import calculateCorrelation from 'calculate-correlation';

var keys = Object.keys(casesFactor[0]);
keys.shift();
var first_axis = keys[0];
var last_axis = keys[keys.length-1];

const CasesScatterPlot = (props) => {

    // set the dimensions and margins of the plot
    var margin = {top: 30, right: 30, bottom: 70, left: 80},
        width = 440 - margin.left - margin.right,
        height = 360 - margin.top - margin.bottom;

    var keys = Object.keys(casesFactor[0]);
    keys.shift();
    var first_axis = keys[0];
    var last_axis = keys[keys.length-1];

    useEffect(() => {
        var hor = props.scatterHorizontal;
        var ver = props.scatterVertical;

        if(hor.horizon === "None" && ver.vert === "None"){
            hor.horizon = first_axis;
            ver.vert = last_axis;
        }

        var data =[];

        var hmax = Number.MIN_SAFE_INTEGER;
        var hmin = Number.MAX_SAFE_INTEGER;
        var vmax = Number.MIN_SAFE_INTEGER;
        var vmin = Number.MAX_SAFE_INTEGER;
        if(hor.horizon !== 'None' && ver.vert !== 'None'){
            Object.keys(casesFactor).forEach(function (idx) {
                //console.log(hor.horizon);
                hmax = Math.max(hmax, casesFactor[idx][hor.horizon]);
                hmin = Math.min(hmin, casesFactor[idx][hor.horizon])
                vmax = Math.max(vmax, casesFactor[idx][ver.vert]);
                vmin = Math.min(vmin, casesFactor[idx][ver.vert])
                data.push([casesFactor[idx][hor.horizon], casesFactor[idx][ver.vert]]);
            });
        }

        const myNode = document.getElementById("cases-sub-scatterplot-vis-right-top");
        if(myNode.firstChild)
            myNode.removeChild(myNode.firstChild);

        // append the svg object to the body of the page
        var svg = d3.select("#cases-sub-scatterplot-vis-right-top")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Add X axis
        var x = d3.scaleLinear()
            .domain([hmin, hmax])
            .range([ 0, width ]);

        if(hmax !== Number.MIN_SAFE_INTEGER && hmin !== Number.MAX_SAFE_INTEGER){
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));
        }

        var text = svg.selectAll("text");
        text.attr("transform","translate(0," + margin.left + ")" )
            .attr("transform","rotate(90)" )
            .style("text-anchor", "start");

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([vmin, vmax])
            .range([ height, 0]);
        if(vmax !== Number.MIN_SAFE_INTEGER && vmin !== Number.MAX_SAFE_INTEGER){
            svg.append("g").call(d3.axisLeft(y));
        }
       // Add dots


        var data1=[], data2=[];
        for(var i=0; i<data.length; i++){
            data1.push(data[i][0]); data2.push(data[i][1]);
        }
        var corr_coef = calculateCorrelation(data1, data2);

        var myColor = 0;

        if(props.colorScheme === "Inferno" ){
            var ColorScale = d3.scaleSequential()
                .interpolator(d3.interpolateInferno)
                .domain([-1, 1]);
            myColor = ColorScale(corr_coef);
        }
        else if(props.colorScheme === "RdBu"){
            var ColorScale2 = d3.scaleSequential()
                .interpolator(d3.interpolateRdBu)
                .domain([-1, 1]);
            myColor = ColorScale2(corr_coef);
        }
        else if(props.colorScheme === "RdYlGn" || props.colorScheme === undefined){
            var ColorScale3 = d3.scaleSequential()
                .interpolator(d3.interpolateRdYlGn)
                .domain([-1, 1]);
            myColor = ColorScale3(corr_coef);
        }
        else{ // if(props.colorScheme === "RdGy")
            var ColorScale4 = d3.scaleSequential()
                .interpolator(d3.interpolateRdGy)
                .domain([-1, 1]);
            myColor = ColorScale4(corr_coef);
        }
        // console.log(hor.horizon , ver.vert);

        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d[0]); } )
            .attr("cy", function (d) { return y(d[1]); } )
            .attr("r", 4.5)
            .style("fill", myColor)
            // .style("fill", "#69b3a2")

    }, [props.scatterHorizontal, props.scatterVertical, props.ColorScheme])

    return (
        <></>
    )
}

export const CasesScatterPlotBottomLabel = (props) => {

    var margin = {top: 30, right: 30, bottom: 50, left: 50};
    var width = 420 - margin.left - margin.right,
        height = 50;

    var keys = Object.keys(casesFactor[0]);
    keys.shift();
    var first_axis = keys[0];
    var last_axis = keys[keys.length-1];

    useEffect(()=>{

        var hor = props.scatterHorizontal;
        var ver = props.scatterVertical;

        if(hor.horizon === "None" && ver.vert === "None"){
            hor.horizon = first_axis;
            ver.vert = last_axis;
        }

        const myNode = document.getElementById("cases-sub-scatterplot-vis-right-bot");
        if(myNode.firstChild)
            myNode.removeChild(myNode.firstChild);

        // append the svg object to the body of the page
        d3.select("#cases-sub-scatterplot-vis-right-bot")
            .append("svg")

        // text label for the x axis
        if(hor.horizon !== 'None') {
            const text = d3.select("#cases-sub-scatterplot-vis-right-bot").select("svg").append("text")
            var name = hor.horizon;
            if(hor.horizon ==='cases') name = 'class';
            text.attr("transform",
                "translate(" + (35 + (width / 2)) + " ," +
                (height/2) + ")")
                .style("text-anchor", "middle")
                .text(name);

        }

    },[props.scatterHorizontal, props.scatterVertical])

    return (
        <></>
    )
}

export const CasesScatterPlotLeftLabel = (props) => {

    var margin = {top: 30, right: 30, bottom: 70, left: 80},
        height = 360 - margin.top - margin.bottom,
        width = 50;

    useEffect(()=>{

        var hor = props.scatterHorizontal;
        var ver = props.scatterVertical;

        if(hor.horizon === "None" && ver.vert === "None"){
            hor.horizon = first_axis;
            ver.vert = last_axis;
        }

        const myNode = document.getElementById("cases-sub-scatterplot-vis-left");
        if(myNode.firstChild)
            myNode.removeChild(myNode.firstChild);

        // append the svg object to the body of the page
        d3.select("#cases-sub-scatterplot-vis-left")
            .append("svg")
            .attr("width",width)
            .attr("height",height);;

        // text label for the y axis
        if(ver.vert !== 'None') {
            var name = ver.vert;
            if(name === "cases") name = "class";
            d3.select("#cases-sub-scatterplot-vis-left").select("svg").append("text")

                .attr("transform", "translate( 30, " + (height/2) + ") rotate(-90)")
                .style("text-anchor", "middle")
                .text(name);
        }

    },[props.scatterHorizontal, props.scatterVertical])

    return (
        <></>
    )
}
export default CasesScatterPlot;