const clientesBase = [
  {
    "nome": "WESLEY BARBOSA",
    "documento": "00.000.000/4801-00",
    "codigo": "4801",
    "pontos": 17196,
    "compras": 17196,
    "categoria": "PORCELANATO"
  },
  {
    "nome": "ACONCHEGO ARQUITETURA",
    "documento": "00.000.000/7272-00",
    "codigo": "7272",
    "pontos": 1146,
    "compras": 1146,
    "categoria": "PORCELANATO"
  },
  {
    "nome": "ADALBERTO NETO",
    "documento": "00.000.000/6919-00",
    "codigo": "6919",
    "pontos": 8175,
    "compras": 8175,
    "categoria": "PORCELANATO"
  },
  {
    "nome": "YARA PAIVA",
    "documento": "00.000.000/1285-00",
    "codigo": "1285",
    "pontos": 10000,
    "compras": 10000,
    "categoria": "PORCELANATO"
  },
  {
    "nome": "ZAMBON INTERIOR",
    "documento": "00.000.000/5993-00",
    "codigo": "5993",
    "pontos": 4977,
    "compras": 4977,
    "categoria": "PORCELANATO"
  },
  {
    "nome": "YONE LUZ",
    "documento": "00.000.000/8430-00",
    "codigo": "8430",
    "pontos": 3499,
    "compras": 3499,
    "categoria": "PORCELANATO"
  },
  {
    "nome": "ZIRPOLI ARQ",
    "documento": "00.000.000/8200-00",
    "codigo": "8200",
    "pontos": 1177,
    "compras": 1177,
    "categoria": "PORCELANATO"
  }
];

const produtosBlack = [
  {nome:"Corso",desc:"Porcelanato de alto padrão com visual sofisticado em mármore claro.",img:"catalogo_pagina_03.jpg",tags:["Porcelanato","160x160cm","Exclusivo Black"]},
  {nome:"Luzon",desc:"Linha com estética cimentícia em tons urbanos e modernos.",img:"catalogo_pagina_04.jpg",tags:["Porcelanato","160x160cm","Cimentício"]},
  {nome:"Casca",desc:"Revestimento com textura orgânica e opções de cores naturais.",img:"catalogo_pagina_05.jpg",tags:["Revestimento","60x60cm","Texturizado"]},
  {nome:"Brava",desc:"Superfícies neutras para ambientes elegantes, leves e contemporâneos.",img:"catalogo_pagina_06.jpg",tags:["Porcelanato","90x90cm","Alto padrão"]},
  {nome:"Bonsai",desc:"Porcelanato para áreas internas e externas com acabamento sofisticado.",img:"catalogo_pagina_08.jpg",tags:["Porcelanato","100x100cm","Externo"]},
  {nome:"Bergamo",desc:"Linha Off White para ambientes integrados, varandas e áreas gourmet.",img:"catalogo_pagina_10.jpg",tags:["Off White","120x120cm","Gourmet"]},
  {nome:"Turim",desc:"Porcelanato Off White em estética clean para projetos minimalistas.",img:"catalogo_pagina_11.jpg",tags:["Off White","90x90cm","Minimalista"]},
  {nome:"Litoral",desc:"Linha amadeirada para projetos aconchegantes e naturais.",img:"catalogo_pagina_12.jpg",tags:["Madeira","19,7x120cm","Natural"]},
  {nome:"Garda",desc:"Deck amadeirado para áreas externas e projetos com piscina.",img:"catalogo_pagina_13.jpg",tags:["Deck","Externo","Piscina"]},
  {nome:"Zigzag",desc:"Azulejo decorativo com textura e personalidade para paredes.",img:"catalogo_pagina_14.jpg",tags:["Azulejo","30x90cm","Decorativo"]},
  {nome:"Labirint",desc:"Wall tile com padrão marcante para composições sofisticadas.",img:"catalogo_pagina_15.jpg",tags:["Wall Tile","30x90cm","Decorativo"]}
];

const metas = [
  {valor:100000,premio:"Moto Elétrica"},
  {valor:200000,premio:"iPhone 17 Pro"},
  {valor:500000,premio:"Viagem Internacional / Home Cinema / Energia Solar"},
  {valor:1500000,premio:"Carro Elétrico Básico"},
  {valor:4000000,premio:"Carro Elétrico Luxo"}
];

