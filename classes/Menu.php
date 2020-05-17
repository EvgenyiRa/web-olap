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
    require_once(__DIR__.'/CacheCommonMenu.php');
    class Menu {
        public $mass_menu;
        public $cat_id;
        public $form_id;
        protected $right_all;
                
        function __construct($cat_id,$form_id,$right_all) {
            $this->mass_menu=CacheCommonMenu::get();
            $this->cat_id=$cat_id;
            if (empty($this->cat_id)) {
                $this->cat_id=-1;
            }
            $this->form_id=$form_id;
            if (empty($this->form_id)) {
                $this->form_id=-1;
            }            
            //делаем активной первую форму в категории если она выбрана и существует форма в категории
            if ($this->cat_id!=-1) {
                if ($this->form_id==-1) {
                    if (!empty($this->mass_menu[$this->cat_id]['FORMS'])) {
                        $this->form_id=getFirstKeyArray($this->mass_menu[$this->cat_id]['FORMS']);
                        //var_dump($this->form_id);                        
                    }
                    else {
                        $this->form_id=get_gen_form_id();
                    }
                }
                //$this->form_id=get_gen_form_id();
            }
            elseif ($this->form_id==-1) {
                $this->form_id=get_gen_form_id();
            }
            $this->right_all=$right_all;
        }
        
        public function getTopLi() {
            $mass_menu=$this->mass_menu;
            $data='';
            foreach($mass_menu as $key=>$val) { 
                if ($val['S_VALUE']=='admin') {
                    $user=json_decode($_SESSION['user_info'],true);
                    $user_right=json_decode($_SESSION['user_right'],true); 
                    $right_admin=exists_right($user_right,'Admin');
                    if ($right_admin) {
                        $data.=PHP_EOL.'            <li '.(($key==$this->cat_id) ? 'class="active" ':'').'>
                                    <a href="/index.php?cat_id='.$key.'" id="'.$val["S_VALUE"].'">'.$val["N_VALUE"].'</a>
                                </li>';
                    }
                }
                else {
                    $data.=PHP_EOL.'            <li '.(($key==$this->cat_id) ? 'class="active" ':'').'>
                                <a href="/index.php?cat_id='.$key.'" id="'.$val["S_VALUE"].'">'.$val["N_VALUE"].'</a>
                            </li>';
                }    
            }            
            return $data;
        }
        
        public function getUlForms() {
            $data='';
            if ($this->cat_id!=-1) {
                $user=json_decode($_SESSION['user_info'],true);
                $user_right=json_decode($_SESSION['user_right'],true); 
                $right_view=exists_right($user_right,'View');
                $right_edite=exists_right($user_right,'Edite');
                $right_delete=exists_right($user_right,'Delete');
                $data='<ul class="left-side-menu">
                            <li>
                                <a id="'.$this->mass_menu[$this->cat_id]["S_VALUE"].'">'.$this->mass_menu[$this->cat_id]["N_VALUE"].'</a><a class="close_left_menu" title="Скрыть меню"><img src="/img/rep_del.png" title="Скрыть меню"></a>'.(($right_edite) ? '<a class="rep_edite" id="new" href="/rep_add.php?cat_id='.$this->cat_id.'"><img src="/img/report_add.png" title="Создать форму"></a>':'').
                            '</li>';                
                if (!empty($this->mass_menu[$this->cat_id]['FORMS'])) {                    
                    if ($right_view) {
                        $forms=$this->mass_menu[$this->cat_id]['FORMS'];                        
                        foreach($forms as $key=>$val) {
                            $vis_form=true;
                            $right_for_form='vis_form_'.$key;
                            if (!empty($this->right_all[$right_for_form])) {
                                if (!exists_right($user_right,$right_for_form)) {
                                    $vis_form=false;
                                }
                            }
                            if ($vis_form) {
                                $data.='<li '.(($key==$this->form_id) ? 'class="active" ':'').'>
                                            <a href="/index.php?cat_id='.$this->cat_id.'&form_id='.$key.'" sname="'.$val['FORM_SNAME'].'">'.$val['FORM_NAME'].'</a>'.(($right_delete) ? '<a class="rep_del" id="'.$key.'"><img src="/img/rep_del.png" title="Удалить форму"></a>':'').(($right_edite) ? '<a class="rep_edite" id="'.$key.'" href="/rep_add.php?id='.$key.'"><img src="/img/rep_edite.png" title="Редактировать форму"></a>':'').'
                                        </li>';
                            }    
                        }                                                
                    }    
                }
                $data.='</ul>';
            }
            return $data;
        }
        
        public function getFormID() {
            return $this->form_id;
        }
    }

