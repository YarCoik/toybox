// Snake — classic arcade game with neon aesthetics
export class SnakeGame {
  constructor(c){this.c=c;this.raf=null;this.sc=18;this.cols=0;this.rows=0;this.snake=[];this.dir={x:1,y:0};this.nextDir={x:1,y:0};this.food=null;this.score=0;this.hiscore=0;this.state='waiting';this.frame=0;this.frameDelay=8;this.hue=120;this.particles=[];}
  init(){
    const w=document.createElement('div');w.style.cssText='position:absolute;inset:0;background:#02050a;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden';this.c.appendChild(w);
    // Score bar
    this.scoreBar=document.createElement('div');this.scoreBar.style.cssText='display:flex;gap:2rem;font-family:DM Mono,monospace;font-size:.85rem;color:rgba(255,255,255,.5);letter-spacing:.08em;margin-bottom:.75rem;flex-shrink:0';
    this.scoreEl=document.createElement('span');this.scoreEl.textContent='SCORE: 0';this.hiEl=document.createElement('span');this.hiEl.textContent='BEST: 0';
    this.scoreBar.appendChild(this.scoreEl);this.scoreBar.appendChild(this.hiEl);w.appendChild(this.scoreBar);
    // Canvas
    this.cv=document.createElement('canvas');this.cv.style.cssText='border-radius:12px;border:1px solid rgba(255,255,255,.08);box-shadow:0 0 40px rgba(58,255,120,.08);display:block';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    // Hint
    const h=document.createElement('div');h.className='hint';h.style.cssText='position:relative;transform:none;left:auto;bottom:auto;margin-top:.75rem;';h.textContent='Arrow keys or WASD · Tap edges to turn · Space to start';w.appendChild(h);
    this.resize();
    this._kb=e=>{const map={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},w:{x:0,y:-1},s:{x:0,y:1},a:{x:-1,y:0},d:{x:1,y:0},' ':null};const d=map[e.key];if(d===undefined)return;e.preventDefault();if(d===null){if(this.state==='waiting'||this.state==='over')this._start();return;}if(d.x===-this.dir.x&&d.y===-this.dir.y)return;this.nextDir=d;};
    this._tc=e=>{const r=this.cv.getBoundingClientRect(),s=e.touches[0],mx=(s.clientX-r.left)/r.width,my=(s.clientY-r.top)/r.height;if(my<.3&&this.dir.y!==1)this.nextDir={x:0,y:-1};else if(my>.7&&this.dir.y!==-1)this.nextDir={x:0,y:1};else if(mx<.35&&this.dir.x!==1)this.nextDir={x:-1,y:0};else if(mx>.65&&this.dir.x!==-1)this.nextDir={x:1,y:0};if(this.state==='waiting'||this.state==='over')this._start();};
    window.addEventListener('keydown',this._kb);this.cv.addEventListener('touchstart',this._tc,{passive:true});
    this._drawWait();this._loop();
  }
  _resize2(){
    const r=this.c.getBoundingClientRect(),maxW=Math.min(r.width-40,520),maxH=Math.min(r.height-120,520);
    const size=Math.floor(Math.min(maxW,maxH)/this.sc)*this.sc;
    this.cv.width=size;this.cv.height=size;this.cv.style.width=size+'px';this.cv.style.height=size+'px';
    this.cols=size/this.sc;this.rows=size/this.sc;
  }
  _start(){
    const mid=Math.floor(this.cols/2);this.snake=[{x:mid,y:mid},{x:mid-1,y:mid},{x:mid-2,y:mid}];
    this.dir={x:1,y:0};this.nextDir={x:1,y:0};this.score=0;this.state='playing';this.frameDelay=8;this.particles=[];this._placeFood();this._updateScore();
  }
  _placeFood(){
    const occupied=new Set(this.snake.map(s=>`${s.x},${s.y}`));do{this.food={x:Math.floor(Math.random()*this.cols),y:Math.floor(Math.random()*this.rows),hue:Math.random()*360};}while(occupied.has(`${this.food.x},${this.food.y}`));}
  _step(){
    this.dir=this.nextDir;
    const head={x:this.snake[0].x+this.dir.x,y:this.snake[0].y+this.dir.y};
    if(head.x<0||head.x>=this.cols||head.y<0||head.y>=this.rows){this.state='over';this.hiscore=Math.max(this.hiscore,this.score);this.hiEl.textContent='BEST: '+this.hiscore;return;}
    if(this.snake.some(s=>s.x===head.x&&s.y===head.y)){this.state='over';this.hiscore=Math.max(this.hiscore,this.score);this.hiEl.textContent='BEST: '+this.hiscore;return;}
    this.snake.unshift(head);
    if(head.x===this.food.x&&head.y===this.food.y){
      this.score+=10;this.frameDelay=Math.max(3,this.frameDelay-.15);this._updateScore();this._burst(head.x,head.y,this.food.hue);this._placeFood();
    } else this.snake.pop();
  }
  _burst(cx,cy,hue){const px=cx*this.sc+this.sc/2,py=cy*this.sc+this.sc/2;for(let i=0;i<12;i++){const a=Math.random()*Math.PI*2,sp=2+Math.random()*5;this.particles.push({x:px,y:py,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:1,hue});}}
  _updateScore(){this.scoreEl.textContent='SCORE: '+this.score;}
  _draw(){
    const ctx=this.ctx,W=this.cv.width,H=this.cv.height,sc=this.sc;
    ctx.fillStyle='#02050a';ctx.fillRect(0,0,W,H);
    // Grid dots
    ctx.fillStyle='rgba(255,255,255,.03)';
    for(let y=0;y<this.rows;y++) for(let x=0;x<this.cols;x++)ctx.fillRect(x*sc+sc/2-1,y*sc+sc/2-1,2,2);
    if(this.state==='playing'||this.state==='over'){
      // Food
      const fx=this.food.x*sc+sc/2,fy=this.food.y*sc+sc/2;
      const pulse=.7+.3*Math.sin(this.frame*.15);
      ctx.save();ctx.beginPath();ctx.arc(fx,fy,sc*.42*pulse,0,Math.PI*2);ctx.fillStyle=`hsl(${this.food.hue},90%,65%)`;ctx.shadowColor=`hsl(${this.food.hue},100%,70%)`;ctx.shadowBlur=20*pulse;ctx.fill();ctx.restore();
      // Snake
      this.snake.forEach((seg,i)=>{
        const isHead=i===0;const t=1-i/this.snake.length;const h=(this.hue+i*3)%360;
        ctx.save();const x=seg.x*sc+1,y=seg.y*sc+1,s=sc-2;
        ctx.beginPath();ctx.roundRect(x,y,s,s,isHead?sc*.4:sc*.25);ctx.fillStyle=`hsl(${h},85%,${isHead?70:45+t*20}%)`;if(isHead){ctx.shadowColor=`hsl(${h},100%,70%)`;ctx.shadowBlur=14;}ctx.fill();
        if(isHead){ctx.fillStyle='rgba(0,0,0,.7)';ctx.beginPath();ctx.arc(x+s*.3,y+s*.3,s*.1,0,Math.PI*2);ctx.arc(x+s*.7,y+s*.3,s*.1,0,Math.PI*2);ctx.fill();}
        ctx.restore();
      });
      // Particles
      for(let i=this.particles.length-1;i>=0;i--){const p=this.particles[i];p.vy+=.15;p.x+=p.vx;p.y+=p.vy;p.life-=.04;if(p.life<=0){this.particles.splice(i,1);continue;}ctx.fillStyle=`hsla(${p.hue},90%,70%,${p.life})`;ctx.beginPath();ctx.arc(p.x,p.y,3*p.life,0,Math.PI*2);ctx.fill();}
    }
    if(this.state==='over'){ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(0,0,W,H);ctx.textAlign='center';ctx.fillStyle='#ff4466';ctx.font='bold 28px Syne,sans-serif';ctx.fillText('GAME OVER',W/2,H/2-20);ctx.fillStyle='rgba(255,255,255,.5)';ctx.font='14px DM Mono,monospace';ctx.fillText('Press Space or tap to play again',W/2,H/2+16);}
    if(this.state==='waiting'){ctx.textAlign='center';ctx.fillStyle='rgba(58,255,120,.7)';ctx.font='bold 24px Syne,sans-serif';ctx.fillText('[ SNAKE ]',W/2,H/2-24);ctx.fillStyle='rgba(255,255,255,.4)';ctx.font='13px DM Mono,monospace';ctx.fillText('Press Space or tap to start',W/2,H/2+14);}
  }
  _drawWait(){this._draw();}
  _loop(){
    this.frame++;this.hue=(this.hue+.4)%360;
    if(this.state==='playing'&&this.frame%Math.round(this.frameDelay)===0)this._step();
    this._draw();
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  resize(){if(this.cv){this._resize2();if(this.state==='playing')this._start();else this._draw();}}
  destroy(){cancelAnimationFrame(this.raf);window.removeEventListener('keydown',this._kb);}
}
