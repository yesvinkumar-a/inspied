// simulation
varying vec2 vUv;
uniform vec3 origin;
uniform sampler2D tPositions;
uniform float timer;
uniform float mouse;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec3 pos = texture2D( tPositions, vUv ).xyz;
  if ( rand( vUv + timer ) > 0.99 ) {
    pos = origin;
    vec3 random = vec3( rand( vUv + 1.0 ) - 1.0, rand( vUv + 2.0 ) - 1.0, rand( vUv + 3.0 ) - 1.0 );
    pos += normalize( random ) * rand( vUv + 1.0 );
  }
  else {
    float x = pos.x + timer;
    float y = pos.y;
    float z = pos.z;

    pos.x += sin( y * 3.3 ) * cos( z * 5.3 ) * 0.05  / timer;
    pos.y += sin( x * 3.5 ) * cos( z * 5.5 ) * 0.05 / timer;
    pos.z += sin( x * 3.7 ) * cos( y * 5.7 ) * 0.05 / timer;

    /*pos.x += sin( y * 3.3 ) * cos( z * 10.3 ) * 0.005 / timer;
    pos.y += sin( x * 3.5 ) * cos( z * 10.5 ) * 0.005 / timer;
    pos.z += sin( x * 3.7 ) * cos( y * 10.7 ) * 0.005 / timer;*/

    /*pos.x += cos( z * 5.3 ) * sin( x * 10.3 ) * 0.0005 / timer;
		pos.y += cos( y * 5.5 ) * sin( y * 10.5 ) * 0.0005 / timer;
		pos.z += cos( x * 5.7 ) * sin( z * 10.7 ) * 0.05 / timer;*/
  }
  // Write new position out
  gl_FragColor = vec4(pos, 1.0);
}
