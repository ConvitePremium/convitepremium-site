const W='558894897535';
let convites=[],cat='todos',modeloSelecionado=null;

const grid=document.getElementById('catalogGrid'),
input=document.getElementById('searchInput'),
empty=document.getElementById('emptyState'),
filters=document.getElementById('filterList'),
modal=document.getElementById('videoModal'),
orderModal=document.getElementById('orderModal'),
vid=document.getElementById('modalVideo');

function norm(t){return String(t||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function wa(m){return `https://wa.me/${W}?text=${encodeURIComponent(m)}`}

async function init(){
  convites=await fetch('data/convites.json').then(r=>r.json());
  [...new Set(convites.map(c=>c.categoria))].forEach(c=>{
    filters.insertAdjacentHTML('beforeend',`<button class="filter" data-category="${c}">${c}</button>`)
  });
  render()
}

function card(c){
  return `<article class="model-card"><div class="thumb" data-open="${c.id}"><span class="tag">${c.selo}</span><img src="${c.thumbnail}" alt="${c.nome}" loading="lazy"><div class="play"><span>▶</span></div></div><div class="info"><p class="cat">${c.categoria}</p><h3>${c.nome}</h3><p>${c.descricao}</p><div class="card-actions"><button class="btn outline" data-open="${c.id}">Assistir modelo</button><button class="btn gold" data-order="${c.id}">Personalizar este modelo</button></div></div></article>`
}

function render(){
  let q=norm(input.value);
  let list=convites.filter(c=>(cat==='todos'||c.categoria===cat)&&norm(c.nome+' '+c.categoria+' '+c.descricao+' '+c.selo).includes(q));
  grid.innerHTML=list.map(card).join('');
  empty.style.display=list.length?'none':'block'
}

filters.onclick=e=>{
  let b=e.target.closest('.filter');
  if(!b)return;
  document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  cat=b.dataset.category;
  render()
};

input.oninput=render;

function abrirPedido(c){
  modeloSelecionado=c;
  document.getElementById('orderTitle').textContent=c.nome;
  document.getElementById('partyTheme').value=c.nome;
  orderModal.classList.add('active');
  document.body.style.overflow='hidden'
}

function fecharVideo(){
  modal.classList.remove('active');
  vid.pause();
  vid.innerHTML='';
  document.body.style.overflow=''
}

function fecharPedido(){
  orderModal.classList.remove('active');
  document.body.style.overflow=''
}

document.onclick=e=>{
  let o=e.target.closest('[data-open]'),
      cl=e.target.closest('[data-close]'),
      pedido=e.target.closest('[data-order]'),
      fecharForm=e.target.closest('[data-order-close]');

  if(o){
    let c=convites.find(x=>x.id===o.dataset.open);
    modeloSelecionado=c;

    document.getElementById('modalCategory').textContent=c.categoria;
    document.getElementById('modalTitle').textContent=c.nome;
    document.getElementById('modalDescription').textContent=c.descricao;
    document.getElementById('modalWhatsapp').onclick=()=>abrirPedido(c);

    vid.innerHTML=`<source src="${c.video}" type="video/mp4">`;
    vid.setAttribute('controlsList','nodownload');
    vid.setAttribute('disablePictureInPicture','');
    vid.setAttribute('playsinline','');
    vid.oncontextmenu=()=>false;

    vid.load();
    modal.classList.add('active');
    document.body.style.overflow='hidden'
  }

  if(pedido){
    let c=convites.find(x=>x.id===pedido.dataset.order);
    abrirPedido(c)
  }

  if(cl)fecharVideo();
  if(fecharForm)fecharPedido()
};

document.getElementById('sendOrder').onclick=()=>{
  const nome=document.getElementById('childName').value;
  const idade=document.getElementById('childAge').value;
  const tema=document.getElementById('partyTheme').value;
  const modo=document.getElementById('voiceMode').value;
  const data=document.getElementById('partyDate').value;
  const hora=document.getElementById('partyTime').value;
  const local=document.getElementById('partyPlace').value;

  const msg=`🎉 NOVO PEDIDO DE CONVITE

✨ Modelo escolhido:
${modeloSelecionado.nome}

👶 Nome da criança:
${nome}

🎂 Idade:
${idade}

🎨 Tema da festa:
${tema}

🎙️ Modo:
${modo}

📅 Dia da festa:
${data}

⏰ Horário:
${hora}

📍 Local:
${local}

✅ Enviado pelo site Convite Premium`;

  window.open(wa(msg),'_blank')
};

document.onkeydown=e=>{
  if(e.key==='Escape'){
    fecharVideo();
    fecharPedido()
  }
};

function iniciarNotificacoes(){
  const box=document.createElement('div');
  box.className='social-proof';
  document.body.appendChild(box);

  const titulos=[
    '💬 Orçamento solicitado',
    '⭐ Modelo em destaque',
    '🔥 Tema em alta',
    '✨ Cliente interessado'
  ];

  function mostrar(){
    if(!convites.length)return;
    const convite=convites[Math.floor(Math.random()*convites.length)];
    const titulo=titulos[Math.floor(Math.random()*titulos.length)];

    box.innerHTML=`
      <strong>${titulo}</strong>
      <p>Um cliente acabou de pedir informações sobre "${convite.nome}".</p>
      <span>há poucos minutos</span>
    `;

    box.classList.add('show');

    setTimeout(()=>{box.classList.remove('show')},6000);
  }

  setTimeout(mostrar,8000);
  setInterval(mostrar,30000);
}

setTimeout(iniciarNotificacoes,1500);
init();
