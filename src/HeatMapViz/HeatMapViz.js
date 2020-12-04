import React from 'react';
import HeatMap from "./HeatMap";

class HeatMapViz extends React.Component {

    render() {
        const heatmapContainerDetails = {
            textAlign: "left",
            position: "relative",
            margin: "0px 150px"
        };
        const heatmapContainerVis={

        };
        return (
            <div className="conditions">
                <h2>
                    Conditions contributing to deaths involving covid-19 (U071)
                </h2>
                <div className="heatmap-container-vis" id="my_dataviz" style={heatmapContainerVis}>
                    <HeatMap></HeatMap>
                </div>
                <div className="heatmap-container-details" style={heatmapContainerDetails}>
                    <p><b>Description of Disease</b></p><br/>
                    0: J09-J18 (Respiratory diseases - Influenza and pneumonia)<br/>
                    1: J40-J47 (Respiratory diseases - Chronic lower respiratory diseases)<br/>
                    2: J80 (Respiratory diseases - Adult respiratory distress syndrome)<br/>
                    3: J96 (Respiratory diseases - Respiratory failure)<br/>
                    4: R09.2 (Respiratory diseases - Respiratory arrest)<br/>
                    5: J00-J06, J20-J39, J60-J70, J81-J86, J90-J95, J97-J99, U04 (Other diseases of the respiratory
                    system)<br/>
                    6: I10-I15 (Circulatory diseases - Hypertensive diseases)<br/>
                    7: I20-I25 (Circulatory diseases - Ischemic heart disease)<br/>
                    8: I46 (Circulatory diseases - Cardiac arrest)<br/>
                    9: I44, I45, I47-I49 (Circulatory diseases - Cardiac arrhythmia)<br/>
                    10: I50 (Circulatory diseases - Heart failure)<br/>
                    11: I60-I69 (Circulatory diseases -Cerebrovascular diseases)<br/>
                    12: I00-I09, I26-I43, I51, I52, I70-I99 (Circulatory diseases - Other diseases of the circulatory
                    system)<br/>
                    13: A40-A41 (Sepsis)<br/>
                    14: C00-C97 (Malignant neoplasms)<br/>
                    15: G30:14 (Alzheimer disease)<br/>
                    16: N17-N19 (Renal failure)<br/>
                    17: S00-T98, V01-X59, X60-X84, X85-Y09, Y10-Y36, Y40-Y89, U01-U03 (Intentional and unintentional
                    injury, poisoning, and other adverse events)<br/>
                    18: A00-A39, A42-B99, D00-E07, E15-E64, E70-E90, F00, F02, F04-G26, G31-H95, K00-K93, L00-M99,
                    N00-N16, N20-N98, O00-O99, P00-P96, Q00-Q99, R00-R08, R09.0, R09.1, R09.3, R09.8, R10-R99 (All other
                    residual conditions)<br/>
                    19: E10-E14 (Diabetes)<br/>
                    20: E65-E68 (Obesity)<br/>
                    21: F01, F03 (Vascular and unspecified dementia)<br/>
                    <p>22: U071 (COVID-19)</p>
                </div>
            </div>
        );
    }
}

export default HeatMapViz;
