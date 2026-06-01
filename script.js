const metas=[
 {valor:100000,premio:"Moto Elétrica"},
 {valor:200000,premio:"iPhone 17 Pro"},
 {valor:500000,premio:"Viagem Internacional / Home Cinema / Energia Solar"},
 {valor:1500000,premio:"Carro Elétrico Básico"},
 {valor:4000000,premio:"Carro Elétrico Luxo"}
];

const produtosBlack=[
 {nome:"Corso",desc:"Porcelanato de alto padrão com visual sofisticado em mármore claro.",img:"catalogo_pagina_03.jpg",tags:["Porcelanato","160x160cm","Exclusivo Black"]},
 {nome:"Luzon",desc:"Linha com estética cimentícia em tons urbanos e modernos.",img:"catalogo_pagina_04.jpg",tags:["Porcelanato","160x160cm","Cimentício"]},
 {nome:"Casca",desc:"Revestimento com textura orgânica e opções de cores naturais.",img:"catalogo_pagina_05.jpg",tags:["Revestimento","60x60cm","Texturizado"]},
 {nome:"Brava",desc:"Superfícies neutras para ambientes elegantes, leves e contemporâneos.",img:"catalogo_pagina_06.jpg",tags:["Porcelanato","90x90cm","Alto padrão"]},
 {nome:"Brava Filete",desc:"Revestimento em formato filete para banheiros e áreas especiais.",img:"catalogo_pagina_07.jpg",tags:["Filete","5x40cm","Banheiro"]},
 {nome:"Bonsai",desc:"Porcelanato para áreas internas e externas com acabamento sofisticado.",img:"catalogo_pagina_08.jpg",tags:["Porcelanato","100x100cm","Externo"]},
 {nome:"Bonsai Cores",desc:"Variações Osso, Marfim e Grafite para composições arquitetônicas.",img:"catalogo_pagina_09.jpg",tags:["Osso","Marfim","Grafite"]},
 {nome:"Bergamo",desc:"Linha Off White para ambientes integrados, varandas e áreas gourmet.",img:"catalogo_pagina_10.jpg",tags:["Off White","120x120cm","Gourmet"]},
 {nome:"Turim",desc:"Porcelanato Off White em estética clean para projetos minimalistas.",img:"catalogo_pagina_11.jpg",tags:["Off White","90x90cm","Minimalista"]},
 {nome:"Litoral",desc:"Linha amadeirada para projetos aconchegantes e naturais.",img:"catalogo_pagina_12.jpg",tags:["Madeira","19,7x120cm","Natural"]},
 {nome:"Garda",desc:"Deck amadeirado para áreas externas e projetos com piscina.",img:"catalogo_pagina_13.jpg",tags:["Deck","Externo","Piscina"]},
 {nome:"Zigzag",desc:"Azulejo decorativo com textura e personalidade para paredes.",img:"catalogo_pagina_14.jpg",tags:["Azulejo","30x90cm","Decorativo"]},
 {nome:"Labirint",desc:"Wall tile com padrão marcante para composições sofisticadas.",img:"catalogo_pagina_15.jpg",tags:["Wall Tile","30x90cm","Decorativo"]}
];

let clienteResgateAtual=null;

function init(){
 if(!localStorage.getItem("dc_clientes")){
  localStorage.setItem("dc_clientes",JSON.stringify([
   {nome:"Cliente Exemplo",doc:"00000000000",pontos:12500,compras:12500},
   {nome:"Arquitetura Prime",doc:"11111111111",pontos:36500,compras:36500},
   {nome:"Construtora Recife",doc:"22222222222",pontos:82000,compras:82000}
  ]));
 }
 if(!localStorage.getItem("dc_promos")){
  localStorage.setItem("dc_promos",JSON.stringify([
   {titulo:"Black Premium",desc:"RT 10%. Invista nos produtos Black e avance nas metas para conquistar grandes benefícios.",pontos:100000},
   {titulo:"Produtos Black",desc:"Linhas exclusivas participantes da campanha Black Premium.",pontos:0},
   {titulo:"Regra de Pontos",desc:"A cada R$ 1,00 em compras elegíveis, o cliente acumula 1 ponto.",pontos:1}
  ]));
 }
 if(!localStorage.getItem("dc_resgates")){
  localStorage.setItem("dc_resgates",JSON.stringify([]));
 }
 renderAll();
}

