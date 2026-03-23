// Double Pendulum — chaotic motion visualization
export class DoublePendulum {
  constructor(c){
    this.c=c; this.raf=null; this.hue=0; this.trails=[];
    // Multiple pendulums with slightly different initial conditions to show chaos
    this.pendulums=[];this.maxTrail=600;this.paused=false;
    this.L1=120;this.L2=100;this.m1=10;this.m2=8;
    this.g=9.8;this.dt=0.04;
  }
  init(){
    const w=document.createElement('div');w.style.cssText='position:absolute;inset:0;background:#010108;overflow:hidden';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.className='gc';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    // Controls
    const ctrl=document.createElement('div');ctrl.style.cssText='position:absolute;bottom:1rem;left:50%;transform:translateX(-50%);display:flex;gap:.5rem;z-index:10;align-items:center;flex-wrap:wrap;justify-content:center';
    const mkBtn=(lbl,col,fn)=>{const b=document.createElement('button');b.style.cssText=`padding:.38rem .85rem;border-radius:8px;background:rgba(255,255,255,.07);border:1px solid ${col}44;color:${col};font-family:Syne,sans-serif;font-size:.75rem;font-weight:700;cursor:pointer`;b.textContent=lbl;b.onclick=fn;return b;};
    ctrl.appendChild(mkBtn('⏸ Pause','#ffb43a',()=>{this.paused=!this.paused;ctrl.children[0].textContent=this.paused?'▶ Resume':'⏸ Pause';}));
    ctrl.appendChild(mkBtn('🔄 Reset','#3affcb',()=>this._spawn()));
    ctrl.appendChild(mkBtn('+ Pendulum','#7c3aff',()=>{if(this.pendulums.length<8)this._addPendulum(Math.PI/2+(Math.random()-.5)*.001,Math.PI+(Math.random()-.5)*.001);}));
    ctrl.appendChild(mkBtn('🗑 Trails','#ff3a7c',()=>{this.pendulums.forEach(p=>p.trail=[]);}));
    w.appendChild(ctrl);
    const h=document.createElement('div');h.className='hint hint-top';h.textContent='Double pendulum — tiny differences → wildly different paths (chaos)';w.appendChild(h);
    this.resize();this._spawn();this._loop();
  }
  _addPendulum(a1=Math.PI/2,a2=Math.PI,hue=null){
    this.pendulums.push({a1,a2,v1:0,v2:0,hue:hue??Math.random()*360,trail:[]});
  }
  _spawn(){
    this.pendulums=[];
    for(let i=0;i<5;i++) this._addPendulum(Math.PI/2+(i*.0005),Math.PI+(i*.0005),i*72);
  }
  _step(p){
    const{L1:l1,L2:l2,m1,m2,g,dt}=this;
    const d=p.a1-p.a2,s1=Math.sin(p.a1),s2=Math.sin(p.a2),sd=Math.sin(d),cd=Math.cos(d);
    const denom=2*m1+m2-m2*Math.cos(2*d);
    const a1n=(-g*(2*m1+m2)*s1-m2*g*Math.sin(p.a1-2*p.a2)-2*sd*m2*(p.v2*p.v2*l2+p.v1*p.v1*l1*cd))/(l1*denom);
    const a2n=(2*sd*(p.v1*p.v1*l1*(m1+m2)+g*(m1+m2)*Math.cos(p.a1)+p.v2*p.v2*l2*m2*cd))/(l2*denom);
    p.v1+=a1n*dt; p.v2+=a2n*dt; p.a1+=p.v1*dt; p.a2+=p.v2*dt;
  }
  _loop(){
    const ctx=this.ctx,W=this.cv.width,H=this.cv.height;
    if(!W||!H){this.raf=requestAnimationFrame(()=>this._loop());return;}
    ctx.fillStyle='rgba(1,1,8,.18)';ctx.fillRect(0,0,W,H);
    this.hue=(this.hue+.2)%360;
    const cx=W/2,cy=H*0.35;
    if(!this.paused){for(let i=0;i<3;i++) this.pendulums.forEach(p=>this._step(p));}
    this.pendulums.forEach(p=>{
      const{L1:l1,L2:l2}=this;
      const x1=cx+Math.sin(p.a1)*l1, y1=cy+Math.cos(p.a1)*l1;
      const x2=x1+Math.sin(p.a2)*l2, y2=y1+Math.cos(p.a2)*l2;
      p.trail.push({x:x2,y:y2});
      if(p.trail.length>this.maxTrail) p.trail.shift();
      // Trail
      if(p.trail.length>1){
        ctx.save();ctx.lineWidth=1.2;ctx.lineCap='round';
        for(let i=1;i<p.trail.length;i++){
          const alpha=i/p.trail.length;
          ctx.strokeStyle=`hsla(${p.hue},90%,65%,${alpha*.8})`;
          ctx.beginPath();ctx.moveTo(p.trail[i-1].x,p.trail[i-1].y);ctx.lineTo(p.trail[i].x,p.trail[i].y);ctx.stroke();
        }
        ctx.restore();
      }
      // Rods
      ctx.save();ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x1,y1);ctx.stroke();
      ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
      // Joints
      [cx,cy,x1,y1,x2,y2].reduce((acc,v,i)=>{
        if(i%2===0) return{x:v};
        ctx.beginPath();ctx.arc(acc.x,v,i===1?4:3,0,Math.PI*2);
        ctx.fillStyle=`hsl(${p.hue},90%,70%)`;ctx.shadowColor=`hsl(${p.hue},90%,70%)`;ctx.shadowBlur=10;ctx.fill();
        return acc;
      },{});
      ctx.restore();
    });
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  resize(){if(this.cv){const r=this.c.getBoundingClientRect();if(r.width&&r.height){this.cv.width=r.width;this.cv.height=r.height;}}}
  destroy(){cancelAnimationFrame(this.raf);}
}
