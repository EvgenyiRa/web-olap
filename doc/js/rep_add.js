/*WEB-OLAP v1.0
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
var prAlert=false;
function customAlert(txt, callback) {
    $(modal_header).find('#modal_head_p').html('Информационное сообщение');
    $(modal_form).find('.modal_content').html('<p class="c_confirm">'+txt+'</p>');
    $(modal_form).css({'width':'40vw','height':'40vh'});
    $(modal_footer).find('#modal_save').removeAttr('place').text('OK'); 
    $(modal_footer).find('#modal_cancel').removeAttr('place').hide();
    prAlert=true;
    open_modal();
    if (!!callback) {
        var MyInt= setInterval(function(){
            if (!prAlert) {
                clearInterval (MyInt);
                //задержка для анимации модального окна
                var overlay_v=$('#overlay');
                var MyInt2= setInterval(function(){
                    if (!$(overlay_v).is(':visible')) {
                        clearInterval (MyInt2);
                        callback();
                    }
                },500);                    
            }
        },500);   
    }    
}

var resConfirm=false,
    prConfirm=false;
function customConfirm(qstn, callback) {
    $(modal_header).find('#modal_head_p').html('Диалоговое сообщение');
    $(modal_form).find('.modal_content').html('<h5>'+qstn+'</h5>');
    $(modal_form).css({'width':'40vw','height':'40vh'}); 
    $(modal_footer).find('#modal_cancel').text('Нет').removeAttr('place').show();
    $(modal_footer).find('#modal_save').text('Да').removeAttr('place').focus();        
    resConfirm=false;
    prConfirm=true;
    open_modal(); 
    var MyInt= setInterval(function(){
        if (!prConfirm) {
            clearInterval (MyInt);
            //задержка для анимации модального окна
            var overlay_v=$('#overlay');
            var MyInt2= setInterval(function(){
                if (!$(overlay_v).is(':visible')) {
                    clearInterval (MyInt2);
                    callback(resConfirm);
                }
            },500);                    
        }
    },500);      
};

function loading_img_show() {
    var width=window.innerWidth,
        height=window.innerHeight;
    $(loading_img).show().css({top:((height-$(loading_img).height())/2),left:((width-$(loading_img).width())/2)});
}    

function byteLength(str) {
  // returns the byte length of an utf8 string
  var s = str.length;
  for (var i=str.length-1; i>=0; i--) {
    var code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s+=2;
    if (code >= 0xDC00 && code <= 0xDFFF) i--; //trail surrogate
  }
  return s;
}

function toDate(dateStr) {
    var mass_date=dateStr.split("."),
        day=mass_date[0], 
        month=parseInt(mass_date[1]), 
        year=mass_date[2];
    return new Date(year, month - 1, day);
}

function getHexRGBColor(color)
{
  color = color.replace(/\s/g,"");
  var aRGB = color.match(/^rgb\((\d{1,3}[%]?),(\d{1,3}[%]?),(\d{1,3}[%]?)\)$/i);
 
  if(aRGB)
  {
    color = '';
    for (var i=1;  i<=3; i++) color += Math.round((aRGB[i][aRGB[i].length-1]=="%"?2.55:1)*parseInt(aRGB[i])).toString(16).replace(/^(.)$/,'0$1');
  }
  else color = color.replace(/^#?([\da-f])([\da-f])([\da-f])$/i, '$1$1$2$2$3$3');
   
  return color;
}

function trim (str) {
  return str.replace(/^\s+|\s+$/gm,'');
}

function rgbaToHex (rgba) {
    var parts = rgba.substring(rgba.indexOf("(")).split(","),
        r = parseInt(trim(parts[0].substring(1)), 10),
        g = parseInt(trim(parts[1]), 10),
        b = parseInt(trim(parts[2]), 10),
        a = parseFloat(trim(parts[3].substring(0, parts[3].length - 1))).toFixed(2);

    return (r.toString(16) + g.toString(16) + b.toString(16) + (a * 255).toString(16).substring(0,2));
}

function secondstotime(secs)
{
    var t = new Date(1970,0,1);
    t.setSeconds(secs);
    var s = t.toTimeString().substr(0,8);
    if(secs > 86399)
        s = Math.floor((t - Date.parse("1/1/70")) / 3600000) + s.substr(2);
    return s;
}

function validColor(color) {
    var el = document.createElement("div");  
    $(el).css("border", "1px solid "+color);
    return ($(el).css("border-color")!="")
}

function HtmlEncode(s) {
    var el = document.createElement("div");
    el.innerText = el.textContent = s;
    s = el.innerHTML;
    return s;
}

function removeCSS(element,style) {
    if ($(element).css(style)!='') {
        $(element).css(style,'');
    }
}    
            

function td_recover(elem,updSel,mass_left_cols) {
    var row_count=$(elem).attr('rowspan');
    var mass_index_cols=[];
    if (!!!row_count) {
        row_count=1;
    }
    var col_count=$(elem).attr('colspan');
    var count_col_add;
    var thead=$(table_all_tag).find('thead:first tr:last td:gt(0)')
    if ((col_count>1) || (row_count>1)) {
        //console.log($(elem).attr('rowspan'));
        var tr_index=$(elem).closest('tr').index();
        var td_index=-1,td_index_del_class,index_add=0,index_add_const=+mass_left_cols[$(elem).offset().left],elem_td_index=$(elem).index();        
        //var tab_right_index=$(table_all_tag).find('tbody tr:last td:last').index();
        var tek_tr=$(elem).closest('tr');
        for (var i1=1; i1<=row_count; i1++) {
            if (i1==1) {
                count_col_add=col_count-1;
                td_index=elem_td_index;
                td_index_del_class=elem_td_index+1;
                index_add=Number(mass_left_cols[$(elem).offset().left]);            
            }
            else {
                count_col_add=col_count;
                td_index=elem_td_index-1;
                td_index_del_class=elem_td_index;
                index_add=Number(mass_left_cols[$(elem).offset().left]);
            }
            for (var j=count_col_add; j>=1; j--) {
                var td_add=$(elem).clone().removeClass(('c'+(index_add_const-1)+' r'+tr_index));
                $(td_add).html('').attr('colspan','1').attr('rowspan','1').attr('id',((index_add+Number(j)-1)+'-'+(tr_index+i1-1))).addClass('c'+(Number(index_add)+Number(j)-1)+' r'+(Number(tr_index)+i1-1));
                var td_for_after=$(tek_tr).find('td:eq('+td_index+')');
                while ($(td_for_after).length==0) {
                    td_index-=1;
                    td_for_after=$(tek_tr).find('td:eq('+td_index+')');
                }
                $(td_for_after).after(td_add);
            }  
            $(thead).each(function(i,elem2) {
                var tek_index=$(elem2).attr('id').split('-')[1];
                mass_index_cols[tek_index]=$(elem2).text();                
                mass_left_cols[$(elem2).offset().left]=tek_index;
            });
            tek_tr=$(tek_tr).next();
        }
        $(elem).attr('colspan','1').attr('rowspan','1');
        if (updSel) {
            $('#my').jexcel('updateSelection', elem, elem, 1);
        }    
    } 
}

function td_plus(tds) {
    //var tds=$('#my').jexcel('getSelectedCells');
    //console.log(tds);
    if (($(tds).length<2) & ($(tds).first().attr('colspan')==1) & ($(tds).first().attr('rowspan')==1)) {
        alert('Для объединения ячеек таблицы необходимо выбрать более одной');
        return;
    }
    if (($(tds).find('.in_param_val,div#group_tab')>0) || ($(tds).filter('[olap_tab_id]').length>0)) {
        alert('Объединение ячеек принадлежащих olap-кубам запрещено');
        return;
    }
    $(tds).removeClass('highlight').css({'-webkit-filter':'','filter':''});     
    var beg_td_index=Number($(tds).first().attr('id').split('-')[0]);
    var end_td_index=Number($(tds).last().attr('id').split('-')[0]);

    //проверяем корректность набора ячеек
    var min_i=999999,max_i=0,min_j=999999,max_j=0;
    $(tds).each(function(i,elem) {
        //console.log(elem);
        //console.log($(elem).index());
        if ($(elem).closest('tr').index()<min_i) {
            min_i=$(elem).closest('tr').index();
        }
        if ($(elem).closest('tr').index()>max_i) {
            max_i=$(elem).closest('tr').index();
        }
        var td_index=+$(elem).attr('id').split('-')[0];
        if (td_index<min_j) {
            min_j=td_index;
        }
        if (td_index>max_j) {
            max_j=td_index;
        }
    });
    var pr_kor=true;
    for (var j=(min_j); j<=(max_j); j++) {
        if (($(tds).filter('#'+j+'-'+min_i).length==0) || ($(tds).filter('#'+j+'-'+max_i).length==0)) {
            pr_kor=false;
            break;
        }
    } 
    if (pr_kor) {
        for (var i=(min_i+1); i<max_i; i++) {
            if (($(tds).filter('#'+(min_j)+'-'+i).length==0) || ($(tds).filter('#'+(max_j)+'-'+i).length==0)) {
                pr_kor=false;
                break;
            }
        }
    }
    if (!pr_kor) {
        alert('Запрещено объеденение пересекающихся областей, область может быть только включена в новую область');
        return;
    }

    var mass_index_cols=[],mass_left_cols=[];
    var thead=$(table_all_tag).find('thead:first tr:last td:gt(0)');
    $(thead).each(function(i,elem) {
        var tek_index=$(elem).index();
        mass_index_cols[tek_index]=$(elem).text();                
        mass_left_cols[$(elem).offset().left]=tek_index;
    });
    //восстанавливаем в наборе удаленные ячейки, если до этого было объединение            
    $(tds).each(function(i,elem) {
        td_recover(elem,false,mass_left_cols);        
    });
    
    $(thead).each(function(i,elem) {
        var tek_index=$(elem).index();
        mass_index_cols[tek_index]=$(elem).text();                
        mass_left_cols[$(elem).offset().left]=tek_index;
    });
    
    //console.log(mass_left_cols);
    $(tds).first().attr('colspan',(end_td_index-beg_td_index+1))
                  .attr('rowspan',($(tds).last().closest('tr').index()-$(tds).first().closest('tr').index()+1));
    for (var i = min_i; i<=max_i; i++) {
        //console.log($(tds).closest('tr')/*.find('td:eq('+j+')')**/);
        var j_true,td_index_del,end_td_index_true;                
        if (i==min_i) {
            j_true = beg_td_index+1;
            end_td_index_true=end_td_index;
        }
        else {
           j_true = beg_td_index;
           end_td_index_true=end_td_index+1;
        }           
        //console.log(j);
        //var tab_count_col=$(table_all_tag).find('tbody tr:last td:last').index();
        for (var j=j_true; j<=end_td_index; j++) {
            $(tds).filter('td[id="'+j+'-'+i+'"]').remove();  
        }               
    }    
    $('#my').jexcel('updateSelection', $(tds).first(), $(tds).first(), 1);
    save_tab_data();
}

