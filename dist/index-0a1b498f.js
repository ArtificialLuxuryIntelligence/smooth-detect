import"@tensorflow/tfjs-core";import"@tensorflow/tfjs-backend-webgl";import{load as t,SupportedPackages as e}from"@tensorflow-models/face-landmarks-detection";import{load as n}from"@tensorflow-models/handpose";function r(t){return t&&"object"==typeof t&&!Array.isArray(t)}function o(t){var e=[].slice.call(arguments,1);if(!e.length)return t;var n=e.shift();if(r(t)&&r(n))for(var i in n){var c,s;r(n[i])?(t[i]||Object.assign(t,((c={})[i]={},c)),o(t[i],n[i])):Object.assign(t,((s={})[i]=n[i],s))}return o.apply(void 0,[t].concat(e))}var i=function(){function t(t,e,n,r){void 0===r&&(r=!1),this.slowPromise=t,this.stepToward=e,this.fast=null,this.slow=null,this.resolved=!0,this.fps=r,this.stepArg=n}var e=t.prototype;return e.interpolate=function(t){return this.__updateFast(),this.__updateSlow(t),this.fast},e.__updateFast=function(){this.fast=this.fast?this.stepToward(this.fast,this.slow,this.stepArg):this.slow},e.__updateSlow=function(t){try{var e=this;if(!e.resolved)return Promise.resolve();var n=function(){if(e.resolved){var n;e.resolved=!1;var r=function(){if(e.fps){var r=[e.slowPromise(t),e.__timeoutPromise()];return Promise.resolve(Promise.all([r[0],r[1]])).then(function(t){n=t[0],e.resolved=!0,n&&(e.slow=n)})}return Promise.resolve(e.slowPromise(t)).then(function(t){n=t,e.resolved=!0,n&&(e.slow=n)})}();if(r&&r.then)return r.then(function(){})}}();return Promise.resolve(n&&n.then?n.then(function(){}):void 0)}catch(t){return Promise.reject(t)}},e.__timeoutPromise=function(){try{var t=this;return Promise.resolve(new Promise(function(e,n){setTimeout(e,1e3/t.fps)}).then(function(){return null}))}catch(t){return Promise.reject(t)}},t}();function c(){return(c=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}function s(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,a(t,e)}function a(t,e){return(a=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function u(t,e,n){void 0===n&&(n=.1);var r=[].concat(t),o=r[0],i=r[1],c=[].concat(e);return[o+(c[0]-o)*n,i+(c[1]-i)*n]}function f(t,e,n){return void 0===n&&(n=.1),t+(e-t)*n}function l(t,e){if(2===t.length)return Math.sqrt(Math.pow(e[0]-t[0],2)+Math.pow(e[1]-t[1],2));if(3===t.length)return Math.sqrt(Math.pow(e[0]-t[0],2)+Math.pow(e[1]-t[1],2)+Math.pow(e[2]-t[2],2));throw new Error("please enter 2d or 3d vectors")}var h=function(){function t(t){this.detectors=t,this.loaded=!1,this.animationFrameId=null}var e=t.prototype;return e.load=function(){try{var t=this,e=[];return Object.values(t.detectors).forEach(function(t){e.push(t.detector.load()),t.interpolator=new i(function(e){return t.detector.detect(e)},t.config.interpolator.stepToward,t.config.interpolator.sensitivity,t.config.interpolator.fps)}),Promise.resolve(Promise.all(e)).then(function(e){console.log("all loaded"),t.loaded=!0})}catch(t){return Promise.reject(t)}},e.configure=function(t){var e=this;Object.keys(t).forEach(function(n){var r=e.detectors[n];t[n].detector&&e.__configureDetector(t[n].detector,r),t[n].interpolator&&e.__configureInterpolator(t[n].interpolator,r)})},e.detect=function(t){var e=this;if(!this.loaded)return{};var n={};Object.keys(this.detectors).forEach(function(r){n[r]=e.detectors[r].interpolator.interpolate(t)});var r={};return Object.keys(this.detectors).forEach(function(t){r[t]=e.detectors[t].config}),{detections:n,configs:r}},e.startDetection=function(t,e){var n=this;void 0===e&&(e=[]),function r(){n.detect(t),e.length&&e.forEach(function(t){return t()}),n.animationFrameId=requestAnimationFrame(r)}()},e.stopDetection=function(){cancelAnimationFrame(this.animationFrameId)},e.__configureDetector=function(t,e){void 0===e&&(e={}),Object.assign(e.config.detector,t),e.detector.configure(t)},e.__configureInterpolator=function(t,e){void 0===e&&(e={}),Object.assign(e.config.interpolator,t),e.interpolator=new i(function(t){return e.detector.detect(t)},e.config.interpolator.stepToward,e.config.interpolator.sensitivity,e.config.interpolator.fps)},t}(),d=85,v=function(){function t(t){this.model=null,this.config=t}var e=t.prototype;return e.configure=function(t){Object.assign(this.config,t)},e.__getNosePointVectors=function(t,e,n){void 0===n&&(n=1);var r=this.config.outer_bounding,o=e[0]-t[0],i=e[1]-t[1],c=[o,i],s=this.__getDirection(c,this.config.central_bounding),a=[o,i],u=this.__getVectorNormalized(c,r,n);return{direction_word:s,vector:a,nose_normalized_square:u,nose_normalized_circle:this.__normalizeRect2Circ(u)}},e.__normalizeInRange=function(t,e,n){return void 0===n&&(n=[0,1]),t>e[1]?n[1]:t<e[0]?n[0]:n[0]+(t-e[0])/(e[1]-e[0])*(n[1]-n[0])},e.__normalizeRect2Circ=function(t,e){void 0===e&&(e=1);var n=t[0],r=t[1],o=n>0?1:-1,i=r>0?1:-1;if(Math.sqrt(Math.pow(n,2)+Math.pow(r,2))<=e)return[n,r];var c=Math.atan(r/n),s=i*Math.abs(e*Math.sin(c));return[o*Math.abs(e*Math.cos(c)),s]},e.__getDirection=function(t,e){var n,r=t[0],o=t[1],i=e.x,c=e.y,s=i[0],a=i[1],u=c[0],f=c[1];return r<=a&&r>=s&&o<=f&&o>=u?n="center":r<a&&r>s?o>f?n="up":o<u&&(n="down"):o<f&&o>u&&(r>a?n="right":r<s&&(n="left")),n},e.__getVectorNormalized=function(t,e,n){void 0===n&&(n=1);var r=t[0],o=t[1],i=e.x.map(function(t){return t*n}),c=e.y.map(function(t){return t*n}),s=c[0],a=c[1];return[this.__normalizeInRange(r,[i[0],i[1]],[-1,1]),this.__normalizeInRange(o,[s,a],[-1,1])]},t}(),p=function(n){function r(t){return n.call(this,t)||this}s(r,n);var o=r.prototype;return o.load=function(){try{var n=this;return Promise.resolve(t(e.mediapipeFacemesh,{maxFaces:1,shouldLoadIrisModel:!1})).then(function(t){n.model=t})}catch(t){return Promise.reject(t)}},o.detect=function(t){try{var e=this;return Promise.resolve(e.model.estimateFaces({input:t,predictIrises:!1})).then(function(t){if(!t.length)return!1;var n=e.__getPredictionData(t[0]),r=n.scale,o=n.eyes,i=o.rightEyeLower1,s=o.rightEyeUpper1,a=o.leftEyeLower1,u=o.leftEyeUpper1,f=n.mouth,l=f.lipsLowerInner,h=f.lipsUpperInner,d=c({},e.__getNosePointVectors(n.nose.tip,n.face.center,r),e.__getMouthOpenVector(l,h,r),e.__getEyesClosedVectors(i,s,a,u,r));return{int_vectors:d,vectors:d,data:n,predictions:t[0]}})}catch(t){return Promise.reject(t)}},o.__getPredictionData=function(t){var e=t.boundingBox,n=e.topLeft,r=e.bottomRight,o=r[0]-n[0],i=r[1]-n[1],c=[n[0]+o/2,n[1]+i/2],s=t.annotations,a=s.lipsLowerInner,u=s.lipsUpperInner,f=s.rightEyeLower1,h=s.rightEyeUpper1,d=s.leftEyeLower1,v=s.leftEyeUpper1;a=a[5],u=u[5],h=h[4],v=v[4];var p=l(f=f[4],d=d[4]);return{scale:p/85,face:{topLeft:n,bottomRight:r,width:o,height:i,center:c},eyes:{rightEyeLower1:f,rightEyeUpper1:h,leftEyeLower1:d,leftEyeUpper1:v,eyeDist:p},nose:{tip:t.scaledMesh[4]},mouth:{lipsLowerInner:a,lipsUpperInner:u}}},o.__getMouthOpenVector=function(t,e,n){var r=l(t,e)/n;return{normalized_mouth:this.__normalizeInRange(r,this.config.mouth_bounding)}},o.__getEyesClosedVectors=function(t,e,n,r,o){var i=l(t,e)/o,c=this.config.eye_bounding,s=this.__normalizeInRange(i,c),a=l(n,r)/o;return{normalized_eye_r:s,normalized_eye_l:this.__normalizeInRange(a,c)}},r}(v),_=function(n){function r(t){return n.call(this,t)||this}s(r,n);var o=r.prototype;return o.load=function(){try{var n=this;return Promise.resolve(t(e.mediapipeFacemesh,{maxFaces:1,shouldLoadIrisModel:!0})).then(function(t){n.model=t})}catch(t){return Promise.reject(t)}},o.detect=function(t){try{var e=this;return Promise.resolve(e.model.estimateFaces({input:t,predictIrises:!0})).then(function(t){if(!t.length)return!1;var n=e.__getPredictionData(t[0]);return{vectors:e.__getNosePointVectors(n.nose,n.center),predictions:t[0]}})}catch(t){return Promise.reject(t)}},o.__getPredictionData=function(t){var e=t.annotations,n=e.leftEyeIris,r=[].concat(e.leftEyeLower0,e.leftEyeUpper0),o=r.length;return{center:r.reduce(function(t,e,n,r){return[t[0]+e[0],t[1]+e[1]]},[0,0]).map(function(t){return t/o}),nose:n[0]}},r}(v),m=function(t){function e(e){return t.call(this,e)||this}s(e,t);var r=e.prototype;return r.load=function(){try{var t=this;return Promise.resolve(n()).then(function(e){t.model=e})}catch(t){return Promise.reject(t)}},r.detect=function(t){try{var e=this;return Promise.resolve(e.model.estimateHands(document.querySelector("video"))).then(function(t){if(!t.length)return!1;var n=e.__getPredictionData(t[0]),r=n.indexFinger[3],o=n.thumb[3],i=e.__getPinchPos(o,r,1),c={pinch1:e.__getPinchVector(o,r,e.config.pinch1_bounding,1),rotation1:e.__getRotation(o,r,e.config.rotation1_bounding,1),pinchPos1:i};return{int_vectors:c,vectors:c,data:n,predictions:t[0]}})}catch(t){return Promise.reject(t)}},r.__getPredictionData=function(t){var e=t.boundingBox,n=e.topLeft,r=e.bottomRight,o=r[0]-n[0],i=r[1]-n[1];return c({topLeft:n,width:o,height:i,center:[n[0]+o/2,n[1]+i/2]},t.annotations)},r.__getPinchPos=function(t,e,n,r){var o,i,c=[640,480],s=(i=(o=[t,e]).length,o.reduce(function(t,e){return[t[0]+e[0],t[1]+e[1],t[2]+e[2]]},[0,0,0]).map(function(t){return t/i}));return[s[0]/c[0],s[1]/c[1]]},r.__getPinchVector=function(t,e,n,r){var o=l(t,e)/r;return this.__normalizeInRange(o,n)},r.__getRotation=function(t,e,n,r){var o,i,c,s,a=l(t,e)/r;return a<n[0]||a>n[1]?null:(o=t,i=e,c=(s=Math.atan((i[1]-o[1])/(i[0]-o[0])))<0?s+Math.PI:s,Math.PI-c)},e}(v),g={blaze:{detector:{central_bounding:{x:[-20,20],y:[-20,15]},outer_bounding:{x:[-50,50],y:[-35,15]}},interpolator:{fps:0,sensitivity:.07,stepToward:y}},mesh:{detector:{central_bounding:{x:[-20,20],y:[-20,15]},outer_bounding:{x:[-50,50],y:[-35,15]},mouth_bounding:[0,25],eye_bounding:[20,32]},interpolator:{fps:0,sensitivity:.07,stepToward:y}},iris:{detector:{central_bounding:{x:[-20,20],y:[-20,15]},outer_bounding:{x:[-50,50],y:[-35,15]},mouth_bounding:[0,10],eye_bounding:[25,32]},interpolator:{fps:0,sensitivity:.07,stepToward:y}},handpose:{detector:{central_bounding:{x:[-20,20],y:[-20,15]},outer_bounding:{x:[-50,50],y:[-35,15]},pinch1_bounding:[50,150],rotation1_bounding:[100,200],pinch2_bounding:[50,150],pinch3_bounding:[50,150],pinch4_bounding:[50,150]},interpolator:{fps:0,sensitivity:.25,stepToward:function(t,e,n){var r,o,i,s=e.vectors,a=s.rotation1,l=s.pinchPos1;return c({},e,{int_vectors:{pinch1:f((null==(r=t.int_vectors)?void 0:r.pinch1)||t.vectors.pinch1,s.pinch1,n),pinchPos1:u((null==(o=t.int_vectors)?void 0:o.pinchPos1)||t.vectors.pinchPos1,l,n),rotation1:f((null==(i=t.int_vectors)?void 0:i.rotation1)||t.vectors.rotation1,a,n)}})}}}};function y(t,e,n){var r,o,i,s=e.vectors,a=s.nose_normalized_square,l=s.normalized_mouth;return c({},e,{int_vectors:{nose_normalized_circle:u((null==(r=t.int_vectors)?void 0:r.nose_normalized_circle)||t.vectors.nose_normalized_circle,s.nose_normalized_circle,n),nose_normalized_square:u((null==(o=t.int_vectors)?void 0:o.nose_normalized_square)||t.vectors.nose_normalized_square,a,n),normalized_mouth:f((null==(i=t.int_vectors)?void 0:i.normalized_mouth)||t.vectors.normalized_mouth,l,n)}})}function b(t,e,n){if(!t.s){if(n instanceof P){if(!n.s)return void(n.o=b.bind(null,t,e));1&e&&(e=n.s),n=n.v}if(n&&n.then)return void n.then(b.bind(null,t,e),b.bind(null,t,2));t.s=e,t.v=n;var r=t.o;r&&r(t)}}var w=function(t,e){try{var n,r=function(){return{detector:n,config:i}},i=o({},g[t],e),c=function(t,e){var n,r=-1;t:{for(var o=0;o<e.length;o++){var i=e[o][0];if(i){var c=i();if(c&&c.then)break t;if(c===t){r=o;break}}else r=o}if(-1!==r){do{for(var s=e[r][1];!s;)r++,s=e[r][1];var a=s();if(a&&a.then){n=!0;break t}var u=e[r][2];r++}while(u&&!u());return a}}var f=new P,l=b.bind(null,f,2);return(n?a.then(h):c.then(function n(c){for(;;){if(c===t){r=o;break}if(++o===e.length){if(-1!==r)break;return void b(f,1,a)}if(i=e[o][0]){if((c=i())&&c.then)return void c.then(n).then(void 0,l)}else r=o}do{for(var s=e[r][1];!s;)r++,s=e[r][1];var a=s();if(a&&a.then)return void a.then(h).then(void 0,l);var u=e[r][2];r++}while(u&&!u());b(f,1,a)})).then(void 0,l),f;function h(t){for(;;){var n=e[r][2];if(!n||n())break;r++;for(var o=e[r][1];!o;)r++,o=e[r][1];if((t=o())&&t.then)return void t.then(h).then(void 0,l)}b(f,1,t)}}(t,[[function(){return"iris"},function(){n=new _(i.detector)}],[function(){return"mesh"},function(){n=new p(i.detector)}],[function(){return"blaze"},function(){return Promise.resolve(import("./VDBlaze-c0ff957d.js")).then(function(t){n=new t(i.detector)})}],[function(){return"handpose"},function(){n=new m(i.detector)}],[]]);return Promise.resolve(c&&c.then?c.then(r):r())}catch(t){return Promise.reject(t)}},P=function(){function t(){}return t.prototype.then=function(e,n){var r=new t,o=this.s;if(o){var i=1&o?e:n;if(i){try{b(r,1,i(this.v))}catch(t){b(r,2,t)}return r}return this}return this.o=function(t){try{var o=t.v;1&t.s?b(r,1,e?e(o):o):n?b(r,1,n(o)):b(r,2,o)}catch(t){b(r,2,t)}},r},t}();function z(t){void 0===t&&(t=[]);var e={};return t.forEach(function(t){var n;if("string"==typeof t)n=w(t,null),e[t]=n;else{var r=t.name;n=w(r,t.config),e[r]=n}}),new h(e)}export{d as F,v as V,s as _,l as d,z as n};
//# sourceMappingURL=index-0a1b498f.js.map
