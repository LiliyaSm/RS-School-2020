import * as constants from './constants';

function createAnimation(from, to, duration, render, callback) {
  let currFrame = 0;
  // Calculate total frames for current animation based on frameRate
  const totalFrames = (duration * constants.ANIMATION_SETTINGS.frameRate) / 1000;

  // this func is recursively called to draw each frame
  const drawFrame = () => {
    const currPosX = from.x + ((to.x - from.x) * currFrame) / totalFrames;
    const currPosY = from.y + ((to.y - from.y) * currFrame) / totalFrames;
    // call render function to update the screen
    const pos = { x: currPosX, y: currPosY };
    render(pos);

    currFrame += 1;
    // check if we not exceed totalFrame - set a timeout to call drawFrame
    // after the desired delay
    if (currFrame <= totalFrames) {
      setTimeout(drawFrame, duration / totalFrames);
    } else if (callback) callback();
  };
    // call drawFrame to start animation (draw the first frame)
  drawFrame();
}

export default createAnimation;
