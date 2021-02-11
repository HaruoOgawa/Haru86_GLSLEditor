const vs=`
attribute vec3 position;
attribute vec2 texcoord;
uniform mat4 mvpMatrix;
varying vec2 fragCoord;
void main(void)
{
    fragCoord=texcoord;
    gl_Position=vec4(position,1.0);
}
`;

const fs=`
precision mediump float;
uniform float iTime;
uniform vec2 iResolution;
varying vec2 fragCoord;
void main(void)
{
    gl_FragColor=vec4(fragCoord.x,fragCoord.y,0.0,1.0);
}
`; 