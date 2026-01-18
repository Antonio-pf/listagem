import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SignJWT } from 'jose'

const secret = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET)

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    // Verify password
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Senha incorreta' }, 
        { status: 401 }
      )
    }

    // Create session token (valid for 24 hours)
    const token = await new SignJWT({ admin: true, timestamp: Date.now() })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret)

    // Set secure cookie
    const cookieStore = await cookies()
    cookieStore.set('admin-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400, // 24 hours
      path: '/'
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin auth error:', error)
    return NextResponse.json(
      { error: 'Erro ao processar autenticação' }, 
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    // Logout - clear the cookie
    const cookieStore = await cookies()
    cookieStore.delete('admin-session')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin logout error:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer logout' }, 
      { status: 500 }
    )
  }
}
