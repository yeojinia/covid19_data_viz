//import React, {Component, useEffect, useState} from 'react';
import React, {Component} from 'react';
import './style.css';
import worker from "./../worker.js";
import WebWorker from "./../workerSetup";
import CasesMain from "./MainPanels/CasesMain";
import DeathsMain from "./MainPanels/DeathsMain";
import 'rsuite/dist/styles/rsuite-default.css';

class PCPViz extends Component{

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
                        Suspected influential variables for COVID-19 confirmed cases
                    </h2>
                    &nbsp;

                    <CasesMain></CasesMain>

                    <div id="pcp-ui-wrapper" key="ui-">
                        {/*&nbsp;*/}
                        {/*<button onClick={GeneticAlgorithm(4)}> Generate Maximum Correlation Order</button>*/}
                        {/*&nbsp;*/}
                        {/*<input type="text" id="myinput" disabled={true} />*/}
                        {/*<button> Use this sequence</button>*/}
                        {/*&nbsp;*/}
                    </div>

                    &nbsp;
                    {/*<div id="corr-table-wrapper">*/}

                    {/*    <b>Correlation Table For Variables</b>*/}
                    {/*    <table id="correlation-table">*/}
                    {/*        <CorrelationTable></CorrelationTable>*/}
                    {/*    </table>*/}
                    {/*</div>*/}
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


