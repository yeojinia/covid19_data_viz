//import React, {Component, useEffect, useState} from 'react';
import React, {Component, useState} from 'react';
import './style.css';
import worker from "./../worker.js";
import WebWorker from "./../workerSetup";
import CasesMain from "./MainPanels/CasesMain";
import 'rsuite/dist/styles/rsuite-default.css';
import BrushablePCP from "./MainPanels/BrushPCP/BrushablePCP.js";
import * as d3 from 'd3';
import CounterButton from "./MainPanels/BrushPCP/CounterButton";
import Select from "react-select";

const keys_to_interpolate_color= [
    {label: "temperature", value: "temperature"},
    {label: "humidity", value: "humidity"},
    {label: "cases", value: "cases"},
    {label: "deaths", value: "deaths"},
];
var white_to_deep_blue = d3.scaleLinear()
    .domain([0, 0.8])
    .range(['#0000ff','#dbf3fa'])
    .interpolate(d3.interpolateHcl);

const options_to_color = [
    {label: "Blue to Red", value: d3.interpolateRdBu},
    {label: "White to Blue", value: white_to_deep_blue}
];

class PCPViz extends Component{

    state = {
        state_name: "CA",
        count:0,
        key_to_interpolate: "cases",
        color: d3.interpolateRdBu,
    };
    handleChange = (e) => {
        // console.log(e.target.value);
        this.setState({state_name: e.target.value});
    }
    handleCount(value){
            this.setState(function(prevState) {
                if(prevState.count + value <=5 && prevState.count + value>=0)
                    return ({count: prevState.count + value});
                else
                    return ({count:prevState.count});
            });
    }

    componentDidMount = () => {
        this.worker = new WebWorker(worker);
    };

    fetchWebWorker = () => {
        this.worker.postMessage("Fetch Users");
        //console.log("Fetch");
        this.worker.addEventListener("message", event => {
            this.setState({
                count: event.data.length
            });
        });
        this.worker.onmessage = event => {
            //  console.log(event.data);
            console.log("done");

        }
    };

     render() {
        return (
            <div className="pcp">
                <div className = "cases-pcp">
                    <h2>
                        US Potential Spreading Factors for COVID-19, Cumulative Cases in 2020
                    </h2>
                    &nbsp;

                    <CasesMain></CasesMain>

                    {/*<div id="pcp-ui-wrapper" key="ui-">*/}
                    {/*    /!*&nbsp;*!/*/}
                    {/*    /!*<button onClick={GeneticAlgorithm(4)}> Generate Maximum Correlation Order</button>*!/*/}
                    {/*    /!*&nbsp;*!/*/}
                    {/*    /!*<input type="text" id="myinput" disabled={true} />*!/*/}
                    {/*    /!*<button> Use this sequence</button>*!/*/}
                    {/*    /!*&nbsp;*!/*/}
                    {/*</div>*/}

                    &nbsp;
                    {/*<div id="corr-table-wrapper">*/}

                    {/*    <b>Correlation Table For Variables</b>*/}
                    {/*    <table id="correlation-table">*/}
                    {/*        <CorrelationTable></CorrelationTable>*/}
                    {/*    </table>*/}
                    {/*</div>*/}
                </div>

                <div className = "cases-pcp">
                <h2>
                    US Time-Varying Environmental Factors for COVID-19 (Apr 1st, 2020 ~ Aug 7th, 2021)
                </h2>
                    <h5>
                        Set the axis for color interpolation!
                    </h5>
                    <div id="color-select-wrapper" style={{height: '50px'}}>
                        {/*style={{display:"flex",top: "50%", left: "50%",  transform: "translate(50%, 0%)"}}>*/}
                        <div style={{  display:"flex", justifyContent:"center", alignItems: "center"}}>
                        Color &nbsp;
                            <div style={{width: "150px"}}>
                                <Select options={options_to_color} defaultValue={{label: "Blue to Red", value: d3.interpolateRdBu}}
                                        onChange={v => {
                                            this.setState({color: v.value});
                                        }}
                                        style={{width: '100%'}}/>
                            </div>
                            &nbsp; is interpolated for the range of axis: &nbsp;
                            <div  style={{width: "150px"}}>
                                <Select options={keys_to_interpolate_color} defaultValue={{label: "cases", value: "cases"}}
                                        onChange={v => {
                                            this.setState({key_to_interpolate: v.value});
                                        }}
                                        style={{width: '100%'}}/>
                            </div>
                        </div>
                    </div>
                <h5>
                    Click the State!
                </h5>
                    <div onChange={this.handleChange}>
                        <input type="radio" value="CA" name="state-name" defaultChecked /> CA &nbsp;
                        <input type="radio" value="NY" name="state-name" /> NY &nbsp;
                        <input type="radio" value="TX" name="state-name" /> TX &nbsp;
                        <input type="radio" value="FL" name="state-name" /> FL &nbsp;
                        {/*<input type="radio" value="WA" name="state-name" /> WA &nbsp;*/}
                        <input type="radio" value="OR" name="state-name" /> OR &nbsp;
                    </div>

                {/*<h5>*/}
                {/*    Incubation Period: {this.state.count}*/}
                {/*</h5>*/}
                {/*    <CounterButton sign="+" count={this.state.count} updateCount={this.handleCount.bind(this)} />*/}
                {/*    <CounterButton sign="-" count={this.state.count} updateCount={this.handleCount.bind(this)} />*/}


                    <div style={{width: 1200, height: 900}}>
                        <BrushablePCP state_name={this.state.state_name} count={this.state.count}
                                      key_to_interpolate={this.state.key_to_interpolate} color={this.state.color}>
                        </BrushablePCP>
                    </div>
                </div>


                {/*<div className="deaths-pcp">*/}
                {/*     <h2>*/}
                {/*         (3) What are the disease conditions contributing to deaths the most involving covid-19 (Cormorbities)?*/}
                {/*     </h2>*/}
                {/*     &nbsp;*/}
                {/*     <DeathsMain></DeathsMain>*/}
                {/*     &nbsp;*/}
                {/*</div>*/}

            </div>

     );
    }
}
export default PCPViz;


