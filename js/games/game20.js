export class LangtonsAnt {
  constructor(c){this.c=c;this.raf=null;this.sc=4;this.grid=null;this.ant=null;this.step=0;this.running=true;this.speed=10;}
  init(){
    const w=document.createElement('div');w.className='fill';w.style.cssText='background:#04020c';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.className='gc';this.cv.style.imageRendering='pixelated';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    const ctrl=document.createElement('div');ctrl.style.cssText='position:absolute;bottom:1.5rem;left:50%;transform:translateX(-50%);display:flex;gap:.5rem;z-index:10;align-items:center';
    const mkBtn=(label,col,fn)=>{const b=document.createElement('button');b.style.cssText=`padding:.4rem .9rem;border-radius:8px;background:rgba(255,255,255,.07);border:1px solid ${col}44;color:${col};font-family:Syne,sans-serif;font-size:.75rem;font-weight:700;cursor:pointer`;b.textContent=label;b.onclick=fn;return b;};
    ctrl.appendChild(mkBtn('⏸ Pause','#ffb43a',()=>{this.running=!this.running;ctrl.children[0].textContent=this.running?'⏸ Pause':'▶ Play';}));
    ctrl.appendChild(mkBtn('🔄 Reset','#3affcb',()=>this._reset()));
    const sl=document.createElement('input');sl.type='range';sl.min=1;sl.max=50;sl.value=10;sl.style.cssText='width:80px;accent-color:#7c3aff;cursor:pointer';sl.oninput=()=>this.speed=+sl.value;
    const slWrap=document.createElement('div');slWrap.style.cssText='display:flex;flex-direction:column;align-items:center;gap:2px';const slLbl=document.createElement('span');slLbl.style.cssText='font-family:DM Mono,monospace;font-size:.62rem;color:rgba(255,255,255,.3)';slLbl.textContent='Speed';slWrap.appendChild(slLbl);slWrap.appendChild(sl);ctrl.appendChild(slWrap);
    w.appendChild(ctrl);
    const h=document.createElement('div');h.className='hint hint-top';h.textContent='Langton\'s Ant — simple rules create complex emergent behavior';w.appendChild(h);
    this.stepEl=document.createElement('div');this.stepEl.style.cssText='position:absolute;top:4.5rem;right:1.5rem;font-family:DM Mono,monospace;font-size:.72rem;color:rgba(255,255,255,.3);z-index:10';w.appendChild(this.stepEl);
    this.resize();this._reset();this._loop();
  }
  _reset(){
    if(!this.cv.width||!this.cv.height)return;
    const W=Math.floor(this.cv.width/this.sc),H=Math.floor(this.cv.height/this.sc);
    this.W=W;this.H=H;this.grid=new Uint8Array(W*H);this.step=0;
    // Multi-ant: place 3 ants with different rules for more visual interest
    this.ant={x:W>>1,y:H>>1,dir:0};
    this.ctx.fillStyle='#04020c';this.ctx.fillRect(0,0,this.cv.width,this.cv.height);
  }
  _stepSim(){
    const {W,H}=this,ant=this.ant,sc=this.sc;
    const i=ant.y*W+ant.x;const was=this.grid[i];
    if(was===0){this.grid[i]=1;ant.dir=(ant.dir+1)%4;}// white → turn right
    else{this.grid[i]=0;ant.dir=(ant.dir+3)%4;}// black → turn left
    const col=this.grid[i]===1?'#c8ff3a':'#04020c';
    this.ctx.fillStyle=col;this.ctx.fillRect(ant.x*sc,ant.y*sc,sc,sc);
    // Draw ant
    this.ctx.fillStyle='#ff3a7c';this.ctx.fillRect(ant.x*sc,ant.y*sc,sc,sc);
    const dirs=[[0,-1],[1,0],[0,1],[-1,0]];const[dx,dy]=dirs[ant.dir];ant.x=((ant.x+dx)+W)%W;ant.y=((ant.y+dy)+H)%H;
    this.step++;
  }
  _loop(){
    if(this.running&&this.W)for(let i=0;i<this.speed;i++)this._stepSim();
    if(this.stepEl)this.stepEl.textContent='Step: '+this.step.toLocaleString();
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  resize(){if(this.cv){const r=this.c.getBoundingClientRect();if(r.width&&r.height){this.cv.width=r.width;this.cv.height=r.height;this._reset();}}}
  destroy(){cancelAnimationFrame(this.raf);}
}
