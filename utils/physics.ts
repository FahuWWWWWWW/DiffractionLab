// Numerical integration for Fresnel Integrals C(u) and S(u)
// Using Simpson's rule or simple Riemann sum for performance in JS
const integrateFresnel = (u: number): { C: number; S: number } => {
  const steps = 100;
  let C = 0;
  let S = 0;
  const dt = u / steps;

  for (let i = 0; i <= steps; i++) {
    const t = i * dt;
    const weight = (i === 0 || i === steps) ? 0.5 : 1;
    const argument = (Math.PI * t * t) / 2;
    C += weight * Math.cos(argument);
    S += weight * Math.sin(argument);
  }
  
  return { C: C * dt, S: S * dt };
};

export const calculateIntensity = (
  x_mm: number, // Position on screen in mm
  wavelength_nm: number,
  slitWidth_um: number,
  distance_m: number
) => {
  // Convert units to SI (meters) for calculation
  const lambda = wavelength_nm * 1e-9;
  const a = slitWidth_um * 1e-6;
  const z = distance_m;
  const x = x_mm * 1e-3;

  // --- Fraunhofer Calculation (Far Field Approximation) ---
  // I = I0 * (sin(beta)/beta)^2, where beta = (pi * a * x) / (lambda * z)
  let fraunhofer = 0;
  if (x === 0) {
    fraunhofer = 1;
  } else {
    const beta = (Math.PI * a * x) / (lambda * z);
    const sinc = Math.sin(beta) / beta;
    fraunhofer = sinc * sinc;
  }

  // --- Fresnel Calculation (General Case) ---
  // Using the Cornu Spiral approach
  // v1 = sqrt(2 / (lambda * z)) * (x - a/2)
  // v2 = sqrt(2 / (lambda * z)) * (x + a/2)
  
  const k = Math.sqrt(2 / (lambda * z));
  const v1 = k * (x - a / 2);
  const v2 = k * (x + a / 2);

  const int1 = integrateFresnel(v1);
  const int2 = integrateFresnel(v2);

  const dC = int2.C - int1.C;
  const dS = int2.S - int1.S;

  // Intensity is proportional to (dC^2 + dS^2)
  // We normalize later, but raw value is 0.5 * (dC^2 + dS^2) for standard normalization
  const fresnelRaw = 0.5 * (dC * dC + dS * dS);

  return {
    fraunhofer,
    fresnel: fresnelRaw
  };
};

export const wavelengthToColor = (wavelength: number): string => {
  let r, g, b, alpha;
  if (wavelength >= 380 && wavelength < 440) {
    r = -(wavelength - 440) / (440 - 380);
    g = 0.0;
    b = 1.0;
  } else if (wavelength >= 440 && wavelength < 490) {
    r = 0.0;
    g = (wavelength - 440) / (490 - 440);
    b = 1.0;
  } else if (wavelength >= 490 && wavelength < 510) {
    r = 0.0;
    g = 1.0;
    b = -(wavelength - 510) / (510 - 490);
  } else if (wavelength >= 510 && wavelength < 580) {
    r = (wavelength - 510) / (580 - 510);
    g = 1.0;
    b = 0.0;
  } else if (wavelength >= 580 && wavelength < 645) {
    r = 1.0;
    g = -(wavelength - 645) / (645 - 580);
    b = 0.0;
  } else if (wavelength >= 645 && wavelength < 781) {
    r = 1.0;
    g = 0.0;
    b = 0.0;
  } else {
    r = 0.0;
    g = 0.0;
    b = 0.0;
  }

  // Intensity correction
  if (wavelength >= 380 && wavelength < 420) {
    alpha = 0.3 + 0.7 * (wavelength - 380) / (420 - 380);
  } else if (wavelength >= 420 && wavelength < 701) {
    alpha = 1.0;
  } else if (wavelength >= 701 && wavelength < 781) {
    alpha = 0.3 + 0.7 * (781 - wavelength) / (781 - 701);
  } else {
    alpha = 0.0;
  }

  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`;
};

export const calculateFresnelNumber = (
  wavelength_nm: number,
  slitWidth_um: number,
  distance_m: number
) => {
    const a = slitWidth_um * 1e-6;
    const z = distance_m;
    const lambda = wavelength_nm * 1e-9;
    return (a * a) / (z * lambda);
}