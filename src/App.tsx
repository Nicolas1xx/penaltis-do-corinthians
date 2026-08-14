import { useState } from "react";
type Side = "left" | "center" | "right";
const sides: {id:Side; label:string; arrow:string}[] = [{id:"left",label:"Esquerda",arrow:"↙"},{id:"center",label:"Meio",arrow:"↓"},{id:"right",label:"Direita",arrow:"↘"}];

export default function App(){
  const [shots,setShots]=useState<boolean[]>([]); const [keeper,setKeeper]=useState<Side|null>(null); const [kick,setKick]=useState<Side|null>(null); const [message,setMessage]=useState("Escolha um canto e bata!"); const [busy,setBusy]=useState(false); const [best,setBest]=useState(0);
  const goals=shots.filter(Boolean).length; const finished=shots.length===5;
  function shoot(side:Side){
    if(busy||finished)return; setBusy(true); setKick(side); setKeeper(null); setMessage("Partiu pra bola...");
    setTimeout(()=>{ const choices:Side[]=["left","center","right"]; const save=choices[Math.floor(Math.random()*3)]; const goal=save!==side; setKeeper(save); const next=[...shots,goal]; setShots(next); setBest(old=>Math.max(old,next.filter(Boolean).length)); setMessage(goal?"GOOOOL DO TIMÃO! ⚽":"O goleiro defendeu!"); setTimeout(()=>{setBusy(false);setKick(null);setKeeper(null)},900); },600);
  }
  function restart(){setShots([]);setKeeper(null);setKick(null);setMessage("Escolha um canto e bata!");setBusy(false)}
  return <main>
    <div className="lights l1"/><div className="lights l2"/>
    <header><div className="badge"><span>SCCP</span><small>1910</small></div><div><p>ARENA DO POVO APRESENTA</p><h1>PÊNALTIS DO <em>CORINTHIANS</em></h1></div><div className="best">RECORDE<strong>{best}/5</strong></div></header>
    <section className="score"><span>DECISÃO POR PÊNALTIS</span><div className="balls">{[0,1,2,3,4].map(i=><i key={i} className={shots[i]===true?"goal":shots[i]===false?"miss":""}>{shots[i]===true?"✓":shots[i]===false?"×":""}</i>)}</div><b>{goals} GOLS</b></section>
    <section className="stadium">
      <div className="crowd">TIMÃO • TIMÃO • TIMÃO • TIMÃO • TIMÃO • TIMÃO</div>
      <div className="goal"><div className="net"/><div className={`keeper ${keeper||""}`}><span>◉</span><b/></div></div>
      <div className="field"><div className="spot"/><div className={`ball ${kick||""}`}>⚽</div></div>
    </section>
    <section className="controls">
      <h2>{finished?(goals>=4?"É CAMPEÃO! 🏆":goals>=2?"Boa disputa, Peixão!":"Hoje não deu..."):message}</h2>
      {finished?<button className="again" onClick={restart}>Jogar novamente</button>:<div className="choices">{sides.map(s=><button key={s.id} onClick={()=>shoot(s.id)} disabled={busy}><b>{s.arrow}</b><span>{s.label}</span></button>)}</div>}
      <p>{finished?`Você marcou ${goals} de 5 cobranças.`:"Você tem 5 cobranças para mostrar que é decisivo."}</p>
    </section>
    <footer>VAI, CORINTHIANS • O TIME DO POVO • AQUI É TIMÃO</footer>
  </main>
}
