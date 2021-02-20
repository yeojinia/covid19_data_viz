import React, {useEffect, useState} from 'react';
import ResetButton from "../SubPanels/Buttons/ResetButton";
import {Slider} from "rsuite";
import DeathsMultiBrushes from './BrushOnTsne/DeathsMultiBrushes';
import deathsFactor from '../Data/DeathsFactors.json';
import DeathsAxesLines from "../ThreeJSVis/DeathsAxesLines";
import DeathParallelLabels from "../ThreeJSVis/DeathsLabel";
import {CovidDeathsCorrelationMatrix} from "../DataProcessing/DeathsCorrelationTable";
import DeathsParallelCoordinates, {Parallel_Lines} from "../ThreeJSVis/CasesParallelCoordinates";
import DeathsPCPLabels, {Parallel_Labels} from "../ThreeJSVis/CasesParallelCoordinatesLabel";
import {Button} from "react-bootstrap";
import DeathsHeatMapViz from "../SubPanels/CorrHeatMap/DeathsHeatMap";
import DeathsScatterPlotViz from "../SubPanels/ScatterPlot/DeathsScatterPlot";
import MI from "../Data/MutualInfo.json";
import MutualInfo from "../Data/MutualInfo.json";

let [labels, corrMat] =  CovidDeathsCorrelationMatrix(deathsFactor);
// console.log(corrMat);

const getItems = (count, offset = 0) =>
    Array.from({length:count}, (v,k) => k).map(k => ({
        id:`${labels[k]}`,
        content: `${labels[k]}`,
    }));


var caseObj = {};
corrMat.forEach(function(item){
   // console.log(item);
    if(item["x_feature"] === "covid19"){
        caseObj[item["y_feature"]] = item["coeff"];

    }
});

