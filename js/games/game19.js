export class AudioScope {
  constructor(c){this.c=c;this.raf=null;this.ac=null;this.analyser=null;this.osc=null;this.freq=440;this.waveType='sine';this.playing=false;this.hue=0;this.vol=0.5;}
  init(){
    const w=document.createElement('div');w.className='fill';w.style.cssText='background:#040208;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.5rem;padding:4rem 1rem 5rem';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.style.cssText='width:min(700px,90%);height:200px;border-radius:12px;background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.06)';this.cv.width=700;this.cv.height=200;this.ctx=this.cv.getContext('2d');w.appendChild(this.cv);
    // Controls
    const ctrl=document.createElement('div');ctrl.style.cssText='display:flex;gap:1rem;align-items:center;flex-wrap:wrap;justify-content:center';
    // Wave select
    const waves=[['sine','∿ Sine','#7c3aff'],['square','⊓ Square','#ff3a7c'],['sawtooth','⋀ Saw','#ffb43a'],['triangle','∧ Tri','#3affcb']];
    this.waveBtns={};
    waves.forEach(([type,label,col])=>{const b=document.createElement('button');b.style.cssText=`padding:.4rem .9rem;border-radius:8px;border:1px solid ${type===this.waveType?col+'88':'rgba(255,255,255,.1)'};background:${type===this.waveType?col+'22':'rgba(255,255,255,.05)'};color:${col};font-family:Syne,sans-serif;font-size:.78rem;font-weight:700;cursor:pointer`;b.textContent=label;b.onclick=()=>{this.waveType=type;if(this.osc)this.osc.type=type;Object.entries(this.waveBtns).forEach(([t,[bb,c2]])=>{bb.style.borderColor=this.waveType===t?c2+'88':'rgba(255,255,255,.1)';bb.style.background=this.waveType===t?c2+'22':'rgba(255,255,255,.05)';});};ctrl.appendChild(b);this.waveBtns[type]=[b,col];});
    // Freq slider
    const fwrap=document.createElement('div');fwrap.style.cssText='display:flex;flex-direction:column;align-items:center;gap:4px';const flbl=document.createElement('span');flbl.style.cssText='font-family:DM Mono,monospace;font-size:.68rem;color:rgba(255,255,255,.4)';flbl.textContent='440 Hz';const fsl=document.createElement('input');fsl.type='range';fsl.min=50;fsl.max=2000;fsl.value=440;fsl.style.cssText='width:140px;accent-color:#7c3aff;cursor:pointer';fsl.oninput=()=>{this.freq=+fsl.value;flbl.textContent=this.freq+' Hz';if(this.osc)this.osc.frequency.setValueAtTime(this.freq,this.ac.currentTime);};fwrap.appendChild(flbl);fwrap.appendChild(fsl);ctrl.appendChild(fwrap);
    // Play button
    this.playBtn=document.createElement('button');this.playBtn.style.cssText='padding:.5rem 1.4rem;border-radius:100px;border:1px solid rgba(124,58,255,.5);background:rgba(124,58,255,.15);color:#c8aaff;font-family:Syne,sans-serif;font-size:.85rem;font-weight:700;cursor:pointer;transition:background .15s';this.playBtn.textContent='▶ PLAY TONE';this.playBtn.onclick=()=>this._togglePlay();ctrl.appendChild(this.playBtn);
    w.appendChild(ctrl);
    const h=document.createElement('div');h.className='hint';h.textContent='Visualizes the waveform of any playing tone';w.appendChild(h);
    this._loop();
  }
  _togglePlay(){
    if(!this.ac)this.ac=new(window.AudioContext||window.webkitAudioContext)();
    if(this.ac.state==='suspended')this.ac.resume();
    if(this.playing){this.osc.stop();this.osc=null;this.playing=false;this.playBtn.textContent='▶ PLAY TONE';this.playBtn.style.borderColor='rgba(124,58,255,.5)';return;}
    this.analyser=this.ac.createAnalyser();this.analyser.fftSize=2048;this.gainNode=this.ac.createGain();this.gainNode.gain.value=this.vol;this.gainNode.connect(this.ac.destination);this.analyser.connect(this.gainNode);
    this.osc=this.ac.createOscillator();this.osc.type=this.waveType;this.osc.frequency.value=this.freq;this.osc.connect(this.analyser);this.osc.start();
    this.playing=true;this.playBtn.textContent='⏹ STOP';this.playBtn.style.borderColor='rgba(255,58,124,.5)';
  }
  _loop(){
    const ctx=this.ctx,W=this.cv.width,H=this.cv.height;
    this.hue=(this.hue+.5)%360;
    ctx.fillStyle='rgba(4,2,8,.2)';ctx.fillRect(0,0,W,H);
    // Grid lines
    ctx.strokeStyle='rgba(255,255,255,.04)';ctx.lineWidth=1;[.25,.5,.75].forEach(v=>{ctx.beginPath();ctx.moveTo(0,v*H);ctx.lineTo(W,v*H);ctx.stroke();});
    if(this.analyser&&this.playing){
      const buf=new Float32Array(this.analyser.fftSize);this.analyser.getFloatTimeDomainData(buf);
      ctx.save();ctx.beginPath();ctx.lineWidth=2;const g=ctx.createLinearGradient(0,0,W,0);g.addColorStop(0,`hsl(${this.hue},90%,65%)`);g.addColorStop(.5,`hsl(${(this.hue+60)%360},90%,65%)`);g.addColorStop(1,`hsl(${(this.hue+120)%360},90%,65%)`);ctx.strokeStyle=g;ctx.shadowColor=`hsl(${this.hue},100%,70%)`;ctx.shadowBlur=12;
      const step=Math.floor(buf.length/W);for(let i=0;i<W;i++){const v=buf[i*step]||0,y=H/2+v*(H*.45);i===0?ctx.moveTo(i,y):ctx.lineTo(i,y);}
      ctx.stroke();ctx.restore();
    }else{
      // idle sine
      ctx.save();ctx.lineWidth=2;ctx.strokeStyle=`hsla(${this.hue},70%,50%,.4)`;ctx.beginPath();for(let i=0;i<W;i++){const y=H/2+Math.sin(i*.04+this.hue*.05)*H*.15;i===0?ctx.moveTo(i,y):ctx.lineTo(i,y);}ctx.stroke();ctx.restore();
    }
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  resize(){}
  destroy(){cancelAnimationFrame(this.raf);if(this.osc){try{this.osc.stop();}catch(e){}}if(this.ac)this.ac.close();}
}
