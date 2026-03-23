export class TypistOrchestra {
  constructor(c){this.c=c;this.letters=[];this.ac=null;this.masterGain=null;this.vol=0.7;this.raf=null;this._ok=null;const keys='QWERTYUIOPASDFGHJKLZXCVBNM1234567890';const f=[130.81,146.83,164.81,174.61,195.99,220,246.94,261.63,293.66,329.63,349.23,392,440,493.88,523.25,587.33,659.26,698.46,783.99,880,987.77,1046.5,1174.66,1318.51,1396.91,1567.98,196,220,246.94,261.63,293.66,329.63,349.23,392,440,493.88];this.nm={};this.cm={};keys.split('').forEach((k,i)=>{this.nm[k]=f[i]||440;this.cm[k]=`hsl(${(i/keys.length*360)|0},85%,65%)`;});}
  init(){
    const w=document.createElement('div');w.className='fill';w.style.background='#06050f';w.style.overflow='hidden';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.className='gc';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    const h=document.createElement('div');h.className='hint';h.textContent='Press any key — every letter plays a unique musical note';w.appendChild(h);
    this.resize();
    this._ok=e=>{const ch=e.key.toUpperCase();if(ch.length!==1||e.ctrlKey||e.altKey||e.metaKey)return;e.preventDefault();this._spawn(ch);};
    const vw=document.createElement('div');vw.className='vol-wrap';vw.style.cssText='position:absolute;top:4.5rem;right:1.5rem;z-index:10';
    vw.innerHTML='<span>🔊</span>';
    const vsl=document.createElement('input');vsl.type='range';vsl.min=0;vsl.max=1;vsl.step=.05;vsl.value=0.7;vsl.style.cssText='width:70px;accent-color:#3a8fff;cursor:pointer';
    vsl.oninput=()=>{this.vol=+vsl.value;if(this.masterGain)this.masterGain.gain.setTargetAtTime(this.vol,this.ac.currentTime,.01);};
    vw.appendChild(vsl);w.appendChild(vw);
    window.addEventListener('keydown',this._ok);this._loop();
  }
  _spawn(ch){
    if(!this.ac){this.ac=new(window.AudioContext||window.webkitAudioContext)();this.masterGain=this.ac.createGain();this.masterGain.gain.value=this.vol;this.masterGain.connect(this.ac.destination);}
    if(this.ac.state==='suspended')this.ac.resume();
    const W=this.cv.width,H=this.cv.height,size=36+Math.random()*24,color=this.cm[ch]||`hsl(${Math.random()*360|0},80%,65%)`;
    this.letters.push({ch,x:80+Math.random()*(W-160),y:-size,vx:(Math.random()-.5)*2,vy:1+Math.random()*2,rot:(Math.random()-.5)*.3,rotV:(Math.random()-.5)*.08,size,color,life:1,floor:H-size*.4,glow:1});
    if(this.letters.length>80)this.letters.shift();
    const ac=this.ac,t=ac.currentTime,freq=this.nm[ch]||440;
    const o=ac.createOscillator(),g=ac.createGain(),o2=ac.createOscillator(),g2=ac.createGain();
    o.frequency.value=freq;o2.frequency.value=freq*2.76;o.connect(g);o2.connect(g2);g.connect(this.masterGain||ac.destination);g2.connect(this.masterGain||ac.destination);
    g.gain.setValueAtTime(.4,t);g.gain.exponentialRampToValueAtTime(.001,t+.7);g2.gain.setValueAtTime(.08,t);g2.gain.exponentialRampToValueAtTime(.001,t+.2);
    o.start(t);o.stop(t+.8);o2.start(t);o2.stop(t+.3);
  }
  _loop(){
    const ctx=this.ctx,W=this.cv.width,H=this.cv.height;
    if(!W||!H){this.raf=requestAnimationFrame(()=>this._loop());return;}
    const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#06050f');bg.addColorStop(1,'#0c0918');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='rgba(255,255,255,.06)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,H-2);ctx.lineTo(W,H-2);ctx.stroke();
    for(let i=this.letters.length-1;i>=0;i--){
      const l=this.letters[i];
      l.vy+=.35;l.x+=l.vx;l.y+=l.vy;l.rot+=l.rotV;l.rotV*=.97;l.vx*=.97;
      if(l.y>=l.floor){l.y=l.floor;l.vy=-Math.abs(l.vy)*.55;l.vx+=(Math.random()-.5)*.5;l.glow=1;if(Math.abs(l.vy)<.3){l.vy=0;l.life-=.004;}}else l.glow=Math.max(0,l.glow-.05);
      if(l.life<=0){this.letters.splice(i,1);continue;}
      ctx.save();ctx.globalAlpha=l.life;ctx.translate(l.x,l.y);ctx.rotate(l.rot);ctx.font=`bold ${l.size}px Syne,sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
      if(l.glow>.05){ctx.save();ctx.filter='blur(10px)';ctx.fillStyle=l.color;ctx.globalAlpha=l.glow*l.life*.5;ctx.fillText(l.ch,0,0);ctx.restore();}
      for(let s=4;s>=0;s--){ctx.fillStyle=`rgba(0,0,0,${.18+s*.04})`;ctx.fillText(l.ch,s*1.2,s*1.2);}
      ctx.fillStyle=l.color;ctx.fillText(l.ch,0,0);ctx.restore();
    }
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  resize(){if(this.cv){const r=this.c.getBoundingClientRect();this.cv.width=r.width;this.cv.height=r.height;this.letters.forEach(l=>l.floor=r.height-l.size*.4);}}
  destroy(){cancelAnimationFrame(this.raf);if(this._ok)window.removeEventListener('keydown',this._ok);this.ac?.close();}
}
