import GLC from '../GLCommander';
import ModelRenderer from "../Render/ModelRenderer";
import ModelType from "../Models/ModelType";
import mobility from '../../MobilityImpact.json';
import casesFactors from '../../CasesFactors.json';
import deathsFactors from '../../DeathsFactors.json';
import AxesPos from './AxesPos.js';
import AxesLabel from './AxesLabel.js'
import Polylines from './polylines.js';

let r =0;
const render = () => {
    GLC.clear(r, 0.0, 0.0, 1.0);
    r = r +0.001;
    window.requestAnimationFrame(render);
}

export default (id) => {
    const canvas = document.querySelector(`#${id}`);

    if(!canvas){
        return;
    }
    const gl = canvas.getContext('webgl');

    // if gl is not initialized correctly
    if(!gl){
        return;
    }

    GLC.init(gl);

    switch(id){

        case "cases_webgl":
            var {axes_vertices, axes_indices, axes_colors} = AxesPos(casesFactors);
            var {data_vertices, data_indices, data_colors} = Polylines(casesFactors);
            //console.log(data_vertices);
            //console.log(data_indices);
            AxesLabel(casesFactors, "#text");
            //window.requestAnimationFrame(render);
            const modelRender = new ModelRenderer();
            const modelRender2 = new ModelRenderer();
            //modelRender.registerNewModel(new ModelType(vertices, indices), 'triangle');
            // modelRender.addInstance('instance1', 'triangle');
            modelRender.registerNewModel(new ModelType(axes_vertices, axes_indices, axes_colors), 'line');
            modelRender.addInstance('axes', 'line');

            modelRender2.registerNewModel(new ModelType(data_vertices, data_indices, data_colors), 'line');
            modelRender2.addInstance('polylines', 'line');
            GLC.clear(1.0, 1.0, 1.0, 1.0);
            modelRender.render();
            modelRender2.render();
            break;
        case "deaths_webgl":
            var {axes_vertices, axes_indices, axes_colors} = AxesPos(deathsFactors);
            var {data_vertices, data_indices, data_colors} = Polylines(deathsFactors);
            //console.log(data_vertices);
            //console.log(data_indices);
            AxesLabel(deathsFactors,"#text2");
            //window.requestAnimationFrame(render);
            const modelRender_ = new ModelRenderer();
            const modelRender2_ = new ModelRenderer();
            //modelRender.registerNewModel(new ModelType(vertices, indices), 'triangle');
            // modelRender.addInstance('instance1', 'triangle');
            modelRender_.registerNewModel(new ModelType(axes_vertices, axes_indices, axes_colors), 'line');
            modelRender_.addInstance('axes', 'line');

            modelRender2_.registerNewModel(new ModelType(data_vertices, data_indices, data_colors), 'line');
            modelRender2_.addInstance('polylines', 'line');
            GLC.clear(1.0, 1.0, 1.0, 1.0);
            modelRender_.render();
            modelRender2_.render();
            break;
    }



}