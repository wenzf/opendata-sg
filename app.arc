@app
opendatasg

@aws
runtime nodejs18.x
  profile default
  region us-east-1
  timeout 60
  concurrency 50

@http
/*
  method any
  src server

@plugins
plugin-remix
  src plugin-remix.js

@static
  compression gzip


@tables
main
  pk *String
  sk **Number