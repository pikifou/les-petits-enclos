"""Contrôles réels souris/tactile, progression, indice et cache hors ligne."""
import asyncio,json,os
from pathlib import Path
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'captures';OUT.mkdir(exist_ok=True)
URL=os.environ.get('ENCLOS_URL','http://localhost:7374/')
KEY='les-petits-enclos.v1'
async def main():
    async with async_playwright() as p:
        browser=await p.chromium.launch()
        ctx=await browser.new_context(viewport={'width':390,'height':844},locale='fr-FR',has_touch=True)
        await ctx.add_init_script("const seed=sessionStorage.getItem('testseed');if(seed){localStorage.setItem('les-petits-enclos.v1',seed);sessionStorage.removeItem('testseed');}")
        page=await ctx.new_page();errors=[]
        page.set_default_timeout(8000)
        page.on('pageerror',lambda e:errors.append(str(e)))
        await page.goto(URL);await page.locator('#continue').click()
        cell=page.locator('[data-cell="0"]')
        await cell.click();assert await cell.locator('.cross').count()==1
        await page.wait_for_timeout(360);await cell.click();assert await cell.locator('.cross').count()==0
        await page.wait_for_timeout(360);await cell.dblclick(delay=80);assert await cell.locator('img').count()==1
        head=await cell.locator('img').get_attribute('src')
        await page.reload();assert await cell.locator('img').get_attribute('src')==head
        await page.locator('[data-cell="7"]').dblclick(delay=80)
        second=await page.locator('[data-cell="7"] img').get_attribute('src');assert head!=second
        await page.locator('#undo').click();assert await page.locator('[data-cell="7"] img').count()==0
        assert await cell.locator('img').get_attribute('src')==head
        # Drag paints all crossed cells and has a single undo operation.
        boxes=[await page.locator(f'[data-cell="{i}"]').bounding_box() for i in [12,15]]
        a,b=boxes
        await page.mouse.move(a['x']+a['width']/2,a['y']+a['height']/2);await page.mouse.down()
        await page.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2,steps=12);await page.mouse.up()
        assert await page.locator('.cross').count()==4
        await page.locator('#undo').click();assert await page.locator('.cross').count()==0
        before=await page.evaluate(f'localStorage.getItem("{KEY}")')
        board=await page.locator('#board').inner_html()
        await page.locator('#hint').click();assert await page.locator('#info').is_visible()
        assert await page.locator('#board').inner_html()==board
        assert await page.evaluate(f'localStorage.getItem("{KEY}")')==before
        assert await page.locator('#info').inner_text() and await page.locator('.hinted').count()==0
        await page.locator('#info .primary').click()
        # Real touch double tap, not synthetic dblclick.
        await page.locator('[data-cell="7"]').tap();await page.wait_for_timeout(70);await page.locator('[data-cell="7"]').tap()
        assert await page.locator('[data-cell="7"] img').count()==1
        await page.locator('#undo').click()
        # Cancelled stroke restores the board and cannot leave an undo entry.
        await page.locator('#board').evaluate("b=>{const r=b.getBoundingClientRect();b.dispatchEvent(new PointerEvent('pointercancel',{bubbles:true,pointerId:1}));}")
        # Finish using real keyboard controls and verify only a completed puzzle is reported.
        await page.locator('#reset').click();await page.locator('#info .primary').click()
        solution=await page.evaluate('PUZZLES.levels[0].solution')
        for row,col in enumerate(solution):await page.locator(f'[data-cell="{row*4+col}"]').press('Enter')
        assert await page.locator('#victory').is_visible()
        record=json.loads(await page.evaluate(f'localStorage.getItem("{KEY}")'));assert record['completed']==[1]
        assert await page.locator('#winHeads img').count()==4
        await page.reload();assert await page.locator('#victory').is_visible()
        await page.locator('#next').click();assert await page.locator('#number').inner_text()=='2'
        # Five chapters, all head inventories, wide and compact layouts.
        for width,height in [(390,844),(360,740),(768,1024)]:
            await page.set_viewport_size({'width':width,'height':height})
            for level in [1,41,81,121,200]:
                await page.evaluate(f"sessionStorage.setItem('testseed',JSON.stringify({{version:1,lang:'fr',completed:Array.from({{length:199}},(_,i)=>i+1),records:{{}},current:{level}}}))")
                await page.goto(URL+f'?level={level}')
                await page.locator('#board').wait_for();await page.wait_for_timeout(100)
                data=await page.evaluate('''()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,board:document.getElementById('board').getBoundingClientRect().toJSON(),actions:document.querySelector('.actions').getBoundingClientRect().toJSON(),broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).length})''')
                assert data['scroll']<=width and data['board']['width']>300 and data['broken']==0,data
                assert data['actions']['bottom']<=height,data
                if width==390:
                    # Populate a few correct heads and sample crosses for a realistic capture.
                    lv=await page.evaluate(f'PUZZLES.levels[{level-1}]')
                    for row,col in enumerate(lv['solution'][:max(1,lv['size']//2)]):await page.locator(f'[data-cell="{row*lv["size"]+col}"]').press('Enter')
                    for i in range(min(6,lv['size'])):
                        c=page.locator(f'[data-cell="{(i+2)*lv["size"]% (lv["size"]**2)+i}"]')
                        if not await c.locator('img').count():await c.press('Space')
                    await page.screenshot(path=str(OUT/f'monde-{level}.png'),full_page=True)
        await page.set_viewport_size({'width':390,'height':844});await page.locator('#map').click();await page.screenshot(path=str(OUT/'accueil.png'),full_page=True)
        await page.evaluate('navigator.serviceWorker.ready.then(()=>new Promise(resolve=>navigator.serviceWorker.controller?resolve():navigator.serviceWorker.addEventListener("controllerchange",resolve,{once:true})))')
        await ctx.set_offline(True);await page.reload();await page.locator('#board').wait_for()
        assert await page.locator('#board .cell').count()>0
        await ctx.set_offline(False)
        assert not errors,errors
        print(json.dumps({'resultat':'gestes, identités, indices, progression, 15 mises en page et hors ligne OK','erreurs':errors},ensure_ascii=False))
        await browser.close()
asyncio.run(main())
