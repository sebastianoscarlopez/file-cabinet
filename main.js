import './style.css'
import startApp from './src/app.js'
import { setupCanvas } from './src/gl/index'

const canvas_el = document.querySelector('#canvas_main');
setupCanvas(canvas_el);

startApp();
