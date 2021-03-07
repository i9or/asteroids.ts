!function(t=".",i="__import__"){try{self[i]=new Function("u","return import(u)")}catch(s){const e=new URL(t,location),h=t=>{URL.revokeObjectURL(t.src),t.remove()};self[i]=t=>new Promise(((s,a)=>{const r=new URL(t,e);if(self[i].moduleMap[r])return s(self[i].moduleMap[r]);const o=new Blob([`import * as m from '${r}';`,`${i}.moduleMap['${r}']=m;`],{type:"text/javascript"}),n=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(o),onerror(){a(new Error(`Failed to import: ${t}`)),h(n)},onload(){s(self[i].moduleMap[r]),h(n)}});document.head.appendChild(n)})),self[i].moduleMap={}}}("/asteroids.ts/assets/");class t{constructor(t,i){this.x=t,this.y=i}}class i{constructor(i,s,e,h,a,r,o){this.position=new t(i,s),this.mass=null!=e?e:1,this.radius=null!=h?h:50,this.angle=null!=a?a:0,this.velocity=null!=r?r:new t(0,0),this.rotationSpeed=null!=o?o:0}update(t,i){this.position.x+=this.velocity.x*t,this.position.y+=this.velocity.y*t,this.angle+=this.rotationSpeed*t,this.angle%=2*Math.PI,this.position.x-this.radius>i.canvas.width&&(this.position.x=-this.radius),this.position.x+this.radius<0&&(this.position.x=i.canvas.width+this.radius),this.position.y-this.radius>i.canvas.height&&(this.position.y=-this.radius),this.position.y+this.radius<0&&(this.position.y=i.canvas.height+this.radius)}push(t,i,s){this.velocity.x+=s*(Math.cos(t)*i)/this.mass,this.velocity.y+=s*(Math.sin(t)*i)/this.mass}twist(t,i){this.rotationSpeed+=i*t/this.mass}get velocityValue(){return Math.sqrt(Math.pow(this.velocity.x,2)+Math.pow(this.velocity.y,2))}get movementAngle(){return Math.atan2(this.velocity.y,this.velocity.x)}draw(t){t.save(),t.translate(this.position.x,this.position.y),t.rotate(this.angle),t.beginPath(),t.arc(0,0,this.radius,0,2*Math.PI),t.lineTo(0,0),t.strokeStyle="white",t.stroke(),t.restore()}}class s extends i{static calculateRadius(t,i=1){return Math.sqrt(t/i/Math.PI)}constructor(t,i,e,h,a,r){var o,n,l;super(t,i,e,s.calculateRadius(e,null==r?void 0:r.density),0,h,a),this.circumference=2*Math.PI*this.radius,this.segments=Math.ceil(this.circumference/15),this.segments=Math.min(25,Math.max(5,this.segments)),this.noise=null!=(o=null==r?void 0:r.noise)?o:.2,this.shape=[];for(let s=0;s<this.segments;s++)this.shape.push(2*(Math.random()-.5));this.stroke=null!=(n=null==r?void 0:r.stroke)?n:"white",this.fill=null!=(l=null==r?void 0:r.fill)?l:"black"}drawAsteroid(t,i){t.save(),t.strokeStyle=this.stroke,t.fillStyle=this.fill,t.beginPath();for(let s=0;s<this.shape.length;s++)t.rotate(2*Math.PI/this.shape.length),t.lineTo(this.radius+this.radius*this.noise*this.shape[s],0);t.closePath(),t.fill(),t.stroke(),i&&this.drawGuide(t),t.restore()}drawGuide(t){t.lineWidth=.5,t.beginPath(),t.arc(0,0,this.radius,0,2*Math.PI),t.closePath(),t.stroke(),t.beginPath(),t.lineWidth=.2,t.arc(0,0,this.radius+this.radius*this.noise,0,2*Math.PI),t.closePath(),t.stroke(),t.beginPath(),t.arc(0,0,this.radius-this.radius*this.noise,0,2*Math.PI),t.closePath(),t.stroke()}draw(t,i=!1){t.save(),t.translate(this.position.x,this.position.y),t.rotate(this.angle),this.drawAsteroid(t,i),t.restore()}}class e extends i{constructor(t,i,s,e){var h,a,r,o,n,l;super(t,i,10,15,1.5*Math.PI),this.thrusterPower=s,this.steeringPower=this.thrusterPower/20,this.thrusterOn=!1,this.leftThrusterOn=!1,this.rightThrusterOn=!1,this.guide=null!=(h=null==e?void 0:e.guide)&&h,this.lineWidth=null!=(a=null==e?void 0:e.lineWidth)?a:2,this.stroke=null!=(r=null==e?void 0:e.stroke)?r:"white",this.fill=null!=(o=null==e?void 0:e.fill)?o:"black",this.tailCurve=null!=(n=null==e?void 0:e.tailCurve)?n:.25,this.sideCurve=null!=(l=null==e?void 0:e.sideCurve)?l:.75}drawShip(t){this.guide&&this.drawAngleAndPositionGuide(t),t.save();const i=.25*Math.PI;this.guide&&this.drawBottomGuide(t),this.thrusterOn&&(t.save(),t.strokeStyle="yellow",t.fillStyle="red",t.lineWidth=3,t.beginPath(),t.moveTo(Math.cos(Math.PI+.8*i)*this.radius/2,Math.sin(Math.PI+.8*i)*this.radius/2),t.quadraticCurveTo(2*-this.radius,0,Math.cos(Math.PI-.8*i)*this.radius/2,Math.sin(Math.PI-.8*i)*this.radius/2),t.fill(),t.stroke(),t.restore()),t.strokeStyle=this.stroke,t.lineWidth=this.lineWidth,t.fillStyle=this.fill,t.beginPath(),t.moveTo(this.radius,0),t.quadraticCurveTo(Math.cos(i)*this.radius*this.sideCurve,Math.sin(i)*this.radius*this.sideCurve,Math.cos(Math.PI-i)*this.radius,Math.sin(Math.PI-i)*this.radius),t.quadraticCurveTo(-this.radius*this.tailCurve,0,Math.cos(Math.PI+i)*this.radius,Math.sin(Math.PI+i)*this.radius),t.quadraticCurveTo(Math.cos(-i)*this.radius*this.sideCurve,Math.sin(-i)*this.radius*this.sideCurve,this.radius,0),t.fill(),t.stroke(),t.closePath(),this.guide&&this.drawGuideTop(t),t.restore()}drawAngleAndPositionGuide(t){t.save(),t.rotate(-this.angle),t.strokeText(`angle: ${Math.floor(180*this.angle/Math.PI)}`,20,this.radius),t.strokeText(`x: ${Math.floor(this.position.x)}, y: ${Math.floor(this.position.y)}`,20,this.radius+12),t.strokeText(`velocity: ${Math.floor(this.velocityValue)}`,20,this.radius+24),t.restore()}drawGuideTop(t){t.lineWidth=.5,t.strokeStyle="white",t.beginPath(),t.moveTo(-this.radius,0),t.lineTo(0,0),t.stroke(),t.beginPath(),t.arc(this.radius*this.tailCurve-this.radius,0,this.radius/50,0,2*Math.PI),t.stroke()}drawBottomGuide(t){t.strokeStyle="white",t.fillStyle="rgba(0, 0, 0, 0.25)",t.lineWidth=.5,t.beginPath(),t.arc(0,0,this.radius,0,2*Math.PI),t.closePath(),t.stroke(),t.fill()}draw(t){t.save(),t.translate(this.position.x,this.position.y),t.rotate(this.angle),this.drawShip(t),t.restore()}update(t,i){this.thrusterOn&&this.push(this.angle,this.thrusterPower,t);let s=0;this.rightThrusterOn&&(s+=1),this.leftThrusterOn&&(s-=1),this.twist(s*this.steeringPower,t),super.update(t,i)}}const h=new class{constructor(t,i){if(this.guide=!1,this.previous=0,this.elapsed=0,this.frame=t=>{this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height),this.previous||(this.previous=t),this.elapsed=t-this.previous,this.update(this.elapsed/1e3),this.draw(),this.previous=t,window.requestAnimationFrame(this.frame)},this.draw=()=>{this.guide&&class{static draw(t,i=10,s=50,e="#00ff00",h="#009900"){t.save(),t.strokeStyle=e,t.fillStyle=h;const a=t.canvas.width,r=t.canvas.height;for(let o=0;o<a;o+=i)t.beginPath(),t.moveTo(o,0),t.lineTo(o,a),t.lineWidth=o%s==0?.5:.25,t.stroke(),o%s==0&&t.fillText(o.toString(),o+3,10);for(let o=0;o<r;o+=i)t.beginPath(),t.moveTo(0,o),t.lineTo(r,o),t.lineWidth=o%s==0?.5:.25,t.stroke(),o%s==0&&t.fillText(o.toString(),3,o+10);t.restore()}}.draw(this.ctx);for(const t of this.asteroids)t.draw(this.ctx,this.guide);this.ship.draw(this.ctx)},this.update=t=>{for(let i of this.asteroids)i.update(t,this.ctx);this.ship.update(t,this.ctx)},this.run=()=>{console.info("[[Running Asteroids game]]"),window.requestAnimationFrame(this.frame)},console.log("[[Initializing Asteroids game]]"),!t)throw new Error("Canvas element is not provided");this.canvas=t;const h=this.canvas.getContext("2d");if(!h)throw new Error("Getting CanvasRenderingContext2d failed");this.ctx=h,this.guide=i,this.ctx.lineWidth=.5,this.ctx.strokeStyle="white",this.ctx.fillStyle="#bada55",this.asteroids=[];for(let e=0;e<4;e++){const t=new s(Math.random()*this.ctx.canvas.width,Math.random()*this.ctx.canvas.height,2e3+8e3*Math.random());t.push(2*Math.random()*Math.PI,2e3,60),t.twist(500*(Math.random()-.5),60),this.asteroids.push(t)}this.ship=new e(this.ctx.canvas.width/2,this.ctx.canvas.height/2,1e3,{guide:this.guide}),this.ctx.canvas.addEventListener("keydown",(t=>{this.keyboardHandler(t,!0)})),this.ctx.canvas.addEventListener("keyup",(t=>{this.keyboardHandler(t,!1)})),this.ctx.canvas.focus()}get w(){return this.ctx.canvas.width}get h(){return this.ctx.canvas.height}keyboardHandler(t,i){let s=!1;switch(t.code){case"ArrowUp":this.ship.thrusterOn=i;break;case"ArrowRight":this.ship.rightThrusterOn=i;break;case"ArrowLeft":this.ship.leftThrusterOn=i;break;default:s=!0}s||t.preventDefault()}}(document.getElementById("asteroids"),!0);window.game=h,h.run();
