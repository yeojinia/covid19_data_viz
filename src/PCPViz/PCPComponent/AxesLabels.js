import React, {Component, useEffect, useState} from 'react';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {CorrelationMatrix} from './../DataProcessing/CorrelationTable.js';
import casesFactor from '../CasesFactors.json';

let [labels, corrMat] = CorrelationMatrix(casesFactor);

var caseObj = {};
corrMat.forEach(function (item) {
    if (item["x_feature"] === "cases") {
        caseObj[item["y_feature"]] = item["coeff"];
    }
});

// data generator
const getItems = (count, offset = 0) =>
    Array.from({length:count}, (v,k) => k).map(k => ({
        id:`${labels[k] + offset}`,
        content: `${labels[k]}`,
    }));

const grid = 3; // increase later
const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a little nicer
    userSelect:'none',
    padding:grid *2,
    margin:`0 ${grid}px 0 0`,
    // change background color if dragging
    fontSize: '10px',
    color: "#fff",
    background: isDragging ? '#6c757d':"#5a6268",
    borderColor: "#6c757d",
    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightgrey':'lightgrey',
    display: 'flex',
    padding:grid,
    overflow:'auto',

    //width:500,
});

const AxesLabelList = (props)=> {
    const [displayLabels, setDisplayLabels] = useState([]);
    const [labelMargin,setLabelMargin] = useState(0);

    useEffect(() => {
        //displayLabels = [];
        var labels = []
        var axesChosen = {};
        for (var pos in caseObj) {
            if ( 1 - Math.abs(caseObj[pos]) < props.corrThreshold["corrThreshold"]) {
                axesChosen[pos] = caseObj[pos];
            }
        }
        var nums = (Object.keys(axesChosen).length);
        var side_margin = 30;
        var canvas_width = 600;
        var span =0;
        if(nums!=1) {
            span = (canvas_width - (2 * side_margin)) / (nums - 1);
        }
        else{
            span = (canvas_width - (2 * side_margin)) / (nums);
        }
        setLabelMargin(-span + side_margin);
        var text_margin = 0;
        var idx = 0;
        for (var label in axesChosen) {
            /*width:side_margin + span*idx*/
            labels.push(<p style={{marginLeft:-{span}+'px', width:span, writingMode: 'vertical-rl',  textOrientation: 'mixed', textAlign:'left', fontFamily:'Helvetica'}}>{label}</p>);
            idx = idx +1;
        }
        setDisplayLabels(labels);
    }, [props.corrThreshold]);

    return (
        <DragDropContext onDragEnd={props.onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                        {...provided.droppableProps}
                    >
                        {props.items.map((item, index) => (
                            <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={getItemStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                        )}>
                                        {item.content}

                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
    // }
}

export default AxesLabelList;
