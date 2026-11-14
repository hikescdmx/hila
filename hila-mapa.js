/* Mapa de México por estados (se carga al acercarse a la sección) */
(function(){
  var URL='https://cdn.jsdelivr.net/gh/angelnmara/geojson@master/mexicoHigh.json';
  var K=26;
  function P(c){return [(c[0]+118)*K*0.93,(33.2-c[1])*K];}
  function ring(r){var o=[],l=null;for(var i=0;i<r.length;i++){var p=P(r[i]);if(l&&Math.abs(p[0]-l[0])+Math.abs(p[1]-l[1])<1.1)continue;o.push(p[0].toFixed(1)+','+p[1].toFixed(1));l=p;}return o.length>2?'M'+o.join('L')+'Z':'';}
  var EXST={'MX-HID':['vf'],'MX-JAL':['col'],'MX-MEX':['rap'],'MX-CMX':['kay'],'MX-DIF':['kay']};
  var NAMES={vf:'Vía ferrata',col:'Nevado de Colima',rap:'Rapel',kay:'Kayak al amanecer'};
  function draw(geo){
    var g=document.getElementById('mx-states');if(!g)return;
    var NS='http://www.w3.org/2000/svg',frag=document.createDocumentFragment();
    geo.features.forEach(function(f){
      var gm=f.geometry,polys=gm.type==='Polygon'?[gm.coordinates]:gm.coordinates,d='';
      polys.forEach(function(p){p.forEach(function(r){d+=ring(r);});});
      var el=document.createElementNS(NS,'path');el.setAttribute('d',d);el.setAttribute('class','st');
      var id=f.properties.id,ex=EXST[id];el.dataset.name=f.properties.name;
      if(ex){el.classList.add('has');el.dataset.exp=ex.join(',');}
      frag.appendChild(el);
    });
    g.appendChild(frag);
    var land=document.getElementById('mx-land');if(land)land.style.display='none';
    var tip=document.getElementById('mx-tip'),svg=g.ownerSVGElement;
    var cur=null;
    function hl(t,on){if(t&&t.dataset.exp)t.dataset.exp.split(',').forEach(function(k){document.querySelectorAll('[data-id="'+k+'"]').forEach(function(x){x.classList[on?'add':'remove']('hi');});});}
    g.addEventListener('mouseover',function(e){var t=e.target;if(!t.classList.contains('st')||t===cur)return;
      hl(cur,false);cur=t;
      tip.innerHTML='<b>'+t.dataset.name+'</b>'+(t.dataset.exp?'<span>'+t.dataset.exp.split(',').map(function(k){return NAMES[k];}).join(' · ')+'</span>':'');tip.style.opacity=1;
      if(t.nextSibling)g.appendChild(t);hl(t,true);});
    g.addEventListener('mousemove',function(e){var r=svg.getBoundingClientRect();tip.style.left=(e.clientX-r.left)+'px';tip.style.top=(e.clientY-r.top)+'px';});
    g.addEventListener('mouseleave',function(){hl(cur,false);cur=null;tip.style.opacity=0;});
    svg.classList.add('ready');
  }
  window.hilaDrawMap=draw;
  function load(){fetch(URL).then(function(r){return r.json();}).then(draw).catch(function(){});}
  var sec=document.getElementById('mapa');if(!sec)return;
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){io.disconnect();load();}},{rootMargin:'600px'});io.observe(sec);}else load();
})();
