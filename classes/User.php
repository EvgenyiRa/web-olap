<?php
    class User {
        function __construct() {
            
        }
                
        public static function getUserInfo() {
            return $_SESSION['user_info'];
        } 
        
        public static function getAuthByToken() {
            require_once(realpath('../get-data-func.php'));
            $data['pr_ok']= 777; 
            if ((!empty($_GET['token'])) & (!empty($_GET['id']))) {
                $dbt=db_type();                
                if ($dbt==='ora') {
                    $_SESSION['DBAuthName']=$_GET['database'];
                }    
                require_once(realpath('../get-data-func.php'));
                $conn=conndb();                    
                if ($conn) {
                    if ($dbt==='ora') {
                        $tsql="SELECT parameters_list,ID
                                 FROM web_token
                                WHERE id = :id
                                  AND guid = :token";
                       $stid = oci_parse($conn, $tsql);
                       if ($stid) {
                           ora_create_params($stid,array(':id'=>$_GET['id'],':token'=>$_GET['token']));
                           $r = oci_execute($stid);
                           if ($r) {
                               $p_list = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS+OCI_RETURN_LOBS);
                               if (!empty($p_list['ID'])) { 
                                    $data['p_list']=$p_list;
                                    oci_free_statement($stid);
                                    //удаляем токен
                                    $tsql="DELETE FROM web_token
                                            WHERE id = :id
                                              AND guid = :token";
                                    $stid = oci_parse($conn, $tsql);
                                    if ($stid) {
                                        ora_create_params($stid,array(':id'=>$_GET['id'],':token'=>$_GET['token']));
                                        $r = oci_execute($stid);
                                        if ($r) {                          
                                            oci_free_statement($stid);
                                            if (!empty($_GET['login'])) {
                                                $login=$_GET['login'];
                                            }
                                            else {
                                                $login='guest';                                            
                                            }
                                            $tsql="SELECT USER_ID,LOGIN,FIO,EMAIL,PHONE,SOL
                                                    FROM REP_USERS
                                                   WHERE LOGIN='".$login."'";
                                           $stid = oci_parse($conn, $tsql);
                                           if ($stid) {
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
                                                              WHERE U.LOGIN='".$login."'";
                                                       $stid = oci_parse($conn, $tsql);
                                                       if ($stid) {
                                                           $r = oci_execute($stid);
                                                           if ($r) {
                                                               $row2 = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS+OCI_RETURN_LOBS);
                                                               if (!empty($row2['USER_ID'])) {
                                                                   $mass_right=[];
                                                                   $mass_right[]=$row2;
                                                                   while( $row2 = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS+OCI_RETURN_LOBS)) {  
                                                                       $mass_right[]=$row2;					
                                                                   }
                                                                   $_SESSION['user_right']=json_encode($mass_right);
                                                                   $_SESSION['user_info']=json_encode($row);
                                                               }
                                                               else {
                                                                   $data['pr_ok']= 44; 
                                                                   $data['err_txt']='Отсутствует запрашиваемый пользователь';
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
                                                       $data['err_txt']='Отсутствует авторизуемый пользователь';
                                                   }
                                               }
                                               else {
                                                   $e = oci_error($stid);
                                                   $data['pr_ok']= 3; 
                                                   $data['err_txt']='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                                               }
                                           }
                                            else {
                                                $e = oci_error($conn);
                                                $data['pr_ok']= 3; 
                                                $data['err_txt']='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                                            }

                                        }
                                        else {
                                            $data['pr_ok']= 46; 
                                            $data['err_txt']='Ошибка удаления токена '.htmlentities($e['message'], ENT_QUOTES);
                                        }
                                    }
                                    else {
                                        $e = oci_error($conn);
                                        $data['pr_ok']= 46; 
                                        $data['err_txt']='Ошибка удаления токена '.htmlentities($e['message'], ENT_QUOTES);
                                    }
                               }
                               else {
                                   $data['pr_ok']= 45; 
                                   $data['err_txt']='Ошибка безопасности: неправильный токен';                           
                               }
                           }
                           else {
                                $e = oci_error($stid);
                                $data['pr_ok']= 3; 
                                $data['err_txt']='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                            }
                       } 
                       else {
                            $e = oci_error($stid);
                            $data['pr_ok']= 3; 
                            $data['err_txt']='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                        }
                    }
                    elseif ($dbt==='mssql') {
                        $tsql="SET NOCOUNT ON;
                               SELECT PARAMETERS_LIST,ID
                                 FROM web_token
                                WHERE id = ?
                                  AND guid = ?;";
                        $getRows = sqlsrv_query($conn, $tsql,array(&$_GET['id'],&$_GET['token']));
                        if(sqlsrv_has_rows($getRows)) {  
                            $row = sqlsrv_fetch_array($getRows, SQLSRV_FETCH_ASSOC);                            
                            sqlsrv_free_stmt($getRows);
                            if (!empty($row['ID'])) {
                                $data['p_list']=$p_list;
                                //удаляем токен
                                $tsql="DELETE FROM web_token
                                        WHERE id = ?
                                          AND guid = ?";
                                $stmt=sqlsrv_prepare($conn, $tsql,array(&$_GET['id'],&$_GET['token']));					 
                                if (sqlsrv_execute($stmt)) {  
                                    sqlsrv_free_stmt($stmt);
                                    if (!empty($_GET['login'])) {
                                        $login=$_GET['login'];
                                    }
                                    else {
                                        $login='guest';                                            
                                    }
                                    $tsql="SELECT USER_ID,LOGIN,FIO,EMAIL,PHONE,SOL
                                            FROM REP_USERS
                                           WHERE LOGIN=?";
                                    $getRows = sqlsrv_query($conn, $tsql,array(&$login));
                                    if(sqlsrv_has_rows($getRows)) {
                                        $rowUser = sqlsrv_fetch_array($getRows, SQLSRV_FETCH_ASSOC);                            
                                        sqlsrv_free_stmt($getRows);
                                        if (!empty($rowUser['USER_ID'])) {
                                            $tsql="SELECT U.USER_ID,R.RIGHTS_ID,R.NAME RIGHTS_NAME,R.SYSNAME RIGHTS_SYSNAME
                                                    FROM REP_USERS U
                                                    JOIN REP_USERS_RIGHTS UR
                                                      ON UR.USER_ID=U.USER_ID
                                                    JOIN REP_RIGHTS R 
                                                      ON R.RIGHTS_ID=UR.RIGHT_ID 
                                                   WHERE U.LOGIN=?";
                                            $getRows = sqlsrv_query($conn, $tsql,array(&$login));
                                            if(sqlsrv_has_rows($getRows)) {
                                                $row = sqlsrv_fetch_array( $getRows, SQLSRV_FETCH_ASSOC);
                                                if (!empty($row['USER_ID'])) {
                                                    $mass_right=[];
                                                    $mass_right[]=$row;
                                                    while($row = sqlsrv_fetch_array( $getRows, SQLSRV_FETCH_ASSOC)) {
                                                        $mass_right[]=$row;                                                    
                                                    }
                                                    $_SESSION['user_right']=json_encode($mass_right);
                                                    $_SESSION['user_info']=json_encode($rowUser);
                                                }
                                                else {
                                                    $data['pr_ok']= 4; 
                                                    $data['err_txt']='Отсутствует авторизуемый пользователь';
                                                }
                                                sqlsrv_free_stmt($getRows);
                                            }
                                            else {
                                                $data['pr_ok']= 3; 
                                                $data['err_txt']='Что-то пошло не так '.sqlsrv_errors();
                                            }
                                        }
                                        else {
                                            $data['pr_ok']= 4; 
                                            $data['err_txt']='Отсутствует авторизуемый пользователь';
                                        }
                                    }
                                    else {
                                        $data['pr_ok']= 3; 
                                        $data['err_txt']='Что-то пошло не так '.sqlsrv_errors();
                                    }
                                }  
                                else {  
                                    $data['pr_ok']= 46; 
                                    $data['err_txt']='Ошибка удаления токена '.sqlsrv_errors();
                                }                                  
                            }
                            else {
                                $data['pr_ok']= 45; 
                                $data['err_txt']='Ошибка безопасности: неправильный токен'; 
                            }
                        }  
                        else {
                            $data['pr_ok']= 3; 
                            $data['err_txt']='Что-пошло не так '.sqlsrv_errors();
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
            return $data;
        }
        
    }

