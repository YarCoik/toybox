// 3D Spinning Cube — wireframe with mouse rotation
export class SpinningCube {
  constructor(c){this.c=c;this.raf=null;this.rx=.4;this.ry=.6;this.rz=0;this.drx=.003;this.dry=.007;this.dragging=false;this.lastMx=0;this.lastMy=0;this.hue=0;this.showFaces=true;this.scale=1;}
  init(){
    const w=document.createElement('div');w.style.cssText='position:absolute;inset:0;background:#020108;overflow:hidden;cursor:grab';this.c.appendChild(w);
    this.cv=document.createElement('canvas');this.cv.className='gc';w.appendChild(this.cv);this.ctx=this.cv.getContext('2d');
    const ctrl=document.createElement('div');ctrl.style.cssText='position:absolute;bottom:1rem;left:50%;transform:translateX(-50%);display:flex;gap:.5rem;z-index:10;flex-wrap:wrap;justify-content:center';
    const mk=(lbl,col,fn)=>{const b=document.createElement('button');b.style.cssText=`padding:.38rem .85rem;border-radius:8px;background:rgba(255,255,255,.07);border:1px solid ${col}44;color:${col};font-family:Syne,sans-serif;font-size:.75rem;font-weight:700;cursor:pointer`;b.textContent=lbl;b.onclick=fn;return b;};
    ctrl.appendChild(mk('🎲 Shapes','#7c3aff',()=>this._nextShape()));
    const faceBtn=mk('🔲 Faces','#3affcb',()=>{this.showFaces=!this.showFaces;faceBtn.textContent=this.showFaces?'🔲 Faces':'⬜ Wireframe';});ctrl.appendChild(faceBtn);
    ctrl.appendChild(mk('⟳ Spin','#ffb43a',()=>{this.drx=.004*(Math.random()-.5)*4;this.dry=.01*(Math.random()-.5)*4;}));
    w.appendChild(ctrl);
    const h=document.createElement('div');h.className='hint hint-top';h.textContent='Drag to rotate · Scroll to zoom';w.appendChild(h);
    this.shapeIdx=0;this.shapes=['cube','octahedron','dodecahedron-ish','pyramid'];
    this._buildShape();this.resize();
    this._md=e=>{this.dragging=true;this.lastMx=e.clientX;this.lastMy=e.clientY;this.drx=0;this.dry=0;w.style.cursor='grabbing';};
    this._mm=e=>{if(!this.dragging)return;this.ry+=(e.clientX-this.lastMx)*.005;this.rx+=(e.clientY-this.lastMy)*.005;this.lastMx=e.clientX;this.lastMy=e.clientY;};
    this._mu=()=>{this.dragging=false;w.style.cursor='grab';this.drx=.002;this.dry=.005;};
    this._mw=e=>{this.scale=Math.max(.3,Math.min(2.5,this.scale-e.deltaY*.001));};
    this.cv.addEventListener('mousedown',this._md);window.addEventListener('mousemove',this._mm);window.addEventListener('mouseup',this._mu);this.cv.addEventListener('wheel',this._mw,{passive:true});
    this._loop();
  }
  _buildShape(){
    const s=this.shapes[this.shapeIdx%this.shapes.length];
    if(s==='cube'){
      this.verts=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
      this.edges=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
      this.faces=[[0,1,2,3],[4,5,6,7],[0,1,5,4],[2,3,7,6],[0,3,7,4],[1,2,6,5]];
    } else if(s==='octahedron'){
      this.verts=[[0,1.4,0],[0,-1.4,0],[1,0,0],[-1,0,0],[0,0,1],[0,0,-1]];
      this.edges=[[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[4,3],[3,5],[5,2]];
      this.faces=[[0,2,4],[0,4,3],[0,3,5],[0,5,2],[1,2,4],[1,4,3],[1,3,5],[1,5,2]];
    } else if(s==='dodecahedron-ish'){
      const a=1,b=.618,verts=[];const ph=(1+Math.sqrt(5))/2;[[-1,-1,-1],[-1,-1,1],[-1,1,-1],[-1,1,1],[1,-1,-1],[1,-1,1],[1,1,-1],[1,1,1],[0,-ph,-1/ph],[0,-ph,1/ph],[0,ph,-1/ph],[0,ph,1/ph],[-1/ph,0,-ph],[1/ph,0,-ph],[-1/ph,0,ph],[1/ph,0,ph],[-ph,-1/ph,0],[-ph,1/ph,0],[ph,-1/ph,0],[ph,1/ph,0]].forEach(v=>verts.push(v.map(x=>x*.8)));
      this.verts=verts;this.edges=[];
      for(let i=0;i<verts.length;i++) for(let j=i+1;j<verts.length;j++){const d=Math.hypot(...verts[i].map((v,k)=>v-verts[j][k]));if(d>1.05&&d<1.25)this.edges.push([i,j]);}
      this.faces=[];
    } else {
      this.verts=[[-1,-1,-1],[1,-1,-1],[0,-1,1],[-1,1,0],[1,1,0],[0,.8,0]];
      this.edges=[[0,1],[1,2],[2,0],[0,3],[1,4],[2,5],[3,4],[4,5],[5,3]];
      this.faces=[[0,1,2],[0,1,4,3],[1,2,5,4],[0,2,5,3],[3,4,5]];
    }
  }
  _nextShape(){this.shapeIdx++;this._buildShape();}
  _project(v,W,H){
    const[x,y,z]=v,fov=400,d=fov/(fov+z*100*this.scale);return[W/2+x*120*this.scale*d,H/2+y*120*this.scale*d,d];}
  _rotateVert(v){
    const[x,y,z]=v;
    const y1=y*Math.cos(this.rx)-z*Math.sin(this.rx),z1=y*Math.sin(this.rx)+z*Math.cos(this.rx);
    const x2=x*Math.cos(this.ry)+z1*Math.sin(this.ry),z2=-x*Math.sin(this.ry)+z1*Math.cos(this.ry);
    const x3=x2*Math.cos(this.rz)-y1*Math.sin(this.rz),y3=x2*Math.sin(this.rz)+y1*Math.cos(this.rz);
    return[x3,y3,z2];
  }
  _loop(){
    const ctx=this.ctx,W=this.cv.width,H=this.cv.height;
    if(!W||!H){this.raf=requestAnimationFrame(()=>this._loop());return;}
    ctx.fillStyle='rgba(2,1,8,.25)';ctx.fillRect(0,0,W,H);
    this.hue=(this.hue+.4)%360;
    if(!this.dragging){this.rx+=this.drx;this.ry+=this.dry;}
    const rotated=this.verts.map(v=>this._rotateVert(v));
    const projected=rotated.map(v=>this._project(v,W,H));
    // Draw faces
    if(this.showFaces&&this.faces){
      this.faces.forEach((face,fi)=>{
        const fhue=(this.hue+fi*60)%360;
        const pts=face.map(i=>projected[i]);
        const avgZ=face.reduce((s,i)=>s+rotated[i][2],0)/face.length;
        const bright=Math.max(0,.3+avgZ*.3);
        ctx.save();ctx.globalAlpha=.15+bright*.25;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);pts.slice(1).forEach(p=>ctx.lineTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=`hsl(${fhue},80%,60%)`;ctx.fill();ctx.restore();
      });
    }
    // Draw edges
    this.edges.forEach(([a,b])=>{
      const pa=projected[a],pb=projected[b],avgD=(pa[2]+pb[2])/2;
      ctx.save();ctx.strokeStyle=`hsla(${this.hue},90%,70%,${.4+avgD*.4})`;ctx.lineWidth=1.5+avgD;ctx.shadowColor=`hsl(${this.hue},100%,70%)`;ctx.shadowBlur=4;ctx.beginPath();ctx.moveTo(pa[0],pa[1]);ctx.lineTo(pb[0],pb[1]);ctx.stroke();ctx.restore();
    });
    // Draw vertices
    projected.forEach(([x,y,d])=>{ctx.save();ctx.beginPath();ctx.arc(x,y,2.5+d*1.5,0,Math.PI*2);ctx.fillStyle=`hsl(${this.hue},90%,85%)`;ctx.shadowColor=`hsl(${this.hue},100%,80%)`;ctx.shadowBlur=10;ctx.fill();ctx.restore();});
    this.raf=requestAnimationFrame(()=>this._loop());
  }
  resize(){if(this.cv){const r=this.c.getBoundingClientRect();if(r.width&&r.height){this.cv.width=r.width;this.cv.height=r.height;}}}
  destroy(){cancelAnimationFrame(this.raf);window.removeEventListener('mousemove',this._mm);window.removeEventListener('mouseup',this._mu);}
}
