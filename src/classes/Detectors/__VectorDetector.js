import { FACE_SCALE } from '../../constants';

export default class VectorDetector {
  constructor(config) {
    this.model = null;
    this.config = config; // optional - can be configured after init
  }

  // load, detect and __getPredictionData are in extensions of this class

  configure(config) {
    Object.assign(this.config, config);
  }

  // TODO: move this to face classes (or a shared class for all face classes? - which blaze/mesh inherit from)
  __getNosePointVectors(nose, center, scale = 1) {
    // let central_bounding = this.config.central_bounding;
    let outer_bounding = this.config.outer_bounding;

    const x = center[0] - nose[0];
    const y = center[1] - nose[1];
    let coords = [x, y];

    //normalize distance

    // -----------------------------------------------------------

    // const direction_word = this.__getDirection(coords, central_bounding);
    const vector = [x, y];

    // TODO - should outerbounding be scaled separately?
    const nose_normalized_square = this.__getVectorNormalized(
      coords, //px
      outer_bounding, //px
      scale //px used to grow/shrink bounding limits based on z distance
    );
    const nose_normalized_circle = this.__normalizeRect2Circ(
      nose_normalized_square
    );

    return {
      // direction_word,
      vector, //absolute value in face bounding rect
      nose_normalized_square, //normalized square [0,1]x [0,1]y
      nose_normalized_circle, //normalized circle [0,1]r
    };
  }

  __normalizeInRange(value, range1, range2 = [0, 1]) {
    if (value > range1[1]) {
      return range2[1];
    }
    if (value < range1[0]) {
      return range2[0];
    }
    let dist1 = range1[1] - range1[0];
    let dist2 = range2[1] - range2[0];

    const ratio = (value - range1[0]) / dist1; //range [0,1]
    let norm = range2[0] + ratio * dist2;
    return norm;
  }

  //2d plane coordinates => unit circle r=1.
  // note: not a map but simply limits coordinates outside of radius to on circle.
  __normalizeRect2Circ(coords, radius = 1) {
    let [x, y] = coords;
    let x_sign = x > 0 ? 1 : -1;
    let y_sign = y > 0 ? 1 : -1;

    if (Math.sqrt(x ** 2 + y ** 2) <= radius) {
      return [x, y];
    }

    const theta = Math.atan(y / x);
    const y_b = y_sign * Math.abs(radius * Math.sin(theta));
    const x_b = x_sign * Math.abs(radius * Math.cos(theta));
    return [x_b, y_b];
  }

  //TODO is this needed in this form? // maybe it is good for stuff with 2d bounding..?
  // where are the scaling operations happening?
  __getVectorNormalized(coords, outer_bounding, scale = 1) {
    const [x, y] = coords;

    // get bounding config
    let bounding_x = outer_bounding.x.map((v) => v * scale); //z axis normalization;
    let bounding_y = outer_bounding.y.map((v) => v * scale); //z axis normalization;
    let [x_min, x_max] = bounding_x;
    let [y_min, y_max] = bounding_y;

    let x_normalized = this.__normalizeInRange(x, [x_min, x_max], [-1, 1]); // range normalization
    let y_normalized = this.__normalizeInRange(y, [y_min, y_max], [-1, 1]);

    return [x_normalized, y_normalized];
  }

  // LEGACY
  // returns "up", "down","left","right"
  __getDirection(coords, central_bounding) {
    const [x, y] = coords;

    let direction;
    // get bounding config
    let bounding_x = central_bounding.x;
    let bounding_y = central_bounding.y;
    let [x_min, x_max] = bounding_x;
    let [y_min, y_max] = bounding_y;

    // estimate direction
    if (x <= x_max && x >= x_min && y <= y_max && y >= y_min) {
      direction = 'center';
    } else if (x < x_max && x > x_min) {
      if (y > y_max) {
        direction = 'up';
      } else if (y < y_min) {
        direction = 'down';
      }
    } else if (y < y_max && y > y_min) {
      if (x > x_max) {
        direction = 'right';
      } else if (x < x_min) {
        direction = 'left';
      }
    }
    return direction;
  }
}
