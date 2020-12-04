import React from "react";


export default function AxesLabel(data, text) {
    var data_keys = Object.keys(data[0]);
    data_keys.shift()
    // console.log(mobility_keys);

    // look up canvas id="text"

    var textCanvas = document.querySelector(text);
    var ctx = textCanvas.getContext("2d");
    ctx.clearRect(0, 0, textCanvas.clientWidth, textCanvas.clientHeight);
    ctx.font = "10px Arial";
    var side_margin = 0.025*(textCanvas.clientWidth);
    var span = (textCanvas.clientWidth)* 0.9 /(data_keys.length -1);
    var i = 0;
    data_keys.forEach(function(d){
        ctx.fillText(d, side_margin + i*span, 20);
        i++;
    } )
}