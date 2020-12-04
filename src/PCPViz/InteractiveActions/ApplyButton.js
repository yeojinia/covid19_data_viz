import React, {useEffect, useState} from 'react';
import {Button} from 'react-bootstrap';

function simulateNetworkRequest(){
    return new Promise((resolve) => setTimeout(resolve, 2000));
}

export default function ApplyButton(){
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

    const handleClick = () => setLoading(true);

    return(<>
          <Button
              variant ="primary"
              disabled ={isLoading}
              onClick = {!isLoading? handleClick:null}
              style={buttonStyle}>
              {isLoading? 'Loading...':'Load to PCP' }

          </Button>
        </>
    );
}
