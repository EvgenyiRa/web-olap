DECLARE USER_ID_V NUMBER;
		CAT_TYPE_V NUMBER;
		CAT_ID_V NUMBER;
		FORM_ID NUMBER;
BEGIN
  INSERT INTO REP_RIGHTS (RIGHTS_ID, NAME, SYSNAME) VALUES (1, 'Редактирование формы', 'Edite');
  INSERT INTO REP_RIGHTS (RIGHTS_ID, NAME, SYSNAME) VALUES (2, 'Просмотр формы', 'View');
  INSERT INTO REP_RIGHTS (RIGHTS_ID, NAME, SYSNAME) VALUES (1002, 'Удаление формы', 'Delete');
  INSERT INTO REP_RIGHTS (RIGHTS_ID, NAME, SYSNAME) VALUES (1004, 'Администрирование пользователей', 'Admin');
  
  USER_ID_V:=REP_USERS_ID_SQ.NEXTVAL;
  INSERT INTO REP_USERS (USER_ID, FIO, LOGIN, PASSWORD, EMAIL, PHONE, SOL) VALUES (USER_ID_V, 'admin', 'admin', '$2a$10$eSb3zD5nD4diakkyY.oRNesqQcd4EupReB2YhOMxZDaIWLQHUPsKy', NULL, NULL, 1);
  INSERT INTO REP_USERS_RIGHTS (RUR_ID, USER_ID, RIGHT_ID) VALUES (REP_USERS_RIGHTS_ID_SQ.NEXTVAL, USER_ID_V, 1);
  INSERT INTO REP_USERS_RIGHTS (RUR_ID, USER_ID, RIGHT_ID) VALUES (REP_USERS_RIGHTS_ID_SQ.NEXTVAL, USER_ID_V, 2);
  INSERT INTO REP_USERS_RIGHTS (RUR_ID, USER_ID, RIGHT_ID) VALUES (REP_USERS_RIGHTS_ID_SQ.NEXTVAL, USER_ID_V, 1002);
  INSERT INTO REP_USERS_RIGHTS (RUR_ID, USER_ID, RIGHT_ID) VALUES (REP_USERS_RIGHTS_ID_SQ.NEXTVAL, USER_ID_V, 1004);    
  USER_ID_V:=REP_USERS_ID_SQ.NEXTVAL;
  INSERT INTO REP_USERS (USER_ID, FIO, LOGIN, PASSWORD, EMAIL, PHONE, SOL) VALUES (USER_ID_V, 'guest', 'guest', '$2a$10$eSb3zD5nD4diakkyY.oRNesqQcd4EupReB2YhOMxZDaIWLQHUPsKy', NULL, NULL, 1);
  INSERT INTO REP_USERS_RIGHTS (RUR_ID, USER_ID, RIGHT_ID) VALUES (REP_USERS_RIGHTS_ID_SQ.NEXTVAL, USER_ID_V, 2);
  
  CAT_TYPE_V:=REP_CATEGORY_TYPE_ID_SQ.NEXTVAL;
  insert into REP_CATEGORY_TYPE (id, sysname, name) values (CAT_TYPE_V, 'menu', 'Меню');
  CAT_ID_V:=REP_CATEGORY_VALUE_ID_SQ.NEXTVAL;
  insert into REP_CATEGORY_VALUE (ID, CAT_ID, N_VALUE, S_VALUE, NUM_ORDER, PARENT_CAT_ID) values (CAT_ID_V, CAT_TYPE_V, 'Администрирование', 'admin', 777, null);
  FORM_ID:=REP_DATA_ID_SQ.NEXTVAL;
  insert into REP_DATA (ID, NAME, SYSNAME, USER_LAST_ID)
	   values (FORM_ID, 'Главная', 'gen', 1);
  FORM_ID:=REP_DATA_ID_SQ.NEXTVAL;  
  insert into REP_DATA (ID, NAME, SYSNAME, USER_LAST_ID)
	   values (FORM_ID, 'Пользователи', 'admin',1);
  insert into REP_CATEGORY_LINKS (ID, CAT_ID, OBJ_ID) values (REP_CATEGORY_LINKS_ID_SQ.NEXTVAL, CAT_ID_V, FORM_ID);
  COMMIT;
END;  
