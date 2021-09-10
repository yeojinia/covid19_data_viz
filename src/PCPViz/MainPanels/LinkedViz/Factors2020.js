import React, {useEffect, useState} from 'react';
import {CorrelationMatrix} from "../../DataProcessing/CorrelationTable";
import CasesMultiBrushes from "./BrushOnTsne";
import casesFactor from "../../Data/CasesFactorsAddedNorm.json";
import {Slider as RSlider} from "rsuite";
import Slider from '@material-ui/core/Slider';
import CasesHeatMapViz from "./CasesHeatMap";
import ColorInterpolationScale from '../../MainPanels/ColorInterpolationScale';
import StaticFactorsPCP, {OptAxes} from "./../LinkedViz/StaticFactorsPCP";
import {Button} from "react-bootstrap";

let corrMat = CorrelationMatrix(casesFactor)[1];

var caseObj = {};
corrMat.forEach(function (item) {
    if (item["x_feature"] === "cases") {
        caseObj[item["y_feature"]] = item["coeff"];
    }
});
// console.log(caseObj);

// sliderPlace 0 to 1
function getAxesOrderChange(selectedAxes, sliderPlace) {

    var n = Object.keys(selectedAxes).length;
    var target_pos = n - 1;
    if (sliderPlace < 1 / (2 * (n - 1))) { // 0
        target_pos = 0;
    } else if (sliderPlace >= (2 * n - 3) / (2 * (n - 1))) { // (n-1)
        target_pos = n - 1;
    } else {
        target_pos = Math.round(sliderPlace * (n - 1));
    }
    return target_pos;

}

//
// const mi_max = Math.max.apply(Math, MutualInfo.map(function (o) {
//     return o.mutualInfo
// }));
// const mi_min = Math.min.apply(Math, MutualInfo.map(function (o) {
//     return o.mutualInfo
// }));

