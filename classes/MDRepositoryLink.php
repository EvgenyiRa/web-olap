<!--Web-olap v1.0
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
along with Web-olap.  If not, see <https://www.gnu.org/licenses/>.-->
<?php
    class MDRepositoryLink {
        public static function get($md_sname=null,$md_form_id=null) {
            $result=[];
            $mass['t'][63]=array('all');
            $mass['t'][62]=array('only_data');
            if (!empty($md_sname)) {
                if (!empty($md_form_id)) {
                    $result=$mass[$md_sname][$md_form_id];
                }  
                else {
                    $result=$mass[$md_sname];
                }
            }
            if (count($result)===0) {
                $result=false;
            }
            return $result;
        }
        
        
    }

