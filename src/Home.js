import React, {Component} from "react";
import ReactCountdownClock from "react-countdown-clock";
import worker from "./worker.js";
import WebWorker from "./workerSetup";
import "./App.css";

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            count: 0
        };
    }

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

    componentDidMount = () => {
        this.worker = new WebWorker(worker);
    };

    render() {
        return (
            <div className="App-bottom">


                <section className="App-right">
                    <ReactCountdownClock
                        seconds={100}
                        color="#e56"
                        alpha={0.9}
                        size={300}
                    />
                    <p className="text-center">Total User Count: {this.state.count}</p>
                    <button className="btn-worker" onClick={this.fetchWebWorker}>
                        Fetch Users with Web Worker
                    </button>
                </section>
            </div>
        );
    }
}

export default Home;