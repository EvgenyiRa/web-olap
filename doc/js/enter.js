$(document).ready(function(){
    
    $('#login').on('click', '.but_enter', function(){
        var user=$('#user');
        var password=$('#password');
        var pr_ok=true;
        if ($(user).val().trim().length==0) {
            pr_ok=false;
            alert('Поле "Логин" не заполнено');
        }
        else if ($(user).val().trim().length>100) {
            pr_ok=false;
            alert('Поле "Логин" должно быть длиной не более 100 символов');
        }
        if ($(password).val().trim().length<6) {
            pr_ok=false;
            alert('Поле "Пароль" должно быть длиной не менее 6 символов');
        }
        else if ($(password).val().trim().length>100) {
            pr_ok=false;
            alert('Поле "Пароль" должно быть длиной не более 100 символов');
        }        
        if (pr_ok) {
            var params = new Object();
            params['code_in']='but_enter';
            params['user']=$(user).val().trim();
            params['password']=$(password).val().trim();
            var loading_img=$('#loading_img'),
                width=window.innerWidth,
                height=window.innerHeight;
            $(loading_img).css({top:((height-$(loading_img).height())/2),left:((width-$(loading_img).width())/2)}).show();
            $.ajax({
                type:'post',
                url: "/get-data.php",
                data:params,
                dataType:'json',
                success: function(data) {
                    //console.log(data);                    
                    $(loading_img).hide();
                    if (data.pr_ok!=7) {
                        alert(data.err_txt);
                        console.log('Ошибка');
                        console.log(data);                        
                    } 
                    else {
                        console.log('Успешный вход');                                        
                        window.location.href = "/index.php";
                    }
                },
                error: function(xhr, status, error) {
                    $(loading_img).hide();
                    alert('Ошибка получения данных. Возможно, истекло время сессии. '+xhr.responseText+ ' ' + status + ' ' +error);
                    console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                }  
                
            });
        }
    });
    
});

