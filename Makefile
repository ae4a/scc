all: up

build:
	vite build

up: build
	docker compose up -d --build

convert-colors:
	python3 utils/colors_conv/conv.py utils/colors_conv/en-wool.txt 1 | jq > public/colors/en-wool.json
	python3 utils/colors_conv/conv.py utils/colors_conv/maori-batts.txt 1 | jq > public/colors/maori-batts.json
	python3 utils/colors_conv/conv.py utils/colors_conv/mc-1.txt 1 | jq > public/colors/mc-1.json

preview: build
	vite preview

publish: build
	docker buildx build --platform linux/amd64 -t scc-bat:amd64 .
	docker save -o scc-bat.img scc-bat:amd64
	rsync ./scc-bat.img mys:imgs/
	ssh mys "docker load -i imgs/scc-bat.img; cd mys; docker compose up -d scc-bat"
