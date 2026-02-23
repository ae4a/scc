all: up

up:
	docker compose up -d --build

convert-colors:
	cd frontend/utils/colors_conv && \
	awk ' \
		BEGIN { \
			word["maori-batts.txt"] = "| Maori batts"; \
			word["mc-1.txt"] = "| MC-1"; \
			word["bergschaf.txt"] = "| Bergschaf"; \
			word["nz-corriedale.txt"] = "| nz corriedale"; \
		} \
		{ print $$0, word[FILENAME] } \
	' maori-batts.txt mc-1.txt bergschaf.txt nz-corriedale.txt | python3 conv.py --sort-hue > ../../../public/colors/en-wool.json
	cat frontend/utils/colors_conv/ru-wool.txt | python3 frontend/utils/colors_conv/conv.py > public/colors/ru-wool.json
	cat frontend/utils/colors_conv/ru-fabric.txt | python3 frontend/utils/colors_conv/conv.py > public/colors/ru-fabric.json
	cat frontend/utils/colors_conv/en-fabric.txt | python3 frontend/utils/colors_conv/conv.py > public/colors/en-fabric.json

preview:
	vite preview

push-develop:
	docker buildx build --platform linux/amd64 -t scc-develop:amd64 .
	docker save -o scc-develop.img scc-develop:amd64
	rsync --progress --compress ./scc-develop.img mys:acicularis.com/imgs/
	ssh mys "cd acicularis.com; docker load -i imgs/scc-develop.img;  docker compose up -d scc-develop"

publish-release:
	docker buildx build --platform linux/amd64 -t scc-release:amd64 .
	docker save -o scc-release.img scc-release:amd64
	rsync ./scc-release.img mys:acicularis.com/imgs/
	ssh mys "cd acicularis.com; docker load -i imgs/scc-release.img;  docker compose up -d scc-release"
