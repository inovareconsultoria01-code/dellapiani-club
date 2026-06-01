const metas=[{valor:100000,premio:"Moto elétrica"},{valor:200000,premio:"iPhone / Smartphone Premium"},{valor:500000,premio:"Viagem internacional"},{valor:1500000,premio:"Carro elétrico básico"},{valor:4000000,premio:"Carro elétrico luxo"}];

function init(){
 if(!localStorage.getItem("dc_clientes")){
  localStorage.setItem("dc_clientes",JSON.stringify([
   {nome:"Cliente Exemplo",doc:"00000000000",pontos:12500,compras:180000},
   {nome:"Arquitetura Prime",doc:"11111111111",pontos:36500,compras:510000},
   {nome:"Construtora Recife",doc:"22222222222",pontos:82000,compras:1520000}
  ]));
 }
 if(!localStorage.getItem("dc_promos")){
  localStorage.setItem("dc_promos",JSON.stringify([
   {titulo:"Black Premium",desc:"Compre produtos participantes e avance nas metas para conquistar grandes benefícios.",pontos:10000},
   {titulo:"Semana do Arquiteto",desc:"Condições especiais para escritórios parceiros e profissionais especificadores.",pontos:3000},
   {titulo:"Cashback Revestimentos",desc:"Ganhe pontos extras em linhas selecionadas de acabamento.",pontos:5000}
  ]));
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

function consultarCliente(){
 const doc=clean(document.getElementById("clienteDoc").value);
 const c=clientes().find(x=>x.doc===doc);
 const box=document.getElementById("clienteBox");
 if(!c){box.innerHTML="<hr><b>Cliente não encontrado.</b><p>Fale com a equipe comercial para atualizar seu cadastro.</p>";return;}
 const meta=metas.find(m=>c.compras<m.valor)||metas[metas.length-1];
 const falta=Math.max(0,meta.valor-c.compras);
 const perc=Math.min(100,(c.compras/meta.valor)*100);
 document.getElementById("homePontos").innerText=pts(c.pontos);
 document.getElementById("homeBar").style.width=perc+"%";
 document.getElementById("homeMeta").innerText=`Faltam ${money(falta)} para ${meta.premio}.`;
 box.innerHTML=`<hr><h3>Olá, ${c.nome}</h3><p><b>Pontos:</b> ${pts(c.pontos)}</p><p><b>Compras acumuladas:</b> ${money(c.compras)}</p><p><b>Próxima meta:</b> ${meta.premio}</p>`;
}

function loginAdmin(){
 const u=document.getElementById("adminUser").value;
 const p=document.getElementById("adminPass").value;
 if(u==="admin" && p==="1234"){showPage("admin");renderAll();}else{alert("Usuário ou senha incorretos.");}
}
function logoutAdmin(){showPage("cliente");}

function salvarCliente(){
 const arr=clientes();
 const novo={nome:document.getElementById("nomeCliente").value.trim(),doc:clean(document.getElementById("docCliente").value),pontos:Number(document.getElementById("pontosCliente").value||0),compras:Number(document.getElementById("comprasCliente").value||0)};
 if(!novo.nome||!novo.doc){alert("Preencha nome e documento.");return;}
 const i=arr.findIndex(x=>x.doc===novo.doc);
 if(i>=0)arr[i]=novo;else arr.push(novo);
 localStorage.setItem("dc_clientes",JSON.stringify(arr));
 renderAll();alert("Cliente salvo!");
}

function salvarPromo(){
 const arr=promos();
 const nova={titulo:document.getElementById("tituloPromo").value.trim(),desc:document.getElementById("descPromo").value.trim(),pontos:Number(document.getElementById("pontosPromo").value||0)};
 if(!nova.titulo){alert("Informe o título.");return;}
 arr.push(nova);localStorage.setItem("dc_promos",JSON.stringify(arr));
 renderAll();alert("Promoção salva!");
}

function excluirCliente(doc){
 if(confirm("Excluir cliente?")){
  localStorage.setItem("dc_clientes",JSON.stringify(clientes().filter(c=>c.doc!==doc)));
  renderAll();
 }
}

function importarCSV(){
 const linhas=document.getElementById("csvImport").value.trim().split("\n").filter(Boolean);
 if(!linhas.length){alert("Cole os dados CSV.");return;}
 const arr=clientes();
 linhas.forEach(l=>{
  const [nome,doc,pontos,compras]=l.split(",").map(x=>(x||"").trim());
  if(nome&&doc){
   const novo={nome,doc:clean(doc),pontos:Number(pontos||0),compras:Number(compras||0)};
   const i=arr.findIndex(x=>x.doc===novo.doc);
   if(i>=0)arr[i]=novo;else arr.push(novo);
  }
 });
 localStorage.setItem("dc_clientes",JSON.stringify(arr));
 renderAll();alert("Importação concluída!");
}

function renderAll(){
 const cs=clientes(), ps=promos();
 document.getElementById("promoGrid").innerHTML=ps.map(p=>`<div class="promo-card"><b>${pts(p.pontos)}</b><h3>${p.titulo}</h3><p>${p.desc}</p></div>`).join("");
 const ordenados=[...cs].sort((a,b)=>b.pontos-a.pontos);
 document.getElementById("rankingBody").innerHTML=ordenados.map((c,i)=>`<tr><td>#${i+1}</td><td>${c.nome}</td><td>${c.doc}</td><td>${pts(c.pontos)}</td><td>${money(c.compras)}</td><td>${c.compras>=500000?"Premium":"Ativo"}</td></tr>`).join("");
 document.getElementById("adminClientes").innerHTML=cs.map(c=>`<tr><td>${c.nome}</td><td>${c.doc}</td><td>${pts(c.pontos)}</td><td>${money(c.compras)}</td><td><button onclick="excluirCliente('${c.doc}')" class="btn danger">Excluir</button></td></tr>`).join("");
 document.getElementById("statClientes").innerText=cs.length;
 document.getElementById("statPontos").innerText=cs.reduce((s,c)=>s+c.pontos,0).toLocaleString("pt-BR");
 document.getElementById("statCompras").innerText=money(cs.reduce((s,c)=>s+c.compras,0));
 document.getElementById("statPromos").innerText=ps.length;
}
init();
