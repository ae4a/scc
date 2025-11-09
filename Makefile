all: build preview

build:
	vite build

preview:
	vite preview

publish: build
	docker buildx build --platform linux/amd64 -t scc-bat:amd64 .
	docker save -o scc-bat.img scc-bat:amd64
	rsync ./scc-bat.img mys:imgs/
	ssh mys "docker load -i imgs/scc-bat.img; cd mys; docker compose up -d scc-bat"
