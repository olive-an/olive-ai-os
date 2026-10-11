/*** 名刺アプリ用 文字読み取り（Googleドライブの無料OCR）／おりーぶ庵 AI-OS ***
 *
 * 自分のGoogleアカウントにだけ置いて使う、小さな受け口です。
 * 名刺アプリ（meishi.html）から写真を受け取り、Googleドライブの文字認識で文字にして返します。
 * 読み取り用に一時的に作るGoogleドキュメントは、読み取り後すぐゴミ箱に入れます。
 *
 * 設置手順は同じフォルダの README.md を見てください。
 ***/

// 自分だけの合言葉に書き換えてください（名刺アプリの設定にも同じものを入れます）
var TOKEN = 'ここを自分だけの合言葉に書き換える';

// 名刺の写真を保存するドライブのフォルダ名（AI-OS2026があればその中、なければマイドライブ直下）
var ROOT_FOLDER = 'AI-OS2026';
var IMG_FOLDER = '名刺画像';

function doGet() {
  return out_({ ok: true, message: '名刺読み取り 稼働中' });
}

function doPost(e) {
  try {
    if (TOKEN === 'ここを自分だけの合言葉に書き換える') throw new Error('Code.gs の TOKEN（合言葉）を書き換えてください');
    var req = JSON.parse(e.postData.contents);
    if (req.token !== TOKEN) throw new Error('合言葉が違います');
    if (req.action === 'ping') return out_({ ok: true });
    if (req.action === 'ocr') return out_(ocr_(req));
    throw new Error('不明な操作です');
  } catch (err) {
    return out_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function imgFolder_() {
  var parent = DriveApp.getRootFolder();
  var roots = DriveApp.getFoldersByName(ROOT_FOLDER);
  if (roots.hasNext()) parent = roots.next();
  var it = parent.getFoldersByName(IMG_FOLDER);
  return it.hasNext() ? it.next() : parent.createFolder(IMG_FOLDER);
}

function ocr_(req) {
  if (!req.image) throw new Error('画像がありません');
  var blob = Utilities.newBlob(
    Utilities.base64Decode(req.image),
    req.mime || 'image/jpeg',
    req.filename || ('card_' + Date.now() + '.jpg')
  );
  var text = ocrText_(blob);
  var fileId = '';
  if (req.save) fileId = imgFolder_().createFile(blob).getId();
  return { ok: true, text: text, fileId: fileId };
}

// 画像をGoogleドキュメントに変換（このとき文字認識が行われる）→ 文字を取り出す → 一時ファイルを削除
function ocrText_(blob) {
  var name = 'ocr_temp_' + Date.now();
  var id = '';
  try {
    if (typeof Drive === 'undefined' || !Drive.Files) {
      throw new Error('Drive API（サービス）が追加されていません。README の手順3を行ってください');
    }
    if (Drive.Files.insert) {
      // Drive API v2
      id = Drive.Files.insert(
        { title: name, mimeType: 'application/vnd.google-apps.document' },
        blob,
        { ocr: true, ocrLanguage: 'ja', convert: true }
      ).id;
    } else {
      // Drive API v3
      id = Drive.Files.create(
        { name: name, mimeType: 'application/vnd.google-apps.document' },
        blob,
        { ocrLanguage: 'ja' }
      ).id;
    }
    return DocumentApp.openById(id).getBody().getText();
  } finally {
    if (id) {
      try { DriveApp.getFileById(id).setTrashed(true); } catch (e) {}
    }
  }
}
