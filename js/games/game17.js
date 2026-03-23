export class ConstellationMaker {
  constructor(c){this.c=c;this.raf=null;this.stars=[];this.lines=[];this.selected=null;this.hue=220;}
  init(){
    const w=document.createElement('div');w.className='fill';w.style.cssText='background:radial-gradient(ellipse at 50% 100%,#0a0520 0%,#010108 60%);cursor:crosshair';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.className='gc';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    const h=document.createElement('div');h.className='hint hint-top';h.textContent='Click a star to select · Click another to connect · Double-click to name';w.appendChild(h);
    const clrBtn=document.createElement('button');clrBtn.className='';clrBtn.style.cssText='position:absolute;bottom:5.5rem;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:.35rem .9rem;cursor:pointer;color:rgba(255,255,255,.5);font-family:DM Mono,monospace;font-size:.72rem;pointer-events:all';clrBtn.textContent='Clear lines';clrBtn.onclick=()=>{this.lines=[];this.selected=null;};w.appendChild(clrBtn);
    this._mc=e=>{const r=this.cv.getBoundingClientRect(),s=e.touches?e.touches[0]:e,mx=s.clientX-r.left,my=s.clientY-r.top;const hit=this.stars.find(st=>Math.hypot(st.x-mx,st.y-my)<st.r+12);
      if(hit){if(this.selected&&this.selected!==hit){this.lines.push({a:this.selected,b:hit});this.selected=null;}else this.selected=hit;}
      else{this.stars.push({x:mx,y:my,r:2+Math.random()*3,twinkle:Math.random()*Math.PI*2,tSpeed:.02+Math.random()*.03,hue:200+Math.random()*80,name:''});this.selected=this.stars[this.stars.length-1];}
    };
    this._dc=e=>{const r=this.cv.getBoundingClientRect(),s=e.touches?e.touches[0]:e,mx=s.clientX-r.left,my=s.clientY-r.top;const hit=this.stars.find(st=>Math.hypot(st.x-mx,st.y-my)<st.r+12);if(hit){const n=prompt('Name this star:','');if(n)hit.name=n;}};
    this.cv.addEventListener('click',this._mc);this.cv.addEventListener('dblclick',this._dc);this.cv.addEventListener('touchstart',this._mc,{passive:true});
    this.resize();this._genStars();this._loop();
  }
  _genStars(){const W=this.cv.width,H=this.cv.height;if(!W||!H)return;for(let i=0;i<80;i++){this.stars.push({x:Math.random()*W,y:Math.random()*H,r:.5+Math.random()*2.5,twinkle:Math.random()*Math.PI*2,tSpeed:.01+Math.random()*.03,hue:200+Math.random()*100,name:'',bg:true});}}
  _loop(){
    const W=this.cv.width,H=this.cv.height,ctx=this.ctx;
    if(!W||!H){this.raf=requestAnimationFrame(()=>this._loop());return;}
    ctx.fillStyle='rgba(1,1,8,.2)';ctx.fillRect(0,0,W,H);
    this.hue=(this.hue+.1)%360;
    // Draw lines
    this.lines.forEach(l=>{ctx.save();ctx.beginPath();ctx.moveTo(l.a.x,l.a.y);ctx.lineTo(l.b.x,l.b.y);ctx.strokeStyle=`hsla(${this.hue},70%,70%,.35)`;ctx.lineWidth=1;ctx.shadowColor=`hsla(${this.hue},80%,70%,.5)`;ctx.shadowBlur=6;ctx.stroke();ctx.restore();});
    // Draw stars
    this.stars.forEach(st=>{
      st.twinkle+=st.tSpeed;const bright=.4+Math.abs(Math.sin(st.twinkle))*.6;
      ctx.save();const isSelected=this.selected===st;
      if(isSelected){ctx.beginPath();ctx.arc(st.x,st.y,st.r+8,0,Math.PI*2);ctx.strokeStyle=`hsla(${st.hue},90%,70%,.4)`;ctx.lineWidth=1;ctx.stroke();}
      ctx.beginPath();ctx.arc(st.x,st.y,st.r,0,Math.PI*2);ctx.fillStyle=`hsla(${st.hue},80%,${70+bright*25}%,${bright})`;ctx.shadowColor=`hsla(${st.hue},100%,80%,${bright})`;ctx.shadowBlur=st.r*4;ctx.fill();
      if(st.name){ctx.fillStyle='rgba(255,255,255,.7)';ctx.font='600 11px DM Mono,monospace';ctx.fillText(st.name,st.x+st.r+5,st.y-st.r-3);}
      ctx.restore();
    });
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  resize(){if(this.cv){const r=this.c.getBoundingClientRect();if(r.width&&r.height){this.cv.width=r.width;this.cv.height=r.height;if(!this.stars.length)this._genStars();}}}
  destroy(){cancelAnimationFrame(this.raf);}
}
