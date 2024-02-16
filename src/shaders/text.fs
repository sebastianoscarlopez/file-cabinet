#version 300 es
precision mediump float;

in vec2 st;

uniform sampler2D u_texture;
// uniform sampler2D u_texture1;

out vec4 FragColor;

float smoothing = 1.0;
float buffer = 0.75;
vec4 textColor = vec4(1.0, 0.0, 0.0, 1.0);

void main() {

  vec4 color = texture(u_texture, st);
  float distance = color.r;
  float alpha = smoothstep(buffer - smoothing, buffer + smoothing, distance);
  if(alpha < 0.1)
    discard;
  FragColor = vec4(textColor.rgb, alpha * textColor.a);
}
