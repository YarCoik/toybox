export class ShadowPlay {
  constructor(c){this.c=c;this.raf=null;this.lx=300;this.ly=300;this.shapes=[];}
  init(){
    const w=document.createElement('div');w.className='fill';w.style.cssText='background:#03020a;cursor:none';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.className='gc';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    this.cur=document.createElement('div');this.cur.style.cssText='position:absolute;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle,#fff8e0,rgba(255,240,160,.5) 40%,transparent 70%);transform:translate(-50%,-50%);pointer-events:none;z-index:10;box-shadow:0 0 30px 10px rgba(255,240,160,.25)';w.appendChild(this.cur);
    const h=document.createElement('div');h.className='hint hint-top';h.textContent='Move your cursor — you are the light source';w.appendChild(h);
    this._mm=e=>{const r=this.cv.getBoundingClientRect(),s=e.touches?e.touches[0]:e;this.lx=s.clientX-r.left;this.ly=s.clientY-r.top;};
    this.cv.addEventListener('mousemove',this._mm,{passive:true});this.cv.addEventListener('touchmove',this._mm,{passive:true});
    this.resize();this._buildShapes();this._loop();
  }
  _buildShapes(){
    const W=this.cv.width,H=this.cv.height;if(!W||!H)return;
    const rect=(x,y,w,h,c)=>({color:c,pts:[{x,y},{x:x+w,y},{x:x+w,y:y+h},{x,y:y+h}]});
    const tri=(cx,cy,r,c)=>({color:c,pts:[0,1,2].map(i=>({x:cx+Math.cos((i/3)*Math.PI*2-Math.PI/2)*r,y:cy+Math.sin((i/3)*Math.PI*2-Math.PI/2)*r}))});
    const hex=(cx,cy,r,c)=>({color:c,pts:Array.from({length:6},(_,i)=>({x:cx+Math.cos((i/6)*Math.PI*2)*r,y:cy+Math.sin((i/6)*Math.PI*2)*r}))});
    const star=(cx,cy,r,c)=>({color:c,pts:Array.from({length:10},(_,i)=>{const a=(i/10)*Math.PI*2-Math.PI/2,rd=i%2===0?r:r*.45;return{x:cx+Math.cos(a)*rd,y:cy+Math.sin(a)*rd};})});
    this.shapes=[rect(W*.12,H*.2,W*.08,H*.12,'#c0392b'),rect(W*.7,H*.15,W*.1,H*.18,'#2980b9'),tri(W*.35,H*.3,H*.1,'#27ae60'),hex(W*.6,H*.6,H*.08,'#8e44ad'),rect(W*.2,H*.65,W*.12,H*.08,'#d35400'),star(W*.8,H*.65,H*.08,'#f39c12'),tri(W*.5,H*.7,H*.07,'#1abc9c')];
  }
  _shadow(shape){
    const lx=this.lx,ly=this.ly,len=4000,pts=shape.pts,ctx=this.ctx;
    const proj=pts.map(p=>{const dx=p.x-lx,dy=p.y-ly,d=Math.hypot(dx,dy)||1;return{x:lx+(dx/d)*(d+len),y:ly+(dy/d)*(d+len)};});
    ctx.save();ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);pts.forEach(p=>ctx.lineTo(p.x,p.y));ctx.closePath();
    for(let i=0;i<pts.length;i++){const i2=(i+1)%pts.length,p1=pts[i],p2=pts[i2],q1=proj[i],q2=proj[i2],ex=p2.x-p1.x,ey=p2.y-p1.y,cross=ex*(ly-p1.y)-ey*(lx-p1.x);if(cross<0){ctx.moveTo(p1.x,p1.y);ctx.lineTo(q1.x,q1.y);ctx.lineTo(q2.x,q2.y);ctx.lineTo(p2.x,p2.y);ctx.closePath();}}
    ctx.moveTo(proj[0].x,proj[0].y);proj.forEach(p=>ctx.lineTo(p.x,p.y));ctx.closePath();
    const sumx=pts.reduce((a,p)=>a+p.x,0)/pts.length,sumy=pts.reduce((a,p)=>a+p.y,0)/pts.length,dist=Math.hypot(lx-sumx,ly-sumy),alpha=Math.max(.05,Math.min(.85,1-dist/1200));
    ctx.fillStyle=`rgba(0,0,0,${alpha})`;ctx.fill();ctx.restore();
  }
  _loop(){
    const ctx=this.ctx,W=this.cv.width,H=this.cv.height;
    if(!W||!H){this.raf=requestAnimationFrame(()=>this._loop());return;}
    ctx.fillStyle='#03020a';ctx.fillRect(0,0,W,H);
    this.shapes.forEach(s=>this._shadow(s));
    const g=ctx.createRadialGradient(this.lx,this.ly,0,this.lx,this.ly,Math.min(W,H)*.7);g.addColorStop(0,'rgba(255,240,180,.1)');g.addColorStop(.5,'rgba(255,220,120,.03)');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    this.shapes.forEach(s=>{ctx.save();ctx.beginPath();ctx.moveTo(s.pts[0].x,s.pts[0].y);s.pts.forEach(p=>ctx.lineTo(p.x,p.y));ctx.closePath();ctx.shadowColor=s.color;ctx.shadowBlur=12;ctx.fillStyle=s.color;ctx.fill();ctx.restore();});
    this.cur.style.left=this.lx+'px';this.cur.style.top=this.ly+'px';
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  resize(){if(this.cv){const r=this.c.getBoundingClientRect();if(r.width&&r.height){this.cv.width=r.width;this.cv.height=r.height;this._buildShapes();}}}
  destroy(){cancelAnimationFrame(this.raf);}
}
