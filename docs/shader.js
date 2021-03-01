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

float map(vec3 p)
{
    return length(p)-0.5;
}

void main(void)
{
    vec2 uv = (gl_FragCoord.xy*2.0-iResolution.xy)/(iResolution.xy);
    vec3 col=vec3(0.0);
    
    vec3 ro=vec3(0.0,0.0,1.0);
    vec3 rd=vec3(uv.xy,-1.0);
    
    float d,t=0.0;
    for(int i=0;i<64;i++)
    {
        d=map(ro+rd*t);
        if(d<0.001)break;
        t+=d;
    }
    
    col=vec3(exp(-1.0*t));
    
    gl_FragColor=vec4(col,1.0);
}

`; 