// Breakout — classic brick-breaker arcade game
export class Breakout {
  constructor(c){this.c=c;this.raf=null;this.state='waiting';this.score=0;this.lives=3;this.level=1;this.frame=0;}
  init(){
    const w=document.createElement('div');w.style.cssText='position:absolute;inset:0;background:#04020e;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden';this.c.appendChild(w);
    // HUD
    this.hud=document.createElement('div');this.hud.style.cssText='display:flex;gap:2rem;font-family:DM Mono,monospace;font-size:.82rem;color:rgba(255,255,255,.5);letter-spacing:.08em;margin-bottom:.6rem;flex-shrink:0';
    this.scoreEl=document.createElement('span');this.livesEl=document.createElement('span');this.levelEl=document.createElement('span');
    this.scoreEl.textContent='SCORE: 0';this.livesEl.textContent='LIVES: ❤️❤️❤️';this.levelEl.textContent='LVL: 1';
    this.hud.appendChild(this.scoreEl);this.hud.appendChild(this.levelEl);this.hud.appendChild(this.livesEl);w.appendChild(this.hud);
    // Canvas
    this.cv=document.createElement('canvas');this.cv.style.cssText='border-radius:12px;border:1px solid rgba(255,255,255,.07);display:block;box-shadow:0 0 40px rgba(124,58,255,.1)';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    // Hint
    const h=document.createElement('div');h.className='hint';h.style.cssText='position:relative;transform:none;left:auto;bottom:auto;margin-top:.6rem;';h.textContent='Mouse or Arrow keys to move · Space to launch';w.appendChild(h);
    this._resize2();this._setup();
    // Input
    this._mm=e=>{const r=this.cv.getBoundingClientRect();this.paddle.tx=((e.clientX-r.left)/r.width)*this.W;};
    this._km=e=>{if(e.key==='ArrowLeft')this.paddle.dx=-1;else if(e.key==='ArrowRight')this.paddle.dx=1;else if(e.key===' '){e.preventDefault();if(this.state!=='playing')this._launch();}};
    this._ku=e=>{if(e.key==='ArrowLeft'&&this.paddle.dx<0)this.paddle.dx=0;else if(e.key==='ArrowRight'&&this.paddle.dx>0)this.paddle.dx=0;};
    this._mt=e=>{const r=this.cv.getBoundingClientRect();this.paddle.tx=(e.touches[0].clientX-r.left)/r.width*this.W;};
    this._mc=e=>{if(this.state!=='playing')this._launch();};
    this.cv.addEventListener('mousemove',this._mm);this.cv.addEventListener('touchmove',this._mt,{passive:true});this.cv.addEventListener('click',this._mc);
    window.addEventListener('keydown',this._km);window.addEventListener('keyup',this._ku);
    this._loop();
  }
  _resize2(){
    const r=this.c.getBoundingClientRect(),maxW=Math.min(r.width-40,520),maxH=Math.min(r.height-100,460);
    this.W=Math.min(maxW,maxH*1.1);this.H=this.W/1.1;
    this.cv.width=this.W;this.cv.height=this.H;this.cv.style.width=this.W+'px';this.cv.style.height=this.H+'px';
  }
  _setup(){
    const W=this.W,H=this.H;
    this.paddle={x:W/2,tx:W/2,w:Math.max(60,W*.16),h:10,y:H-.08*H,dx:0,speed:8};
    this.ball={x:W/2,y:H*.6,r:6,vx:2*(Math.random()<.5?1:-1),vy:-3,attached:true};
    this.bricks=[];
    const cols=10,rows=5+this.level,bw=(W*.9)/cols,bh=16,padX=W*.05,padY=H*.1;
    const colors=['#ff3a7c','#ff6b3a','#ffb43a','#c8ff3a','#3affcb','#3a8fff','#7c3aff','#ff3aff'];
    for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){
      const hp=rows-r;const col=colors[r%colors.length];
      this.bricks.push({x:padX+c*bw+2,y:padY+r*(bh+4)+2,w:bw-4,h:bh,hp,maxHp:hp,color:col,alive:true});
    }
  }
  _launch(){this.state='playing';this.ball.attached=false;this.ball.vx=2*(Math.random()<.5?1:-1);this.ball.vy=-Math.abs(this.ball.vy)||-(2.5+this.level*.3);}
  _update(){
    const W=this.W,H=this.H,b=this.ball,p=this.paddle;
    // Paddle movement
    if(p.dx!==0) p.tx=Math.max(p.w/2,Math.min(W-p.w/2,p.tx+p.dx*p.speed));
    p.x+=(p.tx-p.x)*.2;p.x=Math.max(p.w/2,Math.min(W-p.w/2,p.x));
    if(b.attached){b.x=p.x;b.y=p.y-b.r-p.h/2-2;return;}
    b.x+=b.vx;b.y+=b.vy;
    // Walls
    if(b.x-b.r<0){b.x=b.r;b.vx=Math.abs(b.vx);}
    if(b.x+b.r>W){b.x=W-b.r;b.vx=-Math.abs(b.vx);}
    if(b.y-b.r<0){b.y=b.r;b.vy=Math.abs(b.vy);}
    // Paddle collision
    if(b.vy>0&&b.y+b.r>p.y-p.h/2&&b.y-b.r<p.y+p.h/2&&b.x>p.x-p.w/2&&b.x<p.x+p.w/2){
      b.vy=-Math.abs(b.vy);const angle=(b.x-p.x)/(p.w/2)*1.2;b.vx=Math.max(-5,Math.min(5,angle*4));
      b.y=p.y-p.h/2-b.r-1;
    }
    // Death
    if(b.y>H+20){this.lives--;this.livesEl.textContent='LIVES: '+'❤️'.repeat(Math.max(0,this.lives));if(this.lives<=0){this.state='over';}else{b.attached=true;b.vx=2;b.vy=-3;this.state='waiting';}}
    // Brick collision
    this.bricks.forEach(br=>{
      if(!br.alive)return;
      if(b.x+b.r>br.x&&b.x-b.r<br.x+br.w&&b.y+b.r>br.y&&b.y-b.r<br.y+br.h){
        br.hp--;if(br.hp<=0){br.alive=false;this.score+=10*this.level;this.scoreEl.textContent='SCORE: '+this.score;}
        const ox=Math.min(b.x+b.r-br.x,br.x+br.w-(b.x-b.r));
        const oy=Math.min(b.y+b.r-br.y,br.y+br.h-(b.y-b.r));
        if(ox<oy)b.vx*=-1;else b.vy*=-1;
      }
    });
    if(this.bricks.every(br=>!br.alive)){this.level++;this.levelEl.textContent='LVL: '+this.level;this._setup();this.state='waiting';}
  }
  _draw(){
    const ctx=this.ctx,W=this.W,H=this.H,b=this.ball,p=this.paddle;
    ctx.fillStyle='#04020e';ctx.fillRect(0,0,W,H);
    // Grid bg
    ctx.strokeStyle='rgba(255,255,255,.02)';ctx.lineWidth=.5;
    for(let x=0;x<W;x+=20){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=20){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    // Bricks
    this.bricks.forEach(br=>{
      if(!br.alive)return;
      const alpha=br.hp/br.maxHp;
      ctx.save();const g=ctx.createLinearGradient(br.x,br.y,br.x,br.y+br.h);g.addColorStop(0,br.color);g.addColorStop(1,br.color+'88');
      ctx.fillStyle=g;ctx.globalAlpha=.5+alpha*.5;ctx.shadowColor=br.color;ctx.shadowBlur=4*alpha;
      ctx.beginPath();ctx.roundRect(br.x,br.y,br.w,br.h,3);ctx.fill();ctx.restore();
    });
    // Paddle
    ctx.save();const pg=ctx.createLinearGradient(p.x-p.w/2,p.y,p.x+p.w/2,p.y);pg.addColorStop(0,'#7c3aff');pg.addColorStop(.5,'#c084fc');pg.addColorStop(1,'#7c3aff');ctx.fillStyle=pg;ctx.shadowColor='#7c3aff';ctx.shadowBlur=12;ctx.beginPath();ctx.roundRect(p.x-p.w/2,p.y-p.h/2,p.w,p.h,5);ctx.fill();ctx.restore();
    // Ball
    ctx.save();ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fillStyle='#fff';ctx.shadowColor='#c084fc';ctx.shadowBlur=16;ctx.fill();ctx.restore();
    // Overlay messages
    if(this.state==='waiting'){ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(0,0,W,H);ctx.textAlign='center';ctx.fillStyle='rgba(255,255,255,.6)';ctx.font='14px DM Mono,monospace';ctx.fillText('Click or Space to launch',W/2,H*.52);}
    if(this.state==='over'){ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(0,0,W,H);ctx.textAlign='center';ctx.fillStyle='#ff3a7c';ctx.font='bold 28px Syne,sans-serif';ctx.fillText('GAME OVER',W/2,H/2-18);ctx.fillStyle='rgba(255,255,255,.5)';ctx.font='13px DM Mono,monospace';ctx.fillText('Score: '+this.score+' · Click to restart',W/2,H/2+14);this.cv.onclick=()=>{this.score=0;this.lives=3;this.level=1;this.scoreEl.textContent='SCORE: 0';this.livesEl.textContent='LIVES: ❤️❤️❤️';this.levelEl.textContent='LVL: 1';this._setup();this.state='waiting';this.cv.onclick=this._mc;};}
  }
  _loop(){this.frame++;this._update();this._draw();this.raf=requestAnimationFrame(()=>this._loop());}
  resize(){if(this.cv){this._resize2();this._setup();}}
  destroy(){cancelAnimationFrame(this.raf);window.removeEventListener('keydown',this._km);window.removeEventListener('keyup',this._ku);}
}
