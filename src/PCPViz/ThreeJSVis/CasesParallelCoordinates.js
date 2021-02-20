import React, {useEffect, useState} from "react";
import {extend, Canvas} from 'react-three-fiber';
import {MeshLine, MeshLineMaterial} from 'three.meshline';
import casesFactor from "../Data/CasesFactors.json";
import * as THREE from "three";
import {CorrelationMatrix} from "../DataProcessing/CorrelationTable";
import MI from '../Data/MutualInfo.json';
import MutualInfo from "../Data/MutualInfo.json";
import jsregression from "js-regression";

extend({MeshLine, MeshLineMaterial})

let [labels, corrMat] = CorrelationMatrix(casesFactor);

var caseObj = {};
corrMat.forEach(function (item) {
    if (item["x_feature"] === "cases") {
        caseObj[item["y_feature"]] = item["coeff"];
    }

});

export function CatMullRomCurveSculpting(points) {
    //console.log(points);
    var curvePointSet = [];

    var pointLen = points.length;
    if (pointLen < 2) {
        return curvePointSet;
    }

    // first
    var first_point = {
        _x: (2 * points[0]._x - points[1]._x),
        _y: (2 * points[0]._y - points[1]._y),
        _z: (2 * points[0]._z - points[1]._z)
    };
    // last
    var last_point = {
        _x: (2 * points[pointLen - 1]._x - points[pointLen - 2]._x),
        _y: (2 * points[pointLen - 1]._y - points[pointLen - 2]._y),
        _z: (2 * points[pointLen - 1]._z - points[pointLen - 2]._z)
    };

    points.unshift(first_point);
    points.push(last_point);

    var quantization = 15;
    for (var i = 0; i < points.length - 3; i++) {
        for (var j = 0; j < quantization; j++) {
            var t = j / quantization;
            var x = 0.5 * (2 * points[i + 1]._x + t * (-points[i]._x + points[i + 2]._x) + t * t * (2 * points[i]._x - 5 * points[i + 1]._x + 4 * points[i + 2]._x - points[i + 3]._x) + t * t * t * (-points[i]._x + 3 * points[i + 1]._x - 3 * points[i + 2]._x + points[i + 3]._x));
            var y = 0.5 * (2 * points[i + 1]._y + t * (-points[i]._y + points[i + 2]._y) + t * t * (2 * points[i]._y - 5 * points[i + 1]._y + 4 * points[i + 2]._y - points[i + 3]._y) + t * t * t * (-points[i]._y + 3 * points[i + 1]._y - 3 * points[i + 2]._y + points[i + 3]._y));
            var z = 0.5 * (2 * points[i + 1]._z + t * (-points[i]._z + points[i + 2]._z) + t * t * (2 * points[i]._z - 5 * points[i + 1]._z + 4 * points[i + 2]._z - points[i + 3]._z) + t * t * t * (-points[i]._z + 3 * points[i + 1]._z - 3 * points[i + 2]._z + points[i + 3]._z));
            curvePointSet.push(x, y, z);
        }
    }
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
                // opacity={0.3}
                // dashArray={0.}
                // dashRatio={0.1}
            />

        </mesh>
    )
}

export const linearRegressionWeights = (axesChosen, threshold) => {

    var minimums = {};
    var maximums = {};
    var keys = Object.keys(casesFactor[0]);
    keys.shift();
    Object.keys(keys).forEach(function (item, index) {
        minimums[keys[item]] = (Math.min.apply(null, casesFactor.map((v) => v[keys[item]])));
        maximums[keys[item]] = (Math.max.apply(null, casesFactor.map((v) => v[keys[item]])));
    });

    var data = casesFactor.map(r => {

        var copy_r = Object.assign({}, r);
        delete copy_r.states;

        // var chosen = {};
        // if (axesChosen !== undefined && threshold !== 1) {
        //     for (const [key, value] of Object.entries(axesChosen)) {
        //         chosen[key] = ((copy_r[key] - minimums[key]) / (maximums[key] - minimums[key]));
        //     }
        //     chosen["cases"] = ((copy_r["cases"] - minimums["cases"]) / (maximums["cases"] - minimums["cases"]));
        //     return Object.values(chosen);
        // } else {
            for (const [key, value] of Object.entries(copy_r)) {
                copy_r[key] = ((value - minimums[key]) / (maximums[key] - minimums[key]));
            }
            return Object.values(copy_r);
        // }
    });

    // === Create the linear regression === //
    var regression = new jsregression.LinearRegression({
        alpha: 0.0000000001, //
        iterations: 300,
        lambda: 0.0
    });

    // === Train the linear regression === //
    var model = regression.fit(data);
    // === Print the trained model === //
    //setWeights(w);
    // console.log(model);

    var modelTheta = {};
    Object.keys(model.theta).forEach(function (item, index) {
        modelTheta[keys[item]] = model.theta[index];
    });

    return [modelTheta, axesChosen];
};

