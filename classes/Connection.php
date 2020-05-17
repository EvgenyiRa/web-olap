<?php
    class Connection {
        const dbType='mssql';
        const DBDefaultName='*****';
        //ora
        //mssql
        function __construct() {
            
        }
        
        
        public static function get_DB_info($name) {
            $name_up=strtoupper($name);
            $result['*****']=array('database'=>'****','user'=>'*****','password'=>'*****');
            
            return $result[$name_up];

        }
        
        public static function DBDefault() {
            return self::get_DB_info(self::DBDefaultName);
        }

        public static function getConn($param=null) {
            
            if (self::dbType=='ora') {
                if (!empty($param)) {
                    return oci_connect($param['user'], $param['password'], $param['database']);
                }
                else {
                    if (empty($_SESSION['DBAuthName'])) {           
                        $param= self::DBDefault();                        
                    }
                    else {
                        $param= self::get_DB_info($_SESSION['DBAuthName']);
                    }
                    return oci_connect($param['user'], $param['password'], $param['database']);
                }    
            }
            elseif (self::dbType=='mssql') {
                $serverName = "******";  
                $connectionInfo = array("UID" => '**', "PWD" => '******', "Database"=>"******","CharacterSet" => "UTF-8","ReturnDatesAsStrings"=> true);   
                return sqlsrv_connect($serverName, $connectionInfo);
            }
        }
        
    }

