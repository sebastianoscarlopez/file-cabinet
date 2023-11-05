
import { compileProgram } from '@/helpers/index';
import vs from '@/shaders/cursor.vs?raw';
import fs from '@/shaders/cursor.fs?raw';

export async function getProgram() {
return compileProgram(vs, fs);
}
