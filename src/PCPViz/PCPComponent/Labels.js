import React, {Component, useEffect, useState} from "react";
import {CorrelationMatrix} from "../DataProcessing/CorrelationTable";
import casesFactor from "../CasesFactors.json";

let [labels, corrMat] = CorrelationMatrix(casesFactor);

var caseObj = {};
corrMat.forEach(function (item) {
    if (item["x_feature"] === "cases") {
        caseObj[item["y_feature"]] = item["coeff"];
    }
});

export default function ParallelLabels(props) {
    const [displayLabels, setDisplayLabels] = useState([]);
    const [labelMargin,setLabelMargin] = useState(0);

    useEffect(() => {
        //displayLabels = [];
        var labels = []
        var axesChosen = {};
        for (var pos in caseObj) {
            if ( 1 - Math.abs(caseObj[pos]) < props.corrThreshold["corrThreshold"]) {
                axesChosen[pos] = caseObj[pos];
            }
        }
        var nums = (Object.keys(axesChosen).length);
        var side_margin = 30;
        var canvas_width = 600;
        var span =0;
        if(nums!=1) {
            span = (canvas_width - (2 * side_margin)) / (nums - 1);
        }
        else{
            span = (canvas_width - (2 * side_margin)) / (nums);
        }
        setLabelMargin(-span + side_margin);
        var text_margin = 0;
        var idx = 0;
        for (var label in axesChosen) {
            /*width:side_margin + span*idx*/
            labels.push(<p style={{marginLeft:-{span}+'px', width:span, writingMode: 'vertical-rl',  textOrientation: 'mixed', textAlign:'left', fontFamily:'Helvetica'}}>{label}</p>);
            idx = idx +1;
        }
        setDisplayLabels(labels);
    }, [props.corrThreshold]);

    return (
        <div style={{display:'flex', transform: 'translate('+labelMargin+'px, 0)'}}>
            {displayLabels}
        </div>
    )

};