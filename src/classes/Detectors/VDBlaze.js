import * as blazeface from '@tensorflow-models/blazeface';
// import * as tf from '@tensorflow/tfjs';
import { FACE_SCALE } from '../../constants';
import { distanceCoordinates } from '../../helpers/geometry';

import './__VectorDetector';
import VectorDetector from './__VectorDetector';

export default class NVDBlaze extends VectorDetector {
  constructor(config) {
    super(config);
    // super(config);
    // this.model = model;
  }

  async load() {
    this.model = await blazeface.load({ maxFaces: 1 });
  }

  async detect(video) {
    // Get predictions from model
    let predictions = await this.model.estimateFaces(video);
    if (!predictions.length) {
      return false;
    }

    // Extract relevant data
    let data = this.__getPredictionData(predictions[0]);
    const { scale } = data;
    const { tip: nose } = data.nose;
    const { center } = data.face;

    let vectors = this.__getNosePointVectors(nose, center, scale);
    let config = this.config;

    // note estimateFaces complete *predictions* are also included here (DO NOT call it again!)
    return { vectors, predictions: predictions[0] };
  }

  __getPredictionData(prediction) {
    const eye_l = prediction.landmarks[0];
    const eye_r = prediction.landmarks[1];
    const nose = prediction.landmarks[2];
    const eyeDist = distanceCoordinates(eye_l, eye_r);
    const scale = eyeDist / FACE_SCALE;
    const topLeft = prediction.topLeft;
    const bottomRight = prediction.bottomRight;
    const width = bottomRight[0] - topLeft[0];
    const height = bottomRight[1] - topLeft[1];
    const center = [topLeft[0] + width / 2, topLeft[1] + height / 2];

    // return { topLeft, bottomRight, width, height, center, nose };

    return {
      scale,
      face: { topLeft, bottomRight, width, height, center },

      nose: {
        tip: nose,
      },
    };
  }
}
