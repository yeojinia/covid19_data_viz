import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import {scaleBand} from 'd3-scale';
import casesFactor from './../../Data/CasesFactors.json';
import calculateCorrelation from 'calculate-correlation';
import {unmountComponentAtNode} from "react-dom";

var data = [];

const correlation = (casesFactor) => {

    if(data.length > 0) return data;

    var keys = Object.keys(casesFactor[0]);
    keys.shift();

    for(var idx =0; idx<keys.length; idx++) {
        for(var jdx =0; jdx<keys.length; jdx++) {
            let data1 = [];
            let data2 = [];
            Object.keys(casesFactor).forEach(function (key) {
                let elem = {};
                data1.push(casesFactor[key][keys[idx]]);
                data2.push(casesFactor[key][keys[jdx]]);
                // data[keys[idx]+'&'+keys[idx+1]] = calc_pearson_corr(data1, data2) ;
                elem['group'] = keys[idx];
                elem['variable'] = keys[jdx];
                elem['value'] = calc_pearson_corr(data1, data2);
                data.push(elem);
            });
        }
    }

    return data;

};

const calc_pearson_corr = (data1, data2) => {
    return calculateCorrelation(data1, data2);
};

const colorSelector = () => {

    var width_ = 60,
        height_ = 30;

    // d3.select("#color-interpolation-scheme1")
    //     .text("Inferno")
    //     .append("input")
    //     .attr("type", "radio")
    //     .attr("name", "color-scheme")
    //     .attr("value", "Inferno");

    var svg = d3.select("#color-interpolation-scheme1")
        .append("svg")
        .attr("id","color-scheme1")
        .attr("width", width_)
        .attr("height", height_)
        .append("g");

    var colorScale = d3.scaleSequential(d3.interpolateInferno)
        .domain([0, width_])

    var bars = svg.selectAll(".bars")
        .data(d3.range(width_), function(d) { return d; })
        .enter().append("rect")
        .attr("class", "bars")
        .attr("x", function(d, i) { return i; })
        .attr("y", 0)
        .attr("height", height_)
        .attr("width", 1)
        .style("fill", function(d, i ) { return colorScale(d); })

    // d3.select("#color-interpolation-scheme2")
    //     .text("RdBu  ")
    //     .append("input")
    //     .attr("type", "radio")
    //     .attr("name", "color-scheme")
    //     .attr("value", "RdBu");

    var svg2 = d3.select("#color-interpolation-scheme2")
        .append("svg")
        .attr("id","color-scheme2")
        .attr("width", width_)
        .attr("height", height_)
        .append("g");

    var colorScale2 = d3.scaleSequential(d3.interpolateRdBu)
        .domain([0, width_])

    var bars2 = svg2.selectAll(".bars")
        .data(d3.range(width_), function(d) { return d; })
        .enter().append("rect")
        .attr("class", "bars")
        .attr("x", function(d, i) { return i; })
        .attr("y", 0)
        .attr("height", height_)
        .attr("width", 1)
        .style("fill", function(d, i ) { return colorScale2(d); })

    // d3.select("#color-interpolation-scheme3")
    //     .text("RdYlGn")
    //     .append("input")
    //     .attr("type", "radio")
    //     .attr("name", "color-scheme")
    //     .attr("value", "RdYlGn");

    var svg3 = d3.select("#color-interpolation-scheme3")
        .append("svg")
        .attr("id","color-scheme3")
        .attr("width", width_)
        .attr("height", height_)
        .append("g");

    var colorScale3 = d3.scaleSequential(d3.interpolateRdYlGn)
        .domain([0, width_])

    var bars3 = svg3.selectAll(".bars")
        .data(d3.range(width_), function(d) { return d; })
        .enter().append("rect")
        .attr("class", "bars")
        .attr("x", function(d, i) { return i; })
        .attr("y", 0)
        .attr("height", height_)
        .attr("width", 1)
        .style("fill", function(d, i ) { return colorScale3(d); })

    // d3.select("#color-interpolation-scheme4")
    //     .text("RdGy ")
    //     .append("input")
    //     .attr("type", "radio")
    //     .attr("name", "color-scheme")
    //     .attr("value", "RdGy");

    var svg4 = d3.select("#color-interpolation-scheme4")
        .append("svg")
        .attr("id","color-scheme4")
        .attr("width", width_)
        .attr("height", height_)
        .append("g");

    var colorScale4 = d3.scaleSequential(d3.interpolateRdGy)
        .domain([0, width_])

    var bars4 = svg4.selectAll(".bars")
        .data(d3.range(width_), function(d) { return d; })
        .enter().append("rect")
        .attr("class", "bars")
        .attr("x", function(d, i) { return i; })
        .attr("y", 0)
        .attr("height", height_)
        .attr("width", 1)
        .style("fill", function(d, i ) { return colorScale4(d); })

};

