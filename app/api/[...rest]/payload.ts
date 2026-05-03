import { getPayload } from 'payload'
import config from '@/payload.config'

let cachedPayload: any = null

export const getCachedPayload = async () => {
  if (cachedPayload) return cachedPayload
  
  const start = Date.now()
  cachedPayload = await getPayload({ config })
  console.log(`Payload singleton initialized in ${Date.now() - start}ms`)
  
  return cachedPayload
}
