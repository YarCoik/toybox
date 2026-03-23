// Voronoi Diagram — interactive colored regions, drag seeds
export class VoronoiDiagram {
  constructor(c){this.c=c;this.raf=null;this.seeds=[];this.N=18;this.drag=null;this.hue=0;this.dirty=true;this.cached=null;this.animating=true;}
  init(){
    const w=document.createElement('div');w.style.cssText='position:absolute;inset:0;background:#050210;overflow:hidden;cursor:crosshair';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.className='gc';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    const ctrl=document.createElement('div');ctrl.style.cssText='position:absolute;top:1rem;right:1rem;display:flex;gap:.4rem;z-index:10;flex-direction:column;align-items:flex-end';
    const mk=(lbl,col,fn)=>{const b=document.createElement('button');b.style.cssText=`padding:.35rem .8rem;border-radius:8px;background:rgba(0,0,0,.5);border:1px solid ${col}44;color:${col};font-family:Syne,sans-serif;font-size:.73rem;cursor:pointer;backdrop-filter:blur(8px)`;b.textContent=lbl;b.onclick=fn;return b;};
    ctrl.appendChild(mk('+ Add seed','#7c3aff',()=>{if(!this.cv.width)return;this.seeds.push({x:Math.random()*this.cv.width,y:Math.random()*this.cv.height,hue:Math.random()*360,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5});this.dirty=true;}));
    ctrl.appendChild(mk('🎲 Shuffle','#ffb43a',()=>{this._genSeeds();this.dirty=true;}));
    ctrl.appendChild(mk('🎬 Animate','#3affcb',()=>{this.animating=!this.animating;ctrl.children[2].style.color=this.animating?'#3affcb':'rgba(255,255,255,.4)';}));
    w.appendChild(ctrl);
    const h=document.createElement('div');h.className='hint hint-top';h.textContent='Drag seeds to reshape regions';w.appendChild(h);
    this._mc=e=>{const r=this.cv.getBoundingClientRect(),s=e.touches?e.touches[0]:e,mx=s.clientX-r.left,my=s.clientY-r.top;let best=null,bd=999;this.seeds.forEach(s=>{const d=Math.hypot(s.x-mx,s.y-my);if(d<bd){bd=d;best=s;}});if(bd<30)this.drag=best;else{this.seeds.push({x:mx,y:my,hue:Math.random()*360,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5});this.dirty=true;}};
    this._mm=e=>{if(!this.drag)return;e.preventDefault();const r=this.cv.getBoundingClientRect(),s=e.touches?e.touches[0]:e;this.drag.x=s.clientX-r.left;this.drag.y=s.clientY-r.top;this.dirty=true;};
    this._mu=()=>this.drag=null;
    this.cv.addEventListener('mousedown',this._mc);this.cv.addEventListener('mousemove',this._mm,{passive:false});this.cv.addEventListener('mouseup',this._mu);this.cv.addEventListener('mouseleave',this._mu);
    this.cv.addEventListener('touchstart',this._mc,{passive:true});this.cv.addEventListener('touchmove',this._mm,{passive:false});this.cv.addEventListener('touchend',this._mu);
    this.resize();this._genSeeds();this._loop();
  }
  _genSeeds(){const W=this.cv.width||800,H=this.cv.height||600;this.seeds=[];for(let i=0;i<this.N;i++)this.seeds.push({x:Math.random()*W,y:Math.random()*H,hue:Math.random()*360,vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6});}
  _render(){
    const ctx=this.ctx,W=this.cv.width,H=this.cv.height,sc=3,rW=Math.ceil(W/sc),rH=Math.ceil(H/sc);
    const img=ctx.createImageData(rW,rH),d=img.data;
    for(let py=0;py<rH;py++) for(let px=0;px<rW;px++){
      const rx=px*sc,ry=py*sc;let bi=-1,bd=Infinity;
      this.seeds.forEach((s,si)=>{const dd=Math.hypot(rx-s.x,ry-s.y);if(dd<bd){bd=dd;bi=si;}});
      const s=this.seeds[bi];const[r,g,b]=this._hsl(s.hue/360,.6,.35);
      const i=(py*rW+px)*4;d[i]=r;d[i+1]=g;d[i+2]=b;d[i+3]=255;
    }
    const oc=document.createElement('canvas');oc.width=rW;oc.height=rH;oc.getContext('2d').putImageData(img,0,0);
    ctx.save();ctx.imageSmoothingEnabled=true;ctx.drawImage(oc,0,0,W,H);ctx.restore();
    // Draw seed dots and borders
    this.seeds.forEach(s=>{
      ctx.save();ctx.beginPath();ctx.arc(s.x,s.y,7,0,Math.PI*2);ctx.fillStyle=`hsl(${s.hue},90%,80%)`;ctx.shadowColor=`hsl(${s.hue},100%,80%)`;ctx.shadowBlur=15;ctx.fill();ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=1.5;ctx.stroke();ctx.restore();
    });
    this.cached=true;this.dirty=false;
  }
  _hsl(h,s,l){let r,g,b;const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q,f=(p,q,t)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<.5)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;};r=f(p,q,h+1/3);g=f(p,q,h);b=f(p,q,h-1/3);return[Math.round(r*255),Math.round(g*255),Math.round(b*255)];}
  _loop(){
    const W=this.cv.width,H=this.cv.height;
    if(this.animating&&!this.drag){
      this.seeds.forEach(s=>{s.x+=s.vx;s.y+=s.vy;if(s.x<0||s.x>W)s.vx*=-1;if(s.y<0||s.y>H)s.vy*=-1;s.hue=(s.hue+.15)%360;});
      this.dirty=true;
    }
    if(this.dirty&&W&&H)this._render();
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  resize(){if(this.cv){const r=this.c.getBoundingClientRect();if(r.width&&r.height){this.cv.width=r.width;this.cv.height=r.height;this._genSeeds();this.dirty=true;}}}
  destroy(){cancelAnimationFrame(this.raf);}
}
