# iqchanneld
.PHONY: build

DOCKER_TTY = $(shell [ -t 0 ] && echo -t)
NODE_IMAGE = node:12.13


main: dist

clean:
	rm -rf build/* \
	rm -rf package-lock.json \
  	rm -rf node_modules/

install:
	npm install --legacy-peer-deps
	npm rebuild node-sass

run:
	npm start

build:
	@ echo "Building widget..."
	mkdir -p build
	env NODE_OPTIONS=--max_old_space_size=4096 npm run build

dist:
	make clean
	make install
	make build

dist_docker:
	@ make clean
	@ echo "[Docker build environment]"
	@ docker run --rm -i $(DOCKER_TTY) \
		--network=host \
		--volume $(PWD):/usr/src/app \
		--workdir /usr/src/app \
		$(NODE_IMAGE) \
		make install build
