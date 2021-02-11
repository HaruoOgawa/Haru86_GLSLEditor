const vs=`
attribute vec3 position;
uniform mat4 mvpMatrix;
void main(void)
{
    gl_Position=vec4(position,1.0);
    
}
`;

const fs=`
precision mediump float;
uniform float time;
void main(void)
{
    gl_FragColor=vec4(1.0,abs(sin(time)),0.0,1.0);
}
`; 