
import { Vector3, Object3D, LineBasicMaterial, BufferGeometry, Line, BufferAttribute } from 'three';
import { darken, hexToRgb, rgbToHex } from '../../utils/ColorUtils';
import { IS_SCREENSHOT, IS_CAPTURE } from '../../core/constants';

//a change of direction of x radians triggers a vertex switch in the path (equivalent to adding a vertex);
const SWITCH_TRESHOLD = 0.005;
const vNorm = new Vector3(1, 0, 0);

export default class Tracer {
	constructor(color, nVertices, name) {
		this.name = name;
		this.color = IS_SCREENSHOT || IS_CAPTURE ? color : rgbToHex(darken(hexToRgb(color), 0.7));
		this.points = [];
		this.nVertices = nVertices;
		this.lastVertexIdx = this.nVertices - 1;
		this.lastMod = 0;
		this.root = new Object3D();
		this.tracePosition = new Vector3();
	}

	getDisplayObject() {
		return this.root;
	}

	getNew() {
		
		this.detachTrace();

		const material = new LineBasicMaterial({
			color: this.color,
			linewidth: 4,
		});

		this.geom = new BufferGeometry();
		const pos = new Float32Array(this.nVertices * 3);
		this.geom.addAttribute('position', new BufferAttribute(pos, 3));
		this.line = new Line(this.geom, material);
		this.line.frustumCulled = false;
		this.currentVertex = 0;
		this.initCallback = this.changeVertex.bind(this);
		this.attachTrace();
	}

	detachTrace() {
		if (this.line) this.root.remove(this.line);
	}

	attachTrace() {
		if (this.line) this.root.add(this.line);
	}

	setTraceFrom(traceFromBody) {
		if (this.traceFrom !== traceFromBody) this.getNew();
		this.traceFrom = traceFromBody;
		if (!traceFromBody) {
			this.root.position.set(0, 0, 0);
		}
	}

	changeVertex() {
		this.lastPathDirection = null;
		this.switchVertex = this.currentVertex === this.lastVertexIdx;
		if (this.currentVertex < this.lastVertexIdx) this.currentVertex++;
	}

	draw(fromPos) {
		if (!this.geom) return;
		const pos = this.setTracePos(fromPos);
		const posCurrent = new Vector3(
			this.geom.attributes.position.getX(this.currentVertex),
			this.geom.attributes.position.getY(this.currentVertex),
			this.geom.attributes.position.getZ(this.currentVertex)
		);
		if (posCurrent && posCurrent.distanceTo(pos) < 1e-3) return;
		this.geom.attributes.position.needsUpdate = true;
		
		if (this.currentVertex < this.lastVertexIdx) {
			for (let i = this.currentVertex; i < this.nVertices; i++) {
				this.geom.attributes.position.setXYZ(i, pos.x, pos.y, pos.z);
			}
		} else {
			if (this.switchVertex) {
				for (let i = 0; i < this.lastVertexIdx; i++) {
					this.geom.attributes.position.setXYZ(i,
						this.geom.attributes.position.getX(i+1),
						this.geom.attributes.position.getY(i+1),
						this.geom.attributes.position.getZ(i+1));
				}
				this.switchVertex = false;
			}
			this.geom.attributes.position.setXYZ(this.lastVertexIdx, pos.x, pos.y, pos.z);
		}

		let v2 = null
		let v1 = null
		let v0 = null
		if (this.currentVertex >= 2)
			v2 = new Vector3(
				this.geom.attributes.position.getX(this.currentVertex - 2),
				this.geom.attributes.position.getY(this.currentVertex - 2),
				this.geom.attributes.position.getZ(this.currentVertex - 2)
			);
		if (this.currentVertex >= 1)
			v1 = new Vector3(
				this.geom.attributes.position.getX(this.currentVertex - 1),
				this.geom.attributes.position.getY(this.currentVertex - 1),
				this.geom.attributes.position.getZ(this.currentVertex - 1)
			);
		if (this.currentVertex >= 0)
			v0 = new Vector3(
				this.geom.attributes.position.getX(this.currentVertex),
				this.geom.attributes.position.getY(this.currentVertex),
				this.geom.attributes.position.getZ(this.currentVertex)
			);
		if (v1 && v2) {

			if (!this.lastPathDirection) {
				const a = v1.clone().sub(v2);
				this.lastPathDirection = Math.abs(a.angleTo(vNorm));
			}
			const curPath = v0.clone().sub(this.previousPos);
			const diff = Math.abs(this.lastPathDirection - Math.abs(curPath.angleTo(vNorm)));
			if (diff > SWITCH_TRESHOLD) {
				this.changeVertex();
			}

		}

		if (!v1 || !v2) {
			this.changeVertex();
		}
		this.previousPos = pos;
					
	}

	setTracePos(pos) {
		if (this.traceFrom) {
			this.root.position.copy(this.traceFrom.getPosition());
			pos.sub(this.traceFrom.getPosition());
		}
		return pos;
	}

};
