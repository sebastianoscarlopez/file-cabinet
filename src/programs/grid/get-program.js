import { compileProgram } from '@/helpers/index';
import vs from '@/shaders/grid.vs?raw';
import fs from '@/shaders/grid.fs?raw';


export async function getProgram() {
return compileProgram(vs, fs);
}
