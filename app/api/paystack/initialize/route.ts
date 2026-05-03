import { getPayload } from 'payload'
import config from '@/payload.config'

function parseAmountToNaira(value) {
  if (value == null) return null
  const cleaned = String(value).replace(/[^0-9.]/g, '')
  if (!cleaned) return null
  const num = Number(cleaned)
  return Number.isFinite(num) ? num : null
}

function getToken(req) {
  const auth = req.headers.get('authorization') || ''
  return auth.startsWith('JWT ') ? auth.slice(4) : ''
}

function decodeToken(token) {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString())
  } catch {
    return null
  }
}

export async function POST(req) {
  try {
    const paystackKey = process.env.PAYSTACK_SECRET_KEY
    if (!paystackKey) return Response.json({ message: 'PAYSTACK_SECRET_KEY is missing.' }, { status: 500 })

    const token = getToken(req)
    if (!token) return Response.json({ message: 'Unauthorized.' }, { status: 401 })

    const decoded = decodeToken(token)
    const studentId = decoded?.id
    if (!studentId) return Response.json({ message: 'Invalid token.' }, { status: 401 })

    const body = await req.json()
    const courseId = body?.courseId
    if (!courseId) return Response.json({ message: 'courseId is required.' }, { status: 400 })

    const payload = await getPayload({ config })
    const student = await payload.findByID({ collection: 'users', id: studentId })
    const course = await payload.findByID({ collection: 'courses', id: String(courseId) })

    const amountKobo = Number(course?.priceKobo) > 0
      ? Number(course.priceKobo)
      : Math.round((parseAmountToNaira(course?.price) || 0) * 100)

    if (!amountKobo || amountKobo <= 0) {
      return Response.json({ message: 'This course does not have a valid price.' }, { status: 400 })
    }

    const existing = await payload.find({
      collection: 'enrollments',
      where: {
        and: [
          { student: { equals: studentId } },
          { course: { equals: String(courseId) } },
          { status: { equals: 'paid' } },
        ],
      },
      limit: 1,
    })

    if (existing?.docs?.length > 0) {
      return Response.json({ enrolled: true, message: 'Already enrolled.' })
    }

    const origin = new URL(req.url).origin
    const callbackUrl = `${origin}/student/payment/callback`

    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: student?.email,
        amount: amountKobo,
        callback_url: callbackUrl,
        metadata: {
          studentId: String(studentId),
          courseId: String(courseId),
        },
      }),
    })

    const paystackData = await paystackRes.json()
    if (!paystackRes.ok || !paystackData?.status) {
      return Response.json({ message: paystackData?.message || 'Failed to initialize payment.' }, { status: 400 })
    }

    return Response.json({
      status: true,
      authorization_url: paystackData?.data?.authorization_url,
      reference: paystackData?.data?.reference,
    })
  } catch (err) {
    return Response.json({ message: err?.message || 'Initialization failed.' }, { status: 400 })
  }
}
