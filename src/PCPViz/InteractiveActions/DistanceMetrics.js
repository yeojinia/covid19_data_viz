import React from 'react';
import Combobox from 'react-widgets';

//export default function DistanceMetrics(){
class DistanceMetrics extends React.Component {
    colors = ['orange', 'red', 'blue', 'purple'];

    state = {
        allowCustom: true
    };

    onChange = (event) => {
        this.setState({
            allowCustom: event.target.checked
        });
    }


    render(){
        const allowCustom = this.state.allowCustom;
        return (
        <div>
            {/*<Combobox*/}
            {/*    disabled*/}
            {/*    data={this.colors}*/}
            {/*    allowCustom={allowCustom}*/}
            {/*/>*/}
        </div>
        );
    };

    // render() {
    //     let distance_metric = ["euclidean"];
    //     //return (
    //     return (
    //         <div>
    //             <Combobox data ={}  defaultValue={"euclidean"} />*/}
    //         </div>
    //     );
    // }
    //);
};

export default DistanceMetrics;
// ReactDOM.render(
//     <DistanceMetrics />,
//     document.querySelector('my-app')
// );