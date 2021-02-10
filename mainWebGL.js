function clickCompileButton()
{
    var compileButton=document.getElementById("editor");
    console.log(compileButton.innerText);
}

var 

onload=function()
{
    //preparing//////////////////////////////////////////////////////
    var c=document.getElementById('canvas');
    var gl= c.getContext('webgl');

    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT,gl.DEPTH_BUFFER_BIT);

    var vertex_shader=create_shader('vs',vs);
    var fragment_shader=create_shader('fs',fs);
    var prg=create_program(vertex_shader,fragment_shader);


    //attribute Info
    var attLocation=gl.getAttribLocation(prg,'position');
    var attStride=3;
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

    var position_vbo=create_vbo(position_data);
    gl.bindBuffer(gl.ARRAY_BUFFER,position_vbo);
    gl.enableVertexAttribArray(attLocation);
    gl.vertexAttribPointer(attLocation,attStride,gl.FLOAT,false,0,0);
    var ibo=create_ibo(index);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ibo);

    //uniform Info
    var uniLocation=new Array(1);
    uniLocation[0]=gl.getUniformLocation(prg,'mvpMatrix');

    //matrix
    var m=new matIV();
    var mMatrix=m.identity(m.create());
    var vMatrix=m.identity(m.create());
    var pMatrix=m.identity(m.create());
    var tmpMatrix=m.identity(m.create());
    var mvpMatrix=m.identity(m.create());

    m.lookAt([0.0,0.0,2.0],[0.0,0.0,0.0],[0.0,1.0,0.0],vMatrix);
    m.perspective(90,c.clientWidth/c.clientHeight,0.1,100,pMatrix);
    m.multiply(pMatrix,vMatrix,tmpMatrix);

    //rendering
    m.multiply(tmpMatrix,mMatrix,mvpMatrix);
    gl.uniformMatrix4fv(uniLocation[0],false,mvpMatrix);
    //gl.drawArrays(gl.POINTS,0,4);
    gl.drawElements(gl.TRIANGLES,index.length,gl.UNSIGNED_SHORT,0,);
    gl.flush();


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

};