<?php require_once(realpath('../get-data-func.php'));
if (!empty($_POST['phpsessionid'])) {
    session_id($_POST['phpsessionid']);
}    
session_start();
/*ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);*/
if ((empty($_SESSION['user_info'])) & ($_POST['code_in']!='but_enter')) {
    exit();
}       
set_time_limit(0);

if ($_POST['code_in']=='but_enter') {
    echo get_but_enter($_POST);
}
elseif (!empty($_SESSION['user_info'])) {
    if ($_POST['code_in']==1) {
        echo overall1();
    }
    elseif ($_POST['code_in']==2) {
        echo overall13($_POST['month'],$_POST['year'],$_POST['cid']);
    }	
    elseif ($_POST['code_in']==3) {
            echo overall13_v($_POST['month'],$_POST['year']);
    }
    elseif ($_POST['code_in']=='save_rep_set') {
        save_rep_set($_POST);
    }
    elseif ($_POST['code_in']=='save_md_str') {
        echo get_strukture_sql($_POST['sql'],$_POST['sql_true'],$_POST['tab_id'],$_POST['params'],$_POST['params_olap'],$_POST['sql_lz']);
    } 
    elseif ($_POST['code_in']=='md_save') {
        echo save_tab_strukture($_POST['sql_true'],$_POST['mdata'],$_POST['tab_id'],$_POST['params_html']);
    } 
    /*elseif ($_POST['code_in']=='create_tab') {
        echo create_table($_POST);
    }*/
    elseif ($_POST['code_in']=='tab_add_str') {
        echo create_table_one_str_vector($_POST);
    }
    elseif ($_POST['code_in']=='save_rep') {
        echo save_rep($_POST,$_SESSION['user_info']);
    }
    elseif ($_POST['code_in']=='get_rep_data') {
        echo get_rep_data($_POST['id_rep']);
    }
    elseif ($_POST['code_in']=='report_del') {
        echo rep_del($_POST['id_rep']);
    }
    elseif ($_POST['code_in']=='get_md_param_sql') {
        echo get_md_param_sql($_POST);
    }
    elseif ($_POST['code_in']=='getRowsDB_conn') {
        echo getRowsDB_conn($_POST);
    }
    elseif ($_POST['code_in']=='exit') {
        destroySession();
        echo 7;
    }
    elseif ($_POST['code_in']=='get_rep_all') {
        $user_right=json_decode($_SESSION['user_right'],true);
        echo get_rep_all($user_right);
    }
    elseif ($_POST['code_in']=='in_mod_save_md_str') {
        echo get_strukture_sql_in_modal($_POST);
    }
    elseif ($_POST['code_in']=='getRowsDiv_DB_conn') {
        echo getRowsDiv_DB_conn($_POST);
    }
    elseif ($_POST['code_in']=='SQLexec') {
        echo getSQLexec($_POST);
    }
    elseif ($_POST['code_in']=='getOLAP2DPages') {
        echo getOLAP2DPages($_POST);
    }
    elseif ($_POST['code_in']=='getPswrdSol') {
        echo getPswrdSol($_POST);
    }
    elseif ($_POST['code_in']=='getSaveCacheRight') {
        require_once(realpath('../classes/cache/CacheCreateRight.php'));
        CacheCreateRight::remove();
        CacheCreateRight::run();
        echo 'ok';
    }
    elseif ($_POST['code_in']=='getJSONbySQL') {
        echo getJSONbySQL($_POST);
    } 
    elseif ($_POST['code_in']=='getUserInfo') {
        require_once(realpath('../classes/User.php'));
        echo User::getUserInfo();
    }
}    


?>