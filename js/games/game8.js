export class InfiniteZoom {
  constructor(c){this.c=c;this.raf=null;this.zoom=1/3.5;this.panX=-.7;this.panY=0;this.mx=.5;this.my=.5;this.zooming=false;this.hue=0;}
  init(){
    const w=document.createElement('div');w.className='fill';w.style.cssText='background:#000;cursor:crosshair';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.className='gc';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    const h=document.createElement('div');h.className='hint';h.textContent='Hold mouse button to zoom in · Move to explore';w.appendChild(h);
    this._mm=e=>{const r=this.cv.getBoundingClientRect(),s=e.touches?e.touches[0]:e;this.mx=(s.clientX-r.left)/r.width;this.my=(s.clientY-r.top)/r.height;};
    this._md=e=>{this.zooming=true;this._mm(e);};
    this._mu=()=>this.zooming=false;
    this.cv.addEventListener('mousemove',this._mm,{passive:true});this.cv.addEventListener('mousedown',this._md);this.cv.addEventListener('mouseup',this._mu);this.cv.addEventListener('mouseleave',this._mu);
    this.cv.addEventListener('touchstart',this._md,{passive:true});this.cv.addEventListener('touchmove',this._mm,{passive:true});this.cv.addEventListener('touchend',this._mu);
    // Resize first to set canvas dimensions, then start loop
    this.resize();
    this._loop();
  }
  _hsl(h,s,l){let r,g,b;if(s===0){r=g=b=l;}else{const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q,f=(p,q,t)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<.5)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;};r=f(p,q,h+1/3);g=f(p,q,h);b=f(p,q,h-1/3);}return[Math.round(r*255),Math.round(g*255),Math.round(b*255)];}
  _loop(){
    const W=this.cv.width,H=this.cv.height;
    // Guard: don't render if canvas has no size
    if(!W||!H){this.raf=requestAnimationFrame(()=>this._loop());return;}
    this.hue=(this.hue+.5)%360;
    const asp=W/H,range=3.5/this.zoom;
    const fmx=this.panX+(this.mx-.5)*range*asp,fmy=this.panY+(this.my-.5)*range;
    if(this.zooming){this.zoom+=this.zoom*.025;this.panX+=(fmx-this.panX)*.04;this.panY+=(fmy-this.panY)*.04;if(this.zoom>5e11){this.zoom=1/3.5;this.panX=-.7;this.panY=0;}}
    else this.zoom=Math.max(1/3.5,this.zoom*.985);
    const sc=2,rW=Math.max(1,Math.ceil(W/sc)),rH=Math.max(1,Math.ceil(H/sc));
    const maxIter=Math.min(80+Math.floor(Math.log2(this.zoom)*4),256);
    const img=this.ctx.createImageData(rW,rH),d=img.data;
    for(let py=0;py<rH;py++)for(let px=0;px<rW;px++){
      const cx=this.panX+(px/rW-.5)*range*asp,cy=this.panY+(py/rH-.5)*range;
      let zr=0,zi=0,zr2=0,zi2=0,it=0;
      while(zr2+zi2<4&&it<maxIter){zi=2*zr*zi+cy;zr=zr2-zi2+cx;zr2=zr*zr;zi2=zi*zi;it++;}
      const i=(py*rW+px)*4;
      if(it===maxIter){d[i]=0;d[i+1]=0;d[i+2]=8;d[i+3]=255;}
      else{const lz=Math.log(zr2+zi2)/2,nu=Math.log(lz/Math.LN2)/Math.LN2,sm=it+1-nu,t=sm/maxIter,hh=(t*360*3+this.hue)%360;const[r,g,b]=this._hsl(hh/360,.85,.2+t*.55);d[i]=r;d[i+1]=g;d[i+2]=b;d[i+3]=255;}
    }
    const oc=document.createElement('canvas');oc.width=rW;oc.height=rH;oc.getContext('2d').putImageData(img,0,0);
    this.ctx.save();this.ctx.imageSmoothingEnabled=false;this.ctx.drawImage(oc,0,0,W,H);this.ctx.restore();
    if(this.zooming){const mx=this.mx*W,my=this.my*H,g=this.ctx.createRadialGradient(mx,my,0,mx,my,60);g.addColorStop(0,'rgba(255,255,255,.25)');g.addColorStop(1,'transparent');this.ctx.fillStyle=g;this.ctx.beginPath();this.ctx.arc(mx,my,60,0,Math.PI*2);this.ctx.fill();}
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  resize(){if(this.cv){const r=this.c.getBoundingClientRect();if(r.width&&r.height){this.cv.width=r.width;this.cv.height=r.height;}}}
  destroy(){cancelAnimationFrame(this.raf);}
}
