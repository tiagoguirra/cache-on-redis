const { CacheOnRedis } = require('cache-on-redis')

const cache = new CacheOnRedis(
  {
    host: 'localhost',
    port: 6379,
    connect_timeout: 3600000,
    retry_strategy: (options) => {
      return 2000
    },
  },
  {
    key_prefix: 'cache_example',
    expire_time: 10,
  }
)

const run = async () => {
  console.log('Save cache')
  await cache.setJson('first', {
    name: 'Redis cache',
    version: 'beta',
  })
  console.log('Get cache')
  const value = await cache.getJson('first')
  console.log(value)
  await cache.invalidate('first')

  console.log('Clear cache')
  const valueClear = await cache.getJson('first')
  console.log(valueClear)
  return
}
run()
