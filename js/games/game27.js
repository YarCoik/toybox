// Piano — playable keyboard with Web Audio API
export class Piano {
  constructor(c){this.c=c;this.ac=null;this.masterGain=null;this.vol=0.6;this.activeKeys=new Map();this.octave=4;this.wave='triangle';this.sustainOn=false;}
  init(){
    const w=document.createElement('div');w.style.cssText='position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(180deg,#08060f 0%,#100818 100%);gap:1.5rem;padding:1rem';this.c.appendChild(w);
    // Title
    const title=document.createElement('div');title.style.cssText='font-family:Syne,sans-serif;font-size:1.2rem;font-weight:800;color:#fff;letter-spacing:.05em;opacity:.8';title.textContent='🎹 Piano';w.appendChild(title);
    // Controls
    const ctrl=document.createElement('div');ctrl.style.cssText='display:flex;gap:1rem;align-items:center;flex-wrap:wrap;justify-content:center';
    // Octave
    const ow=document.createElement('div');ow.style.cssText='display:flex;align-items:center;gap:.5rem;font-family:DM Mono,monospace;font-size:.75rem;color:rgba(255,255,255,.4)';
    const od=document.createElement('button');od.textContent='−';od.style.cssText='width:24px;height:24px;border-radius:6px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);color:#fff;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center';
    const ou=document.createElement('button');ou.textContent='+';ou.style.cssText=od.style.cssText;
    this.octLabel=document.createElement('span');this.octLabel.textContent='Oct 4';
    od.onclick=()=>{if(this.octave>1)this.octave--;this.octLabel.textContent='Oct '+this.octave;};
    ou.onclick=()=>{if(this.octave<7)this.octave++;this.octLabel.textContent='Oct '+this.octave;};
    ow.appendChild(od);ow.appendChild(this.octLabel);ow.appendChild(ou);ctrl.appendChild(ow);
    // Waveform
    const waveWrap=document.createElement('div');waveWrap.style.cssText='display:flex;gap:.3rem';
    ['sine','triangle','square','sawtooth'].forEach(wt=>{const b=document.createElement('button');b.style.cssText=`padding:.3rem .7rem;border-radius:6px;background:${wt===this.wave?'rgba(124,58,255,.3)':'rgba(255,255,255,.07)'};border:1px solid ${wt===this.wave?'rgba(124,58,255,.5)':'rgba(255,255,255,.1)'};color:${wt===this.wave?'#c8aaff':'rgba(255,255,255,.5)'};font-family:DM Mono,monospace;font-size:.68rem;cursor:pointer`;b.textContent={sine:'∿',triangle:'∧',square:'⊓',sawtooth:'⋀'}[wt];b.title=wt;b.onclick=()=>{this.wave=wt;waveWrap.querySelectorAll('button').forEach(x=>{x.style.background='rgba(255,255,255,.07)';x.style.borderColor='rgba(255,255,255,.1)';x.style.color='rgba(255,255,255,.5)';});b.style.background='rgba(124,58,255,.3)';b.style.borderColor='rgba(124,58,255,.5)';b.style.color='#c8aaff';};waveWrap.appendChild(b);});
    ctrl.appendChild(waveWrap);
    // Volume
    const vw=document.createElement('div');vw.className='vol-wrap';vw.innerHTML='<span>🔊</span>';const vsl=document.createElement('input');vsl.type='range';vsl.min=0;vsl.max=1;vsl.step=.05;vsl.value=0.6;vsl.style.cssText='width:70px;accent-color:#7c3aff;cursor:pointer';vsl.oninput=()=>{this.vol=+vsl.value;if(this.masterGain)this.masterGain.gain.setTargetAtTime(this.vol,this.ac.currentTime,.01);};vw.appendChild(vsl);ctrl.appendChild(vw);
    w.appendChild(ctrl);
    // Keyboard
    const kbWrap=document.createElement('div');kbWrap.style.cssText='position:relative;height:180px;display:flex;user-select:none;touch-action:none';
    // Notes: C D E F G A B + sharps
    const whites=['C','D','E','F','G','A','B'];
    const blackMap={'C':'C#','D':'D#','F':'F#','G':'G#','A':'A#'};
    const freqMap={};const noteFreqs=(oct)=>{const base={C:261.63,D:293.66,E:329.63,F:349.23,G:392.00,A:440.00,B:493.88,'C#':277.18,'D#':311.13,'F#':369.99,'G#':415.30,'A#':466.16};const obj={};Object.entries(base).forEach(([k,v])=>obj[k]=v*Math.pow(2,oct-4));return obj;};
    // Build 2 octaves
    this.keys=[];
    for(let o=0;o<2;o++){
      whites.forEach((note,ni)=>{
        const wk=document.createElement('div');const id=`${note}${this.octave+o}`;
        wk.style.cssText=`width:38px;height:180px;background:linear-gradient(180deg,#f8f8f8,#e8e8e8);border:1px solid #bbb;border-radius:0 0 6px 6px;cursor:pointer;box-shadow:inset 0 -3px 8px rgba(0,0,0,.2),0 4px 8px rgba(0,0,0,.4);transition:background .05s;flex-shrink:0;position:relative;z-index:1`;
        wk.dataset.note=id;
        const label=document.createElement('div');label.style.cssText='position:absolute;bottom:8px;left:50%;transform:translateX(-50%);font-family:DM Mono,monospace;font-size:.55rem;color:#999;pointer-events:none';label.textContent=note+(this.octave+o);wk.appendChild(label);
        const handler=()=>this._noteOn(id,noteFreqs(this.octave+o)[note],wk);
        const off=()=>this._noteOff(id,wk);
        wk.addEventListener('mousedown',handler);wk.addEventListener('mouseup',off);wk.addEventListener('mouseleave',off);
        wk.addEventListener('touchstart',e=>{e.preventDefault();handler();},{passive:false});
        wk.addEventListener('touchend',off);
        kbWrap.appendChild(wk);this.keys.push({el:wk,id,freq:noteFreqs(this.octave+o)[note]});
        // Black key
        if(blackMap[note]){
          const bname=blackMap[note],bid=`${bname}${this.octave+o}`;
          const bk=document.createElement('div');bk.style.cssText=`position:absolute;left:${(o*7+ni)*38+24}px;top:0;width:24px;height:108px;background:linear-gradient(180deg,#222,#111);border-radius:0 0 4px 4px;z-index:2;cursor:pointer;box-shadow:0 4px 8px rgba(0,0,0,.7);transition:background .05s`;bk.dataset.note=bid;
          const bHandler=()=>this._noteOn(bid,noteFreqs(this.octave+o)[bname],bk);
          const bOff=()=>this._noteOff(bid,bk);
          bk.addEventListener('mousedown',bHandler);bk.addEventListener('mouseup',bOff);bk.addEventListener('mouseleave',bOff);
          bk.addEventListener('touchstart',e=>{e.preventDefault();bHandler();},{passive:false});bk.addEventListener('touchend',bOff);
          kbWrap.appendChild(bk);this.keys.push({el:bk,id:bid,freq:noteFreqs(this.octave+o)[bname]});
        }
      });
    }
    w.appendChild(kbWrap);
    const h=document.createElement('div');h.className='hint';h.style.cssText='bottom:.5rem;max-width:min(700px,90vw);white-space:normal;text-align:center;';w.appendChild(h);
    // Computer keyboard mapping
    this._kmap={'a':'C','w':'C#','s':'D','e':'D#','d':'E','f':'F','t':'F#','g':'G','y':'G#','h':'A','u':'A#','j':'B','k':'C2','o':'C#2','l':'D2'};
    this._kb=e=>{if(e.repeat)return;const n=this._kmap[e.key.toLowerCase()];if(!n)return;e.preventDefault();const noteId=n.endsWith('2')?`${n.slice(0,-1)}${this.octave+1}`:`${n}${this.octave}`;const kobj=this.keys.find(k=>k.id===noteId);if(kobj)this._noteOn(kobj.id,kobj.freq,kobj.el);};
    this._ku=e=>{const n=this._kmap[e.key.toLowerCase()];if(!n)return;const noteId=n.endsWith('2')?`${n.slice(0,-1)}${this.octave+1}`:`${n}${this.octave}`;const kobj=this.keys.find(k=>k.id===noteId);if(kobj)this._noteOff(kobj.id,kobj.el);};
    window.addEventListener('keydown',this._kb);window.addEventListener('keyup',this._ku);
  }
  _initAC(){if(!this.ac){this.ac=new(window.AudioContext||window.webkitAudioContext)();this.masterGain=this.ac.createGain();this.masterGain.gain.value=this.vol;this.masterGain.connect(this.ac.destination);}if(this.ac.state==='suspended')this.ac.resume();}
  _noteOn(id,freq,el){
    this._initAC();if(this.activeKeys.has(id))return;
    const osc=this.ac.createOscillator(),g=this.ac.createGain();
    osc.type=this.wave;osc.frequency.value=freq;
    g.gain.setValueAtTime(0,this.ac.currentTime);g.gain.linearRampToValueAtTime(.5,this.ac.currentTime+.01);
    osc.connect(g);g.connect(this.masterGain);osc.start();
    this.activeKeys.set(id,{osc,g});
    if(el){const isBlack=el.style.width==='24px';el.style.background=isBlack?'#5533aa':'rgba(160,120,255,.8)';}
  }
  _noteOff(id,el){
    const k=this.activeKeys.get(id);if(!k)return;
    k.g.gain.setTargetAtTime(0,this.ac.currentTime,.08);setTimeout(()=>{try{k.osc.stop();}catch(e){}},300);
    this.activeKeys.delete(id);
    if(el){const isBlack=el.style.width==='24px';el.style.background=isBlack?'linear-gradient(180deg,#222,#111)':'linear-gradient(180deg,#f8f8f8,#e8e8e8)';}
  }
  resize(){}
  destroy(){this.activeKeys.forEach((_,id)=>this._noteOff(id));window.removeEventListener('keydown',this._kb);window.removeEventListener('keyup',this._ku);if(this.ac)this.ac.close();}
}
