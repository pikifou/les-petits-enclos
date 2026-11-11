import asyncio,json,os
from pathlib import Path
from playwright.async_api import async_playwright
URL=os.environ.get('ENCLOS_URL','http://localhost:7374/')
OUT=Path(__file__).resolve().parent/'captures';OUT.mkdir(exist_ok=True)
KEY='les-petits-enclos.v1'
async def get_save(page):return json.loads(await page.evaluate(f'localStorage.getItem("{KEY}")'))
async def drag(page,cells):
 boxes=[await page.locator(f'[data-cell="{cell}"]').bounding_box() for cell in cells]
 a,b=boxes[0],boxes[-1];await page.mouse.move(a['x']+a['width']/2,a['y']+a['height']/2);await page.mouse.down();await page.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2,steps=20);await page.mouse.up()
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch();ctx=await browser.new_context(viewport={'width':390,'height':844},locale='fr-FR',has_touch=True)
  page=await ctx.new_page();page.set_default_timeout(7000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  await page.goto(URL);await page.locator('#training').click();assert await page.locator('#trainingCard').is_visible()
  assert await page.locator('#trainingValidated').is_hidden()
  # Rounded tiles, pure white gaps and no remaining gray borders. A gap is not a square.
  styles=await page.locator('#board').evaluate("b=>({bg:getComputedStyle(b).backgroundColor,gap:parseFloat(getComputedStyle(b).columnGap),radius:parseFloat(getComputedStyle(b.firstElementChild).borderRadius),shadow:getComputedStyle(b.firstElementChild).boxShadow})")
  assert styles['bg']=='rgb(255, 255, 255)' and styles['gap']>=4 and styles['radius']>0 and styles['shadow']=='none',styles
  box=await page.locator('[data-cell="0"]').bounding_box();await page.mouse.click(box['x']+box['width']+styles['gap']/2,box['y']+box['height']/2)
  assert await page.locator('#board .cross').count()==0
  # 1 Place by a real long press.
  box=await page.locator('[data-cell="2"]').bounding_box();await page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2);await page.mouse.down();await page.wait_for_timeout(960);await page.mouse.up()
  assert await page.locator('#trainingValidated').is_visible();await page.reload();assert await page.locator('#trainingValidated').is_visible()
  await page.locator('#trainingNext').click()
  # 2 Remove, reload, then Undo: the exercise and undo stack survive reload together.
  await page.locator('[data-cell="2"]').dblclick(delay=65);assert 'Annuler' in await page.locator('#trainingInstruction').inner_text()
  await page.reload();await page.locator('#undo').click();assert await page.locator('#trainingValidated').is_visible();await page.locator('#trainingNext').click()
  # 3 Mark and erase.
  await page.locator('[data-cell="6"]').click();assert await page.locator('#trainingValidated').is_hidden();await page.wait_for_timeout(360);await page.locator('[data-cell="6"]').click();assert await page.locator('#trainingValidated').is_visible();await page.locator('#trainingNext').click()
  # 4/5 A real drag, including across the white gaps.
  for cells in [[0,1,2,3],[0,4,8,12]]:
   assert await page.locator('#trainingValidated').is_hidden();await drag(page,cells);assert await page.locator('#trainingValidated').is_visible();await page.locator('#trainingNext').click()
  await page.screenshot(path=str(OUT/'mission-ligne.png'))
  # 6/7/8 Row, column, enclosure. A wrong choice gives the normal explanation.
  await page.locator('[data-cell="0"]').press('Enter');assert await page.locator('#mistake').is_visible();await page.locator('#ackError').click();assert await page.locator('#trainingValidated').is_hidden()
  for cell in [2,4,11]:
   await page.locator(f'[data-cell="{cell}"]').press('Enter');assert await page.locator('#trainingValidated').is_visible();await page.locator('#trainingNext').click()
  # 9 Diagonal neighbors.
  await page.locator('[data-cell="1"]').press('Enter');assert 'coin' in await page.locator('#errorRule').inner_text();await page.locator('#ackError').click()
  await page.locator('[data-cell="2"]').press('Enter');assert await page.locator('#trainingValidated').is_visible();await page.locator('#trainingNext').click()
  # 10 A complete puzzle, then the real adventure starts at its unchanged first level.
  await page.locator('#hint').click();await page.locator('#info .primary').click()
  for cell in [2,4,11,13]:await page.locator(f'[data-cell="{cell}"]').press('Enter')
  assert await page.locator('#victory').is_hidden();assert await page.locator('#trainingValidated').is_visible()
  saved=await get_save(page);assert sorted(saved['training']['completed'])==list(range(10));assert saved['completed']==[];assert saved['records']=={}
  kit=await page.evaluate('Ludi.data()');assert 'enclos_termines' not in kit['progress'];assert kit['progress']['missions_entrainement']['value']==10
  await page.screenshot(path=str(OUT/'entrainement-termine.png'))
  await page.locator('#trainingNext').click();assert await page.locator('#trainingCard').is_hidden();assert await page.locator('#number').inner_text()=='1';assert await page.locator('#board img').count()==0
  # Main save stays intact when visiting and leaving practice.
  await page.locator('[data-cell="2"]').press('Enter');before=(await get_save(page))['records']
  await page.locator('#map').click();await page.locator('#training').click();await page.locator('#map').click();assert (await get_save(page))['records']==before
  await page.locator('#continue').click();assert await page.locator('[data-cell="2"] img').count()==1
  # Basic tutorial layout and bilingual copy.
  await page.locator('#map').click();await page.locator('#training').click()
  for width,height in [(320,568),(360,640),(390,844),(768,1024),(844,390)]:
   await page.set_viewport_size({'width':width,'height':height})
   bounds=await page.locator('.actions').bounding_box();assert bounds['y']+bounds['height']<=height+1,(width,height,bounds)
   assert await page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   if width==390:await page.screenshot(path=str(OUT/'entrainement-debut.png'))
  await page.locator('#language').click();assert await page.locator('#trainingTitle').inner_text()=='Place an animal'
  assert not errors,errors
  print('10 missions validees, gestes, reprise, annulation, sauvegarde separee, espaces blancs, regles, FR/EN et cinq formats OK')
  await browser.close()
asyncio.run(main())
