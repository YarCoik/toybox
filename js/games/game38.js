// Flappy Neon — flappy-bird style game with neon pipes
export class FlappyNeon {
  constructor(c){this.c=c;this.raf=null;this.state='waiting';this.score=0;this.best=0;this.frame=0;this.bgStars=[];this.pipes=[];}
  init(){
    const w=document.createElement('div');w.style.cssText='position:absolute;inset:0;background:#03010e;overflow:hidden';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.style.cssText='position:absolute;inset:0;width:100%;height:100%';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    const h=document.createElement('div');h.className='hint';h.textContent='Click, Space, or tap to flap';w.appendChild(h);
    this._jump=()=>{if(this.state==='waiting'||this.state==='over')this._start();else if(this.state==='playing')this.bird.vy=-6.5;};
    this.cv.addEventListener('click',this._jump);this.cv.addEventListener('touchstart',e=>{e.preventDefault();this._jump();},{passive:false});
    this._kb=e=>{if(e.key===' '||e.key==='ArrowUp'){e.preventDefault();this._jump();}};window.addEventListener('keydown',this._kb);
    this.resize();this._drawWait();this._loop();
  }
  _start(){
    const W=this.cv.width,H=this.cv.height;
    this.bird={x:W*.2,y:H*.45,vy:0,r:12};
    this.pipes=[];this.score=0;this.pipeTimer=0;this.hue=180;this.state='playing';this.bgStars=null;
  }
  _addPipe(){
    const H=this.cv.height,W=this.cv.width;
    const gap=H*.28,top=H*.15+Math.random()*(H*.55-gap);
    this.pipes.push({x:W,topH:top,botY:top+gap,w:46,scored:false,hue:(this.hue+60)%360});
    this.hue=(this.hue+20)%360;
  }
  _update(){
    const W=this.cv.width,H=this.cv.height,b=this.bird;
    b.vy+=.35;if(b.vy>10)b.vy=10;b.y+=b.vy;
    if(b.y+b.r>H){this._die();return;}
    if(b.y-b.r<0){b.y=b.r;b.vy=0;}
    this.pipeTimer++;if(this.pipeTimer>Math.max(60,95-this.score*2)){this.pipeTimer=0;this._addPipe();}
    const speed=2.5+this.score*.05;
    for(let i=this.pipes.length-1;i>=0;i--){
      const p=this.pipes[i];p.x-=speed;
      if(!p.scored&&p.x+p.w<b.x){p.scored=true;this.score++;if(this.score>this.best)this.best=this.score;}
      if(p.x+p.w<0){this.pipes.splice(i,1);continue;}
      if(b.x+b.r>p.x&&b.x-b.r<p.x+p.w&&(b.y-b.r<p.topH||b.y+b.r>p.botY)){this._die();return;}
    }
  }
  _die(){this.state='over';}
  _draw(){
    const ctx=this.ctx,W=this.cv.width,H=this.cv.height,b=this.bird;
    // Scrolling bg
    ctx.fillStyle='rgba(3,1,14,.3)';ctx.fillRect(0,0,W,H);
    // Stars
    if(!this.bgStars||this.bgStars.length===0&&W>0){this.bgStars=Array.from({length:80},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*.7+.2,t:Math.random()*Math.PI*2}));}
    (this.bgStars||[]).forEach(s=>{s.t+=.008;ctx.fillStyle=`rgba(255,255,255,${.1+Math.abs(Math.sin(s.t))*.2})`;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();});
    // Ground line
    ctx.strokeStyle='rgba(58,255,203,.15)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,H-2);ctx.lineTo(W,H-2);ctx.stroke();
    // Pipes
    (this.pipes||[]).forEach(p=>{
      [p.topH,H-p.botY].forEach((len,isBot)=>{
        const py=isBot?p.botY:0;
        ctx.save();const g=ctx.createLinearGradient(p.x,0,p.x+p.w,0);g.addColorStop(0,`hsl(${p.hue},90%,45%)`);g.addColorStop(.5,`hsl(${p.hue},90%,60%)`);g.addColorStop(1,`hsl(${p.hue},90%,40%)`);ctx.fillStyle=g;ctx.shadowColor=`hsl(${p.hue},100%,65%)`;ctx.shadowBlur=12;ctx.fillRect(p.x,py,p.w,len);
        // Cap
        ctx.fillStyle=`hsl(${p.hue},90%,65%)`;ctx.shadowBlur=20;ctx.fillRect(p.x-4,isBot?py:len-14,p.w+8,14);ctx.restore();
      });
    });
    if(this.state==='playing'){
      // Bird
      const rot=Math.min(Math.PI/4,Math.max(-Math.PI/4,b.vy*.05));
      ctx.save();ctx.translate(b.x,b.y);ctx.rotate(rot);
      ctx.beginPath();ctx.arc(0,0,b.r,0,Math.PI*2);const bg=ctx.createRadialGradient(-3,-3,2,0,0,b.r);bg.addColorStop(0,'#fff8e0');bg.addColorStop(1,'#ffb43a');ctx.fillStyle=bg;ctx.shadowColor='#ffb43a';ctx.shadowBlur=20;ctx.fill();
      // Eye
      ctx.fillStyle='#333';ctx.beginPath();ctx.arc(5,-3,3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(6,-4,1.2,0,Math.PI*2);ctx.fill();ctx.restore();
      // Score
      ctx.textAlign='center';ctx.fillStyle='rgba(255,255,255,.8)';ctx.font='bold 22px Syne,sans-serif';ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=6;ctx.fillText(this.score,W/2,52);ctx.shadowBlur=0;
    }
    if(this.state==='over'){
      ctx.fillStyle='rgba(0,0,0,.65)';ctx.fillRect(0,0,W,H);ctx.textAlign='center';
      ctx.fillStyle='#ff3a7c';ctx.font='bold 28px Syne,sans-serif';ctx.fillText('GAME OVER',W/2,H/2-30);
      ctx.fillStyle='rgba(255,255,255,.7)';ctx.font='16px DM Mono,monospace';ctx.fillText('Score: '+this.score+'  Best: '+this.best,W/2,H/2+4);
      ctx.fillStyle='rgba(255,255,255,.4)';ctx.font='13px DM Mono,monospace';ctx.fillText('Click or tap to retry',W/2,H/2+30);
    }
    if(this.state==='waiting'){
      ctx.textAlign='center';ctx.fillStyle='rgba(58,255,203,.7)';ctx.font='bold 22px Syne,sans-serif';ctx.fillText('FLAPPY NEON',W/2,H*.4);ctx.fillStyle='rgba(255,255,255,.4)';ctx.font='13px DM Mono,monospace';ctx.fillText('Click or tap to start',W/2,H*.5);
    }
  }
  _drawWait(){this.state='waiting';this._draw();}
  _loop(){this.frame++;if(this.state==='playing')this._update();this._draw();this.raf=requestAnimationFrame(()=>this._loop());}
  resize(){if(this.cv){const r=this.c.getBoundingClientRect();if(r.width&&r.height){this.cv.width=r.width;this.cv.height=r.height;this.bgStars=null;}}}
  destroy(){cancelAnimationFrame(this.raf);window.removeEventListener('keydown',this._kb);}
}
