!function(t=".",i="__import__"){try{self[i]=new Function("u","return import(u)")}catch(s){const e=new URL(t,location),h=t=>{URL.revokeObjectURL(t.src),t.remove()};self[i]=t=>new Promise(((s,a)=>{const r=new URL(t,e);if(self[i].moduleMap[r])return s(self[i].moduleMap[r]);const o=new Blob([`import * as m from '${r}';`,`${i}.moduleMap['${r}']=m;`],{type:"text/javascript"}),l=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(o),onerror(){a(new Error(`Failed to import: ${t}`)),h(l)},onload(){s(self[i].moduleMap[r]),h(l)}});document.head.appendChild(l)})),self[i].moduleMap={}}}("/asteroids.ts/assets/");class t{constructor(t,i){this.x=t,this.y=i}}class i{static calculateRadius(t,i=1){return Math.sqrt(t/i/Math.PI)}constructor(i,s,e,h,a,r,o){this.position=new t(i,s),this.mass=null!=e?e:1,this.radius=null!=h?h:50,this.angle=null!=a?a:0,this.velocity=null!=r?r:new t(0,0),this.rotationSpeed=null!=o?o:0}update(t,i){this.position.x+=this.velocity.x*t,this.position.y+=this.velocity.y*t,this.angle+=this.rotationSpeed*t,this.angle%=2*Math.PI,this.position.x-this.radius>i.canvas.width&&(this.position.x=-this.radius),this.position.x+this.radius<0&&(this.position.x=i.canvas.width+this.radius),this.position.y-this.radius>i.canvas.height&&(this.position.y=-this.radius),this.position.y+this.radius<0&&(this.position.y=i.canvas.height+this.radius)}push(t,i,s){this.velocity.x+=s*(Math.cos(t)*i)/this.mass,this.velocity.y+=s*(Math.sin(t)*i)/this.mass}twist(t,i){this.rotationSpeed+=i*t/this.mass}get velocityValue(){return Math.sqrt(Math.pow(this.velocity.x,2)+Math.pow(this.velocity.y,2))}get movementAngle(){return Math.atan2(this.velocity.y,this.velocity.x)}get radiusValue(){return this.radius}get massValue(){return this.mass}get x(){return this.position.x}get y(){return this.position.y}draw(t){t.save(),t.translate(this.position.x,this.position.y),t.rotate(this.angle),t.beginPath(),t.arc(0,0,this.radius,0,2*Math.PI),t.lineTo(0,0),t.strokeStyle="white",t.stroke(),t.restore()}}class s extends i{constructor(t,s,e,h,a,r){var o,l,n;super(t,s,e,i.calculateRadius(e,null==r?void 0:r.density),0,h,a),this.shot=!1,this.circumference=2*Math.PI*this.radius,this.segments=Math.ceil(this.circumference/15),this.segments=Math.min(25,Math.max(5,this.segments)),this.noise=null!=(o=null==r?void 0:r.noise)?o:.2,this.shape=[];for(let i=0;i<this.segments;i++)this.shape.push(2*(Math.random()-.5));this.stroke=null!=(l=null==r?void 0:r.stroke)?l:"white",this.fill=null!=(n=null==r?void 0:r.fill)?n:"black"}drawAsteroid(t,i){t.save(),t.strokeStyle=this.stroke,t.fillStyle=this.fill,t.beginPath();for(let s=0;s<this.shape.length;s++)t.rotate(2*Math.PI/this.shape.length),t.lineTo(this.radius+this.radius*this.noise*this.shape[s],0);t.closePath(),t.fill(),t.stroke(),i&&this.drawGuide(t),t.restore()}drawGuide(t){t.lineWidth=.5,t.beginPath(),t.arc(0,0,this.radius,0,2*Math.PI),t.closePath(),t.stroke(),t.beginPath(),t.lineWidth=.2,t.arc(0,0,this.radius+this.radius*this.noise,0,2*Math.PI),t.closePath(),t.stroke(),t.beginPath(),t.arc(0,0,this.radius-this.radius*this.noise,0,2*Math.PI),t.closePath(),t.stroke()}draw(t,i=!1){t.save(),t.translate(this.position.x,this.position.y),t.rotate(this.angle),this.drawAsteroid(t,i),t.restore()}get isDamaged(){return this.shot}destroy(){this.shot=!0}makeChild(i){return new s(this.x,this.y,i,new t(this.velocity.x,this.velocity.y),this.rotationSpeed)}}class e extends i{constructor(t,s,e,h,a,r){super(t,s,e,i.calculateRadius(e,.001),0,a,r),this.lifeTime=h,this.life=1}drawProjectile(t){t.save();const i=`${Math.round(100*this.life)}%`;t.fillStyle=`rgba(50%, 100%, ${i}, 70%)`,t.beginPath(),t.arc(0,0,this.radius,0,2*Math.PI),t.fill(),t.restore()}update(t,i){this.life-=t/this.lifeTime,super.update(t,i)}draw(t){t.save(),t.translate(this.position.x,this.position.y),t.rotate(this.angle),this.drawProjectile(t),t.restore()}get isDead(){return this.life<=0}die(){this.life=0}}class h extends i{constructor(t,i,s,e,h){var a,r,o,l,n;super(t,i,10,12,1.5*Math.PI),this.weaponReloadTime=.25,this.maxHealth=2,this.isFired=!1,this.isLoaded=!1,this.isCompromised=!1,this.thrusterPower=s,this.weaponPower=null!=e?e:200,this.thrusterOn=!1,this.leftThrusterOn=!1,this.rightThrusterOn=!1,this.lineWidth=null!=(a=null==h?void 0:h.lineWidth)?a:2,this.stroke=null!=(r=null==h?void 0:h.stroke)?r:"white",this.fill=null!=(o=null==h?void 0:h.fill)?o:"black",this.tailCurve=null!=(l=null==h?void 0:h.tailCurve)?l:.25,this.sideCurve=null!=(n=null==h?void 0:h.sideCurve)?n:.75,this.timeUntilReload=this.weaponReloadTime,this.health=this.maxHealth}drawShip(t,i=!1){i&&this.drawAngleAndPositionGuide(t),t.save();const s=.25*Math.PI;i&&this.drawBottomGuide(t),this.thrusterOn&&(t.save(),t.strokeStyle="yellow",t.fillStyle="red",t.lineWidth=3,t.beginPath(),t.moveTo(Math.cos(Math.PI+.8*s)*this.radius/2,Math.sin(Math.PI+.8*s)*this.radius/2),t.quadraticCurveTo(2*-this.radius,0,Math.cos(Math.PI-.8*s)*this.radius/2,Math.sin(Math.PI-.8*s)*this.radius/2),t.fill(),t.stroke(),t.restore()),t.strokeStyle=this.isCompromised?"red":this.stroke,t.lineWidth=this.lineWidth,t.fillStyle=this.isCompromised?"maroon":this.fill,t.beginPath(),t.moveTo(this.radius,0),t.quadraticCurveTo(Math.cos(s)*this.radius*this.sideCurve,Math.sin(s)*this.radius*this.sideCurve,Math.cos(Math.PI-s)*this.radius,Math.sin(Math.PI-s)*this.radius),t.quadraticCurveTo(-this.radius*this.tailCurve,0,Math.cos(Math.PI+s)*this.radius,Math.sin(Math.PI+s)*this.radius),t.quadraticCurveTo(Math.cos(-s)*this.radius*this.sideCurve,Math.sin(-s)*this.radius*this.sideCurve,this.radius,0),t.fill(),t.stroke(),t.closePath(),i&&this.drawGuideTop(t),t.restore()}drawAngleAndPositionGuide(t){t.save(),t.rotate(-this.angle),t.strokeText(`angle: ${Math.floor(180*this.angle/Math.PI)}`,20,this.radius),t.strokeText(`x: ${Math.floor(this.position.x)}, y: ${Math.floor(this.position.y)}`,20,this.radius+12),t.strokeText(`velocity: ${Math.floor(this.velocityValue)}`,20,this.radius+24),t.restore()}drawGuideTop(t){t.lineWidth=.5,t.strokeStyle="white",t.beginPath(),t.moveTo(-this.radius,0),t.lineTo(0,0),t.stroke(),t.beginPath(),t.arc(this.radius*this.tailCurve-this.radius,0,this.radius/50,0,2*Math.PI),t.stroke()}drawBottomGuide(t){t.strokeStyle="white",t.fillStyle="rgba(0, 0, 0, 0.25)",t.lineWidth=.5,t.beginPath(),t.arc(0,0,this.radius,0,2*Math.PI),t.closePath(),t.stroke(),t.fill()}draw(t,i=!1){t.save(),t.translate(this.position.x,this.position.y),t.rotate(this.angle),i&&this.isCompromised&&(t.save(),t.fillStyle="red",t.beginPath(),t.arc(0,0,this.radius,0,2*Math.PI),t.fill(),t.restore()),this.drawShip(t,i),t.restore()}update(t,i){this.thrusterOn&&this.push(this.angle,this.thrusterPower,t);let s=0;this.rightThrusterOn&&(s+=1),this.leftThrusterOn&&(s-=1),this.angle+=3*s*t,this.isLoaded=0===this.timeUntilReload,this.isLoaded||(this.timeUntilReload-=Math.min(t,this.timeUntilReload)),this.isCompromised&&(this.health-=Math.min(t,this.health)),super.update(t,i)}emitProjectile(i){const s=new e(this.position.x+Math.cos(this.angle)*this.radius,this.position.y+Math.sin(this.angle)*this.radius,.025,1,new t(this.velocity.x,this.velocity.y),this.rotationSpeed);return s.push(this.angle,this.weaponPower,i),this.push(this.angle+Math.PI,this.weaponPower,i),this.timeUntilReload=this.weaponReloadTime,s}get healthValue(){return this.health}get maxHealthValue(){return this.maxHealth}}function a(t,i){return function(t,i){return Math.sqrt(Math.pow(t.x-i.x,2)+Math.pow(t.y-i.y,2))}(t,i)<t.radiusValue+i.radiusValue}class r{constructor(i,s,e,h,a){this.label=`${i}: `,this.position=new t(s,e),this.width=h,this.height=a}draw(t,i,s){t.save(),t.strokeStyle="white",t.fillStyle="white",t.font=`${this.height}pt sans-serif`;const e=t.measureText(this.label).width;t.fillText(this.label,this.position.x,this.position.y+this.height-1),t.beginPath(),t.rect(e+this.position.x,this.position.y,this.width,this.height),t.stroke(),t.beginPath(),t.rect(e+this.position.x,this.position.y,this.width*(i/s),this.height),t.fill(),t.restore()}}class o{constructor(i,s,e,h){var a,r,o;this.label=`${i}: `,this.position=new t(s,e),this.digits=null!=(a=null==h?void 0:h.digits)?a:0,this.pt=null!=(r=null==h?void 0:h.pt)?r:10,this.align=null!=(o=null==h?void 0:h.align)?o:"end"}draw(t,i){t.save(),t.fillStyle="white",t.font=`${this.pt}pt sans-serif`,t.textAlign=this.align,t.fillText(`${this.label}${i.toFixed(this.digits)}`,this.position.x,this.position.y+this.pt+1),t.restore()}}class l{constructor(i,s,e){var h,a,r,o;this.position=new t(i,s),this.mainPt=null!=(h=null==e?void 0:e.mainPt)?h:36,this.subPt=null!=(a=null==e?void 0:e.subPt)?a:14,this.fillStyle=null!=(r=null==e?void 0:e.fillStyle)?r:"white",this.textAlign=null!=(o=null==e?void 0:e.align)?o:"center"}draw(t,i,...s){t.save(),t.fillStyle=this.fillStyle,t.textAlign=this.textAlign,t.font=`${this.mainPt}pt sans-serif`,t.fillText(i,this.position.x,this.position.y),t.font=`${this.subPt}pt sans-serif`,s.forEach(((i,s)=>{t.fillText(i,this.position.x,this.position.y+this.mainPt*(s+1))})),t.restore()}}class n extends l{constructor(t,i,s,e){super(t,i,e),this.life=1,this.lifeTime=null!=s?s:1}draw(t,i){this.life>0&&(t.save(),t.fillStyle=this.fillStyle,t.textAlign=this.textAlign,t.globalAlpha=this.life,t.font=`${this.mainPt}pt sans-serif`,t.fillText(i,this.position.x,this.position.y-35*(1-this.life)),t.restore())}update(t){this.life>0&&(this.life-=t/this.lifeTime)}reset(){this.life=1}}new class{constructor(t,i){if(this.guide=!1,this.projectiles=[],this.previous=0,this.elapsed=0,this.asteroidPushForce=5e6,this.asteroidMass=1e4,this.massDestroyed=500,this.score=0,this.fps=0,this.gameOver=!1,this.level=1,this.frame=t=>{this.previous||(this.previous=t),this.elapsed=t-this.previous,this.fps=1e3/this.elapsed,this.update(this.elapsed/1e3),this.draw(),this.previous=t,window.requestAnimationFrame(this.frame)},this.draw=()=>{this.ctx.clearRect(0,0,this.w,this.h),this.guide&&(class{static draw(t,i=10,s=50,e="#00ff00",h="#009900"){t.save(),t.strokeStyle=e,t.fillStyle=h;const a=t.canvas.width,r=t.canvas.height;for(let o=0;o<a;o+=i)t.beginPath(),t.moveTo(o,0),t.lineTo(o,a),t.lineWidth=o%s==0?.5:.25,t.stroke(),o%s==0&&t.fillText(o.toString(),o+3,10);for(let o=0;o<r;o+=i)t.beginPath(),t.moveTo(0,o),t.lineTo(r,o),t.lineWidth=o%s==0?.5:.25,t.stroke(),o%s==0&&t.fillText(o.toString(),3,o+10);t.restore()}}.draw(this.ctx),this.asteroids.forEach((t=>{this.drawGuideLine(t,this.ship)})));for(const t of this.asteroids)t.draw(this.ctx,this.guide);this.projectiles.forEach((t=>{t.draw(this.ctx)})),this.gameOver?this.message.draw(this.ctx,"GAME OVER",`Final score: ${this.score.toFixed()}`,"Press space to play again"):(this.ship.draw(this.ctx,this.guide),this.healthIndicator.draw(this.ctx,this.ship.healthValue,this.ship.maxHealthValue),this.scoreIndicator.draw(this.ctx,this.score),this.levelIndicator.draw(this.ctx,this.level),this.levelupMessage.draw(this.ctx,`Level ${this.level}`),this.guide&&this.fpsIndicator.draw(this.ctx,this.fps))},this.update=t=>{0===this.asteroids.length&&this.levelUp(),this.ship.isCompromised=!1,this.asteroids.forEach((i=>{i.update(t,this.ctx),a(i,this.ship)&&(this.ship.isCompromised=!0)})),this.ship.healthValue<=0?this.gameOver=!0:(this.ship.update(t,this.ctx),this.projectiles.forEach((i=>{i.update(t,this.ctx),i.isDead||this.asteroids.forEach((s=>{a(s,i)&&(i.die(),s.destroy(),this.splitAsteroid(s,t))}))})),this.projectiles=this.projectiles.filter((t=>!t.isDead)),this.asteroids=this.asteroids.filter((t=>!t.isDamaged)),this.ship.isFired&&this.ship.isLoaded&&this.projectiles.push(this.ship.emitProjectile(t)),this.levelupMessage.update(t))},this.run=()=>{console.info("[[Running Asteroids game]]"),window.requestAnimationFrame(this.frame)},console.info("[[Initializing Asteroids game]]"),!t)throw new Error("Canvas element is not provided");this.canvas=t;const s=this.canvas.getContext("2d");if(!s)throw new Error("Getting CanvasRenderingContext2d failed");this.ctx=s,this.ctx.canvas.focus(),this.guide=i,this.ctx.lineWidth=.5,this.ctx.strokeStyle="white",this.ctx.fillStyle="#bada55",this.healthIndicator=new r("HP",5,5,100,10),this.scoreIndicator=new o("Score",this.w-10,5),this.fpsIndicator=new o("FPS",this.w-10,this.h-15,{digits:2}),this.message=new l(this.w/2,.45*this.h),this.levelIndicator=new o("Level",this.w/2,5,{align:"center"}),this.levelupMessage=new n(this.w/2,this.h/2,void 0,{align:"center"}),this.ctx.canvas.addEventListener("keydown",(t=>{this.keyboardHandler(t,!0)})),this.ctx.canvas.addEventListener("keyup",(t=>{this.keyboardHandler(t,!1)})),this.asteroids=[],this.asteroids.push(this.createMovingAsteroid()),this.ship=new h(this.w/2,this.h/2,1e3,400)}resetGame(){this.ship=new h(this.w/2,this.h/2,1e3,400),this.asteroids=[],this.projectiles=[],this.score=0,this.gameOver=!1,this.level=0,this.levelUp()}get w(){return this.ctx.canvas.width}get h(){return this.ctx.canvas.height}keyboardHandler(t,i){let s=!1;switch(t.code){case"ArrowUp":this.ship.thrusterOn=i;break;case"ArrowRight":this.ship.rightThrusterOn=i;break;case"ArrowLeft":this.ship.leftThrusterOn=i;break;case"Space":this.gameOver?this.resetGame():this.ship.isFired=i;break;case"KeyG":i&&(this.guide=!this.guide);break;default:s=!0}s||t.preventDefault()}createMovingAsteroid(t){const i=this.createAsteroid();return this.pushAsteroid(i,t),i}createAsteroid(){return new s(this.w*Math.random(),this.h*Math.random(),this.asteroidMass)}pushAsteroid(t,i=.015){t.push(2*Math.PI*Math.random(),this.asteroidPushForce,i),t.twist((Math.random()-.5)*Math.PI*this.asteroidPushForce*.02,i)}drawGuideLine(t,i){this.ctx.save(),this.ctx.strokeStyle="white",this.ctx.lineWidth=.5,this.ctx.beginPath(),this.ctx.moveTo(t.x,t.y),this.ctx.lineTo(i.x,i.y),this.ctx.stroke(),this.ctx.restore()}splitAsteroid(t,i){const s=t.massValue-this.massDestroyed;this.score+=this.massDestroyed;const e=.25+.5*Math.random();[t.makeChild(s*e),t.makeChild(s*(1-e))].forEach((t=>{t.massValue<this.massDestroyed?this.score+=t.massValue:(this.pushAsteroid(t,i),this.asteroids.push(t))}))}levelUp(){this.level+=1,this.levelupMessage.reset();for(let t=0;t<this.level;t++)this.asteroids.push(this.createMovingAsteroid())}}(document.getElementById("asteroids")).run();
