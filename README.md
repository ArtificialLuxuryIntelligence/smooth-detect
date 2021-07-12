# About

## What is does

1.  Smooths the output from various model detections (see below)
    - Generally detections do not operate at 60+fps. Smooth-detector interpolates between the outputs and renders a fluid stream of predictions.
2.  Extracts some useful data from these detections
    - Extra information is extracted from the models and normalized such as pinch distance or nose position within a bounded region.

Current supported models:

- blazeface (tensorflow)
- face landmarks detection (tensorflow)
- handpose (tensorflow)
-

## Usage

- npm install smooth-detector [! not yet released !]

```
import smoothDetector from 'smooth-detect';

const video = document.querySelector("video")

// initialize the detector
const detector = smoothDetector(config)

// Start the detection loop
video.ondataloaded(()=>{
    detector.startDetection(video, [animationLoop1]);
})

// function to run at every loop. First argument is the detection ouput that frame
function animationLoop1(output){
    console.log(output)
}
const config = ["blaze"] //pick your model(s)
```

## Configuration

See defaults for all available options for each model. /defaultsMULTI.js

### Initialization config (at load time)

```
const detector = smoothDetector(config)
```

#### No config

Array of strings. e.g.

```
["blaze", "mesh"]
```

#### With config

Array of Objects. e.g.

```
[{
    name:"blaze"
    config:{
        detector:{
             // detector configs
        },
        interpolator:{
             // interpolator configs
        }
    }
}]
```

### Modification config (after load)

```
detector.configure(config)
```

e.g.

```
const config= {
    blaze:{
        detector:{
            // detector configs
        }
        interpolator:{
            // interpolator configs
        }
    },
    mesh:{
        //...
    }
    }
}
```

#### detector configs

See defaults for all available options for each model. /defaultsMULTI.js

This configuration object is used to set the boundaries for normalized extracted data.
Note: if the model gives 3D coordinates then these values are adjusted with depth so that the output is consistent regardless of distance from camera.

e.g. in the mesh detector:

```
    nose_outer_bounding: { x: [-50, 50], y: [-35, 15] },
    mouth_bounding: [0, 25],
```

represents: - how far nose needs to be from center of face (in either direction) to output in range [-1,1]. - how far apart lips need to be to output in the range [0,1].

#### interpolator configs

See defaults for all available options for each model. /defaultsMULTI.js

This configuration object is used to set all aspects of the smoothing (interpolation).

e.g.

```
interpolator: {
      predictions: true, // should interpolate predictions
      vectors: true, // should interpolate vectors
      fps: 0, // minimum frames per second (set to zero to get maximum possible)
      stepDefault: 0.07,
      mapperArgs: { // overrides stepDefault and/or (*advanced*) the interpolation function
        probability: false, // do not interpolate this value
        landmarks:{ //
            step:0.5
            // stepperFunction: stepperFunction
        }
      },
```

##### Advanced - stepperFunction

example (current default) for updating a scalar value (number). [2D and 3D functions are similar]
params:

- prevVal : the current interpolated value
- actualVal: the most recent value outputted by the detection model
- stepSize: a constant (passed in by 'step' in configs)

```
function stepToward1D(prevVal, actualVal, stepSize = 0.1) {
  let d_x = actualVal - prevVal;
  return prevVal + d_x * stepSize;
}
```

Ignore: The stepperFactory is used internally to construct the function used to interpolate
