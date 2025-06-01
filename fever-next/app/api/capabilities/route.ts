import { NextResponse } from 'next/server'
import nextPkg from 'next/package.json' assert { type: 'json' }
import pkg from '../../../package.json' assert { type: 'json' }

export async function GET() {
  const capabilities = {
    fever_version: pkg.version,
    node_version: process.versions.node,
    next_version: nextPkg.version,
    has_prisma: Boolean(pkg.dependencies['@prisma/client']),
    has_next_auth: Boolean(pkg.dependencies['next-auth']),
    has_rss_parser: Boolean(pkg.dependencies['rss-parser']),
    has_node_cron: Boolean(pkg.dependencies['node-cron']),
  }
  return NextResponse.json(capabilities)
}
