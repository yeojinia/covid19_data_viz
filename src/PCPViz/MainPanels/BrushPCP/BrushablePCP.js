import * as d3 from 'd3';
import {timeVaryingStateData} from "./ExtractTVStateData";
import {timeToIndex} from "./TimeFormat";
import React, {useEffect, useState} from "react";
import ColorLegend from "./ColorLegend";
import "./../../style.css"
import casesFactor from "../../Data/CasesFactorsAddedNorm.json";
import {dimensions, maximums, minimums} from "../../DataProcessing/CasesFactors";
const width = 1200;
const height = 900;
const margin = ({top: 30, right: 30, bottom: 30, left: 30});
const brushHeight = 60;

let keyz = "cases";
let colors = d3.interpolateYlGn; //d3.quantize(d3.interpolateHcl("#60c96e", "#4d4193"), 10)
const deselectedColor = "#eee";

export default function BrushablePCP(props) {
    let data2 = timeVaryingStateData["CA1"];
    const keys = Object.keys(data2[0]); //data2.columns.slice(1);
    var label_position = {"2020-6-1":61, "2020-9-1":153, "2020-12-1":244, "2021-3-1":334, "2021-6-1":426};
    const [keyMin, setKeyMin] = useState();
    const [keyMax, setKeyMax] = useState();

    useEffect(() => {
        // console.log(props.color);
        // console.log(props.key_to_interpolate)
        keyz = props.key_to_interpolate;
        colors = props.color;
        data2 = timeVaryingStateData[props.state_name+String(props.count)];
        // console.log(props.state_name+String(props.count));
        // const svg = d3.create("svg")
        //     .attr("viewBox", [0, 0, width, height]);

        var minimum;
        var maximum;

        function getMax(data, key) {
            for(var i=0; i<data.length; i++){
                if(maximum == null || data[i][key] > maximum)
                    maximum = data[i][key];
                if(minimum == null || data[i][key] < minimum)
                    minimum = data[i][key];
            }
            setKeyMax(maximum);
            setKeyMin(minimum);
            return [maximum, minimum];
        }
        getMax(data2, keyz);

        const x = d3.scalePoint(keys, [margin.left, width - margin.right]);
        const y = new Map(Array.from(keys, function(key) {
            if(key === "Date"){
                return [key, d3.scaleLinear(d3.extent(data2,
                    function(d){
                        return 493- timeToIndex[d[key]];
                    }), [height - margin.bottom,margin.top])];
            }
            return [key, d3.scaleLinear(d3.extent(data2,
                function(d){
                    return d[key]
                }), [height - margin.bottom, margin.top])];
        }));
        const z = d3.scaleSequential(y.get(keyz).domain().reverse(), colors);

        // let legend = Legend({color: z, title: this.state.color});


        const line =d3.line()
            .defined(function([value]){ return value != null})
            .y(function([key, value], idx){
                if(key === "Date") return (height -margin.top) - ((timeToIndex[value]/493)*(height - margin.bottom - margin.top));
                return y.get(key)(value)})
            .x(([key]) => x(key))

        d3.select("#pcp-id").remove();

        let svg = d3.select("#brushable-pcp-wrapper")
            .append("svg")
            .attr("id", "pcp-id")
            .attr("viewBox", [0, 0, width, height]);

        const brush = d3.brushX()
            .extent([
                [margin.bottom, -(brushHeight / 2)],
                [height - margin.top, brushHeight / 2]])
            .on("start brush end", brushed);

        const path = svg.append("g")
            .attr("fill", "none")
            .attr("stroke-width", 2.0)
            .attr("stroke-opacity", 1.0)
            .selectAll("path")
            .data(data2.slice().sort((a, b) => d3.ascending(a[keyz], b[keyz])))
            .join("path")
            .attr("stroke", d => z(d[keyz]))
            .attr("d", d => line(d3.cross(keys, [d], function (key, d) {
                return [key, d[key]]
            })));

        svg.append("g")
            .selectAll("g")
            .data(keys)
            .join("g")
            .attr("transform", d => `translate( ${x(d) + 5}, 0) rotate(90)`)
            .each(function (d) {
                //console.log(y.get(d));
                d3.select(this).call(d3.axisBottom(y.get(d)));
            })
            .call(g => g.append("text")
                .attr("x", margin.left)
                .attr("y", -3)
                .attr("text-anchor", "start")
                .attr("fill", "currentColor")
                .text(d => d)
                .style("font", function (d) {
                    var size = (25);
                    return size + "px times";
                })
                .style("font-weight", "bold")
            )
            .call(g => g.selectAll("text")
                .clone(true).lower()
                .attr("fill", "none")
                .attr("stroke-width", "5px")
                .attr("stroke-linejoin", "round")
                .attr("stroke", "white"))
                .style("font", function (d) {
                    if(d === "Date") return "0 px";
                var size = (10);
                return size + "px times";
            })
            .call(g=> g.select(".domain")
                .attr("fill", "#0d98ba")
            )
            .call(brush);

        svg.selectAll()
            .data(Object.keys(label_position), function (d) {
                return d;
            })
            .enter()
            .append("g")
            .attr("transform", function (d) {
                //console.log((position[d]));
                return "translate(" + -2 + "," + ( ((height ) *(1.0 -((label_position[d])/(data2.length) )))) + ") ";
            })
            .append("text")
            // .attr("y", 25 + "px")
            .text(function (d) {
                return (d);
            })
            .style("font", function (d) {
                var size = (22);
                return size+"px times";
            })
            // .attr("font-weight",function(d,i) {return i*100+100;})
            .style("fill", function(d){
                return "dd8baf";
            });


        const selections = new Map();

        function brushed({selection}, key) {
            if (selection === null) selections.delete(key);
            else selections.set(key, selection.map(y.get(key).invert));
            const selected = [];
            path.each(function (d) {
                const active = Array.from(selections).every(function ([key, [max, min]]) {
                    //console.log(key, max, min);
                    if(key === "Date"){
                      //  console.log(timeToIndex[d[key]], max, min);
                        return timeToIndex[d[key]] >= min && timeToIndex[d[key]] <= max;
                    }
                    return d[key] >= min && d[key] <= max
                });
                //d3.select(this).style("stroke", active ? "blue" : deselectedColor);
                d3.select(this).style("stroke", active ? z(d[keyz]) : deselectedColor);
                if (active) {
                    d3.select(this).raise();
                    selected.push(d);
                }
            });
            svg.property("value", selected).dispatch("input");
        }

    },[props.state_name, props.count, props.color, props.key_to_interpolate])

    return(<div style={{display:"flex"}}>
        <div id="pcp2-color-scale-range-values" style={{height:"300px"}} style={{marginLeft: '0.6rem'}}>
            <h5> {keyz} </h5>
            <div id="pcp2-range-top-value"> {Number(keyMax).toFixed(2)}</div>
            <div style={{height: "250px"}}></div>
            <div id="pcp2-range-bot-value"> {Number(keyMin).toFixed(2)}</div>
        </div>
        <ColorLegend color={props.color} maximum={keyMax} minimum={keyMin}/>
        <div id="brushable-pcp-wrapper" style={{ "margin": "auto", "width": "90%"}}> </div>
        </div>)

}