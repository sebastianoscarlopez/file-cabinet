
import { compileProgram } from '@/helpers/index';
import vs from '@/shaders/ray.vs?raw';
import fs from '@/shaders/ray.fs?raw';

export async function getProgram() {
return compileProgram(vs, fs);
}
