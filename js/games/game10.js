export class UselessSwitch {
  constructor(c){this.c=c;this.on=false;this.armState='hidden';this.armT=0;this.raf=null;this._cp=false;this.attempts=0;this.msgs=["That's not allowed.","I said no.","Please stop.","Seriously?","You monster.","I have feelings too.","...okay, fine— NO.","𝙉𝙊.","[ ERROR: User ignored ]","Fine. I'll bring a bigger arm."];}
  init(){
    const d=document.createElement('div');d.className='sw-wrap';this.c.appendChild(d);
    const lbl=document.createElement('div');lbl.className='sw-lbl';lbl.innerHTML='The <span>Useless</span> Switch';d.appendChild(lbl);
    this.sw=document.createElement('div');this.sw.className='sw-outer';
    const knob=document.createElement('div');knob.className='sw-knob';this.sw.appendChild(knob);
    this.sw.onclick=()=>this._click();d.appendChild(this.sw);
    this.stEl=document.createElement('div');this.stEl.className='sw-st';this.stEl.textContent='STATUS: OFF';d.appendChild(this.stEl);
    this.msgEl=document.createElement('div');this.msgEl.className='sw-msg';d.appendChild(this.msgEl);
    this.ac=document.createElement('canvas');this.ac.className='arm-cv';d.appendChild(this.ac);this.actx=this.ac.getContext('2d');
    this.resize();this._loop();
  }
  _click(){
    if(this.on||this.armState!=='hidden')return;
    this.on=true;this.attempts++;this.sw.classList.add('on');this.stEl.textContent='STATUS: ON';
    this._showMsg(this.msgs[(this.attempts-1)%this.msgs.length]);
    setTimeout(()=>{this.armState='extending';this.armT=0;},200+Math.random()*400);
  }
  _showMsg(msg){this.msgEl.style.opacity='0';setTimeout(()=>{this.msgEl.textContent=msg;this.msgEl.style.opacity='1';},150);}
  _loop(){
    const ctx=this.actx,W=this.ac.width,H=this.ac.height;
    ctx.clearRect(0,0,W,H);
    if(this.armState==='extending'){this.armT=Math.min(this.armT+.025,1);if(this.armT>=1){this.armT=1;this.armState='clicking';}this._drawArm(ctx,W,H,this.armT);}
    else if(this.armState==='clicking'){this._drawArm(ctx,W,H,1);if(!this._cp){this._cp=true;setTimeout(()=>{this.on=false;this.sw.classList.remove('on');this.stEl.textContent='STATUS: OFF';this.armState='retracting';this._cp=false;},200);}}
    else if(this.armState==='retracting'){this.armT=Math.max(0,this.armT-.04);if(this.armT<=0){this.armT=0;this.armState='hidden';}this._drawArm(ctx,W,H,this.armT);}
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  _drawArm(ctx,W,H,t){
    const sr=this.sw.getBoundingClientRect(),ar=this.ac.getBoundingClientRect();
    if(!ar.width||!ar.height)return;
    const sx=sr.left+sr.width/2-ar.left,sy=sr.top+sr.height/2-ar.top;
    const ease=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
    const shoulderX=W+20,shoulderY=sy+20,elbowX=W*.55+(W*.45)*(1-ease),tipX=sx+4,tipY=sy-12+12*t;
    const tx2=tipX*ease+shoulderX*(1-ease),ty2=tipY*ease+shoulderY*(1-ease);
    ctx.save();ctx.lineWidth=10*(.5+ease*.5);ctx.lineCap='round';ctx.lineJoin='round';
    ctx.strokeStyle=`rgba(200,200,220,${ease*.9})`;ctx.shadowColor='#c8ff3a';ctx.shadowBlur=14*ease;
    ctx.beginPath();ctx.moveTo(shoulderX,shoulderY);ctx.bezierCurveTo(elbowX,shoulderY,elbowX,ty2,tx2,ty2);ctx.stroke();
    ctx.shadowBlur=0;ctx.fillStyle=`rgba(220,220,240,${ease})`;ctx.beginPath();ctx.arc(tx2,ty2,7*ease,0,Math.PI*2);ctx.fill();ctx.restore();
  }
  resize(){if(this.ac){const r=this.c.getBoundingClientRect();if(r.width&&r.height){this.ac.width=r.width;this.ac.height=r.height;}}}
  destroy(){cancelAnimationFrame(this.raf);}
}
