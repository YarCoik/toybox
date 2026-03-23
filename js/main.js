import { FluidParticles    } from './games/game1.js';
import { BeatSequencer     } from './games/game2.js';
import { JellyBlob         } from './games/game3.js';
import { EmojiAlchemist    } from './games/game4.js';
import { TypistOrchestra   } from './games/game5.js';
import { MandalaDraw       } from './games/game6.js';
import { Sandpit           } from './games/game7.js';
import { InfiniteZoom      } from './games/game8.js';
import { ShadowPlay        } from './games/game9.js';
import { UselessSwitch     } from './games/game10.js';
import { Win98Simulator    } from './games/game11.js';
import { GravityWells      } from './games/game12.js';
import { LissajousMachine  } from './games/game13.js';
import { BubbleUniverse    } from './games/game14.js';
import { ReactionDiffusion } from './games/game15.js';
import { RainRipples       } from './games/game16.js';
import { ConstellationMaker} from './games/game17.js';
import { PixelCanvas       } from './games/game18.js';
import { AudioScope        } from './games/game19.js';
import { LangtonsAnt       } from './games/game20.js';
import { StringArt         } from './games/game21.js';
import { GameOfLife        } from './games/game22.js';
import { Boids             } from './games/game23.js';
import { Fireworks         } from './games/game24.js';
import { VoronoiDiagram    } from './games/game25.js';
import { LorenzAttractor   } from './games/game26.js';
import { Piano             } from './games/game27.js';
import { Spirograph        } from './games/game28.js';
import { SnakeGame         } from './games/game29.js';
import { PerlinTerrain     } from './games/game30.js';
import { BouncingShapes    } from './games/game31.js';
import { DoublePendulum    } from './games/game32.js';
import { ParticleLife      } from './games/game33.js';
import { MatrixRain        } from './games/game34.js';
import { Breakout          } from './games/game35.js';
import { EtchASketch       } from './games/game36.js';
import { SpinningCube      } from './games/game37.js';
import { FlappyNeon        } from './games/game38.js';
import { ZenCircles        } from './games/game39.js';
import { Theremin          } from './games/game40.js';

