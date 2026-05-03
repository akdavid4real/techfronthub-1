import { spawn } from 'node:child_process'
import { config as loadEnv } from 'dotenv'

loadEnv({ path: '.env.local' })

const direct = process.env.DIRECT_URL
if (!direct) {
  console.error('DIRECT_URL is missing in .env.local')
  process.exit(1)
}

process.env.DATABASE_URL = direct

const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('Usage: node scripts/with-direct-db.mjs <command> [args...]')
  process.exit(1)
}

const command = process.platform === 'win32' && args[0] === 'pnpm' ? 'pnpm.cmd' : args[0]
const commandArgs = args.slice(1)
const isDrizzlePull = args.join(' ').includes('drizzle-kit pull')

if (isDrizzlePull) {
  process.env.CI = '1'
}

let child

try {
  child = spawn(command, commandArgs, {
    stdio: isDrizzlePull ? ['inherit', 'pipe', 'pipe'] : 'inherit',
    env: process.env,
  })
} catch (err) {
  const isWinSpawnInvalid = process.platform === 'win32' && err && err.code === 'EINVAL'
  if (!isWinSpawnInvalid) throw err
  child = spawn([command, ...commandArgs].join(' '), {
    stdio: isDrizzlePull ? ['inherit', 'pipe', 'pipe'] : 'inherit',
    env: process.env,
    shell: true,
  })
}

if (!isDrizzlePull) {
  child.on('exit', code => process.exit(code ?? 1))
} else {
  let out = ''
  let err = ''
  child.stdout.on('data', chunk => {
    const text = chunk.toString()
    out += text
    process.stdout.write(text)
  })
  child.stderr.on('data', chunk => {
    const text = chunk.toString()
    err += text
    process.stderr.write(text)
  })
  child.on('close', code => {
    const combined = `${out}\n${err}`
    const isEmptySchemaRun =
      (combined.includes('0 tables fetching') || combined.includes('Pulling from')) &&
      !/error|failed|exception|invalid/i.test(combined)
    if ((code ?? 1) !== 0 && isEmptySchemaRun) {
      console.log('\nNo public tables found yet; treating drizzle pull as successful for empty schema.')
      process.exit(0)
    }
    process.exit(code ?? 1)
  })
}