export function ChooseAxes(corrSlider, corrThreshold, miSlider, miThreshold) {

    var axesChosen = {};
    if (corrSlider === false) {
        for (var pos in caseObj) {
            //console.log(pos, Math.abs(caseObj[pos]));
            if (1 - Math.abs(caseObj[pos]) <= corrThreshold["corrThreshold"]){ // && pos !== "cases") {
                axesChosen[pos] = caseObj[pos];
            }
        }
    } else if (miSlider === false) {
        var mi_max = Math.max.apply(Math, MutualInfo.map(function (o) {
            return o.mutualInfo
        }));
        for (var pos in MI) {
            if (MI[pos]["mutualInfo"] >= miThreshold["miThreshold"]) {
                axesChosen[MI[pos]["label"]] = MI[pos]["mutualInfo"];
            }
        }
    }

    if (+(Object.keys(axesChosen).length) < 2) {
        return {};
    }
    return axesChosen;
}

function InstanceSet(selectedData) {

    var selected_instance = {};
    for (var i = 0; i < casesFactor.length; i++) {
        selected_instance[casesFactor[i]["states"]] = false;
    }
    var dataChosen = selectedData;
    Object.entries(dataChosen).forEach(entry => {
        const [key, value] = entry;
        selected_instance[key] = value; // selected data
        //selected_instance[key] = true; // selected data
    });
    return selected_instance;
}

export function AxesNumericalRange(data, axesChosen) {
    var minimums = {};
    var maximums = {};
    Object.keys(axesChosen).forEach(function (item, index) {
        minimums[item] = (Math.min.apply(null, data.map((v) => v[item])));
        maximums[item] = (Math.max.apply(null, data.map((v) => v[item])));
    });
    return [minimums, maximums];
}

export function ComputeVerticesPos(axesChosen, selectedData) {
    var axes = [], vertices = [], hLineSet = [], hVertices = [], hColors=[], weightPos = [];

    var minimums = {}, maximums = {};
    [minimums, maximums] = AxesNumericalRange(casesFactor, axesChosen);

    var selected_instance = InstanceSet(selectedData);
    var axesNums = Object.keys(axesChosen).length;
    var left = -1, bottom = -0.90;
    var right = 1, top = 0.90;
    var side_margin = (right - left) * 0.05;
    var drawing_width = right - left - (2 * side_margin);
    var drawing_height = top - bottom;

    for (var i = 0; i < axesNums; i++) {
        var axesPointSet = [];
        var xtop = left + side_margin + drawing_width * (i / (axesNums - 1));
        var ytop = top;
        axesPointSet.push(xtop, ytop, 0);
        var xbot = left + side_margin + drawing_width * (i / (axesNums - 1));
        var ybot = bottom;
        axesPointSet.push(xbot, ybot, 0);
        axes.push(axesPointSet);
    }

    // polylines
    for (var i = 0; i < casesFactor.length; i++) {
        var pointSet = [], hPointSet = [];
       // console.log(axesChosen);
        if (selected_instance[casesFactor[i]["states"]] === false) {
            Object.keys(axesChosen).forEach(function (item, index) {
               // console.log(item);
                var x = left + side_margin + drawing_width * (index / (axesNums - 1));
                var y = bottom + drawing_height * (casesFactor[i][item] - minimums[item]) / (maximums[item] - minimums[item]);
                pointSet.push(x, y, 0);
            });
            vertices.push(pointSet);
        } else {
            var controlPointSet = [];
            //console.log(selected_instance[casesFactor[i]["states"]]);
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

            hVertices.push(CatMullRomCurveSculpting(controlPointSet));
            hLineSet.push(hPointSet);
            hColors.push(selected_instance[casesFactor[i]["states"]]);
        }
    }

    for (var idx = 0; idx < axesNums; idx++) {
        var x = left + side_margin + drawing_width * (idx / (axesNums - 1));
        var y = bottom;
        weightPos.push([x, y, 0]);
    }

    //console.log(vertices);
    return [axes, vertices, hLineSet, hVertices, hColors, weightPos];

}

