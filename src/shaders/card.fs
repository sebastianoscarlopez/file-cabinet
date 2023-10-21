#version 300 es
precision mediump float;

uniform vec3 u_color;
in vec3 st;

out vec4 FragColor;

void main() {
  // FragColor = vec4(vertex_color, 1.0f
  float width = 0.05;
  vec4 color;
  color.w = 1.0;

  color.x =
    (1.0 - smoothstep(0.0, width, st.x))
    + smoothstep(1.0 - width, 1.0, st.x)
    + (1.0 - smoothstep(0.0, width, st.y))
    + smoothstep(1.0 - width, 1.0, st.y);
  
  float grid_x = fract(st.x * 4.0);
  float grid_y = fract(st.y * 4.0);
  color.x += color.y = 1.0 - smoothstep(0.0, width, grid_x)
   + 1.0 - smoothstep(0.0, width, grid_y);

  FragColor = vec4(color);
}
