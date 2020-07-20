<!--WEB-OLAP v1.0
Copyright 2020 Rassadnikov Evgeniy Alekseevich

This file is part of WEB-OLAP.

WEB-OLAP is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

WEB-OLAP is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with WEB-OLAP.  If not, see <https://www.gnu.org/licenses/>.-->
<?php                
    require_once(realpath('../get-data-func.php'));
    session_start(); 
    if (!$_SESSION['user_info']) {
        header('Location: http://'.$_SERVER['HTTP_HOST'].'/enter.php');
        exit();
    }  
    else {
        $user=json_decode($_SESSION['user_info'],true);
        $user_right=json_decode($_SESSION['user_right'],true);     
        if (!exists_right($user_right,'View')) {
            header('Location: http://'.$_SERVER['HTTP_HOST'].'/index.php');
            exit();
        }  
    }
?>
﻿<!DOCTYPE html>
<html lang="ru-RU">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8; Cache-Control: no-cache"/>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="/js/jquery-3.3.1.js"></script>                
    
        <script src="/js/rep_add.js"></script>
        <script src="/js/excel_numeral.js"></script>
        <script src="/js/excel_formula.js"></script>
        <script src="/js/jexcel.js"></script>
        <script src="/js/jquery_jcalendar.js"></script>
        
        <link rel="stylesheet" href="/css/jquery_jcalendar_min.css" type="text/css" />
        <link rel="stylesheet" href="/css/jexcel_view.css" type="text/css" />
        
        <link rel="Stylesheet" type="text/css" href="/css/jpicker-1.1.6.min.css" />
        <link rel="Stylesheet" type="text/css" href="/css/jPicker.css" />
        <script src="/js/jpicker-1.1.6.min.js" type="text/javascript"></script> 
        
        <link href="/external/google-code-prettify/prettify.css" rel="stylesheet">
    <link href="/bootstrap-wysiwyg-http.css" rel="stylesheet">
    <link href="/css/bootstrap_responsive_min.css" rel="stylesheet">
    <link href="/css/font-awesome.css" rel="stylesheet">
        
    <script src="/external/jquery.hotkeys.js"></script>
    <script src="/js/bootstrap_min.js"></script>
    <script src="/external/google-code-prettify/prettify.js"></script>
    <link href="/index.css" rel="stylesheet">
    <script src="/bootstrap-wysiwyg.js"></script>		
	
	<link href="/css/style_view.css" rel="stylesheet" type="text/css"/>
	<script src="/js/beginall.js"></script>
        
        <script type="text/javascript" src="/js/bootstrap.bundle.js"></script>
        <script type="text/javascript" src="/js/bootstrap-multiselect.js"></script>
        <link rel="/css/bootstrap-multiselect.css" type="text/css"/> 
        
        <script src="/js/lz-string.js"> </script>
        
          
        <title>Просмотр WEB-OLAP отчета</title>
    </head>
    <body style="margin: 0;"> 
        <img src="/img/loading.gif" id="loading_img" style="margin:0;padding:0;width:480px;height:320px;position:fixed;display:none;z-index: 777;">
        
        <div class="sql_group_panel">
            <a title="Редактировать SQL-запрос" class="sql_group_edite">
                <img src="/img/edit_sql.png" width=30 height="auto">
            </a>
            <a title="Обновить результат" class="sql_refreshe">
                <img src="/img/refreshe.png" width=30 height="auto">
            </a>
            <a title="Удалить" class="sql_remove">
                <img src="/img/rep_del.png" width=30 height="auto">
            </a>                                         
       </div><!-- панель для редактирования sql-ячейки -->
        
        <div id="modal_form"><!-- модальное oкнo редактирования/добавления -->
        <div class="modal_header">
            <span id="modal_close">X</span> <!-- Кнoпкa зaкрыть -->       
            <p id="modal_head_p"></p>
        </div> 
        <div class="modal_content">        
        </div>
    </div>        
    <div id="overlay"></div><!-- Пoдлoжкa модального окна-->  
	
