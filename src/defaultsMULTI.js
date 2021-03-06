// Presets for FaceDetector class

import {
  stepToward,
  stepTowardLinear,
  stepToward1D,
  stepToward2D,
} from './helpers/geometry';
import tfStepTowardFactory from './helpers/tfStepTowardFactory';

// measured in pixels where eyes are FACE_SCALE (constant) distance apart
// scaled for z distance in calculations
// TO DO: set as [0,1] - width/height of full capture
const defaultsMULTI = {
  blaze: {
    detector: {
      // central_bounding: { x: [-20, 20], y: [-20, 15] },
      outer_bounding: { x: [-50, 50], y: [-35, 15] }, // rename to nose bounding?
    },
    interpolator: {
      predictions: true,
      vectors: true,

      fps: 0, // zero is max
      stepDefault: 0.1,

      mapperArgs: {
        // example:
        // landmarks: {
        //   step: 0.1,
        //   stepperFunction: stepToward2D,
        // },
        probability: false,
      },
      get stepperFactory() {
        return tfStepTowardFactory;
      },
    },
  },
  mesh: {
    detector: {
      // central_bounding: { x: [-20, 20], y: [-20, 15] },
      outer_bounding: { x: [-50, 50], y: [-35, 15] },
      mouth_bounding: [0, 25],
      eye_bounding: [20, 32],
    },
    interpolator: {
      predictions: true, // interpolate predictions?
      vectors: true, // interpolate vectors?
      fps: 0, // zero is gives a max fps
      stepDefault: 0.07,
      mapperArgs: {
        probability: false,
      },

      get stepperFactory() {
        return tfStepTowardFactory;
      },
    },
  },
  handpose: {
    detector: {
      // central_bounding: { x: [-20, 20], y: [-20, 15] },
      outer_bounding: { x: [-50, 50], y: [-35, 15] },
      pinch1_bounding: [50, 150],
      rotation1_bounding: [100, 200], //rotation not registered outside of this dist betw fingers

      pinch2_bounding: [50, 150],
      pinch3_bounding: [50, 150],
      pinch4_bounding: [50, 150],
    },
    interpolator: {
      predictions: true,
      vectors: true,
      fps: 0, // zero is max
      stepDefault: 0.25,
      mapperArgs: {
        probability: false,
      },
      get stepperFactory() {
        return tfStepTowardFactory;
      },
    },
  },
  // iris: {
  //   detector: {
  //     central_bounding: { x: [-20, 20], y: [-20, 15] },
  //     outer_bounding: { x: [-50, 50], y: [-35, 15] },
  //     mouth_bounding: [0, 10],
  //     eye_bounding: [25, 32],
  //   },
  //   interpolator: {
  //     fps: 0, // zero is max
  //     stepDefault: 0.07,
  //     stepToward: stepTowardDetector,
  //   },
  // },
};

export { defaultsMULTI };
