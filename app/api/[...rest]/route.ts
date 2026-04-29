import { getPayload } from 'payload'
import config from '@/payload.config'

async function handle(req: Request) {
  const payload = await getPayload({ config })
  const url = new URL(req.url)
  const pathname = url.pathname.replace('/api/', '')

  try {
    if (pathname === 'users/login' && req.method === 'POST') {
      const { email, password } = await req.json()
      const result = await payload.login({
        collection: 'users',
        data: { email, password },
      })
      return Response.json({ user: result.user, token: result.token })
    }

    if (pathname === 'users/logout' && req.method === 'POST') {
      return Response.json({ success: true })
    }

    if (pathname === 'users/me' && req.method === 'GET') {
      const auth = req.headers.get('authorization')
      if (!auth?.startsWith('JWT ')) return Response.json({ user: null }, { status: 401 })
      try {
        const token = auth.slice(4)
        const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString())
        const user = await payload.findByID({ collection: 'users', id: decoded.id })
        return Response.json({ user })
      } catch {
        return Response.json({ user: null }, { status: 401 })
      }
    }

    // Globals endpoints
    if (pathname.startsWith('globals/')) {
      const slug = pathname.replace('globals/', '')
      if (req.method === 'GET') {
        const doc = await payload.findGlobal({ slug: slug as any })
        return Response.json({ doc })
      }
      if (req.method === 'POST' || req.method === 'PATCH') {
        const data = await req.json()
        const doc = await payload.updateGlobal({ slug: slug as any, data })
        return Response.json({ doc })
      }
      return Response.json({ error: 'Method not allowed' }, { status: 405 })
    }

    // Generic collection endpoints
    const [collection, id] = pathname.split('/')

    if (req.method === 'GET' && !id) {
      const limit = url.searchParams.get('limit') || '20'
      const page = url.searchParams.get('page') || '1'
      const docs = await payload.find({
        collection: collection as any,
        limit: parseInt(limit as string),
        page: parseInt(page as string),
      })
      return Response.json({ docs: docs.docs, totalDocs: docs.totalDocs })
    }

    if (req.method === 'GET' && id) {
      const doc = await payload.findByID({
        collection: collection as any,
        id,
      })
      return Response.json({ doc })
    }

    if (req.method === 'POST' && !id) {
      const data = await req.json()
      const doc = await payload.create({
        collection: collection as any,
        data,
      })
      return Response.json({ doc })
    }

    if (req.method === 'PATCH' && id) {
      const data = await req.json()
      const doc = await payload.update({
        collection: collection as any,
        id,
        data,
      })
      return Response.json({ doc })
    }

    if (req.method === 'DELETE' && id) {
      await payload.delete({
        collection: collection as any,
        id,
      })
      return Response.json({ success: true })
    }

    return Response.json({ error: 'Not found' }, { status: 404 })
  } catch (err: any) {
    console.error('API error:', err)
    return Response.json({ message: err.message || 'Error' }, { status: 400 })
  }
}

export const GET = handle
export const POST = handle
export const PATCH = handle
export const DELETE = handle
export const PUT = handle
