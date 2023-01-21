
import { sun } from './bodies/stars/sun';
import { moon } from './bodies/moons/moon';
import { mercury } from './bodies/planets/mercury';
import { venus } from './bodies/planets/venus';
import { earth } from './bodies/planets/earth';
import { mars } from './bodies/planets/mars';

export default {
	name: 'InnerSolarSystem',
	title: 'Inner Solar System',
	commonBodies: [
		sun,
		mercury,
		venus,
		earth,
		moon,
		mars,
	],
	secondsPerTick: { min: 60, max: 3600 * 15, initial: 3600 }, //3600 * 24 * 2,
	defaultGuiSettings: { 
		planetScale: 10,
	},
	help: "Includes all the planets from Mercury to Mars, plus the Earth's moon.",
};
