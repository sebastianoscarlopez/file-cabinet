#version 300 es

layout(location = 0) in vec3 coordinates;
layout(location = 1) in vec3 color;
layout(location = 2) in mat4 model_matrix;

mat4 scale = mat4(
  1.1, 0, 0, 0,
  0, 1.1, 0, 0,
  0, 0, 1.1, 0,
  0, 0, 0, 1
);

uniform Settings {
  mat4 u_view_matrix;
  mat4 u_projection_matrix;
};

void main() {
  gl_Position = u_projection_matrix * u_view_matrix * model_matrix * scale * vec4(coordinates, 1.0f);
}