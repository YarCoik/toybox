export class BubbleUniverse {
  constructor(c){this.c=c;this.raf=null;this.bubbles=[];this.score=0;this.popped=0;}
  init(){
    const w=document.createElement('div');w.className='fill';w.style.cssText='background:linear-gradient(180deg,#020210 0%,#050530 100%);overflow:hidden';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.className='gc';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    this.scoreEl=document.createElement('div');this.scoreEl.style.cssText='position:absolute;top:4rem;left:50%;transform:translateX(-50%);font-family:Syne,sans-serif;font-size:1.4rem;font-weight:800;color:#fff;z-index:10;text-align:center;pointer-events:none;text-shadow:0 0 20px rgba(124,58,255,.8)';this.scoreEl.textContent='Pop the bubbles!';w.appendChild(this.scoreEl);
    const h=document.createElement('div');h.className='hint';h.textContent='Click bubbles to pop them · Let them float away and lose!';w.appendChild(h);
    this._mc=e=>{const r=this.cv.getBoundingClientRect(),s=e.touches?e.touches[0]:e,mx=s.clientX-r.left,my=s.clientY-r.top;
      for(let i=this.bubbles.length-1;i>=0;i--){const b=this.bubbles[i];if(Math.hypot(b.x-mx,b.y-my)<b.r+5){this._pop(b,i);break;}}};
    this.cv.addEventListener('click',this._mc);this.cv.addEventListener('touchstart',this._mc,{passive:true});
    this.resize();this._spawnTimer=setInterval(()=>this._spawn(),900);this._loop();
  }
  _spawn(){
    const W=this.cv.width;if(!W)return;
    const r=20+Math.random()*45,hue=Math.random()*360;
    this.bubbles.push({x:80+Math.random()*(W-160),y:this.cv.height+r,r,vx:(Math.random()-.5)*.8,vy:-(1+Math.random()*1.5),hue,wobble:Math.random()*Math.PI*2,wobbleSpeed:.02+Math.random()*.02,alpha:0,life:1});
  }
  _pop(b,i){
    this.popped++;this.score+=Math.round(b.r);this.scoreEl.textContent=`🫧 ${this.score} pts  ·  ${this.popped} popped`;
    // Burst particles
    const ctx=this.ctx;for(let j=0;j<12;j++){const a=j/12*Math.PI*2;const sp=document.createElement('div');sp.style.cssText=`position:absolute;left:${b.x}px;top:${b.y}px;width:8px;height:8px;border-radius:50%;background:hsl(${b.hue},90%,70%);pointer-events:none;transition:transform .5s ease-out,opacity .5s ease;transform:translate(-50%,-50%) scale(1);opacity:1;z-index:20`;this.c.querySelector('.fill').appendChild(sp);const d=30+Math.random()*40;setTimeout(()=>{sp.style.transform=`translate(calc(-50% + ${Math.cos(a)*d}px),calc(-50% + ${Math.sin(a)*d}px)) scale(0)`;sp.style.opacity='0';},10);setTimeout(()=>sp.remove(),600);}
    this.bubbles.splice(i,1);
  }
  _loop(){
    const W=this.cv.width,H=this.cv.height,ctx=this.ctx;
    if(!W||!H){this.raf=requestAnimationFrame(()=>this._loop());return;}
    ctx.clearRect(0,0,W,H);
    for(let i=this.bubbles.length-1;i>=0;i--){
      const b=this.bubbles[i];b.wobble+=b.wobbleSpeed;b.x+=b.vx+Math.sin(b.wobble)*.4;b.y+=b.vy;
      b.alpha=Math.min(1,b.alpha+.04);b.life=1;
      if(b.y<-b.r*2){this.bubbles.splice(i,1);continue;}
      // Draw bubble
      const g=ctx.createRadialGradient(b.x-b.r*.3,b.y-b.r*.3,b.r*.05,b.x,b.y,b.r);
      g.addColorStop(0,`hsla(${b.hue},60%,90%,${b.alpha*.7})`);
      g.addColorStop(.4,`hsla(${b.hue},80%,60%,${b.alpha*.25})`);
      g.addColorStop(1,`hsla(${b.hue},90%,50%,${b.alpha*.15})`);
      ctx.save();ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
      ctx.strokeStyle=`hsla(${b.hue},80%,80%,${b.alpha*.5})`;ctx.lineWidth=1.5;ctx.stroke();
      // Shine
      ctx.beginPath();ctx.ellipse(b.x-b.r*.28,b.y-b.r*.28,b.r*.25,b.r*.15,-Math.PI/4,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${b.alpha*.45})`;ctx.fill();ctx.restore();
    }
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  resize(){if(this.cv){const r=this.c.getBoundingClientRect();if(r.width&&r.height){this.cv.width=r.width;this.cv.height=r.height;}}}
  destroy(){cancelAnimationFrame(this.raf);clearInterval(this._spawnTimer);}
}