const CasesHeatMapViz = (props) => {
    const ref = useRef()

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 50, bottom: 70, left: 180},
        width = 510 - margin.left - margin.right,
        height = 410 - margin.top - margin.bottom;

    var keys = Object.keys(casesFactor[0]);
    keys.shift();
    correlation(casesFactor);

    useEffect(() => {

        d3.select("#casesheatmapvis").remove();
        d3.select("#color-scheme1").remove();
        d3.select("#color-scheme2").remove();
        d3.select("#color-scheme3").remove();
        d3.select("#color-scheme4").remove();

        colorSelector();

        const heatMapElement = d3.select("#cases-sub-heatmap-vis")
            .append("svg")
            .attr("id","casesheatmapvis")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top +")" )
            .style("text-anchor", "end")

        // Build X scales and axis
        var x = scaleBand()
            .range([0, width])
            .domain(data.map(d=>d.group))
            .padding(0.05);

        heatMapElement.append("g")
            .style("fond-size", 8)
            .attr("transform", "translate(0, " + height + ")")
            .call(d3.axisBottom(x).tickSize(0))
            .select(".domain").remove()

        heatMapElement
            .selectAll("text")
            .attr("transform","rotate(90)" )
            .style("text-anchor", "start")

        // Build Y scales and axis
        var y = scaleBand()
            .range([height, 0])
            .domain(data.map(d=>d.variable))
            .padding(0.05)

        heatMapElement.append("g")
            .style("font-size", 10)
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain")
            .remove()

        // heatMapElement.selectAll("text")
        //     .attr("font-weight","bold")
        //     .style('fill', function(d) {if(d =="COVID-19(U071)") return 'red'})
        //interpolateCubehelixDefault
        var myColor = d3.scaleSequential()
            .interpolator(d3.interpolateRdBu)
            .domain([-1, 1]);

        if(props.colorScheme == "Inferno"){
            myColor = d3.scaleSequential()
                .interpolator(d3.interpolateInferno)
                .domain([-1, 1]);
        }
        else if(props.colorScheme == "RdBu"){
            myColor = d3.scaleSequential()
                .interpolator(d3.interpolateRdBu)
                .domain([-1, 1]);
        }
        else if(props.colorScheme == "RdYlGn"){
            myColor = d3.scaleSequential()
                .interpolator(d3.interpolateRdYlGn)
                .domain([-1, 1]);
        }
        else if(props.colorScheme == "RdGy"){
            myColor = d3.scaleSequential()
                .interpolator(d3.interpolateRdGy)
                .domain([-1, 1]);
        }


        var tooltip = d3.select("#cases-sub-heatmap-vis")
            .append("div")
            .style("opacity", 0)
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")
            .style("max-width", "50px")
            // .style("margin-width", "300px")

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function(d) {
            // tooltip
            //     .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
        }

        var mousemove = function(d) {

            // tooltip
            //     .html("correlation coefficient: " + d.target.attributes.value.value) /*  <br> new line  */
            //     .style("left", (d3.pointer(this)[0]+80) + "px")
            //     .style("top", (d3.pointer(this)[1]) + "px")
            //     .style("align-items", 'center')
        }

        var mouseleave = function(d) {
            // tooltip
            //     .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.8)
        }

        var click = function(d){
            props.setScatterHorizontal({"horizon":d.target.attributes.horizontal.value});
            props.setScatterVertical({"vert":d.target.attributes.vertical.value});
        }

        heatMapElement.selectAll()
            .data(data, function(d) {return d.group+':'+d.variable;})
            .enter()
            .append("rect")
            .attr("x", function(d) { return x(d.group) })
            .attr("y", function(d) { return y(d.variable) })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("horizontal", function(d) {return d.group})
            .attr("vertical", function(d) {return d.variable})
            .attr("width", x.bandwidth() )
            .attr("height", y.bandwidth() )
            .attr("value", function(d) {return d.value})
            .style("fill", function(d) { return myColor(d.value)} )
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .on("click", click)


    }, [data, props.colorScheme])

    return (
        <>
            {/*<div className="radio">*/}
            {/*    <label>*/}
            {/*        <input*/}
            {/*            type="radio"*/}
            {/*            value="Female"*/}
            {/*            // checked={this.state.selectedOption === "Female"}*/}
            {/*            // onChange={this.onValueChange}*/}
            {/*        />*/}
            {/*        Female*/}
            {/*    </label>*/}
            {/*</div>*/}
        </>
    )
}

export default CasesHeatMapViz;
