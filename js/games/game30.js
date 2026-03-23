// Perlin-like Noise Terrain — scrolling landscape generator
export class PerlinTerrain {
  constructor(c){this.c=c;this.raf=null;this.offset=0;this.speed=1;this.octaves=4;this.amp=0.5;this.freq=0.003;this.mode='terrain';this.hue=200;this.perm=this._buildPerm();}
  _buildPerm(){const p=Array.from({length:256},(_,i)=>i);for(let i=255;i>0;i--){const j=Math.random()*(i+1)|0;[p[i],p[j]]=[p[j],p[i]];}return [...p,...p];}
  _fade(t){return t*t*t*(t*(t*6-15)+10);}
  _lerp(a,b,t){return a+t*(b-a);}
  _grad(h,x){h&=3;return(h<2?x:-x)*(h%2===0?1:-1);}
  _noise1d(x){const xi=Math.floor(x)&255,xf=x-Math.floor(x),u=this._fade(xf);return this._lerp(this._grad(this.perm[xi],xf),this._grad(this.perm[xi+1],xf-1),u);}
  _fbm(x){let v=0,a=1,f=this.freq,max=0;for(let i=0;i<this.octaves;i++){v+=this._noise1d(x*f*256)*a;max+=a;a*=this.amp;f*=2;}return v/max;}
  init(){
    const w=document.createElement('div');w.style.cssText='position:absolute;inset:0;overflow:hidden';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.className='gc';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    const ctrl=document.createElement('div');ctrl.style.cssText='position:absolute;bottom:1rem;left:50%;transform:translateX(-50%);display:flex;gap:.7rem;z-index:10;align-items:flex-end;flex-wrap:wrap;justify-content:center';
    const mk=(lbl,min,max,val,step,cb)=>{
      const wrap=document.createElement('div');wrap.style.cssText='display:flex;flex-direction:column;align-items:center;gap:2px';
      const l=document.createElement('span');l.style.cssText='font-family:DM Mono,monospace;font-size:.6rem;color:rgba(255,255,255,.35);text-transform:uppercase';l.textContent=lbl;
      const i=document.createElement('input');i.type='range';i.min=min;i.max=max;i.value=val;i.step=step;i.style.cssText='width:75px;accent-color:#10b981;cursor:pointer';i.oninput=()=>cb(+i.value);
      wrap.appendChild(l);wrap.appendChild(i);return wrap;
    };
    ctrl.appendChild(mk('Speed',0,8,1,.1,v=>this.speed=v));
    ctrl.appendChild(mk('Roughness',.1,1,.5,.01,v=>this.amp=v));
    ctrl.appendChild(mk('Scale',1,8,4,1,v=>this.octaves=v));
    ctrl.appendChild(mk('Zoom',.001,.015,.003,.001,v=>this.freq=v));
    const modes=['terrain','ocean','desert','alien'];const mw=document.createElement('div');mw.style.cssText='display:flex;gap:.3rem;flex-direction:column;align-items:center';
    const ml=document.createElement('span');ml.style.cssText='font-family:DM Mono,monospace;font-size:.6rem;color:rgba(255,255,255,.35);text-transform:uppercase';ml.textContent='Mode';mw.appendChild(ml);
    const mb=document.createElement('div');mb.style.cssText='display:flex;gap:.3rem';
    modes.forEach(m=>{const b=document.createElement('button');b.style.cssText=`padding:.32rem .6rem;border-radius:6px;background:${m===this.mode?'rgba(16,185,129,.2)':'rgba(255,255,255,.07)'};border:1px solid ${m===this.mode?'rgba(16,185,129,.4)':'rgba(255,255,255,.1)'};color:${m===this.mode?'#6ee7b7':'rgba(255,255,255,.4)'};font-family:Syne,sans-serif;font-size:.7rem;cursor:pointer`;b.textContent=m;b.onclick=()=>{this.mode=m;mb.querySelectorAll('button').forEach(x=>{x.style.background='rgba(255,255,255,.07)';x.style.borderColor='rgba(255,255,255,.1)';x.style.color='rgba(255,255,255,.4)';});b.style.background='rgba(16,185,129,.2)';b.style.borderColor='rgba(16,185,129,.4)';b.style.color='#6ee7b7';};mb.appendChild(b);});
    mw.appendChild(mb);ctrl.appendChild(mw);
    w.appendChild(ctrl);
    const h=document.createElement('div');h.className='hint hint-top';h.textContent='Procedural terrain — adjust parameters to change the world';w.appendChild(h);
    this.resize();this._loop();
  }
  _getColors(){
    const m=this.mode;
    if(m==='terrain')return{sky:['#0a0e1a','#1a2a4a'],water:'#1a4a8a',sand:'#c8a264',grass:'#2a7a2a',rock:'#666',snow:'#eee',waterH:.45,sandH:.5,grassH:.65,rockH:.85};
    if(m==='ocean')  return{sky:['#050e1a','#0a1a2a'],water:'#0a3060',sand:'#0a4080',grass:'#0a5090',rock:'#0a60a0',snow:'#80c0ff',waterH:.2,sandH:.25,grassH:.5,rockH:.7};
    if(m==='desert') return{sky:['#1a0a00','#2a1500'],water:'#8b4513',sand:'#daa520',grass:'#c8860a',rock:'#aa6600',snow:'#fff8dc',waterH:.3,sandH:.55,grassH:.7,rockH:.85};
    return        {sky:['#000a00','#001a00'],water:'#004400',sand:'#006600',grass:'#00aa00',rock:'#22cc22',snow:'#aaffaa',waterH:.35,sandH:.45,grassH:.65,rockH:.82};
  }
  _loop(){
    const ctx=this.ctx,W=this.cv.width,H=this.cv.height;
    if(!W||!H){this.raf=requestAnimationFrame(()=>this._loop());return;}
    this.offset+=this.speed*.5;
    const cols=this._getColors();
    // Sky gradient
    const skyG=ctx.createLinearGradient(0,0,0,H*.6);skyG.addColorStop(0,cols.sky[0]);skyG.addColorStop(1,cols.sky[1]);ctx.fillStyle=skyG;ctx.fillRect(0,0,W,H);
    // Stars (for dark modes)
    if(!this._stars||this._stars.length===0){this._stars=Array.from({length:100},()=>({x:Math.random()*W,y:Math.random()*H*.5,r:Math.random()*.8+.2,t:Math.random()*Math.PI*2}));}
    this._stars.forEach(s=>{s.t+=.01;ctx.fillStyle=`rgba(255,255,255,${.1+Math.abs(Math.sin(s.t))*.2})`;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();});
    // Terrain layers (far → near)
    for(let layer=3;layer>=0;layer--){
      const layerScale=1+layer*.5,layerOff=this.offset*(layer+1)*.5;
      const alpha=.4+layer*.15;
      ctx.beginPath();ctx.moveTo(0,H);
      for(let x=0;x<=W;x+=2){
        const n=(this._fbm((x+layerOff)*layerScale)+1)/2;
        const y=H*.3+n*H*.55-layer*H*.05;
        x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.lineTo(W,H);ctx.closePath();
      const heightRatio=1-layer/4;const c=this._getLayerColor(cols,heightRatio,alpha);ctx.fillStyle=c;ctx.fill();
    }
    // Water reflection line at bottom
    ctx.fillStyle=cols.water;ctx.fillRect(0,H*.85,W,H*.15);
    ctx.save();ctx.globalAlpha=.3;const wg=ctx.createLinearGradient(0,H*.85,0,H);wg.addColorStop(0,'rgba(255,255,255,.2)');wg.addColorStop(1,'transparent');ctx.fillStyle=wg;ctx.fillRect(0,H*.85,W,H*.08);ctx.restore();
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  _getLayerColor(cols,h,alpha){
    let base;
    if(h<cols.waterH)base=cols.water;
    else if(h<cols.sandH)base=cols.sand;
    else if(h<cols.grassH)base=cols.grass;
    else if(h<cols.rockH)base=cols.rock;
    else base=cols.snow;
    return base+(Math.round(alpha*255).toString(16).padStart(2,'0'));
  }
  resize(){if(this.cv){const r=this.c.getBoundingClientRect();if(r.width&&r.height){this.cv.width=r.width;this.cv.height=r.height;this._stars=null;}}}
  destroy(){cancelAnimationFrame(this.raf);}
}
