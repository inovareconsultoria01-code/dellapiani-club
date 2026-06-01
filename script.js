const metas=[
 {valor:100000,premio:"Moto Elétrica"},
 {valor:200000,premio:"iPhone 17 Pro"},
 {valor:500000,premio:"Viagem Internacional / Home Cinema / Energia Solar"},
 {valor:1500000,premio:"Carro Elétrico Básico"},
 {valor:4000000,premio:"Carro Elétrico Luxo"}
];

function init(){
 if(!localStorage.getItem("dc_clientes")){
  localStorage.setItem("dc_clientes",JSON.stringify([
   {nome:"Cliente Exemplo",doc:"00000000000",pontos:12500,compras:125000},
   {nome:"Arquitetura Prime",doc:"11111111111",pontos:36500,compras:365000},
   {nome:"Construtora Recife",doc:"22222222222",pontos:82000,compras:820000}
  ]));
 }
 if(!localStorage.getItem("dc_promos")){
  localStorage.setItem("dc_promos",JSON.stringify([
   {titulo:"Black Premium",desc:"RT 10%. Invista nos produtos Black e avance nas metas para conquistar grandes benefícios.",pontos:100000},
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

function parseNumberBR(v){
 const only = String(v||"").replace(/\D/g,"");
 return Number(only||0);
}

function calcularCompras(pontos, comprasDigitadas){
 const c = parseNumberBR(comprasDigitadas);
 if(c > 0) return c;
 return Number(pontos||0) * 10;
}

function consultarCliente(){
 const doc=clean(document.getElementById("clienteDoc").value);
 const c=clientes().find(x=>clean(x.doc)===doc);
 const box=document.getElementById("clienteBox");

 if(!c){
  box.innerHTML="<hr><b>Cliente não encontrado.</b><p>Fale com a equipe comercial para atualizar seu cadastro.</p>";
  return;
 }

 const meta=metas.find(m=>c.compras<m.valor)||metas[metas.length-1];
 const falta=Math.max(0,meta.valor-c.compras);
 const perc=Math.min(100,(c.compras/meta.valor)*100);

 document.getElementById("homePontos").innerText=pts(c.pontos);
 document.getElementById("homeBar").style.width=perc+"%";
 document.getElementById("homeMeta").innerText=`Faltam ${money(falta)} para ${meta.premio}.`;

 box.innerHTML=`
  <hr>
  <h3>Olá, ${c.nome}</h3>
  <p><b>Pontos:</b> ${pts(c.pontos)}</p>
  <p><b>Compras acumuladas:</b> ${money(c.compras)}</p>
  <p><b>Próxima meta:</b> ${meta.premio}</p>
  <div class="progress" style="background:#e5e7eb"><div class="bar" style="width:${perc}%"></div></div>
 `;
}

function loginAdmin(){
 const u=document.getElementById("adminUser").value;
 const p=document.getElementById("adminPass").value;
 if(u==="admin" && p==="1234"){
  showPage("admin");
  renderAll();
 }else{
  alert("Usuário ou senha incorretos.");
 }
}

function logoutAdmin(){showPage("cliente");}

function salvarCliente(){
 const arr=clientes();
 const pontos=parseNumberBR(document.getElementById("pontosCliente").value);
 const compras=calcularCompras(pontos, document.getElementById("comprasCliente").value);

 const novo={
  nome:document.getElementById("nomeCliente").value.trim(),
  doc:clean(document.getElementById("docCliente").value),
  pontos:pontos,
  compras:compras
 };

 if(!novo.nome||!novo.doc){
  alert("Preencha nome e documento.");
  return;
 }

 const i=arr.findIndex(x=>clean(x.doc)===novo.doc);
 if(i>=0) arr[i]=novo; else arr.push(novo);

 localStorage.setItem("dc_clientes",JSON.stringify(arr));
 renderAll();
 alert("Cliente salvo!");
}

function salvarPromo(){
 const arr=promos();
 const nova={
  titulo:document.getElementById("tituloPromo").value.trim(),
  desc:document.getElementById("descPromo").value.trim(),
  pontos:parseNumberBR(document.getElementById("pontosPromo").value)
 };

 if(!nova.titulo){
  alert("Informe o título.");
  return;
 }

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

function detectarSeparador(linha){
 if(linha.includes(";")) return ";";
 if(linha.includes(",")) return ",";
 return null;
}

function separarLinha(linha){
 const sep = detectarSeparador(linha);
 if(sep) return linha.split(sep).map(x=>(x||"").trim());

 // fallback para linhas coladas com espaços/tabs:
 // captura: NOME + DOCUMENTO + PONTOS + resto
 const m = linha.trim().match(/^(.+?)\s+([0-9./-]+|REP|~|~~|\(vazio\))\s+([0-9.]+)\s+(.*)$/i);
 if(m) return [m[1].trim(), m[2].trim(), m[3].trim(), m[4].trim()];

 return [linha.trim(),"","",""];
}

function importarCSV(){
 const texto=document.getElementById("csvImport").value.trim();
 if(!texto){
  alert("Cole os dados.");
  return;
 }

 const linhas=texto.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
 const arr=clientes();
 let importados=0;
 let ignorados=0;

 linhas.forEach(l=>{
  const dados=separarLinha(l);

  let nome=(dados[0]||"").trim();
  let doc=(dados[1]||"").trim();
  let pontos=parseNumberBR(dados[2]||"0");
  let compras=calcularCompras(pontos, dados[3]);

  // pula cabeçalho
  if(nome.toLowerCase().includes("nome") && doc.toLowerCase().includes("documento")) return;

  if(!doc || doc==="~" || doc==="~~" || doc.toLowerCase()==="rep" || doc.toLowerCase()==="(vazio)"){
   doc = nome + "-" + String(importados+1);
  }

  const docLimpo=clean(doc);

  if(nome && docLimpo && pontos>0){
   const novo={nome:nome,doc:docLimpo,pontos:pontos,compras:compras};
   const i=arr.findIndex(x=>clean(x.doc)===docLimpo);
   if(i>=0) arr[i]=novo; else arr.push(novo);
   importados++;
  }else{
   ignorados++;
  }
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

function baixarModeloCSV(){
 const conteudo = "nome,documento,pontos,compras\nWESLEY BARBOSA,4801,17196,171960\nYARA PAIVA,1285,10000,100000\n";
 const blob = new Blob([conteudo], {type:"text/csv;charset=utf-8"});
 const url = URL.createObjectURL(blob);
 const a = document.createElement("a");
 a.href = url;
 a.download = "modelo_importacao_dellapiani.csv";
 document.body.appendChild(a);
 a.click();
 document.body.removeChild(a);
 URL.revokeObjectURL(url);
}

function renderAll(){
 const cs=clientes(), ps=promos();

 document.getElementById("promoGrid").innerHTML=ps.map(p=>`
  <div class="promo-card">
   <b>${pts(p.pontos)}</b>
   <h3>${p.titulo}</h3>
   <p>${p.desc}</p>
  </div>
 `).join("");

 const ordenados=[...cs].sort((a,b)=>b.pontos-a.pontos);

 document.getElementById("rankingBody").innerHTML=ordenados.map((c,i)=>`
  <tr>
   <td>#${i+1}</td>
   <td>${c.nome}</td>
   <td>${c.doc}</td>
   <td>${pts(c.pontos)}</td>
   <td>${money(c.compras)}</td>
   <td>${c.compras>=500000?"Premium":"Ativo"}</td>
  </tr>
 `).join("");

 document.getElementById("adminClientes").innerHTML=cs.map(c=>`
  <tr>
   <td>${c.nome}</td>
   <td>${c.doc}</td>
   <td>${pts(c.pontos)}</td>
   <td>${money(c.compras)}</td>
   <td><button onclick="excluirCliente('${c.doc}')" class="btn danger">Excluir</button></td>
  </tr>
 `).join("");

 document.getElementById("statClientes").innerText=cs.length;
 document.getElementById("statPontos").innerText=cs.reduce((s,c)=>s+Number(c.pontos||0),0).toLocaleString("pt-BR");
 document.getElementById("statCompras").innerText=money(cs.reduce((s,c)=>s+Number(c.compras||0),0));
 document.getElementById("statPromos").innerText=ps.length;
}

init();
