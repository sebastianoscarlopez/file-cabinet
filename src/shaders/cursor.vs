#version 300 es

layout(location = 0) in vec2 coordinates;

void main() {
  gl_Position = vec4(coordinates, 0.0f, 1.0f);
  gl_PointSize = 4.0;
}