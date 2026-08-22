import React, { useEffect, useRef } from 'react';

export const ShaderBackground: React.FC<{ opacity?: number }> = ({ opacity = 0.85 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y;

        vec2 mouse = u_mouse / u_resolution.xy;
        mouse.x *= u_resolution.x / u_resolution.y;

        float t = u_time * 0.15;
        
        // Deep background palette
        vec3 color1 = vec3(0.067, 0.075, 0.098); // #111319 deep space
        vec3 color2 = vec3(0.118, 0.122, 0.149); // #1e1f26
        vec3 color3 = vec3(0.18, 0.15, 0.32);    // Indigo purple glow
        vec3 color4 = vec3(0.08, 0.22, 0.35);    // Cyan pulse

        // Flow field noise
        float n1 = sin(st.x * 2.2 + t + sin(st.y * 3.1 + t * 0.8)) * 0.5 + 0.5;
        float n2 = cos(st.y * 2.5 - t * 1.2 + cos(st.x * 2.8 - t * 0.5)) * 0.5 + 0.5;
        
        // Dynamic cursor influence
        float distToMouse = length(st - mouse);
        float mouseGlow = exp(-distToMouse * 3.5) * 0.35;

        // Blending
        vec3 color = mix(color1, color2, n1 * 0.8);
        color = mix(color, color3, pow(n2, 2.5) * 0.45);
        color = mix(color, color4, pow(n1 * n2, 2.0) * 0.35 + mouseGlow);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const positionLocation = gl.getAttribLocation(program, 'position');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    let mouseX = window.innerWidth * 0.5;
    let mouseY = window.innerHeight * 0.5;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = window.innerHeight - e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', resize);
    resize();

    let animationFrameId: number;
    const startTime = performance.now();

    const render = () => {
      if (!gl || !canvas) return;
      gl.useProgram(program);

      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, (performance.now() - startTime) * 0.001);
      gl.uniform2f(mouseLocation, mouseX * (canvas.width / window.innerWidth), mouseY * (canvas.height / window.innerHeight));

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full transition-opacity duration-1000"
      style={{ opacity }}
    />
  );
};
