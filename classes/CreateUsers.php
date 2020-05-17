<?php
    require_once(realpath('../get-data-func.php'));
    class CreateUsers {
        private static function getUsers() {
            /*$usrs_list[0]=array('login'=>'g.saurina','fio'=>'Г.Саурина','pswrd'=>'g5rsTZ');
            $usrs_list[1]=array('login'=>'n.naypover','fio'=>'Н.Найповер','pswrd'=>'qPqsqP');
            $usrs_list[2]=array('login'=>'g.potryvaeva','fio'=>'Г.Потрываева','pswrd'=>'GXz9dO');
            $usrs_list[3]=array('login'=>'e.grechko','fio'=>'Е.Гречко','pswrd'=>'WW0yn7');
            $usrs_list[4]=array('login'=>'e.nazeyan','fio'=>'Е.Назеян','pswrd'=>'16hhMD');
            $usrs_list[5]=array('login'=>'t.chan','fio'=>'Т.Чан','pswrd'=>'wO3tnc');
            $usrs_list[6]=array('login'=>'n.prosvetova','fio'=>'Н.Просветова','pswrd'=>'sai9md');
            $usrs_list[8]=array('login'=>'r.tishaninov','fio'=>'Р.Тишанинов','pswrd'=>'Zqwwcg');
            $usrs_list[9]=array('login'=>'o.taranina','fio'=>'О.Таранина','pswrd'=>'aOZCmL');
            $usrs_list[10]=array('login'=>'y.vorobyova','fio'=>'И.Воробьева','pswrd'=>'HkrZ7t');
            $usrs_list[11]=array('login'=>'v.mikhaylova','fio'=>'В.Михайлова','pswrd'=>'1Mljgs');
            $usrs_list[12]=array('login'=>'o.barkina','fio'=>'О.Баркина','pswrd'=>'irllew');
            $usrs_list[13]=array('login'=>'a.akulova','fio'=>'А.Акулова','pswrd'=>'n1DTSc');
            $usrs_list[14]=array('login'=>'n.bokova','fio'=>'Н.Бокова','pswrd'=>'Z2KiZH');
            $usrs_list[15]=array('login'=>'s.chernykh','fio'=>'С.Черных','pswrd'=>'1YQoEC');
            $usrs_list[16]=array('login'=>'e.sklyadneva','fio'=>'Е.Скляднева','pswrd'=>'2m57f7');
            $usrs_list[17]=array('login'=>'m.tarlykova','fio'=>'М.Тарлыкова','pswrd'=>'GeiIKX');
            $usrs_list[18]=array('login'=>'e.maltseva','fio'=>'Е.Мальцева','pswrd'=>'0VW5Ny');
            $usrs_list[19]=array('login'=>'i.sizemova','fio'=>'И.Сиземова','pswrd'=>'VKtNOh');
            $usrs_list[20]=array('login'=>'o.nikulina','fio'=>'О.Никулина','pswrd'=>'g7q35Y');
            $usrs_list[21]=array('login'=>'g.kazakova','fio'=>'Г.Казакова','pswrd'=>'03xk8m');
            $usrs_list[22]=array('login'=>'a.berestova','fio'=>'А.Берестова','pswrd'=>'38nMYA');
            $usrs_list[23]=array('login'=>'e.shvebelman','fio'=>'Е.Швебельман','pswrd'=>'pE5Xjc');
            $usrs_list[24]=array('login'=>'n.dergacheva','fio'=>'Н.Дергачева','pswrd'=>'pE5Xjc');
            $usrs_list[25]=array('login'=>'a.ryzhikov','fio'=>'А.Рыжиков','pswrd'=>'HLTHXJ');
            $usrs_list[26]=array('login'=>'o.kranina','fio'=>'О.Кранина','pswrd'=>'5UNkvn');
            $usrs_list[27]=array('login'=>'t.shirokikh','fio'=>'Т.Широких','pswrd'=>'Fd9etA');
            $usrs_list[28]=array('login'=>'m.sidorova','fio'=>'М.Сидорова','pswrd'=>'qC0a5Y');
            $usrs_list[29]=array('login'=>'m.zhogova','fio'=>'М.Жогова','pswrd'=>'5hWbtd');*/
            $usrs_list[0]=array('login'=>'n.barrukhu','fio'=>'Н.Е.Барруху','pswrd'=>'PZ6SeU');
            $usrs_list[1]=array('login'=>'n.dergacheva','fio'=>'Н.В.Дергачева','pswrd'=>'EPjqMc');
            $usrs_list[2]=array('login'=>'i.povalyaeva','fio'=>'И.В.Поваляева','pswrd'=>'SfVN4V');
            $usrs_list[3]=array('login'=>'e.markina','fio'=>'Е.Е.Маркина','pswrd'=>'3ZSEqR');
            return $usrs_list;
        }
        
        public static function printUsers() {
            $usrs_list=self::getUsers();
            $tab_v='<table><thead>';
            $tab_v.='  <tr>
                         <td>Логин</td>
                         <td>ФИО</td>
                         <td>Пароль</td>
                       </tr>
                    </thead>
                    <tbody>';
            foreach ($usrs_list as $val) {
                $tab_v.='<tr>
                         <td>'.$val['login'].'</td>
                         <td>'.$val['fio'].'</td>
                         <td>'.$val['pswrd'].'</td>
                       </tr>';
            } 
            $tab_v.='</tbody></table>';
            return $tab_v;
        }

        public static function run() { 
            $usrs_list=self::getUsers();
            $conn=conndb();
            $result='';                
            if ($conn) {
                $dbt=db_type();
                if ($dbt=='ora') {
                    $tsql="DECLARE USER_ID_V NUMBER;\n".
                           "BEGIN\n";
                    $sol_v=1;
                    foreach ($usrs_list as $val) {
                        //создаем шифрованный пароль
                        $h_password_e=one_sol_array($val['pswrd'],$sol_v);
                        $tsql.="USER_ID_V:=REP_USERS_ID_SQ.NEXTVAL;\n".
                               "INSERT INTO REP_USERS (USER_ID, FIO, LOGIN, PASSWORD, EMAIL, PHONE, SOL) VALUES (USER_ID_V, '".$val['fio']."', '".$val['login']."', '".$h_password_e."', NULL, NULL, ".$sol_v.");\n".
                               "INSERT INTO REP_USERS_RIGHTS (RUR_ID, USER_ID, RIGHT_ID) VALUES (REP_USERS_RIGHTS_ID_SQ.NEXTVAL, USER_ID_V, 2);\n";
                    }                     
                    $tsql.="END;";
                    $stid = oci_parse($conn, $tsql);
                    if ($stid) {
                        $r = oci_execute($stid);
                        if ($r) {
                            $result='Пользователи успешно созданы';
                        }
                        else {
                            $e = oci_error($stid);
                            $result='Что-то пошло не так '.htmlentities($e['message'], ENT_QUOTES);
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
    }

