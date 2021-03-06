//《コメント欄で提出する課題》
//課題①：$(‘#btn-evaluation’).click(function() { ~ });の記述の意味
//himl側(今回なら「sample.html」)の読み込みが終わったタイミングで、
//この関数内の{ ~ }の記述が読み込まれる

//課題②：$(‘#btn-evaluation’).click(function() { ~ });の記述の意味
//id名が「btn-evaluation」である要素(今回なら「ランク」ボタン)がクリックされたタイミングで、
//この関数内の{ ~ }の処理が実行される
　
//課題③：$(‘#national_language, #english, #mathematics, #science, #society’).change(function() { ~ });の記述の意味
//id名が「national_languag」「english」「mathematics」「science」「society」である要素
//(＝各教科の点数を入力する欄)の値が変更されたタイミング（※）で、関数内の処理が実行される
//※：提出した投稿では、「値が変更されたタイミング」ではなく「カーソルが入力欄から離れたタイミング」に変更しました
//　　（∵、値が変更されていなくても【その値が正しいかどうか確認→正しくなければメッセージ表示】の処理を走らせたかったため）

//課題④：$(‘#national_language’).val()の記述の意味
//id名が「national_language」である要素（「国語」の点数入力欄）に記入されている情報
    
//課題⑤：Number()の記述の意味
//括弧で括られている内容を、数値型に変換する

//課題⑥：$(“#sum_indicate”).text(sum);の記述の意味
//id名が「sum_indicate」である要素（今回の場合、「合計点」の表示欄）を
//変数「sum」の値に変更する
    
//課題⑦：.appendの記述の意味
//id名が「declaration」である要素（の一番後ろの位置）に、括弧内にhtml文で記述されている要素
//（今回の場合、『水色（この色などは、クラス名やidに基づきcss内で指定されている）の吹き出し』）を挿入する

$(document).ready(function(){

  
  //入力された得点が正しい（０から１００の整数）かどうかをチェックする
  function chk_point(point_changed){
    
    let point = point_changed.val();
   
    //そのまま文字列にした場合と整数化してから文字列化した場合を比較……これでできた
    //及び「0以上」「100以下」を確認
    if(String(point)===String(Math.round(point))
    && 0<= Number(point)
    && Number(point) <=100){
    /*
    if(Number.isInteger(point)===true//どっちもうまくいかない
    && Math.round(point) === point 
    && 0<= Number(point)
    && Number(point) <=100){
    */
      //得点が「整数」「０以上」「１００以下」ならば
      //エラーメッセージを隠して
      point_changed.next("ErrMsg").addClass("hide");
      //Tを返す
      return true;
      
    }else{
      //そうでないならば
      //エラーメッセージを表示して
      point_changed.next("ErrMsg").removeClass("hide");
      //そこに戻り
      point_changed.focusin();
      //Fを返す
      return false;
    }
  
  }

    function get_subject_points(){
        let subject_points = [Number($('#national_language').val()),
                          Number($('#english').val()),
                          Number($('#mathematics').val()),
                          Number($('#science').val()),
                          Number($('#society').val())
                          ];
                          
        return subject_points;
    }

    //括弧で括られている内容を、数値型に変換する
  function score_indicate(){
    
    //科目ごとの得点を配列で取得
    let subject_points = get_subject_points(); 

    let sum = 0;
    let Index_subject = subject_points.length;//教科の数
    
    //追加課題により変更
    sum=subject_points.reduce(function (previous, current, index, subject_points) {
    return previous + current;
    });
    /*
    //教科の数だけ回して、その教科の得点を足していく
    for(let i=0; i< Index_subject;i++){
        sum +=subject_points[i]
    }
    */
    
    //合計点を表示
    $("#sum_indicate").text(sum);
    
    // ここに、上記を参考にして平均点を出力する処理を書き込む
    //端数処理は不要？指示なしのため、とりあえずそのまま表示
    $("#avarage_indicate").text(sum/Index_subject);
    
  };
  
  //合計点、平均点の設定は、画面表示時にも行う（開いたとき空欄になってるのがなんかいやなので）
  score_indicate();

  function get_achievement(){
    //ランクの値の文字列
    //（平均点が80点以上なら"A"、60点以上なら"B"、40点以上なら"C"、それ以下なら"D"）
    //を返す関数

    //平均点を取得……平均点の計算は「score_indicate」で行われ、「avarage_indicate」欄に常に表示されている
    let avg=Number($("#avarage_indicate").text());
    
    //点数に基づき、ランクを設定
    switch (true) {
        case avg >= 80:
            return "A";
            break;
        
        case avg >= 60:
            return "B";
            break;
            
        case avg >= 40:
            return "C";
            break;
            
        default:
            return "D";
            break;
    }
    
    return "判定不能";//念のための例外処理……ここを通ることはないはず。
      
  }

  function get_judge(){
    //全ての教科が60点以上なら"合格"の文字列、
    //一つでも60点未満の教科があったら"不合格"の文字列を返す
      
    //各教科の得点を配列に格納
    let subject_points = get_subject_points(); 
    
    let Index_subject = subject_points.length;//教科の数
      //教科の数だけ回して、その教科の得点を足していく
    for(let i=0; i< Index_subject;i++){
      if (subject_points[i] < 60){
          //60点未満なら不合格
          return "不合格";
      }
    }
     //60点未満の教科が一つも無ければ合格
     return "合格" 
  }

  function judgement(){
      
    //ランク格納用変数を定義、評価を取得
    let achievement=get_achievement();
    
    //合否格納用変数を定義、合否判定を取得
    let judge=get_judge();
    
    //前回の「最終結果」を削除
    $("#alert-indicate").remove();
    
    //「最終結果」のラベルを挿入  
    $('#declaration').append(`<label id="alert-indicate" class="alert alert-info">あなたの成績は${achievement}です。${judge}です</label>`);
  };

//「科目ごとの得点欄」からカーソルが離れたら、「合計点」「平均点」を再計算
  $('#national_language, #english, #mathematics, #science, #society').blur(function() {
    
    const $change_point = $(this);
   
    //変更した値が正しいか確認
    if (chk_point($(this))===true){
      //正しければ
      //エラーメッセージを隠して
      $change_point.next(".ErrMsg").addClass("hide");
      
      score_indicate();
    }else{
      
      //エラーメッセージを表示して
      $change_point.next(".ErrMsg").removeClass("hide");
      //そこに戻る
      $change_point.focus();
    }
    
  });

　//「ランク」ボタンクリック
  $('#btn-evaluation').click(function() {
      
    //ランク格納用変数を定義、評価を取得
    let achievement=get_achievement();
    //取得した評価を設定
    $("#evaluation").text(achievement);
    
  });

  //「判定」ボタンクリック
  $('#btn-judge').click(function() {
    //合否格納用変数を定義、合否判定を取得
    let judge=get_judge();
    //取得した合否を設定
    $("#judge").text(judge);
    
  });

  $('#btn-declaration').click(function() {
    judgement();
  });
  
});