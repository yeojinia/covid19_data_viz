import React, {useEffect, useState} from 'react';
import {Button} from 'react-bootstrap';
import Parallel_Lines from './../../ThreeJSVis/ParallelCoordinates';
import {Parallel_Labels} from "../../ThreeJSVis/CasesParallelCoordinatesLabel";

function simulateNetworkRequest(){
    return new Promise((resolve) => setTimeout(resolve, 2000));
}

export default function ApplyButton(props){
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
        // console.log("handle Click");
        var {axesLineSet, lineSet, hLineSet, weightPos, controlPointSet, mi} = Parallel_Lines(props.corrSlider, props.corrThreshold, props.miSlider, props.miThreshold, props.selectedData);
        var {label_margin, axes_labels} = Parallel_Labels(props.corrSlider, props.corrThreshold, props.miSlider, props.miThreshold);

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
