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
  await page.goto(URL);await page.locator('#training').click()
  dims=[(1,4)]*6+[(4,1),(2,4),(2,4),(3,4),(3,4),(4,4)]
  for index,(rows,cols) in enumerate(dims):
   board=page.locator('#board');assert await board.get_attribute('aria-rowcount')==str(rows);assert await board.get_attribute('aria-colcount')==str(cols)
   assert await page.locator('#board .cell').count()==rows*cols
   assert await page.locator('#counter').inner_text()=='Regarde'
   assert await page.locator('#guideArrow').is_visible()
   before=(await saved(page))['training']['session']['state']
   await page.locator('[data-cell="0"]').dblclick(delay=60,force=True)
   assert (await saved(page))['training']['session']['state']==before
   await page.locator('#trainingTry').click()
   assert await page.locator('#counter').inner_text()=='À toi'
   assert await page.locator('#trainingValidated').is_hidden()
   if index==0:
    assert await page.locator('#inventory button').count()==1
    await page.locator('[data-cell="0"]').dblclick(delay=60,force=True);assert await page.locator('#board img').count()==0
    await page.locator('[data-cell="1"]').click();assert await page.locator('#board img').count()==0;assert await page.locator('#board .cross').count()==0
    assert 'deux' in (await page.locator('#feedback').inner_text()).lower()
    await page.wait_for_timeout(360)
    await page.screenshot(path=str(OUT/'guide-1x4.png'))
   if index in [0,1]:await page.locator('[data-cell="1"]').dblclick(delay=60)
   elif index==2:
    await page.reload();assert await page.locator('#counter').inner_text()=='À toi';await page.locator('#undo').click()
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
   else:
    assert await page.locator('#guideArrow').is_hidden()
    await page.locator('#hint').click();assert await page.locator('.rule-drawing').count()==4;await page.locator('#info .primary').click()
    for cell in [2,4,11,13]:await page.locator(f'[data-cell="{cell}"]').dblclick(delay=60)
   assert await page.locator('#trainingValidated').is_visible(),index
   if index in [6,8,9,11]:await page.screenshot(path=str(OUT/f'guide-mission-{index+1}.png'))
   if index<11:await page.locator('#trainingNext').click()
  data=await saved(page);assert sorted(data['training']['completed'])==list(range(12));assert data['completed']==[] and data['records']=={}
  kit=await page.evaluate('Ludi.data()');assert 'enclos_termines' not in kit['progress'];assert kit['progress']['missions_entrainement']['value']==12
  await page.reload();assert await page.locator('#trainingValidated').is_visible();await page.locator('#trainingNext').click()
  assert await page.locator('#trainingCard').is_hidden();assert await page.locator('#board .cell').count()==16
  await page.locator('[data-cell="2"]').dblclick(delay=60);record=(await saved(page))['records']
  await page.locator('#map').click();await page.locator('#training').click();await page.locator('#map').click();assert (await saved(page))['records']==record
  assert not errors,errors
  print('12 exercices dedies, Regarde/A toi, fleches, cibles strictes, gestes, regles progressives, reprise et sauvegarde separee OK')
  await browser.close()
asyncio.run(main())
