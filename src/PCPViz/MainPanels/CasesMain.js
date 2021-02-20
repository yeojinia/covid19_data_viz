import React, {useEffect, useState} from 'react';
import {CorrelationMatrix} from "../DataProcessing/CorrelationTable";
import CasesMultiBrushes from "./BrushOnTsne/CasesMultiBrushes";
import casesFactor from "../Data/CasesFactors.json";
import {Slider} from "rsuite";
import CasesHeatMapViz from "../SubPanels/CorrHeatMap/CasesHeatMap";
import CasesScatterPlotViz, {CasesScatterPlotLeftLabel, CasesScatterPlotBottomLabel}
    from "../SubPanels/ScatterPlot/CasesScatterPlot";
import ColorInterpolationScale from '../SubPanels/ColorInterpolationScale';
import CasesPCP, {OptAxes} from "./D3Vis/CasesPCP";
import {Button} from "react-bootstrap";
import MutualInfo from './../Data/MutualInfo.json';
import MI from "../Data/MutualInfo.json";

let corrMat = CorrelationMatrix(casesFactor)[1];

// const getItems = (count, offset = 0) =>
//     Array.from({length: count}, (v, k) => k).map(k => ({
//         id: `${labels[k]}`,
//         content: `${labels[k]}`,
//     }));


var caseObj = {};
corrMat.forEach(function (item) {
    if (item["x_feature"] === "cases") {
        caseObj[item["y_feature"]] = item["coeff"];
    }
});

// const handleStyle = {
//     color: '#fff',
//     fontSize: 12,
//     width: 32,
//     height: 22
// };
//
// const ColorSelector = () => {
//
//     var width_ = 60,
//         height_ = 30;
//
//     var svg = d3.select("#color-interpolation-scheme1")
//         .append("svg")
//         .attr("id", "color-scheme1")
//         .attr("width", width_)
//         .attr("height", height_)
//         .append("g");
//
//     var colorScale = d3.scaleSequential(d3.interpolateInferno)
//         .domain([0, width_])
//
//     var bars = svg.selectAll(".bars")
//         .data(d3.range(width_), function (d) {
//             return d;
//         })
//         .enter().append("rect")
//         .attr("class", "bars")
//         .attr("x", function (d, i) {
//             return i;
//         })
//         .attr("y", 0)
//         .attr("height", height_)
//         .attr("width", 1)
//         .style("fill", function (d, i) {
//             return colorScale(d);
//         })
//
//     var svg2 = d3.select("#color-interpolation-scheme2")
//         .append("svg")
//         .attr("id", "color-scheme2")
//         .attr("width", width_)
//         .attr("height", height_)
//         .append("g");
//
//     var colorScale2 = d3.scaleSequential(d3.interpolateRdBu)
//         .domain([0, width_])
//
//     var bars2 = svg2.selectAll(".bars")
//         .data(d3.range(width_), function (d) {
//             return d;
//         })
//         .enter().append("rect")
//         .attr("class", "bars")
//         .attr("x", function (d, i) {
//             return i;
//         })
//         .attr("y", 0)
//         .attr("height", height_)
//         .attr("width", 1)
//         .style("fill", function (d, i) {
//             return colorScale2(d);
//         })
//
//     var svg3 = d3.select("#color-interpolation-scheme3")
//         .append("svg")
//         .attr("id", "color-scheme3")
//         .attr("width", width_)
//         .attr("height", height_)
//         .append("g");
//
//     var colorScale3 = d3.scaleSequential(d3.interpolateRdYlGn)
//         .domain([0, width_])
//
//     var bars3 = svg3.selectAll(".bars")
//         .data(d3.range(width_), function (d) {
//             return d;
//         })
//         .enter().append("rect")
//         .attr("class", "bars")
//         .attr("x", function (d, i) {
//             return i;
//         })
//         .attr("y", 0)
//         .attr("height", height_)
//         .attr("width", 1)
//         .style("fill", function (d, i) {
//             return colorScale3(d);
//         })
//
//     var svg4 = d3.select("#color-interpolation-scheme4")
//         .append("svg")
//         .attr("id", "color-scheme4")
//         .attr("width", width_)
//         .attr("height", height_)
//         .append("g");
//
//     var colorScale4 = d3.scaleSequential(d3.interpolateRdGy)
//         .domain([0, width_])
//
//     var bars4 = svg4.selectAll(".bars")
//         .data(d3.range(width_), function (d) {
//             return d;
//         })
//         .enter().append("rect")
//         .attr("class", "bars")
//         .attr("x", function (d, i) {
//             return i;
//         })
//         .attr("y", 0)
//         .attr("height", height_)
//         .attr("width", 1)
//         .style("fill", function (d, i) {
//             return colorScale4(d);
//         })
//
// };

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

