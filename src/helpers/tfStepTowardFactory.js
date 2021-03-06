import { stepToward1D, stepToward2D, stepToward3D } from './geometry';
import mapDeep from './mapDeep';

// returns a stepToward function
//optional  params for setting the individual function or step value for keys of prediction (i.e. landmarks, normalized_circle etc.)
export default function tfStepTowardFactory(
  mapperArgs,
  stepSize = 0.1,
  options = {}
) {
  const { predictions: mapPredictions, vectors: mapVectors } = options;
  return (prevPredictions, currentPredictions) => {
    let int_vectors;
    let int_predictions;
    if (prevPredictions.int_vectors && mapPredictions) {
      int_vectors = mapDeep(
        stepMapper,
        mapperArgs,
        prevPredictions.int_vectors,
        currentPredictions.vectors
      );
    } else {
      // handle first loop where no int values exist
      int_vectors = currentPredictions.vectors;
    }
    if (prevPredictions.int_predictions && mapPredictions) {
      int_predictions = mapDeep(
        stepMapper,
        mapperArgs,
        prevPredictions.int_predictions,
        currentPredictions.predictions
      );
    } else {
      // console.log("first loop")
      int_predictions = currentPredictions.predictions;
    }

    return {
      ...currentPredictions,
      int_vectors,
      int_predictions,
    };
  };

  function stepMapper(mapperArgs, key, val1, val2) {
    let step = stepSize;
    let stepperFunction;
    if (key in mapperArgs) {
      let val = mapperArgs[key];
      if (!val) {
        //set to false (i.e dont interpolate)
        return val2;
      }
      if (val.step) {
        step = val.step;
      }
      if (val.stepperFunction) {
        //todo: also accept a string and a lookup for a function here (i.e. different stepperfns to pick from)
        stepperFunction = val.stepperFunction;
        // setting to false stops interpolation [note: for performace it should be set to false by default...]
      }
    }
    // console.log(key);
    if (Array.isArray(val1)) {
      if (Array.isArray(val1[0])) {
        // array of arrays
        // console.log(key, 'array of arrays');
        return val1.map((v1, idx) =>
          stepMapper(mapperArgs, key, v1, val2[idx])
        );
      }
      if (val1.length === 2) {
        if (stepperFunction) {
          return stepperFunction(val1, val2, step);
        } else {
          return stepToward2D(val1, val2, step);
        }
      }
      if (val1.length === 3) {
        if (stepperFunction) {
          return stepperFunction(val1, val2, step);
        } else {
          return stepToward3D(val1, val2, step);
        }
      }
    }
    if (typeof val1 === 'number') {
      if (stepperFunction) {
        return stepperFunction(val1, val2, step);
      } else {
        return stepToward1D(val1, val2, step);
      }
    }
    // console.log(key);

    return val2; // if none of the above are satisfied
  }
}
