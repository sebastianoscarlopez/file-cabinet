import { global } from '@/helpers/index';
const uboVariableNames = ["u_view_matrix", "u_projection_matrix"];
const uboVariableInfo = {};

export function setupUniformSettings(glProgram, uboBuffer) {
  const { gl, viewMatrix, projectionMatrix } = global;

  gl.useProgram(glProgram);
  const blockIndex = gl.getUniformBlockIndex(glProgram, "Settings");
  const blockSize = gl.getActiveUniformBlockParameter(
    glProgram,
    blockIndex,
    gl.UNIFORM_BLOCK_DATA_SIZE
  );
  gl.bindBuffer(gl.UNIFORM_BUFFER, uboBuffer);
  gl.bufferData(gl.UNIFORM_BUFFER, blockSize, gl.DYNAMIC_DRAW);

  gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, uboBuffer);
  const uboVariableIndices = gl.getUniformIndices(
    glProgram,
    uboVariableNames
  );
  const uboVariableOffsets = gl.getActiveUniforms(
    glProgram,
    uboVariableIndices,
    gl.UNIFORM_OFFSET
  );
  uboVariableNames.forEach((name, index) => {
    uboVariableInfo[name] = {
      index: uboVariableIndices[index],
      offset: uboVariableOffsets[index],
    };
  });

  gl.bindBuffer(gl.UNIFORM_BUFFER, uboBuffer);
  gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, uboBuffer);
  gl.bufferSubData(
    gl.UNIFORM_BUFFER,
    uboVariableInfo["u_view_matrix"].offset,
    viewMatrix,
    0
  );
  
  gl.bufferSubData(
    gl.UNIFORM_BUFFER,
    uboVariableInfo["u_projection_matrix"].offset,
    projectionMatrix,
    0
  );
  gl.bindBuffer(gl.UNIFORM_BUFFER, null);

  global.initiated = true;
}
