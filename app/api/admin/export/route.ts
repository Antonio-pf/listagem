import { NextRequest, NextResponse } from 'next/server'
import { 
  getAllReservations, 
  getAllGuests, 
  getAllMessages,
  convertToCSV 
} from '@/lib/admin-data-service'

// Disable caching for real-time data exports
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'guests', 'reservations', 'messages'
    const format = searchParams.get('format') || 'csv' // 'csv' or 'json'

    if (!type || !['guests', 'reservations', 'messages'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type parameter' },
        { status: 400 }
      )
    }

    let data: any[] = []
    let headers: string[] = []
    let filename = ''

    // Fetch data based on type
    switch (type) {
      case 'guests':
        data = await getAllGuests()
        headers = ['name', 'has_companion', 'gifts', 'created_at']
        filename = `convidados-${Date.now()}`
        break
      case 'reservations':
        data = await getAllReservations()
        headers = ['gift_id', 'guest_name', 'has_companion', 'contribution_type', 'gift_price', 'reserved_at']
        filename = `reservas-${Date.now()}`
        break
      case 'messages':
        data = await getAllMessages()
        headers = ['guest_name', 'message', 'created_at']
        filename = `mensagens-${Date.now()}`
        break
    }

    // Return data in requested format
    if (format === 'json') {
      return NextResponse.json(data, {
        headers: {
          'Content-Disposition': `attachment; filename="${filename}.json"`
        }
      })
    }

    // Default to CSV
    const csv = convertToCSV(data, headers)
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}.csv"`
      }
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Erro ao exportar dados' },
      { status: 500 }
    )
  }
}
