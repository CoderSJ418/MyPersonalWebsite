/**
 * useStripeGradient — Stripe-accurate WebGL gradient animation
 *
 * Architecture: Vertex displacement + WaveLayer color mixing
 * Matches Stripe's actual implementation (reverse-engineered):
 * - Subdivided mesh plane with noise-driven vertex displacement
 * - Color mixing in vertex shader via WaveLayers (not fragment shader)
 * - Simple fragment shader (v_color + darken_top)
 * - CSS variable-driven color configuration
 * - Scroll-aware animation pausing
 *
 * Performance features:
 * - DPR-aware canvas sizing (capped at 2x)
 * - Resize debouncing (200ms)
 * - Visibility change detection (pauses when tab hidden)
 * - IntersectionObserver (pauses when offscreen)
 * - prefers-reduced-motion support (static fallback)
 * - Frame skipping (every other frame when not focused)
 * - Max delta time cap (prevents large time jumps)
 *
 * Based on Stripe's proprietary implementation and the open-source
 * analysis by smitpatelx (CodePen GRZayyO).
 */
import { onMounted, onUnmounted, type Ref } from 'vue'

// ═══════════════════════════════════════════════════════════════
// GLSL Shader Sources
// ═══════════════════════════════════════════════════════════════

/** Simplex 3D Noise — Ashima Arts / Ian McEwan */
const NOISE_SHADER = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`

/** Blend modes — only blendNormal is used in vertex shader */
const BLEND_SHADER = /* glsl */ `
vec3 blendNormal(vec3 base, vec3 blend) {
  return blend;
}

vec3 blendNormal(vec3 base, vec3 blend, float opacity) {
  return (blendNormal(base, blend) * opacity + base * (1.0 - opacity));
}
`

/**
 * Vertex shader — position only. Color is computed per-pixel in fragment shader.
 *
 * Key techniques:
 * - Plane tilt (front-to-back) + incline (left-to-right)
 * - Subtle smooth wave vertex displacement
 * - All color mixing moved to fragment shader for per-pixel smoothness
 */
const VERTEX_SHADER = /* glsl */ `
attribute vec4 position;
attribute vec2 uv;
attribute vec2 uvNorm;

varying vec2 v_uv;
varying vec2 v_uvNorm;

