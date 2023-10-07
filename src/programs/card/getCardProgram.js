import { compileProgram } from '@/helpers/index';
import vs from '@/shaders/cards.vs?raw';
import fs from '@/shaders/card.fs?raw';


export async function getCardProgram() {
  return compileProgram(vs, fs);
}
