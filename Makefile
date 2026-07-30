.PHONY: help up down restart logs ps shell db-shell db-cli install generate migrate migrate-name deploy reset studio dev build test lint format

COMPOSE := docker compose
API_SERVICE := api
POSTGRES_SERVICE := postgres
POSTGRES_USER := postgres
POSTGRES_DB := plan_mode_api

help:
	@printf '%s\n' \
		'Available targets:' \
		'  make up            - Start API and PostgreSQL in Docker' \
		'  make down          - Stop Docker services' \
		'  make restart       - Restart Docker services' \
		'  make logs          - Follow API and PostgreSQL logs' \
		'  make ps            - Show Docker services status' \
		'  make shell         - Open shell inside API container' \
		'  make db-shell      - Open shell inside PostgreSQL container' \
		'  make db-cli        - Open psql in PostgreSQL container' \
		'  make install       - Install app dependencies in API container' \
		'  make generate      - Generate Prisma client' \
		'  make migrate       - Run prisma migrate dev' \
		'  make migrate-name name=init - Run named prisma migration' \
		'  make deploy        - Apply existing migrations with prisma migrate deploy' \
		'  make reset         - Reset database with Prisma' \
		'  make studio        - Open Prisma Studio' \
		'  make dev           - Start NestJS in watch mode' \
		'  make build         - Build project' \
		'  make test          - Run tests' \
		'  make lint          - Run lint' \
		'  make format        - Run format'

up:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) down
	$(COMPOSE) up -d --build

logs:
	$(COMPOSE) logs -f $(API_SERVICE) $(POSTGRES_SERVICE)

ps:
	$(COMPOSE) ps

shell:
	$(COMPOSE) exec $(API_SERVICE) sh

db-shell:
	$(COMPOSE) exec $(POSTGRES_SERVICE) sh

db-cli:
	$(COMPOSE) exec $(POSTGRES_SERVICE) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB)

install:
	$(COMPOSE) run --rm $(API_SERVICE) npm install

generate:
	$(COMPOSE) run --rm $(API_SERVICE) npx prisma generate

migrate:
	$(COMPOSE) run --rm $(API_SERVICE) npx prisma migrate dev

migrate-name:
ifndef name
	$(error usage: make migrate-name name=your_migration_name)
endif
	$(COMPOSE) run --rm $(API_SERVICE) npx prisma migrate dev --name $(name)

deploy:
	$(COMPOSE) run --rm $(API_SERVICE) npx prisma migrate deploy

reset:
	$(COMPOSE) run --rm $(API_SERVICE) npx prisma migrate reset

studio:
	$(COMPOSE) run --rm --service-ports $(API_SERVICE) npx prisma studio --hostname 0.0.0.0

dev:
	$(COMPOSE) up $(API_SERVICE)

build:
	$(COMPOSE) run --rm $(API_SERVICE) npm run build

test:
	$(COMPOSE) run --rm $(API_SERVICE) npm run test

lint:
	$(COMPOSE) run --rm $(API_SERVICE) npm run lint

format:
	$(COMPOSE) run --rm $(API_SERVICE) npm run format
