up-build:
	docker compose up -d --build

up:
	docker compose up -d

test:
	docker compose up web_test

down:
	docker compose down -v
