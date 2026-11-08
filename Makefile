APP_NAME := front-ambient
COMPOSE  := docker compose

.DEFAULT_GOAL := help

.PHONY: help build up up-d down restart rebuild logs ps shell clean prune

help: ## Mostra esta lista de comandos
	@echo "Comandos disponiveis para $(APP_NAME):"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  make %-10s %s\n", $$1, $$2}'

build: ## Constroi a imagem
	$(COMPOSE) build

up: ## Sobe o container (build se precisar) com logs no terminal
	$(COMPOSE) up --build

up-d: ## Sobe o container em segundo plano
	$(COMPOSE) up -d --build

down: ## Para e remove o container
	$(COMPOSE) down

restart: ## Reinicia o container
	$(COMPOSE) restart

rebuild: ## Refaz a imagem do zero (sem cache) e sobe em segundo plano
	$(COMPOSE) build --no-cache
	$(COMPOSE) up -d

logs: ## Acompanha os logs em tempo real
	$(COMPOSE) logs -f $(APP_NAME)

ps: ## Lista o status do container
	$(COMPOSE) ps

shell: ## Abre um terminal dentro do container
	docker exec -it $(APP_NAME) sh

clean: ## Para o container e remove a imagem do app
	$(COMPOSE) down --rmi local

prune: ## Limpa imagens e cache do Docker nao utilizados
	docker system prune -f