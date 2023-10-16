import { compileProgram } from '@/helpers/index';
import vs from '@/shaders/basic.vs?raw';
import fs from '@/shaders/basic.fs?raw';

export async function getProgram() {
  return compileProgram(vs, fs);
}
