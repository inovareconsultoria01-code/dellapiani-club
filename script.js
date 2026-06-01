function importarCSV(){
 const linhas=document.getElementById("csvImport").value.trim().split("\n").filter(Boolean);

 if(!linhas.length){
   alert("Cole os dados.");
   return;
 }

 const arr=clientes();

 linhas.forEach(l=>{

   const dados=l.includes(";")
     ? l.split(";")
     : l.split(",");

   const nome=(dados[0]||"").trim();
   const doc=(dados[1]||"").trim();
   const pontos=parseInt((dados[2]||"0").replace(/\D/g,'')) || 0;

   const compras=pontos*10;

   if(nome && doc){
      const novo={
        nome:nome,
        doc:clean(doc),
        pontos:pontos,
        compras:compras
      };

      const i=arr.findIndex(x=>x.doc===novo.doc);

      if(i>=0){
         arr[i]=novo;
      }else{
         arr.push(novo);
      }
   }
 });

 localStorage.setItem("dc_clientes",JSON.stringify(arr));

 renderAll();

 alert("Importação concluída!");
}
