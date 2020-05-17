<!--Web-olap v1.0
Copyright 2020 Rassadnikov Evgeniy Alekseevich

This file is part of Web-olap.

Web-olap is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Web-olap is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Web-olap.  If not, see <https://www.gnu.org/licenses/>.-->
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
        if (!exists_right($user_right,'Edite')) {
            header('Location: http://'.$_SERVER['HTTP_HOST'].'/index.php');
            exit();
        }             
    }    
?>
?<!DOCTYPE html>
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
        <link rel="stylesheet" href="/css/jexcel.css" type="text/css" />
        
        <link rel="Stylesheet" type="text/css" href="/css/jPicker-1.1.6.min.css" />
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
	
	<link href="/style.css" rel="stylesheet" type="text/css"/>
	<script src="/js/beginall.js"></script>
        
        <script type="text/javascript" src="/js/bootstrap.bundle.js"></script>
        <script type="text/javascript" src="/js/bootstrap-multiselect.js"></script>
        <link rel="/css/bootstrap-multiselect.css" type="text/css"/> 
        
        <script src="/js/lz-string.js"> </script>
        
        <script type="text/javascript" src="/js/ace.js"></script>
        
        <script type="text/javascript" src="/js/jquery.xmlrpc.js"></script>
        
        <script src="/js/jquery.percentageloader-0.1.js"></script>
        <link rel="stylesheet" href="/css/jquery.percentageloader-0.1.css">
        
        <?php 
            if ($_GET['id']) {
                echo '<script src="/js_forms/form_'.$_GET['id'].'.js"></script>';
            }            
        ?>
          
        <title>Создание web-olap отчета</title>
    </head>
    <body style="margin: 0;">
        <div id="toTop" > ^ Наверх </div>
        <input type="hidden" id="db_type" value="<?php echo db_type();?>">
        
        <img src="/img/loading.gif" id="loading_img" style="margin:0;padding:0;width:480px;height:320px;position:fixed;display:none;">
        
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
            <div class="modal_footer">
                <button class="modal_button_c" id="modal_cancel">Отмена</button>
                <button class="modal_button_c" id="modal_save" place="" tr_id="">Сохранить</button>
            </div>    
        </div>        
        <div id="overlay"></div><!-- Пoдлoжкa модального окна-->  
	
