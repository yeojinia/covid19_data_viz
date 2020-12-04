import React from "react";

export default function AxesPos(data) {

    var side_margin = 0.05;
    var top_margin = 0.1, bottom_margin = 0.1;
    var var_length = Object.keys(data[0]).length-1;
    console.log(var_length);
    var span = (2-2*side_margin)/(var_length -1);

    var axes_indices = [];
    var axes_vertices = [];
    var axes_colors = [];

    // parallel axes
    var i;
    var z_value = -1;
    for(i = 0; i<var_length; i++){
        axes_vertices.push(-1 + side_margin + span*i);
        axes_vertices.push(1-top_margin);
        axes_vertices.push(z_value);
        axes_colors.push(0); // r
        axes_colors.push(0); // g
        axes_colors.push(0); // b
        axes_indices.push(i*2);

        axes_vertices.push(-1 + side_margin + span*i);
        axes_vertices.push(-1+bottom_margin);
        axes_vertices.push(z_value);
        axes_colors.push(0); // r
        axes_colors.push(0); // g
        axes_colors.push(0); // b
        axes_indices.push((i*2)+1);
    }

    return {axes_vertices, axes_indices, axes_colors};
}