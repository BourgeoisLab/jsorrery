
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
	name: 'BigJupiter',
	title: 'If Jupiter was 1000X its mass',
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
	bodies: {
		sun: {
			forceTrace: true,
			traceRelativeTo: 'universe',
		},
		jupiter: {
			mass: 5.6846e26 * 1000,
			forceTrace: true,
			traceRelativeTo: 'universe',
		},
		mercury: {
			forceTrace: true,
			traceRelativeTo: 'universe',
		},
		venus: {
			forceTrace: true,
			traceRelativeTo: 'universe',
		},
		earth: {
			forceTrace: true,
			traceRelativeTo: 'universe',
		},
		mars: {
			forceTrace: true,
			traceRelativeTo: 'universe',
		},
		saturn: {
			forceTrace: true,
			traceRelativeTo: 'universe',
		},
		uranus: {
			forceTrace: true,
			traceRelativeTo: 'universe',
		},
		neptune: {
			forceTrace: true,
			traceRelativeTo: 'universe',
		},
		pluto: {
			forceTrace: true,
			traceRelativeTo: 'universe',
		},
	},
	secondsPerTick: { min: 3600, max: 3600 * 15, initial: 3600 * 5 },
	calculaionsPerTick: 100,
	usePhysics: true,
	useBarycenter: false,
	defaultGuiSettings: { 
		planetScale: 10,
	},
	help: "This scenario shows what would happen if, instantaneously at this moment, Jupiter's mass grew 1000 times larger.",
};
