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

out vec2 st;
flat out int cardsIndex;

uniform Settings {
  mat4 u_view_matrix;
  mat4 u_projection_matrix;
};

void main() {
  gl_Position = u_projection_matrix * u_view_matrix * model_matrix * scale * vec4(coordinates, 1.0f);
  cardsIndex = gl_InstanceID;
  if(gl_VertexID == 1 || gl_VertexID == 3) {
    st.x = 1.0;;
  }
  if(gl_VertexID == 2 || gl_VertexID == 3) {
    st.y = 1.0;
  }
}