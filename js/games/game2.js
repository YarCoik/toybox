export class BeatSequencer {
  constructor(c) {
    this.c=c; this.ac=null; this.playing=false; this.bpm=120; this.step=0; this.cols=16; this.timer=null; this.cels=[];
    this.rows = [
      {name:'KICK',  color:'#ff3a7c', type:'kick',  cells:Array(16).fill(false)},
      {name:'SNARE', color:'#ff6b3a', type:'snare', cells:Array(16).fill(false)},
      {name:'HI-HAT',color:'#ffb43a', type:'hat',   cells:Array(16).fill(false)},
      {name:'CLAP',  color:'#c8ff3a', type:'clap',  cells:Array(16).fill(false)},
      {name:'C4',    color:'#3affcb', type:'mar', freq:261.63, cells:Array(16).fill(false)},
      {name:'E4',    color:'#3a8fff', type:'mar', freq:329.63, cells:Array(16).fill(false)},
      {name:'G4',    color:'#7c3aff', type:'mar', freq:392.00, cells:Array(16).fill(false)},
      {name:'B4',    color:'#ff3aff', type:'mar', freq:493.88, cells:Array(16).fill(false)},
    ];
    [[0,4,8,12],[4,12],[0,2,4,6,8,10,12,14],[],[0,6],[2],[4],[8]].forEach((b,ri)=>b.forEach(i=>this.rows[ri].cells[i]=true));
  }

  init() {
    const w=document.createElement('div'); w.className='sq-wrap'; this.c.appendChild(w);
    w.innerHTML = '<div class="sq-t">⬛ BEAT SEQUENCER</div>';
    const ctrl=document.createElement('div'); ctrl.className='sq-c';
    this.pb=document.createElement('button'); this.pb.className='sq-b'; this.pb.textContent='▶ PLAY'; this.pb.onclick=()=>this._toggle(); ctrl.appendChild(this.pb);
    const cb=document.createElement('button'); cb.className='sq-b'; cb.textContent='✕ CLEAR'; cb.onclick=()=>this._clear(); ctrl.appendChild(cb);
    const bl=document.createElement('span'); bl.className='sq-bpm'; bl.textContent='120 BPM';
    const bi=document.createElement('input'); bi.type='range'; bi.min=60; bi.max=200; bi.value=120; bi.style.cssText='width:75px;accent-color:#ff3a7c;cursor:pointer';
    bi.oninput=()=>{ this.bpm=+bi.value; bl.textContent=this.bpm+' BPM'; if(this.playing){this._stopLoop();this._startLoop();} };
    ctrl.appendChild(bi); ctrl.appendChild(bl); w.appendChild(ctrl);
    const grid=document.createElement('div'); grid.style.cssText='display:flex;flex-direction:column;gap:4px';
    this.rows.forEach((row,ri)=>{
      const re=document.createElement('div'); re.className='sq-row';
      const lbl=document.createElement('div'); lbl.className='sq-lbl'; lbl.textContent=row.name; lbl.style.color=row.color; re.appendChild(lbl);
      const rc=[];
      for(let ci=0;ci<this.cols;ci++){
        const cell=document.createElement('div'); cell.className='sq-cell'; cell.style.setProperty('--rc',row.color);
        if(ci>0&&ci%4===0) cell.style.marginLeft='6px';
        if(row.cells[ci]){ cell.style.background=row.color; cell.style.borderColor=row.color; cell.classList.add('on'); }
        cell.onclick=()=>{ row.cells[ci]=!row.cells[ci]; cell.style.background=row.cells[ci]?row.color:''; cell.style.borderColor=row.cells[ci]?row.color:''; cell.classList.toggle('on',row.cells[ci]); };
        re.appendChild(cell); rc.push(cell);
      }
      this.cels.push(rc); grid.appendChild(re);
    });
    w.appendChild(grid);
  }

  _toggle() {
    if(!this.ac) this.ac=new(window.AudioContext||window.webkitAudioContext)();
    if(this.ac.state==='suspended') this.ac.resume();
    this.playing=!this.playing; this.pb.textContent=this.playing?'⏸ PAUSE':'▶ PLAY';
    if(this.playing){this.step=0;this._startLoop();}else this._stopLoop();
  }
  _startLoop(){const iv=(60/this.bpm/4)*1000; this._tick(); this.timer=setInterval(()=>this._tick(),iv);}
  _stopLoop(){clearInterval(this.timer); this.cels.forEach(r=>r.forEach(c=>c.style.outline=''));}
  _tick(){
    const prev=(this.step-1+this.cols)%this.cols;
    this.rows.forEach((row,ri)=>{
      this.cels[ri][prev].style.outline='';
      this.cels[ri][this.step].style.outline='2px solid rgba(255,255,255,.2)';
      if(row.cells[this.step]){const ce=this.cels[ri][this.step]; ce.classList.add('beat'); setTimeout(()=>ce.classList.remove('beat'),120); this._snd(row);}
    });
    this.step=(this.step+1)%this.cols;
  }
  _snd(row){
    const ac=this.ac,t=ac.currentTime;
    if(row.type==='kick'){const o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(this.masterGain||ac.destination);o.frequency.setValueAtTime(180,t);o.frequency.exponentialRampToValueAtTime(30,t+.25);g.gain.setValueAtTime(1,t);g.gain.exponentialRampToValueAtTime(.001,t+.35);o.start(t);o.stop(t+.35);}
    else if(row.type==='snare'){const buf=ac.createBuffer(1,ac.sampleRate*.15,ac.sampleRate),d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;const s=ac.createBufferSource(),g=ac.createGain(),f=ac.createBiquadFilter();f.type='highpass';f.frequency.value=1200;s.buffer=buf;s.connect(f);f.connect(g);g.connect(this.masterGain||ac.destination);g.gain.setValueAtTime(.7,t);g.gain.exponentialRampToValueAtTime(.001,t+.15);s.start(t);s.stop(t+.2);}
    else if(row.type==='hat'){const buf=ac.createBuffer(1,Math.floor(ac.sampleRate*.05),ac.sampleRate),d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;const s=ac.createBufferSource(),g=ac.createGain(),f=ac.createBiquadFilter();f.type='highpass';f.frequency.value=7000;s.buffer=buf;s.connect(f);f.connect(g);g.connect(this.masterGain||ac.destination);g.gain.setValueAtTime(.35,t);g.gain.exponentialRampToValueAtTime(.001,t+.06);s.start(t);s.stop(t+.07);}
    else if(row.type==='clap'){for(let i=0;i<3;i++){const dl=i*.01,buf=ac.createBuffer(1,Math.floor(ac.sampleRate*.08),ac.sampleRate),d=buf.getChannelData(0);for(let j=0;j<d.length;j++)d[j]=Math.random()*2-1;const s=ac.createBufferSource(),g=ac.createGain(),f=ac.createBiquadFilter();f.type='bandpass';f.frequency.value=1200;f.Q.value=.7;s.buffer=buf;s.connect(f);f.connect(g);g.connect(this.masterGain||ac.destination);g.gain.setValueAtTime(.5,t+dl);g.gain.exponentialRampToValueAtTime(.001,t+dl+.1);s.start(t+dl);s.stop(t+dl+.12);}}
    else if(row.type==='mar'){const o=ac.createOscillator(),o2=ac.createOscillator(),g=ac.createGain();o.frequency.value=row.freq;o2.frequency.value=row.freq*2.76;o.connect(g);o2.connect(g);g.connect(this.masterGain||ac.destination);g.gain.setValueAtTime(.55,t);g.gain.exponentialRampToValueAtTime(.001,t+.5);o.start(t);o.stop(t+.6);o2.start(t);o2.stop(t+.2);}
  }
  _clear(){this.rows.forEach((row,ri)=>{row.cells.fill(false);this.cels[ri].forEach(c=>{c.style.background='';c.style.borderColor='';c.classList.remove('on','beat');});});}
  destroy(){this._stopLoop();this.ac?.close();}
}
