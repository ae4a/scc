all: build preview

build:
	vite build
	#esbuild src/index.ts --bundle --inject:src/utils/jquery_inject.js --outfile=dist/scripts/index.js

preview:
	vite preview

publish:
	docker buildx build --platform linux/amd64 -t scc-bat:amd64 .
	docker save -o scc-bat.img scc-bat:amd64
	rsync ./scc-bat.img mys:imgs/
