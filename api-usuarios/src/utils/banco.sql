-- Execute este arquivo com o usuário postgres
-- psql -U postgres -f banco.sql

CREATE DATABASE app_usuarios;

\c app_usuarios;

CREATE TABLE usuarios (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(100) NOT NULL,
    sobrenome   VARCHAR(100) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    usuario     VARCHAR(50)  NOT NULL UNIQUE,
    senha       VARCHAR(255) NOT NULL,
    ativo       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);