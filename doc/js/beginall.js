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
function open_modal(e) {
    pr_td_no_edite=true;
    var modal_form_v=modal_form;
    if ((!$(pr_active_mod).hasClass('but_in_modal')) 
        & (!prConfirm) & (!prAlert) 
        & (!$(pr_active_mod).hasClass('olap_tr_add'))
        & (!$(pr_active_mod).hasClass('olap_tr_edit'))) {
        //$(modal_form_v).find('.modal_footer').hide();
        $(modal_footer).hide();
    }
    else {
        //$(modal_form_v).find('.modal_footer').show();
        $(modal_footer).show();         
    }
    if (!!e) {
        e.preventDefault(); // выключaем стaндaртную рoль элементa
    }    
    $('#overlay').fadeIn(400, // снaчaлa плaвнo пoкaзывaем темную пoдлoжку        
        function(){ // пoсле выпoлнения предыдущей aнимaции            
            $(modal_form_v) 
                .css('display', 'block') // убирaем у мoдaльнoгo oкнa display: none;
                .animate({opacity: 1, top: '10%'}, 200)
                .find('#modal_save').focus(); // плaвнo прибaвляем прoзрaчнoсть oднoвременнo сo съезжaнием вниз        
    });     
    $(settings_group_panel_active).hide();
}
function modal_close() {
    if ($(modal_footer).is(':visible')) {
        //восстанавливаем html по умолчанию, скрываем 
        $(modal_footer).html('<button class="modal_button_c" id="modal_cancel">Отмена</button>\n\
                              <button class="modal_button_c" id="modal_save" place="" tr_id="">Сохранить</button>');
        $(modal_footer).hide();
    }    
    var modal_form_v=modal_form;
    $(modal_form_v)
        .animate({opacity: 0, top: '45%'}, 200,  // плaвнo меняем прoзрaчнoсть нa 0 и oднoвременнo двигaем oкнo вверх
            function(){ // пoсле aнимaции
                $(this).css('display', 'none'); // делaем ему display: none;
                $('#overlay').fadeOut(400); // скрывaем пoдлoжку
            }
        );
    $(modal_header).css('top','0');
    $(modal_footer).css('bottom','0');
    if ($(pr_active_mod).attr('id')=='rep_head_active') {    
        $(rep_head).after($('#rep_head_panel').css('text-align','left'));            
        $(container).hide();
        $(rep_head).show();	
        $(pr_active_mod).find('img').attr('src','/img/edit.png');
        $(pr_active_mod).attr('title','Редактировать');
        $('#overlay').after($('.container'));
    }
    else if ($(pr_active_mod).attr('class')=='table_active') {
        var md=$('.masterdata[id="'+$(pr_active_mod).attr('id')+'"]'); 
        $('.r_table[id="'+$(pr_active_mod).attr('id')+'"]').prepend(md);
        $(md).hide();
    }    
    else {
        if (!!editor) {
            editor.destroy();
            $(container).find('.btn-toolbar ').html($(container_btn_toolbar).html());
        } 
        $('#overlay').after($('.container').hide());
    }
    $(modal_form_v).removeAttr('style')
        .find('.modal_content').empty();
    if (prConfirm) {
        prConfirm=false;
    }
    else if (prAlert) {
        prAlert=false;
    }
    pr_active_mod=undefined;
    modal_tek_content=undefined;
    pr_td_no_edite=false;
}

function olap_param_upd_child(id_t,tek_param) {
    var md=$('.masterdata[id="'+id_t+'"]'); 
    var params_group=$('div.params_group[id="'+id_t+'"]');
    var pr_exec_all=false;
    $(params_group).find('.olap_param_sql[pr_parent]').each(function(i,elem) {
        var pr_exec=false;
        if (tek_param) {
            var mass_parent=$(elem).attr('pr_parent').split('--');
            if (mass_parent.indexOf(tek_param)>-1) {
                pr_exec=true;
                pr_exec_all=true;
            }
        }
        else {
            pr_exec=true;
            pr_exec_all=true;
        }
        if (pr_exec) {
            var id_par=$(elem).attr('id');
            var params_sql=$(md).find('.params_sql[id_param="'+id_par+'"]');
            var params = new Object();
            params['code_in']='get_md_param_sql';
            params['sql_true']=$(params_sql).html().replace(/<[^>]+>/g," ").trim();
            //формируем таблицу с параметрами
            var params_r=param_create(params['sql_true'],md,params_group),
                params_val=new Object();
            params['sql_true']=params_r['sql_true']; 
            set_param_val_olap(params_group,params_r,params_val);
            if (!$.isEmptyObject(params_val)) {
                params['params_val']=JSON.stringify(params_val);
            }
            //console.log(params);                        
            $.ajax({
                type: "POST",
                url: "/get-data.php",
                data: params,
                async: false,
                success: function(html){
                    $(params_group).find('.olap_param_sql[id="'+id_par+'"]').html(html);
                    //params_html+='<p class="p_param" id="'+$(elem).attr('id')+'">'+name_par_one+'<select id="'+$(elem).attr('id')+'" class="olap_param_sql" '+($(elem).find('.in_param_multi').prop('checked') ? 'multiple="multiple"' : '')+' '+(pr_parent ? 'pr_parent' : '')+' title="Выберите значение" style="margin:0;">'+html+'</select></p>';
                },
                error: function(xhr, status, error) {
                    alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                    console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                }
            });
        }
    });
    if (pr_exec_all) {
        $(params_group).find('.olap_param_sql').multiselect('destroy');
        set_olap_params(params_group);
    }
}

function set_olap_params_all(group_tab) {
    var id_t=$(group_tab).attr('olap_id'),        
        md,
        params_group_v=$(table_tag).find('div.params_group[id="'+id_t+'"]'),
        params_group_clon=$(params_group_v).clone();
    $(params_group_v).trigger('before_build');
    if ($(pr_active_mod).length===0) {
        md=$(group_tab).find('.masterdata');
    }
    else {
        md=$('.modal_content').find('.masterdata');
    }
    var tr_params=$(md).find('div.params[id="'+id_t+'"] div.tr_params');
    //console.log(tr_params);
    if ($(tr_params).length>0) {
        var params_html='<p style="font-size: 16px;font-weight:800 !important;">Параметры:</p><br>';
        var pr_parent_all=false;
        $(tr_params).each(function(i,elem) {
            var name_par_one='';
            if ($(elem).find('.in_param_name').val()=='') {
                name_par_one=$(elem).attr('id');
            }
            else {
                name_par_one=$(elem).find('.in_param_name').val();
            }
            var params_sql=$(elem).find('.params_sql');
            if ($(params_sql).text().trim()!='') {
                var params = new Object();
                params['code_in']='get_md_param_sql';
                params['sql_true']=$(params_sql).html().replace(/<[^>]+>/g," ").trim();
                //формируем таблицу с параметрами
                var params_r=param_create(params['sql_true']);
                params['sql_true']=params_r['sql_true'];        
                var pr_parent_one=false;
                if (!!params_r['params'][1]) {
                    pr_parent_one=true;
                    pr_parent_all=true;
                }
                if (!pr_parent_one) {
                    //console.log(params);                        
                    $.ajax({
                        type: "POST",
                        url: "/get-data.php",
                        data: params,
                        async: false,
                        success: function(html){
                            params_html+='<p class="p_param" id="'+$(elem).attr('id')+'">'+name_par_one+'<select id="'+$(elem).attr('id')+'" class="olap_param_sql" '+($(elem).find('.in_param_multi').prop('checked') ? 'multiple="multiple"' : '')+' title="Выберите значение" style="margin:0;">'+html+'</select></p><br>';
                        },
                        error: function(xhr, status, error) {
                            alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                            console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                        }
                    });
                }
                else {
                    params_html+='<p class="p_param" id="'+$(elem).attr('id')+'">'+name_par_one+'<select id="'+$(elem).attr('id')+'" class="olap_param_sql" '+($(elem).find('.in_param_multi').prop('checked') ? 'multiple="multiple"' : '')+' '+(pr_parent_one ? 'pr_parent="'+params_r['params_str']+'"' : '')+' title="Выберите значение" style="margin:0;"></select></p><br>';
                }
            }
            else {
                params_html+='<p class="p_param" id="'+$(elem).attr('id')+'">'+name_par_one+'<input id="'+$(elem).attr('id')+'" class="in_param_val" type="'+$(elem).find('.sel_param_type').val()+'" placeholder="Введите значение параметра"></p><br>';                    
            }                     
        });
        $(table_tag).find('.params_group[id="'+id_t+'"]').html(params_html).show();
        if (pr_parent_all) {
            olap_param_upd_child(id_t); 
        }
        else {
            set_olap_params(group_tab);
        }
    }
    else {
        $(params_group_v).empty().hide();
    }
    $(params_group_v).trigger('after_build',params_group_clon);
}

function param_create(sql_true,md_v,params_group_v,unolap_id,is_olap_ma) {
    var mass_par_sql=[],
        mass_par_sql_add=[];
    if (!!!is_olap_ma) {
        is_olap_ma=false;
    }
    
    function set_mass_par_sql_one(mass_par_sql,id_par,mass_val,prNumber,prMulti) {
        mass_par_sql[id_par]={val:{},str:''};                        
        if (prMulti) {
            mass_val.forEach(function(item, index){
                let value;
                if (prNumber) {
                    value=parseFloat(item);
                }
                else {
                    value=String(item);
                }
                mass_par_sql[id_par]['val'][id_par+'_'+index]=value;                                  
                if (db_type=='mssql') {
                    mass_par_sql[id_par]['str']+='?,';
                }
                else {
                    mass_par_sql[id_par]['str']+=':'+id_par+'_'+index+',';
                }
            });
            if (mass_par_sql[id_par]['str'].length>0) {
                mass_par_sql[id_par]['str']=mass_par_sql[id_par]['str'].slice(0,-1);
            }
        }
        else {
            if (prNumber) {
                mass_val=parseFloat(mass_val);
            }
            else {
                mass_val=String(mass_val);
            }
            mass_par_sql[id_par]['val'][id_par+'_0']=mass_val; 
            if (db_type=='mssql') {
                mass_par_sql[id_par]['str']+='?';
            }
            else {
                mass_par_sql[id_par]['str']+=':'+id_par+'_0';
            }
        }
    }
    if (!is_olap_ma) {
        if ($(params_group_v).length>0) {
            var olap_param_sql=$(params_group_v).find('.olap_param_sql');
            if ($(olap_param_sql).length>0) {
                $(params_group_v).find('.olap_param_sql').each(function(i,elem) {
                    var mass_val=$(elem).val();
                    //console.log(mass_val);
                    var id_par=$(elem).closest('p').attr('id');
                    let prNumber=false;
                    if ($(md_v).find('.sel_param_type[id="'+id_par+'"]').val()=='number') {
                        prNumber=true;
                    } 
                    set_mass_par_sql_one(mass_par_sql,id_par,mass_val,prNumber,$(md_v).find('.in_param_multi[id="'+id_par+'"]').prop('checked'));
                }); 
            }        
        }

        var select_add;
        if (!!unolap_id) {
            select_add=$(table_tag).find('.select_add[id!="'+unolap_id+'"],.in_modal_add_val[id!="'+unolap_id+'"]');
        }
        else {
            select_add=$(table_tag).find('.select_add,.in_modal_add_val');
        }
        if ($(select_add).length>0) {
            $(select_add).each(function(i,elem) {
                var mass_val=$(elem).val(),
                    id_par=$(elem).attr('id'),
                    settings_group_panel=$(elem).closest('td').find('.settings_group_panel');
                //console.log(mass_val);
                let prNumber=false;
                if ($(settings_group_panel).find('li.type li#number[pr_change_style]').length>0) {
                    prNumber=true;
                }
                if ($(elem).hasClass('select_add')) {
                    set_mass_par_sql_one(mass_par_sql,id_par,mass_val,prNumber,$(settings_group_panel).find('.multi_add input').prop('checked'));
                }
                else {
                    if (mass_val.length>0) {
                        if (mass_val.indexOf("','")>-1) {
                            mass_val=mass_val.substr(1);
                            mass_val=mass_val.slice(0,-1);
                            mass_val=mass_val.split("','");                        
                        }
                        else {
                            mass_val=mass_val.split(',');
                        }
                        set_mass_par_sql_one(mass_par_sql,id_par,mass_val,prNumber,true);
                    }
                    else {
                        mass_par_sql[id_par]={val:{},str:''}; 
                        mass_par_sql[id_par]['val'][id_par+'_0']=null; 
                        if (db_type=='mssql') {
                            mass_par_sql[id_par]['str']+='?';
                        }
                        else {
                            mass_par_sql[id_par]['str']+=':'+id_par+'_0';
                        }
                    }
                }
            }); 
        }
    }    
    
    function pos_sl_simv(sql_true_v,pos_v) {
        var mass_simv=[' ',',',')','(',';','&','%','\'','=','|','\n','\r'];
        var pos_simv=77777;
        mass_simv.forEach(function(element) {
            var pos_pr_v=sql_true_v.indexOf(element,(pos_v+1));
            if ((pos_pr_v<pos_simv) & (pos_pr_v!=-1)) {
                pos_simv=pos_pr_v;
            }
        });
        return pos_simv;
    }

    function exist_param(params_v,value) {
        var exist=false;
        for (var key in params_v) {
            if (params_v[key]==value) {
                exist=true;
                break;
            }
        }
        return  exist;           
    }                

    var v_out={},
        params_p={},
        params_dist={},
        params_str='',
        params_olap={},
        params_unolap={},
        pos = sql_true.indexOf(":"); // находим первое совпадение 
    //console.log(pos);
    if (pos>-1) {
        var i_par=1,
            i_par_dist=1,
            pos_pr=pos_sl_simv(sql_true,pos),
            tek_param,
            tek_param_num;
        if (pos_pr==77777) {
            tek_param=sql_true.substring((pos+1));
            pos_pr=pos;
        }
        else {
            tek_param=sql_true.substring((pos+1),(pos_pr));
        }
        params_str+=tek_param;
        tek_param_num=parseInt(tek_param);
        
        if (tek_param in mass_par_sql) {
            mass_par_sql_add[tek_param]=mass_par_sql[tek_param];
            sql_true=sql_true.substring(0,pos)+mass_par_sql[tek_param]['str']+sql_true.substring(pos+tek_param.length+1);
            pos+=mass_par_sql[tek_param]['str'].length;
            params_p[i_par]=tek_param;
            params_dist[i_par_dist]=tek_param;
            if (isNaN(tek_param_num)) {
                params_olap[i_par]=tek_param;
            }
            else {
                params_unolap[i_par]=tek_param;
            }
            /*i_par=0;
            i_par_dist=0;
            for (var key in mass_par_sql[tek_param]['val']) {
                params_p[++i_par]=key;
                params_dist[++i_par_dist]=key;
                if (isNaN(tek_param_num)) {
                    params_olap[i_par]=key;
                }
                else {
                    params_unolap[i_par]=key;
                }
            }*/
        }
        else {
            params_p[i_par]=tek_param;
            params_dist[i_par_dist]=params_p[i_par];
            if (db_type=='mssql') {
                sql_true=sql_true.substring(0,pos)+'?'+sql_true.substring(pos+params_p[i_par].length+1);
            } 
            if (isNaN(tek_param_num)) {
                params_olap[i_par]=tek_param;
            }
            else {
                params_unolap[i_par]=tek_param;
            }
        }
        while ( pos != -1 ) { // до тех пор, пока не перестанут попадаться совпадения (т.е. indexOf не вернёт -1)
           pos = sql_true.indexOf(":",pos+1); // находим следующее значение нужного слова (indexOf ищет начиная с позиции, переданной вторым аргументом)
           //console.log(pos);
           if (pos>-1) {                    
                pos_pr=pos_sl_simv(sql_true,pos)
                if (pos_pr==77777) {
                    tek_param=sql_true.substring((pos+1));
                    pos_pr=pos;
                }
                else {
                    tek_param=sql_true.substring((pos+1),(pos_pr));
                }  
                params_str+='--'+tek_param;
                tek_param_num=parseInt(tek_param);
                //console.log(pos_pr);
                i_par++;
                params_p[i_par]=tek_param;                    
                if (tek_param in mass_par_sql) {
                    sql_true=sql_true.substring(0,pos)+mass_par_sql[tek_param]['str']+sql_true.substring(pos+tek_param.length+1);
                    pos+=mass_par_sql[tek_param]['str'].length;
                    if (!(tek_param in mass_par_sql_add)) {
                        ++i_par_dist;
                        mass_par_sql_add[tek_param]=mass_par_sql[tek_param];
                        params_dist[i_par_dist]=tek_param;
                        if (isNaN(tek_param_num)) {
                            params_olap[i_par]=tek_param;
                        }
                        else {
                            params_unolap[i_par]=tek_param;
                        }
                        /*for (var key in mass_par_sql[tek_param]['val']) {
                            params_p[++i_par]=key;
                            params_dist[++i_par_dist]=key;
                            if (isNaN(tek_param_num)) {
                                params_olap[i_par]=key;
                            }
                            else {
                                params_unolap[i_par]=key;
                            }
                        }*/
                    } 
                    else {
                        if (isNaN(tek_param_num)) {
                            if (db_type=='mssql') { 
                                params_olap[i_par]=tek_param;
                            }    
                        }
                        else {
                            if (db_type=='mssql') {            
                                params_unolap[i_par]=tek_param;                        
                            }
                        }
                        /*for (var key in mass_par_sql[tek_param]['val']) {
                            params_p[++i_par]=key;
                            if (isNaN(tek_param_num)) {
                                if (db_type=='mssql') { 
                                    params_olap[i_par]=key;
                                }    
                            }
                            else {
                                if (db_type=='mssql') {            
                                    params_unolap[i_par]=key;                        
                                }
                            }
                        }*/
                    }                                        
                }
                else { 
                    if (!exist_param(params_dist,params_p[i_par])) {
                        i_par_dist++;
                        params_dist[i_par_dist]=params_p[i_par];                        
                    }
                    if (db_type=='mssql') {
                        sql_true=sql_true.substring(0,pos)+'?'+sql_true.substring(pos+params_p[i_par].length+1);
                    } 
                    if (isNaN(tek_param_num)) {
                        if (db_type=='mssql') {            
                            params_olap[i_par]=tek_param;
                        }
                        else if (db_type=='ora'){
                            if (!exist_param(params_olap,tek_param)) {
                                params_olap[i_par]=tek_param;                        
                            }                            
                        }                        
                    }
                    else {
                        if (db_type=='mssql') {            
                            params_unolap[i_par]=tek_param;                        
                        }
                        else if (db_type=='ora'){
                            if (!exist_param(params_unolap,tek_param)) {
                                params_unolap[i_par]=tek_param;                                               
                            }                            
                        } 
                    }
                }
                //console.log(sql_true);
            }
        }
    }
    v_out['sql_true']=sql_true;
    v_out['params'] = params_dist;
    v_out['params_all']=params_p;
    v_out['params_str']=params_str;
    v_out['params_unolap']=params_unolap;
    v_out['params_olap']=params_olap;
    return v_out;
}  

function md_get_class_set(sname_v,id_t,md,chkbx_msl_alfr_v,chkbx_msl_odta_v,pr_modal) {
    var params = new Object();
    params['code_in']='get_md_struct_load_one_rep';        
    params['sname']=sname_v;
    params['olap_id']=id_t;
    console.log(params);
    $.ajax({
        type: "POST",
        url: "/get-mdr.php",
        data: params,
        success: function(data){
//                console.log(html);
            if (chkbx_msl_alfr_v) {
                var mdr_str='all',
                    md_sname_old=$(md).attr('mdr_class');
                $(md).attr('mdr_class',sname_v);
                if (chkbx_msl_odta_v) {
                    mdr_str='only_data'; 
                    $(md).find('div.sql_value').html($(data).find('div.sql_value').html());
                    $(md).find('div.polya.d-table').html($(data).filter('div.polya.d-table').html());
                    var structure_old_v=$(md).find('div.structure_old'),
                        structure_old_n=$(data).filter('div.structure_old');
                    if ($(structure_old_v).length>0) {
                        if ($(structure_old_n).length>0) {
                            $(structure_old_v).html($(structure_old_n).html());
                        }
                        else {
                            $(structure_old_v).remove();
                        }
                    }
                    else {
                        if ($(structure_old_n).length>0) { 
                            $(md).append(structure_old_n[0].outerHTML);
                        }    
                    }
                    var structure_r_old_v=$(md).find('div.structure_r_old'),
                        structure_r_old_n=$(data).filter('div.structure_r_old');
                    if ($(structure_r_old_v).length>0) {
                        if ($(structure_r_old_n).length>0) {
                            $(structure_r_old_v).html($(structure_r_old_n).html());
                        }
                        else {
                            $(structure_r_old_v).remove();
                        }
                    }
                    else {
                        if ($(structure_r_old_n).length>0) {
                            $(md).append(structure_r_old_n[0].outerHTML);
                        }
                    } 
                    var md_2D3D=$(md).find('li.2D_3D a.2D_3D').removeClass('2D');
                    if ($(data).find('li.2D_3D a.2D_3D').hasClass('2D')) {
                        $(md_2D3D).addClass('2D');
                    }
                }
                else {
                    $(md).html(data);
                }
                $(md).attr('mdr_str',mdr_str);
                
                if (pr_modal) {
                    var params3 = {};
                    params3['code_in']='save_mdr_link';
                    params3['md_sname']=sname_v;
                    if (!!md_sname_old) {
                        params3['md_sname_old']=md_sname_old;
                    }
                    params3['mdr_str']=mdr_str;
                    params3['rep_id']=$('#div_name_rep #in_rep_id').val();                
                    $.ajax({
                        type: "POST",
                        url: "/get-mdr.php",
                        data: params3,
                        success: function(data3){
                            console.log(data3);
                        },
                        error: function(xhr, status, error) {
                            alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                            console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                        }
                    });
                }
            }
            else {
                $(md).removeAttr('mdr_class')
                     .removeAttr('mdr_str');
                $(md).html(data);
            } 
            if (pr_modal) {
                pr_active_mod=$('.table_active[id="'+id_t+'"]');
                $(modal_header).find('#modal_head_p').html('Создание/редактирование структуры таблицы отчета');
                $(modal_form).find('.modal_content').empty().append($(md).show()); 
            }    
        },
        error: function(xhr, status, error) {
            alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
            console.log(xhr.responseText + '|\n' + status + '|\n' +error);
        }
    }); 
}

function get_olap_taa_modal_html(pr_active_mod) {
    var gp=$(pr_active_mod).closest('div#group_tab'),
        md=$(gp).find('.masterdata'),
        polya_v=LZString.decompressFromUTF16($(md).find('div#tab_taa_value div.d-tr:eq('+$(pr_active_mod).attr('tr_action_index')+') div.taa_polya_v').text()),
        html_v='<table class="olap_taa_modal_mc" md_id="'+$(md).attr('id')+'" a_class="'+$(pr_active_mod).attr('class')+'" tr_action_index="'+$(pr_active_mod).attr('tr_action_index')+'">',
        pr_ok=true;
    polya_v=$(polya_v).find('div#tab_taa_polya_value .d-tr[id!="after_append"]').sort(function(a, b) { // сортируем
        var tek_num_a=parseFloat($(a).find('.in_taa_pol_sort').val()),
            tek_num_b=parseFloat($(b).find('.in_taa_pol_sort').val());
        return  tek_num_a - tek_num_b;
    })    
    $(polya_v).each(function(i,elem) {
        var id_v=$(elem).find('.in_taa_pol_sysname').val(),
            tr_action_polya_index=$(elem).index(),
            type_v=$(elem).find('.taa_pol_t_sel').val(),
            required_v=($(elem).find('.in_taa_pol_required').prop('checked'))?' required':'';
        html_v+='<tr id="'+id_v+'"><td>'+$(elem).find('.in_taa_pol_name').val()+'</td><td>';    
        if ((type_v!='db_dropbox') & (type_v!='db_in_modal')) {    
            html_v+='<input type="'+type_v+'" id="'+id_v+'" class="in_olap_taa_mod"'+required_v+' style="margin:0 0 0 3px;">';
        } 
        else {                
            if (type_v=='db_dropbox') {  
                var sql_v=LZString.decompressFromUTF16($(elem).find('.taa_polya_sql_v').text().trim());
                pr_db_dropbox=true;
                if (sql_v!='') {
                    var params = new Object();
                    params['code_in']='get_md_param_sql';
                    params['sql_true']=sql_v;
                    /*формируем таблицу с параметрами, возможно в будущем, пока без параметров
                    var params_r=param_create(params['sql_true']);
                    params['sql_true']=params_r['sql_true'];        
                    var pr_parent_one=false;
                    if (!!params_r['params'][1]) {
                        pr_parent_one=true;
                        pr_parent_all=true;
                    }
                    if (!pr_parent_one) {
                        //console.log(params);  */                      
                        $.ajax({
                            type: "POST",
                            url: "/get-data.php",
                            data: params,
                            async: false,
                            success: function(html){
                                html_v+='<select id="'+id_v+'" class="olap_taa_db_dropbox" '+($(elem).find('.in_taa_pol_multi').prop('checked') ? 'multiple="multiple"' : '')+' title="Выберите значение" style="margin:0;"'+required_v+' type_v="'+$(elem).find('.sel_taa_pol_type_fdb').val()+'">'+html+'</select>';
                            },
                            error: function(xhr, status, error) {
                                alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                                console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                            }
                        });
                    /*}
                    else {
                        params_html+='<p class="p_param" id="'+$(elem).attr('id')+'">'+name_par_one+'<select id="'+$(elem).attr('id')+'" class="olap_param_sql" '+($(elem).find('.in_param_multi').prop('checked') ? 'multiple="multiple"' : '')+' '+(pr_parent_one ? 'pr_parent="'+params_r['params_str']+'"' : '')+' title="Выберите значение" style="margin:0;"></select></p><br>';
                    }*/
                }
                else {   
                    alert('Не создан SQL-запрос для поля с идентификатором '+id_v);
                    pr_ok=false;                    
                } 
            }  
            else if (type_v=='db_in_modal') {  
                var sql_v=$(LZString.decompressFromUTF16($(elem).find('.taa_polya_structure_v').text().trim())).find('div.in_mod_sql_value').text();
                if (sql_v!='') {
                    html_v+='<input class="olap_taa_in_modal_add_txt" type="text" id="'+id_v+'" readonly=""'+required_v+'><button class="olap_taa_but_in_modal" id="'+id_v+'" tr_action_index="'+$(pr_active_mod).attr('tr_action_index')+'" tr_action_polya_index="'+tr_action_polya_index+'">...</button>\n\
                             <input type="hidden" class="olap_taa_in_modal_add_val" id="'+id_v+'" action_type="in_modal_add"'+required_v+'>';
                }
                else {   
                    alert('Не создан SQL-запрос для поля с идентификатором '+id_v);
                    pr_ok=false;                    
                } 
            }  
        }
        html_v+='</td></tr>';
    });
    html_v+='</table>';
    if (!pr_ok) {
        html_v='';
    }
    return html_v;
}

var rep_head=$('div#REP_HEAD');
var pr_active_mod=$('#rep_head_active'); 

function index_recalc_true(tr_last,mass_left_cols_v) {
    var mass_left_cols=[];
    if (!!!mass_left_cols_v) {
        var thead_tr=$(table_all_tag).find('thead:first tr:last td:gt(0)');
        $(thead_tr).each(function(i,elem) {
            var tek_index=$(elem).index();
            mass_left_cols[$(elem).offset().left]=tek_index;
        });
    }
    else {
        mass_left_cols=mass_left_cols_v;
    }
    while ($(tr_last).length>0) {
        var tr_index,
            tr_last_prev=$(tr_last).prev();
        if ($(tr_last_prev).length>0) {
            tr_index=Number($(tr_last_prev).attr('id').split('-')[1])+1;
        }
        else {
            tr_index=0;
        }
        if (!tab_obj.pr_view) {
            $(tr_last).find('td').first().html((Number(tr_index)+1));
        } 
        else {
            $(tr_last).find('td').first().css('empty-cells','hide');
        }
        $(tr_last).attr('id','row-'+tr_index);
        $(tr_last).find('td:not(.jexcel_label)').each(function(i,elem) {
            var td_ind=mass_left_cols[$(elem).offset().left]-1;
            var coord = $(elem).prop('id').split('-');
            $(elem).removeClass('c' + coord[0]+' r'+coord[1]).addClass('c' + td_ind+' r'+tr_index).attr('id',td_ind+'-'+tr_index);                
        });
        tr_last=$(tr_last).next();
    }  
}

function one_str_design(id_t,rep_tab_tr,tr_str,olap_td_class1,olap_td_class2) {
    var tr_str_td=$(tr_str).find('td[olap_tab_id='+id_t+']');
    if ($(tr_str_td).first().attr('id').indexOf('-')!==-1) {
        $(tr_str_td).each(function(i,elem) {
            var mass_index=$(elem).attr('id').split('-');
            $(elem).attr('id',mass_index[0]).removeClass('c'+mass_index[0]+' r'+mass_index[1]);
        });
    }    

    var td_str_last_border=$(tr_str).find('[olap_td_class="'+olap_td_class2+'"]').last().css('border-right'),
        td_str_name_all=$(tr_str).find('[olap_td_class="'+olap_td_class1+'"]').last().clone(),
        td_val_name_all;
    if ($(tr_str).find('[olap_td_class="'+olap_td_class1+'"]').length===1) {
        $(td_str_name_all).css('border-left','');
    }
    if ((($(tr_str).find('[olap_td_class="'+olap_td_class2+'"]').length>1)  & ($(td_str_name_all).length>0)
        ) || (($(tr_str).find('[olap_td_class="'+olap_td_class2+'"]').length>2)  & ($(td_str_name_all).length===0))
       ) {        
        $(tr_str).find('td[olap_tab_id='+id_t+']:last').remove();
        td_val_name_all=$(tr_str).find('td[olap_tab_id='+id_t+']:last');
    }
    else {
        td_val_name_all=$(tr_str).find('td[olap_tab_id='+id_t+']:last');
        $(td_val_name_all).css('border-right',$(td_val_name_all).css('border-bottom'));
    }

    var rep_tab_tr_tek=$(rep_tab_tr).filter('[olap_tr_class_'+id_t+'="'+$(tr_str).attr('olap_tr_class_'+id_t)+'"]').last().find('td[olap_tab_id='+id_t+']');
    $(rep_tab_tr_tek).each(function(i,elem) {
        var td_before,
            mass_index=$(elem).attr('id').split('-');
        td_before=$(tr_str).find('td[id="'+mass_index[0]+'"][olap_td_class="'+$(elem).attr('olap_td_class')+'"]');
        if (($(td_before).length==0) & ($(elem).attr('olap_td_class')==olap_td_class1))  {
            td_before=td_str_name_all;                                             
        }  
        else if (($(td_before).length==0) & ($(elem).attr('olap_td_class')==olap_td_class2)) {
            td_before=td_val_name_all;
        }
        $(elem).addClass($(td_before).attr("class")).attr('style',$(td_before).attr('style'));                                        
    });

    if (td_str_last_border!='') {
        $(rep_tab_tr_tek).last().css('border-right',td_str_last_border);
    } 
}

