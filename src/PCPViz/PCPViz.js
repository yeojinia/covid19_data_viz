//import React, {Component, useEffect, useState} from 'react';
import React, {Component} from 'react';
import './style.css';
import worker from "./../worker.js";
import WebWorker from "./../workerSetup";
import CasesMain from "./MainPanels/CasesMain";
import 'rsuite/dist/styles/rsuite-default.css';
import BrushablePCP from "./MainPanels/BrushPCP/BrushablePCP.js";

class PCPViz extends Component{

    state = {
        state_name: "CA"
    };
    handleChange = (e) => {
        // console.log(e.target.value);
        this.setState({state_name: e.target.value});
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

/*
    useEffect( () =>{
        init('webgl');
    });
*/
     render() {
        //init('webgl');
        return (
            <div className="pcp">
                <div className = "cases-pcp">
                    <h2>
                        Potential spreading factors for COVID-19 (total 2020)
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
                    Time-dependent spreading factors for COVID-19 (Apr, 2020 ~ Aug, 2021)
                </h2>
                <h5>
                    Click the State!
                </h5>
                    <div onChange={this.handleChange}>
                        <input type="radio" value="CA" name="state-name" /> CA &nbsp;
                        <input type="radio" value="NY" name="state-name" /> NY &nbsp;
                        <input type="radio" value="TX" name="state-name" /> TX &nbsp;
                        <input type="radio" value="FL" name="state-name" /> FL &nbsp;
                        {/*<input type="radio" value="WA" name="state-name" /> WA &nbsp;*/}
                        <input type="radio" value="OR" name="state-name" /> OR &nbsp;
                    </div>
                    <div style={{width: 1200, height: 900}}>
                        <BrushablePCP state_name={this.state.state_name} ></BrushablePCP>
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


