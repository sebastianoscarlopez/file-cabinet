#version 300 es
precision mediump float;

in vec2 st;
flat in int cardIndex;

uniform mediump sampler2DArray u_texture0;

out vec4 FragColor;

void main() {
  vec4 texColorBase = texture(u_texture0, vec3(st, 0));
  vec4 texColorPlot = texture(u_texture0, vec3(st, cardIndex + 1));

  FragColor = texColorPlot.a > 0.0f ? texColorPlot : texColorBase;
}
