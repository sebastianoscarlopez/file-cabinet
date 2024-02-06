import { compileProgram } from '@/helpers/index';
import vs from '@/shaders/text.vs?raw';
import fs from '@/shaders/text.fs?raw';

export async function getProgram() {
return compileProgram(vs, fs);
}
