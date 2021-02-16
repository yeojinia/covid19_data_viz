import * as d3 from 'd3';
import React, {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import casesFactor from "../../Data/CasesFactors.json";
import TSNE from "tsne-js";

let colorSet = ["#E7E84C", "#FBFF87", "#FFDF00","#E8D051","#FFF249"];

function simulateNetworkRequest() {
    return new Promise((resolve) => setTimeout(resolve, 500));
}

function ReleaseButton(props) {
    const buttonStyle = {
        color: "#fff",
        fontSize: '10px',
        backgroundColor: "#5a6268",
        borderColor: "#6c757d",
        width: "100px",
        height: "30px",
    };

    const [isLoading, setLoading] = useState(false);
    useEffect(() => {
        if (isLoading) {
            simulateNetworkRequest().then(() => {
                setLoading(false);
            });
        }

        //props.setSelectedData({});
    }, [isLoading]);

    const handleClick = () => {
        setLoading(true);
        releaseBrushes();
    }

    function releaseBrushes() {

        for (var i = 0; i < brushes.length - 1; i++) {
            d3.select("g#brush-" + brushes[i].id + ".brush").remove();
            //d3.select("#brush-"+i).remove();
        }
        brushes.splice(0, brushes.length - 1);

        myCircle.classed("selected", function () {
            return false;
        });
        props.setSelectedData({});
        // document.getElementById("#brush-" + defaultID).setAttribute("id", "brush-0");
    }

    return (<>
            <Button
                variant="primary"
                disabled={isLoading}
                onClick={!isLoading ? handleClick : null}
                style={buttonStyle}>
                {isLoading ? 'Releasing...' : 'Release Brushes'}

            </Button>
        </>
    );
}

// We also keep the actual d3-brush functions and their IDs in a list:
var brushes = [];
var myCircle;

function brushstart() {
}

function brushed(myCircle, setSelectedData, x, y) {
    let selected_state = {};

    myCircle.classed("selected", function (d) {
        for (var idx = 0; idx < brushes.length; idx++) {
            // Figure out if our latest brush has a selection
            var brushID = brushes[idx].id;
            var Brush = document.getElementById('brush-' + brushID);
            var selection = d3.brushSelection(Brush);

            if (isBrushed(selection, x(d[0] * 1.0), y(d[1] * 1.0)) === true) {

                // selected_axes[d["x_feature"]] = "true";
                //if(!(d[2] in selected_state))
                selected_state[d[2]] = colorSet[idx]; // "true";
                return true;
            }
        }
        return false;
    });
    setSelectedData(selected_state);

}

// A function that return TRUE or FALSE according if a dot is in the selection or not
function isBrushed(brush_coords, cx, cy) {
    if(brush_coords === null) return false;
    var x0 = brush_coords[0][0],
        x1 = brush_coords[1][0],
        y0 = brush_coords[0][1],
        y1 = brush_coords[1][1];
    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
}

function drawBrushes(gBrushes) {

    var brushSelection = gBrushes
        .selectAll('.brush')
        .data(brushes, function (d) {
            return d.id
        });

    // Set up new brushes
    brushSelection.enter()
        .insert("g", '.brush')
        .attr('class', 'brush')
        .attr('id', function (brush) {
            return "brush-" + brush.id;
        })
        .each(function (brushObject) {
            //call the brush
            brushObject.brush(d3.select(this));
        });

    /* REMOVE POINTER EVENTS ON BRUSH OVERLAYS
     *
     * This part is abbit tricky and requires knowledge of how brushes are implemented.
     * They register pointer events on a .overlay rectangle within them.
     * For existing brushes, make sure we disable their pointer events on their overlay.
     * This frees the overlay for the most current (as of yet with an empty selection) brush to listen for click and drag events
     * The moving and resizing is done with other parts of the brush, so that will still work.
     */
    brushSelection
        .each(function (brushObject) {
            d3.select(this)
                .attr('class', 'brush')
                .selectAll('.overlay')
                .style('pointer-events', function () {
                    var brush = brushObject.brush;
                    if (brushObject.id === brushes[brushes.length - 1].id && brush !== undefined) {
                        return 'all';
                    } else {
                        return 'none';
                    }
                });
        })

    brushSelection.exit()
        .remove();
}

/* CREATE NEW BRUSH
 *
 * This creates a new brush. A brush is both a function (in our array) and a set of predefined DOM elements
 * Brushes also have selections. While the selection are empty (i.e. a suer hasn't yet dragged)
 * the brushes are invisible. We will add an initial brush when this viz starts. (see end of file)
 * Now imagine the user clicked, moved the mouse, and let go. They just gave a selection to the initial brush.
 * We now want to create a new brush.
 * However, imagine the user had simply dragged an existing brush--in that case we would not want to create a new one.
 * We will use the selection of a brush in brushend() to differentiate these cases.
 */
function newBrush(gBrushes, myCircle, setSelectedData, x, y) {
    var brush = d3.brush()
        .on("start", brushstart)
        .on("brush", (event) => brushed(myCircle, setSelectedData, x, y))
        .on("end", (event) => brushend(gBrushes));

    brushes.push({id: new Date().getTime(), brush: brush});

    function brushend(gBrushes) {

        // Figure out if our latest brush has a selection
        var lastBrushID = brushes[brushes.length - 1].id;
        var lastBrush = document.getElementById('brush-' + lastBrushID);
        var selection = d3.brushSelection(lastBrush);

        // If it does, that means we need another one
        if (selection && selection[0] !== selection[1]) {
            newBrush(gBrushes, myCircle, setSelectedData, x, y);
        }

        // Always draw brushes
        drawBrushes(gBrushes);
    }
}

export default function MultipleBrushes(props) {

    const [selectedData, setSelectedData] = useState({});
    let window_width = 340;
    let window_height = 340;
    var side_margin = (window_width - 0) / (2 * casesFactor.length);
    var keys = [];
    var minimums = {};
    var maximums = {};
    for (let key in props.items) {
        if (props.items[key]["id"] !== 'cases')
            keys.push(props.items[key]["id"]);
    }

    Object.keys(keys).forEach(function (item, index) {
        minimums[keys[item]] = (Math.min.apply(null, casesFactor.map((v) => v[keys[item]])));
        maximums[keys[item]] = (Math.max.apply(null, casesFactor.map((v) => v[keys[item]])));
    });

    var inputData = [];
    var inputLabel = [];
    for (var i = 0; i < casesFactor.length; i++) {
        inputLabel.push(casesFactor[i]["states"]);
        var examples = [];
        for (var key of keys) {
            examples.push(casesFactor[i][key]);
        }
        inputData.push(examples);
    }

    // inputData;
    let model = new TSNE({
        dim: 2,
        perplexity: 30.0,
        earlyExaggeration: 4.0,
        learningRate: 100.0,
        nIter: 1000,
        metric: 'euclidean'
    });

    model.init({
        data: inputData,
        type: 'dense'
    });

    // note: computation-heavy action happens here
    let [error, iter] = model.run();

    // `output` is unpacked ndarray (regular nested javascript array)
    let output = model.getOutput();

    // `outputScaled` is `output` scaled to a range of [-1, 1]
    let outputScaled = model.getOutputScaled();
    for (let i = 0; i < outputScaled.length; i++) {
        outputScaled[i].push(inputLabel[i]);
    }

    var margin = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        },
        width = window_width - margin.left - margin.right,
        height = window_height - margin.top - margin.bottom;

    useEffect(() => {
        var svg = d3.select("#cases-sub-multi-brush-vis").append("svg")
            .attr("id", "cases-tsne")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        svg.append("rect")
            .attr("class", "grid-background")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "#FFF");

        // We initially generate a SVG group to keep our brushes' DOM elements in:
        var gBrushes = svg.append('g')
            .attr("class", "brushes")

        gBrushes.style("-moz-box-shadow", "#555 0 0 8px")
            .style("-webkit-box-shadow", "#555 0 0 8px")
            .style("-o-box-shadow", "#555 0 0 8px")
            .style("box-shadow", "#555 0 0 8px");

        // Add X axis
        var x = d3.scaleLinear()
            .range([side_margin, width - side_margin])
            .domain([-1.05, 1.05]);

        var y = d3.scaleLinear()
            .domain([-1, 1])
            .range([height, 0]);

        // Add X axis
        var x = d3.scaleLinear()
            .range([side_margin, width - side_margin])
            .domain([-1.05, 1.05]);

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([-1, 1])
            .range([height, 0]);

        myCircle = svg.selectAll('g')
            .data(outputScaled)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return x(d[0] * 1.0);
            })
            .attr("cy", function (d) {
                return y(d[1] * 1.0);
            })
            .attr("r", 6)
            .style("fill", function (d) {
                return "blue";                // return "#EE786E"//"red"
            })
            .style("opacity", 0.5);

        var myText = svg.selectAll("g")
            .data(outputScaled)
            .enter()
            .append("text")
            .text(function (d) {
                return d[2]
            })
            .attr("x", function (d) {
                return x(d[0] * 1.0);
            })
            .attr("y", function (d) {
                return y(d[1] * 1.0);
            })
            .style("fill", "black")
            .style("font-size", "10px");

        newBrush(gBrushes, myCircle, props.setSelectedData, x, y);
        drawBrushes(gBrushes);

    }, [props.selectedData]);

    return (
        <>
            <div id="cases-sub-multi-brush-vis" style={{marginTop: '0.5rem'}}>
            </div>

            <div>
                <ReleaseButton class="btn-float-right" selectedData={props.selectedData}
                               setSelectedData={props.setSelectedData}
                               setSelectedAxes={props.setSelectedAxes}></ReleaseButton>
            </div>

            {/*<div style={ {marginRight: '2.1rem', marginBottom:'1.3rem', marginTop:'5.0rem', backgroundColor:'white'}}>*/}
            {/*</div>*/}
        </>
    );
}