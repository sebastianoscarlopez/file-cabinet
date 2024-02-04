import { compileProgram } from '@/helpers/index';
import vs from '@/shaders/cards.vs?raw';
import fs from '@/shaders/cards.fs?raw';


export async function getProgram() {
return compileProgram(vs, fs);
}
