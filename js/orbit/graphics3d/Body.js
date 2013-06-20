

define(
	[
		'orbit/NameSpace',
		'jquery',
		'orbit/graphics3d/Tracer',
		'three'
	], 
	function(ns, $, Tracer) {

		var Body = {

			init : function(celestialBody) {
				this.celestial = celestialBody;
				this.setPlanet();
				if(!this.celestial.isCentral) this.setTracer();
				this.setEventsListeners();
				//this.label = $('<div class="planetLabel">'+this.celestial.name+'</div>').appendTo('body');
			},

			placeLabel : function(pos){
				if(pos.z < 1){
					this.label.css({left : pos.x+'px', top : pos.y+'px'}).show();
				} else {
					this.label.hide();
				}
			},

			setEventsListeners:function(){
				this.celestial.addEventListener('spot', this.spotPos.bind(this));
				this.tracer && this.celestial.addEventListener('vertex', this.tracer.changeVertex.bind(this.tracer));
			},

			addTracerEventsListeners : function(body){
				if(!this.tracer) return;
				this.supplementalTracer = [body, this.tracer.changeVertex.bind(this.tracer)];
				this.supplementalTracer[0].addEventListener('vertex', this.supplementalTracer[1]);
			},

			removeTracerEventsListeners : function(){
				if(!this.supplementalTracer) return;
				this.supplementalTracer[0].removeEventListener('vertex', this.supplementalTracer[1]);
				this.supplementalTracer = null;
			},

			resetTracer : function(){
				this.tracer && this.tracer.getNew(false);
			},

			getTracer : function() {
				return this.tracer && this.tracer.getDisplayObject();
			},

			setTracer : function() {
				this.tracer = Object.create(Tracer);
				this.tracer.init(this.celestial.color, this.celestial.nVertices, this.celestial.name);
				this.tracer.initPos(this.getPosition());
				return this.tracer;
			},

			//add a reference to the object from which we trace
			setTraceFrom : function(centralBody){
				this.tracer && this.tracer.setTraceFrom(centralBody);
			},


			attachTrace : function(){
				this.tracer && this.tracer.attachTrace();
			},

			detachTrace : function(){
				this.tracer && this.tracer.detachTrace();
			},

			spotPos : function(pos){
				var pxPos = this.getPosition(pos);
				this.tracer && this.tracer.spotPos(pxPos.x, pxPos.y);
			},

			getPlanet : function() {
				return this.planet;
			},

			setPlanet : function(){

				var map = this.celestial.map;
				var matOptions = {};
				if(map){
					matOptions.map = THREE.ImageUtils.loadTexture(map);
				} else {
					matOptions.color = this.celestial.color
				}

				var mat = new THREE.MeshLambertMaterial(matOptions);

				if(this.celestial.name==='sun'){
					mat.emissive = new THREE.Color( 0xdddd33 );
				}

				var radius = this.celestial.radius * ns.KM;
				var segments = 50;
				var rings = 50;
				var sphere = new THREE.Mesh(
					new THREE.SphereGeometry(radius, segments, rings),
					mat
				);

				//console.log(this.celestial.name+' size ',radius, ' m');

				this.planet = new THREE.Object3D();
				this.planet.add(sphere);

				if(this.celestial.ring){
					var ringSize = [
						this.celestial.ring.innerRadius * ns.KM,
						this.celestial.ring.outerRadius * ns.KM
					];
					
					var ringMap = THREE.ImageUtils.loadTexture( this.celestial.ring.map );
					var ringMaterial = new THREE.MeshLambertMaterial({
	                   map: ringMap
	                });
					var ringGeometry = new THREE.TorusGeometry(ringSize[1], ringSize[1] - ringSize[0], 2, 40);
					//var ringGeometry = new THREE.TorusGeometry(90000000, 10000000, 12, 40);	

	                var ring = new THREE.Mesh(ringGeometry, ringMaterial);
	                ring.rotation.x = - Math.PI / 2;
					this.planet.add(ring);
					
				}

				
				var tilt = Math.PI / 2;
				if(this.celestial.tilt) tilt -= this.celestial.tilt * ns.DEG_TO_RAD;
				this.planet.rotation.x = tilt;

				/*
				this.planet.castShadow = true;
				this.planet.receiveShadow = true;
				/**/
				return this.planet;
			},
			
			drawMove : function(){
				var pos = this.getPosition();
				this.planet.position.copy(pos);

				if(this.celestial.sideralDay){
					var curRotation = (ns.U.epochTime / this.celestial.sideralDay) * ns.CIRCLE;
					this.planet.rotation.y = (this.celestial.originalMapRotation || 0) + curRotation;
				}
				this.tracer && this.tracer.doTrace(pos);
			},

			getPosition : function(pos) {
				var curPosition = (pos || this.celestial.position).clone();
				return curPosition;
			},

			getName : function(){
				return this.celestial.name;
			}
		};

		return Body;

	});