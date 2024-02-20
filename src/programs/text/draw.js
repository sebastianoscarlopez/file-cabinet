import { mat4, vec3 } from 'gl-matrix';
import { global, getSquareGeometry } from '@/helpers/index';
import TinySDF from '@mapbox/tiny-sdf';

const tinySdf = new TinySDF({
  fontSize: 96,             // Font size in pixels
  fontFamily: 'sans-serif', // CSS font-family
  fontWeight: 'normal',     // CSS font-weight
  fontStyle: 'normal',      // CSS font-style
  buffer: 3,                // Whitespace buffer around a glyph in pixels
  radius: 8,                // How many pixels around the glyph shape to use for encoding distance
  cutoff: 0.25              // How much of the radius (relative) is used for the inside part of the glyph
});

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

// Convert alpha-only to RGBA so we can use `putImageData` for building the composite bitmap
function makeRGBAImageData(alphaChannel, width, height) {
    const imageData = ctx.createImageData(width, height);
    for (let i = 0; i < alphaChannel.length; i++) {
        imageData.data[4 * i + 0] = alphaChannel[i];
        imageData.data[4 * i + 1] = alphaChannel[i];
        imageData.data[4 * i + 2] = alphaChannel[i];
        imageData.data[4 * i + 3] = 255;
    }
    return imageData;
}
let texture;

export function init() {
  const geometry = getSquareGeometry();

  const { gl, programs } = global;

  const programConfig = programs.find((program) => program.name === 'text');

  gl.useProgram(programConfig.glProgram);

  programConfig.vao = gl.createVertexArray();
  gl.bindVertexArray(programConfig.vao);

  programConfig.modelsBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, programConfig.modelsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 4 * 16, gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(mat4.fromTranslation(mat4.create(), [0.0, 0.0, 0.0])));

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
  console.log('init text');
}

export function draw({
  characters,
  x,
  y
}) {
  const { gl, programs, clientWidth, clientHeight} = global;
  const program = programs.find((program) => program.name === 'text');

  gl.useProgram(program.glProgram);

  gl.bindVertexArray(program.vao);


  const glyphs = characters.split('').map((char) => tinySdf.draw(char));
// console.log(glyphs)
  // const sdfData = new Uint8Array(width * height * 4);
  
  // let offsetX = 0;
  // for (let i = 0; i < glyphs.length; i++) {
  //   const glyph = glyphs[i];
  //   for (let i = 0; i < width * height; i++) {
  //     sdfData[i * 4 + 0 + offsetX] = glyph.data[i];
  //     sdfData[i * 4 + 1 + offsetX] = glyph.data[i];
  //     sdfData[i * 4 + 2 + offsetX] = glyph.data[i];
  //     sdfData[i * 4 + 3 + offsetX] = 255;
  //   }
  //   // offsetX += glyph.width * glyph.height * 4;
  //   // console.log(glyph)
  // }

    // console.log(glyphs[0], width, height);
  // console.log(width, height, sdfData);

  // const maxGlyphdata = Math.max(...glyphs[0].data);
  let glyphAdvanceTotal = 0.0;
  for(let i = 0; i < glyphs.length; i++) {
    const glyph = glyphs[i];
    const width = glyph.width;
    const height = glyph.height;
    const alphaData = makeRGBAImageData(glyph.data, width, height);
    ctx.putImageData(alphaData, 0, 0);
    const sdfData = new Uint8Array(ctx.getImageData(0, 0, width, height).data);

    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, sdfData);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (!gl.isTexture(texture)) {
      console.log('texture failed');
    }

    const u_textureLocation = gl.getUniformLocation(program.glProgram, "u_texture");
    gl.uniform1i(u_textureLocation, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.bindBuffer(gl.ARRAY_BUFFER, program.modelsBuffer);
    // console.log({ width, height })
    let model = mat4.create();
    glyphAdvanceTotal += glyph.glyphLeft;
    const posX = (glyph.glyphWidth / 2 + glyphAdvanceTotal) / clientWidth + x;
    const posY = (glyph.glyphTop - glyph.glyphHeight / 2) / clientHeight + y;
    model = mat4.fromTranslation(mat4.create(), [posX, posY, 0.0, 0.0])
    model = mat4.scale(model, model, vec3.fromValues(glyph.glyphWidth / clientWidth, glyph.glyphHeight / clientHeight, 1.0));
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(model));

    glyphAdvanceTotal += glyph.glyphAdvance;

    gl.drawElementsInstanced(
      gl.TRIANGLE_STRIP,
      4,
      gl.UNSIGNED_SHORT,
      0,
      1
    );
  }
  gl.bindVertexArray(null);
}
