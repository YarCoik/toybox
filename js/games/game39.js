// Zen Circles — draw perfect circles freehand, rated by accuracy
export class ZenCircles {
  constructor(c){this.c=c;this.raf=null;this.drawing=false;this.pts=[];this.circles=[];this.hue=0;this.bestScore=0;this.frame=0;}
  init(){
    const w=document.createElement('div');w.style.cssText='position:absolute;inset:0;background:#020208;cursor:crosshair;overflow:hidden';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.className='gc';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    this.scoreEl=document.createElement('div');this.scoreEl.style.cssText='position:absolute;top:4.5rem;left:50%;transform:translateX(-50%);font-family:Syne,sans-serif;font-size:1.1rem;font-weight:700;color:rgba(255,255,255,.5);text-align:center;pointer-events:none;z-index:10;letter-spacing:.05em';this.scoreEl.textContent='Draw a circle!';w.appendChild(this.scoreEl);
    const bestEl=document.createElement('div');bestEl.style.cssText='position:absolute;top:7rem;left:50%;transform:translateX(-50%);font-family:DM Mono,monospace;font-size:.72rem;color:rgba(255,255,255,.25);text-align:center;pointer-events:none;z-index:10';bestEl.textContent='Best: —';w.appendChild(bestEl);this.bestEl=bestEl;
    const h=document.createElement('div');h.className='hint';h.textContent='Draw a circle freehand — how perfect can you make it?';w.appendChild(h);
    this.resize();
    this._od=e=>{e.preventDefault();this.drawing=true;this.pts=[];const p=this._gp(e);this.pts.push(p);};
    this._om=e=>{if(!this.drawing)return;e.preventDefault();this.pts.push(this._gp(e));};
    this._ou=e=>{if(!this.drawing)return;this.drawing=false;if(this.pts.length>20)this._score();else this.pts=[];};
    this.cv.addEventListener('mousedown',this._od);this.cv.addEventListener('mousemove',this._om,{passive:false});this.cv.addEventListener('mouseup',this._ou);
    this.cv.addEventListener('touchstart',this._od,{passive:false});this.cv.addEventListener('touchmove',this._om,{passive:false});this.cv.addEventListener('touchend',this._ou);
    this._loop();
  }
  _gp(e){const r=this.cv.getBoundingClientRect(),s=e.touches?e.touches[0]:e;return{x:s.clientX-r.left,y:s.clientY-r.top};}
  _score(){
    // Fit circle: find centroid and average radius
    const cx=this.pts.reduce((s,p)=>s+p.x,0)/this.pts.length;
    const cy=this.pts.reduce((s,p)=>s+p.y,0)/this.pts.length;
    const radii=this.pts.map(p=>Math.hypot(p.x-cx,p.y-cy));
    const avgR=radii.reduce((a,b)=>a+b,0)/radii.length;
    if(avgR<20){this.pts=[];this.scoreEl.textContent='Draw bigger!';return;}
    // Score = 1 - (std dev / avgR)
    const variance=radii.reduce((s,r)=>s+(r-avgR)**2,0)/radii.length;
    const stdDev=Math.sqrt(variance);
    // Closure check: are start and end close?
    const startPt=this.pts[0],endPt=this.pts[this.pts.length-1];
    const closureDist=Math.hypot(endPt.x-startPt.x,endPt.y-startPt.y);
    const closureScore=Math.max(0,1-closureDist/(avgR*.8));
    const circScore=Math.max(0,1-stdDev/avgR);
    const total=Math.round((circScore*.7+closureScore*.3)*100);
    const grade=total>95?'⚡ PERFECT!':total>85?'✨ Excellent':total>75?'👏 Great':total>60?'🙂 Good':total>45?'😐 OK':'🔄 Try again';
    const hue=total>85?120:total>70?60:total>50?30:0;
    this.circles.push({pts:[...this.pts],cx,cy,r:avgR,score:total,hue,alpha:1,grade});
    if(total>this.bestScore){this.bestScore=total;this.bestEl.textContent=`Best: ${total}% ${grade}`;}
    this.scoreEl.textContent=`${total}% — ${grade}`;
    this.pts=[];this.hue=(this.hue+40)%360;
  }
  _loop(){
    const ctx=this.ctx,W=this.cv.width,H=this.cv.height;
    if(!W||!H){this.raf=requestAnimationFrame(()=>this._loop());return;}
    ctx.fillStyle='rgba(2,2,8,.12)';ctx.fillRect(0,0,W,H);
    this.frame++;
    // Fade old circles
    for(let i=this.circles.length-1;i>=0;i--){const c=this.circles[i];c.alpha-=.003;if(c.alpha<=0){this.circles.splice(i,1);continue;}
      // Draw the user's path fading out
      ctx.save();ctx.globalAlpha=c.alpha*.6;ctx.strokeStyle=`hsl(${c.hue},80%,65%)`;ctx.lineWidth=2;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();c.pts.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));ctx.stroke();
      // Draw ideal circle
      ctx.globalAlpha=c.alpha*.4;ctx.strokeStyle=`hsl(${c.hue},90%,70%)`;ctx.lineWidth=1;ctx.setLineDash([4,6]);ctx.beginPath();ctx.arc(c.cx,c.cy,c.r,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
      // Score label
      ctx.globalAlpha=c.alpha;ctx.fillStyle=`hsl(${c.hue},80%,70%)`;ctx.font=`bold 16px Syne,sans-serif`;ctx.textAlign='center';ctx.fillText(c.score+'%',c.cx,c.cy-c.r-14);ctx.restore();
    }
    // Draw current stroke
    if(this.pts.length>1){
      ctx.save();ctx.strokeStyle=`hsla(${this.hue},90%,70%,.8)`;ctx.lineWidth=2.5;ctx.lineCap='round';ctx.lineJoin='round';ctx.shadowColor=`hsl(${this.hue},90%,70%)`;ctx.shadowBlur=8;ctx.beginPath();this.pts.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));ctx.stroke();ctx.restore();
    }
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  resize(){if(this.cv){const r=this.c.getBoundingClientRect();if(r.width&&r.height){this.cv.width=r.width;this.cv.height=r.height;}}}
  destroy(){cancelAnimationFrame(this.raf);}
}
