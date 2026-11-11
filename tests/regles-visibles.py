import asyncio,json,os
from pathlib import Path
from playwright.async_api import async_playwright
URL=os.environ.get('ENCLOS_URL','http://localhost:7374/')
OUT=Path(__file__).resolve().parent/'captures';OUT.mkdir(exist_ok=True)
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch();results=[];errors=[]
  for width,height in [(320,568),(360,640),(390,844),(768,1024),(844,390)]:
   ctx=await browser.new_context(viewport={'width':width,'height':height},locale='fr-FR');page=await ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
   await page.goto(URL+'?level=1');await page.locator('[data-cell="0"]').dblclick(delay=65);await page.wait_for_timeout(180)
   data=await page.evaluate('''()=>{const b=document.getElementById('board').getBoundingClientRect(),d=document.getElementById('mistake').getBoundingClientRect(),r=document.getElementById('errorRule').getBoundingClientRect();return {board:b.toJSON(),panel:d.toJSON(),rule:r.toJSON(),blur:getComputedStyle(document.getElementById('mistake'),'::backdrop').backdropFilter,scroll:document.documentElement.scrollWidth}}''')
   b,d=data['board'],data['panel']
   assert b['bottom']<=d['top']+1 or b['right']<=d['left']+1,(width,height,data)
   assert b['width']>=100 and b['top']>=0 and b['bottom']<=height,(width,height,data)
   assert data['blur']=='none' and data['scroll']<=width,data
   assert d['bottom']<=height+1 and d['top']>=0,data
   assert data['rule']['bottom']<=d['bottom']+1,(width,height,data)
   await page.screenshot(path=str(OUT/f'regle-en-bas-{width}-{height}.png'))
   await page.locator('#ackError').click();await page.wait_for_timeout(80)
   assert await page.locator('body').evaluate("b=>!b.classList.contains('rule-visible')")
   assert await page.locator('.rule-preview').count()==0
   await page.locator('[data-cell="2"]').dblclick(delay=65);await page.locator('[data-cell="3"]').dblclick(delay=65);await page.wait_for_timeout(100)
   assert await page.locator('#board .rule-related').count()==4
   assert await page.locator('[data-cell="2"] img').count()==1
   assert await page.locator('[data-cell="3"].rule-attempt').count()==1
   if width==390:await page.screenshot(path=str(OUT/'regle-ligne-sur-plateau.png'))
   await page.locator('#ackError').click();await page.locator('#hint').click();await page.wait_for_timeout(100)
   assert await page.locator('#info').evaluate("e=>e.classList.contains('rule-sheet')")
   assert await page.locator('body').evaluate("e=>e.classList.contains('rule-visible')")
   before=await page.evaluate("localStorage.getItem('les-petits-enclos.v1')")
   await page.locator('#info .primary').click();assert await page.evaluate("localStorage.getItem('les-petits-enclos.v1')")==before
   results.append([width,height,round(b['width']),round(d['height'])]);await ctx.close()
  assert not errors,errors
  print(json.dumps({'resultat':'plateau net et regle visibles ensemble, erreur situee et indice sans modification OK','formats':results}));await browser.close()
asyncio.run(main())
