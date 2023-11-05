#version 300 es

layout(location = 0) in vec3 coordinates;

out vec2 st;

void main() {
  gl_Position = vec4(coordinates, 1.0f);
  if(gl_VertexID == 1 || gl_VertexID == 3) {
    st.x = 1.0f;
  }
  if(gl_VertexID == 2 || gl_VertexID == 3) {
    st.y = 1.0f;
  }
}