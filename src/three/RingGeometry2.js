/**
	
	@author : Kevin M. Gill http://planetmaker.wthr.us/

*/

import { BufferGeometry, BufferAttribute, Sphere, Vector3, Vector2 } from 'three';

/** A modification of the standard three.js RingGeometry class, but with changes to support 
 * Celestia-like ring textures.
 */
function RingGeometry2(innerRadius, outerRadius, thetaSegmentsP, phiSegmentsP, thetaStart = 0, thetaLength = Math.PI * 2) {
	BufferGeometry.call(this);

	const thetaSegments = thetaSegmentsP !== undefined ? Math.max(3, thetaSegmentsP) : 8;
	const phiSegments = phiSegmentsP !== undefined ? Math.max(3, phiSegmentsP) : 8;
	
	let i;
	let o;
	const pos = [];
	const uvs = [];
	let radius = innerRadius || 0;
	const radiusStep = (((outerRadius || 50) - radius) / phiSegments);
	

	for (i = 0; i <= phiSegments; i++) { //concentric circles inside ring

		for (o = 0; o <= thetaSegments; o++) { //number of segments per circle

			const vertex = new Vector3();
			
			vertex.x = radius * Math.cos(thetaStart + o / thetaSegments * thetaLength);
			vertex.y = -radius * Math.sin(thetaStart + o / thetaSegments * thetaLength);
			
			pos.push(vertex);
			uvs.push(new Vector2((i / phiSegments), (vertex.y / radius + 1) / 2));
		}
		
		radius += radiusStep;

	}
	
	const N = phiSegments*(thetaSegments+1)*18;
	const pos_attr = new Float32Array(N);
	const uv_attr = new Float32Array(N);
	
	let n = 0
	for (i = 0; i < phiSegments; i++) { //concentric circles inside ring

		for (o = 0; o <= thetaSegments; o++) { //number of segments per circle
			
			let v1;
			let v2;
			let v3;

			v1 = o + (thetaSegments * i) + i;
			v2 = o + (thetaSegments * i) + thetaSegments + i;
			v3 = o + (thetaSegments * i) + thetaSegments + 1 + i;

			pos_attr[n] = pos[v1].x
			uv_attr[n] = uvs[v1].x
			n++
			pos_attr[n] = pos[v1].y
			uv_attr[n] = uvs[v1].y
			n++
			pos_attr[n] = pos[v1].z
			uv_attr[n] = uvs[v1].z
			n++
			pos_attr[n] = pos[v2].x
			uv_attr[n] = uvs[v2].x
			n++
			pos_attr[n] = pos[v2].y
			uv_attr[n] = uvs[v2].y
			n++
			pos_attr[n] = pos[v2].z
			uv_attr[n] = uvs[v2].z
			n++
			pos_attr[n] = pos[v3].x
			uv_attr[n] = uvs[v3].x
			n++
			pos_attr[n] = pos[v3].y
			uv_attr[n] = uvs[v3].y
			n++
			pos_attr[n] = pos[v3].z
			uv_attr[n] = uvs[v3].z
			n++
			
			v1 = o + (thetaSegments * i) + i;
			v2 = o + (thetaSegments * i) + thetaSegments + 1 + i;
			v3 = o + (thetaSegments * i) + 1 + i;
			
			pos_attr[n] = pos[v1].x
			uv_attr[n] = uvs[v1].x
			n++
			pos_attr[n] = pos[v1].y
			uv_attr[n] = uvs[v1].y
			n++
			pos_attr[n] = pos[v1].z
			uv_attr[n] = uvs[v1].z
			n++
			pos_attr[n] = pos[v2].x
			uv_attr[n] = uvs[v2].x
			n++
			pos_attr[n] = pos[v2].y
			uv_attr[n] = uvs[v2].y
			n++
			pos_attr[n] = pos[v2].z
			uv_attr[n] = uvs[v2].z
			n++
			pos_attr[n] = pos[v3].x
			uv_attr[n] = uvs[v3].x
			n++
			pos_attr[n] = pos[v3].y
			uv_attr[n] = uvs[v3].y
			n++
			pos_attr[n] = pos[v3].z
			uv_attr[n] = uvs[v3].z
			n++
		}
	}
	
	this.addAttribute('position', new BufferAttribute(pos_attr, 3));
	this.addAttribute('uv', new BufferAttribute(uv_attr, 3));
	this.computeVertexNormals()

	this.boundingSphere = new Sphere(new Vector3(), radius); 

}

RingGeometry2.prototype = Object.create(BufferGeometry.prototype);

export default RingGeometry2;
