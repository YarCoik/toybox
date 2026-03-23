// Particle Life — cells that attract/repel each other by species
export class ParticleLife {
  constructor(c){this.c=c;this.raf=null;this.particles=[];this.N=400;this.species=5;this.rules=[];this.hue=0;this.dt=0.016;this.friction=0.85;this.rMax=80;}
  init(){
    const w=document.createElement('div');w.style.cssText='position:absolute;inset:0;background:#000308;overflow:hidden';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.className='gc';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    const ctrl=document.createElement('div');ctrl.style.cssText='position:absolute;bottom:1rem;left:50%;transform:translateX(-50%);display:flex;gap:.5rem;z-index:10;flex-wrap:wrap;justify-content:center';
    const mk=(lbl,col,fn)=>{const b=document.createElement('button');b.style.cssText=`padding:.38rem .85rem;border-radius:8px;background:rgba(255,255,255,.07);border:1px solid ${col}44;color:${col};font-family:Syne,sans-serif;font-size:.75rem;font-weight:700;cursor:pointer`;b.textContent=lbl;b.onclick=fn;return b;};
    ctrl.appendChild(mk('🎲 Shuffle Rules','#7c3aff',()=>this._randomRules()));
    ctrl.appendChild(mk('🌸 Harmony','#3affcb',()=>this._harmonyRules()));
    ctrl.appendChild(mk('💥 Chaos','#ff3a7c',()=>this._chaosRules()));
    ctrl.appendChild(mk('+ More','#ffb43a',()=>{if(this.N<800){this.N+=100;this._spawn();}}));
    w.appendChild(ctrl);
    const h=document.createElement('div');h.className='hint hint-top';h.textContent='Particle Life — emergent cells from attraction/repulsion rules';w.appendChild(h);
    this.resize();this._randomRules();this._spawn();this._loop();
  }
  _randomRules(){
    this.rules=[];for(let i=0;i<this.species;i++){this.rules[i]=[];for(let j=0;j<this.species;j++) this.rules[i][j]=(Math.random()*2-1);}
  }
  _harmonyRules(){
    this.rules=[];for(let i=0;i<this.species;i++){this.rules[i]=[];for(let j=0;j<this.species;j++) this.rules[i][j]=i===j?.5:Math.random()*.6-.1;}
  }
  _chaosRules(){
    this.rules=[];const r=()=>Math.random()<.5?-1:1;for(let i=0;i<this.species;i++){this.rules[i]=[];for(let j=0;j<this.species;j++) this.rules[i][j]=r()*(Math.random()*.8+.2);}
  }
  _spawn(){
    const W=this.cv.width||800,H=this.cv.height||600;this.particles=[];
    for(let i=0;i<this.N;i++) this.particles.push({x:Math.random()*W,y:Math.random()*H,vx:0,vy:0,s:Math.floor(Math.random()*this.species)});
  }
  _loop(){
    const ctx=this.ctx,W=this.cv.width,H=this.cv.height;
    if(!W||!H){this.raf=requestAnimationFrame(()=>this._loop());return;}
    ctx.fillStyle='rgba(0,3,8,.25)';ctx.fillRect(0,0,W,H);
    const rMax=this.rMax,dt=this.dt,friction=this.friction;
    // Update forces
    this.particles.forEach(a=>{
      let fx=0,fy=0;
      this.particles.forEach(b=>{
        if(a===b)return;
        const dx=b.x-a.x,dy=b.y-a.y;
        let ddx=dx,ddy=dy;
        // Wrap-around distance
        if(Math.abs(ddx)>W/2)ddx=ddx>0?ddx-W:ddx+W;
        if(Math.abs(ddy)>H/2)ddy=ddy>0?ddy-H:ddy+H;
        const d=Math.hypot(ddx,ddy);
        if(d>0&&d<rMax){
          const rule=this.rules[a.s]?.[b.s]??0;
          // Force profile: repulsion at close range, attraction/repulsion at medium
          let f=0;
          if(d<rMax*.3){f=-1*(1-d/(rMax*.3));}
          else{const t=(d/rMax-.3)/.7;f=rule*(1-Math.abs(t*2-1));}
          fx+=ddx/d*f;fy+=ddy/d*f;
        }
      });
      a.vx=(a.vx+fx*.1)*friction;a.vy=(a.vy+fy*.1)*friction;
      a.x=(a.x+a.vx*dt*60+W)%W;a.y=(a.y+a.vy*dt*60+H)%H;
    });
    // Draw
    this.particles.forEach(p=>{
      const hue=(p.s/this.species)*360;
      ctx.fillStyle=`hsla(${hue},90%,65%,.8)`;
      ctx.beginPath();ctx.arc(p.x,p.y,2.5,0,Math.PI*2);ctx.fill();
    });
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  resize(){if(this.cv){const r=this.c.getBoundingClientRect();if(r.width&&r.height){this.cv.width=r.width;this.cv.height=r.height;this._spawn();}}}
  destroy(){cancelAnimationFrame(this.raf);}
}