export const GAMES = [
  {id:1,  cls:FluidParticles,    title:'Fluid Particles',      desc:'Mouse trails become luminous particle galaxies.',      emoji:'🌀', color:'#7c3aff', tag:'Physics'},
  {id:2,  cls:BeatSequencer,     title:'Beat Sequencer',        desc:'Tap the grid. Make music. Feel the groove.',           emoji:'🥁', color:'#ff3a7c', tag:'Audio'},
  {id:3,  cls:JellyBlob,         title:'Soft Body Jelly',       desc:'Grab, stretch, and fling a spring-physics blob.',      emoji:'🫧', color:'#3affcb', tag:'Physics'},
  {id:4,  cls:EmojiAlchemist,    title:'Emoji Alchemist',       desc:'Combine ingredients. Discover 30+ new creations.',     emoji:'⚗️', color:'#ffb43a', tag:'Puzzle'},
  {id:5,  cls:TypistOrchestra,   title:'Typist Orchestra',      desc:'Every keystroke drops a bouncing musical letter.',     emoji:'🎹', color:'#3a8fff', tag:'Audio'},
  {id:6,  cls:MandalaDraw,       title:'Mandala Drawer',        desc:'Draw with 8-way neon symmetry.',                       emoji:'🌸', color:'#ff6b3a', tag:'Draw'},
  {id:7,  cls:Sandpit,           title:'Sandpit',               desc:'Sand · Water · Lava · Ice · Oil · Plant + more.',     emoji:'⏳', color:'#b43aff', tag:'Simulate'},
  {id:8,  cls:InfiniteZoom,      title:'Infinite Zoom',         desc:'Hold to zoom infinitely into a Mandelbrot fractal.',  emoji:'🔭', color:'#3afff0', tag:'Math'},
  {id:9,  cls:ShadowPlay,        title:'Shadow Play',           desc:'Your cursor is a point light. Shapes cast shadows.',   emoji:'🕯️', color:'#ff3a3a', tag:'Physics'},
  {id:10, cls:UselessSwitch,     title:'The Useless Switch',    desc:'Something will not let you leave it ON.',             emoji:'🔘', color:'#c8ff3a', tag:'Toy'},
  {id:11, cls:Win98Simulator,    title:'Windows 98',            desc:'Full retro OS — Paint, Notepad, Calc, Minesweeper.',  emoji:'🖥️', color:'#008080', tag:'OS'},
  {id:12, cls:GravityWells,      title:'Gravity Wells',         desc:'Click to create black holes. Watch particles orbit.',  emoji:'🕳️', color:'#7c5aff', tag:'Physics'},
  {id:13, cls:LissajousMachine,  title:'Lissajous Machine',     desc:'Tune frequencies to draw mesmerizing math curves.',    emoji:'〰️', color:'#a855f7', tag:'Math'},
  {id:14, cls:BubbleUniverse,    title:'Bubble Universe',       desc:'Pop the floating bubbles before they float away.',     emoji:'🫧', color:'#06b6d4', tag:'Toy'},
  {id:15, cls:ReactionDiffusion, title:'Reaction Diffusion',    desc:'Gray-Scott model — chemistry becomes living art.',     emoji:'🧫', color:'#10b981', tag:'Simulate'},
  {id:16, cls:RainRipples,       title:'Rain Ripples',          desc:'Click to make ripples in a starlit puddle.',           emoji:'🌧️', color:'#3a8fff', tag:'Physics'},
  {id:17, cls:ConstellationMaker,title:'Constellation Maker',   desc:'Connect stars. Name them. Build your own sky.',       emoji:'⭐', color:'#fbbf24', tag:'Draw'},
  {id:18, cls:PixelCanvas,       title:'Pixel Canvas',          desc:'A crisp 48×32 pixel art canvas with full palette.',   emoji:'🎨', color:'#f43f5e', tag:'Draw'},
  {id:19, cls:AudioScope,        title:'Audio Scope',           desc:'Synthesize and visualize beautiful waveforms.',       emoji:'📊', color:'#8b5cf6', tag:'Audio'},
  {id:20, cls:LangtonsAnt,       title:"Langton's Ant",         desc:'Simple rules. Complex emergent behavior. Forever.',   emoji:'🐜', color:'#84cc16', tag:'Simulate'},
  {id:21, cls:StringArt,         title:'String Art',            desc:'Mathematical thread patterns on a circle of pins.',   emoji:'🧵', color:'#ec4899', tag:'Math'},
  {id:22, cls:GameOfLife,        title:"Conway's Game of Life", desc:'Draw cells and watch life evolve by simple rules.',   emoji:'🔬', color:'#22c55e', tag:'Simulate'},
  {id:23, cls:Boids,             title:'Boids Flocking',        desc:'Emergent flocking from separation, alignment, cohesion.',emoji:'🐟', color:'#06b6d4', tag:'Simulate'},
  {id:24, cls:Fireworks,         title:'Fireworks',             desc:'Click to launch rockets. Watch them burst overhead.',  emoji:'🎆', color:'#f97316', tag:'Physics'},
  {id:25, cls:VoronoiDiagram,    title:'Voronoi Diagram',       desc:'Drag seeds to reshape animated Voronoi regions.',     emoji:'🔷', color:'#8b5cf6', tag:'Math'},
  {id:26, cls:LorenzAttractor,   title:'Lorenz Attractor',      desc:'3D deterministic chaos — the butterfly effect.',      emoji:'🦋', color:'#f43f5e', tag:'Math'},
  {id:27, cls:Piano,             title:'Piano',                 desc:'Play a two-octave piano. Keyboard shortcuts work too.',emoji:'🎵', color:'#a78bfa', tag:'Audio'},
  {id:28, cls:Spirograph,        title:'Spirograph',            desc:'Hypotrochoid curves — tune R, r, d for new patterns.', emoji:'🌀', color:'#d946ef', tag:'Math'},
  {id:29, cls:SnakeGame,         title:'Snake',                 desc:'Classic arcade snake. Eat, grow, and survive.',       emoji:'🐍', color:'#4ade80', tag:'Toy'},
  {id:30, cls:PerlinTerrain,     title:'Noise Terrain',         desc:'Scrolling procedural landscape — 4 biome modes.',     emoji:'🏔️', color:'#10b981', tag:'Simulate'},
  {id:31, cls:BouncingShapes,    title:'Bouncing Shapes',       desc:'Physics sandbox — spawn shapes and watch them collide.',emoji:'⚽', color:'#fb923c', tag:'Physics'},
  {id:32, cls:DoublePendulum,    title:'Double Pendulum',       desc:'Chaotic motion — tiny differences create wildly different paths.',emoji:'⏳', color:'#f43f5e', tag:'Physics'},
  {id:33, cls:ParticleLife,      title:'Particle Life',         desc:'Emergent life from attraction and repulsion rules between species.',emoji:'🦠', color:'#22d3ee', tag:'Simulate'},
  {id:34, cls:MatrixRain,        title:'Matrix Rain',           desc:'The iconic digital code waterfall — 5 color modes.',  emoji:'💻', color:'#00ff41', tag:'Toy'},
  {id:35, cls:Breakout,          title:'Breakout',              desc:'Classic brick-breaker — level up, get faster, survive.',emoji:'🧱', color:'#f97316', tag:'Toy'},
  {id:36, cls:EtchASketch,       title:'Etch-a-Sketch',         desc:'The classic red drawing toy — shake to clear.',       emoji:'🎨', color:'#dc2626', tag:'Draw'},
  {id:37, cls:SpinningCube,      title:'3D Shapes',             desc:'Interactive 3D wireframe — drag to rotate, scroll to zoom.',emoji:'🎲', color:'#a78bfa', tag:'Math'},
  {id:38, cls:FlappyNeon,        title:'Flappy Neon',           desc:'Neon flappy bird — tap to flap, dodge the pipes.',    emoji:'🐦', color:'#34d399', tag:'Toy'},
  {id:39, cls:ZenCircles,        title:'Zen Circles',           desc:'Draw freehand circles — scored by how perfect they are.',emoji:'⭕', color:'#e0f2fe', tag:'Toy'},
  {id:40, cls:Theremin,          title:'Theremin',              desc:'Move your hand over the field — X = pitch, Y = volume.',emoji:'🎵', color:'#c084fc', tag:'Audio'},
];
/* ================================================================
   AUDIO ENGINE — Hub ambient music + SFX
================================================================ */
const HubAudio = (() => {
  let ctx = null, masterGain = null, musicGain = null;
  let oscNodes = [], musicPlaying = false, musicBtnEl = null;
  let vol = 0.4;

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain(); masterGain.gain.value = vol;
      masterGain.connect(ctx.destination);
      musicGain = ctx.createGain(); musicGain.gain.value = 0;
      musicGain.connect(masterGain);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /* — Ambient hub music: slow chord arpeggios — */
  const SCALE = [130.81, 146.83, 164.81, 196, 220, 246.94, 261.63, 293.66, 329.63, 392];
  let arpStep = 0, arpTimer = null;
  function playArp() {
    if (!musicPlaying) return;
    const ac = getCtx(), t = ac.currentTime;
    const freq = SCALE[arpStep % SCALE.length];
    arpStep++;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    o.connect(g); g.connect(musicGain);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.18, t + 0.08);
    g.gain.exponentialRampToValueAtTime(0.001, t + 2.2);
    o.start(t); o.stop(t + 2.5);
    // Soft sub-octave layer
    const o2 = ac.createOscillator(), g2 = ac.createGain();
    o2.type = 'triangle'; o2.frequency.value = freq / 2;
    o2.connect(g2); g2.connect(musicGain);
    g2.gain.setValueAtTime(0, t);
    g2.gain.linearRampToValueAtTime(0.06, t + 0.12);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 3);
    o2.start(t); o2.stop(t + 3.5);
    arpTimer = setTimeout(playArp, 320);
  }

  function startMusic() {
    if (musicPlaying) return;
    musicPlaying = true;
    getCtx();
    musicGain.gain.setTargetAtTime(1, ctx.currentTime, 0.5);
    playArp();
    if (musicBtnEl) { musicBtnEl.textContent = '🔇'; musicBtnEl.title = 'Mute hub music'; }
  }
  function stopMusic() {
    musicPlaying = false;
    clearTimeout(arpTimer);
    if (musicGain) musicGain.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
    if (musicBtnEl) { musicBtnEl.textContent = '♪'; musicBtnEl.title = 'Play hub music'; }
  }
  function toggleMusic() { musicPlaying ? stopMusic() : startMusic(); }

  /* — SFX — */
  function sfxLaunch(color) {
    const ac = getCtx(), t = ac.currentTime;
    // Whoosh up: noise burst + pitch sweep
    const buf = ac.createBuffer(1, ac.sampleRate * 0.35, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const s = ac.createBufferSource(), g = ac.createGain(), f = ac.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(2400, t + 0.25);
    f.Q.value = 1.5; s.buffer = buf; s.connect(f); f.connect(g); g.connect(masterGain);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.35, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    s.start(t); s.stop(t + 0.35);
    // Tone chime
    const o = ac.createOscillator(), og = ac.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(440, t); o.frequency.exponentialRampToValueAtTime(880, t + 0.15);
    o.connect(og); og.connect(masterGain);
    og.gain.setValueAtTime(0, t); og.gain.linearRampToValueAtTime(0.12, t + 0.04);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    o.start(t); o.stop(t + 0.35);
  }
  function sfxBack() {
    const ac = getCtx(), t = ac.currentTime;
    // Reverse whoosh: pitch sweep down
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(660, t); o.frequency.exponentialRampToValueAtTime(180, t + 0.22);
    o.connect(g); g.connect(masterGain);
    g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    o.start(t); o.stop(t + 0.25);
    // Noise tail
    const buf = ac.createBuffer(1, ac.sampleRate * 0.2, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (i / d.length) * 0.3;
    const s = ac.createBufferSource(), sg = ac.createGain(), sf = ac.createBiquadFilter();
    sf.type = 'lowpass'; sf.frequency.value = 800; s.buffer = buf; s.connect(sf); sf.connect(sg); sg.connect(masterGain);
    sg.gain.setValueAtTime(0.2, t); sg.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    s.start(t); s.stop(t + 0.22);
  }
  function sfxHover() {
    const ac = getCtx(), t = ac.currentTime;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine'; o.frequency.value = 660;
    o.connect(g); g.connect(masterGain);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.04, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    o.start(t); o.stop(t + 0.1);
  }

  function setMusicBtn(el) { musicBtnEl = el; }
  function setVol(v) { vol = v; if (masterGain) masterGain.gain.setTargetAtTime(v, ctx.currentTime, 0.05); }

  return { startMusic, stopMusic, toggleMusic, sfxLaunch, sfxBack, sfxHover, setMusicBtn, setVol };
})();

