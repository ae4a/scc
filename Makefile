build:
	esbuild src/index.ts --bundle --inject:src/utils/jquery_inject.js --outfile=dist/scripts/index.js

release:
	esbuild src/index.ts --minify --bundle --inject:src/utils/jquery_inject.js --outfile=dist/scripts/index.js
