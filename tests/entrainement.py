import asyncio,json,os
from pathlib import Path
from playwright.async_api import async_playwright
URL=os.environ.get('ENCLOS_URL','http://localhost:7374/')
OUT=Path(__file__).resolve().parent/'captures';OUT.mkdir(exist_ok=True)
KEY='les-petits-enclos.v1'
async def saved(page):return json.loads(await page.evaluate(f'localStorage.getItem("{KEY}")'))
async def drag(page,a,b):
 boxes=[await page.locator(f'[data-cell="{cell}"]').bounding_box() for cell in [a,b]];a,b=boxes
 await page.mouse.move(a['x']+a['width']/2,a['y']+a['height']/2);await page.mouse.down();await page.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2,steps=18);await page.mouse.up()
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch();ctx=await browser.new_context(viewport={'width':390,'height':844},locale='fr-FR',has_touch=True)
  page=await ctx.new_page();page.set_default_timeout(8000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  await page.goto(URL);await page.locator('#training').click();assert await page.locator('#trainingTry').count()==0
  dims=[(1,4)]*6+[(4,1),(2,4),(2,4)]+[(3,4)]*2+[(5,5)]*4+[(4,4)]
  for index,(rows,cols) in enumerate(dims):
   board=page.locator('#board');assert await board.get_attribute('aria-rowcount')==str(rows);assert await board.get_attribute('aria-colcount')==str(cols)
   assert await page.locator('#board .cell').count()==rows*cols
   assert await page.locator('#trainingTry').count()==0
   if index in [5,6]:
    before=(await saved(page))['training']['session']['state']
    assert await page.locator('#guideHand').is_visible()
    await page.locator('[data-cell="0"]').click(force=True)
    assert (await saved(page))['training']['session']['state']==before
    await page.locator('#guideHand').wait_for(state='hidden')
    assert (await saved(page))['training']['session']['stage']=='try'
   else:
    assert (await saved(page))['training']['session']['stage']=='try'
    assert await page.locator('#guideHand').is_hidden()
   assert await page.locator('#trainingValidated').is_hidden()
   if index==0:
    await page.locator('[data-cell="0"]').dblclick(delay=60,force=True);assert await page.locator('#board img').count()==0
    await page.locator('[data-cell="1"]').click();assert await page.locator('#board img').count()==0;assert await page.locator('#board .cross').count()==0
    assert 'deux' in (await page.locator('#feedback').inner_text()).lower();await page.wait_for_timeout(360)
    await page.screenshot(path=str(OUT/'guide-1x4.png'))
   if index in [0,1]:await page.locator('[data-cell="1"]').dblclick(delay=60)
   elif index==2:
    await page.reload();assert (await saved(page))['training']['session']['stage']=='try';await page.locator('#undo').click()
   elif index in [3,4]:await page.locator('[data-cell="2"]').click()
   elif index in [5,6]:await drag(page,0,3)
   elif index in [7,8]:
    if index==8:
     await page.locator('[data-cell="5"]').dblclick(delay=60);assert 'colonne' in await page.locator('#feedback').inner_text();assert await page.locator('#trainingValidated').is_hidden()
    await page.locator('[data-cell="7"]').dblclick(delay=60)
   elif index==9:await page.locator('[data-cell="8"]').dblclick(delay=60)
   elif index==10:
    await page.locator('[data-cell="1"]').dblclick(delay=60);assert 'coin' in await page.locator('#feedback').inner_text();assert await page.locator('#mistake').is_hidden()
    await page.locator('[data-cell="2"]').dblclick(delay=60)
   elif index==11:
    await page.locator('[data-cell="2"]').click(force=True);assert 'seulement' in await page.locator('#feedback').inner_text();assert 'ligne' in await page.locator('#feedback').inner_text()
    assert await page.locator('[data-cell="2"] .cross').count()==0
    await drag(page,10,14)
   elif index==12:await drag(page,2,22)
   elif index==13:
    for cell in [6,8,16,18]:await page.locator(f'[data-cell="{cell}"]').click()
   elif index==14:
    assert await page.locator('#guideArrow').is_hidden()
    await page.locator('[data-cell="0"]').click(force=True);assert await page.locator('[data-cell="0"] .cross').count()==0
    for cell in [2,6,7,8,10,11,13,14,16,17,18]:await page.locator(f'[data-cell="{cell}"]').click()
    assert await page.locator('#trainingValidated').is_hidden();assert await page.locator('#counter').inner_text()=='11 / 12'
    await page.reload();assert await page.locator('#counter').inner_text()=='11 / 12'
    await page.locator('[data-cell="22"]').click();assert await page.locator('#board .cross').count()==12;assert await page.locator('[data-cell="12"] img').count()==1
    for cell in [0,1,3,4,5,9,15,19,20,21,23,24]:assert await page.locator(f'[data-cell="{cell}"] .cross').count()==0
   else:
    assert await page.locator('#guideArrow').is_hidden()
    await page.locator('#hint').click();assert await page.locator('.rule-drawing').count()==4;await page.locator('#info .primary').click()
    for cell in [2,4,11,13]:await page.locator(f'[data-cell="{cell}"]').dblclick(delay=60)
   assert await page.locator('#trainingValidated').is_visible(),index
   if index in [6,8,9,11,12,13,14,15]:await page.screenshot(path=str(OUT/f'guide-mission-{index+1}.png'))
   if index<15:await page.locator('#trainingNext').click()
  data=await saved(page);assert sorted(data['training']['completed'])==list(range(16));assert data['completed']==[] and data['records']=={}
  kit=await page.evaluate('Ludi.data()');assert 'enclos_termines' not in kit['progress'];assert kit['progress']['missions_entrainement']['value']==16
  await page.reload();assert await page.locator('#trainingValidated').is_visible();await page.locator('#trainingNext').click()
  assert await page.locator('#trainingCard').is_hidden();assert await page.locator('#board .cell').count()==16
  await page.locator('[data-cell="2"]').dblclick(delay=60);record=(await saved(page))['records']
  await page.locator('#map').click();await page.locator('#training').click();await page.locator('#map').click();assert (await saved(page))['records']==record
  assert not errors,errors
  # Une ancienne session 3x4 ne doit pas être réinterprétée sur la nouvelle 5x5.
  old=await saved(page);adventure=old['records'];old['training']['session']={'index':14,'stage':'try','done':False,'state':{'marks':[0,0,0,0,0,1,0,0,0,0,0,0],'heads':[-1,-1,-1,-1,-1,0,-1,-1,-1,-1,-1,-1],'selected':-1,'errors':0},'history':[]}
  await page.evaluate('([key,data])=>localStorage.setItem(key,JSON.stringify(data))',[KEY,old]);await page.goto(URL+'?practice=15')
  assert await page.locator('#board .cell').count()==25;assert await page.locator('[data-cell="12"] img').count()==1
  assert await page.locator('[data-cell="5"] img').count()==0;assert await page.locator('#counter').inner_text()=='0 / 12'
  assert (await saved(page))['records']==adventure
  print('16 exercices directs, demos automatiques, TP 5x5 avec douze croix jusqu’aux bords, reprise et sauvegarde separee OK')
  await browser.close()
asyncio.run(main())
