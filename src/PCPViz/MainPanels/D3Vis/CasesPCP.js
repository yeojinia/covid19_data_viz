import React, {useEffect} from 'react';
import * as d3 from 'd3';
import casesFactor from "./../../Data/CasesFactors.json";
import MI from "./../../Data/MutualInfo.json";
import {CorrelationMatrix} from "../../DataProcessing/CorrelationTable";
import {dimensions, maximums, minimums, modelWeights} from "../../DataProcessing/CasesFactors";

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
            if (1 - Math.abs(caseObj[pos]) <= corrThreshold["corrThreshold"]) { // && pos !== "cases") {
                axesChosen[pos] = caseObj[pos];
            }
        }
    } else if (miSlider === false) {
        for (var pos in MI) {
            if (MI[pos]["mutualInfo"] >= miThreshold["miThreshold"]) {
                axesChosen[MI[pos]["label"]] = MI[pos]["mutualInfo"];
            }
        }
    }

    if (Object.keys(axesChosen).length < 2) {
        return {};
    }
    return axesChosen;
}

export default function CasesPCP(props) {

    const side_margin = 30;
    const cases_pcp_width = 1000 - 2 * side_margin;
    const cases_pcp_height = 500 - 2 * side_margin;

    var formatDecimalComma = d3.format(",.2f");

    let wMax = Math.max.apply(null, (Object.values(modelWeights)).map(Math.abs));
    let wMin = 0;

    useEffect(() => {

        var selectedAxesObj = props.selectedAxes;
        var selectedAxes = Object.keys(selectedAxesObj);

        d3.select("#cases-pcp-vis").remove();
        let svg = d3.select(".cases-pcp-d3-wrapper")
            .append("svg")
            .attr("id", "cases-pcp-vis")
            .attr("width", cases_pcp_width)
            .attr("height", cases_pcp_height + 100);

        var y = {}
        for (var i in dimensions) {
            var name = dimensions[i];
            y[name] = d3.scaleLinear()
                .domain(d3.extent(casesFactor, function (d) {
                    return +d[name];
                }))
                .range([cases_pcp_height, 0])
        }

        // const yScale = d3.scaleLinear()
        //     .domain(dimensions.length)
        //     .range([cases_pcp_height, 0]);

        svg.selectAll('path').style('stroke', 'none');

        var selectedAxisOrder = [];
        // selectedAxes.filter(word => word !== "cases");

        for (var i = 0; i < selectedAxes.length; i++) {
            if (props.targetPlace === i) {
                selectedAxisOrder.push("cases");
            }
            if (selectedAxes[i] !== "cases")
                selectedAxisOrder.push(selectedAxes[i]);
        }


//        console.log(selectedAxisOrder);
        const xScale = d3.scaleBand()
            .domain(selectedAxisOrder)
            .range([0, cases_pcp_width])
            .padding(0.5)

        svg.selectAll()
            .data(selectedAxisOrder, function (d) {
                return d;
            })
            .enter()
            .append('rect')
            .style('fill', function (d) {
                if (d === "cases") return 'orange';
                return '#0d98ba';
            })
            .attr('x', (s) => xScale(s))
            .attr('y', (s) => 0)
            .attr('height', (s) => cases_pcp_height)
            .attr('width', function (d) {
                if (d === "cases") return 3 * (1 + selectedAxisOrder.length) / (selectedAxisOrder.length);
                var scaledWeights = ((Math.abs(modelWeights[d]) - wMin) / (wMax - wMin));
                return (3 + 15 * scaledWeights) * (1 + selectedAxisOrder.length) / (selectedAxisOrder.length);
            });

        //    console.log(selectedAxes);
        svg.selectAll()
            .data(selectedAxisOrder, function (d) {
                return d;
            })
            .enter()
            .append("g")
            .attr("transform", function (d) {
                return "translate(" + xScale(d) + "," + cases_pcp_height + ") rotate(90)";
            })
            .append("text")
            .text(function (d) {
                return d;
            })
            .style("fill", "black")

        svg.selectAll()
            .data(selectedAxisOrder, function (d) {
                return d;
            })
            .enter()
            .append("g")
            .attr("transform", function (d) {
                return "translate(" + xScale(d) + "," + cases_pcp_height + ") rotate(90)";
            })
            .append("text")
            .attr("y", "10px")
            .text(function (d) {
                return formatDecimalComma(minimums[d]);
            })
            .style("font", "10px times")
            .style("fill", "#0d98ba")

        svg.selectAll()
            .data(selectedAxisOrder, function (d) {
                return d;
            })
            .enter()
            .append("g")
            .attr("transform", function (d) {
                return "translate(" + xScale(d) + ",0) rotate(90)";
            })
            .append("text")
            .attr("y", "10px")
            .text(function (d) {
                return formatDecimalComma(maximums[d]);
            })
            .style("font", "10px times")
            .style("fill", "#0d98ba")

        // const curve = d3.line().curve(d3.curveNatural);

        // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
        function curve_path(d) {
            return d3.line().curve(d3.curveCardinal)(selectedAxisOrder.map(function (p) {
                return [xScale(p), y[p](d[p])];
            }));
        }

        function line_path(d) {
            return d3.line()(selectedAxisOrder.map(function (p) {
                return [xScale(p), y[p](d[p])];
            }));
        }

        svg.selectAll()
            .data(casesFactor, function (d) {
                return d;
            })
            .enter().append("path")
            .attr("d", function (d) {
                if (!(d.states in props.selectedData)) return line_path(d);
                return curve_path(d);
            })
            .style("fill", "none")
            .style("stroke", function (d) {
                if (!(d.states in props.selectedData)) return "#A2CCB6";
                return props.selectedData[d.states];
            })
            .style("stroke-width", function (d) {
                if (!(d.states in props.selectedData)) return '1px';
                return '3px';
            })

    }, [props.selectedAxes, props.selectedData, props.targetPlace])

    return (
        <div className="cases-pcp-d3-wrapper" width="800px" height="500px">
        </div>
    );

}