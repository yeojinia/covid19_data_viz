import React, {useEffect, useState} from "react";
import {CorrelationMatrix} from "../DataProcessing/CorrelationTable";
import deathsFactor from "../Data/CasesFactors.json";
import MI from "../Data/MutualInfo.json";
import MutualInfo from "../Data/MutualInfo.json";

let [labels, corrMat] = CorrelationMatrix(deathsFactor);

var caseObj = {};
corrMat.forEach(function (item) {
    if (item["x_feature"] === "dovid19") {
        caseObj[item["y_feature"]] = item["coeff"];
    }
});

export function Parallel_Labels(corrSlider, corrThreshold, miSlider, miThreshold){
    var axes_labels = []
    var axesChosen = {};
    if(corrSlider === false) {
        for (var pos in caseObj) {
            if (1 - Math.abs(caseObj[pos]) < corrThreshold["corrThreshold"]) {
                axesChosen[pos] = caseObj[pos];
            }
        }
    }
    else if(miSlider === false){
        var mi_max = Math.max.apply(Math, MutualInfo.map(function(o) {return o.mutualInfo}));
        for (var pos in MI) {
            if (MI[pos]["mutualInfo"] >= miThreshold["miThreshold"]) {
                axesChosen[MI[pos]["label"]] = MI[pos]["mutualInfo"];
            }
        }
    }

    var nums = (Object.keys(axesChosen).length);
    var side_margin = 30;
    var canvas_width = 800;
    var span =0;
    if(nums!=1) {
        span = (canvas_width - (2 * side_margin)) / (nums - 1);
    }
    else{
        span = (canvas_width - (2 * side_margin)) / (nums);
    }
    // setLabelMargin(-span + side_margin);
    var label_margin = -span + side_margin;
    var text_margin = 0;
    var idx = 0;
    for (var label in axesChosen) {
        /*width:side_margin + span*idx*/
        axes_labels.push(<p key={label} style={{marginLeft:-{span}+'px', width:span, writingMode: 'vertical-rl',  textOrientation: 'mixed', textAlign:'left', fontFamily:'Helvetica'}}>{label}</p>);
        idx = idx +1;
    }

    return {label_margin, axes_labels};
}

export default function DeathsPCPLabels(props) {

    const {label_margin, axes_labels} = props;

    return (
        <div style={{display:'flex', fontSize:'13px', transform: 'translate('+label_margin+'px, 0)'}}>
            {axes_labels}
        </div>
    )

};