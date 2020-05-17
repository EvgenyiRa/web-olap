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
BEGIN 
	-- Create table
	EXECUTE IMMEDIATE 'create table REP_DATA
						(
						  id           NUMBER(5) not null,
						  name         NVARCHAR2(500) not null,
						  sysname      NVARCHAR2(50),
						  user_last_id NUMBER(7)
						)';
-- Create/Recreate indexes 
	EXECUTE IMMEDIATE 'create index RDU on REP_DATA (USER_LAST_ID)';
	-- Create/Recreate primary, unique and foreign key constraints 
	EXECUTE IMMEDIATE 'alter table REP_DATA
						  add constraint PK_REP_DATA primary key (ID)';

-- Create table
	EXECUTE IMMEDIATE 'create table REP_DATA_SET
						(
						  id      NUMBER(5) not null,
						  rep_id  NUMBER(5) not null,
						  name    NVARCHAR2(250),
						  sysname NVARCHAR2(50)
						)';
-- Create/Recreate primary, unique and foreign key constraints 
	EXECUTE IMMEDIATE 'alter table REP_DATA_SET
						  add constraint PK_REP_DATA_SET primary key (ID)';

-- Create table
	EXECUTE IMMEDIATE 'create table REP_DATA_SET_VALUE
						(
						  id     NUMBER(17) not null,
						  set_id NUMBER(5) not null,
						  value  NVARCHAR2(2000) not null
						)';
-- Create/Recreate indexes 
	EXECUTE IMMEDIATE 'create index IX_REP_DATA_SET_VALUE on REP_DATA_SET_VALUE (SET_ID)';
-- Create/Recreate primary, unique and foreign key constraints 
	EXECUTE IMMEDIATE 'alter table REP_DATA_SET_VALUE
						  add constraint PK_REP_DATA_SET_VALUE primary key (ID)';

-- Create table
	EXECUTE IMMEDIATE 'create table REP_USERS
						(
						  user_id  NUMBER(17) not null,
						  fio      NVARCHAR2(500) not null,
						  login    NVARCHAR2(200) not null,
						  password NVARCHAR2(200) not null,
						  email    NVARCHAR2(500),
						  phone    NVARCHAR2(100),
						  sol      NUMBER(3)
						)';
-- Create/Recreate indexes 
	EXECUTE IMMEDIATE 'create unique index ULPU on REP_USERS (LOGIN, PASSWORD)';
-- Create/Recreate primary, unique and foreign key constraints 
	EXECUTE IMMEDIATE 'alter table REP_USERS
						  add constraint PK_REP_USERS primary key (USER_ID)';

-- Create table
	EXECUTE IMMEDIATE 'create table REP_RIGHTS
						(
						  rights_id NUMBER(5) not null,
						  name      NVARCHAR2(500) not null,
						  sysname   NVARCHAR2(500) not null
						)';
-- Create/Recreate primary, unique and foreign key constraints 
	EXECUTE IMMEDIATE 'alter table REP_RIGHTS
						  add constraint PK_REP_RIGHTS primary key (RIGHTS_ID)';

-- Create table
	EXECUTE IMMEDIATE 'create table REP_USERS_RIGHTS
						(
						  rur_id   NUMBER(17) not null,
						  user_id  NUMBER(17) not null,
						  right_id NUMBER(5) not null
						)';
-- Create/Recreate indexes 
	EXECUTE IMMEDIATE 'create unique index URU on REP_USERS_RIGHTS (USER_ID, RIGHT_ID)';
-- Create/Recreate primary, unique and foreign key constraints 
	EXECUTE IMMEDIATE 'alter table REP_USERS_RIGHTS
						  add constraint PK_REP_USERS_RIGHTS primary key (RUR_ID)';
  
-- Create table
	EXECUTE IMMEDIATE 'create table REP_CATEGORY_TYPE
						(
						  id      NUMBER(5) not null,
						  sysname NVARCHAR2(50) not null,
						  name    NVARCHAR2(250) not null
						)';
