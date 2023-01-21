
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
import { halley } from './bodies/comets/halley';
import { ceres } from './bodies/asteroids/ceres';
import { eris } from './bodies/transneptunian/eris';
import { makemake } from './bodies/transneptunian/makemake';
import { haumea } from './bodies/transneptunian/haumea';

export default {
	name: 'SolarSystemDwarves',
	title: 'Solar System with dwarf planets',
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
		halley,
		eris,
		ceres,
		makemake,
		haumea,
	],
	secondsPerTick: { min: 3600 * 5, max: 3600 * 25, initial: 3600 * 10 },
	defaultGuiSettings: { 
		planetScale: 10,
	},
	help: "This scenario shows all the planets of the Solar System plus dwarf planets. Also included is Halley's comet, but its orbit is an approximation, as I was not able to find its accurate orbital elements.",
};
