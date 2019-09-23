# iqchanneld
.PHONY: build
DOCKER_TTY = $(shell [ -t 0 ] && echo -t)


main: dist

clean:
	rm -rf build/*

install:
	npm install
	npm rebuild node-sass

run:
	npm start

build:
	@ echo "Building widget..."
	mkdir -p build
	npm run build

dist:
	@ make clean
	@ echo "[Docker build environment]"
	@ docker run --rm -i $(DOCKER_TTY) \
		--network=host \
		--volume $(PWD):/usr/src/app \
		--workdir /usr/src/app \
		node:10.12 \
		make install build
