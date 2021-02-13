import React, {useEffect} from 'react';
import * as d3 from 'd3';
import CasesFactor from "../Data/CasesFactors.json";
import casesFactor from "../Data/CasesFactors.json";

export default function CasesPCP(props) {

    const side_margin = 60;
    const cases_pcp_width = 800 - 2* side_margin;
    const cases_pcp_height = 400 - 2* side_margin;

    var keys = Object.keys(casesFactor[0]);
    keys.shift();

    useEffect(() => {
        let svg = d3.select(".cases-pcp-d3-wrapper")
            .append("svg")
            .attr("width", cases_pcp_width)
            .attr("height", cases_pcp_height);

        const yScale = d3.scaleLinear()
            .domain(keys.length)
            .range([cases_pcp_height, 0]);

        svg.selectAll('path').style('stroke', 'none');

        const xScale = d3.scaleBand()
            .domain([0, casesFactor.states])
            .range([0, cases_pcp_width])
            .padding(0.2)

        svg.selectAll()
            .data(CasesFactor, function (d) {
                return d[props.states];
            })
            .enter()
            .append('rect')
            .style('fill', 'orange')
            .attr('x', (s) => xScale(s.states))
            .attr('y', (s) => yScale(s.states))
            .attr('height', (s) => 100)
            .attr('width', xScale.bandwidth())
    },[])

    return(
        <div className="cases-pcp-d3-wrapper" width="800px" height="400px" >
        </div>
    );

}