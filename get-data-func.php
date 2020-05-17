<!--Web-olap v1.0
Copyright 2020 Rassadnikov Evgeniy Alekseevich

This file is part of Web-olap.

Web-olap is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Web-olap is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Web-olap.  If not, see <https://www.gnu.org/licenses/>.-->
<?php
function db_type() {
    require_once(realpath('../classes/Connection.php'));
    return Connection::dbType;    
}

/*id Главной формы*/
function get_gen_form_id() {
    return 1;
}

function conndb($param=null) {
    require_once(realpath('../classes/Connection.php')); 
    return Connection::getConn($param);
}

function ora_create_params($stid,$params,$pr_p_sel=false) {
    foreach ($params as $key => $v) {
        oci_bind_by_name($stid, (($pr_p_sel) ? ':':'').$key, $params[$key]);
    }
}

function ora_create_params_out($stid,&$params,$pr_p_sel=false) {
    foreach ($params as $key => $v) {
        if (!empty($params[$key]['maxlength'])) {
            $maxlength=$params[$key]['maxlength'];
        }
        else {
            $maxlength=-1;
        }
        oci_bind_by_name($stid, (($pr_p_sel) ? ':':'').$key, $params[$key]['val'],$maxlength);
    }
}

function getRowsDB($conn,$tsql,$params) {
    function one_str($row) {
        $data='<tr>';	  
        foreach ($row as $key => $v) {
                $data.='<td id="'.$key.'">'.$v.'</td>';
        }
        $data.='</tr>';	
        return $data;
    }
    
    $data='';
    $dbt=db_type();
    if ($dbt=='mssql') {
        $getRows = sqlsrv_query($conn, $tsql,$params); 								
        if(sqlsrv_errors()!== false) {
            if(sqlsrv_has_rows($getRows)) {  
                while( $row = sqlsrv_fetch_array( $getRows, SQLSRV_FETCH_ASSOC)) {  
                    $data.=one_str($row);
                }  							
            }
        }
        else {
            $data.='Что-то пошло не так '.sqlsrv_errors();
        }
        sqlsrv_free_stmt($getRows);
        sqlsrv_close($conn);
    }
    elseif ($dbt=='ora') {
        $stid = oci_parse($conn, $tsql);
        if ($stid) {
            ora_create_params($stid,$params);
            $r = oci_execute($stid);
            if ($r) {
                while ($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS+OCI_RETURN_LOBS)) {
                    $data.=one_str($row);
                }
            }
            else {
                $e = oci_error($stid);
                $data.='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
            }
            oci_free_statement($stid);
        }
        else {
            $e = oci_error($conn);
            $data.='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
        }
        oci_close($conn);
    }
    return $data;	
}

function getRowsDivDB($conn,$tsql,$params) {
    function one_str_div($row) {
        $data='<div class="tbody d-tr">';	  
        foreach ($row as $key => $v) {
                $data.='<div class="d-td" id="'.$key.'">'.$v.'</div>';
        }
        $data.='</div>';	
        return $data;
    }
    
    $data='';
    $dbt=db_type();
    if ($dbt=='mssql') {
        $getRows = sqlsrv_query($conn, $tsql,$params); 
        if(sqlsrv_errors()!== false) {
            if(sqlsrv_has_rows($getRows)) {  
                while( $row = sqlsrv_fetch_array( $getRows, SQLSRV_FETCH_ASSOC)) {  
                    $data.=one_str_div($row);
                }  							
            }
        }
        else {
            $data.='Что-то пошло не так '.sqlsrv_errors();
        }
        sqlsrv_free_stmt($getRows);
        sqlsrv_close($conn);
    }
    elseif ($dbt=='ora') {
        $stid = oci_parse($conn, $tsql);
        if ($stid) {
            ora_create_params($stid,$params);
            $r = oci_execute($stid);
            if ($r) {
                while ($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS+OCI_RETURN_LOBS)) {
                    $data.=one_str_div($row);
                }
            }
            else {
                $e = oci_error($stid);
                $data.='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
            }
            oci_free_statement($stid);
        }
        else {
            $e = oci_error($conn);
            $data.='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
        }
        oci_close($conn);
    }
    return $data;	
}

function getRowsDB_conn_beg($mass) {
    $conn=conndb();
    $tsql=$mass['tsql'];
    if (empty($tsql)) {
        $tsql=$mass['sql_true'];
    }
    if ($mass['is_editor']) {
        $tsql=html_entity_decode($tsql,ENT_COMPAT|ENT_HTML401, 'UTF-8');
    }
    if ($mass['params_val']) {
        $params_val=json_decode($mass['params_val'],true);
        $dbt=db_type();
        if ($dbt=='mssql') {
            foreach($params_val as &$val) {
                $params_val_true[]=$val;
            }   
        }
        else {
            $params_val_true=$params_val;
        }
    } 
    $data['$conn']=$conn;
    $data['$tsql']=$tsql;
    $data['$params_val_true']=$params_val_true;
    return $data;    
}

function getRowsDB_conn($mass) {
    $beg=getRowsDB_conn_beg($mass);          
    return getRowsDB($beg['$conn'],$beg['$tsql'],$beg['$params_val_true']);
}

function getRowsDiv_DB_conn($mass) {
    $beg=getRowsDB_conn_beg($mass);
    return getRowsDivDB($beg['$conn'],$beg['$tsql'],$beg['$params_val_true']);
}

function get_md_param_sql($mass) {
    function one_str_md($row) {
        $data='<option value="'.$row['VAL'].'">'.$row['NAME'].'</option>';
        return $data;
    }
    
    $data='';
    $conn=conndb();
    $dbt=db_type();        
    if ($mass['params_val']) {
        $params_val=json_decode($mass['params_val'],true);
        if ($dbt=='mssql') {
            foreach($params_val as &$val) {
                $params_val_true[]=$val;
            }
        }else {
            $params_val_true=$params_val;
        }
    } 
    else {
        $params_val_true= array();
    }
    $sql_true=html_entity_decode($mass['sql_true'],ENT_COMPAT|ENT_HTML401, 'UTF-8');        
    if ($dbt=='mssql') {
        $getRows = sqlsrv_query($conn, $sql_true,$params_val_true); 								
        if(sqlsrv_has_rows($getRows)) {  
            $rowCount = sqlsrv_num_rows($getRows);  
            while( $row = sqlsrv_fetch_array( $getRows, SQLSRV_FETCH_ASSOC)) {  
                $data.=one_str_md($row);
            }  
            sqlsrv_free_stmt($getRows);
        }  
        else {
            $data.='<option value="-1">Отсутствуют подходящие значения</option>';
        }
        sqlsrv_close($conn);
    }
    elseif ($dbt=='ora') {
        $stid = oci_parse($conn, $sql_true);
        if ($stid) {
            ora_create_params($stid,$params_val_true,true);
            $r = oci_execute($stid);
            if ($r) {
                while ($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS+OCI_RETURN_LOBS)) {
                    $data.=one_str_md($row);
                }
                if ($data=='') {
                    $data.='<option value="-1">Отсутствуют подходящие значения</option>';
                }
            }
            else {
                $e = oci_error($stid);
                $data.='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
            }
            oci_free_statement($stid);
        }
        else {
            $e = oci_error($conn);
            $data.='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
        }
        oci_close($conn);
    }
    return $data;
}