void main() {
  float time = u_time * u_global.noiseSpeed;
  v_uv = uv;
  v_uvNorm = uvNorm;

  // Subtle perspective tilt
  float tilt = resolution.y / 2.0 * uvNorm.y;
  float incline = resolution.x * uvNorm.x / 2.0 * u_vertDeform.incline;

  // Gentle wave displacement (ribbon-like, not noise bubbles)
  float w1 = sin(uvNorm.x * 3.0 + time * 0.7 + u_vertDeform.noiseSeed) * 0.5 + 0.5;
  float w2 = cos(uvNorm.y * 2.5 + time * 0.5) * 0.5 + 0.5;
  float w3 = sin((uvNorm.x + uvNorm.y) * 2.0 + time * 0.3) * 0.5 + 0.5;
  float displacement = w1 * w2 * w3 * u_vertDeform.noiseAmp * 0.03;
  displacement *= 1.0 - pow(abs(uvNorm.y), 1.5);

  vec3 pos = vec3(position.x, position.y + tilt + incline + displacement, position.z);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`

/**
 * Fragment shader — per-pixel color mixing with smooth wave ribbons.
 *
 * Colors are blended per-pixel (not per-vertex) for smooth gradients.
 * Each WaveLayer generates a smooth band pattern using sin/cos waves
 * concentrated with pow() to create Stripe-style flowing ribbons.
 */
const FRAGMENT_SHADER = /* glsl */
`
precision highp float;

varying vec2 v_uvNorm;

// Local blend functions (BLEND_SHADER is vertex-only)
vec3 blendNormal(vec3 base, vec3 blend) {
  return blend;
}
vec3 blendNormal(vec3 base, vec3 blend, float opacity) {
  return (blendNormal(base, blend) * opacity + base * (1.0 - opacity));
}

void main() {
  vec3 color = u_baseColor * u_active_colors[0];

  // Per-pixel wave-based color mixing (smooth ribbons, not noise)
  float time = u_time * 5e-6;
  for (int i = 0; i < u_waveLayers_length; i++) {
    if (u_active_colors[i + 1] == 1.0) {
      WaveLayers layer = u_waveLayers[i];
      float freq = layer.noiseFreq.x;
      float spd = layer.noiseSpeed * 0.01;
      float seed = layer.noiseSeed;

      float wave = sin(v_uvNorm.x * freq + time * spd + seed)
                 * cos(v_uvNorm.y * freq * 0.8 + time * spd * 0.7 + seed);
      wave = wave * 0.5 + 0.5;
      float intensity = pow(wave, 3.0);
      intensity *= 1.0 - pow(abs(v_uvNorm.y), 1.5);

      color = blendNormal(color, layer.color, intensity * 0.8);
    }
  }

  // Darken top (readability)
  if (u_darken_top == 1.0) {
    vec2 st = gl_FragCoord.xy / resolution.xy;
    color.g -= pow(st.y + sin(-12.0) * st.x, u_shadow_power) * 0.4;
  }

  gl_FragColor = vec4(color, 1.0);
}
`

// ═══════════════════════════════════════════════════════════════
// Color Utilities
// ═══════════════════════════════════════════════════════════════

/** Convert hex number to normalized [r, g, b] (0-1 range) */
function normalizeColor(hexCode: number): [number, number, number] {
  return [
    ((hexCode >> 16) & 255) / 255,
    ((hexCode >> 8) & 255) / 255,
    (255 & hexCode) / 255,
  ]
}

/** Parse CSS hex color string to normalized [r, g, b] */
function parseHexColor(hex: string): [number, number, number] | null {
  const cleaned = hex.trim().replace('#', '')
  if (cleaned.length !== 6 && cleaned.length !== 3) return null
  const expanded = cleaned.length === 3
    ? cleaned.split('').map(c => c + c).join('')
    : cleaned
  const num = parseInt(expanded, 16)
  if (isNaN(num)) return null
  return normalizeColor(num)
}

// ═══════════════════════════════════════════════════════════════
// MiniGl — Lightweight WebGL Abstraction
// ═══════════════════════════════════════════════════════════════

/** Vertex attribute buffer wrapper */
class Attribute {
  type: number
  normalized: boolean
  buffer: WebGLBuffer
  target: number
  size: number
  values: Float32Array | Uint16Array | null = null

  constructor(gl: WebGLRenderingContext, opts: { target: number; size: number; type?: number }) {
    this.type = opts.type ?? gl.FLOAT
    this.normalized = false
    this.buffer = gl.createBuffer()!
    this.target = opts.target
    this.size = opts.size
  }

  update(gl: WebGLRenderingContext) {
    if (this.values) {
      gl.bindBuffer(this.target, this.buffer)
      gl.bufferData(this.target, this.values, gl.STATIC_DRAW)
    }
  }

  attach(gl: WebGLRenderingContext, name: string, program: WebGLProgram): number {
    const loc = gl.getAttribLocation(program, name)
    if (this.target === gl.ARRAY_BUFFER) {
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, this.size, this.type, this.normalized, 0, 0)
    }
    return loc
  }

  use(gl: WebGLRenderingContext, loc: number) {
    gl.bindBuffer(this.target, this.buffer)
    if (this.target === gl.ARRAY_BUFFER) {
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, this.size, this.type, this.normalized, 0, 0)
    }
  }
}

/** Subdivided plane geometry for vertex displacement */
class PlaneGeometry {
  width = 0
  height = 0
  xSegCount = 1
  ySegCount = 1
  vertexCount = 0
  attributes: {
    position: Attribute
    uv: Attribute
    uvNorm: Attribute
    index: Attribute
  }

  constructor(private gl: WebGLRenderingContext) {
    this.attributes = {
      position: new Attribute(gl, { target: gl.ARRAY_BUFFER, size: 3 }),
      uv: new Attribute(gl, { target: gl.ARRAY_BUFFER, size: 2 }),
      uvNorm: new Attribute(gl, { target: gl.ARRAY_BUFFER, size: 2 }),
      index: new Attribute(gl, {
        target: gl.ELEMENT_ARRAY_BUFFER,
        size: 3,
        type: gl.UNSIGNED_SHORT,
      }),
    }
  }

  setTopology(xSegs: number, ySegs: number) {
    this.xSegCount = xSegs
    this.ySegCount = ySegs
    this.vertexCount = (xSegs + 1) * (ySegs + 1)
    const quadCount = xSegs * ySegs * 2

    this.attributes.uv.values = new Float32Array(2 * this.vertexCount)
    this.attributes.uvNorm.values = new Float32Array(2 * this.vertexCount)
    this.attributes.index.values = new Uint16Array(3 * quadCount)

    for (let y = 0; y <= ySegs; y++) {
      for (let x = 0; x <= xSegs; x++) {
        const i = y * (xSegs + 1) + x
        this.attributes.uv.values[2 * i] = x / xSegs
        this.attributes.uv.values[2 * i + 1] = 1 - y / ySegs
        this.attributes.uvNorm.values[2 * i] = (x / xSegs) * 2 - 1
        this.attributes.uvNorm.values[2 * i + 1] = 1 - (y / ySegs) * 2

        if (x < xSegs && y < ySegs) {
          const q = y * xSegs + x
          this.attributes.index.values[6 * q] = i
          this.attributes.index.values[6 * q + 1] = i + 1 + xSegs
          this.attributes.index.values[6 * q + 2] = i + 1
          this.attributes.index.values[6 * q + 3] = i + 1
          this.attributes.index.values[6 * q + 4] = i + 1 + xSegs
          this.attributes.index.values[6 * q + 5] = i + 2 + xSegs
        }
      }
    }

    this.attributes.uv.update(this.gl)
    this.attributes.uvNorm.update(this.gl)
    this.attributes.index.update(this.gl)
  }

  setSize(width: number, height: number) {
    this.width = width
    this.height = height

    if (
      !this.attributes.position.values ||
      this.attributes.position.values.length !== 3 * this.vertexCount
    ) {
      this.attributes.position.values = new Float32Array(3 * this.vertexCount)
    }

    const halfW = width / -2
    const halfH = height / -2
    const segW = width / this.xSegCount
    const segH = height / this.ySegCount

    for (let y = 0; y <= this.ySegCount; y++) {
      const yPos = halfH + y * segH
      for (let x = 0; x <= this.xSegCount; x++) {
        const xPos = halfW + x * segW
        const i = y * (this.xSegCount + 1) + x
        // orientation: "xy" → position.x = xPos, position.y = -yPos
        this.attributes.position.values[3 * i] = xPos
        this.attributes.position.values[3 * i + 1] = -yPos
      }
    }

    this.attributes.position.update(this.gl)
  }
}

/** Uniform wrapper — handles GLSL type mapping and updates */
class Uniform {
  type: string
  value: unknown
  typeFn: string
  excludeFrom?: string
  private gl: WebGLRenderingContext

  constructor(gl: WebGLRenderingContext, opts: { type?: string; value: unknown; excludeFrom?: string }) {
    this.gl = gl
    this.type = opts.type ?? 'float'
    this.value = opts.value
    this.excludeFrom = opts.excludeFrom
    this.typeFn = ({
      float: '1f',
      int: '1i',
      vec2: '2fv',
      vec3: '3fv',
      vec4: '4fv',
      mat4: 'Matrix4fv',
    } as Record<string, string>)[this.type] ?? '1f'
  }

  update(location: WebGLUniformLocation | null) {
    if (location === null || this.value === undefined) return
    const fn = `uniform${this.typeFn}` as keyof WebGLRenderingContext
    if (this.typeFn.indexOf('Matrix') === 0) {
      ; (this.gl[fn] as WebGLRenderingContext[keyof WebGLRenderingContext])(location, false, this.value)
    } else {
      ; (this.gl[fn] as WebGLRenderingContext[keyof WebGLRenderingContext])(location, this.value)
    }
  }

  /** Generate GLSL uniform declaration string */
  getDeclaration(name: string, type: 'vertex' | 'fragment', length = 0): string {
    if (this.excludeFrom === type) return ''

    if (this.type === 'array') {
      return (
        this.value[0].getDeclaration(name, type, this.value.length) +
        `\nconst int ${name}_length = ${this.value.length};`
      )
    }

    if (this.type === 'struct') {
      let structName = name.replace('u_', '')
      structName = structName.charAt(0).toUpperCase() + structName.slice(1)
      return (
        `uniform struct ${structName} {\n` +
        Object.entries(this.value)
          .map(([key, uniform]) =>
            (uniform as Uniform).getDeclaration(key, type).replace(/^uniform/, '')
          )
          .join('') +
        `\n} ${name}${length > 0 ? `[${length}]` : ''};`
      )
    }

    return `uniform ${this.type} ${name}${length > 0 ? `[${length}]` : ''};`
  }
}

/** Shader material — compiles vertex + fragment shaders, manages uniforms */
class Material {
  program: WebGLProgram
  uniforms: Record<string, Uniform>
  uniformInstances: { uniform: Uniform; location: WebGLUniformLocation | null }[] = []

  constructor(
    private gl: WebGLRenderingContext,
    vertexSource: string,
    fragmentSource: string,
    uniforms: Record<string, Uniform>,
    commonUniforms: Record<string, Uniform>
  ) {
    this.uniforms = uniforms

    const prefix = '\nprecision highp float;\n'

    // Build uniform declarations
    const buildDecls = (u: Record<string, Uniform>, type: 'vertex' | 'fragment') =>
      Object.entries(u).map(([n, u]) => u.getDeclaration(n, type)).join('\n')

    const fullVert = `${prefix}\n${buildDecls(commonUniforms, 'vertex')}\n${buildDecls(uniforms, 'vertex')}\n${vertexSource}`
    const fullFrag = `${prefix}\n${buildDecls(commonUniforms, 'fragment')}\n${buildDecls(uniforms, 'fragment')}\n${fragmentSource}`

    const vs = this.compileShader(gl.VERTEX_SHADER, fullVert, 'vertex')
    const fs = this.compileShader(gl.FRAGMENT_SHADER, fullFrag, 'fragment')

    this.program = gl.createProgram()!
    gl.attachShader(this.program, vs)
    gl.attachShader(this.program, fs)
    gl.linkProgram(this.program)

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error('[StripeGradient] Program link error:', gl.getProgramInfoLog(this.program))
    }

    gl.useProgram(this.program)
    this.attachUniforms(commonUniforms)
    this.attachUniforms(uniforms)
  }

  private compileShader(type: number, source: string, label: string): WebGLShader {
    const shader = this.gl.createShader(type)!
    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const log = this.gl.getShaderInfoLog(shader)
      console.error(`[StripeGradient] ${label} compile error:`, log)
      // Print first 500 chars of source for debugging
      console.error(`[StripeGradient] ${label} source (first 1000 chars):\n`, source.substring(0, 1000))
    }
    return shader
  }

  private attachUniforms(uniforms: Record<string, Uniform>, name?: string) {
    for (const [key, uniform] of Object.entries(uniforms)) {
      const fullName = name ? `${name}.${key}` : key
      if (uniform.type === 'array') {
        uniform.value.forEach((u: Uniform, i: number) => {
          this.attachUniforms({ [`${fullName}[${i}]`]: u })
        })
      } else if (uniform.type === 'struct') {
        const nested: Record<string, Uniform> = {}
        for (const [k, v] of Object.entries(uniform.value)) {
          nested[k] = v as Uniform
        }
        this.attachUniforms(nested, fullName)
      } else {
        const loc = this.gl.getUniformLocation(this.program, fullName)
        this.uniformInstances.push({ uniform, location: loc })
      }
    }
  }
}

/** Mesh — ties geometry + material, handles drawing */
class Mesh {
  attributeInstances: { attribute: Attribute; location: number }[] = []

  constructor(
    private gl: WebGLRenderingContext,
    public geometry: PlaneGeometry,
    public material: Material
  ) {
    for (const [name, attr] of Object.entries(geometry.attributes)) {
      this.attributeInstances.push({
        attribute: attr,
        location: attr.attach(gl, name, material.program),
      })
    }
  }

  draw() {
    this.gl.useProgram(this.material.program)
    for (const { uniform, location } of this.material.uniformInstances) {
      uniform.update(location)
    }
    for (const { attribute, location } of this.attributeInstances) {
      attribute.use(this.gl, location)
    }
    this.gl.drawElements(
      this.gl.TRIANGLES,
      this.geometry.attributes.index.values!.length,
      this.gl.UNSIGNED_SHORT,
      0
    )
  }
}

/** MiniGl — WebGL context manager */
class MiniGl {
  gl: WebGLRenderingContext
  meshes: Mesh[] = []
  commonUniforms: Record<string, Uniform>

  constructor(public canvas: HTMLCanvasElement) {
    this.gl =
      canvas.getContext('webgl', { antialias: true }) as WebGLRenderingContext ??
      canvas.getContext('webgl2', { antialias: true }) as WebGLRenderingContext

    const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    this.commonUniforms = {
      projectionMatrix: new Uniform(this.gl, { type: 'mat4', value: identity }),
      modelViewMatrix: new Uniform(this.gl, { type: 'mat4', value: identity }),
      resolution: new Uniform(this.gl, { type: 'vec2', value: [1, 1] }),
      aspectRatio: new Uniform(this.gl, { type: 'float', value: 1 }),
    }
  }

  setSize(width: number, height: number) {
    this.canvas.width = width
    this.canvas.height = height
    this.gl.viewport(0, 0, width, height)
    this.commonUniforms.resolution.value = [width, height]
    this.commonUniforms.aspectRatio.value = width / height
  }

  setOrthographicCamera() {
    const w = this.canvas.width
    const h = this.canvas.height
    this.commonUniforms.projectionMatrix.value = [
      2 / w, 0, 0, 0,
      0, 2 / h, 0, 0,
      0, 0, 1, 0,     // simplified z range
      0, 0, 0, 1,
    ]
  }

  render() {
    this.gl.clearColor(0, 0, 0, 0)
    this.gl.clearDepth(1)
    for (const mesh of this.meshes) {
      mesh.draw()
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// Gradient — Stripe Gradient Controller
// ═══════════════════════════════════════════════════════════════

interface GradientConfig {
  wireframe?: boolean
  density: [number, number]
  zoom?: number
  rotation?: number
  playing: boolean
}

class Gradient {
  minigl!: MiniGl
  mesh!: Mesh
  geometry!: PlaneGeometry
  material!: Material
  uniforms!: Record<string, Uniform>
  sectionColors: [number, number, number][] = []
  computedCanvasStyle!: CSSStyleDeclaration
  conf: GradientConfig

  // Animation state
  t = 1253106  // Large offset for visual variety (matches Stripe)
  last = 0
  isScrolling = false
  scrollingTimeout: ReturnType<typeof setTimeout> | null = null
  isIntersecting = true
  isLoadedClass = false

  // Stripe-default params
  amp = 320
  seed = 5
  freqX = 14e-5
  freqY = 29e-5
  activeColors: number[] = [1, 1, 1, 1]

  // Scroll debounce
  scrollingRefreshDelay = 200

  constructor(
    private canvas: HTMLCanvasElement,
    private container: HTMLElement,
    private options: StripeGradientOptions
  ) {
    this.conf = {
      wireframe: false,
      density: options.density ?? [0.06, 0.16],
      zoom: 1,
      rotation: 0,
      playing: true,
    }
  }

  /** Initialize the gradient — call after canvas is in DOM */
  connect() {
    this.computedCanvasStyle = getComputedStyle(this.canvas)
    this.waitForCssVars()
  }

  /** Wait for CSS variables to be available (polling with max retries) */
  private waitForCssVars(retries = 0) {
    const maxRetries = 200
    if (
      this.computedCanvasStyle &&
      this.computedCanvasStyle.getPropertyValue('--gradient-color-1').indexOf('#') !== -1
    ) {
      this.init()
      return
    }
    if (retries > maxRetries) {
      // Fallback colors if CSS vars not found
      this.sectionColors = [
        normalizeColor(0x6366f2), // indigo
        normalizeColor(0x3b82f6), // blue
        normalizeColor(0x05b5d4), // cyan
        normalizeColor(0x8c5cf5), // violet
      ]
      this.init()
      return
    }
    requestAnimationFrame(() => this.waitForCssVars(retries + 1))
  }

  /** Read gradient colors from CSS custom properties */
  private initGradientColors() {
    const cssVars = [
      '--gradient-color-1',
      '--gradient-color-2',
      '--gradient-color-3',
      '--gradient-color-4',
    ]

    this.sectionColors = cssVars
      .map((varName) => {
        let hex = this.computedCanvasStyle.getPropertyValue(varName).trim()
        // Handle shorthand hex (#abc → #aabbcc)
        if (hex.length === 4) {
          hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
        }
        if (hex && hex.startsWith('#')) {
          return parseHexColor(hex)
        }
        return null
      })
      .filter((c): c is [number, number, number] => c !== null)

    if (this.sectionColors.length === 0) {
      // Fallback
      this.sectionColors = [
        normalizeColor(0x6366f2),
        normalizeColor(0x3b82f6),
        normalizeColor(0x05b5d4),
        normalizeColor(0x8c5cf5),
      ]
    }
  }

  /** Create shader material with all uniforms */
  private initMaterial() {
    const gl = this.minigl.gl
    const angle = 0 // base angle

    this.uniforms = {
      u_time: new Uniform(gl, { value: 0 }),
      u_shadow_power: new Uniform(gl, { value: this.canvas.width < 600 ? 5 : 6 }),
      u_darken_top: new Uniform(gl, {
        value: this.options.darkenTop ? 1 : 0,
      }),
      u_active_colors: new Uniform(gl, {
        type: 'vec4',
        value: this.activeColors,
      }),
      u_global: new Uniform(gl, {
        type: 'struct',
        value: {
          noiseFreq: new Uniform(gl, { type: 'vec2', value: [this.freqX, this.freqY] }),
          noiseSpeed: new Uniform(gl, { value: 5e-6 }),
        },
      }),
      u_vertDeform: new Uniform(gl, {
        type: 'struct',
        value: {
          incline: new Uniform(gl, {
            value: Math.sin(angle) / Math.cos(angle) || 0,
          }),
          offsetTop: new Uniform(gl, { value: -0.5 }),
          offsetBottom: new Uniform(gl, { value: -0.5 }),
          noiseFreq: new Uniform(gl, { type: 'vec2', value: [3, 4] }),
          noiseAmp: new Uniform(gl, { value: this.amp }),
          noiseSpeed: new Uniform(gl, { value: 10 }),
          noiseFlow: new Uniform(gl, { value: 3 }),
          noiseSeed: new Uniform(gl, { value: this.seed }),
        },
        excludeFrom: 'fragment',
      }),
      u_baseColor: new Uniform(gl, {
        type: 'vec3',
        value: this.sectionColors[0],
      }),
      u_waveLayers: new Uniform(gl, {
        type: 'array',
        value: this.sectionColors.slice(1).map((color, i) => {
          const layerIndex = i + 1
          return new Uniform(gl, {
            type: 'struct',
            value: {
              color: new Uniform(gl, { type: 'vec3', value: color }),
              noiseFreq: new Uniform(gl, {
                type: 'vec2',
                value: [
                  2 + layerIndex / this.sectionColors.length,
                  3 + layerIndex / this.sectionColors.length,
                ],
              }),
              noiseSpeed: new Uniform(gl, { value: 11 + 0.3 * layerIndex }),
              noiseFlow: new Uniform(gl, { value: 6.5 + 0.3 * layerIndex }),
              noiseSeed: new Uniform(gl, { value: this.seed + 10 * layerIndex }),
              noiseFloor: new Uniform(gl, { value: 0.1 }),
              noiseCeil: new Uniform(gl, { value: 0.63 + 0.07 * layerIndex }),
            },
          })
        }),
      }),
    }

    // Combine shaders: noise + blend + vertex → full vertex shader
    const vertexSource = [NOISE_SHADER, BLEND_SHADER, VERTEX_SHADER].join('\n\n')

    this.material = new Material(
      gl,
      vertexSource,
      FRAGMENT_SHADER,
      this.uniforms,
      this.minigl.commonUniforms
    )
  }

  /** Create geometry and mesh */
  private initMesh() {
    this.material = this.initMaterial() || this.material
    this.geometry = new PlaneGeometry(this.minigl.gl)
    this.mesh = new Mesh(this.minigl.gl, this.geometry, this.material)
    this.minigl.meshes.push(this.mesh)
  }

  /** Main initialization */
  private init() {
    this.initGradientColors()

    this.minigl = new MiniGl(this.canvas)
    this.initMesh()
    this.resize()

    // Mark loaded
    this.isLoadedClass = true
    this.canvas.classList.add('isLoaded')
  }

  /** Handle resize — recalculate mesh density and geometry */
  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = this.container.getBoundingClientRect()
    const w = rect.width
    const h = rect.height

    // Cap render resolution
    const maxW = (this.options.maxRenderWidth ?? 1920) * dpr
    const maxH = (this.options.maxRenderHeight ?? 1080) * dpr
    const canvasW = Math.min(w * dpr, maxW)
    const canvasH = Math.min(h * dpr, maxH)

    this.minigl.setSize(canvasW, canvasH)
    this.minigl.setOrthographicCamera()

    this.canvas.style.width = `${w}px`
    this.canvas.style.height = `${h}px`

    // Dynamic mesh subdivision based on density
    const xSegs = Math.ceil(w * this.conf.density[0])
    const ySegs = Math.ceil(h * this.conf.density[1])

    this.mesh.geometry.setTopology(xSegs, ySegs)
    this.mesh.geometry.setSize(canvasW, canvasH)

    this.mesh.material.uniforms.u_shadow_power.value = w < 600 ? 5 : 6
  }

  /** Should we skip this frame? (performance optimization) */
  private shouldSkipFrame(e: number): boolean {
    return !!document.hidden || !this.conf.playing || parseInt(String(e), 10) % 2 === 0
  }

  /** Animation loop */
  animate = (e: number) => {
    if (!this.shouldSkipFrame(e)) {
      // Cap delta time to prevent large jumps
      this.t += Math.min(e - this.last, 1e3 / 15)
      this.last = e

      this.mesh.material.uniforms.u_time.value = this.t
      this.minigl.render()
    }

    if (this.conf.playing) {
      requestAnimationFrame(this.animate)
    }
  }

  pause() {
    this.conf.playing = false
  }

  play() {
    if (!this.conf.playing) {
      this.conf.playing = true
      requestAnimationFrame(this.animate)
    }
  }

  /** Handle scroll — pause during scroll, resume after */
  handleScroll = () => {
    clearTimeout(this.scrollingTimeout)
    this.scrollingTimeout = setTimeout(() => {
      this.isScrolling = false
      if (this.isIntersecting) this.play()
    }, this.scrollingRefreshDelay)

    if (this.conf.playing) {
      this.isScrolling = true
      this.pause()
    }
  }

  /** Disconnect and cleanup */
  disconnect() {
    this.pause()
    if (this.minigl) {
      // WebGL resources are garbage collected with context
      this.minigl.meshes = []
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// Vue Composable
// ═══════════════════════════════════════════════════════════════

export interface StripeGradientOptions {
  /** Vertex noise amplitude (default: 320) */
  amp?: number
  /** Noise seed for variety (default: 5) */
  seed?: number
  /** Mesh subdivision density [x, y] (default: [0.06, 0.16]) */
  density?: [number, number]
  /** Darken top for text readability (default: true) */
  darkenTop?: boolean
  /** Max render width in physical pixels (default: 1920) */
  maxRenderWidth?: number
  /** Max render height in physical pixels (default: 1080) */
  maxRenderHeight?: number
}

/**
 * useStripeGradient — Stripe-accurate WebGL gradient background
 *
 * Uses vertex displacement + WaveLayer color mixing to recreate
 * Stripe's signature flowing gradient effect.
 *
 * Colors are driven by CSS custom properties on the canvas element:
 *   --gradient-color-1 through --gradient-color-4
 *
 * @example
 * ```vue
 * <canvas ref="canvasRef" class="hero__mesh-canvas"
 *   style="--gradient-color-1: #6366f2; --gradient-color-2: #3b82f6;
 *          --gradient-color-3: #05b5d4; --gradient-color-4: #8c5cf5" />
 * ```
 */
export function useStripeGradient(
  containerRef: Ref<HTMLElement | null>,
  canvasRef: Ref<HTMLCanvasElement | null>,
  options: StripeGradientOptions = {}
) {
  let gradient: Gradient | null = null
  let visibilityObserver: IntersectionObserver | null = null
  let resizeTimeout: ReturnType<typeof setTimeout> | null = null
  let darkModeObserver: MutationObserver | null = null

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const handleResize = () => {
    if (resizeTimeout) clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      gradient?.resize()
    }, 250)
  }

  const handleVisibilityChange = () => {
    if (document.hidden) {
      gradient?.pause()
    } else if (gradient?.isIntersecting) {
      gradient?.play()
    }
  }

  const start = () => {
    if (prefersReducedMotion()) return

    const canvas = canvasRef.value
    const container = containerRef.value
    if (!canvas || !container) return

    // Create gradient controller
    gradient = new Gradient(canvas, container, options)
    gradient.connect()

    // Wait for gradient to initialize, then start animation
    const waitForInit = () => {
      if (gradient?.isLoadedClass) {
        requestAnimationFrame(gradient.animate)
      } else {
        requestAnimationFrame(waitForInit)
      }
    }
    requestAnimationFrame(waitForInit)

    // Scroll handler — pause during scroll
    window.addEventListener('scroll', gradient.handleScroll, { passive: true })

    // IntersectionObserver — pause when offscreen
    visibilityObserver = new IntersectionObserver(
      (entries) => {
        const intersecting = entries[0]?.isIntersecting ?? true
        if (gradient) gradient.isIntersecting = intersecting
        if (intersecting) gradient?.play()
        else gradient?.pause()
      },
      { threshold: 0 }
    )
    visibilityObserver.observe(container)

    // Tab visibility
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Dark mode observer — reinitialize colors on theme change
    darkModeObserver = new MutationObserver(() => {
      if (gradient?.isLoadedClass) {
        gradient.initGradientColors()
        // Update base color and wave layers
        if (gradient.uniforms) {
          gradient.uniforms.u_baseColor.value = gradient.sectionColors[0]
          // Rebuild wave layers
          const waveLayers = gradient.sectionColors.slice(1).map((color, i) => {
            const layerIndex = i + 1
            const gl = gradient!.minigl.gl
            return new Uniform(gl, {
              type: 'struct',
              value: {
                color: new Uniform(gl, { type: 'vec3', value: color }),
                noiseFreq: new Uniform(gl, {
                  type: 'vec2',
                  value: [
                    2 + layerIndex / gradient!.sectionColors.length,
                    3 + layerIndex / gradient!.sectionColors.length,
                  ],
                }),
                noiseSpeed: new Uniform(gl, { value: 11 + 0.3 * layerIndex }),
                noiseFlow: new Uniform(gl, { value: 6.5 + 0.3 * layerIndex }),
                noiseSeed: new Uniform(gl, { value: gradient!.seed + 10 * layerIndex }),
                noiseFloor: new Uniform(gl, { value: 0.1 }),
                noiseCeil: new Uniform(gl, { value: 0.63 + 0.07 * layerIndex }),
              },
              excludeFrom: 'fragment',
            })
          })
          gradient.uniforms.u_waveLayers.value = waveLayers
        }
      }
    })
    darkModeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    // Resize handler
    window.addEventListener('resize', handleResize, { passive: true })
  }

  const stop = () => {
    gradient?.disconnect()

    const scrollHandler = gradient?.handleScroll
    gradient = null

    if (visibilityObserver) {
      visibilityObserver.disconnect()
      visibilityObserver = null
    }
    if (darkModeObserver) {
      darkModeObserver.disconnect()
      darkModeObserver = null
    }

    if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('resize', handleResize)

    if (resizeTimeout) clearTimeout(resizeTimeout)
  }

  onMounted(() => start())
  onUnmounted(() => stop())
}