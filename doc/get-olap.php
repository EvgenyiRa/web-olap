<?php require_once(realpath('../get-data-func.php'));
session_start();
if (!$_SESSION['user_info']) {
    exit();
} 
/*ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);*/
set_time_limit(0);
$mass=$_POST;

    function ora_drop_temp_tab($tab_temp) {
        $conn=conndb();
        $tsql=" DROP TABLE ".$tab_temp;             
        $stid = oci_parse($conn, $tsql);
        if ($stid) {
            $r = oci_execute($stid);
            if ($r) {
                $data['drop_tab']="Успех";
            }
            else {
                $e = oci_error($stid);
                $data['drop_tab']='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
            }
            oci_free_statement($stid);
        }
        else {
            $e = oci_error($conn);
            $data['drop_tab']='Что-то пошло не так, не парсится '.htmlentities($e['message'], ENT_QUOTES);
        }  
        oci_close($conn);
        return $data['drop_tab'];
    }    
    
    $dbt=db_type();
    
    $tab_str= json_decode($mass['tab_str'],true);
    $tab_pok= json_decode($mass['tab_pok'],true);
    $tab_val= json_decode($mass['tab_val'],true);
    $tab_pol= json_decode($mass['tab_pol'],true);
    $pr_2D=!empty($mass['pr_2D']);    
    $pr_flush=false;
    if ($pr_2D) {
        //Построение таблицы
        $data['tab_html']='<tbody>';
        //заголовки строк и значений показателей
        $data['tab_html'].='<tr class="tr_name_col">';
        $mass_vis=[];
        $mass_unvis=[];
        $mass_vis_name=[];                
        foreach ($tab_val as $key=>$mval) {
            if ($mval['aggr']=='VIS') {
                $mass_vis[$mval['sysname']]=$mval['aggr'];
                $mass_vis_name[$key]=$mval;
            }
            else {
                $mass_unvis[$mval['sysname']]=$mval['aggr'];
            }
        }                
        foreach ($mass_vis_name as $mval) {
            $data['tab_html'].='<td class="td_val_name" id="'.$mval['sysname'].'">'
                                    .'<a class="tab_sort_up" id="'.$mval['sysname'].'" title="Отсортировать по возрастанию">'
                                        . '<img src="/img/sort_up.png" style="width:7px;height:13px !important;">'
                                    . '</a>'
                                    .$mval['name']
                                    .'<a class="tab_sort_unup" id="'.$mval['sysname'].'" title="Отсортировать по убыванию">'
                                        . '<img src="/img/sort_unup.png" style="width:7px;height:13px !important;">'
                                    . '</a>  '
                                .'</td>';
        }
        $data['tab_html'].='</tr>';
        if (!empty($mass['get_page'])) {            
            //пагинатор
            $tek_page=(int) $mass['get_page'];
            $user=json_decode($_SESSION['user_info'],true);            
            $class_dir='_'.$mass['in_rep_id'].'_'.$mass['tab_id'].'_'.$user['USER_ID'].'/';
            //получаем все страницы из папки (возможно ещё не созданы до конца)
            //если ещё идет формарирование страниц, иначе ничего не надо возвращать
            if (!empty($mass['max_page'])) {
                $f = scandir(realpath('../classes/cacheOLAP2D/'.'_'.$mass['in_rep_id'].'_'.$mass['tab_id'].'_'.$user['USER_ID']));
                //возвращаем только те которые больше текущей отображаемой максимальной
                foreach ($f as $file) {
                    if (strlen($file)>2) {
                        $t_f=substr($file,1);
                        $t_f= explode('.', $t_f);
                        $t_f=$t_f[0];
                        $mass_page[]=(int) $t_f;
                    }                
                } 
                $mass_page=sort($mass_page);
                $max_page=(int) $mass['max_page'];
                foreach ($mass_page as $val) {
                    if ($val>$max_page) {
                        $mass_page_true[]=$val;
                    }
                }            
                $data['mass_page']= json_encode($mass_page_true);
            }
            $class_name='_'.$tek_page;
            require_once(realpath('../classes/cacheOLAP2D/'.$class_dir.$class_name.'.php'));
            $data['tab_html'].=call_user_func(array($class_name, 'getRows'));                             
        }
        else {
            if ($mass['params_val']) {
                $params_val=json_decode($mass['params_val'],true);
                if ($dbt=='mssql') {
                    foreach($params_val as &$val) {
                        $params_val_true[]=$val;
                    }
                }
                elseif ($dbt=='ora') {
                    $params_val_true=$params_val;
                }
                $data['$params_val']= json_encode($params_val);                
            } 
            else {
                $params_val_true= array();
            }
            $data['$params_val_true']= json_encode($params_val_true);
            $conn=conndb();
            if ($dbt=='mssql') {
                $type_decode=meta_var();
            }    
            if($conn) {         
                $sql_true=html_entity_decode($mass['sql_true'],ENT_COMPAT|ENT_HTML401, 'UTF-8');            
                if ($dbt=='mssql') {
                    $tsql="SET NOCOUNT ON;SET DATEFORMAT YMD;".$sql_true;
                }  
                elseif ($dbt=='ora') {
                    $tsql=$sql_true;
                }
                //пагинатор
                $tableDefPage=get_tableDefPage();
                $data['tableDefPage']=$tableDefPage;
                if ($dbt=='mssql') {
                    $getRows = sqlsrv_query($conn, $tsql,$params_val_true); 								
                    if(sqlsrv_has_rows($getRows)) {  
                        $rowCount = sqlsrv_num_rows($getRows);  
                        while( $row = sqlsrv_fetch_array( $getRows, SQLSRV_FETCH_ASSOC)) {  
                            $data['tab_html'].=olap_one_str_2D($row,$mass_vis,$mass_unvis,$mass['tab_id']);
                        }  							
                    }  
                    else {
                        $data['tab_html2d_er'].='Что-то пошло не так '.sqlsrv_errors();
                    }
                    sqlsrv_free_stmt($getRows);
                }
                elseif ($dbt=='ora') {
                    $stid = oci_parse($conn, $tsql);
                    if ($stid) {
                        ora_create_params($stid,$params_val_true);
                        $r = oci_execute($stid);
                        if ($r) {
                            $i=0;
                            $rows='';
                            while ($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS+OCI_RETURN_LOBS)) {
                                $rows.=olap_one_str_2D($row,$mass_vis,$mass_unvis,$mass['tab_id']);
                                $i++;
                                if ($i>=$tableDefPage) {
                                    break;
                                }
                                //$rows[$i-1]=$row;
                            }
                            if (($i===0) & (!$row)) {
                                //ничего не найдено
                                $mass_null=[];
                                foreach ($mass_vis as $key=>$val) {
                                    $mass_null[$key]='';
                                }
                                //создаем две строки, чтобы корректней строить стили повторно
                                $mass_null_fk=getFirstKeyArray($mass_null);
                                $mass_null[$mass_null_fk]='Ничего не найдено';
                                $rows.=olap_one_str_2D($mass_null,$mass_vis,$mass_unvis,$mass['tab_id']);
                                $mass_null[$mass_null_fk]='';
                                $rows.=olap_one_str_2D($mass_null,$mass_vis,$mass_unvis,$mass['tab_id']);
                            }
                            $data['tab_html'].=$rows;                            
                            if ($i>=$tableDefPage) {
                                $data['mass_page']= json_encode([1]);
                                $rows=str_replace("'" , "\'", $rows);
                                ignore_user_abort(true);
                                set_time_limit(0);
                                ob_start();
                                $pr_flush=true;
                                echo json_encode($data);
                                header('Connection: close');
                                header('Content-Length: '.ob_get_length());
                                ob_end_flush();
                                ob_flush();
                                flush();
                                //подключаем класс создания 
                                $user=json_decode($_SESSION['user_info'],true);
                                $class_name='_'.$mass['in_rep_id'].'_'.$mass['tab_id'].'_'.$user['USER_ID'];
                                //смотри существует ли запущенный процесс создания кэша для текущего пользователя в текущей форме в текущей olap-структуре
                                clearstatcache();
                                $dir_str_block='../classes/cacheOLAP2D/beg_file/'.$class_name;
                                $str_block=file_exists($dir_str_block);
                                if ($str_block) {
                                    //существует, ждем пока закончится (на ближайшей записи файла текущего процесса), признаком окончания считаем пустоту директории или постоянство количества файлов (за 3 секунды обязано что-то поменяться)
                                    unlink($dir_str_block);
                                    $pr_block_ok=false;
                                    $f_beg = array_diff(scandir(realpath('../classes/cacheOLAP2D/'.$class_name)), array('..', '.'));
                                    if (count($f_beg)>0) {
                                        while (!$pr_block_ok) {
                                            sleep(3);
                                            $f = array_diff(scandir(realpath('../classes/cacheOLAP2D/'.$class_name)), array('..', '.'));
                                            $pr_block_ok=true;
                                            if (count($f_beg)!== count($f)) {
                                                if (count($f)!==0) {
                                                    $f_beg=$f;
                                                    $pr_block_ok=false;
                                                }                                                                                                                                    
                                            }    
                                        }   
                                    } 
                                    $f_beg = array_diff(scandir(realpath('../classes/cacheOLAP2D/'.$class_name)), array('..', '.'));
                                    //ну мало ли))
                                    if (count($f_beg)>0) {
                                        foreach ($f as $file) {
                                            unlink(realpath('../classes/cacheOLAP2D/'.$class_name.'/'.$file));
                                        }
                                    }
                                }
                                require_once(realpath('../classes/Cache2D.php'));                                    
                                //пишем спец.файл для отслеживания перекрывающих запросов
                                file_put_contents($dir_str_block , '');
                                Cache2D::run($class_name,$rows,$stid,$mass_vis,$mass_unvis,$mass['tab_id'],$tableDefPage);
                            }    
                            
                        }
                        else {
                            $e = oci_error($stid);
                            $data['tab_html2d_er'].='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                        }
                        oci_free_statement($stid);
                    }
                    else {
                        $e = oci_error($conn);
                        $data['tab_html2d_er'].='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                    }
                    
                }
                if ($dbt=='mssql') {
                    sqlsrv_close($conn);
                }    
                elseif ($dbt=='ora') {    
                    oci_close($conn);                
                }    
            }    
        }
        $data['tab_html'].='</tbody>'; 
    }
    else {
        if ($mass['params_val']) {
            $params_val=json_decode($mass['params_val'],true);
            if ($dbt=='mssql') {
                foreach($params_val as &$val) {
                    $params_val_true[]=$val;
                }
            }
            elseif ($dbt=='ora') {
                /*foreach($params_val as $key=>$val) {
                    $params_val_true[$key]=$html_entity_decode($val,ENT_COMPAT|ENT_HTML401, 'UTF-8');;
                }*/
                $params_val_true=$params_val;
            }
            $data['$params_val']= json_encode($params_val);
            $data['$params_val_true']= json_encode($params_val_true);
        } 

        $conn=conndb();
        if ($dbt=='mssql') {
            $type_decode=meta_var();
        }    
        if($conn) {         
            $sql_true=html_entity_decode($mass['sql_true'],ENT_COMPAT|ENT_HTML401, 'UTF-8');
            if ($dbt=='mssql') {
                $tab_temp="##REP_TAB_".$mass['tab_id']."_".date("mdyHis");
            }
            elseif ($dbt=='ora') {
                $tab_temp="REP_TAB_".$mass['tab_id']."_".date("mdyHis");
            }           

            if ($dbt=='mssql') {
                $tsql="SET NOCOUNT ON;SET DATEFORMAT YMD;CREATE TABLE ".$tab_temp." (";                      
                if ($stmt3 = sqlsrv_prepare( $conn, $sql_true)) { 
                    $meta_struct=sqlsrv_field_metadata($stmt3);
                    if ($meta_struct) {
                        $data['meta_struct']= json_encode($meta_struct);
                        //var_dump(sqlsrv_field_metadata($stmt3));
                        foreach($meta_struct as $m) {  
                            $tsql.='['.$m['Name'].']'." ".$type_decode[$m['Type']];
                            if ($m['Precision']) {
                                //if (($m['Type']!=93) & ($m['Type']!=91) & ($m['Type']!=-154)) {
                                if (!in_array($m['Type'], array(93,91,-154,5,-5))) {
                                    $tsql.="(".$m['Precision'].(($m['Scale']) ? ",".$m['Scale']:"" ).")";
                                }
                            }
                            elseif ($m['Size']) {
                                $tsql.="(".$m['Size'].")";
                            }
                            else {
                                if (in_array($m['Type'], array(-9,12))) {
                                    $tsql.="(MAX)";
                                }
                            }
                                    //(($m['Precision']) ? "(".$m['Precision'].(($m['Scale']) ? ",".$m['Scale']:""): (($m['Type']==-9) ? "(MAX)":"") ).(($m['Precision']) ? ")":"")
                            $tsql.=(($m['Nullable']) ? " ":" NOT")." NULL,";        
                        }
                    }                  
                    sqlsrv_free_stmt( $stmt3);
                }            
                $tsql=substr($tsql, 0, -1);
                $tsql.=")"; 
                $tsql.=" INSERT INTO ".$tab_temp." ".$sql_true; 
                //$data['tsql']=str_replace('↵','',html_entity_decode($tsql, ENT_COMPAT | ENT_HTML401, 'UTF-8'));            
                $data['tsql']=$tsql;

                $stmt=sqlsrv_prepare($conn, $tsql,$params_val_true);					 
                if (sqlsrv_execute($stmt)) {  
                        $data['ex_insert']="Успех";  
                }  
                else {  
                        $data['ex_insert']="Error in executing statement.\n".sqlsrv_errors();  				 
                }  
                sqlsrv_free_stmt($stmt); 
            } 
            elseif ($dbt=='ora') {

                $tsql="CREATE GLOBAL TEMPORARY TABLE ".$tab_temp." ("; 
                $stid = oci_parse($conn, $sql_true);
                if ($stid) {
                    $r = oci_execute($stid, OCI_DESCRIBE_ONLY);
                    if ($r) {
                        $ncols = oci_num_fields($stid);
                        $mass_ns=array('TIMESTAMP','DATE','CLOB','LONG','BLOB','LONG RAW','RAW','XMLTYPE','UROWID');
                        for ($i = 1; $i <= $ncols; $i++) {
                            $fieldMetadata['Name']=oci_field_name($stid, $i);
                            $fieldMetadata['Type']=oci_field_type($stid, $i);
                            $fieldMetadata['Precision']=oci_field_precision($stid, $i);
                            $fieldMetadata['Scale']=oci_field_scale($stid, $i);
                            $fieldMetadata['Size']=oci_field_size($stid, $i);
                            $tsql.='"'.$fieldMetadata['Name'].'" '.$fieldMetadata['Type'];
                            if ((($fieldMetadata['Size']>0) || ($fieldMetadata['Precision']>0))
                                & (!in_array($fieldMetadata['Type'], $mass_ns))) {
                                $tsql.='(';
                                if ($fieldMetadata['Size']>0) {
                                    $tsql.=$fieldMetadata['Size'];
                                }
                                elseif ($fieldMetadata['Precision']>0) {
                                    $tsql.=$fieldMetadata['Precision'];                                                                
                                }  
                                if ($fieldMetadata['Scale']>0) {
                                    $tsql.=','.$fieldMetadata['Scale'];
                                }
                                $tsql.='),'."\r\n";
                            }
                            else {
                                $tsql.=','."\r\n";
                            }
                        } 
                    }
                    else {
                        $e = oci_error($stid);
                        $data['ex_insert']=get_null(htmlentities($e['message'], ENT_QUOTES));
                    }
                    oci_free_statement($stid);
                }
                else {
                    $e = oci_error($conn);
                    $data['ex_insert']=get_null(htmlentities($e['message'], ENT_QUOTES));
                }
                $tsql=substr($tsql, 0, -3);
                $tsql.=") ON COMMIT PRESERVE ROWS";
                $tsql=html_entity_decode($tsql,ENT_COMPAT|ENT_HTML401, 'UTF-8');
                $data['sql_create_tab']=$tsql;

                $stid = oci_parse($conn, $tsql);
                if ($stid) {
                    $r = oci_execute($stid);
                    if ($r) {
                        $data['create_tab']="Успех"; 
                    }
                    else {
                        $e = oci_error($stid);
                        $data['create_tab']='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                    }
                    oci_free_statement($stid);
                }
                else {
                    $e = oci_error($conn);
                    $data['create_tab']='Что-то пошло не так, не парсится '.htmlentities($e['message'], ENT_QUOTES);
                } 

                $tsql="INSERT INTO ".$tab_temp." ".$sql_true;             
                $stid = oci_parse($conn, $tsql);
                if ($stid) {
                    ora_create_params($stid,$params_val_true);
                    $r = oci_execute($stid);
                    if ($r) {
                        $data['ex_insert']="Успех"; 
                        $count_all=oci_num_rows($stid);
                    }
                    else {
                        $e = oci_error($stid);
                        $data['ex_insert']='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                    }
                    oci_free_statement($stid);
                }
                else {
                    $e = oci_error($conn);                
                    $data['ex_insert']='Что-то пошло не так, не парсится '.htmlentities($e['message'], ENT_QUOTES);
                }            

            }

            if ($dbt=='mssql') {
                $tsql = "SELECT COUNT(1) COUNT_ALL
                           FROM ".$tab_temp;  
                 $getRows = sqlsrv_query($conn, $tsql); 					
                 if(sqlsrv_has_rows($getRows)) {  
                     $row = sqlsrv_fetch_array( $getRows, SQLSRV_FETCH_ASSOC);
                     $count_all=$row['COUNT_ALL'];
                 }  
                 else {
                     $data['tab_html']='Что-пошло не так '.sqlsrv_errors();
                 }
                 sqlsrv_free_stmt($getRows);
            }     

            if ($count_all==0) {
                $data['tab_html']='<tbody><tr><td>Набор данных пуст</td></tr></tbody>';
                $data['pr_null']=777;
                $data['pr_null_text']='Ничего не найдено';
            } 
            else {        
                if (count($tab_pok)>0) {
                    //необходимо для красивого построения (считаем кол-во уникальных показателей по каждому с их упорядочиванием)
                    $sql_unic_pok_cool="";        
                    if ($dbt=='mssql') {
                        $sql_unic_pok_cool.="SET NOCOUNT ON;SET DATEFORMAT YMD;";
                    }    
                    $sql_unic_pok_cool.="SELECT * FROM "
                                    . "(".
                                    "   SELECT COUNT(DISTINCT ".$tab_pok[0]['sysname'].") count, '".$tab_pok[0]['sysname']."' sysname,'".$tab_pok[0]['name']."' name"
                                       . "   FROM ".$tab_temp;
                    for ($i = 1; $i <= (count($tab_pok)-1); $i++) {
                        $sql_unic_pok_cool.=" UNION"
                                        . "  SELECT COUNT(DISTINCT ".$tab_pok[$i]['sysname'].") count, '".$tab_pok[$i]['sysname']."' sysname,'".$tab_pok[$i]['name']."' name"
                                          . "  FROM ".$tab_temp;
                    }                                
                    $sql_unic_pok_cool.=  ") T"
                                        . " ORDER BY 1"; 
                    $data['$tab_pok']=$tab_pok;
                    $data['$sql_unic_pok_cool']=$sql_unic_pok_cool;

                    if ($dbt=='mssql') {
                        $getRows = sqlsrv_query($conn, $sql_unic_pok_cool);             
                        if(sqlsrv_has_rows($getRows)) {  
                            $i=1;
                            while($tab_pok_cool[$i] = sqlsrv_fetch_array( $getRows, SQLSRV_FETCH_ASSOC)) {
                                ++$i;                
                            }
                            unset($tab_pok_cool[$i]);
                            sqlsrv_free_stmt($getRows);
                        } 
                    } 
                    elseif ($dbt=='ora') {
                        $stid = oci_parse($conn, $sql_unic_pok_cool);
                        if ($stid) {
                            $r = oci_execute($stid);
                            if ($r) {
                                $i=0;
                                while ($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS+OCI_RETURN_LOBS)) {
                                    $tab_pok_cool[++$i]=array_change_key_case($row);
                                    //$tab_pok_cool[++$i]=$row;
                                }
                            }
                            else {
                                $e = oci_error($stid);
                                $data['$tab_pok_cool_er']='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                            }
                            oci_free_statement($stid);
                        }
                        else {
                            $e = oci_error($conn);
                            $data['$tab_pok_cool_er']='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                        }
                    }

                    $data['tab_pok_cool']= $tab_pok_cool;

                    $sql_unic_pok="SELECT * FROM (";
                    $sql_unic_pok.="SELECT DISTINCT ".$tab_pok_cool[1]['sysname']." FROM ".$tab_temp;
                    $sql_unic_pok.=") T_".$tab_pok_cool[1]['sysname'];
                    for ($i = 2; $i <= count($tab_pok_cool); $i++) {
                        $sql_unic_pok.=" JOIN (SELECT DISTINCT ".$tab_pok_cool[$i]['sysname']." FROM ".$tab_temp.") T_".$tab_pok_cool[$i]['sysname']." ON 1=1";
                    }
                    $sql_unic_pok.=" ORDER BY ";
                    foreach ($tab_pok_cool as $m) {
                        $sql_unic_pok.=$m['sysname'].",";
                    }
                    $sql_unic_pok=substr($sql_unic_pok, 0, -1);            
                    $data['sql_unic_pok']=$sql_unic_pok;
                    if ($dbt=='mssql') {
                        $getRows = sqlsrv_query($conn, $sql_unic_pok); 					
                        if(sqlsrv_has_rows($getRows)) {  
                            //$rowCount_unic_pok = sqlsrv_num_rows($getRows);  
                            $i=1;
                            while( $rows_unic_pok[$i] = sqlsrv_fetch_array( $getRows, SQLSRV_FETCH_ASSOC)) {
                                ++$i;
                            }
                            $rowCount_unic_pok = $i-1; 
                            unset($rows_unic_pok[$i]);
                            sqlsrv_free_stmt($getRows);
                        }
                    }
                    elseif ($dbt=='ora') {
                        $stid = oci_parse($conn, $sql_unic_pok);
                        if ($stid) {
                            $r = oci_execute($stid);
                            if ($r) {
                                $i=0;
                                while ($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS+OCI_RETURN_LOBS)) {
                                    //$rows_unic_pok[++$i]=array_change_key_case($row);
                                    $rows_unic_pok[++$i]=$row;
                                }
                            }
                            else {
                                $e = oci_error($stid);
                                $data['rows_unic_pok_er']='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                            }
                            oci_free_statement($stid);
                            $rowCount_unic_pok = $i; 
                        }
                        else {
                            $e = oci_error($conn);
                            $data['rows_unic_pok_er']='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                        }
                    }
                    $data['rows_unic_pok']= $rows_unic_pok;
                }

                $sql_unic_str="";
                if ($dbt=='mssql') {
                    $sql_unic_str.="SET NOCOUNT ON;SET DATEFORMAT YMD;";
                    $sql_unic_str.="SELECT DISTINCT ";
                    foreach ($tab_str as $m) {
                        $sql_unic_str.="[".$m['sysname']."],";
                    }
                    $sql_unic_str=substr($sql_unic_str, 0, -1);
                    $sql_unic_str.=" FROM ".$tab_temp." ORDER BY ";
                    foreach ($tab_str as $m) {
                        $sql_unic_str.="[".$m['sysname']."],";
                    }
                } 
                elseif ($dbt=='ora') {
                    $sql_unic_str.="SELECT DISTINCT ";
                    foreach ($tab_str as $m) {
                        $sql_unic_str.="\"".$m['sysname']."\",";
                    }
                    $sql_unic_str=substr($sql_unic_str, 0, -1);
                    $sql_unic_str.=" FROM ".$tab_temp." ORDER BY ";
                    foreach ($tab_str as $m) {
                        $sql_unic_str.="\"".$m['sysname']."\",";
                    }
                }

                $sql_unic_str=substr($sql_unic_str, 0, -1);
                $data['sql_unic_str']=$sql_unic_str;
                if ($dbt=='mssql') {
                    $getRows = sqlsrv_query($conn, $sql_unic_str); 					
                    if(sqlsrv_has_rows($getRows)) {  
                        //$rowCount_unic_str = sqlsrv_num_rows($getRows);  
                        $i=1;
                        while( $rows_unic_str[$i] = sqlsrv_fetch_array( $getRows, SQLSRV_FETCH_ASSOC)) {
                            ++$i;
                        }
                        $rowCount_unic_str = $i-1; 
                        unset($rows_unic_str[$i]);
                        sqlsrv_free_stmt($getRows);
                    }  
                }  
                elseif ($dbt=='ora') {
                    $stid = oci_parse($conn, $sql_unic_str);
                    if ($stid) {
                        $r = oci_execute($stid);
                        if ($r) {
                            $i=0;
                            while ($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS+OCI_RETURN_LOBS)) {
                                //$rows_unic_str[++$i]=array_change_key_case($row);
                                $rows_unic_str[++$i]=$row;
                            }
                        }
                        else {
                            $e = oci_error($stid);
                            $data['$rows_unic_str_er']='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                        }
                        oci_free_statement($stid);
                        $rowCount_unic_str = $i;
                    }
                    else {
                        $e = oci_error($conn);
                        $data['$rows_unic_str_er']='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                    }
                }
                $data['$rows_unic_str']=$rows_unic_str;
                $data['$rowCount_unic_str']=$rowCount_unic_str;

                $sql_unic_val="";
                if ($dbt=='mssql') {
                    $sql_unic_val.="SET NOCOUNT ON;SET DATEFORMAT YMD;";
                }
                $sql_unic_val.="WITH TAB AS (SELECT ";
                if ($mass['tab_str_itog_order']) {
                    for ($i = 0; $i <= (count($tab_str)-2); $i++) {
                        if ($dbt=='mssql') {
                            $sql_unic_val.="[".$tab_str[$i]['sysname']."],";
                        }
                        elseif ($dbt=='ora') {
                            $sql_unic_val.='"'.$tab_str[$i]['sysname'].'",';
                        }
                    }
                    if ($dbt=='mssql') {
                        $sql_unic_val.="CAST([".$tab_str[count($tab_str)-1]['sysname']."] AS NVARCHAR(MAX)) [".$tab_str[count($tab_str)-1]['sysname']."],["
                                        .$tab_str[count($tab_str)-1]['sysname']."] ".$tab_str[count($tab_str)-1]['sysname']."_ITG_,";
                    } 
                    elseif ($dbt=='ora') {
                        $sql_unic_val.="TO_CHAR(\"".$tab_str[count($tab_str)-1]['sysname']."\") \"".$tab_str[count($tab_str)-1]['sysname']."\",\""
                                        .$tab_str[count($tab_str)-1]['sysname']."\" ".$tab_str[count($tab_str)-1]['sysname']."_ITG_,";
                    }

                    if (count($tab_pok)>0) {
                        for ($i = 1; $i <= (count($tab_pok_cool)); $i++) {
                            if ($dbt=='mssql') {
                                $sql_unic_val.="[".$tab_pok_cool[$i]['sysname']."],";
                            }
                            elseif ($dbt=='ora') {
                                $sql_unic_val.="\"".$tab_pok_cool[$i]['sysname']."\",";
                            }
                        }
                        //$sql_unic_val.="CAST(".$tab_pok_cool[count($tab_pok_cool)]['sysname']." AS NVARCHAR(MAX)) ".$tab_pok_cool[count($tab_pok_cool)]['sysname'].",";                 
                    }
                }
                else {
                    foreach ($tab_str as $m) {
                        if ($dbt=='mssql') {
                            $sql_unic_val.="[".$m['sysname']."],";
                        } 
                        elseif ($dbt=='ora') {
                            $sql_unic_val.="\"".$m['sysname']."\",";
                        }
                    }  
                    if (count($tab_pok)>0) {
                        foreach ($tab_pok_cool as $m) {
                            if ($dbt=='mssql') {
                                $sql_unic_val.="[".$m['sysname']."],";
                            }
                            elseif ($dbt=='ora') {
                                $sql_unic_val.="\"".$m['sysname']."\",";
                            }
                        } 
                    }            
                }
                if ($dbt=='mssql') {
                    foreach ($tab_val as $m) {
                        $sql_unic_val.='ISNULL('.$m['aggr'].'(ISNULL(['.$m['sysname']."],0)),0) [".$m['sysname']."],";
                    }
                } 
                elseif ($dbt=='ora') {
                    foreach ($tab_val as $m) {
                        $sql_unic_val.='NVL('.$m['aggr'].'(nvl("'.$m['sysname'].'",0)),0) "'.$m['sysname'].'",';
                    }
                }
                $sql_unic_val=substr($sql_unic_val, 0, -1);
                $sql_unic_val.=" FROM ".$tab_temp." GROUP BY ";
                if ($dbt=='mssql') {
                    foreach ($tab_str as $m) {
                        $sql_unic_val.="[".$m['sysname']."],";
                    } 
                } 
                elseif ($dbt=='ora') {
                    foreach ($tab_str as $m) {
                        $sql_unic_val.="\"".$m['sysname']."\",";                
                    }    
                }
                if (count($tab_pok_cool)>0) {
                    if ($dbt=='mssql') {
                        foreach ($tab_pok_cool as $m) {
                            $sql_unic_val.="[".$m['sysname']."],";
                        } 
                    }  
                    elseif ($dbt=='ora') {
                        foreach ($tab_pok_cool as $m) {
                            $sql_unic_val.="\"".$m['sysname']."\",";
                        }
                    }
                }    
                $sql_unic_val=substr($sql_unic_val, 0, -1);
                $sql_unic_val.=" ) ";
                if ($dbt=='ora') {
                    $sql_unic_val.="SELECT * FROM (";
                }
                $sql_unic_val.="SELECT ";
                foreach ($tab_str as $m) {
                    $sql_unic_val.="0 ".$m['sysname']."_GRPNG_,";
                }
                if (count($tab_pok_cool)>0) {
                    foreach ($tab_pok_cool as $m) {
                        $sql_unic_val.="0 ".$m['sysname']."_GRPNG_,";
                    } 
                }
                $sql_unic_val.="TAB.* FROM TAB";
                //ИТОГИ
                if ($mass['tab_str_itog_order']) {
                    $sql_unic_val.=" UNION ALL SELECT ";
                    if ($dbt=='mssql') {
                        foreach ($tab_str as $m) {
                            $sql_unic_val.="GROUPING([".$m['sysname']."]) ".$m['sysname']."_GRPNG_,";
                        } 
                    }  
                    elseif ($dbt=='ora') {
                        foreach ($tab_str as $m) {
                            $sql_unic_val.="GROUPING(\"".$m['sysname']."\") ".$m['sysname']."_GRPNG_,";
                        } 
                    }
                    if (count($tab_pok_cool)>0) {
                        if ($dbt=='mssql') {
                            foreach ($tab_pok_cool as $m) {
                                $sql_unic_val.="GROUPING([".$m['sysname']."]) ".$m['sysname']."_GRPNG_,";
                            } 
                        }   
                        elseif ($dbt=='ora') {
                            foreach ($tab_pok_cool as $m) {
                                $sql_unic_val.="GROUPING(\"".$m['sysname']."\") ".$m['sysname']."_GRPNG_,";
                            } 
                        }
                    }

                    if ($dbt=='mssql') {
                        for ($i = 0; $i <= (count($tab_str)-2); $i++) {
                            $sql_unic_val.="[".$tab_str[$i]['sysname']."],";
                        }
                        $sql_unic_val.="'Итого' [".$tab_str[count($tab_str)-1]['sysname']."],[".$tab_str[count($tab_str)-1]['sysname']."] ".$tab_str[count($tab_str)-1]['sysname']."_ITG_,";            
                    } 
                    elseif ($dbt=='ora') {
                        for ($i = 0; $i <= (count($tab_str)-2); $i++) {
                            $sql_unic_val.="\"".$tab_str[$i]['sysname']."\",";
                        }
                        $sql_unic_val.="'Итого' \"".$tab_str[count($tab_str)-1]['sysname']."\",\"".$tab_str[count($tab_str)-1]['sysname']."\" ".$tab_str[count($tab_str)-1]['sysname']."_ITG_,";            
                    }                            


                    if (count($tab_pok)>0) {
                        //$sql_unic_val.="ISNULL(".$tab_pok_cool[count($tab_pok_cool)]['sysname'].",CASE WHEN GROUPING(".$tab_pok_cool[count($tab_pok_cool)]['sysname'].")=1 "; 
                        //for ($i = 0; $i <= (count($tab_str)-1); $i++) {
                          //  $sql_unic_val.=" AND GROUPING(".$tab_str[$i]['sysname'].")=1 ";
                        //}
                        //for ($i = 1; $i <= (count($tab_pok_cool)-1); $i++) {
                          //  $sql_unic_val.=" AND GROUPING(".$tab_pok_cool[$i]['sysname'].")=1 ";
                        //}                
                        //$sql_unic_val.="                                                        THEN 'Итого'
                          //                                                                   ELSE 'Промежуточный итог'
                            //                                                            END) ".$tab_str[count($tab_str)-1]['sysname'].",".$tab_str[count($tab_str)-1]['sysname']." ".$tab_str[count($tab_str)-1]['sysname']."_ITG_,";
                        if ($dbt=='mssql') {
                            foreach ($tab_pok_cool as $m) {
                                $sql_unic_val.="[".$m['sysname']."],";
                            }    
                        }
                        elseif ($dbt=='ora') {
                            foreach ($tab_pok_cool as $m) {
                                $sql_unic_val.="\"".$m['sysname']."\",";
                            } 
                        }
                    }    
                    //else {
                        //$sql_unic_val.="ISNULL(".$tab_str[count($tab_str)-1]['sysname'].",CASE WHEN GROUPING(".$tab_str[count($tab_str)-1]['sysname'].")=1 "; 
                        //for ($i = 0; $i <= (count($tab_str)-2); $i++) {
                           //$sql_unic_val.=" AND GROUPING(".$tab_str[$i]['sysname'].")=1 ";
                        //}
                        //$sql_unic_val.="                                                        THEN 'Итого'
                         //                                                                    ELSE 'Промежуточный итог'
                        //                                                                END) ".$tab_str[count($tab_str)-1]['sysname'].",";                
                    //}                        

                    if ($dbt=='mssql') {            
                        foreach ($tab_val as $m) {
                            $sql_unic_val.='ISNULL('.$mass['tab_str_itog_val'].'(ISNULL(['.$m['sysname']."],0)),0) [".$m['sysname']."],";
                        }
                    }
                    elseif ($dbt=='ora') {
                        foreach ($tab_val as $m) {
                            $sql_unic_val.='NVL('.$mass['tab_str_itog_val'].'(NVL("'.$m['sysname'].'",0)),0) "'.$m['sysname'].'",';
                        }
                    }
                    $sql_unic_val=substr($sql_unic_val, 0, -1);
                    if ($dbt=='mssql') { 
                        $sql_unic_val.=" FROM TAB GROUP BY ";                    
                        foreach ($tab_str as $m) {
                            $sql_unic_val.="[".$m['sysname']."],";
                        }
                    }
                    elseif ($dbt=='ora') {
                        $sql_unic_val.=" FROM TAB GROUP BY CUBE(";                    
                        foreach ($tab_str as $m) {
                            $sql_unic_val.="\"".$m['sysname']."\",";
                        }
                    }
                    if (count($tab_pok)>0) {
                        if ($dbt=='mssql') {
                            foreach ($tab_pok_cool as $m) {
                                $sql_unic_val.="[".$m['sysname']."],";
                            } 
                        }
                        elseif ($dbt=='ora') {
                            foreach ($tab_pok_cool as $m) {
                                $sql_unic_val.="\"".$m['sysname']."\",";
                            } 
                        }
                    }             
                    $sql_unic_val=substr($sql_unic_val, 0, -1);
                    if ($dbt=='mssql') {
                        $sql_unic_val.=" WITH CUBE HAVING (GROUPING([".$tab_str[count($tab_str)-1]['sysname']."])=1";
                        for ($i = 0; $i <= (count($tab_str)-2); $i++) {
                            $sql_unic_val.=" AND GROUPING([".$tab_str[$i]['sysname']."])=1 ";
                        }
                    }  
                    elseif ($dbt=='ora') {
                        $sql_unic_val.=") HAVING (GROUPING(\"".$tab_str[count($tab_str)-1]['sysname']."\")=1";
                        for ($i = 0; $i <= (count($tab_str)-2); $i++) {
                            $sql_unic_val.=" AND GROUPING(\"".$tab_str[$i]['sysname']."\")=1 ";
                        }
                    }
                    $sql_unic_val.=")";
                    //for ($i = 0; $i <= (count($tab_str)-2); $i++) {
                        //$sql_unic_val.=" OR GROUPING(".$tab_str[$i]['sysname'].")=1 ";
                    //}
                    //$sql_unic_val.=")";
                    if (count($tab_pok)>0) {
                        if ($dbt=='mssql') {
                            foreach ($tab_pok_cool as $m) {
                                $sql_unic_val.=" AND GROUPING([".$m['sysname']."])=0 ";
                            } 
                        }  
                        elseif ($dbt=='ora') {
                            foreach ($tab_pok_cool as $m) {
                                $sql_unic_val.=" AND GROUPING(\"".$m['sysname']."\")=0 ";
                            } 
                        }
                    }                         
                }
                if ($dbt=='mssql') {
                    $sql_unic_val.=" ORDER BY ";
                }
                elseif ($dbt=='ora') {
                    $sql_unic_val.=") ORDER BY ";
                }

                //для ИТОГов
                if ($mass['tab_str_itog_order']) {
                    if (count($tab_pok)>0) {
                        if ($dbt=='mssql') {
                            for ($i = 0; $i <= (count($tab_str)-2); $i++) {
                                $sql_unic_val.=$tab_str[$i]['sysname']."_GRPNG_,[".$tab_str[$i]['sysname']."],";
                            }
                            $sql_unic_val.=$tab_str[count($tab_str)-1]['sysname']."_GRPNG_,".$tab_str[count($tab_str)-1]['sysname']."_ITG_,";
                            foreach ($tab_pok_cool as $m) {
                                $sql_unic_val.=$m['sysname']."_GRPNG_,[".$m['sysname']."],";
                            }        
                        }  
                        elseif ($dbt=='ora') {
                            for ($i = 0; $i <= (count($tab_str)-2); $i++) {
                                $sql_unic_val.=$tab_str[$i]['sysname']."_GRPNG_,\"".$tab_str[$i]['sysname']."\",";
                            }
                            $sql_unic_val.=$tab_str[count($tab_str)-1]['sysname']."_GRPNG_,".$tab_str[count($tab_str)-1]['sysname']."_ITG_,";
                            foreach ($tab_pok_cool as $m) {
                                $sql_unic_val.=$m['sysname']."_GRPNG_,\"".$m['sysname']."\",";
                            }
                        }
                    }
                    else {
                        if ($dbt=='mssql') {
                            foreach ($tab_str as $m) {
                                $sql_unic_val.=$m['sysname']."_GRPNG_,[".$m['sysname']."],";
                            }    
                        }
                        elseif ($dbt=='ora') {
                            foreach ($tab_str as $m) {
                                $sql_unic_val.=$m['sysname']."_GRPNG_,\"".$m['sysname']."\",";
                            }
                        }
                    }
                }
                //не для итогов
                else {
                    if ($dbt=='mssql') {
                        foreach ($tab_str as $m) {
                            $sql_unic_val.="[".$m['sysname']."],";
                        }
                        if (count($tab_pok)>0) {
                            foreach ($tab_pok_cool as $m) {
                                $sql_unic_val.="[".$m['sysname']."],";
                            }        
                        } 
                    }  
                    elseif ($dbt=='ora') {
                        foreach ($tab_str as $m) {
                            $sql_unic_val.="\"".$m['sysname']."\",";
                        }
                        if (count($tab_pok)>0) {
                            foreach ($tab_pok_cool as $m) {
                                $sql_unic_val.="\"".$m['sysname']."\",";
                            }        
                        } 
                    }
                }
                if ($dbt=='mssql') {
                    foreach ($tab_val as $m) {
                        $sql_unic_val.="[".$m['sysname']."],";
                    }
                }
                elseif ($dbt=='ora') {
                    foreach ($tab_val as $m) {
                        $sql_unic_val.="\"".$m['sysname']."\",";
                    }
                }
                $sql_unic_val=substr($sql_unic_val, 0, -1);
                $data['sql_unic_val']=$sql_unic_val;
                if ($dbt=='mssql') {
                    $getRows = sqlsrv_query($conn, $sql_unic_val); 					
                    if(sqlsrv_has_rows($getRows)) {  
                        $i=1;
                        while( $rows_unic_val[$i] = sqlsrv_fetch_array( $getRows, SQLSRV_FETCH_ASSOC)) {
                            ++$i;                
                        }
                        $rowCount_unic_val =$i-1;
                        unset($rows_unic_val[$i]);
                        sqlsrv_free_stmt($getRows);
                    } 
                }  
                elseif ($dbt=='ora') {
                    $stid = oci_parse($conn, $sql_unic_val);
                    if ($stid) {
                        $r = oci_execute($stid);
                        if ($r) {
                            $i=0;
                            while ($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS+OCI_RETURN_LOBS)) {
                                //$rows_unic_val[++$i]=array_change_key_case($row);
                                $rows_unic_val[++$i]=$row;
                            }
                        }
                        else {
                            $e = oci_error($stid);
                            $data['$rows_unic_val_er']='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                        }
                        oci_free_statement($stid);
                        $rowCount_unic_val =$i;
                        unset($rows_unic_val[0]);//хз откуда берется
                    }
                    else {
                        $e = oci_error($conn);
                        $data['$rows_unic_val_er']='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                    }
                }
                $data['$rows_unic_val']=$rows_unic_val;
                $data['$rows_unic_val_true']=$rows_unic_val;
                $data['$rowCount_unic_val']=$rowCount_unic_val;

                //Построение таблицы
                $data['tab_html']='<tbody>';
                if (count($tab_pok)>0) {
                    //верхняя часть таблицы (шапка с показателями)            
                    //считаем максимальное количество комбинаций показателей*(кол-во значений показателей)
                    $max_count_pok=1;
                    foreach ($tab_pok_cool as $tpc) {
                        //если равняется нулю, то ничего не строим, неправильная структура
                        if ((int) $tpc['count']!==0) {
                            $max_count_pok*=$tpc['count'];
                        } 
                        else {
                            $data['pr_null']=778;
                            $data['pr_null_text']='Показатель "'.$tpc['sysname'].'" не имеет ни одного значения, пожалуйста удалите его из структуры или перенесите в другое измерение';
                            return json_encode($data);
                            break;
                        }
                    }
                    $max_count_pok*=count($tab_val);
                    $data['tab_html'].='<tr class="tr_pok null">';
                    $data['tab_html'].='    <td colspan="'.count($tab_str).'" class="null" rowspan="'.(count($tab_pok)*2+1).'"></td>';
                    $data['tab_html'].='</tr>';    
                    foreach ($tab_pok_cool as $key_tpc=>$val_tpc) {
                        $data['tab_html'].='<tr class="tr_pok" id="'.$val_tpc['sysname'].'">';
                        $data['tab_html'].='    <td class="td_pok_name" id="'.$val_tpc['sysname'].'" colspan="'.$max_count_pok.'">'.$val_tpc['name'].'</td>';                    
                        $data['tab_html'].='</tr>';
                        $data['tab_html'].='<tr class="tr_pok" id="'.$val_tpc['sysname'].'">';
                        $max_count_pok_one=1;
                        for ($i = ($key_tpc+1); $i <= count($tab_pok_cool); $i++) {
                            $max_count_pok_one*=$tab_pok_cool[$i]['count'];
                        }
                        $max_count_pok_one*=count($tab_val);
                        $max_count_pok_one_before=1;
                        for ($i = 1; $i <= ($key_tpc-1); $i++) {
                            $max_count_pok_one_before*=$tab_pok_cool[$i]['count'];
                        }                

                        $sql_unic_pok_cool_one="";
                        if ($dbt=='mssql') {
                            $sql_unic_pok_cool_one.="SET NOCOUNT ON;SET DATEFORMAT YMD;";
                        }
                        $sql_unic_pok_cool_one.="SELECT DISTINCT ".$val_tpc['sysname'].
                                               " FROM ".$tab_temp.
                                              " ORDER BY 1";
                        if ($dbt=='mssql') {
                            $getRows = sqlsrv_query($conn, $sql_unic_pok_cool_one); 					
                            if(sqlsrv_has_rows($getRows)) { 
                                $i=1;
                                while($rows_unic_pok_one[$i] = sqlsrv_fetch_array( $getRows, SQLSRV_FETCH_ASSOC)) {
                                    ++$i;
                                    //$data['tab_html'].='<td class="td_pok" id="'.$val_tpc['sysname'].'" colspan="'.$max_count_pok_one.'">'.$row[$val_tpc['sysname']].'</td>';                
                                }
                                unset($rows_unic_pok_one[$i]);
                                sqlsrv_free_stmt($getRows);
                            }
                        }  
                        elseif ($dbt=='ora') {
                            $stid = oci_parse($conn, $sql_unic_pok_cool_one);
                            if ($stid) {
                                $r = oci_execute($stid);
                                if ($r) {
                                    $i=0;
                                    while ($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS+OCI_RETURN_LOBS)) {
                                        //$rows_unic_pok_one[++$i]=array_change_key_case($row);
                                        $rows_unic_pok_one[++$i]=$row;
                                    }
                                }
                                else {
                                    $e = oci_error($stid);
                                    $data['$rows_unic_pok_one_er']='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                                }
                                oci_free_statement($stid);
                            }
                            else {
                                $e = oci_error($conn);
                                $data['$rows_unic_pok_one_er']='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                            }
                        }
                        $data['$rows_unic_pok_one']=$rows_unic_pok_one;

                        for ($i = 1; $i <= $max_count_pok_one_before; $i++) {
                            foreach ($rows_unic_pok_one as $mpok_ruo) {
                                $data['tab_html'].='<td class="td_pok" id="'.$val_tpc['sysname'].'" colspan="'.$max_count_pok_one.'">'.$mpok_ruo[$val_tpc['sysname']].'</td>';
                            }
                        }

                        $data['tab_html'].='</tr>';
                    }                         
                }

                //заголовки строк и значений показателей
                $data['tab_html'].='<tr class="tr_name_col">';
                foreach ($tab_str as $mstr) {
                    $data['tab_html'].='<td class="td_str_name" id="'.$mstr['sysname'].'">'
                                            .'<span><a class="tab_sort_up" id="'.$mstr['sysname'].'" title="Отсортировать по возрастанию">'
                                                . '<img src="/img/sort_up.png" style="width:7px;height:13px !important;">'
                                            . '</a></span>'
                                            .$mstr['name']
                                            .'<a class="tab_sort_unup" id="'.$mstr['sysname'].'" title="Отсортировать по убыванию">'
                                                . '<img src="/img/sort_unup.png" style="width:7px;height:13px !important;">'
                                            . '</a>  '
                                        .'</td>';
                }

                if (count($tab_pok)>0) {
                    for ($i = 1; $i <= ($max_count_pok/count($tab_val)); $i++) {
                        foreach ($tab_val as $mval) {
                            $data['tab_html'].='<td class="td_val_name" id="'.$mval['sysname'].'">'
                                                .'<a class="tab_sort_up" id="'.$mval['sysname'].'" title="Отсортировать по возрастанию">'
                                                    . '<img src="/img/sort_up.png" style="width:7px;height:13px !important;">'
                                                . '</a>'
                                                .$mval['name']
                                                .'<a class="tab_sort_unup" id="'.$mval['sysname'].'" title="Отсортировать по убыванию">'
                                                    . '<img src="/img/sort_unup.png" style="width:7px;height:13px !important;">'
                                                . '</a>  '
                                            .'</td>';
                        }
                    }                
                }
                else {            
                    foreach ($tab_val as $mval) {
                        $data['tab_html'].='<td class="td_val_name" id="'.$mval['sysname'].'">'
                                                .'<a class="tab_sort_up" id="'.$mval['sysname'].'" title="Отсортировать по возрастанию">'
                                                    . '<img src="/img/sort_up.png" style="width:7px;height:13px !important;">'
                                                . '</a>'
                                                .$mval['name']
                                                .'<a class="tab_sort_unup" id="'.$mval['sysname'].'" title="Отсортировать по убыванию">'
                                                    . '<img src="/img/sort_unup.png" style="width:7px;height:13px !important;">'
                                                . '</a>  '
                                            .'</td>';
                    }
                }
                $data['tab_html'].='</tr>';
                //заполнение таблицы
                $data['$rowCount_unic_val']=$rowCount_unic_val;        

                for ($i = 1; $i <= $rowCount_unic_val; $i++) {
                    $data_f=create_table_one_str($mass,$tab_str,$rows_unic_val,$tab_pok,$rows_unic_pok,$tab_val,$data['$rows_unic_val'],$i);
                    $data['$rows_unic_val']=$data_f['$rows_unic_val'];
                    $data['tab_html'].=$data_f['tab_html'];
                }
                $data['tab_html'].='</tr>';
                $data['tab_html'].='</tbody>';
            }    

            if ($dbt=='mssql') {
                sqlsrv_close($conn);
            }    
            elseif ($dbt=='ora') {
                oci_close($conn); 
                $data['drop_tab']=ora_drop_temp_tab($tab_temp);
            }          

        } 
    } 
    if (!$pr_flush) {
        echo json_encode($data);
    }    

?>