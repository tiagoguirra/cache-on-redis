import { RedisClient, createClient, ClientOpts } from 'redis'

export class CacheOnRedis {
  private Client: RedisClient
  private expireTime: number
  private keyPrefix: string
  constructor(
    redisOptions: ClientOpts,
    options?: { key_prefix?: string; expire_time?: number }
  ) {
    this.keyPrefix = options ? options.key_prefix || '' : ''
    this.expireTime = options ? options.expire_time || 3600 : 3600
    this.Client = createClient(redisOptions)
  }
  private makeKey(key: string) {
    return `${this.keyPrefix || 'cache'}_${key}`
  }
  private unmakeKey(key: string) {
    return key.replace(`${this.keyPrefix || 'cache'}_`, '')
  }
  set(key: string, value: string, expireAt?: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const cacheKey = this.makeKey(key)
      this.Client.set(cacheKey, value, (err) => {
        if (err) {
          reject(err)
        } else {
          this.Client.expire(cacheKey, expireAt || this.expireTime, (err) => {
            if (err) {
              reject(err)
            } else {
              resolve()
            }
          })
        }
      })
    })
  }
  setJson(key: string, value: any, expireAt?: number): Promise<void> {
    const content = JSON.stringify(value || {})
    return this.set(key, content, expireAt)
  }
  get(key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const cacheKey = this.makeKey(key)
      this.Client.get(cacheKey, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
  async getJson<T = any>(key: string): Promise<T | null> {
    const data = await this.get(key)
    if (data) {
      return JSON.parse(data)
    }
    return null
  }
  invalidate(key: string, pattern: boolean = false): Promise<void> {
    return new Promise((resolve, reject) => {
      const cacheKey = this.makeKey(key)
      if (pattern) {
        this.Client.keys(cacheKey, (err, keys: string[]) => {
          if (err) {
            reject(err)
          } else {
            Promise.all(keys.map((key) => this.invalidate(this.unmakeKey(key))))
              .then(() => resolve())
              .catch((err) => reject(err))
          }
        })
      } else {
        this.Client.del(cacheKey, (err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      }
    })
  }
}
export default CacheOnRedis
