export class Win98Simulator {
  constructor(c){this.c=c;this.wins=[];this.zc=10;this.ti={};this.clkT=null;this._ci=null;this.smOpen=false;this.ctxMenuEl=null;}
  init(){this._buildDesk();this._startClk();['welcome','clock','paint'].forEach((id,i)=>setTimeout(()=>this.openWin(id),300+i*200));}

  _buildDesk(){
    this.desk=document.createElement('div');this.desk.className='w98';this.c.appendChild(this.desk);
    // Wallpaper tiled pattern
    this.desk.style.cssText='position:absolute;inset:0;background-color:#008080;background-image:repeating-linear-gradient(45deg,rgba(0,0,0,.03) 0px,rgba(0,0,0,.03) 1px,transparent 1px,transparent 8px);font-family:"MS Sans Serif",Arial,sans-serif;font-size:11px;overflow:hidden;cursor:default;user-select:none';
    // Desktop icons
    const icons=[{id:'welcome',em:'📄',lbl:'Welcome.txt',x:16,y:14},{id:'paint',em:'🎨',lbl:'MS Paint',x:16,y:100},{id:'clock',em:'🕐',lbl:'Clock',x:16,y:186},{id:'calc',em:'🧮',lbl:'Calculator',x:16,y:272},{id:'notepad',em:'📝',lbl:'Notepad',x:16,y:358},{id:'mine',em:'💣',lbl:'Minesweeper',x:16,y:444},{id:'ie',em:'🌐',lbl:'Internet Explorer',x:16,y:530}];
    icons.forEach(ic=>{const el=document.createElement('div');el.className='w-icon';el.style.cssText=`left:${ic.x}px;top:${ic.y}px`;el.innerHTML=`<em>${ic.em}</em><div>${ic.lbl}</div>`;el.ondblclick=()=>this.openWin(ic.id);this.desk.appendChild(el);});
    // Taskbar
    this.tbar=document.createElement('div');this.tbar.className='w-tbar';
    const sb=document.createElement('button');sb.className='w-start';sb.innerHTML='<span style="font-size:14px">🪟</span> <b>Start</b>';sb.onclick=e=>{e.stopPropagation();this._toggleSM();};this.tbar.appendChild(sb);this.sb=sb;
    // Quick launch
    const ql=document.createElement('div');ql.style.cssText='display:flex;align-items:center;border-right:1px solid #808080;padding:0 4px;gap:2px;margin-right:4px';[['🎨','paint'],['📝','notepad'],['🧮','calc']].forEach(([em,id])=>{const b=document.createElement('div');b.style.cssText='width:22px;height:22px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:13px;border-radius:2px';b.textContent=em;b.title=id;b.onclick=()=>this.openWin(id);b.onmouseenter=()=>b.style.background='rgba(255,255,255,.2)';b.onmouseleave=()=>b.style.background='';ql.appendChild(b);});this.tbar.appendChild(ql);
    this.tarea=document.createElement('div');this.tarea.style.cssText='display:flex;gap:2px;flex:1;overflow:hidden';this.tbar.appendChild(this.tarea);
    // System tray
    const tray=document.createElement('div');tray.style.cssText='display:flex;align-items:center;gap:4px;border-top:1px solid #808080;border-left:1px solid #808080;padding:2px 8px;background:#c0c0c0;flex-shrink:0';
    ['🔊','📶','🔋'].forEach(icon=>{const s=document.createElement('span');s.style.cssText='font-size:12px;cursor:pointer';s.textContent=icon;tray.appendChild(s);});
    this.tclk=document.createElement('div');this.tclk.style.cssText='font-size:11px;font-family:"MS Sans Serif",Arial,sans-serif;padding-left:6px;cursor:default';this.tclk.textContent='00:00';this.tclk.title='Click for date';tray.appendChild(this.tclk);this.tbar.appendChild(tray);
    this.desk.appendChild(this.tbar);
    // Start menu
    this.sm=this._buildStartMenu();this.desk.appendChild(this.sm);
    // Desktop right-click
    this.desk.addEventListener('contextmenu',e=>{e.preventDefault();if(e.target===this.desk||e.target.className==='w98')this._showCtxMenu(e.clientX,e.clientY);});
    this.desk.addEventListener('click',()=>{this._closeSM();this._hideCtxMenu();});
  }

