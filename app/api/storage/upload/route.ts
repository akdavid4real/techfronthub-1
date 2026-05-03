import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getPublicObjectUrl, getStorageBucket, getStorageClient } from '@/src/lib/supabase-storage'

export const runtime = 'nodejs'

function sanitizeFileName(name: string) {
  return name
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'upload'
}

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get('file')
    const folder = String(form.get('folder') || 'courses').replace(/[^a-zA-Z0-9/_-]+/g, '-').replace(/^\/+|\/+$/g, '')

    if (!(file instanceof File)) {
      return Response.json({ message: 'Missing file upload.' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return Response.json({ message: 'Only image uploads are allowed.' }, { status: 400 })
    }

    const client = getStorageClient()
    const bucket = getStorageBucket()
    const safeName = sanitizeFileName(file.name || 'thumbnail')
    const key = `${folder}/${Date.now()}-${safeName}`
    const body = Buffer.from(await file.arrayBuffer())

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: file.type,
      })
    )

    const url = getPublicObjectUrl(key)
    return Response.json({ url, key, bucket })
  } catch (error: any) {
    return Response.json({ message: error?.message || 'Upload failed.' }, { status: 400 })
  }
}
