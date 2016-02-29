# GCM-API
Global Climate Monitor API


## How to run
Build the Docker
```
docker build -t geographica/gcm-api-data data-gen
```
Run 
```
docker run --rm -it -v $(pwd):/usr/src/app geographica/gcm-api-data bash
source config.env
cd data-gen
node splitter.js
```
