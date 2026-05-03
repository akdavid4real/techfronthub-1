import { deleteStorageObject } from '@/src/lib/supabase-storage'

export const runtime = 'nodejs'

export async function DELETE(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const key = String(body?.key || '').trim()
    const bucket = String(body?.bucket || '').trim()

    if (!key) {
      return Response.json({ message: 'Missing object key.' }, { status: 400 })
    }

    await deleteStorageObject(key, bucket || undefined)
    return Response.json({ success: true })
  } catch (error: any) {
    return Response.json({ message: error?.message || 'Delete failed.' }, { status: 400 })
  }
}
