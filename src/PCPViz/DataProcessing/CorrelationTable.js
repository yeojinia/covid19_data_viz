import React from 'react';
import PearsonCorrCoeff from "./PearsonCorrCoeff.js";
import mobility from './../CasesFactors.json';

export const CorrelationMatrix = (features) => {

    var mobility_keys = Object.keys(features[0]);
    mobility_keys.shift();

    //console.log(mobility_keys);

    var data = [];
    mobility_keys.forEach(function(key){
        var feature = [];
        features.forEach(function(data){feature.push(data[key]);})
        data.push(feature);
    })

    // console.log(mobility_keys.length);
    let corrMat = [];
    for(let i=0; i<mobility_keys.length; i++){
        let corr =[];
        for(let j=0; j<mobility_keys.length; j++){
            let corr2 = {};
            corr.push((PearsonCorrCoeff(data[i], data[j])).toFixed(2));
            corr2["coeff"] = +(PearsonCorrCoeff(data[i], data[j])).toFixed(2);
            corr2["x_feature"] = mobility_keys[i];
            corr2["y_feature"] = mobility_keys[j];
            //corr2["x"] = i;
            //corr2["y"] = j;
            corrMat.push(corr2);
        }
        //corrMat.push(corr);
    }
    return [mobility_keys, corrMat];
}


const CorrelationTable = (props) => {

    // const {id} = props;
    const id = props.id;
   // console.log(id);

    //console.log(mobility)
    let [labels, corrMat] = CorrelationMatrix(mobility);
    let corrTable = [];

    let tableHeader = [];
    let hChildren = [];
    for(let i=0; i<labels.length; i++){
        if(i===0)
            hChildren.push(<th>{" "}</th>);
        hChildren.push(<th>{labels[i]}</th>);
        //console.log(labels[i]);
    }
    tableHeader.push(<thead><tr> {hChildren}</tr> </thead>);

    let tableBody = [];
    let bParent = [];
    console.log(corrMat);
    console.log(labels);
    let label_length = labels.length;
    for(let i=0; i<corrMat.length; i++){
        // if(i%label_length === 0){
        //     bParent.push(<tr>);
        // }
        bParent.push(<td>{corrMat[i]["coeff"]}</td>);

    }
    tableBody.push(<tbody>{bParent}</tbody>);
    corrTable.push(tableHeader);
    corrTable.push(tableBody);

    return corrTable;
}

export default CorrelationTable;

                // let bChildren =[];
                // bChildren.push(<td></td>)
                // for(let j=0; j<labels.length; j++){
//     if(j ==0)
//         bChildren.push(<td>{labels[i]}</td>);
//     //console.log(corrMat[i][j]);
//     bChildren.push(<td>{corrMat[i][j]}</td>)
// }
// bParent.push(<tr>{bChildren}</tr>);
