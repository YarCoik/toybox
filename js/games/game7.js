export class Sandpit {
  constructor(c){
    this.c=c; this.raf=null; this.tool='sand'; this.brush=3;
    this.mDown=false; this.mx=0; this.my=0;
    // Cell types
    this.E=0; this.S=1; this.W=2; this.WD=3; this.F=4; this.SM=5;
    this.ST=6;  // Stone
    this.OL=7;  // Oil
    this.LV=8;  // Lava
    this.PL=9;  // Plant
    this.IC=10; // Ice
    this.sc=4; this.grid=null; this.cols=0; this.rows=0;
  }
  init(){
    const d=document.createElement('div');d.className='sd-wrap';this.c.appendChild(d);
    const tb=document.createElement('div');tb.className='sd-tb';d.appendChild(tb);
    const tools=[
      ['sand',  '🟡 Sand',  'ts'],
      ['water', '🔵 Water', 'tw'],
      ['wood',  '🟫 Wood',  'twd'],
      ['fire',  '🔴 Fire',  'tf'],
      ['stone', '⬜ Stone', 'tst'],
      ['oil',   '🟤 Oil',   'tol'],
      ['lava',  '🟠 Lava',  'tlv'],
      ['plant', '🌿 Plant', 'tpl'],
      ['ice',   '🔷 Ice',   'tic'],
      ['erase', '❌ Erase', 'te'],
    ];
    tools.forEach(([id,lbl,cls])=>{
      const b=document.createElement('button');b.className=`sd-b ${cls}`;
      b.innerHTML=`<span class="sw"></span>${lbl}`;
      if(id===this.tool)b.style.boxShadow='0 0 0 2px currentColor';
      b.onclick=()=>{this.tool=id;document.querySelectorAll('.sd-b').forEach(x=>x.style.boxShadow='');b.style.boxShadow='0 0 0 2px currentColor';};
      tb.appendChild(b);
    });
    const bsl=document.createElement('span');bsl.style.cssText='font-family:DM Mono,monospace;font-size:.7rem;color:rgba(255,255,255,.3);margin-left:auto';bsl.textContent='Brush:';tb.appendChild(bsl);
    const bs=document.createElement('input');bs.type='range';bs.min=1;bs.max=8;bs.value=3;bs.style.cssText='width:60px;accent-color:#c8a264;cursor:pointer';bs.oninput=()=>this.brush=+bs.value;tb.appendChild(bs);
    const clr=document.createElement('button');clr.className='sd-b';clr.textContent='🗑 Clear';clr.onclick=()=>this._clr();tb.appendChild(clr);
    this.cv=document.createElement('canvas');this.cv.className='sd-cv';d.appendChild(this.cv);
    this.ctx=this.cv.getContext('2d');
    this._bind();
    requestAnimationFrame(()=>{this.resize();this._loop();});
  }
  _setup(){
    const W=this.cv.clientWidth||this.cv.offsetWidth, H=this.cv.clientHeight||this.cv.offsetHeight;
    if(!W||!H)return false;
    this.cv.width=W; this.cv.height=H;
    this.cols=Math.floor(W/this.sc); this.rows=Math.floor(H/this.sc);
    this.grid=new Uint8Array(this.cols*this.rows);
    for(let x=0;x<this.cols;x++) this._s(x,this.rows-1,this.WD);
    return true;
  }
  _i(x,y){return y*this.cols+x;}
  _g(x,y){if(x<0||x>=this.cols||y<0||y>=this.rows)return -1; return this.grid[this._i(x,y)];}
  _s(x,y,v){if(x<0||x>=this.cols||y<0||y>=this.rows)return; this.grid[this._i(x,y)]=v;}
  _clr(){if(!this.grid)return;this.grid.fill(0);for(let x=0;x<this.cols;x++)this._s(x,this.rows-1,this.WD);}
  _bind(){
    const pos=e=>{const r=this.cv.getBoundingClientRect(),s=e.touches?e.touches[0]:e;return{x:Math.floor((s.clientX-r.left)/this.sc),y:Math.floor((s.clientY-r.top)/this.sc)};};
    this._od=e=>{e.preventDefault();this.mDown=true;const p=pos(e);this.mx=p.x;this.my=p.y;this._paint(p.x,p.y);};
    this._om=e=>{e.preventDefault();const p=pos(e);this.mx=p.x;this.my=p.y;if(this.mDown)this._paint(p.x,p.y);};
    this._ou=()=>this.mDown=false;
    this.cv.addEventListener('mousedown',this._od);this.cv.addEventListener('mousemove',this._om,{passive:false});this.cv.addEventListener('mouseup',this._ou);this.cv.addEventListener('mouseleave',this._ou);
    this.cv.addEventListener('touchstart',this._od,{passive:false});this.cv.addEventListener('touchmove',this._om,{passive:false});this.cv.addEventListener('touchend',this._ou);
  }
  _paint(cx,cy){
    if(!this.grid)return;
    const t={sand:this.S,water:this.W,wood:this.WD,fire:this.F,stone:this.ST,oil:this.OL,lava:this.LV,plant:this.PL,ice:this.IC,erase:this.E};
    const type=t[this.tool]??this.E,r=this.brush;
    for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++)if(dx*dx+dy*dy<=r*r)this._s(cx+dx,cy+dy,type);
  }
  _sim(){
    for(let y=this.rows-2;y>=0;y--){
      const lf=Math.random()<.5;
      for(let xi=0;xi<this.cols;xi++){
        const x=lf?xi:this.cols-1-xi, cell=this._g(x,y);
        if(cell===this.E||cell===this.WD||cell===this.ST)continue;
        const bel=this._g(x,y+1),blL=this._g(x-1,y+1),blR=this._g(x+1,y+1);

        // SAND — falls down, displaced by water
        if(cell===this.S){
          if(bel===this.E||bel===this.W){this._s(x,y,bel);this._s(x,y+1,this.S);}
          else if(blL===this.E||blL===this.W){this._s(x,y,blL);this._s(x-1,y+1,this.S);}
          else if(blR===this.E||blR===this.W){this._s(x,y,blR);this._s(x+1,y+1,this.S);}
        }
        // WATER — flows freely
        else if(cell===this.W){
          if(bel===this.E){this._s(x,y,this.E);this._s(x,y+1,this.W);}
          else if(blL===this.E){this._s(x,y,this.E);this._s(x-1,y+1,this.W);}
          else if(blR===this.E){this._s(x,y,this.E);this._s(x+1,y+1,this.W);}
          else{const sL=this._g(x-1,y)===this.E,sR=this._g(x+1,y)===this.E;if(sL&&sR){const dd=Math.random()<.5?-1:1;this._s(x,y,this.E);this._s(x+dd,y,this.W);}else if(sL){this._s(x,y,this.E);this._s(x-1,y,this.W);}else if(sR){this._s(x,y,this.E);this._s(x+1,y,this.W);}}}

        // OIL — floats on water, burns
        else if(cell===this.OL){
          if(bel===this.E){this._s(x,y,this.E);this._s(x,y+1,this.OL);}
          else if(blL===this.E){this._s(x,y,this.E);this._s(x-1,y+1,this.OL);}
          else if(blR===this.E){this._s(x,y,this.E);this._s(x+1,y+1,this.OL);}
          else{const sL=this._g(x-1,y)===this.E,sR=this._g(x+1,y)===this.E;if(sL&&sR){const dd=Math.random()<.5?-1:1;this._s(x,y,this.E);this._s(x+dd,y,this.OL);}else if(sL){this._s(x,y,this.E);this._s(x-1,y,this.OL);}else if(sR){this._s(x,y,this.E);this._s(x+1,y,this.OL);}}
          // Oil ignites near fire/lava
          [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dx,dy])=>{const n=this._g(x+dx,y+dy);if((n===this.F||n===this.LV)&&Math.random()<.05)this._s(x,y,this.F);});
        }

        // LAVA — heavy, melts ice, ignites wood/oil, makes smoke
        else if(cell===this.LV){
          if(bel===this.E){this._s(x,y,this.E);this._s(x,y+1,this.LV);}
          else if(blL===this.E){this._s(x,y,this.E);this._s(x-1,y+1,this.LV);}
          else if(blR===this.E){this._s(x,y,this.E);this._s(x+1,y+1,this.LV);}
          else{const sL=this._g(x-1,y)===this.E,sR=this._g(x+1,y)===this.E;if(sL&&sR){const dd=Math.random()<.5?-1:1;this._s(x,y,this.E);this._s(x+dd,y,this.LV);}else if(sL){this._s(x,y,this.E);this._s(x-1,y,this.LV);}else if(sR){this._s(x,y,this.E);this._s(x+1,y,this.LV);}}
          [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dx,dy])=>{const n=this._g(x+dx,y+dy);if((n===this.WD||n===this.OL)&&Math.random()<.01)this._s(x+dx,y+dy,this.F);if(n===this.IC&&Math.random()<.05)this._s(x+dx,y+dy,this.W);if(n===this.W&&Math.random()<.003)this._s(x+dx,y+dy,this.SM);});
          if(this._g(x,y-1)===this.E&&Math.random()<.05)this._s(x,y-1,this.SM);
        }

        // FIRE — rises, spreads, makes smoke
        else if(cell===this.F){
          [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dx,dy])=>{const n=this._g(x+dx,y+dy);if(n===this.WD&&Math.random()<.008)this._s(x+dx,y+dy,this.F);if(n===this.OL&&Math.random()<.03)this._s(x+dx,y+dy,this.F);if(n===this.PL&&Math.random()<.015)this._s(x+dx,y+dy,this.F);if(n===this.IC&&Math.random()<.08)this._s(x+dx,y+dy,this.W);});
          if(this._g(x,y-1)===this.E&&Math.random()<.15)this._s(x,y-1,this.SM);
          if(Math.random()<.004)this._s(x,y,this.E);
        }

        // SMOKE — rises, dissipates
        else if(cell===this.SM){
          if(y>0){const ab=this._g(x,y-1);if(ab===this.E){this._s(x,y,this.E);this._s(x,y-1,this.SM);}else{const dd=Math.random()<.5?-1:1;if(this._g(x+dd,y-1)===this.E){this._s(x,y,this.E);this._s(x+dd,y-1,this.SM);}}}
          if(Math.random()<.015)this._s(x,y,this.E);
        }

        // PLANT — grows upward slowly, dies from fire/lava
        else if(cell===this.PL){
          if(Math.random()<.002){const dirs=[[0,-1],[-1,-1],[1,-1]];const[dx,dy]=dirs[Math.floor(Math.random()*dirs.length)];const nx=x+dx,ny=y+dy;if(this._g(nx,ny)===this.E)this._s(nx,ny,this.PL);}
          // Needs water nearby to grow (optional - just grows slowly always)
        }

        // ICE — melts near fire/lava, turns to water
        else if(cell===this.IC){
          [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dx,dy])=>{const n=this._g(x+dx,y+dy);if((n===this.F||n===this.LV)&&Math.random()<.05)this._s(x,y,this.W);});
          // Slow natural melt (very rare)
          if(Math.random()<.0002)this._s(x,y,this.W);
        }
      }
    }
  }
  _render(){
    if(!this.grid||!this.cols||!this.rows)return;
    const ctx=this.ctx,W=this.cv.width,H=this.cv.height,sc=this.sc;
    const img=ctx.createImageData(W,H),d=img.data;
    for(let y=0;y<this.rows;y++) for(let x=0;x<this.cols;x++){
      const cell=this.grid[this._i(x,y)];
      let r=8,g=8,b=17; const n=cell?Math.random()*16-8:0;
      if(cell===this.S){r=200+n;g=162+n;b=100+n;}
      else if(cell===this.W){r=30+Math.sin(x*.3+Date.now()*.001)*8;g=100;b=220+Math.random()*30;}
      else if(cell===this.WD){r=139+n;g=90+n;b=43+n;}
      else if(cell===this.F){r=220+Math.random()*35;g=60+Math.random()*80;b=0;}
      else if(cell===this.SM){r=70+n;g=70+n;b=90+n;}
      else if(cell===this.ST){r=120+n;g=120+n;b=130+n;}
      else if(cell===this.OL){r=90+n;g=55+n;b=20+n;}
      else if(cell===this.LV){r=240+Math.random()*15;g=80+Math.random()*60;b=10;}
      else if(cell===this.PL){r=20+n;g=140+n;b=30+n;}
      else if(cell===this.IC){r=160+n;g=210+n;b=240+n;}
      for(let py=0;py<sc;py++) for(let px=0;px<sc;px++){
        const pi=((y*sc+py)*W+(x*sc+px))*4;
        if(pi>=0&&pi<d.length){
          d[pi]=Math.min(255,Math.max(0,r|0));
          d[pi+1]=Math.min(255,Math.max(0,g|0));
          d[pi+2]=Math.min(255,Math.max(0,b|0));
          d[pi+3]=cell===this.SM?100:255;
        }
      }
    }
    ctx.putImageData(img,0,0);
  }
  _loop(){if(!this.grid){this.raf=requestAnimationFrame(()=>this._loop());return;}this._sim();this._render();this.raf=requestAnimationFrame(()=>this._loop());}
  resize(){this._setup();}
  destroy(){cancelAnimationFrame(this.raf);}
}