function showPage(id){
 document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
 document.getElementById(id).classList.add("active");
 window.scrollTo({top:0,behavior:"smooth"});
}

function clean(v){return (v||"").replace(/\D/g,"")}
function money(v){return Number(v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
function pts(v){return Number(v||0).toLocaleString("pt-BR")+" pts"}
function clientes(){return JSON.parse(localStorage.getItem("dc_clientes")||"[]")}
function promos(){return JSON.parse(localStorage.getItem("dc_promos")||"[]")}
function resgates(){return JSON.parse(localStorage.getItem("dc_resgates")||"[]")}

function parseNumberBR(v){
 const only = String(v||"").replace(/\D/g,"");
 return Number(only||0);
}

function calcularCompras(pontos, comprasDigitadas){
 const c = parseNumberBR(comprasDigitadas);
 if(c > 0) return c;
 return Number(pontos||0);
}

function buscarPorDoc(doc){
 const d=clean(doc);
 return clientes().find(x=>clean(x.doc)===d);
}

function consultarCliente(){
 const c=buscarPorDoc(document.getElementById("clienteDoc").value);
 const box=document.getElementById("clienteBox");

 if(!c){
  box.innerHTML="<hr><b>Cliente não encontrado.</b><p>Fale com a equipe comercial para atualizar seu cadastro.</p>";
  return;
 }

 const meta=metas.find(m=>c.pontos<m.valor)||metas[metas.length-1];
 const falta=Math.max(0,meta.valor-c.pontos);
 const perc=Math.min(100,(c.pontos/meta.valor)*100);

 document.getElementById("homePontos").innerText=pts(c.pontos);
 document.getElementById("homeBar").style.width=perc+"%";
 document.getElementById("homeMeta").innerText=`Faltam ${pts(falta)} para ${meta.premio}.`;

 box.innerHTML=`
  <hr>
  <h3>Olá, ${c.nome}</h3>
  <p><b>Pontos:</b> ${pts(c.pontos)}</p>
  <p><b>Compras acumuladas:</b> ${money(c.compras)}</p>
  <p><b>Próxima meta:</b> ${meta.premio}</p>
  <div class="progress" style="background:#e5e7eb"><div class="bar" style="width:${perc}%"></div></div>
  <button class="btn gold" onclick="prepararResgate('${c.doc}')">Resgatar pontos</button>
 `;
}

function prepararResgate(doc){
 showPage("resgate");
 document.getElementById("resgateDoc").value=doc;
 consultarParaResgate();
}

function consultarParaResgate(){
 const c=buscarPorDoc(document.getElementById("resgateDoc").value);
 const box=document.getElementById("resgateClienteBox");
 clienteResgateAtual=c||null;

 if(!c){
  box.innerHTML='<div class="alert-error"><b>Cliente não encontrado.</b><br>Confira o CPF/CNPJ ou código.</div>';
  return;
 }

 box.innerHTML=`
  <div class="alert-ok">
   <b>${c.nome}</b><br>
   Documento: ${c.doc}<br>
   Saldo: ${pts(c.pontos)}<br>
   Compras: ${money(c.compras)}
  </div>
 `;
}

function solicitarResgate(){
 const msg=document.getElementById("resgateMsg");
 if(!clienteResgateAtual){
  consultarParaResgate();
  if(!clienteResgateAtual){
   msg.innerHTML='<div class="alert-error">Consulte um cliente válido antes de solicitar o resgate.</div>';
   return;
  }
 }

 const [custo,premio]=document.getElementById("resgatePremio").value.split("|");
 const custoNum=Number(custo);
 const whats=document.getElementById("resgateWhatsapp").value.trim();
 const obs=document.getElementById("resgateObs").value.trim();

 if(clienteResgateAtual.pontos < custoNum){
  msg.innerHTML=`<div class="alert-error"><b>Saldo insuficiente.</b><br>Cliente possui ${pts(clienteResgateAtual.pontos)} e precisa de ${pts(custoNum)}.</div>`;
  return;
 }

 const arr=resgates();
 arr.push({data:new Date().toLocaleString("pt-BR"),nome:clienteResgateAtual.nome,doc:clienteResgateAtual.doc,premio:premio,pontos:custoNum,whatsapp:whats,obs:obs,status:"Pendente"});
 localStorage.setItem("dc_resgates",JSON.stringify(arr));
 renderAll();
 msg.innerHTML=`<div class="alert-ok"><b>Solicitação enviada!</b><br>O resgate de ${premio} foi registrado e ficará pendente de análise.</div>`;
}

function loginAdmin(){
 const u=document.getElementById("adminUser").value;
 const p=document.getElementById("adminPass").value;
 if(u==="admin" && p==="1234"){showPage("admin");renderAll();}else{alert("Usuário ou senha incorretos.");}
}

function logoutAdmin(){showPage("cliente");}

function salvarCliente(){
 const arr=clientes();
 const pontos=parseNumberBR(document.getElementById("pontosCliente").value);
 const compras=calcularCompras(pontos, document.getElementById("comprasCliente").value);
 const novo={nome:document.getElementById("nomeCliente").value.trim(),doc:clean(document.getElementById("docCliente").value),pontos:pontos,compras:compras};
 if(!novo.nome||!novo.doc){alert("Preencha nome e documento.");return;}
 const i=arr.findIndex(x=>clean(x.doc)===novo.doc);
 if(i>=0) arr[i]=novo; else arr.push(novo);
 localStorage.setItem("dc_clientes",JSON.stringify(arr));
 renderAll();
 alert("Cliente salvo!");
}

function salvarPromo(){
 const arr=promos();
 const nova={titulo:document.getElementById("tituloPromo").value.trim(),desc:document.getElementById("descPromo").value.trim(),pontos:parseNumberBR(document.getElementById("pontosPromo").value)};
 if(!nova.titulo){alert("Informe o título.");return;}
 arr.push(nova);
 localStorage.setItem("dc_promos",JSON.stringify(arr));
 renderAll();
 alert("Promoção salva!");
}

function excluirCliente(doc){
 if(confirm("Excluir cliente?")){
  localStorage.setItem("dc_clientes",JSON.stringify(clientes().filter(c=>clean(c.doc)!==clean(doc))));
  renderAll();
 }
}

function detectarSeparador(linha){if(linha.includes(";")) return ";"; if(linha.includes(",")) return ","; return null;}
function separarLinha(linha){
 const sep = detectarSeparador(linha);
 if(sep) return linha.split(sep).map(x=>(x||"").trim());
 const m = linha.trim().match(/^(.+?)\s+([0-9./-]+|REP|~|~~|\(vazio\))\s+([0-9.]+)\s+(.*)$/i);
 if(m) return [m[1].trim(), m[2].trim(), m[3].trim(), m[4].trim()];
 return [linha.trim(),"","",""];
}

function importarCSV(){
 const texto=document.getElementById("csvImport").value.trim();
 if(!texto){alert("Cole os dados.");return;}
 const linhas=texto.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
 const arr=clientes();
 let importados=0, ignorados=0;
 linhas.forEach(l=>{
  const dados=separarLinha(l);
  let nome=(dados[0]||"").trim();
  let doc=(dados[1]||"").trim();
  let pontos=parseNumberBR(dados[2]||"0");
  let compras=calcularCompras(pontos, dados[3]);
  if(nome.toLowerCase().includes("nome") && doc.toLowerCase().includes("documento")) return;
  if(!doc || doc==="~" || doc==="~~" || doc.toLowerCase()==="rep" || doc.toLowerCase()==="(vazio)") doc = nome + "-" + String(importados+1);
  const docLimpo=clean(doc);
  if(nome && docLimpo && pontos>0){
   const novo={nome:nome,doc:docLimpo,pontos:pontos,compras:compras};
   const i=arr.findIndex(x=>clean(x.doc)===docLimpo);
   if(i>=0) arr[i]=novo; else arr.push(novo);
   importados++;
  }else{ignorados++;}
 });
 localStorage.setItem("dc_clientes",JSON.stringify(arr));
 renderAll();
 alert(`Importação concluída! Importados: ${importados}. Ignorados: ${ignorados}.`);
}

function limparClientes(){
 if(confirm("Deseja apagar todos os clientes cadastrados neste navegador?")){
  localStorage.setItem("dc_clientes",JSON.stringify([]));
  renderAll();
  alert("Clientes apagados.");
 }
}

function atualizarStatusResgate(index,status){
 const arr=resgates();
 if(arr[index]){arr[index].status=status;localStorage.setItem("dc_resgates",JSON.stringify(arr));renderAll();}
}

function excluirResgate(index){
 if(confirm("Excluir solicitação de resgate?")){
  const arr=resgates(); arr.splice(index,1); localStorage.setItem("dc_resgates",JSON.stringify(arr)); renderAll();
 }
}

function baixarModeloCSV(){
 const conteudo = "nome,documento,pontos,compras\nWESLEY BARBOSA,4801,17196,17196\nYARA PAIVA,1285,10000,10000\n";
 const blob = new Blob([conteudo], {type:"text/csv;charset=utf-8"});
 const url = URL.createObjectURL(blob);
 const a = document.createElement("a");
 a.href = url; a.download = "modelo_importacao_dellapiani.csv";
 document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

function renderAll(){
 const cs=clientes(), ps=promos(), rs=resgates();

 const productGrid=document.getElementById("produtosBlackGrid");
 if(productGrid){
  productGrid.innerHTML=produtosBlack.map(p=>`
   <article class="product-card">
    <img src="${p.img}" alt="${p.nome}" onerror="this.style.display='none'; this.parentElement.classList.add('image-missing');">
    <div class="product-info">
     <h3>${p.nome}</h3>
     <p>${p.desc}</p>
     <div class="product-tags">${p.tags.map(t=>`<span>${t}</span>`).join("")}</div>
     <button class="btn gold" onclick="showPage('cliente')">Consultar pontos</button>
    </div>
   </article>
  `).join("");
 }

 document.getElementById("promoGrid").innerHTML=ps.map(p=>`
  <div class="promo-card"><b>${pts(p.pontos)}</b><h3>${p.titulo}</h3><p>${p.desc}</p></div>
 `).join("");

 const ordenados=[...cs].sort((a,b)=>b.pontos-a.pontos);
 document.getElementById("rankingBody").innerHTML=ordenados.map((c,i)=>`
  <tr><td>#${i+1}</td><td>${c.nome}</td><td>${c.doc}</td><td>${pts(c.pontos)}</td><td>${money(c.compras)}</td><td>${c.pontos>=500000?"Premium":"Ativo"}</td></tr>
 `).join("");

 document.getElementById("adminClientes").innerHTML=cs.map(c=>`
  <tr><td>${c.nome}</td><td>${c.doc}</td><td>${pts(c.pontos)}</td><td>${money(c.compras)}</td><td><button onclick="excluirCliente('${c.doc}')" class="btn danger">Excluir</button></td></tr>
 `).join("");

 document.getElementById("adminResgates").innerHTML=rs.map((r,i)=>`
  <tr><td>${r.data}</td><td>${r.nome}</td><td>${r.doc}</td><td>${r.premio}</td><td>${pts(r.pontos)}</td><td>${r.whatsapp||"-"}</td><td>${r.status}</td>
  <td><button onclick="atualizarStatusResgate(${i},'Aprovado')" class="btn ok">Aprovar</button><button onclick="atualizarStatusResgate(${i},'Negado')" class="btn danger">Negar</button><button onclick="excluirResgate(${i})" class="btn dark">Excluir</button></td></tr>
 `).join("");

 document.getElementById("statClientes").innerText=cs.length;
 document.getElementById("statPontos").innerText=cs.reduce((s,c)=>s+Number(c.pontos||0),0).toLocaleString("pt-BR");
 document.getElementById("statCompras").innerText=money(cs.reduce((s,c)=>s+Number(c.compras||0),0));
 document.getElementById("statResgates").innerText=rs.length;
}

init();
