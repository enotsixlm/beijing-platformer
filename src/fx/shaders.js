/** GLSL sources for the FX module. */

// ───────────────────────────── instanced billboard particles ─────────────────────────────
// Each instance: iPos (world), iSize (w,h metres), iColor (linear rgb), iAlpha, iRot (rad),
// iStretch (world direction; non-zero = align the quad's width axis with the projected direction).

export const PARTICLE_VERT = /* glsl */ `
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
`

export const PARTICLE_FRAG = /* glsl */ `
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
`

// ───────────────────────────── skid marks ─────────────────────────────

export const SKID_VERT = /* glsl */ `
attribute float alpha;
varying float vAlpha;
#include <fog_pars_vertex>
void main() {
  vAlpha = alpha;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`

export const SKID_FRAG = /* glsl */ `
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
`

// ───────────────────────────── star aura ─────────────────────────────

export const AURA_VERT = /* glsl */ `
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
`

export const AURA_FRAG = /* glsl */ `
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
`

// ───────────────────────────── post-processing (speed / vignette / CA) ─────────────────────────────

export const SPEED_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const SPEED_FRAG = /* glsl */ `
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
`
