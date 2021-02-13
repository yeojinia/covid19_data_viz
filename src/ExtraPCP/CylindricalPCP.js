import React, {Suspense, useMemo} from "react";
import {Canvas, useLoader} from 'react-three-fiber';
import Autompg from './autompg.json';
import AutompgClass from './auto-mpg-class.json';
import * as THREE from "three";
import bold from "./bold.blob";

function Text({ children, vAlign = 'center', hAlign = 'center', size = 1, color = '#000000', ...props }) {

    const font = useLoader(THREE.FontLoader, bold);

    const config = useMemo(
        //() => ({font, size: 0.15, height: 0.2, curveSegments: 10, bevelEnabled: false, bevelThickness: 0, bevelSize: 0, bevelOffset: 0, bevelSegments: 0 }),
        // () => ({ font, size: 40, height: 30, curveSegments: 32, bevelEnabled: true, bevelThickness: 6, bevelSize: 2.5, bevelOffset: 0, bevelSegments: 8 }),
        () => ({font, size: 0.15, height: 0.2, curveSegments: 10, bevelEnabled: false, color:'#000000'}),
        [font]
    )

    return (
        <group {...props} scale={[0.7, 0.7, 1]}>
            {/*<mesh ref={mesh}>*/}
            <mesh>
                <textBufferGeometry args={[children, config]} />
                <meshNormalMaterial />
            </mesh>
        </group>
    )
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

function DrawPolylines(leftKey, rightKey, mini_vals, maxi_vals, bottom, top, radius, offset, autompg) {

    var Pts = [];

    var slices = 61;
    var stacks = 61;
    var NumLngs = slices;
    var NumLats = stacks;
    var thetaMin = 0;
    var thetaMax = Math.PI;

    var length = top - bottom;
    autompg.map((elem, idx) => {

        if (elem[leftKey] !== '?' && elem[rightKey] !== '?') {
            var heightL = bottom + length * (elem[leftKey] - mini_vals[leftKey]) / (maxi_vals[leftKey] - mini_vals[leftKey]);
            var heightR = bottom + length * (elem[rightKey] - mini_vals[rightKey]) / (maxi_vals[rightKey] - mini_vals[rightKey]);

            var xL = Math.cos(thetaMin);
            var yL = heightL;
            var zL = Math.sin(thetaMin);

            var xR = Math.cos(thetaMax);
            var yR = heightR;
            var zR = Math.sin(thetaMax);

            var size = 8;
            var pointSet = [];
            pointSet.push([radius * (xL), yL, radius * (zL)]);
            for (let i = 1; i < size; i++) {
                var theta = thetaMin + (thetaMax - thetaMin) * (i) / size;
                var y = yL + (yR - yL) * (i) / size;
                var x = Math.cos(theta);
                var z = Math.sin(theta);
                pointSet.push([radius * (x), y, radius * (z)]);
            }
            pointSet.push([radius * (xR), yR, radius * (zR)]);

            for (let i = 0; i < pointSet.length - 1; i++) {
                Pts.push([[-pointSet[i][0] + offset, pointSet[i][1], pointSet[i][2],
                    -pointSet[i + 1][0] + offset, pointSet[i + 1][1], pointSet[i + 1][2]], AutompgClass[idx]["class"]]);
            }
            // Pts.push([[-(radius * (xL) - offset), yL, radius * (zL), -(radius * (xR) - offset), yR, radius * (zR)], AutompgClass[idx]["class"]]);
        }

    })


    return Pts;

}

function CylindricalPCPViz() {
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

    var radius = 0.25;
    var axis_bot = -1.5;
    var axis_top = 1.5;
    let dataPointPairs = [];
    for (var i = 0; i < keys.length - 1; i++) {
        var offset = -1.75 + radius + i * radius * 2;
        var lines = DrawPolylines(keys[i], keys[i + 1], mini_vals, maxi_vals, axis_bot, axis_top, radius, offset, Autompg);
        for (var j = 0; j < lines.length; j++) {
            dataPointPairs.push(lines[j]);
        }

    }

    return (

        <Canvas id="cylindrical-pcp-canvas" context="2d"
                style={{width: '800px', height: '400px', background: 'white'}}
                camera={{
                    isOrthographicCamera: true,
                    position: [0, 0, 4],
                    fov: 90,
                    aspect: 1,
                    near: 0.1,
                    far: 100,
                    up: [0, 1, 0]
                }}
        >

            <Suspense fallback={null}>

            {
                keys.map((key, key_idx) => {
                    var m = -1.75 + key_idx * radius * 2;

                    return <Line key={"CY-axis-" + key_idx}
                                 points={[0 + m, axis_top, 0, 0 + m, axis_bot, 0]}
                                 width={0.02} color={"#e0fe3f"} opacity={0.01}/>
                })
            }

            {/*{*/}
            {/*    dataPointPairs.map((elem, elem_index) => {*/}
            {/*        var color = ["rgb(38, 130, 112)", "rgb(58, 199, 10)",*/}
            {/*            "rgb(199, 26, 18)", "rgb(255, 255, 178)", "rgb(204, 130, 1)",*/}
            {/*            "rgb(191, 100, 54)", "rgb(38, 100, 212)", "#e0fe3f", "#e0fe3f"];*/}
            {/*        //"rgb(191, 100, 54)" rgb(36, 199, 145)*/}
            {/*        return <Line key={"cy-data-" + elem_index}*/}
            {/*                     points={elem[0]}*/}
            {/*                     width={0.01} color={color[+(elem[1])]} opacity={0.01}/>*/}
            {/*    })*/}
            {/*}*/}

            {
                keys.map((elem, index) => {
                    var str = elem.replace(" ","—");
                    var m = -1.75 + index * radius * 2;
                    return(
                        <Text key={"cy-key-" + index} hAlign="left" position={[0+m, 1.2, 0]} children={str.toUpperCase()} color={"#000000"} />
                    )
                })
            }
            </Suspense>
        </Canvas>

    );

}

export default CylindricalPCPViz;
