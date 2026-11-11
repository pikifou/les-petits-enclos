"""Erreurs, étoiles, appui long et lisibilité sur les vraies tailles d'écran."""
import asyncio,json,os
from pathlib import Path
from playwright.async_api import async_playwright
URL=os.environ.get('ENCLOS_URL','http://localhost:7374/')
KEY='les-petits-enclos.v1'
OUT=Path(__file__).resolve().parent/'captures';OUT.mkdir(exist_ok=True)
async def record(page):return json.loads(await page.evaluate(f'localStorage.getItem("{KEY}")'))
async def acknowledge(page):
 if await page.locator('#mistake').is_visible():await page.locator('#ackError').click()
async def hold(page,cell,ms=960):
 b=await page.locator(f'[data-cell="{cell}"]').bounding_box();await page.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2);await page.mouse.down();await page.wait_for_timeout(ms)
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch();ctx=await browser.new_context(viewport={'width':390,'height':844},locale='fr-FR',has_touch=True)
  page=await ctx.new_page();page.set_default_timeout(8000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  await page.goto(URL+'?level=1');await page.locator('#board').wait_for()
  assert await page.locator('#stars .earned').count()==3
  # Brief clicks never show the hold clock; holding reveals it after the delay.
  await hold(page,2,100);assert await page.locator('.hold-indicator').count()==0
  await page.wait_for_timeout(420);assert await page.locator('.hold-indicator').count()==0
  await page.wait_for_timeout(150);assert await page.locator('.hold-indicator').count()==1
  await page.locator('#board').dispatch_event('pointercancel',{'pointerId':1});await page.mouse.up();await page.wait_for_timeout(250)
  assert await page.locator('.hold-indicator').count()==0
  assert await page.locator('#board img').count()==0
  borders=await page.locator('#board .cell').evaluate_all("cells=>cells.map(c=>[getComputedStyle(c).boxShadow,getComputedStyle(c,'::before').content])")
  assert len(set(style[0] for style in borders))==1
  assert all(style[1]=='none' for style in borders)
  # Legal under the visible rules, but outside the unique solution: immediate rejection.
  await page.locator('[data-cell="0"]').dblclick(delay=65)
  assert await page.locator('[data-cell="0"] img').count()==0
  assert await page.locator('#effects .error').count()==1
  assert await page.locator('#feedback').get_attribute('data-tone')=='error'
  assert await page.locator('#stars .earned').count()==2
  assert (await record(page))['records']['1']['errors']==1
  assert await page.locator('#mistake').is_visible()
  assert float(await page.locator('#errorRule').evaluate('e=>parseFloat(getComputedStyle(e).fontSize)'))>=22
  await page.locator('#mistake').press('Escape');assert await page.locator('#mistake').is_visible()
  await page.wait_for_timeout(3200);assert await page.locator('#mistake').is_visible()
  await page.screenshot(path=str(OUT/'retour-erreur.png'))
  await acknowledge(page)
  # Timer commits before release, release must never turn the animal back into a cross.
  await hold(page,2)
  assert await page.locator('[data-cell="2"] img').count()==1
  await page.mouse.up();assert await page.locator('[data-cell="2"] .cross').count()==0
  assert await page.locator('#effects .success').count()==1
  await page.locator('#undo').click();assert await page.locator('[data-cell="2"] img').count()==0
  assert (await record(page))['records']['1']['errors']==1
  # A true touchscreen long press uses touchStart / touchEnd, not mouse emulation.
  cdp=await ctx.new_cdp_session(page);box=await page.locator('[data-cell="2"]').bounding_box();point={'x':box['x']+box['width']/2,'y':box['y']+box['height']/2}
  await cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[point]});await page.wait_for_timeout(970)
  assert await page.locator('[data-cell="2"] img').count()==1
  await cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
  assert (await record(page))['records']['1']['errors']==1
  # Keeping a wrong square pressed counts once; its release must not create another action.
  await hold(page,3,1100);assert (await record(page))['records']['1']['errors']==2
  await page.mouse.up();assert (await record(page))['records']['1']['errors']==2
  assert await page.locator('#mistake').is_visible()
  assert 'ligne' in await page.locator('#errorRule').inner_text()
  await page.screenshot(path=str(OUT/'erreur-regle-ligne.png'))
  await acknowledge(page)
  await page.locator('[data-cell="0"]').press('Enter');assert await page.locator('#stars .earned').count()==1
  await acknowledge(page)
  await page.reload();assert (await record(page))['records']['1']['errors']==3
  # Error count survives undo, but a deliberate new attempt resets it.
  await page.locator('[data-cell="4"]').press('Enter');await page.locator('#undo').click()
  assert (await record(page))['records']['1']['errors']==3
  await page.locator('#reset').click();await page.locator('#info .primary').click();assert await page.locator('#stars .earned').count()==3
  # A moving stroke cancels the long press, including a pause after moving.
  await hold(page,12,50);box=await page.locator('[data-cell="15"]').bounding_box();await page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2,steps=8);await page.wait_for_timeout(1000);assert await page.locator('.hold-indicator').count()==0;await page.mouse.up()
  assert await page.locator('#board .cross').count()==4
  assert await page.locator('#board img').count()==0
  assert (await record(page))['records']['1']['errors']==0
  await page.locator('#undo').click();assert await page.locator('#board .cross').count()==0
  # Cancellation before the timer cannot place or penalize later.
  await hold(page,0,80);await page.locator('#board').dispatch_event('pointercancel',{'pointerId':1});await page.mouse.up();await page.wait_for_timeout(500)
  assert (await record(page))['records']['1']['errors']==0
  assert await page.locator('#board .cross').count()==0
  # Three-star finish, best result saved, and protected from a later one-star replay.
  for cell in [2,4,11,13]:await page.locator(f'[data-cell="{cell}"]').press('Enter')
  assert await page.locator('#winStars .earned').count()==3
  assert (await record(page))['bestStars']['1']==3
  await page.wait_for_timeout(650)
  await page.screenshot(path=str(OUT/'retour-victoire.png'))
  await page.reload();assert await page.locator('#winStars .earned').count()==3
  await page.locator('#replay').click()
  for _ in range(3):
   await page.locator('[data-cell="0"]').press('Enter');await acknowledge(page)
  for cell in [2,4,11,13]:await page.locator(f'[data-cell="{cell}"]').press('Enter')
  assert await page.locator('#winStars .earned').count()==1
  assert (await record(page))['bestStars']['1']==3
  await page.locator('#replay').click();await page.locator('#help').click()
  assert await page.locator('.rule-drawing').count()==4
  await page.screenshot(path=str(OUT/'regles-dessinees.png'))
  await page.locator('#info .primary').click()
  # Fit the controls at different portrait/landscape sizes and verify real cell boundaries.
  layouts=[]
  for width,height in [(320,568),(360,640),(390,844),(768,1024),(844,390)]:
   await page.set_viewport_size({'width':width,'height':height})
   data=await page.evaluate('''()=>({viewport:[innerWidth,innerHeight],scroll:document.documentElement.scrollWidth,actions:document.querySelector('.actions').getBoundingClientRect().toJSON(),board:document.getElementById('board').getBoundingClientRect().toJSON(),cell:getComputedStyle(document.querySelector('.cell')).boxShadow})''')
   assert data['scroll']<=width,data
   assert data['actions']['bottom']<=height,data
   assert data['board']['width']>=min(width-30,240),data
   assert data['cell']=='none';layouts.append(data)
   await page.screenshot(path=str(OUT/f'lecture-{width}-{height}.png'),full_page=True)
  await page.set_viewport_size({'width':390,'height':844});await page.locator('#language').click();await page.locator('#help').click()
  assert await page.locator('#info h2').inner_text()=='How to play'
  assert await page.locator('.rule-drawing').count()==4
  await page.locator('#info .primary').click()
  # Reduced motion keeps all feedback and the score, without the bounce animations.
  await page.emulate_media(reduced_motion='reduce');await page.locator('[data-cell="0"]').press('Enter');assert await page.locator('#feedback').get_attribute('data-tone')=='error'
  assert await page.locator('#errorTitle').inner_text()=='Look at the rule'
  await acknowledge(page)
  # World 1 keeps the modal up to level 40; world 2 uses a readable seven-second banner.
  other=await browser.new_context(viewport={'width':390,'height':844},locale='fr-FR')
  await other.add_init_script("localStorage.setItem('les-petits-enclos.v1',JSON.stringify({lang:'fr',completed:Array.from({length:40},(_,i)=>i+1),records:{}}))")
  later=await other.new_page();await later.goto(URL+'?level=41');await later.locator('#board').wait_for()
  wrong=await later.evaluate('(PUZZLES.levels[40].solution[0]+1)%PUZZLES.levels[40].size')
  await later.locator(f'[data-cell="{wrong}"]').press('Enter');assert await later.locator('#mistake').is_hidden()
  assert float(await later.locator('#feedback').evaluate('e=>parseFloat(getComputedStyle(e).fontSize)'))>=16
  await later.wait_for_timeout(3500);assert await later.locator('#feedback').get_attribute('data-tone')=='error'
  await later.screenshot(path=str(OUT/'erreur-monde-2.png'))
  await later.goto(URL+'?level=40');await later.locator('#board').wait_for()
  wrong=await later.evaluate('(PUZZLES.levels[39].solution[0]+1)%PUZZLES.levels[39].size')
  await later.locator(f'[data-cell="{wrong}"]').press('Enter');assert await later.locator('#mistake').is_visible()
  await acknowledge(later);await other.close()
  assert not errors,errors
  print(json.dumps({'resultat':'appui long souris/tactile, erreurs immédiates, étoiles, sauvegarde, meilleur résultat, annulation, glissement, règles FR/EN et tailles d’écran OK','layouts':layouts},ensure_ascii=True))
  await browser.close()
asyncio.run(main())
