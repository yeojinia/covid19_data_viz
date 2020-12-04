import React, {Component, useEffect} from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import {BackSide} from "three";
import {CorrelationMatrix} from "../DataProcessing/CorrelationTable";
import casesFactor from "../CasesFactors.json";
//import {MeshLine} from 'three.meshline';

function drawCorrelatedPolylines(axesChosen, dataChosen, side_margin, polyline_material, scene)
{

    var selected_instance ={};
    for(var i=0; i<casesFactor.length; i++){
        selected_instance[casesFactor[i]["states"]] = false;
    }
    Object.entries(dataChosen).forEach(entry => {
        const [key, value] = entry;
       // console.log(key);
        selected_instance[key] = true;
    });

    var num_axes = Object.keys(axesChosen).length;
    var span = (1.0- (2.0*side_margin))/(num_axes -1);

    var axis1 = [];
    var axis2 = [];
    for(var key in axesChosen){
        axis1.push(key);
        axis2.push(key);
    }
    axis1.pop();
    axis2.shift();

    var adjacent_axes = [];
    const zip = (a,b) => a.map((k, i) => adjacent_axes.push([k, b[i]]) );
    zip(axis1, axis2);
    //console.log(adjacent_axes);

    for(var i=0; i<adjacent_axes.length; i++){

        //console.log(adjacent_axes[i][0]);
        var left_pts = [];
        var right_pts =[];

        for(var j=0; j<casesFactor.length; j++) {
            left_pts.push(casesFactor[j][adjacent_axes[i][0]]);
            right_pts.push(casesFactor[j][adjacent_axes[i][1]]);
        }
        var leftMin = Math.min(...left_pts);
        var leftMax = Math.max(...left_pts);
        var rightMin = Math.min(...right_pts);
        var rightMax = Math.max(...right_pts);

        var bottom_margin = 0.05;
        var height = 0.9;
        for(var j=0; j<casesFactor.length; j++){
            var points = [];
            points.push(new THREE.Vector3(side_margin + span*i, bottom_margin + height*(left_pts[j]-leftMin)/(leftMax-leftMin), 0));
            points.push(new THREE.Vector3(side_margin + span*(i+1), bottom_margin + height*(right_pts[j]-rightMin)/(rightMax-rightMin), 0));
            var geometry = new THREE.BufferGeometry().setFromPoints(points);
            if(selected_instance[casesFactor[j]["states"]] === false){
                var line = new THREE.Line(geometry, polyline_material);
                scene.add(line);
            }
        }

        for(var j=0; j<casesFactor.length; j++){
            var points = [];
            points.push(new THREE.Vector3(side_margin + span*i, bottom_margin + height*(left_pts[j]-leftMin)/(leftMax-leftMin), 0));
            points.push(new THREE.Vector3(side_margin + span*(i+1), bottom_margin + height*(right_pts[j]-rightMin)/(rightMax-rightMin), 0));
            var geometry = new THREE.BufferGeometry().setFromPoints(points);
            if(selected_instance[casesFactor[j]["states"]] === true){
                var selected_material = new THREE.LineBasicMaterial({color: 0xff0000, linewidth:20, transparent:true});
                var line = new THREE.Line(geometry, selected_material);
                scene.add(line);
            }
        }


    }

}

function drawCorrelatedAxes(axesChosen, num_axes, scene, axes_material, selected_axes_material)
{
    var num_axes = Object.keys(axesChosen).length;
    var side_margin = 0.05;
    var span = (1.0- (2.0*side_margin))/(num_axes -1);

    for(var i =0; i<num_axes; i++) {
        var points = [];
        points.push(new THREE.Vector3(side_margin + span*i, 0.05, 0));
        points.push(new THREE.Vector3(side_margin + span*i, 0.95, 0));
        var geometry = new THREE.BufferGeometry().setFromPoints(points);
        var line = new THREE.Line(geometry, axes_material);
        scene.add(line);
    }

}
let [labels, corrMat] =  CorrelationMatrix(casesFactor);

