// Theremin — mouse controls pitch (X) and volume (Y)
export class Theremin {
  constructor(c){this.c=c;this.raf=null;this.ac=null;this.osc=null;this.gainNode=null;this.mx=0.5;this.my=0.5;this.active=false;this.wave='sine';this.hue=0;this.vol=0.5;}
  init(){
    const w=document.createElement('div');w.style.cssText='position:absolute;inset:0;background:linear-gradient(135deg,#05020f,#0a0518);overflow:hidden;cursor:none';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.className='gc';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    // Title
    const title=document.createElement('div');title.style.cssText='position:absolute;top:4.5rem;left:50%;transform:translateX(-50%);font-family:Syne,sans-serif;font-size:1.4rem;font-weight:800;color:rgba(255,255,255,.6);text-align:center;pointer-events:none;z-index:10;letter-spacing:.1em';title.textContent='THEREMIN';w.appendChild(title);
    // Info labels
    this.pitchEl=document.createElement('div');this.pitchEl.style.cssText='position:absolute;left:1.5rem;bottom:5rem;font-family:DM Mono,monospace;font-size:.72rem;color:rgba(255,255,255,.4);pointer-events:none;z-index:10;line-height:1.8';
    this.pitchEl.innerHTML='← Lower &nbsp;&nbsp; PITCH &nbsp;&nbsp; Higher →<br>↑ Louder &nbsp;&nbsp; VOLUME &nbsp;&nbsp; Quieter ↓';
    w.appendChild(this.pitchEl);
    // Waveform buttons
    const ctrl=document.createElement('div');ctrl.style.cssText='position:absolute;bottom:1rem;left:50%;transform:translateX(-50%);display:flex;gap:.4rem;z-index:10';
    ['sine','triangle','square','sawtooth'].forEach(wt=>{
      const b=document.createElement('button');b.style.cssText=`padding:.35rem .8rem;border-radius:8px;background:${wt===this.wave?'rgba(168,85,247,.25)':'rgba(255,255,255,.06)'};border:1px solid ${wt===this.wave?'rgba(168,85,247,.5)':'rgba(255,255,255,.08)'};color:${wt===this.wave?'#d8b4fe':'rgba(255,255,255,.4)'};font-family:DM Mono,monospace;font-size:.7rem;cursor:pointer`;
      b.textContent={sine:'∿ Sine',triangle:'∧ Tri',square:'⊓ Sq',sawtooth:'⋀ Saw'}[wt];
      b.onclick=()=>{this.wave=wt;if(this.osc)this.osc.type=wt;ctrl.querySelectorAll('button').forEach((x,i)=>{const wti=['sine','triangle','square','sawtooth'][i];x.style.background=wti===wt?'rgba(168,85,247,.25)':'rgba(255,255,255,.06)';x.style.borderColor=wti===wt?'rgba(168,85,247,.5)':'rgba(255,255,255,.08)';x.style.color=wti===wt?'#d8b4fe':'rgba(255,255,255,.4)';});};
      ctrl.appendChild(b);
    });
    // Master volume
    const vw40=document.createElement('div');vw40.className='vol-wrap';
    const vi40=document.createElement('span');vi40.textContent='🔊';
    const vs40=document.createElement('input');vs40.type='range';vs40.min=0;vs40.max=1;vs40.step=.05;vs40.value='0.5';
    vs40.style.cssText='width:70px;accent-color:#c084fc;cursor:pointer';
    vs40.oninput=()=>{this.vol=+vs40.value;};
    vw40.appendChild(vi40);vw40.appendChild(vs40);ctrl.appendChild(vw40);
    w.appendChild(ctrl);
    const h=document.createElement('div');h.className='hint hint-top';h.textContent='Move your hand over the field to play — click to start';w.appendChild(h);
    // Cursor
    this.cursor=document.createElement('div');this.cursor.style.cssText='position:absolute;width:16px;height:16px;border-radius:50%;border:2px solid rgba(255,255,255,.6);transform:translate(-50%,-50%);pointer-events:none;z-index:20;transition:background .1s';w.appendChild(this.cursor);
    this._mm=e=>{const r=this.cv.getBoundingClientRect(),s=e.touches?e.touches[0]:e;this.mx=(s.clientX-r.left)/r.width;this.my=(s.clientY-r.top)/r.height;this.cursor.style.left=(s.clientX-r.left)+'px';this.cursor.style.top=(s.clientY-r.top)+'px';if(this.active)this._updateSound();};
    this._md=e=>{e.preventDefault();this._startSound();this.cursor.style.background='rgba(168,85,247,.5)';};
    this._mu=()=>{this._stopSound();this.cursor.style.background='transparent';};
    this.cv.addEventListener('mousemove',this._mm,{passive:true});this.cv.addEventListener('mousedown',this._md);this.cv.addEventListener('mouseup',this._mu);this.cv.addEventListener('mouseleave',this._mu);
    this.cv.addEventListener('touchmove',this._mm,{passive:true});this.cv.addEventListener('touchstart',e=>{e.preventDefault();this._md(e);this._mm(e);},{passive:false});this.cv.addEventListener('touchend',this._mu);
    this.resize();this._loop();
  }
  _initAC(){if(!this.ac){this.ac=new(window.AudioContext||window.webkitAudioContext)();this.gainNode=this.ac.createGain();this.gainNode.gain.value=0;this.gainNode.connect(this.ac.destination);}if(this.ac.state==='suspended')this.ac.resume();}
  _startSound(){this._initAC();if(this.osc)return;this.osc=this.ac.createOscillator();this.osc.type=this.wave;this.osc.connect(this.gainNode);this.osc.start();this.active=true;this._updateSound();}
  _stopSound(){this.active=false;if(this.gainNode)this.gainNode.gain.setTargetAtTime(0,this.ac.currentTime,.05);setTimeout(()=>{if(!this.active&&this.osc){try{this.osc.stop();}catch(e){}this.osc=null;}},200);}
  _updateSound(){
    if(!this.osc||!this.gainNode||!this.ac)return;
    // X → pitch: 80Hz to 1200Hz
    const freq=80*Math.pow(1200/80,this.mx);
    // Y → volume: bottom = loud, top = quiet
    const vol=(1-this.my)*this.vol;
    this.osc.frequency.setTargetAtTime(freq,this.ac.currentTime,.02);
    this.gainNode.gain.setTargetAtTime(Math.max(0,vol*.5),this.ac.currentTime,.02);
    this.hue=Math.round(this.mx*360);
    if(this.pitchEl)this.pitchEl.innerHTML=`Pitch: <b>${Math.round(freq)}Hz</b> &nbsp;|&nbsp; Volume: <b>${Math.round(vol*100)}%</b>`;
  }
  _loop(){
    const ctx=this.ctx,W=this.cv.width,H=this.cv.height;
    if(!W||!H){this.raf=requestAnimationFrame(()=>this._loop());return;}
    ctx.clearRect(0,0,W,H);
    // Gradient field
    const g=ctx.createLinearGradient(0,0,W,0);g.addColorStop(0,'rgba(30,10,80,.4)');g.addColorStop(.5,'rgba(80,10,100,.3)');g.addColorStop(1,'rgba(10,50,100,.4)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    // Grid lines — vertical (pitch)
    for(let i=0;i<=12;i++){const x=i/12*W;ctx.strokeStyle='rgba(255,255,255,.04)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    // Horizontal (volume)
    for(let i=0;i<=8;i++){const y=i/8*H;ctx.strokeStyle='rgba(255,255,255,.04)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    // Glow where cursor is
    if(this.active){
      const gx=this.mx*W,gy=this.my*H;
      const rg=ctx.createRadialGradient(gx,gy,0,gx,gy,120);rg.addColorStop(0,`hsla(${this.hue},90%,70%,.25)`);rg.addColorStop(.5,`hsla(${this.hue},80%,60%,.1)`);rg.addColorStop(1,'transparent');ctx.fillStyle=rg;ctx.beginPath();ctx.arc(gx,gy,120,0,Math.PI*2);ctx.fill();
      // Ripples
      for(let i=0;i<3;i++){const r=(this.raf%60+i*20)/60*80+20;ctx.strokeStyle=`hsla(${this.hue},90%,70%,${.4*(1-r/100)})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(gx,gy,r,0,Math.PI*2);ctx.stroke();}
    }
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  resize(){if(this.cv){const r=this.c.getBoundingClientRect();if(r.width&&r.height){this.cv.width=r.width;this.cv.height=r.height;}}}
  destroy(){cancelAnimationFrame(this.raf);this._stopSound();if(this.ac)this.ac.close();}
}
