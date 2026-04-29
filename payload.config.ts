import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export default buildConfig({
  admin: {
    user: 'users',
  },
  collections: [
    {
      slug: 'users',
      auth: true,
      admin: { useAsTitle: 'email' },
      fields: [],
    },
    {
      slug: 'courses',
      admin: { useAsTitle: 'title' },
      fields: [
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
        { name: 'old', type: 'text' },
        { name: 'hue', type: 'number' },
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
        { name: 'format', type: 'text' },
        { name: 'certificate', type: 'text' },
        { name: 'support', type: 'textarea' },
        { name: 'guarantee', type: 'text' },
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
    },
  }),
  secret: process.env.PAYLOAD_SECRET,
  typescript: {
    outputFile: './payload-types.ts',
  },
})
