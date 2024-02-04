import { compileProgram } from '@/helpers/index';
import vs from '@/shaders/cards-selection.vs?raw';
import fs from '@/shaders/cards-selection.fs?raw';


export async function getProgram() {
return compileProgram(vs, fs);
}
