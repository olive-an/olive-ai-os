/* おりーぶ庵 AI-OS サンプル用：アイコン（ai-os.html と同じもの） */
const AI_ICON = (()=>{
  const S = (inner, extra) => `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
      stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  const W='#ffffff', G='rgba(255,255,255,.55)', D='rgba(0,0,0,.18)';
  // 書類のかたち（多くのアイコンで共通に使う土台）
  const paper = (x,y,w,h,r) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r||3}" fill="${W}"/>`;
  const line  = (x1,y,x2,c,sw) => `<path d="M${x1} ${y}H${x2}" stroke="${c||'#9fb4c9'}" stroke-width="${sw||2.6}"/>`;
  return {
  /* --- 役所の手続き（青） --- */
  行政: { bg:'#2f5f9e', svg:S(`
    ${paper(11,7,26,34,3)}
    ${line(16,16,32)}${line(16,22,30)}${line(16,28,26)}
    <circle cx="33" cy="33" r="8" fill="#e7504a"/>
    <path d="M29.5 33h7M33 29.5v7" stroke="${W}" stroke-width="2.4"/>`)},
  文書: { bg:'#414fa8', svg:S(`
    ${paper(10,8,24,32,3)}
    ${line(15,17,29)}${line(15,23,27)}
    <path d="M27 36l11-11 4 4-11 11-5 1z" fill="#ffd36b"/>
    <path d="M36 21l4 4" stroke="${W}" stroke-width="2.4"/>`)},
  監査: { bg:'#6146b5', svg:S(`
    ${paper(9,8,26,33,3)}
    <path d="M14 17l3 3 6-6" stroke="#3a9d5d" stroke-width="2.8"/>
    <path d="M14 27l3 3 6-6" stroke="#3a9d5d" stroke-width="2.8"/>
    <circle cx="33" cy="31" r="8.5" fill="none" stroke="${W}" stroke-width="3.2"/>
    <path d="M39 37l5 5" stroke="${W}" stroke-width="3.6"/>`)},
  /* --- 人と時間（緑） --- */
  シフト: { bg:'#2e7d46', svg:S(`
    ${paper(8,10,32,30,4)}
    <path d="M8 18h32" stroke="#d3e3d6" stroke-width="2.4"/>
    <path d="M16 6v8M32 6v8" stroke="${W}" stroke-width="3.4"/>
    <rect x="13" y="22" width="6" height="5" rx="1.4" fill="#7fc98e"/>
    <rect x="21" y="22" width="6" height="5" rx="1.4" fill="#e7a23c"/>
    <rect x="29" y="22" width="6" height="5" rx="1.4" fill="#7fc98e"/>
    <rect x="13" y="30" width="6" height="5" rx="1.4" fill="#e7504a"/>
    <rect x="21" y="30" width="6" height="5" rx="1.4" fill="#7fc98e"/>
    <rect x="29" y="30" width="6" height="5" rx="1.4" fill="#7fc98e"/>`)},
  人事: { bg:'#1c7d75', svg:S(`
    <circle cx="19" cy="16" r="6.5" fill="${W}"/>
    <path d="M7 38c0-6.6 5.4-11 12-11s12 4.4 12 11z" fill="${W}"/>
    <circle cx="34" cy="31" r="10" fill="#ffd36b"/>
    <path d="M30 31l3 3 6-6" stroke="#1c7d75" stroke-width="3"/>`)},
  看護: { bg:'#c14a60', svg:S(`
    <path d="M16 8v9a8 8 0 0016 0V8" stroke="${W}" stroke-width="3.4"/>
    <circle cx="16" cy="8" r="3" fill="${W}"/><circle cx="32" cy="8" r="3" fill="${W}"/>
    <path d="M24 25v6a7 7 0 0014 0v-2" stroke="${W}" stroke-width="3.4"/>
    <circle cx="38" cy="26" r="5.5" fill="${W}"/>
    <path d="M36 26h4M38 24v4" stroke="#c14a60" stroke-width="2.2"/>`)},
  /* --- お金（橙・赤） --- */
  請求: { bg:'#c0552b', svg:S(`
    <path d="M11 6h26v34l-4.3-3.2L28.4 40l-4.4-3.2L19.6 40l-4.3-3.2L11 40z" fill="${W}"/>
    ${line(16,15,32)}${line(16,21,30)}
    <path d="M20 27h9M20 31h9M24.5 27v7" stroke="#c0552b" stroke-width="2.4"/>`)},
  経理: { bg:'#c2761b', svg:S(`
    <rect x="10" y="6" width="28" height="36" rx="4" fill="${W}"/>
    <rect x="14" y="10" width="20" height="7" rx="2" fill="#4a5a68"/>
    <g fill="#c2761b">
      <rect x="14" y="21" width="6" height="5" rx="1.5"/><rect x="21" y="21" width="6" height="5" rx="1.5"/>
      <rect x="28" y="21" width="6" height="5" rx="1.5"/><rect x="14" y="29" width="6" height="5" rx="1.5"/>
      <rect x="21" y="29" width="6" height="5" rx="1.5"/><rect x="28" y="29" width="6" height="12" rx="1.5"/>
      <rect x="14" y="36" width="13" height="5" rx="1.5"/></g>`)},
  工房: { bg:'#7d5330', svg:S(`
    <path d="M24 14c-6 4-12 10-12 18 0 6.5 5 10 12 10s12-3.5 12-10c0-8-6-14-12-18z" fill="${W}"/>
    <path d="M24 15c-3 7-4.5 13-4 26" stroke="#d6c0ae" stroke-width="2"/>
    <path d="M24 15c3 7 4.5 13 4 26" stroke="#d6c0ae" stroke-width="2"/>
    <path d="M24 14V9" stroke="#8fd27a" stroke-width="3"/>
    <path d="M24 10c-1.5-3-4-4.5-6-5M24 10c1.5-3 4-4.5 6-5" stroke="#8fd27a" stroke-width="2.6"/>`)},
  /* --- 利用者・施設（桃・黄緑） --- */
  利用者: { bg:'#b33f74', svg:S(`
    <rect x="8" y="9" width="32" height="30" rx="4" fill="${W}"/>
    <rect x="8" y="9" width="10" height="30" rx="4" fill="#f6b8cf"/>
    <circle cx="27" cy="19" r="5" fill="#b33f74"/>
    <path d="M21 32c0-3.6 2.7-6 6-6s6 2.4 6 6z" fill="#b33f74"/>
    <path d="M12 16h2M12 22h2M12 28h2" stroke="#b33f74" stroke-width="2.2"/>`)},
  ホーム: { bg:'#4e8a22', svg:S(`
    <path d="M24 6L6 21h5v18h26V21h5z" fill="${W}"/>
    <rect x="20" y="27" width="8" height="12" rx="1.5" fill="#4e8a22"/>
    <rect x="14" y="24" width="5" height="5" rx="1" fill="#bfe08e"/>
    <rect x="29" y="24" width="5" height="5" rx="1" fill="#bfe08e"/>`)},
  車両: { bg:'#2274a8', svg:S(`
    <path d="M8 30l3-9a4 4 0 013.8-2.7h18.4A4 4 0 0137 21l3 9v6a2 2 0 01-2 2h-3a2 2 0 01-2-2v-2H15v2a2 2 0 01-2 2h-3a2 2 0 01-2-2z" fill="${W}"/>
    <path d="M13 21h22l2 6H11z" fill="#9fd8ef"/>
    <circle cx="15" cy="31" r="2.6" fill="#2274a8"/><circle cx="33" cy="31" r="2.6" fill="#2274a8"/>`)},
  DX: { bg:'#465768', svg:S(`
    <rect x="8" y="10" width="32" height="22" rx="3" fill="${W}"/>
    <rect x="12" y="14" width="24" height="14" rx="1.5" fill="#465768"/>
    <path d="M5 36h38l-3 4H8z" fill="${W}"/>
    <circle cx="24" cy="21" r="4.4" fill="none" stroke="#9fd0ef" stroke-width="2.6"/>
    <path d="M24 13.5v2M24 26.5v2M31 21h-2M19 21h-2" stroke="#9fd0ef" stroke-width="2.4"/>`)},
  /* --- 施設（ゾーン） --- */
  ポチパス: { bg:'#8a6636', svg:S(`
    <path d="M13 13c-4 0-6 5-5 11 .7 4.3 2.6 7 4.5 8z" fill="#e8d4b4"/>
    <path d="M35 13c4 0 6 5 5 11-.7 4.3-2.6 7-4.5 8z" fill="#e8d4b4"/>
    <ellipse cx="24" cy="26" rx="12.5" ry="11.5" fill="${W}"/>
    <circle cx="19.5" cy="24" r="2" fill="#6b4c22"/><circle cx="28.5" cy="24" r="2" fill="#6b4c22"/>
    <ellipse cx="24" cy="30" rx="2.6" ry="2" fill="#6b4c22"/>
    <path d="M24 32v2.4M21 35.6a3.6 3 0 003 1.4 3.6 3 0 003-1.4" stroke="#6b4c22" stroke-width="2"/>`)},
  プリンター: { bg:'#5c6b78', svg:S(`
    <rect x="13" y="6" width="22" height="11" rx="2" fill="${W}"/>
    <rect x="7" y="17" width="34" height="15" rx="3" fill="${W}"/>
    <circle cx="35" cy="23" r="2.2" fill="#3a9d5d"/>
    <rect x="13" y="28" width="22" height="14" rx="2" fill="#e9eef2" stroke="#5c6b78" stroke-width="1.6"/>
    <path d="M17 33h14M17 37h10" stroke="#9aa7b3" stroke-width="2.2"/>`)},
  書類棚: { bg:'#8a6a33', svg:S(`
    <rect x="8" y="6" width="32" height="36" rx="3" fill="${W}"/>
    <rect x="11" y="9" width="26" height="9" rx="1.6" fill="#e6d6b8"/>
    <rect x="11" y="20" width="26" height="9" rx="1.6" fill="#e6d6b8"/>
    <rect x="11" y="31" width="26" height="8" rx="1.6" fill="#e6d6b8"/>
    <path d="M20 13h8M20 24h8M20 35h8" stroke="#8a6a33" stroke-width="2.6"/>`)},
  会議室: { bg:'#3f6b2c', svg:S(`
    <path d="M7 9h26a3 3 0 013 3v13a3 3 0 01-3 3H19l-8 6v-6H7a3 3 0 01-3-3V12a3 3 0 013-3z" fill="${W}"/>
    <path d="M11 15h18M11 21h13" stroke="#6aa84f" stroke-width="2.6"/>
    <rect x="28" y="22" width="16" height="20" rx="2.5" fill="#ffd36b"/>
    <path d="M32 28h8M32 33h8M32 38h5" stroke="#8a6a1f" stroke-width="2.2"/>`)},
  };
})();
// タイルの中身を作る（イラストが無いものは、これまでどおり絵文字）
function tileSvg(key){ const ic=AI_ICON[key]; return ic?ic.svg:''; }
function tileBg(key){ const ic=AI_ICON[key]; return ic?ic.bg:'#888'; }
/* 17のアプリ（名前・分類・ひとこと） */
const ITEMS = [
  {k:'行政',   n:'行政AI',       g:'手続き', d:'変更届・付表12をつくる'},
  {k:'監査',   n:'監査AI',       g:'手続き', d:'運営指導チェック・勤務形態一覧表'},
  {k:'文書',   n:'文書AI',       g:'手続き', d:'書類の体裁を整える'},
  {k:'シフト', n:'シフトAI',      g:'人と時間', d:'シフト希望の集計・Excel反映'},
  {k:'人事',   n:'人事AI',       g:'人と時間', d:'職員名簿・資格や研修の期限'},
  {k:'看護',   n:'看護AI',       g:'人と時間', d:'健康記録・受診予定'},
  {k:'請求',   n:'請求AI',       g:'お金',   d:'国保連の請求データ'},
  {k:'経理',   n:'経理AI',       g:'お金',   d:'売上と経費の集計'},
  {k:'工房',   n:'工房AI',       g:'お金',   d:'受注・納品・工賃／にんにく'},
  {k:'利用者', n:'利用者AI',      g:'利用者', d:'受給者証の照会と期限'},
  {k:'ホーム', n:'ホーム管理AI',   g:'利用者', d:'個別支援計画・空室状況'},
  {k:'会議室', n:'会議室・議事録', g:'利用者', d:'議事録の保管・全文検索・要約'},
  {k:'車両',   n:'車両AI',       g:'設備',   d:'車検・自賠責・任意保険の期限'},
  {k:'ポチパス', n:'ポチパス',     g:'設備',   d:'ポチパスを開く・連携'},
  {k:'書類棚', n:'書類棚',        g:'設備',   d:'保管した書類をさがす'},
  {k:'プリンター', n:'プリンター', g:'設備',   d:'印刷メニュー'},
  {k:'DX',     n:'DX AI',        g:'設備',   d:'自動化のしくみ'},
];
/* 期限などの見本データ（画面の見え方を確かめるための仮の数字です） */
const TODO = [
  {t:'日産セレナの車検', s:'あと20日', w:'車両', lv:'red',  sub:'2026年10月25日まで'},
  {t:'受給者証の更新 3名', s:'あと30日以内', w:'利用者', lv:'orange', sub:'西九条2名・九条1名'},
  {t:'シフト希望の集計', s:'未処理 30件', w:'シフト', lv:'green', sub:'10/16〜11/15の分が届いています'},
  {t:'健康診断の登録', s:'未入力', w:'人事', lv:'gray', sub:'受診日を入れると期限を見ます'},
  {t:'自賠責の満了日が空欄 3台', s:'要確認', w:'車両', lv:'gray', sub:'CX-8・デミオ・セレナ'},
];
