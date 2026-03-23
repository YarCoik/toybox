// Bouncing Shapes — physics sandbox with bounceable shapes
export class BouncingShapes {
  constructor(c){this.c=c;this.raf=null;this.balls=[];this.gravity=.35;this.friction=.992;this.restitution=.75;this.hue=0;this.maxBalls=80;}
  init(){
    const w=document.createElement('div');w.style.cssText='position:absolute;inset:0;background:#04020e;overflow:hidden;cursor:crosshair';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.className='gc';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    const ctrl=document.createElement('div');ctrl.style.cssText='position:absolute;top:1rem;right:1rem;display:flex;flex-direction:column;gap:.4rem;z-index:10';
    const mkSl=(lbl,min,max,val,step,col,cb)=>{
      const wrap=document.createElement('div');wrap.style.cssText='display:flex;flex-direction:column;align-items:flex-end;gap:2px';
      const l=document.createElement('span');l.style.cssText=`font-family:DM Mono,monospace;font-size:.62rem;color:rgba(255,255,255,.3)`;l.textContent=lbl;
      const i=document.createElement('input');i.type='range';i.min=min;i.max=max;i.value=val;i.step=step;i.style.cssText=`width:80px;accent-color:${col};cursor:pointer`;i.oninput=()=>cb(+i.value);
      wrap.appendChild(l);wrap.appendChild(i);return wrap;
    };
    ctrl.appendChild(mkSl('Gravity',0,1,.35,.01,'#ff3a7c',v=>this.gravity=v));
    ctrl.appendChild(mkSl('Bounce',0,1,.75,.01,'#3affcb',v=>this.restitution=v));
    ctrl.appendChild(mkSl('Friction',.95,1,.992,.001,'#ffb43a',v=>this.friction=v));
    const clrBtn=document.createElement('button');clrBtn.style.cssText='padding:.38rem .75rem;border-radius:8px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.6);font-family:Syne,sans-serif;font-size:.73rem;cursor:pointer';clrBtn.textContent='🗑 Clear';clrBtn.onclick=()=>this.balls=[];ctrl.appendChild(clrBtn);
    const explBtn=document.createElement('button');explBtn.style.cssText=clrBtn.style.cssText;explBtn.textContent='💥 Explode';explBtn.onclick=()=>this._explode();ctrl.appendChild(explBtn);
    w.appendChild(ctrl);
    const h=document.createElement('div');h.className='hint';h.textContent='Click to spawn shapes · Hold and drag to throw';w.appendChild(h);
    let dragging=false,dx0=0,dy0=0,spawnEl=null,spawnTime=0;
    this._mc=e=>{const p=this._gp(e);dragging=true;dx0=p.x;dy0=p.y;spawnTime=Date.now();};
    this._mm=e=>{if(!dragging)return;};
    this._mu=e=>{
      if(!dragging)return;dragging=false;const p=this._gp(e);
      const dt=Math.max(.001,(Date.now()-spawnTime)/1000);
      const vx=(p.x-dx0)/(dt*60),vy=(p.y-dy0)/(dt*60);
      this._spawn(dx0,dy0,Math.max(-12,Math.min(12,vx)),Math.max(-12,Math.min(12,vy)));
    };
    this.cv.addEventListener('mousedown',this._mc);this.cv.addEventListener('mousemove',this._mm);this.cv.addEventListener('mouseup',this._mu);
    this.cv.addEventListener('touchstart',e=>{e.preventDefault();this._mc(e);},{passive:false});this.cv.addEventListener('touchend',e=>{e.preventDefault();this._mu(e);},{passive:false});
    // Spawn a few to start
    this.resize();
    setTimeout(()=>{for(let i=0;i<12;i++)this._spawn(80+Math.random()*(this.cv.width-160),Math.random()*this.cv.height*.4,(Math.random()-.5)*4,(Math.random()-.5)*2);},100);
    this._loop();
  }
  _gp(e){const r=this.cv.getBoundingClientRect(),s=e.touches?e.touches[0]:e;return{x:s.clientX-r.left,y:s.clientY-r.top};}
  _spawn(x,y,vx=0,vy=0){
    if(this.balls.length>=this.maxBalls)this.balls.shift();
    const shapes=['circle','circle','circle','square','triangle','pentagon'];
    const shape=shapes[Math.floor(Math.random()*shapes.length)];
    this.balls.push({x,y,vx,vy:vy||-.5,r:10+Math.random()*22,hue:Math.random()*360,shape,rot:Math.random()*Math.PI*2,rotV:(Math.random()-.5)*.1});
  }
  _explode(){const cx=this.cv.width/2,cy=this.cv.height/2;this.balls.forEach(b=>{const dx=b.x-cx,dy=b.y-cy,d=Math.hypot(dx,dy)||1;const f=15/d*50;b.vx+=dx/d*f;b.vy+=dy/d*f;});}
  _update(){
    const W=this.cv.width,H=this.cv.height;
    this.balls.forEach(b=>{
      b.vy+=this.gravity;b.vx*=this.friction;b.vy*=this.friction;
      b.x+=b.vx;b.y+=b.vy;b.rot+=b.rotV;
      if(b.y+b.r>H){b.y=H-b.r;b.vy=-Math.abs(b.vy)*this.restitution;b.vx*=.92;b.rotV*=.88;if(Math.abs(b.vy)<.5)b.vy=0;}
      if(b.y-b.r<0){b.y=b.r;b.vy=Math.abs(b.vy)*this.restitution;}
      if(b.x+b.r>W){b.x=W-b.r;b.vx=-Math.abs(b.vx)*this.restitution;}
      if(b.x-b.r<0){b.x=b.r;b.vx=Math.abs(b.vx)*this.restitution;}
    });
    // Ball-ball collisions (simplified)
    for(let i=0;i<this.balls.length;i++) for(let j=i+1;j<this.balls.length;j++){
      const a=this.balls[i],b=this.balls[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);
      if(d<a.r+b.r&&d>0){const nx=dx/d,ny=dy/d,overlap=(a.r+b.r-d)*.5;a.x-=nx*overlap;a.y-=ny*overlap;b.x+=nx*overlap;b.y+=ny*overlap;const dv=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;if(dv>0){const imp=dv*this.restitution;a.vx-=nx*imp;a.vy-=ny*imp;b.vx+=nx*imp;b.vy+=ny*imp;}}
    }
  }
  _drawShape(ctx,b){
    ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.rot);
    const g=ctx.createRadialGradient(-b.r*.3,-b.r*.3,0,0,0,b.r);g.addColorStop(0,`hsla(${b.hue},80%,75%,.95)`);g.addColorStop(1,`hsla(${b.hue},70%,45%,.85)`);ctx.fillStyle=g;ctx.shadowColor=`hsla(${b.hue},90%,65%,.4)`;ctx.shadowBlur=b.r*.6;
    ctx.beginPath();
    if(b.shape==='circle'){ctx.arc(0,0,b.r,0,Math.PI*2);}
    else if(b.shape==='square'){ctx.rect(-b.r*.75,-b.r*.75,b.r*1.5,b.r*1.5);}
    else if(b.shape==='triangle'){const s=b.r*1.1;for(let i=0;i<3;i++){const a=(i/3)*Math.PI*2-Math.PI/2;i===0?ctx.moveTo(Math.cos(a)*s,Math.sin(a)*s):ctx.lineTo(Math.cos(a)*s,Math.sin(a)*s);}ctx.closePath();}
    else{for(let i=0;i<5;i++){const a=(i/5)*Math.PI*2-Math.PI/2;i===0?ctx.moveTo(Math.cos(a)*b.r,Math.sin(a)*b.r):ctx.lineTo(Math.cos(a)*b.r,Math.sin(a)*b.r);}ctx.closePath();}
    ctx.fill();ctx.restore();
  }
  _loop(){
    const ctx=this.ctx,W=this.cv.width,H=this.cv.height;
    if(!W||!H){this.raf=requestAnimationFrame(()=>this._loop());return;}
    ctx.fillStyle='rgba(4,2,14,.22)';ctx.fillRect(0,0,W,H);
    this.hue=(this.hue+.3)%360;
    // Floor glow
    const fg=ctx.createLinearGradient(0,H*.9,0,H);fg.addColorStop(0,'transparent');fg.addColorStop(1,'rgba(124,58,255,.06)');ctx.fillStyle=fg;ctx.fillRect(0,H*.9,W,H*.1);
    this._update();
    this.balls.forEach(b=>this._drawShape(ctx,b));
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  resize(){if(this.cv){const r=this.c.getBoundingClientRect();if(r.width&&r.height){this.cv.width=r.width;this.cv.height=r.height;}}}
  destroy(){cancelAnimationFrame(this.raf);}
}
