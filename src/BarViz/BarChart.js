import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import ConfirmedCases from './ConfirmedCases3.json';
import TempOverTime from './temperatureOverTime.json';
import HumidOverTime from './humidityOverTime.json';
import {Checkbox} from "rsuite";
import SelectOption from "./SelectOption";

const BarChart = (props) => {
    const ref = useRef()
    const side_margin = 60;
    const bar_width = 800 - 2* side_margin;
    const bar_height = 400 - 2* side_margin;
    var usState = props.usState;
    // console.log(usState);

    useEffect(() => {
       // var state_selected = d3.select("#state_single_select").value()
        const barChartElement = d3.select("#barchart-group-container");

        barChartElement.selectAll('g').remove()

        const chart = barChartElement
            .append('g')
            .attr('transform', `translate(${side_margin}, ${side_margin})`);


        const yScale = d3.scaleLinear()
            .domain([0, d3.max(ConfirmedCases, d => d[usState])])
            .range([bar_height, 0]);

        const yAxisTick = d3.axisLeft(yScale)
            .tickSize(-bar_width);

        const yAxisG = chart.append('g')
            .call(yAxisTick);

        chart.selectAll('path').style('stroke','none');

        const xScale = d3.scaleBand()
            .domain(ConfirmedCases.map(d=> d.date))
            .range([0, bar_width])
            .padding(0.2)

        const formatMonth =  d3.timeFormat('%b-%Y');

        //console.log(formatMonth(ConfirmedCases.map(d=> d.date)));
        const xTickScale = d3.scaleBand()
            //.domain(ConfirmedCases.map(d=> d.date))
            .domain(["March","April","May","June", "July", "August", "September","October","November","December"])
            .range([0, bar_width]);

        const xAxisG = chart.append('g')
            .attr('transform', `translate(0, ${bar_height})`)

        xAxisG.call(d3.axisBottom(xTickScale))
            .selectAll('.tick line');
//            .remove();

        xAxisG.append('text')
            .attr('y', 33)
            .attr('x', bar_width/2)
            .attr('fill','black')
            .style('font-size', '15px')
            .text('Month');

        var barchart = d3.select(".barchart-wrapper")
/*
        d3.select("#usmap_tooltip").html(toolTip(d.n, data[d.id]))
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
*/
        var tooltip = barchart.append("div")
            .attr("class", "label_tip")
            .style("opacity", 0.5)
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")
            .style("position","relative")
            .style("max-width", "200px")
            .style("margin", "auto")

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function(d) {
            tooltip
                .style("opacity", 1)
                .style("left", (d3.pointer(this)[0]) + "px")
                .style("top", (d3.pointer(this)[1]) + "px")
                .style("fill", "grey")
                .html(d.currentTarget.attributes.date.nodeValue + ", cases  " + d.target.attributes.value.value)

            d3.select(this)
                .style("stroke", "black")

        }

        var mousemove = function(d) {
            // console.log(d);
            tooltip
                .style("left", d.target.attributes.x + "px")
                .style("top", (d.target.attributes.y) + "px")
                .style("fill", "grey")
                .html(d.currentTarget.attributes.date.nodeValue + ", cases  " + d.target.attributes.value.value)
        }

        var mouseleave = function(d) {
            tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")

        }

        chart.selectAll()
            //.data(goals)
            .data(ConfirmedCases, function(d) {return d[usState];})
            .enter()
            .append('rect')
            .style('fill','orange')
            .attr('x', (s) => xScale(s.date))
            .attr('y', (s) => yScale(s[usState]))
            .attr('height', (s) => bar_height - yScale(s[usState]))
            .attr('width', xScale.bandwidth())
            .attr('value', (s) => s[usState])
            .attr('date', s => s.date)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

        chart.selectAll()
            //.data(goals)
            .data(TempOverTime, function(d) {return d[usState];})
            .enter()
            .append('rect')
            .style('fill','Red')
            .attr('x', (s) => xScale(s.date))
            .attr('y', (s) => yScale(s[usState]))
            .attr('height', (s) => bar_height - yScale(s[usState]))
            .attr('width', xScale.bandwidth())
            .attr('value', (s) => s[usState])
            .attr('date', s => s.date)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

        chart.selectAll()
            //.data(goals)
            .data(HumidOverTime, function(d) {return d[usState];})
            .enter()
            .append('rect')
            .style('fill','Green')
            .attr('x', (s) => xScale(s.date))
            .attr('y', (s) => yScale(s[usState]))
            .attr('height', (s) => bar_height - yScale(s[usState]))
            .attr('width', xScale.bandwidth())
            .attr('value', (s) => s[usState])
            .attr('date', s => s.date)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

    }, [usState])


    return (
        <svg height="0" width="5"></svg>
    )
}

export default BarChart;