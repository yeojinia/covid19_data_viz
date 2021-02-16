import React, {useEffect, useState} from "react";
import {CorrelationMatrix} from "../DataProcessing/CorrelationTable";
import casesFactor from "../Data/CasesFactors.json";
import MI from "../Data/MutualInfo.json";
import MutualInfo from "../Data/MutualInfo.json";
import {AxesNumericalRange} from "./CasesParallelCoordinates";

let [labels, corrMat] = CorrelationMatrix(casesFactor);

var caseObj = {};
corrMat.forEach(function (item) {
    if (item["x_feature"] === "cases") {
        caseObj[item["y_feature"]] = item["coeff"];
    }
});

export function Parallel_Labels(corrSlider, corrThreshold, miSlider, miThreshold){
    var axes_labels = []
    var axesChosen = {};
    if(corrSlider === false) {
        for (var pos in caseObj) {
            if (1 - Math.abs(caseObj[pos]) <= corrThreshold["corrThreshold"]) {
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

    var [axes_minimums, axes_maximums] = AxesNumericalRange(casesFactor, axesChosen);

    var axesMins = Object.values(axes_minimums);
    var axesMaxs = Object.values(axes_maximums);

    axesMins.map(a=> {a.toFixed(2)});
    axesMaxs.map(a=> {a.toFixed(2)});

    // console.log(axesMins,  axesMaxs);
    // setDisplayLabels(labels);
    if(axes_labels.length<=1){
        axes_labels = [];
        axesMins = [];
        axesMaxs = [];
    }
    return {label_margin, axes_labels, axesMins, axesMaxs};
}

export default function CasesPCPLabels(props) {

    const {label_margin, axes_labels, axesMins, axesMaxs} = props;
   // console.log(label_margin, axes_labels, axesMins, axesMaxs);
    return (
            <div style={{display:'flex', fontSize:'13px', transform: 'translate('+label_margin+'px, 0)'}}>
                {axes_labels}
            </div>
    )
};

export function CasesMinLabel(props){

    const {label_margin, axes_labels, axesMins, axesMaxs} = props;

    //console.log(axes_labels);
    console.log(label_margin, axes_labels, axesMins, axesMaxs);
    return (
        <div style={{display:'flex', fontSize:'13px', transform: 'translate('+label_margin+'px, 0)'}}>
            {axesMins}
        </div>
    )

}
export function CasesMaxLabel(props){

    const {label_margin, axes_labels, axesMins, axesMaxs} = props;

    return (
        <div style={{display:'flex', fontSize:'13px', transform: 'translate('+label_margin+'px, 0)'}}>
            {axesMaxs}
        </div>
    )
}