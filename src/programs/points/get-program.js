
import { compileProgram } from '@/helpers/index';
import vs from '@/shaders/point.vs?raw';
import fs from '@/shaders/point.fs?raw';

export async function getProgram() {
  return compileProgram(vs, fs);
}
