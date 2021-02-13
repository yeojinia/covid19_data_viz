import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import casesFactor from './../../Data/CasesFactors.json';

const DeathsScatterPlot = (props) => {

    // set the dimensions and margins of the plot
    var margin = {top: 30, right: 30, bottom: 70, left: 80},
        width = 440 - margin.left - margin.right,
        height = 360 - margin.top - margin.bottom;

    useEffect(() => {
        var hor = props.scatterHorizontal;
        var ver = props.scatterVertical;

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

        const myNode = document.getElementById("deaths-sub-scatterplot-vis");
        if(myNode.firstChild)
            myNode.removeChild(myNode.firstChild);

        // append the svg object to the body of the page
        var svg = d3.select("#deaths-sub-scatterplot-vis")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        // text label for the x axis
        if(hor.horizon !== 'None') {
            const text = d3.select("#deaths-sub-scatterplot-vis").select("svg").append("text")
            text.attr("transform",
                "translate(" + (35 + (width / 2)) + " ," +
                (height + margin.top + 55) + ")")
                .style("text-anchor", "middle")
                .text(hor.horizon);
        }

        // text label for the y axis
        if(ver.vert !== 'None') {
            d3.select("#deaths-sub-scatterplot-vis").select("svg").append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 110 - margin.left)
                .attr("x", -20 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text(ver.vert);
        }


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
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d[0]); } )
            .attr("cy", function (d) { return y(d[1]); } )
            .attr("r", 1.5)
            .style("fill", "#69b3a2")

    }, [props.scatterHorizontal, props.scatterVertical])

    return (
        <></>
    )
}

export default DeathsScatterPlot;