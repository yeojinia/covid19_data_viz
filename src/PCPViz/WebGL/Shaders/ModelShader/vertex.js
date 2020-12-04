import Locations from './locations';
//    attribute vec3 ${Locations.POSITION};
// color = ${Locations.POSITION};

export default `
    attribute vec3 ${Locations.POSITION};
    attribute vec3 colors_;
    varying vec3 color;
    void main(void){
        color = colors_;
        gl_Position = vec4(${Locations.POSITION}, 1.0);
    }
`;