var caseObj = {};
corrMat.forEach(function(item){
    if(item["x_feature"] === "cases"){
        caseObj[item["y_feature"]] = item["coeff"];
    }
});

//export default class Axes extends Component{
export default function ParallelAxes (props) {

    var scene = new THREE.Scene();
    // var camera = new THREE.PerspectiveCamera(75, 600/400, 0.1, 100);
    var camera = new THREE.OrthographicCamera(0, 1, 0, 1);
    camera.position.set( 0, 0, 10 );
    camera.lookAt( 0, 0, -5 );
    var renderer = new THREE.WebGLRenderer({alpha:'0'});
    renderer.setSize(600, 400);
    renderer.domElement.id = 'webgl2_canvas';

    //componentDidMount(){
    useEffect( () => {
        //console.log(props.selectedAxes);
        //console.log(props.corrThreshold);

        var axesChosen = {};
        for(var pos in caseObj){
            if(Math.abs(caseObj[pos]) < props.corrThreshold["corrThreshold"]){
                axesChosen[pos] = caseObj[pos];
            }
        }

        document.getElementById('cases-pcp-threejs').innerHTML="";
        document.getElementById('cases-pcp-threejs').appendChild(renderer.domElement);
        var axes_material = new THREE.LineBasicMaterial({color: 0x008080, opacity:0.8});
        var polyline_material = new THREE.LineBasicMaterial({color: 0x0000ff, linewidth:20, transparent:true, opacity:0.5});
        var selected_axes_material = new THREE.LineBasicMaterial({color: 0xff0000, linewidth:20, transparent:true});

        var items = props.items;
        var num_axes = props.items.length;
       // console.log(props.items);
        var side_margin = 0.05;


        //drawAxes(axesChosen, num_axes, scene, axes_material, selected_axes_material);
        //drawPolylines(axesChosen, items, side_margin, span, num_axes, scene);
        var dataChosen = props.selectedData;
        drawCorrelatedAxes(axesChosen, num_axes, scene, axes_material, selected_axes_material);
        drawCorrelatedPolylines(axesChosen, dataChosen, side_margin, polyline_material, scene);

        // for(var i =0; i<num_axes; i++){
        //     //console.log(props.items[i].id);
        //     var importance = false;
        //
        //     for(var key in props.selectedAxes){
        //       //  console.log(key, props.items[i].id);
        //         if(key === props.items[i].id)
        //             importance = true;
        //     }
        //     var points = [];
        //     points.push(new THREE.Vector3(side_margin + span*i, 0.05, 0));
        //     points.push(new THREE.Vector3(side_margin + span*i, 0.95, 0));
        //     var geometry = new THREE.BufferGeometry().setFromPoints(points);
        //
        //    // var Cylinder = new THREE.Mesh(new THREE.CylinderGeometry(20, 20, 40, 50), new THREE.MeshPhongMaterial({color:0xffFF7F}));
        //
        //     const geometry2 = new THREE.CylinderGeometry( 0.005, 0.005, 0.9, 32 );
        //     geometry2.translate(side_margin + span*i, 0.5, 0);
        //     const material2 = new THREE.MeshBasicMaterial( {color: 0x00f13f, transparent:true} );
        //     const cylinder = new THREE.Mesh( geometry2, material2 );
        //     scene.add(cylinder);
        //
        //     if(importance == true){
        //         var line = new THREE.Line(geometry, selected_axes_material);
        //         scene.add(line);
        //     }
        //     else {
        //         var line = new THREE.Line(geometry, axes_material);
        //         scene.add(line);
        //     }
        // }


        //
        // var polylines_material = new THREE.LineBasicMaterial({color: 0x00ff00, linewidth: 5.});
        //
        // for(var i =0; i< props.items.length -1; i++){
        //     var left_pts = [];
        //     var right_pts =[];
        //     //console.log(casesFactor);
        //     for(var j=0; j<casesFactor.length; j++) {
        //         left_pts.push(casesFactor[j][props.items[i].id]);
        //         right_pts.push(casesFactor[j][props.items[i+1].id]);
        //     }
        //     var leftMin = Math.min(...left_pts);
        //     var leftMax = Math.max(...left_pts);
        //     var rightMin = Math.min(...right_pts);
        //     var rightMax = Math.max(...right_pts);
        //
        //     var bottom_margin = 0.05;
        //     var height = 0.9;
        //    for(var j=0; j<left_pts.length; j++){
        //         var points = [];
        //         points.push(new THREE.Vector3(side_margin + span*i, bottom_margin + height*(left_pts[j]-leftMin)/(leftMax-leftMin), 0));
        //         points.push(new THREE.Vector3(side_margin + span*(i+1), bottom_margin + height*(right_pts[j]-rightMin)/(rightMax-rightMin), 0));
        //         var geometry = new THREE.BufferGeometry().setFromPoints(points);
        //         var line = new THREE.Line(geometry, polylines_material);
        //         scene.add(line);
        //     }
        //
        // }


        //camera.position.z = 5;
        renderer.render(scene, camera);

        /*var animate = function(){
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        animate();*/
    },[props.selectedAxes,  props.items, props.corrThreshold, props.selectedData]);



    return (
        <div/>
    );

};

