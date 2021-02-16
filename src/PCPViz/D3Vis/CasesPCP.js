import React, {useEffect} from 'react';
import * as d3 from 'd3';
import casesFactor from "../Data/CasesFactors.json";
import {ChooseAxes} from "../ThreeJSVis/CasesParallelCoordinates";
import MutualInfo from "../Data/MutualInfo.json";
import MI from "../Data/MutualInfo.json";
import {CorrelationMatrix} from "../DataProcessing/CorrelationTable";

let [labels, corrMat] = CorrelationMatrix(casesFactor);

var caseObj = {};
corrMat.forEach(function (item) {
    if (item["x_feature"] === "cases") {
        caseObj[item["y_feature"]] = item["coeff"];
    }

});

export function OptAxes(corrSlider, corrThreshold, miSlider, miThreshold) {

    var axesChosen = {};
    if (corrSlider === false) {
        for (var pos in caseObj) {
            if (1 - Math.abs(caseObj[pos]) <= corrThreshold["corrThreshold"]){ // && pos !== "cases") {
                axesChosen[pos] = caseObj[pos];
            }
        }
    } else if (miSlider === false) {
        var mi_max = Math.max.apply(Math, MutualInfo.map(function (o) {
            return o.mutualInfo
        }));
        for (var pos in MI) {
            if (MI[pos]["mutualInfo"] >= miThreshold["miThreshold"]) {
                axesChosen[MI[pos]["label"]] = MI[pos]["mutualInfo"];
            }
        }
    }

    if (+(Object.keys(axesChosen).length) < 2) {
        return {};
    }
    return axesChosen;
}

export function AxesNumericalRange(data, axesChosen) {
    var minimums = {};
    var maximums = {};
    Object.keys(axesChosen).forEach(function (item, index) {
        minimums[item] = (Math.min.apply(null, data.map((v) => v[item])));
        maximums[item] = (Math.max.apply(null, data.map((v) => v[item])));
    });
    return [minimums, maximums];
}

export default function CasesPCP(props) {

    const side_margin = 60;
    const cases_pcp_width = 800 - 2* side_margin;
    const cases_pcp_height = 500 - 2* side_margin;

    var keys = Object.keys(casesFactor[0]);
    keys.shift();

    var formatDecimalComma = d3.format(",.2f");

    var minimums = {};
    var maximums = {};
    Object.keys(keys).forEach(function (item, index) {
        minimums[keys[item]] = (Math.min.apply(null, casesFactor.map((v) => v[keys[item]])));
        maximums[keys[item]] = (Math.max.apply(null, casesFactor.map((v) => v[keys[item]])));
    });

    useEffect(() => {
        let svg = d3.select(".cases-pcp-d3-wrapper")
            .append("svg")
            .attr("width", cases_pcp_width)
            .attr("height", cases_pcp_height+100);

        let dimensions = Object.keys(casesFactor[0]).filter(function(d){return d!="states"});

        var y = {}
        for(var i in dimensions){
            var name = dimensions[i];
            y[name] = d3.scaleLinear()
                .domain(d3.extent(casesFactor, function(d){return +d[name];}))
                .range([cases_pcp_height, 0])
        }

        const yScale = d3.scaleLinear()
            .domain(keys.length)
            .range([cases_pcp_height, 0]);

        svg.selectAll('path').style('stroke', 'none');

        const xScale = d3.scaleBand()
            .domain(keys)
            .range([0, cases_pcp_width])
            .padding(0.2)

        svg.selectAll()
            .data(keys, function (d) {
                return d;
            })
            .enter()
            .append('rect')
            .style('fill', '#0d98ba')
            .attr('x', (s) => xScale(s))
            .attr('y', (s) => 0)
            .attr('height', (s) => cases_pcp_height)
            .attr('width', xScale.bandwidth()/5);

        svg.selectAll()
            .data(keys, function (d) {
                return d;
            })
            .enter()
            .append("g")
            .attr("transform", function(d){return "translate("+xScale(d)+","+cases_pcp_height+") rotate(90)";})
            .append("text")
            .text(function(d){return d;})
            .style("fill", "black")

        svg.selectAll()
            .data(keys, function (d) {
                return d;
            })
            .enter()
            .append("g")
            .attr("transform", function(d){return "translate("+xScale(d)+","+cases_pcp_height+") rotate(90)";})
            .append("text")
            .text(function(d){return formatDecimalComma(minimums[d]);})
            .style("fill", "black")

        svg.selectAll()
            .data(keys, function (d) {
                return d;
            })
            .enter()
            .append("g")
            .attr("transform", function(d){return "translate("+xScale(d)+",0) rotate(90)";})
            .append("text")
            .text(function(d){return formatDecimalComma(maximums[d]);})
            .style("fill", "black")

        // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
        function path(d) {
            return d3.line()(dimensions.map(function(p) { return [xScale(p), y[p](d[p])]; }));
        }

        svg.selectAll()
            .data(casesFactor, function(d) {
                return d;
            })
            .enter().append("path")
            .attr("d", path)
            .style("fill", "none")
            .style("stroke","#A2CCB6")
            .style("opacity", 0.5)
    },[])

    return(
        <div className="cases-pcp-d3-wrapper" width="800px" height="500px" >
        </div>
    );

}