import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import {scaleBand} from 'd3-scale';
//import {mouse} from 'd3-selection';
import disease_correlation from './DiseaseCorr2.json';

const HeatMap = () => {
    const ref = useRef()
    //var myGroups = disease_correlation.map(data => {return data.group;}).keys()
    //var myVar = disease_correlation.map(data =>{return data.variables;}).keys()

    // set the dimensions and margins of the graph
    var margin = {top: 80, right: 100, bottom: 410, left: 450},
        width = 1200 - margin.left - margin.right,
        height = 1200 - margin.top - margin.bottom;

    useEffect(() => {
        //const svgElement = d3.select(ref.current)

        const heatMapElement = d3.select("#my_dataviz")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top +")" )
            .style("text-anchor", "end")

       // console.log(heatMapElement)
            //.style('fill', function(d) { console.log(d)})

        // Build X scales and axis
        var x = scaleBand()
            .range([0, width])
            .domain(disease_correlation.map(d=>d.group))
            .padding(0.05)


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
            .domain(disease_correlation.map(d=>d.variable))
            .padding(0.05)

        heatMapElement.append("g")
            .style("font-size", 10)
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain")
            .remove()

        heatMapElement.selectAll("text")
            .attr("font-weight","bold")
            .style('fill', function(d) {if(d =="COVID-19(U071)") return 'red'})

        var myColor = d3.scaleSequential()
            .interpolator(d3.interpolateInferno)
            .domain([-1, 1])

        var tooltip = d3.select("#my_dataviz")
            .append("div")
            .style("opacity", 0)
            // .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")
            .style("max-width", "450px")
            .style("margin-width", "300px")

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function(d) {
            tooltip
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
        }

        var mousemove = function(d) {
           // console.log(d);
            tooltip
                .html("The correlation coefficient value of this cell is: " + d.target.attributes.value.value) /*  <br> new line  */
                .style("left", (d3.pointer(this)[0]+80) + "px")
                .style("top", (d3.pointer(this)[1]) + "px")
                .style("align-items", 'center')

        }

        var mouseleave = function(d) {
            tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.8)
        }

        // add the squares
        heatMapElement.selectAll()
            .data(disease_correlation, function(d) {return d.group+':'+d.variable;})
            .enter()
            .append("rect")
            .attr("x", function(d) { return x(d.group) })
            .attr("y", function(d) { return y(d.variable) })
            .attr("rx", 4)
            .attr("ry", 4)
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

        /*svgElement.append("circle")
            .attr("cx", 150)
            .attr("cy", 70)
            .attr("r",  50)*/
    }, [])


    return (
        <svg height = "0" width ="0"
             ref={ref}
        ></svg>
    )
}

export default HeatMap;
