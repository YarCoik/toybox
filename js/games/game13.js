export class LissajousMachine {
  constructor(c){this.c=c;this.raf=null;this.t=0;this.trail=[];this.maxTrail=800;this.freqX=3;this.freqY=2;this.phaseX=0;this.phaseY=0;this.hue=0;this.animPhase=0;}
  init(){
    const w=document.createElement('div');w.className='fill';w.style.cssText='background:#05020f;display:flex;flex-direction:column';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.className='gc';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    const h=document.createElement('div');h.className='hint hint-top';h.textContent='Adjust sliders to change the Lissajous curve';w.appendChild(h);
    // Controls
    const ctrl=document.createElement('div');ctrl.style.cssText='position:absolute;bottom:1rem;left:50%;transform:translateX(-50%);display:flex;gap:1rem;z-index:10;align-items:center;flex-wrap:wrap;justify-content:center';
    const mkSlider=(label,min,max,val,step,cb)=>{const wrap=document.createElement('div');wrap.style.cssText='display:flex;flex-direction:column;align-items:center;gap:4px';const lbl=document.createElement('span');lbl.style.cssText='font-family:DM Mono,monospace;font-size:.65rem;color:rgba(255,255,255,.4);text-transform:uppercase';lbl.textContent=label;const inp=document.createElement('input');inp.type='range';inp.min=min;inp.max=max;inp.value=val;inp.step=step;inp.style.cssText='width:80px;accent-color:#7c3aff;cursor:pointer';inp.oninput=()=>{cb(+inp.value);this.trail=[];};wrap.appendChild(lbl);wrap.appendChild(inp);return wrap;};
    ctrl.appendChild(mkSlider('freq X',1,9,3,1,v=>this.freqX=v));
    ctrl.appendChild(mkSlider('freq Y',1,9,2,1,v=>this.freqY=v));
    ctrl.appendChild(mkSlider('phase',0,360,0,1,v=>this.phaseY=v*(Math.PI/180)));
    ctrl.appendChild(mkSlider('speed',1,20,8,1,v=>this.speed=v));
    w.appendChild(ctrl);this.speed=8;
    this.resize();this._loop();
  }
  _loop(){
    const W=this.cv.width,H=this.cv.height,ctx=this.ctx;
    if(!W||!H){this.raf=requestAnimationFrame(()=>this._loop());return;}
    const cx=W/2,cy=H/2,rx=W*.38,ry=H*.38;
    ctx.fillStyle='rgba(5,2,15,.12)';ctx.fillRect(0,0,W,H);
    this.animPhase+=this.speed*.001;this.hue=(this.hue+.4)%360;
    const x=cx+rx*Math.sin(this.freqX*this.animPhase+this.phaseX);
    const y=cy+ry*Math.sin(this.freqY*this.animPhase+this.phaseY);
    this.trail.push({x,y,hue:this.hue});
    if(this.trail.length>this.maxTrail)this.trail.shift();
    if(this.trail.length<2){this.raf=requestAnimationFrame(()=>this._loop());return;}
    ctx.save();ctx.lineWidth=1.5;ctx.lineCap='round';
    for(let i=1;i<this.trail.length;i++){
      const alpha=i/this.trail.length;const pt=this.trail[i],pp=this.trail[i-1];
      ctx.strokeStyle=`hsla(${pt.hue},90%,65%,${alpha})`;
      ctx.shadowColor=`hsla(${pt.hue},100%,70%,.3)`;ctx.shadowBlur=alpha>0.8?8:0;
      ctx.beginPath();ctx.moveTo(pp.x,pp.y);ctx.lineTo(pt.x,pt.y);ctx.stroke();
    }
    ctx.restore();
    // Dot at tip
    ctx.save();ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fillStyle=`hsl(${this.hue},100%,80%)`;ctx.shadowColor=`hsl(${this.hue},100%,70%)`;ctx.shadowBlur=20;ctx.fill();ctx.restore();
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  resize(){if(this.cv){const r=this.c.getBoundingClientRect();if(r.width&&r.height){this.cv.width=r.width;this.cv.height=r.height;this.trail=[];}}}
  destroy(){cancelAnimationFrame(this.raf);}
}
