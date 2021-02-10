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

    var attLocation=gl.getAttribLocation(prg,'position');
    var attStride=3;
    var position_data=[
        1,1,0,
        1,-1,0,
        -1,-1,0,
        -1,1,0
    ];
    var position_vbo=create_vbo(position_data);

    gl.bindBuffer(gl.ARRAY_BUFFER,position_vbo);
    gl.enableVertexAttribArray(attLocation);
    gl.vertexAttribPointer(attLocation,attStride,gl.FLOAT,false,0,0);


    //define function////////////////////////////////////////////////////
    function create_shader(shaderName,shaderSource)
    {
        var shader;
        switch(shaderName)
        {
            case vs:
                shader=gl.createShader(gl.VERTEX_SHADER);
                break;
            case fs:
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

};