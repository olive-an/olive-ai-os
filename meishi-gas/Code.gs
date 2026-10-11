/*** 名刺アプリ用 受け口（文字読み取り＋名刺データの共有）／おりーぶ庵 AI-OS ***
 *
 * 自分のGoogleアカウントに置いて使う、小さな受け口です。
 *  1. 名刺の写真を、Googleドライブの文字認識で文字にして返す（ocr）
 *  2. 名刺のデータをスプレッドシートに保存し、みんなで共有する（list / save / delete）
 *  3. 名刺の写真をドライブのフォルダに保存し、必要なときに返す（image）
 *
 * 設置手順は同じフォルダの README.md を見てください。
 ***/

// 自分たちだけの合言葉に書き換えてください（名刺アプリの設定にも同じものを入れます）
var TOKEN = 'ここを自分だけの合言葉に書き換える';

// 保存先（AI-OS2026フォルダがあればその中、なければマイドライブ直下）
var ROOT_FOLDER = 'AI-OS2026';
var IMG_FOLDER = '名刺画像';
var SHEET_FILE = '名刺データ（おりーぶ庵）';

// スプレッドシートの列（左から順）。名刺アプリ側の項目名と同じ並びです。
var HEADERS = ['CardID', 'Company', 'Department', 'Title', 'Name', 'Kana', 'Postal', 'Address', 'Tel', 'Fax', 'Mobile',
  'Email', 'Url', 'Memo', 'Category', 'Registrant', 'ImageFileId', 'Thumb', 'CreatedAt', 'UpdatedAt'];
var KEYS = ['id', 'company', 'department', 'title', 'name', 'kana', 'postal', 'address', 'tel', 'fax', 'mobile',
  'email', 'url', 'memo', 'category', 'registrant', 'imageFileId', 'thumb', 'created', 'updated'];

function doGet() {
  return out_({ ok: true, message: '名刺アプリ 稼働中' });
}

// 名刺アプリからの呼び出しを受ける入口
//  ・通常の通信（fetch）：本文にJSONが入っている
//  ・隠しフレーム経由（iPhoneのSafariなどでfetchが止められるとき）：フォームの payload 欄にJSONが入っている
function doPost(e) {
  var bridge = !!(e && e.parameter && e.parameter.payload);
  var req = null;
  var result;
  try {
    if (TOKEN === 'ここを自分だけの合言葉に書き換える') throw new Error('Code.gs の TOKEN（合言葉）を書き換えてください');
    req = JSON.parse(bridge ? e.parameter.payload : e.postData.contents);
    result = handle_(req);
  } catch (err) {
    result = { ok: false, error: String(err && err.message ? err.message : err) };
  }
  return bridge ? bridgeOut_(req && req.rid, result) : out_(result);
}

function handle_(req) {
  if (req.token !== TOKEN) throw new Error('合言葉が違います');
  switch (req.action) {
    case 'ping': return { ok: true };
    case 'ocr': return ocr_(req);
    case 'list': return { ok: true, cards: list_() };
    case 'save': return withLock_(function () { return save_(req); });
    case 'delete': return withLock_(function () { return delete_(req); });
    case 'image': return image_(req);
  }
  throw new Error('不明な操作です');
}

// 隠しフレームの中に結果を書き、親の画面（名刺アプリ）へ postMessage で渡す
function bridgeOut_(rid, result) {
  var json = JSON.stringify({ gasrid: rid || '', result: result })
    .replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  return HtmlService
    .createHtmlOutput('<!doctype html><meta charset="utf-8"><script>window.top.postMessage(' + json + ',"*");</script>')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function withLock_(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { return fn(); } finally { lock.releaseLock(); }
}

/* ---------- 保存先 ---------- */
function rootFolder_() {
  var it = DriveApp.getFoldersByName(ROOT_FOLDER);
  return it.hasNext() ? it.next() : DriveApp.getRootFolder();
}

function imgFolder_() {
  var parent = rootFolder_();
  var it = parent.getFoldersByName(IMG_FOLDER);
  return it.hasNext() ? it.next() : parent.createFolder(IMG_FOLDER);
}

function ss_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SSID');
  var s = null;
  if (id) { try { s = SpreadsheetApp.openById(id); } catch (e) { s = null; } }
  if (!s) {
    s = SpreadsheetApp.create(SHEET_FILE);
    props.setProperty('SSID', s.getId());
    try { DriveApp.getFileById(s.getId()).moveTo(rootFolder_()); } catch (e) {}
  }
  return s;
}

