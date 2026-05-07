export interface PlanetData {
  id: string;
  name: string;
  latinName: string;
  diameterKm: number;
  massEarth: number; // relative to Earth
  distanceAU: number;
  orbitalPeriodDays: number;
  rotationPeriodHours: number; // negative = retrograde
  axialTiltDeg: number;
  eccentricity: number;
  inclination: number; // orbital inclination degrees
  surfaceTempMin: number;
  surfaceTempMax: number;
  surfaceTempAvg: number;
  gravityMs2: number;
  escapeVelocityKms: number;
  atmosphereMain: string;
  moons: number;
  rings: boolean;
  type: 'rocky' | 'gas' | 'ice';
  // visual
  color: string;
  color2: string; // secondary for gradient
  atmosphereColor: string;
  scaledRadius: number;
  scaledDistance: number;
  funFact: string;
}

const AU = 9.5; // 1 AU = 9.5 scene units (compressed but proportional)

export const PLANETS: PlanetData[] = [
  {
    id: 'mercury', name: 'Merkurius', latinName: 'Mercury',
    diameterKm: 4879, massEarth: 0.055,
    distanceAU: 0.387, orbitalPeriodDays: 87.97, rotationPeriodHours: 1407.6,
    axialTiltDeg: 0.034, eccentricity: 0.206, inclination: 7.0,
    surfaceTempMin: -180, surfaceTempMax: 430, surfaceTempAvg: 167,
    gravityMs2: 3.7, escapeVelocityKms: 4.3,
    atmosphereMain: 'Hampir tidak ada (O₂, Na, H₂)',
    moons: 0, rings: false, type: 'rocky',
    color: '#8C7B6B', color2: '#A09080', atmosphereColor: 'transparent',
    scaledRadius: 0.19, scaledDistance: 0.387 * AU,
    funFact: 'Satu hari di Merkurius lebih panjang dari satu tahunnya!',
  },
  {
    id: 'venus', name: 'Venus', latinName: 'Venus',
    diameterKm: 12104, massEarth: 0.815,
    distanceAU: 0.723, orbitalPeriodDays: 224.7, rotationPeriodHours: -5832.5,
    axialTiltDeg: 177.4, eccentricity: 0.007, inclination: 3.4,
    surfaceTempMin: 437, surfaceTempMax: 497, surfaceTempAvg: 464,
    gravityMs2: 8.87, escapeVelocityKms: 10.36,
    atmosphereMain: 'CO₂ (96.5%), N₂ (3.5%)',
    moons: 0, rings: false, type: 'rocky',
    color: '#C8A96E', color2: '#E8C88A', atmosphereColor: '#ffdd8855',
    scaledRadius: 0.47, scaledDistance: 0.723 * AU,
    funFact: 'Venus berputar terbalik dan paling lambat — satu hari = 243 hari Bumi.',
  },
  {
    id: 'earth', name: 'Bumi', latinName: 'Earth',
    diameterKm: 12756, massEarth: 1.0,
    distanceAU: 1.0, orbitalPeriodDays: 365.25, rotationPeriodHours: 23.93,
    axialTiltDeg: 23.44, eccentricity: 0.017, inclination: 0,
    surfaceTempMin: -89, surfaceTempMax: 57, surfaceTempAvg: 15,
    gravityMs2: 9.81, escapeVelocityKms: 11.19,
    atmosphereMain: 'N₂ (78%), O₂ (21%), Ar (0.93%)',
    moons: 1, rings: false, type: 'rocky',
    color: '#1B6CA8', color2: '#2E8B4A', atmosphereColor: '#4fc3f744',
    scaledRadius: 0.5, scaledDistance: 1.0 * AU,
    funFact: 'Satu-satunya planet dengan lempeng tektonik aktif dan kehidupan yang diketahui.',
  },
  {
    id: 'mars', name: 'Mars', latinName: 'Mars',
    diameterKm: 6779, massEarth: 0.107,
    distanceAU: 1.524, orbitalPeriodDays: 686.97, rotationPeriodHours: 24.62,
    axialTiltDeg: 25.19, eccentricity: 0.093, inclination: 1.9,
    surfaceTempMin: -125, surfaceTempMax: 20, surfaceTempAvg: -65,
    gravityMs2: 3.72, escapeVelocityKms: 5.03,
    atmosphereMain: 'CO₂ (95.3%), N₂ (2.7%), Ar (1.6%)',
    moons: 2, rings: false, type: 'rocky',
    color: '#C1440E', color2: '#A0330A', atmosphereColor: '#ff8c6922',
    scaledRadius: 0.27, scaledDistance: 1.524 * AU,
    funFact: 'Olympus Mons di Mars adalah gunung berapi tertinggi di tata surya — 21.9 km!',
  },
  {
    id: 'jupiter', name: 'Jupiter', latinName: 'Jupiter',
    diameterKm: 139820, massEarth: 317.8,
    distanceAU: 5.203, orbitalPeriodDays: 4332.59, rotationPeriodHours: 9.93,
    axialTiltDeg: 3.13, eccentricity: 0.049, inclination: 1.3,
    surfaceTempMin: -145, surfaceTempMax: -108, surfaceTempAvg: -110,
    gravityMs2: 24.79, escapeVelocityKms: 59.5,
    atmosphereMain: 'H₂ (89%), He (10%), CH₄, NH₃',
    moons: 95, rings: true, type: 'gas',
    color: '#C88B3A', color2: '#8B5E2A', atmosphereColor: '#ffcc8833',
    scaledRadius: 1.5, scaledDistance: 5.203 * AU,
    funFact: 'Jupiter bisa menampung 1.300 planet seukuran Bumi. Badai Bintik Merahnya sudah 350+ tahun!',
  },
  {
    id: 'saturn', name: 'Saturnus', latinName: 'Saturn',
    diameterKm: 116460, massEarth: 95.2,
    distanceAU: 9.537, orbitalPeriodDays: 10759.22, rotationPeriodHours: 10.66,
    axialTiltDeg: 26.73, eccentricity: 0.057, inclination: 2.5,
    surfaceTempMin: -185, surfaceTempMax: -122, surfaceTempAvg: -140,
    gravityMs2: 10.44, escapeVelocityKms: 35.5,
    atmosphereMain: 'H₂ (96%), He (3%), CH₄, NH₃',
    moons: 146, rings: true, type: 'gas',
    color: '#E4D191', color2: '#C8B060', atmosphereColor: '#ffe8a022',
    scaledRadius: 1.25, scaledDistance: 9.537 * AU,
    funFact: 'Saturnus lebih ringan dari air! Densitasnya hanya 0.687 g/cm³.',
  },
  {
    id: 'uranus', name: 'Uranus', latinName: 'Uranus',
    diameterKm: 50724, massEarth: 14.5,
    distanceAU: 19.191, orbitalPeriodDays: 30688.5, rotationPeriodHours: -17.24,
    axialTiltDeg: 97.77, eccentricity: 0.046, inclination: 0.8,
    surfaceTempMin: -224, surfaceTempMax: -197, surfaceTempAvg: -195,
    gravityMs2: 8.69, escapeVelocityKms: 21.3,
    atmosphereMain: 'H₂ (82%), He (15%), CH₄ (2.3%)',
    moons: 28, rings: true, type: 'ice',
    color: '#7DE8E8', color2: '#5DCACA', atmosphereColor: '#a0f0f033',
    scaledRadius: 0.7, scaledDistance: 19.191 * AU,
    funFact: 'Uranus berputar miring 98° — seolah menggelinding mengelilingi Matahari!',
  },
  {
    id: 'neptune', name: 'Neptunus', latinName: 'Neptune',
    diameterKm: 49244, massEarth: 17.1,
    distanceAU: 30.069, orbitalPeriodDays: 60195, rotationPeriodHours: 16.11,
    axialTiltDeg: 28.32, eccentricity: 0.010, inclination: 1.8,
    surfaceTempMin: -223, surfaceTempMax: -200, surfaceTempAvg: -200,
    gravityMs2: 11.15, escapeVelocityKms: 23.5,
    atmosphereMain: 'H₂ (80%), He (19%), CH₄ (1.5%)',
    moons: 16, rings: true, type: 'ice',
    color: '#3F54BA', color2: '#2233AA', atmosphereColor: '#6688ff33',
    scaledRadius: 0.68, scaledDistance: 30.069 * AU,
    funFact: 'Angin di Neptunus mencapai 2.100 km/jam — tercepat di tata surya!',
  },
];

export function getOrbitalPosition(planet: PlanetData, time: number, speed: number): [number, number, number] {
  const omega = (2 * Math.PI / planet.orbitalPeriodDays) * speed;
  const angle = omega * time;
  const a = planet.scaledDistance;
  const b = a * Math.sqrt(1 - planet.eccentricity ** 2);
  const inc = (planet.inclination * Math.PI) / 180;
  return [
    a * Math.cos(angle),
    a * Math.sin(angle) * Math.sin(inc),
    b * Math.sin(angle) * Math.cos(inc),
  ];
}

export function getRotationSpeed(planet: PlanetData, speed: number): number {
  return (2 * Math.PI / (Math.abs(planet.rotationPeriodHours) / 24)) * speed * Math.sign(planet.rotationPeriodHours);
}