<div class="container" style="display:none;">
  <div class="hero-unit">
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
        
        <a class="a_open_panel" title="Открыть панель"><img src="/img/panel_open.png" style="height:43px;width:auto"></a>
        <div class="rep_add_all">
            <div class="slide_panel">	
                <div class="close_panel"><a class="a_close_panel" title="Скрыть панель"><img src="/img/rep_del.png" style="height:13px;width:auto"></a></div>
                <div class="div_action_one" style="text-align: right;padding-right: 10px;">                        
                    <ul class="ul_cons top-level">
                        <li class="li_cons export li_cons_top" style="background: none;"><a href="/"><img src="/img/home.png" style="height:27px;width:auto" title="На главную"></a></li>
                        <li id="save_rap" class="li_cons panel_action export li_cons_top" style="background: none;"><img src="/img/save.png" style="height:27px;width:auto" title="Сохранить форму отчета"></li>
                        <li id="import_ras" class="li_cons panel_action export li_cons_top" style="background: none;vertical-align: bottom;">                            
                            <label class="file_upload">
                                <span class="button"><img src="/img/import.png" style="height:27px;width:auto" title="Загрузить отчет в формате .RAS"></span>
                                <mark></mark>
                                <input type="file">
                            </label>
                        </li>
                        <li id="export" class="li_cons export li_cons_top" style="background: none;"><img src="/img/export.png" style="height:27px;width:auto;"title="Экспорт">
                            <ul class="ul_cons second-level" style="width: 50px;text-align: center;">
                                <li id="export_excel" class="li_cons panel_action" title="Экспорт в .XLSX" style="height: 34px;"><img src="/img/UPLOAD-Excel.png" style="height:33px;width:auto">                                    
                                </li>
                                <li id="export_ras" class="li_cons panel_action" title="Экспорт в .RAS" style="height: 34px;"><img src="/img/ra.png" style="height:33px;width:auto">
                                </li>                                
                            </ul>
                        </li>
                        <?php
                            if (exists_right($user_right,'View')) {
                                echo '<li id="rep_view" class="li_cons export li_cons_top" style="background: none;">'
                                        . '<a class="rep_view" id="'.$_GET['id'].'" title="Просмотр отчета" href="/rep_view.php?id='.$_GET['id'].'"><img src="/img/rep_view.png" style="height:27px;width:auto" title="Просмотр полученной формы"></a>'
                                    . '</li>';
                            }
                        ?>    
                            
                    </ul>
                    <!--<a class="panel_action" id="upload_excel" title="Экспорт в Excel"><img src="/img/UPLOAD-Excel.png" style="height:33px;width:auto" title="Экспорт в Excel"></a> -->
                </div>   
                <div class="div_action_one">
                    <img src="/img/border_pointer.png" class="border_pointer">
                    <!--<a class="panel_action" id="cell_bord" title="Нижняя граница" cb_name="cell_bord_bottom"><img src="/img/cell_bord_bottom.png" style="height:26px;width:auto"title="Нижняя граница"></a><a class="panel_action" id="cell_bord" title="Верхняя граница" cb_name="cell_bord_top"><img src="/img/cell_bord_top.png" style="height:30px;width:auto" title="Верхняя граница"></a><a class="panel_action" id="cell_bord" title="Левая граница" cb_name="cell_bord_left"><img src="/img/cell_bord_left.png" style="height:30px;width:auto" title="Левая граница"></a><a class="panel_action" id="cell_bord" title="Правая граница" cb_name="cell_bord_right"><img src="/img/cell_bord_right.png" style="height:30px;width:auto" title="Правая граница"></a><a class="panel_action" id="cell_bord" title="Все границы" cb_name="cell_bord_all"><img src="/img/cell_bord_all.png" style="height:30px;width:auto" title="Правая граница"></a>-->
                    <ul class="ul_cons top-level">
                        <li class="li_cons panel_action cell_bord_style li_cons_top bord_orient" id="cell_bord" bord_orient="bottom"><img src="/img/cell_bord_bottom.png" style="height:26px;width:auto"title="Нижняя граница">
                            <ul class="ul_cons second-level">
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_solid" name_style="solid">Solid
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_double" name_style="double">Double
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_groove" name_style="groove">Groove
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_ridge" name_style="ridge">Ridge
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>                                
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_inset" name_style="inset">Inset
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_outset" name_style="outset">Outset
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>                                
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_dotted" name_style="dotted">Dotted
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>                                 
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_dashed" name_style="dashed">Dashed
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>
                            </ul>
                        </li>
                        <li class="li_cons panel_action cell_bord_style li_cons_top bord_orient" id="cell_bord" bord_orient="top"><img src="/img/cell_bord_top.png" style="height:26px;width:auto" title="Верхняя граница">
                            <ul class="ul_cons second-level">
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_solid" name_style="solid">Solid
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_double" name_style="double">Double
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_groove" name_style="groove">Groove
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_ridge" name_style="ridge">Ridge
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>                                
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_inset" name_style="inset">Inset
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_outset" name_style="outset">Outset
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>                                
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_dotted" name_style="dotted">Dotted
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>                                 
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_dashed" name_style="dashed">Dashed
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>                               
                            </ul>
                        </li>
                        <li class="li_cons panel_action cell_bord_style li_cons_top bord_orient" id="cell_bord" bord_orient="left"><img src="/img/cell_bord_left.png" style="height:26px;width:auto" title="Левая граница">
                            <ul class="ul_cons second-level">
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_solid" name_style="solid">Solid
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_double" name_style="double">Double
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_groove" name_style="groove">Groove
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_ridge" name_style="ridge">Ridge
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>                                
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_inset" name_style="inset">Inset
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_outset" name_style="outset">Outset
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>                                
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_dotted" name_style="dotted">Dotted
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>                                 
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_dashed" name_style="dashed">Dashed
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>                                
                            </ul>
                        </li>
                        <li class="li_cons panel_action cell_bord_style li_cons_top bord_orient" id="cell_bord" bord_orient="right"><img src="/img/cell_bord_right.png" style="height:26px;width:auto" title="Правая граница">
                            <ul class="ul_cons second-level">
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_solid" name_style="solid">Solid
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_double" name_style="double">Double
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_groove" name_style="groove">Groove
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_ridge" name_style="ridge">Ridge
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>                                
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_inset" name_style="inset">Inset
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_outset" name_style="outset">Outset
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>                                
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_dotted" name_style="dotted">Dotted
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>                                 
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_dashed" name_style="dashed">Dashed
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>                                 
                            </ul>
                        </li>
                        <li class="li_cons panel_action cell_bord_style li_cons_top bord_orient" id="cell_bord" bord_orient="all"><img src="/img/cell_bord_all.png" style="height:26px;width:auto" title="Все границы">
                            <ul class="ul_cons second-level">
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_solid" name_style="solid">Solid
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_double" name_style="double">Double
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_groove" name_style="groove">Groove
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_ridge" name_style="ridge">Ridge
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>                                
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_inset" name_style="inset">Inset
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_outset" name_style="outset">Outset
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>                                
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_dotted" name_style="dotted">Dotted
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>                                 
                                <li id="cell_bord" class="li_cons panel_action cell_bord_style a_cell_bord_s_dashed" name_style="dashed">Dashed
                                    <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
                                </li>                                 
                            </ul>
                        </li>
                        <li class="li_cons panel_action cell_bord_style li_cons_top bord_orient" id="cell_bord" bord_orient="none"><img src="/img/cell_bord_none.png" style="height:26px;width:auto" title="Нет границы">
                        <div class="clear"></div>
                    </ul>
                </div>
                <div class="div_action_one">
                    <input id="border_color" value="#000000" title="Изменить цвет рамки"><div id="border_color_ex" class="shestgran" title="Образец цвета рамки ячейки"></div><button id="border_color_change" title="Выбрать цвет рамки">...</button>
                    <div id="Inline_bc"></div>
                    <input type="number" title="Толщина линии рамки" id="cell_bord_size" value="1" style="margin: 0 0 0 2px;width: 30px;">                    
                </div>
                
                <div class="div_action_one"><a class="panel_action" id="col_plus" title="Объединить/разъединить выделенные ячейки" style="margin-right: 2px;"><img src="/img/col_plus.png" style="height:33px;width:auto" title="Объединить/разъединить выделенные ячейки"></a><a class="panel_action" id="tab_clear" title="Очистить таблицу"><img src="/img/clear.png" style="height:33px;width:auto" title="Очистить таблицу"></a><a class="panel_action" id="td_clear" title="Очистить ячейку таблицы"><img src="/img/clear_one.png" style="height:33px;width:auto" title="Очистить ячейку таблицы"></a><a class="panel_action" id="td_get_panel_action" title="Принудительно вызвать панель действий в ячейке"><img src="/img/actions.png" style="height:33px;width:auto" title="Принудительно вызвать панель действий в ячейке"></a></div>
                <!--<div class="div_action_one">
                    <select name="type_col" id="type_col" title="Изменить тип столбца" style="width: 170px;margin:0;">
                        <option selected value="text">Текст</option>
                        <option value="number">Число</option>
                        <option value="checkbox">Чекбокс</option>
                        <option value="autocomplete">Перечисление</option>
                        <option value="calendar">Дата</option>                        
                    </select>
                </div>-->
                <div class="div_action_one">
                    <a class="panel_action" id="format_right" title="Выравнивание по правому краю" td_format="right"><img src="/img/formatjustifyright.png" style="height:33px;width:auto" title="Выравнивание по правому краю"></a><a class="panel_action" id="format_center" title="Выравнивание по центру" td_format="center"><img src="/img/centrejust.png" style="height:33px;width:auto" title="Выравнивание по центру"></a><a class="panel_action" id="format_left" title="Выравнивание по левому краю" td_format="left"><img src="/img/formatjustifyleft.png" style="height:33px;width:auto" title="Выравнивание по левому краю"></a><a class="panel_action" id="format_all" title="Выравнивание по всей ширине" td_format="justify"><img src="/img/formatjustifyfill.png" style="height:33px;width:auto" title="Выравнивание по всей ширине"></a>
                </div>
                <div class="div_action_one">
                    <a class="panel_action" id="format_v_top" title="Вертикальное выравнивание по верхнему краю" td_format_v="top"><img src="/img/format_td_v_top.png" style="height:33px;width:auto" title="Вертикальное выравнивание по верхнему краю"></a><a class="panel_action" id="format_v_center" title="Вертикальное выравнивание по центру" td_format_v="middle"><img src="/img/format_td_v_center.png" style="height:33px;width:auto" title="Вертикальное выравнивание по центру"></a><a class="panel_action" id="format_v_bottom" title="Вертикальное выравнивание по нижнему краю" td_format_v="bottom"><img src="/img/format_td_v_bottom.png" style="height:33px;width:auto" title="Вертикальное выравнивание по нижнему краю"></a>
                    <input type="number" title="Размер шрифта" id="font_size" value="16" style="margin: 0;">                    
                </div>
                <div class="div_action_one">
                    <select id="font_type" title="Изменить тип шрифта" style="width: 170px;margin:0;">
                        <option><font face="Academy Engraved LET">academy engraved let</font></option>
                        <option><font face="algerian">algerian</font></option>
                        <option><font face="Amaze">amaze</font></option>
                        <option><font face="arial">arial</font></option>
                        <option><font face="arial black">arial black</font></option>
                        <option><font face="Balthazar">balthazar</font></option>
                        <option><font face="BankGothic Lt BT">bankgothic lt bt</font></option>
                        <option><font face="bart">bart</font></option>
                        <option><font face="Bimini">bimini</font></option>
                        <option><font face="book antiqua">book antiqua</font></option>
                        <option><font face="bookman old style">bookman old style</font></option>
                        <option><font face="braggadocio">braggadocio</font></option>
                        <option><font face="britannic bold">britannic bold</font></option>
                        <option><font face="brush script mt">brush script mt</font></option>
                        <option><font face="Calibri">calibri</font></option>
                        <option><font face="Cambria">cambria</font></option>
                        <option><font face="Candara">candara</font></option>
                        <option><font face="century gothic">century gothic</font></option>
                        <option><font face="century schoolbook">century schoolbook</font></option>
                        <option><font face="Chasm">chasm</font></option>
                        <option><font face="chicago">chicago</font></option>
                        <option><font face="colonna mt">colonna mt</font></option>
                        <option><font face="comic sans ms">comic sans ms</font></option>
                        <option><font face="CommercialScript BT">commercialscript bt</font></option>
                        <option><font face="Consolas">consolas</font></option>
                        <option><font face="Constantia">constantia</font></option>
                        <option><font face="Coolsville">coolsville</font></option>
                        <option><font face="Corbel">corbel</font></option>
                        <option><font face="courier">courier</font></option>
                        <option><font face="courier new">courier new</font></option>
                        <option><font face="cursive">cursive</font></option>
                        <option><font face="Dayton">dayton</font></option>
                        <option><font face="desdemona">desdemona</font></option>
                        <option><font face="Estrangelo Edessa">estrangelo edessa</font></option>
                        <option><font face="fantasy">fantasy</font></option>
                        <option><font face="Flat Brush">flat brush</font></option>
                        <option><font face="footlight mt light">footlight mt light</font></option>
                        <option><font face="Franklin Gothic Medium">franklin gothic medium</font></option>
                        <option><font face="Futurablack BT">futurablack bt</font></option>
                        <option><font face="Futuralight BT">futuralight bt</font></option>
                        <option><font face="Gabriola">gabriola</font></option>
                        <option><font face="garamond">garamond</font></option>
                        <option><font face="Gautami">gautami</font></option>
                        <option><font face="gaze">gaze</font></option>
                        <option><font face="geneva">geneva</font></option>
                        <option><font face="georgia">georgia</font></option>
                        <option><font face="Georgia Italic Impact">georgia italic impact</font></option>
                        <option><font face="Geotype TT">geotype tt</font></option>
                        <option><font face="helterskelter">helterskelter</font></option>
                        <option><font face="helvetica">helvetica</font></option>
                        <option><font face="herman">herman</font></option>
                        <option><font face="Highlight LET">highlight let</font></option>
                        <option><font face="impact">impact</font></option>
                        <option><font face="Jester">jester</font></option>
                        <option><font face="Joan">joan</font></option>
                        <option><font face="John Handy LET">john handy let</font></option>
                        <option><font face="Jokerman LET">jokerman let</font></option>
                        <option><font face="Kelt">kelt</font></option>
                        <option><font face="Kids">kids</font></option>
                        <option><font face="kino mt">kino mt</font></option>
                        <option><font face="La Bamba LET">la bamba let</font></option>
                        <option><font face="Latha">latha</font></option>
                        <option><font face="Lithograph">lithograph</font></option>
                        <option><font face="Lucida Console">lucida console</font></option>
                        <option><font face="Lucida Sans Console">lucida sans console</font></option>
                        <option><font face="Lucida Sans Unicode">lucida sans unicode</font></option>
                        <option><font face="map symbols">map symbols</font></option>
                        <option><font face="Marlett">marlett</font></option>
                        <option><font face="matteroffact">matteroffact</font></option>
                        <option><font face="Matisse ITC">matisse itc</font></option>
                        <option><font face="matura mt script capitals">matura mt script capitals</font></option>
                        <option><font face="Mekanik LET">mekanik let</font></option>
                        <option><font face="Modern">modern</font></option>
                        <option><font face="Modern MS Sans Serif">modern ms sans serif</font></option>
                        <option><font face="monaco">monaco</font></option>
                        <option><font face="monospace">monospace</font></option>
                        <option><font face="monotype sorts">monotype sorts</font></option>
                        <option><font face="ms line draw">ms linedraw</font></option>
                        <option><font face="MS Sans Serif">ms sans serif</font></option>
                        <option><font face="MS Serif">ms serif</font></option>
                        <option><font face="MV Boli">mv boli</font></option>
                        <option><font face="new york">new york</font></option>
                        <option><font face="Nyala">nyala</font></option>
                        <option><font face="OldDreadfulNo7 BT">olddreadfulno7 bt</font></option>
                        <option><font face="orange LET">orange let</font></option>
                        <option><font face="palatino">palatino</font></option>
                        <option><font face="Palatino Linotype">palatino linotype</font></option>
                        <option><font face="playbill">playbill</font></option>
                        <option><font face="Pump Demi Bold LET">pump demi bold let</font></option>
                        <option><font face="puppylike">puppylike</font></option>
                        <option><font face="Roland">roland</font></option>
                        <option><font face="Roman">roman</font></option>
                        <option><font face="sans-serif">sans-serif</font></option>
                        <option><font face="Script">script</font></option>
                        <option><font face="ScriptS">scripts</font></option>
                        <option><font face="Scruff LET">scruff let</font></option>
                        <option><font face="Segoe Print">segoe print</font></option>
                        <option><font face="Segoe Script">segoe script</font></option>
                        <option><font face="Segoe UI">segoe ui</font></option>
                        <option><font face="Serif">serif</font></option>
                        <option><font face="Short Hand">short hand</font></option>
                        <option><font face="Signs Normal">signs normal</font></option>
                        <option><font face="simplex">simplex</font></option>
                        <option><font face="simpson">simpson</font></option>
                        <option><font face="Small Fonts">small fonts</font></option>
                        <option><font face="Stylus BT">stylus bt</font></option>
                        <option><font face="SuperFrench">superfrench</font></option>
                        <option><font face="Surfer">surfer</font></option>
                        <option><font face="Swis721 BT">swis721 bt</font></option>
                        <option><font face="Swis721 BlkOul BT">swis721 blkoul bt</font></option>
                        <option><font face="Symap">symap</font></option>
                        <option><font face="symbol">symbol</font> (symbol)</option>
                        <option><font face="tahoma">tahoma</font></option>
                        <option><font face="Technic">technic</font></option>
                        <option><font face="Tempus Sans ITC">tempus sans itc</font></option>
                        <option><font face="Terk">terk</font></option>
                        <option><font face="times">times</font></option>
                        <option selected="selected"><font face="times new roman">times new roman</font></option>
                        <option><font face="trebuchet MS">trebuchet ms</font></option>
                        <option><font face="TRENDY">trendy</font></option>
                        <option><font face="Txt">txt</font></option>
                        <option><font face="Tunga">tunga</font></option>
                        <option><font face="verdana">verdana</font></option>
                        <option><font face="Victorian LET">victorian let</font></option>
                        <option><font face="Vineta BT">vineta bt</font></option>
                        <option><font face="Vivian">vivian</font></option>
                        <option><font face="webdings">webdings</font> (webdings)</option>
                        <option><font face="Western">western</font></option>
                        <option><font face="Westminster">westminster</font></option>
                        <option><font face="Westwood LET">westwood let</font></option>
                        <option><font face="wide latin">wide latin</font></option>
                        <option><font face="wingdings">wingdings</font> (wingding)</option>
                        <option><font face="ZapfEllipt bt">zapfellipt bt</font></option>                       
                    </select>
                </div>
                <div class="div_action_one">
                    <a class="panel_action" id="font_bold" title="Жирный шрифт ячейки(-ек)" font_name="font-weight" font_value="bold"><img src="/img/font_bold.png" style="height:33px;width:auto"title="Жирный шрифт ячейки(-ек)"></a><a class="panel_action" id="font_kursiv" title="Шрифт курсивом ячейки(-ек)" font_name="font-style" font_value="italic"><img src="/img/font_kursiv.png" style="height:33px;width:auto" title="Шрифт курсивом ячейки(-ек)"></a><a class="panel_action" id="font_zacherk" title="Зачеркнутый шрифт ячейки(-ек)" font_name="text-decoration" font_value="line-through"><img src="/img/font_zacherk.png" style="height:33px;width:auto" title="Зачеркнутый шрифт ячейки(-ек)"></a><a class="panel_action" id="font_podcherk" title="Подчеркнутый шрифт ячейки(-ек)" font_name="text-decoration" font_value="underline"><img src="/img/font_podcherk.png" style="height:33px;width:auto" title="Подчеркнутый шрифт ячейки(-ек)"></a>                
                </div>
                <div class="div_action_one">
                    <input id="font_color" value="#000000" title="Изменить цвет шрифта ячейки(-ек)"><div id="font_color_ex" class="shestgran" title="Образец цвет шрифта ячейки(-ек)"></div><button id="font_color_change" title="Выбрать цвет шрифта ячейки(-ек)">...</button>
                    <div id="Inline"></div>
                </div>
                <div class="div_action_one">
                    <input id="td_color" value="#ffffff" title="Изменить цвет ячейки(-ек)"><div id="td_color_ex" class="shestgran_td" title="Образец цвета ячейки(-ек)"></div><button id="td_color_change" title="Выбрать цвет ячейки(-ек)">...</button>
                    <div id="Inline_td"></div>
                </div>
                <div class="div_action_one">
                    w:<input id="td_width" value="150" type="number" title="Изменить ширину столбца">h:<input id="td_height" value="28" type="number" title="Изменить высоту строки">
                </div> 
                <div class="div_action_one">
                    <a class="panel_action" id="sql_add" title="Добавить SQL-запрос в ячейку"><img src="/img/sql-add.png" style="height:33px;width:auto" title="Добавить SQL-запрос в ячейку"></a><a class="panel_action" id="olap_add" title="Добавить olap-куб"><img src="/img/olap_add.png" style="height:38px;width:auto" title="Добавить olap-куб"></a><a class="panel_action" id="but_xlsx_add" title="Добавить кнопку выгрузки в XLSX"><img src="/img/UPLOAD-Excel.png" style="height:33px;width:auto" title="Добавить кнопку выгрузки в XLSX"></a>                       
                </div>  
                <div class="div_action_one">
                    <a class="panel_action" id="img_add" title="Добавить картинку в ячейку"><img src="/img/insert_picture.png" style="height:27px;width:auto" title="Добавить картинку в ячейку"></a><a class="panel_action" id="input_add" title="Добавить поле ввода в ячейку" style="margin-left: 3px;"><img src="/img/input.png" style="height:27px;width:auto" title="Добавить поле ввода в ячейку"></a><a class="panel_action" id="select_add" title="Добавить выпадающий список в ячейку" style="margin-left: 3px;"><img src="/img/select_add.png" style="height:27px;width:auto" title="Добавить выпадающий список в ячейку"></a><a class="panel_action" id="in_modal_add" title="Добавить поле с вызовом модального окна в ячейку" style="margin-left: 3px;"><img src="/img/in_modal.png" style="height:27px;width:auto" title="Добавить поле с вызовом модального окна в ячейку"></a><a class="panel_action" id="panel_add" title="Добавить панель вкладок в ячейки" style="margin-left: 3px;"><img src="/img/panel_tab.png" style="height:27px;width:auto" title="Добавить панель вкладок в ячейки"></a>
                </div>                
            </div>        
            <div class="no_panel">
                <div id="div_name_rep">
                    <input id="in_name_rep" type="text" placeholder="Введите наименование отчета" style="width: 333px">
                    <a class="settings" action_type="form_header" id="1"><img src="/img/settings.png" style="height:25px;width:auto"title="Настройки"></a>                    
                    <div class="settings_group_panel_active" >                                                                                                
                   </div>
                    <?php 
                        $m_get=$_GET;
                        unset($m_get['id']);
                        unset($m_get['form_id']);
                        unset($m_get['cat_id']);
                    ?>                    
                    <input type="hidden" id="in_rep_id" value="<?php echo $_GET['id'];?>"<?php echo (!empty($_GET['cat_id'])) ? ' cat_id="'.$_GET['cat_id'].'"':'';?> usr_fio="<?php echo $user['FIO'];?>" get_mass='<?php echo json_encode($m_get);?>'>
                    <input type="hidden" id="in_action_value">
                    <input type="hidden" id="in_rep_last_upd">
                </div>
                <div id = "my">                    
                </div>                                
            </div>
        </div>        
    
    </body>

</html>
