export function StudioCredit({lang}:{lang:'sk'|'en'}) {
  return <footer className="studio-credit">
    <div className="studio-signature"><img src="/assets/brand/arisen-games.svg" alt="" width="52" height="52"/><div><strong>ARISEN <span>GAMES</span></strong><small>{lang==='sk'?'Nezávislá herná tvorba':'Independent game creation'}</small></div></div>
    <p>{lang==='sk'?'LifeQuest — hra z produkcie Arisen Games.':'LifeQuest — an Arisen Games production.'}</p>
    <small>© 2026 Arisen Games. {lang==='sk'?'Všetky práva vyhradené.':'All rights reserved.'}</small>
  </footer>;
}
