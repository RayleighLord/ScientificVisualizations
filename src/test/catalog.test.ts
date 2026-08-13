import { describe, expect, it } from "vitest";

import { visualizations } from "../catalog";

const expectedIds = [
  "hydrogen-atom",
  "harmonic-oscillator",
  "double-slit",
  "square-membrane-modes",
  "circular-membrane-modes",
  "oscillating-membranes",
  "acoustic-duct-modes",
  "heat-equation",
  "2d-ising-model",
  "earth-geoid",
];

const expectedTitles = [
  "Hydrogen Atom",
  "Harmonic Oscillator",
  "Double Slit",
  "Square Membrane Modes",
  "Circular Membrane Modes",
  "Oscillating Membranes",
  "Acoustic Duct Modes",
  "Heat Equation",
  "2D Ising Model",
  "Earth Geoid",
];

const expectedUrls = [
  "https://rayleighlord.github.io/HydrogenAtomSpectrum/",
  "https://rayleighlord.github.io/HarmonicOscillator/",
  "https://rayleighlord.github.io/DoubleSlit/",
  "https://rayleighlord.github.io/SquarePlateModes/",
  "https://rayleighlord.github.io/CircularMembraneModes/",
  "https://rayleighlord.github.io/OscillatingMembranes/",
  "https://rayleighlord.github.io/AcousticDuctModes/",
  "https://rayleighlord.github.io/HeatEquation/",
  "https://rayleighlord.github.io/2DIsingModel/",
  "https://rayleighlord.github.io/EarthGeoidRepresentation/",
];

const expectedDescriptions = [
  "Explore Hydrogen energy levels and its associated wavefunctions.",
  "Visualize the energy eigenstates of the quantum harmonic oscillator.",
  "The classical experiment that allows you to explore diffraction-pattern formation as a function of the incoming wave frequency.",
  "Explore the natural frequencies and animated vibration modes of a square membrane with fixed edges.",
  "Explore the natural frequencies and animated vibration modes of a circular membrane with fixed edges.",
  "Explore the vibration modes of arbitrary membrane shapes drawn by hand.",
  "Visualize the acoustic modes propagating inside a rigid cylindrical duct.",
  "Study the temperature evolution of a 1D rod, explore its Fourier content, and insert any user-defined profile.",
  "Explore spin domains and thermodynamic observables across the two-dimensional Ising phase transition.",
  "Earth is not a perfect sphere. Explore its actual geoid shape by breaking down its different contributions.",
];

describe("visualization catalog", () => {
  it("keeps the approved ten-card order", () => {
    expect(visualizations.map(({ id }) => id)).toEqual(expectedIds);
    expect(visualizations.map(({ title }) => title)).toEqual(expectedTitles);
  });

  it("uses the canonical deployed application URLs", () => {
    expect(visualizations.map(({ url }) => url)).toEqual(expectedUrls);
  });

  it("uses the approved card descriptions", () => {
    expect(visualizations.map(({ description }) => description)).toEqual(expectedDescriptions);
  });

  it("keeps identifiers unique and URL-safe", () => {
    expect(new Set(visualizations.map(({ id }) => id)).size).toBe(visualizations.length);
    expect(visualizations.every(({ id }) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))).toBe(
      true,
    );
  });

  it("points every card at its corresponding local WebP preview", () => {
    expect(visualizations.map(({ preview }) => preview)).toEqual(
      expectedIds.map((id) => `./previews/${id}.webp`),
    );
  });

  it("provides concise learner-facing content and valid accent colors", () => {
    for (const visualization of visualizations) {
      expect(visualization.title.trim()).not.toBe("");
      expect(visualization.description.trim()).not.toBe("");
      expect(visualization.description.length).toBeLessThan(150);
      expect(visualization.accent).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});
