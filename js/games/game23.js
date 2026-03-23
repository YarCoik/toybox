// Boids — Flocking simulation (separation, alignment, cohesion)
export class Boids {
  constructor(c){this.c=c;this.raf=null;this.boids=[];this.N=120;this.sep=30;this.ali=60;this.coh=80;this.maxSpeed=3;this.maxForce=.08;this.trail=true;this.hue=0;}
  init(){
    const w=document.createElement('div');w.style.cssText='position:absolute;inset:0;background:#020a05;overflow:hidden';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.className='gc';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    const ctrl=document.createElement('div');ctrl.style.cssText='position:absolute;bottom:1rem;left:50%;transform:translateX(-50%);display:flex;gap:.6rem;z-index:10;align-items:center;flex-wrap:wrap;justify-content:center';
    const mk=(lbl,min,max,val,cb)=>{const wrap=document.createElement('div');wrap.style.cssText='display:flex;flex-direction:column;align-items:center;gap:2px';const l=document.createElement('span');l.style.cssText='font-family:DM Mono,monospace;font-size:.62rem;color:rgba(255,255,255,.35);text-transform:uppercase';l.textContent=lbl;const i=document.createElement('input');i.type='range';i.min=min;i.max=max;i.value=val;i.style.cssText='width:75px;accent-color:#3affcb;cursor:pointer';i.oninput=()=>cb(+i.value);wrap.appendChild(l);wrap.appendChild(i);return wrap;};
    ctrl.appendChild(mk('Separation',10,80,30,v=>this.sep=v));
    ctrl.appendChild(mk('Alignment',20,150,60,v=>this.ali=v));
    ctrl.appendChild(mk('Cohesion',20,150,80,v=>this.coh=v));
    ctrl.appendChild(mk('Speed',1,8,3,v=>this.maxSpeed=v));
    const tb=document.createElement('button');tb.style.cssText='padding:.35rem .85rem;border-radius:8px;background:rgba(255,255,255,.08);border:1px solid rgba(58,255,203,.3);color:#3affcb;font-family:Syne,sans-serif;font-size:.75rem;cursor:pointer';tb.textContent='🎬 Trail';tb.onclick=()=>{this.trail=!this.trail;tb.style.background=this.trail?'rgba(58,255,203,.15)':'rgba(255,255,255,.08)';};ctrl.appendChild(tb);
    w.appendChild(ctrl);
    const bh=document.createElement('div');bh.className='hint hint-top';bh.textContent='Adjust sliders · Toggle trails · Watch emergent flocking';w.appendChild(bh);
    this.resize();this._spawn();this._loop();
  }
  _spawn(){const W=this.cv.width,H=this.cv.height;this.boids=[];for(let i=0;i<this.N;i++){const a=Math.random()*Math.PI*2,s=1+Math.random()*2;this.boids.push({x:Math.random()*W,y:Math.random()*H,vx:Math.cos(a)*s,vy:Math.sin(a)*s,hue:Math.random()*360});}}
  _limit(vx,vy,max){const m=Math.hypot(vx,vy);if(m>max)return[vx/m*max,vy/m*max];return[vx,vy];}
  _update(){
    const W=this.cv.width,H=this.cv.height,bs=this.boids;
    bs.forEach(b=>{
      let sx=0,sy=0,sn=0,ax=0,ay=0,an=0,cx=0,cy=0,cn=0;
      bs.forEach(o=>{
        if(o===b)return;
        const dx=o.x-b.x,dy=o.y-b.y,d=Math.hypot(dx,dy)||.01;
        if(d<this.sep){sx-=dx/d;sy-=dy/d;sn++;}
        if(d<this.ali){ax+=o.vx;ay+=o.vy;an++;}
        if(d<this.coh){cx+=o.x;cy+=o.y;cn++;}
      });
      let fax=0,fay=0;
      if(sn>0){[fax,fay]=this._limit(sx/sn,sy/sn,this.maxForce);fax*=1.5;fay*=1.5;}
      if(an>0){const[lx,ly]=this._limit(ax/an-b.vx,ay/an-b.vy,this.maxForce);fax+=lx;fay+=ly;}
      if(cn>0){const[lx,ly]=this._limit((cx/cn-b.x)*.005,(cy/cn-b.y)*.005,this.maxForce);fax+=lx;fay+=ly;}
      b.vx+=fax;b.vy+=fay;[b.vx,b.vy]=this._limit(b.vx,b.vy,this.maxSpeed);
      b.x+=b.vx;b.y+=b.vy;
      if(b.x<0)b.x=W;if(b.x>W)b.x=0;if(b.y<0)b.y=H;if(b.y>H)b.y=0;
      b.hue=(b.hue+.3)%360;
    });
  }
  _loop(){
    const ctx=this.ctx,W=this.cv.width,H=this.cv.height;
    if(!W||!H){this.raf=requestAnimationFrame(()=>this._loop());return;}
    if(this.trail){ctx.fillStyle='rgba(2,10,5,.18)';ctx.fillRect(0,0,W,H);}
    else{ctx.fillStyle='#020a05';ctx.fillRect(0,0,W,H);}
    this.hue=(this.hue+.2)%360;
    this._update();
    this.boids.forEach(b=>{
      const angle=Math.atan2(b.vy,b.vx);
      ctx.save();ctx.translate(b.x,b.y);ctx.rotate(angle);
      ctx.beginPath();ctx.moveTo(6,0);ctx.lineTo(-4,3);ctx.lineTo(-4,-3);ctx.closePath();
      ctx.fillStyle=`hsla(${b.hue},85%,65%,.9)`;ctx.shadowColor=`hsla(${b.hue},90%,65%,.4)`;ctx.shadowBlur=6;ctx.fill();ctx.restore();
    });
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  resize(){if(this.cv){const r=this.c.getBoundingClientRect();if(r.width&&r.height){this.cv.width=r.width;this.cv.height=r.height;if(!this.boids.length)this._spawn();}}}
  destroy(){cancelAnimationFrame(this.raf);}
}
