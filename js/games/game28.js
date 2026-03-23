// Spirograph — hypotrochoid/epitrochoid mathematical curves
export class Spirograph {
  constructor(c){this.c=c;this.raf=null;this.R=150;this.r=50;this.d=80;this.speed=2;this.t=0;this.drawing=true;this.hue=0;this.trail=[];this.maxTrail=3000;this.autoNext=false;}
  init(){
    const w=document.createElement('div');w.style.cssText='position:absolute;inset:0;background:#03020c;overflow:hidden';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.className='gc';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    const ctrl=document.createElement('div');ctrl.style.cssText='position:absolute;bottom:1rem;left:50%;transform:translateX(-50%);display:flex;gap:.8rem;z-index:10;align-items:flex-end;flex-wrap:wrap;justify-content:center';
    const mk=(lbl,min,max,val,step,cb)=>{
      const wrap=document.createElement('div');wrap.style.cssText='display:flex;flex-direction:column;align-items:center;gap:3px';
      const l=document.createElement('span');l.style.cssText='font-family:DM Mono,monospace;font-size:.6rem;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.05em';l.textContent=lbl;
      const valEl=document.createElement('span');valEl.style.cssText='font-family:DM Mono,monospace;font-size:.65rem;color:rgba(255,255,255,.5)';valEl.textContent=val;
      const i=document.createElement('input');i.type='range';i.min=min;i.max=max;i.value=val;i.step=step;i.style.cssText='width:80px;accent-color:#a855f7;cursor:pointer';
      i.oninput=()=>{valEl.textContent=i.value;cb(+i.value);this.trail=[];};
      wrap.appendChild(l);wrap.appendChild(i);wrap.appendChild(valEl);return wrap;
    };
    ctrl.appendChild(mk('Outer R',50,250,150,1,v=>{this.R=v;this.t=0;}));
    ctrl.appendChild(mk('Inner r',5,200,50,1,v=>{this.r=v;this.t=0;}));
    ctrl.appendChild(mk('Pen d',5,300,80,1,v=>{this.d=v;this.t=0;}));
    ctrl.appendChild(mk('Speed',1,15,2,1,v=>this.speed=v));
    const btnWrap=document.createElement('div');btnWrap.style.cssText='display:flex;gap:.4rem;flex-direction:column';
    const clrBtn=document.createElement('button');clrBtn.style.cssText='padding:.38rem .8rem;border-radius:8px;background:rgba(168,85,247,.15);border:1px solid rgba(168,85,247,.3);color:#d8b4fe;font-family:Syne,sans-serif;font-size:.75rem;font-weight:700;cursor:pointer';clrBtn.textContent='🗑 Clear';clrBtn.onclick=()=>{this.trail=[];this.t=0;this.ctx.fillStyle='#03020c';this.ctx.fillRect(0,0,this.cv.width,this.cv.height);};
    const rndBtn=document.createElement('button');rndBtn.style.cssText=clrBtn.style.cssText;rndBtn.textContent='🎲 Random';rndBtn.onclick=()=>{this.R=60+Math.random()*180|0;this.r=10+Math.random()*Math.min(this.R-5,150)|0;this.d=10+Math.random()*200|0;this.t=0;this.trail=[];};
    btnWrap.appendChild(clrBtn);btnWrap.appendChild(rndBtn);ctrl.appendChild(btnWrap);
    w.appendChild(ctrl);
    const bh28=document.createElement('div');bh28.className='hint hint-top';bh28.textContent='Adjust R, r, d for new patterns · Random for surprises';w.appendChild(bh28);
    this.resize();this._loop();
  }
  _loop(){
    const ctx=this.ctx,W=this.cv.width,H=this.cv.height;
    if(!W||!H){this.raf=requestAnimationFrame(()=>this._loop());return;}
    const cx=W/2,cy=H/2;
    // Draw faint bg each frame for glow accumulation
    ctx.fillStyle='rgba(3,2,12,.04)';ctx.fillRect(0,0,W,H);
    this.hue=(this.hue+.15)%360;
    // Advance curve
    for(let i=0;i<this.speed;i++){
      this.t+=0.02;
      const k=this.R-this.r;
      const x=cx+k*Math.cos(this.t)+this.d*Math.cos(k/this.r*this.t);
      const y=cy+k*Math.sin(this.t)-this.d*Math.sin(k/this.r*this.t);
      this.trail.push({x,y,hue:(this.hue+this.t*20)%360});
      if(this.trail.length>this.maxTrail)this.trail.shift();
    }
    if(this.trail.length<2){this.raf=requestAnimationFrame(()=>this._loop());return;}
    // Draw trail
    ctx.save();ctx.lineWidth=1.2;ctx.lineCap='round';
    for(let i=1;i<this.trail.length;i++){
      const pt=this.trail[i],pp=this.trail[i-1];
      const alpha=i/this.trail.length;
      ctx.strokeStyle=`hsla(${pt.hue},90%,65%,${alpha*.85})`;
      if(alpha>0.95){ctx.shadowColor=`hsla(${pt.hue},100%,70%,.5)`;ctx.shadowBlur=6;}
      else ctx.shadowBlur=0;
      ctx.beginPath();ctx.moveTo(pp.x,pp.y);ctx.lineTo(pt.x,pt.y);ctx.stroke();
    }
    ctx.restore();
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  resize(){if(this.cv){const r=this.c.getBoundingClientRect();if(r.width&&r.height){this.cv.width=r.width;this.cv.height=r.height;this.trail=[];}}}
  destroy(){cancelAnimationFrame(this.raf);}
}
