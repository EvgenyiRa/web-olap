<?php
/*Web-olap v1.0
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
along with Web-olap.  If not, see <https://www.gnu.org/licenses/>.*/
require_once(realpath('../get-data-func.php'));

class CacheCreateRight
{

    /** */
    public static function run()
    {   
        function one_str_right($val) {
            return '        $mass["'.$val['SYSNAME'].'"]=array("NAME"=>"'.$val['NAME'].'","RIGHTS_ID"=>'.$val['RIGHTS_ID'].');'.PHP_EOL;
        }
        if (!file_exists(__DIR__.'\value\CacheRight.php')) {
            $data=[];
            $conn=conndb();    
            $dbt=db_type();
            $txt='<?php

class CacheRight 
{

    public static function get($sysname=null) {'.PHP_EOL;
            $tsql="SELECT SYSNAME,NAME,RIGHTS_ID
                     FROM REP_RIGHTS";
            if ($dbt=='mssql') {
                $getRows = sqlsrv_query($conn, $tsql); 								
                if(sqlsrv_has_rows($getRows)) {  
                    $rowCount = sqlsrv_num_rows($getRows);  
                    while( $row = sqlsrv_fetch_array( $getRows, SQLSRV_FETCH_ASSOC)) {  
                        $txt.=one_str_right($row);
                    }  							
                }  
                else {
                    $txt.='Что-то пошло не так '.sqlsrv_errors();
                }
                sqlsrv_free_stmt($getRows);
                sqlsrv_close($conn);
            }
            elseif ($dbt=='ora') {
                $stid = oci_parse($conn, $tsql);
                if ($stid) {
                    $r = oci_execute($stid);
                    if ($r) {
                        while ($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS+OCI_RETURN_LOBS)) {
                            $txt.=one_str_right($row);
                        }
                    }
                    else {
                        $e = oci_error($stid);
                        $txt.='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                    }
                    oci_free_statement($stid);
                }
                else {
                    $e = oci_error($conn);
                    $txt.='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
                }
                oci_close($conn);
            }
            $txt.='        if (!empty($sysname)) return $mass[$sysname];';
            $txt.='        return $mass;
    }

}';     

            $fp = fopen(__DIR__."/value/CacheRight.php", "w"); 
            fwrite($fp, $txt);
            // закрываем
            fclose($fp);

    }}
    
    public static function remove()
    {   
        if (file_exists(__DIR__.'\value\CacheRight.php')) {
            unlink(__DIR__.'\value\CacheRight.php');
        }

    }

}