  _buildStartMenu(){
    const sm=document.createElement('div');sm.className='w-sm';
    sm.innerHTML=`<div class="w-smb"><span style="color:#fff8;font-size:11px;letter-spacing:1px">Windows</span><br/>98</div>
    <div class="w-smi">
      <div class="w-smit" data-a="welcome">📄 Welcome</div>
      <div class="w-smit" data-a="paint">🎨 MS Paint</div>
      <div class="w-smit" data-a="notepad">📝 Notepad</div>
      <div class="w-smit" data-a="calc">🧮 Calculator</div>
      <div class="w-smit" data-a="clock">🕐 Clock</div>
      <div class="w-smit" data-a="mine">💣 Minesweeper</div>
      <div class="w-smit" data-a="ie">🌐 Internet Explorer</div>
      <div class="w-smdiv"></div>
      <div class="w-smit" data-a="closeall">🗑 Close All Windows</div>
      <div class="w-smdiv"></div>
      <div class="w-smit" style="color:#c00" data-a="shutdown">⏻ Shut Down...</div>
    </div>`;
    sm.querySelectorAll('.w-smit').forEach(it=>it.onclick=()=>{const a=it.dataset.a;this._toggleSM();if(a==='closeall')[...this.wins].forEach(w=>this._closeWin(w.id));else if(a==='shutdown')this._shutdown();else this.openWin(a);});
    return sm;
  }

  _shutdown(){
    const d=document.createElement('div');d.style.cssText='position:absolute;inset:0;background:#000;display:flex;align-items:center;justify-content:center;z-index:99999;flex-direction:column;gap:1rem';d.innerHTML='<div style="color:#fff;font-family:MS Sans Serif,Arial,sans-serif;font-size:14px;text-align:center">It is now safe to turn off<br/>your computer.<br/><br/><span style="font-size:40px">🖥️</span></div><button onclick="this.parentElement.remove()" style="padding:.4rem 1rem;cursor:pointer;font-size:11px">Cancel</button>';
    this.desk.appendChild(d);
  }

  _showCtxMenu(x,y){
    this._hideCtxMenu();const cm=document.createElement('div');cm.style.cssText=`position:absolute;left:${x}px;top:${y}px;background:#c0c0c0;border-top:1px solid #fff;border-left:1px solid #fff;border-bottom:1px solid #808080;border-right:1px solid #808080;z-index:9999;min-width:160px;padding:2px 0`;
    [['Arrange Icons',''],['Refresh',''],['─','div'],['New Folder','📁'],['Properties','']].forEach(([lbl,icon])=>{if(lbl==='─'){const d=document.createElement('div');d.style.cssText='height:1px;background:#808080;margin:2px 4px';cm.appendChild(d);return;}const it=document.createElement('div');it.style.cssText='padding:4px 20px;font-size:11px;cursor:pointer;font-family:"MS Sans Serif",Arial,sans-serif';it.textContent=(icon?icon+' ':'')+lbl;it.onmouseenter=()=>it.style.background='#000080',it.style.color='#fff';it.onmouseleave=()=>{it.style.background='';it.style.color='';};it.onclick=()=>this._hideCtxMenu();cm.appendChild(it);});
    this.ctxMenuEl=cm;this.desk.appendChild(cm);
  }
  _hideCtxMenu(){if(this.ctxMenuEl){this.ctxMenuEl.remove();this.ctxMenuEl=null;}}
  _toggleSM(){this.smOpen=!this.smOpen;this.sm.classList.toggle('on',this.smOpen);this.sb.classList.toggle('on',this.smOpen);}
  _closeSM(){this.smOpen=false;this.sm.classList.remove('on');this.sb.classList.remove('on');}

