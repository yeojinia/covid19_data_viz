import React, {Component, useEffect, useState} from 'react';
import SelectOption from './SelectOption.js';
import './style.css';
import CorrelationTable from './DataProcessing/CorrelationTable.js'
import GeneticAlgorithm from './DataProcessing/GeneticAlgorithm.js'
import worker from "./../worker.js";
import WebWorker from "./../workerSetup";
import CovidCasesPCPGL from "./CovidCasesPCPGL";
import CovidDeathsPCPGL from "./CovidDeathsPCPGL";
import {Canvas} from "react-three-fiber";
import {Slider} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';

class PCPViz extends Component{
    // state-variable & setter
    /*const [seq, setSeq] = useState("1,2,3,4,5");

    const longEvent = async () => {
        for (let i=0; i<100; i++) {
            console.log(i);
        }
    };
    // onSelect event
    const handleOnClick = (event) => {
        setSeq("Calculating...");
        return longEvent().then(() => {
            const value = "1,4,3,2,5";
            console.log(value);
            setSeq(value);
        });
    }*/
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
                <div className = "pcp-wrapper">
                    <h2>
                        (1) What are the variables that are related to COVID-19 confirmed cases?
                    </h2>
                    &nbsp;

                    <CovidCasesPCPGL></CovidCasesPCPGL>

                    <div id="pcp-ui-wrapper">
                        {/*&nbsp;*/}
                        {/*<button onClick={GeneticAlgorithm(4)}> Generate Maximum Correlation Order</button>*/}
                        {/*&nbsp;*/}
                        {/*<input type="text" id="myinput" disabled={true} />*/}
                        {/*<button> Use this sequence</button>*/}
                        {/*&nbsp;*/}
                    </div>

                    &nbsp;
                    <div id="corr-table-wrapper">

                        <b>Correlation Table For Variables</b>
                        <table id="correlation-table">
                            <CorrelationTable id={1}></CorrelationTable>
                        </table>
                    </div>
                </div>

                <div className="deaths-pcp">
                     <h2>
                         (2) What are the conditions contributing to deaths the most involving covid-19 (Cormorbities)?
                     </h2>
                     &nbsp;
                            <CovidDeathsPCPGL></CovidDeathsPCPGL>
                     &nbsp;
                </div>

            </div>

     );
    }
}
export default PCPViz;


