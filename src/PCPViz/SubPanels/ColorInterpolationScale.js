import React, {useEffect} from "react";
import * as d3 from "d3";

var width_ = 40,
    height_ = 410;

var inferno = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([0, width_]);

var rdBu = d3.scaleSequential()
    .interpolator(d3.interpolateRdBu)
    .domain([0, width_]);

var rdYlGn = d3.scaleSequential()
    .interpolator(d3.interpolateRdYlGn)
    .domain([0, width_]);

var rdGy = d3.scaleSequential()
    .interpolator(d3.interpolateRdGy)
    .domain([0, width_]);

const ColorScale = (colorScheme) => {

    d3.select("#color-scheme-vis").remove();

    var svg = d3.select("#color-interpolator")
        .append("svg")
        .attr("id", "color-scheme-vis")
        .attr("width", width_)
        .attr("height", height_)
        .append("g");

    var colorScale = d3.scaleSequential(d3.interpolateInferno)
        .domain([0, width_])

    if(colorScheme === "Inferno" || colorScheme === undefined){
        colorScale = inferno;
    }
    if(colorScheme === "RdBu"){
        colorScale = rdBu;
    }
    else if(colorScheme === "RdYlGn"){
        colorScale = rdYlGn
    }
    else if(colorScheme === "RdGy"){
        colorScale = rdGy;
    }

    svg.selectAll(".bars")
        .data(d3.range(height_), function (d) {
            return d;
        })
        .enter().append("rect")
        .attr("class", "bars")
        .attr("x", function (d, i) {
            return 0;
        })
        .attr("y", function (d, i) {
            return (10*i);
        })
        .attr("height", 10)
        .attr("width", width_)
        .style("fill", function (d, i) {
            return colorScale(d);
        })
}

const ColorInterpolationScale = (props) => {

    useEffect(() => {
        ColorScale(props.colorScheme);
    }, [props.colorScheme])

    return (
        <div id="color-interpolator"></div>
    )
}
export default ColorInterpolationScale;