export default function DeathsMain() {
    const [items, setItems] = useState(getItems(labels.length));
    const [selectedAxes, setSelectedAxes] = useState({});
    const [corrThreshold, setCorrThreshold] = useState({"corrThreshold":1});
    const [miThreshold, setMiThreshold] = useState({"miThreshold":1});
    const [selectedData, setSelectedData] = useState({});
    const [extractMethod, setExtractMethod] = useState({});
    const [corrSlider, setCorrSlider] = useState(false);
    const [miSlider, setMiSlider] = useState(true);
    const [scatterHorizontal, setScatterHorizontal] = useState({"horizon":"None"});
    const [scatterVertical, setScatterVertical] = useState({"vert":"None"});

    const [vertices, setVertices] = useState([]);
    const [hPoints, setHPoints] = useState([]);
    const [hVertices, setHVertices] = useState([]);
    const [axes, setAxes] = useState([]);
    const [mutual_info, setMI] = useState([]);
    const [weightPos, setWeightPos] = useState([]);
    const [modelWeights, setModelWeights] = useState({});

    const [label_margin, setLabelMargin] = useState(0);
    const [axes_labels, setAxesLabels] = useState([]);


    var mi_max = Math.max.apply(Math, MutualInfo.map(function(o) {return o.mutualInfo}));
    var mi_min = Math.min.apply(Math, MutualInfo.map(function(o) {return o.mutualInfo}));

    const buttonStyle ={
        color: "#fff",
        fontSize: '10px',
        backgroundColor: "#5a6268",
        borderColor: "#6c757d",
        width:"100px",
        height:"30px"
    };
    const borderStyle ={
        mozBoxShadow: "#555 0 0 8px",
        webkitBoxShadow: "#555 0 0 8px",
    }

    var selectedAxesSubset = {};

    useEffect(() => {

        var axesSubset ={};
        if(corrSlider === false ) {
            for (var key in caseObj) {
                if (caseObj[key] <= corrThreshold["corrThreshold"])
                    axesSubset[key] = true;
                else
                    axesSubset[key] = false;
            }
        }
        else if(miSlider === false ){
            for (var pos in MI) {
                //console.log(MI[pos]);
                if (MI[pos]["mutualInfo"] >= mi_max - miThreshold["miThreshold"]) {
                    //console.log(pos);
                    axesSubset[MI[pos]["label"]] = true;
                }else{
                    axesSubset[MI[pos]["label"]] = false;
                }
            }
        }
        selectedAxesSubset = axesSubset;
    }, [items, selectedAxes, selectedData, corrThreshold, miThreshold, corrSlider, miSlider, vertices]);

    return (
        <div id="covid19-deaths-wrapper">
            &nbsp;
            <div id="deaths-vis-brush-and-pcp" style={{border:'solid #F5F5F5'}}>
                <div id="my-cases-vis-wrapper">
                    &nbsp;
                    <div id="deaths-pcp-wrapper" style={{width:'800px', height:'400px'}}>
                        <b style={{height:'20px'}}>state-by-state variables</b>
                        <div className="deaths-pcp-vis" id="deaths-pcp-threejs" style={{height:'400px'}} >
                            <DeathsParallelCoordinates axes={axes} vertices={vertices} hVertices={hVertices} weightPos={weightPos} modelWeights={modelWeights} mutual_info={mutual_info} hPoints={hPoints} style={{marginTop:'250px'}} />
                        </div>
                        <div className="deaths-pcp-labels" id="deaths-pcp-axes-labels"  style={{display:'flex', marginLeft:'10px', height:'180px'/*, marginTop: '460px'*/}} >
                            <DeathsPCPLabels label_margin={label_margin} axes_labels={axes_labels}></DeathsPCPLabels>
                        </div>
                    </div>

                    <div id="deaths-sub-multibrush"  style={{marginTop: '-0.5rem'}} >{/*id ="cases-brush-wrapper" */}
                        <div id="deaths-feature-extraction" width="450" style={{marginLeft: '1.8rem', marginTop: '0.8rem', textAlign:'left'}}>
                            <div onChange={ v =>{
                                setExtractMethod(v.target.value);
                                if(v.target.value === "correlation"){
                                    setCorrSlider(false);
                                    setMiSlider(true);
                                }
                                if(v.target.value === "mutualInformation"){
                                    setCorrSlider(true);
                                    setMiSlider(false);
                                }
                            }}>
                                <input type="radio" value="mutualInformation" name="extract-method"/> Mutual Information &nbsp;
                                <input type="radio" value="correlation" name="extract-method" defaultChecked/> Correlation  &nbsp;
                            </div>
                            <div id="deaths-feature-extraction-slider">
                                <b style={{height:'20px'}}> Correlation with confirmed cases </b>
                                &nbsp;
                                <Slider
                                    min={0}
                                    max={1}
                                    step = {0.01}
                                    defaultValue ={1.0}
                                    onChange = { v => {
                                        setCorrThreshold({corrThreshold:v});
                                    }}
                                    disabled={corrSlider}
                                    style={{ width: 200 }}  />

                                <b style={{height:'20px'}}> Mutual Information </b>
                                &nbsp;
                                <Slider
                                    min={mi_min}
                                    max={mi_max}
                                    step = {0.01}
                                    defaultValue ={1.0}
                                    onChange = { v => {
                                        setMiThreshold({miThreshold:v});
                                    }}
                                    disabled={miSlider}
                                    style={{ width: 200 }}  />
                            </div>

                            <div style={ {marginLeft: '0.1rem', marginBottom:'1.3rem', marginTop:'2.8rem'}}>
                                <Button
                                    variant ="primary"
                                    onClick = {() => {
                                        var {axes, vertices, hVertices, weightPos, modelWeights, mi, hLineSet} =
                                            Parallel_Lines(corrSlider, corrThreshold, miSlider, miThreshold, selectedData);
                                        setAxes(axes);
                                        setVertices(vertices);
                                        setHVertices(hVertices);
                                        setWeightPos(weightPos);
                                        setModelWeights(modelWeights);
                                        setMI(mi);
                                        setHPoints(hLineSet);

                                        var {label_margin, axes_labels} =
                                            Parallel_Labels(corrSlider, corrThreshold, miSlider, miThreshold);
                                        setLabelMargin(label_margin);
                                        setAxesLabels(axes_labels);
                                    }}
                                    style={buttonStyle}>
                                    Apply
                                </Button>
                            </div>
                            {/*<div style={ {marginLeft: '6.5rem', marginBottom:'1.3rem', marginTop:'2.8rem'}}>*/}
                            {/*    <ResetButton class="btn-float-left" onClick={resetVariables()}></ResetButton>*/}
                            {/*</div>*/}
                            <b>  </b>
                            <DeathsMultiBrushes items={items} setSelectedData={setSelectedData} setSelectedAxes={setSelectedAxes}></DeathsMultiBrushes>
                        </div>
                    </div>

                </div>
            </div>
            <div id="deaths-sub-wrapper">
                <div className="deaths-sub-heatmap" id="deaths-sub-heatmap-vis">
                    <div id="deaths-svg-interpolation-container">
                    </div>
                    <DeathsHeatMapViz setScatterHorizontal={setScatterHorizontal} setScatterVertical={setScatterVertical} ></DeathsHeatMapViz>
                </div>
                <div className="deaths-sub-scatterplot" id="deaths-sub-scatterplot-vis">
                    <DeathsScatterPlotViz scatterHorizontal={scatterHorizontal} scatterVertical={scatterVertical}></DeathsScatterPlotViz>
                </div>
            </div>

        </div>

    );
}
//
// <div id="covid19-deaths-wrapper">
//     <div style={{marginLeft: '1.8rem', marginBottom: '1.3rem', marginTop: '2.8rem'}}>
//         <ResetButton class="btn-float-left"/>
//     </div>
//
//     <div id="feature-extraction-deaths-slider" width="450"
//          style={{marginLeft: '1.8rem', marginTop: '3.8rem', textAlign: 'left'}}>
//         <b style={{height: '20px'}}> Correlation with death cases </b>
//         <Slider
//             min={0}
//             max={1}
//             step={0.01}
//             defaultValue={1.0}
//             onChange={v => {
//                 //  console.log(v);
//                 setCorrThreshold({corrThreshold:v});
//             }}
//             style={{width: 200}}/>
//     </div>
//
//     <div id="deaths-vis-brush-and-pcp">
//         <div id="my-deaths-vis-wrapper">
//             <div id="deaths-brush-wrapper">
//                 <b> state-by-state data projected by t-SNE </b>
//                 <CovidDeathBrush items={items} setSelectedAxes={setSelectedAxes}
//                                  setSelectedData={setSelectedData}>
//                 </CovidDeathBrush>
//             </div>
//             &nbsp;
//
//             <div id="deaths-pcp-wrapper" style={{width: '600px', height: '400px'}}>
//                 <b style={{height: '20px'}}>explanatory variables, covid-19</b>
//                 <div className="deaths-pcp-vis" id="deaths-pcp-threejs" style={{height: '400px', width: '600px'}}>
//                     <DeathsAxesLines items={items} selectedAxes={selectedAxes} selectedData={selectedData}
//                                      corrThreshold={corrThreshold} style={{marginTop: '250px'}}/>
//                 </div>
//                 <div className="deaths-pcp-labels" id="deaths-pcp-axes-labels"
//                      style={{display: 'flex', marginLeft: '10px', height: '180px'/*, marginTop: '460px'*/}}>
//                     <DeathParallelLabels corrThreshold={corrThreshold}/>
//                 </div>
//             </div>
//         </div>
//     </div>
//
// </div>
