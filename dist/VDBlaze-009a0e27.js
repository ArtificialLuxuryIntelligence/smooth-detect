import{load as t}from"@tensorflow-models/blazeface";import"@tensorflow/tfjs";import{V as e,d as o,F as s}from"./index-852a39c4.js";import"@tensorflow/tfjs-core";import"@tensorflow/tfjs-backend-webgl";import"@tensorflow-models/face-landmarks-detection";import"@tensorflow-models/handpose";export default class extends e{constructor(t){super(t)}async load(){this.model=await t({maxFaces:1})}async detect(t){let e=await this.model.estimateFaces(t);if(!e.length)return!1;let o=this.__getPredictionData(e[0]);const{scale:s}=o,{tip:a}=o.nose,{center:r}=o.face;let n=this.__getNosePointVectors(a,r,s);return{int_vectors:n,vectors:n,predictions:e[0]}}__getPredictionData(t){const e=t.landmarks[2],a=o(t.landmarks[0],t.landmarks[1]),r=t.topLeft,n=t.bottomRight,i=n[0]-r[0],c=n[1]-r[1];return{scale:a/s,face:{topLeft:r,bottomRight:n,width:i,height:c,center:[r[0]+i/2,r[1]+c/2]},nose:{tip:e}}}}
//# sourceMappingURL=VDBlaze-009a0e27.js.map