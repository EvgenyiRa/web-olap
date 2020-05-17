/*--Web-olap v1.0
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
$(document).ready(function() {
    
    $("div#my" ).on("click", ".table_graf", function(e) {        
        console.log('работает');
        var id_t=this.id;
        var newWin = window.open('/graf.php', '3D-график OLAP-куба', 'width=800,height=600');

        newWin.onload = function() {
          var newWin_doc=newWin.document;
          //container = $('div.tree_graf');  
          /*// создать div в документе нового окна
          var div = newWin.document.createElement('div'),
              body = newWin.document.body;

          div.innerHTML = 'Добро пожаловать!'
          div.style.fontSize = '30px'

          // вставить первым элементом в body нового окна
          body.insertBefore(div, body.firstChild);*/
        }        
    });
});