function getSQLexec($mass) {
    if (!empty($mass['database'])) {
        require_once(realpath('../classes/Connection.php'));
        $con_param=Connection::get_DB_info($mass['database']);    
        $conn=conndb($con_param);
    }
    else {
        $conn=conndb();
    }  
    if ($conn) {
        $dbt=db_type();
        $tsql=html_entity_decode($mass['sql'],ENT_COMPAT|ENT_HTML401, 'UTF-8');
        if (!empty($mass['params_val_in'])) {
            $params_val=json_decode($mass['params_val_in'],true);
            if ($dbt=='mssql') {
                foreach($params_val as &$val) {
                    $params_val_true[]=$val;
                }
            }else {
                $params_val_true=$params_val;
            }
        } 
        else {
            $params_val_true= array();
        }
        if (!empty($mass['params_val_out'])) {
            $params_val=json_decode($mass['params_val_out'],true);
            if ($dbt=='mssql') {
                foreach($params_val as &$val) {
                    $params_val_out_true[]=$val;
                }
            }else {
                $params_val_out_true=$params_val;
            }
        } 
        else {
            $params_val_out_true= array();
        }

        if ($dbt=='mssql') {
            $stmt=sqlsrv_prepare($conn, $tsql,$params_val_true);					 
            if (sqlsrv_execute($stmt)) {  
                    $data['ex_state']="Успех";  
            }  
            else {  
                    $data['ex_state']="Error in executing statement.\n".sqlsrv_errors();  				 
            }  
            sqlsrv_free_stmt($stmt); 
            sqlsrv_close($conn);
        }
        elseif ($dbt=='ora') {
            $stid = oci_parse($conn, $tsql);
            if ($stid) {
                ora_create_params($stid,$params_val_true);
                ora_create_params_out($stid,$params_val_out_true);
                $r = oci_execute($stid);
                if ($r) {
                    $data['ex_state']="Успех"; 
                    if (count($params_val_out_true)>0) {
                        $data['param_out']=$params_val_out_true;
                    }
                }
                else {
                    $e = oci_error($stid);
                    $data['ex_state']='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                }
                oci_free_statement($stid);
            }
            else {
                $e = oci_error($conn);
                $data['ex_state']='Что-то пошло не так, не парсится '.htmlentities($e['message'], ENT_QUOTES);
            }
            oci_close($conn);
        } 
    }
    else {
        $data['ex_state']='Нет конекта';
    }
    return json_encode($data);
}
	
function overall1() {
            $data='';
            set_time_limit(10000);
            $conn=conndb();
            if($conn) {  
                    $tsql = "SET NOCOUNT ON;SET DATEFORMAT YMD;
                                EXEC RK7SQLPROCOVERALL1;";  

                    $data.=getRowsDB($conn,$tsql,array());
                    sqlsrv_close($conn);
            }  
            else {  
                     $data.= '<h1 id="header">Connection could not be established.\n</h1>';  
                     $data.=sqlsrv_errors(); 
            } 
            return $data;
}

function vector_date()	{
        $data='';
        set_time_limit(1000);
        $conn=conndb();
        if($conn) {  
                $tsql = "SELECT DISTINCT TOP 10
                                           DATENAME(M,GS.SHIFTDATE) MONTH_NAME, 
                                           GS.IRESTAURANT,
                                           MONTH(GS.SHIFTDATE) MONTH_NUM,
                                           YEAR(GS.SHIFTDATE) MONTH_YEAR 
                                FROM GLOBALSHIFTS GS 
                                WHERE CLOSED = 1 
                                ORDER BY YEAR(GS.SHIFTDATE) DESC,MONTH(GS.SHIFTDATE) DESC";  
                $getRows = sqlsrv_query($conn, $tsql); 					
                if(sqlsrv_has_rows($getRows)) {  
                        $data.='<div id="month_group">';
                        $rowCount = sqlsrv_num_rows($getRows);  
                        while( $row = sqlsrv_fetch_array( $getRows, SQLSRV_FETCH_ASSOC)) {  
                                $data.='<div id="'.$row['MONTH_NUM'].'_'.$row['MONTH_YEAR'].'" class="month">
                                                        <a month="'.$row['MONTH_NUM'].'" year="'.$row['MONTH_YEAR'].'" class="a_month">
                                                                <img src="/img/plus_n.png" width=13 height=13 style="margin-right:0.5%" id="plus_'.$row['MONTH_NUM'].'_'.$row['MONTH_YEAR'].'">'.$row['MONTH_NAME'].' '.$row['MONTH_YEAR'].'									
                                                        </a>
                                                </div>';					
                        }
                        $data.='</div>';	
                }  
                else {
                        $data.='Что-то пошло не так '.sqlsrv_errors();
                }
                sqlsrv_free_stmt($getRows);
                sqlsrv_close($conn);
        }  
        else {  
                 $data.= '<h1 id="header">Connection could not be established.\n</h1>';  
                 $data.=sqlsrv_errors(); 
        }
        return $data;
}

function overall13($month,$year,$cid) {
        $data='';
        set_time_limit(1000);
        $conn=conndb();
        if($conn) {  
                $tsql = "SET NOCOUNT ON;SET DATEFORMAT YMD;
                            EXEC RK7SQLPROCOVERALL3 ?,?,".$cid.";";  
                $params=array($month,$year);		
                $data.=getRowsDB($conn,$tsql,$params);
                sqlsrv_close($conn);
        }  
        else {  
                 $data.= '<h1 id="header">Connection could not be established.\n</h1>';  
                 $data.=sqlsrv_errors(); 
        } 
        return $data;
}

function overall13_v($month,$year) {
        $data='';
        set_time_limit(1000);
        $conn=conndb();
        if($conn) {  
                $tsql = "SET NOCOUNT ON;SET DATEFORMAT YMD;
                            EXEC RK7SQLPROCOVERALL3_V ?,?;";  
                $data.=getRowsDB($conn,$tsql,array($month,$year));
                sqlsrv_close($conn);
        }  
        else {  
                 $data.= '<h1 id="header">Connection could not be established.\n</h1>';  
                 $data.=sqlsrv_errors(); 
        } 
        return $data;
}

function get_rep_set($rep_id,$set) {
        $conn=conndb();
        $dbt=db_type(); 
        if($conn) {                          
            if ($dbt=='mssql') {
                $tsql = "SELECT V.VALUE
                            FROM REP_DATA_SET_VALUE V
                            JOIN REP_DATA_SET S ON S.ID=V.SET_ID AND S.SYSNAME=?
                            JOIN REP_DATA R ON R.ID=S.REP_ID
                           WHERE S.REP_ID=?"; 
                $getRows = sqlsrv_query($conn, $tsql,array(&$set,&$rep_id)); 					
                if(sqlsrv_has_rows($getRows)) {  
                        $rowCount = sqlsrv_num_rows($getRows);  
                        $data = sqlsrv_fetch_array( $getRows, SQLSRV_FETCH_ASSOC);
                }  
                else {
                        $data='Что-то пошло не так '.sqlsrv_errors();
                }
                sqlsrv_free_stmt($getRows);
                sqlsrv_close($conn);
            } 
            elseif ($dbt=='ora') {
                $tsql = "SELECT V.VALUE
                            FROM REP_DATA_SET_VALUE V
                            JOIN REP_DATA_SET S ON S.ID=V.SET_ID AND S.SYSNAME=:sysname
                            JOIN REP_DATA R ON R.ID=S.REP_ID
                           WHERE S.REP_ID=:rep_id"; 
                $stid = oci_parse($conn, $tsql);
                if ($stid) {
                    $params[':sysname']=$set;
                    $params[':rep_id']=$rep_id;
                    ora_create_params($stid,$params);
                    $r = oci_execute($stid);
                    if ($r) {
                        $row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS+OCI_RETURN_LOBS);
                    }
                    else {
                        $e = oci_error($stid);
                        $data.='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                    }
                    oci_free_statement($stid);
                }
                else {
                    $e = oci_error($conn);
                    $data.='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                }
                oci_close($conn);
            }
        }  
        else {  
            $data= '<h1 id="header">Connection could not be established.\n</h1>';  
            //$data.=sqlsrv_errors(); 
        }
        return $data['VALUE'];
}

function save_rep_set($mass) {
        $conn=conndb();
        $dbt=db_type(); 
        if($conn) {  
            if ($dbt=='mssql') {
                $tsql="UPDATE REP_DATA_SET_VALUE 
                        SET VALUE=?
                      WHERE SET_ID=(SELECT S.ID
                                      FROM REP_DATA_SET S 
                                      JOIN REP_DATA R ON R.ID=S.REP_ID
                                 WHERE S.SYSNAME=?
                                       AND S.REP_ID=? 
                               )";
                $stmt=sqlsrv_prepare($conn, $tsql, array(&$mass['value'],&$mass['set'],&$mass['rep']));					 
                if (sqlsrv_execute($stmt)) {  
                    $data="Успех";  
                }  
                else {  
                    $data="Error in executing statement.\n".sqlsrv_errors();  				 
                }  
                sqlsrv_free_stmt($stmt);
                sqlsrv_close($conn);
            } 
            elseif ($dbt=='ora') {
                $tsql="UPDATE REP_DATA_SET_VALUE 
                        SET VALUE=:value
                      WHERE SET_ID=(SELECT S.ID
                                      FROM REP_DATA_SET S 
                                      JOIN REP_DATA R ON R.ID=S.REP_ID
                                     WHERE S.SYSNAME=:sysname
                                       AND S.REP_ID=:rep_id
                                    )";
                $stid = oci_parse($conn, $tsql);
                if ($stid) {
                    $params[':value']=$mass['value'];
                    $params[':sysname']=$mass['set'];
                    $params[':rep_id']=$mass['rep'];
                    ora_create_params($stid,$params);
                    $r = oci_execute($stid);
                    if ($r) {
                        $data="Успех"; 
                    }
                    else {
                        $e = oci_error($stid);
                        $data.='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                    }
                    oci_free_statement($stid);
                }
                else {
                    $e = oci_error($conn);
                    $data.='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                }
                oci_close($conn);
            }
        }  
        else {  
            $data= '<h1 id="header">Connection could not be established.\n</h1>';  
            //$data.=sqlsrv_errors(); 
        }
        return	$data;
}

function get_rep_tab($repid) {
        $data='';
        $conn=conndb();
        $dbt=db_type(); 
        if($conn) {  
            if ($dbt=='mssql') {
                $tsql = "SELECT T.ID,T.NAME,T.SYSNAME,T.SQL,T.MDATA,T.PARAMS
                                  FROM REP_DATA_TABLE T					 
                                  JOIN REP_DATA R ON R.ID=T.REP_ID
                                 WHERE T.REP_ID=?";  
                $getRows = sqlsrv_query($conn, $tsql,array(&$repid)); 					
                if(sqlsrv_has_rows($getRows)) {  
                        $rowCount = sqlsrv_num_rows($getRows);  
                        while( $row = sqlsrv_fetch_array( $getRows, SQLSRV_FETCH_ASSOC)) {                                        
                                $data.='<div id="'.$row['ID'].'" class="f r_table">								
                                            <div id="'.$row['ID'].'" class="masterdata">';
                                if ($row['MDATA']) {
                                    $data.=$row['MDATA'];
                                }
                                else {
                                    if ($row['SQL']) {
                                        $sql_true_v=strip_tags($row['SQL']);
                                        $data.=get_strukture_sql($row['SQL'],$sql_true_v,$row['ID'],null);
                                    }
                                }
                                $data.='    </div>
                                            <div id="'.$row['ID'].'" class="params_group">';
                                if ($row['PARAMS']) {
                                    $data.=$row['PARAMS'];
                                }
                                $data.='    </div>    
                                            <div id="'.$row['ID'].'" style="text-align: left;" class="table_panel">	
                                                    <a id="'.$row['ID'].'" title="Редактировать структуру отчета" class="table_active">
                                                            <img src="/img/edit_tab.png" width=40 height="auto">
                                                    </a>
                                                    <a id="'.$row['ID'].'" title="Запустить отчет" class="table_play">
                                                            <img src="/img/play_tab.png" width=40 height="auto">
                                                    </a>
                                            </div>
                                            <table class="rep_tab" id="'.$row['ID'].'" border="1" >                                                                    
                                            </table>			
                                        </div>';					
                        }
                        //$data.='</div>';	
                }  
                else {
                        $data.='Что-то пошло не так '.sqlsrv_errors();
                }
                sqlsrv_free_stmt($getRows);
                sqlsrv_close($conn);
            }    
        }  
        else {  
            $data.= '<h1 id="header">Connection could not be established.\n</h1>';  
            //$data.=sqlsrv_errors(); 
        }
        return	$data; 
}

function get_strukture_sql_in_modal($params) {
    function one_str_ssim($name) {
        $data='<div class="d-tr" id="'.$name.'">
                    <div class="SYSNAME d-td" id="'.$name.'">'.$name.'</div> 														
                    <div class="NAME d-td" id="'.$name.'" style="padding:0;"><input type="text" style="margin:0" class="tab_pol_nam_val" placeholder="Введите отображаемое имя"></div>
                    <div class="UNVISIBLE d-td" id="'.$name.'" style="padding:0;text-align: center;"><input type="checkbox" style="margin:0" class="tab_pol_unvis" placeholder="Скрыть поле"></div>
                    <div class="WIDTH d-td" id="'.$name.'" style="padding:0;"><input type="text" style="margin:0" class="tab_pol_width" placeholder="Введите ширину поля"></div>
                </div>';	
        return $data;
    }
    $data='';
    $conn=conndb();
    $dbt=db_type(); 
    if($conn) {  
        $params_m=null;
        if (!empty($params['params'])) {
            $params_m=json_decode($params['params'],true);        
        }
        $sql_true_p=html_entity_decode($params['sql_true'],ENT_COMPAT|ENT_HTML401, 'UTF-8');          
        if ($dbt=='mssql') {
            if ($stmt3 = sqlsrv_prepare( $conn, $sql_true_p)) {
                if (sqlsrv_field_metadata($stmt3)) {
                    foreach( sqlsrv_field_metadata($stmt3) as $fieldMetadata) {  
                        $data.=one_str_ssim($fieldMetadata['Name']);
                    }
                }    
                else {
                    $data.='<div class="d-tr">
                            <div class="SYSNAME d-td" id="_no_str_">Не удалось разобрать SQL-запрос</div> 														
                            <div class="NAME d-td"></div>	
                        </div>';
                }    
                sqlsrv_free_stmt( $stmt3);
            }
            else {
                $data.='<div class="d-tr">
                            <div class="SYSNAME d-td" id="_no_str_">Не удалось разобрать SQL-запрос</div> 														
                            <div class="NAME d-td"></div>	
                        </div>';
            }
            sqlsrv_close($conn);
        }
        elseif ($dbt=='ora') {
            $stid = oci_parse($conn, $sql_true_p);
            if ($stid) {
                ora_create_params($stid,$params_m,true);
                $r = oci_execute($stid, OCI_DESCRIBE_ONLY);
                if ($r) {
                    $ncols = oci_num_fields($stid);
                    for ($i = 1; $i <= $ncols; $i++) {
                        $column_name  = oci_field_name($stid, $i);
                        $data.=one_str_ssim($column_name);
                    } 
                }
                else {
                    $e = oci_error($stid);
                    $data.='<div class="d-tr">
                            <div class="SYSNAME d-td" id="_no_str_">Не удалось разобрать SQL-запрос. '.htmlentities($e['message'], ENT_QUOTES).'</div> 														
                            <div class="NAME d-td"></div>	
                        </div>';
                }
                oci_free_statement($stid);
            }
            else {
                $e = oci_error($conn);
                $data.='<div class="d-tr">
                            <div class="SYSNAME d-td" id="_no_str_">Не удалось разобрать SQL-запрос. '.htmlentities($e['message'], ENT_QUOTES).'</div> 														
                            <div class="NAME d-td"></div>	
                        </div>';
            }
            oci_close($conn);
        }
    }  
    else {  
        $data.= '<h1 id="header">Connection could not be established.\n</h1>';  
        //$data.=sqlsrv_errors(); 
    }
    return $data;
}

function get_strukture_sql($sql,$sql_true,$id_v,$params,$params_olap,$sql_lz) {
    $data='';
    $conn=conndb();
    $dbt=db_type();
    if($conn) { 
        $params_m=null;
        $params_olap_m=null;
        $params_m_dop=null;
        if ($params) {
            $params_m=json_decode($params,true);
            if ($dbt=='ora') {
                foreach ($params_m as $m) {
                    $params_m_dop[':'.$m]=null;
                }
            }
        }
        if ($params_olap) {
            $params_olap_m=json_decode($params_olap,true);  
            $params_olap_m=array_unique($params_olap_m);
        }
        $sql_true_p=html_entity_decode($sql_true,ENT_COMPAT|ENT_HTML401, 'UTF-8');
        $data='<div class="md_panel_es">
                <a class="md_save" id="'.$id_v.'" title="Сохранить структуру" style="z-index: 500000;">
                    <img src="/img/save.png" width=30 height="auto">
                </a>
                </div>
                <div id="'.$id_v.'" class="sql_value">'
                    .$sql_lz.
               '</div>';
        
        if ($params_olap_m) {            
            $data.='<div id="'.$id_v.'" class="params d-table" style="margin:auto auto 5px auto;width:auto;">
                        <div class="d-tr">
                            <div class="d-td" style="font-size:12pt;font-weight:bold;">Параметры запроса</div>													
                        </div>
                        <div class="d-tr">
                                <div class="d-td" style="padding:0;">
                                        <div class="d-table">
                                                <div class="d-tr">
                                                    <div id="null" class="d-td" style="font-size:10pt;font-weight:bold;">Сис. наименование</div>
                                                    <div id="null" class="d-td" style="font-size:10pt;font-weight:bold;">Наименование</div>
                                                    <div id="null" class="d-td" style="font-size:10pt;font-weight:bold;">Тип</div>
                                                    <div id="null" class="d-td" style="font-size:10pt;font-weight:bold;width:auto;padding:5px;min-width: 0;">Мультивыбор</div>
                                                    <div id="null" class="d-td" style="font-size:10pt;font-weight:bold;width:auto;padding:5px;min-width: 0;">Обязательность</div>
                                                    <div id="null" class="d-td" style="font-size:10pt;font-weight:bold;width:auto;padding:5px;min-width: 50px;">SQL</div>
                                                </div>';
            foreach ($params_olap_m as $m) {
            $data.='                            <div class="tr_params d-tr" id="'.$m.'">
                                                    <div id="'.$m.'" class="SYSNAME d-td">'.$m.'</div>
                                                    <div id="'.$m.'" class="NAME d-td" style="padding:0;"><input id="'.$m.'" type="text" style="margin:0;" class="in_param_name" placeholder="Введите отображаемое имя"></div>
                                                    <div id="'.$m.'" class="TYPE d-td" style="padding:0;">
                                                       <select  class="sel_param_type" id="'.$m.'" title="Выберите тип поля" style="margin:0;">
                                                            <option selected value="text">Строка</option>
                                                            <option value="number">Число</option>
                                                            <option value="date">Дата</option>
                                                            <option value="datetime">Дата время</option>
                                                            <option value="checkbox">Логическое</option>
                                                            <option value="time">Время</option>
                                                            <option value="tel">Телефон</option>
                                                            <option value="email">E-mail</option>
                                                        </select>
                                                    </div>
                                                    <div id="'.$m.'" class="MULTI d-td" style="text-align:center;min-width: 0;"><input type="checkbox" id="'.$m.'" class="in_param_multi" value="Да"></div>
                                                    <div id="'.$m.'" class="REQUIRED d-td" style="text-align:center;min-width: 0;"><input type="checkbox" id="'.$m.'" class="in_param_req" value="required" style="margin:0 0 0 5px;"></div>
                                                    <div id="'.$m.'" class="SQL d-td" style="text-align:center;min-width: 0;">
                                                        <a class="a_param_sql_edite" id="'.$id_v.'" id_param="'.$m.'" title="Редактировать SQL-запрос" style="margin:0;">
                                                            <img src="/img/edit_sql.png" width=25 height="auto">
                                                        </a>
                                                        <div class="params_sql" id="'.$id_v.'" id_param="'.$m.'"></div>
                                                    </div>
                                                </div>';
            }
            $data.='                    </div>
                                </div>
                        </div>    
                    </div>';
        }

        $data.='<ul class="ul_cons top-level" action_type="olap" style="margin:5px 0 5px 0;">'.
                    '<li id="'.$id_v.'" class="md_sql_edit li_cons li_cons_top" style="background: none;" action_type="olap">'.
                         '<a id="'.$id_v.'" title="Редактировать SQL-запрос для таблицы" class="md_sql_edit" action_type="olap">'. 
                            '<img src="/img/edit_sql.png" style="width:auto;height:30px;">'.
                         '</a>'.
                     '</li>'.
                     '<li id="'.$id_v.'" class="md_struct_load li_cons li_cons_top" style="background: none;" action_type="olap">'.
                          '<a id="'.$id_v.'" title="Загрузить структуру из другого отчета" class="md_struct_load" action_type="olap">
                                <img src="/img/download.png" style="width:auto;height:30px;">
                            </a>'.
                     '</li>'.      
                     '<li id="'.$id_v.'" class="md_struct_unload li_cons li_cons_top" style="background: none;" action_type="olap">'.
                          '<a id="'.$id_v.'" title="Выгрузить структуру в репозиторий" class="md_struct_unload" action_type="olap">
                                <img src="/img/unload.png" style="width:auto;height:30px;">
                            </a>'.
                     '</li>'. 
                     '<li id="'.$id_v.'" class="description li_cons li_cons_top" style="background: none;" action_type="olap">'.
                          '<a id="'.$id_v.'" title="Описание элемента" class="description" action_type="olap">
                                <img src="/img/descripe.png" style="width:auto;height:30px;">                                                   
                            </a>'. 
                            '<div class="div_hidden"></div>'. 
                     '</li>'.
                    '<li id="'.$id_v.'" class="2D_3D li_cons li_cons_top" style="background: none;" action_type="olap">'.
                          '<a id="'.$id_v.'" title="Переключение в режим 2D/3D" class="2D_3D" action_type="olap">
                                <img src="/img/2d_3d.png" style="width:auto;height:30px;">                                                    
                            </a>'.
                           '<div class="div_hidden"></div>'.
                     '</li>'.                     
                     '<li id="'.$id_v.'" class="action_set_table li_cons li_cons_top" style="background: none;" action_type="olap">'.
                          '<a id="'.$id_v.'" title="Настройка действий с таблицей" class="action_set_table" action_type="olap">
                                <img src="/img/actions_set.png" style="width:auto;height:30px;">                                                   
                            </a>'.
                            '<div class="div_hidden action_set_table_v">
                                    <div id="'.$id_v.'" class="tab_action_add_md">
                                        <div class="md_panel_es">
                                            <a class="md_back" md_id="'.$id_v.'" title="Назад" id="md_action_set_table_back" style="display: inline;z-index: 500000;">
                                                <img src="/img/Back.png" style="width:30px;height:auto;">
                                             </a>
                                            <a class="tab_action_add_md_save" id="'.$id_v.'" title="Сохранить структуру" style="z-index: 500000;">
                                                <img src="/img/save.png" style="width:auto;height:30px;">
                                            </a>
                                        </div>
                                        <div class="dt_tab_action d-table" style="display: inline;">
                                            <div class="d-tr">
                                                <div class="d-td" style="font-size:12pt;font-weight:bold;"><a class="taa_add"><img src="/img/add.png" title="Добавить действие" style="height:27px;width:auto;display:inline-block;margin:3px;"></a><a class="taa_del"><img src="/img/rep_del.png" title="Удалить действие" style="height:27px;width:auto;display:inline-block;margin:3px;"></a> Список действий</div>
                                            </div>
                                            <div class="d-td" style="padding:0;">
                                                <div class="d-table" id="tab_taa_value">
                                                    <div class="d-tr" id="after_append">
                                                        <div class="d-td" style="font-size:11pt;font-weight:bold;">Сис.имя</div>
                                                        <div class="d-td" style="font-size:11pt;font-weight:bold;">Наименование</div>
                                                        <div class="d-td" style="font-size:11pt;font-weight:bold;min-width:130px;">Тип действия</div>
                                                        <div class="d-td" style="font-size:11pt;font-weight:bold;min-width:110px;">Доп.действия</div>
                                                    </div>
                                                    <div class="d-tr default">
                                                        <div class="SYSNAME d-td">add</div>
                                                        <div class="NAME d-td">Добавить</div>
                                                        <div class="TYPE d-td" style="min-width:100px;">
                                                            Операция
                                                        </div>
                                                        <div class="TAA_DOP d-td" style="text-align:center;min-width: 0;">
                                                            <a class="a_taa_sql_edite" title="Редактировать SQL-запрос" style="margin:0;">
                                                                <img src="/img/edit_sql.png" width=25 height="auto">
                                                            </a>
                                                            <div class="div_hidden taa_sql_v"></div>
                                                            <a class="a_taa_polya" title="Редактировать поля для действий" style="z-index: 500000;">
                                                                <img src="/img/edite_edite.png" style="width:auto;height:24px;">                                                
                                                            </a>
                                                            <div class="div_hidden taa_polya_v"></div>
                                                        </div>
                                                    </div>
                                                    <div class="d-tr default">
                                                        <div class="SYSNAME d-td">edit</div>
                                                        <div class="NAME d-td">Редактировать</div>
                                                        <div class="TYPE d-td" style="min-width:100px;">
                                                            Операция
                                                         </div>
                                                        <div class="TAA_DOP d-td" style="text-align:center;min-width: 0;">
                                                            <a class="a_taa_sql_edite" title="Редактировать SQL-запрос" style="margin:0;">
                                                                <img src="/img/edit_sql.png" width=25 height="auto">
                                                            </a>
                                                            <div class="div_hidden taa_sql_v"></div>
                                                            <a class="a_taa_polya" title="Редактировать поля для действий" style="z-index: 500000;">
                                                                <img src="/img/edite_edite.png" style="width:auto;height:24px;">                                                
                                                            </a>
                                                            <div class="div_hidden taa_polya_v"></div>
                                                        </div>
                                                    </div>
                                                    <div class="d-tr default">
                                                        <div class="SYSNAME d-td">delete</div>
                                                        <div class="NAME d-td">Удалить</div>
                                                        <div class="TYPE d-td" style="min-width:100px;">
                                                            Операция
                                                         </div>
                                                        <div class="TAA_DOP d-td" style="text-align:center;min-width: 0;">
                                                            <a class="a_taa_sql_edite" title="Редактировать SQL-запрос" style="margin:0;">
                                                                <img src="/img/edit_sql.png" width=25 height="auto">
                                                            </a>
                                                            <div class="div_hidden taa_sql_v"></div>
                                                        </div>
                                                    </div>
                                                    <div class="d-tr default">
                                                        <div class="SYSNAME d-td">search</div>
                                                        <div class="NAME d-td">Поиск</div>
                                                        <div class="TYPE d-td" style="min-width:100px;">
                                                            Операция
                                                         </div>
                                                        <div class="TAA_DOP d-td" style="text-align:center;min-width: 0;">
                                                            <input type="checkbox" class="in_taa_search" title="Отображать">
                                                        </div>
                                                    </div>
                                                    <div class="d-tr default">
                                                        <div class="SYSNAME d-td">graf</div>
                                                        <div class="NAME d-td">3D-график</div>
                                                        <div class="TYPE d-td" style="min-width:100px;">
                                                            Операция
                                                         </div>
                                                        <div class="TAA_DOP d-td" style="text-align:center;min-width: 0;">
                                                            <input type="checkbox" class="in_taa_graf" title="Отображать">
                                                        </div>
                                                    </div>
                                                    <div class="d-tr default">
                                                        <div class="SYSNAME d-td">export_xlsx</div>
                                                        <div class="NAME d-td">Выгрузить в XLSX</div>
                                                        <div class="TYPE d-td" style="min-width:100px;">
                                                            Операция
                                                         </div>
                                                        <div class="TAA_DOP d-td" style="text-align:center;min-width: 0;">
                                                            <input type="checkbox" class="in_taa_exlsx" title="Отображать">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>                                        
                                    </div>
                                </div>'.
                     '</li>'.
                     '<li id="'.$id_v.'" class="action li_cons li_cons_top" style="background: none;" action_type="olap"><img src="/img/actions.png" style="height:27px;width:auto;"title="Действия">'.
                         '<ul class="ul_cons second-level" style="width: 250px;text-align: left;border: 1px solid #008000;border-radius: 0 0 10px 10px;" action_type="olap">'.
                             '<li id="none" class="li_cons" title="Отсутствует" style="height: 20px;width: 250px;color: white;background: #d1ffff;border-bottom-color: white;"  action_type="olap" pr_change_style>'.                                   
                                 '<a id="none" class="action_one" style="margin:0 5px 0 auto;float:left;display:iline-block;" action_type="olap">'.
                                     'Отсутствует'.
                                 '</a>'.
                             '</li>'.
                             '<li id="after_load_data" class="li_cons" title="Действие после загрузки данных" style="height: 20px;width: 250px;" action_type="olap">'.
                                 '<a id="after_load_data" title="Действие после загрузки данных" class="action_one" action_type="olap">
                                     Действие после загрузки данных                                    
                                </a>'.
                                '<div class="div_hidden after_load_data_v"></div>'.
                                 '<a id="after_load_data" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="olap">'.
                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">'.                                     
                                 '</a>'.
                                 '<div class="div_hidden_desc after_load_data_d"></div>'.
                             '</li>'.
                             '<li id="before_load_data" class="li_cons" title="Действие до загрузки данных" style="height: 20px;width: 250px;" action_type="olap">'.
                                 '<a id="after_load_data" title="Действие до загрузки данных" style="display: inline" class="action_one" action_type="olap">
                                    Действие до загрузки данных                                    
                                </a>'.
                                '<div class="div_hidden before_load_data_v"></div>'.
                                 '<a id="before_load_data" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="olap">'.
                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">'.                                     
                                 '</a>'.
                                 '<div class="div_hidden_desc before_load_data_d"></div>'.
                             '</li>'.
                             '<li id="tr_click" class="li_cons" title="Клик по строке" style="height: 20px;width: 250px;" action_type="olap">'.
                                 '<a id="tr_click" title="Клик по строке" style="display: inline" class="action_one" action_type="olap">
                                    Клик по строке                                    
                                </a>'.
                                '<div class="div_hidden tr_click_v"></div>'.
                                 '<a id="tr_click" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="olap">'.
                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">'.                                     
                                 '</a>'.
                                 '<div class="div_hidden_desc tr_click_d"></div>'.
                             '</li>'.
                             '<li id="tr_dclick" class="li_cons" title="ДКлик по строке" style="height: 20px;width: 250px;" action_type="olap">'.
                                 '<a id="tr_dclick" title="Двойной клик по строке" style="display: inline" class="action_one" action_type="olap">
                                    ДКлик по строке                                    
                                </a>'.
                                '<div class="div_hidden tr_dclick_v"></div>'.
                                 '<a id="tr_dclick" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="olap">'.
                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">'.                                     
                                 '</a>'.
                                 '<div class="div_hidden_desc tr_dclick_d"></div>'.
                             '</li>'.
                             '<li id="freedom_action" class="li_cons" title="Свободные действия" style="height: 20px;width: 250px; border-radius: 0px 0px 10px 10px; border-bottom-color: white;" action_type="olap">'.
                                 '<a id="freedom_action" title="Свободные действия" style="display: inline" class="action_one" action_type="olap">
                                    Свободные действия                                   
                                </a>'.
                                '<div class="div_hidden freedom_action_v"></div>'.
                                 '<a id="freedom_action" class="action_one_desc" style="margin:0 5px 0 auto;float:right;display:iline-block;" action_type="olap">'.
                                     '<img src="/img/descripe.png" style="width:auto;height:18px;" title="Описание действия">'.                                     
                                 '</a>'.
                                 '<div class="div_hidden_desc freedom_action_d"></div>'.
                             '</li>'.
                        '</ul>'
                    . '</li>'
              . '</ul>                                                                                                                                                                   
                
                <div class="polya d-table" style="display: inline;">
                    <div class="d-tr">
                        <div class="d-td" style="font-size:12pt;font-weight:bold;">Список полей</div>													
                    </div
                    <div class="d-tr">
                            <div class="d-td" style="padding:0;">
                                    <div class="d-table" id="tab_pol">
                                            <div class="d-tr" id="after_append">
                                                    <div class="d-td" style="font-size:11pt;font-weight:bold;">Сис.имя</div>
                                                    <div class="d-td" style="font-size:11pt;font-weight:bold;">Наименование</div>	
                                            </div>';
        $data.='                            <div class="d-tr" id="_itogo_"   
                                                        ondragenter="return dragEnter(event)" 
                                                        ondrop="return dragDrop(event)" 
                                                        ondragover="return dragOver(event)">

                                                <div class="ITOGO_NAME d-td" id="_itogo_" draggable="true" ondragstart="return dragStart(event)" style="font-size: 10pt;font-weight:bold;">Итого</div> 														
                                                <div class="ITOGO_VAL d-td" id="'.$id_v.'" style="padding:0;">
                                                    <select  class="sel_itogo" id="'.$id_v.'" title="Выберите вариант подсчета итого" style="margin:0;">
                                                        <option selected value="MAX">Максимум</option>
                                                        <option value="MIN">Минимум</option>
                                                        <option value="SUM">Сумма</option>
                                                        <option value="AVG">Среднее значение</option>
                                                        <option value="COUNT">Количество</option>
                                                    </select>
                                                </div>	
                                            </div>';
        
        function one_str_fm($fieldMetadata) {
            return '<div class="d-tr" id="'.$fieldMetadata['Name'].'"   
                                            ondragenter="return dragEnter(event)" 
                                            ondrop="return dragDrop(event)" 
                                            ondragover="return dragOver(event)">

                        <div class="SYSNAME d-td" id="'.$fieldMetadata['Name'].'" draggable="true" ondragstart="return dragStart(event)"'.
                            ' md_type="'.$fieldMetadata['Type'].'" md_precision="'.$fieldMetadata['Precision'].'" md_scale="'.$fieldMetadata['Scale'].'" md_nullable="'.$fieldMetadata['Nullable'].'"'
                     . '>'.$fieldMetadata['Name'].'</div> 														
                        <div class="NAME d-td" id="'.$fieldMetadata['Name'].'" style="padding:0;"><input type="text" style="margin:0" class="tab_pol_nam_val" placeholder="Введите отображаемое имя"></div>	
                    </div>';
        }
        
        function get_null($txt='') {
            return '<div class="d-tr">
                        <div class="SYSNAME d-td" id="_no_str_">Не удалось разобрать SQL-запрос. '.$txt.'</div> 														
                        <div class="NAME d-td"></div>	
                    </div>';
        }
        
        if ($dbt=='mssql') {
            if ($stmt3 = sqlsrv_prepare( $conn, $sql_true_p)) {
                if (sqlsrv_field_metadata($stmt3)) {
                    foreach( sqlsrv_field_metadata($stmt3) as $fieldMetadata) {  
                            $data.=one_str_fm($fieldMetadata);	
                    }
                }    
                else {
                    $data.=get_null();
                }    
                sqlsrv_free_stmt( $stmt3);
            }
            else {
                $data.=get_null();
            }
        }
        elseif ($dbt=='ora') {
            $stid = oci_parse($conn, $sql_true_p);
            if ($stid) {
                ora_create_params($stid,$params_m_dop);
                $r = oci_execute($stid, OCI_DESCRIBE_ONLY);
                if ($r) {
                    $ncols = oci_num_fields($stid);
                    for ($i = 1; $i <= $ncols; $i++) {
                        $fieldMetadata['Name']=oci_field_name($stid, $i);
                        $fieldMetadata['Type']=oci_field_type($stid, $i);
                        $fieldMetadata['Nullable']=oci_field_is_null($stid, $i);
                        $fieldMetadata['Scale']=oci_field_scale($stid, $i);
                        $fieldMetadata['Precision']=oci_field_precision($stid, $i);
                        $data.=one_str_fm($fieldMetadata);
                    } 
                }
                else {
                    $e = oci_error($stid);
                    $data.=get_null(htmlentities($e['message'], ENT_QUOTES));
                }
                oci_free_statement($stid);
            }
            else {
                $e = oci_error($conn);
                $data.=get_null(htmlentities($e['message'], ENT_QUOTES));
            }
        }
        $data.='</div></div>	
                    <div class="structure d-table" style="display: inline;">
                            <div class="d-tr">
                                <div class="d-td" style="font-size:12pt;font-weight:bold;">Структура</div>													
                            </div
                            <div class="d-tr">
                                    <div class="d-td" style="padding:0;">
                                            <div class="d-table" id="tab_geometry"
                                                ondragenter="return dragEnter(event)" ondrop="return dragDrop(event)" ondragover="return dragOver(event)">
                                                    <div class="d-tr">
                                                            <div id="null" class="d-td" style="font-size:10pt;font-weight:bold;width:10%"></div>
                                                            <div id="null" class="d-td" style="font-size:10pt;font-weight:bold;">Показатели</div>	
                                                    </div>
                                                    <div class="d-tr" id="after_append">
                                                            <div class="d-td" id="null" style="width:100px;"></div>
                                                            <div class="d-td" style="padding:0;width:100px;" id="tab_pok">
                                                                    <div class="d-table" id="tab_pok">
                                                                            <div class="d-tr">
                                                                                    <div class="d-td plhold" id="plhold_pok" style="font-size:10pt;font-weight:bold;">
                                                                                            Перенесите в эту строку показатель
                                                                                    </div>	
                                                                            </div>	
                                                                    </div>	
                                                            </div>	
                                                    </div>
                                                    <div class="d-tr">
                                                            <div class="d-td" style="padding:0;width:100px;" id="tab_str">
                                                                    <div class="d-table" id="tab_str">
                                                                            <div class="d-tr">
                                                                                    <div class="d-td plhold" id="plhold_str" style="height:200px;-webkit-writing-mode: vertical-rl; writing-mode:tb-rl;-webkit-transform: rotate(90deg); transform: rotate(90deg);">
                                                                                            Перенесите сюда поля строк
                                                                                    </div>	
                                                                            </div>
                                                                    </div>
                                                            </div>
                                                            <div class="d-td" style="padding:0;width:100px;" id="tab_val">
                                                                    <div class="d-table" id="tab_val">
                                                                            <div class="d-tr">
                                                                                    <div class="d-td plhold" id="plhold_val" style="border:0;">
                                                                                            Перенесите сюда значения для показателей
                                                                                    </div>	
                                                                            </div>	
                                                                    </div>	
                                                            </div>	
                                                    </div>
                                            </div>
                                    </div>
                            </div>
                    </div>';        
    save_tab_strukture($sql_true_p,$data,$id_v,null);  
    if ($dbt=='mssql') {
        sqlsrv_close($conn);
    }
    elseif ($dbt=='ora') {
        oci_close($conn);
    }
}    
return  $data;
}

function save_tab_strukture($sql_true,$mdata,$tab_id,$params_html) {
    $conn=conndb();
    $dbt=db_type();
    if($conn) {
        if ($dbt=='mssql') {
            $tsql="UPDATE REP_DATA_TABLE 
                      SET SQL=?,MDATA=?,PARAMS=?
                    WHERE ID=?";
            $sql_true_p=html_entity_decode($sql_true, ENT_COMPAT | ENT_HTML401, 'UTF-8');
            $arr=array(&$sql_true_p,&$mdata,&$params_html,&$tab_id);
              $stmt=sqlsrv_prepare($conn, $tsql, $arr);					 
              if (sqlsrv_execute($stmt)) {  
                      $data2="Успех";  
              }  
              else {  
                      $data2="Error in executing statement.\n".sqlsrv_errors();  				 
              }  
              sqlsrv_free_stmt($stmt);    
            sqlsrv_close($conn);
        }
        elseif ($dbt=='ora') {
            $tsql="UPDATE REP_DATA_TABLE 
                      SET SQL=:sql,MDATA=:mdata,PARAMS=:params
                    WHERE ID=:id";
            $sql_true_p=html_entity_decode($sql_true, ENT_COMPAT | ENT_HTML401, 'UTF-8');
            $stid = oci_parse($conn, $tsql);
            if ($stid) {
                $arr=array(':sql'=>$sql_true_p,':mdata'=>$mdata,':params'=>$params_html,':id'=>$tab_id);
                ora_create_params($stid,$arr);
                $r = oci_execute($stid);
                if ($r) {
                    $data2="Успех"; 
                }
                else {
                    $e = oci_error($stid);
                    $data2='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                }
                oci_free_statement($stid);
            }
            else {
                $e = oci_error($conn);
                $data2='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
            }
            oci_close($conn);            
        }
    }    
    else {
        $data2= '<h1 id="header">Connection could not be established.\n</h1>';  
    }
    return  $data2;
}

function create_table_one_str($mass,$tab_str,$rows_unic_val,$tab_pok,$rows_unic_pok,$tab_val,$data_rows_unic_val,$i) {
    $data['tab_html']='';
    $data['$rows_unic_val']=$data_rows_unic_val;
    //точность 
    $precision=2;       
    //ПРОВЕРЯЕМ НА НАЛИЧИЕ ИТОГОВ
    $pr_itg=false;
    if ($mass['tab_str_itog_order']) {
        foreach ($tab_str as $m) {
            if ($rows_unic_val[$i][$m['sysname'].'_GRPNG_']===1) {
                $pr_itg=true;
                break;
            }
        }            
    }                
    //проверяем сменилась ли строка (все отсортировано),если сменилась, то надо перейти на новую
    $pr=false;
    foreach ($tab_str as $mstr) {
        if ((strval($rows_unic_val[$i][$mstr['sysname']])!==strval($rows_unic_val[$i-1][$mstr['sysname']])) || ($i==1)) {
            $pr=true;
            break;
        }
    }
    if ($pr) {
        $data['$rows_unic_val'][$i-1]['$key_i']=0;
        $data['tab_html'].='</tr><tr class="'.(($pr_itg) ? 'tr_itog':'tr_tab').'">';
        foreach ($tab_str as $m) {
            $data['tab_html'].='<td class="'.(($pr_itg) ? 'td_str_itog':'td_str_val').'" id="'.$m['sysname'].'">'.$rows_unic_val[$i][$m['sysname']].'</td>';
        }            
    }
    //ищем номер набора показателей, который должен быть
    if (count($tab_pok)>0) {
        if (!$pr_itg) {
            foreach ($rows_unic_pok as $key_i=>$mpok_r) {
                $pr_ok_pok_one=true;
                foreach ($mpok_r as $keyp=>$valp) {
                    if (strval($rows_unic_val[$i][$keyp])!==strval($valp)) {
                        $pr_ok_pok_one=false;
                        break;
                    }
                }
                if ($pr_ok_pok_one) {
                    break;
                }
            }
        }
        else {
            $key_i=1;
        }
        for ($j_pok_null = ($data['$rows_unic_val'][$i-1]['$key_i']+1); $j_pok_null <= ($key_i-1); $j_pok_null++) {
            for ($j_pok_null2 = 1; $j_pok_null2 <= count($tab_val); $j_pok_null2++) {
                $data['tab_html'].='<td class="td_val_val" id="null"></td>';
            }    
        }
        $data['$rows_unic_val'][$i]['$key_i']=$key_i;
    }
    foreach ($tab_val as $m) {
        $number = $rows_unic_val[$i][$m['sysname']]; 
        if ($number=='.00') {
            $number=0;
        }
        else {
            $pos = strrpos($rows_unic_val[$i][$m['sysname']], '.'); // при необходимости заменить на просто strpos
            if (($pos) || ($pos===0)) {
                $number = substr($rows_unic_val[$i][$m['sysname']], 0, $pos + 1 + $precision);
                $number[$pos]=',';
                if ((!$number[$pos - 1]) & ($number[$pos - 1]!=='0')) {
                    $number='0'.$number;
                }
                if ($number[$pos - 1]=='-') {
                    $number='-0'.substr($number,$pos);
                }
            }
        }    
        $data['tab_html'].='<td class="'.(($pr_itg) ? 'td_val_itog':'td_val_val').'" id="'.$m['sysname'].'">'.$number.'</td>';
    }
    return $data;
}

function meta_var() {
    $type_decode[-5]='BIGINT';
    $type_decode[-2]='BINARY';
    $type_decode[-7]='BIT';
    $type_decode[1]='CHAR';
    $type_decode[91]='DATE';
    $type_decode[93]='DATETIME';
    $type_decode[-155]='DATETIMEOFFSET';
    $type_decode[3]='DECIMAL';
    $type_decode[6]='FLOAT';
    $type_decode[-4]='IMAGE';
    $type_decode[4]='NUMERIC';
    $type_decode[-8]='NCHAR';
    $type_decode[-10]='NTEXT';
    $type_decode[2]='NUMERIC';
    $type_decode[-9]='NVARCHAR';
    $type_decode[7]='REAL';
    $type_decode[5]='SMALLINT';
    //$type_decode[5]='NUMERIC';
    $type_decode[-1]='TEXT';
    $type_decode[-154]='TIME';
    $type_decode[-6]='TINYINT';
    $type_decode[-11]='UNIQUEIDENTIFIER';
    $type_decode[-3]='VARBINARY';
    $type_decode[12]='VARCHAR';
    $type_decode[-152]='XML';
    return $type_decode;
}

function get_tableDefPage() {
    return 500;
}

function olap_one_str_2D($row_v,$mass_vis,$mass_unvis,$tab_id,$pr_slashe=false) {
    $data='<tr class="tr_tab"';
    $d_json=[];
    foreach ($mass_unvis as $key=>$val) {
        $d_json[$key]=$row_v[$key];
    }
    if (count($d_json)>0) {
        if ($pr_slashe) {
            $data.=" olap_unvis_".$tab_id."=\'". json_encode($d_json)."\'";
        }
        else {
            $data.=" olap_unvis_".$tab_id."='". json_encode($d_json)."'";
        }
    }
    $data.='>';
    if ($pr_slashe) {
        foreach ($mass_vis as $key=>$val) {
            $data.='<td class="td_val_val" id="'.str_replace("'" , "\'", $key).'">'.str_replace("'" , "\'", $row_v[$key]).'</td>';
        }
    }
    else {
        foreach ($mass_vis as $key=>$val) {
            $data.='<td class="td_val_val" id="'.$key.'">'.$row_v[$key].'</td>';
        }
    }    
    $data.='</tr>';
    return $data;
}

function create_table_one_str_vector($mass) {
    set_time_limit(10000);
    $tab_str= json_decode($mass['tab_str'],true);
    $tab_pok= json_decode($mass['tab_pok'],true);
    $tab_val= json_decode($mass['tab_val'],true);
    $tab_pol= json_decode($mass['tab_pol'],true);
    $tab_pok_cool= json_decode($mass['tab_pok_cool'],true);
    $rows_unic_pok=json_decode($mass['rows_unic_pok'],true);
    if ($mass['params_val']) {
        $params_val=json_decode($mass['params_val'],true);
    }
    $conn=conndb();
    $type_decode=meta_var();
    if($conn) { 
        $sql_true=html_entity_decode($mass['sql_true'], ENT_COMPAT | ENT_HTML401, 'UTF-8');
        $tab_temp="##REP_TAB_".$mass['tab_id']."_".$mass['i_loc'].date("mdyHis");
        
        $tsql="SET NOCOUNT ON;SET DATEFORMAT YMD;CREATE TABLE ".$tab_temp." (";                      
        if ($stmt3 = sqlsrv_prepare( $conn, $sql_true)) {
            if (sqlsrv_field_metadata($stmt3)) {
                //var_dump(sqlsrv_field_metadata($stmt3));
                foreach( sqlsrv_field_metadata($stmt3) as $m) {  
                    $tsql.=$m['Name']." ".$type_decode[$m['Type']];
                    if ($m['Precision']) {
                        //if (($m['Type']!=93) & ($m['Type']!=91) & ($m['Type']!=-154)) {
                        if (!in_array($m['Type'], array(93,91,-154,5,-5))) {
                            $tsql.="(".$m['Precision'].(($m['Scale']) ? ",".$m['Scale']:"" ).")";
                        }
                    }
                    else {
                        if ($m['Type']==-9) {
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
        $data['tsql']=trim(html_entity_decode($tsql, ENT_COMPAT | ENT_HTML401, 'UTF-8'));
        
        $stmt=sqlsrv_prepare($conn, $tsql,$params_val);					 
        if (sqlsrv_execute($stmt)) {  
                $data['ex_insert']="Успех";  
        }  
        else {  
                $data['ex_insert']="Error in executing statement.\n".sqlsrv_errors();  				 
        }  
        sqlsrv_free_stmt($stmt); 
        $sql_unic_val="SET NOCOUNT ON;SET DATEFORMAT YMD;"
                     . "WITH TAB AS (SELECT ";
        if ($mass['tab_str_itog_order']) {
            for ($i = 0; $i <= (count($tab_str)-2); $i++) {
                $sql_unic_val.=$tab_str[$i]['sysname'].",";
            }
            $sql_unic_val.="CAST([".$tab_str[count($tab_str)-1]['sysname']."] AS NVARCHAR(MAX)) [".$tab_str[count($tab_str)-1]['sysname']."],["
                            .$tab_str[count($tab_str)-1]['sysname']."] ".$tab_str[count($tab_str)-1]['sysname']."_ITG_,";

            if (count($tab_pok)>0) {
                for ($i = 1; $i <= (count($tab_pok_cool)/*-1*/); $i++) {
                    $sql_unic_val.="[".$tab_pok_cool[$i]['sysname']."],";
                }
                //$sql_unic_val.="CAST(".$tab_pok_cool[count($tab_pok_cool)]['sysname']." AS NVARCHAR(MAX)) ".$tab_pok_cool[count($tab_pok_cool)]['sysname'].",";                 
            }    
            /*else {
                for ($i = 0; $i <= (count($tab_str)-2); $i++) {
                    $sql_unic_val.=$tab_str[$i]['sysname'].",";
                }
                $sql_unic_val.="CAST(".$tab_str[count($tab_str)-1]['sysname']." AS NVARCHAR(MAX)) ".$tab_str[count($tab_str)-1]['sysname'].",";
            }*/
        }
        else {
            foreach ($tab_str as $m) {
                $sql_unic_val.="[".$m['sysname']."],";
            }  
            if (count($tab_pok)>0) {
                foreach ($tab_pok_cool as $m) {
                    $sql_unic_val.="[".$m['sysname']."],";
                } 
            }            
        }
        
        foreach ($tab_val as $m) {
            $sql_unic_val.='ISNULL('.$m['aggr'].'(ISNULL('.$m['sysname'].",0)),0) [".$m['sysname']."],";
        }
        $sql_unic_val=substr($sql_unic_val, 0, -1);
        $sql_unic_val.=" FROM ".$tab_temp." GROUP BY ";
        foreach ($tab_str as $m) {
            $sql_unic_val.=$m['sysname'].",";
        } 
        if (count($tab_pok_cool)>0) {
            foreach ($tab_pok_cool as $m) {
                $sql_unic_val.=$m['sysname'].",";
            } 
        }    
        $sql_unic_val=substr($sql_unic_val, 0, -1);
        $sql_unic_val.=" ) SELECT ";
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
            foreach ($tab_str as $m) {
                $sql_unic_val.="GROUPING(".$m['sysname'].") ".$m['sysname']."_GRPNG_,";
            } 
            if (count($tab_pok_cool)>0) {
                foreach ($tab_pok_cool as $m) {
                    $sql_unic_val.="GROUPING(".$m['sysname'].") ".$m['sysname']."_GRPNG_,";
                } 
            }
            for ($i = 0; $i <= (count($tab_str)-2); $i++) {
                $sql_unic_val.=$tab_str[$i]['sysname'].",";
            }
            
            $sql_unic_val.="'Итого' ".$tab_str[count($tab_str)-1]['sysname'].",".$tab_str[count($tab_str)-1]['sysname']." ".$tab_str[count($tab_str)-1]['sysname']."_ITG_,";
                
                
                        
            if (count($tab_pok)>0) {
                /*$sql_unic_val.="ISNULL(".$tab_pok_cool[count($tab_pok_cool)]['sysname'].",CASE WHEN GROUPING(".$tab_pok_cool[count($tab_pok_cool)]['sysname'].")=1 "; 
                for ($i = 0; $i <= (count($tab_str)-1); $i++) {
                    $sql_unic_val.=" AND GROUPING(".$tab_str[$i]['sysname'].")=1 ";
                }
                for ($i = 1; $i <= (count($tab_pok_cool)-1); $i++) {
                    $sql_unic_val.=" AND GROUPING(".$tab_pok_cool[$i]['sysname'].")=1 ";
                }                
                $sql_unic_val.="                                                        THEN 'Итого'
                                                                                     ELSE 'Промежуточный итог'
                                                                                END) ".$tab_str[count($tab_str)-1]['sysname'].",".$tab_str[count($tab_str)-1]['sysname']." ".$tab_str[count($tab_str)-1]['sysname']."_ITG_,";*/
                
                foreach ($tab_pok_cool as $m) {
                    $sql_unic_val.=$m['sysname'].",";
                }           
            }    
            /*else {
                $sql_unic_val.="ISNULL(".$tab_str[count($tab_str)-1]['sysname'].",CASE WHEN GROUPING(".$tab_str[count($tab_str)-1]['sysname'].")=1 "; 
                for ($i = 0; $i <= (count($tab_str)-2); $i++) {
                    $sql_unic_val.=" AND GROUPING(".$tab_str[$i]['sysname'].")=1 ";
                }
                $sql_unic_val.="                                                        THEN 'Итого'
                                                                                     ELSE 'Промежуточный итог'
                                                                                END) ".$tab_str[count($tab_str)-1]['sysname'].",";                
            }*/                        
                        
            foreach ($tab_val as $m) {
                $sql_unic_val.='ISNULL('.$mass['tab_str_itog_val'].'(ISNULL('.$m['sysname'].",0)),0) ".$m['sysname'].",";
            }
            $sql_unic_val=substr($sql_unic_val, 0, -1);
            $sql_unic_val.=" FROM TAB GROUP BY ";
            foreach ($tab_str as $m) {
                $sql_unic_val.=$m['sysname'].",";
            }
            if (count($tab_pok)>0) {
                foreach ($tab_pok_cool as $m) {
                    $sql_unic_val.=$m['sysname'].",";
                } 
            }             
            $sql_unic_val=substr($sql_unic_val, 0, -1);
            $sql_unic_val.=" WITH CUBE HAVING (GROUPING(".$tab_str[count($tab_str)-1]['sysname'].")=1";
            for ($i = 0; $i <= (count($tab_str)-2); $i++) {
                $sql_unic_val.=" AND GROUPING(".$tab_str[$i]['sysname'].")=1 ";
            }
            $sql_unic_val.=")";
            /*for ($i = 0; $i <= (count($tab_str)-2); $i++) {
                $sql_unic_val.=" OR GROUPING(".$tab_str[$i]['sysname'].")=1 ";
            }
            $sql_unic_val.=")";*/
            if (count($tab_pok)>0) {
                foreach ($tab_pok_cool as $m) {
                    $sql_unic_val.=" AND GROUPING(".$m['sysname'].")=0 ";
                } 
            }                         
        }
        $sql_unic_val.=" ORDER BY ";
        //для ИТОГов
        if ($mass['tab_str_itog_order']) {
            if (count($tab_pok)>0) {
                for ($i = 0; $i <= (count($tab_str)-2); $i++) {
                    $sql_unic_val.=$tab_str[$i]['sysname']."_GRPNG_,".$tab_str[$i]['sysname'].",";
                }
                $sql_unic_val.=$tab_str[count($tab_str)-1]['sysname']."_GRPNG_,".$tab_str[count($tab_str)-1]['sysname']."_ITG_,";
                foreach ($tab_pok_cool as $m) {
                    $sql_unic_val.=$m['sysname']."_GRPNG_,".$m['sysname'].",";
                }             
            }
            else {
                foreach ($tab_str as $m) {
                    $sql_unic_val.=$m['sysname']."_GRPNG_,".$m['sysname'].",";
                }                       
            }
        }
        //не для итогов
        else {
            foreach ($tab_str as $m) {
                $sql_unic_val.=$m['sysname'].",";
            }
            if (count($tab_pok)>0) {
                foreach ($tab_pok_cool as $m) {
                    $sql_unic_val.=$m['sysname'].",";
                }        
            }        
        }
        foreach ($tab_val as $m) {
            $sql_unic_val.=$m['sysname'].",";
        }
        $sql_unic_val=substr($sql_unic_val, 0, -1);
        $data['sql_unic_val']=$sql_unic_val;
        $getRows = sqlsrv_query($conn, $sql_unic_val); 					
        if(sqlsrv_has_rows($getRows)) {  
            $rowCount_unic_val = sqlsrv_num_rows($getRows);  
            $i=1;
            while( $rows_unic_val[$i] = sqlsrv_fetch_array( $getRows, SQLSRV_FETCH_ASSOC)) {
                ++$i;                
            }
            $rowCount_unic_val =$i-1;
            unset($rows_unic_val[$i]);
            sqlsrv_free_stmt($getRows);
        }  
        $data['$rows_unic_val']=$rows_unic_val;
        for ($i = 1; $i <= $rowCount_unic_val; $i++) {
            $data_f=create_table_one_str($mass,$tab_str,$rows_unic_val,$tab_pok,$rows_unic_pok,$tab_val,$data['$rows_unic_val'],$i);
            $data['$rows_unic_val']=$data_f['$rows_unic_val'];
            $data['tab_html'].=$data_f['tab_html'];
        }  
    }
    return json_encode($data);
}

function exists_right($user_right,$right) {
    $exist=false;
    foreach ($user_right as $m) {
        if (in_array($right, $m)) {
            $exist=true;
            break;
        }
    }        
    return $exist;
}

function get_rep_all($user_right) {
    function one_rep_str($row,$user_right) {
        $data='<figure class="sign">
                    <p><img src="/img/report.png" width="50" height="auto" alt="Отчет"></p>
                    <figcaption><p class="rep_name" id="'.$row['ID'].'">'.$row['NAME'].'</p>
                                <p>';
        if (exists_right($user_right,'View')) {
            $data.='<a class="rep_view" id="'.$row['ID'].'" title="Просмотр отчета" href="/rep_view.php?id='.$row['ID'].'"><img src="/img/rep_view.png" width="auto" height="33"></a>';
        }
        if (exists_right($user_right,'Edite')) {
            $data.='<a class="rep_edite" id="'.$row['ID'].'" title="Редактировать отчет" href="/rep_add.php?id='.$row['ID'].'"><img src="/img/rep_edite.png" width="auto" height="33"></a>';
        } 
        if (exists_right($user_right,'Delete')) {
            $data.='<a class="rep_del" id="'.$row['ID'].'" title="Удалить отчет"><img src="/img/rep_del.png" width="auto" height="33"></a>';
        }    
        $data.='               </p>                                                        
                    </figcaption>
                </figure>';
        return $data;
    }
    
    $data='';
    $dbt=db_type();
    $conn=conndb();
    if($conn) {  
        $tsql = "SELECT ID,
                        NAME,
                        SYSNAME
                  FROM REP_DATA";  

        if (exists_right($user_right,'Edite')) {
            $data.='<figure class="sign">
                        <p>
                            <a class="rep_add" href="/rep_add.php"><img src="/img/report_add.png" width="50" height="auto" alt="Создание нового отчета"></a>
                        </p>
                        <figcaption>Создать новый отчет    
                        </figcaption>
                    </figure>';
        }        

        if ($dbt=='mssql') {
            $getRows = sqlsrv_query($conn, $tsql); 
            if(sqlsrv_has_rows($getRows)) {
                $rowCount = sqlsrv_num_rows($getRows);  
                while( $row = sqlsrv_fetch_array( $getRows, SQLSRV_FETCH_ASSOC)) {  
                    $data.=one_rep_str($row,$user_right);
                }
                $data.='</div>';	
            } 
            sqlsrv_free_stmt($getRows);
            sqlsrv_close($conn);
        }  
        elseif ($dbt=='ora') {
            $stid = oci_parse($conn, $tsql);
            $r = oci_execute($stid);
            while ($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS)) {
                $data.=one_rep_str($row,$user_right);
            }
            oci_free_statement($stid);
            oci_close($conn);
        }                        
    }  
    else {  
        $data.= '<h1 id="header">Connection could not be established.\n</h1>';  
        $data.=sqlsrv_errors(); 
    }
    return $data;
}

function save_rep($mass,$user) {
    set_time_limit(10000);
    if ($mass['new']) {
        $f = scandir(__DIR__.'/classes/forms');
        $id_rep_real=1;
        foreach ($f as $file) {
            if (strlen($file)>2) {
                $mass_name=explode("_", $file);
                $tek_id=(int) $mass_name[1];
                if ($tek_id>$id_rep_real) {
                    $id_rep_real=$tek_id;
                }
            }    
        }         
        if ($id_rep_real>1) {
            $id_rep_real++;
        }
        $data['id_rep']=$id_rep_real;
    }        
    else {
        $id_rep_real=$mass['id_rep'];
    }        
    //создаем файл скрипта
    if ($mass['js_data']) {
        $filename=realpath('/index.php').'js_forms/form_'.$id_rep_real.'.js';
        $kod_true=$mass['js_data'];
        file_put_contents ( $filename , $kod_true);
    } 
    //создаем файл класса вместо CLOB
    $class_path=__DIR__.'/classes/forms/FormValue_'.$id_rep_real.'.php';
    $class_value="<?php
class FormValue_".$id_rep_real."
{
    public function getName() {
        return '".str_replace ("'" , "\'", $mass['name_rep'])."';
    }

    public function getSName() {
        return '".str_replace ("'" , "\'", $mass['sname_rep'])."';
    }
                
    public function getData()
    {
        return '".str_replace ("'" , "\'", $mass['data_rep'])."';
    }
}";    
    file_put_contents( $class_path , $class_value);
                
    return json_encode($data);
}

function get_rep_data($id) {
    $form_class_name='FormValue_'.$id;
    require_once(__DIR__.'/classes/forms/'.$form_class_name.'.php');
    $form_class = new $form_class_name();
    $data['data']=$form_class->getData();
    $data['name']=$form_class->getName();
    $data['sname']=$form_class->getSName();
    return json_encode($data);
}

function rep_del($id_rep) {
    $data='';
    $conn=conndb();
    $dbt=db_type();
    if($conn) {
        if ($dbt=='mssql') {
            $tsql="SET NOCOUNT ON;SET DATEFORMAT YMD;
                   DELETE FROM REP_DATA
                    WHERE ID=?;";
            $stmt=sqlsrv_prepare($conn, $tsql, array(&$id_rep));					 
            if (sqlsrv_execute($stmt)) {  
                $data="Успех";  
            }  
            else {  
                $data="Error in executing statement.\n".sqlsrv_errors();  				 
            } 
            sqlsrv_free_stmt($stmt);                
            sqlsrv_close($conn);
        }
        elseif ($dbt=='ora') {
            $tsql = "DELETE FROM REP_DATA
                      WHERE ID=:id";  
            $stid = oci_parse($conn, $tsql);            
            if ($stid) {
                oci_bind_by_name($stid, ':id', $id_rep);
                $r = oci_execute($stid);
                if ($r) {
                    $data="Успех";                  
                }
                else {
                    $e = oci_error($stid);
                    $data='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                }
                oci_free_statement($stid);
            }
            else {
                $e = oci_error($conn);
                $data='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
            }
            oci_close($conn);
        }
    }  
    else {  
        $data= '<h1 id="header">Connection could not be established.\n</h1>';  
        //$data.=sqlsrv_errors(); 
    }
    return $data;
}

function get_md_struct_load($mass) {
    $data='';
    $conn=conndb();
    if($conn) {
        $tsql="SET NOCOUNT ON;
               SELECT ID,
                      NAME,
                      SYSNAME
                 FROM REP_DATA
                ORDER BY NAME";
        $data=getRowsDB($conn,$tsql,$params);               
        sqlsrv_close($conn);
    }  
    else {  
        $data= '<h1 id="header">Connection could not be established.\n</h1>';  
        $data.=sqlsrv_errors(); 
    }
    return $data;
}

function panel_action_get_bord_s() {
    return '<li class="li_cons panel_action a_cell_bord_s_solid">Solid
                <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
            </li>
            <li class="li_cons panel_action a_cell_bord_s_double">Double
                <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
            </li>
            <li class="li_cons panel_action a_cell_bord_s_groove">Groove
                <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
            </li>
            <li class="li_cons panel_action a_cell_bord_s_ridge">Ridge
                <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
            </li>                                
            <li class="li_cons panel_action a_cell_bord_s_inset">Inset
                <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
            </li>
            <li class="li_cons panel_action a_cell_bord_s_outset">Outset
                <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
            </li>                                
            <li class="li_cons panel_action a_cell_bord_s_dotted">Dotted
                <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
            </li>                                 
            <li class="li_cons panel_action a_cell_bord_s_dashed">Dashed
                <input type="number" class="a_cell_bord_w" title="Ширина линии" value="1">
            </li>';
}

function load_salt(){
  $sol_array_value[1]='$2a$10$eSb3zD5nD4diakkyY.oRNg$';
  $sol_array_value[2]='$2a$10$A.6eNVSpds0uiBe6PwjgAg$';
  $sol_array_value[3]='$2a$10$Lo/U/CN8Rg95Bmm8Vf2Z.w$';
  $sol_array_value[4]='$2a$10$d18ZjBRTh34uP2UUdQrxDg$';
  $sol_array_value[5]='$2a$10$e44PXCG9XUsmi1cxYSg0mQ$';
  return $sol_array_value;
} 

function sol_array($var_value,$n_s=5){  
    $sol_array_value_f=load_salt();
    for ($i = 1; $i <= $n_s; $i++) {
       $var_array_salt[$i]=crypt($var_value,$sol_array_value_f[$i]);  
    }
    return $var_array_salt;
} 

function one_sol_array($var_value,$num_f){
    $sol_array_value_f=load_salt();
    $result=crypt($var_value,$sol_array_value_f[$num_f]);
    return $result;
} 

function get_but_enter($mass) {
    $conn=conndb();
    $data['pr_ok']=-7;    
    if($conn) {
        $dbt=db_type();
        if ($dbt=='mssql') {
            $tsql="SET NOCOUNT ON;
                  SELECT USER_ID,LOGIN,FIO,EMAIL,PHONE,SOL
                    FROM REP_USERS
                   WHERE LOGIN=?";
            $getRows = sqlsrv_query($conn, $tsql,array(&$mass['user'])); 								
            if(sqlsrv_has_rows($getRows)) {  
                $row = sqlsrv_fetch_array( $getRows, SQLSRV_FETCH_ASSOC);                
                if ($row['USER_ID']) {   
                    $tsql="SET NOCOUNT ON;
                        SELECT U.USER_ID,R.RIGHTS_ID,R.NAME RIGHTS_NAME,R.SYSNAME RIGHTS_SYSNAME
                        FROM REP_USERS U
                        JOIN REP_USERS_RIGHTS UR
                          ON UR.USER_ID=U.USER_ID
                        JOIN REP_RIGHTS R 
                          ON R.RIGHTS_ID=UR.RIGHT_ID 
                       WHERE U.LOGIN=? AND U.PASSWORD=?";
                    $h_password_e=one_sol_array($mass['password'],$row['SOL']);
                    //$h_password_e=one_sol_array('111111',$row['SOL']);
                    //$data['password']=$h_password_e;
                    $getRows2 = sqlsrv_query($conn, $tsql,array(&$mass['user'],&$h_password_e));                 
                    if(sqlsrv_has_rows($getRows2)) {  
                        $row2 = sqlsrv_fetch_array( $getRows2, SQLSRV_FETCH_ASSOC);
                        if ($row2['USER_ID']) {
                            $mass_right=[];
                            $mass_right[]=$row2;
                            while( $row2 = sqlsrv_fetch_array( $getRows2, SQLSRV_FETCH_ASSOC)) {  
                                $mass_right[]=$row2;					
                            }
                            $data['pr_ok']=7;
                            $_SESSION['user_right']=json_encode($mass_right);
                            $_SESSION['user_info']=json_encode($row);
                        }
                        else {
                            $data['pr_ok']= 44; 
                            $data['err_txt']='Неправильное сочетание логин/пароль';
                        }
                    }
                    else {
                        $data['pr_ok']= 33; 
                        $data['err_txt']='Что-то пошло не так '.sqlsrv_errors();
                    }
                    sqlsrv_free_stmt($getRows2);                                
                } 
                else {
                    $data['pr_ok']= 4; 
                    $data['err_txt']='Неправильное сочетание логин/пароль';
                }
            }  
            else {
                $data['pr_ok']= 3; 
                $data['err_txt']='Что-то пошло не так '.sqlsrv_errors();
            }
            sqlsrv_free_stmt($getRows);
            sqlsrv_close($conn);
        }    
        elseif ($dbt=='ora') {
            $tsql="SELECT USER_ID,LOGIN,FIO,EMAIL,PHONE,SOL
                     FROM REP_USERS
                    WHERE LOGIN=:login";
            $stid = oci_parse($conn, $tsql);
            if ($stid) {
                ora_create_params($stid,array(':login'=>$mass['user']));
                $r = oci_execute($stid);
                if ($r) {
                    $row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS+OCI_RETURN_LOBS);
                    if (!empty($row['USER_ID'])) { 
                        oci_free_statement($stid);
                        $tsql="SELECT U.USER_ID,R.RIGHTS_ID,R.NAME RIGHTS_NAME,R.SYSNAME RIGHTS_SYSNAME
                                FROM REP_USERS U
                                JOIN REP_USERS_RIGHTS UR
                                  ON UR.USER_ID=U.USER_ID
                                JOIN REP_RIGHTS R 
                                  ON R.RIGHTS_ID=UR.RIGHT_ID 
                               WHERE U.LOGIN=:login AND U.PASSWORD=:pwd";
                        $h_password_e=one_sol_array($mass['password'],$row['SOL']);
                        $stid = oci_parse($conn, $tsql);
                        if ($stid) {
                            ora_create_params($stid,array(':login'=>$mass['user'],':pwd'=>$h_password_e));
                            $r = oci_execute($stid);
                            if ($r) {
                                $row2 = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS+OCI_RETURN_LOBS);
                                if (!empty($row2['USER_ID'])) {
                                    $mass_right=[];
                                    $mass_right[]=$row2;
                                    while( $row2 = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS+OCI_RETURN_LOBS)) {  
                                        $mass_right[]=$row2;					
                                    }
                                    $data['pr_ok']=7;
                                    $_SESSION['user_right']=json_encode($mass_right);
                                    $_SESSION['user_info']=json_encode($row);
                                }
                                else {
                                    $data['pr_ok']= 44; 
                                    $data['err_txt']='Неправильное сочетание логин/пароль';
                                }  
                                oci_free_statement($stid);
                            }
                            else {
                                $data['pr_ok']= 3; 
                                $data['err_txt']='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                            }
                        }
                        else {
                            $data['pr_ok']= 3; 
                            $data['err_txt']='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                        }
                    }  
                    else {
                        $data['pr_ok']= 4; 
                        $data['err_txt']='Неправильное сочетание логин/пароль';
                    }
                }
                else {
                    $e = oci_error($stid);
                    $data['pr_ok']= 3; 
                    $data['err_txt']='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                }
                oci_free_statement($stid);
            }
            else {
                $e = oci_error($conn);
                $data['pr_ok']= 3; 
                $data['err_txt']='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
            }
            oci_close($conn);
        }
    }  
    else {  
        $data['pr_ok']= 2;  
        $data['err_txt']='Connection could not be established.\n'; 
    }
    return (json_encode($data));
}

function startSession($isUserActivity=true, $prefix=null) {
    $sessionLifetime = 300;
    $idLifetime = 60;

    if ( session_id() ) return true;
    session_name('MYPROJECT'.($prefix ? '_'.$prefix : ''));
    ini_set('session.cookie_lifetime', 0);
    if ( ! session_start() ) return false;

    $t = time();

    if ( $sessionLifetime ) {
        if ( isset($_SESSION['lastactivity']) && $t-$_SESSION['lastactivity'] >= $sessionLifetime ) {
            destroySession();
            return false;
        }
        else {
            if ( $isUserActivity ) $_SESSION['lastactivity'] = $t;
        }
    }

    if ( $idLifetime ) {
        if ( isset($_SESSION['starttime']) ) {
            if ( $t-$_SESSION['starttime'] >= $idLifetime ) {
                session_regenerate_id(true);
                $_SESSION['starttime'] = $t;
            }
        }
        else {
            $_SESSION['starttime'] = $t;
        }
    }

    return true;
}

function unique_multidim_array($array, $key) {
    $temp_array = array();
    $i = 0;
    $key_array = array();
   
    foreach($array as $val) {
        if (!in_array($val[$key], $key_array)) {
            $key_array[$i] = $val[$key];
            $temp_array[$i] = $val;
        }
        $i++;
    }
    return $temp_array;
}

function getFirstKeyArray($mass) {
    $data=null;
    foreach($mass as $key=>$val) {
        $data=$key;
        break;
    }
    return $data;
}

function destroySession() {
    if ( session_id() ) {
        session_unset();
  /*      setcookie(session_name(), session_id(), time()-60*60*24);*/
        session_destroy();
    }
}

function getOLAP2DPages($mass) {
    $user=json_decode($_SESSION['user_info'],true);            
    $class_dir='_'.$mass['in_rep_id'].'_'.$mass['tab_id'].'_'.$user['USER_ID'];
    $dir_str_block='../classes/cacheOLAP2D/beg_file/'.$class_dir;
    //получаем все страницы из папки (возможно ещё не созданы до конца)
    clearstatcache();            
    $str_block=file_exists($dir_str_block);
    if ($str_block) {
        $data['str_block']=1;
    }    
    $f = scandir(realpath('../classes/cacheOLAP2D/'.$class_dir));    
    //возвращаем только те которые больше текущей отображаемой максимальной
    foreach ($f as $file) {
        if (strlen($file)>2) {
            $t_f=substr($file,1);
            $t_f= explode('.', $t_f);
            $t_f=$t_f[0];
            $mass_page[]=(int) $t_f;
        }                
    }
    sort($mass_page);
    $max_page=(int) $mass['max_page'];
    foreach ($mass_page as $val) {
        if ($val>$max_page) {
            $mass_page_true[]=$val;
        }
    }            
    $data['mass_page']= json_encode($mass_page_true);    
    return json_encode($data);
}

setlocale(LC_ALL, 'ru_RU.UTF-8');
date_default_timezone_set('Etc/GMT+3');

function copy_folder($d1, $d2, $upd = true, $force = true) {
    if ( is_dir( $d1 ) ) {
        $d2 = mkdir_safe( $d2, $force );
        if (!$d2) {fs_log("!!fail $d2"); return;}
        $d = dir( $d1 );
        while ( false !== ( $entry = $d->read() ) ) {
            if ( $entry != '.' && $entry != '..' ) 
                copy_folder( "$d1/$entry", "$d2/$entry", $upd, $force );
        }
        $d->close();
    }
    else {
        $ok = copy_safe( $d1, $d2, $upd );
        $ok = ($ok) ? "ok-- " : " -- ";
        fs_log("{$ok}$d1"); 
    }
} //function copy_folder

function mkdir_safe( $dir, $force ) {
    if (file_exists($dir)) {
        if (is_dir($dir)) return $dir;
        else if (!$force) return false;
        unlink($dir);
    }
    return (mkdir($dir, 0777, true)) ? $dir : false;
} //function mkdir_safe

function copy_safe ($f1, $f2, $upd) {
    $time1 = filemtime($f1);
    if (file_exists($f2)) {
        $time2 = filemtime($f2);
        if ($time2 >= $time1 && $upd) return false;
    }
    $ok = copy($f1, $f2);
    if ($ok) touch($f2, $time1);
    return $ok;
} //function copy_safe 

function fs_log($str) {
    $log = fopen("./fs_log.txt", "a");
    $time = date("Y-m-d H:i:s");
    fwrite($log, "$str ($time)\n");
    fclose($log);
}

function removeDirectory($dir) {
    if ($objs = glob($dir."/*")) {
       foreach($objs as $obj) {
         is_dir($obj) ? removeDirectory($obj) : unlink($obj);
       }
    }
    rmdir($dir);
}

function Zip($source, $destination){
  if (!extension_loaded('zip') || !file_exists($source)) {
    return false;
  }
 
  $zip = new ZipArchive();
  if (!$zip->open($destination, ZIPARCHIVE::CREATE)) {
    return false;
  }
 
  $source = str_replace('\\', '/', realpath($source));
 
  if (is_dir($source) === true){
    $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($source), RecursiveIteratorIterator::SELF_FIRST);
 
    foreach ($files as $file){
        $file = str_replace('\\', '/', $file);
 
        // Ignore "." and ".." folders
        if( in_array(substr($file, strrpos($file, '/')+1), array('.', '..')) )
            continue;
 
        $file = realpath($file);
        $file = str_replace('\\', '/', $file);
         
        if (is_dir($file) === true){
            $zip->addEmptyDir(str_replace($source . '/', '', $file . '/'));
        }else if (is_file($file) === true){
            $zip->addFromString(str_replace($source . '/', '', $file), file_get_contents($file));
        }
    }
  }else if (is_file($source) === true){
    $zip->addFromString(basename($source), file_get_contents($source));
  }
  return $zip->close();
}

function getPswrdSol($mass) {
    if (empty($mass['sol'])) {
        $sol=random_int(1, 5);
    }
    else {
        $sol=$mass['sol'];
    }    
    $h_password_e=one_sol_array($mass['password'],$sol);
    return json_encode(array('sol'=>$sol,'h_password'=>$h_password_e));
}

?>