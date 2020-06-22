/** 
 * reply
 * ユーザからのアクションに返信する
 */
function reply(data) {
  // POST情報から必要データを抽出
  var lineUserId = data.events[0].source.userId;
  var postMsg    = data.events[0].message.text;
  var replyToken = data.events[0].replyToken;
  var action    = data.events[0].message.action;
  // 記録用に検索語とuserIdを記録
  debug(postMsg, lineUserId);

  // 検索語に対しての回答をSSから取得
  var answers = findResponseArray(postMsg);

  // 回答メッセージを作成
//  var replyText = '「' + postMsg + '」ですね。かしこまりました。以下、回答です。';
  
  //俺が勝手に作ってるやつ
  var replyText = '';
 
  // 回答の有無に応じて分岐
  if (answers.length === 0) {
    // 「類似の検索キーワード」がないかチェック
    var mayBeWord = findMaybe(postMsg);
    if (typeof mayBeWord === "undefined") {
      // 回答がない場合の定型文
      sendMessage(replyToken, '答えが見つかりませんでした。別のキーワードで質問してみてください。');        
    } else {
      sendMayBe(replyToken, mayBeWord);
    }
  } else {
    // 回答がある場合のメッセージ生成
    //こっちがオリジナル
//    answers.forEach(function(answer) {
//      replyText = replyText + "\n\n＝＝＝＝＝＝＝＝＝＝＝＝＝\n\nQ：" + answer.key + "\n\nA：" + answer.value;
//    });
    
    
    //俺が勝手に作ってるやつ
      answers.forEach(function(answer) {
      replyText = replyText + answer.value;
    });
    
    // 1000文字を超える場合は途中で切る
    if (replyText.length > 1000) {
      replyText = replyText.slice(0,1000) + "……\n\n＝＝＝＝＝＝＝＝＝＝＝＝＝\n\n回答文字数オーバーです。詳細に検索キーワードを絞ってください。";
    }
    // メッセージAPI送信
    sendMessage(replyToken, replyText);
  }
}

// 画像形式でAPI送信
function sendMessageImage(replyToken, imageUrl) {
  // replyするメッセージの定義
  var postData = {
    "replyToken" : replyToken,
    "messages" : [
      {
        "type": "image",
        "originalContentUrl": imageUrl
      }
    ]
  };
  return postMessage(postData);
}

// LINE messaging apiにJSON形式でデータをPOST
function sendMessage(replyToken, replyText) {  
  // replyするメッセージの定義
  var postData = {
    "replyToken" : replyToken,
    "messages" : [
      {
        "type" : "text",
        "text" : replyText
      }
    ]
  };
  return postMessage(postData);
}

// LINE messaging apiにJSON形式で確認をPOST
function sendMayBe(replyToken, mayBeWord) {  
  // replyするメッセージの定義
  var postData = {
    "replyToken" : replyToken,
    "messages" : [
      {
        "type" : "template",
        "altText" : "もしかして検索キーワードは「" + mayBeWord + "」ですか？",
        "template": {
          "type": "confirm",
          "actions": [
            {
                "type":"postback",
                "label":"はい",
                "data":"action=detail",
            },
            {
                "type": "message",
                "label": "いいえ",
                "text": "いいえ、違います。"
            }
          ],
          "text": "答えが見つかりませんでした。もしかして検索キーワードは「" + mayBeWord + "」ですか？"
        }

      }
    ]
  };
  return postMessage(postData);
}