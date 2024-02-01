#version 300 es

layout(location = 0) in vec3 coordinates;
layout(location = 1) in vec3 color;
layout(location = 2) in mat4 model_matrix;

out vec2 st;

uniform float u_card_size;

uniform Settings {
  mat4 u_view_matrix;
  mat4 u_projection_matrix;
};

void main() {
  mat4 identity = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  gl_Position = u_projection_matrix * u_view_matrix * model_matrix * vec4(coordinates, 1.0f);
  if(gl_VertexID == 1 || gl_VertexID == 3) {
    st.x = u_card_size;
  }
  if(gl_VertexID == 2 || gl_VertexID == 3) {
    st.y = u_card_size;
  }
}