const hub     = document.getElementById('hub');
const hg      = document.getElementById('hg');
const ov      = document.getElementById('overlay');
const gc      = document.getElementById('gc');
const bb      = document.getElementById('back-btn');
const tc      = document.getElementById('tc');
const tx      = tc.getContext('2d');
const filterBtns = document.querySelectorAll('.filter-btn');
let APP       = null;
let activeTag = 'All';

/* ---- Animated BG ---- */
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx    = bgCanvas.getContext('2d');
const bgPts    = [];
function initBg(){
  bgCanvas.width=innerWidth; bgCanvas.height=innerHeight; bgPts.length=0;
  for(let i=0;i<80;i++) bgPts.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.2,r:Math.random()*1.5+.4,hue:Math.random()*360});
}
function animateBg(){
  bgCtx.fillStyle='rgba(10,10,15,.15)'; bgCtx.fillRect(0,0,bgCanvas.width,bgCanvas.height);
  bgPts.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0)p.x=bgCanvas.width; if(p.x>bgCanvas.width)p.x=0;
    if(p.y<0)p.y=bgCanvas.height; if(p.y>bgCanvas.height)p.y=0;
    bgCtx.beginPath(); bgCtx.arc(p.x,p.y,p.r,0,Math.PI*2);
    bgCtx.fillStyle=`hsla(${p.hue},70%,60%,.4)`; bgCtx.fill();
  });
  for(let i=0;i<bgPts.length;i++) for(let j=i+1;j<bgPts.length;j++){
    const d=Math.hypot(bgPts[i].x-bgPts[j].x,bgPts[i].y-bgPts[j].y);
    if(d<110){bgCtx.beginPath();bgCtx.moveTo(bgPts[i].x,bgPts[i].y);bgCtx.lineTo(bgPts[j].x,bgPts[j].y);bgCtx.strokeStyle=`rgba(124,58,255,${.05*(1-d/110)})`;bgCtx.lineWidth=.5;bgCtx.stroke();}
  }
  requestAnimationFrame(animateBg);
}
initBg(); animateBg();
window.addEventListener('resize',initBg);

