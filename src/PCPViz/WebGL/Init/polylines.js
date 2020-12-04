import React from "react";

function zip(arrays) {
    return arrays[0].map(function (_, i) {
        return arrays.map(function (array) {
            return array[i]
        })
    });
}

export default function Polylines(mobility) {
    var data_indices = [];
    var data_vertices = [];
    var data_color = [];

    var mobility_keys = Object.keys(mobility[0]);
    var colwise_data = [];
    mobility.forEach(function (data) {
        var example = [];
        mobility_keys.forEach(key => example.push(data[key]))
        colwise_data.push(example);
    });
    var rowwise_data = zip(colwise_data);

    rowwise_data.forEach(function (d) {
        d.max = Math.max(...d);
        d.min = Math.min(...d);
    });

    const side_margin = 0.05;
    const top_margin = 0.1, bottom_margin = 0.1;
    const left = -1, right = 1, top = 1, bottom = -1;
    var var_length = Object.keys(mobility[0]).length-1;
    var span = (2-2*side_margin)/(var_length -1);
    var idx = 0;
    var between_margin = 0;//.015;

    var z_val = 0.;
    for (let i = 1; i < rowwise_data.length - 1; i++) {
        for(let j =0; j<rowwise_data[i].length; j++) {
            var leftY = ((top - bottom) -top_margin-bottom_margin)*(rowwise_data[i][j] - rowwise_data[i].min)/(rowwise_data[i].max-rowwise_data[i].min);
            data_vertices.push(left + between_margin +  side_margin + (span * (i-1) ));
            data_vertices.push( bottom + bottom_margin + leftY );
            data_vertices.push(z_val);
            data_color.push(0);  // r
            data_color.push(1);  // g
            data_color.push(0);  // b
            data_indices.push(idx);
            idx++;

            var rightY = ((top - bottom) -top_margin-bottom_margin)*(rowwise_data[i + 1][j] -rowwise_data[i+1].min)/(rowwise_data[i+1].max - rowwise_data[i+1].min);
            data_vertices.push(left - between_margin + side_margin + (span* (i) ));
            data_vertices.push( bottom + bottom_margin + rightY );
            data_vertices.push(z_val);
            data_color.push(0);  // r
            data_color.push(1);  // g
            data_color.push(0);  // b
            data_indices.push(idx);
            idx++;
        }
    };

    return {data_vertices, data_indices, data_color};
}