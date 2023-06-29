create extension if not exists "uuid-ossp";

create table users (
       userid uuid default uuid_generate_v4 () primary key,
       username text unique not null,
       password text not null,
       emailid text unique not null,
       roles text[]
       );

create table rolepermissions (
       id uuid default uuid_generate_v4 () primary key,
       role text,
       permissions text[]
       );

create table test1 (
       id uuid default uuid_generate_v4 () primary key,
       name text,
       rest text
       );

create table test2 (
       id uuid default uuid_generate_v4 () primary key,
       name text,
       forId uuid,
       constraint fk_test2_test1
       foreign key (forId)
       references test1 (id)
       );
