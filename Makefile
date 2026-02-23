all: up

up:
	docker compose up -d --build

convert-colors:
	python3 utils/colors_conv/conv.py utils/colors_conv/en-wool.txt > public/colors/en-wool.json
	python3 utils/colors_conv/conv.py utils/colors_conv/ru-wool.txt > public/colors/ru-wool.json
	python3 utils/colors_conv/conv.py utils/colors_conv/ru-fabric.txt > public/colors/ru-fabric.json
	python3 utils/colors_conv/conv.py utils/colors_conv/en-fabric.txt > public/colors/en-fabric.json

preview:
	vite preview

push:
	docker buildx build --platform linux/amd64 -t scc-develop:amd64 .
	docker save -o scc-develop.img scc-develop:amd64
	rsync ./scc-develop.img mys:acicularis.com/imgs/
	ssh mys "cd acicularis.com; docker load -i imgs/scc-develop.img;  docker compose up -d scc-develop"

publish-release:
	docker buildx build --platform linux/amd64 -t scc-release:amd64 .
	docker save -o scc-release.img scc-release:amd64
	rsync ./scc-release.img mys:acicularis.com/imgs/
	ssh mys "cd acicularis.com; docker load -i imgs/scc-release.img;  docker compose up -d scc-release"
