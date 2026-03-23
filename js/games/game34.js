// Matrix Digital Rain — the iconic green code waterfall
export class MatrixRain {
  constructor(c){this.c=c;this.raf=null;this.cols=[];this.fontSize=16;this.hue=120;this.colorMode='green';this.speed=1.5;}
  init(){
    const w=document.createElement('div');w.style.cssText='position:absolute;inset:0;background:#000;overflow:hidden';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.className='gc';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    const ctrl=document.createElement('div');ctrl.style.cssText='position:absolute;bottom:1rem;left:50%;transform:translateX(-50%);display:flex;gap:.5rem;z-index:10;flex-wrap:wrap;justify-content:center';
    const modes=[['🟢 Matrix','green','#00ff41'],['💜 Purple','purple','#bf5fff'],['🔵 Cyber','blue','#00d4ff'],['🔴 Blood','red','#ff2244'],['🌈 Rainbow','rainbow','#fff']];
    modes.forEach(([lbl,mode,col])=>{
      const b=document.createElement('button');b.style.cssText=`padding:.38rem .8rem;border-radius:8px;background:${mode===this.colorMode?col+'22':'rgba(255,255,255,.07)'};border:1px solid ${col}44;color:${col};font-family:Syne,sans-serif;font-size:.72rem;font-weight:700;cursor:pointer`;
      b.textContent=lbl;b.onclick=()=>{this.colorMode=mode;ctrl.querySelectorAll('button').forEach((x,i)=>{x.style.background=modes[i][1]===mode?modes[i][2]+'22':'rgba(255,255,255,.07)';});};ctrl.appendChild(b);
    });
    w.appendChild(ctrl);
    // Speed slider
    const svw=document.createElement('div');svw.style.cssText='position:absolute;bottom:4rem;right:1.5rem;display:flex;flex-direction:column;align-items:flex-end;gap:4px;z-index:10';
    const sl=document.createElement('span');sl.style.cssText='font-family:DM Mono,monospace;font-size:.62rem;color:rgba(255,255,255,.35)';sl.textContent='Speed';
    const si=document.createElement('input');si.type='range';si.min=.5;si.max=5;si.step=.5;si.value=1.5;si.style.cssText='width:80px;accent-color:#00ff41;cursor:pointer';si.oninput=()=>this.speed=+si.value;
    svw.appendChild(sl);svw.appendChild(si);w.appendChild(svw);
    const bh34=document.createElement('div');bh34.className='hint hint-top';bh34.textContent='Choose a color mode below · Adjust speed on the right';w.appendChild(bh34);
    this.resize();this._initCols();this._loop();
  }
  _initCols(){
    const W=this.cv.width,H=this.cv.height;if(!W||!H)return;
    const n=Math.floor(W/this.fontSize);this.cols=[];
    for(let i=0;i<n;i++) this.cols.push({y:Math.random()*H/this.fontSize*-1,speed:.5+Math.random()*2.5,chars:[]});
  }
  _rndChar(){
    const sets=[
      'ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ',
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      '∀∂∃∄∅∆∇∈∉∊∋∌∍∎∏∐∑−∓∔∕∖∗∘∙√∛∜∝∞',
    ];
    const set=sets[Math.floor(Math.random()*sets.length)];
    return set[Math.floor(Math.random()*set.length)];
  }
  _getColor(y,maxY,isHead){
    const t=y/maxY;
    if(isHead) return'#ffffff';
    switch(this.colorMode){
      case'green': return`rgba(0,${Math.floor(160+t*95)},${Math.floor(t*60)},${.4+t*.6})`;
      case'purple':return`rgba(${Math.floor(140+t*115)},${Math.floor(t*80)},${Math.floor(180+t*75)},${.4+t*.6})`;
      case'blue':  return`rgba(0,${Math.floor(180+t*75)},${Math.floor(200+t*55)},${.4+t*.6})`;
      case'red':   return`rgba(${Math.floor(180+t*75)},${Math.floor(t*40)},${Math.floor(t*40)},${.4+t*.6})`;
      case'rainbow':return`hsla(${(t*360+Date.now()*.02)%360},90%,65%,${.4+t*.6})`;
      default:     return'#00ff41';
    }
  }
  _loop(){
    const ctx=this.ctx,W=this.cv.width,H=this.cv.height,fs=this.fontSize;
    if(!W||!H){this.raf=requestAnimationFrame(()=>this._loop());return;}
    ctx.fillStyle='rgba(0,0,0,.05)';ctx.fillRect(0,0,W,H);
    ctx.font=`${fs}px monospace`;
    this.cols.forEach((col,ci)=>{
      col.y+=col.speed*this.speed*.4;
      const maxY=col.y;
      // Draw character stream
      const streamLen=15+Math.floor(Math.random()*20);
      for(let i=0;i<streamLen;i++){
        const cy=col.y-i;if(cy<0)continue;
        const isHead=i===0;
        // Occasionally randomize char
        if(!col.chars[i]||Math.random()<.05) col.chars[i]=this._rndChar();
        ctx.fillStyle=this._getColor(streamLen-i,streamLen,isHead);
        if(isHead){ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=8;}else ctx.shadowBlur=0;
        ctx.fillText(col.chars[i],ci*fs,cy*fs);
      }
      if(col.y*fs>H+streamLen*fs) col.y=-Math.random()*20;
    });
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  resize(){if(this.cv){const r=this.c.getBoundingClientRect();if(r.width&&r.height){this.cv.width=r.width;this.cv.height=r.height;this._initCols();}}}
  destroy(){cancelAnimationFrame(this.raf);}
}
