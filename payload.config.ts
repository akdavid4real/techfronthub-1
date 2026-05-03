import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { deleteStorageObject } from './src/lib/supabase-storage'

const ACTIVITY_COLLECTION = 'admin-activity'

function getActorLabel(req: any) {
  const user = req?.user
  if (!user) return 'system'
  return user.email || user.name || user.id || 'system'
}

async function logActivity(req: any, data: Record<string, unknown>) {
  if (!req?.payload) return
  try {
    await req.payload.create({
      collection: ACTIVITY_COLLECTION as any,
      data: {
        actor: getActorLabel(req),
        ...data,
      },
      overrideAccess: true,
    })
  } catch (error) {
    console.error('Failed to write admin activity log', error)
  }
}

export default buildConfig({
  admin: {
    user: 'users',
  },
  collections: [
    {
      slug: 'users',
      auth: true,
      admin: { useAsTitle: 'email' },
      fields: [
        { name: 'name', type: 'text' },
        {
          name: 'role',
          type: 'select',
          options: ['admin', 'instructor', 'student', 'staff'],
          defaultValue: 'student',
        },
        {
          name: 'status',
          type: 'select',
          options: ['active', 'pending', 'suspended'],
          defaultValue: 'active',
        },
        { name: 'phone', type: 'text' },
        { name: 'avatar', type: 'text', admin: { description: 'Optional avatar URL or initials image link' } },
      ],
      hooks: {
        afterChange: [
          async ({ doc, previousDoc, operation, req }) => {
            const targetLabel = doc?.email || doc?.name || String(doc?.id || '')
            const statusChanged = previousDoc && previousDoc.status !== doc.status
            const roleChanged = previousDoc && previousDoc.role !== doc.role
            const action = operation === 'create' ? 'created' : statusChanged ? 'status-changed' : 'updated'
            const noteParts = []

            if (statusChanged) {
              noteParts.push(`status: ${previousDoc.status || 'unset'} -> ${doc.status || 'unset'}`)
            }

            if (roleChanged) {
              noteParts.push(`role: ${previousDoc.role || 'unset'} -> ${doc.role || 'unset'}`)
            }

            if (operation === 'create') {
              noteParts.push('User account created')
            } else if (!statusChanged && !roleChanged) {
              noteParts.push('User profile updated')
            }

            await logActivity(req, {
              action,
              targetCollection: 'users',
              targetId: String(doc.id),
              targetLabel,
              note: noteParts.join(' | '),
            })
          },
        ],
        afterDelete: [
          async ({ doc, req }) => {
            await logActivity(req, {
              action: 'deleted',
              targetCollection: 'users',
              targetId: String(doc.id),
              targetLabel: doc?.email || doc?.name || String(doc?.id || ''),
              note: 'User account deleted',
            })
          },
        ],
      },
    },
    {
      slug: 'instructors',
      auth: true,
      admin: { useAsTitle: 'email' },
      fields: [
        { name: 'name',      type: 'text' },
        { name: 'bio',       type: 'textarea' },
        { name: 'expertise', type: 'text', admin: { description: 'Comma-separated e.g. Data Analytics, Python, SQL' } },
        { name: 'photo',     type: 'text', admin: { description: 'Avatar image URL (leave blank to use initials)' } },
        { name: 'linkedin',  type: 'text' },
        { name: 'twitter',   type: 'text' },
        { name: 'github',    type: 'text' },
        { name: 'website',   type: 'text' },
      ],
    },
    {
      slug: 'assignments',
      admin: { useAsTitle: 'title' },
      fields: [
        { name: 'course',       type: 'relationship', relationTo: 'courses', required: true },
        { name: 'title',        type: 'text',         required: true },
        { name: 'description',  type: 'textarea' },
        { name: 'dueDate',      type: 'date' },
        { name: 'maxPoints',    type: 'number',       defaultValue: 100 },
      ],
    },
    {
      slug: 'submissions',
      admin: { useAsTitle: 'studentEmail' },
      fields: [
        { name: 'assignment',    type: 'relationship', relationTo: 'assignments', required: true },
        { name: 'studentEmail',  type: 'email',        required: true },
        { name: 'content',       type: 'textarea' },
        { name: 'status',        type: 'select', options: ['submitted', 'graded', 'returned'], defaultValue: 'submitted' },
        { name: 'grade',         type: 'number' },
        { name: 'feedback',      type: 'textarea' },
      ],
    },
    {
      slug: 'announcements',
      admin: { useAsTitle: 'title' },
      fields: [
        { name: 'course',  type: 'relationship', relationTo: 'courses', required: true },
        { name: 'title',   type: 'text',         required: true },
        { name: 'body',    type: 'textarea',     required: true },
      ],
    },
    {
      slug: 'enrollments',
      admin: { useAsTitle: 'reference' },
      fields: [
        { name: 'student', type: 'relationship', relationTo: 'users', required: true },
        { name: 'course', type: 'relationship', relationTo: 'courses', required: true },
        { name: 'status', type: 'select', options: ['pending', 'paid'], defaultValue: 'paid' },
        { name: 'amount', type: 'number' },
        { name: 'reference', type: 'text' },
      ],
    },
    {
      slug: 'courses',
      admin: { useAsTitle: 'title' },
      fields: [
        { name: 'instructor', type: 'relationship', relationTo: 'instructors' },
        { name: 'category', type: 'relationship', relationTo: 'categories', required: true },
        { name: 'tag', type: 'select', options: ['BOOTCAMP', 'NEW', 'POPULAR', 'ADVANCED', 'LIVE'] },
        { name: 'tagHot', type: 'checkbox' },
        { name: 'code', type: 'text' },
        { name: 'title', type: 'text', required: true },
        { name: 'desc', type: 'text' },
        { name: 'duration', type: 'text' },
        { name: 'lessons', type: 'number' },
        { name: 'level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced', 'All levels'] },
        { name: 'price', type: 'text' },
        { name: 'priceKobo', type: 'number' },
        { name: 'old', type: 'text' },
        { name: 'thumbnail', type: 'text' },
        { name: 'format', type: 'text' },
        { name: 'certificate', type: 'text' },
        { name: 'guarantee', type: 'text' },
        { name: 'support', type: 'textarea' },
        {
          name: 'whatYouLearn',
          type: 'array',
          fields: [{ name: 'benefit', type: 'text' }],
        },
        {
          name: 'programOverview',
          type: 'array',
          fields: [
            { name: 'week', type: 'text' },
            { name: 'title', type: 'text' },
            { name: 'description', type: 'textarea' },
          ],
        },
        {
          name: 'courseContent',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'duration', type: 'text' },
            { name: 'summary', type: 'textarea' },
            { name: 'content', type: 'textarea' },
            {
              name: 'videoUrls',
              type: 'array',
              fields: [{ name: 'url', type: 'text' }],
            },
            {
              name: 'resources',
              type: 'array',
              fields: [{ name: 'url', type: 'text' }],
            },
          ],
        },
        {
          name: 'whoThisIsFor',
          type: 'array',
          fields: [{ name: 'audience', type: 'text' }],
        },
        {
          name: 'relatedCourses',
          type: 'relationship',
          relationTo: 'courses',
          hasMany: true,
        },
      ],
    },
    {
      slug: 'testimonials',
      admin: { useAsTitle: 'name' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text' },
        { name: 'initials', type: 'text', maxLength: 2 },
        { name: 'quote', type: 'textarea', required: true },
      ],
    },
    {
      slug: 'categories',
      admin: { useAsTitle: 'title' },
      fields: [
        { name: 'n', type: 'text' },
        { name: 'title', type: 'text', required: true },
        { name: 'desc', type: 'text' },
        { name: 'count', type: 'text' },
        {
          name: 'icon',
          type: 'select',
          options: ['Cpu', 'BarChart', 'GitBranch', 'Megaphone', 'Code', 'Puzzle', 'Users', 'Target', 'Zap', 'Briefcase', 'Building', 'ShoppingBag'],
        },
      ],
    },
    {
      slug: 'packages',
      admin: { useAsTitle: 'name' },
      fields: [
        {
          name: 'icon',
          type: 'select',
          options: ['Briefcase', 'User', 'Building', 'ShoppingBag', 'Zap', 'Target', 'Users', 'Crown', 'Star'],
        },
        { name: 'featured', type: 'checkbox' },
        { name: 'badge', type: 'text' },
        { name: 'name', type: 'text', required: true },
        { name: 'desc', type: 'text' },
        { name: 'price', type: 'text' },
        { name: 'per', type: 'text' },
        {
          name: 'features',
          type: 'array',
          fields: [{ name: 'feature', type: 'text' }],
        },
        { name: 'sortOrder', type: 'number' },
      ],
    },
    {
      slug: 'udemy-courses',
      admin: { useAsTitle: 'title' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'author', type: 'text' },
        { name: 'rating', type: 'number' },
        { name: 'count', type: 'text' },
        { name: 'hours', type: 'text' },
        { name: 'price', type: 'text' },
        { name: 'udemyUrl', type: 'text', admin: { description: 'Full Udemy course URL (e.g. https://www.udemy.com/course/...)' } },
        { name: 'hue', type: 'number' },
        { name: 'sortOrder', type: 'number' },
      ],
    },
    {
      slug: ACTIVITY_COLLECTION,
      admin: { useAsTitle: 'action' },
      timestamps: true,
      fields: [
        { name: 'actor', type: 'text', required: true },
        { name: 'action', type: 'select', options: ['created', 'updated', 'deleted', 'status-changed', 'password-reset', 'bulk-suspend', 'bulk-activate'], required: true },
        { name: 'targetCollection', type: 'text', required: true },
        { name: 'targetId', type: 'text', required: true },
        { name: 'targetLabel', type: 'text', required: true },
        { name: 'note', type: 'textarea' },
      ],
    },
    {
      slug: 'media-assets',
      admin: { useAsTitle: 'name' },
      timestamps: true,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        { name: 'key', type: 'text' },
        { name: 'bucket', type: 'text' },
        { name: 'folder', type: 'text' },
        { name: 'mimeType', type: 'text' },
        { name: 'size', type: 'number' },
      ],
      hooks: {
        afterDelete: [
          async ({ doc }) => {
            if (doc?.key) {
              await deleteStorageObject(String(doc.key), doc?.bucket || undefined).catch(() => {})
            }
          },
        ],
      },
    },
  ],
  globals: [
    {
      slug: 'site-config',
      fields: [
        { name: 'heroBadge', type: 'text' },
        { name: 'heroHeadline', type: 'text' },
        { name: 'heroLede', type: 'textarea' },
        { name: 'statLearners', type: 'text' },
        { name: 'statCourses', type: 'text' },
        { name: 'statPlacement', type: 'text' },
        { name: 'statRating', type: 'text' },
        {
          name: 'trustedCompanies',
          type: 'array',
          fields: [{ name: 'name', type: 'text' }],
        },
        { name: 'ctaHeadline', type: 'text' },
        { name: 'ctaBody', type: 'textarea' },
      ],
    },
  ],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    },
  }),
  secret: process.env.PAYLOAD_SECRET,
  typescript: {
    outputFile: './payload-types.ts',
  },
})
