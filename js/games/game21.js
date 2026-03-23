export class StringArt {
  constructor(c){this.c=c;this.raf=null;this.pins=[];this.threads=[];this.N=64;this.hue=0;this.step=0;this.autoStep=true;}
  init(){
    const w=document.createElement('div');w.className='fill';w.style.cssText='background:#020108;cursor:pointer';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.className='gc';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    const ctrl=document.createElement('div');ctrl.style.cssText='position:absolute;bottom:1.5rem;left:50%;transform:translateX(-50%);display:flex;gap:.5rem;z-index:10;align-items:center;flex-wrap:wrap;justify-content:center';
    const mkBtn=(lbl,col,fn)=>{const b=document.createElement('button');b.style.cssText=`padding:.4rem .9rem;border-radius:8px;background:rgba(255,255,255,.07);border:1px solid ${col}44;color:${col};font-family:Syne,sans-serif;font-size:.75rem;font-weight:700;cursor:pointer`;b.textContent=lbl;b.onclick=fn;return b;};
    ctrl.appendChild(mkBtn('🔄 Regenerate','#7c3aff',()=>{this.threads=[];this.step=0;this.ctx.fillStyle='#020108';this.ctx.fillRect(0,0,this.cv.width,this.cv.height);this._setupPins();}));
    ctrl.appendChild(mkBtn('⏸ Auto','#3affcb',()=>{this.autoStep=!this.autoStep;ctrl.children[1].textContent=this.autoStep?'⏸ Auto':'▶ Auto';}));
    ctrl.appendChild(mkBtn('+ Thread','#ffb43a',()=>this._addThread()));
    w.appendChild(ctrl);
    const h=document.createElement('div');h.className='hint hint-top';h.textContent='String Art — mathematical thread patterns on a circle of pins';w.appendChild(h);
    this.resize();this._loop();
  }
  _setupPins(){const W=this.cv.width,H=this.cv.height,cx=W/2,cy=H/2,r=Math.min(W,H)*.42;this.pins=[];for(let i=0;i<this.N;i++){const a=(i/this.N)*Math.PI*2-Math.PI/2;this.pins.push({x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r});}}
  _addThread(){if(!this.pins.length)return;const mult=2+Math.floor(Math.random()*8);const hue=(this.hue+Math.random()*120)%360;this.threads.push({mult,hue,alpha:.6+Math.random()*.3});}
  _drawThreads(){
    const ctx=this.ctx,W=this.cv.width,H=this.cv.height;
    ctx.fillStyle='rgba(2,1,8,.06)';ctx.fillRect(0,0,W,H);
    // Draw pins
    this.pins.forEach(p=>{ctx.fillStyle='rgba(255,255,255,.3)';ctx.beginPath();ctx.arc(p.x,p.y,2,0,Math.PI*2);ctx.fill();});
    this.threads.forEach(th=>{ctx.save();ctx.globalAlpha=th.alpha*.5;ctx.lineWidth=.6;ctx.strokeStyle=`hsl(${th.hue},80%,65%)`;ctx.shadowColor=`hsl(${th.hue},90%,65%)`;ctx.shadowBlur=2;ctx.beginPath();for(let i=0;i<=this.N;i++){const from=this.pins[i%this.N],to=this.pins[(i*th.mult)%this.N];if(i===0)ctx.moveTo(from.x,from.y);ctx.lineTo(to.x,to.y);}ctx.stroke();ctx.restore();});
  }
  _loop(){
    if(!this.cv.width||!this.cv.height){this.raf=requestAnimationFrame(()=>this._loop());return;}
    if(!this.pins.length)this._setupPins();
    this.hue=(this.hue+.3)%360;
    if(this.autoStep){this.step++;if(this.step%120===0){this._addThread();if(this.threads.length>12)this.threads.shift();}}
    this._drawThreads();
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  resize(){if(this.cv){const r=this.c.getBoundingClientRect();if(r.width&&r.height){this.cv.width=r.width;this.cv.height=r.height;this.pins=[];this.threads=[];this.step=0;}}}
  destroy(){cancelAnimationFrame(this.raf);}
}