/* ---- Grid ---- */
function buildGrid(filter='All'){
  hg.innerHTML='';
  const list = filter==='All' ? GAMES : GAMES.filter(g=>g.tag===filter);
  const total=document.getElementById('filter-total');
  if(total) total.textContent=list.length;
  list.forEach((g,i)=>{
    const c=document.createElement('div');
    c.className='card'; c.style.setProperty('--c',g.color); c.tabIndex=0;
    c.innerHTML=`<div class="card-glow"></div><div class="card-tag">${g.tag}</div><div class="card-em">${g.emoji}</div><div class="card-body"><div class="card-n">${String(g.id).padStart(2,'0')} / 040</div><div class="card-t">${g.title}</div><div class="card-d">${g.desc}</div></div>`;
    c.addEventListener('mousemove',e=>{
      const r=c.getBoundingClientRect(),dx=(e.clientX-r.left-r.width/2)/(r.width/2),dy=(e.clientY-r.top-r.height/2)/(r.height/2);
      c.style.transform=`translateY(-4px) scale(1.015) perspective(600px) rotateX(${-dy*7}deg) rotateY(${dx*7}deg)`;
    });
    c.addEventListener('mouseleave',()=>c.style.transform='');
    c.addEventListener('mouseenter',()=>HubAudio.sfxHover());
    c.addEventListener('click',()=>launch(g,c));
    c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')launch(g,c);});
    c.style.opacity='0'; c.style.transform='translateY(22px)';
    setTimeout(()=>{c.style.transition='opacity .45s ease,transform .45s cubic-bezier(.16,1,.3,1)';c.style.opacity='1';c.style.transform='none';},20+i*35);
    hg.appendChild(c);
  });
}

