/* ===========================================================================
   おりーぶ庵 AI-OS ←→ ポチパス自動化 拡張機能 つなぎ役（content script）
   ---------------------------------------------------------------------------
   使い方（3ステップ）
     1. このファイルを拡張機能のフォルダに置く
     2. manifest.json に下を足す
          "content_scripts": [
            { "matches": ["https://olive-an.github.io/*"],
              "js": ["pochipass-bridge.js"] }
          ]
     3. 拡張機能を読み込み直す → AI-OSの「🐶 ポチパス」→「つながっているか確認」

   ★ポチパスのIDとパスワードは、AI-OS側では一切あつかいません。
     ログインは今までどおり、ブラウザ（拡張機能）側で行ってください。
   =========================================================================== */
(() => {
  const NAME = 'ポチパス自動化';          // 画面に出る名前。お好きに変えてください
  const VER  = 'v1.0';

  // AI-OSへ返事を返す
  const reply = (action, data) =>
    window.postMessage({ source: 'olive-ai-os-ext', reply: action, data }, '*');

  window.addEventListener('message', (e) => {
    if (e.source !== window) return;
    const m = e.data;
    if (!m || m.source !== 'olive-ai-os') return;

    // --- つながり確認 ---------------------------------------------------
    if (m.action === 'ping') {
      reply('ping', { message: `${NAME} ${VER}` });
      return;
    }

    // --- データを受け取る -----------------------------------------------
    if (m.action === 'fill') {
      const p = m.payload || {};

      // ここから先は、お手持ちの自動化処理につなげてください。
      // 例1：バックグラウンドへ渡して、ポチパスのタブで入力させる
      //   chrome.runtime.sendMessage({ type: 'aios-fill', payload: p });
      // 例2：いったん保存しておいて、ポチパスの画面で使う
      //   chrome.storage.local.set({ aiosPayload: p });

      if (p.kind === '個別支援計画（様式1-1）') {
        // p.head … 氏名・区分・受給者証番号・担当者・作成日など
        // p.body … 本人の意向 / 支援方針 / 長期目標 / 短期目標
        // p.rows … 優先順位1〜6（kadai, mokuhyo, tassei, service, yakuwari, hyoka, ryui）
        console.log('[AI-OS] 個別支援計画', p.head.name, p.rows.length + '行');
        reply('fill', { message: `${p.head.name} さんの計画を受け取りました（${p.rows.length}行）` });
        return;
      }

      if (p.kind === '利用者・受給者証') {
        // p.list … [{home, name, kubun, no, limFrom, limTo, birth, moveIn}, …]
        console.log('[AI-OS] 利用者データ', p.count + '名');
        reply('fill', { message: `利用者 ${p.count} 名を受け取りました` });
        return;
      }

      reply('fill', { message: '受け取りましたが、種類がわかりませんでした' });
    }
  });

  console.log(`[AI-OS] ${NAME} ${VER} つなぎ役を読み込みました`);
})();
