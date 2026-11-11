(() => {
  'use strict';
  const $ = id => document.getElementById(id), S = EnclosState, Logic = PlacementLogic;
  const worlds = [
    {id:'lucioles',bg:'lucioles',fr:'Le Bois des Lucioles',en:'Firefly Woods'},
    {id:'pandas',bg:'bambou',fr:'La Vallée des Pandas',en:'Panda Valley'},
    {id:'hiboux',bg:'nuages',fr:'Les Îles des Hiboux',en:'Owl Islands'},
    {id:'moutons',bg:'prairie',fr:'La Prairie des Moutons',en:'Sheep Meadow'},
    {id:'chats',bg:'jardin',fr:'Le Jardin des Chats',en:'Cat Garden'}
  ];
  const texts = {
    fr:{title:'Les Petits<br>Enclos',eyebrow:'Une aventure de logique',story:'Viens avec moi ! On traverse cinq mondes pour aider chaque animal à trouver sa place.',quiet:'200 énigmes, à ton rythme.',level:'Niveau',row:'1 par ligne',column:'1 par colonne',region:'1 par enclos',apart:'Sans se toucher, même par un coin.',gesture:'Appui : × · Double appui : animal · Glisse : ×',undo:'Annuler',reset:'Reprendre',hint:'Indice',keeper:'À chacun sa petite place.',ok:'D’accord',next:'Continuer',worlds:'Les cinq mondes',pause:'Petite pause',paused:'Ta grille est gardée.',start:'C’est parti !',resume:'Reprendre le niveau',solved:'enclos rangés',locked:'Termine le monde précédent',levels:'Niveaux',help:'Comment jouer',rules:['Un animal dans chaque ligne.','Un animal dans chaque colonne.','Un animal dans chaque enclos de couleur.','Deux animaux ne se touchent pas, même par un coin.'],controls:'Un appui marque une croix. Garde le doigt posé et glisse pour en tracer plusieurs. Un double appui place l’animal choisi. Un autre double appui le retire. Appuie sur une croix pour l’effacer.',keyboard:'Au clavier : flèches pour se déplacer, Espace pour une croix, Entrée pour un animal.',hintNote:'L’indice donne une règle. À toi de trouver où elle s’applique. Tes croix sont des hypothèses : tu peux revenir dessus.',ruleTitle:'Une règle pour réfléchir',won:'Chacun a sa place !',winText:'Tous les animaux sont bien installés.',chapter:'Un nouveau monde t’attend !',finished:'Les cinq mondes sont rangés !',finishedText:'Tu as trouvé une place pour chacun. Tu peux revenir jouer dans tes mondes préférés.',allUsed:'Tous les animaux sont placés. Un double appui en retire un.',resetTitle:'Reprendre cette grille ?',resetText:'Les marques de cette grille seront effacées. Les enclos déjà terminés restent dans ton voyage.',confirm:'Oui, reprendre',saveError:'La sauvegarde est indisponible sur cet appareil.',soundOn:'Couper le son',soundOff:'Activer le son',map:'Choisir un monde',close:'Fermer',cell:'Ligne {r}, colonne {c}, enclos {z}',empty:'vide',cross:'croix',animal:'animal',choose:'Choisir l’animal',used:'déjà placé',lessons:{row:'Chaque ligne accueille un seul animal.',column:'Chaque colonne accueille un seul animal.',region:'Chaque enclos de couleur accueille un seul animal.',touch:'Deux animaux ne peuvent pas se toucher, même par un coin.',single:'Quand il ne reste qu’une place possible dans une ligne, une colonne ou un enclos, l’animal doit y aller.',blocked:'Une case peut être écartée si y poser un animal bloquerait toutes les places d’une ligne, d’une colonne ou d’un enclos.',hypothesis:'Si une hypothèse conduit, après plusieurs déductions, à bloquer toutes les places d’une ligne, d’une colonne ou d’un enclos, cette hypothèse peut être écartée.',possible:'Chaque ligne, chaque colonne et chaque enclos doivent garder au moins une place possible. Une croix peut parfois devoir être effacée.',won:'Chaque ligne, colonne et enclos accueille un animal, et aucun ne touche son voisin.',stuck:'Compare les places encore possibles dans les lignes, les colonnes et les enclos. Quand un groupe ne peut être rempli que dans une même ligne ou colonne, cela limite les autres groupes.'}},
    en:{title:'Little<br>Enclosures',eyebrow:'A logic adventure',story:'Come with me! Let’s travel through five worlds and help every animal find a place.',quiet:'200 puzzles, at your own pace.',level:'Level',row:'1 per row',column:'1 per column',region:'1 per enclosure',apart:'No touching, even at a corner.',gesture:'Tap: × · Double tap: animal · Drag: ×',undo:'Undo',reset:'Restart',hint:'Hint',keeper:'A little place for everyone.',ok:'Got it',next:'Continue',worlds:'The five worlds',pause:'A little break',paused:'Your puzzle is saved.',start:'Let’s go!',resume:'Resume level',solved:'puzzles completed',locked:'Finish the previous world',levels:'Levels',help:'How to play',rules:['One animal in every row.','One animal in every column.','One animal in every colored enclosure.','Animals cannot touch, even at a corner.'],controls:'Tap to mark a cross. Hold and drag to mark several. Double tap to place the selected animal. Double tap again to remove it. Tap a cross to erase it.',keyboard:'Keyboard: arrows to move, Space for a cross, Enter for an animal.',hintNote:'The hint gives a rule. Find where it applies. Your crosses are assumptions: you can change them.',ruleTitle:'A rule to think about',won:'Everyone has a place!',winText:'All the animals are settled in.',chapter:'A new world is waiting!',finished:'All five worlds are settled!',finishedText:'You found a place for everyone. You can play again in your favorite worlds.',allUsed:'All animals are placed. Double tap one to remove it.',resetTitle:'Restart this puzzle?',resetText:'This puzzle’s marks will be cleared. Completed puzzles stay in your journey.',confirm:'Yes, restart',saveError:'Saving is unavailable on this device.',soundOn:'Mute sound',soundOff:'Enable sound',map:'Choose a world',close:'Close',cell:'Row {r}, column {c}, enclosure {z}',empty:'empty',cross:'cross',animal:'animal',choose:'Choose animal',used:'already placed',lessons:{row:'Every row has exactly one animal.',column:'Every column has exactly one animal.',region:'Every colored enclosure has exactly one animal.',touch:'Animals cannot touch, even at a corner.',single:'When only one possible place remains in a row, column or enclosure, its animal must go there.',blocked:'A square can be ruled out if placing an animal there would block every possible place in a row, column or enclosure.',hypothesis:'If an assumption leads, after several deductions, to blocking every place in a row, column or enclosure, that assumption can be ruled out.',possible:'Every row, column and enclosure must keep at least one possible place. Sometimes a cross needs to be erased.',won:'Every row, column and enclosure has one animal, and no animals touch.',stuck:'Compare the remaining places in rows, columns and enclosures. When a group can only be filled in one row or column, that limits the other groups.'}}
  };
  const KEY = 'les-petits-enclos.v1';
  let saved;
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { saved = {}; }
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) saved = {};
  let lang = ['fr','en'].includes(saved.lang) ? saved.lang : navigator.language.startsWith('fr') ? 'fr' : 'en';
  let sound = saved.sound === true, current = 1, state, level, world, history = [], gesture = null, pendingTap = null;
  let records = saved.records && typeof saved.records === 'object' && !Array.isArray(saved.records) ? saved.records : {};
  const completed = new Set((Array.isArray(saved.completed) ? saved.completed : []).filter(n => Number.isInteger(n) && n >= 1 && n <= 200));
  let paused = false, wrapping = false, won = false, mode = 'home', shownWorld = 0, audio;
  const t = key => texts[lang][key];
  const unlocked = () => { let id = 1; while (id < 200 && completed.has(id)) id++; return id; };
  const kit = window.Ludi?.init({game:'les-petits-enclos'});
  if (kit?.inLauncher()) document.body.classList.add('embedded');
  const headFile = (w, head, id=current) => `assets/${w.id}-${(head + (id-1)%8)%8}.webp`;
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify({version:1,lang,sound,current,completed:[...completed],records})); }
    catch { $('feedback').textContent = t('saveError'); }
  }
  function remember() { records[current] = S.clone(state); save(); }
  function clearTap() { pendingTap = null; }
  function tone(win=false) {
    if (!sound) return;
    try {
      audio ||= new (window.AudioContext || window.webkitAudioContext)(); audio.resume();
      const now = audio.currentTime;
      (win ? [523,659,784] : [440]).forEach((freq, i) => {
        const oscillator = audio.createOscillator(), gain = audio.createGain();
        oscillator.type='sine'; oscillator.frequency.value=freq; gain.gain.setValueAtTime(.0001,now+i*.1); gain.gain.exponentialRampToValueAtTime(.07,now+i*.1+.01); gain.gain.exponentialRampToValueAtTime(.0001,now+i*.1+.2);
        oscillator.connect(gain).connect(audio.destination); oscillator.start(now+i*.1); oscillator.stop(now+i*.1+.21);
      });
    } catch { /* Audio remains optional. */ }
  }
  function translate() {
    document.documentElement.lang=lang; document.title=lang==='fr'?'Les Petits Enclos · Ludiworld':'Little Enclosures · Ludiworld';
    document.querySelectorAll('[data-t]').forEach(node => { node.innerHTML=t(node.dataset.t); });
    $('language').textContent=lang==='fr'?'EN':'FR'; $('sound').textContent=sound?'♪':'♫';
    $('sound').setAttribute('aria-label',t(sound?'soundOn':'soundOff')); $('help').setAttribute('aria-label',t('help')); $('map').setAttribute('aria-label',t('map'));
    document.querySelectorAll('[data-close]').forEach(button=>button.setAttribute('aria-label',t('close')));
  }
  function backdrop(w) { document.body.style.backgroundImage=`url('assets/${w.bg}.webp')`; }
  function showHome() {
    cancelGesture(); clearTap(); mode='home'; closeDialogs(); $('play').hidden=true; $('home').hidden=false;
    backdrop(worlds[0]); translate();
    const resume = Number.isInteger(saved.current) && saved.current>=1 && saved.current<=unlocked() && !completed.has(saved.current) ? saved.current : unlocked();
    $('continue').textContent=completed.size===200?t('worlds'):completed.size || records[resume] ? `${t('resume')} ${resume}`:t('start');
    $('continue').onclick=()=>completed.size===200?openWorld(4):loadLevel(resume);
    $('total').textContent=`${completed.size} / 200 ${t('solved')}`;
    $('worlds').replaceChildren();
    worlds.forEach((w,i)=>{
      const count=[...completed].filter(id=>Math.floor((id-1)/40)===i).length, button=document.createElement('button'); button.className='world-card'; button.style.backgroundImage=`url('assets/${w.bg}.webp')`; button.disabled=unlocked()<i*40+1;
      button.innerHTML=`<img src="${headFile(w,0,i*40+1)}" alt=""><span><strong>${w[lang]}</strong><small>${button.disabled?t('locked'):`${t('levels')} ${i*40+1}–${i*40+40}`}</small></span><span class="world-progress">${count} / 40</span>`;
      button.onclick=()=>openWorld(i); $('worlds').append(button);
    });
  }
  function openWorld(i) {
    clearTap(); shownWorld=i; $('levelTitle').textContent=worlds[i][lang]; $('levelList').replaceChildren();
    for(let id=i*40+1;id<=i*40+40;id++) {
      const b=document.createElement('button'); b.textContent=id; b.disabled=id>unlocked(); b.className=(completed.has(id)?'done ':'')+(id===unlocked()?'current':''); b.setAttribute('aria-label',`${t('level')} ${id}${completed.has(id)?' ✓':''}`); b.onclick=()=>loadLevel(id); $('levelList').append(b);
    }
    $('levels').showModal();
  }
  function closeDialogs() { document.querySelectorAll('dialog[open]').forEach(d=>d.close()); }
  function loadLevel(id) {
    cancelGesture(); clearTap(); closeDialogs(); current=Math.max(1,Math.min(200,id)); saved.current=current;
    level=PUZZLES.levels[current-1]; world=worlds[Math.floor((current-1)/40)]; state=S.restore(level,records[current]);
    history=[]; won=Logic.inspect(level,state.marks).won; mode='play'; $('home').hidden=true; $('play').hidden=false;
    backdrop(world); translate(); $('worldName').textContent=world[lang]; $('number').textContent=current;
    $('board').style.setProperty('--n',level.size); $('board').setAttribute('aria-rowcount',level.size); $('board').setAttribute('aria-colcount',level.size); $('board').replaceChildren();
    level.regions.forEach((region,cell)=>{
      const r=Math.floor(cell/level.size),c=cell%level.size,n=level.size,b=document.createElement('button'); b.className='cell'; b.dataset.cell=cell; b.setAttribute('role','gridcell'); b.tabIndex=cell===0?0:-1;
      b.style.setProperty('--color',S.palette[region]);
      b.style.setProperty('--edges',`${r===0||level.regions[cell-n]!==region?2:0}px ${c===n-1||level.regions[cell+1]!==region?2:0}px ${r===n-1||level.regions[cell+n]!==region?2:0}px ${c===0||level.regions[cell-1]!==region?2:0}px`);
      $('board').append(b);
    });
    render(); remember();
    if(won) celebrate(false);
    const url=new URL(location.href); url.searchParams.set('level',current); window.history.replaceState(null,'',url);
  }
  function render() {
    if(!state) return;
    const result=Logic.inspect(level,state.marks);
    [...$('board').children].forEach((b,cell)=>{
      const html=state.marks[cell]===1?`<img src="${headFile(world,state.heads[cell])}" alt="">`:state.marks[cell]===2?'<span class="cross" aria-hidden="true"></span>':'';
      if(b.innerHTML!==html) b.innerHTML=html;
      b.setAttribute('aria-label',t('cell').replace('{r}',Math.floor(cell/level.size)+1).replace('{c}',cell%level.size+1).replace('{z}',level.regions[cell]+1)+`, ${t(state.marks[cell]===1?'animal':state.marks[cell]===2?'cross':'empty')}`);
    });
    $('counter').textContent=`${result.count} / ${level.size}`;
    $('inventory').replaceChildren();
    for(let head=0;head<level.size;head++) {
      const b=document.createElement('button'),used=state.heads.includes(head); b.className='head-choice'+(used?' placed':'')+(state.selected===head?' selected':''); b.disabled=used||won; b.setAttribute('aria-pressed',String(state.selected===head)); b.setAttribute('aria-label',`${t('choose')} ${head+1}${used?', '+t('used'):''}`); b.innerHTML=`<img src="${headFile(world,head)}" alt="">`;
      b.onclick=()=>{clearTap();state.selected=head;render();remember();}; $('inventory').append(b);
    }
    $('feedback').textContent=result.rule?t('lessons')[result.rule]:'';
    $('undo').disabled=!history.length||won; $('reset').disabled=won;
  }
  function finishAction(before, previousLength=history.length) {
    if(JSON.stringify(before)!==JSON.stringify(state)) { history.length=previousLength; history.push(before); if(history.length>100)history.shift(); }
    remember(); render();
    if(Logic.inspect(level,state.marks).won&&!won){won=true;celebrate(true);}
  }
  function celebrate(report) {
    if(report) {
      const first=!completed.has(current); completed.add(current); remember();
      if(first) { kit?.progress('enclos_termines',completed.size);kit?.progress('dernier_niveau_termine',current);kit?.score('enclos_termines',completed.size,{better:'higher'}); }
      kit?.checkpoint('fin-enclos'); tone(true);
    }
    if(paused) return;
    const all=completed.size===200, chapter=current%40===0&&current<200;
    $('winTitle').textContent=t(all?'finished':'won'); $('winText').textContent=t(all?'finishedText':chapter?'chapter':'winText');
    $('winHeads').replaceChildren();
    state.heads.filter(id=>id>=0).sort((a,b)=>a-b).forEach(head=>{const img=document.createElement('img');img.src=headFile(world,head);img.alt='';$('winHeads').append(img);});
    $('next').hidden=wrapping||all||current===200; $('next').textContent=t('next'); $('victory').showModal(); render();
  }
  function info(title,content,note='') {
    cancelGesture();clearTap();$('infoContent').innerHTML=`<h2>${title}</h2>${content}${note?`<p class="info-note">${note}</p>`:''}`;
    $('info').querySelector('.primary').onclick=null; $('info').querySelector('.primary').textContent=t('ok'); $('info').showModal();
  }
  function help() {info(t('help'),`<ol class="rule-list">${t('rules').map(rule=>`<li>${rule}</li>`).join('')}</ol><p>${t('controls')}</p>`,t('keyboard'));}
  function cellAt(event) {
    const rect=$('board').getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top;
    if(x<0||y<0||x>=rect.width||y>=rect.height)return -1;
    return Math.floor(y/rect.height*level.size)*level.size+Math.floor(x/rect.width*level.size);
  }
  function cancelGesture() {
    if(!gesture)return;
    state=S.clone(gesture.before);gesture=null;clearTap();render();
  }
  $('board').addEventListener('pointerdown',event=>{
    if(paused||won||mode!=='play'||event.button!==0)return;
    if(gesture||!event.isPrimary){cancelGesture();return;}
    const cell=cellAt(event);if(cell<0)return;
    event.preventDefault();$('board').setPointerCapture(event.pointerId);
    const double=pendingTap&&pendingTap.cell===cell&&event.timeStamp-pendingTap.time<330&&pendingTap.type===event.pointerType;
    const before=double?S.clone(pendingTap.before):S.clone(state),length=double?pendingTap.length:history.length;
    if(double){state=S.clone(before);history.length=length;S.animal(state,cell,level.size);clearTap();}
    const value=state.marks[cell]===2?0:2;
    gesture={pointer:event.pointerId,before,length,cell,last:cell,value,double,moved:false,startX:event.clientX,startY:event.clientY,visited:new Set([cell])};
    if(!double)S.cross(state,cell,value);
    render();
  });
  $('board').addEventListener('pointermove',event=>{
    if(!gesture||gesture.pointer!==event.pointerId||gesture.double)return;
    const g=gesture,cell=cellAt(event);
    if(Math.hypot(event.clientX-g.startX,event.clientY-g.startY)>9)g.moved=true;
    if(cell<0||g.visited.has(cell))return;
    // Interpolate a fast drag, so a skipped pointer sample cannot leave holes.
    const n=level.size,ar=Math.floor(g.last/n),ac=g.last%n,br=Math.floor(cell/n),bc=cell%n,steps=Math.max(Math.abs(br-ar),Math.abs(bc-ac));
    for(let step=1;step<=steps;step++) {const index=Math.round(ar+(br-ar)*step/steps)*n+Math.round(ac+(bc-ac)*step/steps);if(!g.visited.has(index)){g.visited.add(index);S.cross(state,index,g.value);}}
    g.last=cell;g.moved=true;render();
  });
  $('board').addEventListener('pointerup',event=>{
    if(!gesture||gesture.pointer!==event.pointerId)return;
    const g=gesture;gesture=null;
    if($('board').hasPointerCapture(event.pointerId))$('board').releasePointerCapture(event.pointerId);
    finishAction(g.before,g.length);
    pendingTap=!g.double&&!g.moved?{cell:g.cell,time:event.timeStamp,type:event.pointerType,before:g.before,length:g.length}:null;
    if(g.double)tone();
  });
  $('board').addEventListener('pointercancel',cancelGesture);
  $('board').addEventListener('lostpointercapture',()=>{if(gesture)cancelGesture();});
  $('board').addEventListener('dblclick',event=>event.preventDefault());
  $('board').addEventListener('click',event=>event.preventDefault());
  $('board').addEventListener('contextmenu',event=>event.preventDefault());
  $('board').addEventListener('keydown',event=>{
    const cell=Number(event.target.dataset.cell);if(!Number.isInteger(cell)||paused||won)return;
    const directions={ArrowUp:-level.size,ArrowDown:level.size,ArrowLeft:-1,ArrowRight:1};
    if(event.key in directions){event.preventDefault();const next=Math.max(0,Math.min(level.size**2-1,cell+directions[event.key]));event.target.tabIndex=-1;$('board').children[next].tabIndex=0;$('board').children[next].focus();return;}
    if(event.key===' '||event.key==='Enter') {event.preventDefault();clearTap();const before=S.clone(state);if(event.key==='Enter')S.animal(state,cell,level.size);else S.cross(state,cell,state.marks[cell]===2?0:2);finishAction(before);}
  });
  $('hint').onclick=()=>{clearTap();const key=S.lesson(level,state,Logic);info(t('ruleTitle'),`<p>${t('lessons')[key]}</p>`,t('hintNote'));};
  $('undo').onclick=()=>{cancelGesture();clearTap();if(history.length){state=history.pop();remember();render();}};
  $('reset').onclick=()=>{info(t('resetTitle'),`<p>${t('resetText')}</p>`);const button=$('info').querySelector('.primary');button.textContent=t('confirm');button.onclick=()=>{history.push(S.clone(state));state=S.fresh(level);remember();render();};};
  $('map').onclick=showHome;$('help').onclick=help;
  $('language').onclick=()=>{clearTap();lang=lang==='fr'?'en':'fr';save();if(mode==='home')showHome();else{translate();$('worldName').textContent=world[lang];render();if(won){closeDialogs();celebrate(false);}}};
  $('sound').onclick=()=>{sound=!sound;save();translate();tone();};
  $('next').onclick=()=>{if(!wrapping)loadLevel(current+1);};$('winMap').onclick=showHome;
  $('replay').onclick=()=>{delete records[current];loadLevel(current);};
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelGesture();clearTap();if(state)remember();}});
  window.addEventListener('blur',()=>{cancelGesture();clearTap();});
  kit?.onPause(()=>{paused=true;cancelGesture();clearTap();if(state)remember();closeDialogs();$('pause').showModal();audio?.suspend();});
  kit?.onWrapUp(()=>{wrapping=true;if(won){$('next').hidden=true;kit.checkpoint('fin-enclos');}});
  $('pause').addEventListener('cancel',event=>event.preventDefault());
  showHome();
  const requested=Number(new URLSearchParams(location.search).get('level'));
  if(Number.isInteger(requested)&&requested>=1&&requested<=unlocked())loadLevel(requested);
  if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
