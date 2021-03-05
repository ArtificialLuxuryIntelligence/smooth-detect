import * as handpose from '@tensorflow-models/handpose';
import {
  distanceCoordinates,
  angleCoordinatesXY,
  averageCoordinate,
} from '../../helpers/geometry';
import { HAND_SCALE } from '../../constants';

import './__VectorDetector';
import VectorDetector from './__VectorDetector';

export default class VDHandpose extends VectorDetector {
  constructor(config) {
    super(config);
    // super(config);
    // this.model = model;
  }

  async load() {
    this.model = await handpose.load();
  }

  async detect(video) {
    // Get predictions from model
    const predictions = await this.model.estimateHands(
      document.querySelector('video')
    );

    if (!predictions.length) {
      return false;
    }

    // Extract relevant data
    let data = this.__getPredictionData(predictions[0]);

    // const { center ,width, height} = data;
    let { indexFinger, middleFinger, palmBase, pink, ringFinger, thumb } = data;
    let finger1Tip = indexFinger[3];
    let thumbTip = thumb[3];

    // Calculate vectors

    let pinchPos1 = this.__getPinchPos(thumbTip, finger1Tip, 1);

    let pinch1 = this.__getPinchVector(
      thumbTip,
      finger1Tip,
      this.config.pinch1_bounding,
      1
    );
    //assuming right hand for direction of rotation though no so important
    let rotation1 = this.__getRotation(
      thumbTip,
      finger1Tip,
      this.config.rotation1_bounding,
      1
    );

    let vectors = { pinch1, rotation1, pinchPos1 };
    // let config = this.config;

    // Return info

    // return int_vectors = vectors for first loop
    return { int_vectors: vectors, vectors, data, predictions: predictions[0] }; // not 'raw' data (predictions also included) data is kinda a shit dupe of this? (but useful for us here/.)
  }

  // Extract useful data from raw data
  __getPredictionData(prediction) {
    //face
    const { topLeft, bottomRight } = prediction.boundingBox;
    const width = bottomRight[0] - topLeft[0];
    const height = bottomRight[1] - topLeft[1];
    const center = [topLeft[0] + width / 2, topLeft[1] + height / 2];

    // const scale = eyeDist / FACE_SCALE;
    return { topLeft, width, height, center, ...prediction.annotations };
  }
  // should be a more general fn

  // normalized [0,1]
  __getPinchPos(thumbTip, finger1Tip, pinchBounding, scale) {
    const dims = [640, 480];

    let p = averageCoordinate([thumbTip, finger1Tip]);
    let norm = [p[0] / dims[0], p[1] / dims[1]];
    return norm;
  }

  __getPinchVector(thumbTip, finger1Tip, pinchBounding, scale) {
    let distance = distanceCoordinates(thumbTip, finger1Tip) / scale; // z normalized
    const normalizedPinch = this.__normalizeInRange(distance, pinchBounding);
    return normalizedPinch;
  }

  __getRotation(thumbTip, finger1Tip, rotationBounding, scale) {
    let angle;
    let distance = distanceCoordinates(thumbTip, finger1Tip) / scale; // z normalized
    if (distance < rotationBounding[0] || distance > rotationBounding[1]) {
      return null;
    }
    angle = angleCoordinatesXY(thumbTip, finger1Tip);

    return angle;
  }

  //output is a bit shit but that the model not the fn
}
