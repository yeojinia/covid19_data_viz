import React, {Component, useState} from 'react';
import './style.css';
import worker from "./../../worker.js";
import WebWorker from "./../../workerSetup";
import Factors2020 from "../Visualizations/LinkedViz/Factors2020";
import 'rsuite/dist/styles/rsuite-default.css';
import DynamicFactorsPCP from "../Visualizations/StandAloneViz/DynamicFactorsPCP.js";
import * as d3 from 'd3';
import Select from "react-select";

const keys_to_interpolate_color= [
    {label: "temperature", value: "temperature"},
    {label: "humidity", value: "humidity"},
    {label: "cases", value: "cases"},
    {label: "deaths", value: "deaths"},
];
var white_to_deep_blue = d3.scaleLinear()
    .domain([0, 0.8])
    .range(['#3B89FE','#8bDbfb'])
    .interpolate(d3.interpolateHcl);

const options_to_color = [
    {label: "Blue to Red", value: d3.interpolateRdBu},
    {label: "Light Blue to Sky Blue", value: white_to_deep_blue}
];

class VizMain extends Component{

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
        this.worker.addEventListener("message", event => {
            this.setState({
                count: event.data.length
            });
        });
        this.worker.onmessage = event => {
        }
    };

     render() {
        return (
            <div className="pcp">
                <div className = "cases-pcp" style={{border: 'solid #F5F5F5'}}>
                    <h2>
                        US Potential Spreading Factors for COVID-19 (cumulative cases during 2020)
                    </h2>
                    &nbsp;

                    <Factors2020></Factors2020>
                    &nbsp;

                </div>

                <div className = "cases-pcp" style={{border: 'solid #F5F5F5'}}>
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
                        <DynamicFactorsPCP state_name={this.state.state_name} count={this.state.count}
                                               key_to_interpolate={this.state.key_to_interpolate} color={this.state.color}>
                        </DynamicFactorsPCP>
                    </div>
                </div>

            </div>

     );
    }
}
export default VizMain;


