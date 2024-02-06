import { mat4 } from 'gl-matrix';
import { global, getSquareGeometry } from '@/helpers/index';
import TinySDF from '@mapbox/tiny-sdf';

let texture;

export function init() {
  const geometry = getSquareGeometry();

  const { gl, programs } = global;


  const tinySdf = new TinySDF({
    fontSize: 512,             // Font size in pixels
    fontFamily: 'sans-serif', // CSS font-family
    fontWeight: 'normal',     // CSS font-weight
    fontStyle: 'normal',      // CSS font-style
    buffer: 3,                // Whitespace buffer around a glyph in pixels
    radius: 8,                // How many pixels around the glyph shape to use for encoding distance
    cutoff: 0.25              // How much of the radius (relative) is used for the inside part of the glyph
});

const glyph = tinySdf.draw('泽'); // draw a single character
console.log(glyph)

const sdfData = new Uint8Array(glyph.width * glyph.height * 4);
for (let i = 0; i < glyph.width * glyph.height; i++) {
  sdfData[i * 4] = sdfData[i * 4 + 1] = sdfData[i * 4 + 2] = sdfData[i * 4 + 3] = glyph.data[i];  
}

  texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, glyph.width , glyph.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, sdfData);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  if(!gl.isTexture(texture)) {
    console.log('texture failed');
  }


  const programConfig = programs.find((program) => program.name === 'text');

  gl.useProgram(programConfig.glProgram);

  programConfig.vao = gl.createVertexArray();
  gl.bindVertexArray(programConfig.vao);

  programConfig.modelsBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, programConfig.modelsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 40 * 16, gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(mat4.create()));

  const locModel = gl.getAttribLocation(programConfig.glProgram, "model_matrix");
  for (let i = 0; i < 4; i++) {
    gl.vertexAttribPointer(locModel + i, 4, gl.FLOAT, false, 4 * 16, 4 * 4 * i);
    gl.vertexAttribDivisor(locModel + i, 1);
    gl.enableVertexAttribArray(locModel + i);
  }

  programConfig.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, programConfig.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, geometry.vertices, gl.STATIC_DRAW);

  const coordinatesLayout = 0;
  gl.vertexAttribPointer(coordinatesLayout, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(coordinatesLayout);

  programConfig.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, programConfig.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.indices, gl.STATIC_DRAW);

  gl.bindVertexArray(null);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  gl.disableVertexAttribArray(coordinatesLayout);
  for (let i = 0; i < 4; i++) {
    gl.disableVertexAttribArray(locModel + i);
  }
}

export function draw() {
  const { gl, programs } = global;
  const program = programs.find((program) => program.name === 'text');

  gl.useProgram(program.glProgram);

  gl.bindVertexArray(program.vao);

  const u_textureLocation = gl.getUniformLocation(program.glProgram, "u_texture");
  gl.uniform1i(u_textureLocation, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);


  gl.drawElementsInstanced(
    gl.TRIANGLE_STRIP,
    4,
    gl.UNSIGNED_SHORT,
    0,
    1
  );
  gl.bindVertexArray(null);
}
