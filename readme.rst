about SNBinder
=================


.. SNBinder is a client-side template engine implemented in JavaScript. Just like server-side template engines, 
..it binds a view (HTML template) to a data (JavaScript object) and generate an HTML text. 
SNBinder はJavaScriptで実装されたクライアントサイドのテンプレートエンジンです。サーバーサイドのテンプレートエンジンと似ています。view(HTML template)がデータを用いてHTML txetを生成します。

.. 0. Design Principle and Sample Application
..0. デザイン原理とサンプルアプリケーション
------------------------------------------------------

.. I developed SNBinder with a belief that the client-side data-binding gives a great flexibility to developers who want to offer a "desktop-application-like" user experience. Read the following article if you are interested in the architecture behind this effort. 

SNBinderは、デスクトップアプリケーションに似たユーザー体験をもたらす為にクライアントサイドのデータバインディングを提供することで、柔軟な開発環境を提供できると信じています。興味があれば以下のアーティクルを御覧ください

http://www.facebook.com/note.php?note_id=179569622077334

.. Fruence (a groupware application for Facebook users) is the showcase application that demonstrates the user experience enabled by this architecture. 
このライブラリを使用したでもアプリ "Fruence (a groupware application for Facebook users)" を作成しました。

http://www.fruence.com


.. 1. Initialization
1. 初期化について
---------------------------------

.. SNBinder requires JQuery. JQuery must be loaded before SNBinder. 
SNBinder はjQueryを必要とします。また、SNBinderをロードする前に必ずjQueryをロードしてください。

.. After loading both JQuery and SNBinder, the application should initialize SNBinder by calling it's init method like this::
JQueryとSNBinderのロードが完了したら、"init"メソッドを呼び出し初期化を行って下さい ::

    $(document).ready(function() {
        SNBinder.init({});
    }

.. The init method takes an optional parameter, which is described in the "Advanced Initialization" section below. 
初期化メソッドは、いくつかのオプションがあります。"Advanced Initialization"セクションを参考にしてください。


.. 2. Binding
2. バインディング
---------------------------

.. To bind an HTML template to a JavaScript object, you need to call SNBinder.bind() method. For example,::
JavaScriptをHTML templateに埋め込むには、SNBinder.bind()メソッドをコールします。::

    var template = "<p>Hello $(.name)!</p>";
    var user = { "name":"Leonardo da Vinci" };
    $('.body').htm(SNBinder.bind(template, user));

.. will replace the contents of the body tag with "<p>Hello Leonardo da Vinci!</p>". 
このサンプルでは、<body>タグ内に"<p>Hello Leonardo da Vinci!</p>" が表示されます。

.. If you want to apply the same template to multiple objects, it's more efficient to use a complied form. ::
もし複数のオブジェクトを埋め込みたいのならば,コンパイルテンプレーを使用して変数を展開します。::

    var template = "<p>Hello $(.name)!</p>";
    var apply_template = SNBinder.compile(template);
    var user1 = { "name":"Leonardo da Vinci" };
    var user2 = { "name":"Michelangelo di Lodovico Buonarroti Simoni" };
    $('.div#user1').htm(apply_template(user1));
    $('.div#user2').htm(apply_template(user2));


.. It is also possible to bind a template to an array of objects::
もちろん、配列のテンプレートへの埋込みも可能です::

    var template = "<li>Hello $(.name)!</li>";
    var users = [
        { "name":"Leonardo da Vinci" }, 
        { "name":"Michelangelo di Lodovico Buonarroti Simoni" }, 
        { "name":"LDonato di Niccol嘆 di Betto Bard" }
    ];
    $('.ul').htm(SNBinder.bind_rowset(template, users);
    
.. Following patterns in the template will be replaced.::
以下の様な、置換も可能です::

    $(.foo) will be replaced by the value of property "foo" (escaped)
    $(_foo) will be replaced by the value of property "foo" (non-escaped)
    $(index) will be replaced by the index (in case or bind_rowset)


.. 3. Loading templates
3. テンプレートの読み込み
-----------------------------------------------

.. Although it is possible to hard-code HTML templates in JavaScript code like samples above, it is not a good
.. practice to mix View and Controller (notice that JavaScript is activing as a Controller). SNBinder offers
.. two helper functions that allows developers to load multiple templates in a single HTTP GET.::
ハードコードされたHTMLを、テンプレート内に埋め込みたいこともあるでしょう。しかし、View内にハードコードされたHTMLが埋め込まれることはあまりいいことでありません。そこで、SNBinderでは、2つのヘルパー関数を提供します。これらを使用することで、view内に別途htmlファイルを読み込み表示することが可能になります。
::

    SNBinder.get_sections(url, callback)
    SNBinder.get_named_sections(url, callback)

The load_sections method loads a template bundle (an array of templates joined with "{%}") from the specified URL, and calls the callback function with an array of templates. 

The load_sections method loads a named template bundle (set of named templates, where each name is specified with "{%}...{%}"), 
and calls the callback function with a dictionary of templates. For example, assume the named template bundle has follwing
contents (a single template named "main") and accessible at "/static/template.htm"::

    {%}main{%}
    <p>Hello $(.name)!</p>

The following code will load this template bundle, and performs the same view-data binding described in section 2.:: 

    SNBinder.get_named_sections("/static/templates.htm", function(templates) {
        var user = { "name":"Leonardo da Vinci" };
        $('.body').htm(SNBinder.bind(templates("main", user));
    });


.. 4. Loading data via JSON over HTTP
4. JSONデータのHTTP経由の読み込み (Loading data via JSON over HTTP)
----------------------------------------------------------------------------------------------------

.. SNBinder has a set of helper methods, which makes it easy to fetch data (Json objects) over HTTP. ::
SNBinderは、HTTP経由で簡単にJSONデータを読み込みム為のヘルパー関数を提供します。::

    SNBinder.get(url, params, isJson, callback, options);
    SNBinder.post(url, params, isJson, callback);
    
    url: url to get/post the data from/data
    params: url parameters (JavaScript object)
    isJson: true if the server returns a JSON data
    callback: callback function that processes the data (if isJson is false) or json and data (if isJson is true)
    options: optional parameters to control the cache (default is {bypass_cache:false, cache_result:true} )

.. For example, if "/user/info" returns the JSON object represents the user (such as {"name":"Leonardo da Vinci"}), the example in previous section will become something like this
例では、"/user/info"のレスポンスがJSONデータで、ユーザデータ（{"name":"ダビンチ"})がレスポンスされます。以下のようにすることで取得データをbodyに埋め込むことが可能です。
::

    SNBinder.get_named_sections("/static/templates.htm", function(templates) {
        SNBinder.get("/user/info", nil, true, function(user) {
            $('.body').htm(SNBinder.bind(templates("main", user));
        });
    });


.. 5. Cache control
5. キャッシュ制御
--------------------------------------

.. SNBinder has an in-memory cache for data and templates fetched via get() method, and following methods allows the application to access and control the cache.:: 
SNBinderでは、メモリ内にキャッシュされたデータやテンプレートをget()メソッドで取得することが可能です。また、それらの利用を制御することも可能です::

    flush_all(): flush all the cached data
    flush(url, params): flush associated with url + url parameters
    

.. 6. Advanced Initialization
6. 初期化（アドバンス）
-------------------------------------------------

If the application calls SNBinder.get or SNBinder.post with isJson=true and the server returns an JSON object 
that has the property "login_required" with true in it, SNBinder calls the "login" function specified in
the optional parameter to the SNBinder.init() method. 

