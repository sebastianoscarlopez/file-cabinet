import global from './global';

function compileShader(shaderType, shaderCode) {
  const { gl } = global;
  if (![gl.VERTEX_SHADER, gl.FRAGMENT_SHADER].includes(shaderType)) {
    throw 'Invalid shader type';
  }

  const shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderCode);
  gl.compileShader(shader);

  let message = gl.getShaderInfoLog(shader);
  if (message.length > 0) {
    /* message may be an error or a warning */
    throw message;
  }

  return shader;
}

export async function compileProgram(vertex, fragment) {
  const { gl } = global;
  const vertShader = compileShader(gl.VERTEX_SHADER, vertex);
  const fragShader = compileShader(gl.FRAGMENT_SHADER, fragment);

  var shaderProgram = gl.createProgram();

  gl.attachShader(shaderProgram, vertShader);
  gl.attachShader(shaderProgram, fragShader);

  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    var info = gl.getProgramInfoLog(shaderProgram);
    throw 'Could not compile WebGL program. \n\n' + info;
  }

  return shaderProgram;
}

