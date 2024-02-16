import { compileProgram } from '@/helpers/index';
import vs from '@/shaders/card-hover.vs?raw';
import fs from '@/shaders/card-hover.fs?raw';


export async function getProgram() {
return compileProgram(vs, fs);
}
