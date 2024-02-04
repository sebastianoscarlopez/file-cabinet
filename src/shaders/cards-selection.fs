#version 300 es
precision mediump float;

in vec2 st;
flat in int cardsIndex;

uniform mediump sampler2DArray u_texture0;

out vec4 FragColor;

void main() {
  vec4 texColorPlot = texture(u_texture0, vec3(st, cardsIndex + 1));

  vec4 color = vec4(1.0f);

  // add id to color
  color.r = float(cardsIndex + 1) / 255.0f;
  color.g = texColorPlot.a > 0.0f ? 1.0f : 0.0f;

  FragColor = color;
}