export default function Factors2020() {

    const [corrThreshold, setCorrThreshold] = useState({"corrThreshold": 1});
    const [miThreshold, setMiThreshold] = useState({"miThreshold": 1});
    const [selectedData, setSelectedData] = useState({});

    const [corrSlider, setCorrSlider] = useState(false);
    const [miSlider, setMiSlider] = useState(true);
    const [scatterHorizontal, setScatterHorizontal] = useState({"horizon": "None"});
    const [scatterVertical, setScatterVertical] = useState({"vert": "None"});

    const [bundleChecked, setBundleChecked] = useState(false);
    const [selectedAxes, setSelectedAxes] = useState(caseObj);
    const [colorScheme, setColorScheme] = useState('RdYlGn'); //Inferno');
    const [sliderPlace, setSliderPlace] = useState(1);
    const [bundleSliderPlace, setBundleSliderPlace] = useState(0.1);
    const [targetPlace, setTargetPlace] = useState(Object.keys(caseObj).length - 1);
    const [crossStress, setCrossStress] = useState(0.5);

    // const buttonStyle = {
    //     color: "#fff",
    //     fontSize: '10px',
    //     backgroundColor: "#5a6268",
    //     borderColor: "#6c757d",
    //     width: "100px",
    //     height: "30px"
    // };

    useEffect(() => {

        var axesSubset = {};
        if (corrSlider === false) {
            for (var key in caseObj) {
                if (caseObj[key] <= corrThreshold["corrThreshold"])
                    axesSubset[key] = true;
                else
                    axesSubset[key] = false;
            }
        }
        // else if (miSlider === false) {
        //     for (var pos in MI) {
        //         if (MI[pos]["mutualInfo"] <= miThreshold["miThreshold"]) {
        //             axesSubset[MI[pos]["label"]] = true;
        //         } else {
        //             axesSubset[MI[pos]["label"]] = false;
        //         }
        //     }
        // }
    }, [corrSlider]);
    // }, [corrSlider, miSlider]);

    return (
        <div id="covid19-cases-wrapper">
            &nbsp;
            <div id="cases-vis-brush-and-pcp" >
                <div id="my-cases-vis-wrapper">
                    &nbsp;
                    <div id="cases-pcp-wrapper" style={{width: '1250px', height: '500px'}}>
                        <StaticFactorsPCP selectedAxes={selectedAxes} selectedData={selectedData}
                                          targetPlace={targetPlace}
                                          crossStress={crossStress}
                                          bundleSliderPlace={bundleSliderPlace}
                                          bundleChecked={bundleChecked}></StaticFactorsPCP>
                    </div>

                </div>
                <div id="cases-interaction-board"
                     style={{marginLeft: '1.8rem', marginTop: '0.8rem', textAlign: 'left'}}>

                    &nbsp;

                    <div id="cross-line-highlight-wrapper" style={{height: '30px', width: '210px'}}>
                        <b> Highlight </b>
                        <Slider
                            min={0}
                            max={1}
                            step={0.01}
                            defaultValue={0.5}
                            onChange={(e, v) => {
                                setCrossStress(v);
                            }}
                            style={{width: 200, marginTop: '0.3rem'}}/>
                    </div>
                    &nbsp;

                    <div id="bundling-slider-wrapper" style={{height: '30px', width: '210px'}}>
                        <b> Bundling </b>
                        <input type="checkbox" checked={bundleChecked} onChange={()=> setBundleChecked(!bundleChecked)} />
                        <Slider
                            min={0}
                            max={1}
                            step={0.01}
                            defaultValue={0.1}
                            onChange={(e, v) => {
                                setBundleSliderPlace(v);
                            }}
                            style={{width: 200, marginTop: '0.3rem'}}/>
                    </div>
                    &nbsp;

                    <div id="selection-method-wrapper" onChange={v => {
                        //setExtractMethod(v.target.value);
                        if (v.target.value === "correlation") {
                            setCorrSlider(false);
                            setMiSlider(true);
                        }
                        // else if (v.target.value === "mutualInformation") {
                        //     setCorrSlider(true);
                        //     setMiSlider(false);
                        // }
                    }} style={{height: '60px'}}>
                        <b> Dimension Selection </b>
                        {/*<div style={{height: '40px'}}>*/}
                        {/*    <input type="radio" value="mutualInformation" name="extract-method"*/}
                        {/*           style={{marginTop: '0.3rem'}}/>*/}
                        {/*    &nbsp; Mutual Information*/}
                        {/*    <Slider*/}
                        {/*        min={mi_min}*/}
                        {/*        max={mi_max}*/}
                        {/*        step={0.01}*/}
                        {/*        defaultValue={1.0}*/}
                        {/*        onChange={v => {*/}
                        {/*            setMiThreshold({miThreshold: v});*/}
                        {/*        }}*/}
                        {/*        disabled={miSlider}*/}
                        {/*        style={{width: 200, marginTop: '0.3rem'}}/>*/}
                        {/*</div>*/}
                        <div style={{height: '40px'}}>
                            {/*<input type="radio" value="correlation" name="extract-method" defaultChecked/>*/}
                            {/*&nbsp; Correlation*/}
                            <Slider
                                min={0}
                                max={1}
                                step={0.01}
                                defaultValue={1.0}
                                onChange={(v) => {
                                    setCorrThreshold({corrThreshold: v});
                                }}
                                // onChange={(v, number) => {
                                //     //console.log(corrThreshold)
                                //     setCorrThreshold({corrThreshold: number});
                                // }}
                                onChangeCommitted = {(e, v) => {
                                    var threshold = {"corrThreshold": v};
                                    var selected_axes = OptAxes(corrSlider, threshold, miSlider, threshold);
                                    setCorrThreshold({corrThreshold: v});
                                    setSelectedAxes(selected_axes);

                                   var target_pos = getAxesOrderChange(selected_axes, sliderPlace);

                                    if (target_pos !== targetPlace) {
                                        setTargetPlace(target_pos);
                                    }
                                    if (Object.keys(selected_axes).length <= 1) {
                                        setScatterHorizontal({horizon: "None"});
                                        setScatterVertical({vert: "None"});
                                    }
                                }}
                                style={{width: 200, marginTop: '0.3rem'}}/>
                        </div>

                        <div id="axis-order-slider-wrapper" style={{height: '30px', width: '210px'}}>
                            <b> Objective Variable </b>
                            <Slider
                                min={0}
                                max={1}
                                step={0.01}
                                defaultValue={1.0}
                                onChange={(v, number) => {
                                    setSliderPlace(number);
                                    var target_pos = getAxesOrderChange(selectedAxes, number);
                                    if (target_pos !== targetPlace) {
                                        setTargetPlace(target_pos);
                                    }
                                }}
                                style={{width: 200, marginTop: '0.3rem'}}/>
                        </div>
                    </div>
                    {/*<div id="button-wrapper">*/}
                    {/*    <div id="apply-button" style={{height: '50px'}}>*/}
                    {/*        &nbsp;*/}
                    {/*        &nbsp;*/}
                    {/*        &nbsp;*/}
                    {/*        <Button*/}
                    {/*            variant="ui-primary"*/}
                    {/*            onClick={() => {*/}
                    {/*                var selected_axes = OptAxes(corrSlider, corrThreshold, miSlider, miThreshold);*/}
                    {/*                console.log(selected_axes);*/}
                    {/*                setSelectedAxes(selected_axes);*/}

                    {/*                var target_pos = getAxesOrderChange(selected_axes, sliderPlace);*/}
                    {/*                if (target_pos !== targetPlace) {*/}
                    {/*                    setTargetPlace(target_pos);*/}
                    {/*                }*/}

                    {/*                if (Object.keys(selected_axes).length <= 1) {*/}
                    {/*                    setScatterHorizontal({horizon: "None"});*/}
                    {/*                    setScatterVertical({vert: "None"});*/}
                    {/*                }*/}

                    {/*            }}*/}
                    {/*            style={buttonStyle}>*/}
                    {/*            Apply Selection*/}
                    {/*        </Button>*/}
                    {/*    </div>*/}
                    {/*    <div id="reset-button" style={{height: '50px'}}>*/}
                    {/*        &nbsp;*/}
                    {/*        &nbsp;*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    &nbsp;
                    &nbsp;

                </div>
            </div>

            <div id="cases-sub-wrapper">
                <div id="cases-sub-multibrush" style={{marginLeft: '4.8rem', marginTop: '0.8rem'}}>
                    <CasesMultiBrushes selectedData={selectedData} setSelectedData={setSelectedData}
                                       setSelectedAxes={setSelectedAxes} ></CasesMultiBrushes>
                </div>

                <div className="cases-sub-heatmap" id="cases-sub-heatmap-vis">
                    <CasesHeatMapViz setScatterHorizontal={setScatterHorizontal} setScatterVertical={setScatterVertical}
                                     colorScheme={colorScheme} selectedAxes={selectedAxes}></CasesHeatMapViz>
                </div>
                <div id="color-scale-range-values">
                    <div id="range-top-value-1" style={{marginTop: '1.5rem'}}> +1</div>
                    <div style={{height: "350px"}}></div>
                    <div id="range-bot-value-1"> -1</div>
                </div>
                <div id="color-scale-wrapper">
                    <ColorInterpolationScale colorScheme={colorScheme}></ColorInterpolationScale>
                </div>
            </div>

        </div>
    );
}