<div class="container" style="display:none;">
  <div class="hero-unit">
  
	<!---
	Please read this before copying the toolbar:

	* One of the best things about this widget is that it does not impose any styling on you, and that it allows you 
	* to create a custom toolbar with the options and functions that are good for your particular use. This toolbar
	* is just an example - don't just copy it and force yourself to use the demo styling. Create your own. Read 
	* this page to understand how to customise it:
    * https://github.com/mindmup/bootstrap-wysiwyg/blob/master/README.md#customising-
	--->
	<div id="alerts"></div>
    <div class="btn-toolbar" data-role="editor-toolbar" data-target="#editor">
      <div class="btn-group">
          <a class="btn dropdown-toggle" data-toggle="dropdown" title="Font"><i class="icon-font">A</i><b class="caret"></b></a>
          <ul class="dropdown-menu">
          </ul>
        </div>
      <div class="btn-group">
          <a class="btn dropdown-toggle" data-toggle="dropdown" title="Font Size"><i class="icon-text-height">T</i><i style="font-size: 12pt;">&#8597;</i> &nbsp;<b class="caret"></b></a>
          <ul class="dropdown-menu">
          <li><a data-edit="fontSize 5"><font size="5">Huge</font></a></li>
          <li><a data-edit="fontSize 3"><font size="3">Normal</font></a></li>
          <li><a data-edit="fontSize 1"><font size="1">Small</font></a></li>
          </ul>
      </div>
      <div class="btn-group">
        <a class="btn" data-edit="bold" title="Bold (Ctrl/Cmd+B)"><i class="icon-bold">B</i></a>
        <a class="btn" data-edit="italic" title="Italic (Ctrl/Cmd+I)"><i class="icon-italic" style="font-style: italic;">I</i></a>
        <a class="btn" data-edit="strikethrough" title="Strikethrough"><i class="icon-strikethrough" style="text-decoration: line-through;">S</i></a>
        <a class="btn" data-edit="underline" title="Underline (Ctrl/Cmd+U)"><i class="icon-underline" style="text-decoration: underline; ">U</i></a>
      </div>
      <div class="btn-group">
          <a class="btn" data-edit="insertunorderedlist" title="Bullet list" style="height: 25px;"><img src="/img/spisok.png" style="height: 16px;width: auto;margin: auto 0;"></a>
        <a class="btn" data-edit="insertorderedlist" title="Number list" style="height: 25px;"><img src="/img/number_list.png" style="height: 20px;width: auto;margin: auto 0;"></a>
        <a class="btn" data-edit="outdent" title="Reduce indent (Shift+Tab)" style="height: 25px;"><img src="/img/reduce_indent.png" style="height: 15px;width: auto;margin: auto 0;"></a>
        <a class="btn" data-edit="indent" title="Indent (Tab)" style="height: 25px;"><img src="/img/indent.png" style="height: 15px;width: auto;margin: auto 0;"></a>
      </div>
      <div class="btn-group">
        <a class="btn" data-edit="justifyleft" title="Align Left (Ctrl/Cmd+L)" style="height: 25px;"><img src="/img/align_left.png" style="height: 15px;width: auto;margin: auto 0;"></a>
        <a class="btn" data-edit="justifycenter" title="Center (Ctrl/Cmd+E)" style="height: 25px;"><img src="/img/center.png" style="height: 15px;width: auto;margin: auto 0;"></a>
        <a class="btn" data-edit="justifyright" title="Align Right (Ctrl/Cmd+R)" style="height: 25px;"><img src="/img/align_right.png" style="height: 15px;width: auto;margin: auto 0;"></a>
        <a class="btn" data-edit="justifyfull" title="Justify (Ctrl/Cmd+J)" style="height: 25px;"><img src="/img/justify.png" style="height: 15px;width: auto;margin: auto 0;"></a>
      </div>
      <div class="btn-group">
          <a class="btn" data-toggle="dropdown" title="Hyperlink" style="height: 25px;"><img src="/img/hyperlink.png" style="height: 15px;width: auto;margin: auto 0;"></a>
		    <div class="dropdown-menu input-append">
			    <input class="span2" placeholder="URL" type="text" data-edit="createLink"/>
			    <button class="btn" type="button">Add</button>
        </div>
          <a class="btn" data-edit="unlink" title="Remove Hyperlink" style="height: 25px;"><img src="/img/remove_hyperlink.png" style="height: 15px;width: auto;margin: auto 0;"></a>

      </div>
      
      <div class="btn-group">
          <a class="btn dropdown-toggle" title="Insert picture (or just drag & drop)" id="pictureBtn" style="height: 25px;"><img src="/img/insert_picture.png" style="height: 15px;width: auto;margin: auto 0;"></a>
        <input type="file" data-role="magic-overlay" data-target="#pictureBtn" data-edit="insertImage" />
      </div>
      <div class="btn-group">
          <a class="btn" data-edit="undo" title="Undo (Ctrl/Cmd+Z)" style="height: 25px;"><img src="/img/undo.png" style="height: 15px;width: auto;margin: auto 0;"></a>
        <a class="btn" data-edit="redo" title="Redo (Ctrl/Cmd+Y)" style="height: 25px;"><img src="/img/redo.png" style="height: 15px;width: auto;margin: auto 0;"></a>
      </div>
      <input type="text" data-edit="inserttext" id="voiceBtn" x-webkit-speech="">
    </div>

    <div id="editor">
			
    </div>
  </div>


  
