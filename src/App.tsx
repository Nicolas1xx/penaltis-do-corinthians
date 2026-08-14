import { useState } from "react";

type Side = "left" | "center" | "right";
const options: { id: Side; label: string; arrow: string }[] = [
  { id: "left", label: "Canto esquerdo", arrow: "↙" },
  { id: "center", label: "No meio", arrow: "↓" },
  { id: "right", label: "Canto direito", arrow: "↘" },
];

export default function App() {
  const [shots, setShots] = useState<boolean[]>([]);
  const [keeper, setKeeper] = useState<Side | null>(null);
  const [kick, setKick] = useState<Side | null>(null);
  const [busy, setBusy] = useState(false);
  const [best, setBest] = useState(0);
  const [lastResult, setLastResult] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const goals = shots.filter(Boolean).length;
  const finished = shots.length === 5;

  function shoot(side: Side) {
    if (busy || finished) return;
    const sides: Side[] = ["left", "center", "right"];
    const keeperSide = sides[Math.floor(Math.random() * sides.length)];
    const goal = keeperSide !== side;
    setBusy(true); setKick(side); setKeeper(keeperSide); setLastResult(null);
    window.setTimeout(() => {
      const next = [...shots, goal];
      setShots(next); setLastResult(goal); setStreak((old) => goal ? old + 1 : 0); setBest((old) => Math.max(old, next.filter(Boolean).length));
      window.setTimeout(() => { setBusy(false); setKick(null); setKeeper(null); }, 1250);
    }, 560);
  }

  function restart() { setShots([]); setKeeper(null); setKick(null); setBusy(false); setLastResult(null); setStreak(0); }

  const headline = finished
    ? goals >= 4 ? "A FIEL EXPLODIU!" : goals >= 2 ? "RAÇA ATÉ O FIM" : "LEVANTA A CABEÇA"
    : busy ? "É AGORA..." : shots.length === 0 ? "A DECISÃO COMEÇA AQUI" : shots[shots.length - 1] ? "GOOOOOL DO TIMÃO!" : "DEFENDEU O GOLEIRO";

  return (
    <main className={lastResult && busy ? "goalMoment" : ""}>
      <div className="grain" />
      <div className="redSlash slashOne"/><div className="redSlash slashTwo"/>
      <nav>
        <div className="miniBrand"><span>SCCP</span><b>1910</b></div>
        <div className="navTitle"><small>SPORT CLUB CORINTHIANS PAULISTA</small><strong>PÊNALTIS DA FIEL</strong></div>
        <div className="record"><small>MELHOR MARCA</small><strong>{best}<i>/5</i></strong></div>
      </nav>

      <section className="hero">
        <div className="matchTag"><i /> NOITE DE DECISÃO <i /></div>
        <h1>TODO PODEROSO<br/><em>TIMÃO</em></h1>
        <p>Você tem cinco cobranças. Escolha o canto, encare o goleiro<br/>e faça a Neo Química Arena tremer.</p>
      </section>

      <section className="gameShell">
        <div className="broadcast"><span>AO VIVO</span><b>FINAL • ITAQUERA</b><i>90:00</i></div>
        <div className="scorebar">
          <div><small>COBRANÇA</small><strong>{Math.min(shots.length + 1, 5)}ª</strong></div>
          <div className="shotTrack" aria-label={`${goals} gols em ${shots.length} cobranças`}>
            {[0,1,2,3,4].map((index) => <span key={index} className={shots[index] === true ? "goal" : shots[index] === false ? "miss" : index === shots.length ? "current" : ""}>{shots[index] === true ? "✓" : shots[index] === false ? "×" : index + 1}</span>)}
          </div>
          <div className="goals"><small>GOLS</small><strong>{goals}</strong></div>
        </div>
        <div className="pressure"><span style={{width:`${20 + shots.length * 12 + goals * 6}%`}}/><small>PRESSÃO DA FIEL</small></div>

        <div className="arena">
          <div className="sccpSeal"><small>SPORT CLUB</small><strong>SCCP</strong><b>1910</b></div>
          <div className="flag flagLeft">AQUI É CORINTHIANS</div><div className="flag flagRight">BANDO DE LOUCOS</div>
          <div className="goalFrame"><div className="net"/><div className={`keeper ${keeper ?? ""}`}><span/><b/><i/></div></div>
          <div className={`ball ${kick ?? ""} ${lastResult === false ? "caught" : lastResult === true ? "inNet" : ""}`}>⚽</div>
          <div className="spot"/>
          {busy && lastResult !== null && <div className={`resultFlash ${lastResult ? "scored" : "saved"}`}><span>{lastResult ? "GOOOOL!" : "DEFESA!"}</span><small>{lastResult ? "A BOLA ESTÁ NA REDE • GOL CONFIRMADO" : "O GOLEIRO AGARROU A BOLA"}</small></div>}
          {lastResult && busy && <div className="confetti">{Array.from({length:18},(_,i)=><i key={i}/>)}</div>}
          <div className="arenaCaption"><span>NEO QUÍMICA ARENA</span><b>VAI, CORINTHIANS!</b><span>CASA DO POVO</span></div>
        </div>

        <div className="controlPanel">
          <div className="callout"><small>{finished ? "FIM DA DISPUTA" : busy ? "COBRANÇA EM ANDAMENTO" : "SUA VEZ"}</small><h2>{headline}</h2></div>
          {finished ? <button className="restart" onClick={restart}><span>↻</span> NOVA DISPUTA</button> : <div className="choices">{options.map((option) => <button key={option.id} onClick={() => shoot(option.id)} disabled={busy}><b>{option.arrow}</b><span>{option.label}</span></button>)}</div>}
          <p>{finished ? `Placar final: ${goals} gols em 5 cobranças.` : "Escolha onde vai colocar a bola."}</p>
        </div>
      </section>
      <footer><span>🖤</span><b>O TIME DO POVO</b><i/> DESDE 1910 <i/><b>NUNCA VOU TE ABANDONAR</b><span>🤍</span></footer>
    </main>
  );
}
