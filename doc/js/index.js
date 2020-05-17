$(document).ready(function() {
    $('ul.left-side-menu').on('click', '.rep_del', function(){
        var id_rep=this.id;
        var isTrue = confirm("Вы действительно хотите удалить выбранный отчет?");
        if (isTrue) {
            var params = new Object();
            params['code_in']='report_del';
            params['id_rep']=id_rep; 
            $(this).closest('.sign').remove();
            console.log(params);            
            $.ajax({
                type: "POST",
                url: "/get-data.php",
                data: params,
                success: function(data){
                    console.log(data);                       
                },
                error: function(xhr, status, error) {
                    console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                }
            });
        }
    });
    
    $('div.header-top').on('click', '#exit', function(){
        var isTrue = confirm("Вы действительно хотите покинуть систему?");
        if (isTrue) {
            var params = new Object();
            params['code_in']='exit';
            $.ajax({
                type: "POST",
                url: "/get-data.php",
                data: params,
                success: function(data){
                    window.location.href = "/index.php";
                },
                error: function(xhr, status, error) {
                    console.log(xhr.responseText + '|\n' + status + '|\n' +error);
                }
            });
        }
    });
    
    var open_left_menu=$('a.open-left-menu').hide();
    
    $('ul.left-side-menu').on('click', '.close_left_menu', function() {
        $(this).closest('ul.left-side-menu').fadeOut(800);
        $(open_left_menu).fadeIn(800);
    });
    
    $('div.header-top').on('click', 'a.open-left-menu', function(){
        $(open_left_menu).fadeOut(800);
        $('ul.left-side-menu').fadeIn(800);
    });
    
});


