
import { sun } from './bodies/stars/sun';
import { mercury } from './bodies/planets/mercury';
import { venus } from './bodies/planets/venus';
import { earth } from './bodies/planets/earth';
import { mars } from './bodies/planets/mars';
import { jupiter } from './bodies/planets/jupiter';
import { saturn } from './bodies/planets/saturn';
import { uranus } from './bodies/planets/uranus';
import { neptune } from './bodies/planets/neptune';
import { pluto } from './bodies/transneptunian/pluto';

export default {
	name: 'SolarSystem',
	title: 'Solar System',
	commonBodies: [
		sun,
		mercury,
		venus,
		earth,
		mars,
		jupiter,
		saturn,
		uranus,
		neptune,
		pluto,
	],
	secondsPerTick: { min: 3600 * 5, max: 3600 * 25, initial: 3600 * 10 },
	defaultGuiSettings: { 
		planetScale: 10,
	},
	help: 'This scenario shows all the planets of the Solar System. This includes Pluto, because Pluto will always be a planet in my heart.',
};
