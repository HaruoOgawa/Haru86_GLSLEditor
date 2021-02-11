const vs=`
attribute vec3 position;
attribute vec2 texcoord;
uniform mat4 mvpMatrix;
varying vec2 vTexcoord;
void main(void)
{
    vTexcoord=texcoord;
    gl_Position=vec4(position,1.0);
}
`;

const fs=`
precision mediump float;
uniform float time;
varying vec2 vTexcoord;
void main(void)
{
    gl_FragColor=vec4(vTexcoord.x,vTexcoord.y,0.0,1.0);
}
`; 