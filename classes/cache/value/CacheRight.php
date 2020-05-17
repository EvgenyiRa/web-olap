<?php

class CacheRight 
{

    public static function get($sysname=null) {
        $mass["Edite"]=array("NAME"=>"Редактирование формы","RIGHTS_ID"=>1);
        $mass["View"]=array("NAME"=>"Просмотр формы","RIGHTS_ID"=>2);
        $mass["Delete"]=array("NAME"=>"Удаление формы","RIGHTS_ID"=>1002);
        $mass["Admin"]=array("NAME"=>"Администрирование пользователей","RIGHTS_ID"=>1004);
        if (!empty($sysname)) return $mass[$sysname];        return $mass;
    }

}