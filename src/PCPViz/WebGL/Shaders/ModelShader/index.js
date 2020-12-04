import GLC from '../../GLCommander';
import VertexSource from './vertex';
import FragmentSource from './fragment';
import Locations from './locations';

export default class ModelShader {
    constructor(){
        const vertexShader = GLC.createVertexShader();
        GLC.addShaderSource(vertexShader, VertexSource);
        GLC.compileShader(vertexShader);

        const fragmentShader = GLC.createFragmentShader();
        GLC.addShaderSource(fragmentShader, FragmentSource);
        GLC.compileShader(fragmentShader);

        const program = GLC.createShaderProgram();
        GLC.attachShaderToProgram(program, vertexShader);
        GLC.attachShaderToProgram(program, fragmentShader);
        GLC.linkProgram(program);

        this.program = program;
    }

    use = () => {
        GLC.useProgram(this.program);
    }
    enablePosition = () => {
        this.positionAttribute = GLC.getAttribLocation(this.program, Locations.POSITION);
        GLC.pointToAttribute(this.positionAttribute, 3);
        GLC.enableVertexAttribArray(this.positionAttribute);
    }
    enableColors = () =>{
        this.colorAttribute = GLC.getAttribLocation(this.program, `colors_`);
        GLC.pointToAttribute(this.colorAttribute, 3);
        GLC.enableVertexAttribArray(this.colorAttribute);

    }
}