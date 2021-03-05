// ********************** SEE MULTI --------- OLD CODE


// Presets for FaceDetector class



import { stepToward } from './helpers/geometry';

const defaults = {
  detector: {
    central_bounding: { x: [-20, 20], y: [-20, 15] },
    outer_bounding: { x: [-50, 50], y: [-35, 15] },
    mouth_bounding: [0, 10],
    eye_bounding: [25, 32],
  },
  interpolator: {
    fps: 0, // zero is max
    sensitivity: 0.1,
    stepToward: stepTowardDetector,
  },
};

// only change circle/square vectors

// TODO: a method that has ["vector-normalized-cicle","vector-normalized-square"] as argument instead of this object madness
function stepTowardDetector(prevPredictions, currentPredictions, sensitivity) {
  const { vectors } = currentPredictions;
  const { nose_normalized_circle, nose_normalized_square } = vectors;

  return {
    ...currentPredictions,
    vectors: {
      ...currentPredictions.vectors,
      nose_normalized_circle: stepToward(
        prevPredictions.vectors.nose_normalized_circle,
        nose_normalized_circle,
        sensitivity
      ),
      nose_normalized_square: stepToward(
        prevPredictions.vectors.nose_normalized_square,
        nose_normalized_square,
        sensitivity
      ),
    },
  };
}

export { defaults };