export function Parallel_Lines(corrSlider, corrThreshold, miSlider, miThreshold, selectedData) {

    var axesChosen = ChooseAxes(corrSlider, corrThreshold, miSlider, miThreshold);
    var axesNums = Object.keys(axesChosen).length;

    var threshold = corrThreshold;
    var [weights, resultAxesChosen] = linearRegressionWeights(axesChosen, corrThreshold);
    var modelWeights = {};

    Object.keys(axesChosen).forEach(function (item, index) {
        modelWeights[item] = weights[item];
    });

    var mi = [];
    Object.keys(axesChosen).forEach(function (item, index) {
        const nmi = require('normalized-mutual-information');
        let ax1 = [];
        let ax2 = [];
        for (var i = 0; i < casesFactor.length; i++) {
            ax1.push(casesFactor[i][item]);
            ax2.push(casesFactor[i]['cases']);
        }
        var ax1min = Math.min.apply(null, ax1);
        var ax1max = Math.max.apply(null, ax1);
        var ax2min = Math.min.apply(null, ax2);
        var ax2max = Math.max.apply(null, ax2);
        var nAx1 = [];
        var nAx2 = [];
        for (var i = 0; i < casesFactor.length; i++) {
            if (ax1max === ax1min)
                nAx1.push(0);
            else
                nAx1.push((ax1[i] - ax1min) / (ax1max - ax1min));
            if (ax2max === ax2min)
                nAx2.push(0);
            else
                nAx2.push((ax2[i] - ax2min) / (ax2max - ax2min));
        }
    });

    var axes = [], vertices = [], hLineSet = [], hVertices = [], hColors=[], weightPos = [];

    if (axesNums >= 2) {
        [axes, vertices, hLineSet, hVertices, hColors, weightPos] = ComputeVerticesPos(axesChosen, selectedData)
    }

    return {axes, vertices, hVertices, hColors, weightPos, modelWeights, mi, hLineSet};
}

export default function CasesParallelCoordinates(props) {

    const {axes, vertices, hVertices, hColors, weightPos, modelWeights, mutual_info, hPoints} = props;
    //  console.log(modelWeights);
    var arr = Object.values(modelWeights);
    let wMax = Math.max.apply(null, arr.map(Math.abs));
    let wMin = 0;

    console.log(wMax);
    // let wMin = Math.min(...arr);
    // let wMax = Math.max(...arr);
    // console.log(vertices, hVertices, axes);

    return (
        <Canvas id="pcp-canvas"
                context="2d"
                style={{width: '800px', height: '400px', background: 'black'}}
                camera={{
                    isOrthographicCamera: true,
                    position: [0, 0, 1],
                    fov: 90,
                    aspect: 1,
                    near: 0.1,
                    far: 100,
                    up: [0, 1, 0]
                }}
        >

            {/*{weightPos.map((value, index)=> {*/}
            {/*    return (*/}
            {/*        <mesh key={"weight-pos-" + index} position={value}>*/}
            {/*            <torusBufferGeometry attach="geometry" args={[0.01, 0.02, 16, 10]}/>*/}
            {/*            <meshBasicMaterial attach="material" color={0xfff1ef}/>*/}
            {/*        </mesh>*/}
            {/*    );*/}
            {/*})}*/}

            {
                axes.map((value, index) => {
                    var scaledWeights = ((Math.abs(arr[index]) - wMin) / (wMax - wMin));

                    if (axes.length === (index + 1))
                        return <Line key={"axis-" + index} points={value} width={0.02} color={'#e0fe3f'}
                                     opacity={0.01}/>
                    else
                        return <Line key={"axis-" + index} points={value} width={0.003 + 0.05 * scaledWeights}
                                     color={'#0d98ba'}/>
                })
            }
            {vertices.map((value, index) => {
             //   console.log(value);
                return <Line key={index} points={value} width={0.005} color={'#A2CCB6'}/>
            })}
            {hVertices.map((value, index) => {
                return <Line key={"curve-" + index} points={value} width={0.006} color={hColors[index]}/>
            })}
        </Canvas>
    )
}
//return <Line key={"curve-" + index} points={value} width={0.006} color={'#FCEEB5'}/>
/*
 {/*{hPoints.map((value, index) => {
    return <Line points={value} width={0.015} color={'#FCEEB5'}></Line>
})}*/
