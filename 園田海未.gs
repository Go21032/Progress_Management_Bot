function love_arrow_shoot(){
  //スプレッドシートを指定
  const ssh = SpreadsheetApp.openById('1_V6RIBIAkT8ncphIS96u5XaAWgnTKbo5b-lRCEaghWE');

  //シートを指定
  const sheet1 = ssh.getSheetByName("状況");
  const sheet2 = ssh.getSheetByName("タスク");
  const sheet3 = ssh.getSheetByName("進捗率判断");
  const sheet4 = ssh.getSheetByName("名前");

  let kigenbi = ssh.getRange('F3').getValue();//期限日
  let tantousya =ssh.getRange('C3').getValue();//担当者
  var task = ssh.getRange('D3').getValue();//内容
  var jyoukyou = ssh.getRange('E3').getValue();//進捗状況

  //その他が選択されたときD4セルの内容を反映する
  if(task == sheet2.getRange('B6').getValue()){
    naiyou = sheet1.getRange('D4').getValue();
  }else{
    naiyou = task;
    sheet1.getRange('D4').setValue(""); //その他の時にD4に入力しっぱなしで消すの忘れた！の対策です。プルダウンから「その他」以外が選択されたとき、D4セルに入力されているものを空にする。
  }

  //進捗状況のプルダウンからパーセントに変換&各プルダウンごとにセリフを変更
  if(jyoukyou == sheet3.getRange('B2').getValue()){
    status = "0%";
    serif = "「ダメです、それでは全然……」";
    serif2 = "「動かないんです、今のままでは」";
  }else if(jyoukyou == sheet3.getRange('B3').getValue()){
    status = "50%";
    serif = "「大丈夫です！」";
    serif2 = "「やる気があれば完成します!!」";
  }else if(jyoukyou == sheet3.getRange('B4').getValue()){
    status = "100%";
    serif = "「目標達成おめでとうございます！」";
    serif2 = "「達成できたのは、あなたがいたからです!!」";
  }

    //スラックに送る内容をつなげる
    message ="F3RCまであと" + kigenbi + "日" + "\n" + "【担当者】" + tantousya + "\n" + "【タスク内容】" + naiyou + "\n" + "【進捗状況】" + status + "\n"  + "\n" + serif + "\n" + serif2; //セリフをここに入れる
    send_to_slack(message);
}

function send_to_slack(message) {
  const webhook_url ="https://hooks.slack.com/services/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"//指定のチャンネルのWebHook_URL
  const headers = { "Content-type": "application/json" }
  var jsonData = {"icon": '',//好きなアイコン（基本名前と画像はIncoming Webhook側で設定）
                  "bot_name" : '',//アイコンの名前
                  "text" :`<!channel> ラブアローシュート♡`,//@メンション(ユーザーID)&メッセージ
  "attachments" : [
    {
     "text": message,
     "color": "#1769FF",//マークダウンの色（カラーコード）
    }]
  };
  const options = {
    "method": "post",
    "headers": headers,
    "payload": JSON.stringify(jsonData),//データの形式をJSONに変換する
    "muteHttpExceptions": true
    }
UrlFetchApp.fetch(webhook_url, options)//スラックに送る
}
