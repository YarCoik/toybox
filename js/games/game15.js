export class ReactionDiffusion {
  constructor(c){this.c=c;this.raf=null;this.sc=2;this.W=0;this.H=0;this.A=null;this.B=null;this.paused=false;}
  init(){
    const w=document.createElement('div');w.className='fill';w.style.background='#000';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.className='gc';this.cv.style.imageRendering='pixelated';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    // preset buttons
    const ctrl=document.createElement('div');ctrl.style.cssText='position:absolute;bottom:1.5rem;left:50%;transform:translateX(-50%);display:flex;gap:.5rem;z-index:10;flex-wrap:wrap;justify-content:center';
    const presets=[['Coral','#ff6b3a',.055,.062],['Mitosis','#3affcb',.0367,.0649],['Spots','#7c3aff',.03,.062],['Maze','#ffb43a',.029,.057],['Solitons','#3a8fff',.022,.059]];
    presets.forEach(([name,col,f,k])=>{
      const b=document.createElement('button');b.style.cssText=`padding:.4rem .9rem;border-radius:8px;background:rgba(255,255,255,.07);border:1px solid ${col}44;color:${col};font-family:Syne,sans-serif;font-size:.75rem;font-weight:700;cursor:pointer;transition:background .15s`;
      b.textContent=name;b.onmouseenter=()=>b.style.background=col+'22';b.onmouseleave=()=>b.style.background='rgba(255,255,255,.07)';
      b.onclick=()=>{this.f=f;this.k=k;this._reset();};ctrl.appendChild(b);
    });
    w.appendChild(ctrl);
    const h=document.createElement('div');h.className='hint hint-top';h.textContent='Click to disturb · Choose a preset below';w.appendChild(h);
    this._mc=e=>{const r=this.cv.getBoundingClientRect(),s=e.touches?e.touches[0]:e,mx=Math.floor((s.clientX-r.left)/this.sc),my=Math.floor((s.clientY-r.top)/this.sc);this._seed(mx,my,15);};
    this.cv.addEventListener('mousedown',this._mc);this.cv.addEventListener('touchstart',this._mc,{passive:true});
    this.cv.addEventListener('mousemove',e=>{if(e.buttons)this._mc(e);});
    this.f=.055;this.k=.062;this.resize();this._loop();
  }
  _reset(){
    this.A=new Float32Array(this.W*this.H).fill(1);this.B=new Float32Array(this.W*this.H);
    for(let i=0;i<12;i++)this._seed(5+Math.random()*(this.W-10)|0,5+Math.random()*(this.H-10)|0,8);
  }
  _seed(cx,cy,r){for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(dx*dx+dy*dy>r*r)continue;const x=((cx+dx+this.W)%this.W)|0,y=((cy+dy+this.H)%this.H)|0;this.B[y*this.W+x]=1;this.A[y*this.W+x]=0;}}
  _step(){
    const W=this.W,H=this.H,dA=1.0,dB=.5,f=this.f,k=this.k;
    const nA=new Float32Array(W*H),nB=new Float32Array(W*H);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=y*W+x,a=this.A[i],b=this.B[i];
      const lA=this.A[((y-1+H)%H)*W+x]+this.A[((y+1)%H)*W+x]+this.A[y*W+(x-1+W)%W]+this.A[y*W+(x+1)%W]-4*a;
      const lB=this.B[((y-1+H)%H)*W+x]+this.B[((y+1)%H)*W+x]+this.B[y*W+(x-1+W)%W]+this.B[y*W+(x+1)%W]-4*b;
      const r=a*b*b;nA[i]=Math.max(0,Math.min(1,a+dA*lA-r+f*(1-a)));nB[i]=Math.max(0,Math.min(1,b+dB*lB+r-(k+f)*b));
    }
    this.A=nA;this.B=nB;
  }
  _draw(){
    if(!this.W||!this.H)return;
    const img=this.ctx.createImageData(this.W,this.H),d=img.data;
    for(let i=0;i<this.W*this.H;i++){const v=Math.min(255,Math.max(0,(this.A[i]-this.B[i])*255)|0);d[i*4]=v;d[i*4+1]=v>>1;d[i*4+2]=255-v;d[i*4+3]=255;}
    this.ctx.putImageData(img,0,0);
    const W=this.cv.width,H=this.cv.height;if(W!==this.W*this.sc||H!==this.H*this.sc)this.ctx.drawImage(this.cv,0,0,this.W,this.H,0,0,W,H);
  }
  _loop(){
    if(this.A&&this.W){for(let i=0;i<8;i++)this._step();this._draw();}
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  resize(){
    if(!this.cv)return;const r=this.c.getBoundingClientRect();if(!r.width||!r.height)return;
    this.cv.width=r.width;this.cv.height=r.height;
    this.W=Math.floor(r.width/this.sc);this.H=Math.floor(r.height/this.sc);this._reset();
  }
  destroy(){cancelAnimationFrame(this.raf);}
}
