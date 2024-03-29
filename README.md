# cache-on-redis

Cache on redis is a simple library to temporary storage cache using node.js and redis.

## Install

```bash
$ npm install cache-on-redis
```

## Usage

Then create a cache-on-redis instance passing redis options:

```javascript
const { CacheOnRedis } = require('cache-on-redis')
const cache = new CacheOnRedis({
  host: 'localhost',
  port: 6379,
  connect_timeout: 3600000,
  retry_strategy: (options) => {
    return 2000
  },
})
```

##### Set cache value

Create a cache from json object

```javascript
await cache.setJson('myCacheKey', {
  name: 'Redis cache',
  version: 'beta',
})
```

Create a cache from string

```javascript
await cache.set('myCacheKey', 'storage this')
```

##### Get cache value

Get a cache json object

```javascript
await cache.getJson('myCacheKey')
```

Get a cache string

```javascript
await cache.get('myCacheKey')
```

##### Invalidate

To invalidate cache

```javascript
await cache.invalidate('myCacheKey')
```

To invalidate cache using patterns

```javascript
await cache.invalidate('myCa*', true)
```

#### `options` object properties

The cache instance acceps a options argument:

- `CacheOnRedis(redisInstance,options)`

| Property    | Default | Description                                                    |
| ----------- | ------- | -------------------------------------------------------------- |
| key_prefix  | cache   | Cache key prefix, every cache storage will contain this prefix |
| expire_time | 3600    | Cache expiration time in secconds                              |
