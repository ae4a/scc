build:
	esbuild src/index.ts --bundle --inject:src/utils/jquery_inject.js --outfile=dist/scripts/index.js
