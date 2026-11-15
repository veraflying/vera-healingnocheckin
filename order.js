
(function(){
  var $=function(id){return document.getElementById(id);};
  var CATS=["紫微斗數","靈氣","占卜"];
  var BASE=0, ADDON=1;
  var ITEMS=[
    {c:0,n:"個案基本諮詢",p:1399,d:"線上一對一，40–60 分鐘，含大限與流年指引。",z:1},
    {c:0,n:"2027 流年詳批",p:980,d:"個案基本諮詢的加購項目，需搭配個案基本諮詢一起預約。針對 2027 這一年再多看一層，另外給你一頁重點和提醒。",z:1,addon:1},
    {c:0,n:"紫微×靈氣整合",p:2200,d:"個案基本諮詢加上 30 分鐘遠距靈氣。先看懂，再把它鬆開。",z:1},
    {c:0,n:"關係導航",p:2698,d:"個人深度解析加上關係攻略，70–100 分鐘。",z:1},
    {c:0,n:"雙人同行｜全效合盤",p:4999,d:"兩位的命盤加上深度關係合盤，110–160 分鐘。",z:1},
    {c:1,n:"靈氣療癒｜遠距",p:999,d:"靈氣簡單說，就是用手掌陪你放鬆的日式療法。遠距進行，住哪裡都可以。"},
    {c:1,n:"靈氣療癒｜實體",p:1399,d:"面對面進行，地點在桃園。"},
    {c:1,n:"臼井聖火靈氣｜入門工作坊",p:1688,d:"實體 2 小時，2–6 人小班，滿 2 人開班。靈氣介紹、能量體驗、冥想和交流。之後報名一二階可以全額折抵。",link:["填工作坊報名表單","https://forms.gle/31xfHaLxk3f94HTD6"]},
    {c:1,n:"臼井聖火靈氣｜一二階",p:16688,d:"實體連續 2 天，含點化與符號，頒發證書。有人報名才開班。",link:["用 LINE 詢問開課時間","https://lin.ee/IuBJs3j"]},
    {c:2,n:"紫靈牌占卜｜單個問題",p:299,d:"15–20 分鐘，適合想先問一件具體的事。"}
  ];
  var cat=0, picked=[];
  function money(n){return n.toLocaleString("en-US");}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
  function has(i){return picked.indexOf(i)>=0;}

  function renderTabs(){
    $("tabs").innerHTML=CATS.map(function(c,i){return '<button class="tab" role="tab" type="button" data-c="'+i+'" aria-selected="'+(i===cat)+'">'+c+'</button>';}).join("");
    Array.prototype.forEach.call($("tabs").children,function(b){b.addEventListener("click",function(){cat=+b.getAttribute("data-c");renderTabs();renderMenu();});});
  }
  function renderMenu(){
    $("menu").innerHTML=ITEMS.map(function(it,i){
      if(it.c!==cat) return "";
      var on=has(i), label=on?"已加入 ✓":(it.addon?"加購":"加入預約單");
      var act=it.link ? '<a class="add" href="'+it.link[1]+'" target="_blank" rel="noopener">'+it.link[0]+'</a>'
                      : '<button class="add" type="button" data-i="'+i+'" aria-pressed="'+on+'">'+label+'</button>';
      return '<div class="item'+(it.addon?' addon':'')+'"><span class="name">'+esc(it.n)+(it.addon?'<span class="tag">加購</span>':'')+'</span><span class="price">'+(it.addon?'+':'')+money(it.p)+'</span><span class="desc">'+esc(it.d)+'</span><span class="act">'+act+'</span></div>';
    }).join("");
    Array.prototype.forEach.call($("menu").querySelectorAll("button.add"),function(b){b.addEventListener("click",function(){toggle(+b.getAttribute("data-i"));});});
  }
  function toggle(i){
    var k=picked.indexOf(i);
    if(k>=0){
      picked.splice(k,1);
      if(i===BASE && has(ADDON)) picked.splice(picked.indexOf(ADDON),1);   // 拿掉基本諮詢，加購一起拿掉
    }else{
      if(i===ADDON && !has(BASE)) picked.push(BASE);                        // 加購時自動帶入基本諮詢
      picked.push(i);
    }
    renderMenu(); renderOrder();
  }
  function renderOrder(){
    var sum=0;
    $("picked").innerHTML=picked.length ? picked.map(function(i){sum+=ITEMS[i].p;return '<li><span>'+esc(ITEMS[i].n)+(ITEMS[i].addon?'（加購）':'')+'</span><span class="p">'+money(ITEMS[i].p)+'</span><button type="button" data-i="'+i+'" aria-label="移除 '+esc(ITEMS[i].n)+'">✕</button></li>';}).join("")
      : '<li class="empty">還沒有選服務。點「加入預約單」就會出現在這裡。</li>';
    Array.prototype.forEach.call($("picked").querySelectorAll("button"),function(b){b.addEventListener("click",function(){toggle(+b.getAttribute("data-i"));});});
    $("total").textContent=money(sum);
    $("bar").hidden=!picked.length;
    $("barText").textContent="已選 "+picked.length+" 項 · "+money(sum);
    var v=function(id){return $(id).value.trim()||"（未填）";};
    var zw=picked.some(function(i){return ITEMS[i].z;});
    var lines=["【預約單｜來自微辣個人網站】",
      "項目："+(picked.length?picked.map(function(i){return ITEMS[i].n+(ITEMS[i].addon?"（加購）":"")+" "+money(ITEMS[i].p);}).join("、"):"（尚未選擇）"),
      "合計："+money(sum),
      "稱呼："+v("oName"),"LINE 名稱："+v("oLine"),"方便時段："+v("oTime"),"備註："+v("oNote")];
    if(zw) lines.push("生日資料：我會另外貼上命盤自我檢查的摘要，或補上國曆生日、出生時間、性別、出生地。");
    $("summary").textContent=lines.join("\n");
  }
  ["oName","oLine","oTime","oNote"].forEach(function(id){$(id).addEventListener("input",renderOrder);});
  $("copy").addEventListener("click",function(){
    var m=$("copyMsg");
    if(!picked.length){m.textContent="請先選至少一項服務。";return;}
    var fb=function(){m.textContent="這支手機不能自動複製。請長按上面的預約單，全選後複製。";};
    try{navigator.clipboard.writeText($("summary").textContent).then(function(){m.textContent="已複製。打開 LINE 貼上就可以了。";},fb);}catch(e){fb();}
  });
  renderTabs(); renderMenu(); renderOrder();
})();
