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

// TODO: a method that has ["vector-normalized-cicle","vector-normalized-square"] as argument instead of this object madness
// SEE MAPDEEP
function stepTowardDetector(prevPredictions, currentPredictions, stepDefault) {
  // TODO handle first loop where int_vectors (for example might not exist)
  // hand that here??? or just continue to use original vector object as below/returned by detect fn in indiv detectors
  // (where is it cleanest? probably not here)
  const { vectors } = currentPredictions;
  const {
    nose_normalized_circle,
    nose_normalized_square,
    normalized_mouth,
  } = vectors;

  // handel no int_vectors here (i.e. create object)

  return {
    ...currentPredictions,
    // ...vectors,
    // mapdeep here on int_vectors, int_predictions...
    int_vectors: {
      nose_normalized_circle: stepToward(
        prevPredictions.int_vectors?.nose_normalized_circle ||
          prevPredictions.vectors.nose_normalized_circle, //first iteration this object does not exist
        nose_normalized_circle,
        stepDefault // can just set value here - doesnt have to be same stepDefault val everywhere
      ),
      nose_normalized_square: stepToward(
        prevPredictions.int_vectors?.nose_normalized_square ||
          prevPredictions.vectors.nose_normalized_square,
        nose_normalized_square,
        stepDefault
      ),
      normalized_mouth: stepTowardLinear(
        prevPredictions.int_vectors?.normalized_mouth ||
          prevPredictions.vectors.normalized_mouth,

        normalized_mouth,
        stepDefault
      ),
    },
  };
}

function handposeStepTowardDetector(
  prevPredictions,
  currentPredictions,
  stepDefault
) {
  const { vectors } = currentPredictions;
  const { pinch1, rotation1, pinchPos1 } = vectors;

  return {
    ...currentPredictions,
    // ...vectors,
    int_vectors: {
      pinch1: stepTowardLinear(
        prevPredictions.int_vectors?.pinch1 || prevPredictions.vectors.pinch1,
        pinch1,
        stepDefault
      ),
      pinchPos1: stepToward(
        prevPredictions.int_vectors?.pinchPos1 ||
          prevPredictions.vectors.pinchPos1,
        pinchPos1,
        stepDefault
      ),
      rotation1: stepTowardLinear(
        prevPredictions.int_vectors?.rotation1 ||
          prevPredictions.vectors.rotation1,
        rotation1,
        stepDefault
      ),
    },
  };
}
