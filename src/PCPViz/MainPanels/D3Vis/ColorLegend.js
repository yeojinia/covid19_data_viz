import * as d3 from "d3";
import React, {useEffect} from "react";

var width_ = 25,
    height_ = 300;

const ColorFunc = () => {
    d3.select("#cases-pcp-color-scheme-vis").remove();

    var svg = d3.select("#cases-pcp-color-interpolator")
        .append("svg")
        .attr("id", "cases-pcp-color-scheme-vis")
        .attr("width", width_)
        .attr("height", height_)
        .append("g");

    var colorScale = d3.scaleSequential(d3.interpolateCubehelixLong("#E9CFEC", "green"))
        .domain([0, width_])


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

const ColorLegend = (props) => {

         useEffect(() => {
            // console.log(props.color);
            ColorFunc();
        }, [])

        return (
            <>
            <div id="cases-pcp-color-interpolator" style={{marginTop: '4rem', marginLeft: '0.5rem'}}></div>
            </>
        )

}
export default ColorLegend;