/* ---- Filters ---- */
filterBtns.forEach(btn=>{
  btn.addEventListener('click',()=>{
    activeTag=btn.dataset.tag;
    filterBtns.forEach(b=>b.classList.toggle('active',b===btn));
    buildGrid(activeTag);
  });
});

/* ---- Transitions ---- */
function rippleIn(card,color){
  return new Promise(res=>{
    tc.width=innerWidth; tc.height=innerHeight;
    const r=card.getBoundingClientRect(),ox=r.left+r.width/2,oy=r.top+r.height/2;
    const maxR=Math.hypot(Math.max(ox,innerWidth-ox),Math.max(oy,innerHeight-oy))*1.05;
    tc.style.opacity='1'; let s=null;
    const f=ts=>{if(!s)s=ts;const t=Math.min((ts-s)/480,1),e=t===1?1:1-Math.pow(2,-10*t);tx.clearRect(0,0,tc.width,tc.height);tx.beginPath();tx.arc(ox,oy,e*maxR,0,Math.PI*2);tx.fillStyle=color+'ee';tx.fill();t<1?requestAnimationFrame(f):res();};
    requestAnimationFrame(f);
  });
}
function rippleOut(){
  return new Promise(res=>{
    let s=null;
    const f=ts=>{if(!s)s=ts;const t=Math.min((ts-s)/350,1);tc.style.opacity=String(1-t);t<1?requestAnimationFrame(f):(tc.style.opacity='0',res());};
    requestAnimationFrame(f);
  });
}
async function launch(game,card){
  if(APP)return;
  HubAudio.sfxLaunch(game.color);
  HubAudio.stopMusic();
  await rippleIn(card,game.color);
  hub.classList.add('out'); ov.classList.add('show'); gc.innerHTML='';
  APP=new game.cls(gc); APP.init();
  await rippleOut();
}
bb.addEventListener('click',async()=>{
  if(!APP)return;
  HubAudio.sfxBack();
  tc.width=innerWidth; tc.height=innerHeight; tc.style.opacity='1';
  tx.fillStyle='#0a0a0f'; tx.fillRect(0,0,tc.width,tc.height);
  await new Promise(r=>setTimeout(r,20));
  APP.destroy?.(); APP=null; gc.innerHTML='';
  ov.classList.remove('show'); hub.classList.remove('out');
  await rippleOut();
  if (musicBtn.textContent === '🔇') HubAudio.startMusic();
});
window.addEventListener('resize',()=>APP?.resize?.());
buildGrid();

/* Music toggle button */
const musicBtn = document.createElement('button');
musicBtn.textContent = '♪';
musicBtn.title = 'Play hub music';
musicBtn.style.cssText = 'position:fixed;bottom:1.2rem;right:1.2rem;z-index:50;width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.5);font-size:1.1rem;cursor:pointer;transition:background .2s,color .2s;display:flex;align-items:center;justify-content:center';
musicBtn.onmouseenter=()=>musicBtn.style.background='rgba(124,58,255,.2)';
musicBtn.onmouseleave=()=>musicBtn.style.background='rgba(255,255,255,.07)';
musicBtn.onclick=()=>HubAudio.toggleMusic();
HubAudio.setMusicBtn(musicBtn);
document.body.appendChild(musicBtn);

/* Volume control for music */
const volBtn = document.createElement('input');
volBtn.type='range'; volBtn.min=0; volBtn.max=1; volBtn.step=.05; volBtn.value=0.4;
volBtn.style.cssText='position:fixed;bottom:1.35rem;right:4rem;z-index:50;width:70px;accent-color:#7c3aff;opacity:.4;transition:opacity .2s;cursor:pointer';
volBtn.onmouseenter=()=>volBtn.style.opacity='1';
volBtn.onmouseleave=()=>volBtn.style.opacity='.4';
volBtn.oninput=()=>HubAudio.setVol(+volBtn.value);
document.body.appendChild(volBtn);
