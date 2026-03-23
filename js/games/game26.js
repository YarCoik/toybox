// Lorenz Attractor — 3D chaos butterfly projected to 2D
export class LorenzAttractor {
  constructor(c){this.c=c;this.raf=null;this.points=[];this.maxPts=4000;this.x=0.1;this.y=0;this.z=0;this.sigma=10;this.rho=28;this.beta=8/3;this.dt=0.005;this.hue=0;this.rotY=0;this.rotSpeed=.003;this.trail=[];}
  init(){
    const w=document.createElement('div');w.style.cssText='position:absolute;inset:0;background:#020010;overflow:hidden';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.className='gc';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    const ctrl=document.createElement('div');ctrl.style.cssText='position:absolute;bottom:1rem;left:50%;transform:translateX(-50%);display:flex;gap:.7rem;z-index:10;align-items:center;flex-wrap:wrap;justify-content:center';
    const mk=(lbl,min,max,val,step,cb)=>{const wrap=document.createElement('div');wrap.style.cssText='display:flex;flex-direction:column;align-items:center;gap:2px';const l=document.createElement('span');l.style.cssText='font-family:DM Mono,monospace;font-size:.6rem;color:rgba(255,255,255,.3);text-transform:uppercase';l.textContent=lbl;const i=document.createElement('input');i.type='range';i.min=min;i.max=max;i.value=val;i.step=step;i.style.cssText='width:70px;accent-color:#7c3aff;cursor:pointer';i.oninput=()=>{cb(+i.value);this._reset();};wrap.appendChild(l);wrap.appendChild(i);return wrap;};
    ctrl.appendChild(mk('σ (sigma)',5,20,10,.1,v=>this.sigma=v));
    ctrl.appendChild(mk('ρ (rho)',15,50,28,.1,v=>this.rho=v));
    ctrl.appendChild(mk('β (beta)',1,6,2.67,.01,v=>this.beta=v));
    ctrl.appendChild(mk('Speed',1,20,8,1,v=>this.stepsPerFrame=v));
    const rb=document.createElement('button');rb.style.cssText='padding:.35rem .8rem;border-radius:8px;background:rgba(124,58,255,.15);border:1px solid rgba(124,58,255,.3);color:#c8aaff;font-family:Syne,sans-serif;font-size:.75rem;cursor:pointer';rb.textContent='🔄 Reset';rb.onclick=()=>this._reset();ctrl.appendChild(rb);
    w.appendChild(ctrl);
    const h=document.createElement('div');h.className='hint hint-top';h.textContent='Lorenz Attractor — deterministic chaos';w.appendChild(h);
    this.stepsPerFrame=8;this.resize();this._reset();this._loop();
  }
  _reset(){this.x=.1;this.y=0;this.z=0;this.points=[];this.hue=0;}
  _step(){
    const dx=this.sigma*(this.y-this.x)*this.dt;
    const dy=(this.x*(this.rho-this.z)-this.y)*this.dt;
    const dz=(this.x*this.y-this.beta*this.z)*this.dt;
    this.x+=dx;this.y+=dy;this.z+=dz;
    this.points.push({x:this.x,y:this.y,z:this.z,hue:this.hue});
    if(this.points.length>this.maxPts)this.points.shift();
    this.hue=(this.hue+.08)%360;
  }
  _loop(){
    const ctx=this.ctx,W=this.cv.width,H=this.cv.height;
    if(!W||!H){this.raf=requestAnimationFrame(()=>this._loop());return;}
    ctx.fillStyle='rgba(2,0,16,.12)';ctx.fillRect(0,0,W,H);
    for(let i=0;i<this.stepsPerFrame;i++)this._step();
    this.rotY+=this.rotSpeed;
    const scale=Math.min(W,H)*0.012,cx=W/2,cy=H/2;
    // Draw points
    if(this.points.length<2){this.raf=requestAnimationFrame(()=>this._loop());return;}
    ctx.save();ctx.lineWidth=.8;
    for(let i=1;i<this.points.length;i++){
      const p=this.points[i],pp=this.points[i-1];
      const cos=Math.cos(this.rotY),sin=Math.sin(this.rotY);
      const px1=pp.x*cos-pp.z*sin,py1=pp.y,px2=p.x*cos-p.z*sin,py2=p.y;
      const alpha=i/this.points.length;
      ctx.strokeStyle=`hsla(${p.hue},90%,65%,${alpha*.85})`;
      ctx.beginPath();ctx.moveTo(cx+px1*scale,cy-py1*scale);ctx.lineTo(cx+px2*scale,cy-py2*scale);ctx.stroke();
    }
    ctx.restore();
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  resize(){if(this.cv){const r=this.c.getBoundingClientRect();if(r.width&&r.height){this.cv.width=r.width;this.cv.height=r.height;}}}
  destroy(){cancelAnimationFrame(this.raf);}
}
