import{V as t,d as e,F as o}from"./index-50e88efc.js";import"@tensorflow/tfjs-core";import"@tensorflow/tfjs-backend-webgl";import"@tensorflow-models/face-landmarks-detection";import"@tensorflow-models/handpose";export default class extends t{constructor(t){super(t)}async load(){try{let t=await import("@tensorflow-models/blazeface");this.model=await t.load({maxFaces:1})}catch(t){console.error("Model not loaded")}}async detect(t){let e=await this.model.estimateFaces(t);if(!e.length)return!1;let o=this.__getPredictionData(e[0]);const{scale:s}=o,{tip:a}=o.nose,{center:r}=o.face;let n=this.__getNosePointVectors(a,r,s);return{int_vectors:n,vectors:n,predictions:e[0]}}__getPredictionData(t){const s=t.landmarks[2],a=e(t.landmarks[0],t.landmarks[1]),r=t.topLeft,n=t.bottomRight,c=n[0]-r[0],i=n[1]-r[1];return{scale:a/o,face:{topLeft:r,bottomRight:n,width:c,height:i,center:[r[0]+c/2,r[1]+i/2]},nose:{tip:s}}}}
//# sourceMappingURL=VDBlaze-9612c467.js.map
