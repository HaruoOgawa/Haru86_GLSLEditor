//gloabal property////////////////
var editor;
var c;
var gl;

var vertex_shader;
var fragment_shader;
var prg;
var attLocation=new Array(1);
var attStride=new Array(1);
var uniLocation=new Array(2);
var position_data=[
    -1,1,0,
    1,1,0,
    1,-1,0,
    -1,-1,0
];

var index=[
    0,2,1,
    0,2,3
];

var texcoord=[
    0.0,1.0,
    1.0,1.0,
    1.0,0.0,
    0.0,0.0
];
////////////////////////////////

function clickCompileButton()
{
    console.log(editor.getValue());
    console.log(typeof(editor.getValue()));
    
    //redefine
    vertex_shader=create_shader('vs',vs);
    fragment_shader=create_shader('fs',editor.getValue());
    prg=create_program(vertex_shader,fragment_shader);

    //attribute Info
    attLocation[0]=gl.getAttribLocation(prg,'position');
    attLocation[1]=gl.getAttribLocation(prg,'texcoord');
    attStride[0]=3;
    attStride[1]=2;
    
    //uniform Info
     uniLocation[0]=gl.getUniformLocation(prg,'mvpMatrix');
     uniLocation[1]=gl.getUniformLocation(prg,'time');

}


onload=function()
{
    editor=ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/glsl");

    //preparing//////////////////////////////////////////////////////
    c=document.getElementById('canvas');
    gl= c.getContext('webgl');

    ////////////////////////////////////////////////////////////////

    vertex_shader=create_shader('vs',vs);
    fragment_shader=create_shader('fs',fs);
    prg=create_program(vertex_shader,fragment_shader);


    //attribute Info
    attLocation[0]=gl.getAttribLocation(prg,'position');
    attLocation[1]=gl.getAttribLocation(prg,'texcoord');
    attStride[0]=3;
    attStride[1]=2;

    var position_vbo=create_vbo(position_data);
    var texcoord_vbo=create_vbo(texcoord);
    var vboData=[position_vbo,texcoord_vbo];
    var ibo=create_ibo(index);

    //uniform Info
    uniLocation[0]=gl.getUniformLocation(prg,'mvpMatrix');
    uniLocation[1]=gl.getUniformLocation(prg,'time');

    ////////////////////////////////////////////////////////////////////////////
    //matrix
    var m=new matIV();
    var mMatrix=m.identity(m.create());
    var vMatrix=m.identity(m.create());
    var pMatrix=m.identity(m.create());
    var tmpMatrix=m.identity(m.create());
    var mvpMatrix=m.identity(m.create());

    var time=0.0;
    (function(){
        time++;

        gl.clearColor(0.0,0.0,0.0,1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT,gl.DEPTH_BUFFER_BIT);

        m.lookAt([0.0,0.0,2.0],[0.0,0.0,0.0],[0.0,1.0,0.0],vMatrix);
        m.perspective(90,c.clientWidth/c.clientHeight,0.1,100,pMatrix);
        m.multiply(pMatrix,vMatrix,tmpMatrix);

        //rendering
        //model1
        set_attribute(vboData,attLocation,attStride);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ibo);

        m.multiply(tmpMatrix,mMatrix,mvpMatrix);
        gl.uniformMatrix4fv(uniLocation[0],false,mvpMatrix);
        gl.uniform1f(uniLocation[1],time*0.1);
        //gl.drawArrays(gl.POINTS,0,4);
        gl.drawElements(gl.TRIANGLES,index.length,gl.UNSIGNED_SHORT,0,);
        gl.flush();

        setTimeout(arguments.callee,1000/30);
    })();

};

//define function////////////////////////////////////////////////////
function create_shader(shaderName,shaderSource)
{
    var shader;
    switch(shaderName)
    {
        case 'vs':
            shader=gl.createShader(gl.VERTEX_SHADER);
            break;
        case 'fs':
            shader=gl.createShader(gl.FRAGMENT_SHADER);
            break;
        default:
            return;
    }
    gl.shaderSource(shader,shaderSource);
    gl.compileShader(shader);

    if(gl.getShaderParameter(shader,gl.COMPILE_STATUS))
    {
        return shader;
    }else{
        alert(gl.getShaderInfoLog(shader));
    }
}

function create_program(vertex,fragment)
{
    var program=gl.createProgram();
    gl.attachShader(program,vertex);
    gl.attachShader(program,fragment);
    gl.linkProgram(program);
    if(gl.getProgramParameter(program,gl.LINK_STATUS))
    {
        gl.useProgram(program);
        return program;
    }else{
        alert(gl.getProgramInfoLog(program));
    }

}

function create_vbo(data)
{
    var vbo=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER,null);

    return vbo;
}

function create_ibo(data)
{
    var ibo=gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Int16Array(data),gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
    return ibo;
}

function set_attribute(vboArray,attLocation,attStride)
{
    for(var i in vboArray)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER,vboArray[i]);
        gl.enableVertexAttribArray(attLocation[i]);
        gl.vertexAttribPointer(attLocation[i],attStride[i],gl.FLOAT,false,0,0);
    }

   
}