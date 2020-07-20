<?php
/*WEB-OLAP v1.0
Copyright 2020 Rassadnikov Evgeniy Alekseevich

This file is part of WEB-OLAP.

WEB-OLAP is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

WEB-OLAP is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with WEB-OLAP.  If not, see <https://www.gnu.org/licenses/>.*/
require_once(realpath('../get-data-func.php'));

class CacheCreateCommon
{

    /** */
    public static function run()
    {   
        if (!file_exists(__DIR__.'\CacheCommonMenu.php')) {
            $data=[];
            $conn=conndb();    
            $dbt=db_type();
            $txt='<?php

class CacheCommonMenu 
{

    public static function get() {'.PHP_EOL;
            $tsql="SELECT RCV.ID,
                            RCV.NUM_ORDER,
                            RCV.N_VALUE,
                            RCV.S_VALUE,
                            CASE WHEN (SELECT COUNT(1)       
                                         FROM REP_CATEGORY_VALUE RCV2
                                         JOIN REP_CATEGORY_TYPE RCT2
                                           ON RCT2.ID=RCV2.CAT_ID 
                                         WHERE RCT2.SYSNAME='menu'
                                           AND NVL(RCV2.PARENT_CAT_ID,-1)=RCV.ID
                                       )=0 THEN 0
                                 ELSE 1
                            END IS_TREE,
                            RCL.OBJ_ID FORM_ID,
                            RD.NAME FORM_NAME,
                            RD.SYSNAME FORM_SNAME     
                     FROM REP_CATEGORY_VALUE RCV
                     JOIN REP_CATEGORY_TYPE RCT
                       ON RCT.ID=RCV.CAT_ID 
                     LEFT JOIN REP_CATEGORY_LINKS  RCL
                       ON RCL.CAT_ID=RCV.ID
                     LEFT JOIN REP_DATA RD
                       ON RD.ID=RCL.OBJ_ID  
                     WHERE RCT.SYSNAME='menu'
                       AND COALESCE(RCV.PARENT_CAT_ID,-1)=-1
                     ORDER BY RCV.NUM_ORDER,RD.NAME";
            if ($dbt=='mssql') {
                $getRows = sqlsrv_query($conn, $tsql,$params); 								
                if(sqlsrv_has_rows($getRows)) {  
                    $rowCount = sqlsrv_num_rows($getRows);  
                    while( $row = sqlsrv_fetch_array( $getRows, SQLSRV_FETCH_ASSOC)) {  
                        $sql_m[]=$row;
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
                    ora_create_params($stid,$params);
                    $r = oci_execute($stid);
                    if ($r) {
                        while ($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS+OCI_RETURN_LOBS)) {
                            //$txt.=one_str($row);
                            $sql_m[]=$row;
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
            
            $sql_u=unique_multidim_array($sql_m,'ID');
            /*function one_str($row) {
                $data='        $mass[]=array(';
                foreach($row as $key=>$val) {  
                    $data.='"'.$key.'"=>"'.$val.'",';
                } 
                $data=substr($data, 0, -1);
                $data.=');'.PHP_EOL;
                return $data;
            }*/
            //var_dump($sql_u);
            foreach($sql_u as $key=>$val) {
                $txt.='        $mass['.$val['ID'].']=array("NUM_ORDER"=>"'.$val['NUM_ORDER'].'","N_VALUE"=>"'.$val['N_VALUE'].'","S_VALUE"=>"'.$val['S_VALUE'].'","IS_TREE"=>"'.$val['IS_TREE'].'"';
                if (trim($val['FORM_ID'])!='') {
                    $num_f=0;
                    $txt.=',"FORMS"=>array(';                
                    foreach($sql_m as $key2=>$val2) { 
                        if ($val2['ID']==$val['ID']) {
                            $txt.=PHP_EOL.'                        '.$val['FORM_ID'].'=>array("FORM_NAME"=>"'.$val2['FORM_NAME'].'","FORM_SNAME"=>"'.$val2['FORM_SNAME'].'")';
                        }    
                    }
                    $txt.=')';
                }
                $txt.=');'.PHP_EOL;
            }
            
            $txt.='        return $mass;
    }

}';     

            $fp = fopen(__DIR__."\CacheCommonMenu.php", "w"); 
            fwrite($fp, $txt);
            // закрываем
            fclose($fp);

    }}
    
    public static function remove()
    {   
        if (file_exists(__DIR__.'\CacheCommonMenu.php')) {
            unlink(__DIR__.'\CacheCommonMenu.php');
        }

    }

}