function calc_xlsx(tab_tr,pr_only_olap) {
    //массив и функция стилей
    var mass_font=[],mass_fill=[],mass_border=[],count_style=2,count_font=2,count_fill=2,count_border=1,calc_style='',calc_font='',calc_fill='',calc_border='',
        font_default='"times new roman"14pxrgb(0, 0, 0)400normalnone solid rgb(0, 0, 0)',
        fill_default='rgb(255, 255, 255) none repeat scroll 0% 0% / auto padding-box border-box',
        border_default='<border><left/><right/><top/><bottom/><diagonal/></border>',
        style_default_xml='<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1">'+
                                    '<alignment horizontal="center" vertical="center" wrapText="1"/>'+
                                 '</xf>',                      
        font_default_num=1,style_default=1,fill_default_num=1,fill_default_num_true=0,border_default_num=0,border_merge_row=[],
        calc_mass_border_mass=[];

    //если присутствует пагинатор (2D-режим), то работаем над клоном, в который подгружаем все недостающие страницы
    var table_tag_v=$(table_tag),
        mass_paginator=$(tab_tr).find('td div[id="group_tab"] div.page_panel');
    //для 2Д-режима при выгрузке только таблицы заполняем массив соответствия ячеек и стилей (достаточно 3 строки)
    var td_style=[],td_height=[];    
    $(tab_tr).each(function(i,elem_tr) {
        $(elem_tr).attr('xlsx_height',parseFloat($(elem_tr).height())/1.27);
        
        var elem,
            tek_index_row_oo,
            td_elem,
            tek_height;            
        if (pr_only_olap) {
            tek_index_row_oo=i;
            td_style[tek_index_row_oo]={};
            elem=$(table_tag_v).find('tr[id="'+$(elem_tr).attr('id')+'"]');
            td_height[tek_index_row_oo]=tek_height;
            td_elem=$(elem).find('td[olap_tab_id]');
        }
        else {
            elem=elem_tr;
            td_elem=$(elem).find('td:gt(0)');
        }
        calc_mass_border_mass[i]=[];
        $(td_elem).each(function(i2,elem2) {
            //рассчитываем стиль и сохраняем в атрибут номер стиля: при выгрузке с наличием пагинатора
            //смотрим фонты
            var tek_font=$(elem2).css('font-family')+$(elem2).css('font-size')+$(elem2).css('color')+$(elem2).css('font-weight')+$(elem2).css('font-style')+$(elem2).css('text-decoration');
            var tek_font_num=font_default_num;
            var pr_new_style=false;
            var pr_ex_font=false;
            //console.log(tek_font);
            if (font_default!=tek_font) {
                //font_default
                if (mass_font.length>0) {
                    pr_ex_font=false;
                    mass_font.forEach(function(element, index) {
                        if (element==tek_font) {
                            tek_font_num=index+font_default_num+1;
                            pr_ex_font=true;
                            return false;
                        }    
                    });
                    if (!pr_ex_font) {
                        pr_new_style=true;
                        mass_font.push(tek_font);
                        tek_font_num=mass_font.length+font_default_num;
                    }
                }
                else {
                    pr_new_style=true;
                    mass_font.push(tek_font);
                    tek_font_num=mass_font.length+font_default_num;
                }
            }
            else {
                pr_ex_font=true;
            }
            if (!pr_ex_font) {
                count_font+=1;
                var font_color=$(elem2).css('color');
                if (!!!font_color) {
                    font_color='000000';
                }
                if (font_color.indexOf('rgb')>-1) {
                    font_color=getHexRGBColor(font_color);
                }
                var font_family=$(elem2).css('font-family').replace(/\"/g, '')
                calc_font+='<font>';
                if ($(elem2).hasClass('font_bold')) {
                    calc_font+= '<b />';
                }
                if ($(elem2).css('font-style')=='italic') {
                    calc_font+= '<i />';
                }
                if ($(elem2).hasClass('font_podcherk')) {
                    calc_font+= '<u />';
                }
                else if ($(elem2).hasClass('font_zacherk')) {
                    calc_font+= '<u />';
                }
                calc_font+=     '<sz val="'+parseInt($(elem2).css('font-size'))+'" />'+
                                '<color rgb="'+font_color+'" />'+
                                '<name val="'+font_family+'" />'+
                                '<family val="1" />'+
                                '<charset val="204" />'+
                            '</font>';
            }

            //заливка
            var pr_ex_fill=false,
                tek_fill=$(elem2).css('background'),
                tek_fill_num=fill_default_num_true;
            //console.log(tek_fill);
            if (fill_default!=tek_fill) {
                //font_default
                if (mass_fill.length>0) {
                    pr_ex_fill=false;
                    mass_fill.forEach(function(element, index) {
                        if (element==tek_fill) {
                            tek_fill_num=index+fill_default_num+1;
                            pr_ex_fill=true;
                            return false;
                        }    
                    });
                    if (!pr_ex_fill) {
                        pr_new_style=true;
                        mass_fill.push(tek_fill);
                        tek_fill_num=mass_fill.length+fill_default_num;
                    }
                }
                else {
                    pr_new_style=true;
                    mass_fill.push(tek_fill);
                    tek_fill_num=mass_fill.length+fill_default_num;
                }
            }
            else {
                pr_ex_fill=true;
            }
            if (!pr_ex_fill) {
                count_fill+=1;
                var td_color;
                td_color=tek_fill;
                if (!!!td_color) {
                    td_color='ffffff';
                }
                if (td_color.indexOf('none repeat')>-1) {
                    td_color=td_color.substring(0,td_color.indexOf(')')+1);
                }  
                //console.log(td_color);
                if (td_color.indexOf('rgb')>-1) {
                    td_color=getHexRGBColor(td_color);
                }

                calc_fill+='<fill>'+
                                '<patternFill patternType="solid">'+
                                    '<fgColor rgb="'+td_color+'" />'+
                                    '<bgColor rgb="'+td_color+'" />'+
                                '</patternFill>'+
                            '</fill>';      
            }

            //рамки
            var calc_mass_border=get_calc_border(elem2,pr_new_style,border_default_num); 
            pr_new_style=calc_mass_border['pr_new_style_f'];
            var tek_border_num=calc_mass_border['tek_border_num'];
            if (!calc_mass_border['pr_ex_border']) {
                count_border+=1;                                                                                               
                calc_border+=calc_mass_border['tek_border'];                                                   
            }                    


            var tek_style=style_default;
            var ex_el;
            var text_align=$(elem2).css('text-align');
            var vertical_align=$(elem2).css('vertical-align');
            if ((vertical_align=='middle') || (vertical_align=='')) {
                vertical_align='center';
            } 
            if ((text_align=='-webkit-center') || (text_align=='')) {
                text_align='center';
            }    
            if (pr_new_style) {
                count_style+=1;
                tek_style=count_style-1;
                calc_style+='<xf numFmtId="0" fontId="'+tek_font_num+'" fillId="'+tek_fill_num+'" borderId="'+tek_border_num+'" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1">'+
                                '<alignment horizontal="'+text_align+'" vertical="'+vertical_align+'" wrapText="1"/>'+
                             '</xf>';
            }
            else {
                //проверяем наличие комбинации из фонта, заливки и рамок
                ex_el=$(style_default_xml).filter('[fontId="'+tek_font_num+'"][fillId="'+tek_fill_num+'"][borderId="'+tek_border_num+'"]').find('alignment[horizontal="'+text_align+'"][vertical="'+vertical_align+'"]').first();
                if ($(ex_el).length==0) {
                    ex_el=$(calc_style).filter('[fontId="'+tek_font_num+'"][fillId="'+tek_fill_num+'"][borderId="'+tek_border_num+'"]').find('alignment[horizontal="'+text_align+'"][vertical="'+vertical_align+'"]').first();
                    if ($(ex_el).length!=0) {
                        tek_style=$(ex_el).closest('xf').index()+style_default+1;
                    }    
                    else {
                        calc_style+='<xf numFmtId="0" fontId="'+tek_font_num+'" fillId="'+tek_fill_num+'" borderId="'+tek_border_num+'" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1">'+
                                        '<alignment horizontal="'+text_align+'" vertical="'+vertical_align+'" wrapText="1"/>'+
                                     '</xf>';
                        count_style+=1;
                        tek_style=count_style-1;
                    }
                }                        
            }
            calc_mass_border_mass[i,i2]=calc_mass_border;
            $(elem2).attr('xlsx_style_num',tek_style)
                    .attr('xlsx_border',String(i)+'-'+String(i2));
        });    
    });
    
    //var tab_tr=$(table_tag).find('tr');
    
    if (($(mass_paginator).length>0) && (!pr_only_olap)) {
        tab_tr=$(tab_tr).clone();
        $(mass_paginator).each(function(i,elem) {
            //запоминаем последнюю,предпоследнюю,первую строки таблицы чтобы корректно построить стили и классы
            var paginGp=$(elem).closest('div[id="group_tab"]'),
                olap_design=$(paginGp).find('div.table_save_design_val[id='+$(elem).attr('id')+']').text().trim(),
                paginLastTrFirst,
                paginLastTrLast,
                paginLastTrPreLast,
                paginTrAll=$(tab_tr).filter('[olap_tr_class_'+$(elem).attr('id')+'="tr_tab"]'),
                paginBegIndex=$(paginTrAll).first().find('td[olap_tab_id="'+$(elem).attr('id')+'"]:first').attr('id').split('-');
            if (olap_design=='') {
                olap_design=$(paginTrAll).clone();
                paginLastTrFirst=$(olap_design).first().clone();
                paginLastTrLast=$(olap_design).last().clone();
                if ($(paginTrAll).length>1) {
                    paginLastTrPreLast=$(olap_design[olap_design.length-2]).clone();//не возможно обратиться к предыдщему элементу перед последним через $, хз почему, работаем напрямую с массивом          
                }
                else {
                    paginLastTrPreLast=$(paginLastTrLast).clone();
                }
            }
            else {
                olap_design=$(LZString.decompressFromUTF16(olap_design)).filter('[olap_tr_class_'+$(elem).attr('id')+'="tr_tab"]');
                //проставляем атрибуты xlsx заданные выше
                paginLastTrFirst=$(olap_design).first().attr('xlsx_height',$(paginTrAll).first().attr('xlsx_height'));
                paginLastTrLast=$(olap_design).last().attr('xlsx_height',$(paginTrAll).last().attr('xlsx_height'));
                if ($(olap_design).length>1) {
                    paginLastTrPreLast=$(olap_design).last().prev().attr('xlsx_height',$(paginTrAll).last().prev().attr('xlsx_height'));
                }
                else {
                    paginLastTrPreLast=$(paginLastTrLast).clone();
                }
                var paginTekTd=$(paginTrAll).first().find('td:gt(0)').first();            
                $(paginLastTrFirst).find('td:gt(0)').each(function(i2,elem2) {
                    $(elem2).attr('xlsx_style_num',$(paginTekTd).attr('xlsx_style_num'))
                            .attr('xlsx_border',$(paginTekTd).attr('xlsx_border'));
                    paginTekTd=$(paginTekTd).next();
                });
                var paginTekTd=$(paginTrAll).last().find('td:gt(0)').first();            
                $(paginLastTrLast).find('td:gt(0)').each(function(i2,elem2) {
                    $(elem2).attr('xlsx_style_num',$(paginTekTd).attr('xlsx_style_num'))
                            .attr('xlsx_border',$(paginTekTd).attr('xlsx_border'));
                    paginTekTd=$(paginTekTd).next();
                });
                var paginTekTd;
                if ($(paginTrAll).length>1) {
                    paginTekTd=$(paginTrAll[paginTrAll.length-2]).find('td:gt(0)').first();//не возможно обратиться к предыдщему элементу перед последним через $, хз почему, работаем напрямую с массивом 
                }  
                else {
                    paginTekTd=$(paginTrAll).last().find('td:gt(0)').first();  
                }
                $(paginLastTrPreLast).find('td:gt(0)').each(function(i2,elem2) {
                    $(elem2).attr('xlsx_style_num',$(paginTekTd).attr('xlsx_style_num'))
                            .attr('xlsx_border',$(paginTekTd).attr('xlsx_border'));
                    paginTekTd=$(paginTekTd).next();
                });
                
            }            
            //удаляем классы разметки и айди у заготовок
            $(paginLastTrFirst).find('td:gt(0)').each(function(i2,elem2) {
                var mass_index=$(elem2).attr('id').split('-');
                $(elem2).attr('id',mass_index[0]).removeClass('c'+mass_index[0]+' r'+mass_index[1]);
            }); 
            $(paginLastTrLast).find('td:gt(0)').each(function(i2,elem2) {
                var mass_index=$(elem2).attr('id').split('-');
                $(elem2).attr('id',mass_index[0]).removeClass('c'+mass_index[0]+' r'+mass_index[1]);
            });
            $(paginLastTrPreLast).find('td:gt(0)').each(function(i2,elem2) {
                var mass_index=$(elem2).attr('id').split('-');
                $(elem2).attr('id',mass_index[0]).removeClass('c'+mass_index[0]+' r'+mass_index[1]);
            });
            //запрашиваем все страницы (включая текущую), чтобы корректно построить общую таблицу
            var paginTrNew=$(document.createDocumentFragment()),
                paginPageControl=$(elem).find('a.page_control[id!="prev"][id!="next"]'),
                in_rep_id=$('input#in_rep_id').val(),
                paginTekNumStr=+paginBegIndex[1];                
            $(paginPageControl).each(function(i2,elem2) {
                var params={};
                params['get_page']=$(elem2).attr('id');
                params['pr_2D']=7;
                params['in_rep_id']=in_rep_id;
                params['tab_id']=$(elem).attr('id');
                if ($(elem).find('img').length>0) {
                    //передаем максимальную страницу, если ещё не подгрузилось            
                    params['max_page']=$(paginPageControl).last().text();
                }
                $.ajax({
                    type: "POST",
                    url: "/get-olap.php",
                    data: params,
                    dataType:'json',
                    async: false,                            
                    success: function(data){
                        $(data.tab_html).find('tr.tr_tab').each(function(i3,elem3) {                            
                            var trNew=$(paginLastTrPreLast).clone().attr('id','row-'+String(paginTekNumStr)),
                                //paginTekTd=$(trNew).find('td[olap_tab_id="'+$(elem).attr('id')+'"]').first(),
                                paginTekNumCol=+paginBegIndex[0];                                   
                            $(elem3).find('td').each(function(i4,elem4) {
                                $(trNew).find('td[olap_td_index="'+i4+'"]')
                                    .html($(elem4).html())
                                    .attr('id',String(paginTekNumCol)+'-'+String(paginTekNumStr))
                                    //.addClass('r'+String(paginTekNumStr)+' c'+String(paginTekNumCol));
                                //paginTekTd=$(paginTekTd).next(); 
                                ++paginTekNumCol;
                            });
                            $(paginTrNew).append(trNew);
                            ++paginTekNumStr;
                        });
                    },
                    error: function(xhr, status, error) {
                        alert('Запуск оказался неудачным.');
                        console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                    }
                });    
            });
            //console.log('paginTrNew',paginTrNew);
            var index_del;
            //в клоне+фрагмент не так просто удалять и добавлять новые элементы, но работает быстрее засчет того, что элементы в браузере не перерисовываются
            $(tab_tr).each(function(i2,elem2) {
                if ($(elem2).attr('id')===$(paginTrAll).first().attr('id')) {
                    index_del=i2;
                    return false;
                }
            });
            tab_tr.splice(index_del, $(paginTrAll).length);
            var last_i2;
            $(paginTrNew[0].children).each(function(i2,elem2) {
                tab_tr.splice((index_del+i2), 0, elem2); 
                last_i2=i2;
            });
            
            //для первой и последней строки обновляем стили
            var paginTekTd=$(paginLastTrFirst).find('td[olap_tab_id="'+$(elem).attr('id')+'"]').first();            
            $(tab_tr[index_del]).find('td[olap_tab_id="'+$(elem).attr('id')+'"]').each(function(i2,elem2) {
                $(elem2)
                    .attr('style',$(paginTekTd).attr('style'))
                    .addClass($(paginTekTd).attr('class'))
                    .attr('xlsx_style_num',$(paginTekTd).attr('xlsx_style_num'))
                    .attr('xlsx_border',$(paginTekTd).attr('xlsx_border'));
                paginTekTd=$(paginTekTd).next();
            })
            paginTekTd=$(paginLastTrLast).find('td[olap_tab_id="'+$(elem).attr('id')+'"]').first();            
            $(tab_tr[index_del+last_i2]).find('td[olap_tab_id="'+$(elem).attr('id')+'"]').each(function(i2,elem2) {
                $(elem2)
                    .attr('style',$(paginTekTd).attr('style'))
                    .addClass($(paginTekTd).attr('class'))
                    .attr('xlsx_style_num',$(paginTekTd).attr('xlsx_style_num'))
                    .attr('xlsx_border',$(paginTekTd).attr('xlsx_border'));
                paginTekTd=$(paginTekTd).next();
            })
            
            //обновяем индексы для строк ниже таблицы
            for (var i = (index_del+last_i2+1); i < $(tab_tr).length; i++) {
                var tr_last=tab_tr[i],
                    tr_index,
                    tr_last_prev=tab_tr[i-1];
                if ($(tr_last_prev).length>0) {
                    tr_index=Number($(tr_last_prev).attr('id').split('-')[1])+1;
                }
                else {
                    tr_index=0;
                }
                $(tr_last).attr('id','row-'+tr_index);
                $(tr_last).find('td:not(.jexcel_label)').each(function(i,elem) {
                    var coord = $(elem).prop('id').split('-');
                    $(elem).removeClass('r'+coord[1]).addClass('r'+tr_index).attr('id',coord[0]+'-'+tr_index);                
                });
            }  

        });
    }    
        
    var mass_index_cols=[],mass_index_rows=[]/*,mass_left_cols=[]*/;
    var table_all=$(table_all_tag);
    var xml_list_top_cols='';
    var //символ перехода на новую строку, надо заменить
        s_dn=String.fromCharCode(10);
    $(table_all).find('thead:first tr:last td:gt(0)').each(function(i,elem) {
        var tek_index=$(elem).index();
        mass_index_cols[tek_index]=/*$(elem).text()*/getColumnName(tek_index);                
        //mass_left_cols[$(elem).offset().left]=tek_index;
        xml_list_top_cols+='<col min="'+tek_index+'" max="'+tek_index+'" width="'+(parseFloat($(elem).width())/5)+'" customWidth="1"/>';                
    });
    var table_all_thead_td=$(table_all).find('thead tr:last td');    
    if (pr_only_olap) {
        xml_list_top_cols='';
        $(tab_tr).first().find('td[olap_tab_id]').each(function(i,elem) {
            var tek_width=parseFloat($(table_all_thead_td).filter('[id="col-'+$(elem).attr('id').split('-')[0]+'"]').width())/5;
            xml_list_top_cols+='<col min="'+(i+1)+'" max="'+(i+1)+'" width="'+tek_width+'" customWidth="1"/>';
        });        
    }    
    var xml_list='';
    var num_v=-1;
    var xml_list3='';
    var merge_count=0,merge_str='';

    function to_hex_xlsx(tek_border) {
        var td_color=tek_border;
        if (!!!td_color) {
            td_color='000000';
        }
        if (td_color.indexOf('none repeat')>-1) {
            td_color=td_color.substring(0,td_color.indexOf(')')+1);
        }  
        //console.log(td_color);
        if (td_color.indexOf('rgba')>-1) {
            td_color=rgbaToHex (td_color)
        }                
        else if (td_color.indexOf('rgb')>-1) {
            td_color=getHexRGBColor(td_color);
        }
        return td_color;
    }
    function to_style_xlsx(border_style,border_w) {
        var border_style_xlsx='';
        if ((border_w===0) || (border_style=='none')) {
            border_style_xlsx='';
        }
        else if ((border_style=='solid') & ((isNaN(border_w)) || (border_w<3)))  {
            border_style_xlsx='thin'
        }
        else if (border_style=='double') {
            border_style_xlsx='double'
        }
        else if (border_style=='dotted') {
            border_style_xlsx='dotted'
        }
        else if (border_style=='outset') {
            border_style_xlsx='mediumDashDotDot'
        }
        else  if ((border_style=='solid') & ((!isNaN(border_w)) || (border_w>2))) {
            border_style_xlsx='thick';
        }
        else {
            border_style_xlsx='thin';
        }
        return border_style_xlsx;
    }

    function get_calc_border(elem_border,pr_new_style,border_default_num) {
        var pr_ex_border=false,
            border_top_style=$(elem_border).css('border-top-style'),
            border_right_style=$(elem_border).css('border-right-style'),
            border_bottom_style=$(elem_border).css('border-bottom-style'),
            border_left_style=$(elem_border).css('border-left-style'),
            border_top_color=$(elem_border).css('border-top-color'),
            border_right_color=$(elem_border).css('border-right-color'),
            border_bottom_color=$(elem_border).css('border-bottom-color'),
            border_left_color=$(elem_border).css('border-left-color'),
            
            border_top_w=parseInt($(elem_border).css('border-top-width')),
            border_right_w=parseInt($(elem_border).css('border-right-width')),
            border_bottom_w=parseInt($(elem_border).css('border-bottom-width')),
            border_left_w=parseInt($(elem_border).css('border-left-width')),
            
            border_top_style_xlsx=to_style_xlsx(border_top_style,border_top_w),
            border_right_style_xlsx=to_style_xlsx(border_right_style,border_right_w),
            border_bottom_style_xlsx=to_style_xlsx(border_bottom_style,border_bottom_w),
            border_left_style_xlsx=to_style_xlsx(border_left_style,border_left_w), 
            
            border_top_color_hex=(border_top_style_xlsx=='') ? '000000':to_hex_xlsx(border_top_color),
            border_right_color_hex=(border_right_style_xlsx=='') ? '000000':to_hex_xlsx(border_right_color),
            border_bottom_color_hex=(border_bottom_style_xlsx=='') ? '000000':to_hex_xlsx(border_bottom_color),
            border_left_color_hex=(border_left_style_xlsx=='') ? '000000':to_hex_xlsx(border_left_color),
            
            tek_border='',
            tek_border_num=border_default_num;                    

        tek_border+='<border>';
        if ((((border_left_color_hex=='0000') || (border_left_color_hex=='cccccc')) & (border_left_style_xlsx=='thin') & (!tab_obj.pr_view)) ||
              (border_left_style_xlsx==''))   {
            tek_border+='<left/>';
        }
        /*else if (((border_left_color_hex=='000000') || (border_left_color_hex=='cccccc')) & (border_left_style_xlsx=='') & (tab_obj.pr_view)) {
            tek_border+='<left/>';
        }*/
        else {
            tek_border+='<left style="'+border_left_style_xlsx+'">'+
                             '<color rgb="'+border_left_color_hex+'"/>'+
                         '</left>';
        }
        if ((((border_right_color_hex=='0000') || (border_right_color_hex=='cccccc')) & (border_right_style_xlsx=='thin') & (!tab_obj.pr_view)) ||
              (border_right_style_xlsx=='')){
            tek_border+='<right/>';
        }
        /*else if (((border_right_color_hex=='000000') || (border_right_color_hex=='cccccc')) & (border_right_style_xlsx=='thick') & (tab_obj.pr_view)) {
            tek_border+='<right/>';
        } */               
        else {
            tek_border+='<right style="'+border_right_style_xlsx+'">'+
                             '<color rgb="'+border_right_color_hex+'"/>'+
                         '</right>';
        }                        
        if ((((border_top_color_hex=='0000') || (border_top_color_hex=='cccccc')) & (border_top_style_xlsx =='thin') & (!tab_obj.pr_view)) || 
              (border_top_style_xlsx=='')) {
            tek_border+='<top/>';
        }
        /*else if ((((border_top_color_hex=='000000') & (border_top_style_xlsx=='thick')) || ((border_top_color_hex=='cccccc') & (border_top_style_xlsx =='thin'))) & (tab_obj.pr_view)) {
            tek_border+='<top/>';
        }*/
        else {
            tek_border+='<top style="'+border_top_style_xlsx+'">'+
                             '<color rgb="'+border_top_color_hex+'"/>'+
                         '</top>';
        }
        if ((((border_bottom_color_hex=='0000') || (border_bottom_color_hex=='cccccc')) & (border_bottom_style_xlsx =='thin') & (!tab_obj.pr_view)) ||
              (border_bottom_style_xlsx=='')){
            tek_border+='<bottom/>';
        }
        /*else if (((border_bottom_color_hex=='000000') || (border_bottom_color_hex=='cccccc')) & (border_bottom_style_xlsx =='thick') & (tab_obj.pr_view)) {
            tek_border+='<bottom/>';
        }*/
        else {
            tek_border+='<bottom style="'+border_bottom_style_xlsx+'">'+
                            '<color rgb="'+border_bottom_color_hex+'"/>'+
                        '</bottom>';
        }
        tek_border+=    '<diagonal/>'+
                    '</border>';  

        var pr_new_style_f=pr_new_style;            
        //console.log(tek_border);
        if (border_default!=tek_border) {                    
            //font_default
            if (mass_border.length>0) {
                pr_ex_border=false;
                mass_border.forEach(function(element, index) {
                    if (element==tek_border) {
                        tek_border_num=index+border_default_num+1;
                        pr_ex_border=true;
                        return false;
                    }    
                });
                if (!pr_ex_border) {
                    pr_new_style_f=true;
                    mass_border.push(tek_border);
                    tek_border_num=mass_border.length+border_default_num;
                }
            }
            else {
                pr_new_style_f=true;
                mass_border.push(tek_border);
                tek_border_num=mass_border.length+border_default_num;
            }
        }
        else {
            pr_ex_border=true;
        }

        var mass_ret=[];
        mass_ret['pr_ex_border']=pr_ex_border;
        mass_ret['pr_new_style_f']=pr_new_style_f;
        mass_ret['tek_border_num']=tek_border_num;
        mass_ret['tek_border']=tek_border;
        mass_ret['border_top_color_hex']=border_top_color_hex;
        mass_ret['border_right_color_hex']=border_right_color_hex;
        mass_ret['border_bottom_color_hex']=border_bottom_color_hex;
        mass_ret['border_left_color_hex']=border_left_color_hex;
        mass_ret['border_top_style_xlsx']=border_top_style_xlsx;
        mass_ret['border_right_style_xlsx']=border_right_style_xlsx;
        mass_ret['border_bottom_style_xlsx']=border_bottom_style_xlsx;
        mass_ret['border_left_style_xlsx']=border_left_style_xlsx;                

        return mass_ret;
    }
    
    function getColumnName($columnNumber) {
        var $dividend = $columnNumber,
            $columnName = '';
        while ($dividend > 0)
        {
            var $modulo = ($dividend - 1) % 26;
            $columnName = String.fromCharCode(65 + $modulo)+$columnName;
            $dividend = parseInt(($dividend - $modulo) / 26);
        }
        return $columnName;
    }
    
    $(tab_tr).each(function(i,elem_tr) {
        var elem,
            tek_index_row_oo,
            td_elem,
            tek_height;            
        if (pr_only_olap) {
            tek_index_row_oo=i;
            td_style[tek_index_row_oo]={};
            elem=$(table_tag_v).find('tr[id="'+$(elem_tr).attr('id')+'"]');
            tek_height=parseFloat($(elem).height())/1.27;
            td_height[tek_index_row_oo]=tek_height;
            td_elem=$(elem).find('td[olap_tab_id]');
        }
        else {
            elem=elem_tr;
            tek_height=$(elem).attr('xlsx_height');            
            td_elem=$(elem).find('td:gt(0)');
        }
        var tek_index_row=Number($(elem).attr('id').split('-')[1]);            
        mass_index_rows[tek_index_row]=tek_index_row+1;                                
        var xml_list_one_row='';
        var mass_min_max_row=[];
        $(td_elem).each(function(i2,elem2) {
            var tek_text=$(elem2).html().trim();
            var tek_index_col;
            if (!pr_only_olap) {
                tek_index_col=parseInt($(elem2).attr('id').split('-')[0])+1;
            }
            else {
                tek_index_col=i2+1;
            }

            //мержи
            var tek_colspan=Number($(elem2).attr('colspan')),
                tek_rowspan=Number($(elem2).attr('rowspan'));
            if ((!isNaN(tek_colspan)) || (!isNaN(tek_rowspan))) {
                if ((!isNaN(tek_colspan)) & (!isNaN(tek_rowspan))) {
                    if ((tek_colspan>1) || (tek_rowspan>1)) {
                        merge_count+=1;
                    }
                    if ((tek_colspan>1) & (tek_rowspan>1)) {
                        merge_str+='<mergeCell ref="'+mass_index_cols[tek_index_col]+String(tek_index_row+1)+':'+mass_index_cols[tek_index_col+Number(tek_colspan)-1]+String(tek_index_row+Number(tek_rowspan))+'"/>';
                    }
                    else if (tek_colspan>1) {
                        merge_str+='<mergeCell ref="'+mass_index_cols[tek_index_col]+String(tek_index_row+1)+':'+mass_index_cols[tek_index_col+Number(tek_colspan)-1]+String(tek_index_row+1)+'"/>';
                    }
                    else if (tek_rowspan>1) {
                        merge_str+='<mergeCell ref="'+mass_index_cols[tek_index_col]+String(tek_index_row+1)+':'+mass_index_cols[tek_index_col]+String(tek_index_row+Number(tek_rowspan))+'"/>';
                    }
                }
                else if (!isNaN(tek_colspan)) {
                    if (tek_colspan>1) {
                        merge_count+=1;
                        merge_str+='<mergeCell ref="'+mass_index_cols[tek_index_col]+String(tek_index_row+1)+':'+mass_index_cols[tek_index_col+Number(tek_colspan)-1]+String(tek_index_row+1)+'"/>';
                    }
                }
                else if (!isNaN(tek_rowspan)) {
                    if (tek_rowspan>1) {
                        merge_count+=1;
                        merge_str+='<mergeCell ref="'+mass_index_cols[tek_index_col]+String(tek_index_row+1)+':'+mass_index_cols[tek_index_col]+String(tek_index_row+Number(tek_rowspan))+'"/>';
                    }
                }
            }                
            

            if (!!!mass_min_max_row[0]) {
                mass_min_max_row[0]=tek_index_col;
            }
            mass_min_max_row[1]=tek_index_col;
            
            var tek_style=$(elem2).attr('xlsx_style_num');
            if (tek_text!=='') {
                /*if ($(elem2).find('#group_tab').length>0) {
                    return true;
                }*/                                                
                var input_add_v=$(elem2).find('.input_add');
                if ($(input_add_v).length===0) {
                    var in_modal_add_txt_v=$(elem2).find('.in_modal_add_txt');
                    if ($(in_modal_add_txt_v).length===0) {
                        var select_add_v=$(elem2).find('.select_add');
                        if ($(select_add_v).length===0) {
                            var params_group=$(elem2).find('.params_group');
                            if ($(params_group).length>0) {
                                var pg_p_param=$(params_group).find('.p_param');
                                if ($(pg_p_param).length>0) {
                                    tek_text='Параметры :';
                                    $(pg_p_param).each(function(i3,elem3) {
                                        var in_param_val=$(elem3).find('.in_param_val');
                                        if ($(in_param_val).length>0) {
                                            tek_text+=' '+(i3+1)+'. '+$(elem3).contents().get(0).nodeValue+': '+$(in_param_val).val()+';';
                                        }
                                        else {
                                            tek_text+=' '+(i3+1)+'. '+$(elem3).contents().get(0).nodeValue+': '+$(elem3).find('.multiselect-selected-text').text()+';';
                                        }
                                    });
                                }
                                else {
                                    tek_text='';
                                }
                            }
                            else {
                                if ($(elem2).find('.img_add').length===0) {                                    
                                    var sql_group_text=$(elem2).find('.sql_group_text').text().trim();
                                    if (sql_group_text.length>0) {
                                        tek_text=sql_group_text;                                
                                    }
                                    else {
                                        var input_all_v=$(elem2).find('input');
                                        if ($(input_all_v).length===0) {
                                            var div_hidden_v=$(elem2).find('div.div_hidden');
                                            if ($(div_hidden_v).length===0) {
                                                tek_text=$(elem2).text().trim().replace(/<[^>]+>/g," ");
                                            }
                                            else {
                                                var elem2_clone=$(elem2).clone();
                                                $(elem2_clone).find('div.div_hidden').remove();
                                                tek_text=$(elem2_clone).text().trim().replace(/<[^>]+>/g," ");
                                            }
                                        }
                                        else {
                                            var elem2_clone=$(elem2).clone(),
                                                in_hidden=$(elem2_clone).find('input[type="hidden"]');
                                            if ($(in_hidden).length>0) {
                                                $(in_hidden).remove();                                                
                                            }
                                            input_all_v=$(elem2_clone).find('input');
                                            if ($(input_all_v).length>0) {
                                                tek_text='';
                                                $(input_all_v).each(function(i4,elem4) {
                                                    if ($(elem4).is('[type=checkbox]')) {
                                                        if ($(elem4).prop('checked')) {
                                                            tek_text+='1';
                                                        }
                                                        else {
                                                            tek_text+='0';
                                                        }
                                                    }
                                                    else {
                                                        tek_text+=String($(elem4).val()).trim().replace(/<[^>]+>/g," ");
                                                    }    
                                                });
                                            }
                                            else {
                                                tek_text=$(elem2_clone).text().trim().replace(/<[^>]+>/g," ");
                                            }
                                        }
                                    }
                                }
                                else {
                                    tek_text='';
                                }
                            }
                        }
                        else {
                            tek_text='';
                            $(select_add_v).find('option:selected').each(function(i3,elem3) {
                                tek_text+=$(elem3).text()+',';
                            });
                            if (tek_text!='') {
                                tek_text=tek_text.slice(0, -1);
                            }    
                        }
                    }
                    else {
                        tek_text=$(in_modal_add_txt_v).val();
                    }
                }
                else {
                    if ($(input_add_v).attr('type')=="checkbox") {
                        var iav_title_v=$(input_add_v).attr('title');
                        if (!!iav_title_v) {
                            tek_text=iav_title_v;
                        }
                        else {
                            tek_text='';
                        }
                    }
                    else {
                        tek_text=$(input_add_v).val();
                    }    
                }
                if (tek_text!='') {
                    num_v+=1;
                    xml_list_one_row+='<c r="'+mass_index_cols[tek_index_col]+String(tek_index_row+1)+'" t="s" s="'+tek_style+'"><v>'+num_v+'</v></c>';                
                    xml_list3+='<si><t>'+HtmlEncode(tek_text.split(s_dn).join(" "))+'</t></si>';
                }
                else {
                    xml_list_one_row+='<c r="'+mass_index_cols[tek_index_col]+String(tek_index_row+1)+'" s="'+tek_style+'"></c>';
                }
            }
            else {
                xml_list_one_row+='<c r="'+mass_index_cols[tek_index_col]+String(tek_index_row+1)+'" s="'+tek_style+'"></c>';
            }
            
            //для 2Д-режима при выгрузке только таблицы заполняем массив соответствия ячеек и стилей и высоты
            if  (pr_only_olap) {
                td_style[tek_index_row_oo][tek_index_col]=tek_style;
            }            

            //для корректной отрисовки рамок смерженных ячеек
            if (!!!$(elem2).attr('xlsx_border')) {
                console.log('no_xlsx_border',elem2);
            }
            var calc_mass_border_index=$(elem2).attr('xlsx_border').split('-'),
                calc_mass_border=calc_mass_border_mass[calc_mass_border_index[0],calc_mass_border_index[1]];
            if ((tek_colspan>1) & (!((calc_mass_border['border_top_style_xlsx']=='thin') & ((calc_mass_border['border_top_color_hex']=='0000') || (calc_mass_border['border_top_color_hex']=='cccccc')))
                                    || !((calc_mass_border['border_bottom_style_xlsx']=='thin') & ((calc_mass_border['border_bottom_color_hex']=='0000') || (calc_mass_border['border_bottom_color_hex']=='cccccc')))
                                    || !((calc_mass_border['border_right_style_xlsx']=='thin') & ((calc_mass_border['border_right_color_hex']=='0000') || (calc_mass_border['border_right_color_hex']=='cccccc'))))) {
                for (var i=1; i<(tek_colspan); i++) {
                    xml_list_one_row+='<c r="'+mass_index_cols[tek_index_col+i]+String(tek_index_row+1)+'" s="'+tek_style+'"></c>';
                }                        
            }
            if ((tek_rowspan>1) & (!((calc_mass_border['border_top_style_xlsx']=='thin') & ((calc_mass_border['border_top_color_hex']=='0000') || (calc_mass_border['border_top_color_hex']=='cccccc')))
                                    || !((calc_mass_border['border_bottom_style_xlsx']=='thin') & ((calc_mass_border['border_bottom_color_hex']=='0000') || (calc_mass_border['border_bottom_color_hex']=='cccccc')))
                                    || !((calc_mass_border['border_right_style_xlsx']=='thin') & ((calc_mass_border['border_right_color_hex']=='0000') || (calc_mass_border['border_right_color_hex']=='cccccc')))
                                    || !((calc_mass_border['border_left_style_xlsx']=='thin') & ((calc_mass_border['border_left_color_hex']=='0000') || (calc_mass_border['border_left_color_hex']=='cccccc'))))) {
                //запоминаем в массив для использования в строках ниже
                var border_merge_row_one=[];
                border_merge_row_one['tek_style']=tek_style;
                border_merge_row_one['tek_colspan']=tek_colspan;
                border_merge_row_one['tek_index_col']=tek_index_col;                        
                border_merge_row_one['min_row_num']=tek_index_row;
                border_merge_row_one['max_row_num']=tek_index_row+tek_rowspan;
                border_merge_row.push(border_merge_row_one);
            }
        });

        if (border_merge_row.length>0) {
            var xml_list_one_row_merge='';
            border_merge_row.forEach(function(element,index, object) {
                xml_list_one_row_merge='';
                if (tek_index_row>element['min_row_num']) {
                    if (element['tek_index_col']===1) {
                        mass_min_max_row[0]=1;
                    }
                    if ((tek_index_row>=element['min_row_num']) & (tek_index_row<element['max_row_num'])) {
                        var count_td=element['tek_colspan'];
                        for (var i=1; i<=(count_td); i++) {
                            xml_list_one_row_merge+='<c r="'+mass_index_cols[element['tek_index_col']+i-1]+String(tek_index_row+1)+'" s="'+element['tek_style']+'"></c>';
                        }  

                        xml_list_one_row+=xml_list_one_row_merge;                                                                
                    }
                    else {
                        //если выходит за допустимый диапазон, удаляем из массива
                        object.splice(index, 1);
                    }
                }    
            });
            //сортируем, т.к. этого требует xlsx
            xml_list_one_row_merge=$(xml_list_one_row).sort(function(a, b) {
                var a_r=$(a).attr('r'),b_r=$(b).attr('r')
                var pr_sort=7;
                if (a_r.length<b_r.length) {
                    pr_sort=-1;
                }
                else if  (a_r.length>b_r.length) {
                    pr_sort=1;
                }
                else {
                    pr_sort=a_r.localeCompare(b_r);
                }

                return pr_sort;
            }); 
            xml_list_one_row='';
            $(xml_list_one_row_merge).each(function(i,elem) {
                xml_list_one_row+=elem.outerHTML;
            }); 
        }
        
        if (xml_list_one_row!=='') {
            xml_list+='<row r="'+(tek_index_row+1)+'" spans="'+mass_min_max_row[0]+':'+mass_min_max_row[1]+'" ht="'+tek_height+'" customHeight="1">'+xml_list_one_row+
                      '</row>';
        }                

    });
    var result={};
    result['mass_index_cols']=mass_index_cols;
    result['mass_index_rows']=mass_index_rows;
    //result['mass_left_cols']=mass_left_cols;
    result['xml_list_top_cols']=xml_list_top_cols;
    result['merge_count']=merge_count;
    result['merge_str']=merge_str;
    result['xml_list']=xml_list;
    result['xml_list3']=xml_list3;
    result['count_font']=count_font;
    result['calc_font']=calc_font;
    result['count_fill']=count_fill;
    result['calc_fill']=calc_fill;
    result['count_border']=count_border;
    result['calc_border']=calc_border;
    result['count_style']=count_style;
    result['calc_style']=calc_style;
    result['td_style']=td_style;
    result['td_height']=td_height;
    return result;
}

function run_export_xlsx() {
    var width=window.innerWidth,
                height=window.innerHeight;
            $(loading_img).show().css({top:((height-$(loading_img).height())/2),left:((width-$(loading_img).width())/2)});
            $('html').resize();
            var time00 = performance.now();

            $('#my').jexcel('resetSelection');
            
            params={};
            params['get_report']='report_blyuds';
            params['real_name']='report';
            params['in_rep_id']=$('input#in_rep_id').val();
            var name_rep=$('#div_name_rep #in_name_rep');
            if ($(name_rep).val().length>0) {
                params['real_name']=$(name_rep).val();
            }
            
            
            var table_noall=$(table_tag),
                mass_calc_xlsx=calc_xlsx($(table_noall).find('tr'),false),
                xml_list=mass_calc_xlsx['xml_list'];     
            
            //console.log(mass_index_cols);
            var xml_list_top='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n\
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac xr xr2 xr3" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision" xmlns:xr2="http://schemas.microsoft.com/office/spreadsheetml/2015/revision2" xmlns:xr3="http://schemas.microsoft.com/office/spreadsheetml/2016/revision3" xr:uid="{00000000-0001-0000-0000-000000000000}">'+
                                '<dimension ref="A1:'+mass_calc_xlsx['mass_index_cols'][mass_calc_xlsx['mass_index_cols'].length-1]+mass_calc_xlsx['mass_index_rows'].length+'"/>'+
                                '<sheetViews>'+
                                    '<sheetView tabSelected="1" workbookViewId="0" xr3:uid="{AEA406A1-0E4B-5B11-9CD5-51D6E497D94C}">'+
                                        /*'<selection activeCell="B1" sqref="B1"/>'+*/
                                    '</sheetView>'+
                                '</sheetViews>'+
                                '<sheetFormatPr defaultRowHeight="15"/>'+
                                '<cols>'+mass_calc_xlsx['xml_list_top_cols']+
                                '</cols>'+                
                                '<sheetData>';                                
            xml_list+='</sheetData>';
            if (mass_calc_xlsx['merge_count']>0) {
                xml_list+='<mergeCells count="'+mass_calc_xlsx['merge_count']+'">'+mass_calc_xlsx['merge_str']+'</mergeCells>';
            }
            xml_list+='<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/></worksheet>';
            params['get_sheet_xml']=xml_list_top+xml_list; 
            xml_list='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n\
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
            xml_list+=mass_calc_xlsx['xml_list3']+'</sst>';
            params['get_sharedStrings_beg_xml']=xml_list;
            var xml_style_list='<?xml version="1.0" encoding="UTF-8"?>\n\
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">\n\
   <fonts count="'+mass_calc_xlsx['count_font']+'">\n\
      <font>\n\
         <sz val="11" />\n\
         <color rgb="FF000000" />\n\
         <name val="Calibri" />\n\
         <family val="2" />\n\
         <scheme val="minor" />\n\
      </font>\n\
      <font>\n\
         <sz val="14" />\n\
         <color rgb="FF000000"  />\n\
         <name val="times new roman" />\n\
         <family val="1" />\n\
         <charset val="204" />\n\
      </font>\n\
      '+mass_calc_xlsx['calc_font']+'\n\
   </fonts>\n\
   <fills count="'+mass_calc_xlsx['count_fill']+'">\n\
      <fill>\n\
         <patternFill patternType="none" />\n\
      </fill>\n\
      <fill>\n\
         <patternFill patternType="gray125" />\n\
      </fill>\n\
      '+mass_calc_xlsx['calc_fill']+'\n\
   </fills>\n\
   <borders count="'+mass_calc_xlsx['count_border']+'">\n\
      <border>\n\
         <left />\n\
         <right />\n\
         <top />\n\
         <bottom />\n\
         <diagonal />\n\
      </border>\n\
      '+mass_calc_xlsx['calc_border']+'\n\
   </borders>\n\
   <cellStyleXfs count="1">\n\
      <xf numFmtId="0" fontId="0" fillId="0" borderId="0" />\n\
   </cellStyleXfs>\n\
   <cellXfs count="'+mass_calc_xlsx['count_style']+'">\n\
      <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" />\n\
      <xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1">\n\
         <alignment horizontal="center" vertical="center" wrapText="1"/>\n\
      </xf>\n\
     '+mass_calc_xlsx['calc_style']+'\n\
   </cellXfs>\n\
   <cellStyles count="1">\n\
      <cellStyle name="Обычный" xfId="0" builtinId="0" />\n\
   </cellStyles>\n\
   <dxfs count="0" />\n\
   <tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleMedium9" />\n\
</styleSheet>';
            params['get_styles_xml']=xml_style_list;
            console.log(params);  
            $.ajax({
                type: "POST",
                url: "/imp_xlsx.php",
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

var tab_obj={minDimensions:[7,53],
                defaultColWidth:[150],
                columns: [{ type: 'text' },
                        { type: 'text' },
                        { type: 'text' },
                        { type: 'text' },
                        { type: 'text' },
                        { type: 'text' },
                        { type: 'text' }
                      ],
                colHeaders: ['','','','','','',''],      
                data: [],
                rowDrag:true,
                columnSorting:true,
                selectionCopy:true,
                html:'',
                allowDeleteColumn:true,
                pr_view:false,
                td_width:[]
            },
    tab_obj_default=tab_obj,
    table_tag='div#my table.jexcel tbody:first',
    table_all_tag='div#my table.jexcel',
    font_mass=['font_bold','font_kursiv','font_zacherk','font_podcherk'],
    tek_kol,
    olap_class_mass=['td_val_val','td_str_val','td_pok_name','td_pok','td_str_name','td_val_name','td_str_itog','td_val_itog','null'],
    in_rep_last_upd=$('#in_rep_last_upd'),
    in_action_value=$('#in_action_value'),
    settings_group_panel_active,
    all_forms,
    editor,
    editor_last_them,
    container_btn_toolbar,
    global_var,
    html_v=$('html'),
    div_tab_tag='div#my',
    params_type_rel=[],
    db_type,
    container,
    modal_form,
    modal_header,
    modal_footer,
    modal_tek_content,
    pr_td_no_edite=false,
    rep_id,
    host_service,
    toTop,
    data_tab_tr_head;      

    
function olap_tab_clear(id_t) {
    var tab_before_tr=$(table_tag).find('tr[olap_tr_id_'+id_t+']');
    if ($(tab_before_tr).length>0) {            
        //var tab_before_tr=$(tab_before).closest('tr');
        $('#my').jexcel ('deleteRow',($(tab_before_tr).first().index()) ,$(tab_before_tr).length,{not_log:true});
        data_tab_tr_head=undefined;
        //save_tab_data(); 
    }
}   

function create_tab_data(table) {
    var thead;
    if (!!!table) {
        table=$(table_tag);
        thead=$(table_all_tag).find('thead:first');
    }
    else {
        thead=$(table).filter('thead:first'); 
        table=$(table).filter('tbody:first');        
    }
    tab_obj.data=[];
    var tr_all=$(table).find('tr[id^="row-"]');
    $(tr_all).each(function(i,elem) {
        var row=$(elem).attr('id').split('-')[1];
        tab_obj.data[row]=[];            
        $(elem).find('td:gt(0)').each(function(i2,elem2) {
            var col=$(elem2).attr('id').split('-')[0];
            tab_obj.data[row][col]=$(elem2).html();
        });                       
    });
    tab_obj.colHeaders=[];
    tab_obj.columns=[];
    $(thead).find('tr:last td:gt(0)').each(function(i,elem) {
        var col=$(elem).attr('id').split('-')[1];
        tab_obj.colHeaders[col]=$(elem).attr('title');
        tab_obj.columns[col]={ type: 'text' };
    });
    tab_obj.minDimensions=[tab_obj.columns.length,$(tr_all).length];
}


function save_tab_data(no_data) {
    if (!!!no_data) {
        no_data=false;
    }
    else {
        no_data=true;
    }
    if (!no_data) {
        create_tab_data();
    }
    var table_tag_v=$(table_tag),
        div_params_group=$(table_tag_v).find('div.params_group'),
        div_panel_add=$(table_tag_v).find('div.panel_add');
    $(div_params_group).each(function(i,elem) {
        if ($(elem).find('p').length>0) {
            $(elem).find('.olap_param_sql').multiselect('destroy');
        }
    });
    $(div_panel_add).each(function(i,elem) {
        $(elem).pwstabs('destroy');
    });
    tab_obj.html=$(table_all_tag).html();
    $(div_params_group).each(function(i,elem) {
        if ($(elem).find('p').length>0) {
            $(elem).show();
            set_olap_params(elem); 
        }
    });
    $(div_panel_add).each(function(i,elem) {
        $(elem).pwstabs('rebuild');
    });
    $('#my').jexcel('updateData',tab_obj.data,tab_obj.colHeaders);
    
    
}

function set_tab_width_true() {
    //устанавливаем правильную ширину таблицы
    var tab_width=0,
        table_all_tag_v=$(table_all_tag);;
    if (!tab_obj.pr_view) {        
        /*$(table_all_tag_v).find('thead:first tr:last td').each(function(i,elem) {
            var tek_width=parseFloat(elem.offsetWidth);
            tab_width+=tek_width;
            if (!!!tab_obj['td_width']) {
                tab_obj['td_width']=[];
            }
            tab_obj.td_width.push(tek_width);
            //$(elem).attr('width',$(elem).width());
        })
        $(table_all_tag_v).width(tab_width+'px');*/
    }
    else {
        $(table_all_tag_v).find('thead:first tr:last td:not(:first)').empty();
        /*tab_obj.td_width.forEach(function(element) {
            tab_width+=element;
        });
        tab_width-=tab_obj.td_width[0]; 
        $(table_all_tag_v).css('width','fit-content');*/
    }    
}

var olap_params_val=[],olap_taa_dbd_val=[],pr_param_show=undefined;
function set_olap_params(elem2) {
    var olap_param_sql_v=$(elem2).find('.olap_param_sql'),
        el_db_dropbox;
    if ($(olap_param_sql_v).length>0) {
        el_db_dropbox=olap_param_sql_v;
    }
    else {
        el_db_dropbox=$(elem2).find('.olap_taa_db_dropbox');
        if ($(el_db_dropbox).length===0) {
            el_db_dropbox=$($(elem2).find('select[class^="usr_"]'))
        }
    }
    if ($(el_db_dropbox).length>0) {
        $(el_db_dropbox).multiselect('destroy').multiselect({
            onDropdownHide: function(event) {
                var params_group=$(event.target).closest('.params_group');
                var this_sel=$(event.target).prev();
                var this_sel_val=$(this_sel).val();
                $(this_sel).find('option').removeAttr("selected");
                var mass_equals=true,
                    olap_val;
                if ($(this_sel).hasClass('olap_param_sql')) {
                    olap_val=olap_params_val;
                } 
                else {
                    olap_val=olap_taa_dbd_val;
                }
                if ($(this_sel).attr('multiple')) {
                    if (this_sel_val.length!=olap_val[$(this_sel).attr('id')].length) { 
                        mass_equals=false;
                    }
                    if (!mass_equals) {
                        this_sel_val.forEach(function(element) {
                            $(this_sel).find('option[value="'+element+'"]').attr('selected', '');                         
                        }); 
                    }
                    else {
                        this_sel_val.forEach(function(element,index) {
                            $(this_sel).find('option[value="'+element+'"]').attr('selected', ''); 
                            if (olap_val[$(this_sel).attr('id')][index]!=element) {
                                mass_equals=false;
                            }
                        });
                    }
                }
                else {
                    $(this_sel).find('option[value="'+$(this_sel).val()+'"]').attr('selected', '');
                    if (this_sel_val!=olap_val[$(this_sel).attr('id')]) {
                        mass_equals=false;
                    }
                }            
                if (!mass_equals) {
                    if ($(this_sel).hasClass('olap_param_sql')) {
                        olap_param_upd_child($(params_group).attr('id'),$(event.target).closest('.p_param').attr('id')); 
                    }    
                }  
                $('ul.multiselect-container').hide();
                $('div.btn-group').removeClass('open show');
                pr_param_show=undefined;
            },
            onDropdownShown: function(event) {  
                var tek_el=$(event.target);                        
                var this_sel=$(tek_el).prev();
                $('ul.multiselect-container').hide();
                $('div.btn-group').removeClass('open show');
                $(tek_el).addClass('open show');
                if ($(this_sel).hasClass('olap_param_sql')) {
                    olap_params_val[$(this_sel).attr('id')]=$(this_sel).val();
                }
                else {
                    olap_taa_dbd_val[$(this_sel).attr('id')]=$(this_sel).val();
                }
                var body_v=html_v;
                var this_top=$(tek_el).offset().top+3-$(body_v).scrollTop();
                var this_left=$(tek_el).offset().left+3-$(body_v).scrollLeft();
                //console.log($(tek_el));
                $(tek_el).find('ul.multiselect-container').css({'left':this_left+'px','top':this_top+'px'}).show();
                pr_param_show=tek_el;
            },        
            includeSelectAllOption : true , 
            enableFiltering : true,
            enableCaseInsensitiveFiltering: true
        });
    }    
}

function set_select_one(elem2) {
    $(elem2).multiselect({
        onDropdownHide: function(event) {
            $('ul.multiselect-container').hide();
            $('div.btn-group').removeClass('open show');
            pr_param_show=undefined;
        },
        onDropdownShown: function(event) {  
            $('ul.multiselect-container').hide();
            $('div.btn-group').removeClass('open show');
            $(event.target).addClass('open show');
            $(event.target).find('ul.multiselect-container').show();
            var body_v=html_v;
            var this_top=$(event.target).offset().top+2-$(body_v).scrollTop();
            var this_left=$(event.target).offset().left-$(body_v).scrollLeft();
            $(event.target).find('ul.multiselect-container').css({'left':this_left+'px','top':this_top+'px'}); 
            pr_param_show=$(event.target);
        },
        includeSelectAllOption : true , 
        enableFiltering : true,
    });
}

function export_file(name, contents, mime_type) {
    mime_type = mime_type || "text/plain";

    var blob = new Blob([contents], {type: mime_type});

    var dlink = document.createElement('a');
    dlink.download = name;
    dlink.href = window.URL.createObjectURL(blob);
    dlink.onclick = function(e) {
        // revokeObjectURL needs a delay to work properly
        var that = this;
        setTimeout(function() {
            window.URL.revokeObjectURL(that.href);
        }, 1500);
    };

    dlink.click();
    dlink.remove();
}

function set_ace_edit(editor_style,editor_tek_tem,edit_ace_size,ace_value) {
    if (!!editor) {
        editor.destroy();
    }
    editor=undefined;
    var cb_toolbar=$(container).find('.btn-toolbar ');
    //container_btn_toolbar=$(cb_toolbar).clone();
    $(cb_toolbar).empty().append('<div class="btn-group">'+
                                    '<a class="btn dropdown-toggle" data-toggle="dropdown_modal" title="Стиль"><i class="icon-font">A</i><b class="caret"></b></a>'+
                                        '<ul class="dropdown-menu_modal" pr_win_modal="" style="display: none;">'+
                                            '<li><a data-edit_ace-theme="monokai" class="edit_ace-theme">Monokai</a></li>'+
                                            '<li><a data-edit_ace-theme="ambiance" class="edit_ace-theme">Ambiance</a></li>'+
                                            '<li><a data-edit_ace-theme="eclipse" class="edit_ace-theme">Eclipse</a></li>'+
                                            '<li><a data-edit_ace-theme="chaos" class="edit_ace-theme">Chaos</a></li>'+
                                            '<li><a data-edit_ace-theme="clouds_midnight" class="edit_ace-theme">Clouds-midnight</a></li>'+
                                            '<li><a data-edit_ace-theme="github" class="edit_ace-theme">Github</a></li>'+
                                            '<li><a data-edit_ace-theme="solarized_dark" class="edit_ace-theme">Solarized-dark</a></li>'+
                                            '<li><a data-edit_ace-theme="textmate" class="edit_ace-theme">Textmate</a></li>'+
                                            '<li><a data-edit_ace-theme="tomorrow_night_bright" class="edit_ace-theme">Tomorrow-night-bright</a></li>'+
                                            '<li><a data-edit_ace-theme="twilight" class="edit_ace-theme">Twilight</a></li>'+
                                            '<li><a data-edit_ace-theme="vibrant_ink" class="edit_ace-theme">Vibrant_ink</a></li>'+
                                            '</li>'+
                                        '</ul>'+
                                  '</div>\n\
                                   <div class="btn-group">'+
                                        '<input type="number" title="Размер шрифта, px" class="edit_ace-size" style="width:33px;height: 23px;">'+
                                  '</div>');               
    editor = ace.edit("editor");
    editor.getSession().setMode("ace/mode/"+editor_style);
    var li_visual=$(cb_toolbar).find('a[data-edit_ace-theme="'+editor_tek_tem+'"]').closest('li');
    $(li_visual).attr('data-edit_ace-theme',editor_tek_tem).css({'background' : '#d1ffff', 'border-bottom-color':'white'});
    $(li_visual).find('a').css({'color':'black'});
    if (!!editor_last_them) {
        //костыль чтобы корректно тема сработала: сначала включаем последнюю выбранную тему
        editor.setTheme("ace/theme/"+editor_last_them);
    }    
    if (editor_tek_tem) {
        editor.setTheme("ace/theme/".editor_tek_tem);
    }
    else {
        editor.setTheme("ace/theme/monokai");                
    }            
    
    if (!isNaN(edit_ace_size)) {
        $(cb_toolbar).find('.edit_ace-size').val(edit_ace_size);
        document.getElementById('editor').style.fontSize=edit_ace_size+'px';
    }
    else {
        $(cb_toolbar).find('.edit_ace-size').val('12');
    }        
    editor.setValue(ace_value); // задаем    
}

function initToolbarBootstrapBindings() {
    var fonts = ['Serif', 'Sans', 'Arial', 'Arial Black', 'Courier', 
          'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times',
          'Times New Roman', 'Verdana'],
          fontTarget = $('[title=Font]').siblings('.dropdown-menu_modal');
    $.each(fonts, function (idx, fontName) {
        $(fontTarget).append($('<li><a data-edit="fontName ' + fontName +'" style="font-family:\''+ fontName +'\'">'+fontName + '</a></li>'));
    });
    $('a[title]').tooltip({container:'body'});
      $('.dropdown-menu_modal input').click(function() {return false;})
                  .change(function () {$(this).parent('.dropdown-menu_modal').siblings('.dropdown-toggle').dropdown('toggle');})
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

function initToolbarBootstrapBindingsTrue() {
    initToolbarBootstrapBindings(); 
    $('#editor').wysiwyg({ fileUploadError: showErrorAlert} );
    window.prettyPrint && prettyPrint();
}

function set_rel(params_str,tek_id) {
    //добавляем связи элементов в массив
    if (params_str.length>0) {
        var mass_param=params_str.split('--');
        //mass_param=mass_param.filter((x, i, a) => a.indexOf(x) == i);
        mass_param = $.grep(mass_param, function(v, k){
            return $.inArray(v ,mass_param) === k;
        });
        mass_param.forEach(function(element) {            
            if (isNaN(params_type_rel[element])) {
                params_type_rel[element]=[];                        
            }
            params_type_rel[element].push(tek_id);
        });
    }
}

var select_add_params_val=[],
    in_modal_add_params_val=[];
function select_add_show(tek_el,tek_td) {
    $(div_tab_tag).jexcel('updateSelection', tek_td, tek_td);
    var this_sel=$(tek_el).prev(),
        table_tag_v=$(table_tag);
    $(table_tag_v).find('ul.multiselect-container').hide();
    $(table_tag_v).find('div.btn-group').removeClass('open show');
    $(tek_el).addClass('open show');
    select_add_params_val[$(this_sel).attr('id')]=$(this_sel).val();
    var body_v=html_v;
    var this_top=$(tek_el).offset().top+3-$(body_v).scrollTop();
    var this_left=$(tek_el).offset().left+3-$(body_v).scrollLeft();
    //console.log($(tek_el));
    $(tek_el).find('ul.multiselect-container').css({'left':this_left+'px','top':this_top+'px'}).show();
    pr_param_show=tek_el;
}
function select_add_init(select_add) {
    $(select_add).multiselect('destroy')
        .multiselect({
            onDropdownHide: function(event) {
                var this_sel=$(event.target).prev();
                var this_sel_val=$(this_sel).val();
                $(this_sel).find('option').removeAttr("selected");
                var mass_equals=true;
                if ($(this_sel).attr('multiple')) {
                    if (this_sel_val.length!=select_add_params_val[$(this_sel).attr('id')].length) { 
                        mass_equals=false;
                    }
                    if (!mass_equals) {
                        this_sel_val.forEach(function(element) {
                            $(this_sel).find('option[value="'+element+'"]').attr('selected', '');                         
                        }); 
                    }
                    else {
                        this_sel_val.forEach(function(element,index) {
                            $(this_sel).find('option[value="'+element+'"]').attr('selected', ''); 
                            if (select_add_params_val[$(this_sel).attr('id')][index]!=element) {
                                mass_equals=false;
                            }
                        });
                    }
                }
                else {
                    $(this_sel).find('option[value="'+$(this_sel).val()+'"]').attr('selected', '');
                    if (this_sel_val!=select_add_params_val[$(this_sel).attr('id')]) {
                        mass_equals=false;
                    }
                }            
                if (!mass_equals) {
                    upd_child_rel($(this_sel).attr('id'));
                }  
                $('ul.multiselect-container').hide();
                $('div.btn-group').removeClass('open show');
                pr_param_show=undefined;
            },
            onDropdownShown: function(event) {  
                var tek_el=$(event.target),
                    tek_td=$(tek_el).closest('td');  
                select_add_show(tek_el,tek_td);
            },        
            includeSelectAllOption : true , 
            enableFiltering : true,
            enableCaseInsensitiveFiltering: true
        });
} 

function upd_select_add(sql,tek_id,pr_modal) {
    var params = new Object(),
        params_r_da;
    params['code_in']='get_md_param_sql';        
    //формируем таблицу с параметрами
    var params_r=param_create(sql,null,null,tek_id),
        table_tag_v=$(table_tag),
        tek_el=$(table_tag_v).find('.select_add[id="'+tek_id+'"],.in_modal_add_val[id="'+tek_id+'"]');
    params['sql_true']=params_r['sql_true'];    
    if (db_type=='mssql') {            
        params_r_da=params_r['params_all'];
    }
    else if (db_type=='ora'){
        params_r_da=params_r['params'];
    }
    //перебираем все параметры полученные, по ним ищем значения
    var pr_ok=true;
    if (!$.isEmptyObject(params_r_da)) {                  
        var params_val=new Object(),
            elem_for_params=$(table_tag_v).find('.input_add[id!="'+tek_id+'"],.select_add[id!="'+tek_id+'"],.in_modal_add_val[id!="'+tek_id+'"]');
        if  ($(elem_for_params).length>0) {   
            for (var key in params_r_da) {
                var param_one=$(elem_for_params).filter('[id="'+params_r_da[key]+'"]');
                if ($(param_one).length>0) {
                    params_val[params_r_da[key]]=$(param_one).val();
                }
                else {
                    pr_ok=false; 
                    break;
                }
            }
            if (pr_ok) {
                params['params_val']=JSON.stringify(params_val);
            }    
        }
        else {
            pr_ok=false; 
        }
    }

    if (pr_ok) {
        //удаляем все упоминания элемента в связях, делаем через вспомогательныe массивы (проще удалять)
        var ptr_w=[];
        params_type_rel.forEach(function(element,index) {
            var m_os=[];
            element.forEach(function(element2) {
                if (element2!=tek_id) {
                    m_os.push(element2);
                }
            });
            if (m_os.length>0) {
                ptr_w[index]=m_os;
            }
        });
        params_type_rel=ptr_w; 
        set_rel(params_r['params_str'],tek_id);            
        if ($(tek_el).hasClass('select_add')) {
            var select_add=$(table_tag_v).find('.select_add[id="'+tek_id+'"]');
            $(select_add).trigger('before_select',params);
            $.ajax({
                type: "POST",
                url: "/get-data.php",
                data: params,
                async: false,
                success: function(html){
                    $(select_add).html(html);
                    $(select_add).trigger('change');
                    select_add_init(select_add);    
                },
                error: function(xhr, status, error) {
                    alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                    console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                }
            }); 
        }
        else { 
            params['code_in']='getRowsDiv_DB_conn';
            $(tek_el).trigger('before_select',params);
            $.ajax({
                type: "POST",
                url: "/get-data.php",
                data: params,
                async: false,
                success: function(html){
                    var tek_tab=$(table_tag_v).find('.tab_in_modal[id="'+tek_id+'"]'),
                        tek_td=$(tek_tab).closest('td'),
                        struct=$(tek_td).find('.settings_group_panel[id="'+tek_id+'"] .d-table[id="tab_pol"] .d-tr[id!="after_append"]');
                    if ($(tek_tab).find('.tbody.d-tr').length===0) {  
                        var str='<div class="thead d-tr">\n'; 
                        $(struct).each(function(i,elem) {
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
                                        '<span><a class="in_mod_tab_sort_unup" id="'+s_name+'" title="Отсортировать по возрастанию"><img src="/img/sort_up.png" style="width:7px;height:13px !important;"></a></span>'+
                                    '</div>\n';            
                        }); 
                        str+='</div>\n';
                        //$(tab_h).html(str);
                        $(tek_tab).html(str);
                    }                
                    //$(tek_tab).find('tbody').html(html);
                    $(tek_tab).append(html);
                    $(tek_td).find('.in_modal_add_txt').attr('value','');
                    $(tek_td).find('.in_modal_add_val').attr('value','');
                    //обновляем все зависимые
                    //$(loading_img).hide();
                },
                error: function(xhr, status, error) {
                    alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                    console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                }
            });
        }
        if (pr_modal) {
            $(settings_group_panel_active).show().find('li.select_add_sql .div_hidden').html(sql);         
            var settings_group_panel=$('.settings_group_panel[action_type="'+$(settings_group_panel_active).attr('action_type')+'"][id="'+$(settings_group_panel_active).attr('id')+'"]');
            $(settings_group_panel).html($(settings_group_panel_active).html());
            modal_close();
        }    
    }
    else {
        alert('Параметр/ы запроса указан/ы некорректно');
    }
}

function upd_child_rel(tek_id) {
    if (!!params_type_rel[tek_id]) {
        params_type_rel[tek_id].forEach(function(element) {
            var sgp=$(table_tag).find('.settings_group_panel[action_type][id="'+element+'"]'),
                sql;
            if ($(sgp).is('[action_type="select_add"]')) {
                sql=$(sgp).find('li.select_add_sql .div_hidden').text();
            }
            else {
                sql=$(sgp).find('.in_mod_sql_value').text();
            }
            upd_select_add(sql,$(sgp).attr('id'),false);
        });    
    } 
}
    
function set_change_style_li_panel_multi(tek) {
    var none_style=$(tek).siblings().filter('[id="none"][pr_change_style]');
    if ($(none_style).length>0) {
        $(none_style).css({'background' : 'white', 'border-bottom-color':'black'}).removeAttr('pr_change_style');
        $(none_style).find('a').css({'color':'#0088cc'});
    }
    if ($(tek).filter('[pr_change_style]').length==0) {            
        $(tek).attr('pr_change_style','').css({'background' : '#d1ffff', 'border-bottom-color':'white'});
        $(tek).find('a').css({'color':'black'});
    }    
}   

function get_in_modal_md(class_prefix,setting_id) {
    return '<div id="'+setting_id+'" class="in_modal_md" style="display: none;">\n\
                                                <div class="md_panel_es">\n\
                                                    <a class="'+class_prefix+'in_modal_md_save" id="'+setting_id+'" class_prefix="'+class_prefix+'" title="Сохранить структуру" style="z-index: 500000;">\n\
                                                        <img src="/img/save.png" width="30" height="auto">\n\
                                                    </a>\n\
                                                </div>\n\
                                                <div class="in_mod_div_tw">\n\
                                                    Ширина таблицы: <input type="text" class="in_mod_tab_widh">\n\
                                                </div>\n\
                                                <div id="'+setting_id+'" class="in_mod_sql_value"></div>\n\
                                                <a id="'+setting_id+'" title="Редактировать SQL-запрос для таблицы" style="display: inline" class="'+class_prefix+'in_modal_sql_edit" action_type="in_modal_add" class_prefix="'+class_prefix+'">\n\
                                                    <img src="/img/edit_sql.png" style="width:auto;height:30px;">\n\
                                                </a>\n\
                                                <div class="polya d-table" style="display: inline;">\n\
                                                    <div class="d-tr">\n\
                                                        <div class="d-td" style="font-size:12pt;font-weight:bold;">Список полей</div>\n\
                                                    </div>\n\
                                                    <div class="d-td" style="padding:0;">\n\
                                                        <div class="d-table" id="tab_pol">\n\
                                                            <div class="d-tr" id="after_append">\n\
                                                                <div class="d-td" style="font-size:11pt;font-weight:bold;">Сис.имя</div>\n\
                                                                <div class="d-td" style="font-size:11pt;font-weight:bold;">Наименование</div>\n\
                                                                <div class="d-td" style="font-size:11pt;font-weight:bold;">Скрыть</div>\n\
                                                                <div class="d-td" style="font-size:11pt;font-weight:bold;">Ширина</div>\n\
                                                            </div>\n\
                                                            <div class="d-tr">\n\
                                                                <div class="SYSNAME d-td" id="_no_str_">SQL-запрос отсутствует</div>\n\
                                                                <div class="NAME d-td"></div>\n\
                                                                <div class="UNVISIBLE d-td"></div>\n\
                                                                <div class="WIDTH d-td"></div>\n\
                                                            </div>\n\
                                                        </div>\n\
                                                    </div>\n\
                                                </div>\n\
                                              </div>\n';
}

function get_in_mod_struct_by_sql(id_t,md) {
    var d_table_pol=$(md).find('.d-table[id="tab_pol"]'),
        in_mod_sql_value=$(md).find('.in_mod_sql_value[id="'+id_t+'"]')
    if ((($(in_mod_sql_value).html()!=editor.getValue().trim())) || ($(d_table_pol).find('.SYSNAME[id="_no_str_"]').length>0)) {
        $(in_mod_sql_value).html(editor.getValue().trim());
        var params = new Object();
        params['code_in']='in_mod_save_md_str';
        params['sql_true']=editor.getValue().trim();
        params['tab_id']=id_t;        
        //формируем таблицу с параметрами
        var params_r=param_create(params['sql_true']),
            params_r_da;
        if (db_type=='mssql') {
            params['sql_true']=params_r['sql_true'];
            params_r_da=params_r['params_all'];
        }
        else if (db_type=='ora'){
            params_r_da=params_r['params'];
        }
        params['params']=JSON.stringify(params_r_da);
        console.log(params);
        $.ajax({
            type: "POST",
            url: "/get-data.php",
            data: params,
            success: function(html){
//                console.log(html);
                var structure_old=$(md).find('.structure_old'),
                    pr_new=false;
                if ($(structure_old).length>0) {
                    var structure_old_s=$(structure_old).find('.SYSNAME'),
                        structure_new_s=$(html).find('.SYSNAME'),
                        mass_exist=[],
                        mass_remove=[];
                    //сотрим старые эелементы, если нету, удаляем из текущей структуры, запоминаем имющиеся
                    $(structure_old_s).each(function(i,elem) {
                        var pr_exist=false,
                            e_txt=$(elem).attr('id');
                        $(structure_new_s).each(function(i2,elem2) {
                            if (e_txt==$(elem2).attr('id')) {
                                pr_exist=true;
                                mass_exist.push(e_txt);
                                return false;
                            }
                        });
                        if (!pr_exist) {
                            mass_remove.push(e_txt);
                        }
                    });
                    mass_remove.forEach(function(element) {
                        $(d_table_pol).find('.d-td[id="'+element+'"]').closest('.d-tr').remove();
                    });
                    $(structure_new_s).each(function(i,elem) {
                        var pr_exist=false,
                            e_txt=$(elem).attr('id');
                        mass_exist.forEach(function(element) {
                            if (element==e_txt) {
                                pr_exist=true;
                            }
                        })    
                        if (!pr_exist) {
                            var tek_tr=$(elem).closest('.d-tr');
                            $(d_table_pol).append(tek_tr);
                        }
                    });
                    //делаем сортировку полей согласно пришедшей структуре(такой подход работает быстрей т.к. нет необходимости сортировки вставляемых полей при получении данных
                    $(structure_new_s).each(function(i,elem) {
                        var e_txt=$(elem).attr('id'),
                            tek_tr_new=$(d_table_pol).find('.d-td[id="'+e_txt+'"]').closest('.d-tr'),
                            tek_tr_new_clone=$(tek_tr_new).clone();
                        $(tek_tr_new).remove();
                        $(d_table_pol).append(tek_tr_new_clone);                            
                    });
                    //обновляем структуру для сравнения
                    $(structure_old).html(html);
                }  
                else {
                    pr_new=true;
                }

                if (pr_new) {
                    if ($(structure_old).length>0) {
                        $(structure_old).html(html);
                    }
                    else {
                        $(md).append('<div class="structure_old" id="'+id_t+'">'+html+'</div>')
                    }
                    var str=$(d_table_pol).find('.d-tr[id!="after_append"]');
                    if ($(str).length>0) {
                        $(str).remove();
                    }
                    $(d_table_pol).find('.d-tr[id="after_append"]').after(html);                                       
                }
                $('.modal_content').empty().append($(md).clone().show()).focus(); 
            },
            error: function(xhr, status, error) {
                alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                console.log(xhr.responseText + '|\n' + status + '|\n' +error);
            }
        }); 
    }
    else {
        $('.modal_content').empty().append($(md).clone().show()).focus(); 
    }
}

$(document).ready(function(){ 
    $.fn.jPicker.defaults.images.clientPath='images/';
    $('#Inline').jPicker({window:{title:'Выберите цвет'},color:{active:new $.jPicker.Color({ahex:'000000'})}});                
    $('#Inline_td').jPicker({window:{title:'Выберите цвет'},color:{active:new $.jPicker.Color({ahex:'ffffff'})}}); 
    $('#Inline_bc').jPicker({window:{title:'Выберите цвет'},color:{active:new $.jPicker.Color({ahex:'000000'})}}); 
    
    initToolbarBootstrapBindingsTrue();
    
    rep_id=$('#div_name_rep #in_rep_id');
    var loading_img=$('#loading_img');
    in_rep_last_upd=$('#in_rep_last_upd');
    in_action_value=$('#in_action_value');    
    db_type=$('#db_type').val();
    settings_group_panel_active=$('.settings_group_panel_active');
    container=$('div.container');
    $(container).hide();
    container_btn_toolbar=$(container).find('.btn-toolbar ').clone();
    modal_form=$('div#modal_form');
    modal_header=$(modal_form).find('div.modal_header'),
    modal_footer=$(modal_form).find('div.modal_footer');
    tab_obj.pr_view=$(rep_id).is('[pr_view]');
    if (!tab_obj.pr_view) {
        //кэшируем все формы для возможного указания родительской формы
        var params_forms = new Object();
        params_forms['code_in']='get_rep_all';       
        $.ajax({
            type: "POST",
            url: "/get-data.php",
            data: params_forms,
            success: function(data){
                all_forms=data;
            }
        });  
    }
    host_service=$(rep_id).attr('host_service');
    toTop=$('div#toTop');
        
    $(loading_img).hide();
    if ($(rep_id).val()!='') {                
        var params = new Object();
        params['code_in']='get_rep_data';
        params['id_rep']=$(rep_id).val();        
        console.log(params);
        var width=window.innerWidth,
            height=window.innerHeight;
        $(loading_img).css({top:((height-$(loading_img).height())/2),left:((width-$(loading_img).width())/2)}).show();
        $.ajax({
            type: "POST",
            url: "/get-data.php",
            data: params,
            dataType:'json',
            success: function(data){
                //генерируем событие перед открытием, для обработки в "скрипте жизни"
                $(in_action_value).trigger("before_open_form");
                //console.log(data);                  
                tab_obj=JSON.parse(LZString.decompressFromUTF16(data.data));
                //tab_obj=JSON.parse(data.data);
                create_tab_data(tab_obj.html);              
                //console.log(tab_obj);                
                $('#my').jexcel(tab_obj);
                $('#div_name_rep #in_name_rep').val(data.name).attr('sname',data.sname);
                var table_all_tag_v=$(table_all_tag),
                    table_real=$(table_all_tag).html(tab_obj.html);                
                //параметры делаем рабочими
                /*$('div.params_group').each(function(i,elem) {
                    if ($(elem).find('p').length>0) {
                        $(elem).show();
                        set_olap_params(elem);
                    }
                });*/ 
                var group_tab_v=$(table_all_tag_v).find('div[id="group_tab"][olap_id]');
                $(group_tab_v).each(function(i,elem) {
                    //подгружаем класс MD если используется
                    var md=$(elem).find('.masterdata'),
                        mdr_class_v=$(md).attr('mdr_class'),
                        mdr_str_v=$(md).attr('mdr_str');
                    if (!!mdr_class_v) {
                        var chkbx_msl_odta_v=false;
                        if (mdr_str_v!='all') {
                            chkbx_msl_odta_v=true;
                        }
                        md_get_class_set(mdr_class_v,$(md).attr('id'),md,true,chkbx_msl_odta_v,false);
                    }
                    set_olap_params_all(elem);
                });
                
                var table_real_selected=$(table_real).find('td.highlight'); 
                if ($(table_real_selected).length>0) {
                    $('#my').jexcel('updateSelection', $(table_real_selected).first(), $(table_real_selected).last(),1);
                }
                var olap_str='';
                $(group_tab_v).each(function(i,elem) {
                    olap_str+='-'+$(elem).attr('olap_id');
                });
                if (olap_str.length>0) {
                    olap_str=olap_str.slice(1);
                    $(in_rep_last_upd).val(olap_str).trigger('change');
                }                  
                
                //обновляем элементы select/in_modal
                var table_tag_v=$(table_tag);
                $(table_tag_v).find('.settings_group_panel[action_type="select_add"],.settings_group_panel[action_type="in_modal_add"]').each(function(i,elem) {
                    var tek_td=$(elem).closest('td'),
                        sql,tek_id=$(elem).attr('id');
                    if ($(elem).is('[action_type="select_add"]')) {
                        $(tek_td).find('div.btn-group').remove();
                        select_add_init($(tek_td).find('.select_add[id="'+tek_id+'"]'));
                        sql=$(elem).find('li.select_add_sql .div_hidden').text();             
                    } 
                    else {
                        sql=$(elem).find('.in_mod_sql_value').text();
                    }
                    var params_r=param_create(sql,null,$(table_tag_v).find('.select_add[id!="'+tek_id+'"],.in_modal_add_val[id!="'+tek_id+'"]'));
                    set_rel(params_r['params_str'],tek_id);
                });
                
                //активируем панели
                var div_panel_add=$(table_tag_v).find('div.panel_add');
                $(div_panel_add).each(function(i,elem) {
                    p_a_tek_id=$(elem).find('div[data-pws-tab]').first().attr('data-pws-tab');
                    $(elem).pwstabs();                    
                });
                
                tab_obj.pr_view=$(rep_id).is('[pr_view]');
                if (tab_obj.pr_view) {
                    $(table_tag_v).find('tr').each(function(i,elem) {
                        $(elem).find('td:first').empty().css({'empty-cells':'hide'});
                    });
                }
                set_tab_width_true();
                $(in_action_value).trigger("after_open_form");
                $(loading_img).hide();
            },
            error: function(xhr, status, error) {
                alert('Ошибка получения данных. Возможно, истекло время сессии.'+xhr.responseText+ ' ' + status + ' ' +error);
                console.log(xhr.responseText + '|\n' + status + '|\n' +error);
            }
        });
    }  
    else {
        $('#my').jexcel(tab_obj);
        if (tab_obj.pr_view) {
            var table_tag_v=$(table_tag);                
            $(table_tag_v).find('tr').each(function(i,elem) {
                $(elem).find('td:first').empty().css({'empty-cells':'hide'});
            });
        }
        set_tab_width_true();
    }
    
    $('#font_type option').each(function(i,elem) {
        $(elem).attr('value',$(elem).text()).css('font-family',$(elem).text());
    });   
    
    $('.slide_panel').on('click', '.a_close_panel', function(){
        $("div.slide_panel").animate({left:'-211px'},500);
        $("div.no_panel").animate({left:'0'},500);
        $("div#my").animate({margin:'0 auto 0 10vw'},500); 
        $("div#div_name_rep").animate({margin:'0 auto 0 10vw'},500); 
        $('.a_open_panel').show();
    });
    
    $('.slide_panel_view').on('click', '.a_close_panel', function(){
        $("div.slide_panel_view").animate({left:'-151px'},500);
        $('.a_open_panel_view').show();
    });
    
    $('body').on('click', '.a_open_panel', function(){
        $('.a_open_panel').hide();
        $("div.no_panel").animate({left:'211px'},500);  
        $("div.slide_panel").animate({left:'0'},500);         
        $("div#my").animate({margin:'0 auto 0 2vw'},500); 
        $("div#div_name_rep").animate({margin:'0 auto 0 2vw'},500);
    });
    
    $('body').on('click', '.a_open_panel_view', function(){
        $('.a_open_panel_view').hide();
        $("div.slide_panel_view").animate({left:'0'},500);
    });
        
    function set_change_style_li_panel(tek) {
        var change_style=$(tek).siblings().filter('[pr_change_style]');
        if ($(change_style).length>0) {
            $(change_style).css({'background' : 'white', 'color':'black', 'border-bottom-color':'black'}).removeAttr('pr_change_style');
        }                 
        $(tek).attr('pr_change_style','').css({'background' : 'black', 'color':'white', 'border-bottom-color':'white'});
    }
    
    function set_change_style_li_panel_action(tek) {
        var change_style=$(tek).siblings().filter('[pr_change_style]');
        if ($(change_style).length>0) {
            $(change_style).css({'background' : 'white', 'border-bottom-color':'black'}).removeAttr('pr_change_style');
            $(change_style).find('a').css({'color':'#0088cc'});
        }                 
        $(tek).attr('pr_change_style','').css({'background' : '#d1ffff', 'border-bottom-color':'white'});
        $(tek).find('a').css({'color':'black'});
    }
        
    
    $('.slide_panel,.slide_panel_view').on('click', '.panel_action', function(e){          
        var slide_panel=$('div.slide_panel');
        console.log('action='+this.id);
        
        if (this.id=='col_plus') { 
            var tds=$('#my').jexcel('getSelectedCells');
            td_plus(tds);
        }
        
        else if (['format_right','format_center','format_left','format_all'].indexOf(this.id)>-1) {
            //console.log(tek_kol);
            var tds=$('#my').jexcel('getSelectedCells');
            var td_format=$(this).attr('td_format');
            if ($(tds).length>0) {
                $(tds).each(function(i,elem) {
                    $(elem).css('text-align',td_format);
                });
            }
            $(slide_panel).find('.panel_action[td_format]').css('border','none');
            $(this).css('border','1px solid white');             
        }
        else if (['format_v_top','format_v_center','format_v_bottom'].indexOf(this.id)>-1) {
            //console.log(tek_kol);
            var tds=$('#my').jexcel('getSelectedCells');
            var td_format=$(this).attr('td_format_v');
            if ($(tds).length>0) {
                $(tds).each(function(i,elem) {
                    $(elem).css('vertical-align',td_format);                    
                });
            }
            $(slide_panel).find('.panel_action[td_format_v]').css('border','none');
            $(this).css('border','1px solid white');             
        }
        else if (font_mass.indexOf(this.id)>-1) {
            //console.log(tek_kol);
            var tds=$('#my').jexcel('getSelectedCells');
            var t_id=this.id;
            if ($(tds).length>0) {
                $(tds).each(function(i,elem) {
                    $(elem).toggleClass(t_id);                   
                });
            }
            $(this).toggleClass('border_on');            
        }        
        else if (this.id=='save_rap') {
            $(in_action_value).trigger("before_save_form");
            var name_rep=$('#div_name_rep #in_name_rep'),
                sname_rep=$(name_rep).attr('sname'),
                pr_save_ok=true,
                //обязательные поля
                el_required=$(table_tag).find('li.required_add[action_type] input:checked');
            //проверки
            if ($(name_rep).val().length===0) {
                pr_save_ok=false;
                alert('Форма отчета не сохранена, введите его наименование');            
            }
            $(el_required).each(function(i,elem) {
                var action_type_v=$(elem).attr('action_type');
                if (action_type_v=='input_add') {
                    var el_check=$(elem).closest('td').find('input.input_add[id="'+$(elem).attr('id')+'"]');
                    if ($(el_check).val().trim().length===0) {
                        pr_save_ok=false;
                        alert('Не заполнен обязательный элемент "Поле ввода" (выделено фиолетовым цветом)'); 
                    }
                }
                else if (action_type_v=='select_add') {
                    var el_check=$(elem).closest('td').find('select.select_add[id="'+$(elem).attr('id')+'"] option:selected');
                    if ($(el_check).length===0) {
                        pr_save_ok=false;
                        alert('Не заполнен обязательный элемент "Выпадающий список" (выделено фиолетовым цветом)'); 
                    }
                    else if ($(el_check).length===1) {
                        if ($(el_check).attr('value')==-1) {
                            pr_save_ok=false;
                            alert('Не заполнен обязательный элемент "Выпадающий список" (выделено фиолетовым цветом)'); 
                        }
                    }
                }
                else if (action_type_v=='in_modal_add') {
                    var el_check=$(elem).closest('td').find('input.in_modal_add_val[id="'+$(elem).attr('id')+'"]');
                    if ($(el_check).val().trim().length===0) {
                        pr_save_ok=false;
                        alert('Не заполнен обязательный элемент "Поле c вызовом модального окна" (выделено фиолетовым цветом)'); 
                    }
                }
            });
            //console.log(name_rep);
            if (pr_save_ok) {
                save_tab_data();
                var params = new Object();
                params['code_in']='save_rep';
                params['name_rep']=$(name_rep).val();
                params['sname_rep']=sname_rep;
                //уменьшаем объем хранимой инфы, избавляясь от её дубляжа
                var tab_obj_data_before=tab_obj.data;
                tab_obj.data=[];
                params['data_rep']=LZString.compressToUTF16(JSON.stringify(tab_obj));
                rep_id=$('#div_name_rep #in_rep_id');
                if ($(rep_id).val()=='') {
                    params['new']=1;                    
                }
                else {
                    params['id_rep']=$(rep_id).val();
                }
                //console.log(params);
                var byteLength_data_rep=byteLength(params['data_rep']);
                console.log(byteLength_data_rep);                
                //если превышает лимит ты обрезаем строки пока не поместится
                var const_byte=24161943;
                if (byteLength_data_rep>const_byte) {
                    alert('Отчет, возможно, не будет сохранен по причине большого объёма занимаемой памяти ('+byteLength_data_rep+' байт)');
                }
                                
                var table_all=$(table_all_tag),
                    table_tag_v=$(table_all).find('tbody:first'),
                    no_create_sl=$(table_all).find('thead div.settings_group_panel[action_type="form_header"] li.no_create_sl input'),
                    no_create_sl_v=($(no_create_sl).length>0) ? $(no_create_sl).prop('checked'):false;
                if (!no_create_sl_v) {
                    //собираем "код жизни" страницы, если не отключено в настройках формы
                    var form_js='';                                                                                             

                    //события кубов
                    var action_olap_code='',
                        action_olap_all=$(table_tag_v).find('li.action[action_type="olap"] li[pr_change_style]');
                    $(action_olap_all).each(function(i,elem) {
                        var action_olap_code_one=$(elem).find('.div_hidden').text();
                        if (action_olap_code_one!='') {
                            action_olap_code_one=LZString.decompressFromUTF16($(elem).find('.div_hidden').text()).trim();
                            if (action_olap_code_one.length>0) {
                                var olap_id=$(elem).closest('li.action').attr('id'),
                                    action_id=$(elem).attr('id');
                                if ((action_id=='tr_click') || (action_id=='tr_dclick')) {
                                    if (action_id=='tr_click') {
                                        action_id='click';
                                    }
                                    else if (action_id=='tr_dclick') {
                                        action_id='dblclick';
                                    }
                                    action_olap_code+='\n$(".no_panel").on("'+action_id+'","'+table_tag+' td[olap_td_class=\'td_val_val\'][olap_tab_id=\''+olap_id+'\'],'+table_tag+' td[olap_td_class=\'td_str_val\'][olap_tab_id=\''+olap_id+'\']", function(e){ \n'+
                                                     action_olap_code_one+'\n});\n'; 
                                }
                                else if  (action_id!='freedom_action') {                            
                                    action_olap_code+='$(".no_panel").on("'+action_id+olap_id+'", "#in_action_value", function(e){ \n'+ 
                                                     '  var id_t='+olap_id+';\n'+action_olap_code_one+'\n});\n'; 
                                }
                                else if  (action_id='freedom_action') {                            
                                    action_olap_code+=action_olap_code_one+'\n'; 
                                }
                            }   
                        }    
                    });
                    if (action_olap_code!=='') {
                        form_js+=action_olap_code;
                    }

                    //события таблиц кубов
                    var action_olap_code='';                
                    var action_olap_all=$(table_tag_v).find('.masterdata li.action_set_table .div_hidden.action_set_table_v .dt_tab_action .d-table[id="tab_taa_value"] .d-tr .taa_action_v');

                    if ($(action_olap_all).length>0) {
                        var om=String.fromCharCode(3840);
                        $(action_olap_all).each(function(i,elem) {
                            var kod_txt=$(elem).text(),
                                olap_id=$(elem).closest('.tab_action_add_md').attr('id')
                                id=$(elem).closest('.d-tr').find('.SYSNAME input').val().trim();
                            if (kod_txt.length>0) {
                                var kod_txt0=LZString.decompressFromUTF16(kod_txt),
                                    kod_txt_m=[];                            
                                try {
                                    kod_txt_m=kod_txt0.split(om);
                                }
                                catch(e) {
                                    kod_txt_m[0]=kod_txt0;
                                }
                                action_olap_code+='\n$(".no_panel").on("click", "a.olap_dop_action_one[olap_id='+olap_id+'][id=\''+id+'\']", function(e) { \n'+kod_txt_m[0]+'\n'+
                                                  '});\n'; 
                                if (!!kod_txt_m[1])  {
                                    action_olap_code+=kod_txt_m[1]+'\n';
                                }        
                            }
                        }); 
                    }
                    if (action_olap_code!=='') {
                        form_js+=action_olap_code;
                    }

                    //события самой формы
                    var settings_all=$('.settings_group_panel');
                    var action_form_header_code='';
                    var action_form_header_all=$(settings_all).find('a.action_one[action_type="form_header"]');
                    if ($(action_form_header_all).length>0) {
                        var action_form_header_all_true=[];
                        $(action_form_header_all).each(function(i,elem) {
                            if ($(elem).find('.div_hidden').html().trim().length>0) {
                                action_form_header_all_true.push(elem);
                            }
                        });
                        if (action_form_header_all_true.length>0) {
                            for (var i=0; i<action_form_header_all_true.length; i++) {
                                action_form_header_code+='$(".no_panel" ).on("'+$(action_form_header_all_true[i]).attr('id')+'", "#in_action_value", function(e) {\n'+
                                                     '    '+LZString.decompressFromUTF16($(action_form_header_all_true[i]).find('.div_hidden').text())+'\n'+
                                                     '  });\n'; 
                            }
                        }                    
                    }
                    if (action_form_header_code!=='') {
                        form_js+=action_form_header_code;
                    }

                    //события добавленных элементов
                    var action_img_add_code='';
                    var action_img_add_all=$(settings_all).find('a.action_one[id!="none"]:not([action_type="form_header"])');
                    if ($(action_img_add_all).length>0) {
                        var action_img_add_all_true=[];
                        $(action_img_add_all).each(function(i,elem) {
                            if ($(elem).find('.div_hidden').html().trim().length>0) {
                                action_img_add_all_true.push(elem);
                            }
                        });
                        if (action_img_add_all_true.length>0) {
                            function get_action_name(el_ac) {
                                var action_name_v='';
                                if ($(el_ac).attr('id')=='l_click') {
                                    action_name_v='click';
                                } 
                                else if ($(el_ac).attr('id')=='dl_click') {
                                    action_name_v='dblclick';
                                }
                                else if ($(el_ac).attr('id')=='r_click') {
                                    action_name_v='contextmenu';
                                }  
                                else if ($(el_ac).attr('id')=='hover') {
                                    action_name_v='mouseover';
                                }  
                                else if ($(el_ac).attr('id')=='hoveroff') {
                                    action_name_v='mouseout';
                                }
                                else if ($(el_ac).attr('id')=='hoveroff') {
                                    action_name_v='mouseout';
                                }
                                else if ($(el_ac).attr('id')=='input') {
                                    action_name_v='click keyup';
                                }                            
                                else {
                                    action_name_v=$(el_ac).attr('id');
                                }
                                return action_name_v;
                            }                                                
                            for (var i=0; i<action_img_add_all_true.length; i++) {                            
                                var id_v=$(action_img_add_all_true[i]).closest('.settings_group_panel').attr('id'),
                                    for_class=$(action_img_add_all_true[i]).attr('for_class'),
                                    action_name=get_action_name(action_img_add_all_true[i]),
                                    action_type=$(action_img_add_all_true[i]).attr('action_type'); 
                                if (action_name!='freedom_action') {
                                    if (action_type=='select_add') {
                                        for_class='select_add';
                                    }
                                    else if (action_type=='input_add') {
                                        for_class='input_add';
                                    }
                                    else if (action_type=='img_add') {
                                        for_class='img_add';
                                    }                                
                                    if (!!for_class) {
                                        for_class='.'+for_class;
                                    }  
                                    else {
                                        for_class='';
                                    }    
                                    action_img_add_code+='\n$(".no_panel" ).on("'+action_name+'", "'+for_class+'[action_type=\''+action_type+'\'][id='+id_v+']", function(e) {\n'+
                                                            '    '+LZString.decompressFromUTF16($(action_img_add_all_true[i]).find('.div_hidden').text())+'\n'+
                                                         '});';  
                                }   
                                else {
                                    action_img_add_code+='\n'+LZString.decompressFromUTF16($(action_img_add_all_true[i]).find('.div_hidden').text())+'\n';
                                }
                            }

                        }                    
                    }
                    if (action_img_add_code!=='') {
                        form_js+=action_img_add_code;
                    }

                    form_js='$(document).ready(function(){\n'+form_js+'\n});';
                    params['js_data']=form_js;
                }    
                
                $.ajax({
                    type: "POST",
                    url: "/get-data.php",
                    data: params,
                    dataType:'json',
                    success: function(data){
                        //console.log(data);
                        tab_obj.data=tab_obj_data_before;
                        $(in_action_value).trigger("after_save_form");
                        alert('Отчет успешно сохранен'); 
                        if (params['new']===1) {
                            //$(name_rep).after('<input type="hidden" id="in_rep_id" value="'+data.id_rep+'">');
                            document.location.href = "/rep_add.php?id="+data.id_rep;
                        }                        
                        
                    },
                    error: function(xhr, status, error) {
                        alert('Ошибка получения данных. Возможно, истекло время сессии.'+xhr.responseText+ ' ' + status + ' ' +error);
                        console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                    }
                });
            }            
        }
        else if (this.id=='tab_clear') {
            $('#my').jexcel(tab_obj_default);
        }
        else if (this.id=='td_clear') {
            var tds=$('#my').jexcel('getSelectedCells');
            if ($(tds).length==0) {
                alert('Необходимо выбрать не менее одной ячейки');
                return;
            }
            $(tds).each(function(i,elem) {
                $(elem).empty();
                $(elem).attr('style','');
                if ($(settings_group_panel_active).is(':visible')) {
                    $(settings_group_panel_active).hide();
                }
            });
        }
        else if (this.id=='td_get_panel_action') {
            var tds=$('#my').jexcel('getSelectedCells');
            if ($(tds).length!==1) {
                alert('Необходимо выбрать только одну ячейку');
                return;
            }
            var tek_kol=$(tds).first(),
                sgp=$(tek_kol).find('.settings_group_panel');
            if ($(sgp).length>0) {
                var action_type=$(sgp).attr('action_type'),
                    id_v=$(sgp).attr('id');
                e.stopPropagation();   
                set_settings_group_panel_active(action_type,id_v,sgp,tek_kol);
            } 
            else {
                if ($(settings_group_panel_active).is(':visible')) {
                    $(settings_group_panel_active).hide();
                }
            }
        }    
        else if (this.id=='cell_bord') {                        
            //console.log(e.target);
            var tds=$('#my').jexcel('getSelectedCells');
            if ($(tds).length==0) {
                alert('Необходимо выбрать не менее одной ячейки');
                return;
            }
            var min_i=999999,max_i=0,min_j=999999,max_j=0;
            var bord_orient=$(this).attr('bord_orient'),bord_style='solid',bord_size,bord_color;
            if (!!!bord_orient) {
                var li_tek;
                bord_orient=$(this).closest('.li_cons_top').attr('bord_orient');
                if ($(e.target).hasClass('a_cell_bord_w')) {
                    li_tek=$(e.target).closest('li');                    
                }
                else {
                    li_tek=this;                    
                }
                set_change_style_li_panel(li_tek);
                bord_style=$(li_tek).attr('name_style');
                bord_size=+$(li_tek).find('.a_cell_bord_w').val();
            }
            else {
                var change_style=$(this).find('li[pr_change_style]');
                if ($(change_style).length>0) {
                    bord_style=$(change_style).attr('name_style');
                    bord_size=+$(change_style).find('.a_cell_bord_w').val();
                }
            }
            if (bord_orient=='all') {
                bord_orient='border';
            }
            else if (bord_orient!='none') {
                bord_orient='border-'+bord_orient;
            }
            if (isNaN(bord_size)) {
                bord_size=+$('#cell_bord_size').val();
                if (isNaN(bord_size)) {
                    bord_size=1;
                }
            }
            
            bord_color=$(slide_panel).find('#border_color').val();
            if (!validColor(bord_color)) {
                alert('Не верно задан цвет рамки ячейки');
                bord_color='black';
            }
            if (bord_orient!='none') {
                $(tds).each(function(i,elem) {
                    //console.log(elem);
                    //console.log($(elem).index());
                    var mass_index=$(elem).attr('id').split('-');
                    if (mass_index[1]<min_i) {
                        min_i=+mass_index[1];
                    }
                    if (mass_index[1]>max_i) {
                        max_i=+mass_index[1];
                    }
                    var td_index=+mass_index[0];
                    if (td_index<min_j) {
                        min_j=td_index;
                    }
                    if (td_index>max_j) {
                        max_j=td_index;
                    }
                });
            }
            var tds_tr=$(tds).closest('tr');        
            if (bord_orient=='border-bottom') {
                var tds_tr_last=$(tds_tr).last();
                for (var j=(min_j); j<=(max_j); j++) {
                    var tek_td=$(tds_tr_last).find('#'+j+'-'+max_i);
                    if ($(tek_td).length>0) {
                        $(tek_td).css(bord_orient,bord_size+'px '+bord_style+' '+bord_color);
                    }
                } 
            } 
            else if (bord_orient=='border-top') {
                var tds_tr_first=$(tds_tr).first();
                for (var j=(min_j); j<=(max_j); j++) {
                    var tek_td=$(tds_tr_first).find('#'+j+'-'+min_i);
                    if ($(tek_td).length>0) {
                        $(tek_td).css(bord_orient,bord_size+'px '+bord_style+' '+bord_color);
                    }
                }
            }             
            else if (bord_orient=='border-left') {
                $(tds_tr).each(function(i,elem) {
                //for (var j=(min_i); j<=(max_i); j++) {
                    var j=$(elem).attr('id').split('-')[1];
                    var tek_td=$(elem).find('#'+min_j+'-'+j);
                    if ($(tek_td).length>0) {
                        $(tek_td).css(bord_orient,bord_size+'px '+bord_style+' '+bord_color);
                    }
                }); 
            }
            else if (bord_orient=='border-right') {
                $(tds_tr).each(function(i,elem) {
                    var j=$(elem).attr('id').split('-')[1];
                //for (var j=(min_i); j<=(max_i); j++) {
                    var tek_td=$(elem).find('#'+max_j+'-'+j);
                    if ($(tek_td).length==0) {
                        for (var i2=(min_j); i2<=(max_j); i2++) {
                            var tek_td2=$(elem).find('#'+i2+'-'+j);
                            if ($(tek_td2).length>0) {
                                tek_td=tek_td2;                                
                            }
                        }
                    }                    
                    if ($(tek_td).length>0) {
                        $(tek_td).css(bord_orient,bord_size+'px '+bord_style+' '+bord_color);
                    }
                }); 
            }  
            else if (bord_orient=='border') {
                /*$(tds).each(function(i,elem) {
                    $(elem).css(bord_orient,bord_size+'px '+bord_style+' '+bord_color);
                });*/
                //для корректной отрисовки деалем только снизу и справа
                $(tds_tr).each(function(i,elem) {
                    var j=$(elem).attr('id').split('-')[1];
                    for (var i=(min_j); i<=(max_j); i++) {
                        var tek_td=$(elem).find('#'+i+'-'+j);
                        if ($(tek_td).length>0) {
                            $(tek_td).css('border-bottom',bord_size+'px '+bord_style+' '+bord_color);
                            $(tek_td).css('border-right',bord_size+'px '+bord_style+' '+bord_color);
                            if (i==min_j) {
                                $(tek_td).css('border-left',bord_size+'px '+bord_style+' '+bord_color);
                            }
                        }
                    };                    
                });
                //дорисовываем первой строке верх
                var tds_tr_first=$(tds_tr).first();
                for (var i=(min_j); i<=(max_j); i++) {
                    var tek_td=$(tds_tr_first).find('#'+i+'-'+min_i);
                    if ($(tek_td).length>0) {
                        $(tek_td).css('border-top',bord_size+'px '+bord_style+' '+bord_color);
                    }
                }
            }
            else if (bord_orient=='none') {
                var mass_style_del=['border-bottom','border-top','border-left','border-right','border'];
                $(tds).each(function(i,elem) {
                    mass_style_del.forEach(function(element) {
                        removeCSS(elem,element);
                    });
                });
            } 
            e.stopPropagation();
        }
        else if (this.id=='export_excel') {
            run_export_xlsx();
            //e.stopPropagation();
        } 
        
        else if (this.id=='export_ras') {
            //console.log(e);
            var name_rep=$('#div_name_rep #in_name_rep');
            //console.log(name_rep);
            if ($(name_rep).val().length==0) {
                alert('Экспорт  не возможен, введите наименование отчета')                
            }
            else {
                save_tab_data('no_data');
                tab_obj.name=$(name_rep).val();
                var contents=LZString.compressToUTF16(JSON.stringify(tab_obj));
                export_file(tab_obj.name+'.ras', contents);
                var table=$(table_tag);
                $(table).find('tr').each(function(i,elem) {
                    var t_data_one=[];
                    $(elem).find('td').each(function(i2,elem2) {
                        if (i2>0) t_data_one.push($(elem2).text());
                    });
                    tab_obj.data.push(t_data_one);
                });
            } 
            e.stopPropagation();
        }
        
        else if (this.id=='sql_add') {            
            var tds=$('#my').jexcel('getSelectedCells');           
            if ($(tds).length==1) {
                var sql_id=0;
                var table=$(table_tag);
                $(table).find('div.sql_group').each(function(i,elem) {
                    if (Number($(elem).attr('id'))>sql_id) {
                        sql_id=+$(elem).attr('id');
                    }                   
                });
                sql_id+=1;
                $(tds).html('<div class="sql_group_panel_doc" style="margin:0;padding:0;"><a class="sql_group_panel_oc" id="'+sql_id+'">SQL</a></div><div class="sql_group_text" id='+sql_id+'></div>'+
                            '<div class="sql_group_razdel" id="'+sql_id+'" td_id="'+$(tds).attr('id')+'">'+                                                                 
                            '</div>'+
                            '<div class="sql_group" id="'+sql_id+'">'+                                                                 
                            '</div>');
            }
            else {
                alert('Необходимо выбрать только одну ячейку');
            }
        }
        
        else if (this.id=='but_xlsx_add') {
            var tds=$('#my').jexcel('getSelectedCells');           
            if ($(tds).length==1) {
                $(tds).html('<a class="a_but_xlsx_add" title="Выгрузить в XLSX"><img src="/img/UPLOAD-Excel.png" style="height:27px;width:auto" title="Выгрузить в XLSX"></a>');
            }
            else {
                alert('Необходимо выбрать только одну ячейку');
            }
        }
        
        else if (this.id=='img_add') {            
            var tds=$('#my').jexcel('getSelectedCells');           
            if ($(tds).length==1) {
                var setting_id=get_setting_id('img_add');      
                $(tds).html('<div class="settings_group_panel" id="'+setting_id+'" action_type="img_add">'+
                                '<ul class="ul_cons top-level" action_type="img_add">'+
                                    '<li id="'+setting_id+'" class="description li_cons li_cons_top" style="background: none;" action_type="img_add">\n'+
                                         '<img src="/img/descripe.png" style="width:auto;height:30px;" title="Описание функционала">\n'+
                                         '<div class="div_hidden"></div>\n'+                    
                                     '</li>\n'+
                                     '<li id="'+setting_id+'" class="load_img li_cons li_cons_top" style="background: none;vertical-align: bottom;" action_type="img_add">\n'+
                                         '<label class="file_upload">'+
                                            '<span class="button"><img src="/img/download.png" style="height:27px;width:auto" title="Загрузить рисунок"></span>'+
                                            '<mark></mark>'+
                                            '<input type="file">'+
                                         '</label>'+
                                     '</li>\n'+
                                     '<li id="'+setting_id+'" class="html_one li_cons li_cons_top" style="background: none;" action_type="img_add">'+
                                          '<img src="/img/html5.png" style="height:27px;width:auto;"title="Редактировать HTML">\n'+                                        
                                     '</li>\n'+
                                     '<li id="'+setting_id+'" class="action li_cons li_cons_top" style="background: none;" action_type="img_add"><img src="/img/actions.png" style="height:27px;width:auto;"title="Действия">\n'+
                                         '<ul class="ul_cons second-level" style="width: 130px;text-align: left;border: 1px solid #008000;border-radius: 0 0 10px 10px;" action_type="img_add">\n'+
                                             '<li id="none" class="li_cons" title="Отсутствует" style="height: 20px;width: 130px;color: white;background: #d1ffff;border-bottom-color: white;"  action_type="img_add" pr_change_style>'+                                   
                                                 '<a id="none" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="img_add">\n'+
                                                     'Отсутствует\n'+
                                                 '</a>\n'+
                                             '</li>\n'+
                                             '<li id="l_click" class="li_cons" title="Клик ЛКМ" style="height: 20px;width: 130px;" action_type="img_add">'+
                                                 '<a id="l_click" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="img_add">\n'+
                                                     'Клик ЛКМ\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="l_click" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="img_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+  
                                             '<li id="dl_click" class="li_cons" title="ДКлик ЛКМ" style="height: 20px;width: 130px;" action_type="img_add">'+
                                                 '<a id="dl_click" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="img_add">\n'+
                                                     'ДКлик ЛКМ\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="dl_click" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="img_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+ 
                                             '<li id="r_click" class="li_cons" title="Клик ПКМ" style="height: 20px;width: 130px;" action_type="img_add">'+
                                                 '<a id="r_click" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="img_add">\n'+
                                                     'Клик ПКМ\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="r_click" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="img_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+ 
                                             '<li id="hover" class="li_cons" title="Наведение" style="height: 20px;width: 130px;border-radius: 0 0 10px 10px;" action_type="img_add">'+
                                                 '<a id="hover" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="img_add">\n'+
                                                     'Наведение\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="hover" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="img_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+
                                             '<li id="hoveroff" class="li_cons" title="Отведение" style="height: 20px;width: 130px;border-radius: 0 0 10px 10px;" action_type="img_add">'+
                                                 '<a id="hoveroff" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="img_add">\n'+
                                                     'Отведение\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="hoveroff" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="img_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+
                                         '</ul>\n'+
                                     '</li>\n'+
                                     '<div class="clear"></div>\n'+
                                 '</ul>'+                                
                            '</div>\n\
                            <a class="img_add" id="'+setting_id+'" action_type="img_add"><img src="/img/insert_picture.png" style="height:27px;width:auto;"></a>');
            }
            else {
                alert('Необходимо выбрать только одну ячейку');
            }
        }   
        
        else if (this.id=='input_add') {            
            var tds=$('#my').jexcel('getSelectedCells');           
            if ($(tds).length==1) {
                var setting_id=get_setting_id("input_add");      
                $(tds).html('<div class="settings_group_panel" id="'+setting_id+'" action_type="input_add">'+
                                '<ul class="ul_cons top-level" action_type="input_add">'+
                                    '<li id="'+setting_id+'" class="description li_cons li_cons_top" style="background: none;" action_type="input_add">\n'+
                                         '<img src="/img/descripe.png" style="width:auto;height:30px;" title="Описание функционала">\n'+
                                         '<div class="div_hidden"></div>\n'+                    
                                     '</li>\n'+
                                     '<li id="'+setting_id+'" class="in_type li_cons li_cons_top" style="background: none;" action_type="input_add"><img src="/img/type.png" style="height:27px;width:auto;"title="Тип поля ввода">\n'+
                                         '<ul class="ul_cons second-level" style="width: 80px;text-align: left;border: 1px solid #008000;border-radius: 0 0 10px 10px;" action_type="input_add">\n'+
                                             '<li id="text" class="li_cons in_type_one" title="Текст" style="height: 20px;width: 80px;color:black;background: #d1ffff;border-bottom-color: white;"  action_type="input_add" pr_change_style>Строка'+                                                                                    
                                             '</li>\n'+
                                             '<li id="number" class="li_cons in_type_one" title="Число" style="height: 20px;width: 80px;color:#0088cc;" action_type="input_add">Число'+
                                             '</li>\n'+  
                                             '<li id="date" class="li_cons in_type_one" title="Дата" style="height: 20px;width: 80px;color:#0088cc;" action_type="input_add">Дата'+
                                             '</li>\n'+ 
                                             '<li id="datetime" class="li_cons in_type_one" title="Дата-время" style="height: 20px;width: 80px;color:#0088cc;" action_type="input_add">Дата-время'+
                                             '</li>\n'+ 
                                             '<li id="checkbox" class="li_cons in_type_one" title="Логическое" style="height: 20px;width: 80px;color:#0088cc;" action_type="input_add">Логическое'+
                                             '</li>\n'+
                                             '<li id="time" class="li_cons in_type_one" title="Время" style="height: 20px;width: 80px;color:#0088cc;" action_type="input_add">Время'+
                                             '</li>\n'+
                                             '<li id="tel" class="li_cons in_type_one" title="Телефон" style="height: 20px;width: 80px;color:#0088cc;" action_type="input_add">Телефон'+
                                             '</li>\n'+
                                             '<li id="email" class="li_cons in_type_one" title="E-mail" style="height: 20px;width: 80px;border-radius: 0 0 10px 10px;color:#0088cc;" action_type="input_add">E-mail'+
                                             '</li>\n'+
                                         '</ul>\n'+
                                     '</li>\n'+
                                     '<li id="'+setting_id+'" class="html_one li_cons li_cons_top" style="background: none;" action_type="input_add">'+
                                          '<img src="/img/html5.png" style="height:27px;width:auto;"title="Редактировать HTML">\n'+                                        
                                     '</li>\n'+
                                     '<li id="'+setting_id+'" class="action li_cons li_cons_top" style="background: none;" action_type="input_add"><img src="/img/actions.png" style="height:27px;width:auto;"title="Действия">\n'+
                                         '<ul class="ul_cons second-level" style="width: 130px;text-align: left;border: 1px solid #008000;border-radius: 0 0 10px 10px;" action_type="input_add">\n'+
                                             '<li id="none" class="li_cons" title="Отсутствует" style="height: 20px;width: 130px;color: white;background: #d1ffff;border-bottom-color: white;"  action_type="input_add" pr_change_style>'+                                   
                                                 '<a id="none" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="input_add">\n'+
                                                     'Отсутствует\n'+
                                                 '</a>\n'+
                                             '</li>\n'+
                                             '<li id="l_click" class="li_cons" title="Клик ЛКМ" style="height: 20px;width: 130px;" action_type="input_add">'+
                                                 '<a id="l_click" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="input_add">\n'+
                                                     'Клик ЛКМ\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="l_click" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="input_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+  
                                             '<li id="dl_click" class="li_cons" title="ДКлик ЛКМ" style="height: 20px;width: 130px;" action_type="input_add">'+
                                                 '<a id="dl_click" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="input_add">\n'+
                                                     'ДКлик ЛКМ\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="dl_click" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="input_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+ 
                                             '<li id="r_click" class="li_cons" title="Клик ПКМ" style="height: 20px;width: 130px;" action_type="input_add">'+
                                                 '<a id="r_click" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="input_add">\n'+
                                                     'Клик ПКМ\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="r_click" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="input_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+
                                             '<li id="input" class="li_cons" title="Ввод" style="height: 20px;width: 130px;" action_type="input_add">'+
                                                 '<a id="input" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="input_add">\n'+
                                                     'Ввод\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="input" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="input_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+
                                             '<li id="hover" class="li_cons" title="Наведение" style="height: 20px;width: 130px;" action_type="input_add">'+
                                                 '<a id="hover" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="input_add">\n'+
                                                     'Наведение\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="hover" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="input_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+
                                             '<li id="hoveroff" class="li_cons" title="Отведение" style="height: 20px;width: 130px;" action_type="input_add">'+
                                                 '<a id="hoveroff" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="input_add">\n'+
                                                     'Отведение\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="hoveroff" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="input_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+
                                             '<li id="freedom_action" class="li_cons" title="Свободное действие" style="height: 20px;width: 130px;border-radius: 0 0 10px 10px;" action_type="input_add">'+
                                                 '<a id="freedom_action" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="input_add">\n'+
                                                     'Свободное д-е\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="hoveroff" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="input_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+                     
                                         '</ul>\n'+
                                     '</li>\n'+                                                                                  
                                    '<li id="'+setting_id+'" class="required_add li_cons li_cons_top" action_type="input_add">'+
                                       '<input id="'+setting_id+'" type="checkbox" title="Обязательность" action_type="input_add">'+
                                    '</li>\n'+
                                     '<div class="clear"></div>\n'+
                                 '</ul>'+                                
                            '</div>\n\
                            <input class="input_add" type="text" id="'+setting_id+'" style="border: 1px solid #cccccc;" action_type="input_add">');
            }
            else {
                alert('Необходимо выбрать только одну ячейку');
            }
        }
        
        else if (this.id=='select_add') {            
            var tds=$('#my').jexcel('getSelectedCells');           
            if ($(tds).length==1) {
                var setting_id=get_setting_id("select_add");      
                $(tds).html('<div class="settings_group_panel" id="'+setting_id+'" action_type="select_add">'+
                                '<ul class="ul_cons top-level" action_type="select_add">'+
                                    '<li id="'+setting_id+'" class="description li_cons li_cons_top" style="background: none;" action_type="select_add">\n'+
                                         '<img src="/img/descripe.png" style="width:auto;height:30px;" title="Описание функционала">\n'+
                                         '<div class="div_hidden"></div>\n'+                    
                                     '</li>\n'+
                                     '<li id="'+setting_id+'" class="select_add_sql li_cons li_cons_top" style="background: none;" action_type="select_add">'+
                                          '<img src="/img/edit_sql.png" style="height:27px;width:auto;"title="Редактировать SQL">\n'+ 
                                          '<div class="div_hidden"></div>\n'+
                                     '</li>\n'+                                     
                                     '<li id="'+setting_id+'" class="html_one li_cons li_cons_top" style="background: none;" action_type="select_add">'+
                                          '<img src="/img/html5.png" style="height:27px;width:auto;"title="Редактировать HTML">\n'+                                        
                                     '</li>\n'+
                                     '<li id="'+setting_id+'" class="action li_cons li_cons_top" style="background: none;" action_type="select_add"><img src="/img/actions.png" style="height:27px;width:auto;"title="Действия">\n'+
                                         '<ul class="ul_cons second-level" style="width: 130px;text-align: left;border: 1px solid #008000;border-radius: 0 0 10px 10px;" action_type="select_add">\n'+
                                             '<li id="none" class="li_cons" title="Отсутствует" style="height: 20px;width: 130px;color: white;background: #d1ffff;border-bottom-color: white;"  action_type="select_add" pr_change_style>'+                                   
                                                 '<a id="none" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="select_add">\n'+
                                                     'Отсутствует\n'+
                                                 '</a>\n'+
                                             '</li>\n'+
                                            /* '<li id="l_click" class="li_cons" title="Клик ЛКМ" style="height: 20px;width: 130px;" action_type="select_add">'+
                                                 '<a id="l_click" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="select_add">\n'+
                                                     'Клик ЛКМ\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="l_click" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="select_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+  
                                             '<li id="dl_click" class="li_cons" title="ДКлик ЛКМ" style="height: 20px;width: 130px;" action_type="select_add">'+
                                                 '<a id="dl_click" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="select_add">\n'+
                                                     'ДКлик ЛКМ\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="dl_click" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="select_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+ 
                                             '<li id="r_click" class="li_cons" title="Клик ПКМ" style="height: 20px;width: 130px;" action_type="select_add">'+
                                                 '<a id="r_click" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="select_add">\n'+
                                                     'Клик ПКМ\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="r_click" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="select_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+
                                             '<li id="input" class="li_cons" title="Ввод" style="height: 20px;width: 130px;" action_type="select_add">'+
                                                 '<a id="input" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="select_add">\n'+
                                                     'Ввод\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="input" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="select_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+
                                             '<li id="hover" class="li_cons" title="Наведение" style="height: 20px;width: 130px;" action_type="select_add">'+
                                                 '<a id="hover" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="select_add">\n'+
                                                     'Наведение\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="hover" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="select_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+
                                             '<li id="hoveroff" class="li_cons" title="Отведение" style="height: 20px;width: 130px;border-radius: 0 0 10px 10px;" action_type="select_add">'+
                                                 '<a id="hoveroff" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="select_add">\n'+
                                                     'Отведение\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="hoveroff" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="select_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+*/
                                             '<li id="change" class="li_cons" title="Выбор" style="height: 20px;width: 130px;border-radius: 0 0 10px 10px;" action_type="select_add">'+
                                                 '<a id="change" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="select_add">\n'+
                                                     'Выбор\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="change" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="select_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+
                                         '</ul>\n'+
                                     '</li>\n'+
                                     '<li id="'+setting_id+'" class="type li_cons li_cons_top" style="background: none;" action_type="select_add"><img src="/img/type.png" style="height:27px;width:auto;"title="Тип значения">\n'+
                                         '<ul class="ul_cons second-level" style="width: 130px;text-align: left;border: 1px solid #008000;border-radius: 0 0 10px 10px;" action_type="select_add">\n'+
                                             '<li id="number" class="li_cons" title="Число" style="height: 20px;width: 130px;color: white;background: #d1ffff;border-bottom-color: white;"  action_type="select_add" pr_change_style>'+                                   
                                                 '<a id="number" class="type_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="select_add">\n'+
                                                     'Число\n'+
                                                 '</a>\n'+
                                             '</li>\n'+
                                             '<li id="text" class="li_cons" title="Текст" style="height: 20px;width: 130px;border-radius: 0 0 10px 10px;" action_type="select_add">'+
                                                 '<a id="text" class="type_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="select_add">\n'+
                                                     'Текст\n'+
                                                 '</a>\n'+                                                 
                                             '</li>\n'+                                               
                                         '</ul>\n'+
                                     '</li>\n'+
                                     '<li id="'+setting_id+'" class="required_add li_cons li_cons_top" style="background: none;" action_type="select_add">'+
                                         '<input id="'+setting_id+'" type="checkbox" title="Обязательность" action_type="select_add">'+
                                     '</li>\n'+
                                     '<li id="'+setting_id+'" class="multi_add li_cons li_cons_top" style="background: none;" action_type="select_add">'+
                                         '<input id="'+setting_id+'" type="checkbox" title="Мультивыбор" action_type="select_add">'+
                                     '</li>\n'+                                     
                                     '<div class="clear"></div>\n'+
                                 '</ul>'+                                
                            '</div>\n\
                            <select class="select_add" id="'+setting_id+'" action_type="select_add"></select>');
            }
            else {
                alert('Необходимо выбрать только одну ячейку');
            }
        } 
        
        else if (this.id=='in_modal_add') {            
            var tds=$('#my').jexcel('getSelectedCells');           
            if ($(tds).length==1) {
                var setting_id=get_setting_id("in_modal_add");      
                $(tds).html('<div class="settings_group_panel" id="'+setting_id+'" action_type="in_modal_add">'+
                                '<ul class="ul_cons top-level" action_type="in_modal_add">'+
                                    '<li id="'+setting_id+'" class="description li_cons li_cons_top" style="background: none;" action_type="in_modal_add">\n'+
                                         '<img src="/img/descripe.png" style="width:auto;height:30px;" title="Описание функционала">\n'+
                                         '<div class="div_hidden"></div>\n'+                    
                                     '</li>\n'+
                                     '<li id="'+setting_id+'" class="in_modal_add_struct li_cons li_cons_top" style="background: none;" action_type="in_modal_add">'+
                                          '<img src="/img/edit_tab_in_mod.png" style="height:30px;width:auto;"title="Редактировать структуру модального окна">\n'+ 
                                          '<div class="div_hidden">\n'+
                                                get_in_modal_md('',setting_id)+
                                          '</div>\n'+
                                     '</li>\n'+                                     
                                     '<li id="'+setting_id+'" class="html_one li_cons li_cons_top" style="background: none;" action_type="in_modal_add">'+
                                          '<img src="/img/html5.png" style="height:27px;width:auto;"title="Редактировать HTML">\n'+                                        
                                     '</li>\n'+
                                     '<li id="'+setting_id+'" class="action li_cons li_cons_top" style="background: none;" action_type="in_modal_add"><img src="/img/actions.png" style="height:27px;width:auto;"title="Действия">\n'+
                                         '<ul class="ul_cons second-level" style="width: 130px;text-align: left;border: 1px solid #008000;border-radius: 0 0 10px 10px;" action_type="in_modal_add">\n'+
                                             '<li id="none" class="li_cons" title="Отсутствует" style="height: 20px;width: 130px;color: white;background: #d1ffff;border-bottom-color: white;"  action_type="in_modal_add" pr_change_style>'+                                   
                                                 '<a id="none" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="in_modal_add">\n'+
                                                     'Отсутствует\n'+
                                                 '</a>\n'+
                                             '</li>\n'+
                                            /* '<li id="l_click" class="li_cons" title="Клик ЛКМ" style="height: 20px;width: 130px;" action_type="in_modal_add">'+
                                                 '<a id="l_click" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="in_modal_add">\n'+
                                                     'Клик ЛКМ\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="l_click" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="in_modal_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+  
                                             '<li id="dl_click" class="li_cons" title="ДКлик ЛКМ" style="height: 20px;width: 130px;" action_type="in_modal_add">'+
                                                 '<a id="dl_click" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="in_modal_add">\n'+
                                                     'ДКлик ЛКМ\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="dl_click" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="in_modal_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+ 
                                             '<li id="r_click" class="li_cons" title="Клик ПКМ" style="height: 20px;width: 130px;" action_type="in_modal_add">'+
                                                 '<a id="r_click" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="in_modal_add">\n'+
                                                     'Клик ПКМ\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="r_click" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="in_modal_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+
                                             '<li id="input" class="li_cons" title="Ввод" style="height: 20px;width: 130px;" action_type="in_modal_add">'+
                                                 '<a id="input" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="in_modal_add">\n'+
                                                     'Ввод\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="input" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="in_modal_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+
                                             '<li id="hover" class="li_cons" title="Наведение" style="height: 20px;width: 130px;" action_type="in_modal_add">'+
                                                 '<a id="hover" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="in_modal_add">\n'+
                                                     'Наведение\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="hover" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="in_modal_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+
                                             '<li id="hoveroff" class="li_cons" title="Отведение" style="height: 20px;width: 130px;border-radius: 0 0 10px 10px;" action_type="in_modal_add">'+
                                                 '<a id="hoveroff" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="in_modal_add">\n'+
                                                     'Отведение\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="hoveroff" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="in_modal_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+*/
                                             '<li id="change_val" class="li_cons" title="Выбор" style="height: 20px;width: 130px;border-radius: 0 0 10px 10px;" action_type="in_modal_add">'+
                                                 '<a id="change_val" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="in_modal_add" for_class="in_modal_add_val">\n'+
                                                     'Выбор\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="change_val" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="in_modal_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+
                                         '</ul>\n'+
                                     '</li>\n'+
                                     '<li id="'+setting_id+'" class="type li_cons li_cons_top" style="background: none;" action_type="in_modal_add"><img src="/img/type.png" style="height:27px;width:auto;"title="Тип значения">\n'+
                                         '<ul class="ul_cons second-level" style="width: 130px;text-align: left;border: 1px solid #008000;border-radius: 0 0 10px 10px;" action_type="in_modal_add">\n'+
                                             '<li id="number" class="li_cons" title="Число" style="height: 20px;width: 130px;color: white;background: #d1ffff;border-bottom-color: white;"  action_type="in_modal_add" pr_change_style>'+                                   
                                                 '<a id="number" class="type_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="in_modal_add">\n'+
                                                     'Число\n'+
                                                 '</a>\n'+
                                             '</li>\n'+
                                             '<li id="text" class="li_cons" title="Текст" style="height: 20px;width: 130px;border-radius: 0 0 10px 10px;" action_type="in_modal_add">'+
                                                 '<a id="text" class="type_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="in_modal_add">\n'+
                                                     'Текст\n'+
                                                 '</a>\n'+                                                 
                                             '</li>\n'+                                               
                                         '</ul>\n'+
                                     '</li>\n'+
                                     '<li id="'+setting_id+'" class="required_add li_cons li_cons_top" style="background: none;" action_type="in_modal_add">'+
                                         '<input id="'+setting_id+'" type="checkbox" title="Обязательность" action_type="in_modal_add">'+
                                     '</li>\n'+
                                     '<li id="'+setting_id+'" class="multi_add li_cons li_cons_top" style="background: none;" action_type="in_modal_add">'+
                                         '<input id="'+setting_id+'" type="checkbox" title="Мультивыбор" action_type="in_modal_add">'+
                                     '</li>\n'+                                     
                                     '<div class="clear"></div>\n'+
                                 '</ul>'+                                
                            '</div>\n\
                            <div class="tab_in_modal d-table" id="'+setting_id+'" action_type="in_modal_add">\n\
                            </div>\n\
                            <div class="div_in_modal_add" id="'+setting_id+'" action_type="in_modal_add">\n\
                                <input class="in_modal_add_txt" type="text" id="'+setting_id+'" readonly action_type="in_modal_add" style="width: calc(100% - 22px);border: 1px solid #cccccc;"><button class="but_in_modal" action_type="in_modal_add" id="'+setting_id+'">...</button>\n\
                                <input type="hidden" class="in_modal_add_val" id="'+setting_id+'" action_type="in_modal_add">\n\
                            </div>');
            }
            else {
                alert('Необходимо выбрать только одну ячейку');
            }
        }  
        
        else if (this.id=='panel_add') {            
            var tds=$('#my').jexcel('getSelectedCells'),
                tds_tr=$(tds).closest('tr');           
            if ($(tds_tr).length>1) {
                var setting_id=get_setting_id("panel_add"),
                    str_tab=''; 
                $(tds).each(function(i2,elem2) {
                    $(elem2).attr('panel_add_id',setting_id);
                });    
                $(tds_tr).filter(':not(:first)').each(function(i,elem) {
                    //str_tab+='<div class="d-tr" id="'+$(elem).attr('id')+'">';
                    $(tds).each(function(i2,elem2) {
                        var tek_elem=$(elem).find('td[id="'+$(elem2).attr('id')+'"]');
                        if ($(tek_elem).length>0) {
                            str_tab+='<div class="d-td" id="d'+$(elem2).attr('id')+'"></div>';
                        }
                    });
                    //str_tab+='</div>';
                });
                //выделенные ячейки первой строки
                var tds_tr_ftd=$(tds_tr).first().find('td[panel_add_id="'+setting_id+'"]');
                if ($(tds_tr_ftd).length>1) {
                    //объединяем 
                    td_plus(tds_tr_ftd);
                }    
                $(tds_tr_ftd).first().attr('panel_add_id',setting_id).html('<div class="settings_group_panel" id="'+setting_id+'" action_type="panel_add">'+
                                '<ul class="ul_cons top-level" action_type="panel_add">'+
                                    '<li id="'+setting_id+'" class="description li_cons li_cons_top" style="background: none;" action_type="panel_add">\n'+
                                         '<img src="/img/descripe.png" style="width:auto;height:30px;" title="Описание функционала">\n'+
                                         '<div class="div_hidden"></div>\n'+                    
                                     '</li>\n'+
                                     '<li id="'+setting_id+'" class="panel_add_struct li_cons li_cons_top" style="background: none;" action_type="panel_add">'+
                                          '<img src="/img/edit_tab_in_mod.png" style="height:30px;width:auto;"title="Редактировать структуру модального окна">\n'+ 
                                          '<div class="div_hidden">\n\
                                            <div id="'+setting_id+'" class="panel_add_md" style="display: none;">\n\
                                                <div class="md_panel_es">\n\
                                                    <a class="panel_add_md_save" id="'+setting_id+'" title="Сохранить структуру" style="z-index: 500000;">\n\
                                                        <img src="/img/save.png" width="30" height="auto">\n\
                                                    </a>\n\
                                                </div>\n\
                                                <div class="polya d-table" style="display: inline;">\n\
                                                    <div class="d-tr">\n\
                                                        <div class="d-td" style="font-size:12pt;font-weight:bold;"><a class="panel_add_atr_add"><img src="/img/add.png" title="Добавить вкладку" style="height:27px;width:auto;display:inline-block;margin:3px;"></a><a class="panel_add_atr_del"><img src="/img/rep_del.png" title="Удалить вкладку" style="height:27px;width:auto;display:inline-block;margin:3px;"></a> Список вкладок</div>\n\
                                                    </div>\n\
                                                    <div class="d-td" style="padding:0;">\n\
                                                        <div class="d-table" id="tab_pol">\n\
                                                            <div class="d-tr" id="after_append">\n\
                                                                <div class="d-td" style="font-size:11pt;font-weight:bold;">Сис.имя</div>\n\
                                                                <div class="d-td" style="font-size:11pt;font-weight:bold;">Наименование</div>\n\
                                                            </div>\n\
                                                            <div class="d-tr">\n\
                                                                <div class="SYSNAME d-td"><input type="text" value="anynameyouwant1"></div>\n\
                                                                <div class="NAME d-td"><input type="text" value="Tab Title 1"></div>\n\
                                                            </div>\n\
                                                           <div class="d-tr">\n\
                                                                <div class="SYSNAME d-td"><input type="text" value="anynameyouwant2"></div>\n\
                                                                <div class="NAME d-td"><input type="text" value="Tab Title 2"></div>\n\
                                                            </div>\n\
                                                        </div>\n\
                                                    </div>\n\
                                                </div>\n\
                                              </div>\n\
                                           </div>\n'+
                                     '</li>\n'+                                     
                                     '<li id="'+setting_id+'" class="html_one li_cons li_cons_top" style="background: none;" action_type="panel_add">'+
                                          '<img src="/img/html5.png" style="height:27px;width:auto;"title="Редактировать HTML">\n'+                                        
                                     '</li>\n'+
                                     '<li id="'+setting_id+'" class="action li_cons li_cons_top" style="background: none;" action_type="panel_add"><img src="/img/actions.png" style="height:27px;width:auto;"title="Действия">\n'+
                                         '<ul class="ul_cons second-level" style="width: 130px;text-align: left;border: 1px solid #008000;border-radius: 0 0 10px 10px;" action_type="panel_add">\n'+
                                             '<li id="none" class="li_cons" title="Отсутствует" style="height: 20px;width: 130px;color: white;background: #d1ffff;border-bottom-color: white;"  action_type="panel_add" pr_change_style>'+                                   
                                                 '<a id="none" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="panel_add">\n'+
                                                     'Отсутствует\n'+
                                                 '</a>\n'+
                                             '</li>\n'+
                                            /* '<li id="l_click" class="li_cons" title="Клик ЛКМ" style="height: 20px;width: 130px;" action_type="panel_add">'+
                                                 '<a id="l_click" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="panel_add">\n'+
                                                     'Клик ЛКМ\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="l_click" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="panel_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+  
                                             '<li id="dl_click" class="li_cons" title="ДКлик ЛКМ" style="height: 20px;width: 130px;" action_type="panel_add">'+
                                                 '<a id="dl_click" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="panel_add">\n'+
                                                     'ДКлик ЛКМ\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="dl_click" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="panel_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+ 
                                             '<li id="r_click" class="li_cons" title="Клик ПКМ" style="height: 20px;width: 130px;" action_type="panel_add">'+
                                                 '<a id="r_click" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="panel_add">\n'+
                                                     'Клик ПКМ\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="r_click" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="panel_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+
                                             '<li id="input" class="li_cons" title="Ввод" style="height: 20px;width: 130px;" action_type="panel_add">'+
                                                 '<a id="input" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="panel_add">\n'+
                                                     'Ввод\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="input" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="panel_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+
                                             '<li id="hover" class="li_cons" title="Наведение" style="height: 20px;width: 130px;" action_type="panel_add">'+
                                                 '<a id="hover" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="panel_add">\n'+
                                                     'Наведение\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="hover" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="panel_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+
                                             '<li id="hoveroff" class="li_cons" title="Отведение" style="height: 20px;width: 130px;border-radius: 0 0 10px 10px;" action_type="panel_add">'+
                                                 '<a id="hoveroff" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="panel_add">\n'+
                                                     'Отведение\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="hoveroff" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="panel_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+*/
                                             '<li id="tab_click" class="li_cons" title="Выбор" style="height: 20px;width: 130px;border-radius: 0 0 10px 10px;" action_type="panel_add">'+
                                                 '<a id="tab_click" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="panel_add" for_class="panel_add_val">\n'+
                                                     'Выбор\n'+
                                                     '<div class="div_hidden"></div>\n'+
                                                 '</a>\n'+
                                                 '<a id="tab_click" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="panel_add">\n'+
                                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                     '<div class="div_hidden_desc"></div>\n'+
                                                 '</a>\n'+ 
                                             '</li>\n'+
                                         '</ul>\n'+
                                     '</li>\n'+                                                                                                         
                                     '<div class="clear"></div>\n'+
                                 '</ul>'+                                
                            '</div>\n\
                            <div class="panel_add" id="'+setting_id+'" action_type="panel_add">\n\
                                <div data-pws-tab="anynameyouwant1" data-pws-tab-name="Tab Title 1">'+str_tab+'</div>\n\
                                <div data-pws-tab="anynameyouwant2" data-pws-tab-name="Tab Title 2">'+str_tab+'</div>\n\
                            </div>');
                $('.panel_add[action_type="panel_add"][id="'+setting_id+'"]').pwstabs();
            }
            else {
                alert('Необходимо выбрать не менее двух ячеек расположенных в разных строках');
            }
        }  
    });    
    
    $( ".no_panel" ).on("change", ".file_upload input", function() {
        //filesImg = this.files;
        var img_upd=$('a.img_add[id="'+$(this).closest('div').attr('id')+'"]').find('img');
        var file = this.files[0];
        console.log((file.size/1024));
        
        var reader = new FileReader();            
        reader.onloadend = function() {
            $(img_upd).attr('src',this.result);          
        }
        file ? reader.readAsDataURL(file) : console.log('Картинка не загружена');
        
    });
    
    function get_setting_id(action_type) {
        var table=$(table_all_tag);
        var setting_id=0;
        $(table).find('.settings_group_panel').each(function(i,elem) {
            var tek_set=Number($(elem).attr('id'));
            if (tek_set>setting_id) {
                setting_id=tek_set;
            }                   
        });
        setting_id+=1;
        if (action_type=='form_header') {
            setting_id=1;
        }
        else {
            if (setting_id===1) {
                setting_id=2;
            }
        }
        return setting_id;
    }    
    
    $('.no_panel').on('click', 'table.jexcel td,table.jexcel td div,table.jexcel td p,table.jexcel td input', function(e){
        if (!$(this).is('td')) {
            tek_kol=$(this).closest('td');
            $('#my').jexcel('updateSelection', tek_kol, tek_kol, 1);
        }
        else {
            tek_kol=$(this);
        }
        var slide_panel=$('div.slide_panel');
        var table=$(table_tag);
        
        //console.log(columns_mass[$(tek_kol).index()-1].type);
        $(slide_panel).find('#type_col option').removeAttr('selected');
        $(slide_panel).find('#font_type option').removeAttr('selected');
        $(slide_panel).find('.panel_action[td_format_v]').css('border','none');
        $(slide_panel).find('.panel_action[td_format]').css('border','none');
        if ($(tek_kol).index()>0) {
            $(slide_panel).find('#type_col').val(tab_obj.columns[$(tek_kol).index()-1].type);
            
            if ($(tek_kol).closest('thead').length>0) {
                $(slide_panel).find('.panel_action[td_format="'+$(table).find('tr:first td:eq('+$(tek_kol).index()+')').css('text-align')+'"]').css('border','1px solid white');
            }
            else {
                if ($(tek_kol).css('text-align')!='-webkit-center') {
                    $(slide_panel).find('.panel_action[td_format="'+$(tek_kol).css('text-align')+'"]').css('border','1px solid white');
                }
                else {
                    $(slide_panel).find('.panel_action[td_format="center"]').css('border','1px solid white');
                }
            }  
            
            var valign;
            if ($(tek_kol).closest('thead').length>0) {
                //$(table).find('tr:first td:eq('+$(tek_kol).index()+')').css('border','1px solid white');
                valign=$(table).find('tr:first td:eq('+$(tek_kol).index()+')').css('vertical-align');
            }
            else {
                valign=$(tek_kol).css('vertical-align');
            }
            //console.log(valign);
            if (!!!valign) {
                valign='middle';
            }
            $(slide_panel).find('.panel_action[td_format_v="'+valign+'"]').css('border','1px solid white');
            
            var font_size=parseInt($(tek_kol).css('font-size'));
            if (!!!font_size) {
                font_size=12;
            }
            $(slide_panel).find('#font_size').val(font_size);                                    
            
            var font_type;
            if ($(tek_kol).closest('thead').length>0) {
                font_type=$(table).find('tr:first td:eq('+$(tek_kol).index()+')').css('font-family');
            }
            else {
                font_type=$(tek_kol).css('font-family');;
            }
            if (!!!font_type) {
                font_type='times new roman';
            }  
            
            font_type=font_type.replace(/\"/g, "");
//            console.log(font_type);
            $(slide_panel).find('#font_type option[value="'+font_type.toLowerCase()+'"]').prop('selected','true');
            
            
            font_mass.forEach(function(element) {
                //console.log($(slide_panel).find('#'+element));
                $(slide_panel).find('#'+element).removeClass('border_on');
                var font_exist=false;
                if ($(tek_kol).closest('thead').length>0) {
                    font_exist=$(table).find('tr:first td:eq('+$(tek_kol).index()+')').hasClass(element);
                }
                else {
                    font_exist=$(tek_kol).hasClass(element);;
                }
                if (font_exist) {
                    $(slide_panel).find('#'+element).addClass('border_on');
                }
            });
            
            var font_color;
            if ($(tek_kol).closest('thead').length>0) {
                font_color=$(table).find('tr:first td:eq('+$(tek_kol).index()+')').css('color');
            }
            else {
                font_color=$(tek_kol).css('color');
            }
            if (!!!font_color) {
                font_color='000000';
            }
            if (font_color.indexOf('rgb')>-1) {
                font_color='#'+getHexRGBColor(font_color);
            }
            else {
                font_color='#'+font_color;
            }            
            $(slide_panel).find('#font_color').val(font_color);
            $(slide_panel).find('#font_color_ex').css('background',font_color);  
            
            var td_color;
            if ($(tek_kol).closest('thead').length>0) {
                td_color=$(table).find('tr:first td:eq('+$(tek_kol).index()+')').css('background');
            }
            else {
                td_color=$(tek_kol).css('background');
            }
            //console.log(td_color);
            if (!!!td_color) {
                td_color='ffffff';
            }
            if (td_color.indexOf('none repeat')>-1) {
                td_color=td_color.substring(0,td_color.indexOf(')')+1);
            }  
            //console.log(td_color);
            if (td_color.indexOf('rgb')>-1) {
                td_color='#'+getHexRGBColor(td_color);
            }
            else {
                td_color='#'+td_color;
            }
            $(slide_panel).find('#td_color').val(td_color);
            $(slide_panel).find('#td_color_ex').css('background',td_color);
            
            $(slide_panel).find('#td_width').val(parseInt(tek_kol[0].offsetWidth));
            if ($(tek_kol).closest('thead').length==0) {
                $(slide_panel).find('#td_height').val(parseInt($(tek_kol).closest('tr')[0].offsetHeight));
            }
                        
        }
    });
    
    $('.no_panel').on('dblclick', 'table.jexcel td,table.jexcel td div,table.jexcel td p,table.jexcel td input', function(e){
        if (!$(this).is('td')) {
            tek_kol=$(this).closest('td');
            $('#my').jexcel('updateSelection', tek_kol, tek_kol, 1);
        }
        else {
            tek_kol=$(this);
        }
        var sgp=$(tek_kol).find('.settings_group_panel');
        if ($(sgp).length>0) {
            var action_type=$(sgp).attr('action_type'),
                id_v=$(sgp).attr('id');
            e.stopPropagation();   
            set_settings_group_panel_active(action_type,id_v,sgp,tek_kol);
        } 
        else {
            if ($(settings_group_panel_active).is(':visible')) {
                $(settings_group_panel_active).hide();
            }
        }
    })
        
    
    $('.slide_panel').on('change', '#type_col', function(){
        if ($(this).val()=='calendar') {
            tab_obj.columns[$(tek_kol).index()-1]= { type: $(this).val(),
                                                  options: { format:'DD.MM.YYYY' } };
        }
        else {
            tab_obj.columns[$(tek_kol).index()-1]= { type: $(this).val() };
        } 
        save_tab_data();
        tab_obj.data.forEach(function(element) {
            element[$(tek_kol).index()-1]='';
        });
        //console.log(columns_mass);
        $('#my').jexcel(tab_obj);
        //$('#my').jexcel.selectedCell = tek_kol; 
        var table=$(table_tag); 
        $(table_all_tag).html(tab_obj.html);
        if ($(tek_kol).closest('thead').length>0) {
            $('#my').jexcel('updateSelection', $(table).find('tr:first td:eq('+$(tek_kol).index()+')') , $(table).find('tr:last td:eq('+$(tek_kol).index()+')'), 1);
        }
        else {
            $('#my').jexcel('updateSelection', tek_kol, tek_kol, 1);
        }
    });
    
    $('.slide_panel').on('click keyup', '#font_size', function(){
        //console.log('работает');
        var tds=$('#my').jexcel('getSelectedCells');
        var font_size=$(this).val();
        if ($(tds).length>0) {
            $(tds).each(function(i,elem) {
                $(elem).css('font-size',font_size+'px');                    
            });
        }
    });
        
    $('.slide_panel').on('change', '#font_type', function(){
        //console.log('работает');
        var tds=$('#my').jexcel('getSelectedCells');
        var font_fam=$(this).val();
        if ($(tds).length>0) {
            $(tds).each(function(i,elem) {
                $(elem).css('font-family',font_fam);                    
            });
        }
    });
    
    $('.slide_panel').on('click', '#font_color_change', function(){
        var width=window.innerWidth,
            height=window.innerHeight,
            div_inline=$('#Inline');
        $('div.slide_panel').css('overflow-y','visible');   
        $.jPicker.List[0].color.active.val('ahex', $('.slide_panel').find('#font_color').val().substr(1));
        $(div_inline).find('table.jPicker').show();
        $(div_inline).css({top:((height-$(div_inline).height())/2),left:((width-$(div_inline).width())/2)});        
    });
    
    $('.slide_panel').on('click', '#td_color_change', function(){
        var width=window.innerWidth,
            height=window.innerHeight,
            div_inline=$('#Inline_td');
        $('div.slide_panel').css('overflow-y','visible');    
        $.jPicker.List[1].color.active.val('ahex', $('.slide_panel').find('#td_color').val().substr(1));
        $(div_inline).find('table.jPicker').show();
        $(div_inline).css({top:((height-$(div_inline).height())/2),left:((width-$(div_inline).width())/2)});                         
    });
    
    $('.slide_panel').on('click', '#border_color_change', function(){
        var width=window.innerWidth,
            height=window.innerHeight,
            div_inline=$('#Inline_bc');
        $('div.slide_panel').css('overflow-y','visible');    
        $.jPicker.List[1].color.active.val('ahex', $('.slide_panel').find('#border_color').val().substr(1));
        $(div_inline).find('table.jPicker').show();
        $(div_inline).css({top:((height-$(div_inline).height())/2),left:((width-$(div_inline).width())/2)});
    });
    
    $('.slide_panel').on('click', '#Inline table.jPicker .Ok', function(){
        var slide_panel=$('.slide_panel');
        //console.log($(slide_panel).find('table.jPicker input.Hex'));
        var hex='#'+$(slide_panel).find('#Inline table.jPicker input.Hex').val();
        $(slide_panel).find('#font_color').val(hex);
        $(slide_panel).find('#font_color_ex').css('background',hex);
        var tds=$('#my').jexcel('getSelectedCells');
        if ($(tds).length>0) {
            $(tds).each(function(i,elem) {
                $(elem).css('color',hex);                    
            });
        }
        $('table.jPicker').hide();
        $(slide_panel).css('overflow-y','auto');
    });
    
    $('.slide_panel').on('click', '#Inline_td table.jPicker .Ok', function(){
        var slide_panel=$('.slide_panel');
        //console.log($(slide_panel).find('table.jPicker input.Hex'));
        var hex='#'+$(slide_panel).find('#Inline_td table.jPicker input.Hex').val();
        $(slide_panel).find('#td_color').val(hex);
        $(slide_panel).find('#td_color_ex').css('background',hex);
        var tds=$('#my').jexcel('getSelectedCells');
        if ($(tds).length>0) {
            $(tds).each(function(i,elem) {
                $(elem).css('background',hex);                    
            });
        }
        $('table.jPicker').hide();
        $(slide_panel).css('overflow-y','auto');
    });
    
    $('.slide_panel').on('click', '#Inline_bc table.jPicker .Ok', function(){
        var slide_panel=$('.slide_panel');
        //console.log($(slide_panel).find('table.jPicker input.Hex'));
        var hex='#'+$(slide_panel).find('#Inline_bc table.jPicker input.Hex').val();
        $(slide_panel).find('#border_color').val(hex);
        $(slide_panel).find('#border_color_ex').css('background',hex);        
        $('table.jPicker').hide();
        $(slide_panel).css('overflow-y','auto');
    });
    
    $('.slide_panel').on('click', 'table.jPicker .Cancel', function(){
        $('table.jPicker').hide();
        $('.slide_panel').css('overflow-y','auto');
    });
    
    $('.slide_panel').on('click keyup', '#font_color', function(){
        var slide_panel=$('.slide_panel');
        var hex=$(this).val();
        //console.log(hex);
        $(slide_panel).find('#font_color_ex').css('background',hex);
        var tds=$('#my').jexcel('getSelectedCells');
        if ($(tds).length>0) {
            $(tds).each(function(i,elem) {
                $(elem).css('color',hex);                    
            });
        }
    });
    
    $('.slide_panel').on('click keyup', '#td_color', function(){
        var slide_panel=$('.slide_panel');
        var hex=$(this).val();
        //console.log(hex);
        $(slide_panel).find('#td_color_ex').css('background',hex);
        var tds=$('#my').jexcel('getSelectedCells');
        if ($(tds).length>0) {
            $(tds).each(function(i,elem) {
                $(elem).css('background',hex);                    
            });
        }
    });
    
    $('.slide_panel').on('click keyup', '#td_width', function(){
        var width_v=Math.round(+$(this).val());//хз откуда берутся 10 
        var tek_index=-1;
        if ($(tek_kol).closest('thead').length>0) {
            tek_index=Number($(tek_kol).attr('id').split('-')[1]);
        }
        else {
            tek_index=Number($(tek_kol).attr('id').split('-')[0]);
        }
        var table_all_tag_v=$(table_all_tag);
        //$(table_all_tag_v).find('thead:first tr:last td[id="col-'+tek_index+'"]').attr('width',width_v).width(width_v-10+'px');
        $(table_all_tag_v).find('thead:first tr:last td[id="col-'+tek_index+'"]').attr('width',width_v).css('width',width_v+'px');
        $(table_all_tag_v).find('tbody tr').each(function(i,elem) {
            //$(elem).find('td.c'+tek_index).attr('width',width_v).width(width_v-10+'px');
            $(elem).find('td.c'+tek_index).attr('width',width_v).css('width',width_v+'px');
        });
        set_tab_width_true();
        $('#my').jexcel('updateSelection', tek_kol, tek_kol, 1);
    });
    
    $('.slide_panel').on('click keyup', '#td_height', function(){
        var tds=$('#my').jexcel('getSelectedCells');
        var height_v=$(this).val();
        if ($(tds).length>0) {
            $(tds).each(function(i,elem) {
                $(elem).closest('tr').attr('height',height_v).height(height_v);                   
            });
        }        
    });
    
    $("div#my" ).on("click", ".table_graf", function() {        
        //console.log('работает');
        var id_t=this.id,
        width=window.innerWidth/*/1.1*/,
        height=window.innerHeight/*/1.1*/;
        /*if (width>height) {
            width=height;
        }
        else {
            height=width;
        }*/
        //var newWin = window.open('/graf.php', '3D-график OLAP-куба', 'width='+width+',height='+height+',top='+((screen.height-height)/2)+',left='+((screen.width-width)/2)+', resizable=yes, scrollbars=no, status=yes');
        var newWin = window.open('/graf.php', '3D-график OLAP-куба', 'width='+width+',height='+height+', resizable=true, scrollbars=no, status=yes');

        newWin.onload = function() {
            //передаем id доступа к данным olap-куба в новое окно  
            var newWin_doc=newWin.document;
            $(newWin_doc).find('div.tree_graf').attr('id',id_t);            
        }        
    });
    
    var pr_sql_group_panel_oc_show=false;
    var sql_group_panel=$('.sql_group_panel');
    $("div#my" ).on("click", ".sql_group_panel_oc", function() {
        var sql_id=this.id;
        var body_v=html_v;
        $(sql_group_panel).children().attr('id',sql_id).removeAttr('id');
        if (!$(sql_group_panel).is(':visible')) {
            var this_top,this_left,
                this_el=this,tek_tr=$(this_el).closest('tr'),
                next_tr=$(tek_tr).next();
            if ($(next_tr).length>0) {
                this_top=$(next_tr).offset().top-$(body_v).scrollTop();
            } 
            else {
                this_top=$(tek_tr).offset().top-33-$(body_v).scrollTop();
            }
            this_left=$(this_el).closest('td').offset().left-$(body_v).scrollLeft()+3; 
            $(sql_group_panel).css({'left':this_left+'px','top':this_top+'px'}).attr('id',sql_id).show(); 
            pr_sql_group_panel_oc_show=true;
        }
        else {
            $(sql_group_panel).hide();
            pr_sql_group_panel_oc_show=false;
        }
    });
    
    
    $("body" ).on("click", ".sql_remove", function() {
        //$(this).closest('td').html('');
        var table=$(table_tag);
        var sql_id=this.id;
        $(table).find('a.sql_group_panel_oc[id="'+sql_id+'"]').closest('td').html('');
        $(this).closest('div').hide();
    }); 
    
    $("body" ).on("click", ".sql_group_edite", function(e) {
        //$(this).closest('td').html('');
        pr_active_mod=this;
        var sql_id=$(this).closest('div.sql_group_panel').attr('id');
        $('#modal_head_p').html('Редактирование SQL-запроса для ячейки таблицы');
        $('.modal_content').html('<div class="sql_group_es">'+
                                    '<a class="sql_group_save" id="'+sql_id+'" title="Сохранить структуру" style="z-index: 500000;">'+
                                        '<img src="/img/save.png" style="width:30px;height:auto;">'+
                                    '</a>'+
                                '</div>\n\
                                <div class="sql_group_es" style="margin:2px 0 2px 0;">'+
                                    'Разделитель для строк: <input class="sql_group_str_in" id="'+sql_id+'" type="text" placeholder="Заполнение не обязательно">'+
                                '</div>').append(container);
        set_ace_edit('sql',$(pr_active_mod).attr('data-edit_ace-theme'),$(pr_active_mod).attr('data-edit_ace-size'),$('.sql_group[id="'+sql_id+'"]').text());
        $(container).show();
        $('.sql_group_str_in[id="'+sql_id+'"]').val($('.sql_group_razdel[id="'+sql_id+'"]').html());                        
	$(container).show();
        open_modal(e);
    }); 
    
    $('.no_panel').on('click', 'a.a_but_xlsx_add', function(e) {
        run_export_xlsx();
    });
    
    $("body" ).on("click", ".sql_group_save", function() {
        var table=$(table_tag);
        var sql_id=this.id;
        var params = new Object();
        var td_tek=$(table).find('td[id="'+$('.sql_group_razdel[id="'+sql_id+'"]').attr('td_id')+'"]');
        params['code_in']='getRowsDB_conn'; 
        //params['tsql']=$(editor).html().replace(/<[^>]+>/g," ").trim(); 
        params['tsql']=editor.getValue();
        params['is_editor']=7;
        console.log(params);
        $.ajax({
            type: "POST",
            url: "/get-data.php",
            data: params,
            success: function(html){
//                console.log(html);
                if (html!='Что-то пошло не так ') {
                    var html_first=$(html).first(); 
                    var count_pol=$(html_first).find('td').length;
                    if (count_pol>1) {    
                        alert('SQL-запрос должен содержать для отображения только одно поле');
                    }
                    else if (count_pol==1) {
                        var html_str=$(html_first).find('td').text().trim();
                        var razdel=$('.sql_group_str_in[id="'+sql_id+'"]');
                        $(html).filter(':gt(0)').each(function(i,elem) {
                            html_str+=$(razdel).val()+$(elem).find('td').text().trim();
                        });
                        //$('.sql_group[id="'+sql_id+'"]').html($(editor).html());
                        $('.sql_group[id="'+sql_id+'"]').html(editor.getValue()).attr('data-edit_ace-theme',$(pr_active_mod).attr('data-edit_ace-theme')).attr('data-edit_ace-size',$(pr_active_mod).attr('data-edit_ace-size')) ;
                        $('.sql_group_text[id="'+sql_id+'"]').html(html_str);
                        $(razdel).attr('value',$(razdel).val());
                        var body_v=html_v;
                        var this_top=$(td_tek).offset().top+parseFloat($(td_tek).closest('td').height())+2-$(body_v).scrollTop();
                        var this_left=$(td_tek).offset().left+7-$(body_v).scrollLeft();
                        $('.sql_group_panel').css({'left':this_left+'px','top':this_top+'px'}); 
                        $('.sql_group_razdel[id="'+sql_id+'"]').html($(razdel).val());
                        $('#overlay').after($('.container').hide());
                        modal_close();
                    }  
                }    
                else {
                    alert(html);
                }    
            },
            error: function(xhr, status, error) {
                alert('Выполнение SQL-запроса завершилось с ошибкой\n Ошибка: '+xhr.responseText + ' ' + status + ' ' +error);
            }
        });
    });
    
    $("body" ).on("click", ".sql_refreshe", function() {
        //var table=$(table_tag);
        var sql_id=this.id;
        var params = new Object();
        params['code_in']='getRowsDB_conn'; 
        params['tsql']=$('.sql_group[id="'+sql_id+'"]').html().replace(/<[^>]+>/g," ").trim(); 
        params['is_editor']=7;
        console.log(params);
        $.ajax({
            type: "POST",
            url: "/get-data.php",
            data: params,
            success: function(html){
//                console.log(html);
                if (html!='Что-то пошло не так ') {
                    var html_first=$(html).first(); 
                    var count_pol=$(html_first).find('td').length;
                    if (count_pol>1) {    
                        alert('SQL-запрос должен содержать для отображения только одно поле');
                    }
                    else if (count_pol==1) {
                        var html_str=$(html_first).find('td').text().trim();
                        var razdel=$('.sql_group_razdel[id="'+sql_id+'"]').html();
                        $(html).filter(':gt(0)').each(function(i,elem) {
                            html_str+=razdel+$(elem).find('td').text().trim();
                        });
                        $('.sql_group_text[id="'+sql_id+'"]').html(html_str); 
                        alert('Значение ячейки обновлено');
                    }  
                }    
                else {
                    alert(html);
                }    
            },
            error: function(xhr, status, error) {
                alert('Выполнение SQL-запроса завершилось с ошибкой\n Ошибка: '+xhr.responseText + ' ' + status + ' ' +error);
            }
        });
    });
    
    var cell_bord_size=$('.slide_panel #cell_bord_size');
    //выставляем у всех
    $('.slide_panel').on('blur', '#cell_bord_size', function() {
        console.log('работает');
        if ($(this).val()!=$(cell_bord_size).attr('value')) {
            $(cell_bord_size).attr('value',$(this).val()); 
            $('.slide_panel .a_cell_bord_w').val($(this).val()).attr('value',$(this).val());
        }    
    });
    
    $('.slide_panel').on('change', '.file_upload input', function() {
        function readFile(object) {                        
            var file = object.files[0]
            var reader = new FileReader()
            reader.onload = function() {
                tab_obj=JSON.parse(LZString.decompressFromUTF16(reader.result));
                create_tab_data(tab_obj.html);
                //console.log(tab_obj);
                $('#my').jexcel(tab_obj);
                $('#div_name_rep #in_name_rep').val(tab_obj.name);
                var table_real=$(table_all_tag).html(tab_obj.html);                
                set_tab_width_true();
                //параметры делаем рабочими
                $('div.params_group').each(function(i,elem) {
                    if ($(elem).find('p').length>0) {
                        $(elem).show();
                        set_olap_params(elem);
                    }
                });                 
                var table_real_selected=$(table_real).find('td[style*="filter: invert(0.2)"]');                
                if ($(table_real_selected).length>0) {
                    $('#my').jexcel('updateSelection', $(table_real_selected).first(), $(table_real_selected).last());
                }                
                $(loading_img).hide();             
            }             
            reader.readAsText(file);
        }
        
        var width=window.innerWidth,
            height=window.innerHeight;
        $(loading_img).show().css({top:((height-$(loading_img).height())/2),left:((width-$(loading_img).width())/2)});
        
        readFile(this);
    });
    
    $('.slide_panel').on('mouseover','li.bord_orient', function() {
        //console.log(this);
        var border_pointer=$('.border_pointer');
        $(this).append(border_pointer);
        var dop_left=10;
        if ($(this).attr('bord_orient')==="top") {
            dop_left=20;
        }
        else if ($(this).attr('bord_orient')==="left") {
            dop_left=30;
        }
        else if ($(this).attr('bord_orient')==="right") {
            dop_left=40;
        }
        else if ($(this).attr('bord_orient')==="all") {
            dop_left=60;
        }  
        var body_v=html_v;
        var top_scroll=$(body_v).scrollTop();
        var left_scroll=$(body_v).scrollLeft();
        $(this).find('ul.second-level').css({position:'fixed',left:dop_left/*+left_scroll*/,top:($(this).offset().top+$(this).height()-top_scroll)});
        var left_img=$(this).offset().left+3-left_scroll,top_img=$(this).offset().top+$(this).height()-4-top_scroll;
        /*console.log(left_img);
        console.log(top_img);*/
        $(border_pointer).css({left:left_img,top:top_img});
    });
    $('.slide_panel').on('mouseout','li.bord_orient', function() {
        $(this).find('ul.second-level').css({left:'-9999em'});
        $('.border_pointer').css({left:'-9999em'});
    });
    
    function save_rep_settings(settings_group_panel,td_settings) {
        $(settings_group_panel).html($(settings_group_panel_active).html());
        $(td_settings).html(settings_group_panel[0].outerHTML);
    }
    
    
    function set_settings_group_panel_active(action_type,id,settings_group_panel,this_el) {
        if (action_type=="form_header") {
            var td_settings=$(table_all_tag).find('thead:first tr:first td:first');
            if (($(settings_group_panel_active).is(':visible')) & ($(settings_group_panel_active).attr('id')==id)) { 
                save_rep_settings(settings_group_panel,td_settings);
            }    
            else {
                if ($(settings_group_panel).length==0) {  
                    settings_group_panel=document.createElement('div');
                    $(settings_group_panel).attr('class','settings_group_panel').attr('id','1').attr('action_type','form_header')
                                            .html('<ul class="ul_cons top-level" action_type="form_header">\n'+
                                                       '<li id="'+id+'" class="description li_cons li_cons_top" style="background: none;" action_type="form_header">\n'+
                                                            '<img src="/img/descripe.png" style="width:auto;height:30px;" title="Описание формы">\n'+
                                                            '<div class="div_hidden"></div>\n'+                    
                                                        '</li>\n'+
                                                        '<li id="'+id+'" class="size li_cons li_cons_top" style="background: none;" action_type="form_header">\n'+
                                                            '<img src="/img/size-tab.png" style="width:auto;height:30px;" title="Размеры таблицы">\n'+
                                                            '<div class="div_hidden"></div>\n'+                   
                                                        '</li>\n'+
                                                        '<li id="'+id+'" class="parent li_cons li_cons_top" style="background: none;" action_type="form_header">\n'+
                                                            '<img src="/img/parent.png" style="width:auto;height:30px;" title="Родительская форма">\n'+
                                                            '<div class="div_hidden"></div>\n'+                    
                                                        '</li>\n'+
                                                        '<li id="'+id+'" class="action li_cons li_cons_top" style="background: none;" action_type="form_header"><img src="/img/actions.png" style="height:27px;width:auto;"title="Действия">\n'+
                                                            '<ul class="ul_cons second-level" style="width: 230px;text-align: left;border: 1px solid #008000;border-radius: 0 0 10px 10px;" action_type="form_header">\n'+
                                                                '<li id="none" class="li_cons" title="Отсутствует" style="height: 20px;width: 230px;color: white;background: #d1ffff;border-bottom-color: white;"  action_type="form_header" pr_change_style>'+                                   
                                                                    '<a id="none" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;">\n'+
                                                                        'Отсутствует\n'+
                                                                    '</a>\n'+
                                                                '</li>\n'+
                                                                '<li id="before_open_form" class="li_cons" title="До открытия формы" style="height: 20px;width: 230px;" action_type="form_header">'+
                                                                    '<a id="before_open_form" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="form_header">\n'+
                                                                        'До открытия формы\n'+
                                                                        '<div class="div_hidden"></div>\n'+
                                                                    '</a>\n'+
                                                                    '<a id="before_open_form" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="form_header">\n'+
                                                                        '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                                        '<div class="div_hidden_desc"></div>\n'+
                                                                    '</a>\n'+ 
                                                                '</li>\n'+
                                                                '<li id="after_open_form" class="li_cons" title="После открытия формы" style="height: 20px;width: 230px;" action_type="form_header">'+
                                                                    '<a id="after_open_form" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="form_header">\n'+
                                                                        'После открытия формы\n'+
                                                                        '<div class="div_hidden"></div>\n'+
                                                                    '</a>\n'+
                                                                    '<a id="after_open_form" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="form_header">\n'+
                                                                        '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                                        '<div class="div_hidden_desc"></div>\n'+
                                                                    '</a>\n'+ 
                                                                '</li> \n'+
                                                                '<li id="before_save_form" class="li_cons" title="До сохранения формы" style="height: 20px;width: 230px;" action_type="form_header">'+
                                                                    '<a id="before_save_form" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="form_header">\n'+
                                                                        'До сохранения формы\n'+
                                                                        '<div class="div_hidden"></div>\n'+
                                                                    '</a>\n'+
                                                                    '<a id="before_save_form" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="form_header">\n'+
                                                                        '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                                        '<div class="div_hidden_desc"></div>\n'+
                                                                    '</a>\n'+ 
                                                                '</li>\n'+
                                                                '<li id="after_save_form" class="li_cons" title="После сохранения формы" style="height: 20px;width: 230px;border-radius: 0 0 10px 10px;" action_type="form_header">\n\
                                                                    <a id="after_save_form" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="form_header">\n'+
                                                                        'После сохранения формы\n'+
                                                                        '<div class="div_hidden"></div>\n'+
                                                                    '</a>\n'+
                                                                    '<a id="after_save_form" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="form_header">\n'+
                                                                        '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">\n'+
                                                                        '<div class="div_hidden_desc"></div>\n'+
                                                                    '</a>\n'+       
                                                                '</li>\n'+
                                                            '</ul>\n'+
                                                        '</li>\n'+
                                                        '<li id="'+id+'" class="no_create_sl li_cons li_cons_top" style="background: none;" action_type="form_header">\n'+
                                                            '<input type="checkbox" class="no_create_sl" action_type="form_header" title="Не собирать скрипт жизни">\n'+
                                                        '</li>\n'+
                                                        '<div class="clear"></div>\n'+
                                                    '</ul>');
                        $(td_settings).html(settings_group_panel.outerHTML);                    
                }                  
            }
        }
        else if (action_type=="img_add") {
            if (($(settings_group_panel_active).is(':visible')) & ($(settings_group_panel_active).attr('id')==id)) { 
                $(settings_group_panel).html($(settings_group_panel_active).html());
            }
        }
        if (($(settings_group_panel_active).is(':visible')) & ($(settings_group_panel_active).attr('id')==id)) { 
            $(settings_group_panel_active).hide();
        }    
        else {
            var body_v=html_v;
            var this_top;
            if (action_type=="form_header") {
                this_top=$(this_el).offset().top+parseFloat($(this_el).find('img').height())-$(body_v).scrollTop();
            }
            else {
                var tek_tr=$(this_el).closest('tr');//,next_tr=$(tek_tr).next();
                this_top=$(tek_tr).offset().top+tek_tr[0].offsetHeight-$(body_v).scrollTop();
                /*if ($(next_tr).length>0) {
                    this_top=$(next_tr).offset().top-$(body_v).scrollTop();
                } 
                else {
                    this_top=$(tek_tr).offset().top-33-$(body_v).scrollTop();
                }*/
            }
            var this_left=$(this_el).offset().left-$(body_v).scrollLeft();  
            $(settings_group_panel_active)
                .html($(settings_group_panel).html())
                .attr('action_type',action_type)
                .attr('id',id)
                .css({'left':this_left+'px','top':this_top+'px'});
            if (!$(settings_group_panel_active).is(':visible')) {
                $(settings_group_panel_active).show();
            }    
        }
    }
    
    $(".no_panel" ).on("click", ".settings", function() { 
        var action_type,id_v,settings_group_panel;
        action_type=$(this).attr('action_type');  
        id_v=this.id;    
        var el_back=$(settings_group_panel_active).find('.size_back,.parent_back');
        if ($(el_back).length>0) {
            $(settings_group_panel_active).hide();
        }        
        if (action_type=="form_header") {                
            settings_group_panel=$('.settings_group_panel[action_type="form_header"][id="'+id_v+'"]');
        }    
        set_settings_group_panel_active(action_type,id_v,settings_group_panel,this);                        
    }); 
    
    $('.no_panel').on('click', '.description', function(e) {
        pr_active_mod=$(this);
        $(container).find('.btn-toolbar ').replaceWith($(container_btn_toolbar).clone());
        //$(container).find('.btn-toolbar input[type="file"][data-edit="insertImage"]').hide();
        
        //if ($(pr_active_mod).attr('action_type')=='form_header') {
            $('#modal_head_p').html('Редактирование описания формы');
            $('.modal_content').html('<div class="md_panel_sql_es">'+
                                        '<a class="save_description" id="'+$(pr_active_mod).attr('id')+'" title="Сохранить описание" style="z-index: 500000;" action_type="'+$(pr_active_mod).attr('action_type')+'">'+
                                            '<img src="/img/save.png" style="width:30px;height:auto;">'+
                                        '</a>'+
                                    '</div>').append(container);
            var editor_v=$('div#editor'); 
            $(editor_v).html($(pr_active_mod).find('.div_hidden').html());
        //}    
        $(container).show();
        initToolbarBootstrapBindingsTrue();
        $(settings_group_panel_active).hide();
        open_modal(e);
    });
    
    $('.no_panel').on('click', '.size', function() {
        if ($(this).attr('action_type')=='form_header') {
            $(settings_group_panel_active).html('<a class="size_back" id="'+this.id+'" title="Назад"  style="display: inline;z-index: 500000;" action_type="form_header">\n\
                                            <img src="/img/Back.png" style="width:30px;height:auto;">\n\
                                         </a> \n\
                                         Полей: <input class="in_tab_size_col" type="number" style="display: inline;z-index: 500000;width:40px;" value="'+tab_obj.colHeaders.length+'"> \n\
                                         Строк: <input class="in_tab_size_row" type="number" style="display: inline;z-index: 500000;width:40px;" value="'+$(table_tag).find('tr').length+'">');
        }    
    });
    
    $('.no_panel').on('click', '.size_back,.parent_back', function() {
        if ($(this).attr('action_type')=='form_header') {
            $(settings_group_panel_active).hide();
            $('.settings[action_type="'+$(this).attr('action_type')+'"][id="'+this.id+'"]').trigger('click');
        }    
    });
    
    $('.no_panel').on('click keyup', '.in_tab_size_col,.in_tab_size_row', function() {        
        var count_cols=parseInt($('.in_tab_size_col').val()),
            count_rows=parseInt($('.in_tab_size_row').val());
        if ((count_cols>0) & (count_rows>0)) {    
            var tek_count_cols=tab_obj.colHeaders.length,
                tek_count_rows=$(table_tag).find('tr').length;
            if (tek_count_cols>count_cols) {
                $('#my').jexcel('deleteColumn',count_cols,(tek_count_cols-count_cols));
            }   
            if (tek_count_rows>count_rows) {
                $('#my').jexcel ('deleteRow',count_rows,(tek_count_rows-count_rows));
            }
            tab_obj.colHeaders=[];
            tab_obj.columns=[];
            for (var i=0; i<(count_cols); i++) {
                tab_obj.colHeaders[i]='';
                tab_obj.columns[i]={ type: 'text' };
            }   
            tab_obj.minDimensions=[count_cols,count_rows];
            $('#my').jexcel(tab_obj);
        }
        else {
            alert('Количество строк и колонок должно быть больше нуля');
        }
    });
     
    
    $('.no_panel').on('click', '.parent', function() {
        if ($(this).attr('action_type')=='form_header') {
            var get_parent_str='<a class="parent_back" id="'+this.id+'" title="Назад"  style="display: inline;z-index: 500000;" action_type="form_header">\n\
                                    <img src="/img/Back.png" style="width:30px;height:auto;">\n\
                                 </a> \n\
                                <select id="'+$(this).attr('id')+'" class="parent" title="Выберите форму" style="margin:0;" action_type="form_header">\n\
                                    <option value="-1">Отсутствует</option>';
            $(all_forms).find('.rep_name').each(function(i,elem) {
                get_parent_str+='<option value="'+$(elem).attr('id')+'">'+$(elem).text()+'</option>';	
            });
            get_parent_str+='</select>';            
            $(settings_group_panel_active).html(get_parent_str);
            var select=$('select.parent[action_type="'+$(this).attr('action_type')+'"][id="'+this.id+'"]');
            var parent_id=Number($(this).find('.div_hidden').html());
            if (!isNaN(parent_id)) {
                $(select).find('option[value="'+parent_id+'"]').prop('selected','true');
            }
            set_select_one(select);
        }
    });
    
    $('.no_panel').on('change', 'select.parent', function() {
        var settings_group_panel=$('.settings_group_panel[action_type="'+$(this).attr('action_type')+'"][id="'+this.id+'"]');
        $(settings_group_panel).find('li.parent .div_hidden').html($(this).val());
    });
    
    $('div.modal_content').on('click', '.save_description', function() {
        var editor_v=$('div#editor');
        var description=$('.description[action_type="'+$(this).attr('action_type')+'"][id="'+this.id+'"]');
        $(description).find('.div_hidden').html($(editor_v).html());
        if ($(this).attr('action_type')=='form_header') {
            var settings_group_panel=$('.settings_group_panel[action_type="form_header"][id="'+$(settings_group_panel_active).attr('id')+'"]');
            var td_settings=$(table_all_tag).find('thead:first tr:first td:first');
            save_rep_settings(settings_group_panel,td_settings);
        }    
        $(settings_group_panel_active).show();
        modal_close();
    });        
        
    $('.no_panel').on('click', '.action_one', function(e) {
        pr_active_mod=$(this).closest('li');
        console.log(pr_active_mod);
        if ($(pr_active_mod).attr('id')!='none') {
            $('#modal_head_p').html('Редактирование действия "'+$(pr_active_mod).attr('title')+'"');
            if ($('div#editor').length===0) {
                initToolbarBootstrapBindingsTrue();
            }    
            set_ace_edit('javascript',$(pr_active_mod).attr('data-edit_ace-theme'),$(pr_active_mod).attr('data-edit_ace-size'),LZString.decompressFromUTF16($(pr_active_mod).find('.div_hidden').text()));            
            $('.modal_content').html('<div class="md_panel_sql_es">'+
                                        '<a class="save_action_one_code" id="'+$(pr_active_mod).attr('id')+'" title="Сохранить код" style="z-index: 500000;" action_type="'+$(pr_active_mod).attr('action_type')+'">'+
                                            '<img src="/img/save.png" style="width:30px;height:auto;">'+
                                        '</a>'+
                                    '</div>').append(container);
            $(container).show();
            $(settings_group_panel_active).hide();
            open_modal(e);
        } 
        else if (($(pr_active_mod).attr('action_type')=='form_header') & ($(pr_active_mod).attr('id')=='none')) {
            set_change_style_li_panel_action(pr_active_mod); 
        } 
        if (($(pr_active_mod).attr('action_type')=='form_header') & ($(pr_active_mod).attr('id')=='none')) {
            var td_settings=$(table_all_tag).find('thead:first tr:first td:first');
            var settings_group_panel=$('.settings_group_panel[action_type="form_header"][id="'+$(settings_group_panel_active).attr('id')+'"]');
            save_rep_settings(settings_group_panel,td_settings);
        } 
    });
    
    $('.no_panel').on('click', '.type_one', function(e) {
        pr_active_mod=$(this).closest('li');
        set_change_style_li_panel_action(pr_active_mod); 
        var settings_group_panel=$('.settings_group_panel[action_type="'+$(this).attr('action_type')+'"][id="'+$(settings_group_panel_active).attr('id')+'"]');
        $(settings_group_panel).html($(settings_group_panel_active).html());              
    });
    
    $('div.modal_content').on('click', '.edit_ace-theme', function(e) {
        var edit_ace_theme=$(this).attr('data-edit_ace-theme');
        editor.setTheme('ace/theme/'+edit_ace_theme);
        editor_last_them=edit_ace_theme;
        var tek_ul=$(this).closest('ul');
        var change_style=$(tek_ul).find('li[data-edit_ace-theme]');
        if ($(change_style).length>0) {
            $(change_style).css({'background' : 'white', 'border-bottom-color':'black'}).removeAttr('data-edit_ace-theme');
            $(change_style).find('a').css({'color':'#0088cc'});
        }
        var tek_li=$(this).closest('li');
        $(tek_li).attr('data-edit_ace-theme',edit_ace_theme).css({'background' : '#d1ffff', 'border-bottom-color':'white'});
        $(tek_li).find('a').css({'color':'black'});
        $(pr_active_mod).attr('data-edit_ace-theme',edit_ace_theme);
    });
    
    $('div.modal_content').on('click', '.save_action_one_code', function(e) {
        var action_one=$(settings_group_panel_active).find('li[action_type="'+$(this).attr('action_type')+'"][id="'+this.id+'"]');        
        $(action_one).find('a.action_one .div_hidden').html(LZString.compressToUTF16(editor.getValue()));        
        $(settings_group_panel_active).show();
        set_change_style_li_panel_multi(action_one); 
        var settings_group_panel=$('.settings_group_panel[action_type="'+$(this).attr('action_type')+'"][id="'+$(settings_group_panel_active).attr('id')+'"]');
        if ($(this).attr('action_type')=='form_header') {
            var td_settings=$(table_all_tag).find('thead:first tr:first td:first');
            save_rep_settings(settings_group_panel,td_settings);
        }
        else {
            $(settings_group_panel).html($(settings_group_panel_active).html());
        }
        modal_close();
    }); 
    
    $('.no_panel').on('click', '.action_one_desc', function(e) {
        pr_active_mod=$(this).closest('li');
        if ($(pr_active_mod).attr('action_type')=='form_header') {
            $('#modal_head_p').html('Редактирование описания действия "'+$(pr_active_mod).attr('title')+'"');
            $('.modal_content').html('<div class="md_panel_sql_es">'+
                                        '<a class="save_action_one_desc" id="'+$(pr_active_mod).attr('id')+'" title="Сохранить описание" style="z-index: 500000;" action_type="'+$(pr_active_mod).attr('action_type')+'">'+
                                            '<img src="/img/save.png" style="width:30px;height:auto;">'+
                                        '</a>'+
                                    '</div>').append(container);
            var editor_v=$('div#editor'); 
            $(editor_v).html($(pr_active_mod).find('.div_hidden_desc').html());
        }    
        $(container).show();
        $(settings_group_panel_active).hide();
        open_modal(e);
    });  
    
    $('#modal_form').on('click', '.save_action_one_desc', function(e) {
        var editor_v=$('div#editor');
        var action_one=$(settings_group_panel_active).find('li[action_type="'+$(this).attr('action_type')+'"][id="'+this.id+'"]'); 
        $(action_one).find('a.action_one_desc .div_hidden_desc').html($(editor_v).html());  
        var settings_group_panel=$('.settings_group_panel[action_type="'+$(this).attr('action_type')+'"][id="'+$(settings_group_panel_active).attr('id')+'"]');
        var td_settings=$(table_all_tag).find('thead:first tr:first td:first');
        save_rep_settings(settings_group_panel,td_settings);
        $(settings_group_panel_active).show();
        modal_close();
    });
    
    $('.no_panel').on('click', '.html_one', function(e) {
        pr_active_mod=$(this);
        //console.log(pr_active_mod);
        $('#modal_head_p').html('Редактирование HTML элемента');
        var html_val='';
        if ($(pr_active_mod).attr('action_type')=='img_add') {
            html_val=$('a.img_add[id="'+$(pr_active_mod).attr('id')+'"][action_type="'+$(pr_active_mod).attr('action_type')+'"]')[0].outerHTML;
        }
        else if ($(pr_active_mod).attr('action_type')=='input_add') {
            html_val=$('.input_add[id="'+$(pr_active_mod).attr('id')+'"]')[0].outerHTML;
        }
        else if ($(pr_active_mod).attr('action_type')=='select_add') {
            html_val=$('.select_add[id="'+$(pr_active_mod).attr('id')+'"]')[0].outerHTML;
        }
        else if ($(pr_active_mod).attr('action_type')=='in_modal_add') {
            html_val=$('.div_in_modal_add[id="'+$(pr_active_mod).attr('id')+'"]')[0].outerHTML;
        }        
        set_ace_edit('html',$(pr_active_mod).attr('data-edit_ace-theme'),$(pr_active_mod).attr('data-edit_ace-size'),html_val);            
        $('.modal_content').html('<div class="md_panel_sql_es">'+
                                    '<a class="save_html_one_code" id="'+$(pr_active_mod).attr('id')+'" title="Сохранить код" style="z-index: 500000;" action_type="'+$(pr_active_mod).attr('action_type')+'">'+
                                        '<img src="/img/save.png" style="width:30px;height:auto;">'+
                                    '</a>'+
                                '</div>').append(container);
        $(container).show();
        $(settings_group_panel_active).hide();
        open_modal(e);                 
    }); 
        
    $('div.modal_content').on('click', '.save_html_one_code', function(e) {
        $(settings_group_panel_active).show();
        var settings_group_panel=$('.settings_group_panel[action_type="'+$(pr_active_mod).attr('action_type')+'"][id="'+$(pr_active_mod).attr('id')+'"]');
        if ($(pr_active_mod).attr('action_type')!='in_modal_add') {
            $(settings_group_panel).next().remove();
            $(settings_group_panel).after(editor.getValue());
        }
        else {
            $(settings_group_panel).next().next().remove();
            $(settings_group_panel).next().after(editor.getValue());
        }
        $(settings_group_panel).find('li.html_one')
            .attr('data-edit_ace-theme',$(pr_active_mod).attr('data-edit_ace-theme'))
            .attr('data-edit_ace-size',$(pr_active_mod).attr('data-edit_ace-size'));
        modal_close();
    }); 
    
    $('.no_panel').on('click', '.in_modal_add_struct', function(e) {
        pr_active_mod=$(this);
        //console.log(pr_active_mod);
        $('#modal_head_p').html('Редактирование структуры модального окна');
        $('.modal_content').append($(this).find('.in_modal_md').clone().show());
        $(settings_group_panel_active).hide();
        open_modal(e);  
    });
    
    $('div.modal_content').on('click', '.in_modal_sql_edit', function() {
        pr_active_mod=$(table_tag).find('.in_modal_sql_edit[id="'+this.id+'"]');
        var md=$(this).closest('.in_modal_md');
        $('#modal_head_p').html('Редактирование SQL-запроса для структуры модального окна');
        $('.modal_content').html('<a class="in_mod_md_back" md_id="'+$(this).attr('id')+'" title="Назад" id="'+$(this).attr('id')+'" style="display: inline;z-index: 500000;">\n\
                                    <img src="/img/Back.png" style="width:30px;height:auto;">\n\
                                 </a>\n\
                                 <div class="in_mod_md_panel_sql_es">'+
                                        '<a class="in_mod_md_sql_save" id="'+$(this).attr('id')+'" title="Сохранить структуру" style="z-index: 500000;">'+
                                            '<img src="/img/save.png" style="width:30px;height:auto;">'+
                                        '</a>'+
                                    '</div>').append(container);
        set_ace_edit('sql',$(pr_active_mod).attr('data-edit_ace-theme'),$(pr_active_mod).attr('data-edit_ace-size'),$(md).find('.in_mod_sql_value[id="'+$(this).attr('id')+'"]').text());
        $(container).show();
    });
    
    $('div.modal_content').on('click', '.in_mod_md_back', function(e) {
        var md=$(table_tag).find('.in_modal_md[id="'+this.id+'"]');
        pr_active_mod=$(md).closest('.in_modal_add_struct');
        $('#modal_head_p').html('Редактирование структуры модального окна');
        editor.destroy();
        $('.modal_content').empty().append($(md).clone().show());
    });
        
    $('div.modal_content').on('click', '.in_mod_md_sql_save', function(e) {
        var id_t=$(this).attr('id'),
            md=$(table_tag).find('.in_modal_md[id="'+id_t+'"]');
        pr_active_mod=$(md).closest('.in_modal_add_struct');    
        get_in_mod_struct_by_sql(id_t,md); 
        $('#modal_head_p').html('Редактирование структуры модального окна');
    });
    
    $('div.modal_content').on('click', '.in_modal_md_save', function(e) {
        $(settings_group_panel_active).show();
        var md_tek=$(this).closest('.in_modal_md'),
            md=$(table_tag).find('.in_modal_md[id="'+this.id+'"]'),
            td_md=$(md).closest('td'),
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
        $(td_md).find('.tab_in_modal[id="'+this.id+'"]').empty();
        $(td_md).find('.in_modal_add_val').attr('value','');
        $(td_md).find('.in_modal_add_txt').attr('value','');
        $(md).html($(md_tek).html());
        $(settings_group_panel_active).find('.in_modal_md[id="'+this.id+'"]').html($(md_tek).html());
        modal_close();
    }); 
        
    $('.no_panel').on('click', '.but_in_modal', function(e) {
        pr_active_mod=$(this);        
        //console.log(pr_active_mod);
        $('#modal_head_p').html('Выберите подходящее значение');
        var tek_td=$(this).closest('td'), 
            tek_tab=$(tek_td).find('.tab_in_modal[id="'+this.id+'"]'),
            sql_v=$(tek_td).find('.in_mod_sql_value[id="'+this.id+'"]').text().trim(); 
        if (sql_v.length>0) {
            $(tek_tab).find('.tbody.d-tr').remove();  
            //upd_select_add(sql_v,this.id,false);
            if ($(tek_tab).find('.tbody.d-tr').length===0) {                
                upd_select_add($(tek_td).find('.in_mod_sql_value[id="'+this.id+'"]').text().trim(),this.id,false);
            }
            var tab=$(tek_tab).clone(),
                t_width=$(tek_td).find('input.in_mod_tab_widh').val();
            if (t_width!='') {
                $(tab).css('width',t_width);
            }    
            $(tab).find('.thead.d-tr .d-td.unvis').each(function(i,elem) {
                $(tab).find('.tbody.d-tr .d-td[id="'+$(elem).attr('id')+'"]').addClass('unvis');
            });
            $('.modal_content').html('<a class="in_mod_tab_searche" id="'+this.id+'" title="Активировать поля поиска в таблице">&#128269;</a>').append($(tab).css('display','block'));
            $(settings_group_panel_active).hide();
            open_modal(e);  
        }
        else {
            alert('Отсутствует SQL-запрос для элемента');
        }
    });
    
    $("div.modal_content" ).on("click", ".in_mod_tab_searche", function() {
        var tab=$(this).next(),
            tr_head=$(tab).find('.thead'),
            tr_searche=$(tab).find('.tr_searche');
        if ($(tr_searche).length===0) {
            $(tr_head).last().after('<div class="tr_searche d-tr"></div>');
            tr_searche=$(tab).find('.tr_searche');
            $(tr_head).last().find('.d-td:not(.unvis)').each(function(i,elem) {
                $(tr_searche).append('<div class="td_searche d-td" id="'+$(elem).attr('id')+'"><input type="text" class="in_mod_in_searche" id="'+$(elem).attr('id')+'"></div>')
            });
        } 
        else {
            $(tr_searche).remove();
        }        
    });
    
    function filterTable($table) {
        var $filters = $table.find('.tr_searche .td_searche input'),
            mass_fltr=[];
        $filters.each(function(i,elem) {
            mass_fltr[$(elem).attr('id')]=$(elem).val().toLowerCase();
        });    
        var $rows = $table.find('.tbody.d-tr');
        $rows.each(function (rowIndex) {
            var valid = true;
            $(this).find('.d-td:not(.unvis)').each(function(i,elem) {
                if (mass_fltr[$(elem).attr('id')]!='') {
                    if ($(this).text().toLowerCase().indexOf(
                    mass_fltr[$(elem).attr('id')]) == -1) {
                        valid = valid && false;
                    }
                }
            });
            if (valid === true) {
                $(this).css('display', '');
            } else {
                $(this).css('display', 'none');
            }
        });
    }
    $("div.modal_content" ).on("input", ".in_mod_in_searche", function() {
        filterTable($(this).parents('.tab_in_modal'));
    });
    
    $("div.modal_content" ).on("click", ".in_mod_tab_sort_up", function() {
        var index_col=$(this).closest('.d-td').index(),
            tab=$(this).closest('.d-table'),
        sort_tab=$(tab).find('.tbody.d-tr').sort(function(a, b) { // сортируем
            var tek_str_a=$(a).find('.d-td:eq('+index_col+')').text().replace(',',".");
            var tek_str_b=$(b).find('.d-td:eq('+index_col+')').text().replace(',',".");
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
            $(elem).find('.d-td').each(function(j,elem2) {
                mass_sort[i][j]=$(elem2).text();
            });
        });
        $(tab).find('.tbody.d-tr').each(function(i,elem) {
            $(elem).find('.d-td').each(function(j,elem2) {
                $(elem2).html(mass_sort[i][j]);
            });
        }); 
    });
    
    $("div.modal_content" ).on("click", ".in_mod_tab_sort_unup", function() {
        var index_col=$(this).closest('.d-td').index(),
            tab=$(this).closest('.d-table'),
        sort_tab=$(tab).find('.tbody.d-tr').sort(function(a, b) { // сортируем
            var tek_str_a=$(a).find('.d-td:eq('+index_col+')').text().replace(',',".");
            var tek_str_b=$(b).find('.d-td:eq('+index_col+')').text().replace(',',".");
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
            $(elem).find('.d-td').each(function(j,elem2) {
                mass_sort[i][j]=$(elem2).html();
            });
        });
        $(tab).find('.tbody.d-tr').each(function(i,elem) {
            $(elem).find('.d-td').each(function(j,elem2) {
                $(elem2).html(mass_sort[i][j]);
            });
        });
    });
    
    $("div.modal_content" ).on("click", "div.tab_in_modal .tbody.d-tr", function() {
        var tab=$(this).closest('.d-table'),
            is_multi=$(table_tag).find('.settings_group_panel[action_type="in_modal_add"][id="'+$(tab).attr('id')+'"] .multi_add input').prop('checked');
        if (is_multi) {    
            //мультивыбор
            if ($(this).is("[pr_checked]")) {
                $(this).removeAttr('pr_checked')
                        .attr('style','');
            }
            else {
                $(this).attr('pr_checked','')
                        .css('background-color', '#b0f2d0');
            }
        }    
        else {
            var pr_checked=$(this).is("[pr_checked]");
            $(tab).find('.tbody.d-tr[pr_checked]')
                .removeAttr('pr_checked')
                .attr('style','');;  
            if (!pr_checked) {    
                $(this).attr('pr_checked','')
                        .css('background-color', '#b0f2d0');
            } 
                
        }    
    });  
    
    $("div.modal_footer" ).on("click", '.modal_button_c[id="modal_save"]:not([place^="usr_"])', function() {
        if (prConfirm) {            
            resConfirm=true;
            modal_close();
        }
        else if (prAlert) {            
            modal_close();
        }        
        else {
            if ($(pr_active_mod).hasClass('but_in_modal')) {
                var tab=$(this.offsetParent).prev().find('.d-table'),
                    tek_td=$(pr_active_mod).closest('td'), 
                    tek_tab=$(tek_td).find('.tab_in_modal[id="'+$(tab).attr('id')+'"]'),
                    tek_tr=$(tek_tab).find('.tbody.d-tr'),
                    tr_checked=$(tab).find('.tbody.d-tr[pr_checked]'),                
                    type_v=$(tek_td).find('.settings_group_panel[action_type="in_modal_add"][id="'+$(tab).attr('id')+'"] li.type li[pr_change_style]').attr('id');
                //глобальная переменная для работы с выбранной строкой по тригеру выбора и т.п.
                global_var=tr_checked,    
                $(tek_tr).filter('[pr_checked]').removeAttr('pr_checked').removeAttr('style');
                var in_modal_add_txt=$(table_tag).find('.in_modal_add_txt[id="'+$(tab).attr('id')+'"]'),
                    in_modal_add_val=$(in_modal_add_txt).next().next()
                if ($(tr_checked).length>0) {
                    var tek_val,tek_txt;
                    tek_txt=$(tr_checked).first().find('.d-td[id="NAME"]').text();            
                    if (type_v=='number') {
                        tek_val=$(tr_checked).first().find('.d-td[id="VAL"]').text();                 
                    }
                    else {
                        tek_val='\''+$(tr_checked).first().find('.d-td[id="VAL"]').text()+'\'';
                    }
                    $(tek_tr).filter(':eq('+$(tr_checked).first().index('.tbody')+')').attr('pr_checked','').css('background-color', '#b0f2d0');
                    $(tr_checked).filter(':not(:first)').each(function(i,elem) {
                        tek_txt+=','+$(elem).find('.d-td[id="NAME"]').text();
                        if (type_v=='number') {
                            tek_val+=','+$(elem).find('.d-td[id="VAL"]').text();                 
                        }
                        else {
                            tek_val+=','+'\''+$(elem).find('.d-td[id="VAL"]').text()+'\'';
                        } 
                        $(tek_tr).filter(':eq('+$(elem).index('.tbody')+')').attr('pr_checked','').css('background-color', '#b0f2d0');
                    });
                    $(in_modal_add_txt).attr('value',tek_txt).val(tek_txt);
                    $(in_modal_add_val).attr('value',tek_val).val(tek_val);                
                } 
                $(in_modal_add_val).trigger('change_val');
                //обновляем дочерние элементы
                upd_child_rel($(tab).attr('id'));
                modal_close();
            }
            else if ($(pr_active_mod).hasClass('olap_taa_but_in_modal')) {
                var tab=$(this.offsetParent).prev().find('.tab_in_modal.d-table'),
                    tr_checked=$(tab).find('.tbody.d-tr[pr_checked]'),                
                    type_v=$(tab).attr('type_v');
                //глобальная переменная для работы с выбранной строкой по тригеру выбора и т.п.
                global_var=tr_checked;    
                var in_modal_add_txt=$(modal_tek_content).find('.olap_taa_in_modal_add_txt[id="'+$(pr_active_mod).attr('id')+'"]'),
                    in_modal_add_val=$(in_modal_add_txt).next().next();
                if ($(tr_checked).length>0) {
                    var tek_val,tek_txt;
                    tek_txt=$(tr_checked).first().find('.d-td[id="NAME"]').text();            
                    if (type_v=='number') {
                        tek_val=$(tr_checked).first().find('.d-td[id="VAL"]').text();                 
                    }
                    else {
                        tek_val='\''+$(tr_checked).first().find('.d-td[id="VAL"]').text()+'\'';
                    }
                    $(tr_checked).filter(':not(:first)').each(function(i,elem) {
                        tek_txt+=','+$(elem).find('.d-td[id="NAME"]').text();
                        if (type_v=='number') {
                            tek_val+=','+$(elem).find('.d-td[id="VAL"]').text();                 
                        }
                        else {
                            tek_val+=','+'\''+$(elem).find('.d-td[id="VAL"]').text()+'\'';
                        }
                    });
                    $(in_modal_add_txt).attr('value',tek_txt).val(tek_txt);
                    $(in_modal_add_val).attr('value',tek_val).val(tek_val);                
                } 
                $(in_modal_add_val).trigger('change_val');
                $(modal_form).find('.modal_content').html($(modal_tek_content).html());
                $(modal_footer).find('#olap_taa_bim_modal_cancel').attr('id','modal_cancel');
                var tab_v=$(modal_form).find('.modal_content table.olap_taa_modal_mc');
                pr_active_mod=$(table_tag).find('div#group_tab[olap_id="'+$(tab_v).attr('md_id')+'"] div.table_panel a.'+$(tab_v).attr('a_class')+'[tr_action_index]');        
                modal_tek_content=undefined;
                set_olap_params($(modal_form).find('.modal_content'));
            }
            else if (($(pr_active_mod).hasClass('olap_tr_add')) || ($(pr_active_mod).hasClass('olap_tr_edit'))) {
                var tab=$(modal_form).find('table.olap_taa_modal_mc'),
                    params={},
                    md_id_v=$(tab).attr('md_id'),
                    tr_action_index_v=$(tab).attr('tr_action_index'),
                    table_tag_v=$(table_tag),
                    gp=$(table_tag_v).find('div#group_tab[olap_id="'+md_id_v+'"]'),
                    md=$(gp).find('.masterdata');
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
                $(pr_active_mod).trigger('before_save',params);
                var params_r=param_create(params['sql'],null,null,null,true),
                    params_r_da,
                    params_in_v={};
                if (db_type=='ora') {
                    params_r_da=params_r['params'];
                }
                else if (db_type=='mssql') {    
                    params_r_da=params_r['params_all'];
                }
                    
                function check_null(params,tek_in,tek_val,name_v)  {
                    if ($(tek_in).is('[required]')) {
                        if (!!!tek_val) {
                            params['pr_ok']=false;
                            params['err_txt']+='Не заполнено обязательное поле '+name_v+'\n';
                        }
                        else if (tek_val.trim()=='') {
                            params['pr_ok']=false;
                            params['err_txt']+='Не заполнено обязательное поле '+name_v+'\n';
                        }
                    }
                } 
                var params_val_out;
                if (!!params['params_val_out']) {
                    params_val_out=JSON.parse(params['params_val_out']);
                }
                for (var key in params_r_da) {
                    //html_v+=taa_pol_one_str(params_r_da[key]); 
                    var pr_out=false;
                    if (!!params_val_out) {
                        for (var key2 in params_val_out) {
                            if (key2==(':'+params_r_da[key])) {
                                pr_out=true;
                            }
                        }
                    }
                    if (!pr_out) {
                        var tek_tr=$(tab).find('tr#'+params_r_da[key]),
                            tek_val,
                            name_v=$(tek_tr).find('td:first').text();
                        if ($(tek_tr).length===0) {
                            params['pr_ok']=false;
                            params['err_txt']+='Не заполнено обязательное поле '+params_r_da[key]+'\n';
                        }
                        else {
                            var tek_in=$(tek_tr).find('input.in_olap_taa_mod');
                            if ($(tek_in).length>0) {
                                tek_val=$(tek_in).val();                                
                                check_null(params,tek_in,tek_val,name_v);
                                params_in_v[params_r_da[key]]=tek_val;
                                if (db_type=='ora') {
                                    params_in_v[params_r_da[key]]=tek_val;
                                }
                                else if (db_type=='mssql') { 
                                    params_in_v[key]=tek_val;
                                    params['sql']=params['sql'].split(':'+params_r_da[key]).join('?');
                                }                                
                            }
                            else {
                                tek_in=$(tek_tr).find('input.olap_taa_in_modal_add_val');
                                if ($(tek_in).length>0) {
                                    tek_val=$(tek_in).val();                                
                                    check_null(params,tek_in,tek_val,name_v);
                                    if (params['pr_ok']) {
                                        params['sql']=params['sql'].split(':'+params_r_da[key]).join(tek_val);
                                    }    
                                }
                                else {
                                    tek_in=$(tek_tr).find('select.olap_taa_db_dropbox');
                                    if ($(tek_in).length>0) {
                                        if ($(tek_in).is('[multiple]')) {
                                            if ($(tek_in).val().length>0) {
                                                if ($(tek_in).attr('type_v')=='number') {
                                                    tek_val=$(tek_in).val().join(',');
                                                }
                                                else {
                                                    tek_val="'"+$(tek_in).val().join("','")+"'";
                                                }
                                            }
                                            else {
                                                tek_val='';
                                            }
                                        }
                                        else {
                                            if ($(tek_in).attr('type_v')=='number') {
                                                tek_val=$(tek_in).val();                                             
                                            }
                                            else {
                                                tek_val="'"+$(tek_in).val()+"'";
                                            }
                                        }    
                                        check_null(params,tek_in,tek_val,name_v);
                                        if (params['pr_ok']) {
                                            params['sql']=params['sql'].split(':'+params_r_da[key]).join(tek_val);
                                        }    
                                    }
                                    else {
                                        params['pr_ok']=false;
                                        params['err_txt']+='Не найден подходящий элемент для '+params_r_da[key]+'\n';
                                    }
                                }
                            }
                        }
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
                    var data_type_v;
                    if ($(params_in_v).length>0) {
                        if (db_type=='ora') {
                            params['params_val_in']=JSON.stringify(params_in_v);
                            data_type_v='json';                          
                        }
                        else if (db_type=='mssql') {
                            params['params_val']=JSON.stringify(params_in_v);
                            params['tsql']=params['sql'];
                            params['is_editor']=7;        
                            delete params['sql'];
                            data_type_v='text';
                        }
                        
                    }    
                    loading_img_show();
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
                            $(pr_active_mod).trigger('after_save',data);
                            $(loading_img).hide();
                            modal_close();
                        },
                        error: function(xhr, status, error) {
                            $(loading_img).hide();
                            alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                            console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                        }
                    });
                }
            }
            
        }    
    }); 
    
    
    $("div.modal_content" ).on("click", ".panel_add_atr_add", function() {
        var polya_v=$(this).closest('.polya'),
            d_tr_last=$(polya_v).find('#tab_pol .d-tr:last'),
            d_tr_clone=$(d_tr_last).clone();
        $(d_tr_clone).find('input').val('');  
        $(d_tr_last).after(d_tr_clone);
    });
    
    var panel_add_mod_tek_tr;
    $("div.modal_content" ).on("click", 'div.panel_add_md div#tab_pol .d-tr:not([id="after_append"])', function() {
        panel_add_mod_tek_tr=this;
    });
    $("div.modal_content" ).on("click", ".panel_add_atr_del", function() {
        var polya_v=$(this).closest('.polya'),
            d_tr_last=$(polya_v).find('#tab_pol .d-tr[id!="after_append"]');
        if ($(d_tr_last).length<3) {
            alert('Для структуры панели необходимо наличие не менее двух вкладок');
        }
        else if ((!!!panel_add_mod_tek_tr) || ($(panel_add_mod_tek_tr).length===0)) {
            alert('Не выбрана строка для удаления');
        }
        else {
            $(panel_add_mod_tek_tr).remove();
            panel_add_mod_tek_tr=undefined;
        }        
    });    
    
    $("div.modal_content" ).on("click", ".panel_add_md_save", function() {
        var tek_id=this.id,
            panel_add_md=$(this).closest('.panel_add_md'),
            panel_add_md_tr=$(panel_add_md).find('div#tab_pol .d-tr[id!="after_append"]'),
            pr_ok=true,
            mass_sname=[],
            mass_name=[];
        //проверки 
        $(panel_add_md_tr).each(function(i,elem) {
            var sname_el=$(elem).find('.SYSNAME input'),
                sname=$(sname_el).val().trim(),
                name_el=$(elem).find('.NAME input'),
                name=$(name_el).val().trim();
            if (sname.length===0) {
                alert('"Сис.имя" должно содержать не менее одного символа');
                pr_ok=false;
            }            
            else if (name.length===0) {
                alert('"Наименование" должно содержать не менее одного символа');
                pr_ok=false;
            }            
            if (pr_ok) {    
                mass_sname.forEach(function(element) {
                    if ((sname==element) & (pr_ok)) {
                        alert('"Сис.имя" должно быть уникально для всех вкладок');
                        pr_ok=false;
                    }
                });  
            }   
            if (pr_ok) {    
                mass_name.forEach(function(element) {
                    if ((name==element) & (pr_ok)) {
                        alert('"Наименование" должно быть уникально для всех вкладок');
                        pr_ok=false;
                    }
                });  
            }
            if (!pr_ok) {
                return false;
            }
            else {
                mass_sname[i]=sname,
                mass_name[i]=name; 
                //для корректного сохранения    
                $(sname_el).attr('value',sname);
                $(name_el).attr('value',name);            
            }
        });
        if (pr_ok) {
            var tek_panel_add=$(table_tag).find('.panel_add[action_type="panel_add"][id="'+tek_id+'"]'),
                mass_tab=[],
                tab_new='',tab_one='',
                tek_panel_add_td=$(tek_panel_add).closest('td'),
                sgp=$(tek_panel_add_td).find('.settings_group_panel[action_type="panel_add"][id="'+tek_id+'"]').clone();            
            $(tek_panel_add).find('div[data-pws-tab]').each(function(i,elem) {
                mass_tab[$(elem).attr('data-pws-tab')]=$(elem).html();
            });
            $(tek_panel_add).find('div[data-pws-tab]').first().find('.d-td').each(function(i,elem) {
                tab_one+='<div class="d-td" id="'+$(elem).attr('id')+'"></div>';
            });
            $(tek_panel_add).pwstabs('destroy');
            tab_new='<div class="panel_add" id="'+tek_id+'" action_type="panel_add">\n';
            $(panel_add_md_tr).each(function(i,elem) {
                var tab_one_tek=tab_one;  
                if (!!mass_tab[mass_sname[i]])  {
                    tab_one_tek=mass_tab[mass_sname[i]];
                }  
                tab_new+='<div data-pws-tab="'+mass_sname[i]+'" data-pws-tab-name="'+mass_name[i]+'">'+tab_one_tek+'</div>\n';
            });
            tab_new+='</div>';
            $(sgp).find('.panel_add_struct .div_hidden').html(panel_add_md[0].outerHTML);
            $(tek_panel_add_td).html(sgp[0].outerHTML+tab_new);
            $(tek_panel_add_td).find('.panel_add').pwstabs();
            p_a_tek_id=mass_sname[0];
            modal_close();
        }    
    });
    
    $('.no_panel').on('click', '.panel_add_struct', function(e) {
        pr_active_mod=$(this);
        //console.log(pr_active_mod);
        $('#modal_head_p').html('Редактирование структуры панели');
        $('.modal_content').append($(this).find('.panel_add_md').clone().show());
        $(settings_group_panel_active).hide();
        open_modal(e);  
    });
    
    var p_a_tek_id;
    $('.no_panel').on('click', 'ul.pws_tabs_controll a[data-tab-id]', function() {//[data-tab-id]:not(.pws_tab_active)
        var tek_dpt=$(this).attr('data-tab-id');                
        if (tek_dpt!=p_a_tek_id) {
            var panel_add_v=$(this).closest('.pws_tabs_container').find('.panel_add'),
                table_tag_v=$(table_tag),
                pa_td=$(table_tag_v).find('td[panel_add_id="'+$(panel_add_v).attr('id')+'"]'),
                pa_tr=$(pa_td).closest('tr').filter(':not(:first)'),
                //pa_tab=$(panel_add_v).find('div[data-pws-tab="'+p_a_tek_id+'"]'),
                pa_tab_str='',
                pa_tab_tek=$(panel_add_v).find('div[data-pws-tab="'+tek_dpt+'"] .d-td');
            $(pa_tr).each(function(i,elem0) {    
                var pa_td_one=$(elem0).find('td[panel_add_id="'+$(panel_add_v).attr('id')+'"]');
                $(pa_td_one).each(function(i,elem) {  
                    var m_ids=$(elem).attr('id').split('-'),
                        el_clone=$(elem).clone().removeAttr('id').removeClass('c'+m_ids[0]+' r'+m_ids[1]);
                    pa_tab_str+='<div id="d'+m_ids[0]+'-'+m_ids[1]+'"';
                    $.each(el_clone[0].attributes, function ( index, attribute ) {
                        //attrs[attribute.name] = attribute.value;
                        if (attribute.name=='class') {
                            pa_tab_str+=' class="d-td '+attribute.value+'"';
                        }
                        else {
                            pa_tab_str+=' '+attribute.name+'="'+attribute.value+'"';
                        }
                    });
                    pa_tab_str+='>'+$(el_clone).html()+'</div>';
                });    
            });
            //$(panel_add_v).pwstabs('destroy');
            var pa_tab=$(panel_add_v).find('div[data-pws-tab="'+p_a_tek_id+'"]');
            $(pa_tab).html(pa_tab_str);
            //$(panel_add_v).pwstabs('rebuild');            
            $(pa_tab_tek).each(function(i,elem) {  
                var el_clone=$(elem).clone().removeClass('d-td').removeAttr('id'),
                    tek_id=$(elem).attr('id').slice(1),
                    m_ids=tek_id.split('-'),
                    tek_el=$(pa_td).filter('[id="'+tek_id+'"]');
                if ($(tek_el).length===0) {
                    tek_el=$(table_tag_v).find('td[id="'+tek_id+'"]');
                }  
                if ($(tek_el).length>0) {
                    $.each(el_clone[0].attributes, function ( index, attribute ) {
                        //attrs[attribute.name] = attribute.value;
                        if (attribute.name=='class') {
                            $(tek_el).attr('class','c'+m_ids[0]+' r'+m_ids[1]+' '+attribute.value);
                        }
                        else {
                            $(tek_el).attr(attribute.name,attribute.value);
                        }
                    });
                    $(tek_el).html($(el_clone).html());
                }
            });
            p_a_tek_id=tek_dpt;
        }
    });
    
    $('#modal_form').on('scroll', function(e){ 
        if ($(modal_footer).is(':visible')) { 
            e.stopPropagation(); 
            var scrollTop=$(this).scrollTop();
            $(modal_header).css({'top':scrollTop+'px'});
            $(modal_footer).css({'bottom':(-1*scrollTop)+'px'});  
        }
        else if ($(modal_header).is(':visible')) { 
            e.stopPropagation(); 
            var scrollTop=$(this).scrollTop();
            $(modal_header).css({'top':scrollTop+'px'});  
        }
    });
    
    $('.no_panel').on('mouseover','li.action li,li.type li', function() {
        //console.log(this);
        $(this).css({background: '#d1ffff','border-bottom-color': 'white'});
        $(this).find('a').css({color: 'black'});
    });
    $('.no_panel').on('mouseout','li.action li,li.type li', function() {
        if ($(this).filter('[pr_change_style]').length==0) {
            $(this).css({background: 'white','border-bottom-color': 'black'});
            $(this).find('a').css({color: '#0088cc'});
        }    
    });
    $('.no_panel').on('mouseover','li.in_type li', function() {
        //console.log(this);
        $(this).css({background: '#d1ffff','border-bottom-color': 'white',color: 'black'});
    });
    $('.no_panel').on('mouseout','li.in_type li', function() {
        if ($(this).filter('[pr_change_style]').length==0) {
            $(this).css({background: 'white','border-bottom-color': 'black',color: '#0088cc'});
        }    
    });
    
    $('#modal_form').on('click', 'a.dropdown-toggle[data-toggle="dropdown_modal"]', function(){
        $('ul.dropdown-menu_modal').hide();
        var ul_active=$(this).next();
        $(ul_active).show();
        $(ul_active).find('a').css({'font-size': '12pt','margin':'0 0 0 3px'});
    });  
    
    $('#modal_form').on('click', 'ul.dropdown-menu_modal a', function(){
        $(this).closest('ul').hide();
    });
    
    $('#modal_form').on('mouseover','ul.dropdown-menu_modal li', function() {
        //console.log(this);
        $(this).css({background: '#d1ffff','border-bottom-color': 'white'});
        $(this).find('a').css({color: 'black'});
    });
    $('#modal_form').on('mouseout','ul.dropdown-menu_modal li', function() {
        if ($(this).filter('[pr_change_style]').length==0) {
            $(this).css({background: 'white','border-bottom-color': 'black'});
            $(this).find('a').css({color: '#0088cc'});
        }    
    });
    
    $('#modal_form').on('blur', 'ul.dropdown-menu_modal', function(){
        $(this).hide();
    });
    
    $('#modal_form').on('click', 'div#editor', function(){
        $(this).prev().find('ul.dropdown-menu_modal').hide();
    }); 
    
    $('#modal_form').on('click keyup', '.edit_ace-size', function(){
        var size_val=parseInt($(this).val());
        if (!isNaN(size_val)) {
            document.getElementById('editor').style.fontSize=size_val+'px';
            $(pr_active_mod).attr('data-edit_ace-size',size_val);
        }    
    });
    
    $('#modal_form').on('click', 'a#pictureBtn', function(){
        $(this).next().trigger('click');
    });
    
    $('.no_panel').on('click','li.in_type_one', function() {
        var tek_type=$(this).filter('[pr_change_style]');
        if ($(tek_type).length==0) {
            tek_type=$(this).siblings().filter('[pr_change_style]')
                        .removeAttr('pr_change_style')
                        .css({'background' : 'white', 'border-bottom-color':'black','color':'#0088cc'});
            $(this).attr('pr_change_style','').css({'background' : '#d1ffff', 'border-bottom-color':'white','color':'black'});
            $('.input_add[id='+$(settings_group_panel_active).attr('id')+']').attr('type',this.id);
        }
    });
    
    $('.no_panel').on('click','li.select_add_sql', function(e) {
        pr_active_mod=$(this);
        $('#modal_head_p').html('Редактирование SQL-запроса для Select');
        $('.modal_content').html('<div class="md_panel_sql_es">'+
                                    '<a class="save_select_add_sql" id="'+$(pr_active_mod).attr('id')+'" title="Сохранить код" style="z-index: 500000;" action_type="'+$(pr_active_mod).attr('action_type')+'">'+
                                        '<img src="/img/save.png" style="width:30px;height:auto;">'+
                                    '</a>'+
                                '</div>').append(container);
        set_ace_edit('sql',$(pr_active_mod).attr('data-edit_ace-theme'),$(pr_active_mod).attr('data-edit_ace-size'),$(pr_active_mod).find('.div_hidden').text() );                    
        $(container).show();
        $(settings_group_panel_active).hide();
        open_modal(e);
    });                
        
    $('#modal_form').on('click', '.save_select_add_sql', function(e) {                
        if (editor.getValue().trim().length>0) {
            upd_select_add(editor.getValue().trim(),this.id,true);                                         
        }   
                        
    });
    
    $('.no_panel').on('blur','.input_add', function() {
        upd_child_rel(this.id);
        $(this).attr('value',$(this).val())
    });
    
    $('.no_panel').on('change','li.required_add input', function() {
        var select_add=$('.select_add[id="'+this.id+'"]');
        $(select_add).removeAttr('required');
        var sgp_in=$('.settings_group_panel[action_type="'+$(this).attr('action_type')+'"][id="'+this.id+'"] li.required_add input');
        $(sgp_in).removeAttr('checked');
        if (this.checked) {
            $('.select_add[id="'+this.id+'"]').prop('required', true);
            $(sgp_in).attr('checked', 'checked');
        }    
    });
    
    $('.no_panel').on('change','li.multi_add input', function() {
        var select_add=$('.select_add[id="'+this.id+'"]');
        $(select_add).removeAttr('multiple');
        var sgp=$(table_tag).find('.settings_group_panel[action_type="'+$(this).attr('action_type')+'"][id="'+this.id+'"]'),
            sgp_in=$(sgp).find('li.multi_add input');
        $(sgp_in).removeAttr('checked');
        if (this.checked) {
            $('.select_add[id="'+this.id+'"]').attr('multiple', 'multiple');
            $(sgp_in).attr('checked', 'checked');
        }   
        upd_select_add($(sgp).find('li.select_add_sql .div_hidden').text(),this.id,false);  
    });
    
    $('.no_panel').on('change','li.no_create_sl[action_type] input', function() {
        $(this).removeAttr('checked');
        if (this.checked) {
            $(this).attr('checked', 'checked');
        } 
    });
    
    $('.no_panel').on('change','li.required_add input', function() {
        var action_type_v=$(this).attr('action_type'),
            sgp=$(table_tag).find('.settings_group_panel[action_type="'+$(this).attr('action_type')+'"][id="'+this.id+'"]'),
            sgp_in=$(sgp).find('li.required_add input');
        $(sgp_in).removeAttr('checked');    
        if (action_type_v=='input_add') {
            var el_check=$(sgp).closest('td').find('input.input_add[id="'+this.id+'"]');
            if (this.checked) {
                $(el_check).css('border','1px solid #bf00bf');
            }  
            else {
                $(el_check).css('border','1px solid #cccccc');
            }
        }
        else if (action_type_v=='select_add') {
            var el_check=$(sgp).closest('td').find('button.multiselect.dropdown-toggle');
            if (this.checked) {
                $(el_check).css('border-color','#bf00bf');
            }  
            else {
                $(el_check).attr('style','');
            }
        }
        else if (action_type_v=='in_modal_add') {
            var el_check=$(sgp).closest('td').find('input.in_modal_add_txt[id="'+this.id+'"]');
            if (this.checked) {
                $(el_check).css('border','1px solid #bf00bf');
            }  
            else {
                $(el_check).css('border','1px solid #cccccc');
            }
        }
        if (this.checked) {
            $(sgp_in).attr('checked', 'checked');
        }
    });
    
    $('body').on('click','#toTop',function() {
        $('body,html').animate({scrollTop:0},800);
    });
    
    $('.no_panel').on('focus','ul.multiselect-container div.input-group input.form-control.multiselect-search', function() {
        //активируем текущую ячейку для порядка
        var tek_td=$(this).closest('td');
        $('#my').jexcel('updateSelection', tek_td, tek_td); 
    });
        
    $(window).scroll(function(){
        if($(this).scrollTop() != 0) {
            $(toTop).fadeIn();

        } else {
            $(toTop).fadeOut();
        }
        if ($(settings_group_panel_active).is(':visible')) {
            var body_v=html_v,
                action_type=$(settings_group_panel_active).attr('action_type'),
                this_el;
            var this_top,this_left;
            if (action_type=="form_header") {
                this_el=$('.settings[action_type="form_header"][id='+$(settings_group_panel_active).attr('id')+']');
                this_top=$(this_el).offset().top+parseFloat($(this_el).find('img').height())-$(body_v).scrollTop(); 
                this_left=$(this_el).offset().left-$(body_v).scrollLeft();  
            }
            else {
                this_el=$('.settings_group_panel[action_type="'+action_type+'"][id='+$(settings_group_panel_active).attr('id')+']');
                var tek_tr=$(this_el).closest('tr');
                /*var next_tr=$(tek_tr).next();
                if ($(next_tr).length>0) {
                    this_top=$(next_tr).offset().top-$(body_v).scrollTop();
                } 
                else {
                    this_top=$(tek_tr).offset().top-33-$(body_v).scrollTop();
                }*/
                this_top=$(tek_tr).offset().top+tek_tr[0].offsetHeight-$(body_v).scrollTop();
                this_left=$(settings_group_panel_active).offset().left-$(body_v).scrollLeft();
            }
            $(settings_group_panel_active).css({'left':this_left+'px','top':this_top+'px'});  
        } 
        
        if (!!pr_param_show) {
            var tek_el=pr_param_show;                        
            var body_v=html_v;
            var this_top=$(tek_el).offset().top+3-$(body_v).scrollTop();
            var this_left=$(tek_el).offset().left+3-$(body_v).scrollLeft();
            $(tek_el).find('ul.multiselect-container').css({'left':this_left+'px','top':this_top+'px'}).show(); 
        } 
        
        if (pr_sql_group_panel_oc_show) {
            var body_v=html_v,
                this_el=$('.sql_group_panel_oc[id='+$(sql_group_panel).attr('id')+']'),
                tek_tr=$(this_el).closest('tr');
                next_tr=$(tek_tr).next();
            if ($(next_tr).length>0) {
                this_top=$(next_tr).offset().top-$(body_v).scrollTop();
            } 
            else {
                this_top=$(tek_tr).offset().top-33-$(body_v).scrollTop();
            }
            this_left=$(sql_group_panel).offset().left-$(body_v).scrollLeft(); 
            $(sql_group_panel).css({'left':this_left+'px','top':this_top+'px'}); 
        }
    });
});
