<?php 
if (!empty($_POST['phpsessionid'])) {
    session_id($_POST['phpsessionid']);
}
session_start();
require_once(realpath('../classes/MDRepository.php')); 
if ((!$_SESSION['user_info']) & ($_POST['code_in']!='but_enter')) {
    exit();
}       
set_time_limit(10000);
if ($_POST['code_in']=='get_exist_md_to_repos') {
    echo MDRepository::exist($_POST['md_sname']);
}
elseif ($_POST['code_in']=='save_md_to_repos') {
    echo MDRepository::save($_POST);
}
elseif ($_POST['code_in']=='get_md_struct_load') {
    echo MDRepository::allTR();
}
elseif ($_POST['code_in']=='get_md_struct_load_one_rep') {
    echo MDRepository::getMD($_POST);
}
elseif ($_POST['code_in']=='save_mdr_link') {
    echo MDRepository::saveMDLink($_POST);
}

?>