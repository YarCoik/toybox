export class PixelCanvas {
  constructor(c){this.c=c;this.sz=16;this.cols=48;this.rows=32;this.grid=null;this.color='#ff3a7c';this.tool='draw';this.painting=false;}
  init(){
    const w=document.createElement('div');w.style.cssText='position:absolute;inset:0;background:#0a0a14;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;padding:4rem 1rem 1rem';this.c.appendChild(w);
    // Toolbar
    const tb=document.createElement('div');tb.style.cssText='display:flex;gap:.5rem;align-items:center;flex-wrap:wrap;justify-content:center';
    const tools=[['draw','✏ Draw','#ff3a7c'],['erase','⬜ Erase','#888'],['fill','🪣 Fill','#ffb43a']];const self=this;this.toolBtns={};
    tools.forEach(([id,lbl,col])=>{const b=document.createElement('button');b.style.cssText=`padding:.4rem .85rem;border-radius:8px;border:1px solid ${id===this.tool?col+'88':'rgba(255,255,255,.1)'};background:${id===this.tool?col+'22':'rgba(255,255,255,.05)'};color:${col};font-family:Syne,sans-serif;font-size:.76rem;font-weight:700;cursor:pointer`;b.textContent=lbl;b.onclick=()=>{this.tool=id;Object.values(this.toolBtns).forEach((bb,bi)=>{const [,,c2]=tools[bi];bb.style.borderColor=this.tool===tools[bi][0]?c2+'88':'rgba(255,255,255,.1)';bb.style.background=this.tool===tools[bi][0]?c2+'22':'rgba(255,255,255,.05)';});};tb.appendChild(b);this.toolBtns[id]=b;});
    // Color picker
    const cp=document.createElement('input');cp.type='color';cp.value='#ff3a7c';cp.style.cssText='width:36px;height:36px;border-radius:8px;border:none;cursor:pointer;background:none;padding:2px';cp.oninput=()=>this.color=cp.value;tb.appendChild(cp);
    // Palette
    ['#ff3a7c','#ffb43a','#3affcb','#7c3aff','#3a8fff','#ff6b3a','#ffffff','#c8ff3a','#ff3a3a','#3afff0','#000000','#555577'].forEach(col=>{const s=document.createElement('div');s.style.cssText=`width:22px;height:22px;border-radius:4px;background:${col};cursor:pointer;border:2px solid transparent;transition:border-color .1s`;s.onclick=()=>{this.color=col;cp.value=col;};s.onmouseenter=()=>s.style.borderColor='rgba(255,255,255,.5)';s.onmouseleave=()=>s.style.borderColor='transparent';tb.appendChild(s);});
    // Clear
    const clr=document.createElement('button');clr.style.cssText='padding:.4rem .85rem;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:rgba(255,255,255,.5);font-family:Syne,sans-serif;font-size:.76rem;cursor:pointer';clr.textContent='🗑 Clear';clr.onclick=()=>this.grid.fill('#111118');tb.appendChild(clr);
    w.appendChild(tb);
    // Canvas
    const cvWrap=document.createElement('div');cvWrap.style.cssText='border:1px solid rgba(255,255,255,.08);border-radius:4px;overflow:hidden;cursor:crosshair';
    this.cv=document.createElement('canvas');this.cv.width=this.cols*this.sz;this.cv.height=this.rows*this.sz;this.cv.style.cssText=`width:${this.cols*this.sz}px;height:${this.rows*this.sz}px;display:block;image-rendering:pixelated;max-width:100%`;this.ctx=this.cv.getContext('2d');cvWrap.appendChild(this.cv);w.appendChild(cvWrap);
    this.grid=new Array(this.cols*this.rows).fill('#111118');this._drawAll();
    const pos=e=>{const r=this.cv.getBoundingClientRect(),s=e.touches?e.touches[0]:e,scaleX=this.cols*this.sz/r.width,scaleY=this.rows*this.sz/r.height;return{x:Math.floor((s.clientX-r.left)*scaleX/this.sz),y:Math.floor((s.clientY-r.top)*scaleY/this.sz)};};
    this.cv.onmousedown=e=>{this.painting=true;const p=pos(e);if(this.tool==='fill')this._fill(p.x,p.y,this.color);else this._paint(p.x,p.y);};
    this.cv.onmousemove=e=>{if(this.painting&&this.tool!=='fill'){const p=pos(e);this._paint(p.x,p.y);}};
    this.cv.onmouseup=this.cv.onmouseleave=()=>this.painting=false;
    this.cv.ontouchstart=e=>{e.preventDefault();this.painting=true;const p=pos(e);if(this.tool==='fill')this._fill(p.x,p.y,this.color);else this._paint(p.x,p.y);};
    this.cv.ontouchmove=e=>{e.preventDefault();if(this.painting){const p=pos(e);this._paint(p.x,p.y);}};
    this.cv.ontouchend=()=>this.painting=false;
  }
  _idx(x,y){return y*this.cols+x;}
  _paint(x,y){if(x<0||x>=this.cols||y<0||y>=this.rows)return;const c=this.tool==='erase'?'#111118':this.color;this.grid[this._idx(x,y)]=c;this._drawCell(x,y,c);}
  _drawCell(x,y,c){this.ctx.fillStyle=c;this.ctx.fillRect(x*this.sz,y*this.sz,this.sz,this.sz);this.ctx.strokeStyle='rgba(255,255,255,.04)';this.ctx.strokeRect(x*this.sz+.5,y*this.sz+.5,this.sz-1,this.sz-1);}
  _drawAll(){for(let y=0;y<this.rows;y++)for(let x=0;x<this.cols;x++)this._drawCell(x,y,this.grid[this._idx(x,y)]);}
  _fill(sx,sy,nc){const tgt=this.grid[this._idx(sx,sy)];if(tgt===nc)return;const stack=[[sx,sy]],seen=new Set();while(stack.length){const[x,y]=stack.pop();if(x<0||x>=this.cols||y<0||y>=this.rows)continue;const k=this._idx(x,y);if(seen.has(k)||this.grid[k]!==tgt)continue;seen.add(k);this.grid[k]=nc;this._drawCell(x,y,nc);stack.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);}}
  resize(){}
  destroy(){}
}
