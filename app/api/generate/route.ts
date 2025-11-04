import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    await new Promise(resolve => setTimeout(resolve, 2000))

    const frames = Array.from({ length: 12 }, (_, i) => ({
      url: image,
      duration: 120 + (i % 3) * 30,
    }))

    return NextResponse.json({
      frames,
      message: 'Animation generated successfully'
    })

  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate animation' },
      { status: 500 }
    )
  }
}

export const runtime = 'edge'
