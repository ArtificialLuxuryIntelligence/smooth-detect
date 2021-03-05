

import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';


import { distanceCoordinates } from '../../helpers/geometry';
import { FACE_SCALE } from '../../constants';

import './__VectorDetector';
import VectorDetector from './__VectorDetector';

export default class NVDMesh extends VectorDetector {
  constructor(config) {
    super(config);
    // super(config);
    // this.model = model;
  }

  async load() {
    this.model = await faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
      { maxFaces: 1, shouldLoadIrisModel: false }
    );
  }

  async detect(video) {
    // Get predictions from model
    let predictions = await this.model.estimateFaces({
      input: video,
      predictIrises: false,
    });

    if (!predictions.length) {
      return false;
    }

    // Extract relevant data
    let data = this.__getPredictionData(predictions[0]);
    const { scale } = data;
    const { center } = data.face;
    const {
      rightEyeLower1,
      rightEyeUpper1,
      leftEyeLower1,
      leftEyeUpper1,
    } = data.eyes;
    const { lipsLowerInner, lipsUpperInner } = data.mouth;
    const { tip } = data.nose;

    // Calculate vectors
    let noseVectors = this.__getNosePointVectors(tip, center, scale);
    let mouthVector = this.__getMouthOpenVector(
      lipsLowerInner,
      lipsUpperInner,
      scale
    );
    let eyeVectors = this.__getEyesClosedVectors(
      rightEyeLower1,
      rightEyeUpper1,
      leftEyeLower1,
      leftEyeUpper1,
      scale
    );

    let vectors = {
      ...noseVectors,
      ...mouthVector,
      ...eyeVectors,
    };
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

    let {
      lipsLowerInner,
      lipsUpperInner,
      rightEyeLower1,
      rightEyeUpper1,
      leftEyeLower1,
      leftEyeUpper1,
    } = prediction.annotations;

    lipsLowerInner = lipsLowerInner[5];
    lipsUpperInner = lipsUpperInner[5];
    rightEyeLower1 = rightEyeLower1[4];
    rightEyeUpper1 = rightEyeUpper1[4];
    leftEyeLower1 = leftEyeLower1[4];
    leftEyeUpper1 = leftEyeUpper1[4];

    const eyeDist = distanceCoordinates(rightEyeLower1, leftEyeLower1);
    const noseTip = prediction.scaledMesh[4];
    const scale = eyeDist / FACE_SCALE;
    return {
      scale,
      face: { topLeft, bottomRight, width, height, center },
      eyes: {
        rightEyeLower1,
        rightEyeUpper1,
        leftEyeLower1,
        leftEyeUpper1,
        eyeDist,
      },
      nose: {
        tip: noseTip,
      },
      mouth: { lipsLowerInner, lipsUpperInner },
    };
    // return {
    //   topLeft,
    //   bottomRight,
    //   width,
    //   height,
    //   center,
    //   nose,
    //   lipsLowerInner,
    //   lipsUpperInner,
    //   rightEyeLower1,
    //   rightEyeUpper1,
    //   leftEyeLower1,
    //   leftEyeUpper1,
    //   eyeDist,
    //   scale,
    // };
  }

  __getMouthOpenVector(lipUpper, lipLower, scale) {
    let distance = distanceCoordinates(lipUpper, lipLower) / scale; // z normalized
    let mouth_bounding = this.config.mouth_bounding;
    const normalized_mouth = this.__normalizeInRange(distance, mouth_bounding);

    return { normalized_mouth };
  }
  //output is a bit shit but that the model not the fn
  __getEyesClosedVectors(
    rightEyeLower1,
    rightEyeUpper1,
    leftEyeLower1,
    leftEyeUpper1,
    scale
  ) {
    let distance_r =
      distanceCoordinates(rightEyeLower1, rightEyeUpper1) / scale; //distance normalized for z-dist
    let eye_bounding = this.config.eye_bounding;
    const normalized_eye_r = this.__normalizeInRange(distance_r, eye_bounding);
    let distance_l = distanceCoordinates(leftEyeLower1, leftEyeUpper1) / scale; //distance normalized for z-dist

    const normalized_eye_l = this.__normalizeInRange(distance_l, eye_bounding);

    return { normalized_eye_r, normalized_eye_l };
  }
}
