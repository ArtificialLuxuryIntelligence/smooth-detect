import { mergeDeep } from './../helpers/helpers';
import Interpolator from './Interpolator';
import { defaults } from '../defaults';
import { stepToward } from '../helpers/geometry';

//

// params
// detector: a detector with load, detect and configure function
// configs: e.g. :

export default class InterpolatedDetectorMULTI {
  constructor(detectors) {
    // {noser: {detector: NVDDetector(class), config:{}}, mesh: {detector: NVDDetector(class), config:{}}, etc }
    this.detectors = detectors;
    this.loaded = false;
    this.animationFrameId = null;
  }

  async load() {
    let promises = [];
    Object.values(this.detectors).forEach((d) => {
      // Load the models
      promises.push(d.detector.load());
      // await d.detector.load();

      // Add the interpolators

      const {
        stepperFactory,
        mapperArgs,
        fps,
        stepDefault,
      } = d.config.interpolator;
      const interpolatorFunction = stepperFactory(mapperArgs, stepDefault);

      d.interpolator = new Interpolator(
        (video) => d.detector.detect(video), //slow fn to interpolate between return vals
        interpolatorFunction, //interpolation fn
        fps
      );
    });
    let p = await Promise.all(promises);
    console.log('all loaded');
    this.loaded = true;
  }

  configure(configs) {
    let detNames = Object.keys(configs);
    detNames.forEach((d) => {
      // get detector
      let dd = this.detectors[d];
      // configure the detector if config
      if (configs[d].detector) {
        this.__configureDetector(configs[d].detector, dd);
      }
      // configure the interpolator if config
      if (configs[d].interpolator) {
        this.__configureInterpolator(configs[d].interpolator, dd);
      }
    });
  }

  // probably bad naming -  actually calls the interpolators (which in turn call the detect fn of detectors as their 'slow' promise)
  detect(video) {
    if (!this.loaded) {
      return {};
    }
    let detections = {};
    Object.keys(this.detectors).forEach((n) => {
      detections[n] = this.detectors[n].interpolator.interpolate(video);
    });

    // let configs = Object.values({ ...this.detectors }).map((v) => v.config);
    let configs = {};
    Object.keys(this.detectors).forEach((n) => {
      configs[n] = this.detectors[n].config;
    });

    return { detections, configs };
  }

  // looping detection
  startDetection(video, loopers = []) {
    const looper = () => {
      let d = this.detect(video);
      //loop any functions hooking into the animation loop
      if (loopers.length) {
        loopers.forEach((fn) => fn(d));
      }
      this.animationFrameId = requestAnimationFrame(looper);
    };
    looper();
  }

  stopDetection() {
    cancelAnimationFrame(this.animationFrameId);
  }
  __configureDetector(config, detector = {}) {
    Object.assign(detector.config.detector, config);
    detector.detector.configure(config);
  }

  // interpolator doesn't (yet?) have config option so need to instantiate new one
  __configureInterpolator(config, detector = {}) {
    mergeDeep(detector.config.interpolator, config);

    const {
      stepperFactory,
      mapperArgs,
      stepDefault,
      fps,
    } = detector.config.interpolator;
    const interpolatorFunction = stepperFactory(mapperArgs, stepDefault);

    detector.interpolator = new Interpolator(
      (video) => detector.detector.detect(video), //slow fn to interpolate between return vals
      interpolatorFunction, //interpolation fn
      fps
    );
  }
}
