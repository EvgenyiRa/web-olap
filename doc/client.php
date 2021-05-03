<?php                
    require_once(realpath('../get-data-func.php'));
    session_start(); 
    if (!empty($_GET['token'])) {
        require_once(realpath('../classes/User.php'));    
        $data=User::getAuthByToken();
        if ($data['pr_ok']!== 777) {
            exit();
        }
    }
    else {
        exit();
    }
    $form_id=$_GET['form_id'];
    $user=json_decode($_SESSION['user_info'],true);
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
    
    <link type="text/css" rel="stylesheet" href="/css/jquery.pwstabs.css">
    <script src="/js/jquery.pwstabs.js"></script>
	
	<link href="/css/style_view.css" rel="stylesheet" type="text/css"/>
	<script src="/js/beginall.js"></script>
        
        <script type="text/javascript" src="/js/bootstrap.bundle.js"></script>
        <script type="text/javascript" src="/js/bootstrap-multiselect.js"></script>
        <link rel="/css/bootstrap-multiselect.css" type="text/css"/> 
        
        <script src="/js/lz-string.js"> </script>        
        
        <script type="text/javascript" src="/js/jquery.xmlrpc.js"></script>
        
        <script type="text/javascript" src="/js/index.js"></script>
        
        <script src="/js_forms/form_<?php echo $form_id;?>.js"> </script>
        
        <script src="/js/jquery.percentageloader-0.1.js"></script>
        <link rel="stylesheet" href="/css/jquery.percentageloader-0.1.css">
        
        <title>РВК.Платформа</title>
    </head>
    <body style="margin: 0;"> 
        <div id="toTop" > ^ Наверх </div>
        <input type="hidden" id="db_type" value="<?php echo db_type();?>">
        
        <img src="/img/loading.gif" id="loading_img" style="margin:0;padding:0;width:480px;height:320px;position:fixed;display:none;">
        
        
        <div id="modal_form"><!-- модальное oкнo редактирования/добавления -->
            <div class="modal_header">
                <span id="modal_close">X</span> <!-- Кнoпкa зaкрыть -->       
                <p id="modal_head_p"></p>
            </div> 
            <div class="modal_content">        
            </div>
            <div class="modal_footer">
                <button class="modal_button_c" id="modal_cancel">Отмена</button>
                <button class="modal_button_c" id="modal_save" place="" tr_id="">Сохранить</button>
            </div>    
        </div>        
        <div id="overlay"></div><!-- Пoдлoжкa модального окна-->  
	
        <div class="container" style="display:none;">
          <div class="hero-unit">

                <!--
                Please read this before copying the toolbar:

                * One of the best things about this widget is that it does not impose any styling on you, and that it allows you 
                * to create a custom toolbar with the options and functions that are good for your particular use. This toolbar
                * is just an example - don't just copy it and force yourself to use the demo styling. Create your own. Read 
                * this page to understand how to customise it:
            * https://github.com/mindmup/bootstrap-wysiwyg/blob/master/README.md#customising-
                -->
                <div id="alerts"></div>
            <div class="btn-toolbar" data-role="editor-toolbar" data-target="#editor">
              <div class="btn-group">
                  <a class="btn dropdown-toggle" data-toggle="dropdown_modal" title="Font"><i class="icon-font">A</i><b class="caret"></b></a>
                  <ul class="dropdown-menu_modal" pr_win_modal>
                  </ul>
                </div>
              <div class="btn-group">
                  <a class="btn dropdown-toggle" data-toggle="dropdown_modal" title="Font Size"><i class="icon-text-height">T</i><i style="font-size: 12pt;">&#8597;</i> &nbsp;<b class="caret"></b></a>
                  <ul class="dropdown-menu_modal" pr_win_modal>
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
                  <div class="dropdown-menu input-append" style="position: absolute;">
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

        <div class="content_value no_panel" style="margin: 0;">
            <div id="div_name_rep">
                <?php 
                    $m_get=$_GET;
                    unset($m_get['id']);
                    unset($m_get['form_id']);
                    unset($m_get['cat_id']);
                ?>
                <input id="in_name_rep" type="hidden" placeholder="Введите наименование отчета" style="width: 333px">
                <input type="hidden" 
                       id="in_rep_id" 
                       value="<?php echo $form_id;?>" 
                       pr_view="1" 
                       usr_fio="<?php echo $user['FIO'];?>" 
                       get_mass='<?php echo json_encode($m_get);?>'
                       phpsessionid="<?php echo session_id();?>"
                >
                <input type="hidden" id="in_action_value">
                <input type="hidden" id="in_rep_last_upd">
            </div>            
            <div id = "my">                    
            </div> 
        </div> 
        <div class="div_footer">
        </div>
        <div class="div_hidden" id="db_parametrs_list"><?php echo $data['p_list']['PARAMETERS_LIST'];?></div>
    </body>

</html>

