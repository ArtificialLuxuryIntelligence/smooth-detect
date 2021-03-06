import"@tensorflow/tfjs-core";import"@tensorflow/tfjs-backend-webgl";import"@tensorflow/tfjs-backend-cpu";import{load as t}from"@tensorflow-models/blazeface";import{load as e,SupportedPackages as r}from"@tensorflow-models/face-landmarks-detection";import{load as n}from"@tensorflow-models/handpose";function o(t){return t&&"object"==typeof t&&!Array.isArray(t)}function i(t){var e=[].slice.call(arguments,1);if(!e.length)return t;var r=e.shift();if(o(t)&&o(r))for(var n in r){var c,a;o(r[n])?(t[n]||Object.assign(t,((c={})[n]={},c)),i(t[n],r[n])):Object.assign(t,((a={})[n]=r[n],a))}return i.apply(void 0,[t].concat(e))}var c=function(){function t(t,e,r){void 0===r&&(r=!1),this.slowPromise=t,this.stepToward=e,this.fast=null,this.slow=null,this.resolved=!0,this.fps=r}var e=t.prototype;return e.interpolate=function(t){return this.__updateSlow(t),this.__updateFast(),this.fast},e.__updateFast=function(){this.fast=this.fast?this.stepToward(this.fast,this.slow):this.slow},e.__updateSlow=function(t){try{var e=this;if(!e.resolved)return Promise.resolve();var r=function(){if(e.resolved){var r;e.resolved=!1;var n=function(){if(e.fps){var n=[e.slowPromise(t),e.__timeoutPromise()];return Promise.resolve(Promise.all([n[0],n[1]])).then(function(t){r=t[0],e.resolved=!0,r&&(e.slow=r)})}return Promise.resolve(e.slowPromise(t)).then(function(t){r=t,e.resolved=!0,r&&(e.slow=r)})}();if(n&&n.then)return n.then(function(){})}}();return Promise.resolve(r&&r.then?r.then(function(){}):void 0)}catch(t){return Promise.reject(t)}},e.__timeoutPromise=function(){try{var t=this;return Promise.resolve(new Promise(function(e,r){setTimeout(e,1e3/t.fps)}).then(function(){return null}))}catch(t){return Promise.reject(t)}},t}();function a(){return(a=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t}).apply(this,arguments)}function s(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,u(t,e)}function u(t,e){return(u=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function f(t,e){if(2===t.length)return Math.sqrt(Math.pow(e[0]-t[0],2)+Math.pow(e[1]-t[1],2));if(3===t.length)return Math.sqrt(Math.pow(e[0]-t[0],2)+Math.pow(e[1]-t[1],2)+Math.pow(e[2]-t[2],2));throw new Error("please enter 2d or 3d vectors")}var l=function(){function t(t){this.detectors=t,this.loaded=!1,this.animationFrameId=null}var e=t.prototype;return e.load=function(){try{var t=this,e=[];return Object.values(t.detectors).forEach(function(t){e.push(t.detector.load());var r=t.config.interpolator,n=r.fps,o=(0,r.stepperFactory)(r.mapperArgs,r.stepDefault);t.interpolator=new c(function(e){return t.detector.detect(e)},o,n)}),Promise.resolve(Promise.all(e)).then(function(e){console.log("Models loaded"),t.loaded=!0})}catch(t){return Promise.reject(t)}},e.configure=function(t){var e=this;Object.keys(t).forEach(function(r){var n=e.detectors[r];t[r].detector&&e.__configureDetector(t[r].detector,n),t[r].interpolator&&e.__configureInterpolator(t[r].interpolator,n)})},e.detect=function(t){var e=this;if(!this.loaded)return{};var r={};Object.keys(this.detectors).forEach(function(n){r[n]=e.detectors[n].interpolator.interpolate(t)});var n={};return Object.keys(this.detectors).forEach(function(t){n[t]=e.detectors[t].config}),{detections:r,configs:n}},e.startDetection=function(t,e){var r=this;void 0===e&&(e=[]),function n(){var o=r.detect(t);e.length&&e.forEach(function(t){return t(o)}),r.animationFrameId=requestAnimationFrame(n)}()},e.stopDetection=function(){cancelAnimationFrame(this.animationFrameId)},e.__configureDetector=function(t,e){void 0===e&&(e={}),Object.assign(e.config.detector,t),e.detector.configure(t)},e.__configureInterpolator=function(t,e){void 0===e&&(e={}),i(e.config.interpolator,t);var r=e.config.interpolator,n=r.fps,o=(0,r.stepperFactory)(r.mapperArgs,r.stepDefault);e.interpolator=new c(function(t){return e.detector.detect(t)},o,n)},t}(),p=function(){function t(t){this.model=null,this.config=t}var e=t.prototype;return e.configure=function(t){Object.assign(this.config,t)},e.__getNosePointVectors=function(t,e,r){void 0===r&&(r=1);var n=e[0]-t[0],o=e[1]-t[1],i=[n,o],c=this.__getVectorNormalized([n,o],this.config.outer_bounding,r);return{vector:i,nose_normalized_square:c,nose_normalized_circle:this.__normalizeRect2Circ(c)}},e.__normalizeInRange=function(t,e,r){return void 0===r&&(r=[0,1]),t>e[1]?r[1]:t<e[0]?r[0]:r[0]+(t-e[0])/(e[1]-e[0])*(r[1]-r[0])},e.__normalizeRect2Circ=function(t,e){void 0===e&&(e=1);var r=t[0],n=t[1],o=r>0?1:-1,i=n>0?1:-1;if(Math.sqrt(Math.pow(r,2)+Math.pow(n,2))<=e)return[r,n];var c=Math.atan(n/r),a=i*Math.abs(e*Math.sin(c));return[o*Math.abs(e*Math.cos(c)),a]},e.__getVectorNormalized=function(t,e,r){void 0===r&&(r=1);var n=t[0],o=t[1],i=e.x.map(function(t){return t*r}),c=e.y.map(function(t){return t*r}),a=c[0],s=c[1];return[this.__normalizeInRange(n,[i[0],i[1]],[-1,1]),this.__normalizeInRange(o,[a,s],[-1,1])]},e.__getDirection=function(t,e){var r,n=t[0],o=t[1],i=e.x,c=e.y,a=i[0],s=i[1],u=c[0],f=c[1];return n<=s&&n>=a&&o<=f&&o>=u?r="center":n<s&&n>a?o>f?r="up":o<u&&(r="down"):o<f&&o>u&&(n>s?r="right":n<a&&(r="left")),r},t}(),h=function(e){function r(t){return e.call(this,t)||this}s(r,e);var n=r.prototype;return n.load=function(){try{var e=this;return Promise.resolve(t({maxFaces:1})).then(function(t){e.model=t})}catch(t){return Promise.reject(t)}},n.detect=function(t){try{var e=this;return Promise.resolve(e.model.estimateFaces(t)).then(function(t){if(!t.length)return!1;var r=e.__getPredictionData(t[0]);return{vectors:e.__getNosePointVectors(r.nose.tip,r.face.center,r.scale),predictions:t[0]}})}catch(t){return Promise.reject(t)}},n.__getPredictionData=function(t){var e=t.landmarks[2],r=f(t.landmarks[0],t.landmarks[1]),n=t.topLeft,o=t.bottomRight,i=o[0]-n[0],c=o[1]-n[1];return{scale:r/85,face:{topLeft:n,bottomRight:o,width:i,height:c,center:[n[0]+i/2,n[1]+c/2]},nose:{tip:e}}},r}(p),d=function(t){function n(e){return t.call(this,e)||this}s(n,t);var o=n.prototype;return o.load=function(){try{var t=this;return Promise.resolve(e(r.mediapipeFacemesh,{maxFaces:1,shouldLoadIrisModel:!1})).then(function(e){t.model=e})}catch(t){return Promise.reject(t)}},o.detect=function(t){try{var e=this;return Promise.resolve(e.model.estimateFaces({input:t,predictIrises:!1})).then(function(t){if(!t.length)return!1;var r=e.__getPredictionData(t[0]),n=r.scale,o=r.eyes,i=o.rightEyeLower1,c=o.rightEyeUpper1,s=o.leftEyeLower1,u=o.leftEyeUpper1,f=r.mouth,l=f.lipsLowerInner,p=f.lipsUpperInner,h=a({},e.__getNosePointVectors(r.nose.tip,r.face.center,n),e.__getMouthOpenVector(l,p,n),e.__getEyesClosedVectors(i,c,s,u,n));return{int_vectors:h,vectors:h,data:r,predictions:t[0]}})}catch(t){return Promise.reject(t)}},o.__getPredictionData=function(t){var e=t.boundingBox,r=e.topLeft,n=e.bottomRight,o=n[0]-r[0],i=n[1]-r[1],c=[r[0]+o/2,r[1]+i/2],a=t.annotations,s=a.lipsLowerInner,u=a.lipsUpperInner,l=a.rightEyeLower1,p=a.rightEyeUpper1,h=a.leftEyeLower1,d=a.leftEyeUpper1;s=s[5],u=u[5],p=p[4],d=d[4];var m=f(l=l[4],h=h[4]);return{scale:m/85,face:{topLeft:r,bottomRight:n,width:o,height:i,center:c},eyes:{rightEyeLower1:l,rightEyeUpper1:p,leftEyeLower1:h,leftEyeUpper1:d,eyeDist:m},nose:{tip:t.scaledMesh[4]},mouth:{lipsLowerInner:s,lipsUpperInner:u}}},o.__getMouthOpenVector=function(t,e,r){var n=f(t,e)/r;return{normalized_mouth:this.__normalizeInRange(n,this.config.mouth_bounding)}},o.__getEyesClosedVectors=function(t,e,r,n,o){var i=f(t,e)/o,c=this.config.eye_bounding,a=this.__normalizeInRange(i,c),s=f(r,n)/o;return{normalized_eye_r:a,normalized_eye_l:this.__normalizeInRange(s,c)}},n}(p),m=function(t){function n(e){return t.call(this,e)||this}s(n,t);var o=n.prototype;return o.load=function(){try{var t=this;return Promise.resolve(e(r.mediapipeFacemesh,{maxFaces:1,shouldLoadIrisModel:!0})).then(function(e){t.model=e})}catch(t){return Promise.reject(t)}},o.detect=function(t){try{var e=this;return Promise.resolve(e.model.estimateFaces({input:t,predictIrises:!0})).then(function(t){if(!t.length)return!1;var r=e.__getPredictionData(t[0]);return{vectors:e.__getNosePointVectors(r.nose,r.center),predictions:t[0]}})}catch(t){return Promise.reject(t)}},o.__getPredictionData=function(t){var e=t.annotations,r=e.leftEyeIris,n=[].concat(e.leftEyeLower0,e.leftEyeUpper0),o=n.length;return{center:n.reduce(function(t,e,r,n){return[t[0]+e[0],t[1]+e[1]]},[0,0]).map(function(t){return t/o}),nose:r[0]}},n}(p),_=function(t){function e(e){return t.call(this,e)||this}s(e,t);var r=e.prototype;return r.load=function(){try{var t=this;return Promise.resolve(n()).then(function(e){t.model=e})}catch(t){return Promise.reject(t)}},r.detect=function(t){try{var e=this;return Promise.resolve(e.model.estimateHands(t)).then(function(t){if(!t.length)return!1;var r=e.__getPredictionData(t[0]),n=r.indexFinger[3],o=r.thumb[3],i=e.__getPinchPos(o,n,1);return{vectors:{pinch1:e.__getPinchVector(o,n,e.config.pinch1_bounding,1),rotation1:e.__getRotation(o,n,e.config.rotation1_bounding,1),pinchPos1:i},data:r,predictions:t[0]}})}catch(t){return Promise.reject(t)}},r.__getPredictionData=function(t){var e=t.boundingBox,r=e.topLeft,n=e.bottomRight,o=n[0]-r[0],i=n[1]-r[1];return a({topLeft:r,width:o,height:i,center:[r[0]+o/2,r[1]+i/2]},t.annotations)},r.__getPinchPos=function(t,e,r,n){var o,i,c=[640,480],a=(i=(o=[t,e]).length,o.reduce(function(t,e){return[t[0]+e[0],t[1]+e[1],t[2]+e[2]]},[0,0,0]).map(function(t){return t/i}));return[a[0]/c[0],a[1]/c[1]]},r.__getPinchVector=function(t,e,r,n){var o=f(t,e)/n;return this.__normalizeInRange(o,r)},r.__getRotation=function(t,e,r,n){var o,i,c,a,s=f(t,e)/n;return s<r[0]||s>r[1]?null:(o=t,i=e,c=(a=Math.atan((i[1]-o[1])/(i[0]-o[0])))<0?a+Math.PI:a,Math.PI-c)},e}(p);function g(t){return t&&"object"==typeof t&&!Array.isArray(t)}function v(t,e,r,n){if(g(r)&&g(n))for(var o in n){var i,c;g(n[o])?(r[o]||Object.assign(r,((i={})[o]={},i)),v(t,e,r[o],n[o])):Object.assign(r,((c={})[o]=t(e,o,r[o],n[o]),c))}return r}function y(t,e){return void 0===e&&(e=.1),function(e,n){return a({},n,{int_vectors:e.int_vectors?v(r,t,e.int_vectors,n.vectors):n.vectors,int_predictions:e.int_predictions?v(r,t,e.int_predictions,n.predictions):n.predictions})};function r(t,n,o,i){var c,a=e;if(n in t){var s=t[n];if(!s)return i;s.step&&(a=s.step),s.stepperFunction&&(c=s.stepperFunction)}if(Array.isArray(o)){if(Array.isArray(o[0]))return o.map(function(e,o){return r(t,n,e,i[o])});if(2===o.length)return c?c(o,i,a):function(t,e,r){void 0===r&&(r=.1);var n=[].concat(t),o=n[0],i=n[1],c=[].concat(e);return[o+(c[0]-o)*r,i+(c[1]-i)*r]}(o,i,a);if(3===o.length)return c?c(o,i,a):function(t,e,r){void 0===r&&(r=.1);var n=[].concat(t),o=n[0],i=n[1],c=n[2],a=[].concat(e);return[o+(a[0]-o)*r,i+(a[1]-i)*r,c+(a[2]-c)*r]}(o,i,a)}return"number"==typeof o?c?c(o,i,a):function(t,e,r){return void 0===r&&(r=.1),t+(e-t)*r}(o,i,a):i}}console.clear();var b={blaze:{detector:{outer_bounding:{x:[-50,50],y:[-35,15]}},interpolator:{predictions:!0,vectors:!0,fps:0,stepDefault:.1,mapperArgs:{probability:!1},get stepperFactory(){return y}}},mesh:{detector:{outer_bounding:{x:[-50,50],y:[-35,15]},mouth_bounding:[0,25],eye_bounding:[20,32]},interpolator:{fps:0,stepDefault:.07,mapperArgs:{probability:!1},get stepperFactory(){return y}}},handpose:{detector:{outer_bounding:{x:[-50,50],y:[-35,15]},pinch1_bounding:[50,150],rotation1_bounding:[100,200],pinch2_bounding:[50,150],pinch3_bounding:[50,150],pinch4_bounding:[50,150]},interpolator:{fps:0,stepDefault:.25,mapperArgs:{probability:!1},get stepperFactory(){return y}}}};function P(t){void 0===t&&(t=[]);var e={};return t.forEach(function(t){var r;if("string"==typeof t)r=w(t,null),e[t]=r;else{var n=t.name;r=w(n,t.config),e[n]=r}}),new l(e)}function w(t,e){var r,n=i({},b[t],e);switch(console.log(n),t){case"iris":r=new m(n.detector);break;case"mesh":r=new d(n.detector);break;case"blaze":r=new h(n.detector);break;case"handpose":r=new _(n.detector)}return{detector:r,config:n}}export default P;
//# sourceMappingURL=index.module.js.map
