import GLC from '../../GLCommander'

export default class ModelType{
    constructor(vertices, indices, colors){
        this.vertices = vertices;
        this.indices = indices;
        this.colors = colors;
        this._genVertexBuffer();
        this._genIndexBuffer();
        this._genColorBuffer();
    }
    _genVertexBuffer = () => {
        // bind vertex buffer object
        this.vertexBuffer = GLC.createBuffer();
        GLC.bindArrayBuffer(this.vertexBuffer);
        GLC.addArrayBufferData(this.vertices);
        GLC.unbindArrayBuffer();
    }

    _genIndexBuffer = () => {
        this.indexBuffer = GLC.createBuffer();
        GLC.bindElementArrayBuffer(this.indexBuffer);
        GLC.addElementArrayBufferData(this.indices);
        GLC.unbindElementArrayBuffer();
    }

    _genColorBuffer = () => {
        // bind color buffer object
        this.colorBuffer = GLC.createBuffer();
        GLC.bindArrayBuffer(this.colorBuffer);
        GLC.addArrayBufferData(this.colors);
       // GLC.unbindArrayBuffer();
    }

    use = (shader) => {
        GLC.bindArrayBuffer(this.vertexBuffer);
        GLC.bindElementArrayBuffer(this.indexBuffer);
        shader.enablePosition();
        GLC.bindArrayBuffer(this.colorBuffer);
        shader.enableColors();


    }
}