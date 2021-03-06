import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
// import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';
import '@tensorflow/tfjs-backend-cpu';
// not using tf.setBackend ..

import InterpolatedDetector from './classes/InterpolatedDetector';
import NVDBlaze from './classes/Detectors/VDBlaze';
import NVDMesh from './classes/Detectors/VDMesh';
import IVDMesh from './classes/Detectors/VDIrisMesh';
import VDHandpose from './classes/Detectors/VDHandpose';
// import { op } from '@tensorflow/tfjs';
// import { defaults } from './defaults';
import { defaultsMULTI } from './defaultsMULTI';
import { mergeDeep } from './helpers/helpers';

// MULTI - args: [{name: "blaze", config:{asdf}, "mesh"] ; args array contains either object (with configs) OR string (default configs)
// config here! i.e.- new IVDMesh(configs)  - merge with defaults so that vectorDetector always has full config

export default function nosePoseMULTI(options = []) {
  let detectors = {};
  // {blaze: {detector: NVDDetector(class), config:{detector:{}, interpolator:{}}}, mesh: {detector: NVDDetector(class), config:{}}, etc }

  options.forEach((option) => {
    let d;
    if (typeof option === 'string') {
      d = getDetector(option, null);
      let name = option;
      detectors[name] = d;
    } else {
      let name = option.name;
      d = getDetector(name, option.config);
      detectors[name] = d;
    }
  });

  let smoothDetector = new InterpolatedDetector(detectors);
  return smoothDetector;
}

/**
 *
 * @param {name
 * } type string
 */
function getDetector(name, config) {
  let detector;
  // add in configs that haven't been specified
  let configMerged = mergeDeep({}, defaultsMULTI[name], config);

  console.log(configMerged);

  switch (name) {
    case 'iris':
      detector = new IVDMesh(configMerged.detector);
      break;
    case 'mesh':
      detector = new NVDMesh(configMerged.detector);
      break;
    case 'blaze':
      detector = new NVDBlaze(configMerged.detector);
      break;
    case 'handpose':
      detector = new VDHandpose(configMerged.detector);
      break;
    default:
      // throw error?
      //none
      // detector = new NVDBlaze(configMerged.detector);

      break;
  }
  // add configs that are not supplied

  // return detector object
  return { detector, config: configMerged };
}