  openWin(id){
    const ex=this.wins.find(w=>w.id===id);if(ex){ex.min?this._restore(id):this._focus(id);return;}
    const sp=this._spec(id);const win=document.createElement('div');win.className='w-win';
    win.style.cssText=`left:${sp.x}px;top:${sp.y}px;width:${sp.w}px;height:${sp.h}px;z-index:${++this.zc}`;
    const tb=document.createElement('div');tb.className='w-tb';
    tb.innerHTML=`<span style="font-size:13px">${sp.icon}</span><span class="w-tbt">${sp.title}</span><div class="w-tbb"><div class="w-btn mn" title="Minimize">_</div><div class="w-btn mx" title="Maximize">□</div><div class="w-btn xb" title="Close">✕</div></div>`;
    win.appendChild(tb);
    if(sp.menu){const mb=document.createElement('div');mb.className='w-mb';sp.menu.forEach(m=>{const el=document.createElement('div');el.className='w-mi';el.textContent=m;mb.appendChild(el);});win.appendChild(mb);}
    const cl=document.createElement('div');cl.className='w-cl';win.appendChild(cl);sp.build(cl);
    this.desk.insertBefore(win,this.tbar);
    const wd={id,el:win,title:sp.title,icon:sp.icon,min:false,max:false,saved:null};this.wins.push(wd);
    const tbtn=document.createElement('button');tbtn.className='w-tbtn on';tbtn.innerHTML=`${sp.icon} ${sp.title}`;
    tbtn.onclick=()=>{if(wd.min)this._restore(id);else if(win.style.zIndex==this.zc)this._minimize(id);else this._focus(id);};
    this.tarea.appendChild(tbtn);this.ti[id]=tbtn;
    this._makeDrag(tb,win,wd);
    tb.querySelector('.mn').onclick=e=>{e.stopPropagation();this._minimize(id);};
    tb.querySelector('.mx').onclick=e=>{e.stopPropagation();this._maxToggle(id);};
    tb.querySelector('.xb').onclick=e=>{e.stopPropagation();this._closeWin(id);};
    win.addEventListener('mousedown',()=>this._focus(id),true);
    win.style.transform='scale(.85)';win.style.opacity='0';win.style.transition='transform .18s cubic-bezier(.34,1.56,.64,1),opacity .15s ease';
    requestAnimationFrame(()=>{win.style.transform='scale(1)';win.style.opacity='1';});
  }

