export class RainRipples {
  constructor(c){this.c=c;this.raf=null;this.ripples=[];this.drops=[];this.autoRain=true;this.rainTimer=null;}
  init(){
    const w=document.createElement('div');w.className='fill';w.style.cssText='background:linear-gradient(180deg,#020810 0%,#030f1a 100%);cursor:crosshair';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.className='gc';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    const h=document.createElement('div');h.className='hint';h.textContent='Click anywhere · Auto-rain is on';w.appendChild(h);
    this._mc=e=>{const r=this.cv.getBoundingClientRect(),s=e.touches?e.touches[0]:e;this._addRipple(s.clientX-r.left,s.clientY-r.top,true);};
    this.cv.addEventListener('click',this._mc);this.cv.addEventListener('touchstart',this._mc,{passive:true});
    this.cv.addEventListener('mousemove',e=>{if(e.buttons)this._mc(e);});
    this.resize();this._startRain();this._loop();
  }
  _startRain(){this.rainTimer=setInterval(()=>{if(!this.cv.width)return;const x=Math.random()*this.cv.width,y=Math.random()*this.cv.height*.8+this.cv.height*.1;this._addRipple(x,y,false);},120);}
  _addRipple(x,y,big){this.ripples.push({x,y,r:0,maxR:big?120+Math.random()*80:50+Math.random()*50,speed:big?2.5:1.5+Math.random(),alpha:1,big,hue:180+Math.random()*60});}
  _loop(){
    const W=this.cv.width,H=this.cv.height,ctx=this.ctx;
    if(!W||!H){this.raf=requestAnimationFrame(()=>this._loop());return;}
    ctx.fillStyle='rgba(2,8,16,.18)';ctx.fillRect(0,0,W,H);
    // Stars
    if(!this._stars){this._stars=[];for(let i=0;i<80;i++)this._stars.push({x:Math.random()*W,y:Math.random()*H*.5,r:Math.random()*.8+.2,twinkle:Math.random()*Math.PI*2});}
    this._stars.forEach(s=>{s.twinkle+=.02;ctx.fillStyle=`rgba(255,255,255,${.3+Math.sin(s.twinkle)*.25})`;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();});
    // Ripples
    for(let i=this.ripples.length-1;i>=0;i--){
      const rp=this.ripples[i];rp.r+=rp.speed;rp.alpha=Math.max(0,1-rp.r/rp.maxR);
      if(rp.alpha<=0){this.ripples.splice(i,1);continue;}
      const ry=rp.r*.35;// ellipse for water surface perspective
      ctx.save();ctx.strokeStyle=`hsla(${rp.hue},80%,70%,${rp.alpha*.6})`;ctx.lineWidth=rp.big?1.5:.8;ctx.shadowColor=`hsla(${rp.hue},80%,70%,.4)`;ctx.shadowBlur=rp.big?8:3;
      // Multiple rings
      for(let k=0;k<(rp.big?3:2);k++){const kr=Math.max(0,rp.r-k*15);if(kr<=0)continue;ctx.globalAlpha=rp.alpha*(1-k*.35);ctx.beginPath();ctx.ellipse(rp.x,rp.y,kr,kr*ry/rp.r||0.01,0,0,Math.PI*2);ctx.stroke();}
      ctx.restore();
    }
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  resize(){if(this.cv){const r=this.c.getBoundingClientRect();if(r.width&&r.height){this.cv.width=r.width;this.cv.height=r.height;this._stars=null;}}}
  destroy(){cancelAnimationFrame(this.raf);clearInterval(this.rainTimer);}
}
