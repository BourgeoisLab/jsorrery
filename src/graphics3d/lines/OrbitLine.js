

import { LineBasicMaterial, BufferGeometry, Line, BufferAttribute, VertexColors } from 'three';
import Dimensions from '../Dimensions';
import DebugPoint from '../utils/DebugPoint';
import { darken, hexToRgb, rgbToHex } from '../../utils/ColorUtils';
import { IS_SCREENSHOT, IS_CAPTURE, QUARTER_CIRCLE } from '../../core/constants';


export default class OrbitLine {
	constructor(name, color, isSolid) {
		this.name = name;
		this.added = false;
		this.isSolid = isSolid;
		this.isGradient = !isSolid;
		this.color = color;
	}

	createSolidLine(orbitVertices) {
		this.orbitVertices = orbitVertices.map(val => Dimensions.getScaled(val.clone()));
		this.nVertices = this.orbitVertices.length;
		this.geometry = new BufferGeometry();
		this.positions = new Float32Array(this.nVertices * 3);
		this.buildPositions();
		this.geometry.addAttribute('position', new BufferAttribute(this.positions, 3));
		const material = new LineBasicMaterial({
			color: IS_SCREENSHOT || IS_CAPTURE ? this.color : rgbToHex(darken(hexToRgb(this.color), 0.5)),
		});
		return new Line(this.geometry, material);
	}

	createGradientLine(orbitVertices) {
		this.orbitVertices = orbitVertices.map(val => Dimensions.getScaled(val.clone()));
		this.nVertices = this.orbitVertices.length;
		this.geometry = new BufferGeometry();
		this.positions = new Float32Array(this.nVertices * 3 + 3);
		this.buildPositions();
		this.positions[this.nVertices * 3] = this.orbitVertices[0].x;
		this.positions[this.nVertices * 3 + 1] = this.orbitVertices[0].y;
		this.positions[this.nVertices * 3 + 2] = this.orbitVertices[0].z;
		this.geometry.addAttribute('position', new BufferAttribute(this.positions, 3));

		const origColor = hexToRgb(this.color);
		const colors = orbitVertices.map((v, i) => {
			return darken(origColor, 1 - i / this.nVertices);
		}).reduce((a, c, i) => {
			const n = i * 3;			
			a[n] = c.r / 255;
			a[n + 1] = c.g / 255;
			a[n + 2] = c.b / 255;
			return a;
		}, new Float32Array(3 + this.nVertices * 3));
		colors[this.nVertices * 3] = origColor.r / 255;
		colors[this.nVertices * 3 + 1] = origColor.g / 255;
		colors[this.nVertices * 3 + 2] = origColor.b / 255;
		const material = new LineBasicMaterial({
			vertexColors: VertexColors,
		});
		this.geometry.addAttribute('color', new BufferAttribute(colors, 3));

		return new Line(this.geometry, material);
	}

	buildPositions() {
		for (let i = 0; i < this.nVertices; i++) {
			const v = this.orbitVertices[i];
			const n = i * 3;
			this.positions[n] = v.x;
			this.positions[n + 1] = v.y;
			this.positions[n + 2] = v.z;
		}
	}

	setLine(orbitVertices) {
		this.line = this.isSolid ? this.createSolidLine(orbitVertices) : this.createGradientLine(orbitVertices);
	}

	showAllVertices() {
		DebugPoint.removeAll();
		this.orbitVertices.forEach(v => DebugPoint.add(v, 0xaaaaaa, 0.01));
	}

	updatePos(pos, vel, getNewVertices) {

		const numberBehind = this.getNVerticesBehindPos(pos, vel);
		this.geometry.attributes.position.needsUpdate = true;
		
		if (numberBehind) {
			// console.log(numberBehind);
			//if orbit is heavily perturbed, we'll have a callback to gen new orbit vertices when we delete some
			const newVertices = getNewVertices && getNewVertices(numberBehind).map(val => Dimensions.getScaled(val));

			const sorted = [];
			let verticesDeck = this.orbitVertices;
			for (let inc = 0, index = numberBehind; inc < this.nVertices; inc++, index++) {
				if (index === this.nVertices) {
					index = 0;
					//if we have new vertices, add them at the end of array. Otherwise, shift the ones from the beginning of the exting ones.
					verticesDeck = newVertices || this.orbitVertices;
				}
				sorted[inc] = verticesDeck[index];
			}
			if (!newVertices) {
				const startVertex = sorted[this.nVertices - 2];
				const dumpedVertex = sorted[this.nVertices - 1];
				const vLen = startVertex.distanceTo(dumpedVertex);
				const newVertex = pos.clone().sub(startVertex).setLength(vLen).add(startVertex);
				// DebugPoint.add(newVertex, 0xffffaa);
				sorted[this.nVertices - 1] = newVertex;
			}
		
			this.orbitVertices = sorted;
			this.buildPositions();

			// this.showAllVertices();
			// DebugPoint.add(sorted[this.nVertices - (numberBehind + 1)], 0x44ff44, 0.014);
			// for (let i = 0; i < numberBehind + 2; i++) {
				// DebugPoint.add(sorted[this.nVertices - (i + 1)], 0xff4444, 0.014);
			// }
		}

		this.positions[this.nVertices * 3] = pos.x;
		this.positions[this.nVertices * 3 + 1] = pos.y;
		this.positions[this.nVertices * 3 + 2] = pos.z;
	}
	

	getNVerticesBehindPos(pos, vel) {

		// console.clear();
		// DebugPoint.removeAll();
		const lookAway = vel.negate();

		for (let i = 0; i < this.nVertices; i++) {
			// console.log(i);
			const vertex = this.orbitVertices[i];
			const diff = vertex.clone().sub(pos);
			// DebugPoint.addArrow(pos, diff, diff.length(), 0x888888);
			const angle = diff.angleTo(lookAway);
			// console.log(angle);
			//point is not behind. If this happens, we assume that all that came before are behind, since the count starts from begining of line, where the planet was at previous frame. It means though that the planet cannot move more than half a circle per tick.
			if (angle >= QUARTER_CIRCLE) {
				return i;
			}
			// DebugPoint.add(vertex, 0x55ff00, 1);
		}
		return null;
	}

	getDisplayObject() {
		return this.line;
	}

};
