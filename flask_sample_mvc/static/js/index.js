// 変数一つをテンプレートに埋め込む
function rend_item(){
  var template = "<p>Hello $(.name)!</p>";
  var user = { "name":"Leonardo da Vinci" };
  $('#item').html(SNBinder.bind(template, user));
}

// 配列をテンプレートに従い複数埋め込む
function rend_items(){ 
  var template = "<li>Hello $(.name)!</li>";
  var users = [
        { "name":"Leonardo da Vinci" },
        { "name":"Michelangelo di Lodovico Buonarroti Simoni" },
        { "name":"LDonato di Niccol di Betto Bard" }
      ];
  $('#items').html(SNBinder.bind_rowset(template, users));
  }

// 外部テンプレートファイルを読み込み変数を埋め込む
function static_data(){
  SNBinder.get_named_sections("/static/template.html", '', function(templates) {
    var user = { "name":"Leonardo da Vinci" };
    $('#from_file').html(SNBinder.bind(templates.tmpl_name, user));
  });
}

// 外部テンプレートファイルを読み込み、別のURLからJsonを取得しデータを埋め込む
function get_data(){
  SNBinder.get_named_sections("/static/template.html", '', function(templates) {
    var req_url = '/api/get/time';
    console.info(templates);
    SNBinder.get(req_url, '', true, 
      function(json) {
        $('#time').html(SNBinder.bind(templates.tmpl_time, json));
     });
  });
};


