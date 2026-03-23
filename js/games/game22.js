// Game of Life — Conway's classic cellular automaton
export class GameOfLife {
  constructor(c){this.c=c;this.raf=null;this.sc=8;this.cols=0;this.rows=0;this.grid=null;this.next=null;this.running=false;this.gen=0;this.speed=8;this.hue=140;}
  init(){
    const w=document.createElement('div');w.style.cssText='position:absolute;inset:0;background:#03020a;display:flex;flex-direction:column';this.c.appendChild(w);
    const tb=document.createElement('div');tb.style.cssText='display:flex;gap:.5rem;padding:.65rem 1rem;background:rgba(0,0,0,.5);border-bottom:1px solid rgba(255,255,255,.06);flex-wrap:wrap;align-items:center;flex-shrink:0;z-index:10';
    const mkBtn=(lbl,col,fn)=>{const b=document.createElement('button');b.style.cssText=`padding:.38rem .9rem;border-radius:8px;border:1px solid ${col}44;background:rgba(255,255,255,.06);color:${col};font-family:Syne,sans-serif;font-size:.78rem;font-weight:700;cursor:pointer`;b.textContent=lbl;b.onclick=fn;return b;};
    this.playBtn=mkBtn('▶ Play','#3affcb',()=>this._toggle());tb.appendChild(this.playBtn);
    tb.appendChild(mkBtn('🎲 Random','#ffb43a',()=>this._random()));
    tb.appendChild(mkBtn('✨ Gliders','#7c3aff',()=>this._gliders()));
    tb.appendChild(mkBtn('🗑 Clear','#ff3a7c',()=>this._clearGrid()));
    const sl=document.createElement('input');sl.type='range';sl.min=1;sl.max=30;sl.value=8;sl.style.cssText='width:70px;accent-color:#3affcb;cursor:pointer';sl.oninput=()=>this.speed=+sl.value;
    const slw=document.createElement('div');slw.style.cssText='display:flex;flex-direction:column;align-items:center;gap:2px;margin-left:auto';const slLbl=document.createElement('span');slLbl.style.cssText='font-family:DM Mono,monospace;font-size:.62rem;color:rgba(255,255,255,.3)';slLbl.textContent='Speed';slw.appendChild(slLbl);slw.appendChild(sl);tb.appendChild(slw);
    this.genEl=document.createElement('span');this.genEl.style.cssText='font-family:DM Mono,monospace;font-size:.72rem;color:rgba(255,255,255,.3)';this.genEl.textContent='Gen: 0';tb.appendChild(this.genEl);
    w.appendChild(tb);
    this.cv=document.createElement('canvas');this.cv.style.cssText='flex:1;display:block;width:100%;min-height:0;cursor:crosshair;image-rendering:pixelated';w.appendChild(this.cv);
    this.ctx=this.cv.getContext('2d');
    this._bind();
    const h=document.createElement('div');h.className='hint hint-top';h.textContent='Click/drag to draw cells · Press Play to evolve';w.appendChild(h);
    requestAnimationFrame(()=>{this.resize();this._random();this._draw();});
  }
  _setup(){const W=this.cv.clientWidth||this.cv.offsetWidth,H=this.cv.clientHeight||this.cv.offsetHeight;if(!W||!H)return;this.cv.width=W;this.cv.height=H;this.cols=Math.floor(W/this.sc);this.rows=Math.floor(H/this.sc);this.grid=new Uint8Array(this.cols*this.rows);this.next=new Uint8Array(this.cols*this.rows);}
  _i(x,y){return((y+this.rows)%this.rows)*this.cols+((x+this.cols)%this.cols);}
  _g(x,y){return this.grid[this._i(x,y)];}
  _s(x,y,v){this.grid[this._i(x,y)]=v;}
  _clearGrid(){if(!this.grid)return;this.grid.fill(0);this.gen=0;this._draw();}
  _random(){if(!this.cols)return;for(let i=0;i<this.grid.length;i++)this.grid[i]=Math.random()<.3?1:0;this.gen=0;this._draw();}
  _gliders(){
    if(!this.cols)return;this.grid.fill(0);
    const glider=[[0,1],[1,2],[2,0],[2,1],[2,2]];
    for(let k=0;k<8;k++){const ox=Math.floor(Math.random()*(this.cols-10))+2,oy=Math.floor(Math.random()*(this.rows-10))+2;glider.forEach(([dy,dx])=>this._s(ox+dx,oy+dy,1));}
    // Add some R-pentomino seeds
    const rp=[[0,1],[0,2],[1,0],[1,1],[2,1]];
    for(let k=0;k<3;k++){const ox=Math.floor(Math.random()*(this.cols-10))+2,oy=Math.floor(Math.random()*(this.rows-10))+2;rp.forEach(([dy,dx])=>this._s(ox+dx,oy+dy,1));}
    this.gen=0;this._draw();
  }
  _step(){
    for(let y=0;y<this.rows;y++) for(let x=0;x<this.cols;x++){
      let n=0;for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++) if(dx||dy)n+=this._g(x+dx,y+dy);
      const c=this._g(x,y);this.next[this._i(x,y)]=c?((n===2||n===3)?1:0):(n===3?1:0);
    }
    const tmp=this.grid;this.grid=this.next;this.next=tmp;this.gen++;
    if(this.genEl)this.genEl.textContent='Gen: '+this.gen.toLocaleString();
  }
  _draw(){
    if(!this.cols||!this.rows)return;
    const ctx=this.ctx,W=this.cv.width,H=this.cv.height,sc=this.sc;
    ctx.fillStyle='#03020a';ctx.fillRect(0,0,W,H);
    this.hue=(this.hue+.05)%360;
    ctx.fillStyle=`hsl(${this.hue},80%,58%)`;
    for(let y=0;y<this.rows;y++) for(let x=0;x<this.cols;x++)
      if(this.grid[y*this.cols+x])ctx.fillRect(x*sc+1,y*sc+1,sc-1,sc-1);
  }
  _bind(){
    let painting=false,val=1;
    const pos=e=>{const r=this.cv.getBoundingClientRect(),s=e.touches?e.touches[0]:e;return{x:Math.floor((s.clientX-r.left)/this.sc),y:Math.floor((s.clientY-r.top)/this.sc)};};
    this.cv.onmousedown=e=>{painting=true;const p=pos(e);val=this._g(p.x,p.y)?0:1;this._s(p.x,p.y,val);this._draw();};
    this.cv.onmousemove=e=>{if(!painting)return;const p=pos(e);this._s(p.x,p.y,val);this._draw();};
    this.cv.onmouseup=this.cv.onmouseleave=()=>painting=false;
    this.cv.ontouchstart=e=>{e.preventDefault();painting=true;const p=pos(e);val=this._g(p.x,p.y)?0:1;this._s(p.x,p.y,val);this._draw();};
    this.cv.ontouchmove=e=>{e.preventDefault();if(!painting)return;const p=pos(e);this._s(p.x,p.y,val);this._draw();};
    this.cv.ontouchend=()=>painting=false;
  }
  _toggle(){
    this.running=!this.running;this.playBtn.textContent=this.running?'⏸ Pause':'▶ Play';
    if(this.running)this._run();
  }
  _run(){
    if(!this.running)return;
    for(let i=0;i<this.speed;i++)this._step();
    this._draw();
    this.raf=requestAnimationFrame(()=>this._run());
  }
  resize(){this._setup();}
  destroy(){cancelAnimationFrame(this.raf);}
}
