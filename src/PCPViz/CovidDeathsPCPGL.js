import React, {useEffect, useState} from 'react';
import init from './WebGL/Init';

export default function CovidDeathsPCPGL() {
    useEffect( () =>{
        init('deaths_webgl');
    });

    return(
        <div id="pcp-deaths-wrapper" width="600" height="400" position="relative">
            <canvas id="deaths_webgl" width="600" height="400" top="0" left="0" position="absolute" style={{border: '1px solid black'}}></canvas>
            <canvas id="text2" width="600" height="400" position="absolute"></canvas>
        </div>
    );
}