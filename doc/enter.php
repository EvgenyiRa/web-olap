<?php
    require_once(realpath('../get-data-func.php'));
    session_start(); 
?>
<!DOCTYPE html>
<html lang="ru-RU">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8; Cache-Control: no-cache"/>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="/js/jquery-3.3.1.js"></script>
        <script src="/js/enter.js"></script>
        <link href="/css/enter.css" rel="stylesheet" type="text/css"/>        
        <title>Аутентификация</title>
    </head>
    <body>
        <img src="/img/loading.gif" id="loading_img" style="margin:0;padding:0;width:480px;height:320px;position:fixed;display:none;z-index: 777;">
        <div id="login" class="login">
            <h2>Авторизация</h2>
            <img for="user" class="icon-user" src="/img/enter_login.png" title="Логин">
            <input class="user" id="user" />
            <img for="password" class="icon-user" src="/img/enter_password.png" title="Пароль">
            <input type="password" class="password" id="password" />
            <label for="remember"><input type="checkbox" id="remember" /><span class="remember"/> Запомнить меня</label>
            <input type="submit" value="Войти" class="but_enter"/>            
        </div>
    </body>

</html>    
    

