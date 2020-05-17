$(document).ready(function(){
    $('#div_name_rep').on('change', '#in_rep_last_upd', function(){ 
        var id_t=$(this).val();
        //console.log('получилось');
        var table=$(table_tag);
        //var user_right;        
        $(table).find('td[olap_tab_id="'+id_t+'"][olap_td_class="td_val_val"]').each(function(i,elem) {
            if (Number($(elem).text())===1) {
                $(elem).html('<input type="checkbox" checked="checked" class="right_check">');
            }
            else {
                $(elem).html('<input type="checkbox" class="right_check">');
            }
        });
        /*var params = new Object();
        params['code_in']='getRowsDB_conn';        
        params['tsql']="SELECT R.RIGHTS_ID,R.NAME RIGHTS_NAME \n\
                          FROM REP_RIGHTS R \n\
                         ORDER BY R.NAME;"; 
        console.log(params);
        $.ajax({
            type: "POST",
            url: "/get-data.php",
            data: params,
            success: function(html){
                user_right=html;
                $(table).find('td[olap_tab_id="'+id_t+'"][olap_td_class="td_val_val"]').each(function(i,elem) {
                    if (Number($(elem).text())===1) {
                        $(elem).html('<input type="checkbox" checked="checked" class="right_check" id="">');
                    }
                });
            },
            error: function(xhr, status, error) {
                alert('Ошибка получения данных. Возможно, истекло время сессии.'+xhr.responseText+ ' ' + status + ' ' +error);
                console.log(xhr.responseText + '|\n' + status + '|\n' +error);
            }
        });*/            
    });
    
    $('#div_name_rep').on('change', '.right_check', function(){ 
        if ($(this).prop('checked')) {
            $(this).attr('checked','checked');
        } 
        else {
            $(this).attr('checked','');
        }
    });
});