!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e(require("@tensorflow/tfjs-core"),require("@tensorflow/tfjs-backend-webgl"),require("@tensorflow/tfjs-backend-cpu"),require("@tensorflow-models/blazeface"),require("@tensorflow-models/face-landmarks-detection"),require("@tensorflow-models/handpose")):"function"==typeof define&&define.amd?define(["@tensorflow/tfjs-core","@tensorflow/tfjs-backend-webgl","@tensorflow/tfjs-backend-cpu","@tensorflow-models/blazeface","@tensorflow-models/face-landmarks-detection","@tensorflow-models/handpose"],e):(t||self).smoothDetect=e(0,0,0,t.blazeface,t.faceLandmarksDetection,t.handpose)}(this,function(t,e,r,n,o,i){function c(t){return t&&"object"==typeof t&&!Array.isArray(t)}function s(t){var e=[].slice.call(arguments,1);if(!e.length)return t;var r=e.shift();if(c(t)&&c(r))for(var n in r){var o,i;c(r[n])?(t[n]||Object.assign(t,((o={})[n]={},o)),s(t[n],r[n])):Object.assign(t,((i={})[n]=r[n],i))}return s.apply(void 0,[t].concat(e))}var a=function(){function t(t,e,r){void 0===r&&(r=!1),this.slowPromise=t,this.stepToward=e,this.fast=null,this.slow=null,this.resolved=!0,this.fps=r}var e=t.prototype;return e.interpolate=function(t){return this.__updateSlow(t),this.__updateFast(),this.fast},e.__updateFast=function(){this.fast=this.fast?this.stepToward(this.fast,this.slow):this.slow},e.__updateSlow=function(t){try{var e=this;if(!e.resolved)return Promise.resolve();var r=function(){if(e.resolved){var r;e.resolved=!1;var n=function(){if(e.fps){var n=[e.slowPromise(t),e.__timeoutPromise()];return Promise.resolve(Promise.all([n[0],n[1]])).then(function(t){r=t[0],e.resolved=!0,r&&(e.slow=r)})}return Promise.resolve(e.slowPromise(t)).then(function(t){r=t,e.resolved=!0,r&&(e.slow=r)})}();if(n&&n.then)return n.then(function(){})}}();return Promise.resolve(r&&r.then?r.then(function(){}):void 0)}catch(t){return Promise.reject(t)}},e.__timeoutPromise=function(){try{var t=this;return Promise.resolve(new Promise(function(e,r){setTimeout(e,1e3/t.fps)}).then(function(){return null}))}catch(t){return Promise.reject(t)}},t}();function u(){return(u=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t}).apply(this,arguments)}function f(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,l(t,e)}function l(t,e){return(l=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function d(t,e){if(2===t.length)return Math.sqrt(Math.pow(e[0]-t[0],2)+Math.pow(e[1]-t[1],2));if(3===t.length)return Math.sqrt(Math.pow(e[0]-t[0],2)+Math.pow(e[1]-t[1],2)+Math.pow(e[2]-t[2],2));throw new Error("please enter 2d or 3d vectors")}function p(t,e,r){void 0===r&&(r=.1);var n=[].concat(t),o=n[0],i=n[1],c=[].concat(e);return[o+(c[0]-o)*r,i+(c[1]-i)*r]}var h=function(){function t(t){this.detectors=t,this.loaded=!1,this.animationFrameId=null}var e=t.prototype;return e.load=function(){try{var t=this,e=[];return Object.values(t.detectors).forEach(function(t){e.push(t.detector.load());var r=t.config.interpolator,n=r.fps,o=(0,r.stepperFactory)(r.mapperArgs);t.interpolator=new a(function(e){return t.detector.detect(e)},o,n)}),Promise.resolve(Promise.all(e)).then(function(e){console.log("all loaded"),t.loaded=!0})}catch(t){return Promise.reject(t)}},e.configure=function(t){var e=this;Object.keys(t).forEach(function(r){var n=e.detectors[r];t[r].detector&&e.__configureDetector(t[r].detector,n),t[r].interpolator&&(console.log(t),e.__configureInterpolator(t[r].interpolator,n))})},e.detect=function(t){var e=this;if(!this.loaded)return{};var r={};Object.keys(this.detectors).forEach(function(n){r[n]=e.detectors[n].interpolator.interpolate(t)});var n={};return Object.keys(this.detectors).forEach(function(t){n[t]=e.detectors[t].config}),{detections:r,configs:n}},e.startDetection=function(t,e){var r=this;void 0===e&&(e=[]),function n(){var o=r.detect(t);e.length&&e.forEach(function(t){return t(o)}),r.animationFrameId=requestAnimationFrame(n)}()},e.stopDetection=function(){cancelAnimationFrame(this.animationFrameId)},e.__configureDetector=function(t,e){void 0===e&&(e={}),Object.assign(e.config.detector,t),e.detector.configure(t)},e.__configureInterpolator=function(t,e){void 0===e&&(e={}),s(e.config.interpolator,t),console.log(e.config.interpolator);var r=e.config.interpolator,n=r.fps,o=(0,r.stepperFactory)(r.mapperArgs);e.interpolator=new a(function(t){return e.detector.detect(t)},o,n)},t}(),g=function(){function t(t){this.model=null,this.config=t}var e=t.prototype;return e.configure=function(t){Object.assign(this.config,t)},e.__getNosePointVectors=function(t,e,r){void 0===r&&(r=1);var n=this.config.outer_bounding,o=e[0]-t[0],i=e[1]-t[1],c=[o,i],s=this.__getDirection(c,this.config.central_bounding),a=[o,i],u=this.__getVectorNormalized(c,n,r);return{direction_word:s,vector:a,nose_normalized_square:u,nose_normalized_circle:this.__normalizeRect2Circ(u)}},e.__normalizeInRange=function(t,e,r){return void 0===r&&(r=[0,1]),t>e[1]?r[1]:t<e[0]?r[0]:r[0]+(t-e[0])/(e[1]-e[0])*(r[1]-r[0])},e.__normalizeRect2Circ=function(t,e){void 0===e&&(e=1);var r=t[0],n=t[1],o=r>0?1:-1,i=n>0?1:-1;if(Math.sqrt(Math.pow(r,2)+Math.pow(n,2))<=e)return[r,n];var c=Math.atan(n/r),s=i*Math.abs(e*Math.sin(c));return[o*Math.abs(e*Math.cos(c)),s]},e.__getDirection=function(t,e){var r,n=t[0],o=t[1],i=e.x,c=e.y,s=i[0],a=i[1],u=c[0],f=c[1];return n<=a&&n>=s&&o<=f&&o>=u?r="center":n<a&&n>s?o>f?r="up":o<u&&(r="down"):o<f&&o>u&&(n>a?r="right":n<s&&(r="left")),r},e.__getVectorNormalized=function(t,e,r){void 0===r&&(r=1);var n=t[0],o=t[1],i=e.x.map(function(t){return t*r}),c=e.y.map(function(t){return t*r}),s=c[0],a=c[1];return[this.__normalizeInRange(n,[i[0],i[1]],[-1,1]),this.__normalizeInRange(o,[s,a],[-1,1])]},t}(),_=function(t){function e(e){return t.call(this,e)||this}f(e,t);var r=e.prototype;return r.load=function(){try{var t=this;return Promise.resolve(n.load({maxFaces:1})).then(function(e){t.model=e})}catch(t){return Promise.reject(t)}},r.detect=function(t){try{var e=this;return Promise.resolve(e.model.estimateFaces(t)).then(function(t){if(!t.length)return!1;var r=e.__getPredictionData(t[0]);return{vectors:e.__getNosePointVectors(r.nose.tip,r.face.center,r.scale),predictions:t[0]}})}catch(t){return Promise.reject(t)}},r.__getPredictionData=function(t){var e=t.landmarks[2],r=d(t.landmarks[0],t.landmarks[1]),n=t.topLeft,o=t.bottomRight,i=o[0]-n[0],c=o[1]-n[1];return{scale:r/85,face:{topLeft:n,bottomRight:o,width:i,height:c,center:[n[0]+i/2,n[1]+c/2]},nose:{tip:e}}},e}(g),m=function(t){function e(e){return t.call(this,e)||this}f(e,t);var r=e.prototype;return r.load=function(){try{var t=this;return Promise.resolve(o.load(o.SupportedPackages.mediapipeFacemesh,{maxFaces:1,shouldLoadIrisModel:!1})).then(function(e){t.model=e})}catch(t){return Promise.reject(t)}},r.detect=function(t){try{var e=this;return Promise.resolve(e.model.estimateFaces({input:t,predictIrises:!1})).then(function(t){if(!t.length)return!1;var r=e.__getPredictionData(t[0]),n=r.scale,o=r.eyes,i=o.rightEyeLower1,c=o.rightEyeUpper1,s=o.leftEyeLower1,a=o.leftEyeUpper1,f=r.mouth,l=f.lipsLowerInner,d=f.lipsUpperInner,p=u({},e.__getNosePointVectors(r.nose.tip,r.face.center,n),e.__getMouthOpenVector(l,d,n),e.__getEyesClosedVectors(i,c,s,a,n));return{int_vectors:p,vectors:p,data:r,predictions:t[0]}})}catch(t){return Promise.reject(t)}},r.__getPredictionData=function(t){var e=t.boundingBox,r=e.topLeft,n=e.bottomRight,o=n[0]-r[0],i=n[1]-r[1],c=[r[0]+o/2,r[1]+i/2],s=t.annotations,a=s.lipsLowerInner,u=s.lipsUpperInner,f=s.rightEyeLower1,l=s.rightEyeUpper1,p=s.leftEyeLower1,h=s.leftEyeUpper1;a=a[5],u=u[5],l=l[4],h=h[4];var g=d(f=f[4],p=p[4]);return{scale:g/85,face:{topLeft:r,bottomRight:n,width:o,height:i,center:c},eyes:{rightEyeLower1:f,rightEyeUpper1:l,leftEyeLower1:p,leftEyeUpper1:h,eyeDist:g},nose:{tip:t.scaledMesh[4]},mouth:{lipsLowerInner:a,lipsUpperInner:u}}},r.__getMouthOpenVector=function(t,e,r){var n=d(t,e)/r;return{normalized_mouth:this.__normalizeInRange(n,this.config.mouth_bounding)}},r.__getEyesClosedVectors=function(t,e,r,n,o){var i=d(t,e)/o,c=this.config.eye_bounding,s=this.__normalizeInRange(i,c),a=d(r,n)/o;return{normalized_eye_r:s,normalized_eye_l:this.__normalizeInRange(a,c)}},e}(g),v=function(t){function e(e){return t.call(this,e)||this}f(e,t);var r=e.prototype;return r.load=function(){try{var t=this;return Promise.resolve(o.load(o.SupportedPackages.mediapipeFacemesh,{maxFaces:1,shouldLoadIrisModel:!0})).then(function(e){t.model=e})}catch(t){return Promise.reject(t)}},r.detect=function(t){try{var e=this;return Promise.resolve(e.model.estimateFaces({input:t,predictIrises:!0})).then(function(t){if(!t.length)return!1;var r=e.__getPredictionData(t[0]);return{vectors:e.__getNosePointVectors(r.nose,r.center),predictions:t[0]}})}catch(t){return Promise.reject(t)}},r.__getPredictionData=function(t){var e=t.annotations,r=e.leftEyeIris,n=[].concat(e.leftEyeLower0,e.leftEyeUpper0),o=n.length;return{center:n.reduce(function(t,e,r,n){return[t[0]+e[0],t[1]+e[1]]},[0,0]).map(function(t){return t/o}),nose:r[0]}},e}(g),y=function(t){function e(e){return t.call(this,e)||this}f(e,t);var r=e.prototype;return r.load=function(){try{var t=this;return Promise.resolve(i.load()).then(function(e){t.model=e})}catch(t){return Promise.reject(t)}},r.detect=function(t){try{var e=this;return Promise.resolve(e.model.estimateHands(document.querySelector("video"))).then(function(t){if(!t.length)return!1;var r=e.__getPredictionData(t[0]),n=r.indexFinger[3],o=r.thumb[3],i=e.__getPinchPos(o,n,1),c={pinch1:e.__getPinchVector(o,n,e.config.pinch1_bounding,1),rotation1:e.__getRotation(o,n,e.config.rotation1_bounding,1),pinchPos1:i};return{int_vectors:c,vectors:c,data:r,predictions:t[0]}})}catch(t){return Promise.reject(t)}},r.__getPredictionData=function(t){var e=t.boundingBox,r=e.topLeft,n=e.bottomRight,o=n[0]-r[0],i=n[1]-r[1];return u({topLeft:r,width:o,height:i,center:[r[0]+o/2,r[1]+i/2]},t.annotations)},r.__getPinchPos=function(t,e,r,n){var o,i,c=[640,480],s=(i=(o=[t,e]).length,o.reduce(function(t,e){return[t[0]+e[0],t[1]+e[1],t[2]+e[2]]},[0,0,0]).map(function(t){return t/i}));return[s[0]/c[0],s[1]/c[1]]},r.__getPinchVector=function(t,e,r,n){var o=d(t,e)/n;return this.__normalizeInRange(o,r)},r.__getRotation=function(t,e,r,n){var o,i,c,s,a=d(t,e)/n;return a<r[0]||a>r[1]?null:(o=t,i=e,c=(s=Math.atan((i[1]-o[1])/(i[0]-o[0])))<0?s+Math.PI:s,Math.PI-c)},e}(g);function b(t){return t&&"object"==typeof t&&!Array.isArray(t)}function w(t,e,r,n){if(b(r)&&b(n))for(var o in n){var i,c;b(n[o])?(r[o]||Object.assign(r,((i={})[o]={},i)),w(r[o],n[o])):Object.assign(r,((c={})[o]=t(e,o,r[o],n[o]),c))}return r}function P(t){return function(e,r){return u({},r,{int_vectors:e.int_vectors?w(j,t,e.int_vectors,r.vectors):r.vectors,int_predictions:e.int_predictions?w(j,t,e.int_predictions,r.predictions):r.predictions})}}function j(t,e,r,n){var o,i,c,s=.1;if(e in t){var a=t[e];if(!a)return n;a.step&&(s=a.step),a.stepperFunction&&(o=a.stepperFunction)}if(Array.isArray(r)){if(Array.isArray(r[0]))return r.map(function(r,o){return j(t,e,r,n[o])});if(2===r.length)return o?o(r,n,s):p(r,n,s);if(3===r.length)return o?o(r,n,s):p(r,n,s)}return"number"==typeof r?o?o(r,n,s):(void 0===(c=s)&&(c=.1),(i=r)+(n-i)*c):n}console.clear();var I={blaze:{detector:{central_bounding:{x:[-20,20],y:[-20,15]},outer_bounding:{x:[-50,50],y:[-35,15]}},interpolator:{predictions:!0,vectors:!0,fps:1,sensitivity:.07,mapperArgs:{landmarks:{step:.1,stepperFunction:p},probability:!1},get stepperFactory(){return P}}},mesh:{detector:{central_bounding:{x:[-20,20],y:[-20,15]},outer_bounding:{x:[-50,50],y:[-35,15]},mouth_bounding:[0,25],eye_bounding:[20,32]},interpolator:{fps:0,sensitivity:.07,mapperArgs:{},get stepToward(){return P(this.mapperArgs)}}},handpose:{detector:{central_bounding:{x:[-20,20],y:[-20,15]},outer_bounding:{x:[-50,50],y:[-35,15]},pinch1_bounding:[50,150],rotation1_bounding:[100,200],pinch2_bounding:[50,150],pinch3_bounding:[50,150],pinch4_bounding:[50,150]},interpolator:{fps:0,sensitivity:.25,mapperArgs:{landmarks:{step:.1,stepperFunction:p},probability:!1},get stepToward(){return P(this.mapperArgs)}}}};function E(t,e){var r,n=s({},I[t],e);switch(t){case"iris":r=new v(n.detector);break;case"mesh":r=new m(n.detector);break;case"blaze":r=new _(n.detector);break;case"handpose":r=new y(n.detector)}return{detector:r,config:n}}return function(t){void 0===t&&(t=[]);var e={};return t.forEach(function(t){var r;if("string"==typeof t)r=E(t,null),e[t]=r;else{var n=t.name;r=E(n,t.config),e[n]=r}}),new h(e)}});
//# sourceMappingURL=index.umd.js.map