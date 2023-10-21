#version 300 es

layout(location = 0) in vec2 coordinates;
layout(location = 1) in vec3 color;
layout(location = 2) in mat4 model_matrix;

out vec3 vertex_color;
uniform Settings {
  mat4 u_view_matrix;
  mat4 u_projection_matrix;
};

void main() {
  gl_Position = u_projection_matrix * u_view_matrix * model_matrix * vec4(coordinates, 0.0f, 1.0f);
  gl_PointSize = 2.0;  // vertex_color = model_matrix[2].xyz;
  vertex_color = model_matrix[2].xyz;
}