import{_ as t,d as e,F as r,V as o}from"./index-9abee4a4.js";import{load as n}from"@tensorflow-models/blazeface";import"@tensorflow/tfjs-core";import"@tensorflow/tfjs-backend-webgl";import"@tensorflow-models/face-landmarks-detection";import"@tensorflow-models/handpose";var a=function(o){function a(t){return o.call(this,t)||this}t(a,o);var s=a.prototype;return s.load=function(){try{var t=this;return Promise.resolve(n({maxFaces:1})).then(function(e){t.model=e})}catch(t){return Promise.reject(t)}},s.detect=function(t){try{var e=this;return Promise.resolve(e.model.estimateFaces(t)).then(function(t){if(!t.length)return!1;var r=e.__getPredictionData(t[0]),o=e.__getNosePointVectors(r.nose.tip,r.face.center,r.scale);return{int_vectors:o,vectors:o,predictions:t[0]}})}catch(t){return Promise.reject(t)}},s.__getPredictionData=function(t){var o=t.landmarks[2],n=e(t.landmarks[0],t.landmarks[1]),a=t.topLeft,s=t.bottomRight,i=s[0]-a[0],c=s[1]-a[1];return{scale:n/r,face:{topLeft:a,bottomRight:s,width:i,height:c,center:[a[0]+i/2,a[1]+c/2]},nose:{tip:o}}},a}(o);export default a;
//# sourceMappingURL=VDBlaze-79c85a4b.js.map
