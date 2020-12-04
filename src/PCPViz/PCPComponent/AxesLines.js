import React, {useEffect, useState} from "react";
import {extend, Canvas} from 'react-three-fiber';
import {MeshLine, MeshLineMaterial} from 'three.meshline';
import casesFactor from "../CasesFactors.json";
import * as THREE from "three";
import {CorrelationMatrix} from "../DataProcessing/CorrelationTable";

extend({MeshLine, MeshLineMaterial})

let [labels, corrMat] = CorrelationMatrix(casesFactor);

var caseObj = {};
corrMat.forEach(function (item) {
    if (item["x_feature"] === "cases") {
        caseObj[item["y_feature"]] = item["coeff"];
    }

});

export function CatMullRomCurveSculpting(points)
{
    //console.log(points);
    var curvePointSet = [];

    var pointLen = points.length;

    // first
    var first_point = {
        _x: (2*points[0]._x - points[1]._x),
        _y: (2*points[0]._y - points[1]._y),
        _z: (2*points[0]._z - points[1]._z)
    };
    // last
    var last_point = {
        _x: (2 * points[pointLen - 1]._x - points[pointLen - 2]._x),
        _y: (2 * points[pointLen - 1]._y - points[pointLen - 2]._y),
        _z: (2 * points[pointLen - 1]._z - points[pointLen - 2]._z)
    };

    points.unshift(first_point);
    points.push(last_point);
    //console.log(points);

    var quantization = 15;
    for(var i=0; i<points.length-3; i++){
        for(var j=0; j<quantization; j++) {
            var t = j/quantization;
            var x = 0.5* (2*points[i+1]._x + t*(-points[i]._x + points[i+2]._x) + t*t*(2*points[i]._x - 5 * points[i+1]._x + 4*points[i+2]._x - points[i+3]._x) + t*t*t*(-points[i]._x + 3*points[i+1]._x - 3*points[i+2]._x + points[i+3]._x));
            var y = 0.5* (2*points[i+1]._y + t*(-points[i]._y + points[i+2]._y) + t*t*(2*points[i]._y - 5 * points[i+1]._y + 4*points[i+2]._y - points[i+3]._y) + t*t*t*(-points[i]._y + 3*points[i+1]._y - 3*points[i+2]._y + points[i+3]._y));
            var z = 0.5* (2*points[i+1]._z + t*(-points[i]._z + points[i+2]._z) + t*t*(2*points[i]._z - 5 * points[i+1]._z + 4*points[i+2]._z - points[i+3]._z) + t*t*t*(-points[i]._z + 3*points[i+1]._z - 3*points[i+2]._z + points[i+3]._z));
            curvePointSet.push(x, y, z);
        }
    }
   // console.log(curvePointSet);
    return curvePointSet;
}

export function Line({points, width, color}) {

    return (
        <mesh>
            <meshLine attach="geometry" points={points}/>
            <meshLineMaterial attach="material"
                              transparent
                              depthTest={false}
                              lineWidth={width}
                              color={color}
                // dashArray={0.}
                // dashRatio={0.1}
            />
        </mesh>
    )
}

export default function ParallelLines(props) {
    const [points, setPoints] = useState([]);
    const [hPoints, setHPoints] = useState([]);
    const [hCurve, setHCurve] = useState([]);

    useEffect(() => {

        // var points_ = [];
        // for (let j = 0; j < Math.PI; j += (2 * Math.PI) / 100) {
        //     points_.push(Math.cos(j), Math.sin(j), 0);
        //     //console.log(Math.cos(j), Math.sin(j));
        // }
        // points_.push(-1,-1,0);
        // points_.push(1,1,0);
        // // points_.push(0.8,0.3,0,0);
        // // points_.push(0,0.6,0,0);
        // setPoints(points_);

       // console.log(props.corrThreshold);
        var axesChosen = {};
        //console.log(caseObj);
        //console.log(props.corrThreshold["corrThreshold"]);
        for (var pos in caseObj) {
           // console.log(pos, caseObj[pos]);
            if ( 1 - Math.abs(caseObj[pos]) < props.corrThreshold["corrThreshold"]) {
                //console.log(pos);
                axesChosen[pos] = caseObj[pos];

            }
        }

        //console.log(Object.keys(axesChosen));

        //console.log(casesFactor);
        var minimums = {};
        var maximums = {};
        Object.keys(axesChosen).forEach(function (item, index) {
            minimums[item] = (Math.min.apply(null, casesFactor.map((v) => v[item])));
            maximums[item] = (Math.max.apply(null, casesFactor.map((v) => v[item])));
        });


        var selected_instance = {};
        for (var i = 0; i < casesFactor.length; i++) {
            selected_instance[casesFactor[i]["states"]] = false;
        }
        var dataChosen = props.selectedData;
        Object.entries(dataChosen).forEach(entry => {
            const [key, value] = entry;
            selected_instance[key] = true;
        });
        //console.log(selected_instance);

        var lineSet = [], hLineSet = [], controlPointSets = [];
        var axesNums = Object.keys(axesChosen).length;
        var left = -1, bottom = -1;
        var right = 1, top = 1;
        var side_margin = (right - left) * 0.05;
        var drawing_width = right - left - (2 * side_margin);
        var drawing_height = top - bottom;
        for (var i = 0; i < casesFactor.length; i++) {
            var pointSet = [], hPointSet = [];
            if (selected_instance[casesFactor[i]["states"]] === false) {
                Object.keys(axesChosen).forEach(function (item, index) {
                    var x = left + side_margin + drawing_width * (index / (axesNums - 1));
                    var y = bottom + drawing_height * (casesFactor[i][item] - minimums[item]) / (maximums[item] - minimums[item]);
                    pointSet.push(x, y, 0);
                });
                lineSet.push(pointSet);
            }
            else{
                var controlPointSet = [];
                Object.keys(axesChosen).forEach(function (item, index) {
                    var x = left + side_margin + drawing_width * (index / (axesNums - 1));
                    var y = bottom + drawing_height * (casesFactor[i][item] - minimums[item]) / (maximums[item] - minimums[item]);
                    hPointSet.push(x, y, 0);
                    var controlPoint = {
                        _x: x,
                        _y: y,
                        _z: 0
                    };
                    controlPointSet.push(controlPoint);
                });
                controlPointSets.push(CatMullRomCurveSculpting(controlPointSet));
                hLineSet.push(hPointSet);
            }
        }
        setPoints(lineSet);
        setHPoints(hLineSet);
        setHCurve(controlPointSets);
    }, [props.selectedAxes, props.items, props.corrThreshold, props.selectedData]);


    return (
        <Canvas style={{width: '600px', height: '400px'}}
                camera={{
                    isOrthographicCamera: true,
                    position: [0, 0, 1],
                    fov: 90,
                    aspect: 1,
                    near: 0.1,
                    far: 1000,
                    up: [0, 1, 0]
                }}
        >
            {points.map((value, index) => {
                return <Line points={value} width={0.005} color={'#A2CCB6'}></Line>
            })}
            {/*{hPoints.map((value, index) => {*/}
            {/*    return <Line points={value} width={0.015} color={'#FCEEB5'}></Line>*/}
            {/*})}*/}
            {hCurve.map((value, index) => {
                return <Line points={value} width={0.015} color={'#FCEEB5'}></Line>
            })}
        </Canvas>
    )
}