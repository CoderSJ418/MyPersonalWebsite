precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uPointerStrength;
varying vec2 vUv;

float ribbon(vec2 p, float offset, float phase, float width) {
  float wave = sin(p.x * 4.2 + phase) * uAmplitude;
  wave += sin(p.x * 8.0 - phase * 0.7) * (uAmplitude * 0.205);
  wave += (uPointer.y - 0.5) * uPointerStrength * exp(-3.0 * abs(p.x - (uPointer.x * 2.0 - 1.0)));
  float d = abs(p.y - wave - offset);
  return 1.0 - smoothstep(width, width + 0.035, d);
}

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  p.x *= uResolution.x / max(uResolution.y, 1.0);

  float t = uTime * uSpeed;
  float r1 = ribbon(p, 0.10, t, 0.14);
  float r2 = ribbon(p, -0.11, -t * 0.8 + 1.8, 0.10);
  float halo = ribbon(p, 0.02, t * 0.6 + 3.1, 0.28) * 0.16;

  vec3 base = vec3(0.965, 0.98, 1.0);
  vec3 blue = vec3(0.10, 0.36, 0.92);
  vec3 cyan = vec3(0.25, 0.72, 0.95);
  vec3 silver = vec3(0.72, 0.80, 0.92);
  float flow = 0.5 + 0.5 * sin((p.x + t) * 2.0);
  vec3 ribbonColor = mix(blue, cyan, flow);
  ribbonColor = mix(ribbonColor, silver, 0.18 + 0.16 * sin(t + p.x * 3.0));

  vec3 color = base;
  color = mix(color, ribbonColor, clamp(r1 * 0.92 + r2 * 0.74, 0.0, 1.0));
  color += vec3(0.10, 0.24, 0.50) * halo;

  float vignette = smoothstep(1.5, 0.2, length(p * vec2(0.72, 1.0)));
  color += vignette * 0.025;
  gl_FragColor = vec4(color, 1.0);
}
