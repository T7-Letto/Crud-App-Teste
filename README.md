# Crud-App-Teste

Sistema CRUD de gerenciamento de usuários com frontend responsivo e backend em Node.js + Sequelize + MySQL.

## Tecnologias Utilizadas

* Node.js
* Express
* Sequelize (ORM)
* MySQL
* PDFKit (Exportação PDF)
* ExcelJS (Exportação Excel)
* HTML + CSS + JavaScript (Frontend)
* Docker (Containerização)

---

## Como executar localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/T7-Letto/Crud-App-Teste.git
cd Crud-App-Teste
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar o banco de dados

* Crie um banco MySQL (ex: `crud_app`)
* Configure o arquivo `.env` com seus dados:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_DATABASE=crud_app
PORT=3000
```

### 4. Rodar as migrations (se houver)

```bash
npx sequelize-cli db:migrate
```

### 5. Iniciar o servidor

```bash
npm start
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## Utilizando Docker

### 1. Buildar e rodar

```bash
docker build -t crud-app .
docker run -p 3000:3000 --env-file .env crud-app
```

### 2. Usando Docker Compose (exemplo `docker-compose.yml`):

```yaml
version: '3.8'
services:
  db:
    image: mysql:8
    restart: always
    environment:
      MYSQL_DATABASE: crud_app
      MYSQL_USER: root
      MYSQL_PASSWORD: sua_senha
      MYSQL_ROOT_PASSWORD: sua_senha
    ports:
      - "3306:3306"
    volumes:
      - ./mysql-data:/var/lib/mysql

  app:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      - db
```

Execute:

```bash
docker-compose up --build
```

---


---

## Funcionalidades

* CRUD de usuários
* Exportação em PDF com layout tabular
* Exportação em Excel com formatação e bordas
* Frontend responsivo

---

## Estrutura de Pastas

```
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── app.js
├── frontend
│   ├── css
│   ├── js
│   └── index.html
├── Dockerfile
├── docker-compose.yml
├── README.md
```

---

## Licença

Este projeto está sob a licença MIT.

---

## Contato

T7-Letto - [GitHub](https://github.com/T7-Letto)
