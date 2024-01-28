#version 300 es
precision mediump float;

in vec2 st;

uniform sampler2D u_texture;

out vec4 FragColor;

void main() {
  vec4 texColor = texture(u_texture, st);
  if(texColor.a < 1.0)
    discard;
  FragColor = texColor;
  // FragColor = vec4(1);
}
