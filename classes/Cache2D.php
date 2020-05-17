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
    class Cache2D {
        private static $dir=__DIR__.'/cacheOLAP2D';
                
        function __construct() {
            
        }
        
       
        
        public static function run($tab_temp,$rows,$stid,$mass_vis,$mass_unvis,$tab_id,$tableDefPage) {
            $dir_str_block='../classes/cacheOLAP2D/beg_file/'.$tab_temp;
            $tek_dir=self::$dir.'/'.$tab_temp;
            mkdir($tek_dir);   
            //чистим директорию
            $f = scandir($tek_dir);
            foreach ($f as $file) {
                if (strlen($file)>2) {
                    unlink($tek_dir.'/'.$file);                 
                }
            }                        
            
            $tek_page=1;            
            $class_name='_'.$tek_page;
            $class_path= $tek_dir.'/'.$class_name.'.php';            
            $class_value="<?php
class ".$class_name."
    {
        public static function getRows()
        {
            return '".$rows."';
         }                
    }"; 
            //кладем сразу первую страницу
            file_put_contents( $class_path , $class_value);
            $class_name='_'.(++$tek_page);
            $class_path= $tek_dir.'/'.$class_name.'.php';
            $key=0;
            $class_value="<?php
class ".$class_name."
    {
        public static function getRows()
        {
            return '";
            while ($val = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS+OCI_RETURN_LOBS)) {
                ++$key;
                if ($key>$tableDefPage) {
                    $class_value.="';
        }                
    }";    
                    $key=0;
                    clearstatcache();            
                    $str_block=file_exists($dir_str_block);
                    if (!$str_block) {
                        //чистим директорию
                        $f = scandir($tek_dir);
                        foreach ($f as $file) {
                            if (strlen($file)>2) {
                                unlink($tek_dir.'/'.$file);                 
                            }
                        } 
                        return false;
                    }
                    file_put_contents( $class_path , $class_value);
                    $class_name='_'.(++$tek_page);
                    $class_path= $tek_dir.'/'.$class_name.'.php';
                    $class_value="<?php
class ".$class_name."
    {
        public static function getRows()
        {
            return '";
                }
                 $class_value.=olap_one_str_2D($val,$mass_vis,$mass_unvis,$tab_id,true);
            }
$class_value.="';
        }                
    }";      
            if ($key!==0) {
                file_put_contents( $class_path , $class_value); 
            }  
            unlink($dir_str_block);
            return true;
        }  
        
    }

