import React from "react";
import {Canvas} from 'react-three-fiber';
import Autompg from './autompg.json';
import AutompgClass from './auto-mpg-class.json';
import * as THREE from "three";

function IdxOfPtSet(lat, lng, NumLats, NumLngs) {
    if (lat < 0) lat += (NumLats - 1);
    if (lng < 0) lng += (NumLngs - 1);
    if (lat > NumLats - 1) lat -= (NumLats - 1);
    if (lng > NumLngs - 1) lng -= (NumLngs - 1);

    // return NumLats*lng + lat;
    return NumLats * lng;
}

function Quantize(radius, thetaL, phiL, thetaR, phiR, size) {

    var pointSet = [];

    var xzL = Math.cos(thetaL);
    var yL = Math.sin(thetaL);
    var xL = xzL * Math.cos(phiL);
    var zL = -xzL * Math.sin(phiL);
    pointSet.push([radius * (xL), radius * (yL), radius * (zL)]);

    for (let i = 1; i < size; i++) {
        var theta = thetaL * (size - i) / size + thetaR * i / size;
        var phi = phiL * (size - i) / size + phiR * i / size;

        var xz = Math.cos(theta);
        var y = Math.sin(theta);
        var x = xz * Math.cos(phi);
        var z = -xz * Math.sin(phi);
        pointSet.push([radius * (x), radius * (y), radius * (z)]);
    }

    var xzR = Math.cos(thetaR);
    var yR = Math.sin(thetaR);
    var xR = xzR * Math.cos(phiR);
    var zR = -xzR * Math.sin(phiR);
    pointSet.push([radius * (xR), radius * (yR), radius * (zR)]);

    var pointPairSet = [];
    for (let i = 0; i < pointSet.length - 1; i++) {
        pointPairSet.push([pointSet[i][0], pointSet[i][1], pointSet[i][2], pointSet[i + 1][0], pointSet[i + 1][1], pointSet[i + 1][2]]);
    }
    return pointPairSet;
}

function DrawPolylines(leftKey, rightKey, mini_values, maxi_values, radius, autompg) {

    var slices = 61;
    var stacks = 61;
    var NumLngs = slices;
    var NumLats = stacks;

    var Pts = [];
    var thetaMax = -Math.PI / 2. + Math.PI * (NumLats - 11) / (NumLats - 1);
    var thetaMin = -Math.PI / 2. + Math.PI * (10) / (NumLats - 1);
    var phiL = -Math.PI + 2. * Math.PI * (14) / (NumLngs - 1);
    var phiR = -Math.PI + 2. * Math.PI * (17) / (NumLngs - 1);

    autompg.map((elem, idx) => {

        if (elem[leftKey] !== '?' && elem[rightKey] !== '?') {
            var thetaL = elem[leftKey] === mini_values[leftKey] ? thetaMin : thetaMin + (thetaMax - thetaMin) * (elem[leftKey] - mini_values[leftKey]) / (maxi_values[leftKey] - mini_values[leftKey]);
            var thetaR = elem[rightKey] === mini_values[rightKey] ? thetaMin : thetaMin + (thetaMax - thetaMin) * (elem[rightKey] - mini_values[rightKey]) / (maxi_values[rightKey] - mini_values[rightKey]);

            // quantize
            var size = 5;
            var pointSet = Quantize(radius, thetaL, phiL, thetaR, phiR, size);

            //AutompgClass
            for (var iPair = 0; iPair < pointSet.length; iPair++) {
               // console.log(AutompgClass[idx]["class"]);
                Pts.push([pointSet[iPair], AutompgClass[idx]["class"]]);
            }
//            Pts.push([radius * (xL), radius * (yL), radius * (zL), radius * (xR), radius * (yR), radius * (zR)]);
        }
    })

    return Pts;
}

function DrawLongitudinalAxes(radius) {
    var slices = 61;
    var stacks = 61;
    var NumLngs = slices;
    var NumLats = stacks;

    var Pts = [];

    for (var ilat = 10; ilat < NumLats - 10; ilat++) {
        var lat = -Math.PI / 2. + Math.PI * ilat / (NumLats - 1);
        var xz = Math.cos(lat);
        var y_ = Math.sin(lat);
        for (var ilng = 14; ilng <= 17; ilng++) {
            var lng = -Math.PI + 2. * Math.PI * ilng / (NumLngs - 1);
            var x_ = xz * Math.cos(lng);
            var z_ = -xz * Math.sin(lng);

            if (ilng === 14 || ilng === 17) {
                var pt = {
                    x: radius * (x_), y: radius * (y_), z: radius * z_,
                    nx: 0, ny: 0, nz: 0,
                    s: 0, t: 0
                };
                Pts.push(pt);
            }
        }
    }
    return Pts;

}

