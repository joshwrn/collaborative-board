import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { MOCK_BASE64 } from '@/mock/mockBlob'
import type { ImageUrlToBase64Response } from '@/server/imageUrlToBase64/fetchImageUrlToBase64'
import { mockedEndpoints } from '@/server/mockedEndpoints'
import type { ApiResponse } from '@/server/response'
import { convertImageToBase64 } from '@/utils/image/convertImageToBase64'

export const GET = async (
  req: NextRequest,
  res: NextResponse,
): ApiResponse<ImageUrlToBase64Response> => {
  if (
    process.env.USE_MOCK_ENDPOINTS === `true` ||
    mockedEndpoints.imageUrlToBase64.get
  ) {
    return NextResponse.json(
      {
        base64: MOCK_BASE64,
      },
      { status: 200 },
    )
  }
  const url = req.nextUrl.searchParams.get(`url`)
  if (!url) {
    return NextResponse.json({ error: `Missing url` }, { status: 400 })
  }
  const base64String = await convertImageToBase64(url)
  const base64 = `data:image/png;base64,` + base64String

  if (!base64) {
    return NextResponse.json({ error: `Failed to fetch blob` }, { status: 400 })
  }

  return NextResponse.json(
    {
      base64,
    },
    {
      status: 200,
      headers: {
        'Content-Type': `application/json`,
      },
    },
  )
}
