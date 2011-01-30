about SNBinder
=================


.. SNBinder is a client-side template engine implemented in JavaScript. Just like server-side template engines, 
..it binds a view (HTML template) to a data (JavaScript object) and generate an HTML text. 
SNBinder ��JavaScript�Ǽ������줿���饤����ȥ����ɤΥƥ�ץ졼�ȥ��󥸥�Ǥ��������С������ɤΥƥ�ץ졼�ȥ��󥸥�Ȼ��Ƥ��ޤ���view(HTML template)���ǡ������Ѥ���HTML txet���������ޤ���

.. 0. Design Principle and Sample Application
..0. �ǥ��������ȥ���ץ륢�ץꥱ�������
------------------------------------------------------

.. I developed SNBinder with a belief that the client-side data-binding gives a great flexibility to developers who want to offer a "desktop-application-like" user experience. Read the following article if you are interested in the architecture behind this effort. 

SNBinder�ϡ��ǥ����ȥåץ��ץꥱ�������˻����桼�����θ���⤿�餹�٤˥��饤����ȥ����ɤΥǡ����Х���ǥ��󥰤��󶡤��뤳�Ȥǡ�����ʳ�ȯ�Ķ����󶡤Ǥ���ȿ����Ƥ��ޤ�����̣������аʲ��Υ����ƥ�����������������

http://www.facebook.com/note.php?note_id=179569622077334

.. Fruence (a groupware application for Facebook users) is the showcase application that demonstrates the user experience enabled by this architecture. 
���Υ饤�֥�����Ѥ����Ǥ⥢�ץ� "Fruence (a groupware application for Facebook users)" ��������ޤ�����

http://www.fruence.com


.. 1. Initialization
1. ������ˤĤ���
---------------------------------

.. SNBinder requires JQuery. JQuery must be loaded before SNBinder. 
SNBinder ��jQuery��ɬ�פȤ��ޤ����ޤ���SNBinder����ɤ�������ɬ��jQuery����ɤ��Ƥ���������

