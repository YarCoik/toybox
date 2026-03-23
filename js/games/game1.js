export class FluidParticles {
  constructor(c) { this.c=c; this.pts=[]; this.mx=-999; this.my=-999; this.mvx=0; this.mvy=0; this.mpx=-999; this.mpy=-999; this.hue=0; this.raf=null; }

  init() {
    const w = document.createElement('div');
    w.className = 'fill'; w.style.background = '#02010a'; w.style.cursor = 'none';
    this.c.appendChild(w);
    this.cv = document.createElement('canvas'); this.cv.className = 'gc'; w.appendChild(this.cv);
    this.ctx = this.cv.getContext('2d');
    const h = document.createElement('div'); h.className = 'hint'; h.textContent = 'Move your mouse · Click to burst'; w.appendChild(h);
    this.resize();
    this._mm = e => { const p=this._gp(e); this.mvx=p.x-this.mpx; this.mvy=p.y-this.mpy; this.mpx=this.mx; this.mpy=this.my; this.mx=p.x; this.my=p.y; };
    this._mc = e => { const {x,y}=this._gp(e); for(let i=0;i<70;i++){const a=Math.random()*Math.PI*2,s=2+Math.random()*9; this._sp(x,y,Math.cos(a)*s,Math.sin(a)*s,true);} };
    this.cv.addEventListener('mousemove', this._mm, {passive:true});
    this.cv.addEventListener('touchmove', this._mm, {passive:true});
    this.cv.addEventListener('click', this._mc);
    this.cv.addEventListener('touchstart', this._mc, {passive:true});
    this._loop();
  }

  _gp(e) { const r=this.cv.getBoundingClientRect(),s=e.touches?e.touches[0]:e; return {x:s.clientX-r.left,y:s.clientY-r.top}; }

  _sp(x,y,vx,vy,burst=false) {
    if (this.pts.length >= 1200) this.pts.shift();
    const sp = Math.hypot(vx,vy);
    this.pts.push({x,y, vx:vx+(Math.random()-.5)*1.5, vy:vy+(Math.random()-.5)*1.5, life:1,
      decay: burst ? .013+Math.random()*.015 : .007+Math.random()*.012,
      size:  burst ? 2+Math.random()*5 : 1+Math.random()*3+sp*.15,
      hue: this.hue+(Math.random()-.5)*40, sat:70+Math.random()*30, lit:55+Math.random()*25});
  }

  _loop() {
    const W=this.cv.width, H=this.cv.height, ctx=this.ctx;
    if (!W || !H) { this.raf=requestAnimationFrame(()=>this._loop()); return; }
    ctx.fillStyle = 'rgba(2,1,10,.18)'; ctx.fillRect(0,0,W,H);
    this.hue = (this.hue+.6)%360;
    const sp = Math.hypot(this.mvx,this.mvy);
    if (sp > .5) { const n=Math.min(Math.floor(sp*.8),6); for(let i=0;i<n;i++) this._sp(this.mx+(Math.random()-.5)*4,this.my+(Math.random()-.5)*4,this.mvx*(.4+Math.random()*.6),this.mvy*(.4+Math.random()*.6)); }
    for (let i=this.pts.length-1; i>=0; i--) {
      const p=this.pts[i];
      p.vx*=.97; p.vy*=.97; p.vy+=.02;
      const ang=(p.x*.005+p.y*.007)*2; p.vx+=Math.cos(ang)*.03; p.vy+=Math.sin(ang)*.03;
      p.x+=p.vx; p.y+=p.vy; p.life-=p.decay;
      if (p.life<=0) { this.pts.splice(i,1); continue; }
      const rr=p.size*(.5+p.life*.5)*3;
      const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,rr);
      g.addColorStop(0,`hsla(${p.hue},${p.sat}%,${p.lit}%,${p.life})`);
      g.addColorStop(.4,`hsla(${p.hue},${p.sat}%,${p.lit}%,${p.life*.4})`);
      g.addColorStop(1,`hsla(${p.hue},${p.sat}%,${p.lit}%,0)`);
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,p.y,rr,0,Math.PI*2); ctx.fill();
    }
    this.raf = requestAnimationFrame(()=>this._loop());
  }

  resize() { if(this.cv){const r=this.c.getBoundingClientRect(); this.cv.width=r.width; this.cv.height=r.height;} }
  destroy() { cancelAnimationFrame(this.raf); }
}
