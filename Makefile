up-build:
	docker compose up -d --build web db

up:
	docker compose up -d web db

test:
	docker compose up web_test

down:
	docker compose down -v