let clienteSelecionado = null;

function limparNumero(v) {
  return String(v || "").replace(/\D/g, "");
}

function normalizar(v) {
  return String(v || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
}

function dinheiro(v) {
  return Number(v || 0).toLocaleString("pt-BR", {style:"currency", currency:"BRL"});
}

function pontos(v) {
  return Number(v || 0).toLocaleString("pt-BR") + " pts";
}

function abrirPagina(id) {
  document.querySelectorAll(".pagina").forEach(p => p.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
  window.scrollTo({top:0, behavior:"smooth"});
}

function carregarClientes() {
  // Sempre garante a base principal carregada
  let salvos = [];
  try {
    salvos = JSON.parse(localStorage.getItem("dc_clientes") || "[]");
  } catch(e) {
    salvos = [];
  }

  clientesBase.forEach(c => {
    const existe = salvos.findIndex(s => String(s.codigo) === String(c.codigo) || limparNumero(s.documento) === limparNumero(c.documento));
    if (existe >= 0) salvos[existe] = c;
    else salvos.push(c);
  });

  localStorage.setItem("dc_clientes", JSON.stringify(salvos));
  return salvos;
}

function clientes() {
  return carregarClientes();
}

function resgates() {
  try { return JSON.parse(localStorage.getItem("dc_resgates") || "[]"); }
  catch(e) { return []; }
}

function buscarCliente(termo) {
  const bruto = String(termo || "").trim();
  const num = limparNumero(bruto);
  const txt = normalizar(bruto);

  if (!bruto) return null;

  return clientes().find(c => {
    const doc = limparNumero(c.documento);
    const cod = String(c.codigo || "");
    const nome = normalizar(c.nome);

    return (
      cod === num ||
      doc === num ||
      doc.includes(num) ||
      (num.length >= 3 && cod.includes(num)) ||
      (txt.length >= 3 && nome.includes(txt))
    );
  });
}

function consultarCliente() {
  const termo = document.getElementById("campoConsulta").value;
  const c = buscarCliente(termo);
  const box = document.getElementById("resultadoConsulta");

  if (!c) {
    box.innerHTML = `<hr><div class="erro"><b>Cliente não encontrado.</b><br>Teste: 4801, 7272, Wesley ou Aconchego.</div>`;
    return;
  }

  const meta = metas.find(m => c.pontos < m.valor) || metas[metas.length - 1];
  const falta = Math.max(0, meta.valor - c.pontos);
  const perc = Math.min(100, (c.pontos / meta.valor) * 100);

  document.getElementById("pontosHome").innerText = pontos(c.pontos);
  document.getElementById("barraHome").style.width = perc + "%";
  document.getElementById("metaHome").innerText = `Faltam ${pontos(falta)} para ${meta.premio}.`;

  box.innerHTML = `
    <hr>
    <div class="ok">
      <h3>${c.nome}</h3>
      <p><b>Código:</b> ${c.codigo}</p>
      <p><b>Documento:</b> ${c.documento}</p>
      <p><b>Pontos:</b> ${pontos(c.pontos)}</p>
      <p><b>Compras:</b> ${dinheiro(c.compras)}</p>
      <p><b>Categoria:</b> ${c.categoria}</p>
      <p><b>Próxima meta:</b> ${meta.premio}</p>
      <div class="barra" style="background:#e5e7eb"><div style="width:${perc}%"></div></div>
      <button class="btn gold" onclick="prepararResgate('${c.codigo}')">Resgatar pontos</button>
    </div>
  `;
}

function prepararResgate(codigo) {
  abrirPagina("resgate");
  document.getElementById("campoResgate").value = codigo;
  consultarResgate();
}

function consultarResgate() {
  const c = buscarCliente(document.getElementById("campoResgate").value);
  const box = document.getElementById("boxResgate");
  clienteSelecionado = c;

  if (!c) {
    box.innerHTML = `<div class="erro">Cliente não encontrado. Teste 4801 ou 7272.</div>`;
    return;
  }

  box.innerHTML = `<div class="ok"><b>${c.nome}</b><br>Código: ${c.codigo}<br>Saldo: ${pontos(c.pontos)}<br>Compras: ${dinheiro(c.compras)}</div>`;
}

function solicitarResgate() {
  if (!clienteSelecionado) consultarResgate();
  const msg = document.getElementById("msgResgate");

  if (!clienteSelecionado) {
    msg.innerHTML = `<div class="erro">Consulte um cliente antes de solicitar.</div>`;
    return;
  }

  const [custo, premio] = document.getElementById("premioResgate").value.split("|");
  const custoNum = Number(custo);

  if (clienteSelecionado.pontos < custoNum) {
    msg.innerHTML = `<div class="erro">Saldo insuficiente. Necessário: ${pontos(custoNum)}.</div>`;
    return;
  }

  const lista = resgates();
  lista.push({
    cliente: clienteSelecionado.nome,
    codigo: clienteSelecionado.codigo,
    premio,
    pontos: custoNum,
    status: "Pendente"
  });
  localStorage.setItem("dc_resgates", JSON.stringify(lista));
  renderizar();
  msg.innerHTML = `<div class="ok">Solicitação enviada para análise.</div>`;
}

function loginAdmin() {
  if (document.getElementById("userAdmin").value === "admin" && document.getElementById("senhaAdmin").value === "1234") {
    abrirPagina("admin");
    renderizar();
  } else {
    alert("Usuário ou senha incorretos.");
  }
}

function importarClientes() {
  const texto = document.getElementById("csvImport").value.trim();
  if (!texto) return alert("Cole os dados.");
  const atuais = clientes();

  texto.split(/\r?\n/).forEach(linha => {
    const p = linha.includes(";") ? linha.split(";") : linha.split(",");
    if (p.length < 3 || p[0].toLowerCase().includes("nome")) return;

    const doc = p[1].trim();
    const docNum = limparNumero(doc);
    const codigo = docNum.length >= 6 ? docNum.slice(-6, -2) : docNum;

    const novo = {
      nome: p[0].trim(),
      documento: doc,
      codigo,
      pontos: Number(limparNumero(p[2])),
      compras: Number(limparNumero(p[2])),
      categoria: (p[3] || "PORCELANATO").trim()
    };

    const i = atuais.findIndex(c => c.codigo === novo.codigo || limparNumero(c.documento) === limparNumero(novo.documento));
    if (i >= 0) atuais[i] = novo; else atuais.push(novo);
  });

  localStorage.setItem("dc_clientes", JSON.stringify(atuais));
  alert("Clientes importados.");
  renderizar();
}

function recarregarBase() {
  localStorage.setItem("dc_clientes", JSON.stringify(clientesBase));
  alert("Base padrão recarregada. Teste 4801.");
  renderizar();
}

function renderizar() {
  const cs = clientes();
  const rs = resgates();

  const grade = document.getElementById("gradeProdutos");
  if (grade) {
    grade.innerHTML = produtosBlack.map(p => `
      <article class="product-card">
        <img src="${p.img}" alt="${p.nome}" onerror="this.style.display='none'">
        <div class="product-info">
          <h3>${p.nome}</h3>
          <p>${p.desc}</p>
          <div class="tags">${p.tags.map(t => `<span>${t}</span>`).join("")}</div>
        </div>
      </article>
    `).join("");
  }

  document.getElementById("rankingBody").innerHTML = [...cs].sort((a,b)=>b.pontos-a.pontos).map((c,i) => `
    <tr><td>#${i+1}</td><td>${c.nome}</td><td>${c.codigo}</td><td>${pontos(c.pontos)}</td><td>${c.pontos >= 100000 ? "Premium" : "Ativo"}</td></tr>
  `).join("");

  document.getElementById("adminClientes").innerHTML = cs.map(c => `
    <tr><td>${c.nome}</td><td>${c.documento}</td><td>${c.codigo}</td><td>${pontos(c.pontos)}</td></tr>
  `).join("");

  document.getElementById("adminResgates").innerHTML = rs.map(r => `
    <tr><td>${r.cliente}</td><td>${r.codigo}</td><td>${r.premio}</td><td>${pontos(r.pontos)}</td><td>${r.status}</td></tr>
  `).join("");

  document.getElementById("statClientes").innerText = cs.length;
  document.getElementById("statPontos").innerText = cs.reduce((s,c)=>s+c.pontos,0).toLocaleString("pt-BR");
  document.getElementById("statResgates").innerText = rs.length;
}

renderizar();
