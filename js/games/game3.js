export class JellyBlob {
  constructor(c){this.c=c;this.raf=null;this.pts=[];this.cx=0;this.cy=0;this.R=140;this.N=22;this.drag=null;this.mx=0;this.my=0;this.hue=160;}
  init(){
    const w=document.createElement('div');w.className='fill';w.style.background='#08080f';w.style.cursor='grab';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.className='gc';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    const h=document.createElement('div');h.className='hint';h.textContent='Grab and stretch the blob';w.appendChild(h);
    this.resize();this._ip();
    this._od=e=>{e.preventDefault();const p=this._gp(e);this.mx=p.x;this.my=p.y;let bd=80,bi=-1;this.pts.forEach((pt,i)=>{const d=Math.hypot(pt.x-p.x,pt.y-p.y);if(d<bd){bd=d;bi=i;}});if(bi>=0)this.drag={idx:bi};w.style.cursor='grabbing';};
    this._om=e=>{e.preventDefault();const p=this._gp(e);this.mx=p.x;this.my=p.y;};
    this._ou=()=>{this.drag=null;w.style.cursor='grab';};
    this.cv.addEventListener('mousedown',this._od);this.cv.addEventListener('mousemove',this._om,{passive:false});this.cv.addEventListener('mouseup',this._ou);this.cv.addEventListener('mouseleave',this._ou);
    this.cv.addEventListener('touchstart',this._od,{passive:false});this.cv.addEventListener('touchmove',this._om,{passive:false});this.cv.addEventListener('touchend',this._ou);
    this._loop();
  }
  _ip(){this.pts=[];for(let i=0;i<this.N;i++){const a=(i/this.N)*Math.PI*2;this.pts.push({x:this.cx+Math.cos(a)*this.R,y:this.cy+Math.sin(a)*this.R,vx:0,vy:0});}}
  _gp(e){const r=this.cv.getBoundingClientRect(),s=e.touches?e.touches[0]:e;return{x:s.clientX-r.left,y:s.clientY-r.top};}
  _loop(){
    const ctx=this.ctx,W=this.cv.width,H=this.cv.height;
    if(!W||!H){this.raf=requestAnimationFrame(()=>this._loop());return;}
    ctx.fillStyle='#08080f';ctx.fillRect(0,0,W,H);
    this.hue=(this.hue+.25)%360;
    const kc=.045,kn=.03,dmp=.86,rn=(2*Math.PI*this.R)/this.N;
    this.pts.forEach((p,i)=>{
      if(this.drag?.idx===i){p.vx+=(this.mx-p.x)*.35;p.vy+=(this.my-p.y)*.35;}
      const dx=p.x-this.cx,dy=p.y-this.cy,dist=Math.hypot(dx,dy)||.001;
      p.vx-=(dx/dist)*(dist-this.R)*kc;p.vy-=(dy/dist)*(dist-this.R)*kc;
      [this.pts[(i-1+this.N)%this.N],this.pts[(i+1)%this.N]].forEach(nb=>{const nx=p.x-nb.x,ny=p.y-nb.y,nd=Math.hypot(nx,ny)||.001,nf=(nd-rn)*kn;p.vx-=(nx/nd)*nf;p.vy-=(ny/nd)*nf;});
      p.vx*=dmp;p.vy*=dmp;p.x+=p.vx;p.y+=p.vy;
    });
    ctx.save();ctx.filter='blur(18px)';ctx.beginPath();this._tr(ctx);ctx.closePath();ctx.fillStyle=`hsla(${this.hue},80%,55%,.35)`;ctx.fill();ctx.filter='none';ctx.restore();
    const g=ctx.createRadialGradient(this.cx,this.cy-30,20,this.cx,this.cy,this.R*1.3);
    g.addColorStop(0,`hsla(${this.hue},70%,72%,.95)`);g.addColorStop(.6,`hsla(${(this.hue+30)%360},75%,52%,.9)`);g.addColorStop(1,`hsla(${(this.hue+60)%360},80%,35%,.85)`);
    ctx.beginPath();this._tr(ctx);ctx.closePath();ctx.fillStyle=g;ctx.fill();
    ctx.beginPath();ctx.ellipse(this.cx-this.R*.2,this.cy-this.R*.35,this.R*.3,this.R*.15,-.4,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,.18)';ctx.fill();
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  _tr(ctx){const p=this.pts,N=this.N;ctx.moveTo((p[N-1].x+p[0].x)/2,(p[N-1].y+p[0].y)/2);for(let i=0;i<N;i++){const c=p[i],n=p[(i+1)%N];ctx.quadraticCurveTo(c.x,c.y,(c.x+n.x)/2,(c.y+n.y)/2);}}
  resize(){const r=this.c.getBoundingClientRect();if(this.cv&&r.width&&r.height){this.cv.width=r.width;this.cv.height=r.height;this.cx=r.width/2;this.cy=r.height/2;this.R=Math.min(r.width,r.height)*.28;this._ip();}}
  destroy(){cancelAnimationFrame(this.raf);}
}
