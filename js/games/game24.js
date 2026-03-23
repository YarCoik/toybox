// Fireworks — click to launch, physics arcs, colorful explosions
export class Fireworks {
  constructor(c){this.c=c;this.raf=null;this.rockets=[];this.particles=[];this.autoTimer=null;}
  init(){
    const w=document.createElement('div');w.style.cssText='position:absolute;inset:0;background:#000005;cursor:crosshair';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.className='gc';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    const h=document.createElement('div');h.className='hint';h.textContent='Click to launch · Auto-fire is on';w.appendChild(h);
    this._mc=e=>{const r=this.cv.getBoundingClientRect(),s=e.touches?e.touches[0]:e;this._launch(s.clientX-r.left,s.clientY-r.top);};
    this.cv.addEventListener('click',this._mc);this.cv.addEventListener('touchstart',this._mc,{passive:true});
    this.resize();this._startAuto();this._loop();
  }
  _startAuto(){this.autoTimer=setInterval(()=>{if(!this.cv.width)return;this._launch(80+Math.random()*(this.cv.width-160),this.cv.height*.1+Math.random()*this.cv.height*.4);},800);}
  _launch(tx,ty){
    const W=this.cv.width,H=this.cv.height;
    const sx=80+Math.random()*(W-160),sy=H;
    const spd=Math.hypot(tx-sx,ty-sy)*.022;
    const hue=Math.random()*360;
    this.rockets.push({x:sx,y:sy,vx:(tx-sx)*.022,vy:-(spd*0.9+5),tx,ty,hue,trail:[]});
  }
  _explode(x,y,hue){
    const n=60+Math.floor(Math.random()*60);
    for(let i=0;i<n;i++){
      const a=(i/n)*Math.PI*2,sp=2+Math.random()*6;
      this.particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:1,decay:.012+Math.random()*.018,hue:hue+(Math.random()-.5)*40,size:2+Math.random()*2.5,bright:Math.random()<.15});
    }
    // Sparkle center burst
    for(let i=0;i<20;i++){const a=Math.random()*Math.PI*2,sp=Math.random()*3;this.particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:1,decay:.025,hue:hue+60,size:1.5,bright:true});}
  }
  _loop(){
    const ctx=this.ctx,W=this.cv.width,H=this.cv.height;
    if(!W||!H){this.raf=requestAnimationFrame(()=>this._loop());return;}
    ctx.fillStyle='rgba(0,0,5,.2)';ctx.fillRect(0,0,W,H);
    // Stars
    if(!this._stars){this._stars=[];for(let i=0;i<120;i++)this._stars.push({x:Math.random()*W,y:Math.random()*H*.8,r:Math.random()*.6+.2,t:Math.random()*Math.PI*2});}
    this._stars.forEach(s=>{s.t+=.012;ctx.fillStyle=`rgba(255,255,255,${.15+Math.abs(Math.sin(s.t))*.25})`;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();});
    // Rockets
    for(let i=this.rockets.length-1;i>=0;i--){
      const r=this.rockets[i];
      r.trail.push({x:r.x,y:r.y});if(r.trail.length>12)r.trail.shift();
      r.vy+=.15;r.x+=r.vx;r.y+=r.vy;
      // Draw trail
      r.trail.forEach((p,ti)=>{const a=ti/r.trail.length*.7;ctx.fillStyle=`hsla(${r.hue},90%,80%,${a})`;ctx.beginPath();ctx.arc(p.x,p.y,1.5,0,Math.PI*2);ctx.fill();});
      // Explode at apex or near target
      if(r.vy>=0||r.y<=r.ty*1.05){this._explode(r.x,r.y,r.hue);this.rockets.splice(i,1);}
    }
    // Particles
    for(let i=this.particles.length-1;i>=0;i--){
      const p=this.particles[i];
      p.vx*=.97;p.vy+=.06;p.vy*=.97;p.x+=p.vx;p.y+=p.vy;p.life-=p.decay;
      if(p.life<=0){this.particles.splice(i,1);continue;}
      if(p.bright){ctx.save();ctx.shadowColor=`hsl(${p.hue},100%,80%)`;ctx.shadowBlur=8;}
      ctx.fillStyle=`hsla(${p.hue},90%,${60+p.life*30}%,${p.life})`;
      ctx.beginPath();ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);ctx.fill();
      if(p.bright)ctx.restore();
    }
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  resize(){if(this.cv){const r=this.c.getBoundingClientRect();if(r.width&&r.height){this.cv.width=r.width;this.cv.height=r.height;this._stars=null;}}}
  destroy(){cancelAnimationFrame(this.raf);clearInterval(this.autoTimer);}
}
