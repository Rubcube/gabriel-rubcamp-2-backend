up-build:
	docker compose up -d --build web db

up:
	docker compose up -d web db

down:
	docker compose down -v
