export class GravityWells {
  constructor(c){this.c=c;this.raf=null;this.particles=[];this.wells=[];this.hue=0;}
  init(){
    const w=document.createElement('div');w.className='fill';w.style.cssText='background:#000308;cursor:crosshair';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.className='gc';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    const h=document.createElement('div');h.className='hint';h.textContent='Click to place gravity wells · Right-click to remove';w.appendChild(h);
    this.resize();this._spawnParticles(300);
    this._mc=e=>{e.preventDefault();const r=this.cv.getBoundingClientRect(),s=e.touches?e.touches[0]:e;
      if(e.button===2||e.type==='contextmenu'){const mx=s.clientX-r.left,my=s.clientY-r.top;this.wells=this.wells.filter(wl=>Math.hypot(wl.x-mx,wl.y-my)>40);return;}
      this.wells.push({x:s.clientX-r.left,y:s.clientY-r.top,mass:1+Math.random(),hue:Math.random()*360});
      if(this.wells.length>8)this.wells.shift();
    };
    this.cv.addEventListener('click',this._mc);
    this.cv.addEventListener('contextmenu',e=>{e.preventDefault();this._mc(e);});
    this.cv.addEventListener('touchstart',this._mc,{passive:true});
    this._loop();
  }
  _spawnParticles(n){
    const W=this.cv.width,H=this.cv.height;
    for(let i=0;i<n;i++){this.particles.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*1.5,vy:(Math.random()-.5)*1.5,life:Math.random(),hue:Math.random()*360,size:1+Math.random()*2});}
  }
  _loop(){
    const W=this.cv.width,H=this.cv.height,ctx=this.ctx;
    if(!W||!H){this.raf=requestAnimationFrame(()=>this._loop());return;}
    ctx.fillStyle='rgba(0,3,8,.25)';ctx.fillRect(0,0,W,H);
    this.hue=(this.hue+.3)%360;
    // Draw wells
    this.wells.forEach(wl=>{
      const g=ctx.createRadialGradient(wl.x,wl.y,0,wl.x,wl.y,50);
      g.addColorStop(0,`hsla(${wl.hue},100%,70%,.6)`);g.addColorStop(.3,`hsla(${wl.hue},80%,50%,.2)`);g.addColorStop(1,'transparent');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(wl.x,wl.y,50,0,Math.PI*2);ctx.fill();
      ctx.save();ctx.beginPath();ctx.arc(wl.x,wl.y,6,0,Math.PI*2);ctx.fillStyle=`hsl(${wl.hue},100%,80%)`;ctx.shadowColor=`hsl(${wl.hue},100%,70%)`;ctx.shadowBlur=20;ctx.fill();ctx.restore();
    });
    // Update particles
    this.particles.forEach(p=>{
      this.wells.forEach(wl=>{
        const dx=wl.x-p.x,dy=wl.y-p.y,dist=Math.hypot(dx,dy)||.1;
        const force=Math.min(wl.mass*800/(dist*dist),.8);
        p.vx+=dx/dist*force;p.vy+=dy/dist*force;
      });
      p.vx*=.985;p.vy*=.985;p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
      const speed=Math.hypot(p.vx,p.vy),hue=(p.hue+speed*10)%360;
      ctx.fillStyle=`hsla(${hue},90%,${50+speed*10}%,${.3+speed*.1})`;
      ctx.fillRect(p.x,p.y,p.size+speed*.3,p.size+speed*.3);
    });
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  resize(){if(this.cv){const r=this.c.getBoundingClientRect();if(r.width&&r.height){this.cv.width=r.width;this.cv.height=r.height;if(!this.particles.length)this._spawnParticles(300);}}}
  destroy(){cancelAnimationFrame(this.raf);}
}
