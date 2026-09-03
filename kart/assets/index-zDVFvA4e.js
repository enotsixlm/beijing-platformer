(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(n){if(n.ep)return;n.ep=!0;const r=e(n);fetch(n.href,r)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const yl="169",gu=0,gc=1,_u=2,uf=1,df=2,Xi=3,Qi=0,je=1,_e=2,$i=0,Fn=1,_i=2,_c=3,vc=4,vu=5,Pn=100,xu=101,Mu=102,yu=103,bu=104,Su=200,wu=201,Tu=202,Eu=203,Co=204,Po=205,Au=206,Ru=207,Cu=208,Pu=209,Iu=210,Lu=211,Du=212,Uu=213,Nu=214,Io=0,Lo=1,Do=2,xs=3,Uo=4,No=5,ko=6,Fo=7,pf=0,ku=1,Fu=2,dn=0,mf=1,gf=2,_f=3,bl=4,Ou=5,vf=6,xf=7,Mf=300,Ms=301,ys=302,Oo=303,zo=304,ga=306,er=1e3,Nn=1001,Bo=1002,Ye=1003,zu=1004,Ks=1005,vi=1006,Ra=1007,un=1008,ki=1009,yf=1010,bf=1011,ir=1012,Sl=1013,zn=1014,Ui=1015,Ni=1016,wl=1017,Tl=1018,bs=1020,Sf=35902,wf=1021,Tf=1022,Pi=1023,Ef=1024,Af=1025,ms=1026,Ss=1027,_a=1028,El=1029,Rf=1030,Al=1031,Rl=1033,$r=33776,jr=33777,Zr=33778,Jr=33779,Go=35840,Ho=35841,Vo=35842,Wo=35843,Xo=36196,qo=37492,Yo=37496,Ko=37808,$o=37809,jo=37810,Zo=37811,Jo=37812,Qo=37813,tl=37814,el=37815,il=37816,nl=37817,sl=37818,rl=37819,al=37820,ol=37821,Qr=36492,ll=36494,cl=36495,Cf=36283,hl=36284,fl=36285,ul=36286,Bu=3200,Gu=3201,Cl=0,Hu=1,Ri="",fi="srgb",tn="srgb-linear",Pl="display-p3",va="display-p3-linear",aa="linear",xe="srgb",oa="rec709",la="p3",Wn=7680,xc=519,Vu=512,Wu=513,Xu=514,Pf=515,qu=516,Yu=517,Ku=518,$u=519,dl=35044,pl=35048,Mc="300 es",qi=2e3,ca=2001;class Es{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const n=this._listeners[t];if(n!==void 0){const r=n.indexOf(e);r!==-1&&n.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const n=i.slice(0);for(let r=0,a=n.length;r<a;r++)n[r].call(this,t);t.target=null}}}const Ke=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let yc=1234567;const js=Math.PI/180,nr=180/Math.PI;function ji(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ke[s&255]+Ke[s>>8&255]+Ke[s>>16&255]+Ke[s>>24&255]+"-"+Ke[t&255]+Ke[t>>8&255]+"-"+Ke[t>>16&15|64]+Ke[t>>24&255]+"-"+Ke[e&63|128]+Ke[e>>8&255]+"-"+Ke[e>>16&255]+Ke[e>>24&255]+Ke[i&255]+Ke[i>>8&255]+Ke[i>>16&255]+Ke[i>>24&255]).toLowerCase()}function qe(s,t,e){return Math.max(t,Math.min(e,s))}function Il(s,t){return(s%t+t)%t}function ju(s,t,e,i,n){return i+(s-t)*(n-i)/(e-t)}function Zu(s,t,e){return s!==t?(e-s)/(t-s):0}function Zs(s,t,e){return(1-e)*s+e*t}function Ju(s,t,e,i){return Zs(s,t,1-Math.exp(-e*i))}function Qu(s,t=1){return t-Math.abs(Il(s,t*2)-t)}function td(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function ed(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function id(s,t){return s+Math.floor(Math.random()*(t-s+1))}function nd(s,t){return s+Math.random()*(t-s)}function sd(s){return s*(.5-Math.random())}function rd(s){s!==void 0&&(yc=s);let t=yc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function ad(s){return s*js}function od(s){return s*nr}function ld(s){return(s&s-1)===0&&s!==0}function cd(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function hd(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function fd(s,t,e,i,n){const r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+i)/2),h=a((t+i)/2),f=r((t-i)/2),u=a((t-i)/2),m=r((i-t)/2),g=a((i-t)/2);switch(n){case"XYX":s.set(o*h,l*f,l*u,o*c);break;case"YZY":s.set(l*u,o*h,l*f,o*c);break;case"ZXZ":s.set(l*f,l*u,o*h,o*c);break;case"XZX":s.set(o*h,l*g,l*m,o*c);break;case"YXY":s.set(l*m,o*h,l*g,o*c);break;case"ZYZ":s.set(l*g,l*m,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+n)}}function Ci(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function me(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Ca={DEG2RAD:js,RAD2DEG:nr,generateUUID:ji,clamp:qe,euclideanModulo:Il,mapLinear:ju,inverseLerp:Zu,lerp:Zs,damp:Ju,pingpong:Qu,smoothstep:td,smootherstep:ed,randInt:id,randFloat:nd,randFloatSpread:sd,seededRandom:rd,degToRad:ad,radToDeg:od,isPowerOfTwo:ld,ceilPowerOfTwo:cd,floorPowerOfTwo:hd,setQuaternionFromProperEuler:fd,normalize:me,denormalize:Ci};class Lt{constructor(t=0,e=0){Lt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,n=t.elements;return this.x=n[0]*e+n[3]*i+n[6],this.y=n[1]*e+n[4]*i+n[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(qe(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),n=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*i-a*n+t.x,this.y=r*n+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Zt{constructor(t,e,i,n,r,a,o,l,c){Zt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,n,r,a,o,l,c)}set(t,e,i,n,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=n,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,n=e.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],f=i[7],u=i[2],m=i[5],g=i[8],_=n[0],p=n[3],d=n[6],x=n[1],M=n[4],b=n[7],P=n[2],T=n[5],E=n[8];return r[0]=a*_+o*x+l*P,r[3]=a*p+o*M+l*T,r[6]=a*d+o*b+l*E,r[1]=c*_+h*x+f*P,r[4]=c*p+h*M+f*T,r[7]=c*d+h*b+f*E,r[2]=u*_+m*x+g*P,r[5]=u*p+m*M+g*T,r[8]=u*d+m*b+g*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],n=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-i*r*h+i*o*l+n*r*c-n*a*l}invert(){const t=this.elements,e=t[0],i=t[1],n=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],f=h*a-o*c,u=o*l-h*r,m=c*r-a*l,g=e*f+i*u+n*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=f*_,t[1]=(n*c-h*i)*_,t[2]=(o*i-n*a)*_,t[3]=u*_,t[4]=(h*e-n*l)*_,t[5]=(n*r-o*e)*_,t[6]=m*_,t[7]=(i*l-c*e)*_,t[8]=(a*e-i*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,n,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+t,-n*c,n*l,-n*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Pa.makeScale(t,e)),this}rotate(t){return this.premultiply(Pa.makeRotation(-t)),this}translate(t,e){return this.premultiply(Pa.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let n=0;n<9;n++)if(e[n]!==i[n])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Pa=new Zt;function If(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function ha(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function ud(){const s=ha("canvas");return s.style.display="block",s}const bc={};function ta(s){s in bc||(bc[s]=!0,console.warn(s))}function dd(s,t,e){return new Promise(function(i,n){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:n();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:i()}}setTimeout(r,e)})}function pd(s){const t=s.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function md(s){const t=s.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Sc=new Zt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),wc=new Zt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Ls={[tn]:{transfer:aa,primaries:oa,luminanceCoefficients:[.2126,.7152,.0722],toReference:s=>s,fromReference:s=>s},[fi]:{transfer:xe,primaries:oa,luminanceCoefficients:[.2126,.7152,.0722],toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[va]:{transfer:aa,primaries:la,luminanceCoefficients:[.2289,.6917,.0793],toReference:s=>s.applyMatrix3(wc),fromReference:s=>s.applyMatrix3(Sc)},[Pl]:{transfer:xe,primaries:la,luminanceCoefficients:[.2289,.6917,.0793],toReference:s=>s.convertSRGBToLinear().applyMatrix3(wc),fromReference:s=>s.applyMatrix3(Sc).convertLinearToSRGB()}},gd=new Set([tn,va]),fe={enabled:!0,_workingColorSpace:tn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!gd.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,t,e){if(this.enabled===!1||t===e||!t||!e)return s;const i=Ls[t].toReference,n=Ls[e].fromReference;return n(i(s))},fromWorkingColorSpace:function(s,t){return this.convert(s,this._workingColorSpace,t)},toWorkingColorSpace:function(s,t){return this.convert(s,t,this._workingColorSpace)},getPrimaries:function(s){return Ls[s].primaries},getTransfer:function(s){return s===Ri?aa:Ls[s].transfer},getLuminanceCoefficients:function(s,t=this._workingColorSpace){return s.fromArray(Ls[t].luminanceCoefficients)}};function gs(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Ia(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Xn;class _d{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Xn===void 0&&(Xn=ha("canvas")),Xn.width=t.width,Xn.height=t.height;const i=Xn.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Xn}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=ha("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const n=i.getImageData(0,0,t.width,t.height),r=n.data;for(let a=0;a<r.length;a++)r[a]=gs(r[a]/255)*255;return i.putImageData(n,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(gs(e[i]/255)*255):e[i]=gs(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let vd=0;class Lf{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:vd++}),this.uuid=ji(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},n=this.data;if(n!==null){let r;if(Array.isArray(n)){r=[];for(let a=0,o=n.length;a<o;a++)n[a].isDataTexture?r.push(La(n[a].image)):r.push(La(n[a]))}else r=La(n);i.url=r}return e||(t.images[this.uuid]=i),i}}function La(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?_d.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let xd=0;class Ze extends Es{constructor(t=Ze.DEFAULT_IMAGE,e=Ze.DEFAULT_MAPPING,i=Nn,n=Nn,r=vi,a=un,o=Pi,l=ki,c=Ze.DEFAULT_ANISOTROPY,h=Ri){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:xd++}),this.uuid=ji(),this.name="",this.source=new Lf(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=n,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Lt(0,0),this.repeat=new Lt(1,1),this.center=new Lt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Zt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Mf)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case er:t.x=t.x-Math.floor(t.x);break;case Nn:t.x=t.x<0?0:1;break;case Bo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case er:t.y=t.y-Math.floor(t.y);break;case Nn:t.y=t.y<0?0:1;break;case Bo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ze.DEFAULT_IMAGE=null;Ze.DEFAULT_MAPPING=Mf;Ze.DEFAULT_ANISOTROPY=1;class ge{constructor(t=0,e=0,i=0,n=1){ge.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=n}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,n){return this.x=t,this.y=e,this.z=i,this.w=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,n=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*n+a[12]*r,this.y=a[1]*e+a[5]*i+a[9]*n+a[13]*r,this.z=a[2]*e+a[6]*i+a[10]*n+a[14]*r,this.w=a[3]*e+a[7]*i+a[11]*n+a[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,n,r;const l=t.elements,c=l[0],h=l[4],f=l[8],u=l[1],m=l[5],g=l[9],_=l[2],p=l[6],d=l[10];if(Math.abs(h-u)<.01&&Math.abs(f-_)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+_)<.1&&Math.abs(g+p)<.1&&Math.abs(c+m+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(c+1)/2,b=(m+1)/2,P=(d+1)/2,T=(h+u)/4,E=(f+_)/4,C=(g+p)/4;return M>b&&M>P?M<.01?(i=0,n=.707106781,r=.707106781):(i=Math.sqrt(M),n=T/i,r=E/i):b>P?b<.01?(i=.707106781,n=0,r=.707106781):(n=Math.sqrt(b),i=T/n,r=C/n):P<.01?(i=.707106781,n=.707106781,r=0):(r=Math.sqrt(P),i=E/r,n=C/r),this.set(i,n,r,e),this}let x=Math.sqrt((p-g)*(p-g)+(f-_)*(f-_)+(u-h)*(u-h));return Math.abs(x)<.001&&(x=1),this.x=(p-g)/x,this.y=(f-_)/x,this.z=(u-h)/x,this.w=Math.acos((c+m+d-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Md extends Es{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ge(0,0,t,e),this.scissorTest=!1,this.viewport=new ge(0,0,t,e);const n={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:vi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const r=new Ze(n,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);r.flipY=!1,r.generateMipmaps=i.generateMipmaps,r.internalFormat=i.internalFormat,this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let n=0,r=this.textures.length;n<r;n++)this.textures[n].image.width=t,this.textures[n].image.height=e,this.textures[n].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,n=t.textures.length;i<n;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Lf(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Mi extends Md{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class Df extends Ze{constructor(t=null,e=1,i=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:n},this.magFilter=Ye,this.minFilter=Ye,this.wrapR=Nn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class yd extends Ze{constructor(t=null,e=1,i=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:n},this.magFilter=Ye,this.minFilter=Ye,this.wrapR=Nn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ai{constructor(t=0,e=0,i=0,n=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=n}static slerpFlat(t,e,i,n,r,a,o){let l=i[n+0],c=i[n+1],h=i[n+2],f=i[n+3];const u=r[a+0],m=r[a+1],g=r[a+2],_=r[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f;return}if(o===1){t[e+0]=u,t[e+1]=m,t[e+2]=g,t[e+3]=_;return}if(f!==_||l!==u||c!==m||h!==g){let p=1-o;const d=l*u+c*m+h*g+f*_,x=d>=0?1:-1,M=1-d*d;if(M>Number.EPSILON){const P=Math.sqrt(M),T=Math.atan2(P,d*x);p=Math.sin(p*T)/P,o=Math.sin(o*T)/P}const b=o*x;if(l=l*p+u*b,c=c*p+m*b,h=h*p+g*b,f=f*p+_*b,p===1-o){const P=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=P,c*=P,h*=P,f*=P}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,n,r,a){const o=i[n],l=i[n+1],c=i[n+2],h=i[n+3],f=r[a],u=r[a+1],m=r[a+2],g=r[a+3];return t[e]=o*g+h*f+l*m-c*u,t[e+1]=l*g+h*u+c*f-o*m,t[e+2]=c*g+h*m+o*u-l*f,t[e+3]=h*g-o*f-l*u-c*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,n){return this._x=t,this._y=e,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,n=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(n/2),f=o(r/2),u=l(i/2),m=l(n/2),g=l(r/2);switch(a){case"XYZ":this._x=u*h*f+c*m*g,this._y=c*m*f-u*h*g,this._z=c*h*g+u*m*f,this._w=c*h*f-u*m*g;break;case"YXZ":this._x=u*h*f+c*m*g,this._y=c*m*f-u*h*g,this._z=c*h*g-u*m*f,this._w=c*h*f+u*m*g;break;case"ZXY":this._x=u*h*f-c*m*g,this._y=c*m*f+u*h*g,this._z=c*h*g+u*m*f,this._w=c*h*f-u*m*g;break;case"ZYX":this._x=u*h*f-c*m*g,this._y=c*m*f+u*h*g,this._z=c*h*g-u*m*f,this._w=c*h*f+u*m*g;break;case"YZX":this._x=u*h*f+c*m*g,this._y=c*m*f+u*h*g,this._z=c*h*g-u*m*f,this._w=c*h*f-u*m*g;break;case"XZY":this._x=u*h*f-c*m*g,this._y=c*m*f-u*h*g,this._z=c*h*g+u*m*f,this._w=c*h*f+u*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,n=Math.sin(i);return this._x=t.x*n,this._y=t.y*n,this._z=t.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],n=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],f=e[10],u=i+o+f;if(u>0){const m=.5/Math.sqrt(u+1);this._w=.25/m,this._x=(h-l)*m,this._y=(r-c)*m,this._z=(a-n)*m}else if(i>o&&i>f){const m=2*Math.sqrt(1+i-o-f);this._w=(h-l)/m,this._x=.25*m,this._y=(n+a)/m,this._z=(r+c)/m}else if(o>f){const m=2*Math.sqrt(1+o-i-f);this._w=(r-c)/m,this._x=(n+a)/m,this._y=.25*m,this._z=(l+h)/m}else{const m=2*Math.sqrt(1+f-i-o);this._w=(a-n)/m,this._x=(r+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(qe(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const n=Math.min(1,e/i);return this.slerp(t,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,n=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+a*o+n*c-r*l,this._y=n*h+a*l+r*o-i*c,this._z=r*h+a*c+i*l-n*o,this._w=a*h-i*o-n*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,n=this._y,r=this._z,a=this._w;let o=a*t._w+i*t._x+n*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=i,this._y=n,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-e;return this._w=m*a+e*this._w,this._x=m*i+e*this._x,this._y=m*n+e*this._y,this._z=m*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),f=Math.sin((1-e)*h)/c,u=Math.sin(e*h)/c;return this._w=a*f+this._w*u,this._x=i*f+this._x*u,this._y=n*f+this._y*u,this._z=r*f+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),n=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(n*Math.sin(t),n*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class R{constructor(t=0,e=0,i=0){R.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Tc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Tc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,n=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*n,this.y=r[1]*e+r[4]*i+r[7]*n,this.z=r[2]*e+r[5]*i+r[8]*n,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,n=this.z,r=t.elements,a=1/(r[3]*e+r[7]*i+r[11]*n+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*n+r[12])*a,this.y=(r[1]*e+r[5]*i+r[9]*n+r[13])*a,this.z=(r[2]*e+r[6]*i+r[10]*n+r[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,n=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*n-o*i),h=2*(o*e-r*n),f=2*(r*i-a*e);return this.x=e+l*c+a*f-o*h,this.y=i+l*h+o*c-r*f,this.z=n+l*f+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,n=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*n,this.y=r[1]*e+r[5]*i+r[9]*n,this.z=r[2]*e+r[6]*i+r[10]*n,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,n=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=n*l-r*o,this.y=r*a-i*l,this.z=i*o-n*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Da.copy(this).projectOnVector(t),this.sub(Da)}reflect(t){return this.sub(Da.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(qe(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,n=this.z-t.z;return e*e+i*i+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const n=Math.sin(e)*t;return this.x=n*Math.sin(i),this.y=Math.cos(e)*t,this.z=n*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),n=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=n,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Da=new R,Tc=new ai;class Gn{constructor(t=new R(1/0,1/0,1/0),e=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Ti.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Ti.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=Ti.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Ti):Ti.fromBufferAttribute(r,a),Ti.applyMatrix4(t.matrixWorld),this.expandByPoint(Ti);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),cr.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),cr.copy(i.boundingBox)),cr.applyMatrix4(t.matrixWorld),this.union(cr)}const n=t.children;for(let r=0,a=n.length;r<a;r++)this.expandByObject(n[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Ti),Ti.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ds),hr.subVectors(this.max,Ds),qn.subVectors(t.a,Ds),Yn.subVectors(t.b,Ds),Kn.subVectors(t.c,Ds),nn.subVectors(Yn,qn),sn.subVectors(Kn,Yn),xn.subVectors(qn,Kn);let e=[0,-nn.z,nn.y,0,-sn.z,sn.y,0,-xn.z,xn.y,nn.z,0,-nn.x,sn.z,0,-sn.x,xn.z,0,-xn.x,-nn.y,nn.x,0,-sn.y,sn.x,0,-xn.y,xn.x,0];return!Ua(e,qn,Yn,Kn,hr)||(e=[1,0,0,0,1,0,0,0,1],!Ua(e,qn,Yn,Kn,hr))?!1:(fr.crossVectors(nn,sn),e=[fr.x,fr.y,fr.z],Ua(e,qn,Yn,Kn,hr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Ti).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Ti).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Oi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Oi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Oi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Oi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Oi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Oi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Oi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Oi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Oi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Oi=[new R,new R,new R,new R,new R,new R,new R,new R],Ti=new R,cr=new Gn,qn=new R,Yn=new R,Kn=new R,nn=new R,sn=new R,xn=new R,Ds=new R,hr=new R,fr=new R,Mn=new R;function Ua(s,t,e,i,n){for(let r=0,a=s.length-3;r<=a;r+=3){Mn.fromArray(s,r);const o=n.x*Math.abs(Mn.x)+n.y*Math.abs(Mn.y)+n.z*Math.abs(Mn.z),l=t.dot(Mn),c=e.dot(Mn),h=i.dot(Mn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const bd=new Gn,Us=new R,Na=new R;class As{constructor(t=new R,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):bd.setFromPoints(t).getCenter(i);let n=0;for(let r=0,a=t.length;r<a;r++)n=Math.max(n,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(n),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Us.subVectors(t,this.center);const e=Us.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),n=(i-this.radius)*.5;this.center.addScaledVector(Us,n/i),this.radius+=n}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Na.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Us.copy(t.center).add(Na)),this.expandByPoint(Us.copy(t.center).sub(Na))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const zi=new R,ka=new R,ur=new R,rn=new R,Fa=new R,dr=new R,Oa=new R;class Sd{constructor(t=new R,e=new R(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,zi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=zi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(zi.copy(this.origin).addScaledVector(this.direction,e),zi.distanceToSquared(t))}distanceSqToSegment(t,e,i,n){ka.copy(t).add(e).multiplyScalar(.5),ur.copy(e).sub(t).normalize(),rn.copy(this.origin).sub(ka);const r=t.distanceTo(e)*.5,a=-this.direction.dot(ur),o=rn.dot(this.direction),l=-rn.dot(ur),c=rn.lengthSq(),h=Math.abs(1-a*a);let f,u,m,g;if(h>0)if(f=a*l-o,u=a*o-l,g=r*h,f>=0)if(u>=-g)if(u<=g){const _=1/h;f*=_,u*=_,m=f*(f+a*u+2*o)+u*(a*f+u+2*l)+c}else u=r,f=Math.max(0,-(a*u+o)),m=-f*f+u*(u+2*l)+c;else u=-r,f=Math.max(0,-(a*u+o)),m=-f*f+u*(u+2*l)+c;else u<=-g?(f=Math.max(0,-(-a*r+o)),u=f>0?-r:Math.min(Math.max(-r,-l),r),m=-f*f+u*(u+2*l)+c):u<=g?(f=0,u=Math.min(Math.max(-r,-l),r),m=u*(u+2*l)+c):(f=Math.max(0,-(a*r+o)),u=f>0?r:Math.min(Math.max(-r,-l),r),m=-f*f+u*(u+2*l)+c);else u=a>0?-r:r,f=Math.max(0,-(a*u+o)),m=-f*f+u*(u+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),n&&n.copy(ka).addScaledVector(ur,u),m}intersectSphere(t,e){zi.subVectors(t.center,this.origin);const i=zi.dot(this.direction),n=zi.dot(zi)-i*i,r=t.radius*t.radius;if(n>r)return null;const a=Math.sqrt(r-n),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,n,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return c>=0?(i=(t.min.x-u.x)*c,n=(t.max.x-u.x)*c):(i=(t.max.x-u.x)*c,n=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),i>a||r>n||((r>i||isNaN(i))&&(i=r),(a<n||isNaN(n))&&(n=a),f>=0?(o=(t.min.z-u.z)*f,l=(t.max.z-u.z)*f):(o=(t.max.z-u.z)*f,l=(t.min.z-u.z)*f),i>l||o>n)||((o>i||i!==i)&&(i=o),(l<n||n!==n)&&(n=l),n<0)?null:this.at(i>=0?i:n,e)}intersectsBox(t){return this.intersectBox(t,zi)!==null}intersectTriangle(t,e,i,n,r){Fa.subVectors(e,t),dr.subVectors(i,t),Oa.crossVectors(Fa,dr);let a=this.direction.dot(Oa),o;if(a>0){if(n)return null;o=1}else if(a<0)o=-1,a=-a;else return null;rn.subVectors(this.origin,t);const l=o*this.direction.dot(dr.crossVectors(rn,dr));if(l<0)return null;const c=o*this.direction.dot(Fa.cross(rn));if(c<0||l+c>a)return null;const h=-o*rn.dot(Oa);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class te{constructor(t,e,i,n,r,a,o,l,c,h,f,u,m,g,_,p){te.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,n,r,a,o,l,c,h,f,u,m,g,_,p)}set(t,e,i,n,r,a,o,l,c,h,f,u,m,g,_,p){const d=this.elements;return d[0]=t,d[4]=e,d[8]=i,d[12]=n,d[1]=r,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=h,d[10]=f,d[14]=u,d[3]=m,d[7]=g,d[11]=_,d[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new te().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,n=1/$n.setFromMatrixColumn(t,0).length(),r=1/$n.setFromMatrixColumn(t,1).length(),a=1/$n.setFromMatrixColumn(t,2).length();return e[0]=i[0]*n,e[1]=i[1]*n,e[2]=i[2]*n,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,n=t.y,r=t.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(n),c=Math.sin(n),h=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){const u=a*h,m=a*f,g=o*h,_=o*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=m+g*c,e[5]=u-_*c,e[9]=-o*l,e[2]=_-u*c,e[6]=g+m*c,e[10]=a*l}else if(t.order==="YXZ"){const u=l*h,m=l*f,g=c*h,_=c*f;e[0]=u+_*o,e[4]=g*o-m,e[8]=a*c,e[1]=a*f,e[5]=a*h,e[9]=-o,e[2]=m*o-g,e[6]=_+u*o,e[10]=a*l}else if(t.order==="ZXY"){const u=l*h,m=l*f,g=c*h,_=c*f;e[0]=u-_*o,e[4]=-a*f,e[8]=g+m*o,e[1]=m+g*o,e[5]=a*h,e[9]=_-u*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const u=a*h,m=a*f,g=o*h,_=o*f;e[0]=l*h,e[4]=g*c-m,e[8]=u*c+_,e[1]=l*f,e[5]=_*c+u,e[9]=m*c-g,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const u=a*l,m=a*c,g=o*l,_=o*c;e[0]=l*h,e[4]=_-u*f,e[8]=g*f+m,e[1]=f,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=m*f+g,e[10]=u-_*f}else if(t.order==="XZY"){const u=a*l,m=a*c,g=o*l,_=o*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=u*f+_,e[5]=a*h,e[9]=m*f-g,e[2]=g*f-m,e[6]=o*h,e[10]=_*f+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(wd,t,Td)}lookAt(t,e,i){const n=this.elements;return ci.subVectors(t,e),ci.lengthSq()===0&&(ci.z=1),ci.normalize(),an.crossVectors(i,ci),an.lengthSq()===0&&(Math.abs(i.z)===1?ci.x+=1e-4:ci.z+=1e-4,ci.normalize(),an.crossVectors(i,ci)),an.normalize(),pr.crossVectors(ci,an),n[0]=an.x,n[4]=pr.x,n[8]=ci.x,n[1]=an.y,n[5]=pr.y,n[9]=ci.y,n[2]=an.z,n[6]=pr.z,n[10]=ci.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,n=e.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],f=i[5],u=i[9],m=i[13],g=i[2],_=i[6],p=i[10],d=i[14],x=i[3],M=i[7],b=i[11],P=i[15],T=n[0],E=n[4],C=n[8],I=n[12],v=n[1],S=n[5],U=n[9],k=n[13],V=n[2],K=n[6],W=n[10],Q=n[14],X=n[3],dt=n[7],lt=n[11],gt=n[15];return r[0]=a*T+o*v+l*V+c*X,r[4]=a*E+o*S+l*K+c*dt,r[8]=a*C+o*U+l*W+c*lt,r[12]=a*I+o*k+l*Q+c*gt,r[1]=h*T+f*v+u*V+m*X,r[5]=h*E+f*S+u*K+m*dt,r[9]=h*C+f*U+u*W+m*lt,r[13]=h*I+f*k+u*Q+m*gt,r[2]=g*T+_*v+p*V+d*X,r[6]=g*E+_*S+p*K+d*dt,r[10]=g*C+_*U+p*W+d*lt,r[14]=g*I+_*k+p*Q+d*gt,r[3]=x*T+M*v+b*V+P*X,r[7]=x*E+M*S+b*K+P*dt,r[11]=x*C+M*U+b*W+P*lt,r[15]=x*I+M*k+b*Q+P*gt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],n=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],f=t[6],u=t[10],m=t[14],g=t[3],_=t[7],p=t[11],d=t[15];return g*(+r*l*f-n*c*f-r*o*u+i*c*u+n*o*m-i*l*m)+_*(+e*l*m-e*c*u+r*a*u-n*a*m+n*c*h-r*l*h)+p*(+e*c*f-e*o*m-r*a*f+i*a*m+r*o*h-i*c*h)+d*(-n*o*h-e*l*f+e*o*u+n*a*f-i*a*u+i*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const n=this.elements;return t.isVector3?(n[12]=t.x,n[13]=t.y,n[14]=t.z):(n[12]=t,n[13]=e,n[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],n=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],f=t[9],u=t[10],m=t[11],g=t[12],_=t[13],p=t[14],d=t[15],x=f*p*c-_*u*c+_*l*m-o*p*m-f*l*d+o*u*d,M=g*u*c-h*p*c-g*l*m+a*p*m+h*l*d-a*u*d,b=h*_*c-g*f*c+g*o*m-a*_*m-h*o*d+a*f*d,P=g*f*l-h*_*l-g*o*u+a*_*u+h*o*p-a*f*p,T=e*x+i*M+n*b+r*P;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/T;return t[0]=x*E,t[1]=(_*u*r-f*p*r-_*n*m+i*p*m+f*n*d-i*u*d)*E,t[2]=(o*p*r-_*l*r+_*n*c-i*p*c-o*n*d+i*l*d)*E,t[3]=(f*l*r-o*u*r-f*n*c+i*u*c+o*n*m-i*l*m)*E,t[4]=M*E,t[5]=(h*p*r-g*u*r+g*n*m-e*p*m-h*n*d+e*u*d)*E,t[6]=(g*l*r-a*p*r-g*n*c+e*p*c+a*n*d-e*l*d)*E,t[7]=(a*u*r-h*l*r+h*n*c-e*u*c-a*n*m+e*l*m)*E,t[8]=b*E,t[9]=(g*f*r-h*_*r-g*i*m+e*_*m+h*i*d-e*f*d)*E,t[10]=(a*_*r-g*o*r+g*i*c-e*_*c-a*i*d+e*o*d)*E,t[11]=(h*o*r-a*f*r-h*i*c+e*f*c+a*i*m-e*o*m)*E,t[12]=P*E,t[13]=(h*_*n-g*f*n+g*i*u-e*_*u-h*i*p+e*f*p)*E,t[14]=(g*o*n-a*_*n-g*i*l+e*_*l+a*i*p-e*o*p)*E,t[15]=(a*f*n-h*o*n+h*i*l-e*f*l-a*i*u+e*o*u)*E,this}scale(t){const e=this.elements,i=t.x,n=t.y,r=t.z;return e[0]*=i,e[4]*=n,e[8]*=r,e[1]*=i,e[5]*=n,e[9]*=r,e[2]*=i,e[6]*=n,e[10]*=r,e[3]*=i,e[7]*=n,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],n=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,n))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),n=Math.sin(e),r=1-i,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+i,c*o-n*l,c*l+n*o,0,c*o+n*l,h*o+i,h*l-n*a,0,c*l-n*o,h*l+n*a,r*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,n,r,a){return this.set(1,i,r,0,t,1,a,0,e,n,1,0,0,0,0,1),this}compose(t,e,i){const n=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,f=o+o,u=r*c,m=r*h,g=r*f,_=a*h,p=a*f,d=o*f,x=l*c,M=l*h,b=l*f,P=i.x,T=i.y,E=i.z;return n[0]=(1-(_+d))*P,n[1]=(m+b)*P,n[2]=(g-M)*P,n[3]=0,n[4]=(m-b)*T,n[5]=(1-(u+d))*T,n[6]=(p+x)*T,n[7]=0,n[8]=(g+M)*E,n[9]=(p-x)*E,n[10]=(1-(u+_))*E,n[11]=0,n[12]=t.x,n[13]=t.y,n[14]=t.z,n[15]=1,this}decompose(t,e,i){const n=this.elements;let r=$n.set(n[0],n[1],n[2]).length();const a=$n.set(n[4],n[5],n[6]).length(),o=$n.set(n[8],n[9],n[10]).length();this.determinant()<0&&(r=-r),t.x=n[12],t.y=n[13],t.z=n[14],Ei.copy(this);const c=1/r,h=1/a,f=1/o;return Ei.elements[0]*=c,Ei.elements[1]*=c,Ei.elements[2]*=c,Ei.elements[4]*=h,Ei.elements[5]*=h,Ei.elements[6]*=h,Ei.elements[8]*=f,Ei.elements[9]*=f,Ei.elements[10]*=f,e.setFromRotationMatrix(Ei),i.x=r,i.y=a,i.z=o,this}makePerspective(t,e,i,n,r,a,o=qi){const l=this.elements,c=2*r/(e-t),h=2*r/(i-n),f=(e+t)/(e-t),u=(i+n)/(i-n);let m,g;if(o===qi)m=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===ca)m=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,n,r,a,o=qi){const l=this.elements,c=1/(e-t),h=1/(i-n),f=1/(a-r),u=(e+t)*c,m=(i+n)*h;let g,_;if(o===qi)g=(a+r)*f,_=-2*f;else if(o===ca)g=r*f,_=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let n=0;n<16;n++)if(e[n]!==i[n])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const $n=new R,Ei=new te,wd=new R(0,0,0),Td=new R(1,1,1),an=new R,pr=new R,ci=new R,Ec=new te,Ac=new ai;class yi{constructor(t=0,e=0,i=0,n=yi.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=n}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,n=this._order){return this._x=t,this._y=e,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const n=t.elements,r=n[0],a=n[4],o=n[8],l=n[1],c=n[5],h=n[9],f=n[2],u=n[6],m=n[10];switch(e){case"XYZ":this._y=Math.asin(qe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-qe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(qe(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-qe(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(qe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-qe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Ec.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ec,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Ac.setFromEuler(this),this.setFromQuaternion(Ac,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}yi.DEFAULT_ORDER="XYZ";class Uf{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Ed=0;const Rc=new R,jn=new ai,Bi=new te,mr=new R,Ns=new R,Ad=new R,Rd=new ai,Cc=new R(1,0,0),Pc=new R(0,1,0),Ic=new R(0,0,1),Lc={type:"added"},Cd={type:"removed"},Zn={type:"childadded",child:null},za={type:"childremoved",child:null};class Fe extends Es{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ed++}),this.uuid=ji(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Fe.DEFAULT_UP.clone();const t=new R,e=new yi,i=new ai,n=new R(1,1,1);function r(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new te},normalMatrix:{value:new Zt}}),this.matrix=new te,this.matrixWorld=new te,this.matrixAutoUpdate=Fe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Fe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Uf,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return jn.setFromAxisAngle(t,e),this.quaternion.multiply(jn),this}rotateOnWorldAxis(t,e){return jn.setFromAxisAngle(t,e),this.quaternion.premultiply(jn),this}rotateX(t){return this.rotateOnAxis(Cc,t)}rotateY(t){return this.rotateOnAxis(Pc,t)}rotateZ(t){return this.rotateOnAxis(Ic,t)}translateOnAxis(t,e){return Rc.copy(t).applyQuaternion(this.quaternion),this.position.add(Rc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Cc,t)}translateY(t){return this.translateOnAxis(Pc,t)}translateZ(t){return this.translateOnAxis(Ic,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Bi.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?mr.copy(t):mr.set(t,e,i);const n=this.parent;this.updateWorldMatrix(!0,!1),Ns.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Bi.lookAt(Ns,mr,this.up):Bi.lookAt(mr,Ns,this.up),this.quaternion.setFromRotationMatrix(Bi),n&&(Bi.extractRotation(n.matrixWorld),jn.setFromRotationMatrix(Bi),this.quaternion.premultiply(jn.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Lc),Zn.child=t,this.dispatchEvent(Zn),Zn.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Cd),za.child=t,this.dispatchEvent(za),za.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Bi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Bi.multiply(t.parent.matrixWorld)),t.applyMatrix4(Bi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Lc),Zn.child=t,this.dispatchEvent(Zn),Zn.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,n=this.children.length;i<n;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const n=this.children;for(let r=0,a=n.length;r<a;r++)n[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ns,t,Ad),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ns,Rd,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const n=this.children;for(let r=0,a=n.length;r<a;r++)n[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const n={};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.castShadow===!0&&(n.castShadow=!0),this.receiveShadow===!0&&(n.receiveShadow=!0),this.visible===!1&&(n.visible=!1),this.frustumCulled===!1&&(n.frustumCulled=!1),this.renderOrder!==0&&(n.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(n.matrixAutoUpdate=!1),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.visibility=this._visibility,n.active=this._active,n.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),n.maxInstanceCount=this._maxInstanceCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.geometryCount=this._geometryCount,n.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(n.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(n.boundingSphere={center:n.boundingSphere.center.toArray(),radius:n.boundingSphere.radius}),this.boundingBox!==null&&(n.boundingBox={min:n.boundingBox.min.toArray(),max:n.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(n.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];r(t.shapes,f)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));n.material=o}else n.material=r(t.materials,this.material);if(this.children.length>0){n.children=[];for(let o=0;o<this.children.length;o++)n.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){n.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];n.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),f=a(t.shapes),u=a(t.skeletons),m=a(t.animations),g=a(t.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),u.length>0&&(i.skeletons=u),m.length>0&&(i.animations=m),g.length>0&&(i.nodes=g)}return i.object=n,i;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const n=t.children[i];this.add(n.clone())}return this}}Fe.DEFAULT_UP=new R(0,1,0);Fe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Fe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Ai=new R,Gi=new R,Ba=new R,Hi=new R,Jn=new R,Qn=new R,Dc=new R,Ga=new R,Ha=new R,Va=new R,Wa=new ge,Xa=new ge,qa=new ge;class xi{constructor(t=new R,e=new R,i=new R){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,n){n.subVectors(i,e),Ai.subVectors(t,e),n.cross(Ai);const r=n.lengthSq();return r>0?n.multiplyScalar(1/Math.sqrt(r)):n.set(0,0,0)}static getBarycoord(t,e,i,n,r){Ai.subVectors(n,e),Gi.subVectors(i,e),Ba.subVectors(t,e);const a=Ai.dot(Ai),o=Ai.dot(Gi),l=Ai.dot(Ba),c=Gi.dot(Gi),h=Gi.dot(Ba),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;const u=1/f,m=(c*l-o*h)*u,g=(a*h-o*l)*u;return r.set(1-m-g,g,m)}static containsPoint(t,e,i,n){return this.getBarycoord(t,e,i,n,Hi)===null?!1:Hi.x>=0&&Hi.y>=0&&Hi.x+Hi.y<=1}static getInterpolation(t,e,i,n,r,a,o,l){return this.getBarycoord(t,e,i,n,Hi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Hi.x),l.addScaledVector(a,Hi.y),l.addScaledVector(o,Hi.z),l)}static getInterpolatedAttribute(t,e,i,n,r,a){return Wa.setScalar(0),Xa.setScalar(0),qa.setScalar(0),Wa.fromBufferAttribute(t,e),Xa.fromBufferAttribute(t,i),qa.fromBufferAttribute(t,n),a.setScalar(0),a.addScaledVector(Wa,r.x),a.addScaledVector(Xa,r.y),a.addScaledVector(qa,r.z),a}static isFrontFacing(t,e,i,n){return Ai.subVectors(i,e),Gi.subVectors(t,e),Ai.cross(Gi).dot(n)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,n){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[n]),this}setFromAttributeAndIndices(t,e,i,n){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,n),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ai.subVectors(this.c,this.b),Gi.subVectors(this.a,this.b),Ai.cross(Gi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return xi.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return xi.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,n,r){return xi.getInterpolation(t,this.a,this.b,this.c,e,i,n,r)}containsPoint(t){return xi.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return xi.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,n=this.b,r=this.c;let a,o;Jn.subVectors(n,i),Qn.subVectors(r,i),Ga.subVectors(t,i);const l=Jn.dot(Ga),c=Qn.dot(Ga);if(l<=0&&c<=0)return e.copy(i);Ha.subVectors(t,n);const h=Jn.dot(Ha),f=Qn.dot(Ha);if(h>=0&&f<=h)return e.copy(n);const u=l*f-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(i).addScaledVector(Jn,a);Va.subVectors(t,r);const m=Jn.dot(Va),g=Qn.dot(Va);if(g>=0&&m<=g)return e.copy(r);const _=m*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),e.copy(i).addScaledVector(Qn,o);const p=h*g-m*f;if(p<=0&&f-h>=0&&m-g>=0)return Dc.subVectors(r,n),o=(f-h)/(f-h+(m-g)),e.copy(n).addScaledVector(Dc,o);const d=1/(p+_+u);return a=_*d,o=u*d,e.copy(i).addScaledVector(Jn,a).addScaledVector(Qn,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Nf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},on={h:0,s:0,l:0},gr={h:0,s:0,l:0};function Ya(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class pt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const n=t;n&&n.isColor?this.copy(n):typeof n=="number"?this.setHex(n):typeof n=="string"&&this.setStyle(n)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=fi){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,fe.toWorkingColorSpace(this,e),this}setRGB(t,e,i,n=fe.workingColorSpace){return this.r=t,this.g=e,this.b=i,fe.toWorkingColorSpace(this,n),this}setHSL(t,e,i,n=fe.workingColorSpace){if(t=Il(t,1),e=qe(e,0,1),i=qe(i,0,1),e===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+e):i+e-i*e,a=2*i-r;this.r=Ya(a,r,t+1/3),this.g=Ya(a,r,t),this.b=Ya(a,r,t-1/3)}return fe.toWorkingColorSpace(this,n),this}setStyle(t,e=fi){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let n;if(n=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=n[1],o=n[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=n[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=fi){const i=Nf[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=gs(t.r),this.g=gs(t.g),this.b=gs(t.b),this}copyLinearToSRGB(t){return this.r=Ia(t.r),this.g=Ia(t.g),this.b=Ia(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=fi){return fe.fromWorkingColorSpace($e.copy(this),t),Math.round(qe($e.r*255,0,255))*65536+Math.round(qe($e.g*255,0,255))*256+Math.round(qe($e.b*255,0,255))}getHexString(t=fi){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=fe.workingColorSpace){fe.fromWorkingColorSpace($e.copy(this),e);const i=$e.r,n=$e.g,r=$e.b,a=Math.max(i,n,r),o=Math.min(i,n,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=h<=.5?f/(a+o):f/(2-a-o),a){case i:l=(n-r)/f+(n<r?6:0);break;case n:l=(r-i)/f+2;break;case r:l=(i-n)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=fe.workingColorSpace){return fe.fromWorkingColorSpace($e.copy(this),e),t.r=$e.r,t.g=$e.g,t.b=$e.b,t}getStyle(t=fi){fe.fromWorkingColorSpace($e.copy(this),t);const e=$e.r,i=$e.g,n=$e.b;return t!==fi?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(n*255)})`}offsetHSL(t,e,i){return this.getHSL(on),this.setHSL(on.h+t,on.s+e,on.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(on),t.getHSL(gr);const i=Zs(on.h,gr.h,e),n=Zs(on.s,gr.s,e),r=Zs(on.l,gr.l,e);return this.setHSL(i,n,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,n=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*n,this.g=r[1]*e+r[4]*i+r[7]*n,this.b=r[2]*e+r[5]*i+r[8]*n,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const $e=new pt;pt.NAMES=Nf;let Pd=0;class Hn extends Es{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Pd++}),this.uuid=ji(),this.name="",this.type="Material",this.blending=Fn,this.side=Qi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Co,this.blendDst=Po,this.blendEquation=Pn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new pt(0,0,0),this.blendAlpha=0,this.depthFunc=xs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=xc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Wn,this.stencilZFail=Wn,this.stencilZPass=Wn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const n=this[e];if(n===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}n&&n.isColor?n.set(i):n&&n.isVector3&&i&&i.isVector3?n.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Fn&&(i.blending=this.blending),this.side!==Qi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Co&&(i.blendSrc=this.blendSrc),this.blendDst!==Po&&(i.blendDst=this.blendDst),this.blendEquation!==Pn&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==xs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==xc&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Wn&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Wn&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Wn&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function n(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=n(t.textures),a=n(t.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const n=e.length;i=new Array(n);for(let r=0;r!==n;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class oe extends Hn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new pt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yi,this.combine=pf,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Le=new R,_r=new Lt;class Pe{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=dl,this.updateRanges=[],this.gpuType=Ui,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let n=0,r=this.itemSize;n<r;n++)this.array[t+n]=e.array[i+n];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)_r.fromBufferAttribute(this,e),_r.applyMatrix3(t),this.setXY(e,_r.x,_r.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Le.fromBufferAttribute(this,e),Le.applyMatrix3(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Le.fromBufferAttribute(this,e),Le.applyMatrix4(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Le.fromBufferAttribute(this,e),Le.applyNormalMatrix(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Le.fromBufferAttribute(this,e),Le.transformDirection(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Ci(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=me(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ci(e,this.array)),e}setX(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ci(e,this.array)),e}setY(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ci(e,this.array)),e}setZ(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ci(e,this.array)),e}setW(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=me(e,this.array),i=me(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,n){return t*=this.itemSize,this.normalized&&(e=me(e,this.array),i=me(i,this.array),n=me(n,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=n,this}setXYZW(t,e,i,n,r){return t*=this.itemSize,this.normalized&&(e=me(e,this.array),i=me(i,this.array),n=me(n,this.array),r=me(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=n,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==dl&&(t.usage=this.usage),t}}class kf extends Pe{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Ff extends Pe{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Me extends Pe{constructor(t,e,i){super(new Float32Array(t),e,i)}}let Id=0;const mi=new te,Ka=new Fe,ts=new R,hi=new Gn,ks=new Gn,Be=new R;class He extends Es{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Id++}),this.uuid=ji(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(If(t)?Ff:kf)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Zt().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}const n=this.attributes.tangent;return n!==void 0&&(n.transformDirection(t),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return mi.makeRotationFromQuaternion(t),this.applyMatrix4(mi),this}rotateX(t){return mi.makeRotationX(t),this.applyMatrix4(mi),this}rotateY(t){return mi.makeRotationY(t),this.applyMatrix4(mi),this}rotateZ(t){return mi.makeRotationZ(t),this.applyMatrix4(mi),this}translate(t,e,i){return mi.makeTranslation(t,e,i),this.applyMatrix4(mi),this}scale(t,e,i){return mi.makeScale(t,e,i),this.applyMatrix4(mi),this}lookAt(t){return Ka.lookAt(t),Ka.updateMatrix(),this.applyMatrix4(Ka.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ts).negate(),this.translate(ts.x,ts.y,ts.z),this}setFromPoints(t){const e=[];for(let i=0,n=t.length;i<n;i++){const r=t[i];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new Me(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Gn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,n=e.length;i<n;i++){const r=e[i];hi.setFromBufferAttribute(r),this.morphTargetsRelative?(Be.addVectors(this.boundingBox.min,hi.min),this.boundingBox.expandByPoint(Be),Be.addVectors(this.boundingBox.max,hi.max),this.boundingBox.expandByPoint(Be)):(this.boundingBox.expandByPoint(hi.min),this.boundingBox.expandByPoint(hi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new As);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(t){const i=this.boundingSphere.center;if(hi.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];ks.setFromBufferAttribute(o),this.morphTargetsRelative?(Be.addVectors(hi.min,ks.min),hi.expandByPoint(Be),Be.addVectors(hi.max,ks.max),hi.expandByPoint(Be)):(hi.expandByPoint(ks.min),hi.expandByPoint(ks.max))}hi.getCenter(i);let n=0;for(let r=0,a=t.count;r<a;r++)Be.fromBufferAttribute(t,r),n=Math.max(n,i.distanceToSquared(Be));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Be.fromBufferAttribute(o,c),l&&(ts.fromBufferAttribute(t,c),Be.add(ts)),n=Math.max(n,i.distanceToSquared(Be))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,n=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Pe(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let C=0;C<i.count;C++)o[C]=new R,l[C]=new R;const c=new R,h=new R,f=new R,u=new Lt,m=new Lt,g=new Lt,_=new R,p=new R;function d(C,I,v){c.fromBufferAttribute(i,C),h.fromBufferAttribute(i,I),f.fromBufferAttribute(i,v),u.fromBufferAttribute(r,C),m.fromBufferAttribute(r,I),g.fromBufferAttribute(r,v),h.sub(c),f.sub(c),m.sub(u),g.sub(u);const S=1/(m.x*g.y-g.x*m.y);isFinite(S)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(f,-m.y).multiplyScalar(S),p.copy(f).multiplyScalar(m.x).addScaledVector(h,-g.x).multiplyScalar(S),o[C].add(_),o[I].add(_),o[v].add(_),l[C].add(p),l[I].add(p),l[v].add(p))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let C=0,I=x.length;C<I;++C){const v=x[C],S=v.start,U=v.count;for(let k=S,V=S+U;k<V;k+=3)d(t.getX(k+0),t.getX(k+1),t.getX(k+2))}const M=new R,b=new R,P=new R,T=new R;function E(C){P.fromBufferAttribute(n,C),T.copy(P);const I=o[C];M.copy(I),M.sub(P.multiplyScalar(P.dot(I))).normalize(),b.crossVectors(T,I);const S=b.dot(l[C])<0?-1:1;a.setXYZW(C,M.x,M.y,M.z,S)}for(let C=0,I=x.length;C<I;++C){const v=x[C],S=v.start,U=v.count;for(let k=S,V=S+U;k<V;k+=3)E(t.getX(k+0)),E(t.getX(k+1)),E(t.getX(k+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Pe(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let u=0,m=i.count;u<m;u++)i.setXYZ(u,0,0,0);const n=new R,r=new R,a=new R,o=new R,l=new R,c=new R,h=new R,f=new R;if(t)for(let u=0,m=t.count;u<m;u+=3){const g=t.getX(u+0),_=t.getX(u+1),p=t.getX(u+2);n.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,p),h.subVectors(a,r),f.subVectors(n,r),h.cross(f),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,p),o.add(h),l.add(h),c.add(h),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(p,c.x,c.y,c.z)}else for(let u=0,m=e.count;u<m;u+=3)n.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,r),f.subVectors(n,r),h.cross(f),i.setXYZ(u+0,h.x,h.y,h.z),i.setXYZ(u+1,h.x,h.y,h.z),i.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Be.fromBufferAttribute(t,e),Be.normalize(),t.setXYZ(e,Be.x,Be.y,Be.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,f=o.normalized,u=new c.constructor(l.length*h);let m=0,g=0;for(let _=0,p=l.length;_<p;_++){o.isInterleavedBufferAttribute?m=l[_]*o.data.stride+o.offset:m=l[_]*h;for(let d=0;d<h;d++)u[g++]=c[m++]}return new Pe(u,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new He,i=this.index.array,n=this.attributes;for(const o in n){const l=n[o],c=t(l,i);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,f=c.length;h<f;h++){const u=c[h],m=t(u,i);l.push(m)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const n={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,u=c.length;f<u;f++){const m=c[f];h.push(m.toJSON(t.data))}h.length>0&&(n[l]=h,r=!0)}r&&(t.data.morphAttributes=n,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const n=t.attributes;for(const c in n){const h=n[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],f=r[c];for(let u=0,m=f.length;u<m;u++)h.push(f[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Uc=new te,yn=new Sd,vr=new As,Nc=new R,xr=new R,Mr=new R,yr=new R,$a=new R,br=new R,kc=new R,Sr=new R;class ft extends Fe{constructor(t=new He,e=new oe){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const n=e[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=n.length;r<a;r++){const o=n[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const i=this.geometry,n=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(n,t);const o=this.morphTargetInfluences;if(r&&o){br.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],f=r[l];h!==0&&($a.fromBufferAttribute(f,t),a?br.addScaledVector($a,h):br.addScaledVector($a.sub(e),h))}e.add(br)}return e}raycast(t,e){const i=this.geometry,n=this.material,r=this.matrixWorld;n!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),vr.copy(i.boundingSphere),vr.applyMatrix4(r),yn.copy(t.ray).recast(t.near),!(vr.containsPoint(yn.origin)===!1&&(yn.intersectSphere(vr,Nc)===null||yn.origin.distanceToSquared(Nc)>(t.far-t.near)**2))&&(Uc.copy(r).invert(),yn.copy(t.ray).applyMatrix4(Uc),!(i.boundingBox!==null&&yn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,yn)))}_computeIntersections(t,e,i){let n;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,u=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=u.length;g<_;g++){const p=u[g],d=a[p.materialIndex],x=Math.max(p.start,m.start),M=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let b=x,P=M;b<P;b+=3){const T=o.getX(b),E=o.getX(b+1),C=o.getX(b+2);n=wr(this,d,t,i,c,h,f,T,E,C),n&&(n.faceIndex=Math.floor(b/3),n.face.materialIndex=p.materialIndex,e.push(n))}}else{const g=Math.max(0,m.start),_=Math.min(o.count,m.start+m.count);for(let p=g,d=_;p<d;p+=3){const x=o.getX(p),M=o.getX(p+1),b=o.getX(p+2);n=wr(this,a,t,i,c,h,f,x,M,b),n&&(n.faceIndex=Math.floor(p/3),e.push(n))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=u.length;g<_;g++){const p=u[g],d=a[p.materialIndex],x=Math.max(p.start,m.start),M=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let b=x,P=M;b<P;b+=3){const T=b,E=b+1,C=b+2;n=wr(this,d,t,i,c,h,f,T,E,C),n&&(n.faceIndex=Math.floor(b/3),n.face.materialIndex=p.materialIndex,e.push(n))}}else{const g=Math.max(0,m.start),_=Math.min(l.count,m.start+m.count);for(let p=g,d=_;p<d;p+=3){const x=p,M=p+1,b=p+2;n=wr(this,a,t,i,c,h,f,x,M,b),n&&(n.faceIndex=Math.floor(p/3),e.push(n))}}}}function Ld(s,t,e,i,n,r,a,o){let l;if(t.side===je?l=i.intersectTriangle(a,r,n,!0,o):l=i.intersectTriangle(n,r,a,t.side===Qi,o),l===null)return null;Sr.copy(o),Sr.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(Sr);return c<e.near||c>e.far?null:{distance:c,point:Sr.clone(),object:s}}function wr(s,t,e,i,n,r,a,o,l,c){s.getVertexPosition(o,xr),s.getVertexPosition(l,Mr),s.getVertexPosition(c,yr);const h=Ld(s,t,e,i,xr,Mr,yr,kc);if(h){const f=new R;xi.getBarycoord(kc,xr,Mr,yr,f),n&&(h.uv=xi.getInterpolatedAttribute(n,o,l,c,f,new Lt)),r&&(h.uv1=xi.getInterpolatedAttribute(r,o,l,c,f,new Lt)),a&&(h.normal=xi.getInterpolatedAttribute(a,o,l,c,f,new R),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new R,materialIndex:0};xi.getNormal(xr,Mr,yr,u.normal),h.face=u,h.barycoord=f}return h}class It extends He{constructor(t=1,e=1,i=1,n=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:n,heightSegments:r,depthSegments:a};const o=this;n=Math.floor(n),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],f=[];let u=0,m=0;g("z","y","x",-1,-1,i,e,t,a,r,0),g("z","y","x",1,-1,i,e,-t,a,r,1),g("x","z","y",1,1,t,i,e,n,a,2),g("x","z","y",1,-1,t,i,-e,n,a,3),g("x","y","z",1,-1,t,e,i,n,r,4),g("x","y","z",-1,-1,t,e,-i,n,r,5),this.setIndex(l),this.setAttribute("position",new Me(c,3)),this.setAttribute("normal",new Me(h,3)),this.setAttribute("uv",new Me(f,2));function g(_,p,d,x,M,b,P,T,E,C,I){const v=b/E,S=P/C,U=b/2,k=P/2,V=T/2,K=E+1,W=C+1;let Q=0,X=0;const dt=new R;for(let lt=0;lt<W;lt++){const gt=lt*S-k;for(let Ft=0;Ft<K;Ft++){const st=Ft*v-U;dt[_]=st*x,dt[p]=gt*M,dt[d]=V,c.push(dt.x,dt.y,dt.z),dt[_]=0,dt[p]=0,dt[d]=T>0?1:-1,h.push(dt.x,dt.y,dt.z),f.push(Ft/E),f.push(1-lt/C),Q+=1}}for(let lt=0;lt<C;lt++)for(let gt=0;gt<E;gt++){const Ft=u+gt+K*lt,st=u+gt+K*(lt+1),H=u+(gt+1)+K*(lt+1),tt=u+(gt+1)+K*lt;l.push(Ft,st,tt),l.push(st,H,tt),X+=6}o.addGroup(m,X,I),m+=X,u+=Q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new It(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ws(s){const t={};for(const e in s){t[e]={};for(const i in s[e]){const n=s[e][i];n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)?n.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=n.clone():Array.isArray(n)?t[e][i]=n.slice():t[e][i]=n}}return t}function ti(s){const t={};for(let e=0;e<s.length;e++){const i=ws(s[e]);for(const n in i)t[n]=i[n]}return t}function Dd(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Of(s){const t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:fe.workingColorSpace}const Bn={clone:ws,merge:ti};var Ud=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Nd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ne extends Hn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ud,this.fragmentShader=Nd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ws(t.uniforms),this.uniformsGroups=Dd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const n in this.uniforms){const a=this.uniforms[n].value;a&&a.isTexture?e.uniforms[n]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[n]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[n]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[n]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[n]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[n]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[n]={type:"m4",value:a.toArray()}:e.uniforms[n]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const n in this.extensions)this.extensions[n]===!0&&(i[n]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class zf extends Fe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new te,this.projectionMatrix=new te,this.projectionMatrixInverse=new te,this.coordinateSystem=qi}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ln=new R,Fc=new Lt,Oc=new Lt;class ui extends zf{constructor(t=50,e=1,i=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=n,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=nr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(js*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return nr*2*Math.atan(Math.tan(js*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){ln.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ln.x,ln.y).multiplyScalar(-t/ln.z),ln.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ln.x,ln.y).multiplyScalar(-t/ln.z)}getViewSize(t,e){return this.getViewBounds(t,Fc,Oc),e.subVectors(Oc,Fc)}setViewOffset(t,e,i,n,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=n,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(js*.5*this.fov)/this.zoom,i=2*e,n=this.aspect*i,r=-.5*n;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*n/l,e-=a.offsetY*i/c,n*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+n,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const es=-90,is=1;class kd extends Fe{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const n=new ui(es,is,t,e);n.layers=this.layers,this.add(n);const r=new ui(es,is,t,e);r.layers=this.layers,this.add(r);const a=new ui(es,is,t,e);a.layers=this.layers,this.add(a);const o=new ui(es,is,t,e);o.layers=this.layers,this.add(o);const l=new ui(es,is,t,e);l.layers=this.layers,this.add(l);const c=new ui(es,is,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,n,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===qi)i.up.set(0,1,0),i.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===ca)i.up.set(0,-1,0),i.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:n}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,f=t.getRenderTarget(),u=t.getActiveCubeFace(),m=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,n),t.render(e,r),t.setRenderTarget(i,1,n),t.render(e,a),t.setRenderTarget(i,2,n),t.render(e,o),t.setRenderTarget(i,3,n),t.render(e,l),t.setRenderTarget(i,4,n),t.render(e,c),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,n),t.render(e,h),t.setRenderTarget(f,u,m),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Bf extends Ze{constructor(t,e,i,n,r,a,o,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Ms,super(t,e,i,n,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Fd extends Mi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},n=[i,i,i,i,i,i];this.texture=new Bf(n,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:vi}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},n=new It(5,5,5),r=new Ne({name:"CubemapFromEquirect",uniforms:ws(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:je,blending:$i});r.uniforms.tEquirect.value=e;const a=new ft(n,r),o=e.minFilter;return e.minFilter===un&&(e.minFilter=vi),new kd(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,i,n){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,n);t.setRenderTarget(r)}}const ja=new R,Od=new R,zd=new Zt;class Rn{constructor(t=new R(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,n){return this.normal.set(t,e,i),this.constant=n,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const n=ja.subVectors(i,e).cross(Od.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(n,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(ja),n=this.normal.dot(i);if(n===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/n;return r<0||r>1?null:e.copy(t.start).addScaledVector(i,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||zd.getNormalMatrix(t),n=this.coplanarPoint(ja).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-n.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const bn=new As,Tr=new R;class Ll{constructor(t=new Rn,e=new Rn,i=new Rn,n=new Rn,r=new Rn,a=new Rn){this.planes=[t,e,i,n,r,a]}set(t,e,i,n,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(n),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=qi){const i=this.planes,n=t.elements,r=n[0],a=n[1],o=n[2],l=n[3],c=n[4],h=n[5],f=n[6],u=n[7],m=n[8],g=n[9],_=n[10],p=n[11],d=n[12],x=n[13],M=n[14],b=n[15];if(i[0].setComponents(l-r,u-c,p-m,b-d).normalize(),i[1].setComponents(l+r,u+c,p+m,b+d).normalize(),i[2].setComponents(l+a,u+h,p+g,b+x).normalize(),i[3].setComponents(l-a,u-h,p-g,b-x).normalize(),i[4].setComponents(l-o,u-f,p-_,b-M).normalize(),e===qi)i[5].setComponents(l+o,u+f,p+_,b+M).normalize();else if(e===ca)i[5].setComponents(o,f,_,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),bn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),bn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(bn)}intersectsSprite(t){return bn.center.set(0,0,0),bn.radius=.7071067811865476,bn.applyMatrix4(t.matrixWorld),this.intersectsSphere(bn)}intersectsSphere(t){const e=this.planes,i=t.center,n=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<n)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const n=e[i];if(Tr.x=n.normal.x>0?t.max.x:t.min.x,Tr.y=n.normal.y>0?t.max.y:t.min.y,Tr.z=n.normal.z>0?t.max.z:t.min.z,n.distanceToPoint(Tr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Gf(){let s=null,t=!1,e=null,i=null;function n(r,a){e(r,a),i=s.requestAnimationFrame(n)}return{start:function(){t!==!0&&e!==null&&(i=s.requestAnimationFrame(n),t=!0)},stop:function(){s.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function Bd(s){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,f=c.byteLength,u=s.createBuffer();s.bindBuffer(l,u),s.bufferData(l,c,h),o.onUploadCallback();let m;if(c instanceof Float32Array)m=s.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=s.HALF_FLOAT:m=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=s.SHORT;else if(c instanceof Uint32Array)m=s.UNSIGNED_INT;else if(c instanceof Int32Array)m=s.INT;else if(c instanceof Int8Array)m=s.BYTE;else if(c instanceof Uint8Array)m=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,l,c){const h=l.array,f=l.updateRanges;if(s.bindBuffer(c,o),f.length===0)s.bufferSubData(c,0,h);else{f.sort((m,g)=>m.start-g.start);let u=0;for(let m=1;m<f.length;m++){const g=f[u],_=f[m];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++u,f[u]=_)}f.length=u+1;for(let m=0,g=f.length;m<g;m++){const _=f[m];s.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function n(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(s.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:n,remove:r,update:a}}class be extends He{constructor(t=1,e=1,i=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:n};const r=t/2,a=e/2,o=Math.floor(i),l=Math.floor(n),c=o+1,h=l+1,f=t/o,u=e/l,m=[],g=[],_=[],p=[];for(let d=0;d<h;d++){const x=d*u-a;for(let M=0;M<c;M++){const b=M*f-r;g.push(b,-x,0),_.push(0,0,1),p.push(M/o),p.push(1-d/l)}}for(let d=0;d<l;d++)for(let x=0;x<o;x++){const M=x+c*d,b=x+c*(d+1),P=x+1+c*(d+1),T=x+1+c*d;m.push(M,b,T),m.push(b,P,T)}this.setIndex(m),this.setAttribute("position",new Me(g,3)),this.setAttribute("normal",new Me(_,3)),this.setAttribute("uv",new Me(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new be(t.width,t.height,t.widthSegments,t.heightSegments)}}var Gd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Hd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Vd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Wd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Xd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,qd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Yd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Kd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,$d=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,jd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Zd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Jd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Qd=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,tp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ep=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,ip=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,np=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,sp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,rp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ap=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,op=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,lp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,cp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,hp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,fp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,up=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,dp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,pp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,mp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,gp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,_p="gl_FragColor = linearToOutputTexel( gl_FragColor );",vp=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,xp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Mp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,yp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,bp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Sp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,wp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Tp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ep=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Ap=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Rp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Cp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Pp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ip=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Lp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Dp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Up=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Np=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,kp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Fp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Op=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,zp=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Bp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Gp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Hp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Vp=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Wp=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Xp=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qp=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Yp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Kp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,$p=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,jp=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Zp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Jp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Qp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,t0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,e0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,i0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,n0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,s0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,r0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,a0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,o0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,l0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,c0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,h0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,f0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,u0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,d0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,p0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,m0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,g0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,_0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,v0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,x0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,M0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,y0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,b0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,S0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,w0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,T0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,E0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,A0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,R0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,C0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,P0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,I0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,L0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,D0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,U0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,N0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,k0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,F0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,O0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,z0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const B0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,G0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,H0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,V0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,W0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,X0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,q0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Y0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,K0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,$0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,j0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Z0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,J0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Q0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,tm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,em=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,im=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,nm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,rm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,am=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,om=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,lm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,cm=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hm=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,fm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,um=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,dm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,mm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,gm=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_m=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,vm=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,xm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,jt={alphahash_fragment:Gd,alphahash_pars_fragment:Hd,alphamap_fragment:Vd,alphamap_pars_fragment:Wd,alphatest_fragment:Xd,alphatest_pars_fragment:qd,aomap_fragment:Yd,aomap_pars_fragment:Kd,batching_pars_vertex:$d,batching_vertex:jd,begin_vertex:Zd,beginnormal_vertex:Jd,bsdfs:Qd,iridescence_fragment:tp,bumpmap_pars_fragment:ep,clipping_planes_fragment:ip,clipping_planes_pars_fragment:np,clipping_planes_pars_vertex:sp,clipping_planes_vertex:rp,color_fragment:ap,color_pars_fragment:op,color_pars_vertex:lp,color_vertex:cp,common:hp,cube_uv_reflection_fragment:fp,defaultnormal_vertex:up,displacementmap_pars_vertex:dp,displacementmap_vertex:pp,emissivemap_fragment:mp,emissivemap_pars_fragment:gp,colorspace_fragment:_p,colorspace_pars_fragment:vp,envmap_fragment:xp,envmap_common_pars_fragment:Mp,envmap_pars_fragment:yp,envmap_pars_vertex:bp,envmap_physical_pars_fragment:Dp,envmap_vertex:Sp,fog_vertex:wp,fog_pars_vertex:Tp,fog_fragment:Ep,fog_pars_fragment:Ap,gradientmap_pars_fragment:Rp,lightmap_pars_fragment:Cp,lights_lambert_fragment:Pp,lights_lambert_pars_fragment:Ip,lights_pars_begin:Lp,lights_toon_fragment:Up,lights_toon_pars_fragment:Np,lights_phong_fragment:kp,lights_phong_pars_fragment:Fp,lights_physical_fragment:Op,lights_physical_pars_fragment:zp,lights_fragment_begin:Bp,lights_fragment_maps:Gp,lights_fragment_end:Hp,logdepthbuf_fragment:Vp,logdepthbuf_pars_fragment:Wp,logdepthbuf_pars_vertex:Xp,logdepthbuf_vertex:qp,map_fragment:Yp,map_pars_fragment:Kp,map_particle_fragment:$p,map_particle_pars_fragment:jp,metalnessmap_fragment:Zp,metalnessmap_pars_fragment:Jp,morphinstance_vertex:Qp,morphcolor_vertex:t0,morphnormal_vertex:e0,morphtarget_pars_vertex:i0,morphtarget_vertex:n0,normal_fragment_begin:s0,normal_fragment_maps:r0,normal_pars_fragment:a0,normal_pars_vertex:o0,normal_vertex:l0,normalmap_pars_fragment:c0,clearcoat_normal_fragment_begin:h0,clearcoat_normal_fragment_maps:f0,clearcoat_pars_fragment:u0,iridescence_pars_fragment:d0,opaque_fragment:p0,packing:m0,premultiplied_alpha_fragment:g0,project_vertex:_0,dithering_fragment:v0,dithering_pars_fragment:x0,roughnessmap_fragment:M0,roughnessmap_pars_fragment:y0,shadowmap_pars_fragment:b0,shadowmap_pars_vertex:S0,shadowmap_vertex:w0,shadowmask_pars_fragment:T0,skinbase_vertex:E0,skinning_pars_vertex:A0,skinning_vertex:R0,skinnormal_vertex:C0,specularmap_fragment:P0,specularmap_pars_fragment:I0,tonemapping_fragment:L0,tonemapping_pars_fragment:D0,transmission_fragment:U0,transmission_pars_fragment:N0,uv_pars_fragment:k0,uv_pars_vertex:F0,uv_vertex:O0,worldpos_vertex:z0,background_vert:B0,background_frag:G0,backgroundCube_vert:H0,backgroundCube_frag:V0,cube_vert:W0,cube_frag:X0,depth_vert:q0,depth_frag:Y0,distanceRGBA_vert:K0,distanceRGBA_frag:$0,equirect_vert:j0,equirect_frag:Z0,linedashed_vert:J0,linedashed_frag:Q0,meshbasic_vert:tm,meshbasic_frag:em,meshlambert_vert:im,meshlambert_frag:nm,meshmatcap_vert:sm,meshmatcap_frag:rm,meshnormal_vert:am,meshnormal_frag:om,meshphong_vert:lm,meshphong_frag:cm,meshphysical_vert:hm,meshphysical_frag:fm,meshtoon_vert:um,meshtoon_frag:dm,points_vert:pm,points_frag:mm,shadow_vert:gm,shadow_frag:_m,sprite_vert:vm,sprite_frag:xm},mt={common:{diffuse:{value:new pt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Zt}},envmap:{envMap:{value:null},envMapRotation:{value:new Zt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Zt},normalScale:{value:new Lt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new pt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new pt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0},uvTransform:{value:new Zt}},sprite:{diffuse:{value:new pt(16777215)},opacity:{value:1},center:{value:new Lt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}}},Li={basic:{uniforms:ti([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.fog]),vertexShader:jt.meshbasic_vert,fragmentShader:jt.meshbasic_frag},lambert:{uniforms:ti([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,mt.lights,{emissive:{value:new pt(0)}}]),vertexShader:jt.meshlambert_vert,fragmentShader:jt.meshlambert_frag},phong:{uniforms:ti([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,mt.lights,{emissive:{value:new pt(0)},specular:{value:new pt(1118481)},shininess:{value:30}}]),vertexShader:jt.meshphong_vert,fragmentShader:jt.meshphong_frag},standard:{uniforms:ti([mt.common,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.roughnessmap,mt.metalnessmap,mt.fog,mt.lights,{emissive:{value:new pt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:jt.meshphysical_vert,fragmentShader:jt.meshphysical_frag},toon:{uniforms:ti([mt.common,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.gradientmap,mt.fog,mt.lights,{emissive:{value:new pt(0)}}]),vertexShader:jt.meshtoon_vert,fragmentShader:jt.meshtoon_frag},matcap:{uniforms:ti([mt.common,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,{matcap:{value:null}}]),vertexShader:jt.meshmatcap_vert,fragmentShader:jt.meshmatcap_frag},points:{uniforms:ti([mt.points,mt.fog]),vertexShader:jt.points_vert,fragmentShader:jt.points_frag},dashed:{uniforms:ti([mt.common,mt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:jt.linedashed_vert,fragmentShader:jt.linedashed_frag},depth:{uniforms:ti([mt.common,mt.displacementmap]),vertexShader:jt.depth_vert,fragmentShader:jt.depth_frag},normal:{uniforms:ti([mt.common,mt.bumpmap,mt.normalmap,mt.displacementmap,{opacity:{value:1}}]),vertexShader:jt.meshnormal_vert,fragmentShader:jt.meshnormal_frag},sprite:{uniforms:ti([mt.sprite,mt.fog]),vertexShader:jt.sprite_vert,fragmentShader:jt.sprite_frag},background:{uniforms:{uvTransform:{value:new Zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:jt.background_vert,fragmentShader:jt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Zt}},vertexShader:jt.backgroundCube_vert,fragmentShader:jt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:jt.cube_vert,fragmentShader:jt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:jt.equirect_vert,fragmentShader:jt.equirect_frag},distanceRGBA:{uniforms:ti([mt.common,mt.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:jt.distanceRGBA_vert,fragmentShader:jt.distanceRGBA_frag},shadow:{uniforms:ti([mt.lights,mt.fog,{color:{value:new pt(0)},opacity:{value:1}}]),vertexShader:jt.shadow_vert,fragmentShader:jt.shadow_frag}};Li.physical={uniforms:ti([Li.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Zt},clearcoatNormalScale:{value:new Lt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Zt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Zt},sheen:{value:0},sheenColor:{value:new pt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Zt},transmissionSamplerSize:{value:new Lt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Zt},attenuationDistance:{value:0},attenuationColor:{value:new pt(0)},specularColor:{value:new pt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Zt},anisotropyVector:{value:new Lt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Zt}}]),vertexShader:jt.meshphysical_vert,fragmentShader:jt.meshphysical_frag};const Er={r:0,b:0,g:0},Sn=new yi,Mm=new te;function ym(s,t,e,i,n,r,a){const o=new pt(0);let l=r===!0?0:1,c,h,f=null,u=0,m=null;function g(x){let M=x.isScene===!0?x.background:null;return M&&M.isTexture&&(M=(x.backgroundBlurriness>0?e:t).get(M)),M}function _(x){let M=!1;const b=g(x);b===null?d(o,l):b&&b.isColor&&(d(b,1),M=!0);const P=s.xr.getEnvironmentBlendMode();P==="additive"?i.buffers.color.setClear(0,0,0,1,a):P==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(s.autoClear||M)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function p(x,M){const b=g(M);b&&(b.isCubeTexture||b.mapping===ga)?(h===void 0&&(h=new ft(new It(1,1,1),new Ne({name:"BackgroundCubeMaterial",uniforms:ws(Li.backgroundCube.uniforms),vertexShader:Li.backgroundCube.vertexShader,fragmentShader:Li.backgroundCube.fragmentShader,side:je,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(P,T,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(h)),Sn.copy(M.backgroundRotation),Sn.x*=-1,Sn.y*=-1,Sn.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(Sn.y*=-1,Sn.z*=-1),h.material.uniforms.envMap.value=b,h.material.uniforms.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Mm.makeRotationFromEuler(Sn)),h.material.toneMapped=fe.getTransfer(b.colorSpace)!==xe,(f!==b||u!==b.version||m!==s.toneMapping)&&(h.material.needsUpdate=!0,f=b,u=b.version,m=s.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):b&&b.isTexture&&(c===void 0&&(c=new ft(new be(2,2),new Ne({name:"BackgroundMaterial",uniforms:ws(Li.background.uniforms),vertexShader:Li.background.vertexShader,fragmentShader:Li.background.fragmentShader,side:Qi,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=b,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=fe.getTransfer(b.colorSpace)!==xe,b.matrixAutoUpdate===!0&&b.updateMatrix(),c.material.uniforms.uvTransform.value.copy(b.matrix),(f!==b||u!==b.version||m!==s.toneMapping)&&(c.material.needsUpdate=!0,f=b,u=b.version,m=s.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function d(x,M){x.getRGB(Er,Of(s)),i.buffers.color.setClear(Er.r,Er.g,Er.b,M,a)}return{getClearColor:function(){return o},setClearColor:function(x,M=1){o.set(x),l=M,d(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(x){l=x,d(o,l)},render:_,addToRenderList:p}}function bm(s,t){const e=s.getParameter(s.MAX_VERTEX_ATTRIBS),i={},n=u(null);let r=n,a=!1;function o(v,S,U,k,V){let K=!1;const W=f(k,U,S);r!==W&&(r=W,c(r.object)),K=m(v,k,U,V),K&&g(v,k,U,V),V!==null&&t.update(V,s.ELEMENT_ARRAY_BUFFER),(K||a)&&(a=!1,b(v,S,U,k),V!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(V).buffer))}function l(){return s.createVertexArray()}function c(v){return s.bindVertexArray(v)}function h(v){return s.deleteVertexArray(v)}function f(v,S,U){const k=U.wireframe===!0;let V=i[v.id];V===void 0&&(V={},i[v.id]=V);let K=V[S.id];K===void 0&&(K={},V[S.id]=K);let W=K[k];return W===void 0&&(W=u(l()),K[k]=W),W}function u(v){const S=[],U=[],k=[];for(let V=0;V<e;V++)S[V]=0,U[V]=0,k[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:S,enabledAttributes:U,attributeDivisors:k,object:v,attributes:{},index:null}}function m(v,S,U,k){const V=r.attributes,K=S.attributes;let W=0;const Q=U.getAttributes();for(const X in Q)if(Q[X].location>=0){const lt=V[X];let gt=K[X];if(gt===void 0&&(X==="instanceMatrix"&&v.instanceMatrix&&(gt=v.instanceMatrix),X==="instanceColor"&&v.instanceColor&&(gt=v.instanceColor)),lt===void 0||lt.attribute!==gt||gt&&lt.data!==gt.data)return!0;W++}return r.attributesNum!==W||r.index!==k}function g(v,S,U,k){const V={},K=S.attributes;let W=0;const Q=U.getAttributes();for(const X in Q)if(Q[X].location>=0){let lt=K[X];lt===void 0&&(X==="instanceMatrix"&&v.instanceMatrix&&(lt=v.instanceMatrix),X==="instanceColor"&&v.instanceColor&&(lt=v.instanceColor));const gt={};gt.attribute=lt,lt&&lt.data&&(gt.data=lt.data),V[X]=gt,W++}r.attributes=V,r.attributesNum=W,r.index=k}function _(){const v=r.newAttributes;for(let S=0,U=v.length;S<U;S++)v[S]=0}function p(v){d(v,0)}function d(v,S){const U=r.newAttributes,k=r.enabledAttributes,V=r.attributeDivisors;U[v]=1,k[v]===0&&(s.enableVertexAttribArray(v),k[v]=1),V[v]!==S&&(s.vertexAttribDivisor(v,S),V[v]=S)}function x(){const v=r.newAttributes,S=r.enabledAttributes;for(let U=0,k=S.length;U<k;U++)S[U]!==v[U]&&(s.disableVertexAttribArray(U),S[U]=0)}function M(v,S,U,k,V,K,W){W===!0?s.vertexAttribIPointer(v,S,U,V,K):s.vertexAttribPointer(v,S,U,k,V,K)}function b(v,S,U,k){_();const V=k.attributes,K=U.getAttributes(),W=S.defaultAttributeValues;for(const Q in K){const X=K[Q];if(X.location>=0){let dt=V[Q];if(dt===void 0&&(Q==="instanceMatrix"&&v.instanceMatrix&&(dt=v.instanceMatrix),Q==="instanceColor"&&v.instanceColor&&(dt=v.instanceColor)),dt!==void 0){const lt=dt.normalized,gt=dt.itemSize,Ft=t.get(dt);if(Ft===void 0)continue;const st=Ft.buffer,H=Ft.type,tt=Ft.bytesPerElement,at=H===s.INT||H===s.UNSIGNED_INT||dt.gpuType===Sl;if(dt.isInterleavedBufferAttribute){const ut=dt.data,St=ut.stride,Mt=dt.offset;if(ut.isInstancedInterleavedBuffer){for(let Gt=0;Gt<X.locationSize;Gt++)d(X.location+Gt,ut.meshPerAttribute);v.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=ut.meshPerAttribute*ut.count)}else for(let Gt=0;Gt<X.locationSize;Gt++)p(X.location+Gt);s.bindBuffer(s.ARRAY_BUFFER,st);for(let Gt=0;Gt<X.locationSize;Gt++)M(X.location+Gt,gt/X.locationSize,H,lt,St*tt,(Mt+gt/X.locationSize*Gt)*tt,at)}else{if(dt.isInstancedBufferAttribute){for(let ut=0;ut<X.locationSize;ut++)d(X.location+ut,dt.meshPerAttribute);v.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=dt.meshPerAttribute*dt.count)}else for(let ut=0;ut<X.locationSize;ut++)p(X.location+ut);s.bindBuffer(s.ARRAY_BUFFER,st);for(let ut=0;ut<X.locationSize;ut++)M(X.location+ut,gt/X.locationSize,H,lt,gt*tt,gt/X.locationSize*ut*tt,at)}}else if(W!==void 0){const lt=W[Q];if(lt!==void 0)switch(lt.length){case 2:s.vertexAttrib2fv(X.location,lt);break;case 3:s.vertexAttrib3fv(X.location,lt);break;case 4:s.vertexAttrib4fv(X.location,lt);break;default:s.vertexAttrib1fv(X.location,lt)}}}}x()}function P(){C();for(const v in i){const S=i[v];for(const U in S){const k=S[U];for(const V in k)h(k[V].object),delete k[V];delete S[U]}delete i[v]}}function T(v){if(i[v.id]===void 0)return;const S=i[v.id];for(const U in S){const k=S[U];for(const V in k)h(k[V].object),delete k[V];delete S[U]}delete i[v.id]}function E(v){for(const S in i){const U=i[S];if(U[v.id]===void 0)continue;const k=U[v.id];for(const V in k)h(k[V].object),delete k[V];delete U[v.id]}}function C(){I(),a=!0,r!==n&&(r=n,c(r.object))}function I(){n.geometry=null,n.program=null,n.wireframe=!1}return{setup:o,reset:C,resetDefaultState:I,dispose:P,releaseStatesOfGeometry:T,releaseStatesOfProgram:E,initAttributes:_,enableAttribute:p,disableUnusedAttributes:x}}function Sm(s,t,e){let i;function n(c){i=c}function r(c,h){s.drawArrays(i,c,h),e.update(h,i,1)}function a(c,h,f){f!==0&&(s.drawArraysInstanced(i,c,h,f),e.update(h,i,f))}function o(c,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,f);let m=0;for(let g=0;g<f;g++)m+=h[g];e.update(m,i,1)}function l(c,h,f,u){if(f===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<c.length;g++)a(c[g],h[g],u[g]);else{m.multiDrawArraysInstancedWEBGL(i,c,0,h,0,u,0,f);let g=0;for(let _=0;_<f;_++)g+=h[_];for(let _=0;_<u.length;_++)e.update(g,i,u[_])}}this.setMode=n,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function wm(s,t,e,i){let n;function r(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");n=s.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function a(E){return!(E!==Pi&&i.convert(E)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(E){const C=E===Ni&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==ki&&i.convert(E)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==Ui&&!C)}function l(E){if(E==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=e.logarithmicDepthBuffer===!0,u=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control");if(u===!0){const E=t.get("EXT_clip_control");E.clipControlEXT(E.LOWER_LEFT_EXT,E.ZERO_TO_ONE_EXT)}const m=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=s.getParameter(s.MAX_TEXTURE_SIZE),p=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),d=s.getParameter(s.MAX_VERTEX_ATTRIBS),x=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),M=s.getParameter(s.MAX_VARYING_VECTORS),b=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),P=g>0,T=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reverseDepthBuffer:u,maxTextures:m,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:p,maxAttributes:d,maxVertexUniforms:x,maxVaryings:M,maxFragmentUniforms:b,vertexTextures:P,maxSamples:T}}function Tm(s){const t=this;let e=null,i=0,n=!1,r=!1;const a=new Rn,o=new Zt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){const m=f.length!==0||u||i!==0||n;return n=u,i=f.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,u){e=h(f,u,0)},this.setState=function(f,u,m){const g=f.clippingPlanes,_=f.clipIntersection,p=f.clipShadows,d=s.get(f);if(!n||g===null||g.length===0||r&&!p)r?h(null):c();else{const x=r?0:i,M=x*4;let b=d.clippingState||null;l.value=b,b=h(g,u,M,m);for(let P=0;P!==M;++P)b[P]=e[P];d.clippingState=b,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(f,u,m,g){const _=f!==null?f.length:0;let p=null;if(_!==0){if(p=l.value,g!==!0||p===null){const d=m+_*4,x=u.matrixWorldInverse;o.getNormalMatrix(x),(p===null||p.length<d)&&(p=new Float32Array(d));for(let M=0,b=m;M!==_;++M,b+=4)a.copy(f[M]).applyMatrix4(x,o),a.normal.toArray(p,b),p[b+3]=a.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,p}}function Em(s){let t=new WeakMap;function e(a,o){return o===Oo?a.mapping=Ms:o===zo&&(a.mapping=ys),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===Oo||o===zo)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Fd(l.height);return c.fromEquirectangularTexture(s,a),t.set(a,c),a.addEventListener("dispose",n),e(c.texture,a.mapping)}else return null}}return a}function n(a){const o=a.target;o.removeEventListener("dispose",n);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:i,dispose:r}}class Dl extends zf{constructor(t=-1,e=1,i=1,n=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=n,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,n,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=n,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,n=(this.top+this.bottom)/2;let r=i-t,a=i+t,o=n+e,l=n-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const ps=4,zc=[.125,.215,.35,.446,.526,.582],In=20,Za=new Dl,Bc=new pt;let Ja=null,Qa=0,to=0,eo=!1;const Cn=(1+Math.sqrt(5))/2,ns=1/Cn,Gc=[new R(-Cn,ns,0),new R(Cn,ns,0),new R(-ns,0,Cn),new R(ns,0,Cn),new R(0,Cn,-ns),new R(0,Cn,ns),new R(-1,1,-1),new R(1,1,-1),new R(-1,1,1),new R(1,1,1)];class Hc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,n=100){Ja=this._renderer.getRenderTarget(),Qa=this._renderer.getActiveCubeFace(),to=this._renderer.getActiveMipmapLevel(),eo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,i,n,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Xc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Wc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ja,Qa,to),this._renderer.xr.enabled=eo,t.scissorTest=!1,Ar(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ms||t.mapping===ys?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ja=this._renderer.getRenderTarget(),Qa=this._renderer.getActiveCubeFace(),to=this._renderer.getActiveMipmapLevel(),eo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:vi,minFilter:vi,generateMipmaps:!1,type:Ni,format:Pi,colorSpace:tn,depthBuffer:!1},n=Vc(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Vc(t,e,i);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Am(r)),this._blurMaterial=Rm(r,t,e)}return n}_compileMaterial(t){const e=new ft(this._lodPlanes[0],t);this._renderer.compile(e,Za)}_sceneToCubeUV(t,e,i,n){const o=new ui(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,u=h.toneMapping;h.getClearColor(Bc),h.toneMapping=dn,h.autoClear=!1;const m=new oe({name:"PMREM.Background",side:je,depthWrite:!1,depthTest:!1}),g=new ft(new It,m);let _=!1;const p=t.background;p?p.isColor&&(m.color.copy(p),t.background=null,_=!0):(m.color.copy(Bc),_=!0);for(let d=0;d<6;d++){const x=d%3;x===0?(o.up.set(0,l[d],0),o.lookAt(c[d],0,0)):x===1?(o.up.set(0,0,l[d]),o.lookAt(0,c[d],0)):(o.up.set(0,l[d],0),o.lookAt(0,0,c[d]));const M=this._cubeSize;Ar(n,x*M,d>2?M:0,M,M),h.setRenderTarget(n),_&&h.render(g,o),h.render(t,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=u,h.autoClear=f,t.background=p}_textureToCubeUV(t,e){const i=this._renderer,n=t.mapping===Ms||t.mapping===ys;n?(this._cubemapMaterial===null&&(this._cubemapMaterial=Xc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Wc());const r=n?this._cubemapMaterial:this._equirectMaterial,a=new ft(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;Ar(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(a,Za)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const n=this._lodPlanes.length;for(let r=1;r<n;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Gc[(n-r-1)%Gc.length];this._blur(t,r-1,r,a,o)}e.autoClear=i}_blur(t,e,i,n,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,i,n,"latitudinal",r),this._halfBlur(a,t,i,i,n,"longitudinal",r)}_halfBlur(t,e,i,n,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new ft(this._lodPlanes[n],c),u=c.uniforms,m=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*In-1),_=r/g,p=isFinite(r)?1+Math.floor(h*_):In;p>In&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${In}`);const d=[];let x=0;for(let E=0;E<In;++E){const C=E/_,I=Math.exp(-C*C/2);d.push(I),E===0?x+=I:E<p&&(x+=2*I)}for(let E=0;E<d.length;E++)d[E]=d[E]/x;u.envMap.value=t.texture,u.samples.value=p,u.weights.value=d,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:M}=this;u.dTheta.value=g,u.mipInt.value=M-i;const b=this._sizeLods[n],P=3*b*(n>M-ps?n-M+ps:0),T=4*(this._cubeSize-b);Ar(e,P,T,3*b,2*b),l.setRenderTarget(e),l.render(f,Za)}}function Am(s){const t=[],e=[],i=[];let n=s;const r=s-ps+1+zc.length;for(let a=0;a<r;a++){const o=Math.pow(2,n);e.push(o);let l=1/o;a>s-ps?l=zc[a-s+ps-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),h=-c,f=1+c,u=[h,h,f,h,f,f,h,h,f,f,h,f],m=6,g=6,_=3,p=2,d=1,x=new Float32Array(_*g*m),M=new Float32Array(p*g*m),b=new Float32Array(d*g*m);for(let T=0;T<m;T++){const E=T%3*2/3-1,C=T>2?0:-1,I=[E,C,0,E+2/3,C,0,E+2/3,C+1,0,E,C,0,E+2/3,C+1,0,E,C+1,0];x.set(I,_*g*T),M.set(u,p*g*T);const v=[T,T,T,T,T,T];b.set(v,d*g*T)}const P=new He;P.setAttribute("position",new Pe(x,_)),P.setAttribute("uv",new Pe(M,p)),P.setAttribute("faceIndex",new Pe(b,d)),t.push(P),n>ps&&n--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Vc(s,t,e){const i=new Mi(s,t,e);return i.texture.mapping=ga,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ar(s,t,e,i,n){s.viewport.set(t,e,i,n),s.scissor.set(t,e,i,n)}function Rm(s,t,e){const i=new Float32Array(In),n=new R(0,1,0);return new Ne({name:"SphericalGaussianBlur",defines:{n:In,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:n}},vertexShader:Ul(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:$i,depthTest:!1,depthWrite:!1})}function Wc(){return new Ne({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ul(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:$i,depthTest:!1,depthWrite:!1})}function Xc(){return new Ne({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ul(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:$i,depthTest:!1,depthWrite:!1})}function Ul(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Cm(s){let t=new WeakMap,e=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===Oo||l===zo,h=l===Ms||l===ys;if(c||h){let f=t.get(o);const u=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==u)return e===null&&(e=new Hc(s)),f=c?e.fromEquirectangular(o,f):e.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),f.texture;if(f!==void 0)return f.texture;{const m=o.image;return c&&m&&m.height>0||h&&m&&n(m)?(e===null&&(e=new Hc(s)),f=c?e.fromEquirectangular(o):e.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),o.addEventListener("dispose",r),f.texture):null}}}return o}function n(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:a}}function Pm(s){const t={};function e(i){if(t[i]!==void 0)return t[i];let n;switch(i){case"WEBGL_depth_texture":n=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":n=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":n=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":n=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:n=s.getExtension(i)}return t[i]=n,n}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const n=e(i);return n===null&&ta("THREE.WebGLRenderer: "+i+" extension not supported."),n}}}function Im(s,t,e,i){const n={},r=new WeakMap;function a(f){const u=f.target;u.index!==null&&t.remove(u.index);for(const g in u.attributes)t.remove(u.attributes[g]);for(const g in u.morphAttributes){const _=u.morphAttributes[g];for(let p=0,d=_.length;p<d;p++)t.remove(_[p])}u.removeEventListener("dispose",a),delete n[u.id];const m=r.get(u);m&&(t.remove(m),r.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function o(f,u){return n[u.id]===!0||(u.addEventListener("dispose",a),n[u.id]=!0,e.memory.geometries++),u}function l(f){const u=f.attributes;for(const g in u)t.update(u[g],s.ARRAY_BUFFER);const m=f.morphAttributes;for(const g in m){const _=m[g];for(let p=0,d=_.length;p<d;p++)t.update(_[p],s.ARRAY_BUFFER)}}function c(f){const u=[],m=f.index,g=f.attributes.position;let _=0;if(m!==null){const x=m.array;_=m.version;for(let M=0,b=x.length;M<b;M+=3){const P=x[M+0],T=x[M+1],E=x[M+2];u.push(P,T,T,E,E,P)}}else if(g!==void 0){const x=g.array;_=g.version;for(let M=0,b=x.length/3-1;M<b;M+=3){const P=M+0,T=M+1,E=M+2;u.push(P,T,T,E,E,P)}}else return;const p=new(If(u)?Ff:kf)(u,1);p.version=_;const d=r.get(f);d&&t.remove(d),r.set(f,p)}function h(f){const u=r.get(f);if(u){const m=f.index;m!==null&&u.version<m.version&&c(f)}else c(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:h}}function Lm(s,t,e){let i;function n(u){i=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function l(u,m){s.drawElements(i,m,r,u*a),e.update(m,i,1)}function c(u,m,g){g!==0&&(s.drawElementsInstanced(i,m,r,u*a,g),e.update(m,i,g))}function h(u,m,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,m,0,r,u,0,g);let p=0;for(let d=0;d<g;d++)p+=m[d];e.update(p,i,1)}function f(u,m,g,_){if(g===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let d=0;d<u.length;d++)c(u[d]/a,m[d],_[d]);else{p.multiDrawElementsInstancedWEBGL(i,m,0,r,u,0,_,0,g);let d=0;for(let x=0;x<g;x++)d+=m[x];for(let x=0;x<_.length;x++)e.update(d,i,_[x])}}this.setMode=n,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function Dm(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(e.calls++,a){case s.TRIANGLES:e.triangles+=o*(r/3);break;case s.LINES:e.lines+=o*(r/2);break;case s.LINE_STRIP:e.lines+=o*(r-1);break;case s.LINE_LOOP:e.lines+=o*r;break;case s.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function n(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:n,update:i}}function Um(s,t,e){const i=new WeakMap,n=new ge;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let u=i.get(o);if(u===void 0||u.count!==f){let v=function(){C.dispose(),i.delete(o),o.removeEventListener("dispose",v)};var m=v;u!==void 0&&u.texture.dispose();const g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,d=o.morphAttributes.position||[],x=o.morphAttributes.normal||[],M=o.morphAttributes.color||[];let b=0;g===!0&&(b=1),_===!0&&(b=2),p===!0&&(b=3);let P=o.attributes.position.count*b,T=1;P>t.maxTextureSize&&(T=Math.ceil(P/t.maxTextureSize),P=t.maxTextureSize);const E=new Float32Array(P*T*4*f),C=new Df(E,P,T,f);C.type=Ui,C.needsUpdate=!0;const I=b*4;for(let S=0;S<f;S++){const U=d[S],k=x[S],V=M[S],K=P*T*4*S;for(let W=0;W<U.count;W++){const Q=W*I;g===!0&&(n.fromBufferAttribute(U,W),E[K+Q+0]=n.x,E[K+Q+1]=n.y,E[K+Q+2]=n.z,E[K+Q+3]=0),_===!0&&(n.fromBufferAttribute(k,W),E[K+Q+4]=n.x,E[K+Q+5]=n.y,E[K+Q+6]=n.z,E[K+Q+7]=0),p===!0&&(n.fromBufferAttribute(V,W),E[K+Q+8]=n.x,E[K+Q+9]=n.y,E[K+Q+10]=n.z,E[K+Q+11]=V.itemSize===4?n.w:1)}}u={count:f,texture:C,size:new Lt(P,T)},i.set(o,u),o.addEventListener("dispose",v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,e);else{let g=0;for(let p=0;p<c.length;p++)g+=c[p];const _=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(s,"morphTargetBaseInfluence",_),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",u.size)}return{update:r}}function Nm(s,t,e,i){let n=new WeakMap;function r(l){const c=i.render.frame,h=l.geometry,f=t.get(l,h);if(n.get(f)!==c&&(t.update(f),n.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),n.get(l)!==c&&(e.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,s.ARRAY_BUFFER),n.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;n.get(u)!==c&&(u.update(),n.set(u,c))}return f}function a(){n=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:a}}class Hf extends Ze{constructor(t,e,i,n,r,a,o,l,c,h=ms){if(h!==ms&&h!==Ss)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===ms&&(i=zn),i===void 0&&h===Ss&&(i=bs),super(null,n,r,a,o,l,h,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:Ye,this.minFilter=l!==void 0?l:Ye,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Vf=new Ze,qc=new Hf(1,1),Wf=new Df,Xf=new yd,qf=new Bf,Yc=[],Kc=[],$c=new Float32Array(16),jc=new Float32Array(9),Zc=new Float32Array(4);function Rs(s,t,e){const i=s[0];if(i<=0||i>0)return s;const n=t*e;let r=Yc[n];if(r===void 0&&(r=new Float32Array(n),Yc[n]=r),t!==0){i.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,s[a].toArray(r,o)}return r}function Oe(s,t){if(s.length!==t.length)return!1;for(let e=0,i=s.length;e<i;e++)if(s[e]!==t[e])return!1;return!0}function ze(s,t){for(let e=0,i=t.length;e<i;e++)s[e]=t[e]}function xa(s,t){let e=Kc[t];e===void 0&&(e=new Int32Array(t),Kc[t]=e);for(let i=0;i!==t;++i)e[i]=s.allocateTextureUnit();return e}function km(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function Fm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Oe(e,t))return;s.uniform2fv(this.addr,t),ze(e,t)}}function Om(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Oe(e,t))return;s.uniform3fv(this.addr,t),ze(e,t)}}function zm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Oe(e,t))return;s.uniform4fv(this.addr,t),ze(e,t)}}function Bm(s,t){const e=this.cache,i=t.elements;if(i===void 0){if(Oe(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),ze(e,t)}else{if(Oe(e,i))return;Zc.set(i),s.uniformMatrix2fv(this.addr,!1,Zc),ze(e,i)}}function Gm(s,t){const e=this.cache,i=t.elements;if(i===void 0){if(Oe(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),ze(e,t)}else{if(Oe(e,i))return;jc.set(i),s.uniformMatrix3fv(this.addr,!1,jc),ze(e,i)}}function Hm(s,t){const e=this.cache,i=t.elements;if(i===void 0){if(Oe(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),ze(e,t)}else{if(Oe(e,i))return;$c.set(i),s.uniformMatrix4fv(this.addr,!1,$c),ze(e,i)}}function Vm(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function Wm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Oe(e,t))return;s.uniform2iv(this.addr,t),ze(e,t)}}function Xm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Oe(e,t))return;s.uniform3iv(this.addr,t),ze(e,t)}}function qm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Oe(e,t))return;s.uniform4iv(this.addr,t),ze(e,t)}}function Ym(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function Km(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Oe(e,t))return;s.uniform2uiv(this.addr,t),ze(e,t)}}function $m(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Oe(e,t))return;s.uniform3uiv(this.addr,t),ze(e,t)}}function jm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Oe(e,t))return;s.uniform4uiv(this.addr,t),ze(e,t)}}function Zm(s,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n);let r;this.type===s.SAMPLER_2D_SHADOW?(qc.compareFunction=Pf,r=qc):r=Vf,e.setTexture2D(t||r,n)}function Jm(s,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),e.setTexture3D(t||Xf,n)}function Qm(s,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),e.setTextureCube(t||qf,n)}function tg(s,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),e.setTexture2DArray(t||Wf,n)}function eg(s){switch(s){case 5126:return km;case 35664:return Fm;case 35665:return Om;case 35666:return zm;case 35674:return Bm;case 35675:return Gm;case 35676:return Hm;case 5124:case 35670:return Vm;case 35667:case 35671:return Wm;case 35668:case 35672:return Xm;case 35669:case 35673:return qm;case 5125:return Ym;case 36294:return Km;case 36295:return $m;case 36296:return jm;case 35678:case 36198:case 36298:case 36306:case 35682:return Zm;case 35679:case 36299:case 36307:return Jm;case 35680:case 36300:case 36308:case 36293:return Qm;case 36289:case 36303:case 36311:case 36292:return tg}}function ig(s,t){s.uniform1fv(this.addr,t)}function ng(s,t){const e=Rs(t,this.size,2);s.uniform2fv(this.addr,e)}function sg(s,t){const e=Rs(t,this.size,3);s.uniform3fv(this.addr,e)}function rg(s,t){const e=Rs(t,this.size,4);s.uniform4fv(this.addr,e)}function ag(s,t){const e=Rs(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function og(s,t){const e=Rs(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function lg(s,t){const e=Rs(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function cg(s,t){s.uniform1iv(this.addr,t)}function hg(s,t){s.uniform2iv(this.addr,t)}function fg(s,t){s.uniform3iv(this.addr,t)}function ug(s,t){s.uniform4iv(this.addr,t)}function dg(s,t){s.uniform1uiv(this.addr,t)}function pg(s,t){s.uniform2uiv(this.addr,t)}function mg(s,t){s.uniform3uiv(this.addr,t)}function gg(s,t){s.uniform4uiv(this.addr,t)}function _g(s,t,e){const i=this.cache,n=t.length,r=xa(e,n);Oe(i,r)||(s.uniform1iv(this.addr,r),ze(i,r));for(let a=0;a!==n;++a)e.setTexture2D(t[a]||Vf,r[a])}function vg(s,t,e){const i=this.cache,n=t.length,r=xa(e,n);Oe(i,r)||(s.uniform1iv(this.addr,r),ze(i,r));for(let a=0;a!==n;++a)e.setTexture3D(t[a]||Xf,r[a])}function xg(s,t,e){const i=this.cache,n=t.length,r=xa(e,n);Oe(i,r)||(s.uniform1iv(this.addr,r),ze(i,r));for(let a=0;a!==n;++a)e.setTextureCube(t[a]||qf,r[a])}function Mg(s,t,e){const i=this.cache,n=t.length,r=xa(e,n);Oe(i,r)||(s.uniform1iv(this.addr,r),ze(i,r));for(let a=0;a!==n;++a)e.setTexture2DArray(t[a]||Wf,r[a])}function yg(s){switch(s){case 5126:return ig;case 35664:return ng;case 35665:return sg;case 35666:return rg;case 35674:return ag;case 35675:return og;case 35676:return lg;case 5124:case 35670:return cg;case 35667:case 35671:return hg;case 35668:case 35672:return fg;case 35669:case 35673:return ug;case 5125:return dg;case 36294:return pg;case 36295:return mg;case 36296:return gg;case 35678:case 36198:case 36298:case 36306:case 35682:return _g;case 35679:case 36299:case 36307:return vg;case 35680:case 36300:case 36308:case 36293:return xg;case 36289:case 36303:case 36311:case 36292:return Mg}}class bg{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=eg(e.type)}}class Sg{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=yg(e.type)}}class wg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const n=this.seq;for(let r=0,a=n.length;r!==a;++r){const o=n[r];o.setValue(t,e[o.id],i)}}}const io=/(\w+)(\])?(\[|\.)?/g;function Jc(s,t){s.seq.push(t),s.map[t.id]=t}function Tg(s,t,e){const i=s.name,n=i.length;for(io.lastIndex=0;;){const r=io.exec(i),a=io.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===n){Jc(e,c===void 0?new bg(o,s,t):new Sg(o,s,t));break}else{let f=e.map[o];f===void 0&&(f=new wg(o),Jc(e,f)),e=f}}}class ea{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let n=0;n<i;++n){const r=t.getActiveUniform(e,n),a=t.getUniformLocation(e,r.name);Tg(r,a,this)}}setValue(t,e,i,n){const r=this.map[e];r!==void 0&&r.setValue(t,i,n)}setOptional(t,e,i){const n=e[i];n!==void 0&&this.setValue(t,i,n)}static upload(t,e,i,n){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,n)}}static seqWithValue(t,e){const i=[];for(let n=0,r=t.length;n!==r;++n){const a=t[n];a.id in e&&i.push(a)}return i}}function Qc(s,t,e){const i=s.createShader(t);return s.shaderSource(i,e),s.compileShader(i),i}const Eg=37297;let Ag=0;function Rg(s,t){const e=s.split(`
`),i=[],n=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=n;a<r;a++){const o=a+1;i.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return i.join(`
`)}function Cg(s){const t=fe.getPrimaries(fe.workingColorSpace),e=fe.getPrimaries(s);let i;switch(t===e?i="":t===la&&e===oa?i="LinearDisplayP3ToLinearSRGB":t===oa&&e===la&&(i="LinearSRGBToLinearDisplayP3"),s){case tn:case va:return[i,"LinearTransferOETF"];case fi:case Pl:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[i,"LinearTransferOETF"]}}function th(s,t,e){const i=s.getShaderParameter(t,s.COMPILE_STATUS),n=s.getShaderInfoLog(t).trim();if(i&&n==="")return"";const r=/ERROR: 0:(\d+)/.exec(n);if(r){const a=parseInt(r[1]);return e.toUpperCase()+`

`+n+`

`+Rg(s.getShaderSource(t),a)}else return n}function Pg(s,t){const e=Cg(t);return`vec4 ${s}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Ig(s,t){let e;switch(t){case mf:e="Linear";break;case gf:e="Reinhard";break;case _f:e="Cineon";break;case bl:e="ACESFilmic";break;case vf:e="AgX";break;case xf:e="Neutral";break;case Ou:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Rr=new R;function Lg(){fe.getLuminanceCoefficients(Rr);const s=Rr.x.toFixed(4),t=Rr.y.toFixed(4),e=Rr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Dg(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter($s).join(`
`)}function Ug(s){const t=[];for(const e in s){const i=s[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function Ng(s,t){const e={},i=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let n=0;n<i;n++){const r=s.getActiveAttrib(t,n),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:s.getAttribLocation(t,a),locationSize:o}}return e}function $s(s){return s!==""}function eh(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function ih(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const kg=/^[ \t]*#include +<([\w\d./]+)>/gm;function ml(s){return s.replace(kg,Og)}const Fg=new Map;function Og(s,t){let e=jt[t];if(e===void 0){const i=Fg.get(t);if(i!==void 0)e=jt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return ml(e)}const zg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function nh(s){return s.replace(zg,Bg)}function Bg(s,t,e,i){let n="";for(let r=parseInt(t);r<parseInt(e);r++)n+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return n}function sh(s){let t=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Gg(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===uf?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===df?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Xi&&(t="SHADOWMAP_TYPE_VSM"),t}function Hg(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Ms:case ys:t="ENVMAP_TYPE_CUBE";break;case ga:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Vg(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case ys:t="ENVMAP_MODE_REFRACTION";break}return t}function Wg(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case pf:t="ENVMAP_BLENDING_MULTIPLY";break;case ku:t="ENVMAP_BLENDING_MIX";break;case Fu:t="ENVMAP_BLENDING_ADD";break}return t}function Xg(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function qg(s,t,e,i){const n=s.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=Gg(e),c=Hg(e),h=Vg(e),f=Wg(e),u=Xg(e),m=Dg(e),g=Ug(r),_=n.createProgram();let p,d,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter($s).join(`
`),p.length>0&&(p+=`
`),d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter($s).join(`
`),d.length>0&&(d+=`
`)):(p=[sh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter($s).join(`
`),d=[sh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==dn?"#define TONE_MAPPING":"",e.toneMapping!==dn?jt.tonemapping_pars_fragment:"",e.toneMapping!==dn?Ig("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",jt.colorspace_pars_fragment,Pg("linearToOutputTexel",e.outputColorSpace),Lg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter($s).join(`
`)),a=ml(a),a=eh(a,e),a=ih(a,e),o=ml(o),o=eh(o,e),o=ih(o,e),a=nh(a),o=nh(o),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,d=["#define varying in",e.glslVersion===Mc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Mc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const M=x+p+a,b=x+d+o,P=Qc(n,n.VERTEX_SHADER,M),T=Qc(n,n.FRAGMENT_SHADER,b);n.attachShader(_,P),n.attachShader(_,T),e.index0AttributeName!==void 0?n.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&n.bindAttribLocation(_,0,"position"),n.linkProgram(_);function E(S){if(s.debug.checkShaderErrors){const U=n.getProgramInfoLog(_).trim(),k=n.getShaderInfoLog(P).trim(),V=n.getShaderInfoLog(T).trim();let K=!0,W=!0;if(n.getProgramParameter(_,n.LINK_STATUS)===!1)if(K=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(n,_,P,T);else{const Q=th(n,P,"vertex"),X=th(n,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+n.getError()+" - VALIDATE_STATUS "+n.getProgramParameter(_,n.VALIDATE_STATUS)+`

Material Name: `+S.name+`
Material Type: `+S.type+`

Program Info Log: `+U+`
`+Q+`
`+X)}else U!==""?console.warn("THREE.WebGLProgram: Program Info Log:",U):(k===""||V==="")&&(W=!1);W&&(S.diagnostics={runnable:K,programLog:U,vertexShader:{log:k,prefix:p},fragmentShader:{log:V,prefix:d}})}n.deleteShader(P),n.deleteShader(T),C=new ea(n,_),I=Ng(n,_)}let C;this.getUniforms=function(){return C===void 0&&E(this),C};let I;this.getAttributes=function(){return I===void 0&&E(this),I};let v=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=n.getProgramParameter(_,Eg)),v},this.destroy=function(){i.releaseStatesOfProgram(this),n.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Ag++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=P,this.fragmentShader=T,this}let Yg=0;class Kg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,n=this._getShaderStage(e),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(n)===!1&&(a.add(n),n.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new $g(t),e.set(t,i)),i}}class $g{constructor(t){this.id=Yg++,this.code=t,this.usedTimes=0}}function jg(s,t,e,i,n,r,a){const o=new Uf,l=new Kg,c=new Set,h=[],f=n.logarithmicDepthBuffer,u=n.reverseDepthBuffer,m=n.vertexTextures;let g=n.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(v){return c.add(v),v===0?"uv":`uv${v}`}function d(v,S,U,k,V){const K=k.fog,W=V.geometry,Q=v.isMeshStandardMaterial?k.environment:null,X=(v.isMeshStandardMaterial?e:t).get(v.envMap||Q),dt=X&&X.mapping===ga?X.image.height:null,lt=_[v.type];v.precision!==null&&(g=n.getMaxPrecision(v.precision),g!==v.precision&&console.warn("THREE.WebGLProgram.getParameters:",v.precision,"not supported, using",g,"instead."));const gt=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Ft=gt!==void 0?gt.length:0;let st=0;W.morphAttributes.position!==void 0&&(st=1),W.morphAttributes.normal!==void 0&&(st=2),W.morphAttributes.color!==void 0&&(st=3);let H,tt,at,ut;if(lt){const ri=Li[lt];H=ri.vertexShader,tt=ri.fragmentShader}else H=v.vertexShader,tt=v.fragmentShader,l.update(v),at=l.getVertexShaderID(v),ut=l.getFragmentShaderID(v);const St=s.getRenderTarget(),Mt=V.isInstancedMesh===!0,Gt=V.isBatchedMesh===!0,Kt=!!v.map,$t=!!v.matcap,D=!!X,Ue=!!v.aoMap,Jt=!!v.lightMap,F=!!v.bumpMap,Z=!!v.normalMap,ot=!!v.displacementMap,it=!!v.emissiveMap,A=!!v.metalnessMap,y=!!v.roughnessMap,O=v.anisotropy>0,$=v.clearcoat>0,et=v.dispersion>0,J=v.iridescence>0,Rt=v.sheen>0,_t=v.transmission>0,Tt=O&&!!v.anisotropyMap,le=$&&!!v.clearcoatMap,ct=$&&!!v.clearcoatNormalMap,Et=$&&!!v.clearcoatRoughnessMap,Vt=J&&!!v.iridescenceMap,Wt=J&&!!v.iridescenceThicknessMap,At=Rt&&!!v.sheenColorMap,ie=Rt&&!!v.sheenRoughnessMap,qt=!!v.specularMap,ve=!!v.specularColorMap,N=!!v.specularIntensityMap,yt=_t&&!!v.transmissionMap,j=_t&&!!v.thicknessMap,nt=!!v.gradientMap,vt=!!v.alphaMap,bt=v.alphaTest>0,re=!!v.alphaHash,Ie=!!v.extensions;let si=dn;v.toneMapped&&(St===null||St.isXRRenderTarget===!0)&&(si=s.toneMapping);const ce={shaderID:lt,shaderType:v.type,shaderName:v.name,vertexShader:H,fragmentShader:tt,defines:v.defines,customVertexShaderID:at,customFragmentShaderID:ut,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:g,batching:Gt,batchingColor:Gt&&V._colorsTexture!==null,instancing:Mt,instancingColor:Mt&&V.instanceColor!==null,instancingMorph:Mt&&V.morphTexture!==null,supportsVertexTextures:m,outputColorSpace:St===null?s.outputColorSpace:St.isXRRenderTarget===!0?St.texture.colorSpace:tn,alphaToCoverage:!!v.alphaToCoverage,map:Kt,matcap:$t,envMap:D,envMapMode:D&&X.mapping,envMapCubeUVHeight:dt,aoMap:Ue,lightMap:Jt,bumpMap:F,normalMap:Z,displacementMap:m&&ot,emissiveMap:it,normalMapObjectSpace:Z&&v.normalMapType===Hu,normalMapTangentSpace:Z&&v.normalMapType===Cl,metalnessMap:A,roughnessMap:y,anisotropy:O,anisotropyMap:Tt,clearcoat:$,clearcoatMap:le,clearcoatNormalMap:ct,clearcoatRoughnessMap:Et,dispersion:et,iridescence:J,iridescenceMap:Vt,iridescenceThicknessMap:Wt,sheen:Rt,sheenColorMap:At,sheenRoughnessMap:ie,specularMap:qt,specularColorMap:ve,specularIntensityMap:N,transmission:_t,transmissionMap:yt,thicknessMap:j,gradientMap:nt,opaque:v.transparent===!1&&v.blending===Fn&&v.alphaToCoverage===!1,alphaMap:vt,alphaTest:bt,alphaHash:re,combine:v.combine,mapUv:Kt&&p(v.map.channel),aoMapUv:Ue&&p(v.aoMap.channel),lightMapUv:Jt&&p(v.lightMap.channel),bumpMapUv:F&&p(v.bumpMap.channel),normalMapUv:Z&&p(v.normalMap.channel),displacementMapUv:ot&&p(v.displacementMap.channel),emissiveMapUv:it&&p(v.emissiveMap.channel),metalnessMapUv:A&&p(v.metalnessMap.channel),roughnessMapUv:y&&p(v.roughnessMap.channel),anisotropyMapUv:Tt&&p(v.anisotropyMap.channel),clearcoatMapUv:le&&p(v.clearcoatMap.channel),clearcoatNormalMapUv:ct&&p(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Et&&p(v.clearcoatRoughnessMap.channel),iridescenceMapUv:Vt&&p(v.iridescenceMap.channel),iridescenceThicknessMapUv:Wt&&p(v.iridescenceThicknessMap.channel),sheenColorMapUv:At&&p(v.sheenColorMap.channel),sheenRoughnessMapUv:ie&&p(v.sheenRoughnessMap.channel),specularMapUv:qt&&p(v.specularMap.channel),specularColorMapUv:ve&&p(v.specularColorMap.channel),specularIntensityMapUv:N&&p(v.specularIntensityMap.channel),transmissionMapUv:yt&&p(v.transmissionMap.channel),thicknessMapUv:j&&p(v.thicknessMap.channel),alphaMapUv:vt&&p(v.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(Z||O),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:V.isPoints===!0&&!!W.attributes.uv&&(Kt||vt),fog:!!K,useFog:v.fog===!0,fogExp2:!!K&&K.isFogExp2,flatShading:v.flatShading===!0,sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:u,skinning:V.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:Ft,morphTextureStride:st,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:v.dithering,shadowMapEnabled:s.shadowMap.enabled&&U.length>0,shadowMapType:s.shadowMap.type,toneMapping:si,decodeVideoTexture:Kt&&v.map.isVideoTexture===!0&&fe.getTransfer(v.map.colorSpace)===xe,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===_e,flipSided:v.side===je,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:Ie&&v.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ie&&v.extensions.multiDraw===!0||Gt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return ce.vertexUv1s=c.has(1),ce.vertexUv2s=c.has(2),ce.vertexUv3s=c.has(3),c.clear(),ce}function x(v){const S=[];if(v.shaderID?S.push(v.shaderID):(S.push(v.customVertexShaderID),S.push(v.customFragmentShaderID)),v.defines!==void 0)for(const U in v.defines)S.push(U),S.push(v.defines[U]);return v.isRawShaderMaterial===!1&&(M(S,v),b(S,v),S.push(s.outputColorSpace)),S.push(v.customProgramCacheKey),S.join()}function M(v,S){v.push(S.precision),v.push(S.outputColorSpace),v.push(S.envMapMode),v.push(S.envMapCubeUVHeight),v.push(S.mapUv),v.push(S.alphaMapUv),v.push(S.lightMapUv),v.push(S.aoMapUv),v.push(S.bumpMapUv),v.push(S.normalMapUv),v.push(S.displacementMapUv),v.push(S.emissiveMapUv),v.push(S.metalnessMapUv),v.push(S.roughnessMapUv),v.push(S.anisotropyMapUv),v.push(S.clearcoatMapUv),v.push(S.clearcoatNormalMapUv),v.push(S.clearcoatRoughnessMapUv),v.push(S.iridescenceMapUv),v.push(S.iridescenceThicknessMapUv),v.push(S.sheenColorMapUv),v.push(S.sheenRoughnessMapUv),v.push(S.specularMapUv),v.push(S.specularColorMapUv),v.push(S.specularIntensityMapUv),v.push(S.transmissionMapUv),v.push(S.thicknessMapUv),v.push(S.combine),v.push(S.fogExp2),v.push(S.sizeAttenuation),v.push(S.morphTargetsCount),v.push(S.morphAttributeCount),v.push(S.numDirLights),v.push(S.numPointLights),v.push(S.numSpotLights),v.push(S.numSpotLightMaps),v.push(S.numHemiLights),v.push(S.numRectAreaLights),v.push(S.numDirLightShadows),v.push(S.numPointLightShadows),v.push(S.numSpotLightShadows),v.push(S.numSpotLightShadowsWithMaps),v.push(S.numLightProbes),v.push(S.shadowMapType),v.push(S.toneMapping),v.push(S.numClippingPlanes),v.push(S.numClipIntersection),v.push(S.depthPacking)}function b(v,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),v.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reverseDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.alphaToCoverage&&o.enable(20),v.push(o.mask)}function P(v){const S=_[v.type];let U;if(S){const k=Li[S];U=Bn.clone(k.uniforms)}else U=v.uniforms;return U}function T(v,S){let U;for(let k=0,V=h.length;k<V;k++){const K=h[k];if(K.cacheKey===S){U=K,++U.usedTimes;break}}return U===void 0&&(U=new qg(s,S,v,r),h.push(U)),U}function E(v){if(--v.usedTimes===0){const S=h.indexOf(v);h[S]=h[h.length-1],h.pop(),v.destroy()}}function C(v){l.remove(v)}function I(){l.dispose()}return{getParameters:d,getProgramCacheKey:x,getUniforms:P,acquireProgram:T,releaseProgram:E,releaseShaderCache:C,programs:h,dispose:I}}function Zg(){let s=new WeakMap;function t(a){return s.has(a)}function e(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function i(a){s.delete(a)}function n(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:i,update:n,dispose:r}}function Jg(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function rh(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function ah(){const s=[];let t=0;const e=[],i=[],n=[];function r(){t=0,e.length=0,i.length=0,n.length=0}function a(f,u,m,g,_,p){let d=s[t];return d===void 0?(d={id:f.id,object:f,geometry:u,material:m,groupOrder:g,renderOrder:f.renderOrder,z:_,group:p},s[t]=d):(d.id=f.id,d.object=f,d.geometry=u,d.material=m,d.groupOrder=g,d.renderOrder=f.renderOrder,d.z=_,d.group=p),t++,d}function o(f,u,m,g,_,p){const d=a(f,u,m,g,_,p);m.transmission>0?i.push(d):m.transparent===!0?n.push(d):e.push(d)}function l(f,u,m,g,_,p){const d=a(f,u,m,g,_,p);m.transmission>0?i.unshift(d):m.transparent===!0?n.unshift(d):e.unshift(d)}function c(f,u){e.length>1&&e.sort(f||Jg),i.length>1&&i.sort(u||rh),n.length>1&&n.sort(u||rh)}function h(){for(let f=t,u=s.length;f<u;f++){const m=s[f];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:i,transparent:n,init:r,push:o,unshift:l,finish:h,sort:c}}function Qg(){let s=new WeakMap;function t(i,n){const r=s.get(i);let a;return r===void 0?(a=new ah,s.set(i,[a])):n>=r.length?(a=new ah,r.push(a)):a=r[n],a}function e(){s=new WeakMap}return{get:t,dispose:e}}function t_(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new R,color:new pt};break;case"SpotLight":e={position:new R,direction:new R,color:new pt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new R,color:new pt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new R,skyColor:new pt,groundColor:new pt};break;case"RectAreaLight":e={color:new pt,position:new R,halfWidth:new R,halfHeight:new R};break}return s[t.id]=e,e}}}function e_(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let i_=0;function n_(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function s_(s){const t=new t_,e=e_(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new R);const n=new R,r=new te,a=new te;function o(c){let h=0,f=0,u=0;for(let I=0;I<9;I++)i.probe[I].set(0,0,0);let m=0,g=0,_=0,p=0,d=0,x=0,M=0,b=0,P=0,T=0,E=0;c.sort(n_);for(let I=0,v=c.length;I<v;I++){const S=c[I],U=S.color,k=S.intensity,V=S.distance,K=S.shadow&&S.shadow.map?S.shadow.map.texture:null;if(S.isAmbientLight)h+=U.r*k,f+=U.g*k,u+=U.b*k;else if(S.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(S.sh.coefficients[W],k);E++}else if(S.isDirectionalLight){const W=t.get(S);if(W.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){const Q=S.shadow,X=e.get(S);X.shadowIntensity=Q.intensity,X.shadowBias=Q.bias,X.shadowNormalBias=Q.normalBias,X.shadowRadius=Q.radius,X.shadowMapSize=Q.mapSize,i.directionalShadow[m]=X,i.directionalShadowMap[m]=K,i.directionalShadowMatrix[m]=S.shadow.matrix,x++}i.directional[m]=W,m++}else if(S.isSpotLight){const W=t.get(S);W.position.setFromMatrixPosition(S.matrixWorld),W.color.copy(U).multiplyScalar(k),W.distance=V,W.coneCos=Math.cos(S.angle),W.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),W.decay=S.decay,i.spot[_]=W;const Q=S.shadow;if(S.map&&(i.spotLightMap[P]=S.map,P++,Q.updateMatrices(S),S.castShadow&&T++),i.spotLightMatrix[_]=Q.matrix,S.castShadow){const X=e.get(S);X.shadowIntensity=Q.intensity,X.shadowBias=Q.bias,X.shadowNormalBias=Q.normalBias,X.shadowRadius=Q.radius,X.shadowMapSize=Q.mapSize,i.spotShadow[_]=X,i.spotShadowMap[_]=K,b++}_++}else if(S.isRectAreaLight){const W=t.get(S);W.color.copy(U).multiplyScalar(k),W.halfWidth.set(S.width*.5,0,0),W.halfHeight.set(0,S.height*.5,0),i.rectArea[p]=W,p++}else if(S.isPointLight){const W=t.get(S);if(W.color.copy(S.color).multiplyScalar(S.intensity),W.distance=S.distance,W.decay=S.decay,S.castShadow){const Q=S.shadow,X=e.get(S);X.shadowIntensity=Q.intensity,X.shadowBias=Q.bias,X.shadowNormalBias=Q.normalBias,X.shadowRadius=Q.radius,X.shadowMapSize=Q.mapSize,X.shadowCameraNear=Q.camera.near,X.shadowCameraFar=Q.camera.far,i.pointShadow[g]=X,i.pointShadowMap[g]=K,i.pointShadowMatrix[g]=S.shadow.matrix,M++}i.point[g]=W,g++}else if(S.isHemisphereLight){const W=t.get(S);W.skyColor.copy(S.color).multiplyScalar(k),W.groundColor.copy(S.groundColor).multiplyScalar(k),i.hemi[d]=W,d++}}p>0&&(s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=mt.LTC_FLOAT_1,i.rectAreaLTC2=mt.LTC_FLOAT_2):(i.rectAreaLTC1=mt.LTC_HALF_1,i.rectAreaLTC2=mt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=u;const C=i.hash;(C.directionalLength!==m||C.pointLength!==g||C.spotLength!==_||C.rectAreaLength!==p||C.hemiLength!==d||C.numDirectionalShadows!==x||C.numPointShadows!==M||C.numSpotShadows!==b||C.numSpotMaps!==P||C.numLightProbes!==E)&&(i.directional.length=m,i.spot.length=_,i.rectArea.length=p,i.point.length=g,i.hemi.length=d,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=M,i.pointShadowMap.length=M,i.spotShadow.length=b,i.spotShadowMap.length=b,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=M,i.spotLightMatrix.length=b+P-T,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=E,C.directionalLength=m,C.pointLength=g,C.spotLength=_,C.rectAreaLength=p,C.hemiLength=d,C.numDirectionalShadows=x,C.numPointShadows=M,C.numSpotShadows=b,C.numSpotMaps=P,C.numLightProbes=E,i.version=i_++)}function l(c,h){let f=0,u=0,m=0,g=0,_=0;const p=h.matrixWorldInverse;for(let d=0,x=c.length;d<x;d++){const M=c[d];if(M.isDirectionalLight){const b=i.directional[f];b.direction.setFromMatrixPosition(M.matrixWorld),n.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(n),b.direction.transformDirection(p),f++}else if(M.isSpotLight){const b=i.spot[m];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(p),b.direction.setFromMatrixPosition(M.matrixWorld),n.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(n),b.direction.transformDirection(p),m++}else if(M.isRectAreaLight){const b=i.rectArea[g];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(p),a.identity(),r.copy(M.matrixWorld),r.premultiply(p),a.extractRotation(r),b.halfWidth.set(M.width*.5,0,0),b.halfHeight.set(0,M.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),g++}else if(M.isPointLight){const b=i.point[u];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(p),u++}else if(M.isHemisphereLight){const b=i.hemi[_];b.direction.setFromMatrixPosition(M.matrixWorld),b.direction.transformDirection(p),_++}}}return{setup:o,setupView:l,state:i}}function oh(s){const t=new s_(s),e=[],i=[];function n(h){c.camera=h,e.length=0,i.length=0}function r(h){e.push(h)}function a(h){i.push(h)}function o(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:n,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function r_(s){let t=new WeakMap;function e(n,r=0){const a=t.get(n);let o;return a===void 0?(o=new oh(s),t.set(n,[o])):r>=a.length?(o=new oh(s),a.push(o)):o=a[r],o}function i(){t=new WeakMap}return{get:e,dispose:i}}class a_ extends Hn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Bu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class o_ extends Hn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const l_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,c_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function h_(s,t,e){let i=new Ll;const n=new Lt,r=new Lt,a=new ge,o=new a_({depthPacking:Gu}),l=new o_,c={},h=e.maxTextureSize,f={[Qi]:je,[je]:Qi,[_e]:_e},u=new Ne({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Lt},radius:{value:4}},vertexShader:l_,fragmentShader:c_}),m=u.clone();m.defines.HORIZONTAL_PASS=1;const g=new He;g.setAttribute("position",new Pe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new ft(g,u),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=uf;let d=this.type;this.render=function(T,E,C){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||T.length===0)return;const I=s.getRenderTarget(),v=s.getActiveCubeFace(),S=s.getActiveMipmapLevel(),U=s.state;U.setBlending($i),U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const k=d!==Xi&&this.type===Xi,V=d===Xi&&this.type!==Xi;for(let K=0,W=T.length;K<W;K++){const Q=T[K],X=Q.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",Q,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;n.copy(X.mapSize);const dt=X.getFrameExtents();if(n.multiply(dt),r.copy(X.mapSize),(n.x>h||n.y>h)&&(n.x>h&&(r.x=Math.floor(h/dt.x),n.x=r.x*dt.x,X.mapSize.x=r.x),n.y>h&&(r.y=Math.floor(h/dt.y),n.y=r.y*dt.y,X.mapSize.y=r.y)),X.map===null||k===!0||V===!0){const gt=this.type!==Xi?{minFilter:Ye,magFilter:Ye}:{};X.map!==null&&X.map.dispose(),X.map=new Mi(n.x,n.y,gt),X.map.texture.name=Q.name+".shadowMap",X.camera.updateProjectionMatrix()}s.setRenderTarget(X.map),s.clear();const lt=X.getViewportCount();for(let gt=0;gt<lt;gt++){const Ft=X.getViewport(gt);a.set(r.x*Ft.x,r.y*Ft.y,r.x*Ft.z,r.y*Ft.w),U.viewport(a),X.updateMatrices(Q,gt),i=X.getFrustum(),b(E,C,X.camera,Q,this.type)}X.isPointLightShadow!==!0&&this.type===Xi&&x(X,C),X.needsUpdate=!1}d=this.type,p.needsUpdate=!1,s.setRenderTarget(I,v,S)};function x(T,E){const C=t.update(_);u.defines.VSM_SAMPLES!==T.blurSamples&&(u.defines.VSM_SAMPLES=T.blurSamples,m.defines.VSM_SAMPLES=T.blurSamples,u.needsUpdate=!0,m.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Mi(n.x,n.y)),u.uniforms.shadow_pass.value=T.map.texture,u.uniforms.resolution.value=T.mapSize,u.uniforms.radius.value=T.radius,s.setRenderTarget(T.mapPass),s.clear(),s.renderBufferDirect(E,null,C,u,_,null),m.uniforms.shadow_pass.value=T.mapPass.texture,m.uniforms.resolution.value=T.mapSize,m.uniforms.radius.value=T.radius,s.setRenderTarget(T.map),s.clear(),s.renderBufferDirect(E,null,C,m,_,null)}function M(T,E,C,I){let v=null;const S=C.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(S!==void 0)v=S;else if(v=C.isPointLight===!0?l:o,s.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const U=v.uuid,k=E.uuid;let V=c[U];V===void 0&&(V={},c[U]=V);let K=V[k];K===void 0&&(K=v.clone(),V[k]=K,E.addEventListener("dispose",P)),v=K}if(v.visible=E.visible,v.wireframe=E.wireframe,I===Xi?v.side=E.shadowSide!==null?E.shadowSide:E.side:v.side=E.shadowSide!==null?E.shadowSide:f[E.side],v.alphaMap=E.alphaMap,v.alphaTest=E.alphaTest,v.map=E.map,v.clipShadows=E.clipShadows,v.clippingPlanes=E.clippingPlanes,v.clipIntersection=E.clipIntersection,v.displacementMap=E.displacementMap,v.displacementScale=E.displacementScale,v.displacementBias=E.displacementBias,v.wireframeLinewidth=E.wireframeLinewidth,v.linewidth=E.linewidth,C.isPointLight===!0&&v.isMeshDistanceMaterial===!0){const U=s.properties.get(v);U.light=C}return v}function b(T,E,C,I,v){if(T.visible===!1)return;if(T.layers.test(E.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&v===Xi)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,T.matrixWorld);const k=t.update(T),V=T.material;if(Array.isArray(V)){const K=k.groups;for(let W=0,Q=K.length;W<Q;W++){const X=K[W],dt=V[X.materialIndex];if(dt&&dt.visible){const lt=M(T,dt,I,v);T.onBeforeShadow(s,T,E,C,k,lt,X),s.renderBufferDirect(C,null,k,lt,T,X),T.onAfterShadow(s,T,E,C,k,lt,X)}}}else if(V.visible){const K=M(T,V,I,v);T.onBeforeShadow(s,T,E,C,k,K,null),s.renderBufferDirect(C,null,k,K,T,null),T.onAfterShadow(s,T,E,C,k,K,null)}}const U=T.children;for(let k=0,V=U.length;k<V;k++)b(U[k],E,C,I,v)}function P(T){T.target.removeEventListener("dispose",P);for(const C in c){const I=c[C],v=T.target.uuid;v in I&&(I[v].dispose(),delete I[v])}}}const f_={[Io]:Lo,[Do]:ko,[Uo]:Fo,[xs]:No,[Lo]:Io,[ko]:Do,[Fo]:Uo,[No]:xs};function u_(s){function t(){let N=!1;const yt=new ge;let j=null;const nt=new ge(0,0,0,0);return{setMask:function(vt){j!==vt&&!N&&(s.colorMask(vt,vt,vt,vt),j=vt)},setLocked:function(vt){N=vt},setClear:function(vt,bt,re,Ie,si){si===!0&&(vt*=Ie,bt*=Ie,re*=Ie),yt.set(vt,bt,re,Ie),nt.equals(yt)===!1&&(s.clearColor(vt,bt,re,Ie),nt.copy(yt))},reset:function(){N=!1,j=null,nt.set(-1,0,0,0)}}}function e(){let N=!1,yt=!1,j=null,nt=null,vt=null;return{setReversed:function(bt){yt=bt},setTest:function(bt){bt?at(s.DEPTH_TEST):ut(s.DEPTH_TEST)},setMask:function(bt){j!==bt&&!N&&(s.depthMask(bt),j=bt)},setFunc:function(bt){if(yt&&(bt=f_[bt]),nt!==bt){switch(bt){case Io:s.depthFunc(s.NEVER);break;case Lo:s.depthFunc(s.ALWAYS);break;case Do:s.depthFunc(s.LESS);break;case xs:s.depthFunc(s.LEQUAL);break;case Uo:s.depthFunc(s.EQUAL);break;case No:s.depthFunc(s.GEQUAL);break;case ko:s.depthFunc(s.GREATER);break;case Fo:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}nt=bt}},setLocked:function(bt){N=bt},setClear:function(bt){vt!==bt&&(s.clearDepth(bt),vt=bt)},reset:function(){N=!1,j=null,nt=null,vt=null}}}function i(){let N=!1,yt=null,j=null,nt=null,vt=null,bt=null,re=null,Ie=null,si=null;return{setTest:function(ce){N||(ce?at(s.STENCIL_TEST):ut(s.STENCIL_TEST))},setMask:function(ce){yt!==ce&&!N&&(s.stencilMask(ce),yt=ce)},setFunc:function(ce,ri,Fi){(j!==ce||nt!==ri||vt!==Fi)&&(s.stencilFunc(ce,ri,Fi),j=ce,nt=ri,vt=Fi)},setOp:function(ce,ri,Fi){(bt!==ce||re!==ri||Ie!==Fi)&&(s.stencilOp(ce,ri,Fi),bt=ce,re=ri,Ie=Fi)},setLocked:function(ce){N=ce},setClear:function(ce){si!==ce&&(s.clearStencil(ce),si=ce)},reset:function(){N=!1,yt=null,j=null,nt=null,vt=null,bt=null,re=null,Ie=null,si=null}}}const n=new t,r=new e,a=new i,o=new WeakMap,l=new WeakMap;let c={},h={},f=new WeakMap,u=[],m=null,g=!1,_=null,p=null,d=null,x=null,M=null,b=null,P=null,T=new pt(0,0,0),E=0,C=!1,I=null,v=null,S=null,U=null,k=null;const V=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let K=!1,W=0;const Q=s.getParameter(s.VERSION);Q.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(Q)[1]),K=W>=1):Q.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),K=W>=2);let X=null,dt={};const lt=s.getParameter(s.SCISSOR_BOX),gt=s.getParameter(s.VIEWPORT),Ft=new ge().fromArray(lt),st=new ge().fromArray(gt);function H(N,yt,j,nt){const vt=new Uint8Array(4),bt=s.createTexture();s.bindTexture(N,bt),s.texParameteri(N,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(N,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let re=0;re<j;re++)N===s.TEXTURE_3D||N===s.TEXTURE_2D_ARRAY?s.texImage3D(yt,0,s.RGBA,1,1,nt,0,s.RGBA,s.UNSIGNED_BYTE,vt):s.texImage2D(yt+re,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,vt);return bt}const tt={};tt[s.TEXTURE_2D]=H(s.TEXTURE_2D,s.TEXTURE_2D,1),tt[s.TEXTURE_CUBE_MAP]=H(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),tt[s.TEXTURE_2D_ARRAY]=H(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),tt[s.TEXTURE_3D]=H(s.TEXTURE_3D,s.TEXTURE_3D,1,1),n.setClear(0,0,0,1),r.setClear(1),a.setClear(0),at(s.DEPTH_TEST),r.setFunc(xs),Jt(!1),F(gc),at(s.CULL_FACE),D($i);function at(N){c[N]!==!0&&(s.enable(N),c[N]=!0)}function ut(N){c[N]!==!1&&(s.disable(N),c[N]=!1)}function St(N,yt){return h[N]!==yt?(s.bindFramebuffer(N,yt),h[N]=yt,N===s.DRAW_FRAMEBUFFER&&(h[s.FRAMEBUFFER]=yt),N===s.FRAMEBUFFER&&(h[s.DRAW_FRAMEBUFFER]=yt),!0):!1}function Mt(N,yt){let j=u,nt=!1;if(N){j=f.get(yt),j===void 0&&(j=[],f.set(yt,j));const vt=N.textures;if(j.length!==vt.length||j[0]!==s.COLOR_ATTACHMENT0){for(let bt=0,re=vt.length;bt<re;bt++)j[bt]=s.COLOR_ATTACHMENT0+bt;j.length=vt.length,nt=!0}}else j[0]!==s.BACK&&(j[0]=s.BACK,nt=!0);nt&&s.drawBuffers(j)}function Gt(N){return m!==N?(s.useProgram(N),m=N,!0):!1}const Kt={[Pn]:s.FUNC_ADD,[xu]:s.FUNC_SUBTRACT,[Mu]:s.FUNC_REVERSE_SUBTRACT};Kt[yu]=s.MIN,Kt[bu]=s.MAX;const $t={[Su]:s.ZERO,[wu]:s.ONE,[Tu]:s.SRC_COLOR,[Co]:s.SRC_ALPHA,[Iu]:s.SRC_ALPHA_SATURATE,[Cu]:s.DST_COLOR,[Au]:s.DST_ALPHA,[Eu]:s.ONE_MINUS_SRC_COLOR,[Po]:s.ONE_MINUS_SRC_ALPHA,[Pu]:s.ONE_MINUS_DST_COLOR,[Ru]:s.ONE_MINUS_DST_ALPHA,[Lu]:s.CONSTANT_COLOR,[Du]:s.ONE_MINUS_CONSTANT_COLOR,[Uu]:s.CONSTANT_ALPHA,[Nu]:s.ONE_MINUS_CONSTANT_ALPHA};function D(N,yt,j,nt,vt,bt,re,Ie,si,ce){if(N===$i){g===!0&&(ut(s.BLEND),g=!1);return}if(g===!1&&(at(s.BLEND),g=!0),N!==vu){if(N!==_||ce!==C){if((p!==Pn||M!==Pn)&&(s.blendEquation(s.FUNC_ADD),p=Pn,M=Pn),ce)switch(N){case Fn:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case _i:s.blendFunc(s.ONE,s.ONE);break;case _c:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case vc:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case Fn:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case _i:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case _c:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case vc:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}d=null,x=null,b=null,P=null,T.set(0,0,0),E=0,_=N,C=ce}return}vt=vt||yt,bt=bt||j,re=re||nt,(yt!==p||vt!==M)&&(s.blendEquationSeparate(Kt[yt],Kt[vt]),p=yt,M=vt),(j!==d||nt!==x||bt!==b||re!==P)&&(s.blendFuncSeparate($t[j],$t[nt],$t[bt],$t[re]),d=j,x=nt,b=bt,P=re),(Ie.equals(T)===!1||si!==E)&&(s.blendColor(Ie.r,Ie.g,Ie.b,si),T.copy(Ie),E=si),_=N,C=!1}function Ue(N,yt){N.side===_e?ut(s.CULL_FACE):at(s.CULL_FACE);let j=N.side===je;yt&&(j=!j),Jt(j),N.blending===Fn&&N.transparent===!1?D($i):D(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),r.setFunc(N.depthFunc),r.setTest(N.depthTest),r.setMask(N.depthWrite),n.setMask(N.colorWrite);const nt=N.stencilWrite;a.setTest(nt),nt&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),ot(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?at(s.SAMPLE_ALPHA_TO_COVERAGE):ut(s.SAMPLE_ALPHA_TO_COVERAGE)}function Jt(N){I!==N&&(N?s.frontFace(s.CW):s.frontFace(s.CCW),I=N)}function F(N){N!==gu?(at(s.CULL_FACE),N!==v&&(N===gc?s.cullFace(s.BACK):N===_u?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):ut(s.CULL_FACE),v=N}function Z(N){N!==S&&(K&&s.lineWidth(N),S=N)}function ot(N,yt,j){N?(at(s.POLYGON_OFFSET_FILL),(U!==yt||k!==j)&&(s.polygonOffset(yt,j),U=yt,k=j)):ut(s.POLYGON_OFFSET_FILL)}function it(N){N?at(s.SCISSOR_TEST):ut(s.SCISSOR_TEST)}function A(N){N===void 0&&(N=s.TEXTURE0+V-1),X!==N&&(s.activeTexture(N),X=N)}function y(N,yt,j){j===void 0&&(X===null?j=s.TEXTURE0+V-1:j=X);let nt=dt[j];nt===void 0&&(nt={type:void 0,texture:void 0},dt[j]=nt),(nt.type!==N||nt.texture!==yt)&&(X!==j&&(s.activeTexture(j),X=j),s.bindTexture(N,yt||tt[N]),nt.type=N,nt.texture=yt)}function O(){const N=dt[X];N!==void 0&&N.type!==void 0&&(s.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function $(){try{s.compressedTexImage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function et(){try{s.compressedTexImage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function J(){try{s.texSubImage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Rt(){try{s.texSubImage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function _t(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Tt(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function le(){try{s.texStorage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ct(){try{s.texStorage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Et(){try{s.texImage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Vt(){try{s.texImage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Wt(N){Ft.equals(N)===!1&&(s.scissor(N.x,N.y,N.z,N.w),Ft.copy(N))}function At(N){st.equals(N)===!1&&(s.viewport(N.x,N.y,N.z,N.w),st.copy(N))}function ie(N,yt){let j=l.get(yt);j===void 0&&(j=new WeakMap,l.set(yt,j));let nt=j.get(N);nt===void 0&&(nt=s.getUniformBlockIndex(yt,N.name),j.set(N,nt))}function qt(N,yt){const nt=l.get(yt).get(N);o.get(yt)!==nt&&(s.uniformBlockBinding(yt,nt,N.__bindingPointIndex),o.set(yt,nt))}function ve(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),c={},X=null,dt={},h={},f=new WeakMap,u=[],m=null,g=!1,_=null,p=null,d=null,x=null,M=null,b=null,P=null,T=new pt(0,0,0),E=0,C=!1,I=null,v=null,S=null,U=null,k=null,Ft.set(0,0,s.canvas.width,s.canvas.height),st.set(0,0,s.canvas.width,s.canvas.height),n.reset(),r.reset(),a.reset()}return{buffers:{color:n,depth:r,stencil:a},enable:at,disable:ut,bindFramebuffer:St,drawBuffers:Mt,useProgram:Gt,setBlending:D,setMaterial:Ue,setFlipSided:Jt,setCullFace:F,setLineWidth:Z,setPolygonOffset:ot,setScissorTest:it,activeTexture:A,bindTexture:y,unbindTexture:O,compressedTexImage2D:$,compressedTexImage3D:et,texImage2D:Et,texImage3D:Vt,updateUBOMapping:ie,uniformBlockBinding:qt,texStorage2D:le,texStorage3D:ct,texSubImage2D:J,texSubImage3D:Rt,compressedTexSubImage2D:_t,compressedTexSubImage3D:Tt,scissor:Wt,viewport:At,reset:ve}}function lh(s,t,e,i){const n=d_(i);switch(e){case wf:return s*t;case Ef:return s*t;case Af:return s*t*2;case _a:return s*t/n.components*n.byteLength;case El:return s*t/n.components*n.byteLength;case Rf:return s*t*2/n.components*n.byteLength;case Al:return s*t*2/n.components*n.byteLength;case Tf:return s*t*3/n.components*n.byteLength;case Pi:return s*t*4/n.components*n.byteLength;case Rl:return s*t*4/n.components*n.byteLength;case $r:case jr:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Zr:case Jr:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Ho:case Wo:return Math.max(s,16)*Math.max(t,8)/4;case Go:case Vo:return Math.max(s,8)*Math.max(t,8)/2;case Xo:case qo:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Yo:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Ko:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case $o:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case jo:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case Zo:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case Jo:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case Qo:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case tl:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case el:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case il:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case nl:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case sl:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case rl:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case al:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case ol:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case Qr:case ll:case cl:return Math.ceil(s/4)*Math.ceil(t/4)*16;case Cf:case hl:return Math.ceil(s/4)*Math.ceil(t/4)*8;case fl:case ul:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function d_(s){switch(s){case ki:case yf:return{byteLength:1,components:1};case ir:case bf:case Ni:return{byteLength:2,components:1};case wl:case Tl:return{byteLength:2,components:4};case zn:case Sl:case Ui:return{byteLength:4,components:1};case Sf:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}function p_(s,t,e,i,n,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Lt,h=new WeakMap;let f;const u=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,y){return m?new OffscreenCanvas(A,y):ha("canvas")}function _(A,y,O){let $=1;const et=it(A);if((et.width>O||et.height>O)&&($=O/Math.max(et.width,et.height)),$<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const J=Math.floor($*et.width),Rt=Math.floor($*et.height);f===void 0&&(f=g(J,Rt));const _t=y?g(J,Rt):f;return _t.width=J,_t.height=Rt,_t.getContext("2d").drawImage(A,0,0,J,Rt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+et.width+"x"+et.height+") to ("+J+"x"+Rt+")."),_t}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+et.width+"x"+et.height+")."),A;return A}function p(A){return A.generateMipmaps&&A.minFilter!==Ye&&A.minFilter!==vi}function d(A){s.generateMipmap(A)}function x(A,y,O,$,et=!1){if(A!==null){if(s[A]!==void 0)return s[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let J=y;if(y===s.RED&&(O===s.FLOAT&&(J=s.R32F),O===s.HALF_FLOAT&&(J=s.R16F),O===s.UNSIGNED_BYTE&&(J=s.R8)),y===s.RED_INTEGER&&(O===s.UNSIGNED_BYTE&&(J=s.R8UI),O===s.UNSIGNED_SHORT&&(J=s.R16UI),O===s.UNSIGNED_INT&&(J=s.R32UI),O===s.BYTE&&(J=s.R8I),O===s.SHORT&&(J=s.R16I),O===s.INT&&(J=s.R32I)),y===s.RG&&(O===s.FLOAT&&(J=s.RG32F),O===s.HALF_FLOAT&&(J=s.RG16F),O===s.UNSIGNED_BYTE&&(J=s.RG8)),y===s.RG_INTEGER&&(O===s.UNSIGNED_BYTE&&(J=s.RG8UI),O===s.UNSIGNED_SHORT&&(J=s.RG16UI),O===s.UNSIGNED_INT&&(J=s.RG32UI),O===s.BYTE&&(J=s.RG8I),O===s.SHORT&&(J=s.RG16I),O===s.INT&&(J=s.RG32I)),y===s.RGB_INTEGER&&(O===s.UNSIGNED_BYTE&&(J=s.RGB8UI),O===s.UNSIGNED_SHORT&&(J=s.RGB16UI),O===s.UNSIGNED_INT&&(J=s.RGB32UI),O===s.BYTE&&(J=s.RGB8I),O===s.SHORT&&(J=s.RGB16I),O===s.INT&&(J=s.RGB32I)),y===s.RGBA_INTEGER&&(O===s.UNSIGNED_BYTE&&(J=s.RGBA8UI),O===s.UNSIGNED_SHORT&&(J=s.RGBA16UI),O===s.UNSIGNED_INT&&(J=s.RGBA32UI),O===s.BYTE&&(J=s.RGBA8I),O===s.SHORT&&(J=s.RGBA16I),O===s.INT&&(J=s.RGBA32I)),y===s.RGB&&O===s.UNSIGNED_INT_5_9_9_9_REV&&(J=s.RGB9_E5),y===s.RGBA){const Rt=et?aa:fe.getTransfer($);O===s.FLOAT&&(J=s.RGBA32F),O===s.HALF_FLOAT&&(J=s.RGBA16F),O===s.UNSIGNED_BYTE&&(J=Rt===xe?s.SRGB8_ALPHA8:s.RGBA8),O===s.UNSIGNED_SHORT_4_4_4_4&&(J=s.RGBA4),O===s.UNSIGNED_SHORT_5_5_5_1&&(J=s.RGB5_A1)}return(J===s.R16F||J===s.R32F||J===s.RG16F||J===s.RG32F||J===s.RGBA16F||J===s.RGBA32F)&&t.get("EXT_color_buffer_float"),J}function M(A,y){let O;return A?y===null||y===zn||y===bs?O=s.DEPTH24_STENCIL8:y===Ui?O=s.DEPTH32F_STENCIL8:y===ir&&(O=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===zn||y===bs?O=s.DEPTH_COMPONENT24:y===Ui?O=s.DEPTH_COMPONENT32F:y===ir&&(O=s.DEPTH_COMPONENT16),O}function b(A,y){return p(A)===!0||A.isFramebufferTexture&&A.minFilter!==Ye&&A.minFilter!==vi?Math.log2(Math.max(y.width,y.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?y.mipmaps.length:1}function P(A){const y=A.target;y.removeEventListener("dispose",P),E(y),y.isVideoTexture&&h.delete(y)}function T(A){const y=A.target;y.removeEventListener("dispose",T),I(y)}function E(A){const y=i.get(A);if(y.__webglInit===void 0)return;const O=A.source,$=u.get(O);if($){const et=$[y.__cacheKey];et.usedTimes--,et.usedTimes===0&&C(A),Object.keys($).length===0&&u.delete(O)}i.remove(A)}function C(A){const y=i.get(A);s.deleteTexture(y.__webglTexture);const O=A.source,$=u.get(O);delete $[y.__cacheKey],a.memory.textures--}function I(A){const y=i.get(A);if(A.depthTexture&&A.depthTexture.dispose(),A.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(y.__webglFramebuffer[$]))for(let et=0;et<y.__webglFramebuffer[$].length;et++)s.deleteFramebuffer(y.__webglFramebuffer[$][et]);else s.deleteFramebuffer(y.__webglFramebuffer[$]);y.__webglDepthbuffer&&s.deleteRenderbuffer(y.__webglDepthbuffer[$])}else{if(Array.isArray(y.__webglFramebuffer))for(let $=0;$<y.__webglFramebuffer.length;$++)s.deleteFramebuffer(y.__webglFramebuffer[$]);else s.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&s.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&s.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let $=0;$<y.__webglColorRenderbuffer.length;$++)y.__webglColorRenderbuffer[$]&&s.deleteRenderbuffer(y.__webglColorRenderbuffer[$]);y.__webglDepthRenderbuffer&&s.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const O=A.textures;for(let $=0,et=O.length;$<et;$++){const J=i.get(O[$]);J.__webglTexture&&(s.deleteTexture(J.__webglTexture),a.memory.textures--),i.remove(O[$])}i.remove(A)}let v=0;function S(){v=0}function U(){const A=v;return A>=n.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+n.maxTextures),v+=1,A}function k(A){const y=[];return y.push(A.wrapS),y.push(A.wrapT),y.push(A.wrapR||0),y.push(A.magFilter),y.push(A.minFilter),y.push(A.anisotropy),y.push(A.internalFormat),y.push(A.format),y.push(A.type),y.push(A.generateMipmaps),y.push(A.premultiplyAlpha),y.push(A.flipY),y.push(A.unpackAlignment),y.push(A.colorSpace),y.join()}function V(A,y){const O=i.get(A);if(A.isVideoTexture&&Z(A),A.isRenderTargetTexture===!1&&A.version>0&&O.__version!==A.version){const $=A.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{st(O,A,y);return}}e.bindTexture(s.TEXTURE_2D,O.__webglTexture,s.TEXTURE0+y)}function K(A,y){const O=i.get(A);if(A.version>0&&O.__version!==A.version){st(O,A,y);return}e.bindTexture(s.TEXTURE_2D_ARRAY,O.__webglTexture,s.TEXTURE0+y)}function W(A,y){const O=i.get(A);if(A.version>0&&O.__version!==A.version){st(O,A,y);return}e.bindTexture(s.TEXTURE_3D,O.__webglTexture,s.TEXTURE0+y)}function Q(A,y){const O=i.get(A);if(A.version>0&&O.__version!==A.version){H(O,A,y);return}e.bindTexture(s.TEXTURE_CUBE_MAP,O.__webglTexture,s.TEXTURE0+y)}const X={[er]:s.REPEAT,[Nn]:s.CLAMP_TO_EDGE,[Bo]:s.MIRRORED_REPEAT},dt={[Ye]:s.NEAREST,[zu]:s.NEAREST_MIPMAP_NEAREST,[Ks]:s.NEAREST_MIPMAP_LINEAR,[vi]:s.LINEAR,[Ra]:s.LINEAR_MIPMAP_NEAREST,[un]:s.LINEAR_MIPMAP_LINEAR},lt={[Vu]:s.NEVER,[$u]:s.ALWAYS,[Wu]:s.LESS,[Pf]:s.LEQUAL,[Xu]:s.EQUAL,[Ku]:s.GEQUAL,[qu]:s.GREATER,[Yu]:s.NOTEQUAL};function gt(A,y){if(y.type===Ui&&t.has("OES_texture_float_linear")===!1&&(y.magFilter===vi||y.magFilter===Ra||y.magFilter===Ks||y.magFilter===un||y.minFilter===vi||y.minFilter===Ra||y.minFilter===Ks||y.minFilter===un)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(A,s.TEXTURE_WRAP_S,X[y.wrapS]),s.texParameteri(A,s.TEXTURE_WRAP_T,X[y.wrapT]),(A===s.TEXTURE_3D||A===s.TEXTURE_2D_ARRAY)&&s.texParameteri(A,s.TEXTURE_WRAP_R,X[y.wrapR]),s.texParameteri(A,s.TEXTURE_MAG_FILTER,dt[y.magFilter]),s.texParameteri(A,s.TEXTURE_MIN_FILTER,dt[y.minFilter]),y.compareFunction&&(s.texParameteri(A,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(A,s.TEXTURE_COMPARE_FUNC,lt[y.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===Ye||y.minFilter!==Ks&&y.minFilter!==un||y.type===Ui&&t.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||i.get(y).__currentAnisotropy){const O=t.get("EXT_texture_filter_anisotropic");s.texParameterf(A,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,n.getMaxAnisotropy())),i.get(y).__currentAnisotropy=y.anisotropy}}}function Ft(A,y){let O=!1;A.__webglInit===void 0&&(A.__webglInit=!0,y.addEventListener("dispose",P));const $=y.source;let et=u.get($);et===void 0&&(et={},u.set($,et));const J=k(y);if(J!==A.__cacheKey){et[J]===void 0&&(et[J]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,O=!0),et[J].usedTimes++;const Rt=et[A.__cacheKey];Rt!==void 0&&(et[A.__cacheKey].usedTimes--,Rt.usedTimes===0&&C(y)),A.__cacheKey=J,A.__webglTexture=et[J].texture}return O}function st(A,y,O){let $=s.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&($=s.TEXTURE_2D_ARRAY),y.isData3DTexture&&($=s.TEXTURE_3D);const et=Ft(A,y),J=y.source;e.bindTexture($,A.__webglTexture,s.TEXTURE0+O);const Rt=i.get(J);if(J.version!==Rt.__version||et===!0){e.activeTexture(s.TEXTURE0+O);const _t=fe.getPrimaries(fe.workingColorSpace),Tt=y.colorSpace===Ri?null:fe.getPrimaries(y.colorSpace),le=y.colorSpace===Ri||_t===Tt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,y.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,y.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,le);let ct=_(y.image,!1,n.maxTextureSize);ct=ot(y,ct);const Et=r.convert(y.format,y.colorSpace),Vt=r.convert(y.type);let Wt=x(y.internalFormat,Et,Vt,y.colorSpace,y.isVideoTexture);gt($,y);let At;const ie=y.mipmaps,qt=y.isVideoTexture!==!0,ve=Rt.__version===void 0||et===!0,N=J.dataReady,yt=b(y,ct);if(y.isDepthTexture)Wt=M(y.format===Ss,y.type),ve&&(qt?e.texStorage2D(s.TEXTURE_2D,1,Wt,ct.width,ct.height):e.texImage2D(s.TEXTURE_2D,0,Wt,ct.width,ct.height,0,Et,Vt,null));else if(y.isDataTexture)if(ie.length>0){qt&&ve&&e.texStorage2D(s.TEXTURE_2D,yt,Wt,ie[0].width,ie[0].height);for(let j=0,nt=ie.length;j<nt;j++)At=ie[j],qt?N&&e.texSubImage2D(s.TEXTURE_2D,j,0,0,At.width,At.height,Et,Vt,At.data):e.texImage2D(s.TEXTURE_2D,j,Wt,At.width,At.height,0,Et,Vt,At.data);y.generateMipmaps=!1}else qt?(ve&&e.texStorage2D(s.TEXTURE_2D,yt,Wt,ct.width,ct.height),N&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,ct.width,ct.height,Et,Vt,ct.data)):e.texImage2D(s.TEXTURE_2D,0,Wt,ct.width,ct.height,0,Et,Vt,ct.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){qt&&ve&&e.texStorage3D(s.TEXTURE_2D_ARRAY,yt,Wt,ie[0].width,ie[0].height,ct.depth);for(let j=0,nt=ie.length;j<nt;j++)if(At=ie[j],y.format!==Pi)if(Et!==null)if(qt){if(N)if(y.layerUpdates.size>0){const vt=lh(At.width,At.height,y.format,y.type);for(const bt of y.layerUpdates){const re=At.data.subarray(bt*vt/At.data.BYTES_PER_ELEMENT,(bt+1)*vt/At.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,j,0,0,bt,At.width,At.height,1,Et,re,0,0)}y.clearLayerUpdates()}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,j,0,0,0,At.width,At.height,ct.depth,Et,At.data,0,0)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,j,Wt,At.width,At.height,ct.depth,0,At.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else qt?N&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,j,0,0,0,At.width,At.height,ct.depth,Et,Vt,At.data):e.texImage3D(s.TEXTURE_2D_ARRAY,j,Wt,At.width,At.height,ct.depth,0,Et,Vt,At.data)}else{qt&&ve&&e.texStorage2D(s.TEXTURE_2D,yt,Wt,ie[0].width,ie[0].height);for(let j=0,nt=ie.length;j<nt;j++)At=ie[j],y.format!==Pi?Et!==null?qt?N&&e.compressedTexSubImage2D(s.TEXTURE_2D,j,0,0,At.width,At.height,Et,At.data):e.compressedTexImage2D(s.TEXTURE_2D,j,Wt,At.width,At.height,0,At.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):qt?N&&e.texSubImage2D(s.TEXTURE_2D,j,0,0,At.width,At.height,Et,Vt,At.data):e.texImage2D(s.TEXTURE_2D,j,Wt,At.width,At.height,0,Et,Vt,At.data)}else if(y.isDataArrayTexture)if(qt){if(ve&&e.texStorage3D(s.TEXTURE_2D_ARRAY,yt,Wt,ct.width,ct.height,ct.depth),N)if(y.layerUpdates.size>0){const j=lh(ct.width,ct.height,y.format,y.type);for(const nt of y.layerUpdates){const vt=ct.data.subarray(nt*j/ct.data.BYTES_PER_ELEMENT,(nt+1)*j/ct.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,nt,ct.width,ct.height,1,Et,Vt,vt)}y.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ct.width,ct.height,ct.depth,Et,Vt,ct.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,Wt,ct.width,ct.height,ct.depth,0,Et,Vt,ct.data);else if(y.isData3DTexture)qt?(ve&&e.texStorage3D(s.TEXTURE_3D,yt,Wt,ct.width,ct.height,ct.depth),N&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ct.width,ct.height,ct.depth,Et,Vt,ct.data)):e.texImage3D(s.TEXTURE_3D,0,Wt,ct.width,ct.height,ct.depth,0,Et,Vt,ct.data);else if(y.isFramebufferTexture){if(ve)if(qt)e.texStorage2D(s.TEXTURE_2D,yt,Wt,ct.width,ct.height);else{let j=ct.width,nt=ct.height;for(let vt=0;vt<yt;vt++)e.texImage2D(s.TEXTURE_2D,vt,Wt,j,nt,0,Et,Vt,null),j>>=1,nt>>=1}}else if(ie.length>0){if(qt&&ve){const j=it(ie[0]);e.texStorage2D(s.TEXTURE_2D,yt,Wt,j.width,j.height)}for(let j=0,nt=ie.length;j<nt;j++)At=ie[j],qt?N&&e.texSubImage2D(s.TEXTURE_2D,j,0,0,Et,Vt,At):e.texImage2D(s.TEXTURE_2D,j,Wt,Et,Vt,At);y.generateMipmaps=!1}else if(qt){if(ve){const j=it(ct);e.texStorage2D(s.TEXTURE_2D,yt,Wt,j.width,j.height)}N&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,Et,Vt,ct)}else e.texImage2D(s.TEXTURE_2D,0,Wt,Et,Vt,ct);p(y)&&d($),Rt.__version=J.version,y.onUpdate&&y.onUpdate(y)}A.__version=y.version}function H(A,y,O){if(y.image.length!==6)return;const $=Ft(A,y),et=y.source;e.bindTexture(s.TEXTURE_CUBE_MAP,A.__webglTexture,s.TEXTURE0+O);const J=i.get(et);if(et.version!==J.__version||$===!0){e.activeTexture(s.TEXTURE0+O);const Rt=fe.getPrimaries(fe.workingColorSpace),_t=y.colorSpace===Ri?null:fe.getPrimaries(y.colorSpace),Tt=y.colorSpace===Ri||Rt===_t?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,y.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,y.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Tt);const le=y.isCompressedTexture||y.image[0].isCompressedTexture,ct=y.image[0]&&y.image[0].isDataTexture,Et=[];for(let nt=0;nt<6;nt++)!le&&!ct?Et[nt]=_(y.image[nt],!0,n.maxCubemapSize):Et[nt]=ct?y.image[nt].image:y.image[nt],Et[nt]=ot(y,Et[nt]);const Vt=Et[0],Wt=r.convert(y.format,y.colorSpace),At=r.convert(y.type),ie=x(y.internalFormat,Wt,At,y.colorSpace),qt=y.isVideoTexture!==!0,ve=J.__version===void 0||$===!0,N=et.dataReady;let yt=b(y,Vt);gt(s.TEXTURE_CUBE_MAP,y);let j;if(le){qt&&ve&&e.texStorage2D(s.TEXTURE_CUBE_MAP,yt,ie,Vt.width,Vt.height);for(let nt=0;nt<6;nt++){j=Et[nt].mipmaps;for(let vt=0;vt<j.length;vt++){const bt=j[vt];y.format!==Pi?Wt!==null?qt?N&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,vt,0,0,bt.width,bt.height,Wt,bt.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,vt,ie,bt.width,bt.height,0,bt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):qt?N&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,vt,0,0,bt.width,bt.height,Wt,At,bt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,vt,ie,bt.width,bt.height,0,Wt,At,bt.data)}}}else{if(j=y.mipmaps,qt&&ve){j.length>0&&yt++;const nt=it(Et[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,yt,ie,nt.width,nt.height)}for(let nt=0;nt<6;nt++)if(ct){qt?N&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,Et[nt].width,Et[nt].height,Wt,At,Et[nt].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,ie,Et[nt].width,Et[nt].height,0,Wt,At,Et[nt].data);for(let vt=0;vt<j.length;vt++){const re=j[vt].image[nt].image;qt?N&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,vt+1,0,0,re.width,re.height,Wt,At,re.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,vt+1,ie,re.width,re.height,0,Wt,At,re.data)}}else{qt?N&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,Wt,At,Et[nt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,ie,Wt,At,Et[nt]);for(let vt=0;vt<j.length;vt++){const bt=j[vt];qt?N&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,vt+1,0,0,Wt,At,bt.image[nt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,vt+1,ie,Wt,At,bt.image[nt])}}}p(y)&&d(s.TEXTURE_CUBE_MAP),J.__version=et.version,y.onUpdate&&y.onUpdate(y)}A.__version=y.version}function tt(A,y,O,$,et,J){const Rt=r.convert(O.format,O.colorSpace),_t=r.convert(O.type),Tt=x(O.internalFormat,Rt,_t,O.colorSpace);if(!i.get(y).__hasExternalTextures){const ct=Math.max(1,y.width>>J),Et=Math.max(1,y.height>>J);et===s.TEXTURE_3D||et===s.TEXTURE_2D_ARRAY?e.texImage3D(et,J,Tt,ct,Et,y.depth,0,Rt,_t,null):e.texImage2D(et,J,Tt,ct,Et,0,Rt,_t,null)}e.bindFramebuffer(s.FRAMEBUFFER,A),F(y)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,$,et,i.get(O).__webglTexture,0,Jt(y)):(et===s.TEXTURE_2D||et>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&et<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,$,et,i.get(O).__webglTexture,J),e.bindFramebuffer(s.FRAMEBUFFER,null)}function at(A,y,O){if(s.bindRenderbuffer(s.RENDERBUFFER,A),y.depthBuffer){const $=y.depthTexture,et=$&&$.isDepthTexture?$.type:null,J=M(y.stencilBuffer,et),Rt=y.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,_t=Jt(y);F(y)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,_t,J,y.width,y.height):O?s.renderbufferStorageMultisample(s.RENDERBUFFER,_t,J,y.width,y.height):s.renderbufferStorage(s.RENDERBUFFER,J,y.width,y.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Rt,s.RENDERBUFFER,A)}else{const $=y.textures;for(let et=0;et<$.length;et++){const J=$[et],Rt=r.convert(J.format,J.colorSpace),_t=r.convert(J.type),Tt=x(J.internalFormat,Rt,_t,J.colorSpace),le=Jt(y);O&&F(y)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,le,Tt,y.width,y.height):F(y)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,le,Tt,y.width,y.height):s.renderbufferStorage(s.RENDERBUFFER,Tt,y.width,y.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function ut(A,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,A),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(y.depthTexture).__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),V(y.depthTexture,0);const $=i.get(y.depthTexture).__webglTexture,et=Jt(y);if(y.depthTexture.format===ms)F(y)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,$,0,et):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,$,0);else if(y.depthTexture.format===Ss)F(y)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,$,0,et):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,$,0);else throw new Error("Unknown depthTexture format")}function St(A){const y=i.get(A),O=A.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==A.depthTexture){const $=A.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),$){const et=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,$.removeEventListener("dispose",et)};$.addEventListener("dispose",et),y.__depthDisposeCallback=et}y.__boundDepthTexture=$}if(A.depthTexture&&!y.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");ut(y.__webglFramebuffer,A)}else if(O){y.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(e.bindFramebuffer(s.FRAMEBUFFER,y.__webglFramebuffer[$]),y.__webglDepthbuffer[$]===void 0)y.__webglDepthbuffer[$]=s.createRenderbuffer(),at(y.__webglDepthbuffer[$],A,!1);else{const et=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,J=y.__webglDepthbuffer[$];s.bindRenderbuffer(s.RENDERBUFFER,J),s.framebufferRenderbuffer(s.FRAMEBUFFER,et,s.RENDERBUFFER,J)}}else if(e.bindFramebuffer(s.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=s.createRenderbuffer(),at(y.__webglDepthbuffer,A,!1);else{const $=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,et=y.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,et),s.framebufferRenderbuffer(s.FRAMEBUFFER,$,s.RENDERBUFFER,et)}e.bindFramebuffer(s.FRAMEBUFFER,null)}function Mt(A,y,O){const $=i.get(A);y!==void 0&&tt($.__webglFramebuffer,A,A.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),O!==void 0&&St(A)}function Gt(A){const y=A.texture,O=i.get(A),$=i.get(y);A.addEventListener("dispose",T);const et=A.textures,J=A.isWebGLCubeRenderTarget===!0,Rt=et.length>1;if(Rt||($.__webglTexture===void 0&&($.__webglTexture=s.createTexture()),$.__version=y.version,a.memory.textures++),J){O.__webglFramebuffer=[];for(let _t=0;_t<6;_t++)if(y.mipmaps&&y.mipmaps.length>0){O.__webglFramebuffer[_t]=[];for(let Tt=0;Tt<y.mipmaps.length;Tt++)O.__webglFramebuffer[_t][Tt]=s.createFramebuffer()}else O.__webglFramebuffer[_t]=s.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){O.__webglFramebuffer=[];for(let _t=0;_t<y.mipmaps.length;_t++)O.__webglFramebuffer[_t]=s.createFramebuffer()}else O.__webglFramebuffer=s.createFramebuffer();if(Rt)for(let _t=0,Tt=et.length;_t<Tt;_t++){const le=i.get(et[_t]);le.__webglTexture===void 0&&(le.__webglTexture=s.createTexture(),a.memory.textures++)}if(A.samples>0&&F(A)===!1){O.__webglMultisampledFramebuffer=s.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let _t=0;_t<et.length;_t++){const Tt=et[_t];O.__webglColorRenderbuffer[_t]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,O.__webglColorRenderbuffer[_t]);const le=r.convert(Tt.format,Tt.colorSpace),ct=r.convert(Tt.type),Et=x(Tt.internalFormat,le,ct,Tt.colorSpace,A.isXRRenderTarget===!0),Vt=Jt(A);s.renderbufferStorageMultisample(s.RENDERBUFFER,Vt,Et,A.width,A.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+_t,s.RENDERBUFFER,O.__webglColorRenderbuffer[_t])}s.bindRenderbuffer(s.RENDERBUFFER,null),A.depthBuffer&&(O.__webglDepthRenderbuffer=s.createRenderbuffer(),at(O.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(J){e.bindTexture(s.TEXTURE_CUBE_MAP,$.__webglTexture),gt(s.TEXTURE_CUBE_MAP,y);for(let _t=0;_t<6;_t++)if(y.mipmaps&&y.mipmaps.length>0)for(let Tt=0;Tt<y.mipmaps.length;Tt++)tt(O.__webglFramebuffer[_t][Tt],A,y,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+_t,Tt);else tt(O.__webglFramebuffer[_t],A,y,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+_t,0);p(y)&&d(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Rt){for(let _t=0,Tt=et.length;_t<Tt;_t++){const le=et[_t],ct=i.get(le);e.bindTexture(s.TEXTURE_2D,ct.__webglTexture),gt(s.TEXTURE_2D,le),tt(O.__webglFramebuffer,A,le,s.COLOR_ATTACHMENT0+_t,s.TEXTURE_2D,0),p(le)&&d(s.TEXTURE_2D)}e.unbindTexture()}else{let _t=s.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(_t=A.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(_t,$.__webglTexture),gt(_t,y),y.mipmaps&&y.mipmaps.length>0)for(let Tt=0;Tt<y.mipmaps.length;Tt++)tt(O.__webglFramebuffer[Tt],A,y,s.COLOR_ATTACHMENT0,_t,Tt);else tt(O.__webglFramebuffer,A,y,s.COLOR_ATTACHMENT0,_t,0);p(y)&&d(_t),e.unbindTexture()}A.depthBuffer&&St(A)}function Kt(A){const y=A.textures;for(let O=0,$=y.length;O<$;O++){const et=y[O];if(p(et)){const J=A.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,Rt=i.get(et).__webglTexture;e.bindTexture(J,Rt),d(J),e.unbindTexture()}}}const $t=[],D=[];function Ue(A){if(A.samples>0){if(F(A)===!1){const y=A.textures,O=A.width,$=A.height;let et=s.COLOR_BUFFER_BIT;const J=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Rt=i.get(A),_t=y.length>1;if(_t)for(let Tt=0;Tt<y.length;Tt++)e.bindFramebuffer(s.FRAMEBUFFER,Rt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Tt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,Rt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Tt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,Rt.__webglMultisampledFramebuffer),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,Rt.__webglFramebuffer);for(let Tt=0;Tt<y.length;Tt++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(et|=s.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(et|=s.STENCIL_BUFFER_BIT)),_t){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Rt.__webglColorRenderbuffer[Tt]);const le=i.get(y[Tt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,le,0)}s.blitFramebuffer(0,0,O,$,0,0,O,$,et,s.NEAREST),l===!0&&($t.length=0,D.length=0,$t.push(s.COLOR_ATTACHMENT0+Tt),A.depthBuffer&&A.resolveDepthBuffer===!1&&($t.push(J),D.push(J),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,D)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,$t))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),_t)for(let Tt=0;Tt<y.length;Tt++){e.bindFramebuffer(s.FRAMEBUFFER,Rt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Tt,s.RENDERBUFFER,Rt.__webglColorRenderbuffer[Tt]);const le=i.get(y[Tt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,Rt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Tt,s.TEXTURE_2D,le,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,Rt.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){const y=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[y])}}}function Jt(A){return Math.min(n.maxSamples,A.samples)}function F(A){const y=i.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function Z(A){const y=a.render.frame;h.get(A)!==y&&(h.set(A,y),A.update())}function ot(A,y){const O=A.colorSpace,$=A.format,et=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||O!==tn&&O!==Ri&&(fe.getTransfer(O)===xe?($!==Pi||et!==ki)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),y}function it(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=U,this.resetTextureUnits=S,this.setTexture2D=V,this.setTexture2DArray=K,this.setTexture3D=W,this.setTextureCube=Q,this.rebindTextures=Mt,this.setupRenderTarget=Gt,this.updateRenderTargetMipmap=Kt,this.updateMultisampleRenderTarget=Ue,this.setupDepthRenderbuffer=St,this.setupFrameBufferTexture=tt,this.useMultisampledRTT=F}function m_(s,t){function e(i,n=Ri){let r;const a=fe.getTransfer(n);if(i===ki)return s.UNSIGNED_BYTE;if(i===wl)return s.UNSIGNED_SHORT_4_4_4_4;if(i===Tl)return s.UNSIGNED_SHORT_5_5_5_1;if(i===Sf)return s.UNSIGNED_INT_5_9_9_9_REV;if(i===yf)return s.BYTE;if(i===bf)return s.SHORT;if(i===ir)return s.UNSIGNED_SHORT;if(i===Sl)return s.INT;if(i===zn)return s.UNSIGNED_INT;if(i===Ui)return s.FLOAT;if(i===Ni)return s.HALF_FLOAT;if(i===wf)return s.ALPHA;if(i===Tf)return s.RGB;if(i===Pi)return s.RGBA;if(i===Ef)return s.LUMINANCE;if(i===Af)return s.LUMINANCE_ALPHA;if(i===ms)return s.DEPTH_COMPONENT;if(i===Ss)return s.DEPTH_STENCIL;if(i===_a)return s.RED;if(i===El)return s.RED_INTEGER;if(i===Rf)return s.RG;if(i===Al)return s.RG_INTEGER;if(i===Rl)return s.RGBA_INTEGER;if(i===$r||i===jr||i===Zr||i===Jr)if(a===xe)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===$r)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===jr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Zr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Jr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===$r)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===jr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Zr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Jr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Go||i===Ho||i===Vo||i===Wo)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Go)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Ho)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Vo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Wo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Xo||i===qo||i===Yo)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Xo||i===qo)return a===xe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Yo)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Ko||i===$o||i===jo||i===Zo||i===Jo||i===Qo||i===tl||i===el||i===il||i===nl||i===sl||i===rl||i===al||i===ol)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Ko)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===$o)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===jo)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Zo)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Jo)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Qo)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===tl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===el)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===il)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===nl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===sl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===rl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===al)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===ol)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Qr||i===ll||i===cl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===Qr)return a===xe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===ll)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===cl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Cf||i===hl||i===fl||i===ul)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===Qr)return r.COMPRESSED_RED_RGTC1_EXT;if(i===hl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===fl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===ul)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===bs?s.UNSIGNED_INT_24_8:s[i]!==void 0?s[i]:null}return{convert:e}}class g_ extends ui{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Te extends Fe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const __={type:"move"};class no{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Te,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Te,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Te,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let n=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const _ of t.hand.values()){const p=e.getJointPose(_,i),d=this._getHandJoint(c,_);p!==null&&(d.matrix.fromArray(p.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=p.radius),d.visible=p!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],u=h.position.distanceTo(f.position),m=.02,g=.005;c.inputState.pinching&&u>m+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=m-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(n=e.getPose(t.targetRaySpace,i),n===null&&r!==null&&(n=r),n!==null&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(__)))}return o!==null&&(o.visible=n!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Te;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const v_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,x_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class M_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const n=new Ze,r=t.properties.get(n);r.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new Ne({vertexShader:v_,fragmentShader:x_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ft(new be(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class y_ extends Es{constructor(t,e){super();const i=this;let n=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,f=null,u=null,m=null,g=null;const _=new M_,p=e.getContextAttributes();let d=null,x=null;const M=[],b=[],P=new Lt;let T=null;const E=new ui;E.layers.enable(1),E.viewport=new ge;const C=new ui;C.layers.enable(2),C.viewport=new ge;const I=[E,C],v=new g_;v.layers.enable(1),v.layers.enable(2);let S=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(H){let tt=M[H];return tt===void 0&&(tt=new no,M[H]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function(H){let tt=M[H];return tt===void 0&&(tt=new no,M[H]=tt),tt.getGripSpace()},this.getHand=function(H){let tt=M[H];return tt===void 0&&(tt=new no,M[H]=tt),tt.getHandSpace()};function k(H){const tt=b.indexOf(H.inputSource);if(tt===-1)return;const at=M[tt];at!==void 0&&(at.update(H.inputSource,H.frame,c||a),at.dispatchEvent({type:H.type,data:H.inputSource}))}function V(){n.removeEventListener("select",k),n.removeEventListener("selectstart",k),n.removeEventListener("selectend",k),n.removeEventListener("squeeze",k),n.removeEventListener("squeezestart",k),n.removeEventListener("squeezeend",k),n.removeEventListener("end",V),n.removeEventListener("inputsourceschange",K);for(let H=0;H<M.length;H++){const tt=b[H];tt!==null&&(b[H]=null,M[H].disconnect(tt))}S=null,U=null,_.reset(),t.setRenderTarget(d),m=null,u=null,f=null,n=null,x=null,st.stop(),i.isPresenting=!1,t.setPixelRatio(T),t.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(H){r=H,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(H){o=H,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(H){c=H},this.getBaseLayer=function(){return u!==null?u:m},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return n},this.setSession=async function(H){if(n=H,n!==null){if(d=t.getRenderTarget(),n.addEventListener("select",k),n.addEventListener("selectstart",k),n.addEventListener("selectend",k),n.addEventListener("squeeze",k),n.addEventListener("squeezestart",k),n.addEventListener("squeezeend",k),n.addEventListener("end",V),n.addEventListener("inputsourceschange",K),p.xrCompatible!==!0&&await e.makeXRCompatible(),T=t.getPixelRatio(),t.getSize(P),n.renderState.layers===void 0){const tt={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(n,e,tt),n.updateRenderState({baseLayer:m}),t.setPixelRatio(1),t.setSize(m.framebufferWidth,m.framebufferHeight,!1),x=new Mi(m.framebufferWidth,m.framebufferHeight,{format:Pi,type:ki,colorSpace:t.outputColorSpace,stencilBuffer:p.stencil})}else{let tt=null,at=null,ut=null;p.depth&&(ut=p.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,tt=p.stencil?Ss:ms,at=p.stencil?bs:zn);const St={colorFormat:e.RGBA8,depthFormat:ut,scaleFactor:r};f=new XRWebGLBinding(n,e),u=f.createProjectionLayer(St),n.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),x=new Mi(u.textureWidth,u.textureHeight,{format:Pi,type:ki,depthTexture:new Hf(u.textureWidth,u.textureHeight,at,void 0,void 0,void 0,void 0,void 0,void 0,tt),stencilBuffer:p.stencil,colorSpace:t.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await n.requestReferenceSpace(o),st.setContext(n),st.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function K(H){for(let tt=0;tt<H.removed.length;tt++){const at=H.removed[tt],ut=b.indexOf(at);ut>=0&&(b[ut]=null,M[ut].disconnect(at))}for(let tt=0;tt<H.added.length;tt++){const at=H.added[tt];let ut=b.indexOf(at);if(ut===-1){for(let Mt=0;Mt<M.length;Mt++)if(Mt>=b.length){b.push(at),ut=Mt;break}else if(b[Mt]===null){b[Mt]=at,ut=Mt;break}if(ut===-1)break}const St=M[ut];St&&St.connect(at)}}const W=new R,Q=new R;function X(H,tt,at){W.setFromMatrixPosition(tt.matrixWorld),Q.setFromMatrixPosition(at.matrixWorld);const ut=W.distanceTo(Q),St=tt.projectionMatrix.elements,Mt=at.projectionMatrix.elements,Gt=St[14]/(St[10]-1),Kt=St[14]/(St[10]+1),$t=(St[9]+1)/St[5],D=(St[9]-1)/St[5],Ue=(St[8]-1)/St[0],Jt=(Mt[8]+1)/Mt[0],F=Gt*Ue,Z=Gt*Jt,ot=ut/(-Ue+Jt),it=ot*-Ue;if(tt.matrixWorld.decompose(H.position,H.quaternion,H.scale),H.translateX(it),H.translateZ(ot),H.matrixWorld.compose(H.position,H.quaternion,H.scale),H.matrixWorldInverse.copy(H.matrixWorld).invert(),St[10]===-1)H.projectionMatrix.copy(tt.projectionMatrix),H.projectionMatrixInverse.copy(tt.projectionMatrixInverse);else{const A=Gt+ot,y=Kt+ot,O=F-it,$=Z+(ut-it),et=$t*Kt/y*A,J=D*Kt/y*A;H.projectionMatrix.makePerspective(O,$,et,J,A,y),H.projectionMatrixInverse.copy(H.projectionMatrix).invert()}}function dt(H,tt){tt===null?H.matrixWorld.copy(H.matrix):H.matrixWorld.multiplyMatrices(tt.matrixWorld,H.matrix),H.matrixWorldInverse.copy(H.matrixWorld).invert()}this.updateCamera=function(H){if(n===null)return;let tt=H.near,at=H.far;_.texture!==null&&(_.depthNear>0&&(tt=_.depthNear),_.depthFar>0&&(at=_.depthFar)),v.near=C.near=E.near=tt,v.far=C.far=E.far=at,(S!==v.near||U!==v.far)&&(n.updateRenderState({depthNear:v.near,depthFar:v.far}),S=v.near,U=v.far);const ut=H.parent,St=v.cameras;dt(v,ut);for(let Mt=0;Mt<St.length;Mt++)dt(St[Mt],ut);St.length===2?X(v,E,C):v.projectionMatrix.copy(E.projectionMatrix),lt(H,v,ut)};function lt(H,tt,at){at===null?H.matrix.copy(tt.matrixWorld):(H.matrix.copy(at.matrixWorld),H.matrix.invert(),H.matrix.multiply(tt.matrixWorld)),H.matrix.decompose(H.position,H.quaternion,H.scale),H.updateMatrixWorld(!0),H.projectionMatrix.copy(tt.projectionMatrix),H.projectionMatrixInverse.copy(tt.projectionMatrixInverse),H.isPerspectiveCamera&&(H.fov=nr*2*Math.atan(1/H.projectionMatrix.elements[5]),H.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(u===null&&m===null))return l},this.setFoveation=function(H){l=H,u!==null&&(u.fixedFoveation=H),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=H)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(v)};let gt=null;function Ft(H,tt){if(h=tt.getViewerPose(c||a),g=tt,h!==null){const at=h.views;m!==null&&(t.setRenderTargetFramebuffer(x,m.framebuffer),t.setRenderTarget(x));let ut=!1;at.length!==v.cameras.length&&(v.cameras.length=0,ut=!0);for(let Mt=0;Mt<at.length;Mt++){const Gt=at[Mt];let Kt=null;if(m!==null)Kt=m.getViewport(Gt);else{const D=f.getViewSubImage(u,Gt);Kt=D.viewport,Mt===0&&(t.setRenderTargetTextures(x,D.colorTexture,u.ignoreDepthValues?void 0:D.depthStencilTexture),t.setRenderTarget(x))}let $t=I[Mt];$t===void 0&&($t=new ui,$t.layers.enable(Mt),$t.viewport=new ge,I[Mt]=$t),$t.matrix.fromArray(Gt.transform.matrix),$t.matrix.decompose($t.position,$t.quaternion,$t.scale),$t.projectionMatrix.fromArray(Gt.projectionMatrix),$t.projectionMatrixInverse.copy($t.projectionMatrix).invert(),$t.viewport.set(Kt.x,Kt.y,Kt.width,Kt.height),Mt===0&&(v.matrix.copy($t.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),ut===!0&&v.cameras.push($t)}const St=n.enabledFeatures;if(St&&St.includes("depth-sensing")){const Mt=f.getDepthInformation(at[0]);Mt&&Mt.isValid&&Mt.texture&&_.init(t,Mt,n.renderState)}}for(let at=0;at<M.length;at++){const ut=b[at],St=M[at];ut!==null&&St!==void 0&&St.update(ut,tt,c||a)}gt&&gt(H,tt),tt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:tt}),g=null}const st=new Gf;st.setAnimationLoop(Ft),this.setAnimationLoop=function(H){gt=H},this.dispose=function(){}}}const wn=new yi,b_=new te;function S_(s,t){function e(p,d){p.matrixAutoUpdate===!0&&p.updateMatrix(),d.value.copy(p.matrix)}function i(p,d){d.color.getRGB(p.fogColor.value,Of(s)),d.isFog?(p.fogNear.value=d.near,p.fogFar.value=d.far):d.isFogExp2&&(p.fogDensity.value=d.density)}function n(p,d,x,M,b){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(p,d):d.isMeshToonMaterial?(r(p,d),f(p,d)):d.isMeshPhongMaterial?(r(p,d),h(p,d)):d.isMeshStandardMaterial?(r(p,d),u(p,d),d.isMeshPhysicalMaterial&&m(p,d,b)):d.isMeshMatcapMaterial?(r(p,d),g(p,d)):d.isMeshDepthMaterial?r(p,d):d.isMeshDistanceMaterial?(r(p,d),_(p,d)):d.isMeshNormalMaterial?r(p,d):d.isLineBasicMaterial?(a(p,d),d.isLineDashedMaterial&&o(p,d)):d.isPointsMaterial?l(p,d,x,M):d.isSpriteMaterial?c(p,d):d.isShadowMaterial?(p.color.value.copy(d.color),p.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(p,d){p.opacity.value=d.opacity,d.color&&p.diffuse.value.copy(d.color),d.emissive&&p.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(p.map.value=d.map,e(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,e(d.alphaMap,p.alphaMapTransform)),d.bumpMap&&(p.bumpMap.value=d.bumpMap,e(d.bumpMap,p.bumpMapTransform),p.bumpScale.value=d.bumpScale,d.side===je&&(p.bumpScale.value*=-1)),d.normalMap&&(p.normalMap.value=d.normalMap,e(d.normalMap,p.normalMapTransform),p.normalScale.value.copy(d.normalScale),d.side===je&&p.normalScale.value.negate()),d.displacementMap&&(p.displacementMap.value=d.displacementMap,e(d.displacementMap,p.displacementMapTransform),p.displacementScale.value=d.displacementScale,p.displacementBias.value=d.displacementBias),d.emissiveMap&&(p.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,p.emissiveMapTransform)),d.specularMap&&(p.specularMap.value=d.specularMap,e(d.specularMap,p.specularMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest);const x=t.get(d),M=x.envMap,b=x.envMapRotation;M&&(p.envMap.value=M,wn.copy(b),wn.x*=-1,wn.y*=-1,wn.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(wn.y*=-1,wn.z*=-1),p.envMapRotation.value.setFromMatrix4(b_.makeRotationFromEuler(wn)),p.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=d.reflectivity,p.ior.value=d.ior,p.refractionRatio.value=d.refractionRatio),d.lightMap&&(p.lightMap.value=d.lightMap,p.lightMapIntensity.value=d.lightMapIntensity,e(d.lightMap,p.lightMapTransform)),d.aoMap&&(p.aoMap.value=d.aoMap,p.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,p.aoMapTransform))}function a(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,d.map&&(p.map.value=d.map,e(d.map,p.mapTransform))}function o(p,d){p.dashSize.value=d.dashSize,p.totalSize.value=d.dashSize+d.gapSize,p.scale.value=d.scale}function l(p,d,x,M){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.size.value=d.size*x,p.scale.value=M*.5,d.map&&(p.map.value=d.map,e(d.map,p.uvTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,e(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function c(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.rotation.value=d.rotation,d.map&&(p.map.value=d.map,e(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,e(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function h(p,d){p.specular.value.copy(d.specular),p.shininess.value=Math.max(d.shininess,1e-4)}function f(p,d){d.gradientMap&&(p.gradientMap.value=d.gradientMap)}function u(p,d){p.metalness.value=d.metalness,d.metalnessMap&&(p.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,p.metalnessMapTransform)),p.roughness.value=d.roughness,d.roughnessMap&&(p.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,p.roughnessMapTransform)),d.envMap&&(p.envMapIntensity.value=d.envMapIntensity)}function m(p,d,x){p.ior.value=d.ior,d.sheen>0&&(p.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),p.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(p.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,p.sheenColorMapTransform)),d.sheenRoughnessMap&&(p.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,p.sheenRoughnessMapTransform))),d.clearcoat>0&&(p.clearcoat.value=d.clearcoat,p.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(p.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,p.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(p.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===je&&p.clearcoatNormalScale.value.negate())),d.dispersion>0&&(p.dispersion.value=d.dispersion),d.iridescence>0&&(p.iridescence.value=d.iridescence,p.iridescenceIOR.value=d.iridescenceIOR,p.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(p.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,p.iridescenceMapTransform)),d.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),d.transmission>0&&(p.transmission.value=d.transmission,p.transmissionSamplerMap.value=x.texture,p.transmissionSamplerSize.value.set(x.width,x.height),d.transmissionMap&&(p.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,p.transmissionMapTransform)),p.thickness.value=d.thickness,d.thicknessMap&&(p.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=d.attenuationDistance,p.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(p.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(p.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=d.specularIntensity,p.specularColor.value.copy(d.specularColor),d.specularColorMap&&(p.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,p.specularColorMapTransform)),d.specularIntensityMap&&(p.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,d){d.matcap&&(p.matcap.value=d.matcap)}function _(p,d){const x=t.get(d).light;p.referencePosition.value.setFromMatrixPosition(x.matrixWorld),p.nearDistance.value=x.shadow.camera.near,p.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:n}}function w_(s,t,e,i){let n={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,M){const b=M.program;i.uniformBlockBinding(x,b)}function c(x,M){let b=n[x.id];b===void 0&&(g(x),b=h(x),n[x.id]=b,x.addEventListener("dispose",p));const P=M.program;i.updateUBOMapping(x,P);const T=t.render.frame;r[x.id]!==T&&(u(x),r[x.id]=T)}function h(x){const M=f();x.__bindingPointIndex=M;const b=s.createBuffer(),P=x.__size,T=x.usage;return s.bindBuffer(s.UNIFORM_BUFFER,b),s.bufferData(s.UNIFORM_BUFFER,P,T),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,M,b),b}function f(){for(let x=0;x<o;x++)if(a.indexOf(x)===-1)return a.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(x){const M=n[x.id],b=x.uniforms,P=x.__cache;s.bindBuffer(s.UNIFORM_BUFFER,M);for(let T=0,E=b.length;T<E;T++){const C=Array.isArray(b[T])?b[T]:[b[T]];for(let I=0,v=C.length;I<v;I++){const S=C[I];if(m(S,T,I,P)===!0){const U=S.__offset,k=Array.isArray(S.value)?S.value:[S.value];let V=0;for(let K=0;K<k.length;K++){const W=k[K],Q=_(W);typeof W=="number"||typeof W=="boolean"?(S.__data[0]=W,s.bufferSubData(s.UNIFORM_BUFFER,U+V,S.__data)):W.isMatrix3?(S.__data[0]=W.elements[0],S.__data[1]=W.elements[1],S.__data[2]=W.elements[2],S.__data[3]=0,S.__data[4]=W.elements[3],S.__data[5]=W.elements[4],S.__data[6]=W.elements[5],S.__data[7]=0,S.__data[8]=W.elements[6],S.__data[9]=W.elements[7],S.__data[10]=W.elements[8],S.__data[11]=0):(W.toArray(S.__data,V),V+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,U,S.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function m(x,M,b,P){const T=x.value,E=M+"_"+b;if(P[E]===void 0)return typeof T=="number"||typeof T=="boolean"?P[E]=T:P[E]=T.clone(),!0;{const C=P[E];if(typeof T=="number"||typeof T=="boolean"){if(C!==T)return P[E]=T,!0}else if(C.equals(T)===!1)return C.copy(T),!0}return!1}function g(x){const M=x.uniforms;let b=0;const P=16;for(let E=0,C=M.length;E<C;E++){const I=Array.isArray(M[E])?M[E]:[M[E]];for(let v=0,S=I.length;v<S;v++){const U=I[v],k=Array.isArray(U.value)?U.value:[U.value];for(let V=0,K=k.length;V<K;V++){const W=k[V],Q=_(W),X=b%P,dt=X%Q.boundary,lt=X+dt;b+=dt,lt!==0&&P-lt<Q.storage&&(b+=P-lt),U.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=b,b+=Q.storage}}}const T=b%P;return T>0&&(b+=P-T),x.__size=b,x.__cache={},this}function _(x){const M={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(M.boundary=4,M.storage=4):x.isVector2?(M.boundary=8,M.storage=8):x.isVector3||x.isColor?(M.boundary=16,M.storage=12):x.isVector4?(M.boundary=16,M.storage=16):x.isMatrix3?(M.boundary=48,M.storage=48):x.isMatrix4?(M.boundary=64,M.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),M}function p(x){const M=x.target;M.removeEventListener("dispose",p);const b=a.indexOf(M.__bindingPointIndex);a.splice(b,1),s.deleteBuffer(n[M.id]),delete n[M.id],delete r[M.id]}function d(){for(const x in n)s.deleteBuffer(n[x]);a=[],n={},r={}}return{bind:l,update:c,dispose:d}}class T_{constructor(t={}){const{canvas:e=ud(),context:i=null,depth:n=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1}=t;this.isWebGLRenderer=!0;let u;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=i.getContextAttributes().alpha}else u=a;const m=new Uint32Array(4),g=new Int32Array(4);let _=null,p=null;const d=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=fi,this.toneMapping=dn,this.toneMappingExposure=1;const M=this;let b=!1,P=0,T=0,E=null,C=-1,I=null;const v=new ge,S=new ge;let U=null;const k=new pt(0);let V=0,K=e.width,W=e.height,Q=1,X=null,dt=null;const lt=new ge(0,0,K,W),gt=new ge(0,0,K,W);let Ft=!1;const st=new Ll;let H=!1,tt=!1;const at=new te,ut=new te,St=new R,Mt=new ge,Gt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Kt=!1;function $t(){return E===null?Q:1}let D=i;function Ue(w,z){return e.getContext(w,z)}try{const w={alpha:!0,depth:n,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${yl}`),e.addEventListener("webglcontextlost",nt,!1),e.addEventListener("webglcontextrestored",vt,!1),e.addEventListener("webglcontextcreationerror",bt,!1),D===null){const z="webgl2";if(D=Ue(z,w),D===null)throw Ue(z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let Jt,F,Z,ot,it,A,y,O,$,et,J,Rt,_t,Tt,le,ct,Et,Vt,Wt,At,ie,qt,ve,N;function yt(){Jt=new Pm(D),Jt.init(),qt=new m_(D,Jt),F=new wm(D,Jt,t,qt),Z=new u_(D),F.reverseDepthBuffer&&Z.buffers.depth.setReversed(!0),ot=new Dm(D),it=new Zg,A=new p_(D,Jt,Z,it,F,qt,ot),y=new Em(M),O=new Cm(M),$=new Bd(D),ve=new bm(D,$),et=new Im(D,$,ot,ve),J=new Nm(D,et,$,ot),Wt=new Um(D,F,A),ct=new Tm(it),Rt=new jg(M,y,O,Jt,F,ve,ct),_t=new S_(M,it),Tt=new Qg,le=new r_(Jt),Vt=new ym(M,y,O,Z,J,u,l),Et=new h_(M,J,F),N=new w_(D,ot,F,Z),At=new Sm(D,Jt,ot),ie=new Lm(D,Jt,ot),ot.programs=Rt.programs,M.capabilities=F,M.extensions=Jt,M.properties=it,M.renderLists=Tt,M.shadowMap=Et,M.state=Z,M.info=ot}yt();const j=new y_(M,D);this.xr=j,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const w=Jt.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=Jt.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return Q},this.setPixelRatio=function(w){w!==void 0&&(Q=w,this.setSize(K,W,!1))},this.getSize=function(w){return w.set(K,W)},this.setSize=function(w,z,q=!0){if(j.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}K=w,W=z,e.width=Math.floor(w*Q),e.height=Math.floor(z*Q),q===!0&&(e.style.width=w+"px",e.style.height=z+"px"),this.setViewport(0,0,w,z)},this.getDrawingBufferSize=function(w){return w.set(K*Q,W*Q).floor()},this.setDrawingBufferSize=function(w,z,q){K=w,W=z,Q=q,e.width=Math.floor(w*q),e.height=Math.floor(z*q),this.setViewport(0,0,w,z)},this.getCurrentViewport=function(w){return w.copy(v)},this.getViewport=function(w){return w.copy(lt)},this.setViewport=function(w,z,q,Y){w.isVector4?lt.set(w.x,w.y,w.z,w.w):lt.set(w,z,q,Y),Z.viewport(v.copy(lt).multiplyScalar(Q).round())},this.getScissor=function(w){return w.copy(gt)},this.setScissor=function(w,z,q,Y){w.isVector4?gt.set(w.x,w.y,w.z,w.w):gt.set(w,z,q,Y),Z.scissor(S.copy(gt).multiplyScalar(Q).round())},this.getScissorTest=function(){return Ft},this.setScissorTest=function(w){Z.setScissorTest(Ft=w)},this.setOpaqueSort=function(w){X=w},this.setTransparentSort=function(w){dt=w},this.getClearColor=function(w){return w.copy(Vt.getClearColor())},this.setClearColor=function(){Vt.setClearColor.apply(Vt,arguments)},this.getClearAlpha=function(){return Vt.getClearAlpha()},this.setClearAlpha=function(){Vt.setClearAlpha.apply(Vt,arguments)},this.clear=function(w=!0,z=!0,q=!0){let Y=0;if(w){let B=!1;if(E!==null){const ht=E.texture.format;B=ht===Rl||ht===Al||ht===El}if(B){const ht=E.texture.type,xt=ht===ki||ht===zn||ht===ir||ht===bs||ht===wl||ht===Tl,Ct=Vt.getClearColor(),Pt=Vt.getClearAlpha(),Ot=Ct.r,Ht=Ct.g,Dt=Ct.b;xt?(m[0]=Ot,m[1]=Ht,m[2]=Dt,m[3]=Pt,D.clearBufferuiv(D.COLOR,0,m)):(g[0]=Ot,g[1]=Ht,g[2]=Dt,g[3]=Pt,D.clearBufferiv(D.COLOR,0,g))}else Y|=D.COLOR_BUFFER_BIT}z&&(Y|=D.DEPTH_BUFFER_BIT,D.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),q&&(Y|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",nt,!1),e.removeEventListener("webglcontextrestored",vt,!1),e.removeEventListener("webglcontextcreationerror",bt,!1),Tt.dispose(),le.dispose(),it.dispose(),y.dispose(),O.dispose(),J.dispose(),ve.dispose(),N.dispose(),Rt.dispose(),j.dispose(),j.removeEventListener("sessionstart",lc),j.removeEventListener("sessionend",cc),vn.stop()};function nt(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function vt(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;const w=ot.autoReset,z=Et.enabled,q=Et.autoUpdate,Y=Et.needsUpdate,B=Et.type;yt(),ot.autoReset=w,Et.enabled=z,Et.autoUpdate=q,Et.needsUpdate=Y,Et.type=B}function bt(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function re(w){const z=w.target;z.removeEventListener("dispose",re),Ie(z)}function Ie(w){si(w),it.remove(w)}function si(w){const z=it.get(w).programs;z!==void 0&&(z.forEach(function(q){Rt.releaseProgram(q)}),w.isShaderMaterial&&Rt.releaseShaderCache(w))}this.renderBufferDirect=function(w,z,q,Y,B,ht){z===null&&(z=Gt);const xt=B.isMesh&&B.matrixWorld.determinant()<0,Ct=uu(w,z,q,Y,B);Z.setMaterial(Y,xt);let Pt=q.index,Ot=1;if(Y.wireframe===!0){if(Pt=et.getWireframeAttribute(q),Pt===void 0)return;Ot=2}const Ht=q.drawRange,Dt=q.attributes.position;let pe=Ht.start*Ot,ye=(Ht.start+Ht.count)*Ot;ht!==null&&(pe=Math.max(pe,ht.start*Ot),ye=Math.min(ye,(ht.start+ht.count)*Ot)),Pt!==null?(pe=Math.max(pe,0),ye=Math.min(ye,Pt.count)):Dt!=null&&(pe=Math.max(pe,0),ye=Math.min(ye,Dt.count));const Se=ye-pe;if(Se<0||Se===1/0)return;ve.setup(B,Y,Ct,q,Pt);let oi,ue=At;if(Pt!==null&&(oi=$.get(Pt),ue=ie,ue.setIndex(oi)),B.isMesh)Y.wireframe===!0?(Z.setLineWidth(Y.wireframeLinewidth*$t()),ue.setMode(D.LINES)):ue.setMode(D.TRIANGLES);else if(B.isLine){let Nt=Y.linewidth;Nt===void 0&&(Nt=1),Z.setLineWidth(Nt*$t()),B.isLineSegments?ue.setMode(D.LINES):B.isLineLoop?ue.setMode(D.LINE_LOOP):ue.setMode(D.LINE_STRIP)}else B.isPoints?ue.setMode(D.POINTS):B.isSprite&&ue.setMode(D.TRIANGLES);if(B.isBatchedMesh)if(B._multiDrawInstances!==null)ue.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances);else if(Jt.get("WEBGL_multi_draw"))ue.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{const Nt=B._multiDrawStarts,Ve=B._multiDrawCounts,de=B._multiDrawCount,wi=Pt?$.get(Pt).bytesPerElement:1,Vn=it.get(Y).currentProgram.getUniforms();for(let li=0;li<de;li++)Vn.setValue(D,"_gl_DrawID",li),ue.render(Nt[li]/wi,Ve[li])}else if(B.isInstancedMesh)ue.renderInstances(pe,Se,B.count);else if(q.isInstancedBufferGeometry){const Nt=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,Ve=Math.min(q.instanceCount,Nt);ue.renderInstances(pe,Se,Ve)}else ue.render(pe,Se)};function ce(w,z,q){w.transparent===!0&&w.side===_e&&w.forceSinglePass===!1?(w.side=je,w.needsUpdate=!0,lr(w,z,q),w.side=Qi,w.needsUpdate=!0,lr(w,z,q),w.side=_e):lr(w,z,q)}this.compile=function(w,z,q=null){q===null&&(q=w),p=le.get(q),p.init(z),x.push(p),q.traverseVisible(function(B){B.isLight&&B.layers.test(z.layers)&&(p.pushLight(B),B.castShadow&&p.pushShadow(B))}),w!==q&&w.traverseVisible(function(B){B.isLight&&B.layers.test(z.layers)&&(p.pushLight(B),B.castShadow&&p.pushShadow(B))}),p.setupLights();const Y=new Set;return w.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;const ht=B.material;if(ht)if(Array.isArray(ht))for(let xt=0;xt<ht.length;xt++){const Ct=ht[xt];ce(Ct,q,B),Y.add(Ct)}else ce(ht,q,B),Y.add(ht)}),x.pop(),p=null,Y},this.compileAsync=function(w,z,q=null){const Y=this.compile(w,z,q);return new Promise(B=>{function ht(){if(Y.forEach(function(xt){it.get(xt).currentProgram.isReady()&&Y.delete(xt)}),Y.size===0){B(w);return}setTimeout(ht,10)}Jt.get("KHR_parallel_shader_compile")!==null?ht():setTimeout(ht,10)})};let ri=null;function Fi(w){ri&&ri(w)}function lc(){vn.stop()}function cc(){vn.start()}const vn=new Gf;vn.setAnimationLoop(Fi),typeof self<"u"&&vn.setContext(self),this.setAnimationLoop=function(w){ri=w,j.setAnimationLoop(w),w===null?vn.stop():vn.start()},j.addEventListener("sessionstart",lc),j.addEventListener("sessionend",cc),this.render=function(w,z){if(z!==void 0&&z.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),j.enabled===!0&&j.isPresenting===!0&&(j.cameraAutoUpdate===!0&&j.updateCamera(z),z=j.getCamera()),w.isScene===!0&&w.onBeforeRender(M,w,z,E),p=le.get(w,x.length),p.init(z),x.push(p),ut.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),st.setFromProjectionMatrix(ut),tt=this.localClippingEnabled,H=ct.init(this.clippingPlanes,tt),_=Tt.get(w,d.length),_.init(),d.push(_),j.enabled===!0&&j.isPresenting===!0){const ht=M.xr.getDepthSensingMesh();ht!==null&&wa(ht,z,-1/0,M.sortObjects)}wa(w,z,0,M.sortObjects),_.finish(),M.sortObjects===!0&&_.sort(X,dt),Kt=j.enabled===!1||j.isPresenting===!1||j.hasDepthSensing()===!1,Kt&&Vt.addToRenderList(_,w),this.info.render.frame++,H===!0&&ct.beginShadows();const q=p.state.shadowsArray;Et.render(q,w,z),H===!0&&ct.endShadows(),this.info.autoReset===!0&&this.info.reset();const Y=_.opaque,B=_.transmissive;if(p.setupLights(),z.isArrayCamera){const ht=z.cameras;if(B.length>0)for(let xt=0,Ct=ht.length;xt<Ct;xt++){const Pt=ht[xt];fc(Y,B,w,Pt)}Kt&&Vt.render(w);for(let xt=0,Ct=ht.length;xt<Ct;xt++){const Pt=ht[xt];hc(_,w,Pt,Pt.viewport)}}else B.length>0&&fc(Y,B,w,z),Kt&&Vt.render(w),hc(_,w,z);E!==null&&(A.updateMultisampleRenderTarget(E),A.updateRenderTargetMipmap(E)),w.isScene===!0&&w.onAfterRender(M,w,z),ve.resetDefaultState(),C=-1,I=null,x.pop(),x.length>0?(p=x[x.length-1],H===!0&&ct.setGlobalState(M.clippingPlanes,p.state.camera)):p=null,d.pop(),d.length>0?_=d[d.length-1]:_=null};function wa(w,z,q,Y){if(w.visible===!1)return;if(w.layers.test(z.layers)){if(w.isGroup)q=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(z);else if(w.isLight)p.pushLight(w),w.castShadow&&p.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||st.intersectsSprite(w)){Y&&Mt.setFromMatrixPosition(w.matrixWorld).applyMatrix4(ut);const xt=J.update(w),Ct=w.material;Ct.visible&&_.push(w,xt,Ct,q,Mt.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||st.intersectsObject(w))){const xt=J.update(w),Ct=w.material;if(Y&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Mt.copy(w.boundingSphere.center)):(xt.boundingSphere===null&&xt.computeBoundingSphere(),Mt.copy(xt.boundingSphere.center)),Mt.applyMatrix4(w.matrixWorld).applyMatrix4(ut)),Array.isArray(Ct)){const Pt=xt.groups;for(let Ot=0,Ht=Pt.length;Ot<Ht;Ot++){const Dt=Pt[Ot],pe=Ct[Dt.materialIndex];pe&&pe.visible&&_.push(w,xt,pe,q,Mt.z,Dt)}}else Ct.visible&&_.push(w,xt,Ct,q,Mt.z,null)}}const ht=w.children;for(let xt=0,Ct=ht.length;xt<Ct;xt++)wa(ht[xt],z,q,Y)}function hc(w,z,q,Y){const B=w.opaque,ht=w.transmissive,xt=w.transparent;p.setupLightsView(q),H===!0&&ct.setGlobalState(M.clippingPlanes,q),Y&&Z.viewport(v.copy(Y)),B.length>0&&or(B,z,q),ht.length>0&&or(ht,z,q),xt.length>0&&or(xt,z,q),Z.buffers.depth.setTest(!0),Z.buffers.depth.setMask(!0),Z.buffers.color.setMask(!0),Z.setPolygonOffset(!1)}function fc(w,z,q,Y){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[Y.id]===void 0&&(p.state.transmissionRenderTarget[Y.id]=new Mi(1,1,{generateMipmaps:!0,type:Jt.has("EXT_color_buffer_half_float")||Jt.has("EXT_color_buffer_float")?Ni:ki,minFilter:un,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:fe.workingColorSpace}));const ht=p.state.transmissionRenderTarget[Y.id],xt=Y.viewport||v;ht.setSize(xt.z,xt.w);const Ct=M.getRenderTarget();M.setRenderTarget(ht),M.getClearColor(k),V=M.getClearAlpha(),V<1&&M.setClearColor(16777215,.5),M.clear(),Kt&&Vt.render(q);const Pt=M.toneMapping;M.toneMapping=dn;const Ot=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),p.setupLightsView(Y),H===!0&&ct.setGlobalState(M.clippingPlanes,Y),or(w,q,Y),A.updateMultisampleRenderTarget(ht),A.updateRenderTargetMipmap(ht),Jt.has("WEBGL_multisampled_render_to_texture")===!1){let Ht=!1;for(let Dt=0,pe=z.length;Dt<pe;Dt++){const ye=z[Dt],Se=ye.object,oi=ye.geometry,ue=ye.material,Nt=ye.group;if(ue.side===_e&&Se.layers.test(Y.layers)){const Ve=ue.side;ue.side=je,ue.needsUpdate=!0,uc(Se,q,Y,oi,ue,Nt),ue.side=Ve,ue.needsUpdate=!0,Ht=!0}}Ht===!0&&(A.updateMultisampleRenderTarget(ht),A.updateRenderTargetMipmap(ht))}M.setRenderTarget(Ct),M.setClearColor(k,V),Ot!==void 0&&(Y.viewport=Ot),M.toneMapping=Pt}function or(w,z,q){const Y=z.isScene===!0?z.overrideMaterial:null;for(let B=0,ht=w.length;B<ht;B++){const xt=w[B],Ct=xt.object,Pt=xt.geometry,Ot=Y===null?xt.material:Y,Ht=xt.group;Ct.layers.test(q.layers)&&uc(Ct,z,q,Pt,Ot,Ht)}}function uc(w,z,q,Y,B,ht){w.onBeforeRender(M,z,q,Y,B,ht),w.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),B.onBeforeRender(M,z,q,Y,w,ht),B.transparent===!0&&B.side===_e&&B.forceSinglePass===!1?(B.side=je,B.needsUpdate=!0,M.renderBufferDirect(q,z,Y,B,w,ht),B.side=Qi,B.needsUpdate=!0,M.renderBufferDirect(q,z,Y,B,w,ht),B.side=_e):M.renderBufferDirect(q,z,Y,B,w,ht),w.onAfterRender(M,z,q,Y,B,ht)}function lr(w,z,q){z.isScene!==!0&&(z=Gt);const Y=it.get(w),B=p.state.lights,ht=p.state.shadowsArray,xt=B.state.version,Ct=Rt.getParameters(w,B.state,ht,z,q),Pt=Rt.getProgramCacheKey(Ct);let Ot=Y.programs;Y.environment=w.isMeshStandardMaterial?z.environment:null,Y.fog=z.fog,Y.envMap=(w.isMeshStandardMaterial?O:y).get(w.envMap||Y.environment),Y.envMapRotation=Y.environment!==null&&w.envMap===null?z.environmentRotation:w.envMapRotation,Ot===void 0&&(w.addEventListener("dispose",re),Ot=new Map,Y.programs=Ot);let Ht=Ot.get(Pt);if(Ht!==void 0){if(Y.currentProgram===Ht&&Y.lightsStateVersion===xt)return pc(w,Ct),Ht}else Ct.uniforms=Rt.getUniforms(w),w.onBeforeCompile(Ct,M),Ht=Rt.acquireProgram(Ct,Pt),Ot.set(Pt,Ht),Y.uniforms=Ct.uniforms;const Dt=Y.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Dt.clippingPlanes=ct.uniform),pc(w,Ct),Y.needsLights=pu(w),Y.lightsStateVersion=xt,Y.needsLights&&(Dt.ambientLightColor.value=B.state.ambient,Dt.lightProbe.value=B.state.probe,Dt.directionalLights.value=B.state.directional,Dt.directionalLightShadows.value=B.state.directionalShadow,Dt.spotLights.value=B.state.spot,Dt.spotLightShadows.value=B.state.spotShadow,Dt.rectAreaLights.value=B.state.rectArea,Dt.ltc_1.value=B.state.rectAreaLTC1,Dt.ltc_2.value=B.state.rectAreaLTC2,Dt.pointLights.value=B.state.point,Dt.pointLightShadows.value=B.state.pointShadow,Dt.hemisphereLights.value=B.state.hemi,Dt.directionalShadowMap.value=B.state.directionalShadowMap,Dt.directionalShadowMatrix.value=B.state.directionalShadowMatrix,Dt.spotShadowMap.value=B.state.spotShadowMap,Dt.spotLightMatrix.value=B.state.spotLightMatrix,Dt.spotLightMap.value=B.state.spotLightMap,Dt.pointShadowMap.value=B.state.pointShadowMap,Dt.pointShadowMatrix.value=B.state.pointShadowMatrix),Y.currentProgram=Ht,Y.uniformsList=null,Ht}function dc(w){if(w.uniformsList===null){const z=w.currentProgram.getUniforms();w.uniformsList=ea.seqWithValue(z.seq,w.uniforms)}return w.uniformsList}function pc(w,z){const q=it.get(w);q.outputColorSpace=z.outputColorSpace,q.batching=z.batching,q.batchingColor=z.batchingColor,q.instancing=z.instancing,q.instancingColor=z.instancingColor,q.instancingMorph=z.instancingMorph,q.skinning=z.skinning,q.morphTargets=z.morphTargets,q.morphNormals=z.morphNormals,q.morphColors=z.morphColors,q.morphTargetsCount=z.morphTargetsCount,q.numClippingPlanes=z.numClippingPlanes,q.numIntersection=z.numClipIntersection,q.vertexAlphas=z.vertexAlphas,q.vertexTangents=z.vertexTangents,q.toneMapping=z.toneMapping}function uu(w,z,q,Y,B){z.isScene!==!0&&(z=Gt),A.resetTextureUnits();const ht=z.fog,xt=Y.isMeshStandardMaterial?z.environment:null,Ct=E===null?M.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:tn,Pt=(Y.isMeshStandardMaterial?O:y).get(Y.envMap||xt),Ot=Y.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Ht=!!q.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Dt=!!q.morphAttributes.position,pe=!!q.morphAttributes.normal,ye=!!q.morphAttributes.color;let Se=dn;Y.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(Se=M.toneMapping);const oi=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,ue=oi!==void 0?oi.length:0,Nt=it.get(Y),Ve=p.state.lights;if(H===!0&&(tt===!0||w!==I)){const pi=w===I&&Y.id===C;ct.setState(Y,w,pi)}let de=!1;Y.version===Nt.__version?(Nt.needsLights&&Nt.lightsStateVersion!==Ve.state.version||Nt.outputColorSpace!==Ct||B.isBatchedMesh&&Nt.batching===!1||!B.isBatchedMesh&&Nt.batching===!0||B.isBatchedMesh&&Nt.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&Nt.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&Nt.instancing===!1||!B.isInstancedMesh&&Nt.instancing===!0||B.isSkinnedMesh&&Nt.skinning===!1||!B.isSkinnedMesh&&Nt.skinning===!0||B.isInstancedMesh&&Nt.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&Nt.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&Nt.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&Nt.instancingMorph===!1&&B.morphTexture!==null||Nt.envMap!==Pt||Y.fog===!0&&Nt.fog!==ht||Nt.numClippingPlanes!==void 0&&(Nt.numClippingPlanes!==ct.numPlanes||Nt.numIntersection!==ct.numIntersection)||Nt.vertexAlphas!==Ot||Nt.vertexTangents!==Ht||Nt.morphTargets!==Dt||Nt.morphNormals!==pe||Nt.morphColors!==ye||Nt.toneMapping!==Se||Nt.morphTargetsCount!==ue)&&(de=!0):(de=!0,Nt.__version=Y.version);let wi=Nt.currentProgram;de===!0&&(wi=lr(Y,z,B));let Vn=!1,li=!1,Ta=!1;const Ee=wi.getUniforms(),en=Nt.uniforms;if(Z.useProgram(wi.program)&&(Vn=!0,li=!0,Ta=!0),Y.id!==C&&(C=Y.id,li=!0),Vn||I!==w){F.reverseDepthBuffer?(at.copy(w.projectionMatrix),pd(at),md(at),Ee.setValue(D,"projectionMatrix",at)):Ee.setValue(D,"projectionMatrix",w.projectionMatrix),Ee.setValue(D,"viewMatrix",w.matrixWorldInverse);const pi=Ee.map.cameraPosition;pi!==void 0&&pi.setValue(D,St.setFromMatrixPosition(w.matrixWorld)),F.logarithmicDepthBuffer&&Ee.setValue(D,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&Ee.setValue(D,"isOrthographic",w.isOrthographicCamera===!0),I!==w&&(I=w,li=!0,Ta=!0)}if(B.isSkinnedMesh){Ee.setOptional(D,B,"bindMatrix"),Ee.setOptional(D,B,"bindMatrixInverse");const pi=B.skeleton;pi&&(pi.boneTexture===null&&pi.computeBoneTexture(),Ee.setValue(D,"boneTexture",pi.boneTexture,A))}B.isBatchedMesh&&(Ee.setOptional(D,B,"batchingTexture"),Ee.setValue(D,"batchingTexture",B._matricesTexture,A),Ee.setOptional(D,B,"batchingIdTexture"),Ee.setValue(D,"batchingIdTexture",B._indirectTexture,A),Ee.setOptional(D,B,"batchingColorTexture"),B._colorsTexture!==null&&Ee.setValue(D,"batchingColorTexture",B._colorsTexture,A));const Ea=q.morphAttributes;if((Ea.position!==void 0||Ea.normal!==void 0||Ea.color!==void 0)&&Wt.update(B,q,wi),(li||Nt.receiveShadow!==B.receiveShadow)&&(Nt.receiveShadow=B.receiveShadow,Ee.setValue(D,"receiveShadow",B.receiveShadow)),Y.isMeshGouraudMaterial&&Y.envMap!==null&&(en.envMap.value=Pt,en.flipEnvMap.value=Pt.isCubeTexture&&Pt.isRenderTargetTexture===!1?-1:1),Y.isMeshStandardMaterial&&Y.envMap===null&&z.environment!==null&&(en.envMapIntensity.value=z.environmentIntensity),li&&(Ee.setValue(D,"toneMappingExposure",M.toneMappingExposure),Nt.needsLights&&du(en,Ta),ht&&Y.fog===!0&&_t.refreshFogUniforms(en,ht),_t.refreshMaterialUniforms(en,Y,Q,W,p.state.transmissionRenderTarget[w.id]),ea.upload(D,dc(Nt),en,A)),Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(ea.upload(D,dc(Nt),en,A),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&Ee.setValue(D,"center",B.center),Ee.setValue(D,"modelViewMatrix",B.modelViewMatrix),Ee.setValue(D,"normalMatrix",B.normalMatrix),Ee.setValue(D,"modelMatrix",B.matrixWorld),Y.isShaderMaterial||Y.isRawShaderMaterial){const pi=Y.uniformsGroups;for(let Aa=0,mu=pi.length;Aa<mu;Aa++){const mc=pi[Aa];N.update(mc,wi),N.bind(mc,wi)}}return wi}function du(w,z){w.ambientLightColor.needsUpdate=z,w.lightProbe.needsUpdate=z,w.directionalLights.needsUpdate=z,w.directionalLightShadows.needsUpdate=z,w.pointLights.needsUpdate=z,w.pointLightShadows.needsUpdate=z,w.spotLights.needsUpdate=z,w.spotLightShadows.needsUpdate=z,w.rectAreaLights.needsUpdate=z,w.hemisphereLights.needsUpdate=z}function pu(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(w,z,q){it.get(w.texture).__webglTexture=z,it.get(w.depthTexture).__webglTexture=q;const Y=it.get(w);Y.__hasExternalTextures=!0,Y.__autoAllocateDepthBuffer=q===void 0,Y.__autoAllocateDepthBuffer||Jt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Y.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,z){const q=it.get(w);q.__webglFramebuffer=z,q.__useDefaultFramebuffer=z===void 0},this.setRenderTarget=function(w,z=0,q=0){E=w,P=z,T=q;let Y=!0,B=null,ht=!1,xt=!1;if(w){const Pt=it.get(w);if(Pt.__useDefaultFramebuffer!==void 0)Z.bindFramebuffer(D.FRAMEBUFFER,null),Y=!1;else if(Pt.__webglFramebuffer===void 0)A.setupRenderTarget(w);else if(Pt.__hasExternalTextures)A.rebindTextures(w,it.get(w.texture).__webglTexture,it.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const Dt=w.depthTexture;if(Pt.__boundDepthTexture!==Dt){if(Dt!==null&&it.has(Dt)&&(w.width!==Dt.image.width||w.height!==Dt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");A.setupDepthRenderbuffer(w)}}const Ot=w.texture;(Ot.isData3DTexture||Ot.isDataArrayTexture||Ot.isCompressedArrayTexture)&&(xt=!0);const Ht=it.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Ht[z])?B=Ht[z][q]:B=Ht[z],ht=!0):w.samples>0&&A.useMultisampledRTT(w)===!1?B=it.get(w).__webglMultisampledFramebuffer:Array.isArray(Ht)?B=Ht[q]:B=Ht,v.copy(w.viewport),S.copy(w.scissor),U=w.scissorTest}else v.copy(lt).multiplyScalar(Q).floor(),S.copy(gt).multiplyScalar(Q).floor(),U=Ft;if(Z.bindFramebuffer(D.FRAMEBUFFER,B)&&Y&&Z.drawBuffers(w,B),Z.viewport(v),Z.scissor(S),Z.setScissorTest(U),ht){const Pt=it.get(w.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+z,Pt.__webglTexture,q)}else if(xt){const Pt=it.get(w.texture),Ot=z||0;D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,Pt.__webglTexture,q||0,Ot)}C=-1},this.readRenderTargetPixels=function(w,z,q,Y,B,ht,xt){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ct=it.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&xt!==void 0&&(Ct=Ct[xt]),Ct){Z.bindFramebuffer(D.FRAMEBUFFER,Ct);try{const Pt=w.texture,Ot=Pt.format,Ht=Pt.type;if(!F.textureFormatReadable(Ot)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!F.textureTypeReadable(Ht)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=w.width-Y&&q>=0&&q<=w.height-B&&D.readPixels(z,q,Y,B,qt.convert(Ot),qt.convert(Ht),ht)}finally{const Pt=E!==null?it.get(E).__webglFramebuffer:null;Z.bindFramebuffer(D.FRAMEBUFFER,Pt)}}},this.readRenderTargetPixelsAsync=async function(w,z,q,Y,B,ht,xt){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ct=it.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&xt!==void 0&&(Ct=Ct[xt]),Ct){const Pt=w.texture,Ot=Pt.format,Ht=Pt.type;if(!F.textureFormatReadable(Ot))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!F.textureTypeReadable(Ht))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(z>=0&&z<=w.width-Y&&q>=0&&q<=w.height-B){Z.bindFramebuffer(D.FRAMEBUFFER,Ct);const Dt=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,Dt),D.bufferData(D.PIXEL_PACK_BUFFER,ht.byteLength,D.STREAM_READ),D.readPixels(z,q,Y,B,qt.convert(Ot),qt.convert(Ht),0);const pe=E!==null?it.get(E).__webglFramebuffer:null;Z.bindFramebuffer(D.FRAMEBUFFER,pe);const ye=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await dd(D,ye,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,Dt),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,ht),D.deleteBuffer(Dt),D.deleteSync(ye),ht}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(w,z=null,q=0){w.isTexture!==!0&&(ta("WebGLRenderer: copyFramebufferToTexture function signature has changed."),z=arguments[0]||null,w=arguments[1]);const Y=Math.pow(2,-q),B=Math.floor(w.image.width*Y),ht=Math.floor(w.image.height*Y),xt=z!==null?z.x:0,Ct=z!==null?z.y:0;A.setTexture2D(w,0),D.copyTexSubImage2D(D.TEXTURE_2D,q,0,0,xt,Ct,B,ht),Z.unbindTexture()},this.copyTextureToTexture=function(w,z,q=null,Y=null,B=0){w.isTexture!==!0&&(ta("WebGLRenderer: copyTextureToTexture function signature has changed."),Y=arguments[0]||null,w=arguments[1],z=arguments[2],B=arguments[3]||0,q=null);let ht,xt,Ct,Pt,Ot,Ht;q!==null?(ht=q.max.x-q.min.x,xt=q.max.y-q.min.y,Ct=q.min.x,Pt=q.min.y):(ht=w.image.width,xt=w.image.height,Ct=0,Pt=0),Y!==null?(Ot=Y.x,Ht=Y.y):(Ot=0,Ht=0);const Dt=qt.convert(z.format),pe=qt.convert(z.type);A.setTexture2D(z,0),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,z.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,z.unpackAlignment);const ye=D.getParameter(D.UNPACK_ROW_LENGTH),Se=D.getParameter(D.UNPACK_IMAGE_HEIGHT),oi=D.getParameter(D.UNPACK_SKIP_PIXELS),ue=D.getParameter(D.UNPACK_SKIP_ROWS),Nt=D.getParameter(D.UNPACK_SKIP_IMAGES),Ve=w.isCompressedTexture?w.mipmaps[B]:w.image;D.pixelStorei(D.UNPACK_ROW_LENGTH,Ve.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Ve.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Ct),D.pixelStorei(D.UNPACK_SKIP_ROWS,Pt),w.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,B,Ot,Ht,ht,xt,Dt,pe,Ve.data):w.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,B,Ot,Ht,Ve.width,Ve.height,Dt,Ve.data):D.texSubImage2D(D.TEXTURE_2D,B,Ot,Ht,ht,xt,Dt,pe,Ve),D.pixelStorei(D.UNPACK_ROW_LENGTH,ye),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Se),D.pixelStorei(D.UNPACK_SKIP_PIXELS,oi),D.pixelStorei(D.UNPACK_SKIP_ROWS,ue),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Nt),B===0&&z.generateMipmaps&&D.generateMipmap(D.TEXTURE_2D),Z.unbindTexture()},this.copyTextureToTexture3D=function(w,z,q=null,Y=null,B=0){w.isTexture!==!0&&(ta("WebGLRenderer: copyTextureToTexture3D function signature has changed."),q=arguments[0]||null,Y=arguments[1]||null,w=arguments[2],z=arguments[3],B=arguments[4]||0);let ht,xt,Ct,Pt,Ot,Ht,Dt,pe,ye;const Se=w.isCompressedTexture?w.mipmaps[B]:w.image;q!==null?(ht=q.max.x-q.min.x,xt=q.max.y-q.min.y,Ct=q.max.z-q.min.z,Pt=q.min.x,Ot=q.min.y,Ht=q.min.z):(ht=Se.width,xt=Se.height,Ct=Se.depth,Pt=0,Ot=0,Ht=0),Y!==null?(Dt=Y.x,pe=Y.y,ye=Y.z):(Dt=0,pe=0,ye=0);const oi=qt.convert(z.format),ue=qt.convert(z.type);let Nt;if(z.isData3DTexture)A.setTexture3D(z,0),Nt=D.TEXTURE_3D;else if(z.isDataArrayTexture||z.isCompressedArrayTexture)A.setTexture2DArray(z,0),Nt=D.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,z.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,z.unpackAlignment);const Ve=D.getParameter(D.UNPACK_ROW_LENGTH),de=D.getParameter(D.UNPACK_IMAGE_HEIGHT),wi=D.getParameter(D.UNPACK_SKIP_PIXELS),Vn=D.getParameter(D.UNPACK_SKIP_ROWS),li=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,Se.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Se.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Pt),D.pixelStorei(D.UNPACK_SKIP_ROWS,Ot),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Ht),w.isDataTexture||w.isData3DTexture?D.texSubImage3D(Nt,B,Dt,pe,ye,ht,xt,Ct,oi,ue,Se.data):z.isCompressedArrayTexture?D.compressedTexSubImage3D(Nt,B,Dt,pe,ye,ht,xt,Ct,oi,Se.data):D.texSubImage3D(Nt,B,Dt,pe,ye,ht,xt,Ct,oi,ue,Se),D.pixelStorei(D.UNPACK_ROW_LENGTH,Ve),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,de),D.pixelStorei(D.UNPACK_SKIP_PIXELS,wi),D.pixelStorei(D.UNPACK_SKIP_ROWS,Vn),D.pixelStorei(D.UNPACK_SKIP_IMAGES,li),B===0&&z.generateMipmaps&&D.generateMipmap(Nt),Z.unbindTexture()},this.initRenderTarget=function(w){it.get(w).__webglFramebuffer===void 0&&A.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?A.setTextureCube(w,0):w.isData3DTexture?A.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?A.setTexture2DArray(w,0):A.setTexture2D(w,0),Z.unbindTexture()},this.resetState=function(){P=0,T=0,E=null,Z.reset(),ve.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return qi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Pl?"display-p3":"srgb",e.unpackColorSpace=fe.workingColorSpace===va?"display-p3":"srgb"}}class Nl{constructor(t,e=1,i=1e3){this.isFog=!0,this.name="",this.color=new pt(t),this.near=e,this.far=i}clone(){return new Nl(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class E_ extends Fe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new yi,this.environmentIntensity=1,this.environmentRotation=new yi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class A_{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=dl,this.updateRanges=[],this.version=0,this.uuid=ji()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let n=0,r=this.stride;n<r;n++)this.array[t+n]=e.array[i+n];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ji()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ji()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Je=new R;class fa{constructor(t,e,i,n=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=n}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)Je.fromBufferAttribute(this,e),Je.applyMatrix4(t),this.setXYZ(e,Je.x,Je.y,Je.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Je.fromBufferAttribute(this,e),Je.applyNormalMatrix(t),this.setXYZ(e,Je.x,Je.y,Je.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Je.fromBufferAttribute(this,e),Je.transformDirection(t),this.setXYZ(e,Je.x,Je.y,Je.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=Ci(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=me(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Ci(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Ci(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Ci(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Ci(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=me(e,this.array),i=me(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=me(e,this.array),i=me(i,this.array),n=me(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=n,this}setXYZW(t,e,i,n,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=me(e,this.array),i=me(i,this.array),n=me(n,this.array),r=me(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=n,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const n=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[n+r])}return new Pe(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new fa(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const n=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[n+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Yf extends Hn{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new pt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let ss;const Fs=new R,rs=new R,as=new R,os=new Lt,Os=new Lt,Kf=new te,Cr=new R,zs=new R,Pr=new R,ch=new Lt,so=new Lt,hh=new Lt;class R_ extends Fe{constructor(t=new Yf){if(super(),this.isSprite=!0,this.type="Sprite",ss===void 0){ss=new He;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new A_(e,5);ss.setIndex([0,1,2,0,2,3]),ss.setAttribute("position",new fa(i,3,0,!1)),ss.setAttribute("uv",new fa(i,2,3,!1))}this.geometry=ss,this.material=t,this.center=new Lt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),rs.setFromMatrixScale(this.matrixWorld),Kf.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),as.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&rs.multiplyScalar(-as.z);const i=this.material.rotation;let n,r;i!==0&&(r=Math.cos(i),n=Math.sin(i));const a=this.center;Ir(Cr.set(-.5,-.5,0),as,a,rs,n,r),Ir(zs.set(.5,-.5,0),as,a,rs,n,r),Ir(Pr.set(.5,.5,0),as,a,rs,n,r),ch.set(0,0),so.set(1,0),hh.set(1,1);let o=t.ray.intersectTriangle(Cr,zs,Pr,!1,Fs);if(o===null&&(Ir(zs.set(-.5,.5,0),as,a,rs,n,r),so.set(0,1),o=t.ray.intersectTriangle(Cr,Pr,zs,!1,Fs),o===null))return;const l=t.ray.origin.distanceTo(Fs);l<t.near||l>t.far||e.push({distance:l,point:Fs.clone(),uv:xi.getInterpolation(Fs,Cr,zs,Pr,ch,so,hh,new Lt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Ir(s,t,e,i,n,r){os.subVectors(s,e).addScalar(.5).multiply(i),n!==void 0?(Os.x=r*os.x-n*os.y,Os.y=n*os.x+r*os.y):Os.copy(os),s.copy(t),s.x+=Os.x,s.y+=Os.y,s.applyMatrix4(Kf)}class kl extends Ze{constructor(t=null,e=1,i=1,n,r,a,o,l,c=Ye,h=Ye,f,u){super(null,a,o,l,c,h,n,r,f,u),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class gl extends Pe{constructor(t,e,i,n=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const ls=new te,fh=new te,Lr=[],uh=new Gn,C_=new te,Bs=new ft,Gs=new As;class ua extends ft{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new gl(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let n=0;n<i;n++)this.setMatrixAt(n,C_)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Gn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,ls),uh.copy(t.boundingBox).applyMatrix4(ls),this.boundingBox.union(uh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new As),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,ls),Gs.copy(t.boundingSphere).applyMatrix4(ls),this.boundingSphere.union(Gs)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const i=e.morphTargetInfluences,n=this.morphTexture.source.data.data,r=i.length+1,a=t*r+1;for(let o=0;o<i.length;o++)i[o]=n[a+o]}raycast(t,e){const i=this.matrixWorld,n=this.count;if(Bs.geometry=this.geometry,Bs.material=this.material,Bs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Gs.copy(this.boundingSphere),Gs.applyMatrix4(i),t.ray.intersectsSphere(Gs)!==!1))for(let r=0;r<n;r++){this.getMatrixAt(r,ls),fh.multiplyMatrices(i,ls),Bs.matrixWorld=fh,Bs.raycast(t,Lr);for(let a=0,o=Lr.length;a<o;a++){const l=Lr[a];l.instanceId=r,l.object=this,e.push(l)}Lr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new gl(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const i=e.morphTargetInfluences,n=i.length+1;this.morphTexture===null&&(this.morphTexture=new kl(new Float32Array(n*this.count),n,this.count,_a,Ui));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<i.length;c++)a+=i[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=n*t;r[l]=o,r.set(i,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Fl extends Ze{constructor(t,e,i,n,r,a,o,l,c){super(t,e,i,n,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class P_{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,n=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)i=this.getPoint(a/t),r+=i.distanceTo(n),e.push(r),n=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let n=0;const r=i.length;let a;e?a=e:a=t*i[r-1];let o=0,l=r-1,c;for(;o<=l;)if(n=Math.floor(o+(l-o)/2),c=i[n]-a,c<0)o=n+1;else if(c>0)l=n-1;else{l=n;break}if(n=l,i[n]===a)return n/(r-1);const h=i[n],u=i[n+1]-h,m=(a-h)/u;return(n+m)/(r-1)}getTangent(t,e){let n=t-1e-4,r=t+1e-4;n<0&&(n=0),r>1&&(r=1);const a=this.getPoint(n),o=this.getPoint(r),l=e||(a.isVector2?new Lt:new R);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new R,n=[],r=[],a=[],o=new R,l=new te;for(let m=0;m<=t;m++){const g=m/t;n[m]=this.getTangentAt(g,new R)}r[0]=new R,a[0]=new R;let c=Number.MAX_VALUE;const h=Math.abs(n[0].x),f=Math.abs(n[0].y),u=Math.abs(n[0].z);h<=c&&(c=h,i.set(1,0,0)),f<=c&&(c=f,i.set(0,1,0)),u<=c&&i.set(0,0,1),o.crossVectors(n[0],i).normalize(),r[0].crossVectors(n[0],o),a[0].crossVectors(n[0],r[0]);for(let m=1;m<=t;m++){if(r[m]=r[m-1].clone(),a[m]=a[m-1].clone(),o.crossVectors(n[m-1],n[m]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(qe(n[m-1].dot(n[m]),-1,1));r[m].applyMatrix4(l.makeRotationAxis(o,g))}a[m].crossVectors(n[m],r[m])}if(e===!0){let m=Math.acos(qe(r[0].dot(r[t]),-1,1));m/=t,n[0].dot(o.crossVectors(r[0],r[t]))>0&&(m=-m);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(n[g],m*g)),a[g].crossVectors(n[g],r[g])}return{tangents:n,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}function Ol(){let s=0,t=0,e=0,i=0;function n(r,a,o,l){s=r,t=o,e=-3*r+3*a-2*o-l,i=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){n(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,f){let u=(a-r)/c-(o-r)/(c+h)+(o-a)/h,m=(o-a)/h-(l-a)/(h+f)+(l-o)/f;u*=h,m*=h,n(a,o,u,m)},calc:function(r){const a=r*r,o=a*r;return s+t*r+e*a+i*o}}}const Dr=new R,ro=new Ol,ao=new Ol,oo=new Ol;class I_ extends P_{constructor(t=[],e=!1,i="centripetal",n=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=n}getPoint(t,e=new R){const i=e,n=this.points,r=n.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=n[(o-1)%r]:(Dr.subVectors(n[0],n[1]).add(n[0]),c=Dr);const f=n[o%r],u=n[(o+1)%r];if(this.closed||o+2<r?h=n[(o+2)%r]:(Dr.subVectors(n[r-1],n[r-2]).add(n[r-1]),h=Dr),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(f),m),_=Math.pow(f.distanceToSquared(u),m),p=Math.pow(u.distanceToSquared(h),m);_<1e-4&&(_=1),g<1e-4&&(g=_),p<1e-4&&(p=_),ro.initNonuniformCatmullRom(c.x,f.x,u.x,h.x,g,_,p),ao.initNonuniformCatmullRom(c.y,f.y,u.y,h.y,g,_,p),oo.initNonuniformCatmullRom(c.z,f.z,u.z,h.z,g,_,p)}else this.curveType==="catmullrom"&&(ro.initCatmullRom(c.x,f.x,u.x,h.x,this.tension),ao.initCatmullRom(c.y,f.y,u.y,h.y,this.tension),oo.initCatmullRom(c.z,f.z,u.z,h.z,this.tension));return i.set(ro.calc(l),ao.calc(l),oo.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const n=t.points[e];this.points.push(n.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const n=this.points[e];t.points.push(n.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const n=t.points[e];this.points.push(new R().fromArray(n))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}class zl extends He{constructor(t=1,e=32,i=0,n=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:n},e=Math.max(3,e);const r=[],a=[],o=[],l=[],c=new R,h=new Lt;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,u=3;f<=e;f++,u+=3){const m=i+f/e*n;c.x=t*Math.cos(m),c.y=t*Math.sin(m),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[u]/t+1)/2,h.y=(a[u+1]/t+1)/2,l.push(h.x,h.y)}for(let f=1;f<=e;f++)r.push(f,f+1,0);this.setIndex(r),this.setAttribute("position",new Me(a,3)),this.setAttribute("normal",new Me(o,3)),this.setAttribute("uv",new Me(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new zl(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Qt extends He{constructor(t=1,e=1,i=1,n=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:n,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;n=Math.floor(n),r=Math.floor(r);const h=[],f=[],u=[],m=[];let g=0;const _=[],p=i/2;let d=0;x(),a===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new Me(f,3)),this.setAttribute("normal",new Me(u,3)),this.setAttribute("uv",new Me(m,2));function x(){const b=new R,P=new R;let T=0;const E=(e-t)/i;for(let C=0;C<=r;C++){const I=[],v=C/r,S=v*(e-t)+t;for(let U=0;U<=n;U++){const k=U/n,V=k*l+o,K=Math.sin(V),W=Math.cos(V);P.x=S*K,P.y=-v*i+p,P.z=S*W,f.push(P.x,P.y,P.z),b.set(K,E,W).normalize(),u.push(b.x,b.y,b.z),m.push(k,1-v),I.push(g++)}_.push(I)}for(let C=0;C<n;C++)for(let I=0;I<r;I++){const v=_[I][C],S=_[I+1][C],U=_[I+1][C+1],k=_[I][C+1];t>0&&(h.push(v,S,k),T+=3),e>0&&(h.push(S,U,k),T+=3)}c.addGroup(d,T,0),d+=T}function M(b){const P=g,T=new Lt,E=new R;let C=0;const I=b===!0?t:e,v=b===!0?1:-1;for(let U=1;U<=n;U++)f.push(0,p*v,0),u.push(0,v,0),m.push(.5,.5),g++;const S=g;for(let U=0;U<=n;U++){const V=U/n*l+o,K=Math.cos(V),W=Math.sin(V);E.x=I*W,E.y=p*v,E.z=I*K,f.push(E.x,E.y,E.z),u.push(0,v,0),T.x=K*.5+.5,T.y=W*.5*v+.5,m.push(T.x,T.y),g++}for(let U=0;U<n;U++){const k=P+U,V=S+U;b===!0?h.push(V,V+1,k):h.push(V+1,V,k),C+=3}c.addGroup(d,C,b===!0?1:2),d+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Qt(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Re extends Qt{constructor(t=1,e=1,i=32,n=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,i,n,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:n,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new Re(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ma extends He{constructor(t=[],e=[],i=1,n=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:n};const r=[],a=[];o(n),c(i),h(),this.setAttribute("position",new Me(r,3)),this.setAttribute("normal",new Me(r.slice(),3)),this.setAttribute("uv",new Me(a,2)),n===0?this.computeVertexNormals():this.normalizeNormals();function o(x){const M=new R,b=new R,P=new R;for(let T=0;T<e.length;T+=3)m(e[T+0],M),m(e[T+1],b),m(e[T+2],P),l(M,b,P,x)}function l(x,M,b,P){const T=P+1,E=[];for(let C=0;C<=T;C++){E[C]=[];const I=x.clone().lerp(b,C/T),v=M.clone().lerp(b,C/T),S=T-C;for(let U=0;U<=S;U++)U===0&&C===T?E[C][U]=I:E[C][U]=I.clone().lerp(v,U/S)}for(let C=0;C<T;C++)for(let I=0;I<2*(T-C)-1;I++){const v=Math.floor(I/2);I%2===0?(u(E[C][v+1]),u(E[C+1][v]),u(E[C][v])):(u(E[C][v+1]),u(E[C+1][v+1]),u(E[C+1][v]))}}function c(x){const M=new R;for(let b=0;b<r.length;b+=3)M.x=r[b+0],M.y=r[b+1],M.z=r[b+2],M.normalize().multiplyScalar(x),r[b+0]=M.x,r[b+1]=M.y,r[b+2]=M.z}function h(){const x=new R;for(let M=0;M<r.length;M+=3){x.x=r[M+0],x.y=r[M+1],x.z=r[M+2];const b=p(x)/2/Math.PI+.5,P=d(x)/Math.PI+.5;a.push(b,1-P)}g(),f()}function f(){for(let x=0;x<a.length;x+=6){const M=a[x+0],b=a[x+2],P=a[x+4],T=Math.max(M,b,P),E=Math.min(M,b,P);T>.9&&E<.1&&(M<.2&&(a[x+0]+=1),b<.2&&(a[x+2]+=1),P<.2&&(a[x+4]+=1))}}function u(x){r.push(x.x,x.y,x.z)}function m(x,M){const b=x*3;M.x=t[b+0],M.y=t[b+1],M.z=t[b+2]}function g(){const x=new R,M=new R,b=new R,P=new R,T=new Lt,E=new Lt,C=new Lt;for(let I=0,v=0;I<r.length;I+=9,v+=6){x.set(r[I+0],r[I+1],r[I+2]),M.set(r[I+3],r[I+4],r[I+5]),b.set(r[I+6],r[I+7],r[I+8]),T.set(a[v+0],a[v+1]),E.set(a[v+2],a[v+3]),C.set(a[v+4],a[v+5]),P.copy(x).add(M).add(b).divideScalar(3);const S=p(P);_(T,v+0,x,S),_(E,v+2,M,S),_(C,v+4,b,S)}}function _(x,M,b,P){P<0&&x.x===1&&(a[M]=x.x-1),b.x===0&&b.z===0&&(a[M]=P/2/Math.PI+.5)}function p(x){return Math.atan2(x.z,-x.x)}function d(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ma(t.vertices,t.indices,t.radius,t.details)}}class Bl extends Ma{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,n=1/i,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-n,-i,0,-n,i,0,n,-i,0,n,i,-n,-i,0,-n,i,0,n,-i,0,n,i,0,-i,0,-n,i,0,-n,-i,0,n,i,0,n],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Bl(t.radius,t.detail)}}class sr extends Ma{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,n=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(n,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new sr(t.radius,t.detail)}}class ee extends He{constructor(t=1,e=32,i=16,n=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:n,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const h=[],f=new R,u=new R,m=[],g=[],_=[],p=[];for(let d=0;d<=i;d++){const x=[],M=d/i;let b=0;d===0&&a===0?b=.5/e:d===i&&l===Math.PI&&(b=-.5/e);for(let P=0;P<=e;P++){const T=P/e;f.x=-t*Math.cos(n+T*r)*Math.sin(a+M*o),f.y=t*Math.cos(a+M*o),f.z=t*Math.sin(n+T*r)*Math.sin(a+M*o),g.push(f.x,f.y,f.z),u.copy(f).normalize(),_.push(u.x,u.y,u.z),p.push(T+b,1-M),x.push(c++)}h.push(x)}for(let d=0;d<i;d++)for(let x=0;x<e;x++){const M=h[d][x+1],b=h[d][x],P=h[d+1][x],T=h[d+1][x+1];(d!==0||a>0)&&m.push(M,b,T),(d!==i-1||l<Math.PI)&&m.push(b,P,T)}this.setIndex(m),this.setAttribute("position",new Me(g,3)),this.setAttribute("normal",new Me(_,3)),this.setAttribute("uv",new Me(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ee(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Ii extends He{constructor(t=1,e=.4,i=12,n=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:n,arc:r},i=Math.floor(i),n=Math.floor(n);const a=[],o=[],l=[],c=[],h=new R,f=new R,u=new R;for(let m=0;m<=i;m++)for(let g=0;g<=n;g++){const _=g/n*r,p=m/i*Math.PI*2;f.x=(t+e*Math.cos(p))*Math.cos(_),f.y=(t+e*Math.cos(p))*Math.sin(_),f.z=e*Math.sin(p),o.push(f.x,f.y,f.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),u.subVectors(f,h).normalize(),l.push(u.x,u.y,u.z),c.push(g/n),c.push(m/i)}for(let m=1;m<=i;m++)for(let g=1;g<=n;g++){const _=(n+1)*m+g-1,p=(n+1)*(m-1)+g-1,d=(n+1)*(m-1)+g,x=(n+1)*m+g;a.push(_,p,x),a.push(p,d,x)}this.setIndex(a),this.setAttribute("position",new Me(o,3)),this.setAttribute("normal",new Me(l,3)),this.setAttribute("uv",new Me(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ii(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class L_ extends Ne{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class bi extends Hn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new pt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new pt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Cl,this.normalScale=new Lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class D_ extends Hn{constructor(t){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new pt(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new pt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Cl,this.normalScale=new Lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.gradientMap=t.gradientMap,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}class ya extends Fe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new pt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class U_ extends ya{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Fe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new pt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const lo=new te,dh=new R,ph=new R;class $f{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Lt(512,512),this.map=null,this.mapPass=null,this.matrix=new te,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ll,this._frameExtents=new Lt(1,1),this._viewportCount=1,this._viewports=[new ge(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;dh.setFromMatrixPosition(t.matrixWorld),e.position.copy(dh),ph.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(ph),e.updateMatrixWorld(),lo.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(lo),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(lo)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const mh=new te,Hs=new R,co=new R;class N_ extends $f{constructor(){super(new ui(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Lt(4,2),this._viewportCount=6,this._viewports=[new ge(2,1,1,1),new ge(0,1,1,1),new ge(3,1,1,1),new ge(1,1,1,1),new ge(3,0,1,1),new ge(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(t,e=0){const i=this.camera,n=this.matrix,r=t.distance||i.far;r!==i.far&&(i.far=r,i.updateProjectionMatrix()),Hs.setFromMatrixPosition(t.matrixWorld),i.position.copy(Hs),co.copy(i.position),co.add(this._cubeDirections[e]),i.up.copy(this._cubeUps[e]),i.lookAt(co),i.updateMatrixWorld(),n.makeTranslation(-Hs.x,-Hs.y,-Hs.z),mh.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(mh)}}class gh extends ya{constructor(t,e,i=0,n=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=n,this.shadow=new N_}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class k_ extends $f{constructor(){super(new Dl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class F_ extends ya{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Fe.DEFAULT_UP),this.updateMatrix(),this.target=new Fe,this.shadow=new k_}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class O_ extends ya{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class z_ extends He{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class B_{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=_h(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=_h();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function _h(){return performance.now()}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:yl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=yl);class G_{constructor(){this._handlers=new Map}on(t,e){return this._handlers.has(t)||this._handlers.set(t,new Set),this._handlers.get(t).add(e),()=>this.off(t,e)}once(t,e){const i=this.on(t,n=>{i(),e(n)});return i}off(t,e){var i;(i=this._handlers.get(t))==null||i.delete(e)}emit(t,e={}){const i=this._handlers.get(t);if(i)for(const n of[...i])try{n(e)}catch(r){console.error(`[events] handler for "${t}" threw`,r)}}clear(){this._handlers.clear()}}const vh="Turbo Kart Legends",xh=8,rr=.9,H_=3.6*1.6,We=Object.freeze({COUNTDOWN:"countdown",RACING:"racing",FINISHED:"finished"}),we=Object.freeze({ROAD:"road",OFFROAD:"offroad",BOOST:"boost",VOID:"void"}),Zi=Object.freeze({EASY:"easy",NORMAL:"normal",HARD:"hard"}),ar=Object.freeze({mushroom:{id:"mushroom",name:"Mushroom",count:1,weight:[3,5,4],color:"#ff5a5a"},triple_mushroom:{id:"triple_mushroom",name:"Triple Mushroom",count:3,weight:[0,2,5],color:"#ff5a5a"},banana:{id:"banana",name:"Banana",count:1,weight:[6,3,0],color:"#ffd93d"},triple_banana:{id:"triple_banana",name:"Triple Banana",count:3,weight:[2,2,0],color:"#ffd93d"},green_shell:{id:"green_shell",name:"Green Shell",count:1,weight:[5,4,1],color:"#3ddc84"},triple_green:{id:"triple_green",name:"Triple Green",count:3,weight:[1,3,2],color:"#3ddc84"},red_shell:{id:"red_shell",name:"Red Shell",count:1,weight:[0,4,4],color:"#ff3b3b"},star:{id:"star",name:"Super Star",count:1,weight:[0,0,3],color:"#ffe066"},lightning:{id:"lightning",name:"Lightning",count:1,weight:[0,0,2],color:"#9ad0ff"},bob_omb:{id:"bob_omb",name:"Bob-omb",count:1,weight:[0,1,3],color:"#333a4a"},fake_box:{id:"fake_box",name:"Fake Item Box",count:1,weight:[3,1,0],color:"#c84bff"}}),fn=Object.freeze(Object.keys(ar)),rt=Object.freeze({DRIFT_START:"drift_start",DRIFT_LEVEL:"drift_level",DRIFT_END:"drift_end",BOOST:"boost",HOP:"hop",LAND:"land",HIT:"hit",WALL_HIT:"wall_hit",OFFROAD_ENTER:"offroad_enter",OFFROAD_EXIT:"offroad_exit",KART_BUMP:"kart_bump",COUNTDOWN:"countdown",RACE_START:"race_start",LAP:"lap",FINISH:"finish",RACE_OVER:"race_over",POSITION_CHANGE:"position_change",RESPAWN:"respawn",WRONG_WAY:"wrong_way",ITEM_PICKUP:"item_pickup",ITEM_ROULETTE_TICK:"item_roulette_tick",ITEM_USE:"item_use",ITEM_HIT:"item_hit",SHELL_BOUNCE:"shell_bounce",EXPLOSION:"explosion",STAR_START:"star_start",STAR_END:"star_end",LIGHTNING:"lightning",UI_MOVE:"ui_move",UI_SELECT:"ui_select",UI_BACK:"ui_back",UI_MUTE_TOGGLE:"ui_mute_toggle",SCREEN:"screen",PAUSE:"pause"});function Si(s=1){let t=s>>>0;const e=()=>{t=t+1831565813|0;let i=Math.imul(t^t>>>15,1|t);return i=i+Math.imul(i^i>>>7,61|i)^i,((i^i>>>14)>>>0)/4294967296};return e.range=(i,n)=>i+(n-i)*e(),e.int=(i,n)=>Math.floor(e.range(i,n+1)),e.pick=i=>i[Math.floor(e()*i.length)],e.chance=i=>e()<i,e}const ke=(s,t,e)=>s+(t-s)*e,Xt=(s,t,e)=>s<t?t:s>e?e:s,ei=(s,t,e,i)=>ke(s,t,1-Math.exp(-e*i)),Ge=s=>s-Math.floor(s),Ln=(s,t)=>{let e=(t-s)%(Math.PI*2);return e>Math.PI&&(e-=Math.PI*2),e<-Math.PI&&(e+=Math.PI*2),e};let ho=null;function V_(){if(ho)return ho;const s=new Uint8Array([90,150,210,255]),t=new kl(s,4,1,_a);return t.minFilter=Ye,t.magFilter=Ye,t.colorSpace=Ri,t.needsUpdate=!0,ho=t,t}function Bt(s,t={}){return new D_({color:s,gradientMap:V_(),...t})}function pn(s,t={}){return new bi({color:s,flatShading:!0,roughness:.85,metalness:.05,...t})}function W_(s,t,e,i={}){const n=document.createElement("canvas");n.width=s,n.height=t;const r=n.getContext("2d");e(r,s,t);const a=new Fl(n);return a.colorSpace=fi,a.anisotropy=4,i.repeat&&(a.wrapS=a.wrapT=er,a.repeat.set(i.repeat[0],i.repeat[1])),a}const X_=28,fo=6;function Gl(s,t=22,e=6){const i=s.length,n=[];for(let _=0;_<i;_++){const p=s[(_-1+i)%i],d=s[_],x=s[(_+1)%i],M=d[3]??t;let b=p[0]-d[0],P=p[2]-d[2],T=x[0]-d[0],E=x[2]-d[2];const C=Math.hypot(b,P),I=Math.hypot(T,E);b/=C,P/=C,T/=I,E/=I;const v=Math.acos(Xt(b*T+P*E,-1,1));if(v>Math.PI-.02||M<=.01){n.push({sx:d[0],sz:d[2],ex:d[0],ez:d[2],y:d[1],arc:null});continue}let S=M/Math.tan(v/2);const U=.49*Math.min(C,I);let k=M;S>U&&(S=U,k=S*Math.tan(v/2));const V=b+T,K=P+E,W=Math.hypot(V,K),Q=d[0]+V/W*(k/Math.sin(v/2)),X=d[2]+K/W*(k/Math.sin(v/2)),dt=d[0]+b*S,lt=d[2]+P*S,gt=d[0]+T*S,Ft=d[2]+E*S,st=Math.atan2(lt-X,dt-Q);let H=Math.atan2(Ft-X,gt-Q)-st;for(;H>Math.PI;)H-=Math.PI*2;for(;H<-Math.PI;)H+=Math.PI*2;n.push({sx:dt,sz:lt,ex:gt,ez:Ft,y:d[1],arc:{cx:Q,cz:X,r:k,a1:st,sweep:H}})}const r=[],a=(_,p,d)=>{const x=r[r.length-1];x&&Math.hypot(x[0]-_,x[2]-d)<e*.35||r.push([_,p,d])},o=[];for(let _=0;_<i;_++){const p=n[_],d=n[(_+1)%i];if(p.arc){const T=Math.abs(p.arc.sweep)*p.arc.r,E=Math.max(2,Math.ceil(T/e));for(let C=0;C<=E;C++){const I=p.arc.a1+p.arc.sweep*C/E;a(p.arc.cx+Math.cos(I)*p.arc.r,p.y,p.arc.cz+Math.sin(I)*p.arc.r),C===Math.floor(E/2)&&o.push([r.length-1,p.y])}}else a(p.sx,p.y,p.sz),o.push([r.length-1,p.y]);const x=d.sx-p.ex,M=d.sz-p.ez,b=Math.hypot(x,M),P=Math.max(1,Math.round(b/e));for(let T=1;T<P;T++){const E=T/P;a(p.ex+x*E,p.y,p.ez+M*E)}}const l=r[0],c=r[r.length-1];Math.hypot(l[0]-c[0],l[2]-c[2])<e*.35&&r.pop();const h=r.length,f=new Float64Array(h+1);for(let _=0;_<h;_++){const p=r[_],d=r[(_+1)%h];f[_+1]=f[_]+Math.hypot(d[0]-p[0],d[2]-p[2])}const u=f[h],m=_=>_*_*(3-2*_),g=o.length;for(let _=0;_<h;_++){const p=f[_];let d=0;for(;d<g&&f[o[d][0]]<=p;)d++;const x=o[(d-1+g)%g],M=o[d%g];let b=f[x[0]],P=f[M[0]],T=p;P<=b&&(P+=u,T<b&&(T+=u));const E=P>b?Xt((T-b)/(P-b),0,1):0;r[_][1]=x[1]+(M[1]-x[1])*m(E)}return r}class q_{constructor(t,e={}){const i=t.map(([d,x,M])=>new R(d,x,M));this.curve=new I_(i,!0,"centripetal"),this.curve.arcLengthDivisions=2e3,this.length=this.curve.getLength();const n=Xt(Math.round(this.length/1.25),600,1200);this.N=n;const r=new Float32Array(n),a=new Float32Array(n),o=new Float32Array(n),l=new Float32Array(n),c=new Float32Array(n),h=new Float32Array(n),f=new Float32Array(n),u=new Float32Array(n),m=e.halfWidth??(()=>7),g=e.wallGap??(()=>4.5),_=new R,p=new R;for(let d=0;d<n;d++){const x=d/n;this.curve.getPointAt(x,_),this.curve.getTangentAt(x,p).normalize(),r[d]=_.x,a[d]=_.y,o[d]=_.z,l[d]=p.x,c[d]=p.y,h[d]=p.z,f[d]=m(x),u[d]=f[d]+g(x)}this.px=r,this.py=a,this.pz=o,this.tx=l,this.ty=c,this.tz=h,this.hw=f,this.whw=u,this.voids=[],this.pads=[],this._tmpA=new R}addVoid(t,e,i,n=null){this.voids.push({t0:t,t1:e,side:i,from:n})}addPad(t,e,i,n){this.pads.push({cx:t.x,cz:t.z,fx:Math.sin(e),fz:Math.cos(e),rx:Math.cos(e),rz:-Math.sin(e),hl:i,hw:n})}sample(t){const e=this.N,i=Ge(t)*e;let n=Math.floor(i);const r=i-n;n=n%e;const a=(n+1)%e,o=new R(this.px[n]+(this.px[a]-this.px[n])*r,this.py[n]+(this.py[a]-this.py[n])*r,this.pz[n]+(this.pz[a]-this.pz[n])*r),l=new R(this.tx[n]+(this.tx[a]-this.tx[n])*r,this.ty[n]+(this.ty[a]-this.ty[n])*r,this.tz[n]+(this.tz[a]-this.tz[n])*r).normalize(),c=new R(l.z,0,-l.x).normalize();return{position:o,tangent:l,right:c,halfWidth:this.hw[n]+(this.hw[a]-this.hw[n])*r,wallHalfWidth:this.whw[n]+(this.whw[a]-this.whw[n])*r}}headingAt(t){const e=this.sample(t);return Math.atan2(e.tangent.x,e.tangent.z)}pointAt(t,e=0,i=0){const n=this.sample(t);return n.position.addScaledVector(n.right,e).add(new R(0,i,0))}bounds(t=0){let e=1/0,i=-1/0,n=1/0,r=-1/0;for(let a=0;a<this.N;a++){const o=this.px[a],l=this.pz[a];o<e&&(e=o),o>i&&(i=o),l<n&&(n=l),l>r&&(r=l)}return{minX:e-t,maxX:i+t,minZ:n-t,maxZ:r+t}}_localSearch(t,e,i,n){const r=this.N;let a=-1,o=1/0;for(let c=-n;c<=n;c++){const h=((i+c)%r+r)%r,f=this.px[h]-t,u=this.pz[h]-e,m=f*f+u*u;m<o&&(o=m,a=h)}const l=((a-i)%r+r)%r;return l===n||l===r-n?-1:a}_fullSearch(t,e){const i=this.N;let n=0,r=1/0;for(let o=0;o<i;o+=fo){const l=this.px[o]-t,c=this.pz[o]-e,h=l*l+c*c;h<r&&(r=h,n=o)}const a=n;for(let o=-fo;o<=fo;o++){const l=((a+o)%i+i)%i,c=this.px[l]-t,h=this.pz[l]-e,f=c*c+h*h;f<r&&(r=f,n=l)}return n}getSurfaceAt(t,e){const i=this.N,n=t.x,r=t.z;let a;typeof e=="number"&&Number.isFinite(e)?(a=this._localSearch(n,r,Math.round(Ge(e)*i)%i,X_),a<0&&(a=this._fullSearch(n,r))):a=this._fullSearch(n,r);let o=a,l=0,c=1/0;for(let C=-1;C<=0;C++){const I=((a+C)%i+i)%i,v=(I+1)%i,S=this.px[I],U=this.pz[I],k=this.px[v]-S,V=this.pz[v]-U,K=k*k+V*V;let W=K>1e-9?((n-S)*k+(r-U)*V)/K:0;W=W<0?0:W>1?1:W;const Q=S+k*W,X=U+V*W,dt=n-Q,lt=r-X,gt=dt*dt+lt*lt;gt<c&&(c=gt,o=I,l=W)}const h=o,f=(h+1)%i,u=l,m=Ge((h+u)/i),g=this.py[h]+(this.py[f]-this.py[h])*u,_=new R(this.tx[h]+(this.tx[f]-this.tx[h])*u,this.ty[h]+(this.ty[f]-this.ty[h])*u,this.tz[h]+(this.tz[f]-this.tz[h])*u).normalize(),p=new R(_.z,0,-_.x).normalize(),d=this.px[h]+(this.px[f]-this.px[h])*u,x=this.pz[h]+(this.pz[f]-this.pz[h])*u,M=(n-d)*p.x+(r-x)*p.z,b=this.hw[h]+(this.hw[f]-this.hw[h])*u,P=this.whw[h]+(this.whw[f]-this.whw[h])*u,T=Math.abs(M);let E;if(T<=b){E=we.ROAD;for(let C=0;C<this.pads.length;C++){const I=this.pads[C],v=n-I.cx,S=r-I.cz,U=v*I.fx+S*I.fz;if(U<-I.hl||U>I.hl)continue;const k=v*I.rx+S*I.rz;if(k>=-I.hw&&k<=I.hw){E=we.BOOST;break}}}else{E=we.OFFROAD;const C=M>0?1:-1;for(let I=0;I<this.voids.length;I++){const v=this.voids[I];if(v.side!==0&&v.side!==C||m<v.t0||m>v.t1)continue;const S=v.from??b+.6;if(T>=S){E=we.VOID;break}}}return{t:m,height:g,lateral:M,halfWidth:b,wallHalfWidth:P,type:E,tangent:_,right:p}}}class Hl{constructor(t,e,i={}){this.id=t.id,this.name=t.name,this.laps=t.laps,this._spline=new q_(e,i),this.spline=this._spline.curve,this.length=this._spline.length,this.group=new Te,this.group.name="track:"+t.id,this.environment={background:new pt(8898559),fog:null},this.startGrid=[],this.itemBoxes=[],this.boostPads=[],this.hazards=[],this.checkpointCount=Xt(Math.round(this.length/100),8,16),this.minimap=this._buildMinimap(),this._animated=[],this._timeMaterials=[],this._skirt=null,this._groundY=-1,this._time=0}getSurfaceAt(t,e){return this._spline.getSurfaceAt(t,e)}sample(t){return this._spline.sample(t)}respawnPoint(t){const e=this._spline.sample(t);return e.position.y+=.5,{position:e.position,heading:Math.atan2(e.tangent.x,e.tangent.z)}}terrainHeight(t,e,i=null){i||(i=this._spline.getSurfaceAt(new R(t,0,e)));const n=Math.abs(i.lateral);if(!this._skirt)return n<=i.wallHalfWidth+.5?i.height:this._groundY;const{width:r}=this._skirt,a=Math.min(this._groundY,i.height-.5);return n<=i.wallHalfWidth+.5?i.height:n>=i.wallHalfWidth+r?this._groundY:ke(i.height,a,(n-i.wallHalfWidth-.5)/(r-.5))}animate(t){return this._animated.push(t),t}timeMaterial(t){return this._timeMaterials.push(t),t}addHazard(t){Array.isArray(t)?this.hazards.push(...t):this.hazards.push(t)}setupLights({sunColor:t=16773846,sunIntensity:e=2.4,sunDir:i=[.5,1,.35],hemiSky:n=12575999,hemiGround:r=6983498,hemiIntensity:a=.9,shadowMapSize:o=2048,ambient:l=null}={}){const c=this._spline.bounds(40),h=(c.minX+c.maxX)/2,f=(c.minZ+c.maxZ)/2,u=Math.max(c.maxX-c.minX,c.maxZ-c.minZ)/2+10,m=new F_(t,e),g=new R(...i).normalize();m.position.set(h+g.x*400,g.y*400,f+g.z*400),m.target.position.set(h,0,f),m.castShadow=!0,m.shadow.mapSize.set(o,o);const _=m.shadow.camera;_.left=-u,_.right=u,_.top=u,_.bottom=-u,_.near=50,_.far=800,m.shadow.bias=-6e-4,m.shadow.normalBias=.6,m.name="sun",this.group.add(m,m.target);const p=new U_(n,r,a);return p.name="hemi",this.group.add(p),l&&this.group.add(new O_(l.color,l.intensity)),this.sun=m,this.hemi=p,m}_buildMinimap(){const t=[];let i=1/0,n=-1/0,r=1/0,a=-1/0;for(let o=0;o<120;o++){const l=this._spline.sample(o/120);t.push({x:l.position.x,z:l.position.z}),i=Math.min(i,l.position.x),n=Math.max(n,l.position.x),r=Math.min(r,l.position.z),a=Math.max(a,l.position.z)}return{points:t,bounds:{minX:i,maxX:n,minZ:r,maxZ:a}}}update(t,e){this._time=e;for(let i=0;i<this._timeMaterials.length;i++)this._timeMaterials[i].userData.uTime.value=e;for(let i=0;i<this._animated.length;i++)this._animated[i].update(t,e)}dispose(){const t=new Set,e=i=>{if(!(!i||t.has(i))){t.add(i);for(const n of["map","emissiveMap","alphaMap"]){const r=i[n];r&&!t.has(r)&&(t.add(r),r.dispose())}i.dispose()}};this.group.traverse(i=>{i.geometry&&!t.has(i.geometry)&&(t.add(i.geometry),i.geometry.dispose()),i.material&&(Array.isArray(i.material)?i.material.forEach(e):e(i.material)),i.isInstancedMesh&&i.dispose()}),this._animated.length=0,this._timeMaterials.length=0,this.hazards.length=0}}function Ji(s,t=!1){const e=s[0].index!==null,i=new Set(Object.keys(s[0].attributes)),n=new Set(Object.keys(s[0].morphAttributes)),r={},a={},o=s[0].morphTargetsRelative,l=new He;let c=0;for(let h=0;h<s.length;++h){const f=s[h];let u=0;if(e!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const m in f.attributes){if(!i.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+m+'" attribute exists among all geometries, or in none of them.'),null;r[m]===void 0&&(r[m]=[]),r[m].push(f.attributes[m]),u++}if(u!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const m in f.morphAttributes){if(!n.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[m]===void 0&&(a[m]=[]),a[m].push(f.morphAttributes[m])}if(t){let m;if(e)m=f.index.count;else if(f.attributes.position!==void 0)m=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,m,h),c+=m}}if(e){let h=0;const f=[];for(let u=0;u<s.length;++u){const m=s[u].index;for(let g=0;g<m.count;++g)f.push(m.getX(g)+h);h+=s[u].attributes.position.count}l.setIndex(f)}for(const h in r){const f=Mh(r[h]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,f)}for(const h in a){const f=a[h][0].length;if(f===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let u=0;u<f;++u){const m=[];for(let _=0;_<a[h].length;++_)m.push(a[h][_][u]);const g=Mh(m);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}return l}function Mh(s){let t,e,i,n=-1,r=0;for(let c=0;c<s.length;++c){const h=s[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(n===-1&&(n=h.gpuType),n!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const a=new t(r),o=new Pe(a,e,i);let l=0;for(let c=0;c<s.length;++c){const h=s[c];if(h.isInterleavedBufferAttribute){const f=l/e;for(let u=0,m=h.count;u<m;u++)for(let g=0;g<e;g++){const _=h.getComponent(u,g);o.setComponent(u+f,g,_)}}else a.set(h.array,l);l+=h.count*e}return n!==void 0&&(o.gpuType=n),o}const Y_=typeof document<"u"&&typeof document.createElement=="function";function ni(s,t,e,i={}){let n;if(Y_){const r=document.createElement("canvas");r.width=s,r.height=t;const a=r.getContext("2d");e(a,s,t),n=new Fl(r)}else n=new kl(new Uint8Array([255,255,255,255]),1,1),n.needsUpdate=!0;return n.colorSpace=i.srgb===!1?Ri:fi,n.anisotropy=4,n.wrapS=n.wrapT=er,i.repeat&&n.repeat.set(i.repeat[0],i.repeat[1]),i.nearest&&(n.magFilter=Ye,n.minFilter=Ks),n}function Vl(s,t,e,i,n,r,a=1,o=3){for(let l=0;l<i;l++){s.fillStyle=n[Math.floor(r()*n.length)];const c=a+r()*(o-a);s.fillRect(r()*t,r()*e,c,c)}}function K_({base:s="#3c3f48",speck:t=["#4a4e58","#33363e","#565a66"],centre:e="#ffd84a",edge:i="#f4f4f4",dashes:n=2,wet:r=!1}={}){return ni(512,512,(a,o,l)=>{const c=Si(7);if(a.fillStyle=s,a.fillRect(0,0,o,l),Vl(a,o,l,r?2500:5e3,t,c,1,4),r)for(let f=0;f<14;f++){const u=a.createLinearGradient(0,0,o,0);u.addColorStop(0,"rgba(255,255,255,0)"),u.addColorStop(.5,`rgba(180,200,255,${.03+c()*.05})`),u.addColorStop(1,"rgba(255,255,255,0)"),a.fillStyle=u,a.fillRect(0,c()*l,o,12+c()*30)}a.fillStyle=i,a.fillRect(Math.round(o*.035),0,10,l),a.fillRect(Math.round(o*.965)-10,0,10,l),a.fillStyle=e;const h=l/n;for(let f=0;f<n;f++)a.fillRect(o/2-6,f*h+h*.15,12,h*.5)})}function $_(s="#e53935",t="#f7f7f7"){return ni(32,128,(e,i,n)=>{e.fillStyle=s,e.fillRect(0,0,i,n/2),e.fillStyle=t,e.fillRect(0,n/2,i,n/2),e.fillStyle="rgba(0,0,0,0.18)",e.fillRect(0,0,3,n)},{nearest:!0})}function yh(s=16,t=4){return ni(s*16,t*16,(e,i,n)=>{for(let r=0;r<t;r++)for(let a=0;a<s;a++)e.fillStyle=(a+r)%2?"#111111":"#f5f5f5",e.fillRect(a*16,r*16,16,16)},{nearest:!0})}function Yi(s){const t={sand:{base:"#e9cf8f",speck:["#f2dea6","#d9bd7b","#f7e7b8","#cbb06d"],count:4e3},grass:{base:"#5cb843",speck:["#6fcf4f","#4aa235","#82d95e","#3f8f2c"],count:6e3},ash:{base:"#4a3d40",speck:["#5c4c50","#3a2f33","#6e5a5c","#9a4a2c"],count:4500},gravel:{base:"#4a4f5c",speck:["#5a606e","#3c414d","#6a7182","#2f333c"],count:5e3},concrete:{base:"#8d929c",speck:["#9aa0aa","#7e838c","#a6abb5"],count:3e3},rock:{base:"#5a4a48",speck:["#6b5a57","#4a3b39","#7c6a66","#3a2e2c"],count:4e3},lavaRock:{base:"#352628",speck:["#463438","#281c1f","#553f42","#8a3a24"],count:5e3}},e=t[s]??t.grass;return ni(256,256,(i,n,r)=>{const a=Si(s.length*31);if(i.fillStyle=e.base,i.fillRect(0,0,n,r),Vl(i,n,r,e.count,e.speck,a,1,s==="rock"||s==="lavaRock"?6:3),s==="grass"){i.strokeStyle="rgba(30,90,20,0.35)";for(let o=0;o<400;o++){const l=a()*n,c=a()*r;i.beginPath(),i.moveTo(l,c),i.lineTo(l+a()*4-2,c-4-a()*4),i.stroke()}}if(s==="ash"||s==="lavaRock"){i.strokeStyle="rgba(255,120,30,0.55)",i.lineWidth=2;for(let o=0;o<18;o++){let l=a()*n,c=a()*r;i.beginPath(),i.moveTo(l,c);for(let h=0;h<6;h++)l+=a()*30-15,c+=a()*30-15,i.lineTo(l,c);i.stroke()}}})}function j_(s,{stars:t=0,starColor:e="255,255,255",starAlpha:i=[.4,1],embers:n=0}={}){return ni(t>0||n>0?1024:64,512,(r,a,o)=>{const l=r.createLinearGradient(0,o,0,0);for(const[c,h]of s)l.addColorStop(c,h);if(r.fillStyle=l,r.fillRect(0,0,a,o),t>0){const c=Si(99);for(let h=0;h<t;h++){const f=c()*o*.7;r.fillStyle=`rgba(${e},${i[0]+c()*(i[1]-i[0])})`,r.fillRect(c()*a,f,c()<.15?2:1,c()<.15?2:1)}}if(n>0){const c=Si(31);for(let h=0;h<n;h++){const f=o*.62+c()*o*.3;r.fillStyle=`rgba(255,${150+Math.floor(c()*80)},60,${.35+c()*.5})`;const u=c()<.2?3:2;r.fillRect(c()*a,f,u,u)}}})}function Wl(s,{w:t=512,h:e=128,bg:i="#1e2a44",fg:n="#ffffff",stroke:r="#000000",accent:a=null,font:o='Impact, "Arial Black", "Helvetica Neue", sans-serif',glow:l=0}={}){return ni(t,e,c=>{c.fillStyle=i,c.fillRect(0,0,t,e),a&&(c.fillStyle=a,c.fillRect(0,0,t,e*.08),c.fillRect(0,e*.92,t,e*.08)),c.textAlign="center",c.textBaseline="middle";let h=Math.floor(e*.7);for(c.font=`bold ${h}px ${o}`;c.measureText(s).width>t*.9&&h>10;)h-=4,c.font=`bold ${h}px ${o}`;l>0&&(c.shadowColor=n,c.shadowBlur=l),c.lineWidth=Math.max(2,h*.08),c.strokeStyle=r,c.strokeText(s,t/2,e/2),c.fillStyle=n,c.fillText(s,t/2,e/2)})}function Z_(s="#ffcc33",t="#1d2b6b"){return ni(128,128,(e,i,n)=>{e.fillStyle=t,e.fillRect(0,0,i,n),e.fillStyle=s;for(let r=0;r<2;r++){const a=r*(n/2);e.beginPath(),e.moveTo(0,a+n*.05),e.lineTo(i/2,a+n*.3),e.lineTo(i,a+n*.05),e.lineTo(i,a+n*.25),e.lineTo(i/2,a+n*.5),e.lineTo(0,a+n*.25),e.closePath(),e.fill()}})}function jf(){return ni(256,256,(s,t,e)=>{const i=Si(5);s.fillStyle="#ff8210",s.fillRect(0,0,t,e);for(let n=0;n<90;n++){const r=8+i()*28,a=s.createRadialGradient(0,0,0,0,0,r);a.addColorStop(0,"#fff2a0"),a.addColorStop(.45,"#ffb62a"),a.addColorStop(1,"rgba(255,120,10,0)"),s.save(),s.translate(i()*t,i()*e),s.fillStyle=a,s.beginPath(),s.arc(0,0,r,0,Math.PI*2),s.fill(),s.restore()}s.fillStyle="rgba(70,22,12,0.7)";for(let n=0;n<30;n++){s.beginPath();const r=i()*t,a=i()*e,o=5+i()*15;s.moveTo(r+o,a);for(let l=1;l<7;l++){const c=l/7*Math.PI*2,h=o*(.6+i()*.6);s.lineTo(r+Math.cos(c)*h,a+Math.sin(c)*h)}s.closePath(),s.fill()}})}function J_(){return ni(256,256,(s,t,e)=>{const i=Si(11);s.fillStyle="#2f9fe0",s.fillRect(0,0,t,e),Vl(s,t,e,900,["#3badf0","#2a90d0","#48bbf7"],i,3,10),s.strokeStyle="rgba(255,255,255,0.75)",s.lineWidth=3;for(let n=0;n<26;n++){const r=i()*t,a=i()*e;s.beginPath(),s.moveTo(r,a),s.bezierCurveTo(r+15,a-6,r+30,a+6,r+45+i()*20,a),s.stroke()}})}function Q_(s=1,t="#ffd27a"){return ni(128,256,(e,i,n)=>{const r=Si(s);e.fillStyle="#0b0f1e",e.fillRect(0,0,i,n);const a=6,o=14,l=i/a,c=n/o,h=[t,"#8be9fd","#ff79c6","#fff6d0","#9cffb0"];for(let f=0;f<o;f++)for(let u=0;u<a;u++)r()<.42&&(e.fillStyle=r()<.75?t:h[Math.floor(r()*h.length)],e.globalAlpha=.6+r()*.4,e.fillRect(u*l+l*.2,f*c+c*.2,l*.6,c*.55));e.globalAlpha=1})}function Xl(s="#ff3355",t="#ffffff"){return ni(64,64,(e,i,n)=>{e.fillStyle=s,e.fillRect(0,0,i,n),e.fillStyle=t,e.fillRect(0,n*.35,i,n*.3),e.fillStyle="rgba(0,0,0,0.15)",e.fillRect(0,0,4,n)})}function tv(s="#ffffff",t="#ff5a36"){return ni(128,256,(e,i,n)=>{e.clearRect(0,0,i,n),e.fillStyle=t,e.fillRect(i*.55,0,i*.12,n),e.fillStyle=s,e.fillRect(i*.25,0,i*.1,n);for(let r=0;r<4;r++){const a=r*(n/4);e.fillRect(i*.05,a+6,i*.8,14),e.beginPath(),e.moveTo(i*.85,a+6),e.lineTo(i*.97,a+13),e.lineTo(i*.85,a+20),e.closePath(),e.fill()}})}function ev(s="#37f5ff",t="#12141f"){return ni(64,64,(e,i,n)=>{e.fillStyle=t,e.fillRect(0,0,i,n),e.fillStyle="rgba(255,255,255,0.05)";for(let r=0;r<8;r++)e.fillRect(r*8,0,4,n);e.fillStyle=s,e.fillRect(i*.78,0,i*.12,n),e.fillStyle="rgba(255,255,255,0.35)",e.fillRect(i*.1,0,i*.03,n)})}function iv(){return ni(128,128,(s,t,e)=>{s.fillStyle="#5a4f5c",s.fillRect(0,0,t,e),s.fillStyle="#1a1418",s.beginPath(),s.moveTo(18,30),s.lineTo(56,44),s.lineTo(18,54),s.closePath(),s.fill(),s.beginPath(),s.moveTo(110,30),s.lineTo(72,44),s.lineTo(110,54),s.closePath(),s.fill(),s.fillStyle="#ffffff",s.fillRect(24,40,12,8),s.fillRect(92,40,12,8),s.fillStyle="#1a1418",s.beginPath(),s.moveTo(30,96),s.lineTo(64,78),s.lineTo(98,96),s.lineTo(64,92),s.closePath(),s.fill()})}function nv(s="#4d4249",t="#2a2226"){return ni(256,256,(e,i,n)=>{const r=Si(21);e.fillStyle=t,e.fillRect(0,0,i,n);const a=6,o=n/a;for(let l=0;l<a;l++){const c=l%2*32;for(let h=-64;h<i;h+=64){const f=.85+r()*.3;e.fillStyle=sv(s,f),e.fillRect(h+c+3,l*o+3,58,o-6)}}})}function sv(s,t){const e=new pt(s);return e.r=Math.min(1,e.r*t),e.g=Math.min(1,e.g*t),e.b=Math.min(1,e.b*t),"#"+e.getHexString()}function Zf(s,t){const e=s.N;t=(t%e+e)%e;const i=s.tx[t],n=s.tz[t],r=Math.hypot(i,n)||1;return{i:t,t:t/e,dist:t/e*s.length,x:s.px[t],y:s.py[t],z:s.pz[t],tx:i/r,tz:n/r,rx:n/r,rz:-i/r,hw:s.hw[t],whw:s.whw[t]}}function Xe(s,{edgeA:t,edgeB:e,tile:i=10,skip:n=null,from:r=0,to:a=1,step:o=1}){const l=s.N,c=a-r>=1-1e-9,h=c?0:Math.floor(Ge(r)*l),f=c?l:Math.max(1,Math.ceil((a-r)*l)),u=Math.ceil(f/o)+1,m=s.length/l,g=[],_=[],p=[];for(let x=0;x<u;x++){const M=Math.min(x*o,f),b=Zf(s,h+M),P=M*m,T=t(b),E=e(b);if(g.push(T[0],T[1],T[2],E[0],E[1],E[2]),_.push(0,P/i,1,P/i),x<u-1&&!(n&&n(b))){const C=x*2;p.push(C,C+2,C+1,C+1,C+2,C+3)}}const d=new He;return d.setAttribute("position",new Me(g,3)),d.setAttribute("uv",new Me(_,2)),d.setIndex(p),d.computeVertexNormals(),d}const ne=(s,t=0)=>e=>{const i=typeof s=="function"?s(e):s,n=typeof t=="function"?t(e):e.y+t;return[e.x+e.rx*i,n,e.z+e.rz*i]};function kn(s,t,e){for(const i of s.voids)if(!(t.t<i.t0||t.t>i.t1)&&(i.side===0||e===0||i.side===e))return!0;return!1}function ql(s,{asphalt:t={},curbColors:e=["#e53935","#f7f7f7"],offroadTexture:i,offroadColor:n=16777215,skirt:r=null,wetRoad:a=!1}={}){const o=new Te;o.name="road";const l=[],c=[],h=K_({...t,wet:a}),f=a?new bi({map:h,roughness:.35,metalness:.2,color:15133695,emissive:16777215,emissiveMap:h,emissiveIntensity:.28}):Bt(16777215,{map:h}),u=Xe(s,{edgeA:ne(b=>-b.hw),edgeB:ne(b=>b.hw),tile:16}),m=new ft(u,f);m.receiveShadow=!0,m.name="asphalt",o.add(m),l.push(f),c.push(u);const g=$_(e[0],e[1]),_=Bt(16777215,{map:g}),p=Xe(s,{edgeA:ne(b=>-b.hw-.9,.05),edgeB:ne(b=>-b.hw,.05),tile:2.4}),d=Xe(s,{edgeA:ne(b=>b.hw,.05),edgeB:ne(b=>b.hw+.9,.05),tile:2.4}),x=Ji([p,d]);p.dispose(),d.dispose();const M=new ft(x,_);if(M.receiveShadow=!0,o.add(M),l.push(_),c.push(x),i){i.repeat.set(2,1);const b=Bt(n,{map:i}),P=Xe(s,{edgeA:ne(I=>-I.whw-.6,-.03),edgeB:ne(I=>-I.hw-.85,-.03),tile:8,skip:I=>kn(s,I,-1)}),T=Xe(s,{edgeA:ne(I=>I.hw+.85,-.03),edgeB:ne(I=>I.whw+.6,-.03),tile:8,skip:I=>kn(s,I,1)}),E=Ji([P,T]);P.dispose(),T.dispose();const C=new ft(E,b);C.receiveShadow=!0,o.add(C),l.push(b),c.push(E)}if(r){const{width:b=28,groundY:P=-1,texture:T,color:E=16777215}=r;T&&T.repeat.set(3,1);const C=Bt(E,{map:T??null}),I=V=>Math.min(P,V.y-.5),v=Xe(s,{edgeA:ne(V=>-V.whw-b,I),edgeB:ne(V=>-V.whw-.5,-.06),tile:12,skip:V=>kn(s,V,-1)}),S=Xe(s,{edgeA:ne(V=>V.whw+.5,-.06),edgeB:ne(V=>V.whw+b,I),tile:12,skip:V=>kn(s,V,1)}),U=Ji([v,S]);v.dispose(),S.dispose();const k=new ft(U,C);k.receiveShadow=!0,o.add(k),l.push(C),c.push(U)}return{group:o,materials:l,geometries:c}}function Jf(s,{height:t=1.4,texture:e=null,color:i=16777215,emissive:n=null,emissiveIntensity:r=1,tile:a=6,sink:o=.4,material:l=null}={}){const c=l??Bt(i,{map:e,side:_e,emissive:n??0,emissiveIntensity:r,emissiveMap:n?e:null}),h=Xe(s,{edgeA:ne(g=>-g.whw,-o),edgeB:ne(g=>-g.whw,t),tile:a,skip:g=>kn(s,g,-1)}),f=Xe(s,{edgeA:ne(g=>g.whw,-o),edgeB:ne(g=>g.whw,t),tile:a,skip:g=>kn(s,g,1)}),u=Ji([h,f]);h.dispose(),f.dispose();const m=new ft(u,c);return m.castShadow=!0,m.receiveShadow=!0,m.name="walls",{mesh:m,material:c,geometry:u}}function Yl(s,{accent:t="#ff5a36",bannerText:e="TURBO KART LEGENDS",pillarColor:i=16053492}={}){const n=new Te;n.name="startGate";const r=s.sample(0),a=Math.atan2(r.tangent.x,r.tangent.z),o=[],l=[],c=new It(1.2,8,1.2),h=Bt(i),f=new It(r.halfWidth*2+5,1.2,1.4),u=Bt(t);o.push(c,f),l.push(h,u);for(const v of[-1,1]){const S=new ft(c,h);S.position.copy(r.position).addScaledVector(r.right,v*(r.halfWidth+1.8)).add(new R(0,4,0)),S.rotation.y=a,S.castShadow=!0,n.add(S)}const m=new ft(f,u);m.position.copy(r.position).add(new R(0,8.1,0)),m.rotation.y=a,m.castShadow=!0,n.add(m);const g=Wl(e,{w:1024,h:160,bg:"#141a2c",fg:"#ffffff",stroke:"#000000",accent:t}),_=new oe({map:g,side:_e}),p=new be(r.halfWidth*2+2,2.6);o.push(p),l.push(_);const d=new ft(p,_);d.position.copy(r.position).add(new R(0,6.2,0)),d.rotation.y=a+Math.PI,n.add(d);const x=yh(24,2),M=new oe({map:x,side:_e}),b=new be(r.halfWidth*2+2,.5);o.push(b),l.push(M);const P=new ft(b,M);P.position.copy(r.position).add(new R(0,7.35,0)),P.rotation.y=a,n.add(P);const T=yh(14,2),E=new oe({map:T}),C=new be(r.halfWidth*2,2.2);C.rotateX(-Math.PI/2),C.rotateY(a),C.translate(r.position.x,r.position.y+.035,r.position.z),o.push(C),l.push(E);const I=new ft(C,E);return I.receiveShadow=!0,n.add(I),{group:n,geometries:o,materials:l}}function Kl(s,t,{color:e="#ffd23f",bg:i="#2a1a70"}={}){const n=Z_(e,i);n.repeat.set(1,2);const r=new bi({map:n,emissive:new pt(e),emissiveMap:n,emissiveIntensity:.9,roughness:.5}),a=[],o=[];for(const h of t){const f=h.halfLength??3.2,u=h.halfWidth??2.1,m=s.sample(h.t),g=Math.atan2(m.tangent.x,m.tangent.z),_=m.position.clone().addScaledVector(m.right,h.lateral??0);_.y+=.04;const p=new be(u*2,f*2);p.rotateX(-Math.PI/2),p.rotateY(g),p.translate(_.x,_.y,_.z),a.push(p),s.addPad(_,g,f,u),o.push({position:_,heading:g,halfLength:f,halfWidth:u})}const l=Ji(a);for(const h of a)h.dispose();const c=new ft(l,r);return c.name="boostPads",{mesh:c,pads:o,material:r,geometry:l,texture:n}}function $l(s,t){const e=[];for(const i of t){const n=typeof i=="number"?i:i.t,r=typeof i=="number"?4:i.count??4,a=s.sample(n),o=a.halfWidth*.72;for(let l=0;l<r;l++){const c=r===1?0:-1+2*l/(r-1),h=a.position.clone().addScaledVector(a.right,c*o);h.y+=1,e.push({position:h})}}return e}function jl(s,t=8){const e=[],i=4.2/s.length,n=i*.5,r=1-3.5/s.length;for(let a=0;a<t;a++){const o=Math.floor(a/2),l=a%2,c=Ge(r-o*i-l*n),h=s.sample(c),f=(l===0?1:-1)*Math.min(2.4,h.halfWidth*.36),u=h.position.clone().addScaledVector(h.right,f);u.y+=.3,e.push({position:u,heading:Math.atan2(h.tangent.x,h.tangent.z)})}return e}function rv(s,{groundY:t,every:e=14,color:i=3817301,minHeight:n=1.5,width:r=1.6}){const a=s.N,o=Math.max(1,Math.round(e/s.length*a)),l=[];for(let p=0;p<a;p+=o){const d=Zf(s,p),x=d.y-t;if(!(x<n))for(const M of[-1,1])l.push({s:d,side:M,h:x})}const c=new It(r,1,r);c.translate(0,.5,0);const h=pn(i),f=new ua(c,h,l.length),u=new te,m=new ai,g=new R,_=new R;return l.forEach(({s:p,side:d,h:x},M)=>{g.set(p.x+p.rx*d*(p.hw-1.2),t,p.z+p.rz*d*(p.hw-1.2)),m.setFromAxisAngle(new R(0,1,0),Math.atan2(p.tx,p.tz)),_.set(1,x,1),u.compose(g,m,_),f.setMatrixAt(M,u)}),f.castShadow=!0,f.receiveShadow=!0,f.name="pillars",{mesh:f,geometry:c,material:h}}function Zl({size:s=1600,cells:t=48,y:e=-1,colorAt:i,heightAt:n=null,texture:r=null}){const a=new be(s,s,t,t);a.rotateX(-Math.PI/2);const o=a.attributes.position,l=new Float32Array(o.count*3),c=new pt;for(let u=0;u<o.count;u++){const m=o.getX(u),g=o.getZ(u);n?o.setY(u,e+n(m,g)):o.setY(u,e),c.copy(i(m,g)),l[u*3]=c.r,l[u*3+1]=c.g,l[u*3+2]=c.b}a.setAttribute("color",new Pe(l,3)),a.computeVertexNormals(),r&&r.repeat.set(s/12,s/12);const h=Bt(16777215,{vertexColors:!0,map:r}),f=new ft(a,h);return f.receiveShadow=!0,f.name="ground",{mesh:f,geometry:a,material:h}}function wt(s,t){const e=new pt(t),i=s.attributes.position.count,n=new Float32Array(i*3);for(let r=0;r<i;r++)n[r*3]=e.r,n[r*3+1]=e.g,n[r*3+2]=e.b;return s.setAttribute("color",new Pe(n,3)),s}function Ut(s,{p:t=[0,0,0],r:e=[0,0,0],s:i=1}={}){const n=typeof i=="number"?[i,i,i]:i;return s.scale(n[0],n[1],n[2]),e[0]&&s.rotateX(e[0]),e[2]&&s.rotateZ(e[2]),e[1]&&s.rotateY(e[1]),s.translate(t[0],t[1],t[2]),s}function Jl(s){if(!s.index)return s;const t=s.toNonIndexed();return s.dispose(),t}function Ce(s){const t=s.map(Jl),e=Ji(t,!1);for(const i of t)i.dispose();return e}function ba(s,t,e){const i=s.attributes.position;for(let n=0;n<i.count;n++)i.setXYZ(n,i.getX(n)+(e()-.5)*t,i.getY(n)+(e()-.5)*t,i.getZ(n)+(e()-.5)*t);return s.computeVertexNormals(),s}function mn(s,t,{width:e=1.6}={}){const i={value:0};s.userData.uTime=i;const r={flag:`
      float f_ = clamp(transformed.x / ${e.toFixed(2)}, 0.0, 1.0);
      transformed.z += sin(f_ * 6.0 - uTime * 7.0 + ph_) * 0.22 * f_;
      transformed.y += cos(f_ * 4.0 - uTime * 5.0 + ph_) * 0.06 * f_;`,water:`
      transformed.y += sin(transformed.x * 0.12 + uTime * 1.3) * 0.35 + sin(transformed.z * 0.09 - uTime * 0.9) * 0.3 + sin((transformed.x + transformed.z) * 0.05 + uTime * 0.6) * 0.25;`,flame:`
      float k_ = 1.0 + 0.28 * sin(uTime * 13.0 + ph_) ;
      transformed.x *= k_; transformed.z *= k_;
      transformed.y *= 1.0 + 0.25 * sin(uTime * 9.0 + ph_ * 1.7);
      transformed.x += sin(uTime * 11.0 + ph_) * 0.08 * transformed.y;`,crowd:`
      transformed.y += max(0.0, sin(uTime * 5.0 + ph_ * 2.3)) * 0.35;`,hover:`
      transformed.y += sin(uTime * 2.2 + ph_) * 0.25;`}[t];return s.onBeforeCompile=a=>{a.uniforms.uTime=i,a.vertexShader=`uniform float uTime;
`+a.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
      #ifdef USE_INSTANCING
        float ph_ = instanceMatrix[3][0] * 0.37 + instanceMatrix[3][2] * 0.21;
      #else
        float ph_ = 0.0;
      #endif
      ${r}`)},s.customProgramCacheKey=()=>"tkl_"+t+"_"+e,s}const bh=new te,Sh=new ai,wh=new R,uo=new R,Th=new yi;function se(s,t,e,{shadows:i=!0,colors:n=!1}={}){const r=new ua(s,t,Math.max(1,e.length));return r.count=e.length,e.forEach((a,o)=>{wh.copy(a.position),Th.set(a.tilt??0,a.rotationY??0,a.roll??0),Sh.setFromEuler(Th);const l=a.scale??1;typeof l=="number"?uo.set(l,l,l):uo.copy(l),bh.compose(wh,Sh,uo),r.setMatrixAt(o,bh),n&&r.setColorAt(o,a.color??new pt(16777215))}),r.instanceMatrix.needsUpdate=!0,n&&r.instanceColor&&(r.instanceColor.needsUpdate=!0),r.castShadow=i,r.receiveShadow=i,r.frustumCulled=!1,r}function Di(s,t,{count:e,minGap:i=2,maxGap:n=14,side:r=0,clearance:a=2,tRanges:o=null,allow:l=null,heightAt:c,yOffset:h=0,scaleRange:f=[.8,1.3],tries:u=6}){const m=[],g=new R;for(let _=0;_<e;_++)for(let p=0;p<u;p++){let d=t();if(o){const E=o[Math.floor(t()*o.length)];d=Ge(ke(E[0],E[1],t()))}const x=r===0?t()<.5?-1:1:r,M=s.sample(d),b=M.wallHalfWidth+i+t()*(n-i);if(g.copy(M.position).addScaledVector(M.right,x*b),l&&!l(g.x,g.z))continue;const P=s.getSurfaceAt(g);if(Math.abs(P.lateral)<P.wallHalfWidth+a||P.type===we.VOID)continue;const T=c?c(g.x,g.z,P):M.position.y;m.push({position:new R(g.x,T+h,g.z),rotationY:t()*Math.PI*2,scale:ke(f[0],f[1],t()),t:d,side:x,heading:Math.atan2(M.tangent.x,M.tangent.z),faceRoad:Cs(M.tangent,x)});break}return m}function On(s,{every:t=12,side:e=0,offset:i=.8,yOffset:n=0,tRanges:r=null,faceRoad:a=!0,skipVoid:o=!0,phase:l=0}){const c=[],h=s.length,f=r??[[0,1]];for(const[u,m]of f){const g=(m-u)*h,_=Math.max(1,Math.floor(g/t));for(let p=0;p<_;p++){const d=Ge(u+(p+.5+l)*t/h);if(!(d>m&&m<=1))for(const x of e===0?[-1,1]:[e]){const M=s.sample(d);if(o&&kn(s,{t:d},x))continue;const b=M.position.clone().addScaledVector(M.right,x*(M.wallHalfWidth+i));b.y+=n;const P=Math.atan2(M.tangent.x,M.tangent.z);c.push({position:b,rotationY:a?Cs(M.tangent,x):P,heading:P,t:d,side:x})}}}return c}function av(s){const t=[];let e=0,i=0;for(let r=0;r<3;r++){const a=Ut(wt(new Qt(.28-r*.04,.36-r*.04,2.6,6),"#a9764a"),{p:[i,e+1.3,0],r:[0,0,-.12*(r+1)]});t.push(a),e+=2.45,i+=.3*(r+1)}const n=[i+.3,e+.3,0];for(let r=0;r<7;r++){const a=r/7*Math.PI*2+.3,o=wt(new It(.55,.1,3.8),r%2?"#3fae4a":"#55c85c");o.translate(0,0,1.9),o.rotateX(.55),o.rotateY(a),o.translate(n[0],n[1],n[2]),t.push(o)}for(let r=0;r<3;r++)t.push(Ut(wt(new ee(.28,6,5),"#6b4a2b"),{p:[n[0]+Math.cos(r*2.1)*.35,n[1]-.3,n[2]+Math.sin(r*2.1)*.35]}));return Ce(t)}function ov(s,t=["#3f9a3a","#5cb84a","#2f7d2c"]){const e=[Ut(wt(new Qt(.3,.45,2.6,6),"#7a5230"),{p:[0,1.3,0]})];return[[0,3.6,0,1.7],[.9,3,.5,1.2],[-.8,3.2,-.4,1.25],[.2,4.6,-.6,1.1]].forEach(([n,r,a,o],l)=>e.push(Ut(ba(wt(new sr(o,1),t[l%t.length]),.18,s),{p:[n,r,a]}))),Ce(e)}function lv(s,t="#2a2022"){const e=[Ut(wt(new Qt(.18,.4,4.2,5),t),{p:[0,2.1,0]})];for(let i=0;i<4;i++){const n=i*1.7;e.push(Ut(wt(new Qt(.06,.16,2.2,4),t),{p:[Math.cos(n)*.7,3.4+i*.3,Math.sin(n)*.7],r:[Math.sin(n)*.8,0,Math.cos(n)*.8]}))}return Ce(e)}function _l(s,t="#7c7f88",e=0){const i=wt(new Bl(1,e),t);return ba(i,.35,s),i.scale(1,.75,1),Jl(i)}function cv(s="#2b2f3a"){return Ce([Ut(wt(new Qt(.12,.18,6,6),s),{p:[0,3,0]}),Ut(wt(new It(.14,.14,1.6),s),{p:[0,6,-.7]}),Ut(wt(new It(.4,.25,.7),s),{p:[0,5.9,-1.4]})])}function hv(){const s=new It(.34,.12,.6);return s.translate(0,5.76,-1.4),s}function fv(){return Ce([Ut(wt(new Qt(.12,.2,2.6,6),"#3a2c26"),{p:[0,1.3,0]}),Ut(wt(new Qt(.45,.25,.5,8),"#5a4436"),{p:[0,2.7,0]})])}function uv(){const s=new Re(.42,1.3,7);return s.translate(0,3.5,0),s}function Ql(){return Ce([Ut(wt(new Qt(.28,.32,.8,6),"#ffffff"),{p:[0,.4,0]}),Ut(wt(new ee(.24,7,6),"#f4c9a0"),{p:[0,1.02,0]})])}function dv(){return Ce([Ut(wt(new Ii(.5,.2,5,8),"#222"),{p:[0,.2,0],r:[Math.PI/2,0,0]}),Ut(wt(new Ii(.5,.2,5,8),"#e63946"),{p:[0,.6,0],r:[Math.PI/2,0,0]}),Ut(wt(new Ii(.5,.2,5,8),"#f1f1f1"),{p:[0,1,0],r:[Math.PI/2,0,0]})])}function pv(s){const t=["#ff7f6e","#ffd166","#5fd3ff","#9be15d","#ff9ff3"][Math.floor(s()*5)];return Ce([Ut(wt(new It(3.2,2.4,3.2),t),{p:[0,1.2,0]}),Ut(wt(new It(3,.2,3),"#fff"),{p:[0,1.2,-.2],s:[1.02,1,1]}),Ut(wt(new Re(2.7,1.6,4),"#c97b3a"),{p:[0,3.2,0],r:[0,Math.PI/4,0]}),Ut(wt(new It(.9,1.5,.1),"#3a2a1a"),{p:[0,.75,-1.62]})])}function mv(s="#ff5a1f"){const t=wt(new Re(.6,2.6,5),s);return t.translate(0,1.3,0),Jl(t)}function gv({body:s="#4a3f47",trim:t="#3a3138",roof:e="#b8322a"}={}){return Ce([Ut(wt(new It(6,4,6),s),{p:[0,2,0]}),Ut(wt(new It(6.6,.8,6.6),t),{p:[0,4.4,0]}),...[0,1,2,3].map(i=>Ut(wt(new It(1,1,1),t),{p:[Math.cos(i*Math.PI/2+Math.PI/4)*2.7,5.2,Math.sin(i*Math.PI/2+Math.PI/4)*2.7]})),Ut(wt(new Re(2.2,3.5,6),e),{p:[0,6.4,0]})])}function _v(){return Ce([Ut(wt(new It(1.6,.5,1.2),"#2d3350"),{p:[0,0,0]}),Ut(wt(new It(1,.35,.8),"#7ff7ff"),{p:[0,.35,0]}),...[[-1,-1],[1,-1],[-1,1],[1,1]].map(([s,t])=>Ut(wt(new Qt(.55,.55,.08,10),"#ff3ec9"),{p:[s*.95,.2,t*.75]})),...[[-1,-1],[1,-1],[-1,1],[1,1]].map(([s,t])=>Ut(wt(new It(.5,.12,.12),"#2d3350"),{p:[s*.6,.1,t*.45],r:[0,Math.atan2(t,s),0]}))])}function tc(s,t={}){const e=new ee(780,32,16),i=new oe({map:j_(s,t),side:je,fog:!1,depthWrite:!1}),n=new ft(e,i);return n.name="sky",n.renderOrder=-10,n.frustumCulled=!1,{mesh:n,geometry:e,material:i}}function Qf(s,{radius:t=520,spread:e=120,count:i=28,height:n=[60,140],base:r=[90,160],color:a="#6f8bb1",snow:o=null,centre:l=[0,0],y:c=-1,allow:h=null}){const f=[];for(let _=0;_<i;_++){const p=_/i*Math.PI*2+s()*.2,d=t+(s()-.5)*e;if(h&&!h(l[0]+Math.cos(p)*d,l[1]+Math.sin(p)*d))continue;const x=ke(n[0],n[1],s()),M=ke(r[0],r[1],s()),b=wt(new Re(M,x,6+Math.floor(s()*4),2),a);if(ba(b,M*.18,s),o){const P=b.attributes.position,T=b.attributes.color,E=new pt(o);for(let C=0;C<P.count;C++)P.getY(C)>x*.3&&T.setXYZ(C,E.r,E.g,E.b)}b.translate(l[0]+Math.cos(p)*d,c+x/2-2,l[1]+Math.sin(p)*d),f.push(b)}const u=Ce(f),m=pn(16777215,{vertexColors:!0}),g=new ft(u,m);return g.name="mountains",{mesh:g,geometry:u,material:m}}function vv(s,{count:t=26,radius:e=[150,600],height:i=[70,140],centre:n=[0,0]}){const r=Ce([Ut(wt(new ee(6,8,6),"#ffffff"),{p:[0,0,0]}),Ut(wt(new ee(4.5,8,6),"#ffffff"),{p:[6,-1,1]}),Ut(wt(new ee(4,8,6),"#ffffff"),{p:[-5.5,-1.5,-1]}),Ut(wt(new ee(3.5,8,6),"#ffffff"),{p:[2,-2,4]})]),a=Bt(16777215,{vertexColors:!0,fog:!1}),o=[];for(let c=0;c<t;c++){const h=s()*Math.PI*2,f=ke(e[0],e[1],s());o.push({position:new R(n[0]+Math.cos(h)*f,ke(i[0],i[1],s()),n[1]+Math.sin(h)*f),rotationY:s()*6,scale:ke(.8,2.2,s())})}const l=se(r,a,o,{shadows:!1});return l.name="clouds",{mesh:l,geometry:r,material:a}}function ec({length:s=22,tiers:t=4,color:e="#e8eef5",roof:i="#ff5a36"}){const n=[];for(let o=0;o<t;o++)n.push(Ut(wt(new It(s,1.1*(o+1),1.6),o%2?e:"#cfd8e3"),{p:[0,1.1*(o+1)/2,o*1.6+1.6/2]}));n.push(Ut(wt(new It(s,t*1.1+3.2,.4),"#b9c4d1"),{p:[0,(t*1.1+3.2)/2,t*1.6+.2]})),n.push(Ut(wt(new It(s+1,.35,t*1.6+2.5),i),{p:[0,t*1.1+3.4,t*1.6/2-.4],r:[.12,0,0]}));for(const o of[-1,1])n.push(Ut(wt(new It(.35,t*1.1+3.2,.35),"#8d99a6"),{p:[o*(s/2-.4),(t*1.1+3.2)/2,-.3]}));return Ce(n)}function ic(s,{length:t=22,tiers:e=4,density:i=.8}){const n=[],o=Math.floor(t/.9),l=["#ff4757","#ffa502","#2ed573","#1e90ff","#eccc68","#ff6b81","#7bed9f","#70a1ff","#ffffff","#5352ed"];for(let c=0;c<e;c++)for(let h=0;h<o;h++)s()>i||n.push({local:new R(-t/2+.6+h*.9+(s()-.5)*.3,1.1*(c+1),c*1.6+1.6/2-.2),color:new pt(l[Math.floor(s()*l.length)]),scale:ke(.85,1.1,s())});return n}function nc(s,{w:t=9,h:e=3,bg:i="#1e2a44",fg:n="#ffffff",accent:r="#ff5a36",legs:a=3.5,glow:o=0}={}){const l=new Te,c=Ce([Ut(wt(new It(t+.5,e+.5,.3),"#2b2f3a"),{p:[0,a+e/2,.2]}),Ut(wt(new It(.3,a+.5,.3),"#2b2f3a"),{p:[-t/2+.6,a/2,.2]}),Ut(wt(new It(.3,a+.5,.3),"#2b2f3a"),{p:[t/2-.6,a/2,.2]})]),h=Bt(16777215,{vertexColors:!0}),f=new ft(c,h);f.castShadow=!0,l.add(f);const u=Wl(s,{w:512,h:Math.round(512*(e/t)),bg:i,fg:n,accent:r,glow:o}),m=o>0?new oe({map:u}):new bi({map:u,roughness:.6,emissive:new pt(n),emissiveMap:u,emissiveIntensity:o>0?1:.15}),g=new be(t,e),_=new ft(g,m);return _.position.set(0,a+e/2,0),_.rotation.y=Math.PI,l.add(_),{group:l,geometries:[c,g],materials:[h,m]}}function Cs(s,t){return Math.atan2(s.x,s.z)+(t>0?Math.PI/2:-Math.PI/2)}function sc(s,t,e,i,n,r){const a=t.sample(e),o=a.wallHalfWidth+n,l=a.position.clone().addScaledVector(a.right,i*o);return l.y=r?r(l.x,l.z):a.position.y,s.position.copy(l),s.rotation.y=Cs(a.tangent,i),s}function Eh(s,t,{count:e=220,inner:i=26,outer:n=420,groundY:r,tint:a="#ffd27a",centre:o=[0,0],heights:l=[10,70],allow:c=null}){const h=new It(1,1,1);h.translate(0,.5,0);const f=Q_(3,a),u=new bi({map:f,emissive:16777215,emissiveMap:f,emissiveIntensity:1.1,roughness:.7,color:10134728}),m=[],g=new R,_=t.bounds(0),p=(_.minX+_.maxX)/2,d=(_.minZ+_.maxZ)/2,x=(_.maxX-_.minX)/2+n*.5,M=(_.maxZ-_.minZ)/2+n*.5;let b=0;for(;m.length<e&&b++<e*12;){if(g.set(p+(s()*2-1)*x,r,d+(s()*2-1)*M),c&&!c(g.x,g.z))continue;const T=t.getSurfaceAt(g),E=Math.abs(T.lateral)-T.wallHalfWidth;if(E<i)continue;const C=ke(8,22,s()),I=ke(8,22,s()),v=Xt(E/160,0,1),S=ke(l[0],l[1],s())*(.5+v);m.push({position:g.clone(),rotationY:Math.round(s()*4)*(Math.PI/2)+(s()-.5)*.2,scale:new R(C,S,I)})}const P=se(h,u,m,{shadows:!1});return P.castShadow=!1,P.receiveShadow=!1,P.name="city",{mesh:P,geometry:h,material:u,texture:f}}function xv({centre:s=[0,0],size:t=1500,y:e=-.6,color:i=3121120}){const n=new be(t,t,60,60);n.rotateX(-Math.PI/2);const r=J_();r.repeat.set(t/40,t/40);const a=mn(Bt(i,{map:r,transparent:!0,opacity:.94}),"water"),o=new ft(n,a);return o.position.set(s[0],e,s[1]),o.receiveShadow=!0,o.name="sea",{mesh:o,geometry:n,material:a,texture:r}}function Mv(s,{drop:t=2.6,reach:e=22,emissiveIntensity:i=1.6}){const n=jf();n.repeat.set(2,1);const r=new bi({color:0,emissive:16777215,emissiveMap:n,emissiveIntensity:i,roughness:1,fog:!0}),a=[];for(const c of s.voids)for(const h of c.side===0?[-1,1]:[c.side]){const f=m=>h*(m.hw+.9),u=m=>h*(m.whw+e);a.push(Xe(s,{from:Math.max(0,c.t0-.004),to:Math.min(1,c.t1+.004),edgeA:ne(h>0?f:u,-t),edgeB:ne(h>0?u:f,-t),tile:14}))}if(!a.length)return null;const o=Ji(a);for(const c of a)c.dispose();const l=new ft(o,r);return l.name="lava",{mesh:l,geometry:o,material:r,texture:n}}class Ah{constructor(t,{t0:e,t1:i,speed:n=14,radius:r=1.6,lateralAmp:a=.5,phase:o=0,direction:l=1,material:c,geometry:h}){this.spline=t,this.t0=e,this.t1=i,this.speed=n,this.radius=r,this.lateralAmp=a,this.direction=l,this.dist=(i-e)*t.length*o,this.mesh=new ft(h,c),this.mesh.castShadow=!0,this.spin=0,this.hazard={position:new R,radius:r*.95,kind:"boulder",active:!0},this.update(0,0)}update(t,e){const i=(this.t1-this.t0)*this.spline.length;this.dist+=this.speed*t,this.dist>i&&(this.dist-=i);const n=this.direction>0?this.dist:i-this.dist,r=this.t0+n/this.spline.length,a=this.spline.sample(r),o=Math.sin(n*.05+this.t0*40)*a.halfWidth*this.lateralAmp,l=a.position.addScaledVector(a.right,o);l.y+=this.radius,this.spin-=this.direction*this.speed*t/this.radius,this.mesh.position.copy(l),this.mesh.quaternion.setFromAxisAngle(a.right,this.spin),this.hazard.position.copy(l);const c=Math.min(this.dist,i-this.dist),h=Xt(c/6,.05,1);this.mesh.scale.setScalar(h),this.hazard.active=h>.6}}class yv{constructor(t,{t:e,lateral:i=0,period:n=4.2,phase:r=0,size:a=3.4,material:o,faceMaterial:l}){const c=t.sample(e);this.base=c.position.clone().addScaledVector(c.right,i),this.heading=Math.atan2(c.tangent.x,c.tangent.z),this.period=n,this.phase=r,this.size=a,this.hover=7.5;const h=new It(a,a*.9,a);if(this.geometry=h,this.mesh=new ft(h,o),this.mesh.castShadow=!0,this.mesh.rotation.y=this.heading,l){const f=new be(a*.9,a*.8),u=new ft(f,l);u.position.set(0,0,-a/2-.02),u.rotation.y=Math.PI,this.mesh.add(u),this.faceGeometry=f}this.hazard={position:this.base.clone(),radius:a*.62,kind:"crusher",active:!1},this.update(0,0)}update(t,e){const i=(e+this.phase)%this.period/this.period;let n;i<.42?n=this.hover+Math.sin(e*3+this.phase)*.3:i<.5?n=ke(this.hover,0,((i-.42)/.08)**2):i<.72?n=0:n=ke(0,this.hover,(i-.72)/.28),this.mesh.position.set(this.base.x,this.base.y+this.size*.45+n,this.base.z),this.hazard.position.set(this.base.x,this.base.y+.5,this.base.z),this.hazard.active=n<1.6}}class bv{constructor(t,{t:e,speed:i=11,lateralAmp:n=.65,radius:r=1.2,hover:a=.9,geometry:o,material:l,direction:c=1}){this.spline=t,this.dist=Ge(e)*t.length,this.speed=i*c,this.lateralAmp=n,this.hoverH=a,this.mesh=new ft(o,l),this.mesh.castShadow=!0,this.hazard={position:new R,radius:r,kind:"drone",active:!0},this.update(0,0)}update(t,e){const i=this.spline.length;this.dist=((this.dist+this.speed*t)%i+i)%i;const n=this.dist/i,r=this.spline.sample(n),a=Math.sin(this.dist*.035+n*9)*r.halfWidth*this.lateralAmp,o=r.position.addScaledVector(r.right,a);o.y+=this.hoverH+Math.sin(e*3+this.dist)*.15,this.mesh.position.copy(o),this.mesh.rotation.y=Math.atan2(r.tangent.x,r.tangent.z)+(this.speed<0?Math.PI:0),this.mesh.rotation.z=-Math.cos(this.dist*.035+n*9)*.25,this.hazard.position.copy(o)}}class Sv{constructor(t,{t:e,speed:i=1.1,length:n=11,phase:r=0,material:a,hubMaterial:o}){const l=t.sample(e);this.centre=l.position.clone(),this.speed=i,this.phase=r,this.group=new Te,this.geometry=new It(n,.5,.5),this.hubGeometry=new Qt(.35,.5,1.6,8);const c=new ft(this.geometry,a);c.position.y=1,c.castShadow=!0,this.bar=c;const h=new ft(this.hubGeometry,o??a);h.position.y=.8,this.group.add(c,h),this.group.position.copy(this.centre),this.offsets=[-n*.47,-n*.27,n*.27,n*.47],this.hazards=this.offsets.map(()=>({position:new R,radius:1.15,kind:"rotor",active:!0})),this.update(0,0)}update(t,e){const i=e*this.speed+this.phase;this.bar.rotation.y=i;const n=Math.cos(i),r=-Math.sin(i);this.hazards.forEach((a,o)=>{const l=this.offsets[o];a.position.set(this.centre.x+n*l,this.centre.y+.8,this.centre.z+r*l)})}}class wv{constructor(t,{t:e,speed:i=.9,radius:n=1.25,phase:r=0,geometry:a,material:o}){const l=t.sample(e);this.s=l,this.speed=i,this.radius=n,this.phase=r,this.mesh=new ft(a,o),this.mesh.castShadow=!0,this.hazard={position:new R,radius:n*.9,kind:"beachball",active:!0},this.update(0,0)}update(t,e){const i=e*this.speed+this.phase,n=Math.sin(i)*(this.s.halfWidth-this.radius-.3),r=Math.abs(Math.sin(e*2.6+this.phase))*1.6,a=this.s.position.clone().addScaledVector(this.s.right,n);a.y+=this.radius+r,this.mesh.position.copy(a),this.mesh.rotation.z=-i*1.3,this.mesh.rotation.x=Math.sin(e)*.4,this.hazard.position.copy(a),this.hazard.active=r<1.1}}class Tv{constructor({centre:t,radius:e,height:i,speed:n=.05,phase:r=0,colorA:a="#ff5a5a",colorB:o="#ffe066"}){this.centre=t,this.radius=e,this.height=i,this.speed=n,this.phase=r;const l=[wt(new ee(4,12,10),a)],c=l[0].attributes.position,h=l[0].attributes.color,f=new pt(o);for(let u=0;u<c.count;u++){const m=Math.atan2(c.getZ(u),c.getX(u));Math.floor((m+Math.PI)/(Math.PI*2)*8)%2===0&&h.setXYZ(u,f.r,f.g,f.b)}l[0].translate(0,0,0),l.push(Ut(wt(new Qt(1.4,.9,1.2,8),"#7a5230"),{p:[0,-6.2,0]}));for(let u=0;u<4;u++)l.push(Ut(wt(new Qt(.05,.05,3.2,3),"#3a2a1a"),{p:[Math.cos(u*Math.PI/2+.78)*1.1,-4.2,Math.sin(u*Math.PI/2+.78)*1.1]}));this.geometry=Ce(l),this.material=Bt(16777215,{vertexColors:!0}),this.mesh=new ft(this.geometry,this.material),this.mesh.castShadow=!1,this.update(0,0)}update(t,e){const i=e*this.speed+this.phase;this.mesh.position.set(this.centre[0]+Math.cos(i)*this.radius,this.height+Math.sin(e*.4+this.phase)*2.5,this.centre[1]+Math.sin(i)*this.radius),this.mesh.rotation.y=i}}const Dn=.92,Ev=[[130,3,-150],[130,5,200,40],[40,7,200,40],[40,5,110,30],[-60,2,110,30],[-60,0,30,25],[-20,1,30,18],[-20,2,-20,18],[-85,3,-20,25],[-85,5,-110,28],[-135,7,-110,28],[-135,8,-190,30],[130,3,-230,40]].map(([s,t,e,i])=>i==null?[s*Dn,t,e*Dn]:[s*Dn,t,e*Dn,i*Dn]),Rh=150;function Av(s){const t=Si(20240601),e=new Hl(s,Gl(Ev),{halfWidth:()=>7,wallGap:()=>4.5}),i=e._spline,n=e.group,r=-.6;e._groundY=r,e._skirt={width:28};const a=(F,Z,ot)=>e.terrainHeight(F,Z,ot);e.environment={background:new pt(8308991),fog:{color:new pt(14085375),near:320,far:860}},e.setupLights({sunColor:16773583,sunIntensity:2.6,sunDir:[.55,1,.3],hemiSky:12575999,hemiGround:8037210,hemiIntensity:.95}),n.add(tc([[0,"#f7e9c8"],[.12,"#9fd8ff"],[.45,"#4fa9f2"],[1,"#2a6fd6"]]).mesh);const o=i.bounds(0),l=[(o.minX+o.maxX)/2,(o.minZ+o.maxZ)/2];n.add(Qf(t,{centre:l,radius:560,spread:140,count:30,color:"#6fa06a",snow:"#f4fbff",height:[50,130],base:[90,170],y:r,allow:F=>F<90}).mesh),n.add(vv(t,{centre:l,count:28,radius:[120,640],height:[80,150]}).mesh);const c=new pt("#efd48f"),h=new pt("#5fbe47"),f=new pt("#4fa93d"),u=Yi("grass"),m=Zl({size:1700,cells:60,y:r,texture:u,colorAt:(F,Z)=>{const ot=Xt((F-128)/14,0,1);return h.clone().lerp(f,(Math.sin(F*.05)*Math.cos(Z*.04)+1)*.5).lerp(c,ot)}});n.add(m.mesh);const g=xv({centre:[Rh+700,0],size:1400,y:r+1.25});e.timeMaterial(g.material),e.animate({update:F=>{g.texture.offset.x+=F*.012,g.texture.offset.y-=F*.008}}),n.add(g.mesh);const _=ql(i,{asphalt:{base:"#454955",centre:"#ffd84a"},offroadTexture:Yi("sand"),offroadColor:16777215});n.add(_.group);const p=F=>F.t>.9||F.t<.23,d=F=>Math.min(r,F.y-.5),x=F=>F.y-.06,M=F=>Xe(i,{edgeA:ne(Z=>Z.whw+.5,x),edgeB:ne(Z=>Z.whw+28,d),tile:12,skip:F}),b=Xe(i,{edgeA:ne(F=>-(F.whw+28),d),edgeB:ne(F=>-(F.whw+.5),x),tile:12}),P=Yi("sand");P.repeat.set(3,1);const T=Yi("grass");T.repeat.set(3,1);for(const[F,Z]of[[M(ot=>!p(ot)),P],[M(p),T],[b,T]]){const ot=new ft(F,Bt(16777215,{map:Z}));ot.receiveShadow=!0,n.add(ot)}const E=tv("#ffffff","#ff5a36"),C=Bt(16777215,{map:E,transparent:!1,alphaTest:.5,side:_e}),I=Xe(i,{edgeA:ne(F=>-F.whw,-.1),edgeB:ne(F=>-F.whw,1.25),tile:4}),v=Xe(i,{edgeA:ne(F=>F.whw,-.1),edgeB:ne(F=>F.whw,1.25),tile:4});for(const F of[I,v]){const Z=new ft(F,C);Z.castShadow=!0,n.add(Z)}const S=dv(),U=Bt(16777215,{vertexColors:!0}),k=On(i,{every:2.4,offset:-.7,tRanges:[[.24,.31],[.36,.41],[.5,.56],[.58,.63],[.68,.74],[.88,.93]]});n.add(se(S,U,k.map(F=>({...F,scale:.95})))),n.add(Yl(i,{accent:"#ff5a36",bannerText:"SUNSHINE SPEEDWAY",pillarColor:16774368}).group);const V=Kl(i,[{t:.1,lateral:0},{t:.47,lateral:-1.5},{t:.79,lateral:1.5},{t:.955,lateral:0}],{color:"#ffd23f",bg:"#1f4fbf"});e.boostPads=V.pads,e.animate({update:F=>{V.texture.offset.y-=F*1.6}}),n.add(V.mesh),e.itemBoxes=$l(i,[{t:.06,count:4},{t:.27,count:4},{t:.45,count:3},{t:.66,count:4},{t:.86,count:5}]),e.startGrid=jl(i);const K=Bt(16777215,{vertexColors:!0}),W=F=>F<Rh-4,Q=Di(i,t,{count:110,minGap:2.5,maxGap:22,clearance:3,heightAt:a,allow:(F,Z)=>W(F)&&F>60,scaleRange:[.8,1.35],tries:10});Q.push(...Di(i,t,{count:30,minGap:2.5,maxGap:30,clearance:3,heightAt:a,allow:F=>W(F)&&F<=60,scaleRange:[.8,1.2]})),n.add(se(av(),K,Q));const X=Di(i,t,{count:170,minGap:3,maxGap:55,clearance:3,heightAt:a,allow:F=>F<70,scaleRange:[.7,1.5],tries:10});n.add(se(ov(t),K,X));const dt=Di(i,t,{count:60,minGap:1.5,maxGap:30,clearance:2,heightAt:a,allow:W,scaleRange:[.6,2.2],yOffset:-.2});n.add(se(_l(t,"#9aa0ab"),K,dt));const lt=Di(i,t,{count:12,side:1,minGap:6,maxGap:24,clearance:4,heightAt:a,tRanges:[[.92,1],[0,.2]],allow:W,scaleRange:[.9,1.15],tries:12});n.add(se(pv(t),K,lt.map(F=>({...F,rotationY:F.faceRoad+(t()-.5)*.3}))));const gt=Ce([Ut(wt(new Qt(.05,.05,2.4,5),"#f5f5f5"),{p:[0,1.2,0]}),Ut(wt(new Re(1.6,.6,8),"#ff6b6b"),{p:[0,2.5,0]})]),Ft=Di(i,t,{count:40,side:1,minGap:4,maxGap:34,clearance:3,heightAt:a,tRanges:[[.9,1],[0,.22]],allow:W});n.add(se(gt,K,Ft));const st=ec({length:24,tiers:4,roof:"#ff5a36"}),H=[{t:.035,side:-1},{t:.075,side:-1},{t:.965,side:-1},{t:.41,side:1},{t:.72,side:-1}],tt=[],at=[],ut=[],St=Ql();for(const F of H){const Z=i.sample(F.t),ot=Cs(Z.tangent,F.side),it=Z.position.clone().addScaledVector(Z.right,F.side*(Z.wallHalfWidth+3));it.y=a(it.x,it.z),tt.push({position:it,rotationY:ot});const A=new te().compose(it,new ai().setFromAxisAngle(new R(0,1,0),ot),new R(1,1,1));for(const y of ic(t,{length:24,tiers:4,density:.75}))at.push({position:y.local.applyMatrix4(A),rotationY:ot+Math.PI,scale:y.scale,color:y.color});for(const y of[-10,-5,0,5,10])ut.push({position:new R(y,8.4,6.2).applyMatrix4(A),rotationY:ot})}n.add(se(st,K,tt));const Mt=mn(Bt(16777215,{vertexColors:!0}),"crowd");e.timeMaterial(Mt),n.add(se(St,Mt,at,{colors:!0,shadows:!1}));for(const F of On(i,{every:14,side:-1,offset:1.2,tRanges:[[0,.2],[.9,1]]}))F.position.y+=3.8,ut.push(F);const Gt=new be(1.6,1,8,3);Gt.translate(.8,0,0);const Kt=mn(Bt(16777215,{map:Xl("#ff3355","#ffffff"),side:_e}),"flag",{width:1.6});e.timeMaterial(Kt),n.add(se(Gt,Kt,ut.map(F=>({...F,rotationY:(F.rotationY??0)+Math.PI/2})),{shadows:!1}));const $t=new Qt(.05,.07,4.2,5);$t.translate(0,-1.6,0),n.add(se($t,pn(16053492),ut,{shadows:!1}));const D=[["TURBO",.15,1,"#ff5a36","#fff"],["KART CUP",.3,-1,"#1e2a44","#ffd23f"],["NITRO COLA",.52,1,"#c8102e","#fff"],["DRIFT KING",.64,-1,"#12b886","#fff"],["WAVE RIDER",.84,1,"#1f4fbf","#8be9fd"],["SUNSHINE SPEEDWAY",.93,1,"#ffb703","#1e2a44"]];for(const[F,Z,ot,it,A]of D){const y=nc(F,{bg:it,fg:A,accent:"#ffffff"});sc(y.group,i,Z,ot,4+t()*6,(O,$)=>a(O,$)),n.add(y.group)}{const F=-108*Dn,Z=-150*Dn,ot=[Ut(wt(new Qt(2.2,2.8,6,12),"#ffffff"),{p:[0,3,0]}),Ut(wt(new Qt(2,2.2,6,12),"#e63946"),{p:[0,9,0]}),Ut(wt(new Qt(1.8,2,6,12),"#ffffff"),{p:[0,15,0]}),Ut(wt(new Qt(2.4,2.4,.6,12),"#2b2f3a"),{p:[0,18.3,0]}),Ut(wt(new Re(2.2,2.2,12),"#e63946"),{p:[0,21,0]})],it=new ft(Ce(ot),K);it.position.set(F,a(F,Z),Z),it.castShadow=!0,n.add(it);const A=new oe({color:16773544}),y=new ft(new Qt(1.4,1.4,1.6,10),A);y.position.set(F,it.position.y+19.4,Z),n.add(y);const O=new ft(new be(60,1.4),new oe({color:16773544,transparent:!0,opacity:.35,side:_e,depthWrite:!1}));O.geometry.translate(30,0,0),O.position.copy(y.position),n.add(O),e.animate({update:($,et)=>{O.rotation.y=et*.8}})}for(let F=0;F<4;F++){const Z=new Tv({centre:[l[0]+(t()-.5)*120,l[1]+(t()-.5)*120],radius:90+t()*90,height:55+t()*30,speed:.03+t()*.02,phase:t()*6,colorA:["#ff5a5a","#1f4fbf","#12b886","#ff8c42"][F],colorB:"#fff3c4"});e.animate(Z),n.add(Z.mesh)}const Ue=new ee(1.25,14,10);{const F=Ue.attributes.position,Z=new Float32Array(F.count*3),ot=["#ff4757","#ffffff","#1e90ff","#ffa502","#2ed573","#ffffff"].map(it=>new pt(it));for(let it=0;it<F.count;it++){const A=Math.atan2(F.getZ(it),F.getX(it)),y=ot[Math.floor((A+Math.PI)/(Math.PI*2)*6)%6];Z[it*3]=y.r,Z[it*3+1]=y.g,Z[it*3+2]=y.b}Ue.setAttribute("color",new Pe(Z,3))}const Jt=Bt(16777215,{vertexColors:!0});for(const[F,Z]of[[.3,0],[.55,2.1],[.83,4.2]]){const ot=new wv(i,{t:F,speed:.85+Z*.05,phase:Z,geometry:Ue,material:Jt});e.animate(ot),e.addHazard(ot.hazard),n.add(ot.mesh)}return e}const he=.85,Rv=[[0,3,-145],[0,4.5,100,40],[80,5,100],[240,5,100,35],[240,3,30,28],[170,2,30,22],[170,1,-30,22],[105,0,-30,22],[105,1,40,22],[55,1,40,20],[55,1,-100,25],[150,1.5,-100,25],[150,2,-170,28],[0,3,-200,30]].map(([s,t,e,i])=>i==null?[s*he,t,e*he]:[s*he,t,e*he,i*he]),Ch=s=>s>.5?s-1:s;function Cv(s){const t=Si(66613),e=new Hl(s,Gl(Rv),{halfWidth:()=>7,wallGap:()=>4}),i=e._spline,n=e.group,r=-3.6;e._groundY=r,e._skirt={width:24};const a=(F,Z,ot)=>e.terrainHeight(F,Z,ot),o=(F,Z)=>i.getSurfaceAt(new R(F,0,Z)).t,l=o(28*he,100*he),c=o(212*he,100*he);i.addVoid(l,c,0),i.addVoid(o(240*he,72*he),o(240*he,42*he),-1),i.addVoid(o(118*he,-170*he),o(40*he,-170*he),1),e.environment={background:new pt(2756640),fog:{color:new pt(8007194),near:210,far:780}},e.setupLights({sunColor:16764832,sunIntensity:2.7,sunDir:[-.45,.85,-.35],hemiSky:10500648,hemiGround:7023120,hemiIntensity:1.15,ambient:{color:8008728,intensity:.75}}),n.add(tc([[0,"#ffa43a"],[.05,"#e8602a"],[.12,"#962c34"],[.26,"#56204a"],[.5,"#2e1638"],[1,"#1a0f26"]],{stars:220,starColor:"255,225,200",starAlpha:[.2,.6],embers:140}).mesh);const h=i.bounds(0),f=[(h.minX+h.maxX)/2,(h.minZ+h.maxZ)/2];n.add(Qf(t,{centre:f,radius:520,spread:120,count:30,color:"#4a2a34",height:[60,150],base:[90,170],y:r}).mesh);{const F=f[0]+330,Z=f[1]-260,ot=wt(new Re(190,170,9),"#4a2c36");ba(ot,14,t),ot.translate(F,r+85-3,Z);const it=wt(new Qt(38,30,8,9),"#ffb347");it.translate(F,r+170-6,Z);const A=new ft(Ce([ot]),pn(16777215,{vertexColors:!0}));n.add(A);const y=new ft(it,new oe({color:new pt(16747050).multiplyScalar(1.8),fog:!0}));n.add(y);const O=Ce([0,1,2,3].map(et=>Ut(wt(new ee(22+et*8,8,6),"#3a3038"),{p:[et*10,et*30,-et*6]}))),$=new ft(O,Bt(16777215,{vertexColors:!0,transparent:!0,opacity:.85}));$.position.set(F,r+190,Z),n.add($),e.animate({update:(et,J)=>{$.position.y=r+190+Math.sin(J*.3)*4,$.rotation.y=J*.05}})}const u=new pt("#4a363a"),m=new pt("#5c4446"),g=new pt("#8a3c26"),_=Zl({size:1700,cells:56,y:r,texture:Yi("lavaRock"),colorAt:(F,Z)=>{const ot=(Math.sin(F*.031)*Math.cos(Z*.027)+Math.sin(F*.011+Z*.017))*.5;return u.clone().lerp(m,Xt(ot+.5,0,1)).lerp(g,Xt(ot*.6,0,1))}});n.add(_.mesh);const p=ql(i,{asphalt:{base:"#504a56",speck:["#605a68","#423c48","#6e6876","#7a5a58"],centre:"#ffa23c",edge:"#ffe2b0"},curbColors:["#e0182e","#fff4e6"],offroadTexture:Yi("ash"),skirt:{width:24,groundY:r,texture:Yi("lavaRock")}});n.add(p.group),p.group.traverse(F=>{F.isMesh&&F.name==="asphalt"&&(F.material.emissive=new pt(1971218),F.material.emissiveIntensity=.55)});const d=nv("#6e5e66","#3a2c32"),x=Jf(i,{height:2.2,texture:d,tile:5,sink:.6,emissive:3806216,emissiveIntensity:.35});n.add(x.mesh);const M=wt(new It(1.2,.7,.8),"#5c4c56"),b=On(i,{every:3,offset:0,yOffset:2.55});n.add(se(M,Bt(16777215,{vertexColors:!0}),b));const P=Mv(i,{drop:2.7,reach:26,emissiveIntensity:1.6});P&&(n.add(P.mesh),e.animate({update:(F,Z)=>{P.texture.offset.y+=F*.03,P.texture.offset.x+=F*.012,P.material.emissiveIntensity=1.6+Math.sin(Z*1.7)*.2}}));{const F=jf();F.repeat.set(4,4);const Z=new bi({color:0,emissive:16777215,emissiveMap:F,emissiveIntensity:1.6,roughness:1}),ot=[];let it=0;for(;ot.length<7&&it++<200;){const A=f[0]+(t()-.5)*700,y=f[1]+(t()-.5)*700,O=i.getSurfaceAt(new R(A,0,y)),$=25+t()*40;if(Math.abs(O.lateral)<O.wallHalfWidth+30+$)continue;const et=new zl($,14),J=et.attributes.position;for(let Rt=1;Rt<J.count;Rt++)J.setXY(Rt,J.getX(Rt)*(.8+t()*.4),J.getY(Rt)*(.8+t()*.4));et.rotateX(-Math.PI/2),et.translate(A,r+.25,y),ot.push(et)}if(ot.length){const A=new ft(Ce(ot.map(y=>wt(y,"#ffffff"))),Z);n.add(A),e.animate({update:y=>{F.offset.x+=y*.01}})}}const T=[];for(const[F,Z]of[[(l+c)/2,1],[(l+c)/2,-1],[o(240*he,57*he),-1],[o(80*he,-170*he),1]]){const ot=i.sample(F),it=new gh(16747050,420,60,2);it.position.copy(ot.position).addScaledVector(ot.right,Z*(ot.wallHalfWidth+6)).add(new R(0,3,0)),n.add(it),T.push(it)}e.animate({update:(F,Z)=>{for(let ot=0;ot<T.length;ot++)T[ot].intensity=420+Math.sin(Z*2.1+ot*1.3)*60}}),n.add(Yl(i,{accent:"#ff6a1a",bannerText:"MAGMA FORTRESS",pillarColor:5063241}).group);const E=Kl(i,[{t:.09,lateral:0},{t:(l+c)/2+.03,lateral:0,halfLength:4},{t:.62,lateral:1.4},{t:.86,lateral:-1.4}],{color:"#ffb02e",bg:"#5a1010"});e.boostPads=E.pads,e.animate({update:F=>{E.texture.offset.y-=F*1.6}}),n.add(E.mesh),e.itemBoxes=$l(i,[{t:.05,count:4},{t:l-.03,count:3},{t:.46,count:4},{t:.7,count:4},{t:.9,count:5}]),e.startGrid=jl(i);const C=Bt(16777215,{vertexColors:!0,emissive:3806216,emissiveIntensity:.45}),I=Di(i,t,{count:70,minGap:3,maxGap:40,clearance:3,heightAt:a,scaleRange:[.8,1.6],tries:10});n.add(se(lv(t,"#3e2c2c"),C,I));const v=Di(i,t,{count:140,minGap:1.5,maxGap:45,clearance:2,heightAt:a,scaleRange:[.8,3.2],yOffset:-.3,tries:10});n.add(se(_l(t,"#5e4a50",1),C,v));const S=Di(i,t,{count:90,minGap:1.2,maxGap:30,clearance:2,heightAt:a,scaleRange:[.6,1.8],tries:10}),U=new bi({color:16742960,emissive:16734740,emissiveIntensity:1.4,roughness:.4,flatShading:!0});n.add(se(mv(),U,S.map(F=>({...F,tilt:(t()-.5)*.6,roll:(t()-.5)*.6}))));const k=Di(i,t,{count:16,minGap:8,maxGap:30,clearance:6,heightAt:a,scaleRange:[1.1,1.8],tries:12});n.add(se(gv({body:"#6a5a64",trim:"#524450",roof:"#d0402e"}),C,k.map(F=>({...F,rotationY:Math.round(F.rotationY/(Math.PI/2))*(Math.PI/2)}))));{const F=100*he,Z=165*he,ot=Ce([Ut(wt(new It(46,26,30),"#6a5a64"),{p:[0,13,0]}),Ut(wt(new It(48,2,32),"#524450"),{p:[0,27,0]}),...[[-1,-1],[1,-1],[-1,1],[1,1]].map(([O,$])=>Ut(wt(new Qt(5,5.5,40,8),"#6a5a64"),{p:[O*22,20,$*14]})),...[[-1,-1],[1,-1],[-1,1],[1,1]].map(([O,$])=>Ut(wt(new Re(6,9,8),"#d0402e"),{p:[O*22,44,$*14]})),Ut(wt(new Qt(7,8,56,8),"#6a5a64"),{p:[0,28,0]}),Ut(wt(new Re(8.5,12,8),"#d0402e"),{p:[0,62,0]}),Ut(wt(new It(10,14,2),"#1a1014"),{p:[0,7,-15.5]})]),it=new ft(ot,C);it.position.set(F,r,Z),it.castShadow=!0,n.add(it);const A=new be(1.6,2.6),y=[];for(let O=0;O<12;O++)y.push({position:new R(F-18+O*3.3,r+12+O%2*6,Z-15.2),rotationY:Math.PI});for(let O=0;O<6;O++)y.push({position:new R(F-23.2,r+10+O*2.5,Z-10+O*4),rotationY:-Math.PI/2});n.add(se(A,new oe({color:new pt(16752704).multiplyScalar(1.6)}),y,{shadows:!1}))}const V=On(i,{every:16,offset:-.6,yOffset:0,phase:.3});n.add(se(fv(),C,V));const K=mn(new oe({color:new pt(16756792).multiplyScalar(2)}),"flame");e.timeMaterial(K),n.add(se(uv(),K,V,{shadows:!1}));{const F=ot=>{var it;return(it=V.map(A=>({p:A,s:i.getSurfaceAt(A.position)})).filter(({s:A})=>Math.sign(A.lateral)===ot&&(A.t<.02||A.t>.98)).sort((A,y)=>Math.abs(Ch(A.s.t))-Math.abs(Ch(y.s.t)))[0])==null?void 0:it.p},Z=[F(-1),F(1)].filter(Boolean).map(ot=>{const it=new gh(16752704,90,40,2);return it.position.copy(ot.position).add(new R(0,3.8,0)),n.add(it),it});e.animate({update:(ot,it)=>{for(let A=0;A<Z.length;A++)Z[A].intensity=90+Math.sin(it*9+A*2)*14+Math.sin(it*23+A)*8}})}const W=ec({length:22,tiers:4,color:"#6a5a62",roof:"#b8322a"}),Q=[{t:.03,side:-1},{t:.07,side:1},{t:.965,side:1},{t:.5,side:-1}],X=[],dt=[],lt=[];for(const F of Q){const Z=i.sample(F.t),ot=Cs(Z.tangent,F.side),it=Z.position.clone().addScaledVector(Z.right,F.side*(Z.wallHalfWidth+3));it.y=a(it.x,it.z),X.push({position:it,rotationY:ot});const A=new te().compose(it,new ai().setFromAxisAngle(new R(0,1,0),ot),new R(1,1,1));for(const y of ic(t,{length:22,tiers:4,density:.7}))dt.push({position:y.local.applyMatrix4(A),rotationY:ot+Math.PI,scale:y.scale,color:y.color});for(const y of[-8,0,8])lt.push({position:new R(y,8.4,6.2).applyMatrix4(A),rotationY:ot})}n.add(se(W,C,X));const gt=mn(Bt(16777215,{vertexColors:!0}),"crowd");e.timeMaterial(gt),n.add(se(Ql(),gt,dt,{colors:!0,shadows:!1}));for(const F of On(i,{every:18,side:0,offset:1,tRanges:[[0,.16],[.9,1]]}))F.position.y+=4.2,lt.push(F);for(const F of k)lt.push({position:F.position.clone().add(new R(0,8.2*F.scale+2.4,0)),rotationY:F.rotationY});const Ft=new be(1.8,1.1,8,3);Ft.translate(.9,0,0);const st=mn(Bt(16777215,{map:Xl("#b8322a","#ffb02e"),side:_e}),"flag",{width:1.8});e.timeMaterial(st),n.add(se(Ft,st,lt.map(F=>({...F,rotationY:(F.rotationY??0)+Math.PI/2})),{shadows:!1}));const H=new Qt(.06,.08,4.6,5);H.translate(0,-1.8,0),n.add(se(H,pn(2761254),lt,{shadows:!1}));const tt=[["MAGMA FORTRESS",.12,-1,"#3a1a14","#ffb02e"],["TURBO",.2,1,"#ff5a36","#fff"],["KART CUP",.44,-1,"#1e2a44","#ffd23f"],["FIRE DRIFT",.57,1,"#c8102e","#fff"],["LAVA LOOP",.75,-1,"#2b1420","#ff7a1a"],["NITRO COLA",.92,-1,"#c8102e","#fff"]];for(const[F,Z,ot,it,A]of tt){const y=nc(F,{bg:it,fg:A,accent:"#ffb02e"});sc(y.group,i,Z,ot,3+t()*5,(O,$)=>a(O,$)),n.add(y.group)}const at=Bt(6971240,{map:d}),ut=new oe({map:iv()}),St=(l+c)/2,Mt=[[l+.012,-3.2,0],[St-.01,3.2,1.4],[St+.015,-3.2,2.8],[c-.012,3,4]];for(const[F,Z,ot]of Mt){const it=new yv(i,{t:F,lateral:Z,phase:ot,period:4.6,size:3.4,material:at,faceMaterial:ut});e.animate(it),e.addHazard(it.hazard),n.add(it.mesh)}const Gt=_l(t,"#4e3e46",1);Gt.scale(1.6,1.6/.75,1.6);const Kt=Bt(16777215,{vertexColors:!0}),$t=o(140*he,-170*he),D=o(10*he,-190*he);for(let F=0;F<3;F++){const Z=new Ah(i,{t0:$t,t1:D,speed:9,radius:1.6,lateralAmp:.55,phase:F/3,direction:-1,geometry:Gt,material:Kt});e.animate(Z),e.addHazard(Z.hazard),n.add(Z.mesh)}const Ue=o(170*he,20*he),Jt=o(150*he,-30*he);for(let F=0;F<2;F++){const Z=new Ah(i,{t0:Ue,t1:Jt,speed:7,radius:1.4,lateralAmp:.5,phase:F/2,direction:-1,geometry:Gt,material:Kt});e.animate(Z),e.addHazard(Z.hazard),n.add(Z.mesh)}return e}const Vs=.88,Pv=[[-150,0,-110],[-150,2,200,45],[-30,6,200,30],[-30,4,140,25],[40,4,140,25],[40,5,200,30],[160,6,200,40],[160,3,100,30],[90,0,100,25],[90,-4,20,25],[170,-6,20,30],[170,-4,-80,30],[100,-2,-80,25],[100,0,-140,25],[30,2,-140,25],[30,3,-200,30],[-150,1,-200,40]].map(([s,t,e,i])=>i==null?[s*Vs,t,e*Vs]:[s*Vs,t,e*Vs,i*Vs]),Ur=["#37f5ff","#ff2bd6","#ffe94a","#7dff6a","#b26bff","#ff7a3c"];function Iv(s){const t=Si(80085),e=new Hl(s,Gl(Pv),{halfWidth:()=>7.5,wallGap:()=>3.5}),i=e._spline,n=e.group,r=-16;e._groundY=r,e._skirt=null,e.environment={background:new pt(723490),fog:{color:new pt(1707827),near:160,far:680}},e.setupLights({sunColor:10466559,sunIntensity:1.7,sunDir:[-.3,1,.5],hemiSky:5917344,hemiGround:2759226,hemiIntensity:.9}),n.add(tc([[0,"#5a2a8a"],[.12,"#251550"],[.45,"#0b0a2a"],[1,"#04030f"]],{stars:520}).mesh);const a=new pt("#15141f"),o=new pt("#1e1c2c"),l=Zl({size:1900,cells:40,y:r,texture:Yi("gravel"),colorAt:(st,H)=>a.clone().lerp(o,(Math.sin(st*.02)*Math.cos(H*.02)+1)*.5)});n.add(l.mesh);const c=Eh(t,i,{count:230,inner:12,outer:300,groundY:r,tint:"#ffd27a",heights:[8,60]});n.add(c.mesh);const h=Eh(t,i,{count:60,inner:260,outer:700,groundY:r,tint:"#8be9fd",heights:[90,200]});n.add(h.mesh);{const st=new It(.5,1,.5);st.translate(0,.5,0);const H=[],tt=new te,at=new R,ut=new ai,St=new R;for(let Mt=0;Mt<c.mesh.count;Mt++)t()<.45||(c.mesh.getMatrixAt(Mt,tt),tt.decompose(at,ut,St),H.push({position:new R(at.x+(t()-.5)*St.x*.6,at.y+St.y,at.z+(t()-.5)*St.z*.6),scale:new R(1,3+t()*9,1),color:new pt(Ur[Math.floor(t()*Ur.length)])}));n.add(se(st,new oe({color:16777215}),H,{colors:!0,shadows:!1}))}const f=ql(i,{asphalt:{base:"#1c1e2a",speck:["#262938","#151722","#2f3346"],centre:"#ffe94a",edge:"#37f5ff"},curbColors:["#ff2bd6","#f2f2ff"],offroadTexture:Yi("gravel"),offroadColor:10133688,wetRoad:!0});n.add(f.group);const u=ev("#37f5ff","#12141f"),m=new bi({map:u,emissive:16777215,emissiveMap:u,emissiveIntensity:1.2,roughness:.6,side:_e}),g=Jf(i,{height:1.25,sink:.9,tile:3,material:m});n.add(g.mesh);const _=rv(i,{groundY:r,every:13,color:2764100,width:1.8});n.add(_.mesh);const p=Xe(i,{edgeA:ne(st=>st.whw+.6,-1),edgeB:ne(st=>-st.whw-.6,-1),tile:20});n.add(new ft(p,Bt(1974320)));const d=new oe({color:16722902,transparent:!0,opacity:.85,side:_e}),x=Xe(i,{edgeA:ne(st=>-st.whw-.7,-1),edgeB:ne(st=>-st.whw-.7,-.15),tile:20}),M=Xe(i,{edgeA:ne(st=>st.whw+.7,-1),edgeB:ne(st=>st.whw+.7,-.15),tile:20});for(const st of[x,M])n.add(new ft(st,d));e.animate({update:(st,H)=>{d.opacity=.7+Math.sin(H*2.4)*.2,m.emissiveIntensity=1.05+Math.sin(H*3.1)*.25}}),n.add(Yl(i,{accent:"#ff2bd6",bannerText:"NEON SKYLINE",pillarColor:2764100}).group);const b=Kl(i,[{t:.08,lateral:0},{t:.36,lateral:1.6},{t:.56,lateral:0,halfLength:4},{t:.78,lateral:-1.6},{t:.9,lateral:0}],{color:"#37f5ff",bg:"#2a0a4a"});e.boostPads=b.pads,e.animate({update:st=>{b.texture.offset.y-=st*1.8}}),n.add(b.mesh),e.itemBoxes=$l(i,[{t:.05,count:4},{t:.22,count:4},{t:.43,count:3},{t:.63,count:4},{t:.72,count:3},{t:.86,count:5}]),e.startGrid=jl(i);const P=Bt(16777215,{vertexColors:!0}),T=On(i,{every:26,side:-1,offset:-.9}),E=On(i,{every:26,side:1,offset:-.9,phase:.5}),C=[...T,...E];n.add(se(cv("#2b2f3a"),P,C)),n.add(se(hv(),new oe({color:15137791}),C,{shadows:!1}));{const st=new Ii(i.hw[0]+3.2,.35,8,28,Math.PI),H=[];for(const Mt of[.04,.13,.3,.47,.6,.75,.88,.96]){const Gt=i.sample(Mt);H.push({position:Gt.position.clone().add(new R(0,.3,0)),rotationY:Math.atan2(Gt.tangent.x,Gt.tangent.z)+Math.PI/2,color:new pt(Ur[H.length%Ur.length])})}const tt=new oe({color:16777215}),at=se(st,tt,H,{colors:!0,shadows:!1});n.add(at);const ut=H.map(Mt=>Mt.color.clone()),St=new pt;e.animate({update:(Mt,Gt)=>{for(let Kt=0;Kt<H.length;Kt++){const $t=.55+.45*Math.max(0,Math.sin(Gt*2.2+Kt*.9));St.copy(ut[Kt]).multiplyScalar($t),at.setColorAt(Kt,St)}at.instanceColor.needsUpdate=!0}})}const I=ec({length:24,tiers:4,color:"#3a3f5c",roof:"#ff2bd6"}),v=[{t:.03,side:-1},{t:.07,side:-1},{t:.965,side:1},{t:.52,side:-1}],S=[],U=[],k=[];for(const st of v){const H=i.sample(st.t),tt=Cs(H.tangent,st.side),at=H.position.clone().addScaledVector(H.right,st.side*(H.wallHalfWidth+2.5));at.y=H.position.y-.4,S.push({position:at,rotationY:tt});const ut=new te().compose(at,new ai().setFromAxisAngle(new R(0,1,0),tt),new R(1,1,1));for(const St of ic(t,{length:24,tiers:4,density:.75}))U.push({position:St.local.applyMatrix4(ut),rotationY:tt+Math.PI,scale:St.scale,color:St.color});for(const St of[-9,-3,3,9])k.push({position:new R(St,8.4,6.2).applyMatrix4(ut),rotationY:tt})}n.add(se(I,P,S));{const st=new It(27,1.2,10);st.translate(0,-.6,3.6),n.add(se(st,pn(2764100),S));const H=new It(1.6,1,1.6);H.translate(0,.5,0);const tt=[];for(const at of S){const ut=new te().compose(at.position,new ai().setFromAxisAngle(new R(0,1,0),at.rotationY),new R(1,1,1));for(const St of[-11,0,11]){const Mt=new R(St,0,4).applyMatrix4(ut);tt.push({position:new R(Mt.x,r,Mt.z),scale:new R(1,Mt.y-r-1.1,1)})}}n.add(se(H,pn(2764100),tt))}const V=mn(Bt(16777215,{vertexColors:!0}),"crowd");e.timeMaterial(V),n.add(se(Ql(),V,U,{colors:!0,shadows:!1}));const K=new be(1.6,1,8,3);K.translate(.8,0,0);const W=mn(Bt(16777215,{map:Xl("#37f5ff","#ff2bd6"),side:_e}),"flag",{width:1.6});e.timeMaterial(W),n.add(se(K,W,k.map(st=>({...st,rotationY:st.rotationY+Math.PI/2})),{shadows:!1}));const Q=new Qt(.05,.07,4.2,5);Q.translate(0,-1.6,0),n.add(se(Q,pn(13686015),k,{shadows:!1}));const X=[["NEON SKYLINE",.11,1,"#12082a","#37f5ff"],["TURBO",.19,-1,"#2a0a4a","#ff2bd6"],["KART CUP",.34,1,"#1e2a44","#ffe94a"],["SYNTH BAR",.41,-1,"#0a1a2a","#7dff6a"],["DRIFT ZONE",.58,1,"#2a0a10","#ff7a3c"],["24H NOODLES",.7,-1,"#12082a","#ffe94a"],["HOTEL",.83,1,"#0a0a2a","#b26bff"],["NITRO COLA",.93,-1,"#c8102e","#ffffff"]];for(const[st,H,tt,at,ut]of X){const St=i.sample(H),Mt=nc(st,{bg:at,fg:ut,accent:ut,glow:18,legs:St.position.y-r+1.5,w:11,h:3.6});sc(Mt.group,i,H,tt,3+t()*4,()=>r),n.add(Mt.group)}{const st=i.sample(.02),H=new ft(new be(16,4),new oe({map:Wl("TURBO KART LEGENDS",{w:1024,h:256,bg:"#000000",fg:"#37f5ff",glow:30}),transparent:!0,opacity:.85,side:_e,blending:_i,depthWrite:!1}));H.position.copy(st.position).add(new R(0,14,0)),n.add(H),e.animate({update:(tt,at)=>{H.rotation.y=at*.5,H.position.y=st.position.y+14+Math.sin(at)*.5}})}const dt=_v(),lt=Bt(16777215,{vertexColors:!0});for(const[st,H]of[[.15,11],[.32,12.5],[.5,10.5],[.66,12],[.84,11.5]]){const tt=new bv(i,{t:st,speed:H,geometry:dt,material:lt});e.animate(tt),e.addHazard(tt.hazard),n.add(tt.mesh)}const gt=new bi({color:16722902,emissive:16722902,emissiveIntensity:.8,roughness:.4}),Ft=Bt(2764100);for(const[st,H,tt]of[[.245,1.1,0],[.585,-1.3,1.5],[.805,1.2,3]]){const at=new Sv(i,{t:st,speed:H,phase:tt,length:11.5,material:gt,hubMaterial:Ft});e.animate(at),e.addHazard(at.hazards),n.add(at.group)}return e}const us=[{id:"sunshine",name:"Sunshine Speedway",laps:3,difficulty:1,blurb:"Palm-lined beach straights, a hilltop hairpin and a lighthouse loop. Watch out for beach balls!",accent:"#ffb703"},{id:"lava",name:"Magma Fortress",laps:3,difficulty:2,blurb:"A volcanic castle circuit: cross the lava bridge under the crushers and dodge the rolling boulders.",accent:"#ff6a1a"},{id:"neon",name:"Neon Skyline",laps:3,difficulty:3,blurb:"A rain-slick skyway through a neon night city. Traffic drones and spinning rotor gates await.",accent:"#37f5ff"}],Lv={sunshine:Av,lava:Cv,neon:Iv};function Ph(s){const t=us.find(i=>i.id===s),e=Lv[s];if(!t||!e)throw new Error(`[track] unknown track id "${s}"`);return e(t)}const cs=[{id:"bao",name:"Bao",title:"Panda",color:"#2fb8ff",secondary:"#ffffff",blurb:"Calm, round and impossible to rattle. The all-rounder.",stats:{speed:3,accel:3,handling:3,weight:3},figure:{head:"round",skin:"#f6f6f6",ears:{type:"round",color:"#22222a"},eyes:{type:"dot",pupil:"#22222a",patches:"#22222a"},snout:{type:"muzzle",color:"#f6f6f6",nose:"#22222a"},suit:"#2fb8ff"}},{id:"kit",name:"Kit",title:"Fox",color:"#ff7a1a",secondary:"#fff1dc",blurb:"Quick off the line and glued to the apex.",stats:{speed:3,accel:4,handling:5,weight:2},figure:{head:"round",skin:"#ff8a2a",ears:{type:"pointy",color:"#ff8a2a",inner:"#2b1a10"},eyes:{type:"dot",pupil:"#2b1a10"},snout:{type:"muzzle",color:"#fff3e0",nose:"#2b1a10"},suit:"#2b1a10"}},{id:"bolt",name:"Bolt",title:"Robot",color:"#ffd400",secondary:"#2f3a56",blurb:"Maximum thrust. Cornering not included in firmware.",stats:{speed:5,accel:2,handling:2,weight:5},figure:{head:"box",skin:"#b8c4d6",ears:{type:"antenna",color:"#ffd400"},eyes:{type:"visor",color:"#22e5ff"},snout:{type:"none"},suit:"#2f3a56",metal:!0}},{id:"hop",name:"Hop",title:"Frog",color:"#3ed65a",secondary:"#fff36b",blurb:"Feather-light and twitchy. Gets bumped, bounces back.",stats:{speed:2,accel:5,handling:4,weight:1},figure:{head:"wide",skin:"#5ad14b",ears:{type:"none"},eyes:{type:"bulge",pupil:"#111111"},snout:{type:"none"},cheeks:"#ffe86b",suit:"#fff36b"}},{id:"miso",name:"Miso",title:"Cat",color:"#ff7ac8",secondary:"#ffffff",blurb:"Nine lives, zero patience. Slides like butter.",stats:{speed:3,accel:4,handling:4,weight:2},figure:{head:"round",skin:"#fff1dc",ears:{type:"pointy",color:"#fff1dc",inner:"#ff9ac2"},eyes:{type:"big",color:"#7dff6b",pupil:"#111111"},snout:{type:"muzzle",color:"#ffffff",nose:"#ff7aa8"},suit:"#ff7ac8"}},{id:"ember",name:"Ember",title:"Dragon",color:"#e8332f",secondary:"#ffb03b",blurb:"Heavy hitter with a fiery top end.",stats:{speed:4,accel:2,handling:3,weight:4},figure:{head:"egg",skin:"#e3402f",ears:{type:"horns",color:"#ffe0a3"},eyes:{type:"big",color:"#ffd23b",pupil:"#111111"},snout:{type:"snout",color:"#e3402f",nose:"#5a1410"},belly:"#ffcf8a",suit:"#ffb03b"}},{id:"pip",name:"Pip",title:"Penguin",color:"#4a4ee8",secondary:"#ffffff",blurb:"Tiny, brave and launches like a rocket.",stats:{speed:2,accel:5,handling:3,weight:2},figure:{head:"egg",skin:"#25324f",face:"#ffffff",ears:{type:"none"},eyes:{type:"dot",pupil:"#111111"},snout:{type:"beak",color:"#ff9a2a"},suit:"#25324f"}},{id:"bruno",name:"Bruno",title:"Yeti",color:"#25c9b8",secondary:"#e8f4ff",blurb:"Slow to wake up, unstoppable once rolling.",stats:{speed:4,accel:1,handling:2,weight:5},figure:{head:"box",skin:"#eef4ff",face:"#7fb2ff",ears:{type:"tuft",color:"#eef4ff"},eyes:{type:"dot",pupil:"#1a2a44",brow:"#dfe8ff"},snout:{type:"muzzle",color:"#7fb2ff",nose:"#1a2a44"},suit:"#25c9b8"}}],Nr=s=>Math.min(5,Math.max(1,Number(s)||3));function Dv(s={}){const t=Nr(s.speed),e=Nr(s.accel),i=Nr(s.handling),n=Nr(s.weight);return{maxSpeed:28+(t-1)*2,accelTime:4-(e-1)*.375,steerMul:.85+(i-1)*.075,driftChargeMul:.9+(i-1)*.05,grip:14+i*1.5,mass:.7+(n-1)*.15}}const Js=.33,po=1.035,Un="#2a2d3a",Tn="#d6dbe6",Uv="#1e1e26",mo="#ffffff";let kr=null;function vl(){if(kr)return kr;const s=(i,n)=>(i.rotateX(n),i),t=(i,n)=>(i.rotateZ(n),i),e=(i,n,r,a)=>(i.scale(n,r,a),i);return kr={chassis:new It(1.25,.34,1.9),deck:new It(.9,.16,1),nose:s(new Re(.42,.78,12),Math.PI/2),noseStripe:new It(.16,.06,.9),sidePod:new It(.28,.26,1.15),bumper:new It(1.35,.14,.14),engine:new It(.85,.42,.5),engineFin:new It(.9,.05,.42),exhaust:s(new Qt(.075,.1,.48,10),Math.PI/2),flame:s(new Re(.11,.6,8),-Math.PI/2),spoiler:new It(1.5,.06,.4),spoilerEnd:new It(.06,.16,.42),strut:new It(.06,.34,.06),seatBack:new It(.58,.55,.12),seatBase:new It(.58,.1,.45),tyre:t(new Qt(Js,Js,.3,16),Math.PI/2),hub:t(new Qt(.17,.17,.32,10),Math.PI/2),hubBolt:t(new Qt(.06,.06,.36,6),Math.PI/2),steering:s(new Ii(.17,.03,8,18),Math.PI/2),steeringBar:new It(.3,.04,.04),column:new Qt(.03,.03,.38,8),torso:new It(.52,.48,.42),stripe:new It(.54,.12,.44),shoulder:new ee(.1,10,8),arm:new Qt(.06,.055,.46,8),hand:new ee(.085,10,8),neck:new Qt(.1,.12,.12,10),headRound:new ee(.33,20,14),headBox:new It(.56,.52,.52),headEgg:e(new ee(.3,20,14),1,1.2,1),headWide:e(new ee(.32,20,14),1.25,.82,1),face:e(new ee(.26,16,12),1,1.15,.55),eye:new ee(.075,12,10),eyeBig:new ee(.1,12,10),pupil:new ee(.038,8,6),pupilBig:new ee(.05,8,6),bulge:new ee(.115,12,10),patch:e(new ee(.11,12,10),1,1.35,.45),brow:new It(.2,.06,.08),visor:new It(.46,.13,.08),earRound:new ee(.115,12,10),earPointy:new Re(.1,.28,8),earInner:new Re(.055,.17,8),horn:new Re(.07,.32,8),antenna:new Qt(.02,.02,.26,6),antennaBall:new ee(.065,10,8),tuft:new Re(.1,.24,7),muzzle:e(new ee(.15,14,10),1.25,.8,1),noseTip:new ee(.05,8,6),snout:new It(.28,.2,.3),beak:s(new Re(.09,.3,8),Math.PI/2),cheek:e(new ee(.07,8,6),1,.7,.5),belly:e(new ee(.2,12,10),1,1.1,.4)},kr}const go=new te,Nv=new ai,Ih=new yi,kv=new R,Fv=new R(1,1,1),Fr=new pt;function Ov(s,t){Fr.set(t);const e=s.attributes.position.count,i=new Float32Array(e*3);for(let n=0;n<e;n++)i[n*3]=Fr.r,i[n*3+1]=Fr.g,i[n*3+2]=Fr.b;s.setAttribute("color",new Pe(i,3))}class Qs{constructor(t=!1){this.parts=[],this.outline=t?[]:null}add(t,e,i=0,n=0,r=0,a=null){Ih.set(a?a[0]:0,a?a[1]:0,a?a[2]:0),go.compose(kv.set(i,n,r),Nv.setFromEuler(Ih),Fv);const o=t.clone().applyMatrix4(go);return Ov(o,e),this.parts.push(o),this.outline&&this.outline.push(t.clone().scale(po,po,po).applyMatrix4(go)),this}build(){const t=Ji(this.parts,!1);for(const i of this.parts)i.dispose();let e=null;if(this.outline){e=Ji(this.outline,!1);for(const i of this.outline)i.dispose()}return{merged:t,outline:e}}}const Lh=new Map;function zv(s){const t=s.id;let e=Lh.get(t);if(e)return e;const i=vl(),n=s.figure||{},r=s.color,a=s.secondary||mo,o=n.skin||"#dddddd",l=n.suit||a,c=new Qs(!0);c.add(i.chassis,r,0,.42,0),c.add(i.deck,Un,0,.62,.05),c.add(i.nose,r,0,.42,1.3),c.add(i.noseStripe,a,0,.6,.9),c.add(i.sidePod,a,-.72,.36,.05),c.add(i.sidePod,a,.72,.36,.05),c.add(i.bumper,Un,0,.32,-.98),c.add(i.engine,Un,0,.66,-.78),c.add(i.engineFin,Tn,0,.9,-.78),c.add(i.exhaust,Tn,-.24,.72,-1.12,[-.25,0,0]),c.add(i.exhaust,Tn,.24,.72,-1.12,[-.25,0,0]),c.add(i.strut,Tn,-.5,.95,-.92),c.add(i.strut,Tn,.5,.95,-.92),c.add(i.spoiler,a,0,1.14,-.95,[-.18,0,0]),c.add(i.spoilerEnd,r,-.75,1.17,-.95),c.add(i.spoilerEnd,r,.75,1.17,-.95),c.add(i.seatBase,Un,0,.7,-.15),c.add(i.seatBack,a,0,.98,-.42,[.15,0,0]),c.add(i.column,Tn,0,.78,.5,[-.6,0,0]);const h=0,f=.72,u=-.12;c.add(i.torso,l,h,f+.3,u),c.add(i.stripe,a,h,f+.3,u),n.belly&&c.add(i.belly,n.belly,h,f+.3,u+.2);for(const v of[-1,1])c.add(i.shoulder,l,h+v*.3,f+.5,u+.02),c.add(i.arm,l,h+v*.3,f+.42,u+.28,[-1.15,0,0]),c.add(i.hand,o,h+v*.22,f+.33,u+.5);c.add(i.neck,o,h,f+.58,u);const m=c.build(),g=new Qs(!1),_={round:i.headRound,box:i.headBox,egg:i.headEgg,wide:i.headWide}[n.head]||i.headRound;g.add(_,o);const p=n.head==="box"?.27:n.head==="egg"?.3:.32,d=n.head==="box"?.26:n.head==="egg"?.36:n.head==="wide"?.26:.33;n.face&&g.add(i.face,n.face,0,-.02,p-.14);const x=n.eyes||{type:"dot"},M=x.pupil||"#111111",b=n.head==="wide"?.12:.06;if(x.type==="visor")g.add(i.visor,x.color||"#22e5ff",0,.04,p);else if(x.type==="bulge")for(const v of[-1,1])g.add(i.bulge,mo,v*.2,.22,p-.14),g.add(i.pupilBig,M,v*.2,.24,p-.04);else{const v=x.type==="big",S=x.color||mo;for(const U of[-1,1])x.patches&&g.add(i.patch,x.patches,U*.14,b,p-.06),g.add(v?i.eyeBig:i.eye,S,U*.13,b,p-.03),g.add(v?i.pupilBig:i.pupil,M,U*.13,b,p+(v?.06:.04)),x.brow&&g.add(i.brow,x.brow,U*.13,b+.12,p-.02)}const P=n.snout||{type:"none"};P.type==="muzzle"?(g.add(i.muzzle,P.color||o,0,-.1,p-.02),g.add(i.noseTip,P.nose||"#111111",0,-.05,p+.14)):P.type==="snout"?(g.add(i.snout,P.color||o,0,-.08,p+.02),g.add(i.noseTip,P.nose||"#111111",-.07,-.03,p+.17),g.add(i.noseTip,P.nose||"#111111",.07,-.03,p+.17)):P.type==="beak"&&g.add(i.beak,P.color||"#ff9a2a",0,-.04,p+.08),n.cheeks&&(g.add(i.cheek,n.cheeks,-.22,-.06,p-.08),g.add(i.cheek,n.cheeks,.22,-.06,p-.08));const T=n.ears||{type:"none"};if(T.type==="round")g.add(i.earRound,T.color||o,-.26,d-.02,0),g.add(i.earRound,T.color||o,.26,d-.02,0);else if(T.type==="pointy")for(const v of[-1,1])g.add(i.earPointy,T.color||o,v*.2,d+.06,0,[0,0,-v*.35]),g.add(i.earInner,T.inner||"#333333",v*.2,d+.05,.03,[0,0,-v*.35]);else if(T.type==="horns")for(const v of[-1,1])g.add(i.horn,T.color||"#ffe0a3",v*.16,d+.02,-.12,[-.7,0,-v*.3]);else T.type==="antenna"?(g.add(i.antenna,Tn,0,d+.12,0),g.add(i.antennaBall,T.color||"#ffd400",0,d+.28,0)):T.type==="tuft"&&(g.add(i.tuft,T.color||o,0,d+.1,-.02,[-.3,0,0]),g.add(i.tuft,T.color||o,.12,d+.06,-.06,[0,0,-.5]));const E=g.build(),C=new Qs(!1);C.add(i.tyre,Uv),C.add(i.hub,a),C.add(i.hubBolt,Un);const I=C.build();return e={body:m.merged,outline:m.outline,head:E.merged,wheel:I.merged},Lh.set(t,e),e}let Or=null;function Bv(){if(Or)return Or;const s=vl(),t=new Qs(!1);t.add(s.steering,Un),t.add(s.steeringBar,Un);const e=new Qs(!1);e.add(s.flame,"#ffa020",-.24,0,0),e.add(s.flame,"#ffa020",.24,0,0);const i=vl().flame.clone().scale(.5,.5,.6);return e.add(i,"#fff3a0",-.24,0,.1),e.add(i,"#fff3a0",.24,0,.1),i.dispose(),Or={steering:t.build().merged,flame:e.build().merged,vertexToon:Bt(16777215,{vertexColors:!0}),outline:new oe({color:1776426,side:je}),flameMat:new oe({vertexColors:!0,transparent:!0,opacity:.85,blending:_i,depthWrite:!1})},Or}function Gv(s){const t=Bv(),e=s.figure||{},i=zv(s),n=[],r=Bt(16777215,{vertexColors:!0}),a=Bt(16777215,e.metal?{vertexColors:!0,emissive:1120295,emissiveIntensity:.15}:{vertexColors:!0});n.push(r,a);const o=[r,a],l=o.map(C=>({color:C.emissive.clone(),intensity:C.emissiveIntensity})),c=new Te;c.name="kart-model";const h=new Te;c.add(h);const f=new ft(i.body,r);if(f.name="body",f.castShadow=!0,f.receiveShadow=!0,h.add(f),i.outline){const C=new ft(i.outline,t.outline);C.name="outline",h.add(C)}const u=new ft(t.flame,t.flameMat);u.name="flames",u.position.set(0,.68,-1.42),u.visible=!1,h.add(u);const m=new ft(t.steering,t.vertexToon);m.name="steering",m.position.set(0,.95,.4),m.rotation.x=-.6,h.add(m);const g=[],_=[],p=[[-.74,.74,!0],[.74,.74,!0],[-.74,-.72,!1],[.74,-.72,!1]];for(const[C,I,v]of p){const S=new ft(i.wheel,t.vertexToon);if(S.name=v?"wheel-front":"wheel-rear",S.castShadow=!0,S.receiveShadow=!0,v){const U=new Te;U.position.set(C,Js,I),U.add(S),c.add(U),g.push(U)}else S.position.set(C,Js,I),c.add(S);_.push(S)}const d=new ft(i.head,a);d.name="head",d.castShadow=!0,d.receiveShadow=!0,d.position.set(0,.72+.92,-.12),h.add(d);const x={steer:0,squash:0,baseScale:1,wheelAngle:0,spin:0,starOn:!1,headYaw:0,roll:0,pitch:0,flame:0},M=d.position.y;function b(C,I){const v=I.state,S=I.speed,U=Xt(Math.abs(S)/(I.baseMaxSpeed||32),0,1.3),k=I.time||0,V=I.steerVisualTarget??I.controls.steer;x.steer=ei(x.steer,V,12,C),g[0].rotation.y=g[1].rotation.y=x.steer*.45,m.rotation.y=-x.steer*.9,x.wheelAngle+=S/Js*C,(x.wheelAngle>1e4||x.wheelAngle<-1e4)&&(x.wheelAngle%=Math.PI*2);for(const st of _)st.rotation.x=x.wheelAngle;const K=v.drifting?v.driftDir*.09:0,W=-(x.steer*.11*U+K);x.roll=ei(x.roll,W,8,C);const Q=Xt(-(I.accel||0)*.011,-.16,.12);if(x.pitch=ei(x.pitch,Q,8,C),h.rotation.z=x.roll,h.rotation.x=x.pitch,v.spinTimer>0){const st=1-Xt(v.spinTimer/(I.spinDuration||1.2),0,1);x.spin=Math.PI*4*(1-(1-st)*(1-st))}else x.spin=0;c.rotation.y=x.spin,x.squash=ei(x.squash,0,9,C),x.baseScale=ei(x.baseScale,v.shrunk?.6:1,6,C);const X=v.stunTimer>0?.25:0,dt=(1-x.squash*.25-X)*x.baseScale,lt=(1+x.squash*.12+X*.4)*x.baseScale;c.scale.set(lt,dt,lt);const gt=Math.sin(k*(6+U*10))*.018*(.4+U);d.position.y=M+gt+(v.airborne?.05:0),d.rotation.z=x.steer*.12,x.headYaw=ei(x.headYaw,v.drifting?v.driftDir*.45:x.steer*.15,6,C),d.rotation.y=x.headYaw;const Ft=v.boostTimer>0?1:0;if(x.flame=ei(x.flame,Ft,14,C),x.flame>.03){u.visible=!0;const st=.75+.25*Math.sin(k*45)+.1*Math.sin(k*71),H=x.flame*st;u.scale.set(H,H,H*1.4)}else u.visible=!1;if(v.starTimer>0){const st=k*1.3%1;for(let H=0;H<o.length;H++)o[H].emissive.setHSL((st+H*.15)%1,1,.5),o[H].emissiveIntensity=.75;x.starOn=!0}else if(x.starOn){for(let st=0;st<o.length;st++)o[st].emissive.copy(l[st].color),o[st].emissiveIntensity=l[st].intensity;x.starOn=!1}}function P(){x.squash=-.6}function T(){x.squash=1}function E(){for(const C of n)C.dispose();n.length=0}return{group:c,body:h,head:d,wheelPivots:g,wheelSpins:_,materials:{body:r,accent:r,skin:a},update:b,onHop:P,onLand:T,dispose:E}}const zt=Object.freeze({reverseMax:8,brakeDecel:22,reverseAccel:7,coastFriction:3,coastDrag:.05,offroadDrag:2.5,offroadMul:.5,steerBase:2.6,steerFalloff:45,minSteerSpeed:3,airSteer:.4,hopDuration:.35,hopHeight:.55,driftMinSpeed:8,driftGrace:.2,driftSlipBase:.3,driftSlipSteer:.1,driftYawMul:.95,driftSteerGain:.6,driftChargeBase:.6,driftChargeSteer:.35,driftThresholds:[.35,.7,1],driftBoost:[[0,0],[6,.6],[9,.9],[13,1.3]],realignTime:.35,boostPadStrength:10,boostPadDuration:1,boostPadMul:1.35,starSpeedBonus:6,shrinkScale:.6,shrinkSpeedMul:.6,spinDuration:1.2,stunDuration:.9,wallSpeedMul:.7,wallBounce:2,wallCooldown:.3,wrongWayDelay:.7,wrongWaySpeed:-3,impulseDecay:4}),Dh=Math.PI*2,Ws=s=>s>Math.PI||s<-Math.PI?s-Dh*Math.round(s/Dh):s;class Hv{constructor({character:t,track:e=null,isPlayer:i=!1,index:n=0,events:r=null}){this.character=t,this.track=e,this.isPlayer=i,this.index=n,this.events=r,this.physics=Dv(t.stats),this.baseMaxSpeed=this.physics.maxSpeed,this.mass=this.physics.mass,this.spinDuration=zt.spinDuration,this.object=new Te,this.object.name=`kart-${t.id}`,this.object.rotation.order="YXZ",this.position=this.object.position,this.heading=0,this.velYaw=0,this.velocity=new R,this.forward=new R(0,0,1),this.right=new R(1,0,0),this.speed=0,this.maxSpeed=this.baseMaxSpeed,this.accel=0,this.hopHeight=0,this.time=0,this.steerVisualTarget=0,this.controls={throttle:0,brake:0,steer:0,hop:!1,useItem:!1,lookBack:!1},this._autoControls={throttle:0,brake:0,steer:0,hop:!1,useItem:!1,lookBack:!1},this._zeroControls={throttle:0,brake:0,steer:0,hop:!1,useItem:!1,lookBack:!1},this.surface=null,this.progress=0,this.item=null,this.itemRoulette=null,this.state={drifting:!1,driftDir:0,driftCharge:0,driftLevel:0,boostTimer:0,boostStrength:0,airborne:!1,hopTimer:0,spinTimer:0,stunTimer:0,starTimer:0,shrunk:!1,finished:!1,wrongWay:!1},this._impulse=new R,this._prevHop=!1,this._driftGrace=0,this._realign=0,this._slip=0,this._wallCooldown=0,this._wrongWayTimer=0,this._shrinkTimer=0,this._hasProgress=!1,this._onBoostPad=!1,this._offroad=!1,this._pitch=0,this.model=Gv(t),this.object.add(this.model.group)}update(t){if(!(t>0))return;t>1/30&&(t=1/30),this.time+=t;const e=this.state;this._tickTimers(t);const i=this._resolveControls(),n=e.spinTimer>0||e.stunTimer>0;this._updateHop(t,i,n),this._updateSteering(t,i,n),this._updateMaxSpeed(),this._updateLongitudinal(t,i,n);const r=Math.sin(this.velYaw)*this.speed+this._impulse.x,a=Math.cos(this.velYaw)*this.speed+this._impulse.z;this.velocity.set(r,0,a),this.position.x+=r*t,this.position.z+=a*t;const o=Math.exp(-zt.impulseDecay*t);this._impulse.x*=o,this._impulse.z*=o,this.forward.set(Math.sin(this.heading),0,Math.cos(this.heading)),this.right.set(this.forward.z,0,-this.forward.x),this._updateSurface(t),this.object.rotation.y=this.heading,this.object.rotation.x=this._pitch,this.steerVisualTarget=i.steer,this.model.update(t,this)}applyBoost(t=8,e=.8){const i=this.state;i.boostStrength=Math.max(i.boostTimer>0?i.boostStrength:0,t),i.boostTimer=Math.max(i.boostTimer,e);const n=this._baseCap()+t;this.speed<n&&(this.speed=Math.min(n,Math.max(this.speed,0)+t*.75)),this._emit(rt.BOOST,{kart:this,strength:t,duration:e})}hit(t="shell"){const e=this.state;return e.starTimer>0?!1:(e.drifting&&this._endDrift(!1),e.airborne&&(e.airborne=!1,e.hopTimer=0,this.hopHeight=0),this._driftGrace=0,e.boostTimer=0,e.boostStrength=0,t==="lightning"?(this.shrink(3),e.stunTimer=zt.stunDuration,this.speed*=.5):e.spinTimer=zt.spinDuration,this._emit(rt.HIT,{kart:this,kind:t}),!0)}setStar(t=10){this.state.starTimer=Math.max(this.state.starTimer,t)}shrink(t=3){this.state.shrunk=!0,this._shrinkTimer=Math.max(this._shrinkTimer,t)}reset(t,e=0){const i=this.state;if(t&&this.position.copy(t),this.heading=this.velYaw=Ws(e),this.speed=0,this.accel=0,this.velocity.set(0,0,0),this._impulse.set(0,0,0),this.hopHeight=0,this._pitch=0,i.drifting=!1,i.driftDir=0,i.driftCharge=0,i.driftLevel=0,i.boostTimer=0,i.boostStrength=0,i.airborne=!1,i.hopTimer=0,i.spinTimer=0,i.stunTimer=0,i.wrongWay=!1,this._wrongWayTimer=0,this._realign=0,this._driftGrace=0,this._prevHop=!0,this._hasProgress=!1,this._onBoostPad=!1,this.forward.set(Math.sin(this.heading),0,Math.cos(this.heading)),this.right.set(this.forward.z,0,-this.forward.x),this.object.rotation.set(0,this.heading,0),this.track){const n=this.track.getSurfaceAt(this.position,void 0);n&&(this.surface=n,this.progress=n.t,this._hasProgress=!0,this._offroad=n.type===we.OFFROAD,this._onBoostPad=n.type===we.BOOST,t&&typeof n.height=="number"&&Math.abs(t.y-n.height)<3&&(this.position.y=n.height))}}bump(t){const e=t.x*this.forward.x+t.z*this.forward.z;this.speed+=e*.5,this._impulse.x+=t.x-this.forward.x*e*.5,this._impulse.z+=t.z-this.forward.z*e*.5}getSpeedKmh(){return Math.abs(this.speed)*H_}getRpm(){const t=this.state,e=Xt(Math.abs(this.speed)/this.baseMaxSpeed,0,1.3),i=t.finished?.4:t.spinTimer>0||t.stunTimer>0?0:this.controls.throttle;let n=.12+.72*e+.16*i*(1-e*.6);return t.boostTimer>0&&(n+=.04*Math.sin(this.time*40)+.03),t.drifting&&(n+=.05),Xt(n,0,1)}dispose(){var t;this.model.dispose(),(t=this.object.parent)==null||t.remove(this.object)}_emit(t,e){this.events&&this.events.emit(t,e)}_tickTimers(t){const e=this.state;e.boostTimer>0&&(e.boostTimer-=t,e.boostTimer<=0&&(e.boostTimer=0,e.boostStrength=0)),e.spinTimer>0&&(e.spinTimer=Math.max(0,e.spinTimer-t)),e.stunTimer>0&&(e.stunTimer=Math.max(0,e.stunTimer-t)),e.starTimer>0&&(e.starTimer=Math.max(0,e.starTimer-t)),this._shrinkTimer>0&&(this._shrinkTimer-=t,this._shrinkTimer<=0&&(this._shrinkTimer=0,e.shrunk=!1)),this._wallCooldown>0&&(this._wallCooldown-=t),this._realign>0&&(this._realign-=t),this._driftGrace>0&&(this._driftGrace-=t)}_resolveControls(){const t=this.state;if(t.spinTimer>0||t.stunTimer>0)return this._zeroControls;if(!t.finished)return this.controls;const e=this._autoControls;e.throttle=.4,e.brake=0,e.hop=!1,e.useItem=!1,e.lookBack=!1;const i=this.surface;if(i&&i.tangent){const r=Math.atan2(i.tangent.x,i.tangent.z)-Math.atan2(i.lateral||0,10);e.steer=Xt(Ln(this.heading,r)*1.5,-1,1)}else e.steer=0;return e}_updateHop(t,e,i){const n=this.state,r=e.hop&&!this._prevHop;if(this._prevHop=e.hop,n.airborne){n.hopTimer-=t;const a=1-Xt(n.hopTimer/zt.hopDuration,0,1);this.hopHeight=Math.sin(a*Math.PI)*zt.hopHeight,n.hopTimer<=0&&(n.airborne=!1,n.hopTimer=0,this.hopHeight=0,this.model.onLand(),this._emit(rt.LAND,{kart:this}),e.hop&&(Math.abs(e.steer||0)>.25&&this.speed>zt.driftMinSpeed?this._startDrift(e.steer>0?1:-1):this._driftGrace=zt.driftGrace))}else r&&!n.drifting&&!i&&this.speed>1?(n.airborne=!0,n.hopTimer=zt.hopDuration,this.model.onHop(),this._emit(rt.HOP,{kart:this})):this._driftGrace>0&&!n.drifting&&(e.hop?Math.abs(e.steer)>.25&&this.speed>zt.driftMinSpeed&&(this._driftGrace=0,this._startDrift(e.steer>0?1:-1)):this._driftGrace=0)}_updateSteering(t,e,i){const n=this.state,r=Math.abs(this.speed),a=zt.steerBase*this.physics.steerMul/(1+r/zt.steerFalloff),o=Xt(e.steer||0,-1,1);if(!i)if(n.drifting){const l=o*n.driftDir,c=n.driftDir*a*zt.driftYawMul*(1+zt.driftSteerGain*l);this.velYaw+=c*t;const h=zt.driftSlipBase+zt.driftSlipSteer*l;this._slip=ei(this._slip,h,10,t),this.heading=this.velYaw+n.driftDir*this._slip;const f=(zt.driftChargeBase+zt.driftChargeSteer*l)*this.physics.driftChargeMul;n.driftCharge=Math.min(1,n.driftCharge+f*t);let u=0;const m=zt.driftThresholds;n.driftCharge>=m[2]?u=3:n.driftCharge>=m[1]?u=2:n.driftCharge>=m[0]&&(u=1),u!==n.driftLevel&&(n.driftLevel=u,this._emit(rt.DRIFT_LEVEL,{kart:this,level:u})),e.hop?this.speed<zt.driftMinSpeed&&this._endDrift(!1):this._endDrift(!0)}else{const l=Xt(r/zt.minSteerSpeed,0,1)*(n.airborne?zt.airSteer:1),c=this.speed<0?-1:1;this.heading+=o*a*l*c*t,n.airborne||(this._realign>0&&(this.heading+=Ln(this.heading,this.velYaw)*(1-Math.exp(-12*t))),this.velYaw+=Ln(this.velYaw,this.heading)*(1-Math.exp(-this.physics.grip*t)))}this.heading=Ws(this.heading),this.velYaw=Ws(this.velYaw)}_baseCap(){const t=this.state;return this.baseMaxSpeed*(t.shrunk?zt.shrinkSpeedMul:1)+(t.starTimer>0?zt.starSpeedBonus:0)}_updateMaxSpeed(){const t=this.state,e=this._baseCap();let i=e;const n=this.surface?this.surface.type:we.ROAD,r=t.boostTimer>0||t.starTimer>0;t.boostTimer>0&&(i=e+t.boostStrength),n===we.BOOST&&(i=Math.max(i,e*zt.boostPadMul)),n===we.OFFROAD&&!r&&(i=e*zt.offroadMul),this.maxSpeed=i}_updateLongitudinal(t,e,i){const n=this.state,r=this.speed,a=this.maxSpeed;let o=0;if(i)o=-r*(n.stunTimer>0?3:1);else{const l=Xt(e.throttle||0,0,1),c=Xt(e.brake||0,0,1);if(l>0&&r>=-.05){if(r<a){const h=this.baseMaxSpeed/this.physics.accelTime,f=r/a;o=h*1.25*(1-.5*f*f)*l}else o=-(r-a)*2.5-1.5;c>0&&(o-=zt.brakeDecel*c)}else if(l>0)o=zt.brakeDecel*l,r+o*t>0&&(o=-r/t);else if(c>0)r>.3?o=-zt.brakeDecel*c:r>-zt.reverseMax?o=-zt.reverseAccel*c:o=-(r+zt.reverseMax)*3;else if(r!==0){const h=r>0?1:-1,f=r>a?(r-a)*2.5:0;o=-h*(zt.coastFriction+zt.coastDrag*Math.abs(r)+f),Math.abs(o*t)>Math.abs(r)&&(o=-r/t)}this.surface&&this.surface.type===we.OFFROAD&&n.boostTimer<=0&&n.starTimer<=0&&Math.abs(r)>.5&&(o-=(r>0?1:-1)*zt.offroadDrag)}this.speed=r+o*t,o>0&&r<=a&&this.speed>a&&(this.speed=a),this.speed<-zt.reverseMax-.01&&o<0&&(this.speed=-zt.reverseMax),this.accel=ei(this.accel,o,6,t)}_updateSurface(t){const e=this.state;if(!this.track){this.position.y=this.hopHeight;return}const i=this.track.getSurfaceAt(this.position,this._hasProgress?this.progress:void 0);if(!i)return;this.surface=i,this.progress=i.t,this._hasProgress=!0,typeof i.height=="number"&&(this.position.y=i.height+this.hopHeight);const n=i.type===we.OFFROAD;n!==this._offroad&&(this._offroad=n,this._emit(n?rt.OFFROAD_ENTER:rt.OFFROAD_EXIT,{kart:this}));const r=i.type===we.BOOST;r&&!this._onBoostPad&&this.applyBoost(zt.boostPadStrength,zt.boostPadDuration),this._onBoostPad=r;const a=i.tangent,o=i.right;if(a&&o){const l=i.lateral,c=i.wallHalfWidth;if(c>0&&Math.abs(l)+rr>c){const g=l>0?1:-1,_=Math.abs(l)+rr-c;this.position.x-=o.x*g*_,this.position.z-=o.z*g*_;const p=(this.velocity.x*o.x+this.velocity.z*o.z)*g,d=Math.atan2(a.x,a.z),x=Math.cos(this.velYaw-d)>=0?d:d+Math.PI;this.velYaw=Ws(x),this.heading=Ws(this.heading+Ln(this.heading,x)*.6);const M=(this._impulse.x*o.x+this._impulse.z*o.z)*g;M>0&&(this._impulse.x-=o.x*g*M,this._impulse.z-=o.z*g*M),p>1.5&&this._wallCooldown<=0&&(this._wallCooldown=zt.wallCooldown,this.speed*=zt.wallSpeedMul,this._impulse.x-=o.x*g*zt.wallBounce,this._impulse.z-=o.z*g*zt.wallBounce,e.drifting&&this._endDrift(!1),this._emit(rt.WALL_HIT,{kart:this,force:p}))}this.velocity.x*a.x+this.velocity.z*a.z<zt.wrongWaySpeed?(this._wrongWayTimer+=t,this._wrongWayTimer>zt.wrongWayDelay&&(e.wrongWay=!0)):(this._wrongWayTimer=0,e.wrongWay=!1);const f=Math.hypot(a.x,a.z)||1,u=(this.forward.x*a.x+this.forward.z*a.z)/f,m=(a.y||0)/f*u;this._pitch=ei(this._pitch,-Math.atan(m),10,t)}}_startDrift(t){const e=this.state;e.drifting=!0,e.driftDir=t,e.driftCharge=0,e.driftLevel=0,this._realign=0,this._slip=Math.max(0,Ln(this.velYaw,this.heading)*t),this._emit(rt.DRIFT_START,{kart:this,dir:t})}_endDrift(t){const e=this.state,i=e.driftLevel,n=t?i:0;if(e.drifting=!1,e.driftDir=0,e.driftCharge=0,e.driftLevel=0,this._realign=zt.realignTime,n>0){const[r,a]=zt.driftBoost[n];this.applyBoost(r,a)}this._emit(rt.DRIFT_END,{kart:this,level:n,reached:i})}}const Vv=.15,Uh=.1,_o=.15,hn={throttle:["KeyW","ArrowUp"],brake:["KeyS","ArrowDown"],left:["KeyA","ArrowLeft"],right:["KeyD","ArrowRight"],hop:["Space","ShiftRight"],useItem:["KeyE","ControlLeft","ControlRight","ShiftLeft"],lookBack:["KeyQ"]},Wv=new Set(Object.values(hn).flat());function Xv(s){if(!s||!s.tagName)return!1;const t=s.tagName.toLowerCase();return t==="input"||t==="textarea"||t==="select"||s.isContentEditable===!0}class qv{constructor(){this.controls={throttle:0,brake:0,steer:0,hop:!1,useItem:!1,lookBack:!1},this.gamepadIndex=null,this._down=new Set,this._kbSteer=0,this._hasWindow=typeof window<"u",this._onKeyDown=t=>this._keyDown(t),this._onKeyUp=t=>this._keyUp(t),this._onBlur=()=>this._down.clear(),this._hasWindow&&(window.addEventListener("keydown",this._onKeyDown),window.addEventListener("keyup",this._onKeyUp),window.addEventListener("blur",this._onBlur))}update(t){t>0||(t=1/60);const e=this.controls,i=this._down,n=m=>{for(const g of m)if(i.has(g))return!0;return!1};let r=0;if(n(hn.right)&&(r-=1),n(hn.left)&&(r+=1),r!==0){const m=t/Vv;Math.sign(this._kbSteer)===-Math.sign(r)&&this._kbSteer!==0?(this._kbSteer+=r*(t/Uh),Math.sign(this._kbSteer)===Math.sign(r)&&(this._kbSteer=0)):this._kbSteer=Xt(this._kbSteer+r*m,-1,1)}else if(this._kbSteer!==0){const m=t/Uh;Math.abs(this._kbSteer)<=m?this._kbSteer=0:this._kbSteer-=Math.sign(this._kbSteer)*m}let a=n(hn.throttle)?1:0,o=n(hn.brake)?1:0,l=this._kbSteer,c=n(hn.hop),h=n(hn.useItem),f=n(hn.lookBack);const u=this._gamepad();if(u){const m=u.axes[0]||0;let g=0;Math.abs(m)>_o&&(g=-Math.sign(m)*((Math.abs(m)-_o)/(1-_o)));const _=x=>u.buttons[x],p=x=>{const M=_(x);return M?typeof M.value=="number"?M.value:M.pressed?1:0:0},d=x=>{const M=_(x);return!!(M&&M.pressed)};d(14)&&(g=1),d(15)&&(g=-1),Math.abs(g)>Math.abs(l)&&(l=g),a=Math.max(a,p(7),d(12)?1:0),o=Math.max(o,p(6),d(13)?1:0),c=c||d(0),h=h||d(2)||d(4),f=f||d(5)}return e.throttle=Xt(a,0,1),e.brake=Xt(o,0,1),e.steer=Xt(l,-1,1),e.hop=c,e.useItem=h,e.lookBack=f,e}dispose(){this._hasWindow&&(window.removeEventListener("keydown",this._onKeyDown),window.removeEventListener("keyup",this._onKeyUp),window.removeEventListener("blur",this._onBlur)),this._down.clear()}_gamepad(){if(typeof navigator>"u"||typeof navigator.getGamepads!="function")return null;let t;try{t=navigator.getGamepads()}catch{return null}if(!t)return null;if(this.gamepadIndex!=null){const e=t[this.gamepadIndex];if(e&&e.connected)return e;this.gamepadIndex=null}for(let e=0;e<t.length;e++){const i=t[e];if(i&&i.connected&&i.mapping==="standard")return this.gamepadIndex=e,i}for(let e=0;e<t.length;e++){const i=t[e];if(i&&i.connected)return this.gamepadIndex=e,i}return null}_keyDown(t){if(Xv(t.target)||!Wv.has(t.code))return;t.repeat||this._down.add(t.code);const e=t.target&&t.target.tagName?t.target.tagName.toLowerCase():"";e!=="button"&&e!=="a"&&t.preventDefault()}_keyUp(t){this._down.delete(t.code)}}const Nh=new R,kh=new R,zr=new R,Br=new R;class Yv{constructor(t){this.camera=t,this.distance=7.5,this.height=3.2,this.lookHeight=1.5,this.lookAhead=2,this.baseFov=60,this.maxFov=75,this.positionLambda=10,this.yawLambda=6,this._yaw=0,this._pos=new R(0,5,-10),this._look=new R,this._fov=this.baseFov,this._shake=0,this._shakeSeed=0,this._prevSpin=0,this._prevStun=0,this._driftOffset=0,this._lookBack=0,this._speedRatio=0,this._cineTime=null}update(t,e){e>0||(e=1/60);const i=t.state,n=this.camera;(i.spinTimer>0&&this._prevSpin<=0||i.stunTimer>0&&this._prevStun<=0)&&(this._shake=1),this._prevSpin=i.spinTimer,this._prevStun=i.stunTimer,this._shake=ei(this._shake,0,4,e),this._shakeSeed+=e*37,this._lookBack=ei(this._lookBack,t.controls.lookBack?1:0,12,e),this._driftOffset=ei(this._driftOffset,i.drifting?i.driftDir*.28:0,4,e),this._yaw+=Ln(this._yaw,t.heading+this._driftOffset)*(1-Math.exp(-this.yawLambda*e));const r=this._yaw+Math.PI*this._lookBack,a=Xt(Math.abs(t.speed)/36,0,1);this._speedRatio=ei(this._speedRatio,a,4,e);const o=i.boostTimer>0?1:0,l=this.distance+this._speedRatio*1+o*.5,c=Math.sin(r),h=Math.cos(r),f=t.position.y-(t.hopHeight||0),u=t.position.x+t.velocity.x*.05,m=t.position.z+t.velocity.z*.05;if(Nh.set(u-c*l,f+this.height,m-h*l),this._pos.lerp(Nh,1-Math.exp(-this.positionLambda*e)),kh.set(t.position.x+c*this.lookAhead,f+this.lookHeight,t.position.z+h*this.lookAhead),this._look.lerp(kh,1-Math.exp(-14*e)),n.position.copy(this._pos),this._shake>.002){const _=this._shake*.35;n.position.x+=Math.sin(this._shakeSeed*1.3)*_,n.position.y+=Math.sin(this._shakeSeed*1.7+1)*_*.6,n.position.z+=Math.cos(this._shakeSeed*1.1+2)*_}n.lookAt(this._look);const g=this.baseFov+(this.maxFov-this.baseFov)*Xt(this._speedRatio*.7+o*.6,0,1);this._fov=ei(this._fov,g,5,e),Math.abs(n.fov-this._fov)>.01&&(n.fov=this._fov,n.updateProjectionMatrix())}snap(t){this._yaw=t.heading,this._driftOffset=0,this._lookBack=0,this._shake=0,this._speedRatio=0,this._cineTime=null,this._prevSpin=t.state.spinTimer,this._prevStun=t.state.stunTimer;const e=Math.sin(this._yaw),i=Math.cos(this._yaw),n=t.position.y-(t.hopHeight||0);this._pos.set(t.position.x-e*this.distance,n+this.height,t.position.z-i*this.distance),this._look.set(t.position.x+e*this.lookAhead,n+this.lookHeight,t.position.z+i*this.lookAhead),this.camera.position.copy(this._pos),this.camera.lookAt(this._look),this._fov=this.baseFov,Math.abs(this.camera.fov-this._fov)>.01&&(this.camera.fov=this._fov,this.camera.updateProjectionMatrix())}cinematic(t,e){if(!t||typeof t.sample!="function")return;const i=(e*.01%1+1)%1,n=t.sample(i),r=t.sample((i+.035)%1);if(!n||!r)return;const a=13+4*Math.sin(e*.23),o=8.5+2*Math.sin(e*.17+1);zr.copy(n.position).addScaledVector(n.right,a),zr.y+=o,Br.copy(r.position),Br.y+=2.5;const l=this._cineTime==null?1:Xt(e-this._cineTime,0,.1);this._cineTime=e,l>=1?(this._pos.copy(zr),this._look.copy(Br)):(this._pos.lerp(zr,1-Math.exp(-5*l)),this._look.lerp(Br,1-Math.exp(-6*l))),this.camera.position.copy(this._pos),this.camera.lookAt(this._look);const c=56;Math.abs(this.camera.fov-c)>.01&&(this.camera.fov=c,this.camera.updateProjectionMatrix())}}const Kv=2,$v=.55,jv=.01,cn=new R;function Zv(s){const t=s.length,e=rr*2;for(let i=0;i<t;i++){const n=s[i];for(let r=i+1;r<t;r++){const a=s[r];let o=a.position.x-n.position.x,l=a.position.z-n.position.z;const c=o*o+l*l;if(c>=e*e)continue;let h=Math.sqrt(c);h<1e-4&&(o=Math.cos(i*1.7+r),l=Math.sin(i*1.7+r),h=1);const f=o/h,u=l/h,m=n.mass||1,g=a.mass||1,_=1/(m+g),p=e-h+jv,d=p*(g*_),x=p*(m*_);n.position.x-=f*d,n.position.z-=u*d,a.position.x+=f*x,a.position.z+=u*x;const M=a.velocity.x-n.velocity.x,b=a.velocity.z-n.velocity.z,P=-(M*f+b*u);let T=0;if(P>0){const I=(1+$v)*P/(1/m+1/g);cn.set(-f*(I/m),0,-u*(I/m)),n.bump(cn),cn.set(f*(I/g),0,u*(I/g)),a.bump(cn),T=P}else cn.set(-f*.4,0,-u*.4),n.bump(cn),cn.set(f*.4,0,u*.4),a.bump(cn);const E=n.state.starTimer>0,C=a.state.starTimer>0;if(E&&!C?a.hit("star"):C&&!E&&n.hit("star"),T>Kv){const I=n.events||a.events;I&&I.emit(rt.KART_BUMP,{a:n,b:a,force:T})}}}}const Fh={[Zi.EASY]:{steerGain:1.5,throttleMin:.72,boostGap:1/0,boostEvery:0,boostStrength:0,boostDur:0,driftRelease:1,itemDelay:[1.5,4],noise:.06,throttleCap:.9},[Zi.NORMAL]:{steerGain:1.9,throttleMin:.85,boostGap:70,boostEvery:7,boostStrength:3.5,boostDur:.8,driftRelease:2,itemDelay:[1,3],noise:.03,throttleCap:1},[Zi.HARD]:{steerGain:2.3,throttleMin:.95,boostGap:55,boostEvery:4.5,boostStrength:5.5,boostDur:1,driftRelease:3,itemDelay:[1,2],noise:0,throttleCap:1}},vo=new R,xo=new R,Mo=new R,En=new R,Oh=new WeakMap;function Jv(s,t,e){let i=Oh.get(s);if(i||(i={time:-1,t:0,lat:0},Oh.set(s,i)),i.time!==e){const n=t.getSurfaceAt(s.position,i.time>=0?i.t:void 0);i.time=e,i.t=n.t,i.lat=n.lateral}return i}class Qv{constructor(t,e,{difficulty:i=Zi.NORMAL,personality:n=.5,rng:r=Math.random}={}){this.kart=t,this.track=e,this.difficulty=Fh[i]?i:Zi.NORMAL,this.tune=Fh[this.difficulty],this.personality=Xt(n,0,1),this.rng=r,this.lane=(this.personality-.5)*.8,this.laneTarget=this.lane,this.laneTimer=2+this.rng()*4,this.aggression=.4+this.personality*.6,this.steer=0,this.turnTimer=0,this.driftHold=!1,this.driftTime=0,this.driftCooldown=0,this.stuckTimer=0,this.reverseTimer=0,this.reverseSteer=0,this.itemTimer=0,this.itemId=null,this.itemCooldown=0,this.boostTimer=this.rng()*3,this.noiseTimer=0,this.noise=0,this.curvature=0,this._threats=[],this._threatPool=[]}update(t,e){var dt,lt,gt;const i=this.kart,n=i.controls,r=e?e.phase:We.RACING;if(r===We.COUNTDOWN||e&&e.isControlLocked&&e.isControlLocked(i)){n.throttle=0,n.brake=0,n.steer=0,n.hop=!1,n.useItem=!1,n.lookBack=!1;return}const a=i.surface??this.track.getSurfaceAt(i.position,i.progress),o=typeof i.progress=="number"?Ge(i.progress):Ge(a.t),l=i.speed??0,c=this.track.length||1e3,h=((lt=(dt=i.character)==null?void 0:dt.stats)==null?void 0:lt.handling)??3,f=!!(i.state&&i.state.finished);this._updateLane(t);const u=8+Math.max(0,l)*.6,m=Ge(o+u/c),g=this.track.sample(m),_=this.track.sample(Ge(o+u*2.2/c)),p=a.tangent??g.tangent,d=p.z*_.tangent.x-p.x*_.tangent.z,x=Xt(p.x*_.tangent.x+p.z*_.tangent.z,-1,1),M=Math.acos(x),b=d>=0?1:-1;this.curvature=M;const P=g.halfWidth??6;let T=this.lane*P+b*Math.min(M*2.4,P*.55);T=Xt(T,-(P-1.3),P-1.3),(a.type===we.OFFROAD||a.type===we.VOID)&&((a.wallHalfWidth??a.halfWidth+3)-Math.abs(a.lateral)<2.5||Math.abs(a.lateral)>a.halfWidth)&&(T=0),xo.set(Math.sin(i.heading),0,Math.cos(i.heading)),Mo.set(Math.cos(i.heading),0,-Math.sin(i.heading));const E=i.state&&i.state.starTimer>0,C=e?e.time:0;this._threats.length=0,e&&e.items&&!E&&this._collectThreats(e.items.getObstacles(),i,!1,o,c,C),this.track.hazards&&this.track.hazards.length&&this._collectThreats(this.track.hazards,i,!0,o,c,C),this._threats.length&&(T=this._avoid(T,P-1,a.lateral??0,u)),vo.copy(g.position).addScaledVector(g.right,T);const I=Math.atan2(vo.x-i.position.x,vo.z-i.position.z);let v=Ln(i.heading,I);l<-.5&&(v=-v),this.noiseTimer-=t,this.noiseTimer<=0&&(this.noiseTimer=.4+this.rng()*.6,this.noise=(this.rng()*2-1)*this.tune.noise);const S=Xt(v*this.tune.steerGain+this.noise,-1,1);this.steer=ke(this.steer,S,1-Math.exp(-14*t));let U=this.tune.throttleCap,k=0;const V=.55+h*.12;M>V&&(U-=Xt((M-V)*.9,0,.55)),M>V+.7&&l>22&&(k=.35),Math.abs(v)>1.2&&l>10&&(U=.2,k=.5),a.type===we.BOOST&&(U=1),i.state&&i.state.wrongWay&&l>6&&(U=0,k=1);let K=!1;if(e&&e.playerKart&&e.playerKart!==i&&e.progressOf&&!f&&!((gt=e.isPlayerFinished)!=null&&gt.call(e))){const Ft=e.gapMetres?e.gapMetres(i,e.playerKart):0;if(Ft>40){const st=Xt((Ft-40)/160,0,1);U*=ke(1,this.tune.throttleMin,st)}else Ft<-this.tune.boostGap&&this.tune.boostEvery>0&&(this.boostTimer-=t,this.boostTimer<=0&&(this.boostTimer=this.tune.boostEvery*(.8+this.rng()*.4),K=!0))}K&&i.applyBoost&&!(i.state&&i.state.boostTimer>0)&&i.applyBoost(this.tune.boostStrength,this.tune.boostDur);let W=!1;this.driftCooldown-=t;const Q=Math.abs(v);Q>.22&&M>.3?this.turnTimer+=t:this.turnTimer=Math.max(0,this.turnTimer-t*2);const X=i.state??{};if(this.driftHold){this.driftTime+=t,W=!0;const Ft=X.driftLevel??0,st=Q<.1&&M<.2;(Ft>=this.tune.driftRelease||st||this.driftTime>3.2||l<8||X.spinTimer>0)&&(this.driftHold=!1,W=!1,this.driftCooldown=.7,this.turnTimer=0)}else!f&&this.driftCooldown<=0&&this.turnTimer>.3&&l>14&&!X.airborne&&!(X.spinTimer>0)&&(this.driftHold=!0,this.driftTime=0,W=!0);this.reverseTimer>0?(this.reverseTimer-=t,U=0,k=1,this.steer=this.reverseSteer,W=!1):(!f&&r===We.RACING&&Math.abs(l)<2&&U>.3&&!(X.spinTimer>0)&&!(X.stunTimer>0)?this.stuckTimer+=t:this.stuckTimer=0,this.stuckTimer>1.5&&(this.stuckTimer=0,this.reverseTimer=1,this.reverseSteer=v>0?-1:1)),f&&(U=Math.min(U,.45),W=!1),n.throttle=Xt(U,0,1),n.brake=Xt(k,0,1),n.steer=Xt(this.steer,-1,1),n.hop=W,n.useItem=!1,n.lookBack=!1,e&&e.items&&!f&&r===We.RACING&&this._useItems(t,e,v,M,a)}_updateLane(t){this.laneTimer-=t,this.laneTimer<=0&&(this.laneTimer=3+this.rng()*5,this.laneTarget=Xt((this.personality-.5)*.8+(this.rng()*2-1)*.25,-.4,.4)),this.lane=ke(this.lane,this.laneTarget,1-Math.exp(-.8*t))}_collectThreats(t,e,i,n,r,a){const o=18+Math.max(0,e.speed??0)*.55;for(let l=0;l<t.length;l++){const c=t[l];let h,f;if(i){if(c.active===!1)continue;const g=Jv(c,this.track,a);h=g.t,f=g.lat}else if(c.owner===e&&c.age<1||(h=c.roadT,f=c.roadLat,typeof h!="number"))continue;let u=h-n;if(u-=Math.round(u),u*=r,u<-2||u>o||Math.abs(c.position.y-e.position.y)>5)continue;let m=this._threatPool[this._threats.length];m||(m={along:0,lat:0,r:0},this._threatPool.push(m)),m.along=u,m.lat=f,m.r=(c.radius??1)+1.9,this._threats.push(m)}}_avoid(t,e,i,n){const r=this._threats;let a=null;for(let f=0;f<r.length;f++){const u=r[f],m=ke(i,t,Xt(Math.max(u.along,0)/Math.max(n,1),0,1));Math.abs(u.lat-m)>u.r||(!a||u.along<a.along)&&(a=u)}if(!a)return t;const o=a.lat+a.r+.4,l=a.lat-a.r-.4,c=f=>{let u=Math.abs(f-t)*.5;Math.abs(f)>e&&(u+=(Math.abs(f)-e)*6);for(let m=0;m<r.length;m++){const g=r[m];if(g===a)continue;const _=Math.abs(f-g.lat);_<g.r&&(u+=(g.r-_)*4)}return u},h=c(o)<=c(l)?o:l;return Xt(h,-e,e)}_useItems(t,e,i,n,r){const a=this.kart,o=e.items;this.itemCooldown-=t;const l=a.item;if(!l||a.itemRoulette!=null){this.itemId=null;return}if(l.id!==this.itemId){this.itemId=l.id;const[M,b]=this.tune.itemDelay;this.itemTimer=M+this.rng()*(b-M),(l.id==="star"||l.id==="lightning"||l.id==="bob_omb")&&(this.itemTimer+=1+this.rng()*2)}if(this.itemTimer-=t,this.itemCooldown>0||(e.time??0)<1.5||this.itemTimer>0&&l.id!=="green_shell"&&l.id!=="triple_green"&&l.id!=="red_shell")return;const c=e.rankOf?e.rankOf(a):4,h=e.karts?e.karts.length:8,f=a.state??{};let u=1/0,m=!1,g=1/0;const _=e.karts??o.karts??[];for(let M=0;M<_.length;M++){const b=_[M];if(b===a||!b.position)continue;En.subVectors(b.position,a.position);const P=En.x*xo.x+En.z*xo.z,T=En.x*Mo.x+En.z*Mo.z,E=Math.hypot(En.x,En.z);P>0&&E<u&&(u=E,m=Math.abs(T)<1.6+P*.14),P<0&&E<g&&(g=E)}let p=!1,d=!1,x=!1;switch(l.id){case"green_shell":case"triple_green":u<25&&m?p=!0:g<8&&this.rng()<.5?(p=!0,d=!0):this.itemTimer<-8&&(p=!0);break;case"red_shell":(c>1&&u<60||this.itemTimer<-6)&&(p=!0);break;case"banana":case"triple_banana":case"fake_box":(g<8||n>.35&&this.rng()<t*1.2||this.itemTimer<-10)&&(p=!0);break;case"mushroom":case"triple_mushroom":if(f.boostTimer>0)break;(r.type===we.OFFROAD||n<.25&&Math.abs(i)<.2||this.itemTimer<-6)&&(p=!0);break;case"star":(c>h/2||this.itemTimer<-3)&&(p=!0);break;case"lightning":(c>=3||this.itemTimer<-3)&&(p=!0);break;case"bob_omb":u<25&&n<.4?(p=!0,x=!0):g<6?(p=!0,d=!0):this.itemTimer<-4&&(p=!0,x=!0);break;default:p=this.itemTimer<-2}p&&o.use(a,{backwards:d,forward:x,race:e})&&(this.itemCooldown=.45+this.rng()*.4)}}const ia=1.2;function tx(s,t=.9,e=.62){const i=s.attributes.position,n=new Float32Array(i.count*3),r=new pt;for(let a=0;a<i.count;a++){const o=i.getX(a),l=i.getY(a),c=i.getZ(a),h=(Math.atan2(c,o)/(Math.PI*2)+.5+l*.35+1)%1;r.setHSL(h,t,e),n[a*3]=r.r,n[a*3+1]=r.g,n[a*3+2]=r.b}return s.setAttribute("color",new Pe(n,3)),s}function zh(s="#ffffff",t="#3b2a6e"){if(typeof document>"u")return null;try{return W_(128,128,(e,i,n)=>{e.clearRect(0,0,i,n),e.font='bold 104px "Luckiest Guy", "Arial Black", Impact, sans-serif',e.textAlign="center",e.textBaseline="middle",e.lineJoin="round",e.lineWidth=14,e.strokeStyle=t,e.strokeText("?",i/2,n/2+6),e.fillStyle=s,e.fillText("?",i/2,n/2+6)})}catch{return null}}class ex{constructor(){this._geos=[],this._mats=[],this._tex=[],this._pools=new Map;const t=i=>(this._geos.push(i),i),e=i=>(this._mats.push(i),i);this.shellDomeGeo=t(new ee(.55,18,10,0,Math.PI*2,0,Math.PI*.5)),this.shellRimGeo=t(new Ii(.53,.11,8,20)),this.shellBaseGeo=t(new Qt(.5,.42,.18,18)),this.shellStripeGeo=t(new Ii(.42,.05,6,20)),this.greenDomeMat=e(Bt(4054148)),this.greenRimMat=e(Bt(12124118)),this.redDomeMat=e(Bt(16726843)),this.redRimMat=e(Bt(16761528)),this.shellBaseMat=e(Bt(16773590)),this.shellStripeMat=e(Bt(16777215)),this.bananaBodyGeo=t(new Ii(.42,.15,8,14,Math.PI*.95)),this.bananaTipGeo=t(new Re(.12,.22,8)),this.bananaMat=e(Bt(16767293)),this.bananaTipMat=e(Bt(7028509)),this.bombBodyGeo=t(new ee(.46,18,14)),this.bombFootGeo=t(new ee(.16,10,8)),this.bombKeyStemGeo=t(new Qt(.05,.05,.28,8)),this.bombKeyRingGeo=t(new Ii(.16,.045,6,12)),this.bombFuseGeo=t(new Qt(.035,.05,.28,6)),this.bombSparkGeo=t(new sr(.11,0)),this.bombEyeGeo=t(new ee(.07,8,6)),this.bombBodyMat=e(Bt(2765122)),this.bombFootMat=e(Bt(16754237)),this.bombKeyMat=e(Bt(16773280)),this.bombFuseMat=e(Bt(10197915)),this.bombSparkMat=e(new oe({color:16769126})),this.bombEyeMat=e(new oe({color:16777215})),this.boxGeo=t(tx(new It(ia,ia,ia))),this.boxMat=e(new bi({vertexColors:!0,transparent:!0,opacity:.62,roughness:.15,metalness:.25,emissive:16777215,emissiveIntensity:.18,depthWrite:!1})),this.fakeBoxMat=e(new bi({color:16726891,transparent:!0,opacity:.78,roughness:.2,metalness:.2,emissive:13126655,emissiveIntensity:.35,depthWrite:!1})),this.questionTex=zh(),this.questionTex&&this._tex.push(this.questionTex),this.fakeQuestionTex=zh("#ffd0dc","#4a0a2a"),this.fakeQuestionTex&&this._tex.push(this.fakeQuestionTex),this.questionGeo=t(new be(.72,.72)),this.coreGeo=t(new sr(.34,0)),this.questionMat=e(this.questionTex?new oe({map:this.questionTex,transparent:!0,side:_e,depthWrite:!1}):new oe({color:16777215})),this.fakeQuestionMat=e(this.fakeQuestionTex?new oe({map:this.fakeQuestionTex,transparent:!0,side:_e,depthWrite:!1}):new oe({color:16765148})),this.coreMat=e(new oe({color:16775106}))}_buildShell(t){const e=new Te,i=new ft(this.shellDomeGeo,t?this.redDomeMat:this.greenDomeMat);i.position.y=.09,i.castShadow=!0;const n=new ft(this.shellRimGeo,t?this.redRimMat:this.greenRimMat);n.rotation.x=Math.PI/2,n.position.y=.1;const r=new ft(this.shellBaseGeo,this.shellBaseMat);r.position.y=.02;const a=new ft(this.shellStripeGeo,this.shellStripeMat);return a.rotation.x=Math.PI/2,a.position.y=.42,a.scale.setScalar(.8),e.add(r,n,i,a),e.userData.spin=i,e}_buildBanana(){const t=new Te,e=new ft(this.bananaBodyGeo,this.bananaMat);e.rotation.z=Math.PI*.55,e.position.y=.3,e.castShadow=!0;const i=new ft(this.bananaTipGeo,this.bananaTipMat),n=new ft(this.bananaTipGeo,this.bananaTipMat);return i.position.set(-.43,.32,0),i.rotation.z=Math.PI*.5,n.position.set(.38,.44,0),n.rotation.z=Math.PI*.2,t.add(e,i,n),t.userData.spin=null,t}_buildBomb(){const t=new Te,e=new ft(this.bombBodyGeo,this.bombBodyMat);e.position.y=.48,e.castShadow=!0;const i=new ft(this.bombFootGeo,this.bombFootMat),n=new ft(this.bombFootGeo,this.bombFootMat);i.position.set(-.2,.12,.05),n.position.set(.2,.12,.05),i.scale.set(1,.7,1.3),n.scale.set(1,.7,1.3);const r=new ft(this.bombKeyStemGeo,this.bombKeyMat);r.rotation.x=Math.PI/2,r.position.set(0,.5,-.55);const a=new ft(this.bombKeyRingGeo,this.bombKeyMat);a.position.set(0,.5,-.72),a.rotation.y=Math.PI/2;const o=new ft(this.bombFuseGeo,this.bombFuseMat);o.position.set(.04,1.02,0),o.rotation.z=-.25;const l=new ft(this.bombSparkGeo,this.bombSparkMat);l.position.set(.08,1.18,0);const c=new ft(this.bombEyeGeo,this.bombEyeMat),h=new ft(this.bombEyeGeo,this.bombEyeMat);return c.position.set(-.15,.56,.42),h.position.set(.15,.56,.42),t.add(e,i,n,r,a,o,l,c,h),t.userData.spark=l,t.userData.key=a,t.userData.spin=null,t}_buildBox(t){const e=new Te,i=new ft(this.boxGeo,t?this.fakeBoxMat:this.boxMat);i.renderOrder=2;let n;return this.questionTex?(n=new ft(this.questionGeo,t?this.fakeQuestionMat:this.questionMat),t&&(n.rotation.z=Math.PI)):n=new ft(this.coreGeo,this.coreMat),n.renderOrder=1,e.add(n,i),e.userData.cube=i,e.userData.inner=n,e.userData.spin=null,e}_build(t){switch(t){case"green_shell":return this._buildShell(!1);case"red_shell":return this._buildShell(!0);case"banana":return this._buildBanana();case"bob_omb":return this._buildBomb();case"fake_box":return this._buildBox(!0);case"item_box":return this._buildBox(!1);default:return this._buildBanana()}}acquire(t){let e=this._pools.get(t);e||(e=[],this._pools.set(t,e));const i=e.pop()??this._build(t);return i.visible=!0,i.scale.setScalar(1),i.rotation.set(0,0,0),i.userData.kind=t,i}release(t){if(!t)return;t.removeFromParent(),t.visible=!1;const e=this._pools.get(t.userData.kind);e&&e.push(t)}createBoxInstances(t){const e=new ua(this.boxGeo,this.boxMat,Math.max(1,t));e.renderOrder=2,e.frustumCulled=!1;const i=new ua(this.questionTex?this.questionGeo:this.coreGeo,this.questionTex?this.questionMat:this.coreMat,Math.max(1,t));return i.renderOrder=1,i.frustumCulled=!1,{cubes:e,inner:i}}dispose(){for(const t of this._pools.values())for(const e of t)e.removeFromParent();this._pools.clear();for(const t of this._geos)t.dispose();for(const t of this._mats)t.dispose();for(const t of this._tex)t.dispose();this._geos.length=0,this._mats.length=0,this._tex.length=0}}const Bh=1.4,ix=3,nx=1.2,Gh=.1,sx=.4,rx=38,Hh=40,ax=8,ox=10,tu=45,lx=3,yo=2,Vh=4.5,cx=10,hx=28,Vi=new Set(["green_shell","red_shell"]),fx={green_shell:"shell",red_shell:"shell",banana:"banana",fake_box:"fake_box",bob_omb:"explosion"},ux={green_shell:.05,red_shell:.05,banana:0,bob_omb:0,fake_box:ia*.5+.1},dx={green_shell:.6,red_shell:.6,banana:.55,bob_omb:.6,fake_box:.8},Wi=new Fe;function px(s,t){let e=t-s;return e-=Math.round(e),e}class mx{constructor(){this.active=!1,this.kind="banana",this.item="banana",this.position=new R,this.velocity=new R,this.radius=.5,this.owner=null,this.target=null,this.age=0,this.life=tu,this.bounces=0,this.hintT=void 0,this.roadT=void 0,this.roadLat=0,this.airborne=!1,this.fuse=-1,this.mesh=null,this.spin=0,this.surfaceH=0,this.restY=0}}class gx{constructor({scene:t,track:e,karts:i,events:n,rng:r}){this.scene=t,this.track=e,this.karts=i,this.events=n,this.rng=r??Math.random,this.assets=new ex,this.time=0,this._live=[],this._free=[],this._roulettes=[],this._stars=[],this._held=new Map,this._boxCount=0,this._doomed=[],this._race=null,this._setupBoxes()}_setupBoxes(){const t=this.track.itemBoxes??[],e=t.length;this._boxCount=e,this._boxPos=t.map(n=>n.position.clone()),this._boxActive=new Array(e).fill(!0),this._boxTimer=new Float32Array(e),this._boxScale=new Float32Array(e).fill(1),this._boxPhase=new Float32Array(e);for(let n=0;n<e;n++)this._boxPhase[n]=this.rng()*Math.PI*2;const i=this.assets.createBoxInstances(e);this._boxCubes=i.cubes,this._boxInner=i.inner,this._boxCubes.count=e,this._boxInner.count=e,e>0&&this.scene&&(this.scene.add(this._boxCubes),this.scene.add(this._boxInner)),this._animateBoxes(0)}_animateBoxes(t){const e=this._boxCount;if(e===0)return;const i=this.time;for(let n=0;n<e;n++){this._boxActive[n]?this._boxScale[n]<1&&(this._boxScale[n]=Math.min(1,this._boxScale[n]+t*2.5)):(this._boxTimer[n]-=t,this._boxTimer[n]<=0&&(this._boxActive[n]=!0,this._boxScale[n]=0));const r=this._boxScale[n],a=this._boxActive[n]?r<1?r*(1+.25*Math.sin(r*Math.PI)):1:0,o=this._boxPhase[n],l=this._boxPos[n];Wi.position.set(l.x,l.y+Math.sin(i*2.2+o)*.14,l.z),Wi.rotation.set(i*.8+o,i*1.3+o,i*.5),Wi.scale.setScalar(a),Wi.updateMatrix(),this._boxCubes.setMatrixAt(n,Wi.matrix),Wi.rotation.set(0,i*2.6+o,0),Wi.scale.setScalar(a),Wi.updateMatrix(),this._boxInner.setMatrixAt(n,Wi.matrix)}this._boxCubes.instanceMatrix.needsUpdate=!0,this._boxInner.instanceMatrix.needsUpdate=!0}_updatePickups(t){const e=this._boxCount;if(e===0)return;const i=Bh*Bh,n=this.karts.length;for(let r=0;r<e;r++){if(!this._boxActive[r]||this._boxScale[r]<.5)continue;const a=this._boxPos[r];for(let o=0;o<n;o++){const l=this.karts[o];if(l.item||l.itemRoulette!=null||!l.position)continue;const c=l.position.x-a.x,h=l.position.z-a.z,f=l.position.y-a.y;if(c*c+h*h<i&&Math.abs(f)<2.5){this._boxActive[r]=!1,this._boxTimer[r]=ix;const u=t&&t.rankOf?t.rankOf(l):1;this.giveRandom(l,u,n);break}}}}_lightningInPlay(){for(const t of this.karts)if(t.item&&t.item.id==="lightning")return!0;for(const t of this._roulettes)if(t.id==="lightning")return!0;return!1}_starInPlay(){for(const t of this.karts)if(t.item&&t.item.id==="star"||t.state&&t.state.starTimer>0)return!0;for(const t of this._roulettes)if(t.id==="star")return!0;return!1}_anyStarActive(){if(this._stars.length>0)return!0;for(const t of this.karts)if(t.state&&t.state.starTimer>0)return!0;return!1}pickItemId(t,e){const i=e/3,n=t<=i?0:t>2*i?2:1,r=this._lightningInPlay()||this._anyStarActive(),a=this._starInPlay(),o=[];let l=0;for(const h of fn){let f=ar[h].weight[n];h==="lightning"&&r&&(f=0),h==="star"&&a&&(f=0),o.push(f),l+=f}if(l<=0)return"mushroom";let c=this.rng()*l;for(let h=0;h<fn.length;h++)if(c-=o[h],c<0)return fn[h];return fn[fn.length-1]}giveRandom(t,e=1,i=this.karts.length){if(t.item||t.itemRoulette!=null)return!1;const n=this.pickItemId(e,i);return t.itemRoulette=0,this._roulettes.push({kart:t,t:0,tick:0,id:n,rank:e,total:i}),!0}_updateRoulettes(t){for(let e=this._roulettes.length-1;e>=0;e--){const i=this._roulettes[e],n=i.kart;if(n.itemRoulette==null){this._roulettes.splice(e,1);continue}if(i.t+=t/nx,i.tick+=t,i.tick>=Gh&&(i.tick-=Gh,this.events.emit(rt.ITEM_ROULETTE_TICK,{kart:n,progress:Math.min(1,i.t)})),i.t>=1){this._roulettes.splice(e,1);let r=i.id;(r==="lightning"&&(this._lightningInPlay()||this._anyStarActive())||r==="star"&&this._starInPlay())&&(r=this.pickItemId(i.rank,i.total)),n.item={id:r,count:ar[r].count},n.itemRoulette=null,this.events.emit(rt.ITEM_PICKUP,{kart:n,item:n.item})}else n.itemRoulette=i.t}}hasItem(t){return!!(t&&t.item)}use(t,e={}){const i=t.item;if(!i||t.itemRoulette!=null)return!1;const n=t.state;if(n&&(n.spinTimer>0||n.stunTimer>0))return!1;const r=!!e.backwards,a=!!e.forward&&!r,o=i.id;switch(o){case"mushroom":case"triple_mushroom":t.applyBoost(10,.9);break;case"banana":case"triple_banana":a?this._spawnToss("banana",t):this._spawnDrop("banana",t);break;case"fake_box":a?this._spawnToss("fake_box",t):this._spawnDrop("fake_box",t);break;case"green_shell":case"triple_green":this._spawnShell("green_shell",t,r,null);break;case"red_shell":{const l=r?null:this._findRedTarget(t,e.race);this._spawnShell("red_shell",t,r,l);break}case"star":t.setStar(10),this._stars.push({kart:t,timer:10}),this.events.emit(rt.STAR_START,{kart:t});break;case"lightning":this._lightning(t,e.race);break;case"bob_omb":r?this._spawnDrop("bob_omb",t,yo):this._spawnToss("bob_omb",t,yo);break;default:return!1}return this.events.emit(rt.ITEM_USE,{kart:t,item:{id:o,count:i.count}}),i.count-=1,i.count<=0&&(t.item=null),!0}_findRedTarget(t,e){e=e??this._race;const i=e&&e.standings?e.standings():null;if(i){const l=i.indexOf(t);for(let c=l-1;c>=0;c--){const h=i[c];if(h&&!(h.state&&h.state.finished))return h}return null}const n=Math.sin(t.heading),r=Math.cos(t.heading);let a=null,o=1/0;for(const l of this.karts){if(l===t)continue;const c=l.position.x-t.position.x,h=l.position.z-t.position.z;if(c*n+h*r<=0)continue;const u=c*c+h*h;u<o&&(o=u,a=l)}return a}_lightning(t,e){e=e??this._race;for(const n of this.karts)n!==t&&(n.state&&n.state.starTimer>0||n.state&&n.state.finished||(n.hit("lightning"),this.events.emit(rt.ITEM_HIT,{kart:n,item:"lightning",position:n.position})));let i=null;e&&e.standings&&(i=e.standings()[0]),i&&i!==t&&(i.item=null,i.itemRoulette=null),this.events.emit(rt.LIGHTNING,{kart:t})}_acquire(t){let e=this._free.pop();return e||(e=new mx),e.active=!0,e.kind=t,e.item=t,e.radius=dx[t]??.5,e.restY=ux[t]??0,e.owner=null,e.target=null,e.age=0,e.life=Vi.has(t)?t==="red_shell"?ox:ax:tu,e.bounces=0,e.hintT=void 0,e.roadT=void 0,e.roadLat=0,e.airborne=!1,e.fuse=-1,e.spin=0,e.velocity.set(0,0,0),e.mesh=this.assets.acquire(t),this.scene&&this.scene.add(e.mesh),this._live.push(e),Vi.has(t)||this._capStatics(),e}_capStatics(){let t=0;for(const e of this._live)Vi.has(e.kind)||t++;if(!(t<=hx)){for(const e of this._live)if(!Vi.has(e.kind)&&!e.airborne){this._remove(e);return}}}_remove(t){if(!t.active)return;t.active=!1,this.assets.release(t.mesh),t.mesh=null,t.owner=null,t.target=null;const e=this._live.indexOf(t);e>=0&&(this._live[e]=this._live[this._live.length-1],this._live.pop()),this._free.push(t)}_groundHeight(t){const e=this.track.getSurfaceAt(t.position,t.hintT);return t.hintT=e.t,t.roadT=e.t,t.roadLat=e.lateral,e}_spawnDrop(t,e,i=-1){const n=this._acquire(t);n.owner=e;const r=Math.sin(e.heading),a=Math.cos(e.heading);n.position.set(e.position.x-r*2.5,e.position.y,e.position.z-a*2.5),n.hintT=e.progress;const o=this._groundHeight(n);return n.position.y=o.height+n.restY,n.surfaceH=o.height,n.fuse=i,n.mesh.rotation.y=e.heading,o.type===we.VOID&&(n.life=.01),this._syncMesh(n),n}_spawnToss(t,e,i=-1){const n=this._acquire(t);n.owner=e;const r=Math.sin(e.heading),a=Math.cos(e.heading);n.position.set(e.position.x+r*1.2,e.position.y+.9,e.position.z+a*1.2);const o=Math.max(0,e.speed??0)+10;return n.velocity.set(r*o,6,a*o),n.airborne=!0,n.hintT=e.progress,n.fuse=i,n.mesh.rotation.y=e.heading,this._syncMesh(n),n}_spawnShell(t,e,i,n){const r=this._acquire(t);r.owner=e,r.target=n;const a=i?-1:1,o=Math.sin(e.heading)*a,l=Math.cos(e.heading)*a,c=t==="red_shell"?Hh:rx,h=i?c:Math.max(c,Math.max(0,e.speed??0)+c*.4);r.position.set(e.position.x+o*1.5,e.position.y+.2,e.position.z+l*1.5),r.velocity.set(o*h,0,l*h),r.hintT=e.progress;const f=this._groundHeight(r);return r.position.y=f.height+r.restY,r.surfaceH=f.height,this._syncMesh(r),r}update(t,e){this.time+=t,this._race=e,this._animateBoxes(t),this._updateRoulettes(t),this._updateStars(t),(!e||e.phase!==We.COUNTDOWN)&&this._updatePickups(e),this._updateEntities(t),this._resolveKartCollisions(),this._resolveEntityCollisions(),this._updateHeld(t)}_updateStars(t){for(let e=this._stars.length-1;e>=0;e--){const i=this._stars[e];i.timer-=t;const n=i.kart.state?i.kart.state.starTimer:void 0;(i.timer<=0||typeof n=="number"&&n<=0&&i.timer<9.5)&&(this._stars.splice(e,1),this.events.emit(rt.STAR_END,{kart:i.kart}))}}_updateEntities(t){const e=this._live;for(let i=e.length-1;i>=0;i--){if(i>=e.length)continue;const n=e[i];if(n.age+=t,n.age>n.life){this._remove(n);continue}if(n.fuse>0&&(n.fuse-=t,n.fuse<=0)){this._explode(n);continue}if(n.airborne){n.velocity.y-=cx*t,n.position.addScaledVector(n.velocity,t);const r=this._groundHeight(n);if(n.position.y<=r.height+n.restY){if(r.type===we.VOID){this._remove(n);continue}n.position.y=r.height+n.restY,n.surfaceH=r.height,n.airborne=!1,Vi.has(n.kind)?n.velocity.y=0:n.velocity.set(0,0,0)}n.spin+=t*8}else if(Vi.has(n.kind)){n.kind==="red_shell"&&this._homeRedShell(n,t),n.position.addScaledVector(n.velocity,t);const r=this._groundHeight(n);if(r.type===we.VOID){this._remove(n);continue}const a=r.height+n.restY;n.position.y+=(a-n.position.y)*Math.min(1,t*14),n.surfaceH=r.height;const o=r.lateral,l=(r.wallHalfWidth??r.halfWidth+3)-.5;if(Math.abs(o)>=l){if(n.kind==="red_shell"||n.bounces>=lx){this.events.emit(rt.ITEM_HIT,{kart:null,item:n.item,position:n.position,destroyed:!0}),this._remove(n);continue}const c=o>0?1:-1,h=r.right.x*c,f=r.right.z*c,u=n.velocity.x*h+n.velocity.z*f;u>0&&(n.velocity.x-=2*u*h,n.velocity.z-=2*u*f);const m=Math.abs(o)-(l-.1);n.position.x-=h*m,n.position.z-=f*m,n.bounces++,this.events.emit(rt.SHELL_BOUNCE,{position:n.position,kart:n.owner})}n.spin+=t*14}else n.spin+=t*2;this._syncMesh(n)}}_homeRedShell(t,e){const i=t.target;if(!i||!i.position||i.state&&i.state.finished)return;const n=t.velocity.length()||Hh,r=i.position.x-t.position.x,a=i.position.z-t.position.z,o=Math.hypot(r,a);let l,c,h;const f=t.hintT??0,u=typeof i.progress=="number"?i.progress:i.surface?i.surface.t:f,m=px(f,u);if(o<15||m<=0)l=r,c=a,h=6;else{const P=this.track.length||1e3,T=Math.min(m,14/P),E=this.track.sample(Ge(f+T)),C=E.halfWidth??6,I=Xt(i.surface&&i.surface.lateral||0,-C+1,C-1)*.6;l=E.position.x+E.right.x*I-t.position.x,c=E.position.z+E.right.z*I-t.position.z,h=3.5}const g=Math.hypot(l,c);if(g<1e-4)return;l/=g,c/=g;const _=Math.atan2(t.velocity.x,t.velocity.z);let d=Math.atan2(l,c)-_;d=Math.atan2(Math.sin(d),Math.cos(d));const x=h*e,M=Xt(d,-x,x),b=_+M;t.velocity.x=Math.sin(b)*n,t.velocity.z=Math.cos(b)*n}_syncMesh(t){const e=t.mesh;if(e)if(e.position.copy(t.position),Vi.has(t.kind))e.userData.spin&&(e.userData.spin.rotation.y=t.spin),e.rotation.y=t.spin*.5;else if(t.kind==="bob_omb"){const i=t.fuse>0?1-t.fuse/yo:0,n=e.userData.spark;n&&n.scale.setScalar(.6+i*1.6+Math.sin(t.age*40)*.15),e.userData.key&&(e.userData.key.rotation.y=t.age*6),e.rotation.y=t.airborne?t.spin:e.rotation.y,e.scale.setScalar(1+i*.15)}else t.kind==="fake_box"?(e.rotation.set(t.age*.8,t.age*1.3,t.age*.5),e.position.y=t.position.y+Math.sin(t.age*2.2)*.1):(e.rotation.y=t.airborne?t.spin:e.rotation.y,e.rotation.z=Math.sin(t.spin)*.08)}_resolveKartCollisions(){const t=this._live,e=this.karts;for(let i=t.length-1;i>=0;i--){if(i>=t.length)continue;const n=t[i],r=n.radius+rr,a=r*r;for(let o=0;o<e.length;o++){const l=e[o];if(!l.position||l===n.owner&&n.age<sx)continue;const c=l.position.x-n.position.x,h=l.position.z-n.position.z;if(c*c+h*h>a||Math.abs(l.position.y-n.position.y)>2.2)continue;if(l.state&&l.state.starTimer>0){this.events.emit(rt.ITEM_HIT,{kart:l,item:n.item,position:n.position,destroyed:!0}),this._remove(n);break}if(n.kind==="bob_omb"){this._explode(n);break}l.hit(fx[n.kind]??"shell"),this.events.emit(rt.ITEM_HIT,{kart:l,item:n.item,position:n.position}),this._remove(n);break}}}_resolveEntityCollisions(){const t=this._live,e=t.length;if(e<2)return;const i=this._doomed;i.length=0;for(let n=0;n<e;n++){const r=t[n],a=Vi.has(r.kind);for(let o=n+1;o<e;o++){const l=t[o],c=Vi.has(l.kind);if(!a&&!c)continue;const h=r.radius+l.radius,f=r.position.x-l.position.x,u=r.position.z-l.position.z;f*f+u*u>h*h||Math.abs(r.position.y-l.position.y)>2||(i.indexOf(r)<0&&i.push(r),i.indexOf(l)<0&&i.push(l))}}for(let n=0;n<i.length;n++)this._destroyOrExplode(i[n]);i.length=0}_destroyOrExplode(t){if(t.active){if(t.kind==="bob_omb"){this._explode(t);return}this.events.emit(rt.ITEM_HIT,{kart:null,item:t.item,position:t.position,destroyed:!0}),this._remove(t)}}_explode(t){if(!t.active)return;const e=t.owner,i=t.position.clone();this._remove(t),this.events.emit(rt.EXPLOSION,{position:i,kart:e});const n=Vh*Vh;for(const r of this.karts){if(!r.position||r.state&&r.state.starTimer>0)continue;const a=r.position.x-i.x,o=r.position.z-i.z,l=r.position.y-i.y;a*a+o*o<=n&&Math.abs(l)<4&&(r.hit("explosion"),this.events.emit(rt.ITEM_HIT,{kart:r,item:"bob_omb",position:i}))}for(let r=this._live.length-1;r>=0;r--){const a=this._live[r];if(!a.active)continue;const o=a.position.x-i.x,l=a.position.z-i.z;o*o+l*l<=n&&(a.kind==="bob_omb"?this._explode(a):(this.events.emit(rt.ITEM_HIT,{kart:null,item:a.item,position:a.position,destroyed:!0}),this._remove(a)))}}_heldKindFor(t){switch(t){case"banana":case"triple_banana":return"banana";case"green_shell":case"triple_green":return"green_shell";case"red_shell":return"red_shell";case"bob_omb":return"bob_omb";case"fake_box":return"fake_box";default:return null}}_updateHeld(t){for(const e of this.karts){let i=this._held.get(e);const n=e.item,r=n?n.id:null,a=n?n.count:0,o=r?this._heldKindFor(r):null,l=o?a:0;if(i||(i={id:null,count:0,meshes:[],kind:null,phase:this.rng()*6.28},this._held.set(e,i)),i.kind!==o||i.count!==l){for(const _ of i.meshes)this.assets.release(_);if(i.meshes.length=0,i.kind=o,i.count=l,o)for(let _=0;_<l;_++){const p=this.assets.acquire(o);p.scale.setScalar(.85),this.scene&&this.scene.add(p),i.meshes.push(p)}}if(i.meshes.length===0||!e.position)continue;const c=Math.sin(e.heading),h=Math.cos(e.heading),f=Math.cos(e.heading),u=-Math.sin(e.heading),m=e.position.y+(o==="fake_box"?.9:.35),g=i.meshes.length;for(let _=0;_<g;_++){const p=i.meshes[_];if(o==="green_shell"&&g>1){const d=this.time*3+i.phase+_/g*Math.PI*2,x=Math.cos(d)*2,M=Math.sin(d)*2;p.position.set(e.position.x+x,m+.2,e.position.z+M),p.userData.spin&&(p.userData.spin.rotation.y=this.time*6)}else{const d=1.7+_*1.15,x=Math.sin(this.time*4+_)*.08;p.position.set(e.position.x-c*d+f*x,m,e.position.z-h*d+u*x),p.rotation.y=e.heading,o==="fake_box"&&p.rotation.set(this.time*.8,this.time*1.3,this.time*.5),p.userData.spin&&(p.userData.spin.rotation.y=this.time*4)}}}}getObstacles(){return this._live}dispose(){for(let t=this._live.length-1;t>=0;t--)this._remove(this._live[t]);this._live.length=0,this._free.length=0,this._roulettes.length=0,this._stars.length=0;for(const t of this._held.values())for(const e of t.meshes)this.assets.release(e);this._held.clear(),this._boxCubes&&(this._boxCubes.removeFromParent(),this._boxInner.removeFromParent(),this._boxCubes.dispose(),this._boxInner.dispose()),this.assets.dispose()}}const _x=3.99,vx=8,xx=.6,Wh=1,Mx=1.5;function rc(s,t){let e=t-s;return e-=Math.round(e),e}function yx(s,t,e){const i=rc(s,t);if(i<=0)return!1;const n=Ge(e-s);return n>0&&n<=i}function bx(s,t,e){const i=rc(s,t);if(i>=0)return!1;const n=Ge(s-e);return n>=0&&n<-i}class Sx{constructor({track:t,karts:e,items:i,events:n,playerKart:r}){this.track=t,this.karts=e,this.items=i,this.events=n,this.playerKart=r??e.find(a=>a.isPlayer)??e[0],this.phase=We.COUNTDOWN,this.countdown=_x,this.time=0,this.totalLaps=t.laps??3,this.checkpointCount=Math.max(3,t.checkpointCount??4),this.results=[],this._countdownStep=3,this._raceOver=!1,this._finishTimer=-1,this._sorted=e.slice(),this._info=new Map;for(const a of e)this._info.set(a,this._makeInfo(a));this._computeRanks(!0)}_makeInfo(t){const e=this._kartT(t);return{kart:t,lap:1,nextCheckpoint:1,checkpointsPassed:0,lastT:e,lastGoodT:e,segProgress:0,score:0,rank:t.index+1,finished:!1,finishTime:1/0,voidTimer:0,lockTimer:0,hazardTimer:0,wrongWay:!1,distance:0,lastPos:t.position?t.position.clone():null}}_kartT(t){return typeof t.progress=="number"&&Number.isFinite(t.progress)?Ge(t.progress):t.surface&&typeof t.surface.t=="number"?Ge(t.surface.t):t.position&&this.track.getSurfaceAt?Ge(this.track.getSurfaceAt(t.position).t):0}update(t){if(this.phase===We.COUNTDOWN){this._updateCountdown(t);for(const e of this._info.values())e.lastT=this._kartT(e.kart);this._computeRanks(!1);return}if(this.phase===We.RACING||this.phase===We.FINISHED){this.time+=t;for(const e of this._info.values())this._updateKartProgress(e,t),this._updateVoid(e,t),this._updateWrongWay(e);this._updateHazards(t),this._computeRanks(!1),this._updateFinish(t)}}_updateCountdown(t){for(this.countdown-=t;this._countdownStep>=1&&this.countdown<=this._countdownStep;)this.events.emit(rt.COUNTDOWN,{n:this._countdownStep}),this._countdownStep--;if(this.countdown<=0){this.countdown=0,this.phase=We.RACING,this.time=0;for(const e of this._info.values())e.lastT=this._kartT(e.kart),e.lastGoodT=e.lastT,e.lastPos&&e.kart.position&&e.lastPos.copy(e.kart.position);this.events.emit(rt.RACE_START,{})}}_updateKartProgress(t,e){const i=t.kart,n=this._kartT(i),r=this.checkpointCount;if(t.lastPos&&i.position&&(t.distance+=t.lastPos.distanceTo(i.position),t.lastPos.copy(i.position)),!t.finished){const l=t.lastT;for(let c=0;c<r;c++){const h=t.nextCheckpoint/r;if(!yx(l,n,h))break;if(t.nextCheckpoint===0){if(t.lap++,t.checkpointsPassed=0,t.nextCheckpoint=1,t.lap>this.totalLaps){this._finishKart(t);break}this.events.emit(rt.LAP,{kart:i,lap:t.lap,isFinal:t.lap===this.totalLaps})}else t.checkpointsPassed++,t.nextCheckpoint=(t.nextCheckpoint+1)%r}for(let c=0;c<r;c++){const h=(t.nextCheckpoint+r-1)%r,f=h/r;if(!bx(l,n,f))break;if(h===0){if(t.lap<=1)break;t.lap--,t.checkpointsPassed=r-1,t.nextCheckpoint=0}else{if(t.checkpointsPassed<=0)break;t.checkpointsPassed--,t.nextCheckpoint=h}}}t.lastT=n;const a=(t.nextCheckpoint+r-1)%r/r;t.segProgress=rc(a,n),t.score=(t.lap-1)*r+t.checkpointsPassed;const o=i.surface;o&&o.type!==we.VOID?t.lastGoodT=n:o||(t.lastGoodT=n)}_finishKart(t){if(t.finished)return;const e=t.kart;t.finished=!0,t.finishTime=this.time,t.lap=this.totalLaps+1,t.checkpointsPassed=0,t.nextCheckpoint=1,e.state&&(e.state.finished=!0);const i=this.results.length+1,n={kart:e,time:this.time,rank:i};t.result=n,this.results.push(n),this.events.emit(rt.FINISH,{kart:e,rank:i,time:this.time}),e===this.playerKart&&this._finishTimer<0&&(this._finishTimer=vx)}_updateVoid(t,e){const i=t.kart;t.lockTimer>0&&(t.lockTimer-=e,i.controls&&(i.controls.throttle=0,i.controls.brake=0,i.controls.steer=0,i.controls.hop=!1,i.controls.useItem=!1));const n=i.surface;if(!n||!i.position)return;if(!(n.type===we.VOID||i.position.y<n.height-6)){t.voidTimer=0;return}if(t.voidTimer+=e,t.voidTimer<xx)return;t.voidTimer=0;const a=this.track.respawnPoint(t.lastGoodT);i.reset(a.position,a.heading),i.velocity&&i.velocity.set(0,0,0),i.state&&(typeof i.state.stunTimer=="number"&&(i.state.stunTimer=Math.max(i.state.stunTimer,Wh)),i.state.airborne=!1),t.lockTimer=Wh,t.lastT=t.lastGoodT,t.lastPos&&t.lastPos.copy(i.position),this.events.emit(rt.RESPAWN,{kart:i})}_updateWrongWay(t){const e=!!(t.kart.state&&t.kart.state.wrongWay);e!==t.wrongWay&&(t.wrongWay=e,this.events.emit(rt.WRONG_WAY,{kart:t.kart,on:e}))}_updateHazards(t){const e=this.track.hazards;for(const i of this._info.values())i.hazardTimer>0&&(i.hazardTimer-=t);if(!(!e||e.length===0))for(let i=0;i<e.length;i++){const n=e[i];if(!n.active)continue;const r=(n.radius??1)+rr,a=r*r;for(let o=0;o<this.karts.length;o++){const l=this.karts[o],c=this._info.get(l);if(c.hazardTimer>0||!l.position)continue;const h=l.position.x-n.position.x,f=l.position.y-n.position.y,u=l.position.z-n.position.z;h*h+u*u<a&&Math.abs(f)<r+2&&(c.hazardTimer=Mx,l.hit("hazard"))}}}_updateFinish(t){if(this._raceOver)return;let e=!1;this._finishTimer>=0&&(this._finishTimer-=t,e=this._finishTimer<=0),(this.results.length>=this.karts.length||e)&&this._endRace()}_endRace(){if(this._raceOver)return;this._raceOver=!0;const t=this._sorted.filter(n=>!this._info.get(n).finished);let e=this.results.length?this.results[this.results.length-1].time:this.time;const i=this.track.length??1e3;for(const n of t){const r=this._info.get(n),a=Math.max(0,1-this.progressOf(n))*this.totalLaps*i,o=this.time>1?r.distance/this.time:0,l=Math.max(8,o,Math.abs(n.speed??0)*.8);let c=this.time+a/l;c<=e&&(c=e+.05+Math.random()*.2),e=c,r.finished=!0,r.finishTime=c,n.state&&(n.state.finished=!0);const h={kart:n,time:c,rank:this.results.length+1};r.result=h,this.results.push(h)}this._computeRanks(!1),this.phase=We.FINISHED,this.events.emit(rt.RACE_OVER,{results:this.results})}_compare(t,e){const i=this._info.get(t),n=this._info.get(e);return i.finished||n.finished?i.finished&&n.finished?i.finishTime-n.finishTime:i.finished?-1:1:i.score!==n.score?n.score-i.score:i.segProgress!==n.segProgress?n.segProgress-i.segProgress:t.index-e.index}_computeRanks(t){const e=this._sorted;e.sort((i,n)=>this._compare(i,n));for(let i=0;i<e.length;i++){const n=this._info.get(e[i]),r=i+1;if(r!==n.rank){const a=n.rank;n.rank=r,!t&&e[i]===this.playerKart&&this.phase!==We.COUNTDOWN&&this.events.emit(rt.POSITION_CHANGE,{kart:e[i],rank:r,prev:a})}}}standings(){return this._sorted}rankOf(t){const e=this._info.get(t);return e?e.rank:this.karts.length}lapOf(t){const e=this._info.get(t);return e?Xt(e.lap,1,this.totalLaps):1}progressOf(t){const e=this._info.get(t);if(!e)return 0;if(e.finished)return 1;const i=this.checkpointCount,n=Xt(e.segProgress*i,-.5,1);return Xt((e.score+n)/(this.totalLaps*i),0,1)}gapMetres(t,e){return(this.progressOf(t)-this.progressOf(e))*this.totalLaps*(this.track.length??1e3)}isPlayerFinished(){const t=this._info.get(this.playerKart);return!!(t&&t.finished)}isControlLocked(t){const e=this._info.get(t);return!!(e&&e.lockTimer>0)}get raceTime(){return this.phase===We.COUNTDOWN?0:this.time}debugFinish(t){const e=this._info.get(t);!e||e.finished||(this.phase===We.COUNTDOWN&&(this.countdown=0,this.phase=We.RACING,this.time=0,this.events.emit(rt.RACE_START,{})),this._finishKart(e),this._computeRanks(!1),this.results.length>=this.karts.length&&this._endRace())}}function G(s,t={},...e){const i=document.createElement(s);for(const[n,r]of Object.entries(t))if(r!=null)if(n==="class")i.className=r;else if(n==="text")i.textContent=r;else if(n==="html")i.innerHTML=r;else if(n==="style")wx(i,r);else if(n==="dataset")Object.assign(i.dataset,r);else if(n==="attrs")for(const[a,o]of Object.entries(r))i.setAttribute(a,o);else n.startsWith("on")&&typeof r=="function"?i.addEventListener(n.slice(2).toLowerCase(),r):i.setAttribute(n,r);for(const n of e.flat())n==null||n===!1||i.append(n instanceof Node?n:document.createTextNode(String(n)));return i}function wx(s,t){for(const[e,i]of Object.entries(t))e.startsWith("--")?s.style.setProperty(e,String(i)):s.style[e]=i}const da=(s,t,e)=>s<t?t:s>e?e:s;function na(s){s=Math.max(1,Math.round(s||1));const t=["th","st","nd","rd"],e=s%100;return{n:s,suffix:t[(e-20)%10]||t[e]||t[0]}}function eu(s){let t=String(s||"#888888").replace("#","");t.length===3&&(t=t.split("").map(i=>i+i).join(""));const e=parseInt(t.slice(0,6),16);return Number.isNaN(e)?[136,136,136]:[e>>16&255,e>>8&255,e&255]}function iu([s,t,e]){return"#"+[s,t,e].map(i=>da(Math.round(i),0,255).toString(16).padStart(2,"0")).join("")}function sa(s,t){return iu(eu(s).map(e=>e+(255-e)*t))}function xl(s,t){return iu(eu(s).map(e=>e*(1-t)))}function Gr(s,t){s.classList.remove(t),s.offsetWidth,s.classList.add(t)}function Tx(s){try{const t=localStorage.getItem(s);return t?JSON.parse(t):null}catch{return null}}function Ex(s,t){try{localStorage.setItem(s,JSON.stringify(t))}catch{}}const Ax={speaker:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 12h6l7-6v20l-7-6H4z" fill="currentColor"/><path d="M20 11c2.5 2.5 2.5 7.5 0 10M24 7c5 5 5 13 0 18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',speakerOff:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 12h6l7-6v20l-7-6H4z" fill="currentColor"/><path d="M21 12l8 8M29 12l-8 8" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/></svg>',pause:'<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="7" y="6" width="7" height="20" rx="2" fill="currentColor"/><rect x="18" y="6" width="7" height="20" rx="2" fill="currentColor"/></svg>',flag:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 4v25" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><path d="M9 5h16l-4 6 4 6H9z" fill="currentColor"/></svg>',star:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3l3.9 8.3 9.1 1.1-6.7 6.3 1.8 9L16 23.3 7.9 27.7l1.8-9L3 12.4l9.1-1.1z" fill="currentColor"/></svg>',arrowL:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M20 5L9 16l11 11" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>',arrowR:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M12 5l11 11-11 11" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>',eye:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M2 16s5-9 14-9 14 9 14 9-5 9-14 9S2 16 2 16z" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="16" cy="16" r="4.5" fill="currentColor"/></svg>',trophy:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M9 4h14v7a7 7 0 0 1-14 0z" fill="currentColor"/><path d="M9 6H4v2a5 5 0 0 0 5 5M23 6h5v2a5 5 0 0 1-5 5" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M13 18h6v4h3v4H10v-4h3z" fill="currentColor"/></svg>',bolt:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M18 2L7 18h8l-2 12 12-17h-8z" fill="currentColor"/></svg>'};function gn(s){return Ax[s]||""}function ra(s){if(s==null||typeof s!="number"||Number.isNaN(s)||!Number.isFinite(s))return"--:--.---";const t=Math.max(0,s),e=Math.floor(t/60),i=Math.floor(t-e*60),n=Math.floor((t-Math.floor(t))*1e3+1e-6);return`${e}:${String(i).padStart(2,"0")}.${String(n).padStart(3,"0")}`}const bo=240,hs=Math.PI*.75,Hr=Math.PI*1.5,So="#1b1f3b";class Rx{constructor(t=200){this.size=t,this.dpr=Math.min(window.devicePixelRatio||1,2),this.canvas=document.createElement("canvas"),this.canvas.className="hud-speedo-canvas",this.canvas.width=t*this.dpr,this.canvas.height=t*this.dpr,this.ctx=this.canvas.getContext("2d"),this._shown=-1,this._boost=-1,this._star=null,this._bg=null,this.draw(0,0,!1,0)}_buildBackground(){const t=this.size,e=document.createElement("canvas");e.width=e.height=t*this.dpr;const i=e.getContext("2d");i.scale(this.dpr,this.dpr);const n=t/2,r=t/2,a=t*.44,o=i.createRadialGradient(n,r*.8,a*.2,n,r,a);o.addColorStop(0,"rgba(46,52,96,.96)"),o.addColorStop(1,"rgba(20,23,48,.96)"),i.beginPath(),i.arc(n,r,a,0,Math.PI*2),i.fillStyle=o,i.fill(),i.lineWidth=t*.03,i.strokeStyle="#fff",i.stroke(),i.beginPath(),i.arc(n,r,a*.78,hs,hs+Hr),i.lineWidth=t*.075,i.lineCap="round",i.strokeStyle="rgba(255,255,255,.14)",i.stroke(),i.textAlign="center",i.textBaseline="middle";for(let l=0;l<=bo;l+=10){const c=hs+l/bo*Hr,h=l%40===0,f=a*(h?.62:.66),u=a*.7;i.beginPath(),i.moveTo(n+Math.cos(c)*f,r+Math.sin(c)*f),i.lineTo(n+Math.cos(c)*u,r+Math.sin(c)*u),i.lineWidth=h?2.5:1.2,i.strokeStyle=h?"#fff":"rgba(255,255,255,.5)",i.stroke(),h&&(i.font=`800 ${Math.round(t*.068)}px "Nunito", Arial, sans-serif`,i.fillStyle="rgba(255,255,255,.85)",i.fillText(String(l),n+Math.cos(c)*a*.5,r+Math.sin(c)*a*.5))}return i.font=`800 ${Math.round(t*.058)}px "Nunito", Arial, sans-serif`,i.fillStyle="rgba(255,255,255,.6)",i.fillText("km/h",n,r+a*.86),e}draw(t,e,i,n=0){t=da(Math.abs(t)||0,0,320);const r=Math.round(t);if(r===this._shown&&Math.abs(t-this._kmh)<.05&&e===this._boost&&i===this._star&&!i&&!(e>0))return;this._shown=r,this._kmh=t,this._boost=e,this._star=i,this._bg||(this._bg=this._buildBackground());const a=this.ctx,o=this.size,l=this.dpr,c=o/2,h=o/2,f=o*.44;a.setTransform(1,0,0,1,0,0),a.clearRect(0,0,o*l,o*l),a.drawImage(this._bg,0,0),a.scale(l,l);const u=da(t/bo,0,1),m=hs+u*Hr;let g;i?g=`hsl(${(n*240%360).toFixed(0)}, 100%, 60%)`:e>0?g="#ff9f1a":u<.45?g="#3ec1ff":u<.8?g="#ffcc33":g="#ff4757",u>.002&&(a.save(),a.shadowColor=g,a.shadowBlur=e>0||i?o*.12:o*.05,a.beginPath(),a.arc(c,h,f*.78,hs,m),a.lineWidth=o*.075,a.lineCap="round",a.strokeStyle=g,a.stroke(),a.restore()),(e>0||i)&&(a.save(),a.beginPath(),a.arc(c,h,f,0,Math.PI*2),a.lineWidth=o*.03,a.strokeStyle=g,a.shadowColor=g,a.shadowBlur=o*.15*(i?1:e),a.stroke(),a.restore());const _=hs+u*Hr;a.save(),a.translate(c,h),a.rotate(_),a.beginPath(),a.moveTo(-o*.05,0),a.lineTo(f*.7,-o*.012),a.lineTo(f*.72,0),a.lineTo(f*.7,o*.012),a.lineTo(-o*.05,0),a.closePath(),a.fillStyle="#ff4757",a.strokeStyle=So,a.lineWidth=2,a.fill(),a.stroke(),a.restore(),a.beginPath(),a.arc(c,h,o*.045,0,Math.PI*2),a.fillStyle="#fff",a.fill(),a.lineWidth=2.5,a.strokeStyle=So,a.stroke(),a.textAlign="center",a.textBaseline="middle",a.font=`${Math.round(o*.17)}px "Luckiest Guy", "Arial Black", Impact, sans-serif`,a.lineWidth=o*.028,a.lineJoin="round",a.strokeStyle=So,a.strokeText(String(r),c,h+f*.62),a.fillStyle=i?g:"#fff",a.fillText(String(r),c,h+f*.62)}}const Vr="#1b1f3b";class Cx{constructor(t=180){this.size=t,this.dpr=Math.min(window.devicePixelRatio||1,2),this.canvas=document.createElement("canvas"),this.canvas.className="hud-minimap-canvas",this.canvas.width=t*this.dpr,this.canvas.height=t*this.dpr,this.ctx=this.canvas.getContext("2d"),this._points=null,this._boundsKey="",this._path=null,this._track=null,this._fit={sx:1,sy:1,ox:0,oz:0},this._sorted=[]}_fitTo(t,e){const i=this.size*.11,n=Math.max(.001,e.maxX-e.minX),r=Math.max(.001,e.maxZ-e.minZ),a=Math.min((this.size-i*2)/n,(this.size-i*2)/r),o=n*a,l=r*a;this._fit={sc:a,ox:(this.size-o)/2-e.minX*a,oz:(this.size-l)/2-e.minZ*a};const c=document.createElement("canvas");c.width=c.height=this.size*this.dpr;const h=c.getContext("2d");if(h.scale(this.dpr,this.dpr),t&&t.length>1){const f=new Path2D;t.forEach((b,P)=>{const[T,E]=this.project(b.x,b.z);P?f.lineTo(T,E):f.moveTo(T,E)}),f.closePath(),h.lineJoin="round",h.lineCap="round",h.lineWidth=this.size*.075,h.strokeStyle=Vr,h.stroke(f),h.lineWidth=this.size*.045,h.strokeStyle="#cfd6f5",h.stroke(f),h.setLineDash([this.size*.02,this.size*.02]),h.lineWidth=this.size*.008,h.strokeStyle="rgba(27,31,59,.5)",h.stroke(f),h.setLineDash([]);const[u,m]=this.project(t[0].x,t[0].z),g=t[1],[_,p]=this.project(g.x,g.z),d=Math.atan2(p-m,_-u)+Math.PI/2;h.save(),h.translate(u,m),h.rotate(d);const x=this.size*.03,M=this.size*.012;for(let b=-1;b<=1;b++)h.fillStyle=b===0?Vr:"#fff",h.fillRect(-x,b*M-M/2,x*2,M);h.restore()}this._track=c}project(t,e){const i=this._fit;return[t*i.sc+i.ox,e*i.sc+i.oz]}draw(t){if(!t)return;const e=t.points||[],i=t.bounds||{minX:-1,maxX:1,minZ:-1,maxZ:1},n=`${i.minX}|${i.maxX}|${i.minZ}|${i.maxZ}|${e.length}`;(e!==this._points||n!==this._boundsKey||!this._track)&&(this._points=e,this._boundsKey=n,this._fitTo(e,i));const r=this.ctx,a=this.size;r.setTransform(1,0,0,1,0,0),r.clearRect(0,0,a*this.dpr,a*this.dpr),r.drawImage(this._track,0,0),r.scale(this.dpr,this.dpr);const o=t.karts||[],l=this._sorted;l.length=0;for(const h of o)h.isPlayer||l.push(h);for(const h of o)h.isPlayer&&l.push(h);const c=a*.028;for(const h of l){const[f,u]=this.project(h.x,h.z);r.beginPath(),h.isPlayer?(r.arc(f,u,c*1.55,0,Math.PI*2),r.fillStyle="#fff",r.fill(),r.lineWidth=1.5,r.strokeStyle=Vr,r.stroke(),r.beginPath(),r.arc(f,u,c*1,0,Math.PI*2),r.fillStyle=h.color||"#3ec1ff",r.fill()):(r.arc(f,u,c,0,Math.PI*2),r.fillStyle=h.color||"#9aa3b5",r.fill(),r.lineWidth=1.5,r.strokeStyle=Vr,r.stroke())}}}const _s=64,Ps="#1b1f3b",Xh=new Map,qh=new Map,Px={triple_mushroom:"mushroom",triple_banana:"banana",triple_green:"green_shell"};function nu(s){return Px[s]||s}function di(s,t=3){s.lineWidth=t,s.strokeStyle=Ps,s.lineJoin="round",s.lineCap="round",s.stroke()}function pa(s,t,e,i,n,r){s.beginPath(),s.moveTo(t+r,e),s.arcTo(t+i,e,t+i,e+n,r),s.arcTo(t+i,e+n,t,e+n,r),s.arcTo(t,e+n,t,e,r),s.arcTo(t,e,t+i,e,r),s.closePath()}function ac(s,t,e,i,n=2.2){s.fillStyle=Ps;for(const r of[t,e])s.beginPath(),s.ellipse(r,i,n,n*1.5,0,0,Math.PI*2),s.fill()}function Ix(s){pa(s,21,30,22,22,8),s.fillStyle="#ffe9c9",s.fill(),di(s),ac(s,28,36,40),s.beginPath(),s.moveTo(8,33),s.bezierCurveTo(6,6,58,6,56,33),s.quadraticCurveTo(32,40,8,33),s.closePath(),s.fillStyle="#ff4757",s.fill(),di(s),s.fillStyle="#fff";for(const[t,e,i]of[[20,22,5],[34,14,6],[47,25,4.5]])s.beginPath(),s.arc(t,e,i,0,Math.PI*2),s.fill()}function Lx(s){s.beginPath(),s.moveTo(16,12),s.bezierCurveTo(4,40,24,60,54,48),s.bezierCurveTo(58,46,58,42,54,42),s.bezierCurveTo(30,50,20,34,22,14),s.closePath(),s.fillStyle="#ffd93d",s.fill(),di(s),s.beginPath(),s.moveTo(14,26),s.bezierCurveTo(14,42,26,52,40,52),s.strokeStyle="rgba(255,255,255,.65)",s.lineWidth=3,s.stroke(),s.fillStyle="#7a4a1e",s.beginPath(),s.ellipse(19,12,4,3,-.6,0,Math.PI*2),s.fill(),s.beginPath(),s.ellipse(55,45,3.5,3,.3,0,Math.PI*2),s.fill()}function Yh(s,t,e){pa(s,6,36,52,14,7),s.fillStyle="#fff2cc",s.fill(),di(s),s.beginPath(),s.moveTo(8,38),s.bezierCurveTo(8,8,56,8,56,38),s.closePath(),s.fillStyle=t,s.fill(),di(s),s.fillStyle=e;for(const[i,n,r]of[[22,28,5.5],[32,18,6],[43,28,5.5]])s.beginPath(),s.arc(i,n,r,0,Math.PI*2),s.fill(),s.lineWidth=2,s.strokeStyle=Ps,s.stroke()}function Dx(s){s.beginPath();for(let r=0;r<10;r++){const a=-Math.PI/2+r*Math.PI/5,o=r%2===0?27:12.5;s.lineTo(32+Math.cos(a)*o,33+Math.sin(a)*o)}s.closePath(),s.fillStyle="#ffe066",s.fill(),di(s),ac(s,27,37,31,2)}function Ux(s){s.beginPath(),[[38,3],[14,36],[29,36],[22,61],[50,25],[35,25],[46,3]].forEach(([i,n],r)=>r?s.lineTo(i,n):s.moveTo(i,n)),s.closePath(),s.lineWidth=7,s.strokeStyle="#ffe066",s.lineJoin="round",s.stroke();const e=s.createLinearGradient(0,0,0,64);e.addColorStop(0,"#dff2ff"),e.addColorStop(1,"#3ec1ff"),s.fillStyle=e,s.fill(),di(s,2.5)}function Nx(s){s.fillStyle="#ff9f1a";for(const e of[22,42])s.beginPath(),s.ellipse(e,57,8,4.5,0,0,Math.PI*2),s.fill(),di(s,2.5);s.beginPath(),s.arc(32,36,21,0,Math.PI*2);const t=s.createRadialGradient(24,28,4,32,36,22);t.addColorStop(0,"#5a6480"),t.addColorStop(1,"#232838"),s.fillStyle=t,s.fill(),di(s),pa(s,48,30,10,8,2),s.fillStyle="#ffd93d",s.fill(),di(s,2),pa(s,27,8,10,10,3),s.fillStyle="#ffd93d",s.fill(),di(s,2.5),s.beginPath(),s.moveTo(32,8),s.quadraticCurveTo(38,2,44,6),s.lineWidth=2.5,s.strokeStyle=Ps,s.stroke(),s.beginPath(),s.arc(45,6,4,0,Math.PI*2),s.fillStyle="#ff9f1a",s.fill(),s.beginPath(),s.arc(45,6,2,0,Math.PI*2),s.fillStyle="#ffe066",s.fill(),s.fillStyle="#fff";for(const e of[25,39])s.beginPath(),s.ellipse(e,34,4,5.5,0,0,Math.PI*2),s.fill();ac(s,26,40,35,1.8)}function kx(s){const t=[[14,22],[42,22],[42,50],[14,50]],e=[[14,22],[24,12],[52,12],[42,22]],i=[[42,22],[52,12],[52,40],[42,50]],n=(r,a)=>{s.beginPath(),r.forEach(([o,l],c)=>c?s.lineTo(o,l):s.moveTo(o,l)),s.closePath(),s.fillStyle=a,s.fill(),s.lineWidth=3,s.strokeStyle="#c84bff",s.lineJoin="round",s.stroke()};n(e,"rgba(255,90,140,.75)"),n(i,"rgba(200,75,255,.75)"),n(t,"rgba(255,71,87,.8)"),s.font='bold 26px "Luckiest Guy", "Arial Black", Impact, sans-serif',s.textAlign="center",s.textBaseline="middle",s.lineWidth=4,s.strokeStyle=Ps,s.strokeText("?",28,37),s.fillStyle="#fff",s.fillText("?",28,37)}function Fx(s,t){s.beginPath(),s.arc(32,32,24,0,Math.PI*2),s.fillStyle=t||"#9aa3b5",s.fill(),di(s),s.font='bold 28px "Luckiest Guy", "Arial Black", Impact, sans-serif',s.textAlign="center",s.textBaseline="middle",s.fillStyle="#fff",s.fillText("?",32,34)}function Ox(s,t){s.beginPath(),s.arc(50,50,12,0,Math.PI*2),s.fillStyle="#fff",s.fill(),di(s,3),s.font='bold 13px "Nunito", "Arial Black", Arial, sans-serif',s.textAlign="center",s.textBaseline="middle",s.fillStyle=Ps,s.fillText(t,50,51)}function zx(s,t,e=_s,i={}){var a,o;s.save(),s.scale(e/_s,e/_s);const n=nu(t);switch(n){case"mushroom":Ix(s);break;case"banana":Lx(s);break;case"green_shell":Yh(s,"#3ddc84","#b5f5cf");break;case"red_shell":Yh(s,"#ff3b3b","#ffb3b3");break;case"star":Dx(s);break;case"lightning":Ux(s);break;case"bob_omb":Nx(s);break;case"fake_box":kx(s);break;default:Fx(s,(a=ar[t])==null?void 0:a.color)}(n!==t||(((o=ar[t])==null?void 0:o.count)??1)>1)&&i.badge!==!1&&Ox(s,"×3"),s.restore()}function Bx(s,t={}){const e=s+(t.badge===!1?":nobadge":"");let i=qh.get(e);return i||(i=document.createElement("canvas"),i.width=_s,i.height=_s,zx(i.getContext("2d"),s,_s,t),qh.set(e,i)),i}function Kh(s,t={}){const e=s+(t.badge===!1?":nobadge":"");let i=Xh.get(e);return i||(i=Bx(s,t).toDataURL("image/png"),Xh.set(e,i)),i}const Gx=["#ffcc33","#d7dde8","#e0965a","#3ec1ff","#3ddc84","#c84bff","#ff6fae","#9aa3b5"];class Hx{constructor({onPause:t,onMute:e}){this.el=G("div",{class:"tkl-hud",attrs:{"aria-hidden":"true"}}),this._last={},this._rouletteIdx=0,this._rouletteNext=0,this._fpsVisible=!1,this._lapTimesLen=-1,this.posNum=G("span",{class:"hud-pos-num",text:"1"}),this.posSuf=G("span",{class:"hud-pos-suf",text:"st"}),this.pos=G("div",{class:"hud-pos rank-1"},this.posNum,this.posSuf),this.lapTimes=G("div",{class:"hud-laptimes"}),this.el.append(G("div",{class:"hud-corner hud-tl"},this.pos,this.lapTimes)),this.itemImg=G("img",{class:"hud-item-img",attrs:{alt:"",draggable:"false"}}),this.itemCount=G("span",{class:"hud-item-count",text:""}),this.itemSlot=G("div",{class:"hud-item is-empty"},G("div",{class:"hud-item-inner"},this.itemImg),this.itemCount),this.el.append(G("div",{class:"hud-top-centre"},this.itemSlot)),this.lapNum=G("span",{class:"hud-lap-num",text:"1/3"}),this.timer=G("div",{class:"hud-timer",text:"0:00.000"}),this.lapPanel=G("div",{class:"hud-lap"},G("div",{class:"hud-lap-row"},G("span",{class:"hud-lap-label",text:"LAP"}),this.lapNum),this.timer),this.pauseBtn=G("button",{class:"tkl-iconbtn hud-pause",attrs:{type:"button","aria-label":"Pause",title:"Pause (Esc)"},html:gn("pause"),onClick:i=>{i.stopPropagation(),t==null||t()}}),this.el.append(G("div",{class:"hud-corner hud-tr"},this.lapPanel,G("div",{class:"hud-btns"},this.pauseBtn))),this.wrongWay=G("div",{class:"hud-wrongway"},G("span",{class:"hud-wrongway-arrow",html:gn("arrowL")}),G("span",{text:"WRONG WAY"}),G("span",{class:"hud-wrongway-arrow",html:gn("arrowR")})),this.el.append(this.wrongWay),this.minimap=new Cx(180),this.el.append(G("div",{class:"hud-corner hud-bl"},G("div",{class:"hud-minimap"},this.minimap.canvas))),this.speedo=new Rx(200),this.driftSegs=[1,2,3].map(i=>G("span",{class:`hud-drift-seg lvl-${i}`})),this.drift=G("div",{class:"hud-drift lvl-0"},...this.driftSegs),this.boostFill=G("div",{class:"hud-boost-fill"}),this.boost=G("div",{class:"hud-boost"},this.boostFill,G("span",{class:"hud-boost-label",text:"BOOST"})),this.el.append(G("div",{class:"hud-corner hud-br"},G("div",{class:"hud-speedo"},this.speedo.canvas),this.drift,this.boost)),this.fps=G("div",{class:"hud-fps",text:"60 fps"}),this.el.append(this.fps),this._onMute=e}show(){this.el.classList.add("is-visible"),this._last={},this._lapTimesLen=-1}hide(){this.el.classList.remove("is-visible")}toggleFps(){this._fpsVisible=!this._fpsVisible,this.fps.classList.toggle("is-visible",this._fpsVisible)}update(t){if(!t)return;const e=this._last,i=performance.now();if(t.rank!==e.rank){const{n:c,suffix:h}=na(t.rank);this.posNum.textContent=String(c),this.posSuf.textContent=h,this.pos.className=`hud-pos rank-${Math.min(8,Math.max(1,c))}`,this.pos.style.setProperty("--rank-color",Gx[Math.min(7,Math.max(0,c-1))]),e.rank!==void 0&&Gr(this.pos,"is-pop"),e.rank=t.rank}(t.lap!==e.lap||t.totalLaps!==e.totalLaps)&&(this.lapNum.textContent=`${t.lap??1}/${t.totalLaps??3}`,e.lap!==void 0&&Gr(this.lapPanel,"is-pop"),e.lap=t.lap,e.totalLaps=t.totalLaps);const n=ra(t.time);n!==e.timeStr&&(this.timer.textContent=n,e.timeStr=n);const r=t.itemRoulette;if(r!=null)e.rouletting||(this.itemSlot.classList.add("is-rolling"),this.itemSlot.classList.remove("is-empty"),this.itemCount.textContent="",e.rouletting=!0,e.itemKey=null),i>=this._rouletteNext&&(this._rouletteIdx=(this._rouletteIdx+1+(Math.random()*(fn.length-1)|0))%fn.length,this.itemImg.src=Kh(fn[this._rouletteIdx]),this._rouletteNext=i+55+r*r*220);else{e.rouletting&&(this.itemSlot.classList.remove("is-rolling"),e.rouletting=!1,e.itemKey=null);const c=t.item,h=c?`${c.id}:${c.count}`:"";h!==e.itemKey&&(e.itemKey=h,c?(this.itemImg.src=Kh(nu(c.id),{badge:!1}),this.itemCount.textContent=c.count>1?`×${c.count}`:"",this.itemSlot.classList.remove("is-empty"),Gr(this.itemSlot,"is-got")):(this.itemSlot.classList.add("is-empty"),this.itemCount.textContent=""))}const a=t.driftLevel|0;a!==e.driftLevel&&(this.drift.className=`hud-drift lvl-${a}`,e.driftLevel=a);const o=Math.round((t.boost||0)*100)/100;o!==e.boost&&(this.boostFill.style.transform=`scaleX(${o})`,this.boost.classList.toggle("is-active",o>0),e.boost=o),!!t.star!==e.star&&(this.el.classList.toggle("is-star",!!t.star),e.star=!!t.star),!!t.wrongWay!==e.wrongWay&&(this.wrongWay.classList.toggle("is-visible",!!t.wrongWay),e.wrongWay=!!t.wrongWay);const l=t.lapTimes||[];if(l.length!==this._lapTimesLen||t.bestLap!==e.bestLap){this._lapTimesLen=l.length,e.bestLap=t.bestLap,this.lapTimes.textContent="";const c=Math.max(0,l.length-3);for(let h=c;h<l.length;h++){const f=t.bestLap!=null&&Math.abs(l[h]-t.bestLap)<1e-6;this.lapTimes.append(G("div",{class:"hud-laptime"+(f?" is-best":"")},G("span",{class:"hud-laptime-k",text:`LAP ${h+1}`}),G("span",{class:"hud-laptime-v",text:ra(l[h])})))}t.bestLap!=null&&this.lapTimes.append(G("div",{class:"hud-laptime is-best-row"},G("span",{class:"hud-laptime-k",text:"BEST"}),G("span",{class:"hud-laptime-v",text:ra(t.bestLap)}))),this.lapTimes.classList.toggle("is-visible",l.length>0),l.length>0&&Gr(this.lapTimes,"is-fade")}if(this._fpsVisible){const c=Math.round(t.fps||0);c!==e.fps&&(this.fps.textContent=`${c} fps`,e.fps=c)}this.speedo.draw(t.speedKmh||0,t.boost||0,!!t.star,t.time||i/1e3),t.minimap&&this.minimap.draw(t.minimap)}dispose(){this.el.remove()}}function Vx(){const s="ontouchstart"in window||(navigator.maxTouchPoints||0)>0,t=typeof window.matchMedia=="function"&&window.matchMedia("(pointer: coarse)").matches;return s&&t}class Wx{constructor(){this.controls={steer:0,throttle:0,brake:0,hop:!1,useItem:!1,lookBack:!1},this._pointers=new Map,this._steerPointer=null,this._buttons=[],this.el=G("div",{class:"tkl-touch",attrs:{"aria-hidden":"true"}}),this.pad=G("div",{class:"touch-pad"},G("span",{class:"touch-pad-arrow is-left",html:gn("arrowL")}),G("span",{class:"touch-pad-arrow is-right",html:gn("arrowR")}),this.knob=G("span",{class:"touch-knob"})),this.el.append(G("div",{class:"touch-left"},this.pad));const t=(e,i,n)=>{const r=G("div",{class:`touch-btn ${n}`,dataset:{role:e}},G("span",{class:"touch-btn-label",text:i}));return this._buttons.push(r),r};this.el.append(G("div",{class:"touch-right"},G("div",{class:"touch-col is-secondary"},t("lookBack","LOOK","is-look"),t("useItem","ITEM","is-item"),t("hop","HOP","is-hop")),G("div",{class:"touch-col is-primary"},t("brake","BRAKE","is-brake"),t("throttle","GAS","is-gas")))),this._onDown=e=>this._down(e),this._onMove=e=>this._move(e),this._onUp=e=>this._up(e),this.el.addEventListener("pointerdown",this._onDown),this.el.addEventListener("pointermove",this._onMove),this.el.addEventListener("pointerup",this._onUp),this.el.addEventListener("pointercancel",this._onUp),this.el.addEventListener("lostpointercapture",this._onUp),this.el.addEventListener("contextmenu",e=>e.preventDefault())}_down(t){var i,n,r;const e=t.target.closest(".touch-btn");if(e){const a=e.dataset.role;this._pointers.set(t.pointerId,a),(i=e.setPointerCapture)==null||i.call(e,t.pointerId),e.classList.add("is-down"),this._setRole(a,!0),t.preventDefault();return}t.target.closest(".touch-pad")&&this._steerPointer==null&&(this._steerPointer=t.pointerId,this._pointers.set(t.pointerId,"steer"),(r=(n=this.pad).setPointerCapture)==null||r.call(n,t.pointerId),this.pad.classList.add("is-down"),this._steerFrom(t),t.preventDefault())}_move(t){this._pointers.get(t.pointerId)==="steer"&&this._steerFrom(t)}_up(t){const e=this._pointers.get(t.pointerId);if(!e)return;if(this._pointers.delete(t.pointerId),e==="steer"){this._steerPointer=null,this.controls.steer=0,this.knob.style.transform="translate(-50%, -50%)",this.pad.classList.remove("is-down");return}let i=!1;for(const n of this._pointers.values())n===e&&(i=!0);if(!i){this._setRole(e,!1);for(const n of this._buttons)n.dataset.role===e&&n.classList.remove("is-down")}}_steerFrom(t){const e=this.pad.getBoundingClientRect(),i=e.width/2,n=t.clientX-(e.left+i),r=da(n/(i*.75),-1,1);this.controls.steer=-r,this.knob.style.transform=`translate(calc(-50% + ${(r*i*.6).toFixed(1)}px), -50%)`,this.pad.classList.toggle("is-left",r<-.15),this.pad.classList.toggle("is-right",r>.15),this.pad.classList.toggle("is-left",steer<-.15),this.pad.classList.toggle("is-right",steer>.15)}_setRole(t,e){const i=this.controls;t==="throttle"||t==="brake"?i[t]=e?1:0:i[t]=e}show(){this.el.classList.add("is-visible")}hide(){this.el.classList.remove("is-visible"),this._pointers.clear(),this._steerPointer=null,Object.assign(this.controls,{steer:0,throttle:0,brake:0,hop:!1,useItem:!1,lookBack:!1});for(const t of this._buttons)t.classList.remove("is-down")}dispose(){this.el.remove(),this._pointers.clear()}}const Xx=new Set(["KeyM","F3","ShiftLeft","ShiftRight","ControlLeft","ControlRight","AltLeft","AltRight","MetaLeft","MetaRight","CapsLock","Tab","Escape"]);class qx{constructor({events:t}){this.events=t;const e=vh.toUpperCase().split(" ");this.el=G("div",{class:"tkl-screen tkl-title"},G("div",{class:"tkl-bg tkl-bg-stripes"}),G("div",{class:"tkl-bg tkl-bg-checker"}),G("div",{class:"tkl-bg tkl-bg-shapes"},...Array.from({length:14},(i,n)=>G("i",{style:{"--i":n,left:`${(n*37+5)%100}%`,top:`${(n*53+11)%100}%`,"--sz":`${2+n*7%11*.9}vmin`}}))),G("div",{class:"title-content"},G("div",{class:"title-badge",text:"ARCADE KART RACING"}),G("h1",{class:"title-logo tkl-display",attrs:{"aria-label":vh}},...e.map((i,n)=>G("span",{class:`logo-word logo-word-${n+1}`,dataset:{text:i}},G("span",{class:"logo-text",text:i}),G("span",{class:"logo-shine",text:i,attrs:{"aria-hidden":"true"}})))),G("p",{class:"title-tagline",text:"Drift. Boost. Throw. Win."}),G("div",{class:"title-prompt tkl-display"},G("span",{class:"is-desktop",text:"Press any key to start"}),G("span",{class:"is-touch",text:"Tap to start"}))),G("div",{class:"title-credits",text:"Made with three.js — everything you see and hear is generated procedurally. No assets were harmed."})),this._onStart=null,this._readyAt=0,this._key=i=>this._maybeStart(i),this._ptr=i=>this._maybeStart(i),this._bound=!1}show({onStart:t}){this._onStart=t,this._readyAt=performance.now()+300,this._bound||(window.addEventListener("keydown",this._key),window.addEventListener("pointerdown",this._ptr),this._bound=!0)}hide(){this._onStart=null,this._bound&&(window.removeEventListener("keydown",this._key),window.removeEventListener("pointerdown",this._ptr),this._bound=!1)}_maybeStart(t){var i;if(!this._onStart||performance.now()<this._readyAt)return;if(t.type==="keydown"){if(t.repeat||Xx.has(t.code))return}else if(t.target&&t.target.closest&&t.target.closest(".tkl-iconbtn"))return;const e=this._onStart;this._onStart=null,(i=this.events)==null||i.emit(rt.UI_SELECT,{screen:"title"}),e()}dispose(){this.hide(),this.el.remove()}}const $h="tkl.select",wo=["chars","tracks","diff","buttons"],Xs=[{id:Zi.EASY,label:"Easy"},{id:Zi.NORMAL,label:"Normal"},{id:Zi.HARD,label:"Hard"}],Yx=[["speed","Speed"],["accel","Accel"],["handling","Handling"],["weight","Weight"]],Kx=4;class $x{constructor({characters:t,tracks:e,events:i}){this.characters=Array.isArray(t)?t:[],this.tracks=Array.isArray(e)?e:[],this.events=i,this.onConfirm=null,this.onBack=null;const n=Tx($h)||{};this.charIdx=Math.max(0,this.characters.findIndex(r=>r.id===n.characterId)),this.trackIdx=Math.max(0,this.tracks.findIndex(r=>r.id===n.trackId)),this.diffIdx=Math.max(0,Xs.findIndex(r=>r.id===n.difficulty)),this.diffIdx===0&&!n.difficulty&&(this.diffIdx=1),this.btnIdx=0,this.group=0,this._build(),this._onKey=r=>this._key(r),this._bound=!1}_build(){this.charCards=this.characters.map((t,e)=>{const i=t.color||"#3ec1ff",n=t.secondary||sa(i,.55);return G("button",{class:"sel-card sel-char",attrs:{type:"button",tabindex:"-1"},dataset:{id:t.id},style:{"--c":i,"--c-light":sa(i,.35),"--c-dark":xl(i,.35),"--ring":n},onClick:()=>{this._setGroup(0),this._setChar(e,!0)},onPointerenter:()=>{this.charIdx!==e&&(this._setGroup(0),this._setChar(e,!0))}},G("div",{class:"sel-avatar"},G("span",{class:"sel-avatar-letter tkl-display",text:(t.name||"?").charAt(0).toUpperCase()})),G("div",{class:"sel-char-name tkl-display",text:t.name||"???"}),G("div",{class:"sel-char-title",text:t.title||""}),G("div",{class:"sel-stats"},...Yx.map(([a,o])=>{var c;const l=Math.max(0,Math.min(5,Number((c=t.stats)==null?void 0:c[a])||0));return G("div",{class:"sel-stat"},G("span",{class:"sel-stat-k",text:o}),G("span",{class:"sel-stat-bar"},G("i",{style:{"--v":l/5}})))})))}),this.charGrid=G("div",{class:"sel-group sel-chars",attrs:{role:"listbox","aria-label":"Characters"}},...this.charCards),this.charCards.length||this.charGrid.append(G("div",{class:"sel-empty",text:"No racers available"})),this.trackCards=this.tracks.map((t,e)=>{const i=t.accent||"#ff9f1a",n=Math.max(1,Math.min(3,Number(t.difficulty)||1));return G("button",{class:"sel-card sel-track",attrs:{type:"button",tabindex:"-1"},dataset:{id:t.id},style:{"--c":i,"--c-light":sa(i,.4),"--c-dark":xl(i,.45)},onClick:()=>{this._setGroup(1),this._setTrack(e,!0)},onPointerenter:()=>{this.trackIdx!==e&&(this._setGroup(1),this._setTrack(e,!0))}},G("div",{class:"sel-track-art"},G("i",{class:"sel-track-road"})),G("div",{class:"sel-track-body"},G("div",{class:"sel-track-name tkl-display",text:t.name||t.id}),G("div",{class:"sel-track-meta"},G("span",{class:"sel-track-laps",text:`${t.laps??3} LAPS`}),G("span",{class:"sel-flags",attrs:{title:`Difficulty ${n}/3`}},...[1,2,3].map(r=>G("span",{class:"sel-flag"+(r<=n?" is-on":""),html:gn("flag")})))),G("div",{class:"sel-track-blurb",text:t.blurb||""})))}),this.trackList=G("div",{class:"sel-group sel-tracks",attrs:{role:"listbox","aria-label":"Tracks"}},...this.trackCards),this.trackCards.length||this.trackList.append(G("div",{class:"sel-empty",text:"No tracks available"})),this.diffBtns=Xs.map((t,e)=>G("button",{class:"sel-seg",attrs:{type:"button",tabindex:"-1"},dataset:{id:t.id},text:t.label,onClick:()=>{this._setGroup(2),this._setDiff(e,!0)}})),this.diffSeg=G("div",{class:"sel-group sel-diff",attrs:{role:"radiogroup","aria-label":"Difficulty"}},G("span",{class:"sel-diff-label",text:"AI DIFFICULTY"}),G("div",{class:"sel-segmented"},...this.diffBtns)),this.startBtn=G("button",{class:"tkl-btn tkl-btn-primary sel-start tkl-display",attrs:{type:"button",tabindex:"-1"},text:"START RACE",onClick:()=>this._confirm(),onPointerenter:()=>this._setButton(0)}),this.backBtn=G("button",{class:"tkl-btn tkl-btn-ghost sel-back",attrs:{type:"button",tabindex:"-1"},text:"Back",onClick:()=>this._back(),onPointerenter:()=>this._setButton(1)}),this.buttons=G("div",{class:"sel-group sel-buttons"},this.backBtn,this.startBtn),this.el=G("div",{class:"tkl-screen tkl-select"},G("div",{class:"tkl-bg tkl-bg-stripes"}),G("div",{class:"tkl-bg tkl-bg-checker"}),G("div",{class:"sel-scroll"},G("header",{class:"sel-header"},G("h2",{class:"sel-heading tkl-display",text:"CHOOSE YOUR RACER"}),G("p",{class:"sel-hint"},G("kbd",{text:"Arrows"})," move  ",G("kbd",{text:"Tab"})," / ",G("kbd",{text:"Enter"})," next  ",G("kbd",{text:"Esc"})," back")),G("div",{class:"sel-columns"},G("section",{class:"sel-col sel-col-chars"},this.charGrid),G("section",{class:"sel-col sel-col-race"},G("h3",{class:"sel-subheading tkl-display",text:"PICK A TRACK"}),this.trackList,this.diffSeg,this.buttons)))),this._groupEls=[this.charGrid,this.trackList,this.diffSeg,this.buttons],this._render()}_render(){this.charCards.forEach((e,i)=>e.classList.toggle("is-selected",i===this.charIdx)),this.trackCards.forEach((e,i)=>e.classList.toggle("is-selected",i===this.trackIdx)),this.diffBtns.forEach((e,i)=>{e.classList.toggle("is-selected",i===this.diffIdx),e.setAttribute("aria-checked",String(i===this.diffIdx))}),this.startBtn.classList.toggle("is-cursor",this.group===3&&this.btnIdx===0),this.backBtn.classList.toggle("is-cursor",this.group===3&&this.btnIdx===1),this._groupEls.forEach((e,i)=>e.classList.toggle("is-focused",i===this.group));const t=this.characters[this.charIdx];t&&this.el.style.setProperty("--sel-accent",t.color||"#3ec1ff"),this.startBtn.disabled=!this.characters.length||!this.tracks.length}_move(){var t;(t=this.events)==null||t.emit(rt.UI_MOVE,{screen:"select"})}_setGroup(t){t=(t+wo.length)%wo.length,t!==this.group&&(this.group=t,this._render(),this._scrollIntoView(this._groupEls[t]))}_setChar(t,e=!1){this.characters.length&&(t=(t+this.characters.length)%this.characters.length,t!==this.charIdx&&(this.charIdx=t,this._move(),this._render(),e||this._scrollIntoView(this.charCards[t])))}_setTrack(t,e=!1){this.tracks.length&&(t=(t+this.tracks.length)%this.tracks.length,t!==this.trackIdx&&(this.trackIdx=t,this._move(),this._render(),e||this._scrollIntoView(this.trackCards[t])))}_setDiff(t){t=(t+Xs.length)%Xs.length,t!==this.diffIdx&&(this.diffIdx=t,this._move(),this._render())}_setButton(t){this._setGroup(3),t!==this.btnIdx&&(this.btnIdx=t,this._move(),this._render())}_scrollIntoView(t){var e;try{(e=t==null?void 0:t.scrollIntoView)==null||e.call(t,{block:"nearest",inline:"nearest"})}catch{}}_choice(){var t,e;return{characterId:((t=this.characters[this.charIdx])==null?void 0:t.id)??null,trackId:((e=this.tracks[this.trackIdx])==null?void 0:e.id)??null,difficulty:Xs[this.diffIdx].id}}_confirm(){var i;if(!this.onConfirm||this.startBtn.disabled)return;const t=this._choice();Ex($h,t),(i=this.events)==null||i.emit(rt.UI_SELECT,{screen:"select",choice:t}),this.el.classList.add("is-confirmed");const e=this.onConfirm;this.onConfirm=null,e(t)}_back(){var e;if(!this.onBack)return;(e=this.events)==null||e.emit(rt.UI_BACK,{screen:"select"});const t=this.onBack;this.onBack=null,t()}_key(t){var n;if(!this.onConfirm&&!this.onBack)return;const e=t.code;let i=!0;switch(e){case"Escape":case"Backspace":this._back();break;case"Tab":this._setGroup(this.group+(t.shiftKey?-1:1)),this._move();break;case"Enter":case"Space":case"NumpadEnter":this.group===3?this.btnIdx===0?this._confirm():this._back():((n=this.events)==null||n.emit(rt.UI_SELECT,{screen:"select",step:wo[this.group]}),this._setGroup(this.group+1));break;case"ArrowLeft":case"KeyA":this._arrow(-1,0);break;case"ArrowRight":case"KeyD":this._arrow(1,0);break;case"ArrowUp":case"KeyW":this._arrow(0,-1);break;case"ArrowDown":case"KeyS":this._arrow(0,1);break;default:i=!1}i&&t.preventDefault()}_arrow(t,e){switch(this.group){case 0:{const i=this.characters.length;if(!i)return this._setGroup(this.group+(e||t));const n=Math.min(Kx,i);if(t)this._setChar(this.charIdx+t);else if(e){const r=this.charIdx+e*n;r<0||r>=i?(e>0?this._setGroup(1):this._setGroup(3),this._move()):this._setChar(r)}break}case 1:{const i=t||e,n=this.tracks.length;if(!n)return this._setGroup(this.group+i);const r=this.trackIdx+i;e&&(r<0||r>=n)?(this._setGroup(e>0?2:0),this._move()):this._setTrack(r);break}case 2:t?this._setDiff(this.diffIdx+t):e&&(this._setGroup(e>0?3:1),this._move());break;case 3:t?(this.btnIdx=t>0?0:1,this._move(),this._render()):e&&(this._setGroup(e>0?0:2),this._move());break}}show({onConfirm:t,onBack:e}){this.onConfirm=t,this.onBack=e,this.group=0,this.btnIdx=0,this.el.classList.remove("is-confirmed"),this._render(),this.el.classList.remove("is-animated"),requestAnimationFrame(()=>this.el.classList.add("is-animated")),this._bound||(window.addEventListener("keydown",this._onKey),this._bound=!0)}hide(){this.onConfirm=null,this.onBack=null,this._bound&&(window.removeEventListener("keydown",this._onKey),this._bound=!1)}dispose(){this.hide(),this.el.remove()}}const jh=["#ffcc33","#ff4757","#3ec1ff","#3ddc84","#c84bff","#ffffff","#ff9f1a"];class jx{constructor({events:t}){this.events=t,this.onRestart=null,this.onMenu=null,this.btnIdx=0,this.podium=G("div",{class:"res-podium"}),this.tableBody=G("tbody"),this.heading=G("h2",{class:"res-heading tkl-display",text:"RACE RESULTS"}),this.sub=G("p",{class:"res-sub"}),this.againBtn=G("button",{class:"tkl-btn tkl-btn-primary tkl-display",attrs:{type:"button",tabindex:"-1"},text:"RACE AGAIN",onClick:()=>this._restart(),onPointerenter:()=>this._cursor(0)}),this.menuBtn=G("button",{class:"tkl-btn tkl-btn-ghost",attrs:{type:"button",tabindex:"-1"},text:"Main Menu",onClick:()=>this._menu(),onPointerenter:()=>this._cursor(1)}),this.confetti=G("div",{class:"res-confetti",attrs:{"aria-hidden":"true"}}),this.el=G("div",{class:"tkl-screen tkl-results"},G("div",{class:"tkl-bg tkl-bg-stripes"}),G("div",{class:"tkl-bg tkl-bg-checker"}),this.confetti,G("div",{class:"res-scroll"},G("header",{class:"res-header"},this.heading,this.sub),G("div",{class:"res-columns"},this.podium,G("div",{class:"res-table-wrap tkl-panel"},G("table",{class:"res-table"},G("thead",{},G("tr",{},G("th",{text:"#"}),G("th",{text:""}),G("th",{text:"Racer"}),G("th",{text:"Time"}))),this.tableBody))),G("div",{class:"res-buttons"},this.menuBtn,this.againBtn))),this._onKey=e=>this._key(e),this._bound=!1}_cursor(t){var e;t!==this.btnIdx&&(this.btnIdx=t,(e=this.events)==null||e.emit(rt.UI_MOVE,{screen:"results"})),this.againBtn.classList.toggle("is-cursor",this.btnIdx===0),this.menuBtn.classList.toggle("is-cursor",this.btnIdx===1)}_restart(){var e;if(!this.onRestart)return;(e=this.events)==null||e.emit(rt.UI_SELECT,{screen:"results"});const t=this.onRestart;this.onRestart=null,this.onMenu=null,t()}_menu(){var e;if(!this.onMenu)return;(e=this.events)==null||e.emit(rt.UI_BACK,{screen:"results"});const t=this.onMenu;this.onRestart=null,this.onMenu=null,t()}_key(t){switch(t.code){case"Enter":case"NumpadEnter":case"Space":this.btnIdx===0?this._restart():this._menu();break;case"Escape":case"Backspace":this._menu();break;case"ArrowLeft":case"ArrowUp":case"KeyA":case"KeyW":this._cursor(1);break;case"ArrowRight":case"ArrowDown":case"KeyD":case"KeyS":this._cursor(0);break;default:return}t.preventDefault()}show({standings:t,onRestart:e,onMenu:i}){this.onRestart=e,this.onMenu=i;const n=(Array.isArray(t)?t:[]).slice().sort((h,f)=>(h.rank??99)-(f.rank??99)),r=n.find(h=>h.isPlayer),a=(r==null?void 0:r.rank)??0,o=na(a);this.sub.textContent=r?a===1?"Victory! You took the chequered flag in 1st place!":a<=3?`On the podium — you finished ${o.n}${o.suffix}!`:`You finished ${o.n}${o.suffix}. Better luck next race!`:"",this.el.classList.toggle("is-win",a===1),this.podium.textContent="",[n[1],n[0],n[2]].forEach((h,f)=>{if(!h)return;const u=f===1?1:f===0?2:3,m=h.color||"#3ec1ff",g=na(u);this.podium.append(G("div",{class:`res-place res-place-${u}`+(h.isPlayer?" is-player":""),style:{"--c":m,"--c-light":sa(m,.35),"--c-dark":xl(m,.35),"--i":f}},G("div",{class:"res-avatar"},G("span",{class:"tkl-display",text:(h.name||"?").charAt(0).toUpperCase()})),G("div",{class:"res-place-name tkl-display",text:h.name||"???"}),G("div",{class:"res-block"},G("span",{class:"res-block-rank tkl-display"},g.n,G("small",{text:g.suffix})))))}),this.tableBody.textContent="",n.forEach((h,f)=>{const u=na(h.rank??f+1);this.tableBody.append(G("tr",{class:"res-row"+(h.isPlayer?" is-player":""),style:{"--i":f}},G("td",{class:"res-rank tkl-display"},`${u.n}`,G("small",{text:u.suffix})),G("td",{class:"res-swatch-cell"},G("span",{class:"res-swatch",style:{"--c":h.color||"#9aa3b5"}})),G("td",{class:"res-name"},G("strong",{text:h.name||"???"}),h.isPlayer?G("span",{class:"res-you",text:"YOU"}):null,G("span",{class:"res-title",text:h.title||""})),G("td",{class:"res-time",text:ra(h.time)})))}),this.confetti.textContent="";const c=a===1?70:40;for(let h=0;h<c;h++)this.confetti.append(G("i",{style:{"--x":(Math.random()*100).toFixed(1)+"vw","--d":(2.6+Math.random()*2.4).toFixed(2)+"s","--delay":(-Math.random()*5).toFixed(2)+"s","--r":(Math.random()*360).toFixed(0)+"deg","--s":(.6+Math.random()*.8).toFixed(2),"--col":jh[h%jh.length]}}));this.btnIdx=0,this._cursor(0),this._bound||(window.addEventListener("keydown",this._onKey),this._bound=!0)}hide(){this.onRestart=null,this.onMenu=null,this._bound&&(window.removeEventListener("keydown",this._onKey),this._bound=!1)}dispose(){this.hide(),this.el.remove()}}class Zx{constructor({events:t}){this.events=t,this.cb=null,this.idx=0,this.items=[{id:"resume",label:"Resume",cls:"tkl-btn-primary tkl-display"},{id:"restart",label:"Restart Race",cls:"tkl-btn-ghost"},{id:"menu",label:"Main Menu",cls:"tkl-btn-ghost"}],this.buttons=this.items.map((e,i)=>G("button",{class:`tkl-btn ${e.cls} pause-btn`,attrs:{type:"button",tabindex:"-1"},text:e.label,onClick:()=>this._activate(i),onPointerenter:()=>this._cursor(i)})),this.el=G("div",{class:"tkl-overlay tkl-pause"},G("div",{class:"pause-panel tkl-panel"},G("h2",{class:"pause-heading tkl-display",text:"PAUSED"}),G("p",{class:"pause-hint",text:"Take a breather. The race is frozen."}),G("div",{class:"pause-buttons"},...this.buttons))),this._onKey=e=>this._key(e),this._bound=!1,this.visible=!1}_cursor(t){var e;t=(t+this.items.length)%this.items.length,t!==this.idx&&((e=this.events)==null||e.emit(rt.UI_MOVE,{screen:"pause"})),this.idx=t,this.buttons.forEach((i,n)=>i.classList.toggle("is-cursor",n===t))}_activate(t){var n,r,a,o;if(!this.cb||!this.visible)return;const e=this.items[t].id;(n=this.events)==null||n.emit(e==="resume"?rt.UI_BACK:rt.UI_SELECT,{screen:"pause",action:e});const i=this.cb;e==="resume"?(r=i.onResume)==null||r.call(i):e==="restart"?(a=i.onRestart)==null||a.call(i):(o=i.onMenu)==null||o.call(i)}_key(t){if(this.visible){switch(t.code){case"ArrowUp":case"KeyW":this._cursor(this.idx-1);break;case"ArrowDown":case"KeyS":this._cursor(this.idx+1);break;case"Enter":case"NumpadEnter":case"Space":this._activate(this.idx);break;case"Escape":this._activate(0);break;default:return}t.preventDefault()}}show(t){this.cb=t||{},this.visible=!0,this.idx=0,this._cursor(0),this._bound||(window.addEventListener("keydown",this._onKey),this._bound=!0)}hide(){this.visible=!1,this.cb=null,this._bound&&(window.removeEventListener("keydown",this._onKey),this._bound=!1)}dispose(){this.hide(),this.el.remove()}}const Jx=380,Zh=800,Qx=1600;class t1{constructor({root:t,characters:e=[],tracks:i=[],events:n}={}){this.root=t||document.getElementById("ui")||document.body,this.events=n,this.characters=Array.isArray(e)?e:[],this.tracks=Array.isArray(i)?i:[],this.muted=!1,this._timers=new Set,this._current=null,this._disposed=!1,this.isTouch=Vx(),this.el=G("div",{class:"tkl"+(this.isTouch?" is-touch":"")}),this.root.appendChild(this.el),this.title=new qx({events:n}),this.select=new $x({characters:this.characters,tracks:this.tracks,events:n}),this.results=new jx({events:n}),this._screens={title:this.title,select:this.select,results:this.results},this.hud=new Hx({onPause:()=>window.dispatchEvent(new KeyboardEvent("keydown",{code:"Escape",key:"Escape",bubbles:!0}))}),this.pause=new Zx({events:n}),this.loading=G("div",{class:"tkl-overlay tkl-loading"},G("div",{class:"loading-tyre"},G("i"),G("i"),G("i"),G("i")),this.loadingText=G("div",{class:"loading-text tkl-display",text:"Loading…"})),this.countdown=G("div",{class:"tkl-countdown tkl-display",attrs:{"aria-live":"assertive"}},this.countdownText=G("span",{class:"countdown-text"}),G("span",{class:"countdown-ring"})),this.flashEl=G("div",{class:"tkl-flash tkl-display",attrs:{"aria-live":"polite"}},this.flashText=G("span")),this.muteBtn=G("button",{class:"tkl-iconbtn tkl-mute",attrs:{type:"button","aria-label":"Toggle sound",title:"Sound (M)"},html:gn("speaker"),onClick:r=>{var a;r.stopPropagation(),(a=this.events)==null||a.emit(rt.UI_MUTE_TOGGLE,{})}}),this.muteBtn.addEventListener("pointerdown",r=>r.stopPropagation()),this.touch=this.isTouch?new Wx:null,this.el.append(this.title.el,this.select.el,this.results.el,this.hud.el),this.touch&&this.el.append(this.touch.el),this.el.append(this.countdown,this.flashEl,this.pause.el,this.loading,this.muteBtn),this._onKey=r=>{r.code==="F3"&&(r.preventDefault(),this.hud.toggleFps())},window.addEventListener("keydown",this._onKey)}_present(t,e){const i=this._current;i&&i!==t&&this._dismiss(i),this._current=t;const n=this._screens[t],r=n.el;this._clearTimer(r),r.classList.remove("is-out"),r.classList.add("is-in"),n.show(e)}_dismiss(t){const e=this._screens[t];if(!e)return;e.hide();const i=e.el;i.classList.contains("is-in")&&(i.classList.remove("is-in"),i.classList.add("is-out"),this._after(Jx,()=>i.classList.remove("is-out"),i)),this._current===t&&(this._current=null)}_after(t,e,i){i&&this._clearTimer(i);const n=setTimeout(()=>{var r;this._timers.delete(n),i&&((r=this._keyed)==null||r.delete(i)),this._disposed||e()},t);return this._timers.add(n),i&&(this._keyed=this._keyed||new Map,this._keyed.set(i,n)),n}_clearTimer(t){var i;const e=(i=this._keyed)==null?void 0:i.get(t);e!=null&&(clearTimeout(e),this._timers.delete(e),this._keyed.delete(t))}showTitle({onStart:t}={}){this.hideHUD(),this.hidePause(),this._present("title",{onStart:()=>t==null?void 0:t()})}showSelect({onConfirm:t,onBack:e}={}){this.hideHUD(),this.hidePause(),this._present("select",{onConfirm:i=>t==null?void 0:t(i),onBack:()=>e==null?void 0:e()})}showLoading(t="Loading…"){this.loadingText.textContent=t,this.loading.classList.add("is-visible")}hideLoading(){this.loading.classList.remove("is-visible")}showHUD(){var t;this._current&&this._dismiss(this._current),this.hud.show(),(t=this.touch)==null||t.show(),this.el.classList.add("is-racing")}hideHUD(){var t;this.hud.hide(),(t=this.touch)==null||t.hide(),this.el.classList.remove("is-racing")}updateHUD(t){this.hud.update(t)}showCountdown(t){const e=typeof t=="string",i=this.countdown;this.countdownText.textContent=e?"GO!":String(t),i.classList.remove("is-visible","is-go","is-num"),i.offsetWidth,i.classList.add("is-visible",e?"is-go":"is-num"),this._after(e?Zh+150:Zh,()=>i.classList.remove("is-visible","is-go","is-num"),i)}flash(t,{style:e="info"}={}){const i=this.flashEl;this.flashText.textContent=t,i.className="tkl-flash tkl-display",i.offsetWidth,i.classList.add("is-visible",`style-${e}`),this._after(Qx,()=>i.classList.remove("is-visible"),i)}showResults({standings:t=[],onRestart:e,onMenu:i}={}){this.hideHUD(),this.hidePause(),this._present("results",{standings:t,onRestart:()=>e==null?void 0:e(),onMenu:()=>i==null?void 0:i()})}showPause(t={}){this.pause.show(t),this.pause.el.classList.add("is-visible"),this.el.classList.add("is-paused")}hidePause(){this.pause.hide(),this.pause.el.classList.remove("is-visible"),this.el.classList.remove("is-paused")}getTouchControls(){return this.touch?this.touch.controls:null}setMuted(t){this.muted=!!t,this.muteBtn.innerHTML=gn(this.muted?"speakerOff":"speaker"),this.muteBtn.classList.toggle("is-muted",this.muted),this.muteBtn.setAttribute("aria-pressed",String(this.muted))}dispose(){var t,e;this._disposed=!0;for(const i of this._timers)clearTimeout(i);this._timers.clear(),(t=this._keyed)==null||t.clear(),window.removeEventListener("keydown",this._onKey),this.title.dispose(),this.select.dispose(),this.results.dispose(),this.pause.dispose(),this.hud.dispose(),(e=this.touch)==null||e.dispose(),this.el.remove()}}const gi=s=>440*Math.pow(2,(s-69)/12),e1={c:0,d:2,e:4,f:5,g:7,a:9,b:11};function i1(s){const t=/^([a-g])([#b]?)(-?\d)$/.exec(s.toLowerCase());if(!t)throw new Error(`bad note ${s}`);let e=e1[t[1]];return t[2]==="#"?e+=1:t[2]==="b"&&(e-=1),12*(parseInt(t[3],10)+1)+e}function Sa(s){return s.trim().split(/\s+/).map(t=>t==="."?null:/^\d+$/.test(t)?parseInt(t,10):i1(t))}const Jh=new WeakMap;function ma(s){let t=Jh.get(s);if(t)return t;const e=Math.floor(s.sampleRate*2);t=s.createBuffer(1,e,s.sampleRate);const i=t.getChannelData(0);for(let n=0;n<e;n++)i[n]=Math.random()*2-1;return Jh.set(s,t),t}const vs=2e-4;function su(s,t,e,i,n){return s.cancelScheduledValues(t),s.setValueAtTime(vs,t),s.linearRampToValueAtTime(Math.max(e,vs),t+i),s.exponentialRampToValueAtTime(vs,t+i+n),t+i+n}function ru(s,t,e,i,n,r){return s.cancelScheduledValues(t),s.setValueAtTime(vs,t),s.linearRampToValueAtTime(Math.max(e,vs),t+i),s.setValueAtTime(Math.max(e,vs),t+i+n),s.linearRampToValueAtTime(0,t+i+n+r),t+i+n+r}function au(s,t,e,i){const n=s.createBiquadFilter();return n.type=t.type||"lowpass",n.Q.value=t.Q??1,n.frequency.setValueAtTime(t.freq,e),t.freqEnd!=null&&n.frequency.exponentialRampToValueAtTime(Math.max(20,t.freqEnd),i),n}function kt(s,t,e){const i=e.t??s.currentTime,n=e.dur??.2,r=e.a??.005,a=e.r??.05,o=s.createOscillator();o.type=e.type||"sine",o.frequency.setValueAtTime(Math.max(1,e.freq),i),e.freqEnd!=null&&o.frequency.exponentialRampToValueAtTime(Math.max(1,e.freqEnd),i+(e.sweepDur??n)),e.detune&&(o.detune.value=e.detune);const l=s.createGain();let c;e.pluck?c=su(l.gain,i,e.gain??.3,r,n):c=ru(l.gain,i,e.gain??.3,r,Math.max(0,n-r),a);let h=o;if(e.filter){const f=au(s,e.filter,i,c);h.connect(f),h=f}return h.connect(l),l.connect(t),o.start(i),o.stop(c+.02),o.onended=()=>{o.disconnect(),l.disconnect()},{osc:o,gain:l,end:c}}function Ae(s,t,e){const i=e.t??s.currentTime,n=e.dur??.2,r=e.a??.003,a=e.r??.05,o=s.createBufferSource();o.buffer=ma(s),o.loop=!0,e.rate&&(o.playbackRate.value=e.rate);const l=s.createGain();let c;e.pluck!==!1?c=su(l.gain,i,e.gain??.3,r,n):c=ru(l.gain,i,e.gain??.3,r,Math.max(0,n-r),a);let h=o;if(e.filter){const f=au(s,e.filter,i,c);h.connect(f),h=f}return h.connect(l),l.connect(t),o.start(i,Math.random()*1.5),o.stop(c+.02),o.onended=()=>{o.disconnect(),l.disconnect()},{src:o,gain:l,end:c}}function n1(s,t,e=1,i=0){const n=s.createGain();if(n.gain.value=e,typeof s.createStereoPanner=="function"&&i!==0){const r=s.createStereoPanner();r.pan.value=Math.max(-1,Math.min(1,i)),n.connect(r),r.connect(t)}else n.connect(t);return n}function s1(s,t,e){const i=Math.max(0,(e-s.currentTime)*1e3+50);setTimeout(()=>{try{t.disconnect()}catch{}},i)}const Wr=(s,t,e,i,n,r,a="sine",o=.25)=>{let l=e.t;return i.forEach((c,h)=>{const f=e.t+h*n,u=gi(c)*e.p;l=kt(s,t,{type:a,freq:u,t:f,dur:r,gain:o*e.v,pluck:!0}).end,kt(s,t,{type:"triangle",freq:u*2,t:f,dur:r*.6,gain:o*.35*e.v,pluck:!0})}),l},ou={hop(s,t,e){return kt(s,t,{type:"sine",freq:320*e.p,freqEnd:720*e.p,t:e.t,dur:.11,gain:.35*e.v,pluck:!0}),kt(s,t,{type:"triangle",freq:640*e.p,freqEnd:1400*e.p,t:e.t,dur:.08,gain:.12*e.v,pluck:!0}).end},land(s,t,e){return Ae(s,t,{t:e.t,dur:.14,gain:.45*e.v,filter:{type:"lowpass",freq:500*e.p,freqEnd:120}}),kt(s,t,{type:"sine",freq:95*e.p,freqEnd:45,t:e.t,dur:.13,gain:.5*e.v,pluck:!0}).end},drift(s,t,e){return Ae(s,t,{t:e.t,dur:.4,gain:.3*e.v,a:.03,filter:{type:"bandpass",freq:1300*e.p,Q:1.4}}).end},drift_level(s,t,e){const i=Math.max(1,Math.min(3,e.level??1)),n=520*Math.pow(1.35,i-1)*e.p;return kt(s,t,{type:"square",freq:n,t:e.t,dur:.05,gain:.16*e.v,pluck:!0}),kt(s,t,{type:"square",freq:n*1.5,t:e.t+.05,dur:.07,gain:.16*e.v,pluck:!0}),i>=2&&kt(s,t,{type:"square",freq:n*2,t:e.t+.1,dur:.09,gain:.14*e.v,pluck:!0}),kt(s,t,{type:"sine",freq:n*2*(i>=3?1.5:1),t:e.t+.1,dur:.16,gain:.12*e.v,pluck:!0}).end},boost(s,t,e){return Ae(s,t,{t:e.t,dur:.55,gain:.55*e.v,a:.04,filter:{type:"bandpass",freq:250*e.p,freqEnd:3500*e.p,Q:.9}}),kt(s,t,{type:"sawtooth",freq:90*e.p,freqEnd:700*e.p,t:e.t,dur:.5,gain:.22*e.v,a:.03,pluck:!0,filter:{type:"lowpass",freq:600,freqEnd:4e3,Q:2}}).end},item_pickup(s,t,e){return Wr(s,t,e,[72,76,79,84],.06,.35,"sine",.22)},roulette_tick(s,t,e){return Ae(s,t,{t:e.t,dur:.012,gain:.25*e.v,filter:{type:"highpass",freq:3e3}}),kt(s,t,{type:"square",freq:1900*e.p,t:e.t,dur:.02,gain:.12*e.v,pluck:!0}).end},item_use(s,t,e){return kt(s,t,{type:"sine",freq:520*e.p,freqEnd:140*e.p,t:e.t,dur:.1,gain:.45*e.v,pluck:!0}).end},shell_throw(s,t,e){return Ae(s,t,{t:e.t,dur:.28,gain:.4*e.v,a:.02,filter:{type:"bandpass",freq:700*e.p,freqEnd:2600*e.p,Q:1.2}}),kt(s,t,{type:"sawtooth",freq:180*e.p,freqEnd:520*e.p,t:e.t,dur:.22,gain:.1*e.v,pluck:!0,filter:{type:"lowpass",freq:1200}}).end},shell_bounce(s,t,e){return kt(s,t,{type:"sine",freq:820*e.p,freqEnd:560*e.p,t:e.t,dur:.07,gain:.4*e.v,pluck:!0}),kt(s,t,{type:"triangle",freq:1250*e.p,t:e.t,dur:.035,gain:.2*e.v,pluck:!0}).end},shell_hit(s,t,e){return Ae(s,t,{t:e.t,dur:.22,gain:.6*e.v,filter:{type:"lowpass",freq:1800*e.p,freqEnd:250}}),Ae(s,t,{t:e.t,dur:.05,gain:.5*e.v,filter:{type:"highpass",freq:2500}}),kt(s,t,{type:"square",freq:130*e.p,freqEnd:55,t:e.t,dur:.18,gain:.35*e.v,pluck:!0,filter:{type:"lowpass",freq:900}}).end},banana_slip(s,t,e){return kt(s,t,{type:"triangle",freq:950*e.p,freqEnd:180*e.p,t:e.t,dur:.5,gain:.3*e.v,a:.02,r:.08}),kt(s,t,{type:"square",freq:960*e.p,freqEnd:182*e.p,t:e.t,dur:.5,gain:.07*e.v,a:.02,r:.08,filter:{type:"lowpass",freq:1800,freqEnd:400}}),Ae(s,t,{t:e.t,dur:.25,gain:.18*e.v,filter:{type:"bandpass",freq:900,freqEnd:300,Q:1.5}}).end},explosion(s,t,e){return Ae(s,t,{t:e.t,dur:1.1,gain:.9*e.v,a:.005,filter:{type:"lowpass",freq:2400*e.p,freqEnd:70}}),Ae(s,t,{t:e.t,dur:.08,gain:.6*e.v,filter:{type:"highpass",freq:1500}}),kt(s,t,{type:"sine",freq:70*e.p,freqEnd:28,t:e.t,dur:.7,gain:.85*e.v,pluck:!0}).end},star(s,t,e){return Wr(s,t,e,[84,88,91,96,100,103],.045,.4,"sine",.2)},lightning(s,t,e){return Ae(s,t,{t:e.t,dur:.09,gain:.85*e.v,filter:{type:"highpass",freq:2500}}),kt(s,t,{type:"sawtooth",freq:3200*e.p,freqEnd:400,t:e.t,dur:.12,gain:.2*e.v,pluck:!0}),Ae(s,t,{t:e.t+.12,dur:1.5,gain:.55*e.v,a:.06,filter:{type:"lowpass",freq:320,freqEnd:60}}).end},hit_wall(s,t,e){return Ae(s,t,{t:e.t,dur:.16,gain:.45*e.v,filter:{type:"lowpass",freq:600*e.p,freqEnd:150}}),kt(s,t,{type:"sine",freq:110*e.p,freqEnd:50,t:e.t,dur:.14,gain:.45*e.v,pluck:!0}).end},bump(s,t,e){return Ae(s,t,{t:e.t,dur:.04,gain:.25*e.v,filter:{type:"lowpass",freq:1200}}),kt(s,t,{type:"sine",freq:220*e.p,freqEnd:110,t:e.t,dur:.09,gain:.35*e.v,pluck:!0}).end},countdown(s,t,e){return kt(s,t,{type:"square",freq:880*e.p,t:e.t,dur:.16,gain:.16*e.v,a:.004,r:.04}),kt(s,t,{type:"sine",freq:880*e.p,t:e.t,dur:.16,gain:.28*e.v,a:.004,r:.06}).end},go(s,t,e){return kt(s,t,{type:"square",freq:1320*e.p,t:e.t,dur:.55,gain:.16*e.v,a:.004,r:.12}),kt(s,t,{type:"sine",freq:1320*e.p,t:e.t,dur:.55,gain:.3*e.v,a:.004,r:.15}),kt(s,t,{type:"triangle",freq:660*e.p,t:e.t,dur:.55,gain:.18*e.v,a:.004,r:.15}).end},lap(s,t,e){return Wr(s,t,e,[76,81],.13,.45,"sine",.28)},final_lap(s,t,e){let i=e.t;const n=[[76,0,.13],[76,.16,.13],[81,.32,.6]];for(const[r,a,o]of n){const l=gi(r)*e.p;kt(s,t,{type:"square",freq:l,t:e.t+a,dur:o,gain:.14*e.v,a:.005,r:.08,filter:{type:"lowpass",freq:3e3}}),kt(s,t,{type:"sawtooth",freq:l/2,t:e.t+a,dur:o,gain:.1*e.v,a:.005,r:.08,filter:{type:"lowpass",freq:1400}}),i=kt(s,t,{type:"sine",freq:l,t:e.t+a,dur:o,gain:.22*e.v,a:.005,r:.1}).end}return i},finish_win(s,t,e){const i=[[72,0,.14],[76,.14,.14],[79,.28,.14],[84,.42,.75]];let n=e.t;for(const[r,a,o]of i){const l=gi(r)*e.p;kt(s,t,{type:"square",freq:l,t:e.t+a,dur:o,gain:.13*e.v,a:.005,r:.12,filter:{type:"lowpass",freq:3500}}),n=kt(s,t,{type:"sine",freq:l,t:e.t+a,dur:o,gain:.25*e.v,a:.005,r:.15}).end}for(const r of[60,64,67])kt(s,t,{type:"triangle",freq:gi(r)*e.p,t:e.t+.42,dur:.8,gain:.1*e.v,a:.03,r:.3});return n},finish_lose(s,t,e){let i=e.t;return[76,74,72,71].forEach((n,r)=>{i=kt(s,t,{type:"triangle",freq:gi(n)*e.p,t:e.t+r*.24,dur:.5,gain:.22*e.v,a:.02,pluck:!0}).end}),i},menu_move(s,t,e){return kt(s,t,{type:"square",freq:1150*e.p,t:e.t,dur:.035,gain:.14*e.v,pluck:!0}).end},menu_select(s,t,e){return Wr(s,t,e,[84,91],.08,.32,"sine",.24)},menu_back(s,t,e){return kt(s,t,{type:"triangle",freq:520*e.p,freqEnd:330*e.p,t:e.t,dur:.13,gain:.25*e.v,pluck:!0}).end},respawn(s,t,e){return Ae(s,t,{t:e.t,dur:.32,gain:.35*e.v,a:.01,filter:{type:"bandpass",freq:600*e.p,freqEnd:140,Q:.8}}),kt(s,t,{type:"sine",freq:340*e.p,freqEnd:90,t:e.t,dur:.3,gain:.25*e.v,pluck:!0}).end},offroad(s,t,e){return Ae(s,t,{t:e.t,dur:.32,gain:.4*e.v,a:.02,filter:{type:"lowpass",freq:200*e.p,Q:.7}}).end}};Object.freeze(Object.keys(ou));const To=3,Qh=55,r1=330;function a1(s){const t=Math.max(0,Math.min(1,s));if(t>=.999)return 1;const e=t*To,i=Math.min(To-1,Math.floor(e)),n=e-i,r=.2*i,a=.45;return(r+n*a)/(.2*(To-1)+a)}class o1{constructor(t,e){this.ctx=t;const i=t.currentTime;this.saw=t.createOscillator(),this.saw.type="sawtooth",this.square=t.createOscillator(),this.square.type="square",this.square.detune.value=9,this.sub=t.createOscillator(),this.sub.type="sine",this.sawGain=t.createGain(),this.sawGain.gain.value=.5,this.squareGain=t.createGain(),this.squareGain.gain.value=.3,this.subGain=t.createGain(),this.subGain.gain.value=.35,this.filter=t.createBiquadFilter(),this.filter.type="lowpass",this.filter.Q.value=2.5,this.filter.frequency.value=400,this.noise=t.createBufferSource(),this.noise.buffer=ma(t),this.noise.loop=!0,this.noiseFilter=t.createBiquadFilter(),this.noiseFilter.type="bandpass",this.noiseFilter.Q.value=.8,this.noiseFilter.frequency.value=200,this.noiseGain=t.createGain(),this.noiseGain.gain.value=.12,this.gain=t.createGain(),this.gain.gain.value=0,this.panner=typeof t.createStereoPanner=="function"?t.createStereoPanner():null,this.saw.connect(this.sawGain).connect(this.filter),this.square.connect(this.squareGain).connect(this.filter),this.sub.connect(this.subGain).connect(this.filter),this.noise.connect(this.noiseFilter).connect(this.noiseGain).connect(this.filter),this.filter.connect(this.gain),this.panner?this.gain.connect(this.panner).connect(e):this.gain.connect(e),this.saw.start(i),this.square.start(i),this.sub.start(i),this.noise.start(i,Math.random()),this.sleeping=!0,this.set({rpm:0,throttle:0,gain:0,pan:0})}set(t){const i=this.ctx.currentTime,n=Math.max(0,Math.min(1,t.rpm??0)),r=Math.max(0,Math.min(1,t.throttle??0)),a=Math.max(0,Math.min(1,t.gain??0));if(a<=.001){this.sleeping||(this.gain.gain.setTargetAtTime(0,i,.05),this.sleeping=!0);return}this.sleeping=!1;const o=a1(n),l=Qh+(r1-Qh)*o,c=.045;this.saw.frequency.setTargetAtTime(l,i,c),this.square.frequency.setTargetAtTime(l*.5,i,c),this.sub.frequency.setTargetAtTime(l*.5,i,c),this.filter.frequency.setTargetAtTime(280+r*1900+o*900,i,.06),this.noiseFilter.frequency.setTargetAtTime(140+n*700,i,.08),this.noiseGain.gain.setTargetAtTime(.08+r*.12,i,.08);const h=a*(.55+.45*Math.max(r,n*.6));this.gain.gain.setTargetAtTime(h,i,.06),this.panner&&this.panner.pan.setTargetAtTime(Math.max(-1,Math.min(1,t.pan??0)),i,.08)}dispose(){var t;for(const e of[this.saw,this.square,this.sub,this.noise])try{e.stop()}catch{}this.gain.disconnect(),(t=this.panner)==null||t.disconnect()}}const l1=.25,c1=50,h1={kick(s,t,e,i,n){kt(s,t,{type:"sine",freq:165,freqEnd:42,sweepDur:.09,t:e,dur:.27,gain:.95*n,pluck:!0}),Ae(s,t,{t:e,dur:.02,gain:.3*n,filter:{type:"lowpass",freq:3500}})},snare(s,t,e,i,n){Ae(s,t,{t:e,dur:.16,gain:.38*n,filter:{type:"bandpass",freq:1900,Q:.7}}),kt(s,t,{type:"triangle",freq:200,freqEnd:120,sweepDur:.05,t:e,dur:.1,gain:.3*n,pluck:!0})},hat(s,t,e,i,n){Ae(s,t,{t:e,dur:.045,gain:.16*n,filter:{type:"highpass",freq:7500}})},ohat(s,t,e,i,n){Ae(s,t,{t:e,dur:.17,gain:.13*n,filter:{type:"highpass",freq:6500}})},rim(s,t,e,i,n){kt(s,t,{type:"square",freq:1700,t:e,dur:.02,gain:.08*n,pluck:!0}),Ae(s,t,{t:e,dur:.03,gain:.12*n,filter:{type:"highpass",freq:4e3}})},bass(s,t,e,i,n,r){const a=gi(i);kt(s,t,{type:"sawtooth",freq:a,t:e,dur:r*.9,gain:.3*n,a:.004,pluck:!0,filter:{type:"lowpass",freq:900,freqEnd:260,Q:3}}),kt(s,t,{type:"square",freq:a,t:e,dur:r*.9,gain:.12*n,a:.004,pluck:!0,filter:{type:"lowpass",freq:500}}),kt(s,t,{type:"sine",freq:a*.5,t:e,dur:r*.9,gain:.18*n,a:.004,pluck:!0})},softbass(s,t,e,i,n,r){const a=gi(i);kt(s,t,{type:"triangle",freq:a,t:e,dur:r*.9,gain:.4*n,a:.01,r:.1,filter:{type:"lowpass",freq:700}}),kt(s,t,{type:"sine",freq:a*.5,t:e,dur:r*.9,gain:.15*n,a:.01,r:.1})},lead(s,t,e,i,n,r){const a=gi(i);kt(s,t,{type:"square",freq:a,t:e,dur:r*.85,gain:.11*n,a:.006,r:.05,filter:{type:"lowpass",freq:3800,Q:.8}}),kt(s,t,{type:"square",freq:a,detune:7,t:e,dur:r*.85,gain:.07*n,a:.006,r:.05,filter:{type:"lowpass",freq:3e3}}),kt(s,t,{type:"sine",freq:a,t:e,dur:r*.85,gain:.1*n,a:.006,r:.06})},softlead(s,t,e,i,n,r){const a=gi(i);kt(s,t,{type:"triangle",freq:a,t:e,dur:r*.9,gain:.26*n,a:.02,r:.12}),kt(s,t,{type:"sine",freq:a*2,t:e,dur:r*.9,gain:.05*n,a:.02,r:.12})},arp(s,t,e,i,n,r){const a=gi(i);kt(s,t,{type:"square",freq:a,t:e,dur:r*1.4,gain:.075*n,a:.003,pluck:!0,filter:{type:"lowpass",freq:4200,freqEnd:1400,Q:1.2}})},pad(s,t,e,i,n,r){const a=Array.isArray(i)?i:[i];for(const o of a){const l=gi(o);kt(s,t,{type:"triangle",freq:l,t:e,dur:r,gain:.075*n,a:.04,r:.18,filter:{type:"lowpass",freq:1800}}),kt(s,t,{type:"sawtooth",freq:l,detune:-5,t:e,dur:r,gain:.02*n,a:.05,r:.18,filter:{type:"lowpass",freq:900}})}},stab(s,t,e,i,n,r){const a=Array.isArray(i)?i:[i];for(const o of a)kt(s,t,{type:"square",freq:gi(o),t:e,dur:r*.8,gain:.05*n,a:.004,pluck:!0,filter:{type:"lowpass",freq:2600,freqEnd:700}})}};function ii(s){return s.replace(/\s+/g,"").split("").map(t=>t==="X"?1:t==="x"?.6:t==="o"?.35:null)}const f1=s=>new Array(s).fill(null);function Ki(s,t){const e=[];for(const i of s)e.push(...t(i));return e}function _n(s){const t=f1(16);for(const[e,i]of s)t[e]=i;return t}function Eo(s,t){return t?s.map(e=>e==null?null:Array.isArray(e)?e.map(i=>i+t):e+t):s}function u1(){const t=Ki([36,43,45,41],a=>_n([[0,a],[2,a+12],[4,a],[6,a+7],[8,a],[10,a+12],[12,a+7],[14,a+12]])),e=[[60,64,67],[59,62,67],[60,64,69],[60,65,69]],i=Ki(e,a=>_n([[0,a]])),n=Ki(e,a=>_n([[6,a],[14,a]])),r=Sa("e5 . g5 . a5 . g5 . e5 . . . d5 . c5 . d5 . . . g5 . d5 . b4 . . . d5 . e5 . c5 . e5 . a5 . e5 . c5 . . . a4 . c5 . d5 . . . c5 . a4 . f5 . . . e5 . d5 .");return{bpm:120,steps:64,parts:[{inst:"kick",drum:!0,pattern:ii("X.......X..x....")},{inst:"snare",drum:!0,pattern:ii("....X.......X...")},{inst:"hat",drum:!0,pattern:ii("X.x.X.x.X.x.X.x."),vel:.8},{inst:"ohat",drum:!0,pattern:ii("..............x."),vel:.7},{inst:"bass",pattern:t,vel:.9,len:2},{inst:"pad",pattern:i,vel:.7,len:14},{inst:"stab",pattern:n,vel:.8,len:1},{inst:"lead",pattern:r,vel:.85,len:2}]}}function tf({bpm:s=150,semis:t=0,extraHats:e=!1}={}){const i=[40,36,43,38],n=[40,36,45,35],r=T=>_n([[0,T],[2,T],[3,T+12],[4,T],[6,T],[7,T+12],[8,T],[10,T],[11,T+12],[12,T],[14,T+7],[15,T+12]]),a=[...Ki(i,r),...Ki(n,r)],o=[[64,67,71],[60,64,67],[67,71,74],[62,66,69]],l=[[64,67,71],[60,64,67],[64,69,72],[63,66,71]],c=[0,1,2,3,2,1,0,1,2,3,2,1,0,1,2,3],h=T=>{const E=[T[0],T[1],T[2],T[0]+12];return c.map(C=>E[C])},f=[...Ki(o,h),...Ki(l,h)],u=Sa("b4 . . . e5 . . . g5 . f#5 . e5 . . . g5 . . . e5 . . . c5 . d5 . e5 . . . d5 . . . g5 . . . b5 . a5 . g5 . . . a5 . . . f#5 . . . d5 . . . e5 . f#5 . e5 . . . g5 . f#5 . e5 . . . d5 . e5 . g5 . . . e5 . d5 . c5 . . . b4 . c5 . a4 . c5 . e5 . . . d5 . c5 . b4 . a4 . b4 . . . d#5 . . . f#5 . . . g5 . f#5 ."),m=ii("X.x.X.x.X.x.X.x."),g=ii("XxxxXxxxXxxxXxxx"),_=e?g:[...m,...m,...m,...m,...g,...g,...g,...g],p=ii("................"),d=ii("..X...X...X...X."),x=e?d:[...p,...p,...p,...p,...d,...d,...d,...d],M=ii("X...X...X...X.x."),b=ii("....X.......X..o"),P=[{inst:"kick",drum:!0,pattern:M},{inst:"snare",drum:!0,pattern:b},{inst:"hat",drum:!0,pattern:_,vel:.75},{inst:"ohat",drum:!0,pattern:x,vel:.6},{inst:"bass",pattern:Eo(a,t),vel:1,len:1},{inst:"arp",pattern:Eo(f,t),vel:.8,len:1},{inst:"lead",pattern:Eo(u,t),vel:.9,len:2}];return e&&P.push({inst:"rim",drum:!0,pattern:ii("..x...x...x...x."),vel:.8}),{bpm:s,steps:128,parts:P}}function d1(){const t=Ki([41,36,38,34],r=>_n([[0,r],[8,r+7],[14,r+12]])),i=Ki([[65,69,72],[64,67,72],[65,69,74],[65,70,74]],r=>_n([[0,r]])),n=Sa("a5 . . . c6 . . . a5 . g5 . f5 . . . g5 . . . . . e5 . c5 . . . . . . . f5 . . . a5 . . . d5 . . . . . e5 . f5 . . . . . d5 . c5 . . . . . . .");return{bpm:100,steps:64,parts:[{inst:"kick",drum:!0,pattern:ii("X.......X......."),vel:.55},{inst:"rim",drum:!0,pattern:ii("....X.......X..."),vel:.8},{inst:"hat",drum:!0,pattern:ii("x.x.x.x.x.x.x.x."),vel:.5},{inst:"softbass",pattern:t,vel:.8,len:6},{inst:"pad",pattern:i,vel:.9,len:15},{inst:"softlead",pattern:n,vel:.9,len:3}]}}function p1(){const s=Sa("c5 . e5 . g5 . e5 . f5 . a5 . c6 . a5 . g5 . b5 . d6 . b5 . c6 . e6 . g6 . e6 ."),t=[..._n([[0,48],[8,53]]),..._n([[0,55],[8,60]])];return{bpm:160,steps:32,parts:[{inst:"lead",pattern:s,vel:.9,len:2},{inst:"softbass",pattern:t,vel:.7,len:6},{inst:"hat",drum:!0,pattern:ii("X.x.X.x.X.x.X.x."),vel:.6}]}}const Ml={menu:()=>u1(),race:()=>tf(),final:()=>tf({bpm:172,semis:2,extraHats:!0}),results:()=>d1(),star:()=>p1()};class lu{constructor(t,e,i){this.ctx=t,this.song=i,this.stepDur=60/i.bpm/4,this.out=t.createGain(),this.out.gain.value=0,this.out.connect(e),this.step=0,this.nextTime=0,this.running=!1,this._timer=0,this._tick=()=>this.tick()}start(t=.6){const e=this.ctx.currentTime;this.nextTime=e+.05,this.step=0,this.running=!0,this.out.gain.cancelScheduledValues(e),this.out.gain.setValueAtTime(0,e),this.out.gain.linearRampToValueAtTime(1,e+t),this._timer=setInterval(this._tick,c1),this.tick()}stop(t=.6){const e=this.ctx.currentTime;this.running=!1,clearInterval(this._timer),this._timer=0,this.out.gain.cancelScheduledValues(e),this.out.gain.setValueAtTime(this.out.gain.value,e),this.out.gain.linearRampToValueAtTime(0,e+t);const i=this.out;setTimeout(()=>{try{i.disconnect()}catch{}},t*1e3+120)}tick(){if(!this.running)return;const t=this.ctx,e=t.currentTime+l1;if(this.nextTime<t.currentTime-.5){const n=Math.ceil((t.currentTime-this.nextTime)/this.stepDur);this.step=(this.step+n)%this.song.steps,this.nextTime+=n*this.stepDur}let i=0;for(;this.nextTime<e&&i++<64;)this.scheduleStep(this.step,this.nextTime),this.nextTime+=this.stepDur,this.step=(this.step+1)%this.song.steps}scheduleStep(t,e){const{parts:i}=this.song;for(const n of i){const r=n.pattern,a=r[t%r.length];if(a==null)continue;const o=h1[n.inst];if(!o)continue;const l=(n.vel??1)*(n.gain??1);n.drum?o(this.ctx,this.out,e,null,a*l,this.stepDur):o(this.ctx,this.out,e,a,l,(n.len??1)*this.stepDur)}}}class m1{constructor(t,e){this.ctx=t,this.dest=e,this.current=null,this.name=null}set(t,e=.6){if(t===this.name||(this.current&&(this.current.stop(e),this.current=null),this.name=t,!t))return;const i=Ml[t];i&&(this.current=new lu(this.ctx,this.dest,i()),this.current.start(e))}tick(){var t;(t=this.current)==null||t.tick()}dispose(){this.set(null,.05)}}const Ao={music:.5,sfx:.8,engines:.35},g1={bump:.08,hit_wall:.08,shell_bounce:.08,drift_level:.05,roulette_tick:.03,explosion:.15,shell_hit:.06,banana_slip:.1,lightning:.5,star:.2,offroad:.4},_1=.3;class v1{constructor({events:t}={}){this.events=t,this.ctx=null,this.master=null,this.compressor=null,this.buses=null,this.music=null,this.engines=new Map,this._muted=!1,this._pendingMusic=null,this._musicName=null,this._duck=1,this._lastPlayed=new Map,this._drift=null,this._starLoop=null,this._offs=[],this._wire()}get muted(){return this._muted}get unlocked(){return!!this.ctx&&this.ctx.state==="running"}unlock(){try{if(!this.ctx){const t=typeof window<"u"?window.AudioContext||window.webkitAudioContext:null;if(!t)return;this.ctx=new t({latencyHint:"interactive"}),this._buildGraph()}if(this.ctx.state==="suspended"){const t=this.ctx.resume();t&&t.catch&&t.catch(()=>{})}if(this._pendingMusic!==void 0&&this._pendingMusic!==null){const t=this._pendingMusic;this._pendingMusic=null,this.music.set(t),this._musicName=t}ma(this.ctx)}catch(t){console.warn("[audio] unlock failed",t)}}_buildGraph(){const t=this.ctx;this.master=t.createGain(),this.master.gain.value=this._muted?0:1,this.compressor=t.createDynamicsCompressor(),this.compressor.threshold.value=-14,this.compressor.knee.value=18,this.compressor.ratio.value=4,this.compressor.attack.value=.004,this.compressor.release.value=.18,this.master.connect(this.compressor).connect(t.destination),this.buses={};for(const e of Object.keys(Ao)){const i=t.createGain();i.gain.value=Ao[e],i.connect(this.master),this.buses[e]=i}this.music=new m1(t,this.buses.music)}setMusic(t){if(t!=null&&!Ml[t]&&(t=null),this._musicName=t,!this.music){this._pendingMusic=t;return}try{this.music.set(t)}catch(e){console.warn("[audio] setMusic failed",e)}}setEngine(t,e){if(!this.ctx)return;let i=this.engines.get(t);if(!i){if(!e||(e.gain??0)<=.001)return;try{i=new o1(this.ctx,this.buses.engines)}catch(n){console.warn("[audio] engine voice failed",n);return}this.engines.set(t,i)}i.set(e||{})}play(t,e={}){if(!this.ctx)return;const i=ou[t];if(!i)return;const n=this.ctx,r=n.currentTime,a=g1[t];if(a){const o=this._lastPlayed.get(t)??-1;if(r-o<a)return;this._lastPlayed.set(t,r)}try{const o=e.gain??1,l=n1(n,this.buses.sfx,1,e.pan??0),c=i(n,l,{t:r+.003,p:e.pitch??1,v:o,level:e.level});s1(n,l,(typeof c=="number"?c:r+2)+.1)}catch(o){console.warn(`[audio] sfx "${t}" failed`,o)}}startDrift(t=0){if(!this.ctx)return;if(this._drift){this.setDriftLevel(t);return}const e=this.ctx,i=e.createBufferSource();i.buffer=ma(e),i.loop=!0;const n=e.createBiquadFilter();n.type="bandpass",n.Q.value=1.6,n.frequency.value=1100;const r=e.createOscillator();r.type="sine",r.frequency.value=9;const a=e.createGain();a.gain.value=180,r.connect(a).connect(n.frequency);const o=e.createGain();o.gain.value=0,o.gain.setTargetAtTime(.32,e.currentTime,.05),i.connect(n).connect(o).connect(this.buses.sfx),i.start(),r.start(),this._drift={src:i,filter:n,g:o,lfo:r},this.setDriftLevel(t)}setDriftLevel(t){this._drift&&this._drift.filter.frequency.setTargetAtTime(1100+260*t,this.ctx.currentTime,.08)}stopDrift(){const t=this._drift;if(!t)return;this._drift=null;const i=this.ctx.currentTime;t.g.gain.cancelScheduledValues(i),t.g.gain.setTargetAtTime(0,i,.06),t.src.stop(i+.35),t.lfo.stop(i+.35),t.src.onended=()=>{t.g.disconnect(),t.lfo.disconnect()}}startStarLoop(){if(!(!this.ctx||this._starLoop))try{this._starLoop=new lu(this.ctx,this.buses.sfx,Ml.star()),this._starLoop.out.gain.value=0,this._starLoop.start(.2),this._starLoop.out.gain.cancelScheduledValues(this.ctx.currentTime),this._starLoop.out.gain.setValueAtTime(0,this.ctx.currentTime),this._starLoop.out.gain.linearRampToValueAtTime(.7,this.ctx.currentTime+.2),this._duckMusic()}catch(t){console.warn("[audio] star loop failed",t)}}stopStarLoop(){this._starLoop&&(this._starLoop.stop(.4),this._starLoop=null,this._duckMusic())}setMuted(t){this._muted=!!t,this.master&&this.master.gain.setTargetAtTime(this._muted?0:1,this.ctx.currentTime,.03)}_duckMusic(){if(!this.buses)return;const t=Ao.music*this._duck*(this._starLoop?.55:1);this.buses.music.gain.setTargetAtTime(t,this.ctx.currentTime,.12)}update(t){var e,i;this.ctx&&((e=this.music)==null||e.tick(),(i=this._starLoop)==null||i.tick())}_wire(){const t=this.events;if(!t||typeof t.on!="function")return;const e=(r,a)=>this._offs.push(t.on(r,a)),i=r=>!!(r&&r.kart&&r.kart.isPlayer),n=(r,a=1,o=.45)=>i(r)?a:o;e(rt.HOP,r=>{i(r)&&this.play("hop")}),e(rt.LAND,r=>{i(r)&&this.play("land")}),e(rt.DRIFT_START,r=>{i(r)&&this.startDrift(r.level??0)}),e(rt.DRIFT_LEVEL,r=>{i(r)&&(this.setDriftLevel(r.level??1),this.play("drift_level",{level:r.level??1}))}),e(rt.DRIFT_END,r=>{i(r)&&this.stopDrift()}),e(rt.BOOST,r=>{i(r)&&this.play("boost")}),e(rt.HIT,r=>{const a=n(r);switch(r==null?void 0:r.kind){case"banana":this.play("banana_slip",{gain:a});break;case"shell":this.play("shell_hit",{gain:a});break;case"explosion":this.play("explosion",{gain:a*.6});break;case"hazard":this.play("hit_wall",{gain:a});break}}),e(rt.WALL_HIT,r=>this.play("hit_wall",{gain:n(r,1,.3)})),e(rt.OFFROAD_ENTER,r=>{i(r)&&this.play("offroad")}),e(rt.KART_BUMP,r=>{const a=!!(r&&(r.a&&r.a.isPlayer||r.b&&r.b.isPlayer||i(r)));this.play("bump",{gain:a?1:.35})}),e(rt.COUNTDOWN,()=>this.play("countdown")),e(rt.RACE_START,()=>this.play("go")),e(rt.LAP,r=>{i(r)&&this.play(r.isFinal?"final_lap":"lap")}),e(rt.ITEM_PICKUP,r=>{i(r)&&this.play("item_pickup")}),e(rt.ITEM_ROULETTE_TICK,r=>{i(r)&&this.play("roulette_tick")}),e(rt.ITEM_USE,r=>{const a=n(r,1,.4);this.play("item_use",{gain:a});const o=ef(r);o&&/shell|bob_omb/.test(o)&&this.play("shell_throw",{gain:a})}),e(rt.ITEM_HIT,r=>{const a=n(r,1,.5),o=ef(r);o&&/banana/.test(o)?this.play("banana_slip",{gain:a}):o==="fake_box"?this.play("shell_hit",{gain:a,pitch:.8}):this.play("shell_hit",{gain:a})}),e(rt.SHELL_BOUNCE,()=>this.play("shell_bounce",{gain:.6})),e(rt.EXPLOSION,()=>this.play("explosion")),e(rt.STAR_START,r=>{this.play("star",{gain:n(r,1,.5)}),i(r)&&this.startStarLoop()}),e(rt.STAR_END,r=>{i(r)&&this.stopStarLoop()}),e(rt.LIGHTNING,()=>this.play("lightning")),e(rt.RESPAWN,r=>this.play("respawn",{gain:n(r,1,.3)})),e(rt.UI_MOVE,()=>this.play("menu_move")),e(rt.UI_SELECT,()=>this.play("menu_select")),e(rt.UI_BACK,()=>this.play("menu_back")),e(rt.PAUSE,r=>{this._duck=r&&r.paused?_1:1,this._duckMusic(),r&&r.paused&&this.stopDrift()}),e(rt.SCREEN,r=>{r&&r.name!=="race"&&(this.stopDrift(),this.stopStarLoop())}),e(rt.FINISH,r=>{i(r)&&this.stopDrift()})}dispose(){var t;for(const e of this._offs)e();this._offs=[],this.stopDrift(),this.stopStarLoop(),(t=this.music)==null||t.dispose();for(const e of this.engines.values())e.dispose();this.engines.clear(),this.ctx&&this.ctx.close&&this.ctx.close().catch(()=>{}),this.ctx=null}}function ef(s){const t=s==null?void 0:s.item;return t?typeof t=="string"?t:t.id??null:null}const x1=`
attribute vec3 iPos;
attribute vec2 iSize;
attribute vec3 iColor;
attribute float iAlpha;
attribute float iRot;
attribute vec3 iStretch;

varying vec2 vUv;
varying vec3 vColor;
varying float vAlpha;

#include <fog_pars_vertex>

void main() {
  vUv = uv;
  vColor = iColor;
  vAlpha = iAlpha;

  vec4 mvPosition = modelViewMatrix * vec4(iPos, 1.0);
  vec2 right;
  vec2 up;
  float w = iSize.x;
  if (dot(iStretch, iStretch) > 1e-8) {
    vec3 d = (modelViewMatrix * vec4(iStretch, 0.0)).xyz;
    float l2 = length(d.xy);
    float l3 = max(length(d), 1e-4);
    right = l2 > 1e-4 ? d.xy / l2 : vec2(1.0, 0.0);
    up = vec2(-right.y, right.x);
    // foreshorten streaks that point at the camera
    w *= max(0.15, l2 / l3);
  } else {
    float c = cos(iRot);
    float s = sin(iRot);
    right = vec2(c, s);
    up = vec2(-s, c);
  }
  mvPosition.xy += position.x * w * right + position.y * iSize.y * up;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,M1=`
uniform sampler2D map;
uniform float uHasMap;
uniform float uAdditive;

varying vec2 vUv;
varying vec3 vColor;
varying float vAlpha;

#include <fog_pars_fragment>

void main() {
  float a = vAlpha;
  if (uHasMap > 0.5) a *= texture2D(map, vUv).a;
  if (a < 0.004) discard;
  vec3 col = vColor;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float fogFactor = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      float fogFactor = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    if (uAdditive > 0.5) {
      col *= 1.0 - fogFactor;
    } else {
      col = mix(col, fogColor, fogFactor);
    }
  #endif
  gl_FragColor = vec4(col, a);
}
`,y1=`
attribute float alpha;
varying float vAlpha;
#include <fog_pars_vertex>
void main() {
  vAlpha = alpha;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,b1=`
uniform vec3 uColor;
varying float vAlpha;
#include <fog_pars_fragment>
void main() {
  if (vAlpha < 0.01) discard;
  vec3 col = uColor;
  float a = vAlpha;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float fogFactor = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      float fogFactor = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    a *= 1.0 - fogFactor;
  #endif
  gl_FragColor = vec4(col, a);
}
`,S1=`
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vLocal;
void main() {
  vLocal = position;
  vNormal = normalize(normalMatrix * normal);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vView = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`,w1=`
uniform float uTime;
uniform float uIntensity;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vLocal;

vec3 hsv(float h, float s, float v) {
  vec3 k = vec3(1.0, 2.0 / 3.0, 1.0 / 3.0);
  vec3 p = abs(fract(vec3(h) + k) * 6.0 - 3.0);
  return v * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), s);
}

void main() {
  float ndv = abs(dot(normalize(vNormal), normalize(vView)));
  float fres = pow(1.0 - ndv, 1.6);
  float hue = fract(uTime * 0.9 + vLocal.y * 0.35 + vLocal.x * 0.12);
  vec3 col = hsv(hue, 0.85, 1.0);
  float band = 0.5 + 0.5 * sin(vLocal.y * 14.0 - uTime * 9.0);
  float a = (fres * 0.85 + 0.12 + band * 0.08) * uIntensity;
  gl_FragColor = vec4(col * 1.6, a);
}
`,T1=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,E1=`
uniform sampler2D tDiffuse;
uniform float uSpeed;
uniform float uTime;
uniform vec2 uResolution;
uniform float uVignette;
uniform float uSaturation;
varying vec2 vUv;

void main() {
  vec2 center = vec2(0.5, 0.52);
  vec2 toC = vUv - center;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 toCa = vec2(toC.x * aspect, toC.y);
  float dist = length(toCa);
  float edge = smoothstep(0.15, 0.85, dist);

  // Radial speed blur: sample toward the centre, stronger at edges and with speed.
  float blurAmt = uSpeed * edge * 0.045;
  vec3 col = vec3(0.0);
  float total = 0.0;
  const int N = 8;
  for (int i = 0; i < N; i++) {
    float t = float(i) / float(N - 1);
    float wgt = 1.0 - t * 0.55;
    vec2 uv = vUv - toC * blurAmt * t;
    col += texture2D(tDiffuse, uv).rgb * wgt;
    total += wgt;
  }
  col /= total;

  // Light chromatic aberration at the edges, scaled by speed.
  float ca = (0.001 + uSpeed * 0.0045) * edge;
  if (ca > 0.0002) {
    vec2 dir = normalize(toC + 1e-5);
    float r = texture2D(tDiffuse, vUv + dir * ca).r;
    float b = texture2D(tDiffuse, vUv - dir * ca).b;
    col.r = mix(col.r, r, 0.6);
    col.b = mix(col.b, b, 0.6);
  }

  // Saturation lift.
  float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(luma), col, uSaturation);

  // Vignette: soft dark edges, slightly tighter at speed.
  float vig = 1.0 - smoothstep(0.45, 1.25 - uSpeed * 0.15, dist * 1.35) * uVignette;
  col *= vig;

  gl_FragColor = vec4(col, 1.0);
}
`,A1=typeof document<"u";function An(s,t){if(!A1)return null;const e=document.createElement("canvas");e.width=e.height=s;const i=e.getContext("2d");t(i,s);const n=new Fl(e);return n.colorSpace=Ri,n.minFilter=un,n.magFilter=vi,n.generateMipmaps=!0,n.needsUpdate=!0,n}const tr={_cache:new Map,get(s){if(this._cache.has(s))return this._cache.get(s);const t=this._make(s);return this._cache.set(s,t),t},_make(s){switch(s){case"soft":return An(64,(t,e)=>{const i=t.createRadialGradient(e/2,e/2,0,e/2,e/2,e/2);i.addColorStop(0,"rgba(255,255,255,1)"),i.addColorStop(.35,"rgba(255,255,255,0.85)"),i.addColorStop(.7,"rgba(255,255,255,0.25)"),i.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=i,t.fillRect(0,0,e,e)});case"smoke":return An(128,(t,e)=>{const i=t.createRadialGradient(e/2,e/2,0,e/2,e/2,e/2);i.addColorStop(0,"rgba(255,255,255,0.9)"),i.addColorStop(.5,"rgba(255,255,255,0.45)"),i.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=i,t.fillRect(0,0,e,e);for(let n=0;n<7;n++){const r=n/7*Math.PI*2,a=e*.22,o=e/2+Math.cos(r)*a,l=e/2+Math.sin(r)*a,c=t.createRadialGradient(o,l,0,o,l,e*.24);c.addColorStop(0,"rgba(255,255,255,0.35)"),c.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=c,t.fillRect(0,0,e,e)}});case"chunk":return An(32,(t,e)=>{t.fillStyle="#fff",t.roundRect?(t.beginPath(),t.roundRect(3,3,e-6,e-6,5),t.fill()):t.fillRect(3,3,e-6,e-6)});case"ring":return An(128,(t,e)=>{const i=t.createRadialGradient(e/2,e/2,0,e/2,e/2,e/2);i.addColorStop(.55,"rgba(255,255,255,0)"),i.addColorStop(.72,"rgba(255,255,255,0.9)"),i.addColorStop(.86,"rgba(255,255,255,0.9)"),i.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=i,t.fillRect(0,0,e,e)});case"star":return An(64,(t,e)=>{t.fillStyle="#fff",t.beginPath();const i=e/2,n=e/2;for(let r=0;r<10;r++){const a=r%2===0?e*.46:e*.2,o=-Math.PI/2+r*Math.PI/5,l=i+Math.cos(o)*a,c=n+Math.sin(o)*a;r===0?t.moveTo(l,c):t.lineTo(l,c)}t.closePath(),t.fill()});case"bolt":return An(128,(t,e)=>{t.clearRect(0,0,e,e),t.lineCap="round",t.lineJoin="round";const i=[];let n=e*.5;for(let a=0;a<=10;a++){const o=a/10*e;n+=(Math.random()-.5)*e*.28,n=Math.max(e*.15,Math.min(e*.85,n)),i.push([n,o])}const r=(a,o)=>{t.strokeStyle=o,t.lineWidth=a,t.beginPath(),t.moveTo(i[0][0],i[0][1]);for(let l=1;l<i.length;l++)t.lineTo(i[l][0],i[l][1]);t.stroke()};r(10,"rgba(255,255,255,0.25)"),r(5,"rgba(255,255,255,0.6)"),r(2,"rgba(255,255,255,1)")});case"streak":return An(64,(t,e)=>{const i=t.createLinearGradient(0,0,e,0);i.addColorStop(0,"rgba(255,255,255,0)"),i.addColorStop(.5,"rgba(255,255,255,1)"),i.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=i,t.fillRect(0,0,e,e);const n=t.createLinearGradient(0,0,0,e);n.addColorStop(0,"rgba(0,0,0,1)"),n.addColorStop(.5,"rgba(0,0,0,0)"),n.addColorStop(1,"rgba(0,0,0,1)"),t.globalCompositeOperation="destination-out",t.fillStyle=n,t.fillRect(0,0,e,e)});default:return null}},dispose(){for(const s of this._cache.values())s==null||s.dispose();this._cache.clear()}},nf=new Map,ds=new pt;function sf(s){let t=nf.get(s);return t||(ds.setHex(s),ds.convertSRGBToLinear(),t=new Float32Array([ds.r,ds.g,ds.b]),nf.set(s,t),t)}function rf(s){return typeof s=="number"?s:s&&s.isColor?s.getHex():typeof s=="string"?ds.set(s).getHex():16777215}const L={x:0,y:0,z:0,vx:0,vy:0,vz:0,life:1,size:.3,sizeEnd:-1,aspect:1,color:16777215,colorEnd:-1,brightness:1,alpha:1,rot:0,rotV:0,drag:0,gravity:0,stretch:0,fadeIn:0,tumble:0,reset(){return this.x=this.y=this.z=0,this.vx=this.vy=this.vz=0,this.life=1,this.size=.3,this.sizeEnd=-1,this.aspect=1,this.color=16777215,this.colorEnd=-1,this.brightness=1,this.alpha=1,this.rot=0,this.rotV=0,this.drag=0,this.gravity=0,this.stretch=0,this.fadeIn=0,this.tumble=0,this}},Qe=(s,t)=>s+Math.random()*(t-s),Yt=s=>(Math.random()-.5)*2*s;class Xr{constructor({capacity:t=2e3,texture:e="soft",additive:i=!0,renderOrder:n=10}){this.capacity=t,this.count=0,this.additive=i;const r=t;this.px=new Float32Array(r),this.py=new Float32Array(r),this.pz=new Float32Array(r),this.vx=new Float32Array(r),this.vy=new Float32Array(r),this.vz=new Float32Array(r),this.life=new Float32Array(r),this.maxLife=new Float32Array(r),this.size0=new Float32Array(r),this.size1=new Float32Array(r),this.aspect=new Float32Array(r),this.c0=new Float32Array(r*3),this.c1=new Float32Array(r*3),this.alpha0=new Float32Array(r),this.rot=new Float32Array(r),this.rotV=new Float32Array(r),this.drag=new Float32Array(r),this.grav=new Float32Array(r),this.stretch=new Float32Array(r),this.fadeIn=new Float32Array(r),this.tumble=new Uint8Array(r);const a=new be(1,1),o=new z_;o.index=a.index,o.setAttribute("position",a.getAttribute("position")),o.setAttribute("uv",a.getAttribute("uv"));const l=h=>{const f=new gl(new Float32Array(r*h),h);return f.setUsage(pl),f};this.aPos=l(3),this.aSize=l(2),this.aColor=l(3),this.aAlpha=l(1),this.aRot=l(1),this.aStretch=l(3),o.setAttribute("iPos",this.aPos),o.setAttribute("iSize",this.aSize),o.setAttribute("iColor",this.aColor),o.setAttribute("iAlpha",this.aAlpha),o.setAttribute("iRot",this.aRot),o.setAttribute("iStretch",this.aStretch),o.instanceCount=0,this.geometry=o,this._baseGeometry=a;const c=tr.get(e);this.material=new Ne({uniforms:Bn.merge([mt.fog,{map:{value:null},uHasMap:{value:0},uAdditive:{value:i?1:0}}]),vertexShader:x1,fragmentShader:M1,transparent:!0,depthWrite:!1,depthTest:!0,blending:i?_i:Fn,fog:!0,side:_e}),this.material.uniforms.map.value=c,this.material.uniforms.uHasMap.value=c?1:0,this.mesh=new ft(o,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=n,this.mesh.visible=!1,this.mesh.matrixAutoUpdate=!1,this.mesh.name=`ParticlePool(${e})`}emit(t=L){let e;if(this.count<this.capacity)e=this.count++;else{e=0;let a=1/0;for(let o=0;o<this.capacity;o+=7)this.life[o]<a&&(a=this.life[o],e=o)}this.px[e]=t.x,this.py[e]=t.y,this.pz[e]=t.z,this.vx[e]=t.vx,this.vy[e]=t.vy,this.vz[e]=t.vz,this.life[e]=this.maxLife[e]=Math.max(.016,t.life),this.size0[e]=t.size,this.size1[e]=t.sizeEnd<0?t.size:t.sizeEnd,this.aspect[e]=t.aspect;const i=sf(rf(t.color)),n=t.colorEnd<0?i:sf(rf(t.colorEnd)),r=t.brightness;return this.c0[e*3]=i[0]*r,this.c0[e*3+1]=i[1]*r,this.c0[e*3+2]=i[2]*r,this.c1[e*3]=n[0]*r,this.c1[e*3+1]=n[1]*r,this.c1[e*3+2]=n[2]*r,this.alpha0[e]=t.alpha,this.rot[e]=t.rot,this.rotV[e]=t.rotV,this.drag[e]=t.drag,this.grav[e]=t.gravity,this.stretch[e]=t.stretch,this.fadeIn[e]=t.fadeIn,this.tumble[e]=t.tumble?1:0,e}_kill(t){const e=--this.count;t!==e&&(this.px[t]=this.px[e],this.py[t]=this.py[e],this.pz[t]=this.pz[e],this.vx[t]=this.vx[e],this.vy[t]=this.vy[e],this.vz[t]=this.vz[e],this.life[t]=this.life[e],this.maxLife[t]=this.maxLife[e],this.size0[t]=this.size0[e],this.size1[t]=this.size1[e],this.aspect[t]=this.aspect[e],this.c0[t*3]=this.c0[e*3],this.c0[t*3+1]=this.c0[e*3+1],this.c0[t*3+2]=this.c0[e*3+2],this.c1[t*3]=this.c1[e*3],this.c1[t*3+1]=this.c1[e*3+1],this.c1[t*3+2]=this.c1[e*3+2],this.alpha0[t]=this.alpha0[e],this.rot[t]=this.rot[e],this.rotV[t]=this.rotV[e],this.drag[t]=this.drag[e],this.grav[t]=this.grav[e],this.stretch[t]=this.stretch[e],this.fadeIn[t]=this.fadeIn[e],this.tumble[t]=this.tumble[e])}update(t){let e=0;for(;e<this.count;){if((this.life[e]-=t)<=0){this._kill(e);continue}const n=this.drag[e];if(n>0){const r=Math.max(0,1-n*t);this.vx[e]*=r,this.vy[e]*=r,this.vz[e]*=r}this.vy[e]-=this.grav[e]*t,this.px[e]+=this.vx[e]*t,this.py[e]+=this.vy[e]*t,this.pz[e]+=this.vz[e]*t,this.rot[e]+=this.rotV[e]*t,e++}this._pack()}_pack(){const t=this.count;if(this.mesh.visible=t>0,this.geometry.instanceCount=t,t===0)return;const e=this.aPos.array,i=this.aSize.array,n=this.aColor.array,r=this.aAlpha.array,a=this.aRot.array,o=this.aStretch.array;for(let l=0;l<t;l++){const c=this.life[l]/this.maxLife[l],h=1-c;e[l*3]=this.px[l],e[l*3+1]=this.py[l],e[l*3+2]=this.pz[l];let f=this.size0[l]+(this.size1[l]-this.size0[l])*h,u=f;const m=f*this.aspect[l];this.tumble[l]&&(u*=.25+.75*Math.abs(Math.cos(this.rot[l]*1.7)));const g=this.stretch[l];if(g>0){const d=this.vx[l],x=this.vy[l],M=this.vz[l],b=Math.sqrt(d*d+x*x+M*M);u=Math.max(f,b*g),o[l*3]=d,o[l*3+1]=x,o[l*3+2]=M}else o[l*3]=o[l*3+1]=o[l*3+2]=0;i[l*2]=u,i[l*2+1]=m,n[l*3]=this.c0[l*3]+(this.c1[l*3]-this.c0[l*3])*h,n[l*3+1]=this.c0[l*3+1]+(this.c1[l*3+1]-this.c0[l*3+1])*h,n[l*3+2]=this.c0[l*3+2]+(this.c1[l*3+2]-this.c0[l*3+2])*h;let _=this.alpha0[l]*Math.min(1,c/.6);const p=this.fadeIn[l];p>0&&(_*=Math.min(1,h/p)),r[l]=_,a[l]=this.rot[l]}this._upload(this.aPos,t*3),this._upload(this.aSize,t*2),this._upload(this.aColor,t*3),this._upload(this.aAlpha,t),this._upload(this.aRot,t),this._upload(this.aStretch,t*3)}_upload(t,e){t.clearUpdateRanges&&(t.clearUpdateRanges(),t.addUpdateRange(0,e)),t.needsUpdate=!0}clear(){this.count=0,this.geometry.instanceCount=0,this.mesh.visible=!1}dispose(){this.geometry.dispose(),this._baseGeometry.dispose(),this.material.dispose()}}class R1{constructor(t=10){this.geometry=new be(1,1),this.items=[],this.group=new Te,this.group.name="RingPool";const e=tr.get("ring");for(let i=0;i<t;i++){const n=new oe({map:e,color:16777215,transparent:!0,depthWrite:!1,blending:_i,side:_e,toneMapped:!0}),r=new ft(this.geometry,n);r.visible=!1,r.renderOrder=12,r.frustumCulled=!1,this.group.add(r),this.items.push({mesh:r,life:0,maxLife:1,s0:0,s1:1,a0:1,flat:!0})}this._next=0}spawn(t,e={}){const i=this.items[this._next];this._next=(this._next+1)%this.items.length,i.life=i.maxLife=e.life??.4,i.s0=e.size0??.5,i.s1=e.size1??4,i.a0=e.alpha??.9,i.flat=e.flat!==!1,i.mesh.material.color.setHex(e.color??16777215),i.mesh.position.copy(t),i.flat&&(i.mesh.position.y+=.05,i.mesh.rotation.set(-Math.PI/2,0,0)),i.mesh.visible=!0,i.mesh.scale.setScalar(i.s0),i.mesh.material.opacity=i.a0}update(t,e){for(const i of this.items){if(i.life<=0)continue;if(i.life-=t,i.life<=0){i.mesh.visible=!1;continue}const n=1-i.life/i.maxLife,r=1-(1-n)*(1-n);i.mesh.scale.setScalar(i.s0+(i.s1-i.s0)*r),i.mesh.material.opacity=i.a0*(1-n),!i.flat&&e&&i.mesh.quaternion.copy(e.quaternion)}}dispose(){for(const t of this.items)t.mesh.material.dispose();this.geometry.dispose()}}const qr=48,af=.06,of=4;class C1{constructor(t=4e3){this.N=t,this.head=0,this.positions=new Float32Array(t*4*3),this.alphas=new Float32Array(t*4),this.segAlpha=new Float32Array(t);const e=new Uint32Array(t*6);for(let r=0;r<t;r++){const a=r*4;e[r*6]=a,e[r*6+1]=a+1,e[r*6+2]=a+2,e[r*6+3]=a,e[r*6+4]=a+2,e[r*6+5]=a+3}const i=new He;this.aPos=new Pe(this.positions,3).setUsage(pl),this.aAlpha=new Pe(this.alphas,1).setUsage(pl),i.setAttribute("position",this.aPos),i.setAttribute("alpha",this.aAlpha),i.setIndex(new Pe(e,1)),i.boundingSphere=new As(new R,1e6),this.geometry=i;const n=new pt(1381916).convertSRGBToLinear();this.material=new Ne({uniforms:Bn.merge([mt.fog,{uColor:{value:n}}]),vertexShader:y1,fragmentShader:b1,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-4,fog:!0,side:_e}),this.mesh=new ft(i,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=1,this.mesh.matrixAutoUpdate=!1,this.mesh.name="SkidMarks",this.mesh.visible=!1,this.trails=new Map,this._dirty=!1,this._dirtyMin=1/0,this._dirtyMax=-1,this._wrapped=!1}_trail(t){let e=this.trails.get(t);return e||(e={active:!1,lx:0,ly:0,lz:0,rx:0,ry:0,rz:0,cx:0,cz:0},this.trails.set(t,e)),e}extend(t,e,i,n,r,a,o=.3){const l=this._trail(t),c=Math.cos(r)*o*.5,h=-Math.sin(r)*o*.5;if(l.active){const _=e-l.cx,p=n-l.cz,d=_*_+p*p;if(d<af*af)return;d>of*of&&(l.active=!1)}if(!l.active){l.active=!0,l.lx=e-c,l.ly=i,l.lz=n-h,l.rx=e+c,l.ry=i,l.rz=n+h,l.cx=e,l.cz=n;return}const f=e-c,u=n-h,m=e+c,g=n+h;this._writeSegment(l.lx,l.ly,l.lz,l.rx,l.ry,l.rz,m,i,g,f,i,u,Math.min(1,a)),l.lx=f,l.ly=i,l.lz=u,l.rx=m,l.ry=i,l.rz=g,l.cx=e,l.cz=n}release(t){const e=this.trails.get(t);e&&(e.active=!1)}mark(t,e,i=.6,n=.6,r=.3){const a=Math.sin(e)*n*.5,o=Math.cos(e)*n*.5,l=Math.cos(e)*r*.5,c=-Math.sin(e)*r*.5,h=t.x,f=t.y,u=t.z;this._writeSegment(h-a-l,f,u-o-c,h-a+l,f,u-o+c,h+a+l,f,u+o+c,h+a-l,f,u+o-c,Math.min(1,i))}_writeSegment(t,e,i,n,r,a,o,l,c,h,f,u,m){const g=this.head,_=this.positions,p=g*12;_[p]=t,_[p+1]=e,_[p+2]=i,_[p+3]=n,_[p+4]=r,_[p+5]=a,_[p+6]=o,_[p+7]=l,_[p+8]=c,_[p+9]=h,_[p+10]=f,_[p+11]=u;const d=.15+.55*m;this.segAlpha[g]=d,this._setAlpha(g,d);for(let x=1;x<=qr;x++){const M=(g+x)%this.N,b=(x-1)/qr;this._setAlpha(M,Math.min(this.alphas[M*4],this.segAlpha[M]*b))}this._markDirty(g),this._markDirty((g+qr)%this.N),g+qr>=this.N&&(this._wrapped=!0),this.head=(g+1)%this.N,this.mesh.visible=!0}_setAlpha(t,e){const i=t*4;this.alphas[i]=this.alphas[i+1]=this.alphas[i+2]=this.alphas[i+3]=e}_markDirty(t){this._dirty=!0,t<this._dirtyMin&&(this._dirtyMin=t),t>this._dirtyMax&&(this._dirtyMax=t)}update(){if(!this._dirty)return;const t=this._wrapped||this._dirtyMax-this._dirtyMin>this.N/2,e=t?0:this._dirtyMin,i=t?this.N:this._dirtyMax-this._dirtyMin+1;this._upload(this.aPos,e*12,i*12),this._upload(this.aAlpha,e*4,i*4),this._dirty=!1,this._wrapped=!1,this._dirtyMin=1/0,this._dirtyMax=-1}_upload(t,e,i){t.clearUpdateRanges&&(t.clearUpdateRanges(),t.addUpdateRange(e,i)),t.needsUpdate=!0}clear(){this.alphas.fill(0),this.segAlpha.fill(0),this.trails.clear(),this._wrapped=!0,this._dirty=!0,this._dirtyMin=0,this._dirtyMax=this.N-1,this.mesh.visible=!1}dispose(){this.geometry.dispose(),this.material.dispose()}}const P1=[15263976,4112895,16752412,14044159],I1=[70,130,190,270],lf=[16726843,16747546,16769357,6160221,4112895,8023039,14044159,16734904],Yr={x:-.7,y:.28,z:-.75},Kr={x:.7,y:.28,z:-.75},qs={x:-.25,y:.7,z:-1.1},Ys={x:.25,y:.7,z:-1.1},ae=new R;class L1{constructor(t,e){this.kart=t,this.fx=e,this.acc={drift:0,glow:0,exhaust:0,boost:0,boostSmoke:0,streak:0,dust:0,star:0,stun:0,stunSmoke:0},this.prevSurface=null,this.prevBoost=0,this.prevAirborne=!1,this.time=Math.random()*10;const i=t.object;this.root=new Te,this.root.name="KartFx",this.flames=[];for(const n of[qs,Ys]){const r=new Te;r.position.set(n.x,n.y,n.z);const a=new ft(e.shared.flameGeo,e.shared.flameOuterMat),o=new ft(e.shared.flameGeo,e.shared.flameInnerMat);o.scale.set(.55,.55,.7),r.add(a,o),r.visible=!1,this.root.add(r),this.flames.push({group:r,outer:a,inner:o})}this.aura=new ft(e.shared.auraGeo,e.shared.auraMat),this.aura.position.set(0,.75,0),this.aura.scale.set(1.25,.95,1.55),this.aura.visible=!1,this.aura.renderOrder=11,this.root.add(this.aura),this.dizzy=new Te,this.dizzy.position.set(0,1.75,0);for(let n=0;n<3;n++){const r=new R_(e.shared.dizzyMat),a=n/3*Math.PI*2;r.position.set(Math.cos(a)*.55,0,Math.sin(a)*.55),r.scale.setScalar(.32),this.dizzy.add(r)}this.dizzy.visible=!1,this.root.add(this.dizzy),i&&i.add&&i.add(this.root)}_local(t,e){const i=this.kart,n=i.heading||0,r=i.object&&i.object.scale&&i.object.scale.x||1,a=Math.sin(n),o=Math.cos(n),l=o,c=-a,h=i.position;return e.x=h.x+(l*t.x+a*t.z)*r,e.y=h.y+t.y*r,e.z=h.z+(c*t.x+o*t.z)*r,e}update(t){const e=this.kart,i=e.state;if(!i)return;const n=this.fx;this.time+=t;const r=e.heading||0,a=Math.sin(r),o=Math.cos(r),l=o,c=-a,h=Math.abs(e.speed||0),f=e.velocity,u=f?f.x:a*e.speed,m=f?f.z:o*e.speed,g=!!i.airborne,_=e.surface,p=_?_.type:"road",d=_&&typeof _.height=="number"?_.height:e.position.y,x=n.sparks,M=n.smoke,b=e.controls&&e.controls.brake>.6&&h>8,P=!g&&(i.drifting||b);if(i.drifting&&!g){const I=Math.max(0,Math.min(3,i.driftLevel|0)),v=P1[I];for(this.acc.drift+=I1[I]*t;this.acc.drift>=1;){this.acc.drift-=1;const S=Math.random()<.5?-1:1;this._local(S<0?Yr:Kr,ae),L.reset(),L.x=ae.x+Yt(.1),L.y=ae.y-.1,L.z=ae.z+Yt(.1);const U=4+Math.random()*5+I*1.5,k=(1+Math.random()*2.5)*S;L.vx=-a*U+l*k+u*.3+Yt(.8),L.vy=.6+Math.random()*3.2,L.vz=-o*U+c*k+m*.3+Yt(.8),L.life=Qe(.22,.5),L.size=.1+I*.035+Math.random()*.12,L.sizeEnd=.03,L.color=v,L.colorEnd=I===0?8947848:v,L.brightness=1.9+I*.3,L.alpha=1,L.gravity=12,L.stretch=.05,x.emit(L)}for(this.acc.glow+=24*t;this.acc.glow>=1;){this.acc.glow-=1;for(const S of[Yr,Kr])this._local(S,ae),L.reset(),L.x=ae.x,L.y=ae.y-.05,L.z=ae.z,L.vx=u*.8,L.vz=m*.8,L.life=.1,L.size=.7+I*.15,L.sizeEnd=.3,L.color=v,L.brightness=1.6,L.alpha=.7,x.emit(L)}}if(P){const I=i.drifting?.55+.15*(i.driftLevel|0):.7;this._local(Yr,ae),n.skids.extend(e.index*2,ae.x,d+.02,ae.z,r,I),this._local(Kr,ae),n.skids.extend(e.index*2+1,ae.x,d+.02,ae.z,r,I)}else n.skids.release(e.index*2),n.skids.release(e.index*2+1);if(h<8&&!g&&i.boostTimer<=0)for(this.acc.exhaust+=(4+(1-h/8)*7)*t;this.acc.exhaust>=1;){this.acc.exhaust-=1;const I=Math.random()<.5?qs:Ys;this._local(I,ae),L.reset(),L.x=ae.x,L.y=ae.y,L.z=ae.z,L.vx=-a*1.4+u*.3+Yt(.4),L.vy=.7+Math.random()*.6,L.vz=-o*1.4+m*.3+Yt(.4),L.life=Qe(.7,1.1),L.size=.18,L.sizeEnd=.6,L.color=11053229,L.colorEnd=9079440,L.alpha=.4,L.drag=1.6,L.fadeIn=.12,L.rot=Math.random()*6.28,L.rotV=Yt(1.5),M.emit(L)}const T=i.boostTimer>0;T&&this.prevBoost<=0&&(this._local(qs,ae),n.burst(ae,{color:16757575,count:14,speed:5,size:.2,life:.35,brightness:1.8}),this._local(Ys,ae),n.burst(ae,{color:16757575,count:14,speed:5,size:.2,life:.35,brightness:1.8})),this.prevBoost=i.boostTimer;for(const I of this.flames){if(I.group.visible=T,!T)continue;const v=.85+Math.random()*.35,S=.8+Math.min(1,h/32)*.7;I.group.scale.set(v,v,S*(.9+Math.random()*.3)),I.inner.scale.set(.55,.55,.7+Math.random()*.2)}if(T){for(this.acc.boost+=150*t;this.acc.boost>=1;){this.acc.boost-=1;const I=Math.random()<.5?qs:Ys;this._local(I,ae),L.reset(),L.x=ae.x+Yt(.08),L.y=ae.y+Yt(.08),L.z=ae.z+Yt(.08);const v=5+Math.random()*5;L.vx=-a*v+u*.5+Yt(1.2),L.vy=Yt(1)+.3,L.vz=-o*v+m*.5+Yt(1.2),L.life=Qe(.18,.4),L.size=.34,L.sizeEnd=.05,L.color=16773280,L.colorEnd=16730640,L.brightness=1.9,L.alpha=.9,L.stretch=.03,x.emit(L)}for(this.acc.boostSmoke+=16*t;this.acc.boostSmoke>=1;){this.acc.boostSmoke-=1;const I=Math.random()<.5?qs:Ys;this._local(I,ae),L.reset(),L.x=ae.x-a*.8,L.y=ae.y,L.z=ae.z-o*.8,L.vx=-a*2+u*.4+Yt(.6),L.vy=.8+Math.random(),L.vz=-o*2+m*.4+Yt(.6),L.life=Qe(.5,.8),L.size=.3,L.sizeEnd=1,L.color=5921376,L.colorEnd=3816e3,L.alpha=.32,L.drag=1.5,L.fadeIn=.15,L.rotV=Yt(2),M.emit(L)}for(this.acc.streak+=(30+h)*t;this.acc.streak>=1;){this.acc.streak-=1;const I=Math.random()*Math.PI*2,v=1.3+Math.random()*1.6,S=l*Math.cos(I)*v,U=c*Math.cos(I)*v,k=.7+Math.sin(I)*v*.7,V=Qe(-1,3);L.reset(),L.x=e.position.x+S+a*V,L.y=e.position.y+k,L.z=e.position.z+U+o*V;const K=28+h;L.vx=-a*K,L.vz=-o*K,L.life=Qe(.18,.3),L.size=.05,L.color=16774092,L.brightness=1.4,L.alpha=.75,L.stretch=.07,n.streaks.emit(L)}}if(p==="offroad"&&h>5&&!g)for(this.acc.dust+=(26+h*.9)*t;this.acc.dust>=1;){this.acc.dust-=1;const I=Math.random()<.5?-1:1;this._local(I<0?Yr:Kr,ae),L.reset(),L.x=ae.x+Yt(.25),L.y=d+.2,L.z=ae.z+Yt(.25);const v=1.5+h*.14;L.vx=-a*v+l*I*(1+Math.random()*1.2)+u*.25+Yt(.6),L.vy=1.2+Math.random()*2,L.vz=-o*v+c*I*(1+Math.random()*1.2)+m*.25+Yt(.6),L.life=Qe(.8,1.4),L.size=.6,L.sizeEnd=2.2,L.color=13610624,L.colorEnd=11572332,L.alpha=.62,L.drag=1.4,L.fadeIn=.15,L.rot=Math.random()*6.28,L.rotV=Yt(1.2),M.emit(L)}const E=i.starTimer>0;if(this.aura.visible=E,E)for(this.acc.star+=45*t;this.acc.star>=1;)this.acc.star-=1,L.reset(),L.x=e.position.x+l*Yt(1.1)+a*Yt(1.4),L.y=e.position.y+Qe(.1,1.7),L.z=e.position.z+c*Yt(1.1)+o*Yt(1.4),L.vx=u*.85+Yt(.6),L.vy=.8+Math.random()*1.6,L.vz=m*.85+Yt(.6),L.life=Qe(.35,.7),L.size=Qe(.14,.3),L.sizeEnd=.02,L.color=lf[Math.random()*lf.length|0],L.brightness=1.9,L.alpha=.95,L.rotV=Yt(6),x.emit(L);if(i.stunTimer>0){for(this.acc.stun+=55*t;this.acc.stun>=1;)this.acc.stun-=1,L.reset(),L.x=e.position.x+Yt(.8),L.y=e.position.y+Qe(.3,1.4),L.z=e.position.z+Yt(.8),L.vx=Yt(4)+u*.5,L.vy=Qe(.5,4),L.vz=Yt(4)+m*.5,L.life=Qe(.2,.45),L.size=.16,L.sizeEnd=.03,L.color=Math.random()<.5?12576511:16777215,L.brightness=2.2,L.gravity=7,L.stretch=.06,x.emit(L);for(this.acc.stunSmoke+=7*t;this.acc.stunSmoke>=1;)this.acc.stunSmoke-=1,L.reset(),L.x=e.position.x+Yt(.5),L.y=e.position.y+.9,L.z=e.position.z+Yt(.5),L.vx=Yt(.4)+u*.5,L.vy=1.2,L.vz=Yt(.4)+m*.5,L.life=Qe(.5,.8),L.size=.25,L.sizeEnd=.7,L.color=4473928,L.alpha=.4,L.drag=1.5,L.fadeIn=.1,M.emit(L)}const C=i.spinTimer>0&&!(i.stunTimer>0);this.dizzy.visible=C,C&&(this.dizzy.rotation.y+=t*7,this.dizzy.position.y=1.75+Math.sin(this.time*9)*.05),p==="boost"&&this.prevSurface!=="boost"&&this.prevSurface!==null&&(n.burst(e.position,{color:16769357,count:30,speed:7,size:.18,life:.45,brightness:1.8,up:3}),n.rings.spawn(e.position,{color:16765500,size0:.6,size1:4.5,life:.4,alpha:.8,flat:!0})),this.prevSurface=p,this.prevAirborne=g}dispose(){this.aura.visible=!1,this.dizzy.visible=!1;for(const t of this.flames)t.group.visible=!1;this.root.parent&&this.root.parent.remove(this.root),this.fx.skids.release(this.kart.index*2),this.fx.skids.release(this.kart.index*2+1)}}const cu={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Is{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const D1=new Dl(-1,1,1,-1,0,1);class U1 extends He{constructor(){super(),this.setAttribute("position",new Me([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Me([0,2,0,0,2,0],2))}}const N1=new U1;class oc{constructor(t){this._mesh=new ft(N1,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,D1)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class hu extends Is{constructor(t,e){super(),this.textureID=e!==void 0?e:"tDiffuse",t instanceof Ne?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=Bn.clone(t.uniforms),this.material=new Ne({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this.fsQuad=new oc(this.material)}render(t,e,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this.fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class cf extends Is{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,i){const n=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(n.REPLACE,n.REPLACE,n.REPLACE),r.buffers.stencil.setFunc(n.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(i),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(n.EQUAL,1,4294967295),r.buffers.stencil.setOp(n.KEEP,n.KEEP,n.KEEP),r.buffers.stencil.setLocked(!0)}}class k1 extends Is{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class F1{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const i=t.getSize(new Lt);this._width=i.width,this._height=i.height,e=new Mi(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Ni}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new hu(cu),this.copyPass.material.blending=$i,this.clock=new B_}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let i=!1;for(let n=0,r=this.passes.length;n<r;n++){const a=this.passes[n];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(n),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,i),a.needsSwap){if(i){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}cf!==void 0&&(a instanceof cf?i=!0:a instanceof k1&&(i=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new Lt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const i=this._width*this._pixelRatio,n=this._height*this._pixelRatio;this.renderTarget1.setSize(i,n),this.renderTarget2.setSize(i,n);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,n)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class O1 extends Is{constructor(t,e,i=null,n=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=i,this.clearColor=n,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new pt}render(t,e,i){const n=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=n}}const z1={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new pt(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class Ts extends Is{constructor(t,e,i,n){super(),this.strength=e!==void 0?e:1,this.radius=i,this.threshold=n,this.resolution=t!==void 0?new Lt(t.x,t.y):new Lt(256,256),this.clearColor=new pt(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Mi(r,a,{type:Ni}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let f=0;f<this.nMips;f++){const u=new Mi(r,a,{type:Ni});u.texture.name="UnrealBloomPass.h"+f,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const m=new Mi(r,a,{type:Ni});m.texture.name="UnrealBloomPass.v"+f,m.texture.generateMipmaps=!1,this.renderTargetsVertical.push(m),r=Math.round(r/2),a=Math.round(a/2)}const o=z1;this.highPassUniforms=Bn.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=n,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Ne({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let f=0;f<this.nMips;f++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[f])),this.separableBlurMaterials[f].uniforms.invSize.value=new Lt(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new R(1,1,1),new R(1,1,1),new R(1,1,1),new R(1,1,1),new R(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const h=cu;this.copyUniforms=Bn.clone(h.uniforms),this.blendMaterial=new Ne({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:_i,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new pt,this.oldClearAlpha=1,this.basic=new oe,this.fsQuad=new oc(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(t,e){let i=Math.round(t/2),n=Math.round(e/2);this.renderTargetBright.setSize(i,n);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(i,n),this.renderTargetsVertical[r].setSize(i,n),this.separableBlurMaterials[r].uniforms.invSize.value=new Lt(1/i,1/n),i=Math.round(i/2),n=Math.round(n/2)}render(t,e,i,n,r){t.getClearColor(this._oldClearColor),this.oldClearAlpha=t.getClearAlpha();const a=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=i.texture,t.setRenderTarget(null),t.clear(),this.fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this.fsQuad.render(t);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=Ts.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this.fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=Ts.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this.fsQuad.render(t),o=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this.fsQuad.render(t),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(i),this.fsQuad.render(t)),t.setClearColor(this._oldClearColor,this.oldClearAlpha),t.autoClear=a}getSeperableBlurMaterial(t){const e=[];for(let i=0;i<t;i++)e.push(.39894*Math.exp(-.5*i*i/(t*t))/t);return new Ne({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new Lt(.5,.5)},direction:{value:new Lt(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(t){return new Ne({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}Ts.BlurDirectionX=new Lt(1,0);Ts.BlurDirectionY=new Lt(0,1);const B1={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class G1 extends Is{constructor(){super();const t=B1;this.uniforms=Bn.clone(t.uniforms),this.material=new L_({name:t.name,uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader}),this.fsQuad=new oc(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},fe.getTransfer(this._outputColorSpace)===xe&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===mf?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===gf?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===_f?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===bl?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===vf?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===xf&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const H1=.15;function V1(s,t,e){let i=null,n=null,r=null,a=!0,o=0,l=0,c=0;const h=new Lt;s.getSize(h);const f=s.getPixelRatio?s.getPixelRatio():1;if((()=>{try{const g=s.capabilities;return!(!g||!g.isWebGL2||!s.getContext())}catch{return!1}})())try{const g=s.extensions.has("EXT_color_buffer_float")||s.extensions.has("EXT_color_buffer_half_float"),_=f>1.5?2:4,p=new Mi(Math.max(1,h.x*f),Math.max(1,h.y*f),{type:g?Ni:ki,colorSpace:tn,samples:_});i=new F1(s,p),i.setPixelRatio(f),i.setSize(h.x,h.y),i.addPass(new O1(t,e)),n=new Ts(new Lt(h.x,h.y),.35,.4,.85),i.addPass(n),r=new hu(new Ne({uniforms:{tDiffuse:{value:null},uSpeed:{value:0},uTime:{value:0},uResolution:{value:new Lt(h.x*f,h.y*f)},uVignette:{value:.55},uSaturation:{value:1.12}},vertexShader:T1,fragmentShader:E1,depthTest:!1,depthWrite:!1}),"tDiffuse"),i.addPass(r),i.addPass(new G1)}catch(g){console.warn("[fx] post-processing unavailable, falling back to plain render",g),i=null,n=null,r=null}else console.warn("[fx] WebGL2 not available; post-processing disabled");const m=()=>s.render(t,e);return{composer:i,get enabled(){return a&&!!i},render(g=1/60){if(g>0||(g=1/60),c+=g,o+=(l-o)*(1-Math.exp(-g/H1)),!a||!i)return m();try{r.uniforms.uSpeed.value=o,r.uniforms.uTime.value=c,i.render(g)}catch(_){console.warn("[fx] composer failed; disabling post-processing",_),a=!1,m()}},setSize(g,_){if(!i)return;const p=s.getPixelRatio?s.getPixelRatio():1;i.setPixelRatio(p),i.setSize(g,_),n&&n.setSize(g,_),r&&r.uniforms.uResolution.value.set(g*p,_*p)},setSpeed(g){l=Math.max(0,Math.min(1,Number.isFinite(g)?g:0))},setEnabled(g){a=!!g},dispose(){var g,_,p,d;(g=i==null?void 0:i.dispose)==null||g.call(i),(_=n==null?void 0:n.dispose)==null||_.call(n),(d=(p=r==null?void 0:r.material)==null?void 0:p.dispose)==null||d.call(p)}}}const W1=[16726843,16747546,16769357,6160221,4112895,8023039,14044159,16734904],hf=[16726843,16747546,16769357,4054148,4112895,13126655,16777215,16734904],De=new R,Ro=new R,fs=new R,ff=new R;class X1{constructor({scene:t,events:e}={}){this.scene=t,this.events=e,this.time=0,this.karts=new Map,this._offs=[],this._delayed=[],this._lastHitFx=new Map,this.root=new Te,this.root.name="FXSystem",this.sparks=new Xr({capacity:3e3,texture:"soft",additive:!0,renderOrder:10}),this.smoke=new Xr({capacity:1500,texture:"smoke",additive:!1,renderOrder:9}),this.chunks=new Xr({capacity:800,texture:"chunk",additive:!1,renderOrder:9}),this.streaks=new Xr({capacity:400,texture:"streak",additive:!0,renderOrder:10}),this.rings=new R1(10),this.skids=new C1(4e3),this.root.add(this.sparks.mesh,this.smoke.mesh,this.chunks.mesh,this.streaks.mesh,this.rings.group,this.skids.mesh),this.shared=this._buildShared(),this.flash=new ft(new be(2,2),new oe({color:16777215,transparent:!0,opacity:0,blending:_i,depthTest:!1,depthWrite:!1,fog:!1})),this.flash.renderOrder=1e3,this.flash.frustumCulled=!1,this.flash.visible=!1,this.flash.scale.setScalar(60),this._flashLife=0,this.root.add(this.flash),this.bolts=[];const i=tr.get("bolt");for(let n=0;n<3;n++){const r=new ft(new be(1,1),new oe({map:i,color:new pt(14479359).multiplyScalar(2.2),transparent:!0,opacity:0,blending:_i,depthTest:!1,depthWrite:!1,fog:!1,side:_e}));r.visible=!1,r.frustumCulled=!1,r.renderOrder=999,this.root.add(r),this.bolts.push({mesh:r,life:0,maxLife:.3,seed:Math.random()*10})}t&&t.add(this.root),this._wire()}_buildShared(){const t=new Re(.22,1,10,1,!0);t.rotateX(-Math.PI/2),t.translate(0,0,-.5);const e=new oe({color:new pt(16738842).multiplyScalar(1.6),transparent:!0,opacity:.85,blending:_i,depthWrite:!1,side:_e,fog:!1}),i=new oe({color:new pt(16773800).multiplyScalar(1.8),transparent:!0,opacity:.95,blending:_i,depthWrite:!1,side:_e,fog:!1}),n=new ee(1,28,18),r=new Ne({uniforms:{uTime:{value:0},uIntensity:{value:1}},vertexShader:S1,fragmentShader:w1,transparent:!0,depthWrite:!1,blending:_i,side:Qi}),a=new Yf({map:tr.get("star"),color:16767293,transparent:!0,depthWrite:!1,fog:!1});return{flameGeo:t,flameOuterMat:e,flameInnerMat:i,auraGeo:n,auraMat:r,dizzyMat:a}}attachKart(t){!t||this.karts.has(t)||this.karts.set(t,new L1(t,this))}detachKart(t){const e=this.karts.get(t);e&&(e.dispose(),this.karts.delete(t))}burst(t,e={}){if(!t)return;const i=e.pool==="smoke"?this.smoke:e.pool==="chunks"?this.chunks:this.sparks,n=e.count??20,r=e.speed??5,a=e.size??.2,o=e.life??.5,l=e.spread??.1,c=e.color??16777215;for(let h=0;h<n;h++){L.reset(),L.x=t.x+Yt(l),L.y=t.y+Yt(l),L.z=t.z+Yt(l);const f=Math.random()*Math.PI*2,u=Math.acos(2*Math.random()-1),m=r*(.4+Math.random()*.8);L.vx=Math.sin(u)*Math.cos(f)*m,L.vy=Math.cos(u)*m+(e.up??0),L.vz=Math.sin(u)*Math.sin(f)*m,L.life=o*(.6+Math.random()*.8),L.size=a*(.6+Math.random()*.8),L.sizeEnd=i===this.sparks?a*.15:a*2,L.color=Array.isArray(c)?c[Math.random()*c.length|0]:c,L.colorEnd=e.colorEnd??-1,L.brightness=e.brightness??(i===this.sparks?1.5:1),L.alpha=e.alpha??(i===this.sparks?.95:.5),L.gravity=e.gravity??(i===this.sparks?6:0),L.drag=e.drag??(i===this.sparks?.8:1.5),L.stretch=e.stretch??(i===this.sparks?.03:0),L.rot=Math.random()*6.28,L.rotV=Yt(i===this.chunks?12:2),L.tumble=i===this.chunks?1:0,L.fadeIn=i===this.smoke?.1:0,i.emit(L)}}explosion(t){t&&(this.burst(t,{color:[16769658,16751150,16734748],colorEnd:8002053,count:90,speed:11,size:.45,life:.55,brightness:1.9,up:3,gravity:5,drag:1.2,stretch:.02}),L.reset(),L.x=t.x,L.y=t.y+.6,L.z=t.z,L.life=.18,L.size=5,L.sizeEnd=1.5,L.color=16774352,L.brightness=2.5,L.alpha=1,this.sparks.emit(L),this.burst(t,{pool:"smoke",color:[4605516,6184548,3026483],count:30,speed:4.5,size:.9,life:1.8,up:2.5,drag:1.6,alpha:.55}),this.burst(t,{pool:"chunks",color:[2236968,4473936,16747546],count:24,speed:9,size:.16,life:1.2,up:6,gravity:16,drag:.4,alpha:1}),this.rings.spawn(t,{color:16756832,size0:.8,size1:12,life:.5,alpha:.9,flat:!0}),this.rings.spawn(t,{color:16769200,size0:.5,size1:6,life:.3,alpha:.8,flat:!1}))}hitSpark(t){t&&(this.burst(t,{color:[16777215,16773536,16765500],count:32,speed:8,size:.16,life:.4,brightness:1.9,up:2,gravity:9,stretch:.035}),L.reset(),L.x=t.x,L.y=t.y+.4,L.z=t.z,L.life=.12,L.size=2.2,L.sizeEnd=.6,L.color=16777215,L.brightness=2,L.alpha=.9,this.sparks.emit(L),De.set(t.x,t.y+.5,t.z),this.rings.spawn(De,{color:16777215,size0:.4,size1:3.5,life:.3,alpha:.8,flat:!1}))}bananaSplat(t){t&&(this.burst(t,{pool:"chunks",color:[16767293,16770688,15909376],count:22,speed:6,size:.18,life:.9,up:5,gravity:14,drag:.5,alpha:1}),this.burst(t,{pool:"smoke",color:16774064,count:8,speed:2,size:.5,life:.6,up:1,alpha:.45}))}lightningFlash(){this._flashLife=.35,this.flash.visible=!0,this.flash.material.opacity=1;for(const t of this.bolts)t.life=t.maxLife=.28+Math.random()*.12,t.mesh.visible=!0,t.seed=Math.random()*10,t.pending=!0}confetti(t){t&&(this.burst(t,{pool:"chunks",color:hf,count:110,speed:7,size:.16,life:2.6,up:9,gravity:5,drag:1.1,alpha:1,spread:.6}),this.burst(t,{color:[16777215,16773536],count:30,speed:5,size:.14,life:.7,brightness:1.8,up:4,gravity:3}),this._later(.45,()=>this.burst(t,{pool:"chunks",color:hf,count:70,speed:6,size:.16,life:2.4,up:8,gravity:5,drag:1.1,alpha:1,spread:.8})))}skidMark(t,e,i=.7){t&&(De.set(t.x,t.y+.02,t.z),this.skids.mark(De,e||0,i))}wallSpark(t){t&&(this.burst(t,{color:[14540253,12303291,16773536],count:18,speed:6,size:.12,life:.35,brightness:1.4,up:2,gravity:10,stretch:.03}),this.burst(t,{pool:"smoke",color:10132122,count:4,speed:1.5,size:.35,life:.5,alpha:.4}))}poof(t,e=1){t&&this.burst(t,{pool:"smoke",color:[16777215,15263982],count:Math.round(14*e),speed:2.5*e,size:.45*e,life:.7,up:1.2,drag:1.8,alpha:.55})}landPuff(t){if(!t||!t.position)return;const e=t.surface&&typeof t.surface.height=="number"?t.surface.height:t.position.y;for(let i=0;i<10;i++){const n=i/10*Math.PI*2;L.reset(),L.x=t.position.x+Math.cos(n)*.6,L.y=e+.1,L.z=t.position.z+Math.sin(n)*.6,L.vx=Math.cos(n)*3,L.vy=.6,L.vz=Math.sin(n)*3,L.life=Qe(.35,.55),L.size=.35,L.sizeEnd=.9,L.color=14209732,L.alpha=.45,L.drag=3,this.smoke.emit(L)}}sparkleBurst(t,e=40){this.burst(t,{color:W1,count:e,speed:5,size:.22,life:.7,brightness:1.9,up:3,gravity:2,drag:1.2,stretch:0})}update(t,e){t>0||(t=1/60),this.time+=t,this.shared.auraMat.uniforms.uTime.value=this.time;for(const i of this.karts.values())i.update(t);if(this.sparks.update(t),this.smoke.update(t),this.chunks.update(t),this.streaks.update(t),this.skids.update(),this.rings.update(t,e),this._updateFlash(t,e),this._delayed.length)for(let i=this._delayed.length-1;i>=0;i--){const n=this._delayed[i];if(n.t-=t,n.t<=0){this._delayed.splice(i,1);try{n.fn()}catch(r){console.warn("[fx] delayed action failed",r)}}}}_updateFlash(t,e){if(this._flashLife>0){this._flashLife-=t;const i=Math.max(0,this._flashLife/.35);e&&(e.getWorldDirection(fs),this.flash.position.copy(e.position).addScaledVector(fs,1),this.flash.quaternion.copy(e.quaternion)),this.flash.material.opacity=i*i*.95,this.flash.visible=i>0}else this.flash.visible&&(this.flash.visible=!1);for(const i of this.bolts){if(i.life<=0){i.mesh.visible&&(i.mesh.visible=!1);continue}if(i.life-=t,i.pending&&e){i.pending=!1,e.getWorldDirection(fs),ff.set(fs.z,0,-fs.x).normalize();const a=130+Math.random()*90,o=Yt(110);i.mesh.position.copy(e.position).addScaledVector(fs,a).addScaledVector(ff,o),i.mesh.position.y=e.position.y+40+Math.random()*45;const l=70+Math.random()*50;i.mesh.scale.set(l*.45,l,1)}e&&i.mesh.quaternion.copy(e.quaternion);const n=Math.max(0,i.life/i.maxLife),r=.6+.4*Math.abs(Math.sin(this.time*60+i.seed));i.mesh.material.opacity=n*r,i.mesh.visible=n>0}}_later(t,e){this._delayed.push({t,fn:e})}clear(){this.sparks.clear(),this.smoke.clear(),this.chunks.clear(),this.streaks.clear(),this.skids.clear(),this._delayed.length=0}_wire(){const t=this.events;if(!t||typeof t.on!="function")return;const e=(r,a)=>this._offs.push(t.on(r,a)),i=r=>r&&(r.position||r.kart&&r.kart.position)||null,n=(r,a,o=.12)=>{if(!r)return!0;const l=r,c=this._lastHitFx.get(l);return c&&c.kind===a&&this.time-c.t<o?!1:(c?(c.kind=a,c.t=this.time):this._lastHitFx.set(l,{kind:a,t:this.time}),!0)};e(rt.ITEM_HIT,r=>{var l;const a=i(r),o=typeof(r==null?void 0:r.item)=="string"?r.item:(l=r==null?void 0:r.item)==null?void 0:l.id;o&&/banana/.test(o)?n(r.kart,"banana")&&this.bananaSplat(a):n(r.kart,"shell")&&this.hitSpark(a)}),e(rt.EXPLOSION,r=>this.explosion(i(r))),e(rt.HIT,r=>{const a=i(r);switch(r==null?void 0:r.kind){case"banana":n(r.kart,"banana")&&this.bananaSplat(a);break;case"shell":n(r.kart,"shell")&&this.hitSpark(a);break;case"hazard":this.wallSpark(a);break}}),e(rt.LIGHTNING,()=>this.lightningFlash()),e(rt.FINISH,r=>{var a;(a=r==null?void 0:r.kart)!=null&&a.isPlayer&&(Ro.copy(r.kart.position),Ro.y+=1,this.confetti(Ro.clone()))}),e(rt.STAR_START,r=>{const a=i(r);a&&(De.set(a.x,a.y+.8,a.z),this.sparkleBurst(De,50))}),e(rt.ITEM_PICKUP,r=>{const a=i(r);a&&(De.set(a.x,a.y+1,a.z),this.burst(De,{color:[16777215,16773536,10146047,14044159],count:26,speed:3.5,size:.16,life:.6,brightness:1.8,up:2.5,gravity:2,drag:1.5,stretch:0}))}),e(rt.RESPAWN,r=>{const a=i(r);a&&(De.set(a.x,a.y+.6,a.z),this.poof(De,1.3))}),e(rt.WALL_HIT,r=>{const a=r==null?void 0:r.kart;if(!a||!a.position)return;De.copy(a.position),De.y+=.4;const o=a.surface;o&&o.right&&typeof o.lateral=="number"&&De.addScaledVector(o.right,Math.sign(o.lateral)*.9),this.wallSpark(De)}),e(rt.KART_BUMP,r=>{var l;const a=r==null?void 0:r.a,o=r==null?void 0:r.b;if(a&&o&&a.position&&o.position)De.addVectors(a.position,o.position).multiplyScalar(.5),De.y+=.5;else if((l=r==null?void 0:r.kart)!=null&&l.position)De.copy(r.kart.position),De.y+=.5;else return;this.burst(De,{pool:"smoke",color:16777215,count:6,speed:1.8,size:.3,life:.4,alpha:.5}),this.burst(De,{color:16777215,count:6,speed:4,size:.1,life:.25,brightness:1.5,gravity:6})}),e(rt.LAND,r=>this.landPuff(r==null?void 0:r.kart)),e(rt.SHELL_BOUNCE,r=>{const a=i(r);a&&this.burst(a,{color:[16777215,16773536],count:8,speed:4,size:.1,life:.3,brightness:1.6,gravity:8})}),e(rt.SCREEN,r=>{r&&(r.name==="race"||r.name==="title"||r.name==="select")&&this.clear()})}dispose(){for(const e of this._offs)e();this._offs=[];for(const e of this.karts.values())e.dispose();this.karts.clear(),this.root.parent&&this.root.parent.remove(this.root),this.sparks.dispose(),this.smoke.dispose(),this.chunks.dispose(),this.streaks.dispose(),this.rings.dispose(),this.skids.dispose(),this.flash.geometry.dispose(),this.flash.material.dispose();for(const e of this.bolts)e.mesh.geometry.dispose(),e.mesh.material.dispose();const t=this.shared;t.flameGeo.dispose(),t.flameOuterMat.dispose(),t.flameInnerMat.dispose(),t.auraGeo.dispose(),t.auraMat.dispose(),t.dizzyMat.dispose(),tr.dispose()}}const q1=1/30;class Y1{constructor({container:t,uiRoot:e}){this.container=t,this.uiRoot=e,this.events=new G_,this.screen="boot",this.paused=!1,this.race=null,this.ready=!1,this.time=0,this._fps=60,this._lastTs=0,this._raf=0,this._menuTrack=null}boot(){this._setupRenderer(),this.ui=new t1({root:this.uiRoot,characters:cs,tracks:us,events:this.events}),this.audio=new v1({events:this.events}),this.fx=new X1({scene:this.scene,events:this.events}),this.postfx=V1(this.renderer,this.scene,this.camera),this.input=new qv,this.chaseCam=new Yv(this.camera),this.events.on(rt.UI_MUTE_TOGGLE,()=>{this.audio.setMuted(!this.audio.muted),this.ui.setMuted(this.audio.muted)});const t=()=>this.audio.unlock();window.addEventListener("pointerdown",t,{passive:!0}),window.addEventListener("keydown",t),window.addEventListener("keydown",e=>this._onKey(e)),window.addEventListener("resize",()=>this._resize()),document.addEventListener("visibilitychange",()=>{document.hidden&&this.screen==="race"&&!this.paused&&this.togglePause(!0)}),this._loadMenuScene(),this.showTitle(),this.ready=!0,this._lastTs=performance.now(),this._raf=requestAnimationFrame(e=>this._frame(e))}showTitle(){this._setScreen("title"),this.audio.setMusic("menu"),this.ui.showTitle({onStart:()=>this.showSelect()})}showSelect(){this._setScreen("select"),this.audio.setMusic("menu"),this.ui.showSelect({onConfirm:t=>this.startRace(t),onBack:()=>this.showTitle()})}startRace(t={}){this.ui.showLoading("Starting engines…"),this._teardownRace(),this._unloadMenuScene();const e=t.characterId??cs[0].id,i=t.trackId??us[0].id,n=t.difficulty??Zi.NORMAL,r=t.seed??Math.random()*1e9|0,a=Si(r),o=Ph(i);this.scene.add(o.group),this._applyEnvironment(o);const l=cs.find(d=>d.id===e)??cs[0],c=cs.filter(d=>d.id!==l.id);for(let d=c.length-1;d>0;d--){const x=Math.floor(a()*(d+1));[c[d],c[x]]=[c[x],c[d]]}const h=[l,...c.slice(0,xh-1)],f=Math.min(xh-1,o.startGrid.length-1),u=[],m=[];let g=null;for(let d=0;d<h.length;d++){const x=d===0,M=x?f:d-1,b=o.startGrid[M],P=new Hv({character:h[d],track:o,isPlayer:x,index:d,events:this.events});P.reset(b.position.clone(),b.heading),this.scene.add(P.object),this.fx.attachKart(P),u.push(P),x?g=P:m.push(new Qv(P,o,{difficulty:n,personality:a(),rng:a}))}const _=new gx({scene:this.scene,track:o,karts:u,events:this.events,rng:a}),p=new Sx({track:o,karts:u,items:_,events:this.events,playerKart:g});this.race={track:o,karts:u,ais:m,items:_,manager:p,playerKart:g,difficulty:n,choice:{characterId:e,trackId:i,difficulty:n,seed:r},lapTimes:[],lastLapTime:0,bestLap:null,finishedHandled:!1},this._wireRaceEvents(),this.chaseCam.snap(g),this._setScreen("race"),this.ui.hideLoading(),this.ui.showHUD(),this.audio.setMusic("race"),this.paused=!1}restartRace(){if(!this.race)return this.showSelect();this.ui.hidePause(),this.startRace(this.race.choice)}quitToMenu(){this.ui.hidePause(),this._teardownRace(),this._loadMenuScene(),this.showSelect()}togglePause(t){if(this.screen!=="race")return;const e=typeof t=="boolean"?t:!this.paused;e!==this.paused&&(this.paused=e,this.events.emit(rt.PAUSE,{paused:e}),e?this.ui.showPause({onResume:()=>this.togglePause(!1),onRestart:()=>this.restartRace(),onMenu:()=>this.quitToMenu()}):this.ui.hidePause())}_frame(t){this._raf=requestAnimationFrame(i=>this._frame(i));let e=(t-this._lastTs)/1e3;this._lastTs=t,e>0||(e=1/60),this._fps=this._fps*.95+1/e*.05,e=Math.min(e,q1),this.time+=e,this.renderer.info.reset();try{this.screen==="race"&&this.race?this.paused||this._updateRace(e):this._updateMenu(e),this.fx.update(e,this.camera),this.audio.update(e),this.postfx.render(e)}catch(i){console.error("[game] frame error",i)}}_updateMenu(t){this._menuTrack&&(this._menuTrack.update(t,this.time),this.chaseCam.cinematic(this._menuTrack,this.time)),this.postfx.setSpeed(0)}_updateRace(t){var p;const e=this.race,{manager:i,karts:n,ais:r,items:a,playerKart:o,track:l}=e;this.input.update(t);const c=this.ui.getTouchControls(),h=o.controls,f=i.phase!==We.COUNTDOWN,u=this.input.controls;h.throttle=Math.max(u.throttle,(c==null?void 0:c.throttle)??0),h.brake=Math.max(u.brake,(c==null?void 0:c.brake)??0),h.steer=Math.abs(u.steer)>=Math.abs((c==null?void 0:c.steer)??0)?u.steer:c.steer,h.hop=u.hop||!!(c!=null&&c.hop),h.useItem=u.useItem||!!(c!=null&&c.useItem),h.lookBack=u.lookBack||!!(c!=null&&c.lookBack),this._debugInput&&Object.assign(h,this._debugInput),f||(h.throttle=0,h.brake=0,h.hop=!1),(p=i.isControlLocked)!=null&&p.call(i,o)&&(h.throttle=0,h.brake=0,h.steer=0,h.hop=!1,h.useItem=!1),o.state.finished?h.useItem=!1:h.useItem&&f&&!this._itemLatch&&a.use(o,{backwards:h.lookBack}),this._itemLatch=h.useItem;for(const d of r)d.update(t,i);if(!f)for(const d of n)d.controls.throttle=0,d.controls.brake=0;l.update(t,this.time);for(const d of n)d.update(t);Zv(n),a.update(t,i),i.update(t);const m=this.camera.position;for(const d of n){const x=d.position.distanceTo(m),M=d.isPlayer?1:Ca.clamp(1-x/45,0,.5),b=this._tmpV.copy(d.position).sub(m).applyQuaternion(this._tmpQ.copy(this.camera.quaternion).invert()),P=d.isPlayer?0:Ca.clamp(b.x/20,-1,1);this.audio.setEngine(d.index,{rpm:d.getRpm(),throttle:d.controls.throttle,gain:M,pan:P})}this.chaseCam.update(o,t);const g=Ca.clamp(Math.abs(o.speed)/40,0,1),_=o.state.boostTimer>0?1:0;this.postfx.setSpeed(Math.max(g*.6,_)),this._updateHud(),i.phase===We.FINISHED&&!e.finishedHandled&&(e.finishedHandled=!0,this._onRaceOver())}_updateHud(){const t=this.race,{manager:e,playerKart:i,karts:n,track:r}=t,a=r.minimap;this._hudKarts.length=0;for(const o of n)this._hudKarts.push({x:o.position.x,z:o.position.z,color:o.character.color,isPlayer:o.isPlayer,rank:e.rankOf(o)});this.ui.updateHUD({rank:e.rankOf(i),total:n.length,lap:e.lapOf(i),totalLaps:e.totalLaps,speedKmh:i.getSpeedKmh(),item:i.item??null,itemRoulette:i.itemRoulette??null,time:e.time,driftLevel:i.state.driftLevel,boost:i.state.boostTimer>0?Math.min(1,i.state.boostTimer/1.5):0,star:i.state.starTimer>0,wrongWay:i.state.wrongWay,minimap:{points:a.points,bounds:a.bounds,karts:this._hudKarts},lapTimes:t.lapTimes,bestLap:t.bestLap,fps:this._fps,phase:e.phase})}_onRaceOver(){const t=this.race;this._setScreen("results"),this.ui.hideHUD();const e=t.manager.results.find(n=>n.kart===t.playerKart);this.audio.setMusic("results"),this.audio.play(e&&e.rank<=3?"finish_win":"finish_lose");const i=t.manager.results.slice().sort((n,r)=>n.rank-r.rank).map(n=>({name:n.kart.character.name,title:n.kart.character.title,color:n.kart.character.color,time:n.time,isPlayer:n.kart.isPlayer,rank:n.rank}));this.ui.showResults({standings:i,onRestart:()=>this.restartRace(),onMenu:()=>this.quitToMenu()})}_wireRaceEvents(){this._unwireRaceEvents();const t=[],e=this.race;t.push(this.events.on(rt.COUNTDOWN,({n:i})=>this.ui.showCountdown(i))),t.push(this.events.on(rt.RACE_START,()=>this.ui.showCountdown("GO!"))),t.push(this.events.on(rt.LAP,({kart:i,lap:n,isFinal:r})=>{if(i!==e.playerKart)return;const a=e.manager.time,o=a-e.lastLapTime;e.lastLapTime=a,n>1&&(e.lapTimes.push(o),(e.bestLap==null||o<e.bestLap)&&(e.bestLap=o)),r?(this.ui.flash("FINAL LAP!",{style:"final"}),this.audio.setMusic("final")):n>1&&this.ui.flash(`LAP ${n}`,{style:"lap"})})),t.push(this.events.on(rt.FINISH,({kart:i,rank:n})=>{if(i!==e.playerKart)return;const a=e.manager.time-e.lastLapTime;e.lapTimes.push(a),(e.bestLap==null||a<e.bestLap)&&(e.bestLap=a),this.ui.flash(`FINISH! ${K1(n)}`,{style:"info"}),this.postfx.setSpeed(0)})),t.push(this.events.on(rt.WRONG_WAY,({kart:i,on:n})=>{i===e.playerKart&&n&&this.ui.flash("WRONG WAY!",{style:"wrongway"})})),this._raceOffs=t}_unwireRaceEvents(){if(this._raceOffs)for(const t of this._raceOffs)t();this._raceOffs=null}_teardownRace(){var e,i,n,r,a;if(this._unwireRaceEvents(),!this.race)return;const t=this.race;for(const o of t.karts)this.fx.detachKart(o),this.scene.remove(o.object),(e=o.dispose)==null||e.call(o);(n=(i=t.items).dispose)==null||n.call(i),this.scene.remove(t.track.group),(a=(r=t.track).dispose)==null||a.call(r);for(const o of t.karts)this.audio.setEngine(o.index,{rpm:0,throttle:0,gain:0,pan:0});this.race=null,this.ui.hideHUD()}_setupRenderer(){const t=new T_({antialias:!0,powerPreference:"high-performance"});t.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),t.setSize(window.innerWidth,window.innerHeight),t.shadowMap.enabled=!0,t.shadowMap.type=df,t.outputColorSpace=fi,t.toneMapping=bl,t.toneMappingExposure=1.05,t.info.autoReset=!1,this.container.appendChild(t.domElement),this.renderer=t,this.scene=new E_,this.scene.background=new pt(8898559),this.camera=new ui(60,window.innerWidth/window.innerHeight,.3,900),this.camera.position.set(0,6,-14),this._tmpV=new R,this._tmpQ=new ai,this._hudKarts=[]}_resize(){const t=window.innerWidth,e=window.innerHeight;this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.renderer.setSize(t,e),this.postfx.setSize(t,e)}_applyEnvironment(t){const e=t.environment??{};this.scene.background=e.background??new pt(8898559),this.scene.fog=e.fog?new Nl(e.fog.color,e.fog.near,e.fog.far):null}_loadMenuScene(){if(this._menuTrack)return;const t=us[Math.floor(Math.random()*us.length)].id;try{this._menuTrack=Ph(t),this.scene.add(this._menuTrack.group),this._applyEnvironment(this._menuTrack)}catch(e){console.error("[game] menu scene failed",e),this._menuTrack=null}}_unloadMenuScene(){var t,e;this._menuTrack&&(this.scene.remove(this._menuTrack.group),(e=(t=this._menuTrack).dispose)==null||e.call(t),this._menuTrack=null)}_setScreen(t){this.screen=t,this.events.emit(rt.SCREEN,{name:t})}_onKey(t){(t.code==="Escape"||t.code==="KeyP")&&this.screen==="race"&&this.togglePause(),t.code==="KeyM"&&this.events.emit(rt.UI_MUTE_TOGGLE)}debugApi(){const t=this;return{get ready(){return t.ready},get screen(){return t.screen},get fps(){return t._fps},tracks:()=>us.map(e=>e.id),characters:()=>cs.map(e=>e.id),startRace:e=>t.startRace(e??{}),showTitle:()=>t.showTitle(),showSelect:()=>t.showSelect(),pause:e=>t.togglePause(e),setInput:e=>{t._debugInput=e||null},skipCountdown:()=>{t.race&&(t.race.manager.countdown=.01)},step:(e=1,i=1/60)=>{if(!t.race||t.screen!=="race")return 0;const n=Math.max(1,Math.round(e/i)),r=performance.now();for(let a=0;a<n&&t.screen==="race";a++)t.time+=i,t._updateRace(i),t.fx.update(i,t.camera);return(performance.now()-r)/n},teleport:(e,i=0)=>{if(!t.race)return;const n=t.race.track.respawnPoint(e);if(i){const r=t.race.track.sample(e);n.position.addScaledVector(r.right,i)}t.race.playerKart.reset(n.position,n.heading)},internals:()=>t,giveItem:e=>{t.race&&(t.race.playerKart.item={id:e,count:1},t.race.playerKart.itemRoulette=null)},useItem:()=>t.race&&t.race.items.use(t.race.playerKart,{}),finishPlayer:()=>{var i;if(!t.race)return;const e=t.race.manager;(i=e.debugFinish)==null||i.call(e,t.race.playerKart)},state:()=>{var n;if(!t.race)return{screen:t.screen};const e=t.race,i=e.playerKart;return{screen:t.screen,phase:e.manager.phase,countdown:e.manager.countdown,time:e.manager.time,rank:e.manager.rankOf(i),lap:e.manager.lapOf(i),totalLaps:e.manager.totalLaps,progress:i.progress,pos:{x:+i.position.x.toFixed(2),y:+i.position.y.toFixed(2),z:+i.position.z.toFixed(2)},heading:i.heading,speed:i.speed,kmh:i.getSpeedKmh(),surface:(n=i.surface)==null?void 0:n.type,state:{...i.state},item:i.item??null,results:e.manager.results.map(r=>({name:r.kart.character.name,rank:r.rank,time:r.time,isPlayer:r.kart.isPlayer})),karts:e.karts.map(r=>{var a;return{name:r.character.name,rank:e.manager.rankOf(r),lap:e.manager.lapOf(r),progress:+r.progress.toFixed(3),speed:+r.speed.toFixed(1),surface:(a=r.surface)==null?void 0:a.type}}),drawCalls:t.renderer.info.render.calls,triangles:t.renderer.info.render.triangles}}}}}function K1(s){const t=["th","st","nd","rd"],e=s%100;return s+(t[(e-20)%10]||t[e]||t[0])}const fu=new Y1({container:document.getElementById("game"),uiRoot:document.getElementById("ui")});window.__game=fu.debugApi();fu.boot();
