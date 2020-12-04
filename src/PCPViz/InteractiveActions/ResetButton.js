import React, {useEffect, useState} from "react";
import {Button} from "react-bootstrap";


export default function ResetButton() {
    const buttonStyle = {
        fontSize: '12px',
        color: "#fff",
        backgroundColor: "#5a6268",
        borderColor: "#6c757d",
        width: "100px",
        height: "30px",

    };

    const handleClick = () => {};

    return(<>
            <Button
                onClick = {handleClick}
                style={buttonStyle}>
                {'Reset'}
            </Button>
        </>
    );
}