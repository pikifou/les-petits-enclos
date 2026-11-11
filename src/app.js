(() => {
  'use strict';
  const $ = id => document.getElementById(id), S = EnclosState, Logic = PlacementLogic, Training = EnclosTraining;
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
  Object.assign(texts.fr, {
    gesture:'Double appui : animal · Un appui : × · Glisse : ×',
    controls:'Un appui marque ou efface une croix. Glisse pour en tracer plusieurs. Deux appuis rapides posent un animal. Deux nouveaux appuis le retirent.',
    errors:'erreurs',error:'erreur',stars:'étoiles',starTitle:'Tes étoiles',
    starRules:'3 étoiles : aucune erreur. 2 étoiles : une ou deux erreurs. 1 étoile : trois erreurs ou plus.',
    starNote:'Les croix sont tes notes et ne comptent pas comme des erreurs. Tu peux toujours terminer la grille. Reprendre commence un nouvel essai ; ton meilleur résultat est gardé.',
    placed:'Bien placé !',removed:'Animal retiré.',wrong:'Cette place ne convient pas. Essaie une autre case.',
    errorRow:'Il y a déjà un animal sur cette ligne.',errorColumn:'Il y a déjà un animal dans cette colonne.',errorRegion:'Il y a déjà un animal dans cet enclos.',errorTouch:'Ces animaux se toucheraient, même par un coin.',
    scoreSaved:'Meilleur résultat gardé',rulesIntro:'Chaque dessin montre une règle.',touchTitle:'Un peu d’espace',
    gestureTitle:'Les gestes',gestureShort:'Un appui',gestureHold:'Deux appuis',gestureDrag:'Glisse',gestureAnimal:'Animal',gestureCross:'Croix'
  });
  Object.assign(texts.fr, {
    errorTitle:'Regarde la règle',errorOK:'J’ai compris',
    training:'Entraînement',trainingIntro:'Regarde, puis essaie à ton tour',trainingResume:'Reprendre les petites missions',trainingReplay:'Refaire les petites missions',mission:'Mission',missionDone:'Mission réussie !',nextMission:'Mission suivante',startAdventure:'Commencer l’aventure',yourTurn:'À toi',trainingFinished:'Tu connais les bases !',trainingFinishedText:'Les cinq mondes t’attendent.',
    watch:'Regarde',watchFirst:'Le geste se termine, puis tu pourras essayer.',playNow:'Essaie',notesHelp:'Marque les cases où un autre animal ne peut plus aller. Garde les autres libres.',reviewDemo:'Recommencer',followArrow:'Suis la flèche : cette fois, utilise la case montrée.',doubleTarget:'Fais deux appuis rapides sur la case de la flèche.',oneTarget:'Un seul appui sur la case de la flèche.',dragTarget:'Garde le doigt posé et glisse dans le sens de la flèche.',pressUndo:'La flèche montre le bouton Annuler. Appuie dessus.',tryRules:'Prends ton temps : utilise les règles que tu viens d’apprendre.',
    errorAllRules:'Un animal par ligne, par colonne et par enclos. Les animaux ne se touchent pas, même par un coin.',
    errorNoFinish:'Cette place empêcherait de ranger tous les animaux en respectant les règles.'
  });
  Object.assign(texts.en, {
    gesture:'Double tap: animal · Tap: × · Drag: ×',
    controls:'Tap to mark or erase a cross. Drag to mark several. Two quick taps place an animal. Two more taps remove it.',
    errors:'mistakes',error:'mistake',stars:'stars',starTitle:'Your stars',
    starRules:'3 stars: no mistakes. 2 stars: one or two mistakes. 1 star: three or more mistakes.',
    starNote:'Crosses are your notes and do not count as mistakes. You can always finish the puzzle. Restart begins a new attempt; your best result is kept.',
    placed:'Nicely placed!',removed:'Animal removed.',wrong:'This place does not work. Try another square.',
    errorRow:'There is already an animal in this row.',errorColumn:'There is already an animal in this column.',errorRegion:'There is already an animal in this enclosure.',errorTouch:'These animals would touch, even at a corner.',
    scoreSaved:'Best result saved',rulesIntro:'Each drawing shows one rule.',touchTitle:'A little space',
    gestureTitle:'The gestures',gestureShort:'One tap',gestureHold:'Two taps',gestureDrag:'Drag',gestureAnimal:'Animal',gestureCross:'Cross'
  });
  Object.assign(texts.en, {
    errorTitle:'Look at the rule',errorOK:'I understand',
    training:'Practice',trainingIntro:'Watch, then try it yourself',trainingResume:'Resume the little missions',trainingReplay:'Replay the little missions',mission:'Mission',missionDone:'Mission complete!',nextMission:'Next mission',startAdventure:'Start the adventure',yourTurn:'Your turn',trainingFinished:'You know the basics!',trainingFinishedText:'The five worlds are waiting.',
    watch:'Watch',watchFirst:'The gesture will finish, then you can try.',playNow:'Try it',notesHelp:'Mark the squares where another animal cannot go. Leave the others free.',reviewDemo:'Restart',followArrow:'Follow the arrow: use the pointed square this time.',doubleTarget:'Tap the square under the arrow twice quickly.',oneTarget:'Tap the square under the arrow once.',dragTarget:'Keep your finger down and drag along the arrow.',pressUndo:'The arrow points to Undo. Press that button.',tryRules:'Take your time: use the rules you have just learned.',
    errorAllRules:'One animal per row, column and enclosure. Animals cannot touch, even at a corner.',
    errorNoFinish:'This place would stop you settling all the animals while following the rules.'
  });
  const KEY = 'les-petits-enclos.v1';
  let saved;
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { saved = {}; }
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) saved = {};
  let lang = ['fr','en'].includes(saved.lang) ? saved.lang : navigator.language.startsWith('fr') ? 'fr' : 'en';
  let sound = saved.sound === true, current = 1, state, level, world, history = [], gesture = null, pendingTap = null;
  let adventureCurrent=Number.isInteger(saved.current)&&saved.current>=1&&saved.current<=200?saved.current:1;
  let records = saved.records && typeof saved.records === 'object' && !Array.isArray(saved.records) ? saved.records : {};
  const completed = new Set((Array.isArray(saved.completed) ? saved.completed : []).filter(n => Number.isInteger(n) && n >= 1 && n <= 200));
  const bestStars = {};
  if (saved.bestStars && typeof saved.bestStars === 'object') for (let id=1;id<=200;id++) if ([1,2,3].includes(saved.bestStars[id])) bestStars[id]=saved.bestStars[id];
  let paused = false, wrapping = false, won = false, mode = 'home', shownWorld = 0, audio;
  let training = null;
  const storedTraining=saved.training?.version===Training.version?saved.training:{};
  const trainingProgress={version:Training.version,completed:[...new Set((Array.isArray(storedTraining.completed)?storedTraining.completed:[]).filter(n=>Number.isInteger(n)&&n>=0&&n<Training.steps.length))],session:storedTraining.session||null};
  let notice = null, noticeTimer, effectTimers = [], lastCount = -1, lastStars = -1;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let demoTimers=[];
  const rows=()=>level.rows||level.size,cols=()=>level.cols||level.size,tokens=()=>level.animals||level.size;
  const inspect=()=>training?Training.inspect(level,state):Logic.inspect(level,state.marks);
  const t = key => texts[lang][key];
  const unlocked = () => { let id = 1; while (id < 200 && completed.has(id)) id++; return id; };
  const kit = window.Ludi?.init({game:'les-petits-enclos'});
  if (kit?.inLauncher()) document.body.classList.add('embedded');
  const headFile = (w, head, id=training?1:current) => `assets/${w.id}-${(head + (id-1)%8)%8}.webp`;
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify({version:1,lang,sound,current:adventureCurrent,completed:[...completed],bestStars,records,training:trainingProgress})); }
    catch { $('feedback').textContent = t('saveError'); }
  }
  function remember() {
    if(training)trainingProgress.session={index:training.index,stage:training.stage,done:training.done,state:S.clone(state),history:history.map(S.clone)};
    else records[current]=S.clone(state);
    save();
  }
  function clearTap() { pendingTap = null; }
  function tone(kind='place') {
    if (!sound) return;
    try {
      audio ||= new (window.AudioContext || window.webkitAudioContext)(); audio.resume();
      const now = audio.currentTime;
      (kind==='win' ? [523,659,784] : kind==='error' ? [220,174] : kind==='mark' ? [540] : [587,784]).forEach((freq, i) => {
        const oscillator = audio.createOscillator(), gain = audio.createGain();
        oscillator.type='sine'; oscillator.frequency.value=freq; gain.gain.setValueAtTime(.0001,now+i*.06); gain.gain.exponentialRampToValueAtTime(kind==='mark'?.025:.065,now+i*.06+.008); gain.gain.exponentialRampToValueAtTime(.0001,now+i*.06+.14);
        oscillator.connect(gain).connect(audio.destination); oscillator.start(now+i*.1); oscillator.stop(now+i*.1+.21);
      });
    } catch { /* Audio remains optional. */ }
  }
  const starMarkup = count => Array.from({length:3},(_,i)=>`<span class="star ${i<count?'earned':'empty'}">★</span>`).join('');
  const errorText = count => `${count} ${t(count===1?'error':'errors')}`;
  function feedback(type,text) {
    clearTimeout(noticeTimer); notice={type,text}; renderStatus();
    noticeTimer=setTimeout(()=>{notice=null;renderStatus();},type==='error'?7000:type==='guide'?6000:1400);
  }
  function renderStatus() {
    if(!state)return;
    const count=S.stars(state.errors), stars=$('stars');
    if(lastStars!==count) {stars.innerHTML=starMarkup(count);if(lastStars>=0&&!reducedMotion)stars.animate([{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:300});lastStars=count;}
    $('errors').textContent=errorText(state.errors);
    $('starHelp').setAttribute('aria-label',`${count} ${t('stars')}, ${errorText(state.errors)}. ${t('starTitle')}`);
    const result=inspect(), text=notice?.text || (result.rule?t('lessons')[result.rule]:'');
    $('feedback').textContent=text; $('feedback').dataset.tone=notice?.type || (result.rule?'error':'neutral');
    $('counter').dataset.complete=String(result.count===tokens());
  }
  function clearEffects() {
    effectTimers.forEach(clearTimeout);effectTimers=[];$('effects').replaceChildren();
    $('board').querySelectorAll('.error-attempt,.holding').forEach(b=>b.classList.remove('error-attempt','holding'));
  }
  function effect(cell,kind,head) {
    const button=$('board').children[cell], rect=button.getBoundingClientRect(), parent=$('effects').getBoundingClientRect(), node=document.createElement('div');
    node.className=`cell-effect ${kind}`;Object.assign(node.style,{left:`${rect.left-parent.left}px`,top:`${rect.top-parent.top}px`,width:`${rect.width}px`,height:`${rect.height}px`});
    if(kind==='error') {
      node.innerHTML=`<img class="ghost-head" src="${headFile(world,head>=0?head:0)}" alt=""><span class="error-badge">!</span>`;
      button.classList.add('error-attempt');effectTimers.push(setTimeout(()=>button.classList.remove('error-attempt'),700));
    } else node.innerHTML='<span class="success-ring"></span>'+Array.from({length:8},(_,i)=>`<i class="spark" style="--angle:${i*45}deg;--distance:${rect.width*.45}px"></i>`).join('');
    $('effects').append(node);effectTimers.push(setTimeout(()=>node.remove(),kind==='error'?700:600));
  }
  function performAnimal(cell,before,length) {
    if(training&&!trainingGate('animal',cell))return;
    const head=state.selected,result=training?Training.place(training.index,level,state,cell,S):S.place(level,state,cell,Logic);
    if(training&&(result.kind==='error'||result.kind==='blocked'||result.kind==='full')){trainingFeedback(result.rule);return;}
    finishAction(before,length);
    if(result.kind==='error') {
      const key=result.rule?`error${result.rule[0].toUpperCase()+result.rule.slice(1)}`:'wrong';
      feedback('error',t(key));effect(cell,'error',head);tone('error');
      try { navigator.vibrate?.(35); } catch { /* Haptics are optional. */ }
      if(training||current<=40) showMistake(cell,result.rule,t(key));
    } else if(result.kind==='placed') {feedback('success',t('placed'));effect(cell,'success',result.head);if(!won&&!training?.done)tone();}
    else if(result.kind==='removed') {feedback('neutral',t('removed'));tone('mark');}
    else if(result.kind==='full')feedback('neutral',t('allUsed'));
  }
  function ruleIcon(kind) {
    return `<svg viewBox="0 0 30 30" fill="none">${Array.from({length:9},(_,i)=>{const active=kind==='row'?Math.floor(i/3)===1:kind==='column'?i%3===1:[0,1,3,4].includes(i);return `<rect x="${i%3*9+2}" y="${Math.floor(i/3)*9+2}" width="8" height="8" rx="2" fill="${active?'#dca948':'#edf3eb'}" stroke="#fff" stroke-width="1.2"/>`;}).join('')}<circle cx="15" cy="15" r="2.5" fill="#365c47"/></svg>`;
  }
  function translate() {
    document.documentElement.lang=lang; document.title=lang==='fr'?'Les Petits Enclos · Ludiworld':'Little Enclosures · Ludiworld';
    document.querySelectorAll('[data-t]').forEach(node => { node.innerHTML=t(node.dataset.t); });
    $('language').textContent=lang==='fr'?'EN':'FR'; $('sound').textContent=sound?'♪':'♫';
    $('sound').setAttribute('aria-label',t(sound?'soundOn':'soundOff')); $('help').setAttribute('aria-label',t('help')); $('map').setAttribute('aria-label',t('map'));
    document.querySelectorAll('[data-close]').forEach(button=>button.setAttribute('aria-label',t('close')));
    document.querySelectorAll('[data-rule]').forEach(button=>{button.querySelector('.mini-rule').innerHTML=ruleIcon(button.dataset.rule);button.setAttribute('aria-label',`${t(button.dataset.rule)}. ${t('help')}`);});
  }
  function backdrop(w) { document.body.style.backgroundImage=`url('assets/${w.bg}.webp')`; }
  function showHome() {
    cancelGesture();clearDemo();if(training)remember();training=null;document.body.classList.remove('training-mode','training-basics');$('trainingCard').hidden=true;clearTap(); clearEffects(); mode='home'; closeDialogs(); $('play').hidden=true; $('home').hidden=false;
    backdrop(worlds[0]); translate();
    const resume = Number.isInteger(saved.current) && saved.current>=1 && saved.current<=unlocked() && !completed.has(saved.current) ? saved.current : unlocked();
    $('continue').textContent=completed.size===200?t('worlds'):completed.size || records[resume] ? `${t('resume')} ${resume}`:t('start');
    $('continue').onclick=()=>completed.size===200?openWorld(4):loadLevel(resume);
    $('total').textContent=`${completed.size} / 200 ${t('solved')}`;
    $('trainingSummary').textContent=t(trainingProgress.completed.length===Training.steps.length?'trainingReplay':trainingProgress.session?'trainingResume':'trainingIntro');
    $('trainingCount').textContent=`${trainingProgress.completed.length} / ${Training.steps.length}`;
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
      const b=document.createElement('button'); b.innerHTML=`<strong>${id}</strong>${bestStars[id]?`<small class="level-stars">${'★'.repeat(bestStars[id])}</small>`:completed.has(id)?'<small>✓</small>':''}`; b.disabled=id>unlocked(); b.className=(completed.has(id)?'done ':'')+(id===unlocked()?'current':''); b.setAttribute('aria-label',`${t('level')} ${id}${bestStars[id]?`, ${bestStars[id]} ${t('stars')}`:completed.has(id)?' ✓':''}`); b.onclick=()=>loadLevel(id); $('levelList').append(b);
    }
    $('levels').showModal();
  }
  function closeDialogs() { document.querySelectorAll('dialog[open]').forEach(d=>d.close()); }
  function loadLevel(id, practice=false) {
    cancelGesture();clearDemo();
    if(!practice){training=null;document.body.classList.remove('training-mode','training-basics');$('trainingCard').hidden=true;$('play').querySelector('.hud h1 small').textContent='/ 200';}
    cancelGesture(); clearTap(); clearEffects(); clearTimeout(noticeTimer); notice=null; closeDialogs();
    if(!practice){current=Math.max(1,Math.min(200,id));adventureCurrent=current;saved.current=current;}
    if(practice){level=training.level;world=worlds.find(w=>w.id===Training.steps[training.index].species)||worlds[0];state=training.state;}else{level=PUZZLES.levels[current-1]; world=worlds[Math.floor((current-1)/40)]; state=S.restore(level,records[current]);}
    history=practice?(training.history||[]):[];lastCount=-1;lastStars=-1; won=!training&&Logic.inspect(level,state.marks).won; mode='play'; $('home').hidden=true; $('play').hidden=false;
    backdrop(world); translate(); $('worldName').textContent=world[lang]; $('number').textContent=current;
    $('board').style.setProperty('--n',cols());$('board').style.setProperty('--rows',rows());$('board').closest('.board-frame').style.setProperty('--ratio',cols()/rows()); $('board').setAttribute('aria-rowcount',rows()); $('board').setAttribute('aria-colcount',cols()); $('board').replaceChildren();
    level.regions.forEach((region,cell)=>{
      const b=document.createElement('button'); b.className='cell'; b.dataset.cell=cell; b.setAttribute('role','gridcell'); b.tabIndex=cell===0?0:-1;
      b.style.setProperty('--color',S.palette[region]);
      $('board').append(b);
    });
    $('inventory').replaceChildren();
    for(let head=0;head<tokens();head++) {
      const b=document.createElement('button'); b.className='head-choice';b.innerHTML=`<img src="${headFile(world,head)}" alt="">`;
      b.onclick=()=>{clearTap();state.selected=head;render();remember();tone('mark');};$('inventory').append(b);
    }
    render(); remember();
    if(won) celebrate(false);
    const url=new URL(location.href); url.searchParams.set('level',current);if(!practice)url.searchParams.delete('practice'); window.history.replaceState(null,'',url);
  }
  function startTraining(index=0,resume=true) {
    cancelGesture();index=Math.max(0,Math.min(Training.steps.length-1,index));
    const exercise=Training.create(index,S),session=trainingProgress.session;
    training={index,stage:Training.steps[index].kind==='drag'?'watch':'try',done:false,level:exercise.level,state:exercise.state,history:exercise.history};
    if(resume&&session?.index===index&&Array.isArray(session.state?.marks)&&session.state.marks.length===exercise.state.marks.length){
      training.state=S.restore(exercise.level,session.state);training.stage=Training.steps[index].kind==='drag'&&session.stage!=='try'?'watch':'try';
      training.done=session.done===true&&trainingProgress.completed.includes(index);
      training.history=(Array.isArray(session.history)?session.history:[]).slice(-100).map(snapshot=>S.restore(exercise.level,snapshot));
      if(Training.steps[index].id==='undo'&&!training.done&&!training.history.length)training.history=exercise.history;
    }
    document.body.classList.add('training-mode');document.body.classList.toggle('training-basics',index<7);
    $('trainingCard').hidden=false;loadLevel(current,true);
    const url=new URL(location.href);url.searchParams.delete('level');url.searchParams.set('practice',index+1);window.history.replaceState(null,'',url);
    renderTraining();remember();if(training.stage==='watch'&&!training.done)runDemo();
  }
  function renderTraining() {
    if(!training)return;
    const copy=Training.text(training.index,training.stage,lang),step=Training.steps[training.index];
    document.body.dataset.lessonKind=step.kind;document.body.dataset.lessonId=step.id;
    $('reset').querySelector('[data-t="reset"]').textContent=t('reviewDemo');
    $('worldName').textContent=t('training');$('play').querySelector('.hud [data-t="level"]').textContent=t('mission');$('number').textContent=training.index+1;$('play').querySelector('.hud h1 small').textContent=`/ ${Training.steps.length}`;
    $('counter').textContent=training.done?'✓':step.kind==='notes'?`${step.targets.filter(cell=>state.marks[cell]===2).length} / ${step.targets.length}`:t(training.stage==='watch'?'watch':'playNow');
    $('trainingProgress').textContent=`${t('mission')} ${training.index+1} / ${Training.steps.length}${training.stage==='watch'?' · '+t('watch'):''}`;
    $('trainingTitle').textContent=copy.title;$('trainingInstruction').textContent=copy.instruction;
    $('trainingInstruction').hidden=training.done;$('trainingValidated').hidden=!training.done;
    $('trainingCard').classList.toggle('done',training.done);$('trainingNext').textContent=t(training.index===Training.steps.length-1?'startAdventure':'nextMission');$('trainingNext').hidden=wrapping;
    const focus=step.guided===false?[]:training.stage==='watch'?[step.demo]:(step.targets||[]);
    [...$('board').children].forEach((button,cell)=>{button.classList.toggle('training-focus',!training.done&&step.kind!=='undo'&&focus.includes(cell));button.setAttribute('aria-disabled',String(training.done||training.stage==='watch'||step.targets!==null&&!step.targets.includes(cell)));});
    $('undo').disabled=training.done||training.stage==='watch'||!history.length||!['undo','finish'].includes(step.id);
    $('undo').classList.toggle('guide-undo',!training.done&&step.kind==='undo');
    positionGuide();
  }
  function checkTraining(before,action) {
    if(!training||training.done||training.stage!=='try')return;
    if(Training.check(training.index,before,state,action)){
      training.done=true;if(!trainingProgress.completed.includes(training.index))trainingProgress.completed.push(training.index);
      kit?.progress('missions_entrainement',trainingProgress.completed.length);kit?.checkpoint('fin-mission');tone('win');
      clearTimeout(noticeTimer);notice=null;
      clearDemo();
    }
    remember();render();
  }
  function trainingFeedback(rule) {
    const step=Training.steps[training.index];
    let message=rule?t('lessons')[rule]:t(step.kind==='notes'?'notesHelp':step.id==='finish'?'tryRules':step.kind==='undo'?'pressUndo':step.kind==='animal'?'doubleTarget':step.kind==='drag'?'dragTarget':'oneTarget');
    if(step.kind==='notes'&&step.nudge)message=step.nudge[lang];
    if(training.stage==='watch')message=t('watchFirst');
    if(rule==='column')message=lang==='fr'?'Il y a déjà une luciole dans cette colonne. Choisis une autre colonne.':'There is already a firefly in this column. Choose another column.';
    feedback('guide',message);positionGuide();
    const arrow=$('guideArrow');if(arrow&&!reducedMotion)arrow.animate([{transform:'translateY(-6px)'},{transform:'translateY(0)'}],{duration:260,iterations:2});
  }
  function trainingGate(action,cell) {
    if(!training)return true;
    if(training.done||training.stage!=='try'||!Training.allows(training.index,action,cell)){clearTap();trainingFeedback();return false;}
    return true;
  }
  function clearDemo() {
    demoTimers.forEach(clearTimeout);demoTimers=[];$('guideLayer').replaceChildren();
    $('board').querySelectorAll('.demo-muted').forEach(cell=>cell.classList.remove('demo-muted'));
    $('undo').classList.remove('guide-undo');
  }
  function guidePosition(node,target,above=false) {
    const a=target.getBoundingClientRect(),b=$('guideLayer').getBoundingClientRect();
    node.style.left=`${a.left-b.left+(above?a.width/2-25:0)}px`;node.style.top=`${a.top-b.top+(above?-51:0)}px`;
    if(!above){node.style.width=`${a.width}px`;node.style.height=`${a.height}px`;}
  }
  function positionGuide() {
    if(!training||training.done){$('guideLayer').replaceChildren();return;}
    const step=Training.steps[training.index];
    if(!$('guideArrow'))$('guideLayer').innerHTML='<div id="guideArrow" class="guide-arrow"><svg viewBox="0 0 50 70"><path d="M15 4H35V33H46L25 65L4 33H15Z" fill="#e9b84d" stroke="#fff" stroke-width="4" stroke-linejoin="round"/></svg></div><span id="guideHand" class="guide-hand">👇</span><div id="guideResults"></div>';
    const arrow=$('guideArrow'),target=step.kind==='undo'?$('undo'):$('board').children[step.demo];
    arrow.hidden=step.guided===false||training.stage==='try'&&step.id==='finish';guidePosition(arrow,target,true);
    $('guideHand').hidden=training.stage!=='watch';
    const handTarget=step.kind==='undo'?$('undo'):$('board').children[training.demoCell??step.demo];
    guidePosition($('guideHand'),handTarget);
  }
  function demoResult(cell,kind) {
    if(!training||!$('guideResults'))return;
    const target=$('board').children[cell];
    if(kind==='remove') {target.classList.add('demo-muted');return;}
    const node=document.createElement('div');node.className='guide-result';
    node.innerHTML=kind==='animal'?`<img src="${headFile(world,Math.max(0,state.selected))}" alt="">`:'<span>×</span>';
    guidePosition(node,target);$('guideResults').append(node);
  }
  function runDemo() {
    const instance=training,step=Training.steps[training.index];positionGuide();
    const later=(ms,fn)=>demoTimers.push(setTimeout(()=>{if(training===instance&&training.stage==='watch'&&!paused)fn();},ms));
    const tap=()=>{const hand=$('guideHand');if(hand&&!reducedMotion)hand.animate([{transform:'translateY(-8px) scale(1.07)'},{transform:'translateY(5px) scale(.85)'},{transform:'translateY(0)'}],{duration:260});};
    if(step.kind==='drag')step.path.forEach((cell,i)=>later(250+i*230,()=>{training.demoCell=cell;positionGuide();demoResult(cell,'cross');tap();}));
    else {
      later(350,tap);if(step.kind==='animal')later(670,tap);
      later(950,()=>demoResult(step.demo,['remove','erase','undo'].includes(step.id)?'remove':step.kind==='animal'?'animal':'cross'));
    }
    later(1300,()=>{clearDemo();clearTap();clearTimeout(noticeTimer);notice=null;training.stage='try';training.demoCell=undefined;render();remember();});
  }
  function render() {
    if(!state) return;
    const result=inspect();
    [...$('board').children].forEach((b,cell)=>{
      const html=state.marks[cell]===1?`<img src="${headFile(world,state.heads[cell])}" alt="">`:state.marks[cell]===2?'<span class="cross" aria-hidden="true"></span>':'';
      if(b.innerHTML!==html) b.innerHTML=html;
      b.setAttribute('aria-label',t('cell').replace('{r}',Math.floor(cell/cols())+1).replace('{c}',cell%cols()+1).replace('{z}',level.regions[cell]+1)+`, ${t(state.marks[cell]===1?'animal':state.marks[cell]===2?'cross':'empty')}`);
    });
    if(lastCount!==result.count) {
      $('counter').textContent=`${result.count} / ${tokens()}`;
      if(lastCount>=0&&result.count>lastCount&&!reducedMotion)$('counter').animate([{transform:'scale(1.18)'},{transform:'scale(1)'}],{duration:230});
      lastCount=result.count;
    }
    for(let head=0;head<tokens();head++) {
      const b=$('inventory').children[head],used=state.heads.includes(head); b.className='head-choice'+(used?' placed':'')+(state.selected===head?' selected':''); b.disabled=used||won||training?.done||training?.stage==='watch'; b.setAttribute('aria-pressed',String(state.selected===head)); b.setAttribute('aria-label',`${t('choose')} ${head+1}${used?', '+t('used'):''}`);
    }
    renderStatus();
    $('undo').disabled=!history.length||won||training?.done; $('reset').disabled=won;
    renderTraining();
  }
  function finishAction(before, previousLength=history.length,action='animal') {
    const changed=before.selected!==state.selected||before.marks.some((mark,i)=>mark!==state.marks[i]||before.heads[i]!==state.heads[i]);
    if(changed) { history.length=previousLength; history.push(before); if(history.length>100)history.shift(); }
    remember(); render();
    if(training)checkTraining(before,action);
    else if(Logic.inspect(level,state.marks).won&&!won){won=true;celebrate(true);}
  }
  function celebrate(report) {
    if(report) {
      const first=!completed.has(current); completed.add(current); bestStars[current]=Math.max(bestStars[current]||0,S.stars(state.errors)); remember();
      if(first) { kit?.progress('enclos_termines',completed.size);kit?.progress('dernier_niveau_termine',current);kit?.score('enclos_termines',completed.size,{better:'higher'}); }
      kit?.checkpoint('fin-enclos'); tone('win');
    }
    if(paused) return;
    const all=completed.size===200, chapter=current%40===0&&current<200;
    $('winTitle').textContent=t(all?'finished':'won'); $('winText').textContent=t(all?'finishedText':chapter?'chapter':'winText');
    $('winStars').innerHTML=starMarkup(S.stars(state.errors));$('winStars').setAttribute('aria-label',`${S.stars(state.errors)} ${t('stars')}`);$('winScore').textContent=errorText(state.errors);
    $('winHeads').replaceChildren();
    state.heads.filter(id=>id>=0).sort((a,b)=>a-b).forEach(head=>{const img=document.createElement('img');img.src=headFile(world,head);img.alt='';$('winHeads').append(img);});
    $('next').hidden=wrapping||all||current===200; $('next').textContent=t('next'); $('victory').showModal(); render();
  }
  function info(title,content,note='') {
    cancelGesture();clearTap();$('infoContent').innerHTML=`<h2>${title}</h2>${content}${note?`<p class="info-note">${note}</p>`:''}`;
    $('info').classList.toggle('rule-sheet',title===t('ruleTitle'));
    $('info').querySelector('.primary').onclick=null; $('info').querySelector('.primary').textContent=t('ok'); $('info').showModal();
    if($('info').classList.contains('rule-sheet'))activateRuleSheet();
  }
  function fitRuleSheet() {
    const sheet=document.querySelector('dialog.rule-sheet[open]');if(!sheet)return;
    document.body.style.setProperty('--rule-height',`${Math.ceil(sheet.getBoundingClientRect().height)}px`);
  }
  function activateRuleSheet() {
    document.body.classList.add('rule-visible');requestAnimationFrame(fitRuleSheet);
  }
  function clearRuleSheet() {
    if(!$('mistake').open){
      $('board').querySelectorAll('.rule-related,.rule-attempt').forEach(cell=>cell.classList.remove('rule-related','rule-attempt'));
      $('board').querySelectorAll('.rule-preview').forEach(node=>node.remove());
    }
    if(document.querySelector('dialog.rule-sheet[open]'))return;
    document.body.classList.remove('rule-visible');document.body.style.removeProperty('--rule-height');
  }
  let mistakeCell = null;
  function showMistake(cell,rule,message) {
    cancelGesture();clearTap();clearEffects();mistakeCell=cell;
    $('errorMessage').textContent=rule?message:t('errorNoFinish');
    $('errorRule').textContent=rule?t('lessons')[rule]:t('errorAllRules');
    $('errorDrawing').replaceChildren();
    const row=Math.floor(cell/cols()),col=cell%cols();
    [...$('board').children].forEach((button,index)=>{
      const r=Math.floor(index/cols()),c=index%cols();
      const related=rule==='row'?r===row:rule==='column'?c===col:rule==='region'?level.regions[index]===level.regions[cell]:rule==='touch'?Math.abs(r-row)<=1&&Math.abs(c-col)<=1:false;
      button.classList.toggle('rule-related',related);button.classList.toggle('rule-attempt',index===cell);
    });
    const preview=document.createElement('span');preview.className='rule-preview';preview.setAttribute('aria-hidden','true');preview.style.backgroundImage=`url('${headFile(world,Math.max(0,state.selected))}')`;$('board').children[cell].append(preview);
    $('mistake').showModal();activateRuleSheet();
  }
  function ruleDrawing(kind) {
    const face=headFile(world||worlds[0],0), chosen=kind==='touch'?[5,10]:[5];
    return `<div class="rule-drawing ${kind}" aria-hidden="true">${Array.from({length:16},(_,i)=>{
      const active=kind==='row'?Math.floor(i/4)===1:kind==='column'?i%4===1:kind==='region'?[0,1,4,5].includes(i):chosen.includes(i);
      return `<i class="${active?'rule-active':''} ${chosen.includes(i)?'rule-animal':''}">${chosen.includes(i)?`<img src="${face}" alt="">`:active?'<span>×</span>':''}</i>`;
    }).join('')}${kind==='touch'?'<b class="touch-no">!</b>':''}</div>`;
  }
  function help() {
    if(training&&Training.steps[training.index].id!=='finish'){info(t('training'),`<p>${Training.text(training.index,training.stage,lang).instruction}</p>`);return;}
    info(t('help'),`<p class="info-note">${t('rulesIntro')}</p><div class="rule-cards">${['row','column','region','touch'].map((kind,i)=>`<section><h3>${t(kind==='touch'?'touchTitle':kind)}</h3>${ruleDrawing(kind)}<p>${t('rules')[i]}</p></section>`).join('')}</div><h3>${t('gestureTitle')}</h3><div class="gesture-drawings"><span><b>×</b>${t('gestureShort')}</span><span><b>••</b>${t('gestureHold')}</span><span><b>× → ×</b>${t('gestureDrag')}</span></div><p>${t('controls')}</p>`,t('keyboard'));
  }
  function cellAt(event) {
    const rect=$('board').getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top;
    if(x<0||y<0||x>=rect.width||y>=rect.height)return -1;
    const style=getComputedStyle($('board')),gapX=parseFloat(style.columnGap)||0,gapY=parseFloat(style.rowGap)||0;
    const w=(rect.width-gapX*(cols()-1))/cols(),h=(rect.height-gapY*(rows()-1))/rows();
    const col=Math.floor(x/(w+gapX)),row=Math.floor(y/(h+gapY));
    if(col>=cols()||row>=rows()||x-col*(w+gapX)>w||y-row*(h+gapY)>h)return -1;
    return row*cols()+col;
  }
  function cancelGesture() {
    if(!gesture)return;
    const g=gesture;
    if(!g.committed){const errors=state.errors;state=S.clone(g.before);state.errors=errors;}
    gesture=null;clearTap();render();
  }
  $('board').addEventListener('pointerdown',event=>{
    if(paused||won||training?.done||mode!=='play'||event.button!==0)return;
    if(gesture||!event.isPrimary){cancelGesture();return;}
    const cell=cellAt(event);if(cell<0)return;
    if(training&&Training.steps[training.index].kind==='undo'){trainingFeedback();return;}
    if(training&&!trainingGate(Training.steps[training.index].kind,cell))return;
    event.preventDefault();$('board').setPointerCapture(event.pointerId);
    const double=(!training||Training.steps[training.index].kind==='animal')&&pendingTap&&pendingTap.cell===cell&&event.timeStamp-pendingTap.time<330&&pendingTap.type===event.pointerType;
    const before=double?S.clone(pendingTap.before):S.clone(state),length=double?pendingTap.length:history.length;
    if(double){const errors=state.errors;state=S.clone(before);state.errors=errors;history.length=length;clearTap();}
    const value=state.marks[cell]===2?0:2;
    gesture={pointer:event.pointerId,before,length,cell,last:cell,value,double,committed:false,moved:false,started:event.timeStamp,startX:event.clientX,startY:event.clientY,visited:new Set([cell])};
    if(double){gesture.committed=true;performAnimal(cell,before,length);}
    else {if(!training||Training.steps[training.index].kind!=='animal'||Training.steps[training.index].id==='finish')S.cross(state,cell,value);render();}
  });
  $('board').addEventListener('pointermove',event=>{
    if(!gesture||gesture.pointer!==event.pointerId||gesture.committed)return;
    const g=gesture,cell=cellAt(event);
    if(Math.hypot(event.clientX-g.startX,event.clientY-g.startY)>9)g.moved=true;
    if(cell<0||g.visited.has(cell))return;
    // Interpolate a fast drag, so a skipped pointer sample cannot leave holes.
    const n=cols(),ar=Math.floor(g.last/n),ac=g.last%n,br=Math.floor(cell/n),bc=cell%n,steps=Math.max(Math.abs(br-ar),Math.abs(bc-ac));
    for(let step=1;step<=steps;step++) {const index=Math.round(ar+(br-ar)*step/steps)*n+Math.round(ac+(bc-ac)*step/steps);if(!g.visited.has(index)){g.visited.add(index);if(!training||Training.allows(training.index,'drag',index))S.cross(state,index,g.value);}}
    g.last=cell;g.moved=true;render();
  });
  $('board').addEventListener('pointerup',event=>{
    if(!gesture||gesture.pointer!==event.pointerId)return;
    const g=gesture;gesture=null;
    if($('board').hasPointerCapture(event.pointerId))$('board').releasePointerCapture(event.pointerId);
    if(!g.committed){
      if(training&&Training.steps[training.index].kind==='drag'&&!g.moved){state=S.clone(g.before);render();trainingFeedback();}
      else {finishAction(g.before,g.length,g.moved?'drag':'cross');if(g.before.marks.some((mark,i)=>mark!==state.marks[i]))tone('mark');}
      if(training&&!training.done&&Training.steps[training.index].kind==='animal'&&Training.steps[training.index].id!=='finish')trainingFeedback();
    }
    pendingTap=!g.committed&&!g.moved&&event.timeStamp-g.started<350?{cell:g.cell,time:event.timeStamp,type:event.pointerType,before:g.before,length:g.length}:null;
  });
  $('board').addEventListener('pointercancel',cancelGesture);
  $('board').addEventListener('lostpointercapture',()=>{if(gesture)cancelGesture();});
  $('board').addEventListener('dblclick',event=>event.preventDefault());
  $('board').addEventListener('click',event=>event.preventDefault());
  $('board').addEventListener('contextmenu',event=>event.preventDefault());
  $('board').addEventListener('keydown',event=>{
    const cell=Number(event.target.dataset.cell);if(!Number.isInteger(cell)||paused||won||training?.done)return;
    const directions={ArrowUp:-cols(),ArrowDown:cols(),ArrowLeft:-1,ArrowRight:1};
    if(event.key in directions){event.preventDefault();const next=Math.max(0,Math.min(state.marks.length-1,cell+directions[event.key]));event.target.tabIndex=-1;$('board').children[next].tabIndex=0;$('board').children[next].focus();return;}
    if(event.key===' '||event.key==='Enter') {event.preventDefault();if(event.repeat)return;clearTap();const before=S.clone(state);if(event.key==='Enter')performAnimal(cell,before,history.length);else{if(!trainingGate('cross',cell))return;S.cross(state,cell,state.marks[cell]===2?0:2);finishAction(before,history.length,'cross');tone('mark');}}
  });
  $('hint').onclick=()=>{clearTap();if(training){help();return;}const key=S.lesson(level,state,Logic);info(t('ruleTitle'),`<p>${t('lessons')[key]}</p>`,t('hintNote'));};
  $('undo').onclick=()=>{if(!trainingGate('undo'))return;cancelGesture();clearTap();if(history.length){const before=S.clone(state),errors=state.errors;state=history.pop();state.errors=errors;notice=null;remember();render();if(training)checkTraining(before,'undo');tone('mark');}};
  $('reset').onclick=()=>{if(training){startTraining(training.index,false);return;}info(t('resetTitle'),`<p>${t('resetText')}</p>`);const button=$('info').querySelector('.primary');button.textContent=t('confirm');button.onclick=()=>{history=[];state=S.fresh(level);notice=null;clearTimeout(noticeTimer);clearEffects();remember();render();};};
  $('map').onclick=showHome;$('help').onclick=help;
  document.querySelectorAll('[data-rule]').forEach(button=>button.onclick=help);
  $('starHelp').onclick=()=>info(t('starTitle'),`<div class="stars star-example">${starMarkup(3)}</div><p>${t('starRules')}</p>`,t('starNote'));
  $('language').onclick=()=>{clearTap();lang=lang==='fr'?'en':'fr';save();if(mode==='home')showHome();else{translate();$('worldName').textContent=world[lang];render();if(won){closeDialogs();celebrate(false);}}};
  $('sound').onclick=()=>{sound=!sound;save();translate();renderTraining();tone();};
  $('training').onclick=()=>{
    const session=trainingProgress.session,index=Number.isInteger(session?.index)?session.index:0;
    startTraining(trainingProgress.completed.length===Training.steps.length?0:session?.done?Math.min(index+1,Training.steps.length-1):index,true);
  };
  $('trainingNext').onclick=()=>{if(!training?.done||wrapping)return;if(training.index===Training.steps.length-1)loadLevel(unlocked());else startTraining(training.index+1,false);};
  $('next').onclick=()=>{if(!wrapping)loadLevel(current+1);};$('winMap').onclick=showHome;
  $('replay').onclick=()=>{delete records[current];loadLevel(current);};
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelGesture();clearTap();if(state&&mode==='play')remember();}});
  window.addEventListener('blur',()=>{cancelGesture();clearTap();});
  kit?.onPause(()=>{paused=true;clearDemo();cancelGesture();clearTap();if(state&&mode==='play')remember();closeDialogs();$('pause').showModal();audio?.suspend();});
  kit?.onWrapUp(()=>{wrapping=true;if(training?.done){$('trainingNext').hidden=true;kit.checkpoint('fin-mission');}else if(won){$('next').hidden=true;kit.checkpoint('fin-enclos');}});
  $('pause').addEventListener('cancel',event=>event.preventDefault());
  $('mistake').addEventListener('cancel',event=>event.preventDefault());
  $('mistake').addEventListener('close',clearRuleSheet);$('info').addEventListener('close',clearRuleSheet);
  $('ackError').onclick=()=>{
    $('mistake').close();clearTimeout(noticeTimer);notice=null;renderStatus();
    if(mistakeCell!==null)$('board').children[mistakeCell]?.focus({preventScroll:true});
    mistakeCell=null;
  };
  window.addEventListener('resize',()=>{if(training)requestAnimationFrame(positionGuide);if(document.body.classList.contains('rule-visible'))requestAnimationFrame(fitRuleSheet);});
  showHome();
  const requested=Number(new URLSearchParams(location.search).get('level'));
  const practice=Number(new URLSearchParams(location.search).get('practice'));
  if(Number.isInteger(practice)&&practice>=1&&practice<=Training.steps.length)startTraining(practice-1,true);
  else if(Number.isInteger(requested)&&requested>=1&&requested<=unlocked())loadLevel(requested);
  if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
