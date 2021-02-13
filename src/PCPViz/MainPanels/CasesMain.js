import React, {useEffect, useState} from 'react';
import CorrelationTable, {CorrelationMatrix} from "../DataProcessing/CorrelationTable";
import CasesPCPLabels from "../ThreeJSVis/CasesParallelCoordinatesLabel";
import ResetButton from "../SubPanels/Buttons/ResetButton";
import CasesMultiBrushes from "../SubPanels/BrushOnTsne/CasesMultiBrushes";
import casesFactor from "../Data/CasesFactors.json";
import {Slider} from "rsuite";
import CasesParallelCoordinates from '../ThreeJSVis/CasesParallelCoordinates';
import CasesHeatMapViz from "../SubPanels/CorrHeatMap/CasesHeatMap";
import CasesScatterPlotViz from "../SubPanels/ScatterPlot/CasesScatterPlot";
import {Parallel_Lines} from "../ThreeJSVis/CasesParallelCoordinates";
import {Parallel_Labels} from "../ThreeJSVis/CasesParallelCoordinatesLabel";
import CasesPCP from "../D3Vis/CasesPCP";
import {Button} from "react-bootstrap";
import MutualInfo from './../Data/MutualInfo.json';
import MI from "../Data/MutualInfo.json";
import * as d3 from "d3";

let [labels, corrMat] =  CorrelationMatrix(casesFactor);

const resetVariables = () => {}
/**
 * a little function to help us with reordering the result
 */
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    console.log("reorder");
    console.log(result);
    return result;
};

/**
 * Removes an item from one list to another list.
 */
const remove = (list, startIndex) => {
    const result = Array.from(list);
    result.splice(startIndex, 1);

    console.log("remove");
    console.log(result);

    return result;
};

const getItems = (count, offset = 0) =>
    Array.from({length:count}, (v,k) => k).map(k => ({
        id:`${labels[k]}`,
        content: `${labels[k]}`,
    }));


    var caseObj = {};
    corrMat.forEach(function(item){
        if(item["x_feature"] === "cases"){
            caseObj[item["y_feature"]] = item["coeff"];

        }
});

function simulateNetworkRequest(){
    return new Promise((resolve) => setTimeout(resolve, 2000));
}
export function ApplyButton(props){
    const buttonStyle ={
        color: "#fff",
        fontSize: '10px',
        backgroundColor: "#5a6268",
        borderColor: "#6c757d",
        width:"100px",
        height:"30px"
    };

    const [isLoading, setLoading] = useState(false);
    useEffect(() => {
        if(isLoading){
            simulateNetworkRequest().then(() => {
                setLoading(false);
            });
        }

    }, [isLoading]);

    const handleClick = () => {
        setLoading(true);
    }

    return(<>
            <Button
                variant ="primary"
                disabled ={isLoading}
                onClick = {!isLoading? handleClick:null}
                style={buttonStyle}>
                {isLoading? 'Applying...':'Apply' }

            </Button>
        </>
    );
}

export default function CasesMain() {

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

    const [colorScheme, setColorScheme] = useState('Inferno');


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


    useEffect( () =>{

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

    return(
        <div id="covid19-cases-wrapper">
            &nbsp;
            <div id="cases-vis-brush-and-pcp" style={{border:'solid #F5F5F5'}}>
                <div id="my-cases-vis-wrapper">
                    &nbsp;
                    <div id="cases-pcp-wrapper" style={{width:'800px', height:'400px'}}>
                        <b style={{height:'20px'}}>state-by-state variables</b>
                        <div className="cases-pcp-vis" id="cases-pcp-threejs" style={{height:'400px'}} >
                            <CasesParallelCoordinates axes={axes} vertices={vertices} hVertices={hVertices} weightPos={weightPos} modelWeights={modelWeights} mutual_info={mutual_info} hPoints={hPoints} style={{marginTop:'250px'}} />
                        </div>
                        <div className="cases-pcp-labels" id="cases-pcp-axes-labels"  style={{display:'flex', marginLeft:'10px', height:'180px'/*, marginTop: '460px'*/}} >
                            <CasesPCPLabels label_margin={label_margin} axes_labels={axes_labels}></CasesPCPLabels>
                        </div>
                        {/*<CasesPCP></CasesPCP>*/}
                    </div>

                    <div id="cases-sub-multibrush"  >{/*id ="cases-brush-wrapper" */}

                            {/*<div style={ {marginLeft: '6.5rem', marginBottom:'1.3rem', marginTop:'2.8rem'}}>*/}
                            {/*    <ResetButton class="btn-float-left" onClick={resetVariables()}></ResetButton>*/}
                            {/*</div>*/}
                            <CasesMultiBrushes items={items} setSelectedData={setSelectedData} setSelectedAxes={setSelectedAxes}></CasesMultiBrushes>
                    </div>

                    <div id="cases-feature-extraction" width="450" style={{marginLeft: '1.8rem', marginTop: '0.8rem', textAlign:'left'}}>
                        <div onChange={ v =>{
                            setExtractMethod(v.target.value);
                            if(v.target.value === "correlation"){
                                //  console.log("corr");
                                setCorrSlider(false);
                                setMiSlider(true);
                            }
                            if(v.target.value === "mutualInformation"){
                                // console.log("mi");
                                setCorrSlider(true);
                                setMiSlider(false);
                            }
                        }}>
                            <input type="radio" value="mutualInformation" name="extract-method"/> Mutual Information &nbsp;
                            <input type="radio" value="correlation" name="extract-method" defaultChecked/> Correlation  &nbsp;
                        </div>
                        <div id="cases-feature-extraction-slider">
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
                    </div>

                </div>
            </div>
            <div id="cases-sub-wrapper">
                <div className="cases-sub-heatmap" id="cases-sub-heatmap-vis">
                    <div id="cases-svg-interpolation-container" onChange={ v =>{
                            // console.log(v.target.value);
                            setColorScheme(v.target.value);
                        }}>
                        Inferno
                        <input type="radio" value="Inferno" name="color-scheme"/>
                        <div id="color-interpolation-scheme1" />
                        RdBu
                        <input type="radio" value="RdBu" name="color-scheme"/>
                        <div id="color-interpolation-scheme2" />
                        RdYlGn
                        <input type="radio" value="RdYlGn" name="color-scheme"/>
                        <div id="color-interpolation-scheme3" />
                        RdGy
                        <input type="radio" value="RdGy" name="color-scheme"/>
                        <div id="color-interpolation-scheme4" />
                    </div>
                    <CasesHeatMapViz setScatterHorizontal={setScatterHorizontal} setScatterVertical={setScatterVertical} colorScheme={colorScheme}></CasesHeatMapViz>
                </div>
                <div className="cases-sub-scatterplot" id="cases-sub-scatterplot-vis">
                    <CasesScatterPlotViz scatterHorizontal={scatterHorizontal} scatterVertical={scatterVertical}></CasesScatterPlotViz>
                </div>
            </div>

        </div>
    );
}

