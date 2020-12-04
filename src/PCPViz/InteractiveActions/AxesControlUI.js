import React, {Component} from 'react';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {CorrelationMatrix} from './../DataProcessing/CorrelationTable.js';
import casesFactor from '../CasesFactors.json';

let [labels, corrMat] =  CorrelationMatrix(casesFactor);

// data generator
const getItems = (count, offset = 0) =>
    Array.from({length:count}, (v,k) => k).map(k => ({
        id:`${labels[k] + offset}`,
        content: `${labels[k]}`,
    }));

/*const remove = (source, destination, droppableSource, droppableDestination) =>{
    const sourceClone = Array.from(source);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = "";

    return result;
};
*/
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
//class AxesScrollingList extends Component{
const AxesScrollingList = (props)=> {

    /*
    constructor(props) {
        super(props);
        this.state = {
            items: props.items,
        };
        // this.onDragEnd = props.onDragEnd.bind(this);
    }*/

    // const state={
    //      items:props.items
    // };

    /**
     *  A semi-generic way to handle multiple lists.
     *  Matches the ID'S of the droppable container to the names of the
     *  source arrays stored in the state
     */
    // const id2List = {
    //     droppable: 'items'
    // };
    // const getList = id => state[this.id2List[id]];

   /* onDragEnd = result => {
        const {source, destination} = result;

        if(!result.destination){
            const items = remove(
                this.state.items,
                result.source.index
            );
            this.setState({
                items,
            });

        }
        else {
            const items = reorder(
                this.state.items,
                result.source.index,
                result.destination.index
            );
            this.setState({
                items,
            });
        }
    }*/

  //  render(){
   // console.log(props);



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

export default AxesScrollingList;
/*
<Droppable droppableId="droppable2">
    {(provided, snapshot) => (
        <div
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}>
            {this.state.selected.map((item, index) => (
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
*/