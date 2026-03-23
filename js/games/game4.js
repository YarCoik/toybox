export class EmojiAlchemist {
  constructor(c){
    this.c=c;this.s1=null;this.s2=null;this.sel=null;this.found=new Set();
    this.rx={'💧+🔥':'☁️','💧+🌱':'🌿','💧+❄️':'🌨️','🔥+🌱':'🍂','🔥+💨':'🌪️','🔥+🔥':'☀️','💧+💧':'🌊','🌱+🌱':'🌳','🌍+💧':'🌧️','🌍+🔥':'🌋','🌍+💨':'🌀','⚡+💧':'⛈️','⚡+🌱':'🌵','🌙+⭐':'🌌','🌙+💧':'🪞','🐣+💧':'🐟','🐣+🌱':'🦋','🐣+🔥':'🐉','🍎+🔥':'🥧','🍎+💧':'🧃','🧪+🔥':'💥','🧪+💧':'🫧','🧪+⚡':'☢️','💀+💧':'👻','💀+🔥':'😈','💫+⭐':'🌟','🌊+🔥':'💨','🌊+❄️':'🧊','🌳+🔥':'🪵','🌳+💧':'🍄'};
    this.pal=['💧','🔥','🌱','💨','❄️','⚡','🌍','🌙','⭐','🐣','🍎','🧪','💀','💫','🌊','🌳'];
  }
  init(){
    const d=document.createElement('div');d.className='al-wrap';this.c.appendChild(d);
    d.innerHTML='<div class="al-t">⚗️ Emoji Alchemist</div>';
    const h=document.createElement('div');h.className='al-h';h.textContent=`Tap an ingredient then tap a slot — or drag & drop. ${Object.keys(this.rx).length} recipes to find!`;d.appendChild(h);
    const pal=document.createElement('div');pal.className='al-pal';
    this.pal.forEach(em=>{
      const el=document.createElement('div');el.className='al-e';el.textContent=em;el.draggable=true;
      el.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',em);el.style.opacity='.5';});
      el.addEventListener('dragend',()=>el.style.opacity='');
      el.addEventListener('click',()=>this._sel(em,el));
      pal.appendChild(el);
    });
    d.appendChild(pal);
    const dz=document.createElement('div');dz.className='al-dz';
    this.e1=this._slot(1);this.e2=this._slot(2);
    const plus=document.createElement('div');plus.className='al-plus';plus.textContent='+';
    const eq=document.createElement('div');eq.className='al-plus';eq.textContent='=';
    this.resEl=document.createElement('div');this.resEl.className='al-res';this.resEl.textContent='?';
    dz.appendChild(this.e1);dz.appendChild(plus);dz.appendChild(this.e2);dz.appendChild(eq);dz.appendChild(this.resEl);d.appendChild(dz);
    const hl=document.createElement('div');hl.className='al-h';hl.textContent='Discovered:';d.appendChild(hl);
    this.hist=document.createElement('div');this.hist.className='al-hist';d.appendChild(this.hist);
  }
  _slot(n){
    const s=document.createElement('div');s.className='al-slot';s.textContent='?';s.style.opacity='.4';
    s.addEventListener('dragover',e=>{e.preventDefault();s.classList.add('ov');});
    s.addEventListener('dragleave',()=>s.classList.remove('ov'));
    s.addEventListener('drop',e=>{e.preventDefault();s.classList.remove('ov');const em=e.dataTransfer.getData('text/plain');if(em)this._put(n,em);});
    s.addEventListener('click',()=>{if(this.sel)this._put(n,this.sel);});
    return s;
  }
  _sel(em,el){this.sel=em;document.querySelectorAll('.al-e').forEach(e=>e.classList.remove('sel'));el.classList.add('sel');if(!this.s1){this._put(1,em);return;}if(!this.s2){this._put(2,em);return;}this._put(1,em);}
  _put(n,em){if(n===1){this.s1=em;this.e1.textContent=em;this.e1.style.opacity='1';}else{this.s2=em;this.e2.textContent=em;this.e2.style.opacity='1';}if(this.s1&&this.s2)this._combine();}
  _combine(){
    const key=[this.s1,this.s2].sort().join('+'),res=this.rx[key]||null;
    if(res){this.resEl.textContent=res;this.resEl.style.transform='scale(1.9)';setTimeout(()=>this.resEl.style.transform='',10);const k=`${this.s1}+${this.s2}=${res}`;if(!this.found.has(k)){this.found.add(k);this._addH(this.s1,this.s2,res);this._burst(this.resEl,res);}}
    else this.resEl.textContent='💨';
  }
  _burst(el,em){const r=el.getBoundingClientRect();for(let i=0;i<8;i++){const sp=document.createElement('span');sp.textContent=em;sp.style.cssText=`position:fixed;left:${r.left+r.width/2}px;top:${r.top+r.height/2}px;font-size:1.4rem;pointer-events:none;z-index:9999;transition:transform .6s cubic-bezier(.16,1,.3,1),opacity .6s ease;`;document.body.appendChild(sp);const a=(i/8)*Math.PI*2,d=60+Math.random()*50;requestAnimationFrame(()=>{sp.style.transform=`translate(${Math.cos(a)*d}px,${Math.sin(a)*d}px) scale(0)`;sp.style.opacity='0';});setTimeout(()=>sp.remove(),700);}}
  _addH(a,b,res){const it=document.createElement('div');it.className='al-hi';it.textContent=`${a}+${b}=${res}`;it.style.cssText='opacity:0;transform:scale(.8);transition:opacity .3s,transform .3s cubic-bezier(.34,1.56,.64,1)';this.hist.prepend(it);requestAnimationFrame(()=>{it.style.opacity='1';it.style.transform='scale(1)';});}
  destroy(){}
}
