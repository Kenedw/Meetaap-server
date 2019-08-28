# Meetapp

A ideia é desenvolver uma aplicação do zero utilizando Express.

Nessa aplicação foi configurado as seguintes ferramentas:

- Sucrase + Nodemon;
- ESLint + Prettier + EditorConfig;
- Sequelize (Utilize PostgresSQL ou MySQL);

## Aplicação

A aplicação que iremos servida aqui, é um app agregador de eventos para desenvolvedores chamado Meetapp (um acrônimo à Meetup + App).

## Funcionalidades

Abaixo estão descritas as funcionalidades adicionadas na aplicação.

### Autenticação

Permita que um usuário se autentique na aplicação utilizando e-mail e senha.

- A autenticação é feita utilizando JWT.
- Existe validação dos dados de entrada;

### Cadastro e atualização de usuários

Permita que novos usuários se cadastrem utilizando nome, e-mail e senha.

Para atualizar a senha, o usuário deve também enviar um campo de confirmação com a mesma senha.

- Criptografia da senha do usuário para segurança.
- Existe a validação dos dados de entrada;
