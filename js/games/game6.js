export class MandalaDraw {
  constructor(c){this.c=c;this.drawing=false;this.lx=0;this.ly=0;this.hue=0;this.sym=8;this.hist=[];this._hr=null;}
  init(){
    const w=document.createElement('div');w.className='fill';w.style.background='#06040f';w.style.cursor='crosshair';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.className='gc';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    const ctrl=document.createElement('div');ctrl.className='md-c';
    const sl=document.createElement('span');sl.style.cssText='font-family:DM Mono,monospace;font-size:.72rem;color:rgba(255,255,255,.35)';sl.textContent='SYM:';ctrl.appendChild(sl);
    this.sbtns={};
    [4,6,8,12,16].forEach(n=>{const b=document.createElement('button');b.className='md-b';b.textContent=n;if(n===this.sym)b.classList.add('sel');b.onclick=()=>{this.sym=n;Object.values(this.sbtns).forEach(x=>x.classList.remove('sel'));b.classList.add('sel');};ctrl.appendChild(b);this.sbtns[n]=b;});
    const ub=document.createElement('button');ub.className='md-b';ub.textContent='↩ Undo';ub.onclick=()=>{if(this.hist.length)this.ctx.putImageData(this.hist.pop(),0,0);};ctrl.appendChild(ub);
    const cb=document.createElement('button');cb.className='md-b';cb.textContent='Clear';cb.onclick=()=>{this.hist=[];this.ctx.clearRect(0,0,this.cv.width,this.cv.height);this._bg();};ctrl.appendChild(cb);
    w.appendChild(ctrl);
    const hi6=document.createElement('div');hi6.className='hint hint-top';hi6.textContent='Draw symmetrical mandalas · Use the controls below';w.appendChild(hi6);
    this.resize();this._bg();
    this._od=e=>{this.drawing=true;const p=this._gp(e);this.lx=p.x;this.ly=p.y;if(this.cv.width>0&&this.cv.height>0)this.hist.push(this.ctx.getImageData(0,0,this.cv.width,this.cv.height));if(this.hist.length>25)this.hist.shift();};
    this._om=e=>{if(!this.drawing)return;e.preventDefault();const p=this._gp(e);this._draw(this.lx,this.ly,p.x,p.y);this.lx=p.x;this.ly=p.y;};
    this._ou=()=>this.drawing=false;
    this.cv.addEventListener('mousedown',this._od);this.cv.addEventListener('mousemove',this._om,{passive:false});this.cv.addEventListener('mouseup',this._ou);this.cv.addEventListener('mouseleave',this._ou);
    this.cv.addEventListener('touchstart',this._od,{passive:false});this.cv.addEventListener('touchmove',this._om,{passive:false});this.cv.addEventListener('touchend',this._ou);
    const tick=()=>{this.hue=(this.hue+.4)%360;this._hr=requestAnimationFrame(tick);};this._hr=requestAnimationFrame(tick);
  }
  _gp(e){const r=this.cv.getBoundingClientRect(),s=e.touches?e.touches[0]:e;return{x:s.clientX-r.left,y:s.clientY-r.top};}
  _bg(){const ctx=this.ctx,W=this.cv.width,H=this.cv.height;if(!W||!H)return;const cx=W/2,cy=H/2,r=Math.min(W,H)*.45;ctx.fillStyle='#06040f';ctx.fillRect(0,0,W,H);ctx.strokeStyle='rgba(255,255,255,.04)';ctx.lineWidth=1;for(let i=0;i<16;i++){const a=(i/16)*Math.PI*2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);ctx.stroke();}for(let rc=1;rc<=4;rc++){ctx.beginPath();ctx.arc(cx,cy,r*rc/4,0,Math.PI*2);ctx.stroke();}}
  _draw(x1,y1,x2,y2){const ctx=this.ctx,cx=this.cv.width/2,cy=this.cv.height/2,rx1=x1-cx,ry1=y1-cy,rx2=x2-cx,ry2=y2-cy;ctx.lineWidth=3;ctx.lineCap='round';ctx.strokeStyle=`hsl(${this.hue},100%,65%)`;ctx.shadowColor=`hsl(${this.hue},100%,65%)`;ctx.shadowBlur=8;for(let i=0;i<this.sym;i++){const a=(i/this.sym)*Math.PI*2,cos=Math.cos(a),sin=Math.sin(a);ctx.beginPath();ctx.moveTo(rx1*cos-ry1*sin+cx,rx1*sin+ry1*cos+cy);ctx.lineTo(rx2*cos-ry2*sin+cx,rx2*sin+ry2*cos+cy);ctx.stroke();ctx.beginPath();ctx.moveTo(-rx1*cos-ry1*sin+cx,-rx1*sin+ry1*cos+cy);ctx.lineTo(-rx2*cos-ry2*sin+cx,-rx2*sin+ry2*cos+cy);ctx.stroke();}ctx.shadowBlur=0;}
  resize(){if(this.cv){const r=this.c.getBoundingClientRect();if(r.width&&r.height){this.cv.width=r.width;this.cv.height=r.height;this._bg();}}}
  destroy(){cancelAnimationFrame(this._hr);}
}
