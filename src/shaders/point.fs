#version 300 es
precision mediump float;

uniform vec3 u_color;
in vec3 vertex_color;

out vec4 FragColor;

void main() {
  FragColor = vec4(1.0f, 1.0f, 1.0f, 1.0f);
}
