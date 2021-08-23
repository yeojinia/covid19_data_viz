import casesFactor from "../Data/CasesFactorsAddedNorm.json";
import jsregression from "js-regression";
import crossInfo from "../Data/CasesFactorsAddedNormCrossInfo.json";

const minimums = {};
const maximums = {};

let keys = [];
let dimensions = [];
let modelWeights = {};
let crossRate = [];

if (casesFactor.length > 0) {
    keys = Object.keys(casesFactor[0]);

    dimensions = Object.keys(casesFactor[0]).filter(function (dimension) {
        return dimension !== "states";
    });

    dimensions.forEach(function (dimension, index) {
        minimums[dimension] = casesFactor[0][dimension];
        maximums[dimension] = casesFactor[0][dimension];
    })

    casesFactor.map((factor) => {
        return dimensions.forEach(function (dimension, index) {
            minimums[dimension] = Math.min(minimums[dimension], factor[dimension]);
            maximums[dimension] = Math.max(maximums[dimension], factor[dimension]);
        })
    })

    const regression = new jsregression.LinearRegression({
        alpha: 0.0000000001, //
        iterations: 300,
        lambda: 0.0
    });

    const data = casesFactor.map(factor => {
        return dimensions.map(dimension => {
            return (factor[dimension] - minimums[dimension]) / (maximums[dimension] - minimums[dimension]);
        });
    });

    const model = regression.fit(data);
    dimensions.map((dimension, index) => {
        modelWeights[dimension] = model.theta[index];
        return 1;
    });

    const crossRate = crossInfo.map((data, index) => {
        let sum =0;
        for(let i=0; i<dimensions.length-1; i++){
            sum += data[dimensions[i]][dimensions[i+1]];
        }
        return sum;
    });
}

export {
    keys,
    dimensions,
    minimums,
    maximums,
    modelWeights,
    crossRate
}
