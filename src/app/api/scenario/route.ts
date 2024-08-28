import { promises as fs } from 'fs'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import path from 'path'

import type { ApiResponse } from '@/server/response'
import type { ScenarioResponse } from '@/server/scenario/fetchScenario'

export const GET = async (
  req: NextRequest,
  res: NextResponse,
): ApiResponse<ScenarioResponse> => {
  const scenario = req.nextUrl.searchParams.get(`scenario`)
  if (!scenario) {
    return NextResponse.json({ error: `Missing state` }, { status: 400 })
  }
  const jsonPath = path.join(
    process.cwd(),
    `src`,
    `app`,
    `api`,
    `scenario`,
    `${scenario}.json`,
  )
  const thisScenario = await fs.readFile(jsonPath, `utf8`)

  return NextResponse.json(
    {
      scenario: JSON.parse(thisScenario),
    },
    {
      status: 200,
      headers: {
        'Content-Type': `application/json`,
      },
    },
  )
}