-- Add comments to the table 
	EXECUTE IMMEDIATE 'comment on table REP_CATEGORY_TYPE
						is ''Таблица типов категорий''';
-- Create/Recreate primary, unique and foreign key constraints 
	EXECUTE IMMEDIATE 'alter table REP_CATEGORY_TYPE
						  add constraint PK_REP_CAT_TYPE_ID primary key (ID)';
	EXECUTE IMMEDIATE 'alter table REP_CATEGORY_TYPE
						  add constraint UN_REP_CAT_TYPE_NAME unique (NAME)';
	EXECUTE IMMEDIATE 'alter table REP_CATEGORY_TYPE
						  add constraint UN_REP_CAT_TYPE_SYSNAME unique (SYSNAME)';

-- Create table
	EXECUTE IMMEDIATE 'create table REP_CATEGORY_VALUE
						(
						  id            NUMBER(18) not null,
						  cat_id        NUMBER(5) not null,
						  n_value       NVARCHAR2(500) not null,
						  s_value       NVARCHAR2(100) not null,
						  num_order     NUMBER(5),
						  parent_cat_id NUMBER(18)
						)';
-- Add comments to the table 
	EXECUTE IMMEDIATE 'comment on table REP_CATEGORY_VALUE
						is ''Таблица значений категорий''';
-- Create/Recreate indexes 
	EXECUTE IMMEDIATE 'create index X_REP_CATVAL_PAR on REP_CATEGORY_VALUE (PARENT_CAT_ID)';
-- Create/Recreate primary, unique and foreign key constraints 
	EXECUTE IMMEDIATE 'alter table REP_CATEGORY_VALUE
						  add constraint PK_REP_CAT_VAL_ID primary key (ID)';
	EXECUTE IMMEDIATE 'alter table REP_CATEGORY_VALUE
						  add constraint UN_REP_CATVALOBJ_NV unique (CAT_ID, N_VALUE)';
	EXECUTE IMMEDIATE 'alter table REP_CATEGORY_VALUE
						  add constraint UN_REP_CATVALOBJ_SV unique (CAT_ID, S_VALUE)';

-- Create table
	EXECUTE IMMEDIATE 'create table REP_CATEGORY_LINKS
						(
						  id     NUMBER(18) not null,
						  cat_id NUMBER(18) not null,
						  obj_id NUMBER(18) not null
						)';
-- Add comments to the table 
	EXECUTE IMMEDIATE 'comment on table REP_CATEGORY_LINKS
						is ''Таблица ссылок объектов на категории''';
-- Create/Recreate primary, unique and foreign key constraints 
	EXECUTE IMMEDIATE 'alter table REP_CATEGORY_LINKS
						  add constraint PK_CATLINKS_ID primary key (ID)';
	EXECUTE IMMEDIATE 'alter table REP_CATEGORY_LINKS
						  add constraint UN_CATLINKS_CATOBJ unique (CAT_ID, OBJ_ID)';    
  
-- Create sequence 
	EXECUTE IMMEDIATE 'create sequence REP_DATA_ID_SQ
						minvalue 1
						maxvalue 9999999999999999999999999999
						start with 1
						increment by 1
						cache 20';

-- Create sequence 
	EXECUTE IMMEDIATE 'create sequence REP_DATA_SET_ID_SQ
						minvalue 1
						maxvalue 9999999999999999999999999999
						start with 1
						increment by 1
						cache 20';

-- Create sequence 
	EXECUTE IMMEDIATE 'create sequence REP_DATA_SET_VALUE_ID_SQ
						minvalue 1
						maxvalue 9999999999999999999999999999
						start with 1
						increment by 1
						cache 20';

-- Create sequence 
	EXECUTE IMMEDIATE 'create sequence REP_USERS_ID_SQ
						minvalue 1
						maxvalue 9999999999999999999999999999
						start with 1
						increment by 1
						cache 20';


-- Create sequence 
	EXECUTE IMMEDIATE 'create sequence REP_RIGHTS_ID_SQ
						minvalue 1
						maxvalue 9999999999999999999999999999
						start with 1005
						increment by 1
						cache 20';

-- Create sequence 
	EXECUTE IMMEDIATE 'create sequence REP_USERS_RIGHTS_ID_SQ
						minvalue 1
						maxvalue 9999999999999999999999999999
						start with 1
						increment by 1
						cache 20';

-- Create sequence 
	EXECUTE IMMEDIATE 'create sequence REP_CATEGORY_TYPE_ID_SQ
						minvalue 1
						maxvalue 9999999999999999999999999999
						start with 1
						increment by 1
						cache 20';

-- Create sequence 
	EXECUTE IMMEDIATE 'create sequence REP_CATEGORY_VALUE_ID_SQ
						minvalue 1
						maxvalue 9999999999999999999999999999
						start with 1
						increment by 1
						cache 20';

-- Create sequence 
	EXECUTE IMMEDIATE 'create sequence REP_CATEGORY_LINKS_ID_SQ
		minvalue 1
		maxvalue 9999999999999999999999999999
		start with 1
		increment by 1
		cache 20';
END;		
  
