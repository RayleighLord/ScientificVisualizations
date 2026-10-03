export interface Visualization {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly url: string;
  readonly preview: string;
  readonly accent: string;
}

export const visualizations: readonly Visualization[] = [
  {
    id: "hydrogen-atom",
    title: "Hydrogen Atom",
    description: "Explore Hydrogen energy levels and its associated wavefunctions.",
    url: "https://rayleighlord.github.io/HydrogenAtomSpectrum/",
    preview: "./previews/hydrogen-atom.webp",
    accent: "#a64b17",
  },
  {
    id: "harmonic-oscillator",
    title: "Harmonic Oscillator",
    description: "Visualize the energy eigenstates of the quantum harmonic oscillator.",
    url: "https://rayleighlord.github.io/HarmonicOscillator/",
    preview: "./previews/harmonic-oscillator.webp",
    accent: "#315f9f",
  },
  {
    id: "double-slit",
    title: "Double Slit",
    description:
      "The classical experiment that allows you to explore diffraction-pattern formation as a function of the incoming wave frequency.",
    url: "https://rayleighlord.github.io/DoubleSlit/",
    preview: "./previews/double-slit.webp",
    accent: "#a5453e",
  },
  {
    id: "square-membrane-modes",
    title: "Square Membrane Modes",
    description:
      "Explore the natural frequencies and animated vibration modes of a square membrane with fixed edges.",
    url: "https://rayleighlord.github.io/SquarePlateModes/",
    preview: "./previews/square-membrane-modes.webp",
    accent: "#87472f",
  },
  {
    id: "circular-membrane-modes",
    title: "Circular Membrane Modes",
    description:
      "Explore the natural frequencies and animated vibration modes of a circular membrane with fixed edges.",
    url: "https://rayleighlord.github.io/CircularMembraneModes/",
    preview: "./previews/circular-membrane-modes.webp",
    accent: "#006f86",
  },
  {
    id: "oscillating-membranes",
    title: "Oscillating Membranes",
    description: "Explore the vibration modes of arbitrary membrane shapes drawn by hand.",
    url: "https://rayleighlord.github.io/OscillatingMembranes/",
    preview: "./previews/oscillating-membranes.webp",
    accent: "#08776f",
  },
  {
    id: "acoustic-duct-modes",
    title: "Acoustic Duct Modes",
    description: "Visualize the acoustic modes propagating inside a rigid cylindrical duct.",
    url: "https://rayleighlord.github.io/AcousticDuctModes/",
    preview: "./previews/acoustic-duct-modes.webp",
    accent: "#5846b8",
  },
  {
    id: "wing-modes",
    title: "Wing Modes",
    description:
      "Explore the natural frequencies and animated vibration modes of an aircraft wing.",
    url: "https://rayleighlord.github.io/WingModes/",
    preview: "./previews/wing-modes.webp",
    accent: "#315f9f",
  },
  {
    id: "heat-equation",
    title: "Heat Equation",
    description:
      "Study the temperature evolution of a 1D rod, explore its Fourier content, and insert any user-defined profile.",
    url: "https://rayleighlord.github.io/HeatEquation/",
    preview: "./previews/heat-equation.webp",
    accent: "#00728b",
  },
  {
    id: "wave-equation",
    title: "Wave equation",
    description:
      "Explore the one-dimensional wave equation in infinite, semi-infinite, and finite domains.",
    url: "https://rayleighlord.github.io/WaveEquation/",
    preview: "./previews/wave-equation.webp",
    accent: "#16818a",
  },
  {
    id: "earth-geoid",
    title: "Earth Geoid",
    description:
      "Earth is not a perfect sphere. Explore its actual geoid shape by breaking down its different contributions.",
    url: "https://rayleighlord.github.io/EarthGeoidRepresentation/",
    preview: "./previews/earth-geoid.webp",
    accent: "#526b9f",
  },
  {
    id: "oscillators",
    title: "Three-Bead Oscillator Modes",
    description:
      "Explore how the motion of three coupled beads decomposes into a superposition of its three normal modes.",
    url: "https://rayleighlord.github.io/Oscillators/",
    preview: "./previews/oscillators.webp",
    accent: "#7057bd",
  },
  {
    id: "potential-flow-explorer",
    title: "Potential Flow",
    description:
      "Explore classical planar potential flows by superposing uniform flows, sources, sinks, vortices, and doublets.",
    url: "https://rayleighlord.github.io/PotentialFlowExplorer/",
    preview: "./previews/potential-flow-explorer.webp",
    accent: "#2e8cff",
  },
  {
    id: "2d-ising-model",
    title: "2D Ising Model",
    description:
      "Explore spin domains and thermodynamic observables across the two-dimensional Ising phase transition.",
    url: "https://rayleighlord.github.io/2DIsingModel/",
    preview: "./previews/2d-ising-model.webp",
    accent: "#856900",
  },
  {
    id: "image-compression-svd",
    title: "Image Compression with SVD",
    description:
      "Explore image compression with singular value decomposition by comparing the original image with low-rank reconstructions.",
    url: "https://rayleighlord.github.io/ImageCompressionSVD/",
    preview: "./previews/image-compression-svd.webp",
    accent: "#8a5a16",
  },
  {
    id: "fourier-sound",
    title: "Fourier Filtering",
    description: "Explore, filter, and hear the Fourier decomposition of a sound signal.",
    url: "https://rayleighlord.github.io/FourierSound/",
    preview: "./previews/fourier-sound.webp",
    accent: "#9b6518",
  },
];
