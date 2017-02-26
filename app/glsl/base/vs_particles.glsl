uniform sampler2D map;
uniform float width;
uniform float height;
uniform float pointSize;
varying vec2 vUv;
varying vec4 vPosition;
varying vec4 vColor;

void main() {

  vec2 uv = position.xy + vec2( 0.5 / width, 0.5 / height );
  vec3 color = texture2D( map, uv ).rgb * 200.0 - 100.0;  

  gl_PointSize = pointSize;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( color, 1.0 );

}
