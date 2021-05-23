/*--WEB-OLAP v1.0
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
along with WEB-OLAP.  If not, see <https://www.gnu.org/licenses/>.*/
$(document).ready(function(){

    $(".no_panel").on("click", "a.olap_dop_action_one[olap_id=1][id='add_right']", function(e) { 
        pr_active_mod=$(this);
        var html_v=get_olap_taa_modal_html(pr_active_mod);
        $(modal_header).find('#modal_head_p').html($(this).text());
        $(modal_form).find('.modal_content').html(html_v);
        open_modal(e);
        $(modal_footer).show().find('.modal_button_c[id="modal_save"]').attr('place','usr_add_right_save');        
    });
    
    $(".no_panel").on("click", "a.olap_dop_action_one[olap_id=1][id='edit_right']", function(e) {
        pr_active_mod=$(this);
        var tek_td=$(table_tag).find('td.olap_td_checked'),
            right_id=$(tek_td).find('input').val();
        if (!!right_id)  { 
            loading_img_show();
            var params = new Object();
            params['code_in']='getRowsDB_conn';        
            params['tsql']="SELECT SYSNAME \n\
                              FROM REP_RIGHTS \n\
                             WHERE RIGHTS_ID="+right_id; 
            params['is_editor']=7;
            //console.log(params);
            if (!!phpsessionid) {
                params['phpsessionid']=phpsessionid;
            }
            $.ajax({
                type: "POST",
                url: "/get-data.php",
                data: params,
                crossDomain :(!!phpsessionid),
                success: function(html){
                    if (html!='') {  
                        open_modal(e);
                        $(modal_footer).show().find('.modal_button_c[id="modal_save"]').attr('place','usr_edit_right_save'); 
                        var html_v=get_olap_taa_modal_html(pr_active_mod);
                        $(modal_header).find('#modal_head_p').html($(this).text());
                        $(modal_form).find('.modal_content').html(html_v);  
                        $(modal_form).find('.modal_content tr#right_id').hide()
                            .find('input#right_id').val(right_id);
                        $(modal_form).find('.modal_content input#sysname').val($(html).find('td#SYSNAME').text());
                        $(modal_form).find('.modal_content input#right_name').val($(tek_td).text());                        
                    }
                    $(loading_img).hide();
                },
                error: function(xhr, status, error) {
                    $(loading_img).hide();
                    alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                    console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                }
            });                   
        }
        else {
            alert('Необходимо выбрать редактируемое "Право"');
        }
    });
    
    $('div.modal_footer').on('click', '.modal_button_c[id="modal_save"][place="usr_add_right_save"]', function() {
        var tr_tab=$(modal_form).find('.modal_content table.olap_taa_modal_mc tbody'),
            str_err='',
            right_name=$(tr_tab).find('input#right_name').val().trim(),
            sysname=$(tr_tab).find('input#sysname').val().trim();
        if (right_name=='') {
            str_err='Не заполнено поле "Наименование права"\n';
        }
        if (sysname=='') {
            str_err+='Не заполнено поле "Системное наименование"';
        }
        else {
            var params = new Object();
            params['code_in']='getRowsDB_conn';        
            params['tsql']="SELECT SYSNAME \n\
                              FROM REP_RIGHTS \n\
                             WHERE SYSNAME=?"; 
            params['params_val']=JSON.stringify({':sysname':sysname});
            params['is_editor']=7;
            if (!!phpsessionid) {
                params['phpsessionid']=phpsessionid;
            }
            console.log(params);
            $.ajax({
                type: "POST",
                url: "/get-data.php",
                data: params,
                crossDomain :(!!phpsessionid),
                async:false,
                success: function(html){
                    if (html!='') {
                        str_err+='Введенное "Сис.наименование" уже существует';
                    }
                },
                error: function(xhr, status, error) {
                    alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                    console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                }
            });
        }
        if (str_err!='') {
            alert(str_err);
        }
        else {
            var params={};
            params['tsql']="SET NOCOUNT ON;\n\
                           INSERT INTO REP_RIGHTS (NAME, SYSNAME) VALUES (?, ?);\n\
                           SELECT SCOPE_IDENTITY() RIGHT_ID;";
            params['code_in']='getRowsDB_conn';
            params['params_val']=JSON.stringify({':right_name':right_name,':sysname':sysname});
            params['is_editor']=7;
            if (!!phpsessionid) {
                params['phpsessionid']=phpsessionid;
            }
            loading_img_show();
            $.ajax({
                type: "POST",
                url: "/get-data.php",
                data: params,
                crossDomain :(!!phpsessionid),
                success: function(data){  
                    //console.log(data);
                    if (data.indexOf('Что-то пошло не так')>-1) {
                        console.log(data);
                        alert(data);
                    }
                    else {
                        modal_close();
                        var table_tag_v=$(table_tag);
                        $(table_tag_v).find('select.olap_param_sql[id="right_id"]')
                            .append('<option value="'+$(data).find('td#RIGHT_ID').text()+'" selected="selected">'+right_name+'</option');
                        $(table_tag_v).find('a.table_play[id="1"]').trigger('click');
                    }
                    $(loading_img).hide();                        
                },
                error: function(xhr, status, error) {
                    $(loading_img).hide();
                    alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                    console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                }
            });             
        }
    });
    
    $('div.modal_footer').on('click', '.modal_button_c[id="modal_save"][place="usr_edit_right_save"]', function() {
        var tek_td=$(table_tag).find('td.olap_td_checked'),
            right_id=$(tek_td).find('input').val(),
            tr_tab=$(modal_form).find('.modal_content table.olap_taa_modal_mc tbody'),
            str_err='',
            right_name=$(tr_tab).find('input#right_name').val().trim(),
            sysname=$(tr_tab).find('input#sysname').val().trim();
        if (right_name=='') {
            str_err='Не заполнено поле "Наименование права"\n';
        }
        if (sysname=='') {
            str_err+='Не заполнено поле "Системное наименование"';
        }
        else {
            var params = new Object();
            params['code_in']='getRowsDB_conn';        
            params['tsql']="SELECT SYSNAME \n\
                              FROM REP_RIGHTS \n\
                             WHERE SYSNAME=?\n\
                               AND RIGHTS_ID!="+right_id; 
            params['params_val']=JSON.stringify({':sysname':sysname});
            params['is_editor']=7;
            if (!!phpsessionid) {
                params['phpsessionid']=phpsessionid;
            }
            console.log(params);
            $.ajax({
                type: "POST",
                url: "/get-data.php",
                data: params,
                crossDomain :(!!phpsessionid),
                async:false,
                success: function(html){
                    if (html!='') {
                        str_err+='Введенное "Сис.наименование" уже существует';
                    }
                },
                error: function(xhr, status, error) {
                    alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                    console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                }
            });
        }
        if (str_err!='') {
            alert(str_err);
        }
        else {
            var params={};
            params['sql']="UPDATE REP_RIGHTS \n\
                              SET NAME=?, SYSNAME=?\n\
                            WHERE RIGHTS_ID="+right_id;
            params['code_in']='SQLexec';
            params['params_val_in']=JSON.stringify({':right_name':right_name,':sysname':sysname});
            if (!!phpsessionid) {
                params['phpsessionid']=phpsessionid;
            }
            if (!!phpsessionid) {
                params['phpsessionid']=phpsessionid;
            }
            loading_img_show();
            $.ajax({
                type: "POST",
                url: "/get-data.php",
                data: params,
                crossDomain :(!!phpsessionid),
                dataType:'json',
                success: function(data){  
                    //console.log(data);
                    if (data.ex_state!="Успех") {
                        console.log(data);
                        alert(data.ex_state);
                    }
                    else {
                        modal_close();  
                        var params_group=$(table_tag).find('div.params_group[id="1"]');
                        $(params_group).find('select.olap_param_sql[id="right_id"] option[value="'+right_id+'"]').text(right_name);
                        set_olap_params(params_group);
                        $(tek_td).html(right_name+'<input type="hidden" value="'+right_id+'">')
                    }
                    $(loading_img).hide();                        
                },
                error: function(xhr, status, error) {
                    $(loading_img).hide();
                    alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                    console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                }
            });             
        }
    });

    $(".no_panel").on("click", "a.olap_dop_action_one[olap_id=1][id='delete_right']", function(e) { 
        var tek_td=$(table_tag).find('td.olap_td_checked'),
            right_id=$(tek_td).find('input').val();
        if (!!right_id)  { 
            if (confirm('Вы действительно хотите удалить право "'+$(tek_td).text()+'"?')) {
                loading_img_show();
                var params = new Object();
                params['code_in']='SQLexec';        
                params['sql']="DELETE FROM REP_USERS_RIGHTS\n\
                                  WHERE RIGHT_ID="+right_id+";\n\
                                 DELETE \n\
                                  FROM REP_RIGHTS \n\
                                 WHERE RIGHTS_ID="+right_id+";";
                if (!!phpsessionid) {
                    params['phpsessionid']=phpsessionid;
                }
                $.ajax({
                    type: "POST",
                    url: "/get-data.php",
                    data: params,
                    crossDomain :(!!phpsessionid),
                    dataType:'json',                  
                    success: function(data){
                        if (data.ex_state!="Успех") {
                            console.log(data);
                            alert(data.ex_state);
                        }
                        else {
                            var table_tag_v=$(table_tag),
                                params_group=$(table_tag_v).find('div.params_group[id="1"]');
                            $(params_group).find('select.olap_param_sql[id="right_id"] option[value="'+right_id+'"]').remove();
                            set_olap_params(params_group);
                            $(table_tag_v).find('a.table_play[id="1"]').trigger('click');                                                        
                        }
                        $(loading_img).hide();
                    },
                    error: function(xhr, status, error) {
                        $(loading_img).hide();
                        alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                        console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                    }
                });   
            }    
        }
        else {
            alert('Необходимо выбрать удаляемое "Право"');
        }
    });
    
    $(".no_panel" ).on("after_open_form", "#in_action_value", function(e) {
        var table_tag_v=$(table_tag);
        $(table_tag_v).find('select.olap_param_sql[id="user_id"] option').attr('selected','selected');
        $(table_tag_v).find('select.olap_param_sql[id="right_id"] option').attr('selected','selected');
        $(table_tag_v).find('a.table_play[id="1"]').trigger('click');
    });
    
    $(".no_panel" ).on("after_open", "a.olap_tr_add", function(e) {
        if (this.id=='1') {
            $(modal_form).find('tr#sol').hide();
            $(modal_form).find('tr#password').hide();
        }
    });    
      
    $(".no_panel" ).on("before_save", "a.olap_tr_add", function(e,params0) {
        if (this.id=='1') {
            var tr_tab=$(modal_form).find('.modal_content table.olap_taa_modal_mc tbody'),
                pwd=$(tr_tab).find('input#password_vis'),
                login=$(tr_tab).find('input#login');
            if ($(pwd).val()!='') {
                if ($(pwd).val().trim().length<6) {
                    params0['err_txt']+='Пароль должен быть не менее шести символов\n';
                    params0['pr_ok']=false;
                }
                else {
                    var params={};
                    params['code_in']='getPswrdSol';
                    params['password']=$(pwd).val().trim();
                    if (!!phpsessionid) {
                        params['phpsessionid']=phpsessionid;
                    }
                    $.ajax({
                        type: "POST",
                        url: "/get-data.php",
                        data: params,
                        crossDomain :(!!phpsessionid),
                        async:false,
                        dataType:'json',
                        success: function(data){                            
                            $(tr_tab).find('input#sol').val(data.sol);
                            $(tr_tab).find('input#password').val(data.h_password)
                        },
                        error: function(xhr, status, error) {
                            alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                            console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                        }
                    });
                }    
            }
            if ($(login).val().trim()!='') {
                var params = new Object();
                params['code_in']='getRowsDB_conn';        
                params['tsql']="SELECT login \n\
                                  FROM REP_USERS \n\
                                 WHERE login=?"; 
                params['params_val']=JSON.stringify({':login':$(login).val().trim()});
                params['is_editor']=7;
                if (!!phpsessionid) {
                    params['phpsessionid']=phpsessionid;
                }
                console.log(params);
                $.ajax({
                    type: "POST",
                    url: "/get-data.php",
                    data: params,
                    crossDomain :(!!phpsessionid),
                    async:false,
                    success: function(html){
                        if (html!='') {
                            params0['err_txt']+='Введенный "Логин" уже существует\n';
                            params0['pr_ok']=false;
                        }
                    },
                    error: function(xhr, status, error) {
                        alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                        console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                    }
                }); 
            }
        }
    });
    
    $(".no_panel" ).on("after_save", "a.olap_tr_add", function(e,params0) {
        var table_tag_v=$(table_tag);
        $(table_tag_v).find('select.olap_param_sql[id="user_id"]')
            .append('<option value="'+$(params0).find('td#USER_ID').text()+'" selected="selected">'+$(modal_form).find('.modal_content input#fio').val()+'</option');
        $(table_tag_v).find('a.table_play[id="1"]').trigger('click');
    });
    
    $(".no_panel" ).on("change", "input.usr_right_value", function() {
        var tek_td=$(this).closest('td'),
            user_id=$(tek_td).closest('tr').find('td[olap_td_id="FIO"] input').val(),
            right_id=$(table_tag).find('tr[olap_tr_class_1="tr_pok"][olap_tr_id_1="RIGHTS_NAME"] td[id^="'+$(tek_td).attr('id').split('-')[0]+'-"] input').val();
        if ((user_id!='') & (right_id!='')) {
            var params4={};
            if ($(this).prop('checked')) {
                params4['sql']="INSERT INTO REP_USERS_RIGHTS (USER_ID, RIGHT_ID) \n\
                                  VALUES ("+user_id+","+right_id+")";
            }
            else {
                params4['sql']="DELETE FROM REP_USERS_RIGHTS \n\
                                 WHERE USER_ID="+user_id+" AND RIGHT_ID="+right_id;
            }
            params4['code_in']='SQLexec';
            if (!!phpsessionid) {
                params4['phpsessionid']=phpsessionid;
            }
            $.ajax({
                type: "POST",
                url: "/get-data.php",
                data: params4,
                crossDomain :(!!phpsessionid),
                dataType:'json',  
                success: function(html) {                    
                    console.log(html);                    
                },
                error: function(xhr, status, error) {
                    alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                    console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                }
            });
        }    
    });
    
    $(".no_panel").on("click","div#my table.jexcel tbody:first tr[olap_tr_class_1='tr_tab']", function(e){ 
        $(table_tag).find('tr.olap_tr_checked')
            .removeClass('olap_tr_checked')
            .find('td[olap_tab_id="1"]')
            .css({'-webkit-filter':'','filter':''});
        $(this).addClass('olap_tr_checked')
            .find('td[olap_tab_id="1"]')
            .css({'-webkit-filter':'invert(0.07)','filter':'invert(0.07)'});        
    });
    
    $(".no_panel").on("click","div#my table.jexcel tbody:first tr[olap_tr_class_1='tr_pok'] td[olap_td_class='td_pok']", function(e){
        $(table_tag).find('tr[olap_tr_class_1="tr_pok"] td.olap_td_checked')
            .removeClass('olap_td_checked')
            .css({'-webkit-filter':'','filter':''});
        $(this).addClass('olap_td_checked')
            .css({'-webkit-filter':'invert(0.07)','filter':'invert(0.07)'});        
    });
    
    $(".no_panel").on("dblclick","div#my table.jexcel tbody:first tr[olap_tr_class_1='tr_tab']", function(e){
        $(table_tag).find('a.olap_tr_edit').trigger('click');
    });
        
    $(".no_panel" ).on("after_open", "a.olap_tr_edit", function(e) {
        if (this.id=='1') {
            $(modal_form).find('tr#password').hide();
            var user_id=$(modal_form).find('tr#user_id').hide(),
                tr_ch=$(table_tag).find('tr.olap_tr_checked[olap_tr_class_1="tr_tab"]'),
                sol=$(modal_form).find('tr#sol').hide();            
            $(user_id).find('input').val($(tr_ch).find('td[olap_td_id="FIO"] input').val());
            $(sol).find('input').val($(tr_ch).find('td[olap_td_id="LOGIN"] input').val());
            $(modal_form).find('tr#login input').val($(tr_ch).find('td[olap_td_id="LOGIN"]').text());
            $(modal_form).find('tr#fio input').val($(tr_ch).find('td[olap_td_id="FIO"]').text());
            var td_email=$($(tr_ch).find('td[olap_td_id="EMAIL"]')).clone(),
                password_e=$(td_email).find('.div_hidden');
            $(modal_form).find('tr#password input').val($(password_e).text());
            $(password_e).remove();
            $(modal_form).find('tr#email input').val($(td_email).text());
            $(modal_form).find('tr#phone input').val($(tr_ch).find('td[olap_td_id="PHONE"]').text());
        }
    }); 
    
    $(".no_panel" ).on("before_open", "a.olap_tr_edit", function(e,params) {
        var tr_ch=$(table_tag).find('tr.olap_tr_checked[olap_tr_class_1="tr_tab"]');
        if ($(tr_ch).length===0) {
            params['pr_ok']=false;
            alert('Необходимо выбрать пользователя');
        }
    });
    
    $(".no_panel" ).on("before_delete", "a.olap_tr_delete", function(e,params) {
        var tr_ch=$(table_tag).find('tr.olap_tr_checked[olap_tr_class_1="tr_tab"]');
        if ($(tr_ch).length===0) {
            params['pr_ok']=false;
            alert('Необходимо выбрать пользователя');
        }
        else {
            if (!confirm('Вы действительно хотите удалить пользователя с логином '+$(tr_ch).find('td[olap_td_id="LOGIN"]').text()+'?')) {
                params['pr_ok']=false;
            }
            else {
                params['params_val']={':user_id':$(tr_ch).find('td[olap_td_id="FIO"] input').val()};
            }    
        }
    });
    
    $(".no_panel" ).on("after_delete", "a.olap_tr_delete", function(e,params) {
        var table_tag_v=$(table_tag),
            tr_all=$(table_tag_v).find('tr[olap_tr_class_1="tr_tab"]'),
            tr_ch=$(tr_all).filter('tr.olap_tr_checked'),
            tr_ch_id=$(tr_ch).attr('id'),
            tr_last=$(tr_all).last().clone(),
            params_group=$(table_tag_v).find('div.params_group[id="1"]');
        $(params_group).find('select.olap_param_sql[id="user_id"] option[value="'+$(tr_ch).find('td[olap_td_id="FIO"] input').val()+'"]').remove(); 
        if ($(tr_last).attr('id')==tr_ch_id) {
            //если строка является последней то надо для неё выставить корректный дизайн
            $('#my').jexcel ('deleteRow',$(tr_ch).attr('id').split('-')[1],1);
            //элемент по-прежнему содержится в наборе, удаляем из набора, но не реально из dom
            $(tr_all).filter('[id="'+tr_ch_id+'"]').remove();
            one_str_design(1,$(table_tag_v).find('tr[olap_tr_class_1="tr_tab"]'),tr_last,'td_str_val','td_val_val');
        }
        else {
            $('#my').jexcel ('deleteRow',$(tr_ch).attr('id').split('-')[1],1);
        }
        set_olap_params(params_group);
    });
    
    $(".no_panel" ).on("before_save", "a.olap_tr_edit", function(e,params0) {
        if (this.id=='1') {
            var tr_tab=$(modal_form).find('.modal_content table.olap_taa_modal_mc tbody'),
                pwd=$(tr_tab).find('input#password_vis'),
                login=$(tr_tab).find('input#login');
            if ($(pwd).val()!='') {
                if ($(pwd).val().trim().length<6) {
                    params0['err_txt']+='Пароль должен быть не менее шести символов\n';
                    params0['pr_ok']=false;
                }
                else {
                    var params={};
                    params['code_in']='getPswrdSol';
                    params['password']=$(pwd).val().trim();
                    params['sol']=$(tr_tab).find('input#sol').val().trim();
                    if (!!phpsessionid) {
                        params['phpsessionid']=phpsessionid;
                    }
                    $.ajax({
                        type: "POST",
                        url: "/get-data.php",
                        data: params,
                        crossDomain :(!!phpsessionid),
                        async:false,
                        dataType:'json',
                        success: function(data){                            
                            $(tr_tab).find('input#sol').val(data.sol);
                            $(tr_tab).find('input#password').val(data.h_password)
                        },
                        error: function(xhr, status, error) {
                            alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                            console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                        }
                    });
                }    
            }
            if ($(login).val().trim()!='') {
                var params = new Object();
                params['code_in']='getRowsDB_conn';        
                params['tsql']="SELECT login \n\
                                  FROM REP_USERS \n\
                                 WHERE login=?\n\
                                   AND USER_ID!="+$(tr_tab).find('input#user_id').val().trim(); 
                params['params_val']=JSON.stringify({':login':$(login).val().trim()});
                params['is_editor']=7;
                if (!!phpsessionid) {
                    params['phpsessionid']=phpsessionid;
                }
                console.log(params);
                $.ajax({
                    type: "POST",
                    url: "/get-data.php",
                    data: params,
                    crossDomain :(!!phpsessionid),
                    async:false,
                    success: function(html){
                        if (html!='') {
                            params0['err_txt']+='Введенный "Логин" уже существует\n';
                            params0['pr_ok']=false;
                        }
                    },
                    error: function(xhr, status, error) {
                        alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                        console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                    }
                }); 
            }
        }
    });
    
    $(".no_panel" ).on("after_save", "a.olap_tr_edit", function(e,params0) {
        if (params0.indexOf('Что-то пошло не так')===-1) {
            var tr_tab=$(modal_form).find('.modal_content table.olap_taa_modal_mc tbody');
            if (this.id=='1') {
                var table_tag_v=$(table_tag),
                    tr_ch=$(table_tag_v).find('tr.olap_tr_checked[olap_tr_class_1="tr_tab"]'),
                    params_group=$(table_tag).find('div.params_group[id="1"]'),
                    user_id=$(tr_tab).find('tr#user_id input').val(),
                    fio=$(tr_tab).find('tr#fio input').val();
                $(tr_ch).find('td[olap_td_id="LOGIN"]').html($(tr_tab).find('tr#login input').val()+'<input type="hidden" value="'+$(tr_tab).find('tr#sol input').val()+'">');
                $(tr_ch).find('td[olap_td_id="FIO"]').html(fio+'<input type="hidden" value="'+user_id+'">');            
                $(tr_ch).find('td[olap_td_id="EMAIL"]').html($(tr_tab).find('tr#email input').val()+'<div class="div_hidden">'+$(tr_tab).find('tr#password input').val()+'</div>');
                $(tr_ch).find('td[olap_td_id="PHONE"]').html($(tr_tab).find('tr#phone input').val());            
                $(params_group).find('select.olap_param_sql[id="user_id"] option[value="'+user_id+'"]').text(fio);
                set_olap_params(params_group);
            }
        }    
    });
    
    $(".no_panel").on("before_load_data1", "#in_action_value", function(e){ 
        var id_t=1;
        var tab_tr=$(table_tag).find('tr.olap_tr_checked[olap_tr_class_'+id_t+'="tr_tab"]');
        $(tab_tr).removeClass('olap_tr_checked')
                .find('td[olap_tab_id="1"]').css({'-webkit-filter':'','filter':''});
    });
    
    $(".no_panel").on("click",'.img_add[id="2"][action_type="img_add"]', function(e){
        var params={};
        params['code_in']='getSaveCacheRight';  
        if (!!phpsessionid) {
            params['phpsessionid']=phpsessionid;
        }
        loading_img_show();
        $.ajax({
            type: "POST",
            url: "/get-data.php",
            data: params,
            crossDomain :(!!phpsessionid),
            success: function(html){                
                $(loading_img).hide();
                alert('Кэш прав сохранен');
            },
            error: function(xhr, status, error) {
                $(loading_img).hide();
                alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                console.log(xhr.responseText + '|\n' + status + '|\n' +error);
            }
        });
    });
    
});