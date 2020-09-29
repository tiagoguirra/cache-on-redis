# redis-on-cache

Redis on cache is a simple library to temporary storage cache using node.js.

## Install

```bash
$ npm install cache-on-redis
```

## Usage

Create a redis instanance using package [redis](https://www.npmjs.com/package/redis)
Exemple:

```javascript
const { RedisCache } = require('../dist')

const redis = createClient({
  host: 'localhost',
  port: 6379,
  connect_timeout: 3600000,
  retry_strategy: (options) => {
    return 2000
  },
})
```

Then create a redis-on-cache instance passing redis instance:

```javascript
const cache = new RedisCache(redis)
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

To clear or invalidate cache

```javascript
await cache.invalidate('myCacheKey')
```

#### `options` object properties

The cache instance acceps a options argument:

- `RedisCache(redisInstance,options)`

| Property    | Default | Description                                                    |
| ----------- | ------- | -------------------------------------------------------------- |
| key_prefix  | cache   | Cache key prefix, every cache storage will contain this prefix |
| expire_time | 3600    | Cache expiration time in secconds                              |