// function drawPolylines(axesChosen, items, side_margin, span, num_axes, scene) {
//     var polylines_material = new THREE.LineBasicMaterial({color: 0x00ff00, linewidth: 5.});
//
//     for(var i =0; i< items.length -1; i++){
//         var left_pts = [];
//         var right_pts =[];
//         //console.log(casesFactor);
//         for(var j=0; j<casesFactor.length; j++) {
//             left_pts.push(casesFactor[j][items[i].id]);
//             right_pts.push(casesFactor[j][items[i+1].id]);
//         }
//         var leftMin = Math.min(...left_pts);
//         var leftMax = Math.max(...left_pts);
//         var rightMin = Math.min(...right_pts);
//         var rightMax = Math.max(...right_pts);
//
//         var bottom_margin = 0.05;
//         var height = 0.9;
//         for(var j=0; j<left_pts.length; j++){
//             var points = [];
//             points.push(new THREE.Vector3(side_margin + span*i, bottom_margin + height*(left_pts[j]-leftMin)/(leftMax-leftMin), 0));
//             points.push(new THREE.Vector3(side_margin + span*(i+1), bottom_margin + height*(right_pts[j]-rightMin)/(rightMax-rightMin), 0));
//             var geometry = new THREE.BufferGeometry().setFromPoints(points);
//             var line = new THREE.Line(geometry, polylines_material);
//             scene.add(line);
//         }
//
//     }
// }
//
// function drawAxes(axesChosen, num_axes, scene, axes_material, selected_axes_material){
//
//     var side_margin = 0.05;
//     var span = (1.0- (2.0*side_margin))/(num_axes -1);
//
//     for(var i =0; i<num_axes; i++){
//         //console.log(props.items[i].id);
//         var importance = false;
//
//         var points = [];
//         points.push(new THREE.Vector3(side_margin + span*i, 0.05, 0));
//         points.push(new THREE.Vector3(side_margin + span*i, 0.95, 0));
//         var geometry = new THREE.BufferGeometry().setFromPoints(points);
//
//         // var Cylinder = new THREE.Mesh(new THREE.CylinderGeometry(20, 20, 40, 50), new THREE.MeshPhongMaterial({color:0xffFF7F}));
//
//         const geometry2 = new THREE.CylinderGeometry( 0.005, 0.005, 0.9, 32 );
//         geometry2.translate(side_margin + span*i, 0.5, 0);
//         const material2 = new THREE.MeshBasicMaterial( {color: 0x00f13f, transparent:true} );
//         const cylinder = new THREE.Mesh( geometry2, material2 );
//         scene.add(cylinder);
//
//         if(importance == true){
//             var line = new THREE.Line(geometry, selected_axes_material);
//             scene.add(line);
//         }
//         else {
//             var line = new THREE.Line(geometry, axes_material);
//             scene.add(line);
//         }
//     }
// }