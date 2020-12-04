import React, {useEffect, useState} from 'react';
//import {Text} from 'react-native-web';
import init from './WebGL/Init';
import CorrelationTable, {CorrelationMatrix} from "./DataProcessing/CorrelationTable";
import CovidCasesBrush from "./InteractiveActions/CovidCasesBrush";
import {Canvas} from "react-three-fiber";
import ParallelAxes from "./PCPComponent/Axes";
import ParallelLabels from "./PCPComponent/Labels";
import AxesScrollingList from "./InteractiveActions/AxesControlUI";
import ApplyButton from "./InteractiveActions/ApplyButton";
import ResetButton from "./InteractiveActions/ResetButton";
import casesFactor from "./CasesFactors.json";
import {Slider} from "rsuite";
import ParallelLines from './PCPComponent/AxesLines';
import DistanceMetrics from './InteractiveActions/DistanceMetrics';

let [labels, corrMat] =  CorrelationMatrix(casesFactor);

const resetVariables = () => {

}
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

export default function CovidCasesPCPGL() {
    const [items, setItems] = useState(getItems(labels.length));
    const [selectedAxes, setSelectedAxes] = useState({});
    const [corrThreshold, setCorrThreshold] = useState({"corrThreshold":1});
    const [selectedData, setSelectedData] = useState({});

    const handleStyle = {
        color: '#fff',
        fontSize: 12,
        width: 32,
        height: 22
    };

    const rotateText = {
        display: 'inline-block',
        textAlignVertical: "center",
        transform: 'rotate(90deg)',
        WebkitTransform: 'rotate(90deg)'
    };

    var selectedAxesSubset = {};

    useEffect( () =>{

        var axesSubset ={};
         for(var key in caseObj){
             if(caseObj[key] <= corrThreshold["corrThreshold"])
                 axesSubset[key] = true;
             else
                 axesSubset[key] = false;
         }
        selectedAxesSubset = axesSubset;

        // Object.keys(selectedAxesSubset).map((item, i) => (
        //
        //   "
        //     <span style={{
        //         width:600/selectedAxesSubset.length+'px', height:'100px', verticalAlign:'left'
        //     }}>
        //         <text style={{
        //             fontSize: '10px',
        //             WebkitTransform: 'rotate(90deg)',
        //             display: 'inline-block',
        //             marginLeft: '0px',
        //             marginTop: '-50px',
        //             whiteSpace: 'nowrap',
        //             overflow: 'hidden'
        //             }}>
        //             {console.log(selectedAxesSubset[item])}
        //             {/*items[item].id*/}
        //         </text>
        //
        //     </span>
        //
        // ))
        // init('cases_webgl');
    }, [items, selectedAxes, selectedData, corrThreshold]);


    //selectedAxesSubset[items[item].id]

    const handleOnSelect = (event) => {
        const value = event.currentTarget.value;
        console.log(value);
        setItems(value);
    }

    const onDragEnd = result => {
        const {source, destination} = result;
        console.log(result);

        if(!result.destination){
            const items_ = remove(
                items,
                result.source.index
            );
            setItems(items_);
        }
        else {
            const items_ = reorder(
                items,
                result.source.index,
                result.destination.index
            );
            setItems(items_);
        }
    }

    return(
        <div id="covid19-cases-wrapper">
            {/*//style={{marginTop:'-2.8rem'}}*/}
            <div style={ {marginLeft: '1.8rem', marginBottom:'1.3rem', marginTop:'-2.8rem'}}>
                <ResetButton class="btn-float-left" onClick={resetVariables()}></ResetButton>
            </div>

            <div id="feature-extraction-slider" width="450" style={{marginLeft: '1.8rem', marginTop: '3.8rem', textAlign:'left'}}>
                <b style={{height:'20px'}}> Correlation with cases </b>
                <Slider
                    min={0}
                    max={1}
                    step = {0.01}
                    defaultValue ={1.0}
                    onChange = { v => {
                        //  console.log(v);
                        setCorrThreshold({corrThreshold:v});
                    }}
                    style={{ width: 200 }}  />
                {/*<b> Feature Extractor </b>*/}
                {/*&nbsp;*/}
                {/*<Slider*/}
                {/*    step={1}*/}
                {/*    defaultValue={items.length}*/}
                {/*    graduated*/}
                {/*    progress*/}
                {/*    min={1}*/}
                {/*    max={items.length}*/}
                {/*    renderMark={mark => {*/}
                {/*        return mark;*/}
                {/*    }}*/}
                {/*    onChange={v => {*/}

                {/*        //console.log(v);*/}
                {/*    }}*/}
                {/*    style={{width: 30 * items.length}}*/}
                {/*/>*/}
            </div>

            <div id="axes-control-wrapper" style={{marginLeft: '1.8rem', marginTop: '0.5rem'}}>
                {/*<b>Axes Information</b>*/}
                {/*<AxesScrollingList items={items} onDragEnd={onDragEnd}></AxesScrollingList>*/}
                {/*&nbsp;*/}

            </div>

            &nbsp;
            <div id="cases-pcp">
                <div id="my-vis-wrapper">
                    <div id ="cases-brush-wrapper">
                        <b> state-by-state data projected by t-SNE </b>
                        <DistanceMetrics />
                        <CovidCasesBrush items={items} setSelectedAxes={setSelectedAxes} setSelectedData={setSelectedData}></CovidCasesBrush>
                    </div>
                    &nbsp;
                    <div id="cases-pcp-wrapper" style={{width:'600px', height:'400px'}}>
                        <b style={{height:'20px'}}>explanatory variables, covid-19</b>
                        <div class="cases-pcp-vis" id="cases-pcp-threejs" width="600" style={{height:'400px'}} >
                            {/*<ParallelAxes items={items} selectedAxes={selectedAxes} selectedData={selectedData} corrThreshold={corrThreshold} style={{marginTop:'250px'}} />*/}
                            <ParallelLines items={items} selectedAxes={selectedAxes} selectedData={selectedData} corrThreshold={corrThreshold} style={{marginTop:'250px'}} />
                        </div>
                        <div class="cases-pcp-labels" id="cases-pcp-axes-labels"  style={{display:'flex', marginLeft:'10px', height:'180px'/*, marginTop: '460px'*/}} >
                            <ParallelLabels corrThreshold={corrThreshold}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        // translate(0px,'+ 40* i + 'px)

        /*<canvas id="cases_webgl" width="600" height="400"  style={{border: '1px solid black'}}></canvas>
                <canvas id="text" width="600" height="400" ></canvas>*/
        /*
                    <div id="pcp-cases-wrapper" width="600" height="400" position="relative">
                <canvas id="cases_webgl" width="600" height="400" top="0" left="0" position="absolute" style={{border: '1px solid black'}}></canvas>
                <canvas id="text" width="600" height="400" position="absolute"></canvas>
         */
    );
}

//<Canvas width = "600" height ="400">
//<AxesComponent/>
//</Canvas>
