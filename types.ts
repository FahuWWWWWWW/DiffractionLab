export interface DiffractionParams {
  wavelength: number; // in nanometers (nm)
  slitWidth: number; // in micrometers (um)
  distance: number; // in meters (m)
}

export interface DataPoint {
  position: number; // in mm
  intensityFresnel: number; // normalized 0-1
  intensityFraunhofer: number; // normalized 0-1
}

export enum Regime {
  FRESNEL = "菲涅尔 (近场)",
  FRAUNHOFER = "夫琅禾费 (远场)",
  TRANSITION = "过渡区域"
}