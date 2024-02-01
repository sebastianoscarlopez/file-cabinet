#version 300 es
precision mediump float;

in vec2 st;

uniform sampler2D u_texture0;

out vec4 FragColor;

void main() {
  vec4 texColor = texture(u_texture0, st);
  // if(texColor.a < 1.0)
  //   discard;
  FragColor = texColor;
}
