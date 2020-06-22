// SSからデータを取得
function getData() {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  var data = sheet.getDataRange().getValues();

  return data.map(function(row) { return {key: row[0], value: row[1], type: row[2]}; });
}

// SSから「もしかして」データを取得
function getMayBeData() {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME_MAYBE);
  var data = sheet.getDataRange().getValues();
  return data.map(function(row) { return {key: row[0], value: row[1], type: row[2]}; });
}

// 単語が一致したセルの回答を配列で返す
function findResponseArray(word) {
  // スペース検索用のスペースを半角に統一
  word = word.replace('　',' ');
  // 単語ごとに配列に分割
  var wordArray = word.split(' ');
  return getData().reduce(function(memo, row) {
    // 値が入っているか
    if (row.value) {
      // AND検索ですべての単語を含んでいるか
      var matchCnt = 0;
      wordArray.forEach(function(wordUnit) {
        // 単語を含んでいればtrue
        if (row.key.indexOf(wordUnit) > -1) {
          matchCnt = matchCnt + 1;
        }
      });
      if (wordArray.length === matchCnt) {
        memo.push(row);
      }
    }
    return memo;
  }, []) || [];
}

// 単語が一致したセルの回答を「もしかして」を返す
function findMaybe(word) {
  return getMayBeData().reduce(function(memo, row) { return memo || (row.key === word && row.value); }, false) || undefined;
}

// userIdシートに記載
function lineUserId(userId) {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('userId');
  sheet.appendRow([userId]);
}

// debugシートに値を記載
function debug(text, userId) {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('debug');
  var date = new Date();
  var userName = getUserDisplayName(userId);
  sheet.appendRow([userId, userName, text, Utilities.formatDate( date, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss')]);
}