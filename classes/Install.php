<?php
    require_once(realpath('../get-data-func.php'));
    require_once(__DIR__.'/CacheCreateCommon.php');
    class Install {
                
        function __construct() {
            
        }
        
        public static function run() {
            //признаком установки считаем наличие таблицы в БД
            $conn=conndb();
            $result='';                
            if ($conn) {
                $dbt=db_type();
                if ($dbt=='ora') {
                    $tsql="SELECT TABLE_NAME
                            FROM ALL_TABLES
                           WHERE TABLE_NAME = 'REP_DATA'";
                    $stid = oci_parse($conn, $tsql);
                    if ($stid) {
                        $r = oci_execute($stid);
                        if ($r) {
                            $row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS+OCI_RETURN_LOBS);
                            if (empty($row['TABLE_NAME'])) {
                                oci_free_statement($stid);
                                $tsql=file_get_contents('../doc/sql/ora/createtable.sql');
                                $stid = oci_parse($conn, $tsql);
                                if ($stid) {
                                    $r = oci_execute($stid);
                                    if ($r) {
                                        $result="Таблицы успешно созданы. ";
                                        oci_free_statement($stid);
                                        $tsql=file_get_contents('../doc/sql/ora/begin_insert.sql');
                                        $stid = oci_parse($conn, $tsql);
                                        if ($stid) {
                                            $r = oci_execute($stid);
                                            if ($r) {
                                                $result.="Данные успешно инициализированы. ";
                                                oci_free_statement($stid);
                                                //Обновление кэша
                                                CacheCreateCommon::remove();
                                                CacheCreateCommon::run();
                                                $result.="Кэш создан.";
                                            }
                                            else {
                                                $e = oci_error($stid);
                                                $result.='Что-то пошло не так при инициализации данных: '.htmlentities($e['message'], ENT_QUOTES);
                                            }
                                        }
                                        else {
                                            $e = oci_error($conn);
                                            $result='Что-то пошло не так при создании таблиц, не парсится: '.htmlentities($e['message'], ENT_QUOTES);
                                        }
                                    }
                                    else {
                                        $e = oci_error($stid);
                                        $result='Что-то пошло не так при создании таблиц: '.htmlentities($e['message'], ENT_QUOTES);
                                    }
                                }
                                else {
                                    $e = oci_error($conn);
                                    $result='Что-то пошло не так при создании таблиц, не парсится: '.htmlentities($e['message'], ENT_QUOTES);
                                }
                            }
                            else {
                                $result='Акстись, все уже установлено';
                                oci_free_statement($stid);
                            }
                        }
                        else {
                            $e = oci_error($stid);
                            $result.='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                        }                       
                    }
                    else {
                        $e = oci_error($conn);
                        $result='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                    }
                    oci_close($conn);
                }
                elseif ($dbt=='mssql') {

                }
            }
            else {
                $result='Отсутствует конект к БД';
            }
            return $result;
        }
        
        public static function update() {
            $conn=conndb();
            $result='';                
            if ($conn) {
                $dbt=db_type();
                if ($dbt=='ora') {   
                    function file_exec($conn,$dir,$file) {
                        if (strlen($file)>2) {
                            $f_name=$dir.'/'.$file;
                            $tsql=file_get_contents($f_name);
                            $stid = oci_parse($conn, $tsql);
                            if ($stid) {
                                $r = oci_execute($stid);
                                if ($r) {
                                    $result.="<h2>Обновления для файла ".$f_name." успешно установлены</h2>";
                                    oci_free_statement($stid);                                
                                }
                                else {
                                    $e = oci_error($stid);
                                    $result.='<h2>Что-то пошло не так при обновлении для файла '.$f_name.': '.htmlentities($e['message'], ENT_QUOTES).'</h2>';
                                }
                            }
                            else {
                                $e = oci_error($conn);
                                $result.='<h2>Что-то пошло не так при обновлении для файла '.$f_name.', не парсится: '.htmlentities($e['message'], ENT_QUOTES).'</h2>';
                            } 
                            return $result;
                        }
                    }
                    $dir=('../doc/sql/ora/update/DDL');
                    $f = scandir($dir);
                    //print_r($f);
                    foreach ($f as $file) {
                        $result.=file_exec($conn,$dir,$file);
                    }
                    $dir=('../doc/sql/ora/update/DML');
                    $f = scandir($dir);
                    foreach ($f as $file) {
                        $result.=file_exec($conn,$dir,$file);
                    }
                    //Обновление кэша
                    CacheCreateCommon::remove();
                    CacheCreateCommon::run();
                    $result.="<h2>Кэш создан.</h2>";
                    oci_close($conn);
                }
                elseif ($dbt=='mssql') {

                }
            }
            else {
                $result='Отсутствует конект к БД';
            }
            return $result;
        }
        
        public static function sqlToClasses() {
            //признаком установки считаем наличие таблицы в БД
            $conn=conndb();
            $result='';                
            if ($conn) {
                $dbt=db_type();
                if ($dbt=='ora') {
                    $tsql="select t.ID,t.DATA
                             from REP_DATA t";
                    $stid = oci_parse($conn, $tsql);
                    if ($stid) {
                        $r = oci_execute($stid);
                        if ($r) {
                            while ($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS+OCI_RETURN_LOBS)) {
                                $class_path=__DIR__.'/forms/FormValue'.$row['ID'].'.php';
                                $class_value="<?php
class FormValue".$row['ID']."
    {
        public static function get()
        {
            return '".str_replace ("'" , "\'", base64_decode($row['DATA']))."';
        }
    }";    
                                file_put_contents( $class_path , $class_value);                                
                            }
                            $result='Готово!';
                        }
                        else {
                            $e = oci_error($conn);
                            $result='Что-то пошло не так при создании таблиц '.htmlentities($e['message'], ENT_QUOTES);
                        }
                    }  
                    else {
                        $e = oci_error($conn);
                        $result='Что-то пошло не так, не парсится '.htmlentities($e['message'], ENT_QUOTES);
                    }
                    oci_close($conn);
                }
                elseif ($dbt=='mssql') {

                }
            }
            else {
                $result='Отсутствует конект к БД';
            }
            return $result;
        }
    }

