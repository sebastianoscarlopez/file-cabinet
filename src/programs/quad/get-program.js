import { compileProgram } from '@/helpers/index';
import vs from '@/shaders/quad.vs?raw';
import fs from '@/shaders/quad.fs?raw';

export async function getProgram() {
return compileProgram(vs, fs);
}
