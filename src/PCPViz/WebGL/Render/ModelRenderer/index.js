import GLC from '../../GLCommander';
import Shader from '../../Shaders/ModelShader';


export default class ModelRenderer{
    constructor(){
        this.shader = new Shader();
        this.models = {};
    }
    registerNewModel = (model, id) => {
        if(!this.models[id]){
            this.models[id] ={
                type:model,
                instances :[],
            }
        }
    }

    addInstance = (instance, id) => {
        this.models[id].instances.push(instance);
    }

    preRender = () => {
        GLC.viewport();
        GLC.depthTest(true); // different object overlapped each other
    }


    render = () => {
        this.preRender();
        this.shader.use();  // Model Shader

        Object.keys(this.models).forEach(model => {
            this.models[model].type.use(this.shader);
            this.models[model].instances.forEach(instance => {
               // GLC.drawTriangles(this.models[model].type.indices.length);
                GLC.drawLines(this.models[model].type.indices.length);
            })
        })

    }
}