  _spec(id){
    const dW=this.desk.offsetWidth||800,dH=this.desk.offsetHeight||600;
    const specs={
      welcome:{title:'Welcome to Windows 98',icon:'📄',x:Math.floor(dW*.18),y:50,w:380,h:240,menu:['File','Edit','View','Help'],
        build:cl=>{cl.style.cssText='padding:14px;font-size:12px;line-height:1.8;background:#fff;';cl.innerHTML='<b>Welcome to Windows 98!</b><br><br>This simulation runs entirely in your browser.<br><br><b>Available applications:</b><ul style="margin-left:18px;line-height:2"><li>🎨 MS Paint — draw and color</li><li>📝 Notepad — write text</li><li>🧮 Calculator — do math</li><li>🕐 Clock — see the time</li><li>💣 Minesweeper — classic game</li><li>🌐 Internet Explorer — browse the web</li></ul><br><span style="color:#666;font-size:10px">Double-click desktop icons · Use Start menu · Right-click desktop</span>';}},
      clock:{title:'Clock',icon:'🕐',x:Math.floor(dW*.65),y:60,w:220,h:170,menu:null,
        build:cl=>{cl.style.background='#c0c0c0';const f=document.createElement('div');f.className='clk-face';const dg=document.createElement('div');dg.className='clk-d';const dt=document.createElement('div');dt.className='clk-dt';f.appendChild(dg);f.appendChild(dt);cl.appendChild(f);const tick=()=>{const n=new Date();dg.textContent=n.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'});dt.textContent=n.toLocaleDateString([],{weekday:'long',month:'long',day:'numeric',year:'numeric'});};tick();this._ci=setInterval(tick,1000);}},
      paint:{title:'Untitled - Paint',icon:'🎨',x:55,y:Math.floor(dH*.06),w:580,h:430,menu:['File','Edit','View','Image','Colors','Help'],
        build:cl=>this._buildPaint(cl)},
      notepad:{title:'Untitled - Notepad',icon:'📝',x:Math.floor(dW*.3),y:80,w:420,h:320,menu:['File','Edit','Format','View','Help'],
        build:cl=>this._buildNotepad(cl)},
      calc:{title:'Calculator',icon:'🧮',x:Math.floor(dW*.6),y:120,w:220,h:280,menu:['View','Help'],
        build:cl=>this._buildCalc(cl)},
      mine:{title:'Minesweeper',icon:'💣',x:Math.floor(dW*.35),y:60,w:280,h:340,menu:['Game','Help'],
        build:cl=>this._buildMine(cl)},
      ie:{title:'Microsoft Internet Explorer',icon:'🌐',x:Math.floor(dW*.1),y:30,w:580,h:400,menu:['File','Edit','View','Favorites','Tools','Help'],
        build:cl=>this._buildIE(cl)},
    };
    return specs[id]||specs.welcome;
  }

  _buildNotepad(cl){
    cl.style.cssText='display:flex;flex-direction:column;height:100%';
    const ta=document.createElement('textarea');ta.style.cssText='flex:1;border:none;outline:none;resize:none;font-family:"Courier New",monospace;font-size:12px;padding:4px;background:#fff;line-height:1.5';ta.value='Notepad\n\nStart typing here...\n\nThis is a fully functional text editor.\nUse it however you like!';cl.appendChild(ta);
    const sb=document.createElement('div');sb.style.cssText='border-top:1px solid #808080;padding:2px 4px;font-size:11px;color:#444;display:flex;gap:8px';
    const charCount=document.createElement('span');charCount.textContent='Chars: '+(ta.value.length);ta.oninput=()=>charCount.textContent='Chars: '+ta.value.length;sb.appendChild(charCount);const lineCount=document.createElement('span');lineCount.textContent='Ln 1, Col 1';sb.appendChild(lineCount);cl.appendChild(sb);
  }

  _buildCalc(cl){
    cl.style.cssText='background:#c0c0c0;padding:8px;display:flex;flex-direction:column;gap:4px;height:100%';
    let expr='',result='0';
    const display=document.createElement('div');display.style.cssText='background:#d4edcc;border-top:2px solid #808080;border-left:2px solid #808080;border-bottom:2px solid #fff;border-right:2px solid #fff;padding:4px 8px;font-family:"Courier New",monospace;font-size:1.4rem;text-align:right;min-height:36px;word-break:break-all';display.textContent='0';cl.appendChild(display);
    const grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat(4,1fr);gap:4px;flex:1';
    const btns=[['C','op'],['±','op'],['%','op'],['÷','op'],['7','n'],['8','n'],['9','n'],['×','op'],['4','n'],['5','n'],['6','n'],['−','op'],['1','n'],['2','n'],['3','n'],['+','op'],['0','wide'],['.','.'],['=','eq']];
    btns.forEach(([lbl,type])=>{const b=document.createElement('button');const isOp=type==='op'||type==='eq';b.style.cssText=`padding:0;height:36px;background:${isOp?'#d4c4a0':'#c0c0c0'};border-top:2px solid #fff;border-left:2px solid #fff;border-bottom:2px solid #808080;border-right:2px solid #808080;font-size:13px;cursor:pointer;font-family:"MS Sans Serif",Arial,sans-serif;${type==='wide'?'grid-column:span 2':''}`;b.textContent=lbl;
      b.onmousedown=()=>{b.style.borderTop='2px solid #808080';b.style.borderLeft='2px solid #808080';b.style.borderBottom='2px solid #fff';b.style.borderRight='2px solid #fff';};
      b.onmouseup=()=>{b.style.borderTop='2px solid #fff';b.style.borderLeft='2px solid #fff';b.style.borderBottom='2px solid #808080';b.style.borderRight='2px solid #808080';};
      b.onclick=()=>{
        if(lbl==='C'){expr='';result='0';}
        else if(lbl==='='){try{const r=Function('"use strict";return ('+expr.replace('×','*').replace('÷','/').replace('−','-')+')')();result=String(parseFloat(r.toFixed(10)));expr=result;}catch{result='Error';expr='';}}
        else if(lbl==='±'){if(expr){expr='(-('+expr+'))';try{result=String(Function('"use strict";return ('+expr.replace('×','*').replace('÷','/').replace('−','-')+')')());} catch{}}  }
        else if(lbl==='%'){try{result=String(parseFloat(expr)*0.01);expr=result;}catch{}}
        else{expr+=lbl;}
        display.textContent=result!=='0'||lbl==='='?result:(expr||'0');
      };
      grid.appendChild(b);});
    cl.appendChild(grid);
  }

  _buildMine(cl){
    cl.style.cssText='background:#c0c0c0;padding:8px;display:flex;flex-direction:column;gap:6px';
    const ROWS=9,COLS=9,MINES=10;let board=[],revealed=[],flagged=[],gameOver=false,firstClick=true;
    const init=()=>{board=Array.from({length:ROWS},()=>Array(COLS).fill(0));revealed=Array.from({length:ROWS},()=>Array(COLS).fill(false));flagged=Array.from({length:ROWS},()=>Array(COLS).fill(false));gameOver=false;firstClick=true;statusEl.textContent='💣 10';render();};
    const plantMines=(er,ec)=>{let placed=0;while(placed<MINES){const r=Math.floor(Math.random()*ROWS),c=Math.floor(Math.random()*COLS);if(board[r][c]===-1||(Math.abs(r-er)<=1&&Math.abs(c-ec)<=1))continue;board[r][c]=-1;placed++;}for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){if(board[r][c]===-1)continue;let cnt=0;for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){const nr=r+dr,nc=c+dc;if(nr>=0&&nr<ROWS&&nc>=0&&nc<COLS&&board[nr][nc]===-1)cnt++;}board[r][c]=cnt;}};
    const flood=(r,c)=>{if(r<0||r>=ROWS||c<0||c>=COLS||revealed[r][c]||flagged[r][c])return;revealed[r][c]=true;if(board[r][c]===0)for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++)flood(r+dr,c+dc);};
    const statusEl=document.createElement('div');statusEl.style.cssText='display:flex;justify-content:space-between;align-items:center;padding:4px;background:#c0c0c0;border-top:2px solid #fff;border-left:2px solid #fff;border-bottom:2px solid #808080;border-right:2px solid #808080;font-size:12px;font-family:"Courier New",monospace;font-weight:bold';
    const resetBtn=document.createElement('button');resetBtn.style.cssText='padding:2px 8px;cursor:pointer;font-size:14px;background:#c0c0c0;border-top:2px solid #fff;border-left:2px solid #fff;border-bottom:2px solid #808080;border-right:2px solid #808080';resetBtn.textContent='🙂';resetBtn.onclick=()=>init();
    statusEl.appendChild(document.createTextNode('💣 10'));statusEl.appendChild(resetBtn);statusEl.appendChild(document.createTextNode('000'));cl.appendChild(statusEl);
    const grid=document.createElement('div');grid.style.cssText=`display:grid;grid-template-columns:repeat(${COLS},1fr);gap:2px;background:#808080;padding:2px;border-top:2px solid #808080;border-left:2px solid #808080;border-bottom:2px solid #fff;border-right:2px solid #fff`;
    const cells=[];const colors=['','#00f','#080','#f00','#808','#800','#088','#000','#888'];
    const render=()=>{cells.forEach((cell,idx)=>{const r=Math.floor(idx/COLS),c=idx%COLS;if(revealed[r][c]){cell.style.cssText=`display:flex;align-items:center;justify-content:center;background:#c0c0c0;border:1px solid #999;font-size:12px;font-weight:bold;height:22px;cursor:default;color:${colors[board[r][c]]||'#000'}`;cell.textContent=board[r][c]>0?board[r][c]:(board[r][c]===-1?'💥':'');}else{cell.style.cssText='display:flex;align-items:center;justify-content:center;background:#c0c0c0;border-top:2px solid #fff;border-left:2px solid #fff;border-bottom:2px solid #808080;border-right:2px solid #808080;height:22px;cursor:pointer;font-size:11px';cell.textContent=flagged[r][c]?'🚩':'';}});};
    for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){const cell=document.createElement('div');const ri=r,ci=c;cell.onclick=()=>{if(gameOver||flagged[ri][ci])return;if(firstClick){firstClick=false;plantMines(ri,ci);}if(board[ri][ci]===-1){revealed[ri][ci]=true;gameOver=true;resetBtn.textContent='😵';render();return;}flood(ri,ci);const won=revealed.flat().filter(Boolean).length===ROWS*COLS-MINES;if(won){gameOver=true;resetBtn.textContent='😎';}render();};cell.oncontextmenu=e=>{e.preventDefault();if(gameOver||revealed[ri][ci])return;flagged[ri][ci]=!flagged[ri][ci];render();};cells.push(cell);grid.appendChild(cell);}
    cl.appendChild(grid);init();
  }

  _buildIE(cl){
    cl.style.cssText='display:flex;flex-direction:column;height:100%;background:#fff';
    const urlBar=document.createElement('div');urlBar.style.cssText='display:flex;align-items:center;gap:4px;padding:3px 4px;background:#c0c0c0;border-bottom:1px solid #808080;flex-shrink:0';
    const backBtn=document.createElement('button');backBtn.style.cssText='padding:2px 6px;background:#c0c0c0;border-top:2px solid #fff;border-left:2px solid #fff;border-bottom:2px solid #808080;border-right:2px solid #808080;cursor:pointer;font-size:10px';backBtn.textContent='◀';
    const fwdBtn=document.createElement('button');fwdBtn.style.cssText=backBtn.style.cssText;fwdBtn.textContent='▶';
    const urlInput=document.createElement('input');urlInput.style.cssText='flex:1;border-top:2px solid #808080;border-left:2px solid #808080;border-bottom:2px solid #fff;border-right:2px solid #fff;padding:2px 4px;font-size:11px;background:#fff;outline:none';urlInput.value='http://www.microsoft.com/windows98';
    const goBtn=document.createElement('button');goBtn.style.cssText=backBtn.style.cssText;goBtn.textContent='Go';
    urlBar.appendChild(backBtn);urlBar.appendChild(fwdBtn);urlBar.appendChild(urlInput);urlBar.appendChild(goBtn);cl.appendChild(urlBar);
    const content=document.createElement('div');content.style.cssText='flex:1;overflow:auto;padding:16px;font-family:Times New Roman,serif;font-size:13px;line-height:1.6;background:#fff';
    content.innerHTML=`<div style="background:#003399;color:#fff;padding:12px;margin:-16px -16px 16px;font-family:Arial,sans-serif"><b>🌐 Microsoft Internet Explorer 5.0</b></div>
    <center><img src="" style="display:none"><h2 style="color:#003399;font-size:1.4rem;margin-bottom:.5rem">🪟 Microsoft Windows 98</h2><p style="color:#666;font-size:12px">The operating system for the new millennium</p></center>
    <hr style="border:1px solid #ccc;margin:12px 0"/>
    <table width="100%" cellpadding="4"><tr><td valign="top" width="30%"><b>💻 Products</b><br><a href="#" style="color:#00c">Windows 98</a><br><a href="#" style="color:#00c">Office 97</a><br><a href="#" style="color:#00c">Internet Explorer</a><br><br><b>🎮 Gaming Zone</b><br><a href="#" style="color:#00c">Hearts</a><br><a href="#" style="color:#00c">Solitaire</a></td>
    <td valign="top"><b>📰 Latest News</b><br>Y2K is coming! Is your computer ready?<br><br>Windows 98 Second Edition released!<br><br>Internet usage reaches 100 million users worldwide.<br><br><b>⚡ Did You Know?</b><br>Windows 98 introduced USB support, making it easy to connect peripherals without restarting.</td></tr></table>
    <hr style="border:1px solid #ccc;margin:12px 0"/>
    <center style="font-size:11px;color:#888">© 1998 Microsoft Corporation. All rights reserved.</center>`;
    cl.appendChild(content);
    goBtn.onclick=urlInput.onkeydown=e=>{if(e.type==='click'||e.key==='Enter'){const url=urlInput.value.toLowerCase();content.querySelector('h2').textContent=`🌐 Navigating to: ${urlInput.value}`;setTimeout(()=>{content.querySelector('h2').textContent='⚠️ This page cannot be displayed';content.querySelector('h2').nextElementSibling.textContent='The Internet connection may be unavailable, or the page does not exist.';},800);}};
  }

  _buildPaint(cl){
    const wrap=document.createElement('div');wrap.className='pt-wrap';
    const tb=document.createElement('div');tb.className='pt-tb';
    const tools=[['pencil','✏'],['brush','🖌'],['fill','🪣'],['eraser','◻'],['rect','▭'],['circle','◯'],['line','╱'],['text','T']];
    let ct='pencil',cc='#000000',lw=3,drawing=false,lx=0,ly=0,sx=0,sy=0,snap=null;const tbtns={};
    tools.forEach(([id,em])=>{const b=document.createElement('div');b.className='pt-btn';b.textContent=em;b.title=id;if(id==='pencil')b.classList.add('sel');b.onclick=()=>{ct=id;Object.values(tbtns).forEach(x=>x.classList.remove('sel'));b.classList.add('sel');};tb.appendChild(b);tbtns[id]=b;});
    const sep=document.createElement('div');sep.style.cssText='width:1px;height:20px;background:#808080;margin:0 4px';tb.appendChild(sep);
    const szl=document.createElement('span');szl.style.cssText='font-size:10px;color:#444';szl.textContent='Size:';tb.appendChild(szl);
    const sz=document.createElement('input');sz.type='range';sz.min=1;sz.max=28;sz.value=3;sz.style.cssText='width:55px;accent-color:#000080;cursor:pointer';sz.oninput=()=>lw=+sz.value;tb.appendChild(sz);
    // Zoom
    const zl=document.createElement('span');zl.style.cssText='font-size:10px;color:#444;margin-left:4px';zl.textContent='1×';
    const zs=document.createElement('input');zs.type='range';zs.min=1;zs.max=4;zs.value=1;zs.style.cssText='width:40px;accent-color:#000080;cursor:pointer';zs.oninput=()=>{const z=+zs.value;zl.textContent=z+'×';pc.style.width=(530*z)+'px';pc.style.height=(260*z)+'px';};tb.appendChild(zl);tb.appendChild(zs);
    wrap.appendChild(tb);
    const cBar=document.createElement('div');cBar.style.cssText='background:#c0c0c0;border-bottom:1px solid #808080;padding:2px 4px;display:flex;gap:3px;align-items:center;flex-wrap:wrap;flex-shrink:0';
    const curColor=document.createElement('div');curColor.style.cssText='width:28px;height:22px;border:2px inset #808080;background:#000;flex-shrink:0';cBar.appendChild(curColor);
    ['#000000','#808080','#800000','#ff0000','#ff8000','#ffff00','#008000','#00ff00','#008080','#00ffff','#000080','#0000ff','#800080','#ff00ff','#ffffff','#c0c0c0','#804000','#ff8080','#ffff80','#80ff80','#804080','#00ff80','#8000ff','#ff4040'].forEach(col=>{const s=document.createElement('div');s.className='pt-cs';s.style.background=col;s.onclick=()=>{cc=col;curColor.style.background=col;};cBar.appendChild(s);});
    wrap.appendChild(cBar);
    const cw=document.createElement('div');cw.className='pt-cw';
    const pc=document.createElement('canvas');pc.className='pt-cv';pc.width=530;pc.height=260;const pctx=pc.getContext('2d');pctx.fillStyle='#fff';pctx.fillRect(0,0,530,260);
    const gp=e=>{const r=pc.getBoundingClientRect(),s=e.touches?e.touches[0]:e;return{x:(s.clientX-r.left)*(pc.width/r.width)|0,y:(s.clientY-r.top)*(pc.height/r.height)|0};};
    pc.onmousedown=e=>{drawing=true;const p=gp(e);lx=sx=p.x;ly=sy=p.y;if(ct==='fill'){this._fill(pctx,p.x,p.y,cc);drawing=false;return;}if(ct==='text'){const txt=prompt('Enter text:','Hello');if(txt){pctx.fillStyle=cc;pctx.font=`${lw*4+10}px Arial`;pctx.fillText(txt,p.x,p.y);}drawing=false;return;}snap=pctx.getImageData(0,0,pc.width,pc.height);};
    pc.onmousemove=e=>{if(!drawing)return;const p=gp(e);pctx.lineWidth=lw;pctx.lineCap='round';pctx.lineJoin='round';pctx.strokeStyle=ct==='eraser'?'#fff':cc;if(ct==='pencil'||ct==='brush'||ct==='eraser'){pctx.beginPath();pctx.moveTo(lx,ly);pctx.lineTo(p.x,p.y);pctx.stroke();lx=p.x;ly=p.y;}else if(ct==='rect'||ct==='circle'||ct==='line'){pctx.putImageData(snap,0,0);pctx.beginPath();if(ct==='rect')pctx.strokeRect(sx,sy,p.x-sx,p.y-sy);else if(ct==='circle'){const rx=(p.x-sx)/2,ry=(p.y-sy)/2;pctx.ellipse(sx+rx,sy+ry,Math.abs(rx),Math.abs(ry),0,0,Math.PI*2);pctx.stroke();}else{pctx.moveTo(sx,sy);pctx.lineTo(p.x,p.y);pctx.stroke();}}};
    pc.onmouseup=pc.onmouseleave=()=>drawing=false;
    cw.appendChild(pc);wrap.appendChild(cw);cl.appendChild(wrap);
    // Statusbar
    const sb=document.createElement('div');sb.style.cssText='border-top:1px solid #808080;padding:2px 6px;font-size:10px;color:#444;display:flex;gap:8px;flex-shrink:0;background:#c0c0c0';sb.innerHTML='<span>530×260px</span><span>|</span><span>For Help, click Help Topics on the Help Menu.</span>';cl.appendChild(sb);
  }

  _fill(ctx,sx,sy,hex){const W=ctx.canvas.width,H=ctx.canvas.height,img=ctx.getImageData(0,0,W,H),d=img.data;const idx=(x,y)=>(y*W+x)*4,si=idx(sx,sy),tR=d[si],tG=d[si+1],tB=d[si+2],tA=d[si+3];const fr=parseInt(hex.slice(1,3),16),fg=parseInt(hex.slice(3,5),16),fb=parseInt(hex.slice(5,7),16);if(tR===fr&&tG===fg&&tB===fb)return;const match=i=>d[i]===tR&&d[i+1]===tG&&d[i+2]===tB&&d[i+3]===tA,fill=i=>{d[i]=fr;d[i+1]=fg;d[i+2]=fb;d[i+3]=255;};const stack=[[sx,sy]],seen=new Uint8Array(W*H);while(stack.length){const[x,y]=stack.pop();if(x<0||x>=W||y<0||y>=H)continue;const i=idx(x,y),s2=y*W+x;if(seen[s2]||!match(i))continue;seen[s2]=1;fill(i);stack.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);}ctx.putImageData(img,0,0);}

  _makeDrag(handle,win,wd){
    let ox=0,oy=0,drag=false;
    handle.onmousedown=e=>{if(wd.max)return;drag=true;const wr=win.getBoundingClientRect();ox=e.clientX-wr.left;oy=e.clientY-wr.top;e.preventDefault();};
    document.addEventListener('mousemove',e=>{if(!drag)return;const dr=this.desk.getBoundingClientRect();win.style.left=`${Math.max(0,Math.min(e.clientX-dr.left-ox,dr.width-50))}px`;win.style.top=`${Math.max(0,Math.min(e.clientY-dr.top-oy,dr.height-28))}px`;});
    document.addEventListener('mouseup',()=>drag=false);
  }
  _focus(id){const w=this.wins.find(w=>w.id===id);if(!w)return;w.el.style.zIndex=++this.zc;Object.keys(this.ti).forEach(tid=>this.ti[tid].classList.toggle('on',tid===id));}
  _minimize(id){const w=this.wins.find(w=>w.id===id);if(!w)return;w.min=true;w.el.style.display='none';this.ti[id]?.classList.remove('on');}
  _restore(id){const w=this.wins.find(w=>w.id===id);if(!w)return;w.min=false;w.el.style.display='flex';this._focus(id);}
  _maxToggle(id){const w=this.wins.find(w=>w.id===id);if(!w)return;w.max=!w.max;if(w.max){w.saved={left:w.el.style.left,top:w.el.style.top,width:w.el.style.width,height:w.el.style.height};w.el.classList.add('max');}else{w.el.classList.remove('max');if(w.saved){w.el.style.left=w.saved.left;w.el.style.top=w.saved.top;w.el.style.width=w.saved.width;w.el.style.height=w.saved.height;}}}
  _closeWin(id){const idx=this.wins.findIndex(w=>w.id===id);if(idx<0)return;const w=this.wins[idx];w.el.style.transition='transform .15s,opacity .15s';w.el.style.transform='scale(.8)';w.el.style.opacity='0';setTimeout(()=>{w.el.remove();this.ti[id]?.remove();delete this.ti[id];this.wins.splice(idx,1);},180);}
  _startClk(){const t=()=>{if(this.tclk){const n=new Date();this.tclk.textContent=n.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});this.tclk.title=n.toLocaleDateString([],{weekday:'long',year:'numeric',month:'long',day:'numeric'});}};t();this.clkT=setInterval(t,1000);}
  resize(){}
  destroy(){clearInterval(this.clkT);clearInterval(this._ci);}
}
