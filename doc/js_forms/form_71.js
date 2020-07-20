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
    $(".no_panel").on("before_load_data1", "#in_action_value", function(e){ 
        var id_t=1;
        //alert('Действие до загрузки данных');
    });
    
    $(".no_panel" ).on("after_build", "div.params_group[id=1]", function(e,params_group_clon) {
        $(this).find('input#BD').val('2018-07-01');
        $(this).find('input#ED').val('2018-07-03');
        var sel_er=$(this).find('select#ER'),
            sel_e=$(this).find('select#E');
        $(sel_er).find('option').attr('selected','selected');
        olap_param_upd_child(1,'ER'); 
        $(sel_e).find('option').attr('selected','selected');
        $(sel_er).multiselect('refresh');
        $(sel_e).multiselect('refresh');
    });

});