</div>
<script>
  $(function(){
    function initToolbarBootstrapBindings() {
      var fonts = ['Serif', 'Sans', 'Arial', 'Arial Black', 'Courier', 
            'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times',
            'Times New Roman', 'Verdana'],
            fontTarget = $('[title=Font]').siblings('.dropdown-menu');
      $.each(fonts, function (idx, fontName) {
          fontTarget.append($('<li><a data-edit="fontName ' + fontName +'" style="font-family:\''+ fontName +'\'">'+fontName + '</a></li>'));
      });
      $('a[title]').tooltip({container:'body'});
    	$('.dropdown-menu input').click(function() {return false;})
		    .change(function () {$(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle');})
        .keydown('esc', function () {this.value='';$(this).change();});

      $('[data-role=magic-overlay]').each(function () { 
        var overlay = $(this), target = $(overlay.data('target')); 
        overlay.css('opacity', 0).css('position', 'absolute').offset(target.offset()).width(target.outerWidth()).height(target.outerHeight());
      });
      if ("onwebkitspeechchange"  in document.createElement("input")) {
        var editorOffset = $('#editor').offset();
        $('#voiceBtn').css('position','absolute').offset({top: editorOffset.top, left: editorOffset.left+$('#editor').innerWidth()-35});
      } else {
        $('#voiceBtn').hide();
      }
	};
	function showErrorAlert (reason, detail) {
		var msg='';
		if (reason==='unsupported-file-type') { msg = "Unsupported format " +detail; }
		else {
			console.log("error uploading file", reason, detail);
		}
		$('<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button>'+ 
		 '<strong>File upload error</strong> '+msg+' </div>').prependTo('#alerts');
	};
    initToolbarBootstrapBindings();  
	$('#editor').wysiwyg({ fileUploadError: showErrorAlert} );
    window.prettyPrint && prettyPrint();
  });
</script>
        
        <a class="a_open_panel_view" title="Открыть панель"><img src="/img/panel_open.png" style="height:43px;width:auto"></a>
        <div class="rep_add_all">
            <div class="slide_panel_view">	
                <div class="close_panel"><a class="a_close_panel" title="Скрыть панель"><img src="/img/rep_del.png" style="height:13px;width:auto"></a></div>
                <div class="div_action_one" style="text-align: right;padding-right: 10px;">                        
                    <ul class="ul_cons top-level">
                        <li class="li_cons export li_cons_top" style="background: none;"><a href="/"><img src="/img/home.png" style="height:33px;width:auto" title="На главную"></a></li>
                        <li id="import_ras" class="li_cons panel_action export li_cons_top" style="background: none;vertical-align: bottom;">                            
                            <label class="file_upload">
                                <span class="button"><img src="/img/import.png" style="height:33px;width:auto" title="Загрузить отчет в формате .RAS"></span>
                                <mark></mark>
                                <input type="file">
                            </label>
                        </li>
                        <li id="export" class="li_cons export li_cons_top" style="background: none;"><img src="/img/export.png" style="height:33px;width:auto"title="Экспорт">
                            <ul class="ul_cons second-level" style="width: 50px;text-align: center;">
                                <li id="export_excel" class="li_cons panel_action" title="Экспорт в .XLSX" style="height: 34px;"><img src="/img/UPLOAD-Excel.png" style="height:33px;width:auto">                                    
                                </li>
                                <li id="export_ras" class="li_cons panel_action" title="Экспорт в .RAS" style="height: 34px;"><img src="/img/ra.png" style="height:33px;width:auto">
                                </li>                                
                            </ul>
                        </li>
                    </ul>
                </div>                                
            </div>        
            <div class="no_panel_view">
                <div id="div_name_rep" style="display: none;">
                    <input id="in_name_rep" type="text" placeholder="Введите наименование отчета" style="width: 333px">                   
                    <input type="hidden" id="in_rep_id" value="<?php echo $_GET['id'];?>">
                    <input type="hidden" id="in_rep_last_upd">
                </div>
                <div id = "my" style="padding: 0;">                    
                </div>                                
            </div>
        </div>        
    
    </body>

</html>