.. After loading both JQuery and SNBinder, the application should initialize SNBinder by calling it's init method like this::
JQuery��SNBinder�Υ��ɤ���λ�����顢"init"�᥽�åɤ�ƤӽФ��������ԤäƲ����� ::

    $(document).ready(function() {
        SNBinder.init({});
    }

.. The init method takes an optional parameter, which is described in the "Advanced Initialization" section below. 
������᥽�åɤϡ������Ĥ��Υ��ץ���󤬤���ޤ���"Advanced Initialization"���������򻲹ͤˤ��Ƥ���������


.. 2. Binding
2. �Х���ǥ���
---------------------------

.. To bind an HTML template to a JavaScript object, you need to call SNBinder.bind() method. For example,::
JavaScript��HTML template��������ˤϡ�SNBinder.bind()�᥽�åɤ򥳡��뤷�ޤ���::

    var template = "<p>Hello $(.name)!</p>";
    var user = { "name":"Leonardo da Vinci" };
    $('.body').htm(SNBinder.bind(template, user));

.. will replace the contents of the body tag with "<p>Hello Leonardo da Vinci!</p>". 
���Υ���ץ�Ǥϡ�<body>�������"<p>Hello Leonardo da Vinci!</p>" ��ɽ������ޤ���

.. If you want to apply the same template to multiple objects, it's more efficient to use a complied form. ::
�⤷ʣ���Υ��֥������Ȥ������ߤ����Τʤ��,����ѥ���ƥ�ץ졼����Ѥ����ѿ���Ÿ�����ޤ���::

    var template = "<p>Hello $(.name)!</p>";
    var apply_template = SNBinder.compile(template);
    var user1 = { "name":"Leonardo da Vinci" };
    var user2 = { "name":"Michelangelo di Lodovico Buonarroti Simoni" };
    $('.div#user1').htm(apply_template(user1));
    $('.div#user2').htm(apply_template(user2));


.. It is also possible to bind a template to an array of objects::
����������Υƥ�ץ졼�Ȥؤ�����ߤ��ǽ�Ǥ�::

    var template = "<li>Hello $(.name)!</li>";
    var users = [
        { "name":"Leonardo da Vinci" }, 
        { "name":"Michelangelo di Lodovico Buonarroti Simoni" }, 
        { "name":"LDonato di Niccolò di Betto Bard" }
    ];
    $('.ul').htm(SNBinder.bind_rowset(template, users);
    
.. Following patterns in the template will be replaced.::
�ʲ����ͤʡ��ִ����ǽ�Ǥ�::

    $(.foo) will be replaced by the value of property "foo" (escaped)
    $(_foo) will be replaced by the value of property "foo" (non-escaped)
    $(index) will be replaced by the index (in case or bind_rowset)


.. 3. Loading templates
3. �ƥ�ץ졼�Ȥ��ɤ߹���
-----------------------------------------------

.. Although it is possible to hard-code HTML templates in JavaScript code like samples above, it is not a good
.. practice to mix View and Controller (notice that JavaScript is activing as a Controller). SNBinder offers
.. two helper functions that allows developers to load multiple templates in a single HTTP GET.::
�ϡ��ɥ����ɤ��줿HTML�򡢥ƥ�ץ졼����������ߤ������Ȥ⤢��Ǥ��礦����������View��˥ϡ��ɥ����ɤ��줿HTML�������ޤ�뤳�ȤϤ��ޤꤤ�����ȤǤ���ޤ��󡣤����ǡ�SNBinder�Ǥϡ�2�ĤΥإ�ѡ��ؿ����󶡤��ޤ�����������Ѥ��뤳�Ȥǡ�view�������html�ե�������ɤ߹���ɽ�����뤳�Ȥ���ǽ�ˤʤ�ޤ���
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
4. JSON�ǡ�����HTTP��ͳ���ɤ߹��� (Loading data via JSON over HTTP)
----------------------------------------------------------------------------------------------------

.. SNBinder has a set of helper methods, which makes it easy to fetch data (Json objects) over HTTP. ::
SNBinder�ϡ�HTTP��ͳ�Ǵ�ñ��JSON�ǡ������ɤ߹��ߥ�٤Υإ�ѡ��ؿ����󶡤��ޤ���::

    SNBinder.get(url, params, isJson, callback, options);
    SNBinder.post(url, params, isJson, callback);
    
    url: url to get/post the data from/data
    params: url parameters (JavaScript object)
    isJson: true if the server returns a JSON data
    callback: callback function that processes the data (if isJson is false) or json and data (if isJson is true)
    options: optional parameters to control the cache (default is {bypass_cache:false, cache_result:true} )

.. For example, if "/user/info" returns the JSON object represents the user (such as {"name":"Leonardo da Vinci"}), the example in previous section will become something like this
��Ǥϡ�"/user/info"�Υ쥹�ݥ󥹤�JSON�ǡ����ǡ��桼���ǡ�����{"name":"���ӥ��"})���쥹�ݥ󥹤���ޤ����ʲ��Τ褦�ˤ��뤳�ȤǼ����ǡ�����body�������ळ�Ȥ���ǽ�Ǥ���
::

    SNBinder.get_named_sections("/static/templates.htm", function(templates) {
        SNBinder.get("/user/info", nil, true, function(user) {
            $('.body').htm(SNBinder.bind(templates("main", user));
        });
    });


.. 5. Cache control
5. ����å�������
--------------------------------------

.. SNBinder has an in-memory cache for data and templates fetched via get() method, and following methods allows the application to access and control the cache.:: 
SNBinder�Ǥϡ�������˥���å��夵�줿�ǡ�����ƥ�ץ졼�Ȥ�get()�᥽�åɤǼ������뤳�Ȥ���ǽ�Ǥ����ޤ������������Ѥ����椹�뤳�Ȥ��ǽ�Ǥ�::

    flush_all(): flush all the cached data
    flush(url, params): flush associated with url + url parameters
    

.. 6. Advanced Initialization
6. ������ʥ��ɥХ󥹡�
-------------------------------------------------

If the application calls SNBinder.get or SNBinder.post with isJson=true and the server returns an JSON object 
that has the property "login_required" with true in it, SNBinder calls the "login" function specified in
the optional parameter to the SNBinder.init() method. 

