#version 300 es
precision mediump float;

in vec2 st;
flat in int cardsIndex;

uniform mediump sampler2DArray u_texture0;

out vec4 FragColor;

void main() {
  vec4 texColorBase = texture(u_texture0, vec3(st, 0));
  vec4 texColorPlot = texture(u_texture0, vec3(st, cardsIndex + 1));

  vec4 color = texColorPlot.a > 0.0f ? texColorPlot : texColorBase;

  FragColor = color;
}
