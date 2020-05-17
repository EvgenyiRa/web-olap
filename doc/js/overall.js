$(document).ready(function() {
    /*$('.rep_tab').each(function(i,elem) {
        create_tab($(elem).attr('id'));
    });*/
    $('div.params_group').each(function(i,elem) {
        if ($(elem).find('p').length>0) {
            $(elem).show();
        }
    });
    
    
    $("#group_tab" ).on("click", ".table_play", function() {
        console.log('tut');
        create_tab($(this).attr('id')); 
    });
        
    $(".container_rep" ).on("click", ".tab_sort_up", function() {
        var index_col=$(this).closest('td').index();
        $(this).closest('tbody .tr_name_col').after(
            $(this).closest('tbody').find('.tr_tab').sort(function(a, b) { // сортируем
                var tek_str_a=$(a).find('td:eq('+index_col+')').text().replace(',',".");
                var tek_str_b=$(b).find('td:eq('+index_col+')').text().replace(',',".");
                /*console.log(tek_str_a);
                console.log(tek_str_b);*/
                var tek_num_a=parseFloat(tek_str_a);
                var tek_num_b=parseFloat(tek_str_b);
                if ((isNaN(tek_num_a)) & (isNaN(tek_num_b))) {
                    //console.log('строка');
                    return tek_str_a.localeCompare(tek_str_b);
                }
                else {
                    //console.log('число');
                    return  tek_num_a - tek_num_b;
                }
            })
        );
        //.appendTo($(this).closest('tbody'));// возвращаем в контейнер 
    });
    
    $(".container_rep" ).on("click", ".tab_sort_unup", function() {
        var index_col=$(this).closest('td').index();
        $(this).closest('tbody .tr_name_col').after(
            $(this).closest('tbody').find('.tr_tab').sort(function(a, b) { // сортируем
                /*console.log($(a));*/
                var tek_str_a=$(a).find('td:eq('+index_col+')').text().replace(',',".");
                var tek_str_b=$(b).find('td:eq('+index_col+')').text().replace(',',".");
                /*console.log(tek_str_a);
                console.log(tek_str_b);*/
                var tek_num_a=parseFloat(tek_str_a);
                var tek_num_b=parseFloat(tek_str_b);
                if ((isNaN(tek_num_a)) & (isNaN(tek_num_b))) {
                    //console.log('строка');
                    return tek_str_b.localeCompare(tek_str_a);
                }
                else {
                    //console.log('число');
                    return  tek_num_b - tek_num_a;
                }
            })
        );
        //.appendTo($(this).closest('tbody'));// возвращаем в контейнер 
    });
    
    function open_modal(e) {
        e.preventDefault(); // выключaем стaндaртную рoль элементa
        $('#overlay').fadeIn(400, // снaчaлa плaвнo пoкaзывaем темную пoдлoжку        
        function(){ // пoсле выпoлнения предыдущей aнимaции            
            $('#modal_form') 
                .css('display', 'block') // убирaем у мoдaльнoгo oкнa display: none;
                .animate({opacity: 1, top: '10%'}, 200); // плaвнo прибaвляем прoзрaчнoсть oднoвременнo сo съезжaнием вниз
        });        
    }
    function modal_close() {
        $('#modal_form')
            .animate({opacity: 0, top: '45%'}, 200,  // плaвнo меняем прoзрaчнoсть нa 0 и oднoвременнo двигaем oкнo вверх
                function(){ // пoсле aнимaции
                    $(this).css('display', 'none'); // делaем ему display: none;
                    $('#overlay').fadeOut(400); // скрывaем пoдлoжку
                }
            );
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
        else if ($(pr_active_mod).attr('class')=='md_sql_edit') {
            $('#overlay').after($('.container').hide());
        }
        $('.modal_content').empty();
    }
    
    $( "body" ).on("click", "#modal_close, #overlay, #modal_cancel", function() {
        modal_close();
    });
    $( "body" ).on("click", "#modal_button", function() {
        modal_close(); 
    });
    
	var container=$('div.container');
	$(container).hide();
	var rep_head=$('div#REP_HEAD');
	var names_col=$('#names_col');
	var str_copy=$(names_col).clone();
        var pr_active_mod=$('#rep_head_active');
        
	/*$.ajax({
		  type: "POST",
		  url: "/get-data.php",
		  data: "code_in=1",
		  success: function(html){
			 //console.log( "Прибыли данные: " + html);
			 var cashid=-1;
			 var cat=-1;
			 var tab_fin=$('#one_day > tbody:last');//.append('<tr>...</tr><tr>...</tr>');
			 var tab=$('#one_day');			 			 			
			 $(str_copy).find('td').html('');
			 var segod=$('#segod'); 
			 var pr=1;
			 var restaurant='';
			 var date='';
			 $(html).each(function(i,elem) {				
				if ($(elem).find('#CASHIERID').text()!==cashid) {
					if (cashid!==-1) {
						pr=0;
					}
					cashid=$(elem).find('#CASHIERID').text();
					var str_copy_t=$(str_copy).clone();
					$(str_copy_t).attr('id',cashid)
					$(str_copy_t).find('#CASHIERNAME').html($(elem).find('#CASHIERNAME').text());
					$(str_copy_t).find('#CD_AMOUNT').html((+$(elem).find('#CD_AMOUNT').text()).toFixed(2));
					$(str_copy_t).find('#CD_COUNT').html($(elem).find('#CD_COUNT').text());
					$(str_copy_t).find('#CD_CDCOUNT').html($(elem).find('#CD_CDCOUNT').text());
					$(tab_fin).append(str_copy_t);
				}	
				if (($(elem).find('#CG_NUMINGROUP').text()!==cat) & (pr==1)) {
					cat=$(elem).find('#CG_NUMINGROUP').text();
					$(segod).attr('colspan',+$(segod).attr('colspan')+1);
					$(names_col).append('<td id="'+$(elem).find('#CG_NUMINGROUP').text()+'">'+$(elem).find('#CATEGORY').html()+'</td>');
					str_copy=$(names_col).clone();			 
					$(str_copy).find('td').html('');
					$(tab).find('tr[id="'+cashid+'"]').append('<td id="'+$(elem).find('#CG_NUMINGROUP').text()+'">'+($(elem).find('#CD_AMOUNT').text()/$(elem).find('#CD_COUNT').text()*Math.random()).toFixed(2)+'</td>');	
				}
				if (pr==0) {
					//console.log($(tab).find('tr[id="'+cashid+'"] td[id="'+$(elem).find('#CG_NUMINGROUP').text()+'"]'));
					$(tab).find('tr[id="'+cashid+'"] td[id="'+$(elem).find('#CG_NUMINGROUP').text()+'"]').html(($(elem).find('#CD_AMOUNT').text()/$(elem).find('#CD_COUNT').text()*Math.random()).toFixed(2));	
				}	
                restaurant=$(elem).find('#RESTAURANTNAME').text();		
			});
			$(tab).css("visibility", "visible");
			$('#loading_one_day').remove();
			$('#restaurant').text(restaurant);
			var t_date=new Date;
			$('#date').text(' '+t_date.getDate()+'.'+(t_date.getMonth()+1)+'.'+t_date.getFullYear());
			$('#last_update').text(' '+t_date.getDate()+'.'+(t_date.getMonth()+1)+'.'+t_date.getFullYear()+' '+t_date.getHours()+':'+t_date.getMinutes()+':'+t_date.getSeconds());
		  }
	});*/
	
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

                                                            //параметры отчета
                                                            /*var params_group=$('div.params_group[id="'+id_t+'"]');
                                                            if ($(params_group).find('.in_param_val').length>0) {            
                                                                var params_val=new Object();
                                                                $(params_group).find('.in_param_val').each(function(i,elem) {
                                                                    params_val[i]=$(elem).val();
                                                                    $(elem).attr('value',$(elem).val())
                                                                });
                                                                params['params_val']=JSON.stringify(params_val);
                                                                params['params_html']=$(params_group).html();
                                                            }*/                                                            

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
                                                                        //console.log(JSON.parse(data)); 
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
                                                                                console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                                                                            }
                                                                        });
                                                                    }
                                                                }, 1000);
                                                            }                                                            
                                                        }
						});							
						$(plus_img).attr('src','/img/minus_n.png');				  
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
                              }
                    });
                    modal_close();
		}                
	});
    
    $('div.container_rep').on('click', '.table_active', function(e) {
        //console.log($('.masterdata[id="'+$(this).attr('id')+'"]').html());
        pr_active_mod=$(this);
        var md=$('.masterdata[id="'+$(this).attr('id')+'"]'); 
        $('.modal_content').append(md);
        md.show();
        open_modal(e);
    });
    
    $('div.modal_content').on('click', '.md_sql_edit', function() {
        pr_active_mod=$(this);
        var md=$('.masterdata[id="'+$(pr_active_mod).attr('id')+'"]'); 
        $('.r_table[id="'+$(pr_active_mod).attr('id')+'"]').prepend(md);
        $(md).hide();
        $('.modal_content').html('<div class="md_panel_sql_es">'+
                                        '<a class="md_sql_save" id="'+$(this).attr('id')+'" title="Сохранить структуру" style="z-index: 500000;">'+
                                            '<img src="/img/save.png" width=30 height="auto">'+
                                        '</a>'+
                                    '</div>').append(container);
        var editor=$('div#editor'); 
        //console.log(editor);
        $(editor).html($('.sql_value[id="'+$(this).attr('id')+'"]').html());
        //console.log($('.table_sql[id="'+$(this).attr('id')+'"]').val());        
	$(container).show();
    });
    
    $('div.modal_content').on('click', 'a.md_sql_save', function() {
        //console.log('sohranyaem');
        var editor=$('div#editor');
        var id_t=$(this).attr('id');
        $('.sql_value[id="'+id_t+'"]').html($(editor).html());
        var params = new Object();
        params['code_in']='save_md_str';
        params['sql_true']=$(editor).html().replace(/<[^>]+>/g," ").trim();
        params['sql']=$(editor).html();
        params['tab_id']=id_t;        
        //формируем таблицу с параметрами
        var params_r=param_create(params['sql_true']);
        params['sql_true']=params_r['sql_true'];
        params['params']=JSON.stringify(params_r['params']);
        console.log(params);
        $('#overlay').after($('.container').hide());
        pr_active_mod=$('.table_active[id="'+id_t+'"]');
        $('div.params_group[id="'+id_t+'"]').hide();
        $.ajax({
            type: "POST",
            url: "/get-data.php",
            data: params,
            success: function(html){
//                console.log(html);
                var md=$('.masterdata[id="'+id_t+'"]');
                $('.modal_content').empty().append($(md).html(html).show());                
            },
            error: function(xhr, status, error) {
                console.log(xhr.responseText + '|\n' + status + '|\n' +error);
            }
        });        
    });
    
    function param_create(sql_true) {
        var v_out=new Object();
        var params_p=new Object();
        var pos = sql_true.indexOf(":"); // находим первое совпадение 
        //console.log(pos);
        if (pos>-1) {
            var i_par=1;            
            var pos_pr=sql_true.indexOf(" ",(pos+1));
            if (pos_pr==-1) {
                pos_pr=sql_true.indexOf(",",(pos+1));
                if (pos_pr==-1) {
                    pos_pr=sql_true.indexOf(")",(pos+1));
                    if (pos_pr==-1) {
                        pos_pr=sql_true.indexOf(";",(pos+1));
                    }
                }
            }
            if (pos_pr==-1) {
                params_p[i_par]=sql_true.substring((pos+1));
                pos_pr=pos;
            }
            else {
                params_p[i_par]=sql_true.substring((pos+1),(pos_pr));
            }
            //console.log(pos_pr);
            sql_true=sql_true.substring(0,pos)+'?'+sql_true.substring(pos+1+params_p[i_par].length);
            //console.log(sql_true);
            while ( pos != -1 ) { // до тех пор, пока не перестанут попадаться совпадения (т.е. indexOf не вернёт -1)
               pos = sql_true.indexOf(":",pos+1); // находим следующее значение нужного слова (indexOf ищет начиная с позиции, переданной вторым аргументом)
               //console.log(pos);
               if (pos>-1) {
                    i_par++;
                    pos_pr=sql_true.indexOf(" ",(pos+1));
                    if (pos_pr==-1) {
                        pos_pr=sql_true.indexOf(",",(pos+1));
                        if (pos_pr==-1) {
                            pos_pr=sql_true.indexOf(")",(pos+1));
                            if (pos_pr==-1) {
                                pos_pr=sql_true.indexOf(";",(pos+1));
                            }
                        }
                    }
                    if (pos_pr==-1) {
                        params_p[i_par]=sql_true.substring((pos+1));
                        pos_pr=pos;
                    }
                    else {
                        params_p[i_par]=sql_true.substring((pos+1),(pos_pr));
                    }
                    //console.log(pos_pr);
                    sql_true=sql_true.substring(0,pos)+'?'+sql_true.substring(pos+1+params_p[i_par].length);
                    //console.log(sql_true);
                }
            }
        }
        v_out['sql_true']=sql_true;
        v_out['params']=params_p;
        return v_out;
    }
    
    function create_tab(id_t) {
        var params = new Object();
        params['code_in']='create_tab';
        //console.log('ura');
        
        var md=$('.masterdata[id="'+id_t+'"]');         
        
        params['tab_id']=id_t;
        params['sql_true']=$('.sql_value[id="'+id_t+'"]').html().replace(/<[^>]+>/g," ").trim();
        console.log(params['sql_true']);        
        var params_r=param_create(params['sql_true']);
        params['sql_true']=params_r['sql_true'];
        console.log(params_r['sql_true']);
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
        //итоги 
        if ($(md).find('.d-table[id="tab_str"] .ITOGO_NAME').length>0) {
            console.log($(md).find('.d-table[id="tab_str"] .d-tr[id="_itogo_"]').prev());
            if ($(md).find('.d-table[id="tab_str"] .d-tr[id="_itogo_"]').prev().find('.SYSNAME').length>0) {
                params['tab_str_itog_order']=1;
            }
            else {
                params['tab_str_itog_order']=2;
            }
            params['tab_str_itog_val']=$(md).find('.d-table[id="tab_str"] .sel_itogo[id="'+id_t+'"]').val();
        }
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
        
        //параметры отчета
        var params_group=$('div.params_group[id="'+id_t+'"]');
        if ($(params_group).find('.in_param_val').length>0) {            
            var params_val=new Object();
            $(params_group).find('.in_param_val').each(function(i,elem) {
                params_val[i]=$(elem).val();
                $(elem).attr('value',$(elem).val())
            });
            params['params_val']=JSON.stringify(params_val);
            params['params_html']=$(params_group).html();
        }
        
        if (pr_ok) {
            $('.rep_tab[id="'+id_t+'"]').before('<img src="/img/loading.gif" id="loading_'+id_t+'" width=250 height="auto">').hide();
            console.log(params);
            $.ajax({
                type: "POST",
                url: "/get-data.php",
                data: params,
                dataType:'json',
                success: function(data){
                    console.log(data); 
                    //console.log(JSON.parse(data)); 
                    //console.log($('.masterdata[id="'+id_t+'"] .rep_tab[id="'+id_t+'"]'));
                    var rep_tab=$('.rep_tab[id="'+id_t+'"]');                    
                    $(rep_tab).html(data.tab_html).show().prev().remove();
                    
                    //убираем "дыры" (ввести параметр надобности)                     
                    //console.log(tab_pol);
                    if ($(md).find('.d-table[id="tab_pok"] .SYSNAME').length>0) {
                        //console.log($(rep_tab).find('.tr_pok:last'));
                        $(rep_tab).find('.tr_pok:last td').each(function(i,elem) {
                                //console.log($(elem).index());
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
                                    $(rep_tab).find('.tr_tab').each(function(i2,elem2) {
                                        for (var i = index_beg; i < (index_beg+$(md).find('.d-table[id="tab_val"] .SYSNAME').length); i++) {
                                            $(elem2).find('td:eq('+index_beg+')').remove();                                         
                                        }                                                                                                             
                                    });
                                    $(elem).remove();
                                }
                        });
                    }
                },
                error: function(xhr, status, error) {
                    console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                }
            });

            //modal_close();
        }
    }
    
    $('div.modal_content').on('click', '.md_save', function() {
        var id_t=this.id;
        var params = new Object();
        params['code_in']='md_save';
        var md=$('.masterdata[id="'+id_t+'"]');         
        params['tab_id']=id_t;
        params['sql_true']=$('.sql_value[id="'+id_t+'"]').html().replace(/<[^>]+>/g,"\u00A0");
        params['mdata']=$(md).html();
        var pr_ok=true;
        if ($(md).find('.d-table[id="tab_str"] .SYSNAME').length==0) {
            pr_ok=false;
            alert('Для "Полей строк" необходимо наличие не менее одного элемента');
        }
        if ($(md).find('.d-table[id="tab_val"] .SYSNAME').length==0) {
            pr_ok=false;
            alert('Для "Значений показателей" необходимо наличие не менее одного элемента');
        }
        if (pr_ok) {
            var tr_params=$('div.params[id="'+id_t+'"] div.tr_params');
            console.log(tr_params);
            if ($(tr_params).length>0) {
                params['params_html']='<p>Параметры отчета</p>';
                $(tr_params).each(function(i,elem) {
                    var name_par_one='';
                    if ($(elem).find('.in_param_name').val()=='') {
                        name_par_one=$(elem).attr('id');
                    }
                    else {
                        name_par_one=$(elem).find('.in_param_name').val();
                    }
                    params['params_html']+='<p class="p_param" id="'+$(elem).attr('id')+'">'+name_par_one+'<input id="'+$(elem).attr('id')+'" class="in_param_val" type="'+$(elem).find('.sel_param_type').val()+'" placeholder="Введите значение параметра"></p>';                    
                });
                $('div.params_group[id="'+id_t+'"]').html(params['params_html']).show();
            }
            else {
                params['params_html']='';
                $('div.params_group[id="'+id_t+'"]').hide();
            }
            console.log(params);
            $.ajax({
                type: "POST",
                url: "/get-data.php",
                data: params,
                success: function(data){
                    console.log(data); 
                    //console.log(JSON.parse(data)); 
                    //console.log($('.masterdata[id="'+id_t+'"] .rep_tab[id="'+id_t+'"]'));
                    //$('.rep_tab[id="'+id_t+'"]').html(data.tab_html).show().prev().remove();
                },
                error: function(xhr, status, error) {
                    console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                }
            });
            $('.rep_tab[id="'+id_t+'"]').hide();
            modal_close();
        }        
    });
    
    
    //необходимо для правильного сохранения html и последующего восстановления
    $('div.modal_content').on('change', '.sel_val_aggr,.sel_itogo', function() {
        $(this).find('option').removeAttr("selected");
        $(this).find('option[value="'+$(this).val()+'"]').attr('selected', '');
    });
    
    $('div.modal_content').on('change', '.sel_itogo', function() {
        $(this).closest('.d-tr').find('.d-td:eq(0)').attr('title','Текущий вариант подсчета итого: "'+$(this).find('option[value="'+$(this).val()+'"]').text()+'"');        
    }); 
    
    $('div.container_rep').on('click', '.tr_tab', function() {
        $(this).toggleClass("click_color");
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
	   var id = ev.dataTransfer.getData("Text");
	   var tab_beg=$('#'+id).closest('.d-table');
           var tab_val_sel='<select  class="sel_val_aggr" id="'+id+'" title="Агрегирование">'+
                        //'<option disabled>Агрегирование</option>'+
                        '<option selected value="MAX">Максимум</option>'+
                        '<option value="MIN">Минимум</option>'+
                        '<option value="SUM">Сумма</option>'+
                        '<option value="AVG">Среднее значение</option>'+
                        '<option value="COUNT">Количество</option>'+
                    '</select>';
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
                                $(tr_mov).find('.d-td:eq(1)').html(tab_val_sel);
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