const mi_max = Math.max.apply(Math, MutualInfo.map(function (o) {
    return o.mutualInfo
}));
const mi_min = Math.min.apply(Math, MutualInfo.map(function (o) {
    return o.mutualInfo
}));

export default function CasesMain() {

    // const [items, setItems] = useState(getItems(labels.length));
    const [corrThreshold, setCorrThreshold] = useState({"corrThreshold": 1});
    const [miThreshold, setMiThreshold] = useState({"miThreshold": 1});
    const [selectedData, setSelectedData] = useState({});
  //  const [extractMethod, setExtractMethod] = useState({});
    const [corrSlider, setCorrSlider] = useState(false);
    const [miSlider, setMiSlider] = useState(true);
    const [scatterHorizontal, setScatterHorizontal] = useState({"horizon": "None"});
    const [scatterVertical, setScatterVertical] = useState({"vert": "None"});

    const [selectedAxes, setSelectedAxes] = useState(caseObj);
    const [colorScheme, setColorScheme] = useState('Inferno');
    const [sliderPlace, setSliderPlace] = useState(1);
    const [targetPlace, setTargetPlace] = useState(Object.keys(caseObj).length - 1);

    const buttonStyle = {
        color: "#fff",
        fontSize: '10px',
        backgroundColor: "#5a6268",
        borderColor: "#6c757d",
        width: "100px",
        height: "30px"
    };
    // var selectedAxesSubset = {};

    useEffect(() => {

        var axesSubset = {};

        if (corrSlider === false) {
            for (var key in caseObj) {
                if (caseObj[key] <= corrThreshold["corrThreshold"])
                    axesSubset[key] = true;
                else
                    axesSubset[key] = false;
            }
        } else if (miSlider === false) {
            for (var pos in MI) {
                if (MI[pos]["mutualInfo"] <= miThreshold["miThreshold"]) {
                    axesSubset[MI[pos]["label"]] = true;
                } else {
                    axesSubset[MI[pos]["label"]] = false;
                }
            }
        }
        // selectedAxesSubset = axesSubset;

    }, [corrSlider, miSlider]);

    return (
        <div id="covid19-cases-wrapper">
            &nbsp;
            <div id="cases-vis-brush-and-pcp" style={{border: 'solid #F5F5F5'}}>
                <div id="my-cases-vis-wrapper">
                    &nbsp;
                    <div id="cases-pcp-wrapper" style={{width: '1050px', height: '500px'}}>
                        <b style={{height: '20px'}}> state-by-state variables</b>
                        <CasesPCP selectedAxes={selectedAxes} selectedData={selectedData}
                                  targetPlace={targetPlace}></CasesPCP>
                    </div>

                    <div id="cases-sub-multibrush">
                        <CasesMultiBrushes setSelectedData={setSelectedData}
                                           setSelectedAxes={setSelectedAxes}></CasesMultiBrushes>
                    </div>


                </div>
            </div>

            <div id="cases-sub-wrapper">
                <div id="cases-interaction-board"
                     style={{marginLeft: '1.8rem', marginTop: '0.8rem', textAlign: 'left'}}>
                    <div id="axis-order-slider-wrapper" style={{height: '30px', width:'210px'}}>
                        <b> "Cases" location in PC </b>
                        <Slider
                            min={0}
                            max={1}
                            step={0.01}
                            defaultValue={1.0}
                            onChange={v => {
                                setSliderPlace(v);
                                var target_pos = getAxesOrderChange(selectedAxes, v);
                                if (target_pos !== targetPlace) {
                                    setTargetPlace(target_pos);
                                }
                            }}
                            style={{width: 200, marginTop: '0.3rem'}}/>
                    </div>
                    &nbsp;


                    {/*<div id="cases-feature-extraction-slider" style={{height: '90px'}}>*/}
                    {/*</div>*/}

                    <div id="selection-method-wrapper" onChange={v => {
                        //setExtractMethod(v.target.value);
                        if (v.target.value === "correlation") {
                            setCorrSlider(false);
                            setMiSlider(true);
                        } else if (v.target.value === "mutualInformation") {
                            setCorrSlider(true);
                            setMiSlider(false);
                        }
                    }} style={{height: '100px'}}>
                        <b> Selection Method </b>
                        <div style={{height: '40px'}}>
                            <input type="radio" value="mutualInformation" name="extract-method"
                                   style={{marginTop: '0.3rem'}}/>
                            &nbsp; Mutual Information

                            {/*<b> Mutual Information based selection </b>*/}

                            <Slider
                                min={mi_min}
                                max={mi_max}
                                step={0.01}
                                defaultValue={1.0}
                                onChange={v => {
                                    setMiThreshold({miThreshold: v});
                                }}
                                disabled={miSlider}
                                style={{width: 200, marginTop: '0.3rem'}}/>
                        </div>
                        <div style={{height: '40px'}}>
                            <input type="radio" value="correlation" name="extract-method" defaultChecked/>
                            &nbsp; Correlation
                            {/*<b> Correlation based selection </b>*/}
                            <Slider
                                min={0}
                                max={1}
                                step={0.01}
                                defaultValue={1.0}
                                onChange={v => {
                                    setCorrThreshold({corrThreshold: v});
                                }}
                                disabled={corrSlider}
                                style={{width: 200, marginTop: '0.3rem'}}/>
                        </div>

                    </div>
                    <div id="button-wrapper">
                        <div id="apply-button" style={{height: '50px'}}>
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            <Button
                                variant="ui-primary"
                                onClick={() => {
                                    var selected_axes = OptAxes(corrSlider, corrThreshold, miSlider, miThreshold);
                                    setSelectedAxes(selected_axes);

                                    var target_pos = getAxesOrderChange(selected_axes, sliderPlace);
                                    if (target_pos !== targetPlace) {
                                        setTargetPlace(target_pos);
                                    }

                                    if(Object.keys(selected_axes).length<=1){
                                        setScatterHorizontal({horizon: "None"});
                                        setScatterVertical({vert: "None"});
                                    }

                                }}
                                style={buttonStyle}>
                                Apply Selection
                            </Button>
                        </div>
                        <div id="reset-button" style={{height: '50px'}}>
                            &nbsp;
                            &nbsp;
                            {/*<Button*/}
                            {/*    variant="ui-primary"*/}
                            {/*    onClick={() => {*/}

                            {/*        setCorrThreshold({"corrThreshold": 1});*/}
                            {/*        setMiThreshold({"miThreshold": 1});*/}
                            {/*        setSelectedData({});*/}
                            {/*        setSelectedAxes(caseObj);*/}

                            {/*    }}*/}
                            {/*    style={buttonStyle}>*/}
                            {/*    Reset*/}
                            {/*</Button>*/}
                        </div>
                    </div>

                    &nbsp;
                    &nbsp;
                    <div id="color-text-wrapper">
                        <b> Color for Heatmap </b>
                    </div>
                    <div id="cases-svg-interpolation-container" style={{height: '120px'}} onChange={v => {
                        setColorScheme(v.target.value);
                    }}>

                        <div>
                            <input type="radio" value="Inferno" name="color-scheme"/>
                            &nbsp; Inferno
                        </div>
                        {/*<div id="color-interpolation-scheme1"/>*/}

                        <div>
                            <input type="radio" value="RdBu" name="color-scheme"/>
                            &nbsp; RdBu
                        </div>

                        {/*<div id="color-interpolation-scheme2"/>*/}
                        <div>
                            <input type="radio" value="RdYlGn" name="color-scheme"/>
                            &nbsp; RdYlGn
                        </div>
                        {/*<div id="color-interpolation-scheme3"/>*/}

                        <div>
                            <input type="radio" value="RdGy" name="color-scheme"/>
                            &nbsp; RdGy
                        </div>
                        {/*<div id="color-interpolation-scheme4"/>*/}
                    </div>

                </div>

                <div className="cases-sub-heatmap" id="cases-sub-heatmap-vis">
                    <CasesHeatMapViz setScatterHorizontal={setScatterHorizontal} setScatterVertical={setScatterVertical}
                                     colorScheme={colorScheme} selectedAxes={selectedAxes}></CasesHeatMapViz>
                </div>
                <div id="color-scale-wrapper">
                    <ColorInterpolationScale colorScheme={colorScheme}></ColorInterpolationScale>
                </div>
                <div className="cases-sub-scatterplot" id="cases-sub-scatterplot-vis">
                    <div className="cases-sub-scatterplot-left" id="cases-sub-scatterplot-vis-left">
                        <CasesScatterPlotLeftLabel scatterHorizontal={scatterHorizontal}
                                                   scatterVertical={scatterVertical}
                                                   colorScheme={colorScheme}></CasesScatterPlotLeftLabel>
                    </div>
                    <div className="cases-sub-scatterplot-right" id="cases-sub-scatterplot-vis-right">
                        <div className="cases-sub-scatterplot-right-top" id="cases-sub-scatterplot-vis-right-top">
                            <CasesScatterPlotViz scatterHorizontal={scatterHorizontal}
                                                 scatterVertical={scatterVertical}></CasesScatterPlotViz>
                        </div>
                        <div className="cases-sub-scatterplot-right-bot" id="cases-sub-scatterplot-vis-right-bot"
                             style={{height: '50px'}}>
                            <CasesScatterPlotBottomLabel scatterHorizontal={scatterHorizontal}
                                                         scatterVertical={scatterVertical}></CasesScatterPlotBottomLabel>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