function cardSheet_() {
  var s = ss_();
  var sh = s.getSheetByName('Cards');
  if (!sh) { sh = s.getSheets()[0]; sh.setName('Cards'); }
  // 電話番号や郵便番号の先頭の0が消えないよう、全列を文字列にする
  sh.getRange(1, 1, sh.getMaxRows(), HEADERS.length).setNumberFormat('@');
  if (sh.getRange(1, 1).getValue() !== HEADERS[0]) {
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sh.setFrozenRows(1);
  }
  return sh;
}

/* ---------- 行と名刺の変換 ---------- */
function fromRow_(row) {
  var o = {};
  KEYS.forEach(function (k, i) { o[k] = row[i] === undefined || row[i] === null ? '' : String(row[i]); });
  return o;
}

function toRow_(card) {
  return KEYS.map(function (k) { return card[k] === undefined || card[k] === null ? '' : String(card[k]); });
}

function findRow_(sh, id) {
  var last = sh.getLastRow();
  if (last < 2) return 0;
  var ids = sh.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) return i + 2;
  return 0;
}

/* ---------- 一覧・保存・削除 ---------- */
function list_() {
  var sh = cardSheet_();
  var last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, HEADERS.length).getValues()
    .filter(function (r) { return String(r[0]) !== ''; })
    .map(fromRow_);
}

function save_(req) {
  var card = req.card || {};
  if (!card.id) throw new Error('名刺のIDがありません');
  var sh = cardSheet_();
  var row = findRow_(sh, card.id);
  var cur = row ? fromRow_(sh.getRange(row, 1, 1, HEADERS.length).getValues()[0]) : {};

  var merged = {};
  KEYS.forEach(function (k) {
    merged[k] = card[k] !== undefined && card[k] !== null ? card[k] : (cur[k] !== undefined ? cur[k] : '');
  });
  // 写真・サムネイル・写真のIDは、ブラウザ側の値で壊されないよう、ここで決める
  merged.imageFileId = cur.imageFileId || '';
  if (!card.thumb) merged.thumb = cur.thumb || '';

  if (req.image) {
    var blob = Utilities.newBlob(Utilities.base64Decode(req.image), 'image/jpeg', 'meishi_' + card.id + '.jpg');
    var file = imgFolder_().createFile(blob);
    if (cur.imageFileId) { try { DriveApp.getFileById(cur.imageFileId).setTrashed(true); } catch (e) {} }
    merged.imageFileId = file.getId();
  }
  if (!merged.created) merged.created = String(Date.now());
  merged.updated = String(Date.now());

  if (row) sh.getRange(row, 1, 1, HEADERS.length).setValues([toRow_(merged)]);
  else sh.appendRow(toRow_(merged));
  return { ok: true, card: { id: merged.id, imageFileId: merged.imageFileId, created: merged.created, updated: merged.updated } };
}

function delete_(req) {
  var sh = cardSheet_();
  var row = findRow_(sh, req.id);
  if (!row) return { ok: true };
  var cur = fromRow_(sh.getRange(row, 1, 1, HEADERS.length).getValues()[0]);
  if (cur.imageFileId) { try { DriveApp.getFileById(cur.imageFileId).setTrashed(true); } catch (e) {} }
  sh.deleteRow(row);
  return { ok: true };
}

/* ---------- 写真を返す（名刺画像フォルダの中のファイルだけ） ---------- */
function image_(req) {
  if (!req.fileId) throw new Error('写真のIDがありません');
  var folder = imgFolder_();
  var file = DriveApp.getFileById(req.fileId);
  var inside = false, parents = file.getParents();
  while (parents.hasNext()) { if (parents.next().getId() === folder.getId()) { inside = true; break; } }
  if (!inside) throw new Error('名刺画像フォルダの外のファイルは返せません');
  var blob = file.getBlob();
  return { ok: true, image: 'data:' + (blob.getContentType() || 'image/jpeg') + ';base64,' + Utilities.base64Encode(blob.getBytes()) };
}

/* ---------- 文字読み取り ---------- */
function ocr_(req) {
  if (!req.image) throw new Error('画像がありません');
  var blob = Utilities.newBlob(Utilities.base64Decode(req.image), req.mime || 'image/jpeg', req.filename || ('card_' + Date.now() + '.jpg'));
  return { ok: true, text: ocrText_(blob) };
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
