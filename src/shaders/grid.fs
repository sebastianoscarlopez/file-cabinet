#version 300 es
precision mediump float;

in vec2 st;

out vec4 FragColor;

void main() {
  float width = 0.05;
  vec3 color = vec3(0.0, 0.0, 0.7);

  color.x =
    (1.0 - smoothstep(0.0, width, st.x))
    + smoothstep(1.0 - width, 1.0, st.x)
    + (1.0 - smoothstep(0.0, width, st.y))
    + smoothstep(1.0 - width, 1.0, st.y);
  
  float grid_x = fract(st.x * 4.0);
  float grid_y = fract(st.y * 4.0);
  color.x += color.y = 1.0 - smoothstep(0.0, width, grid_x)
   + 1.0 - smoothstep(0.0, width, grid_y);

  FragColor = vec4(color, 1.0f);
}
