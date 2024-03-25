
import { global } from '@/helpers/index';

export async function webXRInitialize() {
  try {
    const xr = navigator.xr;
    if(!xr) {
      console.error('No WebXR support found');
      return false;
    } else {
      xr.addEventListener("devicechange", (event) => {
        console.log('devicechange', event);
        xr.isSessionSupported("immersive-vr").then((immersiveOK) => {
          enableXRButton.disabled = !immersiveOK;
        });
      });

      const isInlineSupported = await xr.isSessionSupported("inline");
      const isVrSupported = await xr.isSessionSupported("immersive-vr");
      const isArSupported = await xr.isSessionSupported("immersive-ar");
      console.log('isInlineSupported', isInlineSupported);
      console.log('isVrSupported', isVrSupported);
      console.log('isArSupported', isArSupported);
      
      const sessionType = isArSupported ? "immersive-ar" : isVrSupported ? "immersive-vr" : isInlineSupported ? "inline" : null;
      console.log('sessionType', sessionType);
      const session = await xr.requestSession(sessionType).catch((err) => {
        console.error('Error requestSession', err);
      });;

      await session.updateRenderState({
        baseLayer: new XRWebGLLayer(session, global.gl)
      });

      // A 'local' reference space has a native origin that is located
      // near the viewer's position at the time the session was created.
      const referenceSpace = await session.requestReferenceSpace('local').catch((err) => {
        console.error('Error requestReferenceSpace', err);
      });

      console.log('WebXR - initialized');

      global.webXR = {
        session,
        referenceSpace
      };
      return true;
    }
  }catch(err) {
    console.error('WebXR - Error initialize', err);
    return false;
  }
}