function DrawSphere(radius) {
    var slices = 60;
    var stacks = 60;
    var NumLngs = slices;
    var NumLats = stacks;

    var Pts = new Array(NumLngs * NumLats);

    for (var ilat = 0; ilat < NumLats; ilat++) {
        var lat = -Math.PI / 2. + Math.PI * ilat / (NumLats - 1);
        var xz = Math.cos(lat);
        var y_ = Math.sin(lat);
        for (var ilng = 0; ilng < NumLngs; ilng++) {
            var lng = -Math.PI + 2. * Math.PI * ilng / (NumLngs - 1);
            var x_ = xz * Math.cos(lng);
            var z_ = -xz * Math.sin(lng);

            var idx = IdxOfPtSet(ilat, ilng, NumLats, NumLngs);
            var pt = {
                x: 0, y: 0, z: 0,
                nx: 0, ny: 0, nz: 0,
                s: 0, t: 0
            };
            Pts[idx] = pt;
        }
    }
    // console.log(Pts);
    // Pts.forEach((point, index) => {
    //     if( (index + 1) !== Pts.length)
    //      return <Line key={"sp-axis-" + index} points={[Pts[index].x, Pts[index].y, Pts[index].z, Pts[index+1].x, Pts[index+1].y, Pts[index+1].z]} width={0.02} color={'#e0fe3f'} opacity={0.01}/>
    // });
    return Pts;

}

function Line({points, width, color}) {

    return (
        <mesh>

            <meshLine attach="geometry" points={points} translateX={1}/>
            <meshLineMaterial attach="material"
                              transparent
                              depthTest={false}
                              lineWidth={width}
                              color={color}
            />

        </mesh>
    )
}

function SphericalPCPViz() {

    var keys = Object.keys(Autompg[0]);

    var mini_vals = {};
    var maxi_vals = {};

    keys.forEach((key) => {
        mini_vals[key] = Autompg[0][key];
        maxi_vals[key] = Autompg[0][key];
    });

    Autompg.map((element) => {
            keys.forEach((key) => {
                if (element[key] !== '?') {
                    mini_vals[key] = Math.min(mini_vals[key], element[key]);
                    maxi_vals[key] = Math.max(maxi_vals[key], element[key]);
                }
            });
        }
    );

    var radius = 1.03;

    var Pts = DrawLongitudinalAxes(radius);
    let pointPairs = [];
    for (let i = 0; i < Pts.length - 2; ++i) {
        pointPairs.push({
            'point1': Pts[i],
            'point2': Pts[i + 2]
        });
    }

    let dataPointPairs = [];
    for (var i = 0; i < keys.length - 1; i++) {
        var m_ = -0.97 + i * 0.32;
        var lines = DrawPolylines(keys[i], keys[i + 1], mini_vals, maxi_vals, radius, Autompg);
        //console.log(lines);
        for (var j = 0; j < lines.length; j++) {
            lines[j][0][0] = m_ + lines[j][0][0];
            lines[j][0][3] = m_ + lines[j][0][3];
            dataPointPairs.push(lines[j]);
        }
    }


    var light = new THREE.HemisphereLight(0x404040, 0xFFFFFF, 0.5);
    return (

        <Canvas id="spherical-pcp-canvas" context="2d"
                style={{width: '800px', height: '400px', background: 'white'}}
                camera={{
                    isOrthographicCamera: true,
                    position: [0, 0, 2.2],
                    fov: 90,
                    aspect: 1,
                    near: 0.1,
                    far: 1000,
                    up: [0, 1, 0]
                }}
                scene = {light}
        >
            {/*<Line key={"sp-axis-z"}*/}
            {/*      points={[0, 0, 2, 0, 0, 0]}*/}
            {/*      width={0.02} color={'#e0fe3f'} opacity={0.01}/>*/}

            {/*<Line key={"sp-axis-y"}*/}
            {/*      points={[0, 2, 0, 0, 0, 0]}*/}
            {/*      width={0.02} color={'#e0fe3f'} opacity={0.01}/>*/}

            {/*<Line key={"sp-axis-x"}*/}
            {/*      points={[2, 0, 0, 0, 0, 0]}*/}
            {/*      width={0.02} color={'#ff0000'} opacity={0.01}/>*/}

            {

                keys.map((key, key_idx) => {
                    return pointPairs.map(({point1, point2}, index) => {
                        if (key_idx < keys.length - 1) {
                            var m = -0.97 + key_idx * 0.32;

                            return <Line key={"sp-axis-" + index}
                                         points={[point1.x + m, point1.y, point1.z, point2.x + m, point2.y, point2.z]}
                                         width={0.02} color={"#e0fe3f"} opacity={0.01}/>
                        }
                    })
                })
            }
            {
                dataPointPairs.map((elem, elem_index) => {
                    var color = ["rgb(38, 130, 112)", "rgb(58, 199, 10)",
                        "rgb(199, 26, 18)", "rgb(255, 255, 178)", "rgb(204, 130, 1)",
                        "rgb(191, 100, 54)", "rgb(38, 100, 212)", "#e0fe3f", "#e0fe3f"];
                    //                   console.log(+(elem[1]), color[+(elem[1])]);
                    //"rgb(191, 100, 54)" rgb(36, 199, 145)
                    return <Line key={"sp-data-" + elem_index}
                                 points={elem[0]}
                                 width={0.01} color={color[+(elem[1])]} opacity={0.01}/>
                })
            }
        </Canvas>

    );
}

export default SphericalPCPViz;