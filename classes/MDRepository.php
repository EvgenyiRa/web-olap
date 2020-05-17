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
    class MDRepository {
        private static $dir=__DIR__.'/masterdata';
                
        function __construct() {
            
        }
        
        public static function exist($sname) {
            $result['exist']=0;
            $f = scandir(self::$dir);
            foreach ($f as $file) {
                if (strlen($file)>2) {
                    if ($sname.'.php'==$file) {
                        $result['exist']=1;
                        break;
                    }
                }
            }
            if ($result['exist']===1) {
                $name_f_ml=__DIR__.'/MDRepositoryLink.php';
                require_once($name_f_ml);
                $m_link=MDRepositoryLink::get($sname);
                if ($m_link) {
                    foreach ($m_link as $key=>$val) {
                        $form_class_name='FormValue_'.$key;
                        require_once(__DIR__.'/forms/'.$form_class_name.'.php');
                        $form_class = new $form_class_name();
                        $data[$key]['name']=$form_class->getName();
                        $data[$key]['sname']=$form_class->getSName();
                        $data[$key]['mdr_str']=$val;
                    }
                    $result['forms']=$data;
                }
            }
            return json_encode($result);
        }
        
        public static function save($mass) {
            $class_path=__DIR__.'/masterdata/'.$mass['md_sname'].'.php';
            $class_value="<?php
class ".$mass['md_sname']."
    {
        public static function getMD(\$olap_id=null)
        {
            \$result='".str_replace('id="'.$mass['olap_id'].'"','id="##"',str_replace("'" , "\'", $mass['md']))."';
            if (!empty(\$olap_id)) {
                \$result=str_replace('id=\"##\"','id=\"'.\$olap_id.'\"',\$result);
            }
            return \$result;
        }
        
        public static function getName()
        {
            return '".str_replace ("'" , "\'", $mass['md_name'])."';
        }
        
        public static function getSQL()
        {
            return '".str_replace ("'" , "\'", $mass['sql'])."';
        }
    }";    
            file_put_contents( $class_path , $class_value); 
            return 'успех';
        }
        
        public static function allTR() {
            $result='<table class="tab_struct_load" id="mdr_all_name">
                            <thead>
                                <tr>
                                    <td>Сис. наименование</td>
                                    <td>Наименование</td>
                                 </tr>
                            </thead>
                            <tbody class="usr_tbody_active">';                            
            //$dir=__DIR__.'/masterdata';
            $f = scandir(self::$dir);
            foreach ($f as $file) {
                if (strlen($file)>2) {
                    require_once(self::$dir.'/'.$file);
                    $m_class=explode(".", $file);
                    $result.='<tr><td id="sname">'.$m_class[0].'</td><td id="name">'.call_user_func(array($m_class[0], 'getName')).'</td></tr>'."\r\n";                    
                }
            }
            $result.='</tbody></table>';
            return $result;
        }
        
        public static function getMD($mass) {
            require_once(self::$dir.'/'.$mass['sname'].'.php');
            if ($mass['olap_id']) {
                return call_user_func_array(array($mass['sname'], 'getMD'),array($mass['olap_id']));
            }
            else {
                return call_user_func(array($mass['sname'], 'getMD'));
            }
        }
                
        public static function saveMDLink($mass) {
            $name_f_ml=__DIR__.'/MDRepositoryLink.php';
            require_once($name_f_ml);
            $f_value=file_get_contents($name_f_ml);
            if ($mass['md_sname_old']) {
                $class_search=$mass['md_sname_old'];
            }
            else {
                $class_search=$mass['md_sname'];
            }
            $m_link=MDRepositoryLink::get($class_search,$mass['rep_id']);
            if ($m_link) {
                $str_rep='$mass[\''.$class_search.'\']['.$mass['rep_id'].']=array(';
                foreach ($m_link as $val) {
                    $str_rep.='\''.$val.'\',';
                }
                $str_rep=substr($str_rep, 0, -1);
                $str_rep.=');';
                $f_value=str_replace($str_rep, 
                                    '$mass[\''.$mass['md_sname'].'\']['.$mass['rep_id'].']=array(\''.$mass['mdr_str'].'\');' , $f_value);
            }
            else {
                $f_value=str_replace('$result=[];', 
                                     '$result=[];'."\r\n".
                        '            $mass[\''.$mass['md_sname'].'\']['.$mass['rep_id'].']=array(\''.$mass['mdr_str'].'\');' , $f_value);
            }
            file_put_contents( $name_f_ml , $f_value); 
        }
    }

