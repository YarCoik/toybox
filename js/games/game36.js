// Etch-a-Sketch — classic red toy with rotary knobs
export class EtchASketch {
  constructor(c){this.c=c;this.raf=null;this.x=0;this.y=0;this.vx=0;this.vy=0;this.trail=[];}
  init(){
    const w=document.createElement('div');w.style.cssText='position:absolute;inset:0;background:#cc2200;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;overflow:hidden;font-family:Syne,sans-serif';this.c.appendChild(w);
    // Device body
    const body=document.createElement('div');body.style.cssText='background:#cc2200;border-radius:16px;padding:16px 24px;box-shadow:inset 0 -4px 0 #991a00,0 8px 32px rgba(0,0,0,.5),0 2px 0 rgba(255,255,255,.15);display:flex;flex-direction:column;align-items:center;gap:12px';
    // Screen bezel
    const bezel=document.createElement('div');bezel.style.cssText='background:#888;padding:8px;border-radius:8px;box-shadow:inset 0 2px 6px rgba(0,0,0,.6),0 2px 0 rgba(255,255,255,.1)';
    this.cv=document.createElement('canvas');this.cv.style.cssText='display:block;background:#cce0bb;border-radius:4px;cursor:crosshair';this.ctx=this.cv.getContext('2d');bezel.appendChild(this.cv);body.appendChild(bezel);
    // Knobs row
    const knobs=document.createElement('div');knobs.style.cssText='display:flex;justify-content:space-between;width:100%;padding:0 8px';
    // Left knob (horizontal)
    this.knobL=this._makeKnob('↔');this.knobR=this._makeKnob('↕');
    knobs.appendChild(this.knobL.el);knobs.appendChild(this.knobR.el);body.appendChild(knobs);
    // Shake to clear
    const clrBtn=document.createElement('button');clrBtn.style.cssText='padding:.45rem 1.2rem;border-radius:100px;background:rgba(0,0,0,.25);border:2px solid rgba(0,0,0,.3);color:rgba(255,255,255,.8);font-family:Syne,sans-serif;font-size:.8rem;font-weight:700;cursor:pointer;letter-spacing:.05em';clrBtn.textContent='📳 SHAKE TO CLEAR';clrBtn.onclick=()=>this._shake();body.appendChild(clrBtn);
    w.appendChild(body);
    const h=document.createElement('div');h.style.cssText='font-family:DM Mono,monospace;font-size:.7rem;color:rgba(255,255,255,.5);text-align:center;padding:0 1rem';h.textContent='Arrow keys · Drag the knobs · or use WASD';w.appendChild(h);
    this._resizeScreen();
    // Keyboard
    this._pressed={};
    this._kb=e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','a','d','w','s'].includes(e.key)){e.preventDefault();this._pressed[e.key]=true;}};
    this._ku=e=>{delete this._pressed[e.key];};
    window.addEventListener('keydown',this._kb);window.addEventListener('keyup',this._ku);
    // Mouse drag on canvas
    let drawing=false;
    this.cv.addEventListener('mousedown',e=>{drawing=true;const r=this.cv.getBoundingClientRect();this.x=e.clientX-r.left;this.y=e.clientY-r.top;this.trail.push({x:this.x,y:this.y,lift:true});});
    this.cv.addEventListener('mousemove',e=>{if(!drawing)return;const r=this.cv.getBoundingClientRect();const nx=e.clientX-r.left,ny=e.clientY-r.top;this.x=nx;this.y=ny;this.trail.push({x:nx,y:ny,lift:false});this._redraw();});
    this.cv.addEventListener('mouseup',()=>drawing=false);
    this.cv.addEventListener('touchstart',e=>{e.preventDefault();const r=this.cv.getBoundingClientRect(),t=e.touches[0];this.x=t.clientX-r.left;this.y=t.clientY-r.top;this.trail.push({x:this.x,y:this.y,lift:true});},{passive:false});
    this.cv.addEventListener('touchmove',e=>{e.preventDefault();const r=this.cv.getBoundingClientRect(),t=e.touches[0];this.x=t.clientX-r.left;this.y=t.clientY-r.top;this.trail.push({x:this.x,y:this.y,lift:false});this._redraw();},{passive:false});
    this._loop();
  }
  _makeKnob(icon){
    const el=document.createElement('div');el.style.cssText='width:44px;height:44px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#555,#222);box-shadow:0 4px 8px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;cursor:grab;user-select:none;font-size:16px;color:rgba(255,255,255,.6)';el.textContent=icon;
    let startY=0,startX=0,vRef={v:0};
    el.addEventListener('mousedown',e=>{startX=e.clientX;startY=e.clientY;el.style.cursor='grabbing';
      const onMove=e2=>{vRef.v=(icon==='↔'?e2.clientX-startX:e2.clientY-startY)*.08;};
      const onUp=()=>{vRef.v=0;el.style.cursor='grab';document.removeEventListener('mousemove',onMove);document.removeEventListener('mouseup',onUp);};
      document.addEventListener('mousemove',onMove);document.addEventListener('mouseup',onUp);
    });
    return{el,vRef};
  }
  _resizeScreen(){
    const r=this.c.getBoundingClientRect();
    const s=Math.min(Math.min(r.width-80,500),Math.min(r.height-180,360));
    this.cv.width=Math.floor(s);this.cv.height=Math.floor(s*.65);
    this.x=this.cv.width/2;this.y=this.cv.height/2;this.trail=[];
    this.ctx.fillStyle='#cce0bb';this.ctx.fillRect(0,0,this.cv.width,this.cv.height);
  }
  _redraw(){
    const ctx=this.ctx,W=this.cv.width,H=this.cv.height;
    ctx.fillStyle='#cce0bb';ctx.fillRect(0,0,W,H);
    if(this.trail.length<2)return;
    ctx.strokeStyle='#111';ctx.lineWidth=1.5;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();
    this.trail.forEach((pt,i)=>{if(pt.lift||i===0)ctx.moveTo(pt.x,pt.y);else ctx.lineTo(pt.x,pt.y);});
    ctx.stroke();
    // Draw cursor dot
    ctx.fillStyle='#222';ctx.beginPath();ctx.arc(this.x,this.y,2,0,Math.PI*2);ctx.fill();
  }
  _shake(){
    let t=0;const shake=()=>{const angle=Math.random()*Math.PI*2,d=5+Math.random()*10;this.cv.style.transform=`translate(${Math.cos(angle)*d}px,${Math.sin(angle)*d}px)`;t++;if(t<15)requestAnimationFrame(shake);else{this.cv.style.transform='';this.trail=[];this.ctx.fillStyle='#cce0bb';this.ctx.fillRect(0,0,this.cv.width,this.cv.height);}};
    shake();
  }
  _loop(){
    const kb=this._pressed;let dx=0,dy=0;
    if(kb['ArrowLeft']||kb['a'])dx-=2.5;if(kb['ArrowRight']||kb['d'])dx+=2.5;
    if(kb['ArrowUp']||kb['w'])dy-=2.5;if(kb['ArrowDown']||kb['s'])dy+=2.5;
    dx+=this.knobL.vRef.v;dy+=this.knobR.vRef.v;
    if(dx||dy){
      const nx=Math.max(0,Math.min(this.cv.width,this.x+dx));const ny=Math.max(0,Math.min(this.cv.height,this.y+dy));
      if(this.trail.length===0)this.trail.push({x:nx,y:ny,lift:true});
      this.trail.push({x:nx,y:ny,lift:false});this.x=nx;this.y=ny;this._redraw();
    }
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  resize(){this._resizeScreen();}
  destroy(){cancelAnimationFrame(this.raf);window.removeEventListener('keydown',this._kb);window.removeEventListener('keyup',this._ku);}
}
