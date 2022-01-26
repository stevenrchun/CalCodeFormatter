# Makefile to enable building directories for the Chrome and Firefox extensions.
SRC_TS := $(wildcard src/*.ts)
SRC_JS := $(wildcard src/*.js)


# Compile all typescript code.
build:
	tsc --project src/tsconfig.json

# tsc doesn't currently support specifying a tsconfig when compiling
# specific files. So we just recompile everything because the alternative
# is keeping this build rule in sync with tsconfig which would suck.
$(SRC_JS): $(SRC_TS)
	tsc --project src/tsconfig.json

chrome: $(SRC_JS) chrome_manifest.json
	mkdir -p chrome
	cp -rp src/* chrome/
	cp chrome_manifest.json chrome/manifest.json
	zip -r chrome.zip chrome

firefox: $(SRC_JS) chrome_manifest.json
	mkdir -p firefox
	cp -rp src/* firefox/
	cp firefox_manifest.json firefox/manifest.json
	zip -r firefox.zip firefox

clean:
	rm -rf chrome
	rm -rf firefox
	rm firefox.zip
	rm chrome.zip

all: chrome firefox

.PHONY: build all
