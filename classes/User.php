<?php
    class User {
        function __construct() {
            
        }
                
        public static function getUserInfo() {
            return $_SESSION['user_info'];
        }                
        
    }