function set_param_val_olap(params_group,params_r,params_val) {
    let params_group_el=$(params_group).find('.in_param_val,.olap_param_sql');
    if ($(params_group_el).length>0) { 
        var params_r_da=params_r['params_olap']
        for (var key in params_r_da) {
            var param_one=$(params_group_el).filter('[id="'+params_r_da[key]+'"]');
            if ($(param_one).is('.in_param_val')) {
                if (db_type=='mssql') {            
                    params_val[key]=$(param_one).val();
                }
                else if (db_type=='ora'){
                    params_val[':'+params_r_da[key]]=$(param_one).val();
                }  
            }
            else {
                let val=$(param_one).val();
                if (Array.isArray(val)) {
                    val.forEach(function(item, index){
                        if (db_type=='mssql') {            
                            params_val[params_r_da[key]+'_'+index]=item;
                        }
                        else if (db_type=='ora'){
                            params_val[':'+params_r_da[key]+'_'+index]=item;
                        }
                    });
                }
                else {
                    if (db_type=='mssql') {            
                        params_val[params_r_da[key]+'_0']=val;
                    }
                    else if (db_type=='ora'){
                        params_val[':'+params_r_da[key]+'_0']=val;
                    }
                }
            }
        }
    }
}

$(document).ready(function() {
    $("div#my" ).on("click", ".table_play", function() {
        create_tab($(this).attr('id')); 
    });  
    
    $("div#my" ).on("click", ".export_xlsx", function() {
        create_tab($(this).attr('id'),true); 
    });
    
    function olap_index_recalc(olap_tab_id,pr_head) {
        if (isNaN(pr_head)) {
            pr_head=false;
        }
        var rep_tab;
        if (!pr_head) {        
            rep_tab=$(table_tag).find('tr[olap_tr_id_'+olap_tab_id+']');
        }
        else {
            rep_tab=$(table_tag).find('tr[olap_tr_id_'+olap_tab_id+'][olap_tr_class_'+olap_tab_id+'^="tr_pok"]');
        }
        var mass_index_cols=[],mass_left_cols=[];
        var thead_tr=$(table_all_tag).find('thead:first tr:last td:gt(0)');
        $(thead_tr).each(function(i,elem) {
            var tek_index=$(elem).index();
            mass_index_cols[tek_index]=$(elem).text();                
            mass_left_cols[$(elem).offset().left]=tek_index;
        });
        var thead_tr_right=$(thead_tr).last().offset().left;
        var tr_last;
        $(rep_tab).each(function(i2,elem2) {
            var td_all=$(elem2).find('td:gt(0)');
            var coord;
            var pr_recalc_left=false;
            $(td_all).each(function(i,elem) {
                var elem_offset_left=$(elem).offset().left;
                if (elem_offset_left<=thead_tr_right) {
                    var td_ind=mass_left_cols[elem_offset_left]-1;
                    coord = $(elem).prop('id').split('-');
                    $(elem).removeClass('c' + coord[0]).addClass('c' + td_ind).attr('id',td_ind+'-'+coord[1]);
                    if ($(elem).html().trim()!='') {
                        $(elem).removeClass('null');
                    }
                }
                else {
                    $(elem).remove();
                    pr_recalc_left=true;
                }                
            });
            //если справа в результате удаления пустот появились недостающие ячейки
            var td_all_last=$(td_all).last();
            var coord0=Number($(td_all_last).attr('id').split('-')[0]);
            //var coord0=Number(coord[0]);
            if (coord0<(mass_index_cols.length-2)) {
                var td_new='';
                for (var i = 1; i <= (mass_index_cols.length-2-coord0); i++) {
                    //var td = $('#my').jexcel('createCell', (coord0+i), coord[1]);                    
                    var td_ind=coord0+i;                    
                    td_new+='<td id="'+td_ind+'-'+coord[1]+'" class="c'+td_ind+' r'+coord[1]+'"></td>';
                }                
                $(td_all_last).after(td_new);
                pr_recalc_left=true;
            }
            if (pr_recalc_left) {
                $(thead_tr).each(function(i,elem) {
                    var tek_index=$(elem).index();
                    mass_index_cols[tek_index]=$(elem).text();                
                    mass_left_cols[$(elem).offset().left]=tek_index;
                });
                thead_tr_right=$(thead_tr).last().offset().left;
            }
            tr_last=elem2;
        });
                
        //правим индексы после таблицы olap, могут поменяться в результате удаления/вставки строк (делается без пересчета индексов для оптимизации)
        if (pr_head) {        
            //ищем строку после olap-таблицы
            while (($(tr_last).length>0) & ($(tr_last).attr('olap_tr_class_'+olap_tab_id)!='')) {
                tr_last=$(tr_last).next();
            }
        }                
        index_recalc_true(tr_last,mass_left_cols);
    }
        
    $("div#my" ).on("click", ".tab_sort_up", function() {
        var olap_tab_id=$(this).closest('td').attr('olap_tab_id');
        var index_col=$(this).closest('td').index();
        //$(this).closest('tbody .tr_name_col').filter('[olap_tr_id_'+olap_tab_id+']') .after(
                
        var sort_tab=$(table_tag).find('[olap_tr_class_'+olap_tab_id+'="tr_tab"][olap_tr_id_'+olap_tab_id+']').sort(function(a, b) { // сортируем
                            var tek_str_a=$(a).find('td:eq('+index_col+')').text().replace(',',".");
                            var tek_str_b=$(b).find('td:eq('+index_col+')').text().replace(',',".");
                            /*console.log(tek_str_a);
                            console.log(tek_str_b);*/
                            var tek_num_a=parseFloat(tek_str_a);
                            var tek_num_b=parseFloat(tek_str_b);
                            if ((isNaN(tek_num_a)) || (isNaN(tek_num_b))) {
                                //console.log('строка');
                                return tek_str_a.localeCompare(tek_str_b);
                            }
                            else {
                                //console.log('число');
                                return  tek_num_a - tek_num_b;
                            }
                        });
        //вставку сортированного делаем через массив, напрямую нельзя, путаница с обращением к элементам                
        var mass_sort=[]; 
        $(sort_tab).each(function(i,elem) {
            mass_sort[i]=[]; 
            $(elem).find('td[olap_tab_id="'+olap_tab_id+'"]').each(function(j,elem2) {
                mass_sort[i][j]=$(elem2).html();
            });
        });
        $(table_tag).find('[olap_tr_class_'+olap_tab_id+'="tr_tab"][olap_tr_id_'+olap_tab_id+']').each(function(i,elem) {
            $(elem).find('td[olap_tab_id="'+olap_tab_id+'"]').each(function(j,elem2) {
                $(elem2).html(mass_sort[i][j]);
            });
        }); 
    });
    
    $("div#my" ).on("click", ".tab_sort_unup", function() {
        var olap_tab_id=$(this).closest('td').attr('olap_tab_id');
        var index_col=$(this).closest('td').index();
        //$(this).closest('tbody .tr_name_col').filter('[olap_tr_id_'+olap_tab_id+']') .after(
                
        var sort_tab=$(table_tag).find('[olap_tr_class_'+olap_tab_id+'="tr_tab"][olap_tr_id_'+olap_tab_id+']').sort(function(a, b) { // сортируем
                            var tek_str_a=$(a).find('td:eq('+index_col+')').text().replace(',',".");
                            var tek_str_b=$(b).find('td:eq('+index_col+')').text().replace(',',".");
                            /*console.log(tek_str_a);
                            console.log(tek_str_b);*/
                            var tek_num_a=parseFloat(tek_str_a);
                            var tek_num_b=parseFloat(tek_str_b);
                            if ((isNaN(tek_num_a)) || (isNaN(tek_num_b))) {
                                //console.log('строка');
                                return tek_str_b.localeCompare(tek_str_a);
                            }
                            else {
                                //console.log('число');
                                return  tek_num_b - tek_num_a;
                            }
                        });
        //вставку сортированного делаем через массив, напрямую нельзя, путаница с обращением к элементам                
        var mass_sort=[]; 
        $(sort_tab).each(function(i,elem) {
            mass_sort[i]=[]; 
            $(elem).find('td[olap_tab_id="'+olap_tab_id+'"]').each(function(j,elem2) {
                mass_sort[i][j]=$(elem2).html();
            });
        });
        $(table_tag).find('[olap_tr_class_'+olap_tab_id+'="tr_tab"][olap_tr_id_'+olap_tab_id+']').each(function(i,elem) {
            $(elem).find('td[olap_tab_id="'+olap_tab_id+'"]').each(function(j,elem2) {
                $(elem2).html(mass_sort[i][j]);
            });
        });
    });
    
    
    
    $( "body" ).on("click", "#modal_close, #overlay,#modal_button", function() {
        modal_close();
    });
    
    $( "body" ).on("click", "#modal_cancel", function() {
        if ($(pr_active_mod).hasClass('olap_taa_but_in_modal')) {
            $(modal_form).find('.modal_content').html($(modal_tek_content).html());
            $(modal_footer).find('#olap_taa_bim_modal_cancel').attr('id','modal_cancel');
            var tab_v=$(modal_form).find('.modal_content table.olap_taa_modal_mc');
            pr_active_mod=$(table_tag).find('div#group_tab[olap_id="'+$(tab_v).attr('md_id')+'"] div.table_panel a.'+$(tab_v).attr('a_class')+'[tr_action_index]');
            set_olap_params($(modal_form).find('.modal_content'));
            modal_tek_content=undefined;
        }
        else {
            modal_close();
        }    
    });  	
        
	$('#month_group').on('click', '.a_month', function(){
		var a_tek=this;
		var id_tab=$(a_tek).attr('month')+'_'+$(a_tek).attr('year');
		var plus_img=$('#plus_'+id_tab);
                if ($(plus_img).attr('src')!=='/img/minus_n.png') {
			
			if (($('table[id="'+id_tab+'"]').length==0) & ($('#loading_'+id_tab).length==0)) {
                                console.log('tuta');
				$(this).after('<img src="/img/loading.gif" id="loading_'+id_tab+'" width=250 height="auto">');
				$.ajax({
				    type: "POST",
					url: "/get-data.php",
					data: "code_in=3&month="+$(this).attr('month')+"&year="+$(this).attr('year'),
					success: function(html){
						 //console.log( "Прибыли данные: " + html);
						 /*$(a_tek).after('<div id="table_'+id_tab+'" class="f"><table id="'+id_tab+'" border="1"><tbody>'+$(names_col).html()+
										'</tbody></table></div>');
						 var tab_fin=$('table[id="'+id_tab+'"] > tbody:last');
						 var tab=$('table[id="'+id_tab+'"]');
						 $(tab).hide();
						 var str_copy_i=$(str_copy).clone();
						 $(str_copy_i).attr('id','0');
						 $(str_copy_i).css({'font-size':'9pt','font-weight':'bold'});
						 $(str_copy_i).find('#CASHIERNAME').html('Итого');
						 $(tab_fin).append(str_copy_i);	*/
                                                 var params_glob = new Object(); 
                                                 //var params_val=new Object(); 
                                                 var pr_load=[]; 
                                                 var tab_beg;
                                                 var tab_itog;
                                                 var md;
                                                 var rep_tab;
                                                 var id_t;
                                                 //var tab_pok_cool;
                                                 $(html).each(function(i,elem) {
                                                        console.log(i);
							var cashid=$(elem).find('#CASHIERID').text();                                                                                                                
                                                        //params_val[3]=cashid;                                                        
                                                        pr_load[i]=false;                                                            
                                                        if (i===0) {
                                                            var params = new Object(); 
                                                            params['sql_true']='EXEC RK7SQLPROCOVERALL3 ?,?,'+cashid+';';
                                                            var params_val=new Object(); 
                                                            params_val[0]=$(a_tek).attr('month');
                                                            params_val[1]=$(a_tek).attr('year');
                                                            params['params_val']=JSON.stringify(params_val);
                                                            params['params_html']='';
                                                            console.log(i);
                                                            id_t=1;//пока берем структуру первой таблицы
                                                            params['code_in']='create_tab';
                                                            //console.log('ura');

                                                            md=$('.masterdata[id="'+id_t+'"]');         

                                                            params['tab_id']=2;//укажем реальную таблицу в БД
                                                            //params['sql_true']=$('.sql_value[id="'+id_t+'"]').html().replace(/<[^>]+>/g,"\u00A0");                                                            
                                                            params['mdata']=$(md).html();
                                                            var tab_str=new Object();
                                                            var pr_ok=true;
                                                            if ($(md).find('.d-table[id="tab_str"] .SYSNAME:not(.ITOGO_NAME)').length>0) {
                                                            $(md).find('.d-table[id="tab_str"] .SYSNAME:not(.ITOGO_NAME)').each(function(i,elem) {
                                                                    tab_str[i]=new Object();
                                                                    tab_str[i]['sysname']=$(elem).attr('id');
                                                                    tab_str[i]['name']=$(elem).text();
                                                                    tab_str[i]['type']=$(elem).attr('md_type');
                                                                    tab_str[i]['precision']=$(elem).attr('md_precision');
                                                                    tab_str[i]['scale']=$(elem).attr('md_scale');
                                                                    tab_str[i]['nullable']=$(elem).attr('md_nullable');            
                                                                });
                                                            }
                                                            else {
                                                                pr_ok=false;
                                                                alert('Для "Полей строк" необходимо наличие не менее одного элемента');
                                                            }        
                                                            //console.log(tab_str);
                                                            params['tab_str']=JSON.stringify(tab_str);
                                                            /*//итоги 
                                                            if ($(md).find('.d-table[id="tab_str"] .ITOGO_NAME').length>0) {
                                                                console.log($(md).find('.d-table[id="tab_str"] .d-tr[id="_itogo_"]').prev());
                                                                if ($(md).find('.d-table[id="tab_str"] .d-tr[id="_itogo_"]').prev().find('.SYSNAME').length>0) {
                                                                    params['tab_str_itog_order']=1;
                                                                }
                                                                else {
                                                                    params['tab_str_itog_order']=2;
                                                                }
                                                                params['tab_str_itog_val']=$(md).find('.d-table[id="tab_str"] .sel_itogo[id="'+id_t+'"]').val();
                                                            }*/
                                                            var tab_pok=new Object();
                                                            $(md).find('.d-table[id="tab_pok"] .SYSNAME').each(function(i,elem) {
                                                                tab_pok[i]=new Object();
                                                                tab_pok[i]['sysname']=$(elem).attr('id');
                                                                tab_pok[i]['name']=$(elem).text();
                                                                tab_pok[i]['type']=$(elem).attr('md_type');
                                                                tab_pok[i]['precision']=$(elem).attr('md_precision');
                                                                tab_pok[i]['scale']=$(elem).attr('md_scale');
                                                                tab_pok[i]['nullable']=$(elem).attr('md_nullable');            
                                                            });
                                                            params['tab_pok']=JSON.stringify(tab_pok);
                                                            var tab_val=new Object();
                                                            if ($(md).find('.d-table[id="tab_val"] .SYSNAME').length>0) {
                                                                $(md).find('.d-table[id="tab_val"] .SYSNAME').each(function(i,elem) {
                                                                    tab_val[i]=new Object();
                                                                    tab_val[i]['sysname']=$(elem).attr('id');
                                                                    tab_val[i]['name']=$(elem).text();
                                                                    tab_val[i]['type']=$(elem).attr('md_type');
                                                                    tab_val[i]['precision']=$(elem).attr('md_precision');
                                                                    tab_val[i]['scale']=$(elem).attr('md_scale');
                                                                    tab_val[i]['nullable']=$(elem).attr('md_nullable'); 
                                                                    tab_val[i]['aggr']=$(elem).next().find('select').val(); 
                                                                    console.log(tab_val[i]['aggr']);
                                                                });
                                                            }
                                                            else {
                                                                pr_ok=false;
                                                                alert('Для "Значений показателей" необходимо наличие не менее одного элемента');
                                                            }
                                                            params['tab_val']=JSON.stringify(tab_val);
                                                            var tab_pol=new Object();
                                                            $(md).find('.d-table[id="tab_pol"] .SYSNAME').each(function(i,elem) {
                                                                tab_pol[i]=new Object();
                                                                tab_pol[i]['sysname']=$(elem).attr('id');
                                                                tab_pol[i]['name']=$(elem).text();
                                                                tab_pol[i]['type']=$(elem).attr('md_type');
                                                                tab_pol[i]['precision']=$(elem).attr('md_precision');
                                                                tab_pol[i]['scale']=$(elem).attr('md_scale');
                                                                tab_pol[i]['nullable']=$(elem).attr('md_nullable');            
                                                            });
                                                            params['tab_pol']=JSON.stringify(tab_pol);

                                                            if (pr_ok) {
                                                                $(a_tek).after('<table class="rep_tab" id="'+id_tab+'" border="1" style=""></table>')
                                                                rep_tab=$('.rep_tab[id="'+id_tab+'"]');  
                                                                //$(rep_tab).before('<img src="/img/loading.gif" id="loading_'+id_t_tek+'" width=250 height="auto">').hide();
                                                                console.log(params);
                                                                $.ajax({
                                                                    type: "POST",
                                                                    url: "/get-data.php",
                                                                    data: params,
                                                                    dataType:'json',
                                                                    success: function(data){
                                                                        pr_load[0]=true;
                                                                        console.log(data);                                                                         
                                                                        //console.log($('.masterdata[id="'+id_t+'"] .rep_tab[id="'+id_t+'"]'));                                                                                          
                                                                        $(rep_tab).html(data.tab_html).show();//.prev().remove();
                                                                        tab_beg=$(rep_tab).find('.tr_tab');//возвращаем только одну строку!!!!!!
                                                                        params['tab_pok_cool']=data.tab_pok_cool;
                                                                        params['rows_unic_pok']=data.rows_unic_pok;
                                                                        //tab_pok_cool=data.tab_pok_cool;
                                                                        params_glob=params;
                                                                        if ($(md).find('.d-table[id="tab_str"] .ITOGO_NAME').length>0) {
                                                                            if ($(md).find('.d-table[id="tab_str"] .sel_itogo[id="'+id_t+'"]').val()=='SUM') {
                                                                                tab_itog=$(tab_beg).clone();
                                                                                $(tab_itog).removeClass().addClass('tr_itog');
                                                                                for (var i2 = 0; i2 < ($(md).find('.d-table[id="tab_str"] .SYSNAME:not(.ITOGO_NAME)').length); i2++) {
                                                                                    $(tab_itog).find('td:eq('+i2+')').html('').removeClass().addClass('td_str_val');
                                                                                } 
                                                                                $(tab_itog).find('td:eq('+($(md).find('.d-table[id="tab_str"] .SYSNAME:not(.ITOGO_NAME)').length-1)+')').html('Итого');
                                                                                $(tab_beg).after(tab_itog);
                                                                            }
                                                                        }
                                                                        
                                                                    },
                                                                    error: function(xhr, status, error) {
                                                                        alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                                                                        console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                                                                    }
                                                                });

                                                                //modal_close();
                                                            }
                                                        }
                                                        else { 
                                                            pr_load[i]=false;
                                                            var params_val=new Object(); 
                                                            params_val[0]=$(a_tek).attr('month');
                                                            params_val[1]=$(a_tek).attr('year');
                                                            var i_loc=i;
                                                            var cashid_loc=cashid; 
                                                            if (!pr_load[0]) {
                                                                var MyIntervalID = setInterval(function(){
                                                                    console.log('задержка');
                                                                    if (pr_load[0]) {
                                                                        clearInterval (MyIntervalID );
                                                                        var params2 = params_glob; 
                                                                        //var params_val2=new Object();
                                                                        params2=params_glob;                                                                        
                                                                        params2['code_in']='tab_add_str';
                                                                        params2['params_val']=JSON.stringify(params_val);                                                                        
                                                                        params2['params_html']='';
                                                                        params2['i_loc']=i_loc;                                                                        
                                                                        //params2['tab_pok_cool']=tab_pok_cool;
                                                                        params2['sql_true']='EXEC RK7SQLPROCOVERALL3 ?,?,'+cashid_loc+';';
                                                                        //итоги в этом случае можно выводить только js, а это для sql
                                                                        console.log(params2);
                                                                        $.ajax({
                                                                            type: "POST",
                                                                            url: "/get-data.php",
                                                                            data: params2,
                                                                            dataType:'json',
                                                                            success: function(data2)	{
                                                                                //console.log(data2);
                                                                                //console.log($(tab_beg).closest('tbody').find('.tr_name_col'));                                                                                
                                                                                if ($(md).find('.d-table[id="tab_str"] .ITOGO_NAME').length>0) {
                                                                                    if ($(md).find('.d-table[id="tab_str"] .sel_itogo[id="'+id_t+'"]').val()=='SUM') {
                                                                                        //console.log('подсчет итогов д стр');
                                                                                        //console.log($(data2.tab_html).find('.td_val_val'));
                                                                                        $(data2.tab_html).find('.td_val_val').each(function(i,elem2) {
                                                                                            var tek_num=parseFloat(0);
                                                                                            tek_num=parseFloat($(tab_itog).find('td:eq('+$(elem2).index()+')').text().trim());
                                                                                            if (isNaN(tek_num)) {
                                                                                                tek_num=parseFloat(0);
                                                                                            }
                                                                                            var tek_num2=parseFloat(0);
                                                                                            tek_num2=parseFloat($(elem2).text().trim());
                                                                                            if (isNaN(tek_num2)) {
                                                                                                tek_num2=parseFloat(0);
                                                                                            }
                                                                                            tek_num+=tek_num2;	
                                                                                            $(tab_itog).find('td:eq('+$(elem2).index()+')').html(tek_num.toFixed(2));
                                                                                        });                                                                                        
                                                                                    }
                                                                                }
                                                                                
                                                                                $(tab_beg).after(data2.tab_html);
                                                                                pr_load[i_loc]=true;                                                                                                                                                                
                                                                                
                                                                                //сортировка
                                                                                var index_col=0;
                                                                                $(tab_beg).closest('tbody').find('.tr_name_col').after(
                                                                                    $(tab_beg).closest('tbody').find('.tr_tab').sort(function(a, b) { // сортируем
                                                                                        var tek_str_a=$(a).find('td:eq('+index_col+')').text().replace(',',".");
                                                                                        var tek_str_b=$(b).find('td:eq('+index_col+')').text().replace(',',".");
                                                                                        /*console.log(tek_str_a);
                                                                                        console.log(tek_str_b);*/
                                                                                        var tek_num_a=parseFloat(tek_str_a);
                                                                                        var tek_num_b=parseFloat(tek_str_b);
                                                                                        if ((isNaN(tek_num_a)) || (isNaN(tek_num_b))) {
                                                                                            //console.log('строка');
                                                                                            return tek_str_a.localeCompare(tek_str_b);
                                                                                        }
                                                                                        else {
                                                                                            //console.log('число');
                                                                                            return  tek_num_a - tek_num_b;
                                                                                        }
                                                                                    })
                                                                                );
                                                                        
                                                                                //проверяем что все строки загрузились
                                                                                var pr_load_all=true;
                                                                                pr_load.forEach(function(element) {
                                                                                    if (!element) {
                                                                                        pr_load_all=false;
                                                                                        return;
                                                                                    }
                                                                                });
                                                                                
                                                                                if (pr_load_all) {
                                                                                    //убираем "дыры" (ввести параметр надобности)                     
                                                                                    //console.log(tab_pol);
                                                                                    if ($(md).find('.d-table[id="tab_pok"] .SYSNAME').length>0) {
                                                                                        console.log($(rep_tab).find('.tr_pok:last'));
                                                                                        $(rep_tab).find('.tr_pok:last td').each(function(i,elem) {
                                                                                                console.log($(elem).index());
                                                                                                var pr_null=true;
                                                                                                var index_beg=$(md).find('.d-table[id="tab_str"] .SYSNAME').length+$(elem).index()*$(md).find('.d-table[id="tab_val"] .SYSNAME').length;
                                                                                                //console.log(index_beg);
                                                                                                $(rep_tab).find('.tr_tab').each(function(i2,elem2) {
                                                                                                    for (var i = index_beg; i < (index_beg+$(md).find('.d-table[id="tab_val"] .SYSNAME').length); i++) {
                                                                                                        //console.log($(elem2).find('td:eq('+i+')'));
                                                                                                        if ($(elem2).find('td:eq('+i+')').text()!=='') {
                                                                                                            pr_null=false;
                                                                                                            return false;
                                                                                                        }
                                                                                                    }                              
                                                                                                });
                                                                                                if (pr_null) {
                                                                                                    //console.log($(elem).index());
                                                                                                    for (var i = index_beg; i < (index_beg+$(md).find('.d-table[id="tab_val"] .SYSNAME').length); i++) {
                                                                                                        $(rep_tab).find('.tr_name_col td:eq('+index_beg+')').remove();                                         
                                                                                                    } 
                                                                                                    //$(rep_tab).find('.tr_pok:not(.tr_pok[id="'+$(elem).attr('id')+'"])').each(function(i2,elem2) {
                                                                                                    $(rep_tab).find('.tr_pok:not(.null)').each(function(i2,elem2) {
                                                                                                        if ($(elem2).find('.td_pok_name').length>0) {
                                                                                                            $(elem2).find('.td_pok_name').attr('colspan',(+$(elem2).find('.td_pok_name').attr('colspan')-$(md).find('.d-table[id="tab_val"] .SYSNAME').length));
                                                                                                        }
                                                                                                        else { 
                                                                                                            if ($(elem).attr('id')!=$(elem2).attr('id')) {
                                                                                                                var index_p=0;
                                                                                                                var elem_save;
                                                                                                                $(elem2).find('td').each(function(i21,elem211) {
                                                                                                                    index_p+=+$(elem211).attr('colspan')/$(md).find('.d-table[id="tab_val"] .SYSNAME').length;
                                                                                                                    if (index_p>=($(elem).index()+1)) {
                                                                                                                        //console.log(index_p);
                                                                                                                        //console.log($(elem211));
                                                                                                                        elem_save=$(elem211);
                                                                                                                        //$(elem21).prev().attr('colspan',(+$(elem21).prev().attr('colspan')-$(md).find('.d-table[id="tab_val"] .SYSNAME').length));
                                                                                                                        return false;
                                                                                                                    }                                                                                                                                                                                                              
                                                                                                                });
                                                                                                                if ($(elem_save).length>0) {
                                                                                                                    //console.log($(elem_save).index());
                                                                                                                    $(elem_save).attr('colspan',(+$(elem_save).attr('colspan')-$(md).find('.d-table[id="tab_val"] .SYSNAME').length)); 
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    });
                                                                                                    $(rep_tab).find('.tr_tab,.tr_itog').each(function(i2,elem2) {
                                                                                                        for (var i = index_beg; i < (index_beg+$(md).find('.d-table[id="tab_val"] .SYSNAME').length); i++) {
                                                                                                            $(elem2).find('td:eq('+index_beg+')').remove();                                         
                                                                                                        }                                                                                                             
                                                                                                    });
                                                                                                    $(elem).remove();
                                                                                                }
                                                                                        });
                                                                                    }
                                                                                    $('#loading_'+id_tab).remove();
                                                                                } 
                                                                                                                                                                
                                                                            },
                                                                            error: function(xhr, status, error) {
                                                                                alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                                                                                console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                                                                            }
                                                                        });
                                                                    }
                                                                }, 1000);
                                                            }                                                            
                                                        }
						});							
						$(plus_img).attr('src','/img/minus_n.png');				  
					},
                                        error: function(xhr, status, error) {
                                            alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                                            console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                                        }
				});
				
					
			}
			else if ($('#loading_'+id_tab).length==0) {
				$('table[id="'+id_tab+'"]').show();
				$(plus_img).attr('src','/img/minus_n.png');
			}	
		}	
		else {
			$('table[id="'+id_tab+'"]').hide();
			$(plus_img).attr('src','/img/plus_n.png');
		}			
	});
	
	$('div#rep_head_panel').on('click', 'a#rep_head_active', function(e){                
		var editor=$('div#editor');
                pr_active_mod=$('#rep_head_active');
                //var editor=$('.modal_content');
		if ($(this).find('img').attr('src')=='/img/edit.png') {
                        $('.modal_content').append($('#rep_head_panel').css('text-align','center')).append($('.container'));
			$(editor).html($(rep_head).html());
			$(container).show();
			$(rep_head).hide();	
			$(this).find('img').attr('src','/img/save.png');
			$(this).attr('title','Сохранить');
                        open_modal(e);
		}
		else { 
                    $(rep_head).html($(editor).html());
                    var params = new Object();
                    params['code_in']='save_rep_set';
                    params['rep']=1;
                    params['set']='REP_HEAD';
                    params['value']=$(editor).html();
                    $.ajax({
                        type: "POST",
                        url: "/get-data.php",
                        data: params,
                        success: function(){
                               console.log('Успешно сохранено');					 
                        },
                        error: function(xhr, status, error) {
                            alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                            console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                        }
                    });
                    modal_close();
		}                
	});
    
    $('div#my').on('click', '.table_active', function(e) {
        //console.log($('.masterdata[id="'+$(this).attr('id')+'"]').html());
        pr_active_mod=$(this);
        var gp=$(this).closest('div[id="group_tab"][olap_id]'),
            tek_td=$(gp).closest('td'),
            md=$(gp).find('.masterdata[id="'+$(this).attr('id')+'"]'),
            modal_form_v=$('div#modal_form');
        $(modal_form_v).find('.modal_content').append(md);
        $(modal_form_v).find('#modal_head_p').html('Создание/редактирование структуры таблицы отчета');
        md.show();
        $('#my').jexcel('updateSelection', tek_td, tek_td,1);
        open_modal(e);
    });
    
    $('div.modal_content').on('click', 'a.md_sql_edit', function() {
        pr_active_mod=$(this);
        var md=$('.masterdata[id="'+$(this).attr('id')+'"]'),
            md_so=$(md).find('.structure_old'),
            tab_pol_v=$(md).find('.d-table[id="tab_pol"]');
        if (($(md_so).length===0) & ($(tab_pol_v).find('.SYSNAME[id="_no_str_"]').length===0)) {
            //для старых версий masterdata
            $(md).append('<div class="structure_old">'+$(tab_pol_v).html()+'</div>');
            var md_structure_r_old=$(md).find('.structure_r_old');
            if ($(md_structure_r_old).length===0) {
                $(md).append('<div class="structure_r_old">'+$(md).find('.d-table[id="tab_geometry"]').html()+'</div>');
            }                                       
        }    
        $('#modal_head_p').html('Редактирование SQL-запроса для структуры таблицы отчета');
        $('.r_table[id="'+$(pr_active_mod).attr('id')+'"]').prepend(md);
        $(md).hide();
        $('.modal_content').html('<a class="md_back" md_id="'+$(this).attr('id')+'" title="Назад" id="md_sql_edit_back" style="display: inline;z-index: 500000;">\n\
                                    <img src="/img/Back.png" style="width:30px;height:auto;">\n\
                                 </a>\n\
                                 <a id="'+$(this).attr('id')+'" title="Загрузить SQL-запрос из другого источника" style="display: inline;z-index: 500000;left:40px;position: absolute;" class="md_sql_load">\n\
                                    <img src="/img/download.png" style="width:30px;height:auto;">\n\
                                 </a>\n\
                                 <div class="md_panel_sql_es">'+
                                        '<a class="md_sql_save" id="'+$(this).attr('id')+'" title="Сохранить структуру" style="z-index: 500000;">'+
                                            '<img src="/img/save.png" style="width:30px;height:auto;">'+
                                        '</a>'+
                                    '</div>').append(container);
        set_ace_edit('sql',$(pr_active_mod).attr('data-edit_ace-theme'),$(pr_active_mod).attr('data-edit_ace-size'),LZString.decompressFromUTF16($(md).find('.sql_value[id="'+$(this).attr('id')+'"]').text()));
        $(container).show();
    });
    
    $('div.modal_content').on('click', '.md_sql_load', function() {
        pr_active_mod=$(this);
        $('#overlay').after($('.container').hide());
        var id_t=this.id;
        $('#modal_head_p').html('Выберите представление (view)');
        var params = new Object();
        params['code_in']='getRowsDB_conn';        
        params['tsql']="SELECT ISNULL(OC.NAME,SO.name) NAME_COOL, SO.name \n\
                        FROM sys.objects  SO \n\
                        LEFT JOIN OLAPCUBES OC ON OC.SIFR=SUBSTRING(SO.name,13, LEN(SO.name)) \n\
                        WHERE SO.type =N'V' \n\
                        AND SO.NAME LIKE N'VRK7CUBEVIEW%' \n\
                        ORDER BY 1"; 
        console.log(params);
        $.ajax({
            type: "POST",
            url: "/get-data.php",
            data: params,
            success: function(html){
//                console.log(html);
                var html_str='<a class="md_back" md_id="'+id_t+'" title="Назад" id="md_sql_load_back" style="z-index: 500000;">\n\
                                <img src="/img/Back.png" style="width:30px;height:auto;">\n\
                             </a>\n\
                            <table class="tab_struct_load"><thead>';
                html_str+='<tr><td>Наименование представления (view)</td></tr>';
                html_str+='</thead><tbody>';
                $(html).each(function(i,elem) {
                    html_str+='<tr><td><a class="md_sql_load_one_view" md_id="'+id_t+'" id="'+$(elem).find('td#name').text().trim()+'" title="Выбрать представление (view)" style="z-index: 500000;">\n\
                                            '+$(elem).find('td#NAME_COOL').text()+'\n\
                                        </a>\n\
                                    </td>\n\
                                </tr>';
                });
                html_str+='</tbody></table>';
                $('.modal_content').html(html_str);
            },
            error: function(xhr, status, error) {
                alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                console.log(xhr.responseText + '|\n' + status + '|\n' +error);
            }
        }); 
    });
    
    $('div.modal_content').on('click', '.md_sql_load_one_view', function() {
        var id_t=$(this).attr('md_id'); 
        pr_active_mod=$('.md_sql_edit[id="'+id_t+'"]');
        $(modal_header).find('#modal_head_p').html('Редактирование SQL-запроса для структуры таблицы отчета');
        $(modal_form).find('.modal_content').html('<a class="md_back" md_id="'+id_t+'" title="Назад" id="md_sql_edit_back" style="display: inline;z-index: 500000;">\n\
                                    <img src="/img/Back.png" style="width:30px;height:auto;">\n\
                                 </a>\n\
                                 <a id="'+id_t+'" title="Загрузить SQL-запрос из другого источника" style="display: inline;z-index: 500000;left:40px;position: absolute;" class="md_sql_load">\n\
                                    <img src="/img/download.png" style="width:30px;height:auto;">\n\
                                 </a>\n\
                                 <div class="md_panel_sql_es">'+
                                        '<a class="md_sql_save" id="'+id_t+'" title="Сохранить структуру" style="z-index: 500000;">'+
                                            '<img src="/img/save.png" style="width:30px;height:auto;">'+
                                        '</a>'+
                                    '</div>').append($(container).show());
        var editor=$('div#editor'); 
        $(editor).html('SELECT * FROM '+this.id);        
    });
    
    $('div.modal_content').on('click', '.md_struct_load', function() {
        pr_active_mod=$(this);
        var id_t=this.id;
        $(modal_header).find('#modal_head_p').html('Выберите отчет и структуру');
        var md=$(modal_form).find('.masterdata[id="'+id_t+'"]'); 
        $(table_tag).find('.r_table[id="'+id_t+'"]').prepend(md);
        $(md).hide();
        var params = new Object();
        params['code_in']='get_md_struct_load';        
        console.log(params);
        $.ajax({
            type: "POST",
            url: "/get-mdr.php",
            data: params,
            success: function(html){
//                console.log(html);
                var html_str='<div class="mdsl_panel">\n\
                                <input type="checkbox" class="chkbx_msl_alfr" title="Далее загружать из репозитория" id="alfr">\n\
                             </div><a class="md_back" md_id="'+id_t+'" title="Назад" id="md_struct_load_back" style="z-index: 500000;">\n\
                                <img src="/img/Back.png" style="width:30px;height:auto;">\n\
                             </a>\n'+html;
                $(modal_form).find('.modal_content').html(html_str);
                $(modal_form).find('.modal_content table.tab_struct_load').attr('md_id',id_t)
            },
            error: function(xhr, status, error) {
                alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                console.log(xhr.responseText + '|\n' + status + '|\n' +error);
            }
        }); 
    });
    $('div.modal_content').on('change', '.chkbx_msl_alfr', function(e) {
        var div_v=$(this).closest('div');
        if ($(this).prop('checked')) {
            $(div_v).append('<input type="checkbox" class="chkbx_msl_odta" title="Использовать только структуру (без действий)" id="odta">');
        }
        else {
            $(div_v).find('.chkbx_msl_odta').remove();
        }
    });
    
    $('div.modal_content').on('click', 'table.tab_struct_load[id="mdr_all_name"] tbody tr', function() {
        var sname_v=$(this).find('td[id="sname"]').text().trim(),
            id_t=$(this).closest('table').attr('md_id'),
            div_v=$(this).closest('div'),
            chkbx_msl_alfr_v=$(div_v).find('.chkbx_msl_alfr').prop('checked'),
            chkbx_msl_odta_v=false;
        if (chkbx_msl_alfr_v) {
            if ($(div_v).find('.chkbx_msl_odta').prop('checked')) {
                chkbx_msl_odta_v=true;
            }
        } 
        var gp=$(table_tag).find('div[id="group_tab"][olap_id="'+id_t+'"]'),
            md=$(gp).find('.masterdata[id="'+id_t+'"]'); 
        md_get_class_set(sname_v,id_t,md,chkbx_msl_alfr_v,chkbx_msl_odta_v,true);                        
    });
    
    $('div.modal_content').on('click', '.md_struct_unload', function(e) {
        var md=$(this).closest('.modal_content').find('.masterdata').hide();
        $(table_tag).find('.r_table[id="'+this.id+'"]').prepend(md);
        $(modal_header).find('#modal_head_p').html('Сохранение структуры в репозиторий');
        $(modal_form).find('.modal_content')
            .html('<div class="md_panel_sql_es" style="margin-bottom:7px;">'+
                        '<a class="md_struct_unload_save" id="'+$(this).attr('id')+'" title="Сохранить структуру в репозиторий" style="z-index: 500000;">'+
                            '<img src="/img/save.png" style="width:30px;height:auto;">'+
                        '</a>\n\
                         <input type="checkbox" class="chkbx_msu_alfr" title="Далее загружать из репозитория" id="alfr">'+
                   '</div>\n\
                    <p>\n\
                        Сис.наименование структуры <input id="md_unload_sname" type="text">\n\
                    </p>\n\
                    <p>\n\
                        Наименование структуры <input id="md_unload_name" type="text">\n\
                    </p>');
        open_modal(e);
    });
    $('div.modal_content').on('change', '.chkbx_msu_alfr', function(e) {
        var div_v=$(this).closest('div');
        if ($(this).prop('checked')) {
            $(div_v).append('<input type="checkbox" class="chkbx_msu_odta" title="Использовать только структуру (без действий)" id="odta">');
        }
        else {
            $(div_v).find('.chkbx_msu_odta').remove();
        }
    });    
    $('div.modal_content').on('click', '.md_struct_unload_save', function() {
        //проверка существования
        var id_t=this.id,
            params = new Object(),
            mod_c=$(this).closest('.modal_content'),
            md_unload_sname=$(mod_c).find('#md_unload_sname').val().trim(),
            md_unload_name=$(mod_c).find('#md_unload_name').val().trim(),
            div_v=$(this).closest('div'),
            chkbx_msu_alfr_v=$(div_v).find('.chkbx_msu_alfr').prop('checked'),
            chkbx_msu_odta_v=false;
        if (chkbx_msu_alfr_v) {
            if ($(div_v).find('.chkbx_msu_odta').prop('checked')) {
                chkbx_msu_odta_v=true;
            }
        }   
        if ((md_unload_sname=='') || (md_unload_name=='')) {
            alert('Необходимо заполнить поля "Сис.наименование структуры" и "Наименование структуры"');
        }
        else {
            params['code_in']='get_exist_md_to_repos';        
            params['md_sname']=md_unload_sname;
            //console.log(params);
            $.ajax({
                type: "POST",
                url: "/get-mdr.php",
                data: params,
                dataType:'json',
                success: function(data){
                    var pr_ok=true;
                    if (parseInt(data.exist)===1) {
                        if ($(data.forms).length===0) {
                            pr_ok=confirm('Структура с таким сис.наименованием уже существует, но она не используется в других формах/отчётах, продолжить?');
                        }
                        else {
                            var txt_conf='Структура с таким сис.наименованием уже существует, она используется в других формах/отчётах:\n';
                            for (var key in data.forms) {
                                txt_conf+='"'+data.forms[key].name+'" ('+data.forms[key].sname+'): '+data.forms[key].mdr_str+'\n';
                            }
                            txt_conf+=', продолжить?';
                            pr_ok=confirm(txt_conf);
                        }
                    }
                    if (pr_ok) {
                        var md_true=$(table_tag).find('.masterdata[id="'+id_t+'"]'),
                            md=$(md_true).clone(),
                            md_html=$(md).html(),
                            params2 = new Object();
                        params2['code_in']='save_md_to_repos';
                        params2['md_sname']=md_unload_sname;
                        params2['md_name']=md_unload_name;
                        params2['md']=md_html;
                        params2['olap_id']=id_t;
                        params2['sql']=LZString.decompressFromUTF16($(md).find('.sql_value').text()).trim();
                        //console.log(params);
                        $.ajax({
                            type: "POST",
                            url: "/get-mdr.php",
                            data: params2,
                            success: function(data2){
                                if (chkbx_msu_alfr_v) {
                                    var mdr_str='all',
                                        md_sname_old=$(md_true).attr('mdr_class');
                                    $(md_true).attr('mdr_class',md_unload_sname);
                                    if (chkbx_msu_odta_v) {
                                        mdr_str='only_data';                                                                                
                                    }
                                    $(md_true).attr('mdr_str',mdr_str);
                                    
                                    var params3 = {};
                                    params3['code_in']='save_mdr_link';
                                    params3['md_sname']=md_unload_sname;
                                    if (!!md_sname_old) {
                                        params3['md_sname_old']=md_sname_old;
                                    }
                                    params3['mdr_str']=mdr_str;
                                    params3['rep_id']=$('#div_name_rep #in_rep_id').val();                
                                    $.ajax({
                                        type: "POST",
                                        url: "/get-mdr.php",
                                        data: params3,
                                        success: function(data3){
                                            console.log(data3);
                                        },
                                        error: function(xhr, status, error) {
                                            alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                                            console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                                        }
                                    });
                                }
                                else {
                                    $(md_true).removeAttr('mdr_class')
                                              .removeAttr('mdr_str');
                                }
                                modal_close();
                                alert('Структура успешно сохранена');
                            },
                            error: function(xhr, status, error) {
                                alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                                console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                            }
                        });
                    }
                },
                error: function(xhr, status, error) {
                    alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                    console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                }
            });  
        }    
    });
    
    $('div.modal_content').on('click', '.md_back', function() {
        var id_t=$(this).attr('md_id');
        var gp=$(table_tag).find('div[id="group_tab"][olap_id="'+id_t+'"]'),
            md=$(gp).find('.masterdata[id="'+id_t+'"]');
        if (this.id=='md_sql_load_back') {
            pr_active_mod=$('.md_sql_edit[id="'+id_t+'"]');
            $(modal_header).find('#modal_head_p').html('Редактирование SQL-запроса для структуры таблицы отчета');
            $(modal_form).find('.modal_content').html('<a class="md_back" md_id="'+id_t+'" title="Назад" id="md_sql_edit_back" style="display: inline;z-index: 500000;">\n\
                                        <img src="/img/Back.png" style="width:30px;height:auto;">\n\
                                     </a>\n\
                                     <a id="'+id_t+'" title="Загрузить SQL-запрос из другого источника" style="display: inline;z-index: 500000;left:40px;position: absolute;" class="md_sql_load">\n\
                                        <img src="/img/download.png" style="width:30px;height:auto;">\n\
                                     </a>\n\
                                     <div class="md_panel_sql_es">'+
                                            '<a class="md_sql_save" id="'+id_t+'" title="Сохранить структуру" style="z-index: 500000;">'+
                                                '<img src="/img/save.png" style="width:30px;height:auto;">'+
                                            '</a>'+
                                        '</div>').append($(container).show());
        }
        else if ((this.id=='md_taa_modal_html_back') || (this.id=='md_taa_action_back')) {
            pr_active_mod=$(md).find('a.action_set_table');
            $(modal_header).find('#modal_head_p').html('Редактирование действий для таблицы');
            $(modal_form).find('.modal_content').html($(modal_form).find('.modal_content div.div_hidden.before_html').html());
        }
        else if ((this.id=='taa_polya_sql_edite_back')) {
            pr_active_mod=$(md).find('div#tab_taa_value div.d-tr:eq('+$(modal_tek_content).find('md_taa_polya_save').attr('action_tr_index')+') a.a_taa_polya');
            $(modal_header).find('#modal_head_p').html('Редактирование полей для мод.окна действия');
            $(modal_form).find('.modal_content').html($(modal_tek_content).html());
            modal_tek_content=undefined;
        }  
        else if ((this.id=='taa_polya_struct_edite_back')) {
            pr_active_mod=$(md).find('div#tab_taa_value div.d-tr:eq('+$(modal_tek_content[0]).find('md_taa_polya_save').attr('action_tr_index')+') a.a_taa_polya');
            $(modal_header).find('#modal_head_p').html('Редактирование полей для мод.окна действия');
            $(modal_form).find('.modal_content').html($(modal_tek_content[0]).html());
            modal_tek_content=undefined;
        }  
        else if ((this.id=='taa_polya_struct_sql_edite_back')) {
            pr_active_mod=$(modal_tek_content[0]).find('.a_taa_polya_struct_edite');
            $(modal_header).find('#modal_head_p').html('Редактирование структуры мод.окна доп.действия');
            $(modal_form).find('.modal_content').html($(modal_tek_content[1]).html());
            modal_tek_content[1]=undefined;
        }        
        else {
            pr_active_mod=$('.table_active[id="'+id_t+'"]');
            $(modal_header).find('#modal_head_p').html('Создание/редактирование структуры таблицы отчета');
            if (!!editor) {
                editor.destroy();
            }    
            $(modal_form).find('.modal_content').empty().append($(md).show()); 
        }
        if (!!editor) {
            editor.destroy();
        }    
    });
    
    $('div.modal_content').on('click', '.description', function() {
        pr_active_mod=$(this);
        var md=$('.masterdata[id="'+$(this).attr('id')+'"]');
        $(modal_header).find('#modal_head_p').html('Редактирование описания функционала');
        $('.r_table[id="'+$(pr_active_mod).attr('id')+'"]').prepend(md);
        $(md).hide();
        $(modal_form).find('.modal_content').html('<a class="md_back" md_id="'+$(this).attr('id')+'" title="Назад" id="md_description_back" style="display: inline;z-index: 500000;">\n\
                                    <img src="/img/Back.png" style="width:30px;height:auto;">\n\
                                 </a>\n\
                                 <div class="md_panel_sql_es">'+
                                        '<a class="md_save_description" id="'+$(this).attr('id')+'" title="Сохранить описание" style="z-index: 500000;">'+
                                            '<img src="/img/save.png" style="width:30px;height:auto;">'+
                                        '</a>'+
                                    '</div>').append(container);
        var editor=$('div#editor'); 
        $(editor).html($(pr_active_mod).find('.div_hidden').html());
        $(container).find('.btn-toolbar ').html($(container_btn_toolbar).html());
        if ($('div#editor').length===0) {
            initToolbarBootstrapBindingsTrue();
        }    
        $(container).show();
    });
    
    $('div.modal_content').on('click', '.md_save_description', function() {
        var id_t=this.id;
        var md=$('.masterdata[id="'+id_t+'"]');
        var editor=$('div#editor');
        var description=$(md).find('.description[id="'+id_t+'"] .div_hidden');
        $(description).html($(editor).html());
        pr_active_mod=$('.table_active[id="'+id_t+'"]');
        $(modal_header).find('#modal_head_p').html('Создание/редактирование структуры таблицы отчета');
        $(modal_form).find('.modal_content').empty().append($(md).show()); 
    });
    
    $('div.modal_content').on('click', '.action_one[action_type="olap"]', function() {
        pr_active_mod=$(this).closest('li');
        var tek_id=$(pr_active_mod).closest('li.action').attr('id'),
            md=$(modal_form).find('.masterdata[id="'+tek_id+'"]');
        $(modal_header).find('#modal_head_p').html('Редактирование кода действия');
        $(table_tag).find('.r_table[id="'+tek_id+'"]').prepend(md);
        $(md).hide();
        $(modal_form).find('.modal_content').html('<a class="md_back" md_id="'+tek_id+'" title="Назад" id="md_description_back" style="display: inline;z-index: 500000;">\n\
                                    <img src="/img/Back.png" style="width:30px;height:auto;">\n\
                                 </a>\n\
                                 <div class="md_panel_sql_es">'+
                                        '<a class="md_save_action" id="'+tek_id+'" action_id="'+$(pr_active_mod).attr('id')+'" title="Сохранить код действия" style="z-index: 500000;">'+
                                            '<img src="/img/save.png" style="width:30px;height:auto;">'+
                                        '</a>'+
                                    '</div>').append(container);
        set_ace_edit('javascript',$(pr_active_mod).attr('data-edit_ace-theme'),$(pr_active_mod).attr('data-edit_ace-size'),LZString.decompressFromUTF16($(pr_active_mod).find('.div_hidden').text()));            
        $(container).show();
    });
    
    $('div.modal_content').on('click', '.md_save_action', function() {
        var id_t=this.id,
            action_id=$(this).attr('action_id');
        var gp=$(table_tag).find('div[id="group_tab"][olap_id="'+id_t+'"]'),
            md=$(gp).find('.masterdata[id="'+id_t+'"]');
        pr_active_mod=$(gp).find('.table_active[id="'+id_t+'"]');
        var action_one=$(md).find('li.action li[id="'+action_id+'"]');        
        $(action_one).find('.div_hidden').html(LZString.compressToUTF16(editor.getValue()));        
        $(settings_group_panel_active).show();
        set_change_style_li_panel_multi(action_one);         
        $(modal_header).find('#modal_head_p').html('Создание/редактирование структуры таблицы');
        $(modal_form).find('.modal_content').empty().append($(md).show()); 
    });
    
    $('div.modal_content').on('click', 'a.a_param_sql_edite', function() {
        var md=$('.masterdata[id="'+$(this).attr('id')+'"]');
        $('#modal_head_p').html('Редактирование SQL-запроса для параметра таблицы');
        var sel_param_type=$(md).find('.sel_param_type[id="'+$(this).attr('id_param')+'"]')
        if (($(sel_param_type).val()!='text') & (($(sel_param_type).val()!='number'))) {
            alert('Задание SQL-запроса возможно только для параметра с типом "Строка" или "Число"');
            return; 
        }
        pr_active_mod=$(this);         
        $('.r_table[id="'+$(pr_active_mod).attr('id')+'"]').prepend(md);
        $(md).hide();
        $('.modal_content').html('<a class="md_back" md_id="'+$(this).attr('id')+'" title="Назад" id="a_param_sql_edite_back" style="z-index: 500000;">\n\
                                    <img src="/img/Back.png" style="width:30px;height:auto;">\n\
                                 </a>\n\
                                    <div class="md_panel_sql_es">'+
                                        '<a class="md_param_sql_save" id="'+$(this).attr('id')+'" id_param="'+$(this).attr('id_param')+'" title="Сохранить запрос" style="z-index: 500000;">'+
                                            '<img src="/img/save.png" style="width:30px;height:auto;">'+
                                        '</a>'+
                                    '</div>').append(container);
        /*var editor=$('div#editor'); 
        $(editor).html($('.params_sql[id="'+$(this).attr('id')+'"][id_param="'+$(this).attr('id_param')+'"]').html());*/
        set_ace_edit('sql',$(pr_active_mod).attr('data-edit_ace-theme'),$(pr_active_mod).attr('data-edit_ace-size'),$('.params_sql[id="'+$(this).attr('id')+'"][id_param="'+$(this).attr('id_param')+'"]').text());        
        $(container).show();
    });          
    
    //объект зависимых параметров
    $('div.modal_content').on('click', 'a.md_param_sql_save', function() {
        var id_param=$(this).attr('id_param');
        var id_t=$(this).attr('id');
        var params_sql=$('.params_sql[id="'+id_t+'"][id_param="'+id_param+'"]');
        
        var md=$('.masterdata[id="'+id_t+'"]');                
        if ($(params_sql).html()!=editor.getValue().trim()) {
            $(params_sql).html(editor.getValue().trim());            
        }
        $('#overlay').after($('.container').hide());
        pr_active_mod=$('.table_active[id="'+id_t+'"]');
        $('div.params_group[id="'+id_t+'"]').hide();
        var sel_param_type=$(md).find('.sel_param_type[id="'+id_param+'"]');
        $(sel_param_type).removeAttr('readonly');
        if ($(params_sql).text().trim()!='') {
            $(sel_param_type).attr('readonly','');
        }
        $('#modal_head_p').html('Создание/редактирование структуры таблицы отчета');
        $('.modal_content').empty().append($(md).show());
    });
    
    $('div.modal_content').on('click', 'a.md_sql_save', function() {
        //console.log('sohranyaem');
        //var editor=$('div#editor');
        let id_t=$(this).attr('id'),
            gp=$(table_tag).find('div[id="group_tab"][olap_id="'+id_t+'"]'),
            md=$(gp).find('.masterdata[id="'+id_t+'"]'),
            d_table_pol=$(md).find('.polya.d-table .d-table[id="tab_pol"]'),
            sql_value_v=$(md).find('.sql_value[id="'+id_t+'"]'),
            sql_value_decode=LZString.decompressFromUTF16($(sql_value_v).text()),
            md_so=$(md).find('.structure_old'),
            sql_editor=editor.getValue().trim();            
        if (((sql_value_decode!=sql_editor)) || ($(d_table_pol).find('.SYSNAME[id="_no_str_"]').length>0)) {
            var params = new Object(),
                sql_editor_encode=LZString.compressToUTF16(sql_editor);
            params['code_in']='save_md_str';
            params['sql_true']=sql_editor;
            params['sql']=params['sql_true'];
            //$(sql_value_v).html(sql_editor_encode);  
            //почему-то иногда обрезает код эдитора если через html, надо в остальных местах поправить, пока тестируем
            $(sql_value_v).text(sql_editor_encode); 
            params['tab_id']=id_t;        
            //формируем таблицу с параметрами
            var params_r=param_create(params['sql_true']);
            params['sql_true']=params_r['sql_true'];  
            params['sql_lz']=sql_editor_encode;
            params['params']=JSON.stringify(params_r['params']);
            params['params_olap']=JSON.stringify(params_r['params_olap']);
            //console.log(params);
            $('#overlay').after($('.container').hide());
            pr_active_mod=$(gp).find('.table_active[id="'+id_t+'"]');
            $.ajax({
                type: "POST",
                url: "/get-data.php",
                data: params,
                success: function(html){
    //                console.log(html); 
                    function upd_str_par(html) {
                        var tek_param=$(html).filter('div.params.d-table');
                        if ($(tek_param).length===0) {
                            //может приходить и так и так, проверяем оба случая
                            tek_param=$(html).find('div.params.d-table');
                        }
                        if ($(md_so).length>0) {
                            var pr_destroy_par=false,
                                md_pram=$(md).find('.params.d-table');
                            if ($(tek_param).length===0) {
                                if ($(md_pram).length>0) {
                                    pr_destroy_par=true;                            
                                    $(md_pram).remove();
                                }
                            }
                            else if (($(tek_param).length>0) & ($(md_pram).length===0)) {                                
                                pr_destroy_par=true;
                                $(sql_value_v).after(tek_param[0].outerHTML)
                            }
                            else {
                                //параметры были и до и после
                                var mas_exist_par=[],
                                    tek_param_tr=$(tek_param).find('.tr_params'),
                                    mass_remove_par=[],
                                    md_pram_tr=$(md_pram).find('.tr_params');
                                $(md_pram_tr).each(function(i,elem) {
                                    var pr_exist_one=false,
                                        tek_id=$(elem).attr('id');
                                    $(tek_param_tr).each(function(i2,elem2) {
                                        if ($(elem2).attr('id')==tek_id) {
                                            pr_exist_one=true;
                                            mas_exist_par.push(tek_id);
                                            return false;
                                        }
                                    });
                                    if (!pr_exist_one) {
                                        mass_remove_par.push(tek_id);
                                        pr_destroy_par=true;
                                    }
                                });
                                mass_remove_par.forEach(function(element) {
                                    $(md_pram_tr).filter('[id="'+element+'"]').remove();
                                });
                                var md_pram_ap=$(md_pram).find('.d-table');
                                $(tek_param_tr).each(function(i,elem) {
                                    var pr_exist_one=false;
                                    mas_exist_par.forEach(function(element) {
                                        if (element==$(elem).attr('id')) {
                                            pr_exist_one=true;
                                        }
                                    });
                                    if (!pr_exist_one) {
                                        pr_destroy_par=true;
                                        $(md_pram_ap).append(elem);
                                    }
                                });                                
                            }
                        } 
                        else {
                            if ($(tek_param).length>0) {
                                $(sql_value_v).after(tek_param[0].outerHTML);
                            }                            
                        }
                        if (pr_destroy_par) {
                            $(gp).find('div.params_group[id="'+id_t+'"]').empty().hide();
                        }
                    }    
                        
                    var tab_pol_v=$(html).find('.d-table[id="tab_pol"]');                    
                    if ($(md).find('.structure_old').html()!=$(tab_pol_v).html()) {
                        var pr_2D=$(md).find('a.2D_3D').hasClass('2D');                        
                        //смотрим каждое поле, перестраиваем таблицу, если отличаются наименования в созданной структуре таблице, саму структуру не очищаем никогда при её наличии
                        let mas_exist=[],
                            pr_destroy=false,
                            tp_sn=$(tab_pol_v).find('.SYSNAME');
                    
                        function update_str_tab(tab_str_v) {
                            //все значения
                            var md_tab_val=$(md).find('.d-table#tab_geometry .d-table[id="'+tab_str_v+'"]'),
                                md_tab_val_tr=$(md_tab_val).find('.d-tr'),
                                mass_remove=[];
                            $(md_tab_val_tr).each(function(i,elem) {
                                var pr_exist_one=false,
                                    sn_id=$(elem).find('.SYSNAME').attr('id');
                                $(tp_sn).each(function(i2,elem2) {
                                    if (sn_id==$(elem2).attr('id')) {
                                        mas_exist.push(sn_id);
                                        pr_exist_one=true;
                                        return false;
                                    }
                                });
                                if (!pr_exist_one) {
                                    pr_destroy=true;                                        
                                    mass_remove.push(sn_id);
                                }
                            });
                            mass_remove.forEach(function(element) {
                                $(md_tab_val_tr).filter('[id="'+element+'"]').remove();
                            }); 
                            
                            md_tab_val=$(md).find('.d-table#tab_geometry  .d-table[id="'+tab_str_v+'"]');
                            md_tab_val_tr=$(md_tab_val).find('.d-tr');
                            if ($(md_tab_val_tr).length===0) {
                                //$(md_tab_val).append('<div class="d-tr"><div class="d-td" id="plhold_val" style="border:0;">Перенесите сюда значения для показателей</div></div>');
                                $(md_tab_val).append($(md).find('.structure_r_old .d-table[id="'+tab_str_v+'"]').html());                                
                            }
                        }
                        if (!pr_2D) {
                            //все строки
                            update_str_tab('tab_str');
                            //все показатели
                            update_str_tab('tab_pok');
                            //все значения 
                            update_str_tab('tab_val');
                        }
                        else {
                            //все значения
                            update_str_tab('tab_val');
                        }
                        var md_tab_pol_v=$(md).find('#tab_pol');
                        $(md_tab_pol_v).find('.d-tr[id!="_itogo_"][id!="after_append"]').remove();
                        $(tab_pol_v).clone().find('.d-tr[id!="_itogo_"][id!="after_append"]').each(function(i,elem) {
                            var pr_exist_one=false;
                            mas_exist.forEach(function(element) {
                                if (element==$(elem).attr('id')) {
                                    pr_exist_one=true;
                                }                                    
                            });
                            if (!pr_exist_one) {
                                $(md_tab_pol_v).append(elem);
                            }
                        });
                        //параметры, если изменились, то надо позже перестроить параметры в таблице, сейчас параметры в структуре
                        upd_str_par(html);                            
                        
                        if (pr_destroy) {
                            olap_tab_clear(id_t);
                            //console.log($(tab_pol_v).html());
                            $(md_so).html($(tab_pol_v).html());
                            $(modal_form).find('.modal_content').empty().append($(md).show().focus());
                        }
                        else {
                            if ($(md_so).length===0) {
                                $(md).html(html).append('<div class="structure_old">'+$(tab_pol_v).html()+'</div>');
                                var md_structure_r_old=$(md).find('.structure_r_old');
                                if ($(md_structure_r_old).length===0) {
                                    $(md).append('<div class="structure_r_old">'+$(html).find('.d-table#tab_geometry').html()+'</div>');
                                }
                                $(modal_form).find('.modal_content').empty().append($(md).show().focus());                                        
                            }
                            else {
                                $(md_so).html($(tab_pol_v).html());
                                $(modal_form).find('.modal_content').empty().append($(md).show().focus());
                            }    
                        }
                                                              
                    }
                    else {
                        upd_str_par(html);
                        $(modal_form).find('.modal_content').empty().append($(md).show()).focus();
                    }
                },
                error: function(xhr, status, error) {
                    alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                    console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                }
            }); 
        }
        else {
            $('#overlay').after($('.container').hide());
            pr_active_mod=$(gp).find('.table_active[id="'+id_t+'"]');
            //$(gp).find('div.params_group[id="'+id_t+'"]').hide();
            $(modal_form).find('.modal_content').empty().append($(md).show()).focus();
        }
        $(modal_form).find('#modal_head_p').html('Создание/редактирование структуры таблицы отчета');
    });
        
    $('div.modal_content').on('click', 'a.action_set_table', function() {
        pr_active_mod=$(this);
        var md=$('.masterdata[id="'+$(this).attr('id')+'"]');
        $('#modal_head_p').html('Редактирование действий для таблицы');
        $('.r_table[id="'+$(pr_active_mod).attr('id')+'"]').prepend(md);
        $(md).hide();
        $('.modal_content').html($(this).next().html());
    });
    
    $('div.modal_content').on('click', '.taa_add', function() {
        var polya_v=$(this).closest('.dt_tab_action'),
            d_tr_last=$(polya_v).find('#tab_taa_value .d-tr:last'),
            d_tr_clone=$(d_tr_last).clone().removeClass('default');
        $(d_tr_clone).find('.SYSNAME').html('<input type="text" value="" class="in_taa_sysname" style="width:140px;">').css('padding','0'); 
        $(d_tr_clone).find('.NAME').html('<input type="text" value="" class="in_taa_name" style="width:140px;">').css('padding','0');
        $(d_tr_clone).find('.TYPE').html('<select  class="sel_taa_type" title="Выберите тип тействия" style="margin:0;width:130px">\n\
                                            <option selected value="operation">Операция</option>\n\
                                            <option value="modal">Модальное окно</option>\n\
                                        </select>')
                                    .css('padding','0')
                                    .css('min-width','100px');
        $(d_tr_clone).find('.TAA_DOP').html('<a title="Редактировать код действия" class="md_taa_action_edit" action_type="olap"><img src="/img/actions.png" style="height:27px;width:auto;"title="Редактировать код действия"></a><div class="div_hidden taa_action_v"></div>')
                                      .css('min-width','100px');
        $(d_tr_last).after(d_tr_clone);
    })
    
    $('div.modal_content').on('change', '.sel_taa_type', function() {
        var tek_tr=$(this).closest('.d-tr'),
            td_dop=$(tek_tr).find('.TAA_DOP');
        if ($(this).val()=='modal') {
            $(td_dop).append('<a title="Редактировать html модального окна" class="md_taa_html_edit" action_type="olap"><img src="/img/html5.png" style="height:27px;width:auto;"title="Редактировать html модального окна"></a>\n\
                              <div class="div_hidden taa_html_v"></div>\n\
                              <a class="a_taa_polya" title="Редактировать поля для действий" style="z-index: 500000;"><img src="/img/edite_edite.png" style="width:auto;height:30px;"></a>\n\
                              <div class="div_hidden taa_polya_v"></div>');
        }
        else {
            $(td_dop).find('.md_taa_html_edit').remove();
            $(td_dop).find('.taa_html_v').remove();
            $(td_dop).find('.a_taa_polya').remove();
            $(td_dop).find('.taa_polya_v').remove();
        }
    });
    
    $('div.modal_content').on('click', '.md_taa_html_edit', function(e) {
        pr_active_mod=this;
        $('#modal_head_p').html('Редактирование HTML модального окна');
        var html_val='',
            md=$(this).closest('.tab_action_add_md'),
            at=$(md).attr('action_type'),
            tek_id=$(md).attr('id'),
            tr_action_index=$(this).closest('.d-tr').index(),
            md_t=$(table_tag).find('.masterdata#'+tek_id),
            mdc_v=$(modal_form).find('.modal_content').clone();
        //сохраняем текущие действия
        $(md_t).find('li.action_set_table .div_hidden:first').html($(this).closest('div.modal_content').html());
        
        if ($(this).attr('action_type')=='olap') {            
            html_val=LZString.decompressFromUTF16($(this).next().text());
        }
        $(modal_form).find('.modal_content').html('<div class="md_panel_es">'+
                                                '<a class="md_back" md_id="'+tek_id+'" title="Назад" id="md_taa_modal_html_back" style="display: inline;z-index: 500000;">'+
                                                    '<img src="/img/Back.png" style="width:30px;height:auto;">'+
                                                '</a>'+
                                                '<a class="save_taa_modal_html" id="'+tek_id+'" tr_action_index="'+tr_action_index+'" title="Сохранить html" style="z-index: 500000;" action_type="'+at+'">'+
                                                    '<img src="/img/save.png" style="width:30px;height:auto;">'+
                                                '</a>'+
                                            '</div>').append(container).append('<div class="div_hidden before_html">'+$(mdc_v).html()+'</div>');
        set_ace_edit('html',$(this).attr('data-edit_ace-theme'),$(this).attr('data-edit_ace-size'),html_val);                                    
        $(container).show();
        open_modal(e);                 
    });
    
    $('div.modal_content').on('click', '.md_taa_action_edit', function(e) {
        pr_active_mod=this;
        $('#modal_head_p').html('Редактирование кода действия');
        var js_val='',
            md=$(this).closest('.tab_action_add_md'),
            at=$(md).attr('action_type'),
            tek_id=$(md).attr('id'),
            tr_action_index=$(this).closest('.d-tr').index(),
            md_t=$(table_tag).find('.masterdata#'+tek_id),
            mdc_v=$(modal_form).find('.modal_content').clone();
        //сохраняем текущие действия
        $(md_t).find('li.action_set_table .div_hidden:first').html($(this).closest('div.modal_content').html());
        
        if ($(this).attr('action_type')=='olap') {            
            js_val=LZString.decompressFromUTF16($(this).next().text());
        }
        $('.modal_content').html('<div class="md_panel_es">'+
                                    '<a class="md_back" md_id="'+tek_id+'" title="Назад" id="md_taa_action_back" style="display: inline;z-index: 500000;">'+
                                        '<img src="/img/Back.png" style="width:30px;height:auto;">'+
                                    '</a>'+
                                    '<a class="save_taa_action" id="'+tek_id+'" tr_action_index="'+tr_action_index+'" title="Сохранить код" style="z-index: 500000;" action_type="'+at+'">'+
                                        '<img src="/img/save.png" style="width:30px;height:auto;">'+
                                    '</a>'+
                                '</div>').append(container).append('<div class="div_hidden before_html">'+$(mdc_v).html()+'</div>');
        set_ace_edit('javascript',$(this).attr('data-edit_ace-theme'),$(this).attr('data-edit_ace-size'),js_val);                                    
        $(container).show();
        open_modal(e);                 
    });
    
    var taa_mod_tek_tr;
    $("div.modal_content" ).on("click", 'div.tab_action_add_md div#tab_taa_value .d-tr:not([id="after_append"]), \n\
                                         div.tab_action_add_md div#tab_taa_value .d-tr:not([id="after_append"]) input, \n\
                                         div.dt_tab_action_polya div#tab_taa_polya_value .d-tr:not([id="after_append"]), \n\
                                         div.dt_tab_action_polya div#tab_taa_polya_value .d-tr:not([id="after_append"]) input'
                                     , function() {
        if ($(this).find('.NAME').length>0) {
            taa_mod_tek_tr=this;
        }    
    });
    $("div.modal_content" ).on("click", ".taa_del", function() {
        if ((!!!taa_mod_tek_tr) || ($(taa_mod_tek_tr).length===0)) {
            alert('Не выбрана строка для удаления');
        }
        else if ($(taa_mod_tek_tr).find('.NAME input').length==0) {
            alert('Запрещено удаление системных действий');
        }   
        else {
            $(taa_mod_tek_tr).remove();
            taa_mod_tek_tr=undefined;
        }        
    });
    
    $("div.modal_content" ).on("click", ".save_taa_modal_html", function() {
        var tek_id=this.id,
            tr_action_index=$(this).attr('tr_action_index'),
            md_t=$(table_tag).find('.masterdata#'+tek_id),
            mdc_v=$(modal_form).find('div.div_hidden.before_html'),
            mdc_v_c=$(mdc_v).clone(),
            tek_tr=$(mdc_v_c).find('.d-table#tab_taa_value .d-tr:eq('+tr_action_index+')');
        $(mdc_v).remove();                
        //сохраняем текущие действия и настройки окна
        $(tek_tr).find('.taa_html_v').html(LZString.compressToUTF16(editor.getValue()));
        $(tek_tr).find('.md_taa_html_edit')
            .attr('data-edit_ace-theme',$(pr_active_mod).attr('data-edit_ace-theme'))
            .attr('data-edit_ace-size',$(pr_active_mod).attr('data-edit_ace-size'));
        editor.destroy();
        pr_active_mod=$(md_t).find('a.action_set_table');
        $('#modal_head_p').html('Редактирование действий для таблицы');
        $(modal_form).find('.modal_content').html($(mdc_v_c).html());
    });
    
    $("div.modal_content" ).on("click", ".save_taa_action", function() {
        var tek_id=this.id,
            tr_action_index=$(this).attr('tr_action_index'),
            md_t=$(table_tag).find('.masterdata#'+tek_id),
            mdc_v=$(modal_form).find('div.div_hidden.before_html'),
            mdc_v_c=$(mdc_v).clone(),            
            tek_tr=$(mdc_v_c).find('.d-table#tab_taa_value .d-tr:eq('+tr_action_index+')');
        $(mdc_v).remove();      
        //сохраняем текущие действия и настройки окна
        $(tek_tr).find('.taa_action_v').html(LZString.compressToUTF16(editor.getValue()));
        $(tek_tr).find('.md_taa_action_edit')
            .attr('data-edit_ace-theme',$(pr_active_mod).attr('data-edit_ace-theme'))
            .attr('data-edit_ace-size',$(pr_active_mod).attr('data-edit_ace-size'));
        editor.destroy();
        pr_active_mod=$(md_t).find('a.action_set_table');
        $('#modal_head_p').html('Редактирование действий для таблицы');
        $(modal_form).find('.modal_content').html($(mdc_v_c).html());
    });
    
    $("div.modal_content" ).on("click", ".tab_action_add_md_save", function() {
        var id_t=$(this).attr('id'),
            pr_ok=true,
            sysname=[],name=[],
            modal_content=$('.modal_content'),
            d_tr_last=$(modal_content).find('.d-table#tab_taa_value .d-tr[id!="after_append"]');                               
        $(d_tr_last).each(function(i,elem) {
            var t_sname,t_name,
                td_sn=$(elem).find('.SYSNAME'),
                t_sinput=$(td_sn).find('input'),
                td_n=$(elem).find('.NAME'),
                t_ninput=$(td_n).find('input'),
                td_action_v=$(elem).find('.taa_action_v').text().trim(),
                td_html_v=$(elem).find('.taa_html_v');
            if ($(t_sinput).length>0) {
                t_sname=$(t_sinput).val().trim();
                t_name=$(t_ninput).val().trim()
                if ((t_sname.length==0) || (t_name.length==0)) {
                    alert('Добавленные действия должны иметь "Сис.имя" и "Наименование"');
                    pr_ok=false;
                } 
                else { 
                    if (sysname.indexOf(t_sname)!=-1) {
                        alert('Добавленные действия должны иметь уникальные "Сис.имя"');
                        pr_ok=false;
                    }  
                    else {
                        sysname.push(t_sname);
                    }
                    if (name.indexOf(t_name)!=-1) {
                        alert('Добавленные действия должны иметь уникальные "Наименование"');
                        pr_ok=false;
                    }  
                    else {
                        name.push(t_name);
                    }
                    if (td_action_v.length==0) {
                        alert('Для добавленных действий необходимо добавить исполняемый код');
                        pr_ok=false;
                    } 
                    if ($(td_html_v).length>0) {
                        if ($(td_html_v).text().trim().length==0) {
                            alert('Для добавленных действий с типом "Модальное окно" необходимо добавить вызываемый HTML');
                            pr_ok=false;
                        }
                    }
                }                
            }
            else {
                sysname.push($(td_sn).text());
                name.push($(td_n).text());
            }
            if (!pr_ok) {
                return false;
            }
        });    
        
        if (pr_ok) {
            var md=$(table_tag).find('.masterdata[id="'+id_t+'"]');
            pr_active_mod=$(md).closest('div[id="group_tab"]').find('.table_active[id="'+id_t+'"]');
            $(md).find('li.action_set_table .div_hidden:first').html($(modal_content).html());    
            $('#overlay').after($('.container').hide());
            $(modal_content).empty().append($(md).show());            
        }    
    }); 
    
    $('.no_panel').on('click', 'li.olap_dop_action', function(e) {
        var ul_oda=$(this).find('ul.olap_dop_action').toggleClass('ul_vis');
        if ($(ul_oda).hasClass('ul_vis')) {
            var this_top=$(this).offset().top+30-$(html_v).scrollTop(),
                this_left=$(this).offset().left+3-$(html_v).scrollLeft();
            //console.log($(tek_el));
            $(ul_oda).css({'left':this_left+'px','top':this_top+'px'});
        } 
        else {
            $(ul_oda).css({'left':'-250px'});
        }
    });
    
    
    let taa_count_pol=0; 
    function taa_pol_one_str(elem) {
        var taa_pol_t_sel_v='<select class="taa_pol_t_sel">\n\
                                <option selected value="text">Текст</option>\n\
                                <option value="number">Число</option>\n\
                                <option value="date">Дата</option>\n\
                                <option value="datetime">Дата/время</option>\n\
                                <option value="checkbox">Чекбокс</option>\n\
                                <option value="time">Время</option>\n\
                                <option value="tel">Телефон</option>\n\
                                <option value="text">Текст</option>\n\
                                <option value="email">Email</option>\n\
                                <option value="db_dropbox">Выпадающий список из БД</option>\n\
                                <option value="db_in_modal">Модальное окно из БД</option>\n\
                            </select>';
        taa_count_pol++;
        var id_v='',
            text_v='';
        if ($(elem).length>0) {
            id_v=$(elem).attr('id').toLowerCase();
            text_v=$(elem).text();
        }
        else {
            if (!!elem) {
                id_v=elem;
            }
        }
        return '<div class="d-tr">\n\
                        <div class="SYSNAME d-td" style="padding: 0;"><input type="text" value="'+id_v+'" class="in_taa_pol_sysname" style="width:11em;"></div>\n\
                        <div class="NAME d-td" style="padding: 0;"><input type="text" value="'+text_v+'" class="in_taa_pol_name" style="width:13em;"></div>\n\
                        <div class="TYPE d-td" style="padding: 0;">'+taa_pol_t_sel_v+'</div>\n\
                        <div class="REQUIRED d-td" style="text-align: center;"><input type="checkbox" class="in_taa_pol_required"></div>\n\
                        <div class="SORT d-td" style="padding: 0;min-width:50px;"><input type="number" step="1" value="'+taa_count_pol+'" class="in_taa_pol_sort" style="width:7em;"></div>\n\
                        <div class="DOP d-td" style="min-width:110px;"></div>\n\
                    </div>\n'; 
    }
    $("div.modal_content" ).on("click", ".a_taa_polya", function() {
        pr_active_mod=$(this);
        var id_t=$(this).closest('.tab_action_add_md').attr('id'),
            taa_polya_v=$(this).next(),            
            tek_tr=$(this).closest('.d-tr');
        let html_v;  
        var mdc_v=$(modal_form).find('.modal_content').clone();
        $(modal_form).find('#modal_head_p').html('Редактирование полей для мод.окна действия');
        if ($(taa_polya_v).text().trim()!='') {
            html_v=LZString.decompressFromUTF16($(taa_polya_v).text());            
            taa_count_pol=0;
            $(html_v).find('.in_taa_pol_sort').each(function(i,elem) {
                if (parseFloat($(elem).val())>taa_count_pol) {
                    taa_count_pol=$(elem).val();
                }
            });
        }
        else {            
            //собираем все поля из структуры в таблицу
            var sql_v_lz='';
            taa_count_pol=0;
            html_v='<div class="md_panel_es">\n\
                        <a class="md_back" md_id="'+id_t+'" title="Назад" id="md_taa_action_back" style="display: inline;z-index: 500000;">\n\
                            <img src="/img/Back.png" style="width:30px;height:auto;">\n\
                        </a>\n\
                        <a class="md_taa_polya_save" id="'+id_t+'" title="Сохранить структуру полей" action_tr_index="'+$(tek_tr).index()+'" style="z-index: 500000;">\n\
                            <img src="/img/save.png" style="width:auto;height:30px;">\n\
                        </a>\n';
            if ($(tek_tr).is('.default')) {
                sql_v_lz=$(tek_tr).find('.taa_sql_v').text().trim();
                html_v+='<div class="div_hidden taa_sql_v">'+sql_v_lz+'</div>';
            }                
            html_v+='</div>\n\
                    <div class="dt_tab_action_polya d-table" style="display: inline;">\n\
                        <div class="d-tr">\n\
                            <div class="d-td" style="font-size:12pt;font-weight:bold;"><a class="taa_polya_add"><img src="/img/add.png" title="Добавить поле" style="height:27px;width:auto;display:inline-block;margin:3px;"></a><a class="taa_del"><img src="/img/rep_del.png" title="Удалить поле" style="height:27px;width:auto;display:inline-block;margin:3px;"></a> Список полей</div>\n\
                        </div>\n\
                        <div class="d-td" style="padding:0;">\n\
                            <div class="d-table" id="tab_taa_polya_value">\n\
                                <div class="d-tr" id="after_append">\n\
                                    <div class="d-td" style="font-size:11pt;font-weight:bold;">Сис.имя</div>\n\
                                    <div class="d-td" style="font-size:11pt;font-weight:bold;">Наименование</div>\n\
                                    <div class="d-td" style="font-size:11pt;font-weight:bold;min-width:130px;">Тип поля</div>\n\
                                    <div class="d-td" style="font-size:11pt;font-weight:bold;min-width:120px;">Обязательность</div>\n\
                                    <div class="d-td" style="font-size:11pt;font-weight:bold;min-width:115px;">Порядок<br>отображения</div>\n\
                                    <div class="d-td" style="font-size:11pt;font-weight:bold;min-width:150px;">Дополнительно</div>\n\
                                </div>\n';
            function constr_tr() {
                var table_tag_v=$(table_tag),                
                    gp=$(table_tag_v).find('div[id="group_tab"][olap_id="'+id_t+'"]'),
                    md=$(gp).find('.masterdata[id="'+id_t+'"]'),
                    pr_2D=$(md).find('a.2D_3D').hasClass('2D');

                if (($(md).find('.structure.d-table .d-table[id="tab_str"] .SYSNAME:not(.ITOGO_NAME)').length>0) & (!pr_2D)) {
                    $(md).find('.structure.d-table .d-table[id="tab_str"] .SYSNAME:not(.ITOGO_NAME)').each(function(i,elem) {
                        html_v+=taa_pol_one_str(elem);         
                    });
                }
                $(md).find('.structure.d-table .d-table[id="tab_pok"] .SYSNAME').each(function(i,elem) {
                    html_v+=taa_pol_one_str(elem);           
                });
                if ($(md).find('.structure.d-table .d-table[id="tab_val"] .SYSNAME').length>0) {
                    $(md).find('.structure.d-table .d-table[id="tab_val"] .SYSNAME').each(function(i,elem) {
                        html_v+=taa_pol_one_str(elem);
                    });
                }
                html_v+='       </div>\n\
                            </div>\n\
                        </div>';
            }
            if (!$(tek_tr).is('.default')) {
                constr_tr();
            }
            else {
                if (sql_v_lz!='') {
                    sql_v_lz=LZString.decompressFromUTF16(sql_v_lz);
                    var params_r=param_create(sql_v_lz,null,null,null,true),
                        params_r_da=params_r['params']; 
                    for (var key in params_r_da) {
                        html_v+=taa_pol_one_str(params_r_da[key]); 
                    }
                    html_v+='       </div>\n\
                            </div>\n\
                        </div>';
                }
                else {
                    if (confirm('Не создан запрос для действия, продолжить?')) {
                        constr_tr();
                    }
                }
            }
        }
        //добавляем скрытое текущее содержание мод.окна, т.к. нельзя задействовать переменную modal_tec_content, 
        //т.к. она используется в подокнах, много переделывать на поэтапные объекты, а баг осознан после
        $(modal_form).find('.modal_content').html(html_v+'<div class="div_hidden before_html">'+$(mdc_v).html()+'<div>');
    });   
    
    $("div.modal_content" ).on("click", ".taa_polya_add", function() {
        $(modal_form).find('div#tab_taa_polya_value').append(taa_pol_one_str());
    });
    
    $("div.modal_content" ).on("change", ".taa_pol_t_sel", function() {
        var s_val=$(this).val(),
            tek_tr=$(this).closest('.d-tr');
        $(this).find('option').removeAttr("selected");
        $(this).find('option[value="'+s_val+'"]').attr('selected', '');
        if ((s_val=='db_dropbox') || (s_val=='db_in_modal')) {
            var html_v='<input type="checkbox" class="in_taa_pol_multi" title="Мультивыбор">\n\
                        <select class="sel_taa_pol_type_fdb" style="width: auto;display: inline-block;"><option value="number" selected>Число</option><option value="text">Текст</option></select>\n';
            if (s_val=='db_dropbox') {
                html_v+='<a class="a_taa_polya_sql_edite" title="Редактировать SQL-запрос" style="margin:0;">\n\
                            <img src="/img/edit_sql.png" width="25" height="auto">\n\
                        </a>\n\
                        <div class="div_hidden taa_polya_sql_v"></div>';
            }
            else if (s_val=='db_in_modal') {
                html_v+='<a class="a_taa_polya_struct_edite" title="Редактировать структуру для модального окна" style="margin:0;">\n\
                            <img src="/img/edit_tab_in_mod.png" width="25" height="auto">\n\
                        </a>\n\
                        <div class="div_hidden taa_polya_structure_v"></div>';
            }
            $(tek_tr).find('.DOP').html(html_v);
        }
        else {
            $(tek_tr).find('.DOP').empty();
        }
    });
    
    $("div.modal_content" ).on("click", ".a_taa_polya_sql_edite", function() {
        var tek_id=$(modal_form).find('.md_taa_polya_save').attr('id'),
            tr_index=$(this).closest('.d-tr').index(),
            tek_sql=LZString.decompressFromUTF16($(this).next().text());
        modal_tek_content=$(modal_form).find('.modal_content').clone();
        pr_active_mod=$(modal_tek_content).find('.a_taa_polya_sql_edite');
        $(modal_header).find('#modal_head_p').html('Редактирование SQL-запроса для поля доп.действия');
        $(modal_form).find('.modal_content').html('<a class="md_back" md_id="'+tek_id+'" title="Назад" id="taa_polya_sql_edite_back" style="display: inline;z-index: 500000;">\n\
                                    <img src="/img/Back.png" style="width:30px;height:auto;">\n\
                                 </a>\n\
                                 <div class="md_panel_sql_es">'+
                                        '<a class="taa_polya_sql_edite_save" id="'+tek_id+'" pole_tr_index="'+tr_index+'" title="Сохранить запрос" style="z-index: 500000;">'+
                                            '<img src="/img/save.png" style="width:30px;height:auto;">'+
                                        '</a>'+
                                    '</div>').append(container);
        set_ace_edit('sql',$(pr_active_mod).attr('data-edit_ace-theme'),$(pr_active_mod).attr('data-edit_ace-size'),tek_sql);
        $(container).show();
    }); 
    
    $("div.modal_content" ).on("click", ".taa_polya_sql_edite_save", function() {
        $(modal_tek_content).find('div#tab_taa_polya_value div.d-tr:eq('+$(this).attr('pole_tr_index')+') div.taa_polya_sql_v')
                            .html(LZString.compressToUTF16(editor.getValue()));
        $(modal_form).find('.modal_content').html($(modal_tek_content).html());
        modal_tek_content=undefined;
    });
    
    $("div.modal_content" ).on("click", ".md_taa_polya_save", function() {
        var modal_content_v=$(modal_form).find('.modal_content'),
            tr_v=$(modal_content_v).find('div#tab_taa_polya_value .d-tr[id!="after_append"]'),
            err_str='';
        //проверки        
        $(tr_v).each(function(i,elem) {
            if ($(elem).find('.in_taa_pol_sysname').val().trim()=='') {
                err_str+='В строке '+(i+1)+' не заполнено поле "Сис.имя"\n';
            }
            if ($(elem).find('.in_taa_pol_name').val().trim()=='') {
                err_str+='В строке '+(i+1)+' не заполнено поле "Наименование"\n';
            }
            if ($(elem).find('.in_taa_pol_sort').val().trim()=='') {
                err_str+='В строке '+(i+1)+' не заполнено поле "Порядок отображения"\n';
            }
            var  type_v=$(elem).find('.taa_pol_t_sel').val();
            if ((type_v=='db_dropbox') || (type_v=='db_in_modal')) { 
                if (type_v=='db_dropbox') {
                    if ($(elem).find('.taa_polya_sql_v').text().trim()=='') {
                        err_str+='В строке '+(i+1)+' не создан SQL-запрос\n';
                    }
                }
                else if (type_v=='db_in_modal') { 
                    if ($(elem).find('.taa_polya_structure_v').text().trim()=='') {
                        err_str+='В строке '+(i+1)+' не создана структура модального окна\n';
                    }
                }
            } 
        });
        if (err_str=='')  {  
            var id_t=$(this).attr('id'),
                gp=$(table_tag).find('div[id="group_tab"][olap_id="'+id_t+'"]'),
                md=$(gp).find('.masterdata[id="'+id_t+'"]'),
                mdc_v=$(modal_content_v).find('div.div_hidden.before_html'),
                mdc_v_c=$(mdc_v).clone(),
                tek_tr=$(mdc_v_c).find('div#tab_taa_value div.d-tr:eq('+$(this).attr('action_tr_index')+')');
            $(mdc_v).remove();
            $(tek_tr).find('div.taa_polya_v')
                 .html(LZString.compressToUTF16($(modal_content_v).html())); 
            /*if ($(tek_tr).is('.default')) {
                //если sql ещё не был сохранен, если этого не делать, потеряем                
                $(tek_tr).find('.taa_sql_v').html($(this).next().text());
            }*/
            pr_active_mod=$(md).find('a.action_set_table');
            $(modal_header).find('#modal_head_p').html('Редактирование действий для таблицы');
            $(modal_form).find('.modal_content').html($(mdc_v_c).html());                        
        }  
        else {
            alert(err_str);
        }
    });
    
    $("div.modal_content" ).on("click", ".a_taa_sql_edite", function() {
        var tek_id=$(modal_form).find('.tab_action_add_md_save').attr('id'),
            tr_index=$(this).closest('.d-tr').index(),
            tek_sql=LZString.decompressFromUTF16($(this).next().text());
        modal_tek_content=$(modal_form).find('.modal_content').clone();
        pr_active_mod=$(modal_tek_content).find('.a_taa_sql_edite');
        $(modal_header).find('#modal_head_p').html('Редактирование SQL-запроса доп.действия');
        $(modal_form).find('.modal_content').html('<a class="md_back" md_id="'+tek_id+'" title="Назад" id="taa_polya_sql_edite_back" style="display: inline;z-index: 500000;">\n\
                                    <img src="/img/Back.png" style="width:30px;height:auto;">\n\
                                 </a>\n\
                                 <div class="md_panel_sql_es">'+
                                        '<a class="md_taa_sql_edite_save" id="'+tek_id+'" pole_tr_index="'+tr_index+'" title="Сохранить запрос" style="z-index: 500000;">'+
                                            '<img src="/img/save.png" style="width:30px;height:auto;">'+
                                        '</a>'+
                                    '</div>').append(container);
        set_ace_edit('sql',$(pr_active_mod).attr('data-edit_ace-theme'),$(pr_active_mod).attr('data-edit_ace-size'),tek_sql);
        $(container).show();
    });
    
    $("div.modal_content" ).on("click", ".md_taa_sql_edite_save", function() {
        var tek_tr=$(modal_tek_content).find('div#tab_taa_value div.d-tr:eq('+$(this).attr('pole_tr_index')+')');
        $(tek_tr).find('div.taa_sql_v').html(LZString.compressToUTF16(editor.getValue()));
        $(tek_tr).find('div.taa_polya_v').empty();
        $(modal_form).find('.modal_content').html($(modal_tek_content).html());
        modal_tek_content=undefined;
    });        
    
    $('.no_panel').on('click', 'a.olap_tr_add,a.olap_tr_edit', function(e) {
        //формируем модальное окно из настроек
        pr_active_mod=$(this); 
        var params={};
        params['pr_ok']=true;
        $(this).trigger('before_open',params);
        if (params['pr_ok']) {
            var html_v=get_olap_taa_modal_html(pr_active_mod);
            if (html_v!='') {
                var txt_h='';
                if ($(pr_active_mod).hasClass('olap_tr_add')) {
                    txt_h='Добавление записи в БД';
                }
                else {
                    txt_h='Редактирование записи в БД';
                }
                $(modal_header).find('#modal_head_p').html(txt_h);
                $(modal_form).find('.modal_content').html(html_v);
                set_olap_params($(modal_form).find('.modal_content'));
                open_modal(e);
            }
        }    
        $(this).trigger('after_open',params);
    });
    
    $('.no_panel').on('click', 'a.olap_tr_delete', function(e) {
        pr_active_mod=$(this); 
        var params={},
            tr_action_index_v=$(pr_active_mod).attr('tr_action_index'),
            gp=$(this).closest('div#group_tab'),
            md=$(gp).find('.masterdata');
        params['pr_ok']=true;
        params['sql']=LZString.decompressFromUTF16($(md).find('div#tab_taa_value div.d-tr:eq('+tr_action_index_v+') div.taa_sql_v').text());       
        if (db_type=='ora') {
            params['code_in']='SQLexec';        
        }
        else if (db_type=='mssql') {  
            //для mssql выходные параметры муторное и ненужное дело, синтаксис позволяет делать проще, чем в oracle
            params['code_in']='getRowsDB_conn';
        }
        params['pr_ok']=true;
        params['err_txt']='';   
        $(this).trigger('before_delete',params);
        var data_type_v;
        if (db_type=='ora') {
            data_type_v='json';                          
        }
        else if (db_type=='mssql') {
            params['tsql']=params['sql'];
            params['is_editor']=7;        
            delete params['sql'];
            data_type_v='text';
            
            //необходимо дополнительно преобразовать параметры
            var params_r=param_create(params['tsql'],null,null,null,true),
                params_r_da=params_r['params_all'],
                params_in_v={};
            if ($(params_r_da).length>0) {
                for (var key in params_r_da) {
                    for (var key2 in params['params_val']) {
                        if ((':'+params_r_da[key])==key2) {
                            params_in_v[key]=params['params_val'][key2];
                            params['tsql']=params['tsql'].split(':'+params_r_da[key]).join('?');
                        }
                    }
                };
                params['params_val']=JSON.stringify(params_in_v);            
            }    
                
        }
        
        if (!params['pr_ok']) {
            if (params['err_txt']!='') {
                alert(params['err_txt']);
            }    
        }
        else {
            delete params['err_txt'];
            delete params['pr_ok'];
            $.ajax({
                type: "POST",
                url: "/get-data.php",
                data: params,
                dataType:data_type_v,
                success: function(data){  
                    //console.log(data);
                    if (db_type=='ora') {
                        if (data.ex_state!="Успех") {
                            console.log(data);
                            alert(data.ex_state);
                        }                          
                    }
                    else if (db_type=='mssql') {
                        if (data.indexOf('Что-то пошло не так')>-1) {
                            console.log(data);
                            alert(data);
                        }
                    }                    
                    $(pr_active_mod).trigger('after_delete',data);
                },
                error: function(xhr, status, error) {
                    alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                    console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                }
            });
        }            
    });
        
    $("div.modal_content" ).on("click", ".a_taa_polya_struct_edite", function() {
        var tek_id=$(modal_form).find('.md_taa_polya_save').attr('id'),
            tr_index=$(this).closest('.d-tr').index(),
            tek_struct=LZString.decompressFromUTF16($(this).next().text());
        if  (tek_struct===null)  {
            tek_struct=get_in_modal_md('taa_',tek_id)
        }
        pr_active_mod=$(this);
        modal_tek_content=[];
        modal_tek_content[0]=$(modal_form).find('.modal_content').clone();
        $(modal_form).find('.modal_content').html(tek_struct);
        $(modal_header).find('#modal_head_p').html('Редактирование структуры мод.окна доп.действия');
        var in_modal_md_v=$(modal_form).find('.in_modal_md').show();
        $(in_modal_md_v).find('.md_panel_es').prepend('<a class="md_back" md_id="'+tek_id+'" title="Назад" id="taa_polya_struct_edite_back" style="display: inline;z-index: 500000;">\n\
                                                        <img src="/img/Back.png" style="width:30px;height:auto;">\n\
                                                     </a>');
        $(in_modal_md_v).find('.taa_in_modal_md_save').attr('tr_index',tr_index);
        $(in_modal_md_v).find('.taa_in_modal_sql_edit').attr('md_id',tek_id)
    });
    
    $("div.modal_content" ).on("click", ".taa_in_modal_sql_edit", function() {
        var tek_id=$(modal_form).find('.md_taa_polya_save').attr('md_id'),
            tek_sql=$(modal_form).find('.in_mod_sql_value').text();
        modal_tek_content[1]=$(modal_form).find('.modal_content').clone();
        pr_active_mod=$(modal_tek_content[1]).find('.taa_in_modal_sql_edit');
        $(modal_header).find('#modal_head_p').html('Редактирование SQL-запроса для структуры мод.окна доп.действия');
        $(modal_form).find('.modal_content').html('<a class="md_back" md_id="'+tek_id+'" title="Назад" id="taa_polya_struct_sql_edite_back" style="display: inline;z-index: 500000;">\n\
                                    <img src="/img/Back.png" style="width:30px;height:auto;">\n\
                                 </a>\n\
                                 <div class="md_panel_sql_es">'+
                                        '<a class="taa_polya_struct_sql_edite_save" title="Сохранить запрос" style="z-index: 500000;">'+
                                            '<img src="/img/save.png" style="width:30px;height:auto;">'+
                                        '</a>'+
                                    '</div>').append(container);
        set_ace_edit('sql',$(pr_active_mod).attr('data-edit_ace-theme'),$(pr_active_mod).attr('data-edit_ace-size'),tek_sql);
        $(container).show();
    });
    
    $("div.modal_content" ).on("click", ".taa_polya_struct_sql_edite_save", function() {
        var md=$(modal_tek_content[1]).find('.in_modal_md'),
            id_t=$(md).attr('id');
        get_in_mod_struct_by_sql(id_t,md);
        $(modal_header).find('#modal_head_p').html('Редактирование структуры мод.окна доп.действия');
        modal_tek_content[1]=undefined;
    });
    
    $("div.modal_content" ).on("click", ".taa_in_modal_md_save", function() {
        var md_tek=$(this).closest('.in_modal_md'),
            tr=$(md_tek).find('.d-table[id="tab_pol"] .d-tr[id!="after_append"]');
        if ($(tr).length>0) {
            $(tr).each(function(i,elem) {
                var in_name=$(elem).find('.NAME input');
                $(in_name).attr('value',$(in_name).val());
                var checkbox=$(elem).find('.UNVISIBLE input');
                if ($(checkbox).prop('checked')) {
                    $(checkbox).attr('checked','');
                }
                else {
                    $(checkbox).removeAttr('checked');
                }
                var in_width=$(elem).find('.WIDTH input');
                $(in_width).attr('value',$(in_width).val());
            });
        }
        var tab_width=$(md_tek).find('.in_mod_div_tw input');
        $(tab_width).attr('value',$(tab_width).val());
        $(modal_tek_content[0]).find('div#tab_taa_polya_value .d-tr:eq('+$(this).attr('tr_index')+') .taa_polya_structure_v')
            .html(LZString.compressToUTF16($(modal_form).find('.modal_content').html()));
        $(modal_form).find('.modal_content').html($(modal_tek_content[0]).html());
        modal_tek_content=undefined;
    });
    
    $("div.modal_content" ).on("click", ".olap_taa_but_in_modal", function() {
        pr_active_mod=$(this);                
        var params={},
            md_id_v=$(this).closest('table.olap_taa_modal_mc').attr('md_id'),
            tr_action_index_v=$(this).attr('tr_action_index'),
            gp=$(table_tag).find('div#group_tab[olap_id="'+md_id_v+'"]'),
            md=$(gp).find('.masterdata'),
            polya_v=LZString.decompressFromUTF16($(md).find('div#tab_taa_value div.d-tr:eq('+tr_action_index_v+') div.taa_polya_v').text()),
            struct=LZString.decompressFromUTF16($(polya_v).find('div#tab_taa_polya_value .d-tr:eq('+$(this).attr('tr_action_polya_index')+') .taa_polya_structure_v').text());
        params['sql_true']=$(struct).find('div.in_mod_sql_value').text();
        params['code_in']='getRowsDiv_DB_conn';  
        $(modal_form).find('select.olap_taa_db_dropbox').multiselect('destroy');
        modal_tek_content=$(modal_form).find('.modal_content').clone();
        $(pr_active_mod).trigger('before_open',params);
        var width=window.innerWidth,
            height=window.innerHeight;
        $(loading_img).show().css({top:((height-$(loading_img).height())/2),left:((width-$(loading_img).width())/2)});
        $.ajax({
            type: "POST",
            url: "/get-data.php",
            data: params,
            success: function(html){
                $(modal_form).find('.modal_content').html('<a class="in_mod_tab_searche" id="'+md_id_v+'" title="Активировать поля поиска в таблице">🔍</a>\n\
                                                          <div class="tab_in_modal d-table" id="'+md_id_v+'" style="display: block;"></div>\n\
                                                          <button class="olap_taa_but_in_modal" style="display:none;"></button>');
                var tek_tab=$($(modal_form)).find('.tab_in_modal'),
                    str='<div class="thead d-tr">\n';
                $(tek_tab).attr('type_v',$(polya_v).find('.sel_taa_pol_type_fdb').val());    
                var struct2=$(struct).find('.d-table[id="tab_pol"] .d-tr[id!="after_append"]');
                $(struct2).each(function(i,elem) {
                    var s_name=$(elem).find('.SYSNAME').text().trim(),
                        width_v=$(elem).find('.WIDTH input').val().trim(),
                        name_val=$(elem).find('.NAME input').val().trim();
                    str+='  <div class="d-td'+
                                (($(elem).find('.UNVISIBLE input').prop('checked')) ? ' unvis"':'"')+
                                'id="'+s_name+'"'+
                                ((width_v!='') ? ' style="width:'+width_v+';"':'')+
                            '>'+
                                '<span><a class="in_mod_tab_sort_up" id="'+s_name+'" title="Отсортировать по возрастанию"><img src="/img/sort_up.png" style="width:7px;height:13px !important;"></a></span>'+
                                ((name_val!='') ? name_val:s_name)+
                                '<span><a class="in_mod_tab_sort_unup" id="'+s_name+'" title="Отсортировать по убыванию"><img src="/img/sort_up.png" style="width:7px;height:13px !important;"></a></span>'+
                            '</div>\n';            
                }); 
                str+='</div>\n';
                $(tek_tab).html(str);                                
                $(tek_tab).append(html);
                var t_width=$(struct).find('input.in_mod_tab_widh').val();
                if (t_width!='') {
                    $(tek_tab).css('width',t_width);
                }    
                $(tek_tab).find('.thead.d-tr .d-td.unvis').each(function(i,elem) {
                    $(tek_tab).find('.tbody.d-tr .d-td[id="'+$(elem).attr('id')+'"]').addClass('unvis');
                });
                $(modal_form).find('.olap_taa_but_in_modal').trigger('after_open');
                $(loading_img).hide();
            },
            error: function(xhr, status, error) {
                alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                console.log(xhr.responseText + '|\n' + status + '|\n' +error);
            }
        });
    });
    
    function olap_clear(id_t) {
        var tab_before=$(table_tag).find('td[olap_tab_id='+id_t+']'),mass_index_cols=[],mass_left_cols=[];
        $(table_all_tag).find('thead:first tr:last td:gt(0)').each(function(i,elem) {
            var tek_index=$(elem).index();
            mass_index_cols[tek_index]=$(elem).text();                
            mass_left_cols[$(elem).offset().left]=tek_index;
        });
        if ($(tab_before).length>0) {            
            $(tab_before).empty().each(function(i,elem) {
                td_recover(elem,false,mass_left_cols);
            });                
        }
    }        
    
    //перемнная опросника подгрузки страниц и переменная строк шапки для анализа возможной перерисовки по другому алгоритму (с дизайном/в чистом виде)
    var d2_load_page=[],
        rep_tab_tr_head;
    function create_tab(id_t,pr_export_xlsx) {
        if (!!!pr_export_xlsx) {
            pr_export_xlsx=false;
        }
        let params = new Object();
        var table_tag_v=$(table_tag),                
            gp=$(table_tag_v).find('div[id="group_tab"][olap_id="'+id_t+'"]'),
            md=$(gp).find('.masterdata[id="'+id_t+'"]'),            
            parend_td=$(gp).closest('td'),
            parend_tr=$(parend_td).closest('tr'),
            parend_td_mass_index=$(parend_td).attr('id').split('-'),
            //удаляем старые метки
            begin_tab_td=$(table_tag_v).find('td[begin_tab_td='+id_t+']').removeAttr('begin_tab_td');
        begin_tab_td=$(parend_td).closest('tr').next().find('#'+parend_td_mass_index[0]+'-'+(Number(parend_td_mass_index[1])+1));
        $(begin_tab_td).attr('begin_tab_td',id_t);
        params['code_in']='create_tab';
        //console.log('ura');
        
        var pr_2D=$(md).find('a.2D_3D').hasClass('2D');        
        
        params['tab_id']=id_t;
        params['sql_true']=LZString.decompressFromUTF16($(md).find('.sql_value[id="'+id_t+'"]').text());
        //console.log(params['sql_true']); 
        if (pr_2D) {
            params['pr_2D']=1;
        }
        
        //параметры отчета        
        var params_group=$(table_tag_v).find('div.params_group[id="'+id_t+'"]');
        var pr_norm_param=true,
            err_txt='';
        $(md).find('.in_param_req').each(function(i,elem) {
            var id_par=$(elem).attr('id');
            if ($(elem).prop('checked')) {
                var in_param_val=$(params_group).find('.in_param_val[id="'+id_par+'"]');
                if ($(in_param_val).length>0) {
                    if ($(in_param_val).val().length==0) {
                        pr_norm_param=false;
                        err_txt+='Не заполнен обязательный параметр "'+$(in_param_val).closest('.p_param').text()+'"\n';
                    }
                }
                else {
                    var olap_param_sql=$(params_group).find('.olap_param_sql[id="'+id_par+'"]');
                    if ($(olap_param_sql).length>0) {
                        if ($(olap_param_sql).val().length==0) {
                            pr_norm_param=false;
                            //вычисляем имя, т.к. не возможно получить текст только имени при обращении непосредственно к тегу
                            var name_par_one='';
                            var in_param_name=$(md).find('.in_param_name[id="'+id_par+'"]');
                            if ($(in_param_name).val()=='') {
                                name_par_one=id_par;
                            }
                            else {
                                name_par_one=$(in_param_name).val();
                            }
                            err_txt+='Не заполнен обязательный параметр "'+name_par_one+'"\n';
                        }
                    }
                }
            }
        });
        if (!pr_norm_param) {
            alert(err_txt);
            return; 
        }
        
        //console.log($('.olap_param_sql').val());
        var params_r=param_create(params['sql_true'],md,params_group),
            params_val=new Object();
        
        set_param_val_olap(params_group,params_r,params_val);
        
        //получаем массив параметров и их значений для не olap параметров-строк-чисел-дат
        if ($(params_r['params_unolap']).length>0) {
            for (var key in params_r['params_unolap']) {
                var par_un_olap_one=$(table_tag_v).find('.input_add[action_type][id="'+params_r['params_unolap'][key]+'"],.select_add[action_type][id="'+params_r['params_unolap'][key]+'"],.in_modal_add_val[action_type][id="'+params_r['params_unolap'][key]+'"]');
                if ($(par_un_olap_one).length===0) {
                    alert('Не правильно указан параметр "'+params_r['params_unolap'][key]+'"');
                    pr_norm_param=false;
                }
                else {
                    var par_un_olap_one_v=$(par_un_olap_one).val(),
                        par_un_olap_one_c=$(par_un_olap_one).closest('td').find('li.required_add[id="'+params_r['params_unolap'][key]+'"] input');
                    if (!Array.isArray(par_un_olap_one_v)) {
                        par_un_olap_one_v=String(par_un_olap_one_v).trim();
                    }
                    if (($(par_un_olap_one_c).prop('checked')) & (par_un_olap_one_v.length===0)) {
                        alert('Не заполнен обязательный параметр "'+params_r['params_unolap'][key]+'"');
                        pr_norm_param=false;
                    }
                    else {
                        if ($(par_un_olap_one).is('.input_add')) {
                            if (db_type=='mssql') {            
                                params_val[key]=par_un_olap_one_v;
                            }
                            else if (db_type=='ora'){
                                params_val[':'+params_r['params_unolap'][key]]=par_un_olap_one_v;
                            } 
                        }
                        else if ($(par_un_olap_one).is('.select_add')) {
                            if (Array.isArray(par_un_olap_one)) {
                                par_un_olap_one.forEach(function(item, index){
                                    if (db_type=='mssql') {            
                                        params_val[params_r_da[key]+'_'+index]=item;
                                    }
                                    else if (db_type=='ora'){
                                        params_val[':'+params_r_da[key]+'_'+index]=item;
                                    }
                                });
                            }
                            else {
                                if (db_type=='mssql') {            
                                    params_val[params_r_da[key]+'_0']=par_un_olap_one;
                                }
                                else if (db_type=='ora'){
                                    params_val[':'+params_r_da[key]+'_0']=par_un_olap_one;
                                }
                            }
                        }
                        else if ($(par_un_olap_one).is('.in_modal_add_val')) {
                            if (par_un_olap_one.length>0) {
                                if (par_un_olap_one.indexOf("','")>-1) {
                                    par_un_olap_one=par_un_olap_one.substr(1);
                                    par_un_olap_one=par_un_olap_one.slice(0,-1);
                                    par_un_olap_one=par_un_olap_one.split("','");                        
                                }
                                else {
                                    par_un_olap_one=par_un_olap_one.split(',');
                                }
                                par_un_olap_one.forEach(function(item, index){
                                    if (db_type=='mssql') {            
                                        params_val[params_r_da[key]+'_'+index]=item;
                                    }
                                    else if (db_type=='ora'){
                                        params_val[':'+params_r_da[key]+'_'+index]=item;
                                    }
                                });
                            }
                            else {
                                if (db_type=='mssql') {            
                                    params_val[params_r_da[key]+'_0']=par_un_olap_one;
                                }
                                else if (db_type=='ora'){
                                    params_val[':'+params_r_da[key]+'_0']=par_un_olap_one;
                                }
                            }
                        }
                    }
                }
            }
        }
        if (!pr_norm_param) {
            return; 
        }
        
        if ($(params_val).length>0) {
            params['params_val']=JSON.stringify(params_val);  
        }    
        
        //console.log(mass_par_sql);
                
        params['sql_true']=params_r['sql_true'];
        //console.log(params_r['sql_true']);
        params['mdata']=$(md).html();
        var tab_str=new Object();
        var pr_ok=true;
        if (($(md).find('.structure.d-table .d-table[id="tab_str"] .SYSNAME:not(.ITOGO_NAME)').length>0) & (!pr_2D)) {
            $(md).find('.structure.d-table .d-table[id="tab_str"] .SYSNAME:not(.ITOGO_NAME)').each(function(i,elem) {
                    tab_str[i]=new Object();
                    tab_str[i]['sysname']=$(elem).attr('id');
                    tab_str[i]['name']=$(elem).text();
                    tab_str[i]['type']=$(elem).attr('md_type');
                    tab_str[i]['precision']=$(elem).attr('md_precision');
                    tab_str[i]['scale']=$(elem).attr('md_scale');
                    tab_str[i]['nullable']=$(elem).attr('md_nullable');            
                });
        }
        else if (!pr_2D) {
            pr_ok=false;
            alert('Для "Полей строк" необходимо наличие не менее одного элемента');
        }        
        //console.log(tab_str);
        params['tab_str']=JSON.stringify(tab_str);
        //итоги 
        if ($(md).find('.structure.d-table .d-table[id="tab_str"] .ITOGO_NAME').length>0) {
            //console.log($(md).find('.d-table[id="tab_str"] .d-tr[id="_itogo_"]').prev());
            if ($(md).find('.structure.d-table .d-table[id="tab_str"] .d-tr[id="_itogo_"]').prev().find('.SYSNAME').length>0) {
                params['tab_str_itog_order']=1;
            }
            else {
                params['tab_str_itog_order']=2;
            }
            params['tab_str_itog_val']=$(md).find('.structure.d-table .d-table[id="tab_str"] .sel_itogo[id="'+id_t+'"]').val();
        }
        var tab_pok=new Object();
        $(md).find('.structure.d-table .d-table[id="tab_pok"] .SYSNAME').each(function(i,elem) {
            tab_pok[i]=new Object();
            tab_pok[i]['sysname']=$(elem).attr('id');
            tab_pok[i]['name']=$(elem).text();
            tab_pok[i]['type']=$(elem).attr('md_type');
            tab_pok[i]['precision']=$(elem).attr('md_precision');
            tab_pok[i]['scale']=$(elem).attr('md_scale');
            tab_pok[i]['nullable']=$(elem).attr('md_nullable');            
        });
        params['tab_pok']=JSON.stringify(tab_pok);
        var tab_val=new Object();
        if ($(md).find('.structure.d-table .d-table[id="tab_val"] .SYSNAME').length>0) {
            $(md).find('.structure.d-table .d-table[id="tab_val"] .SYSNAME').each(function(i,elem) {
                tab_val[i]=new Object();
                tab_val[i]['sysname']=$(elem).attr('id');
                tab_val[i]['name']=$(elem).text();
                tab_val[i]['type']=$(elem).attr('md_type');
                tab_val[i]['precision']=$(elem).attr('md_precision');
                tab_val[i]['scale']=$(elem).attr('md_scale');
                tab_val[i]['nullable']=$(elem).attr('md_nullable'); 
                tab_val[i]['aggr']=$(elem).next().find('select').val(); 
                //console.log(tab_val[i]['aggr']);
            });
        }
        else {
            pr_ok=false;
            alert('Для "Значений показателей" необходимо наличие не менее одного элемента');
        }
        params['tab_val']=JSON.stringify(tab_val);
        var tab_pol=new Object();
        $(md).find('.structure.d-table .d-table[id="tab_pol"] .SYSNAME').each(function(i,elem) {
            tab_pol[i]=new Object();
            tab_pol[i]['sysname']=$(elem).attr('id');
            tab_pol[i]['name']=$(elem).text();
            tab_pol[i]['type']=$(elem).attr('md_type');
            tab_pol[i]['precision']=$(elem).attr('md_precision');
            tab_pol[i]['scale']=$(elem).attr('md_scale');
            tab_pol[i]['nullable']=$(elem).attr('md_nullable');            
        });
        params['tab_pol']=JSON.stringify(tab_pol);
                
        
        if (pr_ok) { 
            params['in_rep_id']=$('input#in_rep_id').val();
            if (pr_export_xlsx) {
                var tab_before=$(table_tag_v).find('td[olap_tab_id='+id_t+']');
                if ($(tab_before).length===0) {
                    alert('Необходимо наличие сформированной структуры на странице');
                }
                else {
                    var time00 = performance.now();
                    var tab_tr=$(tab_before).closest('tr').filter(':first,:last,:eq(1)').clone(),
                        mass_name_pol={};
                    var mass_calc_xlsx=calc_xlsx(tab_tr,true);
                    $(tab_tr).first().find('td[olap_tab_id='+id_t+']').each(function(i,elem) {
                        mass_name_pol[$(elem).attr('olap_td_id')]=$(elem).text();
                    });
                    params['get_report']='report_blyuds';
                    params['real_name']='report';
                    params['mass_calc_xlsx']=JSON.stringify(mass_calc_xlsx);
                    params['mass_name_pol']=JSON.stringify(mass_name_pol);
                    var name_rep=$('#div_name_rep #in_name_rep');
                    if ($(name_rep).val().length>0) {
                        params['real_name']=$(name_rep).val();
                    }
                    var width=window.innerWidth,
                        height=window.innerHeight;
                    $(loading_img).show().css({top:((height-$(loading_img).height())/2),left:((width-$(loading_img).width())/2)});
                    $.ajax({
                        type: "POST",
                        url: "/imp_xlsx_olap.php",
                        data: params,
                        //dataType:'json',
                        success: function(data){ 
                            var hiddenFrame=$('.hiddenFrame');
                            if ($(hiddenFrame).length>0) {
                                $(hiddenFrame).remove();
                            }
                            
                            $(loading_img).hide();
                            var time2 = performance.now();
                            console.log('Выгрузка в .xlsx завершена. Общее время: '+secondstotime((time2-time00)/1000));
                            $('body').append('<iframe src="'+data+'" class="hiddenFrame"></iframe>');
                        },
                        error: function(xhr, status, error) {
                            alert('Ошибка получения данных. Возможно, истекло время сессии.'+xhr.responseText+ ' ' + status + ' ' +error);
                            console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                        }
                    });
                }
            }
            else {
            var tab_before,
                olap_design=$(table_tag_v).find('div.table_save_design_val[id='+id_t+']').text().trim(),
                pr_olap_design=false;
            if (olap_design=='') {
                tab_before=$(table_tag_v).find('td[olap_tab_id='+id_t+']');
                olap_design=$(tab_before).closest('tr');
            }
            else {
                pr_olap_design=true;
                olap_design=$(LZString.decompressFromUTF16(olap_design));
                tab_before=$(olap_design).find('td[olap_tab_id='+id_t+']');
            }
            var pr_tab_before=false,
                begin_tab_td_old=$(begin_tab_td).html();
            if ($(tab_before).length>0) {
                pr_tab_before=true;
                //save_tab_data(); делаем теперь всегда вконце для корректной работы плагина                            
            }
            $(begin_tab_td).html('<img src="/img/loading.gif" id="loading_'+id_t+'" width=250 height="auto">');            
            console.log(params);
            var time00 = performance.now();
            $(in_action_value).trigger('before_load_data'+id_t);
            //если страница есть, то есть блок страничный
            let page_panel=$(gp).find('div.page_panel');
            if (!!get_page) {
                params['get_page']=get_page;
                get_page=undefined;
                if ($(page_panel).find('img').length>0) {
                    //передаем максимальную страницу, если ещё не подгрузилось            
                    params['max_page']=$(page_panel).find('a.page_control[id!="next"]:last').text();
                }
            }  
            else {
                $(page_panel).remove();
                page_panel=undefined;
                d2_load_page[id_t]=undefined;
            }
            $.ajax({
                type: "POST",
                url: "/get-olap.php",
                data: params,
                dataType:'json',
                success: function(data){                                                        
                    console.log(data); 
                    //console.log(JSON.parse(data)); 
                    $(begin_tab_td).empty();
                    //$(gp).find('div.page_panel').remove();
                    if (!!!data.pr_null) {
                        if (!!data.mass_page) {
                            let tableDefPage_v=parseInt(data.tableDefPage);
                            //функция опроса загрузки страниц
                            function getStateLoadPages() {
                                d2_load_page[id_t]=true;
                                var pr_ajax_return=true;
                                var MyInt2= setInterval(function(){
                                    if (!!!d2_load_page[id_t]) {
                                        $(page_panel).find('img').remove();
                                        clearInterval (MyInt2);
                                    }
                                    else {
                                        if (pr_ajax_return) {
                                            var params2={};
                                            params2['in_rep_id']=params['in_rep_id'];
                                            params2['code_in']='getOLAP2DPages';
                                            page_panel=$(gp).find('div.page_panel');
                                            params2['max_page']=$(page_panel).find('a.page_control[id!="next"]:last').text();
                                            params2['tab_id']=id_t;
                                            pr_ajax_return=false;
                                            $.ajax({
                                                type: "POST",
                                                url: "/get-data.php",
                                                data: params2,
                                                dataType:'json',  
                                                success: function(html) {                    
                                                    console.log(html);
                                                    //если получили признак окончания, то обнуляем признак
                                                    if (!!!html['str_block']) {
                                                        d2_load_page[id_t]=undefined;
                                                    } 
                                                    var mass_page2=JSON.parse(html.mass_page);
                                                    var pc_last=$(page_panel).find('.page_control:last');
                                                    for (var key in mass_page2) {
                                                        $(pc_last).before('<a class="page_control" title="'+(tableDefPage_v*(parseInt(mass_page2[key])-1))+'-'+(tableDefPage_v*parseInt(mass_page2[key]))+'" id="'+mass_page2[key]+'">'+mass_page2[key]+'</a>');
                                                    }
                                                    pr_ajax_return=true;
                                                },
                                                error: function(xhr, status, error) {
                                                    d2_load_page[id_t]=undefined;
                                                    console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                                                }
                                            });
                                        }
                                    }
                                },1500);
                            }    
                            
                            var mass_page=JSON.parse(data.mass_page);
                            if ($(page_panel).length===0) {
                                $(gp).append('<div class="page_panel" id="'+id_t+'"><a class="page_control" id="prev"><<</a>\n\
                                                <a class="page_control" title="1-'+data.tableDefPage+'" id="1" pr_change="true">1</a>\n\
                                                <a class="page_control" id="next">>></a>\n\
                                                <img src="/img/loading.gif" id="p_loading_'+id_t+'" style="width:auto;height:30px">\n\
                                             </div>');
                                getStateLoadPages();
                            }
                            else {
                                //добавляем в конец возможные новые страницы
                                if (!!params['max_page']) {
                                    //если уже запущен в другом запросе то отправим признак остановки и подождем пока не остановится, признаком этого считаем наличие картинки загрузки
                                    var pc_last=$(page_panel).find('.page_control:last');
                                    if (!!d2_load_page[id_t]) {
                                        d2_load_page[id_t]=undefined;                                    
                                        var MyInt1= setInterval(function(){
                                            if ($(page_panel).find('img').length===0) {
                                                clearInterval (MyInt1);                                                
                                                for (var key in mass_page) {
                                                    $(pc_last).before('<a class="page_control" title="'+(tableDefPage_v*(parseInt(mass_page[key])-1))+'-'+(tableDefPage_v*parseInt(mass_page[key]))+'" id="'+mass_page[key]+'">id="'+mass_page[key]+'"</a>');
                                                }
                                                getStateLoadPages();
                                            }
                                        },500); 
                                    }                                        
                                }
                            }                            
                        }
                        if (!pr_olap_design) {
                            $(tab_before).filter('td[olap_td_class="td_str_val"],td[olap_td_class="td_val_val"]').empty();
                        }    
                        var data_tab_html_tr=$(data.tab_html).find('tr');
                        console.log('Обрабатывается '+$(data_tab_html_tr).length+' строк...');
                        var KByteLength_data_rep=Math.round(byteLength(data.tab_html)/1024);                        
                        console.log('Объём задействованной памяти, KБ: '+KByteLength_data_rep);                                                       
                        //если превышает лимит ты обрезаем строки пока не поместится, решено на уровне пагинации
                        var const_KB=6000;
                        if (KByteLength_data_rep>const_KB) {
                            alert('Возможны проблемы с работой браузера. Объем выводимой информации, KB: '+KByteLength_data_rep);
                        }
                        var pr_encore=true;
                        var pr_encore_this=false;  
                        var tab_before_olap,tab_before_olap_tr,tr_pok_null,tr_pok_name_first,tr_pok_name_all,tr_pok,tr_name_col,tr_tab_all,td_val_val_last,
                            td_val_val_last_border,tr_tab_last,td_pok_last_border,td_pok_name_all,td_pok_name_first,td_pok_first_border,tab_before_olap_tr_pok,
                            tr_tab_val_last,time0,tr_pok_td_last,td_val_name_first_border_left,tr_tab_str_val_last;
                        while (pr_encore) {
                            if ((!pr_tab_before) || (pr_encore_this)) {
                                var time = performance.now();
                                begin_tab_td=$(parend_td).closest('tr').next().find('#'+parend_td_mass_index[0]+'-'+(Number(parend_td_mass_index[1])+1));
                                var tek_tr=$(begin_tab_td).closest('tr');
                                var tek_td=begin_tab_td;
                                var count_tab_col=0;
                                $(data.tab_html).find('tr').each(function(i,elem) {
                                    var elem_td=$(elem).find('td');
                                    if ($(elem_td).length>count_tab_col) {
                                        count_tab_col=$(elem_td).length;
                                    }
                                }); 
                                var count_tab_row=$(data.tab_html).find('tr').length;
                                var thead=$(table_all_tag).find('thead:first tr:last td');
                                var thead_last_index=$(thead).last().index();
                                var count_dop_col=count_tab_col-thead_last_index+Number($(begin_tab_td).attr('id').split('-')[0]);
                                var ColWidth_mass=[];
                                for (var i = 1; i <= count_dop_col; i++) {
                                    ColWidth_mass.push(tab_obj.defaultColWidth[0]);
                                }
                                if (count_dop_col>0) {
                                    $ ('#my'). jexcel ('insertColumn', count_dop_col,{colWidths:ColWidth_mass,updSelection:false,in_end:true,not_log:true},(thead_last_index-1));                                  
                                }
                                $ ('#my'). jexcel ('insertRow', count_tab_row,($(tek_tr).index()),{updSelection:false,not_log:true});
                                tek_tr=$(parend_tr).next();
                                begin_tab_td=$(tek_tr).find('#'+parend_td_mass_index[0]+'-'+(Number(parend_td_mass_index[1])+1));                                
                                var begin_tab_tr=tek_tr;
                                tek_td=begin_tab_td;  
                               
                                if (pr_encore_this) {
                                    tr_pok_name_first=$(tab_before_olap_tr_pok).first();
                                    if ($(tr_pok_name_first).length>0) {
                                        $(tr_pok_name_first).find('td[olap_tab_id='+id_t+']').each(function(i,elem) {
                                            var mass_index=$(elem).attr('id').split('-');
                                            $(elem).attr('id',mass_index[0]).removeClass('c'+mass_index[0]+' r'+mass_index[1]);
                                        });
                                        td_pok_name_first=$(tr_pok_name_first).find('td[olap_tab_id='+id_t+']');
                                        var tab_before_olap_tr_pok_3=$(tab_before_olap_tr_pok).filter('tr[olap_tr_index_'+id_t+'="3"]');
                                        if ($(tab_before_olap_tr_pok_3).find('[olap_td_class="td_pok_name"]').length>0) {
                                            tr_pok_name_all=tab_before_olap_tr_pok_3;
                                        }
                                        else {
                                            tr_pok_name_all=tr_pok_name_first;
                                        } 
                                        $(tr_pok_name_all).find('td[olap_tab_id='+id_t+']').each(function(i,elem) {
                                            var mass_index=$(elem).attr('id').split('-');
                                            $(elem).attr('id',mass_index[0]).removeClass('c'+mass_index[0]+' r'+mass_index[1]);
                                        });
                                        td_pok_name_all=$(tr_pok_name_all).find('td[olap_tab_id='+id_t+']');
                                        
                                        tr_pok=$(tab_before_olap_tr_pok).last();
                                        $(tr_pok).find('td[olap_tab_id='+id_t+']').each(function(i,elem) {
                                            var mass_index=$(elem).attr('id').split('-');
                                            $(elem).attr('id',mass_index[0]).removeClass('c'+mass_index[0]+' r'+mass_index[1]);
                                        });
                                        td_pok_last_border=$(tr_pok).find('td[olap_tab_id='+id_t+']:last').css('border-right');
                                        if ($(tr_pok).find('td[olap_tab_id='+id_t+']').length>2) {                                                                                                                                    
                                            $(tr_pok).find('td[olap_tab_id='+id_t+']').last().remove(); 
                                        }    
                                        else {
                                            if ($(tr_pok).find('td[olap_tab_id='+id_t+']').length==2) {
                                                var td_pok_first_border_right=$(tr_pok).find('td[olap_tab_id='+id_t+']:first').css('border-right');
                                                if (td_pok_first_border_right!='') {
                                                    $(tr_pok).find('td[olap_tab_id='+id_t+']:last').css('border-right',td_pok_first_border_right);
                                                }
                                            }                                            
                                        }
                                        td_pok_first_border=$(tr_pok).find('td[olap_tab_id='+id_t+']:first').css('border-left');
                                        tr_pok_td_last=$(tr_pok).find('td[olap_tab_id='+id_t+']').last();
                                        //console.log($(tr_pok_td_last).css('border'));                                        
                                    } 
                                                                        
                                    var td_val_name=$(tr_name_col).find('td[olap_tab_id='+id_t+']');
                                    $(td_val_name).each(function(i,elem) {
                                        var mass_index=$(elem).attr('id').split('-');
                                        $(elem).attr('id',mass_index[0]).removeClass('c'+mass_index[0]+' r'+mass_index[1]);
                                    });
                                    td_val_name_first_border_left=$(td_val_name).first().css('border-left');                                    
                                    
                                    tr_tab_val_last=$(tr_tab_all).find('td[olap_tab_id='+id_t+'][olap_td_class="td_val_val"]:first').css('border-left','');
                                    tr_tab_str_val_last=$(tr_tab_all).find('td[olap_tab_id='+id_t+'][olap_td_class="td_str_val"]:first').css('border-left','');
                                    td_val_val_last_border=$(tr_tab_all).find('td[olap_tab_id='+id_t+']:last').css('border-right');                                                                                                                                               
                                } 
                                
                                var time2 = performance.now();
                                console.log('время подготовки данных: '+secondstotime((time2-time)/1000));
                                $(data_tab_html_tr).each(function(i,elem) { 
                                    var count_tab_col_dop=count_tab_col;
                                    var i2_wsp=-1
                                    var last_olap_class='';
                                    $(tek_tr).attr('olap_tr_class_'+id_t,elem.className)
                                        .attr('olap_tr_id_'+id_t,elem.id)
                                        .attr('olap_tr_index_'+id_t,i);
                                    if (pr_2D) {
                                        //для 2d режима возможно использование невидимых полей в атрибутах строки, для 3D пользуемся только "input type=hidden"
                                        var olap_unvis_v=$(elem).attr('olap_unvis_'+id_t);
                                        if (!!olap_unvis_v) {
                                            $(tek_tr).attr('olap_unvis_'+id_t,olap_unvis_v);
                                        }  
                                    }    
                                    $(elem).find('td').each(function(i2,elem2) {
                                        $(tek_td).attr('olap_td_class',elem2.className).html($(elem2).html()).attr('olap_td_id',elem2.id).attr('olap_tab_id',id_t).attr('colspan',$(elem2).attr('colspan')).attr('rowspan',$(elem2).attr('rowspan')).attr('olap_td_index',i2).attr('olap_tr_index',i);
                                        if (pr_encore_this) {                                    
                                            var td_before;
                                            var el_olap_class=elem2.className;
                                            if (el_olap_class=='td_val_val') {
                                                td_before=tr_tab_val_last;  
                                                $(tek_td).addClass($(td_before).attr("class")).attr('style',$(td_before).attr('style'));
                                            }                                               
                                            else if (el_olap_class=='td_str_val') {
                                                td_before=$(tr_tab_all).find('[olap_td_index="'+i2+'"][olap_tab_id='+id_t+']'); 
                                                if ($(td_before).attr('olap_td_class')!=el_olap_class) {
                                                    td_before=tr_tab_str_val_last; 
                                                }
                                                $(tek_td).addClass($(td_before).attr("class")).attr('style',$(td_before).attr('style'));
                                            }                                                                 
                                        }

                                        tek_td=$(tek_td).next(); 
                                        i2_wsp=i2;
                                        last_olap_class=elem2.className;
                                    });                                                                 

                                    //добавим недостающие индексы (может быть только в ячейках значений) пропущенных по причине отсутствия значений при построении набора данных
                                    //необходимо при повторном запуске                                
                                    if ((count_tab_col_dop-1-i2_wsp>0) & ($(tek_tr).find('td[olap_td_class="td_val_val"]').length>0) ) {
                                        if ((last_olap_class.indexOf('td_pok')>-1) || (last_olap_class.indexOf('td_pok_name')>-1)
                                             || (tek_tr===begin_tab_tr)) {
                                            count_tab_col_dop-=$(begin_tab_td).attr('colspan')+1; 
                                        }
                                        for (var id = (i2_wsp+1); id <= (count_tab_col_dop-1); id++) {
                                            $(tek_td).attr('olap_td_class','td_val_val').attr('olap_tab_id',id_t).attr('colspan','1').attr('rowspan','1').attr('olap_td_index',id).attr('olap_tr_index',i);
                                            if (pr_encore_this) {                                    
                                                $(tek_td).addClass($(tr_tab_val_last).attr("class")).attr('style',$(tr_tab_val_last).attr('style'));                                                                                                                   
                                            }
                                            tek_td=$(tek_td).next();
                                        }
                                    } 
                                    
                                    var tek_tds;
                                    if ((pr_encore_this) & (!!td_val_val_last_border) & ($(tek_tr).attr('olap_tr_class_'+id_t)=='tr_tab')) {
                                        tek_tds=$(tek_tr).find('td[olap_tab_id='+id_t+']');
                                        $(tek_tds).last().css('border-right',td_val_val_last_border);
                                    }   
                                    if ((pr_encore_this) & ($(tek_tr).attr('olap_tr_class_'+id_t)=='tr_tab') & (!!td_val_name_first_border_left)) {
                                        if (!!!tek_tds) {
                                            tek_tds=$(tek_tr).find('td[olap_tab_id='+id_t+']');
                                        }
                                        $(tek_tds).first().css('border-left',td_val_name_first_border_left);
                                    }

                                    tek_tr=$(tek_tr).next();
                                    tek_td=$(tek_tr).find('[id^="'+parend_td_mass_index[0]+'-"]');                                    
                                }); 
                                
                                var time3 = performance.now();
                                console.log('время заполнения данными: '+secondstotime((time3-time2)/1000));
                                
                                var rep_tab=$(table_tag_v).find('td[olap_tab_id='+id_t+']');
                                var rep_tab_tr=$(rep_tab).closest('tr');
                                //в любом случае запоминаем шапку, чтобы использовать в lite режиме для установки возможного признака перестроения
                                rep_tab_tr_head=$(rep_tab_tr).filter('[olap_tr_class_'+id_t+'="tr_pok"],[olap_tr_class_'+id_t+'="tr_name_col"]');
                                //шапка в чистом виде (без дизайна, только разметка)
                                data_tab_tr_head=$(data_tab_html_tr).filter('tr.tr_pok,tr.tr_name_col');
                                var pr_null_all=false;                                    
                                if (!pr_2D) {
                                    //убираем "дыры" (ввести параметр надобности)
                                    var md_tab_val_length=$(md).find('.structure.d-table .d-table[id="tab_val"] .SYSNAME').length;
                                    if ($(md).find('.structure.d-table .d-table[id="tab_pok"] .SYSNAME').length>0) {
                                        $(rep_tab_tr).filter('[olap_tr_class_'+id_t+'="tr_pok"]:last').find('[olap_td_class="td_pok"]').each(function(i,elem) {
                                                var pr_null=true;
                                                var index_beg=$(begin_tab_td).index()+$(md).find('.structure.d-table .d-table[id="tab_str"] .SYSNAME').length+($(elem).index()-$(begin_tab_td).index())*$(md).find('.structure.d-table .d-table[id="tab_val"] .SYSNAME').length;
                                                $(rep_tab_tr).filter('[olap_tr_class_'+id_t+'="tr_tab"]').each(function(i2,elem2) {
                                                    for (var i = index_beg; i < (index_beg+$(md).find('.structure.d-table .d-table[id="tab_val"] .SYSNAME').length); i++) {
                                                        var elem_dyr=$(elem2).find('td:eq('+i+')')
                                                        if ($(elem_dyr).length>0) {
                                                            var html_v_dyr=$(elem_dyr).html();                                                        
                                                            if ((html_v_dyr).trim()!=='') {
                                                                pr_null=false;
                                                                pr_null_all=true;
                                                                return false;  
                                                            }
                                                        }
                                                        else {
                                                            pr_null=false;
                                                            pr_null_all=true;
                                                            return false;  
                                                        }
                                                    }                              
                                                });
                                                if (pr_null) {
                                                    for (var i = index_beg; i < (index_beg+md_tab_val_length); i++) {
                                                        $(rep_tab_tr).filter('[olap_tr_class_'+id_t+'="tr_name_col"]').find('td:eq('+index_beg+')').remove();                                                                                                                         
                                                    } 
                                                    $(rep_tab_tr).filter('tr[olap_tr_class_'+id_t+'="tr_pok"]:not(tr[olap_tr_class_'+id_t+'="null"])').each(function(i2,elem2) {
                                                        if ($(elem2).find('[olap_td_class="td_pok_name"]').length>0) {
                                                            $(elem2).find('[olap_td_class="td_pok_name"]').attr('colspan',(+$(elem2).find('[olap_td_class="td_pok_name"]').attr('colspan')-md_tab_val_length));
                                                        }
                                                        else { 
                                                            if ($(elem).attr('olap_tr_id_'+id_t)!=$(elem2).attr('olap_tr_id_'+id_t)) {
                                                                var index_p=$(begin_tab_td).index();
                                                                var elem_save;
                                                                $(elem2).find('td[olap_td_class="td_pok"][olap_tab_id='+id_t+']').each(function(i21,elem211) {
                                                                    index_p+=+$(elem211).attr('colspan')/md_tab_val_length;
                                                                    if (index_p>=($(elem).index()+1)) {
                                                                        elem_save=$(elem211);
                                                                        return false;
                                                                    }                                                                                                                                                                                                              
                                                                });
                                                                if ($(elem_save).length>0) {
                                                                    $(elem_save).attr('colspan',(+$(elem_save).attr('colspan')-md_tab_val_length)); 
                                                                }
                                                            }
                                                        }
                                                    });
                                                    $(rep_tab_tr).filter('[olap_tr_class_'+id_t+'="tr_tab"]').each(function(i2,elem2) {
                                                        for (var i = index_beg; i < (index_beg+md_tab_val_length); i++) {
                                                            $(elem2).find('td:eq('+index_beg+')').remove();

                                                        }                                                                                                             
                                                    });
                                                    $(elem).remove();                                          
                                                }
                                        });

                                    }
                                }    
                                
                                var time4 = performance.now();
                                console.log('время проверки/удаления пустот: '+secondstotime((time4-time3)/1000));
                                
                                if (!pr_encore_this) {
                                    //выделяем итоги
                                    $(rep_tab_tr).filter('[olap_tr_class_'+id_t+'="tr_itog"]').find('td[olap_tab_id='+id_t+']').addClass('font_bold').each(function(i,elem) {
                                        var font_size=parseInt($(elem).css('font-size'))+1;
                                        if (!!!font_size) {
                                            font_size=13;
                                        }
                                        $(elem).css('font-size',(font_size+'px'));
                                    }); 
                                }    

                                //восстанавливаем классы индексов
                                if ((pr_null_all) || (pr_2D) || ($(rep_tab_tr).filter('[olap_tr_class_'+id_t+'="tr_pok"]').length===0)) {
                                    olap_index_recalc(id_t);
                                }
                                else {
                                    olap_index_recalc(id_t,true);
                                }
                                
                                var time5 = performance.now();
                                console.log('время пересчета индексов: '+secondstotime((time5-time4)/1000));

                                if (pr_encore_this) {
                                    //наименования полей показателей 
                                    if (($(td_pok_name_first).length>0) & ($(rep_tab_tr_head).first().find('td[olap_td_class="td_pok_name"][olap_tab_id='+id_t+']').length>0)) {
                                        $(rep_tab_tr_head).first().find('td[olap_td_class="td_pok_name"][olap_tab_id='+id_t+']').addClass($(td_pok_name_first).attr("class")).attr('style',$(td_pok_name_first).attr('style')); 
                                        $(rep_tab_tr_head).find('[olap_td_class="td_pok_name"]').closest('tr').filter(':not(:first)').each(function(i,elem) {
                                            $(elem).find('[olap_td_class="td_pok_name"]').each(function(i2,elem2) {
                                                var tek_td_before=$(tab_before_olap_tr_pok).find('td[olap_td_class="td_pok_name"][olap_td_index="'+$(elem2).attr('olap_td_index')+'"][olap_tr_index="'+$(elem2).attr('olap_tr_index')+'"]');
                                                if ($(tek_td_before).length===0) {
                                                    tek_td_before=td_pok_name_all;
                                                }                                                
                                                $(elem2).addClass($(tek_td_before).attr("class")).attr('style',$(tek_td_before).attr('style'));
                                            });
                                        });
                                    }                                        
                                    
                                    //наименования показателей
                                    $(rep_tab_tr_head).find('[olap_td_class="td_pok"]').closest('tr').each(function(i,elem) {
                                        var tek_td_before_last_index=$(tab_before_olap_tr_pok).find('td[olap_td_class="td_pok"][olap_tr_index="'+$(elem).attr('olap_tr_index_'+id_t)+'"]:last').attr('olap_td_index'),
                                            elem_last_index=$(elem).find('td[olap_td_class="td_pok"]:last').attr('olap_td_index');
                                        $(elem).find('[olap_td_class="td_pok"]').each(function(i2,elem2) {
                                            var tek_td_before;
                                            if ((tek_td_before_last_index<elem_last_index) & ($(elem2).attr('olap_td_index')==tek_td_before_last_index)) {
                                                tek_td_before=tr_pok_td_last;
                                            }
                                            else {
                                                tek_td_before=$(tab_before_olap_tr_pok).find('td[olap_td_class="td_pok"][olap_td_index="'+$(elem2).attr('olap_td_index')+'"][olap_tr_index="'+$(elem2).attr('olap_tr_index')+'"]');
                                                if ($(tek_td_before).length===0) {
                                                    tek_td_before=tr_pok_td_last;
                                                }                                                
                                            }
                                            $(elem2).addClass($(tek_td_before).attr("class")).attr('style',$(tek_td_before).attr('style'));
                                        });
                                        if (td_pok_last_border) {
                                            $(elem).find('td[olap_tab_id='+id_t+']:last').css('border-right',td_pok_last_border);
                                        }    
                                        if (td_pok_first_border) {
                                            $(elem).find('td[olap_tab_id='+id_t+']:first').css('border-left',td_pok_first_border);
                                        }                                            
                                    });                                                                        
                                    
                                    one_str_design(id_t,rep_tab_tr,tr_name_col,'td_str_name','td_val_name');                                                                                                          
                                                                        
                                    tr_tab_last=$(tab_before_olap_tr).filter('[olap_tr_class_'+id_t+'="tr_tab"]').last();                                
                                    if ($(tr_tab_last).length>0) {
                                        one_str_design(id_t,rep_tab_tr,tr_tab_last,'td_str_val','td_val_val');                                                                     
                                    }
                                    
                                    var tr_itog=$(tab_before_olap_tr).filter('[olap_tr_class_'+id_t+'="tr_itog"]').last();                                                                        
                                    if ($(tr_itog).length>0) {
                                        one_str_design(id_t,rep_tab_tr,tr_itog,'td_str_itog','td_val_itog');                                                                       
                                    }   
                                    
                                }
                                
                                
                                //если не 2D и благоприятный дизайн (из него удобно перестраивать)                               
                                var td_pok_length=$(rep_tab_tr_head).filter('[olap_tr_class_'+id_t+'="tr_pok"]').last().find('td[olap_td_class="td_pok"]').length,
                                    td_str_name_v=$(rep_tab_tr_head).last().find('td[olap_tab_id='+id_t+']'),
                                    td_str_name_length=$(td_str_name_v).length;
                                if ((!pr_2D) & (pr_olap_design) 
                                     & ($(olap_design).filter('tr[olap_tr_class_'+id_t+'="tr_name_col"]').last().find('td[olap_tab_id='+id_t+']').length!=td_str_name_length)
                                     & (td_pok_length>1)
                                     & ($(td_str_name_v).filter('[olap_td_class="td_str_name"]').length>1)
                                     & ($(data_tab_html_tr).filter('tr.tr_tab').length>1)
                                    ) {                                
                                    var tr_olap=$(table_tag_v).find('tr[olap_tr_class_'+id_t+']').clone(),
                                        html_v_design='';
                                    if ($(tr_olap).length>0) { 
                                        $(tr_olap).filter('tr[olap_tr_class_'+id_t+'="tr_tab"]').find('td').empty();                
                                        $(tr_olap).each(function(i,elem) {  
                                            html_v_design+=elem.outerHTML;
                                        });
                                        $(table_tag_v).find('div.table_save_design_val[id="'+id_t+'"]').html(LZString.compressToUTF16(html_v_design));
                                    }                                    
                                }
                                
                                var time6 = performance.now();
                                console.log('время дорисовки стилей: '+secondstotime((time6-time5)/1000));                                
                                console.log('время общее 1: '+secondstotime((time6-time)/1000));
                                if (!!time0) {
                                    console.log('время общее: '+secondstotime((time6-time0)/1000));
                                }
                                console.log('время общее с SQL: '+secondstotime((time6-time00)/1000));
                                save_tab_data();
                                var time_save = performance.now();
                                console.log('время общее c сохранением данных для jexcel: '+secondstotime((time_save-time00)/1000));
                                pr_encore=false;
                                $(in_action_value).trigger('after_load_data'+id_t);
                            }
                            else {
                                time0 = performance.now();
                                var rep_tab=tab_before;
                                //если 2D-режим и разное (кол-во полей или разные поля) и мастердата загружается из репозитория, то надо перестроить
                                var rep_tab_tr;
                                if (!pr_olap_design) {
                                    rep_tab_tr=$(rep_tab).closest('tr');
                                }
                                else {
                                    rep_tab_tr=olap_design;
                                }
                                if ($(rep_tab_tr_head).length===0) {
                                    rep_tab_tr_head=$(rep_tab_tr).filter('[olap_tr_class_'+id_t+'="tr_pok"],[olap_tr_class_'+id_t+'="tr_name_col"]');
                                }
                                var data_tab_tr_head_tek=$(data_tab_html_tr).filter('tr.tr_pok,tr.tr_name_col');
                                if ((pr_2D) & (!!($(md).attr('mdr_class')))) {
                                    var td_first_old=$(rep_tab_tr).first().find('td[olap_tab_id='+id_t+']'),
                                        td_first_new=$(data_tab_html_tr).first().find('td');  
                                    if ($(td_first_old).length===$(td_first_new).length) {
                                        var td_first_new_tek=$(td_first_new).first();
                                        $(td_first_old).each(function(i,elem) {
                                            if ($(elem).attr('olap_td_id')!=$(td_first_new_tek).attr('id')) {
                                                pr_encore_this=true;
                                                return false;
                                            }
                                            td_first_new_tek=$(td_first_new_tek).next();
                                        });
                                    }
                                    else {
                                        pr_encore_this=true;
                                    }    
                                }
                                else if ((!pr_2D) & 
                                         ($(rep_tab_tr_head).last().find('td[olap_tab_id='+id_t+']').length!=
                                         $(data_tab_tr_head_tek).filter('tr.tr_name_col').last().find('td').length)
                                        ) {
                                    //если не 2Д и кол-во наименований показателей разное, то анализируем шапки сначала, если есть
                                    //кол-во анализируемое полей может расходиться по причине наличия алгоритма удаления "дыр"
                                    if ($(data_tab_tr_head).length>0) {
                                        if ($(data_tab_tr_head).length===$(data_tab_tr_head_tek).length) {
                                            var tek_h_tr=$(data_tab_tr_head_tek).first();
                                            $(data_tab_tr_head).each(function(i,elem) {
                                                var el_td=$(elem).find('td'),
                                                    el_td_tek=$(tek_h_tr).find('td');
                                                if ($(el_td).length===$(el_td_tek).length) {
                                                    var el_td_tek_one=$(el_td_tek).first();
                                                    $(el_td).each(function(i2,elem2) {
                                                        if (($(elem2).attr('class')!=$(el_td_tek_one).attr('class'))
                                                            || ($(elem2).html()!=$(el_td_tek_one).html())){
                                                            pr_encore_this=true;
                                                            return false;
                                                        }                                                        
                                                        el_td_tek_one=$(el_td_tek_one).next();
                                                    });
                                                }
                                                else {
                                                    pr_encore_this=true;
                                                    return false;
                                                }    
                                                    
                                                tek_h_tr=$(tek_h_tr).next();
                                            });
                                        }
                                        else {
                                            pr_encore_this=true;
                                        }
                                    }
                                    else {
                                        pr_encore_this=true;
                                    }    
                                }
                                
                                var pr_end=false,tr_index_beg_del;
                                tab_before_olap=tab_before;                                
                                //кэшируем строки из которых возможно будем брать классы и стили оформления, необходимо только несколько вариантов в соответствии со структурой
                                tab_before_olap_tr=$(rep_tab_tr).clone();
                                tab_before_olap_tr_pok=$(tab_before_olap_tr).filter('[olap_tr_class_'+id_t+'="tr_pok"]');
                                
                                tr_name_col=$(tab_before_olap_tr).filter('[olap_tr_class_'+id_t+'="tr_name_col"]');                                

                                var tr_tab_all_all=$(tab_before_olap_tr).filter('[olap_tr_class_'+id_t+'="tr_tab"]');
                                tr_tab_all=$(tr_tab_all_all).first();
                                td_val_val_last=$(tr_tab_all).find('td[olap_tab_id='+id_t+']:last');                                                              

                                $(tr_tab_all).find('td[olap_tab_id='+id_t+']').each(function(i,elem) {
                                    var mass_index=$(elem).attr('id').split('-');
                                    $(elem).attr('id',mass_index[0]).removeClass('c'+mass_index[0]+' r'+mass_index[1]);
                                });                                                               

                                //также используется просто в качестве последней строки
                                var tr_itog=$(tab_before_olap_tr).last().clone(),
                                    pr_true_itog=false;
                                $(tr_itog).find('td[olap_tab_id='+id_t+']').each(function(i,elem) {
                                    var mass_index=$(elem).attr('id').split('-');
                                    $(elem).attr('id',mass_index[0]).removeClass('c'+mass_index[0]+' r'+mass_index[1]); 
                                    if (($(elem).hasClass('td_str_itog')) || ($(elem).hasClass('td_val_itog'))) {
                                        pr_true_itog=true;
                                    }    
                                });                                                                
                                if (($(tr_tab_all_all).length==1) & (!pr_true_itog)) {
                                    //если в образцовой таблице только одна строка и нету итогов то меняем нижнюю рамку на дефолтную, так как она может соответствовать рамке всей таблицы                                        
                                    $(tr_tab_all).find('td[olap_tab_id='+id_t+']').each(function(i,elem) {
                                        if ($(elem).css('border-bottom')!='') {
                                            $(elem).css('border-bottom','1px solid '+$(elem).css('border-bottom-color'));
                                        }                                    
                                    }); 
                                }       

                                var tab_before_olap_tr_true=$(table_tag_v).find('tr[olap_tr_class_'+id_t+']'),
                                    tr_olap_last_index=$(tab_before_olap_tr_true).last().find('td[olap_tab_id='+id_t+']:last').attr('olap_tr_index');

                                var tek_tr=$(begin_tab_td).closest('tr');
                                tek_td=begin_tab_td;
                                var pr_insert=false,
                                    pr_del=false;
                                if (!pr_encore_this) {
                                    //добавляем/удаляем строки если есть разница                                                                
                                    if  ($(tab_before_olap_tr_true).length<$(data_tab_html_tr).length) {
                                        pr_insert=true;
                                        var index_insert;
                                        if ($(tab_before_olap_tr_true).length>0) {
                                            index_insert=$(tab_before_olap_tr_true).last().index()+1;
                                        }
                                        else {
                                            index_insert=$(tek_tr).index()+1;
                                        }
                                        $('#my').jexcel('insertRow',($(data_tab_html_tr).length-$(tab_before_olap_tr_true).length),index_insert,{updSelection:false,not_log:true});
                                        index_recalc_true($(table_tag_v).find('tr:eq('+(index_insert+$(data_tab_html_tr).length-$(tab_before_olap_tr_true).length)+')'));
                                    }    
                                    else if ($(tab_before_olap_tr_true).length>$(data_tab_html_tr).length) {
                                        pr_del=true;
                                        $('#my').jexcel('deleteRow',($(tab_before_olap_tr_true).last().index()+1-$(tab_before_olap_tr_true).length+$(data_tab_html_tr).length) ,($(tab_before_olap_tr_true).length-$(data_tab_html_tr).length),{not_log:true});
                                    }    
                                }    
                                //var tr_tab_all_length=$(tr_name_col).find('td[olap_tab_id='+id_t+']').length;
                                var tr_tab_all_length=$(tab_before_olap_tr_true).filter('[olap_tr_class_'+id_t+'="tr_name_col"]').find('td[olap_tab_id='+id_t+']').length;

                                var time2 = performance.now();
                                console.log('время подготовки данных lite: '+secondstotime((time2-time0)/1000));
                                if (!pr_encore_this) {
                                    $(data_tab_html_tr).each(function(i,elem) { 
                                        if (pr_2D) {
                                            //для 2d режима возможно использование невидимых полей в атрибутах строки, для 3D пользуемся только "input type=hidden"
                                            var olap_unvis_v=$(elem).attr('olap_unvis_'+id_t);
                                            if (!!olap_unvis_v) {
                                                $(tek_tr).attr('olap_unvis_'+id_t,olap_unvis_v);
                                            }  
                                        }                                        
                                        var pr_insert_new=false;
                                        $(elem).find('td').each(function(i2,elem2) {
                                            //если удалили строки, нет итогов и текщая ячейка td_val_val или td_str_val, то надо просто заполнить ячейку
                                            if ((($(elem2).hasClass('td_val_val')) || ($(elem2).hasClass('td_str_val')))
                                                 & (pr_del) & (!pr_true_itog)
                                                ) {
                                                tek_td=$(tek_tr).find('td[olap_tab_id='+id_t+'][olap_td_index="'+i2+'"]');                                        
                                                $(tek_td).html($(elem2).html());
                                            }
                                            else { 
                                                tek_td=$(tek_tr).find('td[olap_tab_id='+id_t+'][olap_td_index="'+i2+'"][olap_tr_index="'+i+'"]');                                        
                                                if ($(tek_td).length>0) {
                                                    //если шапка, то должны совпадать значения , иначе будем строить по-другому
                                                    if (!pr_2D) {
                                                        if ($(tek_td).attr('olap_td_class').indexOf('td_pok')>-1) {
                                                            var tek_td_pok=$(rep_tab_tr_head).find('td[olap_td_index="'+i2+'"][olap_tr_index="'+i+'"]');
                                                            if (String($(tek_td_pok).html())!==String($(elem2).html())) {
                                                                pr_encore_this=true;
                                                                return false;
                                                            }                                                        
                                                        }   
                                                    }  

                                                    $(tek_td).html($(elem2).html());   
                                                    var mass_index=$(tek_td).attr('id').split('-'),
                                                        tek_tr_index2=mass_index[1],
                                                        tek_td_index2=mass_index[0];                                    
                                                    //если новая таблица короче и в ней есть итоги
                                                    if ((($(elem2).hasClass('td_str_itog')) || ($(elem2).hasClass('td_val_itog'))) 
                                                         & ($(tek_td).attr('olap_td_class').indexOf('td_str_itog')==-1) & ($(tek_td).attr('olap_td_class').indexOf('td_val_itog')==-1)) {
                                                        var tek_td_clon=$(tr_itog).find('#'+tek_td_index2).clone();
                                                        $(tek_td).removeClass().addClass($(tek_td_clon).attr("class")).attr('style',$(tek_td_clon).attr('style'))
                                                                .attr('olap_td_class',elem2.className).addClass('c'+tek_td_index2+' r'+tek_tr_index2);
                                                        pr_end=true; 
                                                        tr_index_beg_del=tek_tr_index2;
                                                    } 
                                                    else if ((($(elem2).hasClass('td_val_val')) || ($(elem2).hasClass('td_str_val'))) 
                                                         & (($(tek_td).attr('olap_td_class').indexOf('td_str_itog')>-1) || ($(tek_td).attr('olap_td_class').indexOf('td_val_itog')>-1))) {
                                                        //если новая таблица длиннее, то надо удалить форматирование итогов когда они встретятся 
                                                        var mass_index=$(tek_td).attr('id').split('-');
                                                        var tek_tr_index2=mass_index[1];
                                                        var tek_td_index2=mass_index[0];  
                                                        var tek_td_clon=$(tr_tab_all).find('#'+tek_td_index2).clone();
                                                        $(tek_td).removeClass().addClass($(tek_td_clon).attr("class")).removeAttr('style').attr('style',$(tek_td_clon).attr('style')).addClass('c'+tek_td_index2+' r'+tek_tr_index2)
                                                                .attr('olap_td_class',elem2.className).attr('olap_td_id',elem2.id).attr('olap_td_index',i2).attr('olap_tr_index',i);
                                                        pr_insert_new=true;
                                                    }
                                                    else if ((pr_insert) & (!pr_true_itog) & (tr_olap_last_index==i)) {
                                                        //если вставили строки и нет итогов, то когда встретится последняя строка, то надо взять стили и класы из первой строки
                                                        var mass_index=$(tek_td).attr('id').split('-');
                                                        var tek_tr_index2=mass_index[1];
                                                        var tek_td_index2=mass_index[0];  
                                                        var tek_td_clon=$(tr_tab_all).find('#'+tek_td_index2).clone();
                                                        $(tek_td).removeClass().addClass($(tek_td_clon).attr("class")).removeAttr('style').attr('style',$(tek_td_clon).attr('style')).addClass('c'+tek_td_index2+' r'+tek_tr_index2)
                                                                .attr('olap_td_class',elem2.className).attr('olap_td_id',elem2.id).attr('olap_td_index',i2).attr('olap_tr_index',i);                                                    
                                                    }                                                                                                              

                                                }
                                                //смотрим это отсутствующая строка или столбец, если столбец, то строим по-другому
                                                else if (($(elem2).hasClass('td_val_val')) || ($(elem2).hasClass('td_str_val'))
                                                         || ($(elem2).hasClass('td_str_itog')) || ($(elem2).hasClass('td_val_itog'))) {
                                                    var tek_td_before; 
                                                    if (($(elem2).hasClass('td_val_val')) || ($(elem2).hasClass('td_str_val'))) {
                                                        tek_td_before=$(tr_tab_all).find('[olap_td_index="'+i2+'"]');
                                                    }   
                                                    else {
                                                        tek_td_before=$(tr_itog).find('[olap_td_index="'+i2+'"]'); 
                                                    }
                                                    //если существует такой слобец, то нам надо записывать в сл. строку с её предворительным добавлением
                                                    if ($(tek_td_before).length>0) {
                                                        tek_td=$(tek_tr).find('td[id^="'+$(tek_td_before).attr('id')+'-"]');
                                                        if (!pr_insert_new) {
                                                            $(tek_tr).attr('olap_tr_class_'+id_t,elem.className).attr('olap_tr_id_'+id_t,elem.id).attr('olap_tr_index_'+id_t,i);
                                                            if ($(tek_tr).find('td[olap_tab_id='+id_t+'][olap_tr_index="'+i+'"]').length==0) {                                                        
                                                                pr_insert_new=true;
                                                            }    
                                                        }  
                                                        $(tek_td).html($(elem2).html()).addClass($(tek_td_before).attr("class")).attr('style',$(tek_td_before).attr('style'))
                                                            .attr('olap_td_class',elem2.className).attr('olap_td_id',elem2.id).attr('olap_tab_id',id_t).attr('colspan',$(elem2).attr('colspan')).attr('rowspan',$(elem2).attr('rowspan')).attr('olap_td_index',i2).attr('olap_tr_index',i);
                                                    }
                                                    else if ($(elem2).html().trim()!=''){   
                                                        pr_encore_this=true;
                                                        return false;
                                                    }
                                                }
                                                else if ((($(elem2).hasClass('td_pok_name')) || ($(elem2).hasClass('td_pok'))
                                                         || ($(elem2).hasClass('td_str_name')) || ($(elem2).hasClass('td_val_name'))
                                                         || ($(elem2).hasClass('null')))
                                                         & pr_olap_design & ($(data_tab_tr_head).length===0)){
                                                    //если отсутствуют ячейки, то это возможно первый запуск после сохранения, надо посмотреть в структуре дизайна наличие строк и ячейки, если все совпадает то, ок
                                                    //нет перестраиваем
                                                    //но только в случае отсутствия переменной шапки, т.к. по ней мы точно проверяем и знаем что 100% все гуд                                                    
                                                    var tek_td_before;
                                                    if (($(elem2).hasClass('td_pok_name')) || ($(elem2).hasClass('td_pok'))) {
                                                        tek_td_before=$(rep_tab_tr_head).find('td[olap_td_index="'+i2+'"][olap_tr_index="'+i+'"]');
                                                    }
                                                    else if ($(elem2).hasClass('null')) {
                                                        tek_td_before=$(tab_before_olap_tr).first().find('td[olap_td_index="'+i2+'"][olap_tr_index="'+i+'"]');
                                                    }                                                    
                                                    else {
                                                        tek_td_before=$(tr_name_col).find('td[olap_td_index="'+i2+'"][olap_tr_index="'+i+'"]');
                                                    }
                                                    if ($(tek_td_before).length>0) {
                                                        $(tek_tr).attr('olap_tr_class_'+id_t,elem.className).attr('olap_tr_id_'+id_t,elem.id).attr('olap_tr_index_'+id_t,i);
                                                        if ($(tek_td_before).attr('olap_td_class')==elem2.className) {
                                                            tek_td=$(tek_tr).find('td[id="'+$(tek_td_before).attr('id')+'"]');
                                                            if ($(tek_td).length>0) {
                                                                var colspan_v=parseInt($(tek_td_before).attr('colspan')),
                                                                    rowspan_v=parseInt($(tek_td_before).attr('rowspan'));                                                                
                                                                if (colspan_v>1) {
                                                                    for (var icsp = 1; icsp < (colspan_v); icsp++) {
                                                                        $(tek_td).next().remove();
                                                                    }
                                                                }
                                                                if (rowspan_v>1) {
                                                                    var tek_tr_null=$(tek_tr);
                                                                    for (var jcsp = 1; jcsp < (rowspan_v); jcsp++) {
                                                                        tek_tr_null=$(tek_tr_null).next();
                                                                        var tek_td_null=$(tek_tr_null).find('td[id^="'+$(tek_td).attr('id').split('-')[0]+'-"]').prev();
                                                                        for (var icsp = 1; icsp <= (colspan_v); icsp++) {
                                                                            $(tek_td_null).next().remove();
                                                                        }
                                                                    }
                                                                }
                                                                $(tek_td).html($(elem2).html()).addClass($(tek_td_before).attr("class")).attr('style',$(tek_td_before).attr('style'))
                                                                    .attr('olap_td_class',elem2.className).attr('olap_td_id',elem2.id).attr('olap_tab_id',id_t).attr('colspan',$(elem2).attr('colspan')).attr('rowspan',$(elem2).attr('rowspan')).attr('olap_td_index',i2).attr('olap_tr_index',i);
                                                            }
                                                            else {
                                                                pr_encore_this=true;
                                                                return false;
                                                            }
                                                        }
                                                        else {
                                                            pr_encore_this=true;
                                                            return false;
                                                        }
                                                    }
                                                    else {   
                                                        pr_encore_this=true;
                                                        return false;
                                                    }
                                                }
                                            }    

                                            //tek_td=$(tek_td).next();
                                        });
                                        if ((pr_encore_this) || (pr_end)) {
                                            return false;
                                        }


                                        //в новых вставленных строках вконце м.б. пустота, т.к. приходят такие данные
                                        if (pr_insert_new) {
                                            var tek_tr_td=$(tek_tr).find('td[olap_tab_id='+id_t+']');
                                            var tek_tr_length;
                                            if (($(tek_tr_td).filter('[olap_td_class="td_val_itog"]').length>0) & ($(tek_tr_td).filter('[olap_td_class="td_str_val"]').length>0)) {
                                                tek_tr_length=$(tek_tr_td).filter('[olap_td_class="td_val_val"]').length+$(tek_tr_td).filter('[olap_td_class="td_str_val"]').length;                                            
                                            }
                                            else {
                                                tek_tr_length=$(tek_tr_td).length;
                                            }
                                            if (tr_tab_all_length>tek_tr_length) {
                                                var tek_td_null=$(tek_td).next();
                                                var tek_td_before;
                                                for (var i = 1; i <= (tr_tab_all_length-tek_tr_length-1); i++) {
                                                    if ($(tek_td_null).length==0) { 
                                                        pr_encore_this=true;
                                                        return false;
                                                        break;                                                    
                                                    }
                                                    var mass_index=$(tek_td_null).attr('id').split('-');
                                                    tek_td_before=$(tr_tab_all).find('#'+mass_index[0]); 
                                                    $(tek_td_null).addClass($(tek_td_before).attr("class")).attr('style',$(tek_td_before).attr('style'))
                                                        .attr('olap_td_class','td_val_val').attr('olap_td_id','null').attr('olap_tab_id',id_t).attr('colspan',1).attr('rowspan',1).attr('olap_td_index',$(tek_td_before).attr('olap_td_index')).attr('olap_tr_index',i);
                                                    tek_td_null=$(tek_td_null).next();
                                                }
                                                tek_td_before=td_val_val_last; 
                                                $(tek_td_null).addClass($(tek_td_before).attr("class")).attr('style',$(tek_td_before).attr('style'))
                                                    .attr('olap_td_class','td_val_val').attr('olap_td_id','null').attr('olap_tab_id',id_t).attr('colspan',1).attr('rowspan',1).attr('olap_td_index',$(tek_td_before).attr('olap_td_index')).attr('olap_tr_index',i);                                            

                                            }
                                        }
                                        
                                        //т.к. стили ячеек могут браться из olap_design, а размеры могут не совпадать для 3D, то в таком случае для последней ячейки всегда проставляем стиль последней ячейки
                                        if ((pr_olap_design) & (!pr_2D) & ($(tek_tr).is('[olap_tr_class_'+id_t+'="tr_tab"'))) {
                                            $(tek_tr).find('td[olap_tab_id="'+id_t+'"]').last()
                                                .addClass($(td_val_val_last).attr("class")).attr('style',$(td_val_val_last).attr('style'));
                                        }
                                    
                                        tek_tr=$(tek_tr).next();
                                    });

                                    var olap_td_class1,olap_td_class2;
                                    if ($(tr_itog).length>0) {
                                        tek_tr=$(tek_tr).prev();
                                        if ($(tek_tr).is('[olap_tr_class_'+id_t+'="tr_itog"]')) {
                                            if ($(tr_itog).is('[olap_tr_class_'+id_t+'="tr_itog"]')) {                                        
                                                olap_td_class1='td_str_itog';
                                                olap_td_class2='td_val_itog';
                                                one_str_design(id_t,tek_tr,tr_itog,olap_td_class1,olap_td_class2);
                                            } 
                                            var tr_tab_last=$(tab_before_olap_tr).filter('[olap_tr_class_'+id_t+'="tr_tab"]').last();
                                            if (($(tr_tab_last).length>0) & ($(tek_tr).prev().is('[olap_tr_class_'+id_t+'="tr_tab"]'))) {
                                                tek_tr=$(tek_tr).prev();                                            
                                                olap_td_class1='td_str_val';
                                                olap_td_class2='td_val_val';                                        
                                                one_str_design(id_t,tek_tr,tr_tab_last,olap_td_class1,olap_td_class2);
                                                tek_tr=$(tek_tr).next();
                                            }                                        
                                        }
                                        else {
                                            olap_td_class1='td_str_val';
                                            olap_td_class2='td_val_val';
                                            one_str_design(id_t,tek_tr,tr_itog,olap_td_class1,olap_td_class2);
                                        }
                                        tek_tr=$(tek_tr).next();
                                    }

                                    var time3 = performance.now();
                                    console.log('время заполнения данными lite: '+secondstotime((time3-time2)/1000)); 
                                }
                                    //pr_encore=false;
                                if (!pr_encore_this) { 
                                    //удаляем пустоты, которые могут образоваться вконце (справа отсутсвуют данные, но до этого все показатели совпадают, таблицу в этом случае перестраивать не надо)
                                    var pr_null_all=false;
                                    if (!pr_2D) {
                                        var pr_td_val_name=false;
                                        var td_first_null;
                                        var md_tab_val_length=$(md).find('.structure.d-table .d-table[id="tab_val"] .SYSNAME').length;
                                        $(rep_tab_tr).filter('[olap_tr_class_'+id_t+'="tr_pok"]:last').find('[olap_td_class="td_pok"]').each(function(i,elem) {
                                            var pr_null=false;
                                            var index_beg=$(begin_tab_td).index()+$(md).find('.structure.d-table .d-table[id="tab_str"] .SYSNAME').length+($(elem).index()-$(begin_tab_td).index())*$(md).find('.structure.d-table .d-table[id="tab_val"] .SYSNAME').length;
                                            if ($(elem).text().trim().length==0) {
                                                pr_null=true;
                                                pr_null_all=true;
                                            }
                                            if (pr_null) {
                                                //ищем последнюю заполненную ячейку наименования полей и присваиваем ей стиль конечной ячейки,только 1 раз
                                                if (!pr_td_val_name) {   
                                                    var tr_name_col=$(rep_tab_tr).filter('[olap_tr_class_'+id_t+'="tr_name_col"]');
                                                    var td_last_bord=$(tr_name_col).find('[olap_td_class="td_val_name"]').last().css('border-right');
                                                    if (td_last_bord!='') {
                                                        $(tr_name_col).find('[olap_td_class="td_val_name"]').each(function(i2,elem2) {
                                                            if ($(elem2).text().trim().length==0) {
                                                                td_first_null=elem2;
                                                                return false;
                                                            }
                                                        });
                                                        if ($(td_first_null).length>0) {
                                                            $(td_first_null).prev().css('border-right',td_last_bord);
                                                        } 
                                                    }
                                                    pr_td_val_name=true;
                                                }
                                                for (var i = index_beg; i < (index_beg+md_tab_val_length); i++) {
                                                    var tek_td=$(rep_tab_tr).filter('[olap_tr_class_'+id_t+'="tr_name_col"]').find('td:eq('+i+')');
                                                    var mass_index=$(tek_td).attr('id').split('-');
                                                    $(tek_td).removeClass().removeAttr('style').addClass('c'+mass_index[0]+' r'+mass_index[1]).removeAttr('olap_td_class').removeAttr('olap_tab_id').removeAttr('olap_td_index').removeAttr('olap_tr_index').removeAttr('olap_td_id');
                                                } 
                                                $(rep_tab_tr).filter('tr[olap_tr_class_'+id_t+'="tr_pok"]:not(tr[olap_tr_class_'+id_t+'="null"])').each(function(i2,elem2) {
                                                    if ($(elem2).find('[olap_td_class="td_pok_name"]').length>0) {
                                                        $(elem2).find('[olap_td_class="td_pok_name"]').attr('colspan',(+$(elem2).find('[olap_td_class="td_pok_name"]').attr('colspan')-$(md).find('.structure.d-table .d-table[id="tab_val"] .SYSNAME').length));
                                                        var mass_index_cols=[],mass_left_cols=[];
                                                        $(table_all_tag).find('thead:first tr:last td:gt(0)').each(function(i,elem) {
                                                            var tek_index=$(elem).index();
                                                            mass_index_cols[tek_index]=$(elem).text();                
                                                            mass_left_cols[$(elem).offset().left]=tek_index;
                                                        });
                                                        var td_clone=$(elem2).find('[olap_td_class="td_pok_name"]').clone();
                                                        $(td_clone).removeClass().removeAttr('style').removeAttr('id').removeAttr('colspan').removeAttr('rowspan').html('').removeAttr('olap_td_class').removeAttr('olap_tab_id').removeAttr('olap_td_index').removeAttr('olap_tr_index').removeAttr('olap_td_id');                                                
                                                        for (var i = 1; i <= md_tab_val_length; i++) {
                                                            var tek_td=$(td_clone).clone();
                                                            $(elem2).find('[olap_td_class="td_pok_name"]').after(tek_td);
                                                        }                                                                                                
                                                    }
                                                    else {
                                                        var td_first_null;
                                                        $(elem2).find('[olap_td_class="td_pok"]').each(function(i3,elem3) {
                                                            if ($(elem3).text().trim().length==0) {
                                                                td_first_null=elem3;
                                                                return false;
                                                            }
                                                        });
                                                        if ($(td_first_null).length>0) {
                                                            $(td_first_null).prev().attr('style',$(elem2).find('[olap_td_class="td_pok"]').last().attr('style'));
                                                        }    

                                                        if ($(elem).attr('olap_tr_id_'+id_t)!=$(elem2).attr('olap_tr_id_'+id_t)) {
                                                            var index_p=$(begin_tab_td).index();
                                                            var elem_save;
                                                            $(elem2).find('td[olap_td_class="td_pok"][olap_tab_id='+id_t+']').each(function(i21,elem211) {
                                                                index_p+=+$(elem211).attr('colspan')/md_tab_val_length;
                                                                if (index_p>=($(elem).index()+1)) {
                                                                    elem_save=$(elem211);
                                                                    return false;
                                                                }                                                                                                                                                                                                              
                                                            });
                                                            if ($(elem_save).length>0) {
                                                                $(elem_save).attr('colspan',(+$(elem_save).attr('colspan')-md_tab_val_length));

                                                                var mass_index_cols=[],mass_left_cols=[];
                                                                $(table_all_tag).find('thead:first tr:last td:gt(0)').each(function(i,elem) {
                                                                    var tek_index=$(elem).index();
                                                                    mass_index_cols[tek_index]=$(elem).text();                
                                                                    mass_left_cols[$(elem).offset().left]=tek_index;
                                                                });
                                                                var td_clone=$(elem_save).clone();
                                                                $(td_clone).removeClass().removeAttr('style').removeAttr('id').removeAttr('colspan').removeAttr('rowspan').html('').removeAttr('olap_td_class').removeAttr('olap_tab_id').removeAttr('olap_td_index').removeAttr('olap_tr_index').removeAttr('olap_td_id');
                                                                var tr_index=$(elem2).index();
                                                                for (var i = 1; i <= md_tab_val_length; i++) {
                                                                    var tek_td=$(td_clone).clone();
                                                                    $(elem_save).after(tek_td);
                                                                }
                                                            }
                                                        }
                                                    }
                                                    var tr_index=$(elem2).index();
                                                    $(elem2).find('td:not([olap_td_class="td_pok"])').each(function(i3,elem3) {
                                                        var td_index=+mass_left_cols[$(elem3).offset().left]-1;
                                                        $(elem3).attr('id',(td_index+'-'+tr_index)).addClass('c'+td_index+' r'+tr_index);
                                                    });
                                                });
                                                $(rep_tab_tr).filter('[olap_tr_class_'+id_t+'="tr_tab"]').each(function(i2,elem2) {
                                                    if ($(td_first_null).length>0) {
                                                        var td_bord_last=$(elem2).find('[olap_td_class="td_val_val"]').last().css('border-right');
                                                        if (td_bord_last!='') {
                                                            var mass_index=$(td_first_null).prev().attr('id').split('-');
                                                            $(elem2).find('#'+mass_index[0]+'-'+$(elem2).index()).css('border-right',td_bord_last);
                                                        }
                                                    }

                                                    for (var i = index_beg; i < (index_beg+md_tab_val_length); i++) {
                                                        var tek_td=$(elem2).find('td:eq('+i+')');
                                                        var mass_index=$(tek_td).attr('id').split('-');
                                                        $(tek_td).removeClass().removeAttr('style').addClass('c'+mass_index[0]+' r'+mass_index[1]).removeAttr('olap_td_class').removeAttr('olap_tab_id').removeAttr('olap_td_index').removeAttr('olap_tr_index').removeAttr('olap_td_id');
                                                    }                                                                                                             
                                                });
                                                $(rep_tab_tr).filter('[olap_tr_class_'+id_t+'="tr_itog"]').each(function(i2,elem2) {
                                                    if ($(td_first_null).length>0) {
                                                        var td_bord_last=$(elem2).find('[olap_td_class="td_val_itog"]').last().css('border-right');
                                                        if (td_bord_last!='') {
                                                            var mass_index=$(td_first_null).prev().attr('id').split('-');
                                                            $(elem2).find('#'+mass_index[0]+'-'+$(elem2).index()).css('border-right',td_bord_last);
                                                        }
                                                    }

                                                    for (var i = index_beg; i < (index_beg+md_tab_val_length); i++) {
                                                        var tek_td=$(elem2).find('td:eq('+i+')');
                                                        var mass_index=$(tek_td).attr('id').split('-');
                                                        $(tek_td).removeClass().removeAttr('style').addClass('c'+mass_index[0]+' r'+mass_index[1]).removeAttr('olap_td_class').removeAttr('olap_tab_id').removeAttr('olap_td_index').removeAttr('olap_tr_index').removeAttr('olap_td_id');
                                                    }                                                                                                             
                                                });
                                                var mass_index=$(elem).attr('id').split('-');
                                                $(elem).removeClass().removeAttr('style').addClass('c'+mass_index[0]+' r'+mass_index[1]).removeAttr('olap_td_class').removeAttr('olap_tab_id').removeAttr('olap_td_index').removeAttr('olap_tr_index').removeAttr('olap_td_id');
                                            }
                                        }); 
                                    }
                                    //восстанавливаем индексы после таблицы, т.к. произодилась вставка/удаление строк
                                    index_recalc_true(tek_tr);

                                    pr_encore=false;
                                    $('#my').jexcel('updateSelection', begin_tab_td, begin_tab_td, 1); 
                                } 
                                else {  
                                    tab_before_olap_tr_true=$(table_tag_v).find('tr[olap_tr_class_'+id_t+']');
                                    var count_del;
                                    if ((pr_insert) || (pr_del)) {
                                        count_del=$(data_tab_html_tr).length;
                                    }
                                    else {
                                        count_del=$(tab_before_olap_tr_true).length;
                                    }
                                    $('#my').jexcel ('deleteRow',($(begin_tab_td).closest('tr').index()) ,count_del,{not_log:true});
                                    pr_tab_before=false;
                                }                                

                                var time4 = performance.now();
                                console.log('время удаления пустот/удаления строк для перерисовки по другому алгоритму lite: '+secondstotime((time4-time3)/1000)); 
                                console.log('время общее lite: '+secondstotime((time4-time0)/1000));
                                console.log('время общее lite с SQL: '+secondstotime((time4-time00)/1000));

                                if (!pr_encore_this) {
                                    save_tab_data();
                                    var time_save = performance.now();
                                    console.log('время общее lite c сохранением данных для jexcel: '+secondstotime((time_save-time00)/1000));
                                    $(in_action_value).trigger('after_load_data'+id_t);
                                }
                            }                                   
                            
                        }
                    }
                    else {
                        //если есть отформатированная ранее таблица, то оставляем 2 строки и в первый столбец пишем текст
                        if (pr_tab_before) {
                            var tr_tab_all_all=$(table_tag_v).find('tr[olap_tr_class_'+id_t+'="tr_tab"],tr[olap_tr_class_'+id_t+'="tr_itog"]'),
                                tr_tab_all_all_noi=$(tr_tab_all_all).filter('tr[olap_tr_class_'+id_t+'="tr_tab"]');
                            if ($(tr_tab_all_all).length>2) {
                                $('#my').jexcel('deleteRow',$(tr_tab_all_all_noi).first().index(),($(tr_tab_all_all_noi).length-2),{not_log:true});
                            }
                            $(begin_tab_td).html(begin_tab_td_old);
                            var tr_olap_td=$(tr_tab_all_all).find('td[olap_tab_id='+id_t+']').empty();
                            $(tr_olap_td).first().html(data.pr_null_text);
                        }
                        else {
                            $(begin_tab_td).html(data.pr_null_text);
                        }    
                        
                    }
                },
                error: function(xhr, status, error) {
                    $(begin_tab_td).empty();
                    var timeErrSQL = performance.now();
                    alert('Запуск оказался неудачным.\n'+
                           'Время с момента запуска запроса: '+secondstotime((timeErrSQL-time00)/1000)+'\n'+
                           'Ошибка '+xhr.responseText+ ' ' + status + ' ' +error);
                    //console.log('время с момента запуска запроса: '+secondstotime((timeErrSQL-time00)/1000));
                    console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                    save_tab_data();
                    var time_save = performance.now();
                    console.log('время общее c сохранением данных для jexcel: '+secondstotime((time_save-time00)/1000));
                }
            });
            
            set_tab_width_true();
            //modal_close();
        }}
    }
    
    let get_page;
    $('.no_panel').on('click', 'a.page_control', function() {
        if (!$(this).is('[pr_change]')) {
            var p_p=$(this).closest('.page_panel');
            if (this.id=='prev') {
                var tek_page=parseInt($(p_p).find('.page_control[pr_change]').attr('id'))
                if (tek_page!==1) {
                    get_page=tek_page-1;
                }    
            }
            else if (this.id=='next') {
                var tek_page=parseInt($(p_p).find('.page_control[pr_change]').attr('id')),
                    last_p=parseInt($(p_p).find('.page_control:last').attr('id'));
                if (tek_page!==last_p) {
                    get_page=tek_page+1;
                }  
            }
            else {
                get_page=parseInt(this.id);
            }
            if (!!get_page) {
                $(p_p).find('a.page_control[pr_change]').removeAttr('pr_change');
                $(p_p).find('a.page_control[id="'+get_page+'"]').attr('pr_change','true')
                var gt=$(p_p).closest('div[id="group_tab"]');
                $(gt).find('a.table_play').trigger('click');
            }
        }
    });
    
    $('div.modal_content').on('click', '.md_save', function() {
        var id_t=this.id,
            group_tab=$(table_tag).find('div[id="group_tab"][olap_id="'+id_t+'"]'),
            md=$(this).closest('.masterdata'),
            pr_ok=true,
            pr_2D=$(md).find('a.2D_3D').hasClass('2D'),
            table_panel=$(group_tab).find('.table_panel[id="'+id_t+'"]'),
            olap_design=$(table_panel).find('div.table_save_design_val').text();
        
        if (($(md).find('.structure.d-table .d-table[id="tab_str"] .SYSNAME').length==0) & (!pr_2D)) {
            pr_ok=false;
            alert('Для "Полей строк" необходимо наличие не менее одного элемента');
        }
        if ($(md).find('.structure.d-table .d-table[id="tab_val"] .SYSNAME').length==0) {
            pr_ok=false;
            alert('Для "Значений показателей" необходимо наличие не менее одного элемента');
        }
        if (pr_ok) {
            //формируем панель действий
            var table_panel_txt='<ul class="ul_cons top-level" action_type="olap" style="margin:5px 0 5px 0;">\n\
                                    <li id="'+id_t+'" class="li_cons li_cons_top" style="background: none;" action_type="olap">\n\
                                        <a id="'+id_t+'" title="Редактировать структуру куба" class="table_active" action_type="olap">\n\
                                            <img src="/img/edit_tab.png" style="height:35px;width:auto;">\n\
                                        </a>\n\
                                     </li>\n\
                                    <li id="'+id_t+'" class="li_cons li_cons_top" style="background: none;" action_type="olap">\n\
                                        <a id="'+id_t+'" title="Запустить куб" class="table_play" action_type="olap">\n\
                                            <img src="/img/play_tab.png" style="height:35px;width:auto;">\n\
                                        </a>\n\
                                    </li>\n\
                                    <li id="'+id_t+'" class="li_cons li_cons_top" style="background: none;" action_type="olap">\n\
                                        <a id="'+id_t+'" title="Очистить таблицу куба" class="table_clear" action_type="olap">\n\
                                            <img src="/img/clear_tab.png" style="height:35px;width:auto;">\n\
                                        </a>\n\
                                    </li>\n\
                                    <li id="'+id_t+'" class="li_cons li_cons_top" style="background: none;" action_type="olap">\n\
                                        <a id="'+id_t+'" title="Сохранить дизайн структуры" class="table_save_design" action_type="olap">\n\
                                            <img src="/img/save_structure.png" style="height:35px;width:auto;">\n\
                                        </a>\n\
                                        <div id="'+id_t+'" class="div_hidden table_save_design_val">'+olap_design+'</div>\n\
                                    </li>';
            var tr_pa=$(md).find('li.action_set_table .div_hidden:first .d-table#tab_taa_value .d-tr:not([id="after_append"])');
            $(tr_pa).filter('.default').each(function(i,elem) {
                var sysname=$(elem).find('.SYSNAME').text().trim(),
                    sql_v=$(elem).find('.taa_sql_v').text().trim(),
                    tek_index=$(elem).index();
                if ((sysname=='add') & (sql_v.length>0)) {
                    table_panel_txt+='<li id="'+id_t+'" class="li_cons li_cons_top" style="background: none;" action_type="olap">\n\
                                            <a id="'+id_t+'" title="Добавить строку" class="olap_tr_add" action_type="olap" tr_action_index="'+tek_index+'">\n\
                                                <img src="/img/add.png" style="height:30px;width:auto;">\n\
                                            </a>\n\
                                        </li>\n';
                }
                else if ((sysname=='edit') & (sql_v.length>0)) {
                    table_panel_txt+='<li id="'+id_t+'" class="li_cons li_cons_top" style="background: none;" action_type="olap">\n\
                                            <a id="'+id_t+'" title="Редактировать строку" class="olap_tr_edit" action_type="olap" tr_action_index="'+tek_index+'">\n\
                                                <img src="/img/edit.png" style="height:30px;width:auto;">\n\
                                            </a>\n\
                                        </li>\n';
                }
                else if ((sysname=='delete') & (sql_v.length>0)) {
                    table_panel_txt+='<li id="'+id_t+'" class="li_cons li_cons_top" style="background: none;" action_type="olap">\n\
                                            <a id="'+id_t+'" title="Удалить строку" class="olap_tr_delete" action_type="olap" tr_action_index="'+tek_index+'">\n\
                                                <img src="/img/rep_del.png" style="height:30px;width:auto;">\n\
                                            </a>\n\
                                        </li>\n';
                }
                else if ((sysname=='search') & ($(elem).find('.in_taa_search').prop('checked'))) {
                    table_panel_txt+='<li id="'+id_t+'" class="li_cons li_cons_top" style="background: none;" action_type="olap">\n\
                                            <a id="'+id_t+'" title="Поиск по таблице" class="olap_tr_search" action_type="olap" tr_action_index="'+tek_index+'">\n\
                                                <img src="/img/search.png" style="height:29px;width:auto;">\n\
                                            </a>\n\
                                        </li>\n';
                }
                else if ((sysname=='graf') & ($(elem).find('.in_taa_graf').prop('checked'))) {
                    table_panel_txt+='<li id="'+id_t+'" class="li_cons li_cons_top" style="background: none;" action_type="olap">\n\
                                            <a id="'+id_t+'" title="Построить 3D-график" class="table_graf" action_type="olap" tr_action_index="'+tek_index+'">\n\
                                                <img src="/img/graf_tab.png" style="height:35px;width:auto;">\n\
                                            </a>\n\
                                        </li>\n';
                }
                else if ((sysname=='export_xlsx') & ($(elem).find('.in_taa_exlsx').prop('checked'))) {
                    table_panel_txt+='<li id="'+id_t+'" class="li_cons li_cons_top" style="background: none;" action_type="olap">\n\
                                            <a id="'+id_t+'" title="Выгрузить в XLSX" class="export_xlsx" action_type="olap" tr_action_index="'+tek_index+'">\n\
                                                <img src="/img/UPLOAD-Excel.png" style="height:28px;width:auto;">\n\
                                            </a>\n\
                                        </li>\n';
                }
            })
            var tr_pa_nd=$(tr_pa).filter(':not(.default)');
            if ($(tr_pa_nd).length>0) {
                table_panel_txt+='<li id="'+id_t+'" class="olap_dop_action li_cons li_cons_top" style="background: none;" action_type="olap"><img src="/img/actions.png" style="height:27px;width:auto;"title="Доп.действия">\n'+
                                        '<ul class="olap_dop_action ul_cons second-level" style="width: 230px;text-align: left;border: 1px solid #008000;border-radius: 0 0 5px 5px;position:fixed;left:-250px;" action_type="olap">\n';                                           
                $(tr_pa_nd).filter(':not(:last)').each(function(i,elem) {   
                    var sname=$(elem).find('.SYSNAME input').val().trim(),
                        name=$(elem).find('.NAME input').val().trim();
                    table_panel_txt+='<li class="li_cons" style="height: 20px;width: 230px;color: white;border-bottom-color: white;"  action_type="olap">'+                                   
                                            '<a id="'+sname+'" olap_id="'+id_t+'" tr_action_index="'+$(elem).index()+'" class="olap_dop_action_one" style="margin:0 5px 0 auto;float:left;">'+name+
                                            '</a>'+
                                        '</li>\n';
                });
                $(tr_pa_nd).filter(':last').each(function(i,elem) {   
                    var sname=$(elem).find('.SYSNAME input').val().trim(),
                        name=$(elem).find('.NAME input').val().trim();
                    table_panel_txt+='<li class="li_cons" style="height: 20px;width: 230px;color: white;border-bottom-color: white;border-radius:0 0 5px 5px;"  action_type="olap">'+                                   
                                            '<a id="'+sname+'" olap_id="'+id_t+'" tr_action_index="'+$(elem).index()+'" class="olap_dop_action_one" style="margin:0 5px 0 auto;float:left;">'+name+
                                            '</a>'+
                                        '</li>\n';
                });
                table_panel_txt+='</ul></li>\n';
            }
            table_panel_txt+='</ul>'; 
            $(table_panel).html(table_panel_txt);
            set_olap_params_all(group_tab);
            save_tab_data();
            olap_tab_clear(id_t);
            modal_close();            
        }        
    });
    
    function getOlap2D(md) {
        var structure_r_old=$(md).find('.structure_r_old'),
            tab_struct=$(md).find('.structure.d-table .d-table#tab_geometry'); 
        if ($(structure_r_old).length===0) {
            $(md).append('<div class="structure_r_old">'+$(tab_struct).html()+'</div>');
        }            
        $(tab_struct).find('.d-tr:first').remove();
        $(tab_struct).find('.d-tr:first').remove();
        $(tab_struct).find('.d-tr:first .d-td#tab_str').remove();
        $(tab_struct).find('.d-table[id="tab_val"] .d-td.plhold').html('Перенесите сюда значения для показателей');
    }
    
    $('div.modal_content').on('click', 'a.2D_3D[action_type="olap"]', function() {
        $(this).toggleClass('2D');
        var md=$(this).closest('div.masterdata'),
            structure_old=$(md).find('.structure_old'),
            tab_pol=$(md).find('#tab_pol');
        if ($(structure_old).length===0) {
            $(md).append('<div class="structure_old">'+$(md).find('.polya #tab_pol').html()+'</div>');
        }
        else {
            $(tab_pol).html($(structure_old).html());
        }                
        if ($(this).hasClass('2D')) {
            getOlap2D(md);                        
        }
        else {
            var structure_r_old=$(md).find('.structure_r_old'),
                tab_struct=$(md).find('.structure.d-table .d-table#tab_geometry');            
            $(tab_struct).html($(structure_r_old).html());
        }
    });
    
    $('#modal_form').on('mouseover','li.action li,li.type li', function() {
        //console.log(this);
        $(this).css({background: '#d1ffff','border-bottom-color': 'white'});
        $(this).find('a').css({color: 'black'});
    });
    $('#modal_form').on('mouseout','li.action li,li.type li', function() {
        if ($(this).filter('[pr_change_style]').length==0) {
            $(this).css({background: 'white','border-bottom-color': 'black'});
            $(this).find('a').css({color: '#0088cc'});
        }    
    });        
    
    //необходимо для правильного сохранения html и последующего восстановления
    $('div.modal_content').on('change', '.sel_val_aggr,.sel_itogo,.sel_param_type,.sel_taa_type,.sel_taa_pol_type_fdb', function() {
        $(this).find('option').removeAttr("selected");
        $(this).find('option[value="'+$(this).val()+'"]').attr('selected', '');
    });
    $('div.modal_content').on('change', '.in_param_multi,.in_param_req,.in_taa_search,.in_taa_graf,.in_taa_exlsx,.in_taa_pol_multi,.in_taa_pol_required', function() {
        $(this).removeAttr("checked");
        if ($(this).prop('checked')) {
            $(this).attr('checked', '');
        }    
    });
    
    $('div.modal_content').on('blur', '.in_param_name,.in_taa_sysname,.in_taa_name,.in_taa_pol_name,.in_taa_pol_sysname,.in_taa_pol_sort,.in_olap_taa_mod', function() {
        $(this).attr('value',$(this).val());    
    }); 
    
    $('div#my').on('blur', '.in_param_val', function() {
        $(this).attr('value',$(this).val());
        var p_param=$(this).closest('.p_param');
        olap_param_upd_child($(p_param).closest('.params_group').attr('id'),$(p_param).attr('id')); 
    });
    
    $('div.modal_content').on('change', '.sel_itogo', function() {
        $(this).closest('.d-tr').find('.d-td:eq(0)').attr('title','Текущий вариант подсчета итого: "'+$(this).find('option[value="'+$(this).val()+'"]').text()+'"');        
    });        
    
    $('div#my').on('click', 'a.table_clear', function(){
        console.log('очищаем');
        olap_tab_clear(this.id);
    });
    
    $('.no_panel').on('click', 'a.table_save_design', function(){
        var tr_olap=$(table_tag).find('tr[olap_tr_class_'+this.id+']').clone(),
            html_v='';
        if ($(tr_olap).length>0) { 
            $(tr_olap).filter('tr[olap_tr_class_'+this.id+'="tr_tab"]').find('td').empty();                
            $(tr_olap).each(function(i,elem) {  
                html_v+=elem.outerHTML;
            });
            $(this).next().html(LZString.compressToUTF16(html_v));
            alert('Дизайн структуры сохранен');
        }
        else {
            alert('Отсутствуют строки для сохранения');
        }
    });
    
    
    //необходимо для правильного сохранения
    $('div#my').on('click keyup', '.in_param_val', function(){
        $(this).attr('value',$(this).val());
    });
    
    
    $('.slide_panel').on('click', '#olap_add', function(){                
        var table=$(table_tag);
        var tds=$('#my').jexcel('getSelectedCells');
        var olap_id=0;
        $(table).find('div[id="group_tab"][olap_id]').each(function(i,elem) {
            if ($(elem).attr('olap_id')>olap_id) {
                olap_id=+$(elem).attr('olap_id');
            }                   
        });
        olap_id+=1;
        if ($(tds).length==1) {
            var tds_plus=$(tds).closest('tr').find('td:gt('+($(tds).index()-1)+')');
            if ($(tds_plus).length>1) {
                td_plus(tds_plus);
            }    
            //console.log('sohranyaem');
            //var editor=$('div#editor');
            var id_t=olap_id;
            //$('.sql_value[id="'+id_t+'"]').html($(editor).html());
            var params = new Object();
            params['code_in']='save_md_str';
            params['sql_true']='';
            //params['sql']=$(editor).html();
            params['sql']='';
            params['tab_id']=id_t;        
            //формируем таблицу с параметрами
            params['sql_true']='';
            params['params']='';
            params['params_olap']='';            
            console.log(params);
            $('#overlay').after($('.container').hide());
            $.ajax({
                type: "POST",
                url: "/get-data.php",
                data: params,
                success: function(html){
    //                console.log(html);
                    $(tds).html('<div id="group_tab" olap_id='+olap_id+'>'+
                            '<div id="'+olap_id+'" class="f r_table">'+								
                                '<div id="'+olap_id+'" class="masterdata">'+html+'</div>'+                                   
                                '<div id="'+olap_id+'" style="text-align: left;" class="table_panel">'+
                                    '<a id="'+olap_id+'" title="Редактировать структуру куба" class="table_active">'+
                                        '<img src="/img/edit_tab.png" width=40 height="auto"></a>'+
                                    '<a id="'+olap_id+'" title="Запустить куб" class="table_play">'+
                                        '<img src="/img/play_tab.png" width=40 height="auto"></a>'+
                                    '<a id="'+olap_id+'" title="Очистить таблицу куба" class="table_clear">'+
                                        '<img src="/img/clear_tab.png" width=40 height="auto"></a>'+  
                                    '<a id="'+olap_id+'" title="Посмотреть 3D-график" class="table_graf">'+
                                        '<img src="/img/graf_tab.png" width=40 height="auto"></a>'+     
                                '</div>'+
                                '<div id="'+olap_id+'" class="params_group"></div>'+ 
                                '<table class="rep_tab" id="'+olap_id+'" border="1"></table>'+
                            '</div>'+
                        '</div>');
                    $(tds).find('.params_group[id="'+olap_id+'"]').hide();
                    var width_v=160,
                        table_all_tag_v=$(table_all_tag),
                        width_before=$(table_all_tag_v).find('thead:first td:eq('+$(tek_kol).index()+')').width();
                    $(table_all_tag_v).width($(table_all_tag_v).width()+width_v-width_before);
                    $(table_all_tag_v).find('tr').each(function(i,elem) {
                        $(elem).find('td:eq('+$(tek_kol).index()+')').width(width_v);
                    });     
                    $('#my').jexcel('updateSelection', tds, tds, 1);    
                },
                error: function(xhr, status, error) {
                    alert('Ошибка получения данных. Возможно, истекло время сессии.'+xhr.responseText+ ' ' + status + ' ' +error);
                    console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                }
            });             
        }
        else {
            alert('Необходимо выбрать только одну ячейку');
        }
    });
    
    var InstantSearch = {

        "highlight": function (container, highlightText)
        {
            var internalHighlighter = function (options)
            {

                var id = {
                    container: "container",
                    tokens: "tokens",
                    all: "all",
                    token: "token",
                    className: "className",
                    sensitiveSearch: "sensitiveSearch"
                },
                tokens = options[id.tokens],
                allClassName = options[id.all][id.className],
                allSensitiveSearch = options[id.all][id.sensitiveSearch];


                function checkAndReplace(node, tokenArr, classNameAll, sensitiveSearchAll)
                {
                    var nodeVal = node.nodeValue, parentNode = node.parentNode,
                        i, j, curToken, myToken, myClassName, mySensitiveSearch,
                        finalClassName, finalSensitiveSearch,
                        foundIndex, begin, matched, end,
                        textNode, span, isFirst;

                    for (i = 0, j = tokenArr.length; i < j; i++)
                    {
                        curToken = tokenArr[i];
                        myToken = curToken[id.token];
                        myClassName = curToken[id.className];
                        mySensitiveSearch = curToken[id.sensitiveSearch];

                        finalClassName = (classNameAll ? myClassName + " " + classNameAll : myClassName);

                        finalSensitiveSearch = (typeof sensitiveSearchAll !== "undefined" ? sensitiveSearchAll : mySensitiveSearch);

                        isFirst = true;
                        while (true)
                        {
                            if (finalSensitiveSearch)
                                foundIndex = nodeVal.indexOf(myToken);
                            else
                                foundIndex = nodeVal.toLowerCase().indexOf(myToken.toLowerCase());
                            
                            if (foundIndex>0) {
                                var dop_pr_s1=nodeVal.substring(foundIndex-1, foundIndex).toLowerCase().trim();
                                var dop_pr_s2=nodeVal.substring(foundIndex+myToken.length, foundIndex+myToken.length+1).toLowerCase().trim();
                                console.log('myToken='+myToken+',dop_pr_s1='+dop_pr_s1+',dop_pr_s2='+dop_pr_s2);                                
                                if (dop_pr_s1.length>0) {
                                    if( dop_pr_s1.match(/[a-zа-я0-9\_]/g)) {
                                        foundIndex=-1;
                                    }
                                }
                                if (dop_pr_s2.length>0) {
                                    if( dop_pr_s2.match(/[a-zа-я0-9\_]/g)) {
                                        foundIndex=-1;
                                    }
                                }
                            }    
                            
                            if (foundIndex < 0)
                            {
                                if (isFirst)
                                    break;

                                if (nodeVal)
                                {
                                    textNode = document.createTextNode(nodeVal);
                                    parentNode.insertBefore(textNode, node);
                                } // End if (nodeVal)

                                parentNode.removeChild(node);
                                break;
                            } // End if (foundIndex < 0)

                            isFirst = false;


                            begin = nodeVal.substring(0, foundIndex);
                            matched = nodeVal.substr(foundIndex, myToken.length);

                            if (begin)
                            {
                                textNode = document.createTextNode(begin);
                                parentNode.insertBefore(textNode, node);                                
                            } // End if (begin)

                            //console.log(node);
                            //console.log(parentNode);
                            
                            span = document.createElement("span");
                            span.className += finalClassName;
                            span.appendChild(document.createTextNode(matched));                                                         

                            parentNode.insertBefore(span, node);

                            nodeVal = nodeVal.substring(foundIndex + myToken.length);
                        } // Whend

                    } // Next i 
                }; // End Function checkAndReplace 

                function iterator(p)
                {
                    if (p === null) return;

                    var children = Array.prototype.slice.call(p.childNodes), i, cur;

                    if (children.length)
                    {
                        for (i = 0; i < children.length; i++)
                        {
                            cur = children[i];
                            if (cur.nodeType === 3)
                            {
                                checkAndReplace(cur, tokens, allClassName, allSensitiveSearch);
                            }
                            else if (cur.nodeType === 1)
                            {
                                iterator(cur);
                            }
                        }
                    }
                }; // End Function iterator

                iterator(options[id.container]);
            } // End Function highlighter
            ;


            internalHighlighter(
                {
                    container: container
                    , all:
                        {
                            className: "highlighter"
                        }
                    , tokens: [
                        {
                            token: highlightText
                            , className: "highlight"
                            , sensitiveSearch: false
                        }
                    ]
                }
            ); // End Call internalHighlighter 

        } // End Function highlight

    };
    
    /*$('body').on('input', 'div#editor', function() {
        InstantSearch.highlight(this, 'select');
        InstantSearch.highlight(this, 'from');
        InstantSearch.highlight(this, 'join');
        InstantSearch.highlight(this, 'left');
        InstantSearch.highlight(this, 'right');
        InstantSearch.highlight(this, 'where');
        InstantSearch.highlight(this, 'order');
        InstantSearch.highlight(this, 'by');
        InstantSearch.highlight(this, 'group');
        InstantSearch.highlight(this, 'desc');
        InstantSearch.highlight(this, 'on');
        InstantSearch.highlight(this, 'outer');
        InstantSearch.highlight(this, 'apply');
        InstantSearch.highlight(this, 'min');
        InstantSearch.highlight(this, 'max');
        InstantSearch.highlight(this, 'abs');
        InstantSearch.highlight(this, 'row_number');
        InstantSearch.highlight(this, 'case');
        InstantSearch.highlight(this, 'when');
        InstantSearch.highlight(this, 'then');
        InstantSearch.highlight(this, 'iif');
        InstantSearch.highlight(this, 'like');
        InstantSearch.highlight(this, 'top');
        InstantSearch.highlight(this, 'count');
        InstantSearch.highlight(this, 'sum');
        InstantSearch.highlight(this, 'over');
        InstantSearch.highlight(this, 'else');
        InstantSearch.highlight(this, 'set');
        InstantSearch.highlight(this, 'exec');
        InstantSearch.highlight(this, 'alter');
        InstantSearch.highlight(this, 'table');
        InstantSearch.highlight(this, 'update');
        InstantSearch.highlight(this, 'insert');
        InstantSearch.highlight(this, 'into');
        InstantSearch.highlight(this, 'values');
        InstantSearch.highlight(this, 'partition');        
        InstantSearch.highlight(this, 'and');
        InstantSearch.highlight(this, 'or');
        InstantSearch.highlight(this, 'isnull');
        InstantSearch.highlight(this, 'begin');
        InstantSearch.highlight(this, 'union');
        InstantSearch.highlight(this, 'all');
    });*/
	
});	

function dragStart(ev) {
   ev.dataTransfer.effectAllowed='move';
   ev.dataTransfer.setData("Text", ev.target.getAttribute('id'));
   ev.dataTransfer.setDragImage(ev.target,50,50);
   return true;
}
function dragEnter(ev) {
   ev.preventDefault();
   return true;
}
function dragOver(ev) {
	ev.preventDefault();
}
function dragDrop(ev) {
   if ($(ev.target).attr('id')!=='null') {
	   var id = ev.dataTransfer.getData("Text"),
                tab_beg=$('#'+id).closest('.d-table'),
                tab_val_sel='<select  class="sel_val_aggr" id="'+id+'" title="Агрегирование">'+
                                '<option selected value="MAX">Максимум</option>'+
                                '<option value="MIN">Минимум</option>'+
                                '<option value="SUM">Сумма</option>'+
                                '<option value="AVG">Среднее значение</option>'+
                                '<option value="COUNT">Количество</option>'+
                            '</select>',
                tab_val_sel_2D='<select  class="sel_val_aggr" id="'+id+'" title="Видимость">'+
                                    '<option selected value="VIS">Видимый</option>'+
                                    '<option value="UNVIS">Невидимый</option>'+
                                '</select>',
                pr_2D=$(tab_beg).closest('.masterdata').find('a.2D_3D').hasClass('2D');                  
       //console.log(tab_beg);	   
	   var tr_mov=$(tab_beg).find('.d-tr[id="'+id+'"]');	   
	   //console.log(tr_mov);
	   if ($(tab_beg).attr('id')=='tab_pol') {
                if ($(ev.target).closest('.d-table').attr('id')!=='tab_pol') {
                            if ($(tr_mov).find('input').val()!=='') {
                                $(tr_mov).find('.d-td:eq(0)').text($(tr_mov).find('input').val());
                           }
                           //console.log($(ev.target).attr('id'));
                           if (($(ev.target).closest('.d-table').attr('id')!=='tab_val') & ($(ev.target).attr('id')!=='tab_val') & ($(tr_mov).attr('id')!='_itogo_')) {
                                $(tr_mov).find('.d-td:eq(1)').remove();
                            }
                            else if (($(tr_mov).attr('id')=='_itogo_') & (($(ev.target).closest('.d-table').attr('id')=='tab_str') || ($(ev.target).attr('id')=='tab_str'))) {
                                //$(tr_mov).find('.d-td:eq(0)').attr('_itogo_',$(tr_mov).find('.d-td:eq(1) .sel_itogo').val());
                                $(tr_mov).find('.d-td:eq(1)').hide();
                            }
                            else if ($(tr_mov).attr('id')!='_itogo_') {
                                $(tr_mov).find('.d-td:eq(1)').html((!pr_2D) ? tab_val_sel:tab_val_sel_2D);
                            }
                           if (($(ev.target).attr('id')!=='tab_str') & ($(ev.target).attr('id')!=='tab_val') & ($(ev.target).attr('id')!=='tab_pok'))	{                                        
                                if ($(tr_mov).attr('id')=='_itogo_') {  
                                    if ($(ev.target).closest('.d-table').attr('id')=='tab_str') {                                        
                                        $(ev.target).closest('.d-table').find('.d-tr').last().after(tr_mov);        
                                    }
                                }
                                else {
                                    $(ev.target).closest('.d-tr').before(tr_mov);
                                }
                           }            
                           else {
                                //console.log($(ev.target).closest('.d-table').find('.SYSNAME'));
                                $(ev.target).find('.d-tr:eq(0)').before(tr_mov);	
                                $(ev.target).find('.plhold').closest('.d-tr').remove();
                           }	   
                           if (($(ev.target).attr('id')=='plhold_str') || ($(ev.target).attr('id')=='plhold_val') || ($(ev.target).attr('id')=='plhold_pok'))  {
                                if ($(tr_mov).attr('id')=='_itogo_') {  
                                    if ($(ev.target).closest('.d-table').attr('id')=='tab_str') {
                                        $(ev.target).closest('.d-tr').remove();        
                                    }
                                }
                                else {
                                    $(ev.target).closest('.d-tr').remove();
                                }
                           }                    
                }
                else {
                        $(ev.target).closest('.d-tr').before(tr_mov);
                }	   
	   }
	   else if (($(tab_beg).attr('id')=='tab_str') || ($(tab_beg).attr('id')=='tab_val') || ($(tab_beg).attr('id')=='tab_pok')) {
		   if (($(ev.target).closest('.d-table').attr('id')!=='tab_str') & ($(ev.target).attr('id')!=='tab_str') & ($(ev.target).closest('.d-table').attr('id')!=='tab_val') 
			   & ($(ev.target).closest('.d-table').attr('id')!=='tab_pok') & ($(ev.target).attr('id')!=='tab_val')) 
                   {
			   //console.log(ev.target);
				//console.log($(ev.target).closest('.d-table').attr('id'));
                           if ($(tr_mov).attr('id')!='_itogo_') {    
                                if ($(tr_mov).closest('.d-table').attr('id')=='tab_val') {
                                     $(tr_mov).find('.d-td:eq(1)').remove();
                                 }     
                                if ($(tr_mov).find('.d-td:eq(0)').text()==$(tr_mov).attr('id')) {
                                             $(tr_mov).append('<div class="NAME d-td" id="'+$(tr_mov).attr('id')+'" style="padding:0;"><input type="text" style="margin:0" class="tab_pol_nam_val" placeholder="Введите отображаемое имя"></div>');	
                                }
                                 else {				
                                         $(tr_mov).append('<div class="NAME d-td" id="'+$(tr_mov).attr('id')+'" style="padding:0;"><input type="text" style="margin:0" class="tab_pol_nam_val" placeholder="Введите отображаемое имя" value="'+$(tr_mov).find('.d-td:eq(0)').text()+'"></div>');
                                         $(tr_mov).find('.d-td:eq(0)').text($(tr_mov).attr('id'));
                                 }
                            }
                            else {
                                $(tr_mov).find('.d-td:eq(1)').show();
                            }
                            if ($(tr_mov).attr('id')!='_itogo_') {  
                                $(ev.target).closest('.d-tr').before(tr_mov);
                            }
                            else {
                                $(ev.target).closest('.d-table').find('.d-tr').first().after(tr_mov);
                            }
                            //console.log($(tab_beg).find('.d-tr').length);
                    }
                    else 
                        {
                            if ($(tr_mov).attr('id')!='_itogo_') {
                                if (($(ev.target).closest('.d-table').attr('id')!=='tab_val') & ($(ev.target).attr('id')!=='tab_val')) {
                                    $(tr_mov).find('.d-td:eq(1)').remove();
                                }
                                else {
                                    if ($(tab_beg).attr('id')!='tab_val') {
                                        $(tr_mov).append('<div class="NAME d-td" id="'+$(tr_mov).attr('id')+'" style="padding:0;">'+tab_val_sel+'</div>');                                    
                                    }
                                }
                            }
                            
                            if ($(tr_mov).attr('id')!='_itogo_') {                                
                                if (($(ev.target).attr('id')!=='tab_val') & ($(ev.target).attr('id')!=='tab_str')) {
    //                                console.log('tut');                    
                                                $(ev.target).closest('.d-tr').before(tr_mov);
                                                if (($(ev.target).attr('id')=='plhold_str') || ($(ev.target).attr('id')=='plhold_val') || ($(ev.target).attr('id')=='plhold_pok'))  {
                                                        $(ev.target).closest('.d-tr').remove();
                                                }
                                                else {	
                                                        $(ev.target).closest('.d-table').find('#plhold_val').closest('.d-tr').remove();
                                                }                                  
                                }
                                else {
                                    if ($(ev.target).attr('id')=='tab_val') {
                                        $(ev.target).find('.d-table[id="tab_val"] .d-tr:eq(0)').before(tr_mov);	
                                        $(ev.target).find('.d-table[id="tab_val"] #plhold_val').closest('.d-tr').remove();	
                                    }
                                    else if ($(ev.target).attr('id')=='tab_str') {
                                        $(ev.target).find('.d-table[id="tab_str"] .d-tr:eq(0)').before(tr_mov);	
                                        $(ev.target).find('.d-table[id="tab_str"] #plhold_str').closest('.d-tr').remove();
                                    }
                                }
                            }
                            else if (($(ev.target).attr('id')=='tab_str') || ($(ev.target).closest('.d-table').attr('id')=='tab_str')) {
                                //перенос на первое последнее место итогов
                                console.log('перенос на первое последнее место итогов');
                                if ($(ev.target).attr('id')=='tab_str') {
                                    if ($(ev.target).find('.d-table[id="tab_str"] .d-tr:eq(0)')==$(tr_mov)) { 
                                        $(ev.target).find('.d-table[id="tab_str"] .d-tr').last().after(tr_mov);
                                    }
                                    else {
                                        $(ev.target).find('.d-table[id="tab_str"] .d-tr:eq(0)').before(tr_mov);                                        
                                    }
                                    $(ev.target).find('.d-table[id="tab_str"] #plhold_str').closest('.d-tr').remove();
                                }
                                else if ($(ev.target).closest('.d-table').attr('id')=='tab_str') {
                                    console.log('перенос на первое последнее место итогов $(ev.target).closest(".d-table").attr("id")');
                                    if ($(ev.target).closest('.d-table').find('.d-tr').first().attr('id')==$(tr_mov).attr('id')) { 
                                        $(ev.target).closest('.d-table').find('.d-tr').last().after(tr_mov);
                                    }
                                    else {
                                        $(ev.target).closest('.d-table').find('.d-tr').first().before(tr_mov);
                                    }
                                    if (($(ev.target).attr('id')=='plhold_str') || ($(ev.target).attr('id')=='plhold_val') || ($(ev.target).attr('id')=='plhold_pok'))  {
                                            $(ev.target).closest('.d-tr').remove();
                                    }
                                    else {	
                                            $(ev.target).closest('.d-table').find('#plhold_val').closest('.d-tr').remove();
                                    }
                                }
                            }
			}
			if ($(tab_beg).find('.d-tr').length<=1) {
				if ($(tab_beg).find('.SYSNAME').length==0) {
					if ($(tab_beg).attr('id')=='tab_str') 	{
						$(tab_beg).append('<div class="d-tr">'+
												'<div class="d-td" id="plhold_str" style="height:200px;-webkit-writing-mode: vertical-rl; writing-mode:tb-rl;-webkit-transform: rotate(90deg); transform: rotate(90deg);">'+
													'Перенесите сюда поля строк'+
												'</div>'+
											'</div>');	
					}
					else if ($(tab_beg).attr('id')=='tab_val') 	{
						$(tab_beg).append('<div class="d-tr">'+
												'<div class="d-td" id="plhold_val" style="border:0;">'+
													'Перенесите сюда значения для показателей'+
												'</div>'+	
											'</div>');	
					}
					else if ($(tab_beg).attr('id')=='tab_pok') 	{
						$(tab_beg).append('<div class="d-tr">'+
												'<div class="d-td" id="plhold_pok" style="font-size:10pt;font-weight:bold;">'+
													'Перенесите в эту строку показатель'+
												'</div>'+	
											'</div>');	
					}
				}	
			}	
	   }	   
   }	
   ev.stopPropagation();
   return false;
}