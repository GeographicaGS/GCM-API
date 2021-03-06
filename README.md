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


## Create grid.json

```
ogr2ogr -f "GeoJSON" grid.geojson  PG:"host=astrid.geographica.gs user=postgres dbname=global_drought password=escalaHorizontal23" -sql "SELECT id_punto as i,geom from id_coordenadas"
```

## Server web folder using nginx compression
```
location /mapbox/splitdata {
  gzip on;
  gzip_disable "msie6";

  gzip_vary on;
  gzip_proxied any;
  gzip_comp_level 9;
  gzip_buffers 16 8k;
  gzip_http_version 1.1;
  gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript;
}
```

## URLs

### Variables

You can download variables from:
```
http://globalclimatemonitor.org/mapbox/splitdata/<variable>/<YYYYMM>.json
``

Examples:
- Temp (year 2015, month 7): http://globalclimatemonitor.org/mapbox/splitdata/temp/201507.json
- Rainfall (year 2015, month 7): http://globalclimatemonitor.org/mapbox/splitdata/pre/201507.json


### GeoJSON grid
http://globalclimatemonitor.org/mapbox/grid.geojson