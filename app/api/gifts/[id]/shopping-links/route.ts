import { NextRequest, NextResponse } from 'next/server'
import { searchProductLinks } from '@/lib/services/shopping-search.service'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/database.types'

type ShoppingLink = Database['public']['Tables']['shopping_links']['Row']
type ShoppingLinkInsert = Database['public']['Tables']['shopping_links']['Insert']
type RateLimit = Database['public']['Tables']['rate_limits']['Row']
type RateLimitInsert = Database['public']['Tables']['rate_limits']['Insert']

/**
 * GET /api/gifts/[id]/shopping-links
 * 
 * Retrieves shopping links for a specific gift
 * Returns cached links if available and fresh (< 7 days old)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: giftId } = await params

    // Fetch links from database
    const { data: links, error } = await supabase
      .from('shopping_links')
      .select('*')
      .eq('gift_id', giftId)
      .order('created_at', { ascending: false }) as { data: ShoppingLink[] | null, error: any }

    if (error) {
      console.error('Error fetching shopping links:', error)
      return NextResponse.json(
        { error: 'Failed to fetch shopping links' },
        { status: 500 }
      )
    }

    // Check if links are fresh (less than 7 days old)
    const cacheDays = parseInt(process.env.SHOPPING_LINKS_CACHE_DAYS || '7')
    const cacheExpiryDate = new Date()
    cacheExpiryDate.setDate(cacheExpiryDate.getDate() - cacheDays)

    const freshLinks = links?.filter(link => {
      const createdAt = new Date(link.created_at)
      return createdAt > cacheExpiryDate
    })

    return NextResponse.json({
      success: true,
      links: freshLinks || [],
      cached: (freshLinks?.length ?? 0) > 0
    })

  } catch (error) {
    console.error('Error in GET shopping-links:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/gifts/[id]/shopping-links
 * 
 * Generates new shopping links for a gift using CI&T Flow API
 * Stores results in database for caching
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: giftId } = await params
    const body = await request.json()
    
    const { productName, description } = body

    // Validate input
    if (!productName) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      )
    }

    // Rate limiting check (simple IP-based)
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    const rateLimitKey = `shopping_search_${clientIp}`
    const maxRequests = parseInt(process.env.MAX_SHOPPING_LINK_REQUESTS_PER_HOUR || '10')
    
    // Check rate limit from database (using a simple counter table)
    const { data: rateLimitData, error: rateLimitError } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('key', rateLimitKey)
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
      .maybeSingle() as { data: RateLimit | null, error: any }

    if (rateLimitData && (rateLimitData as RateLimit).count >= maxRequests) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    // Search for product links using CI&T Flow API
    const searchResult = await searchProductLinks(productName, description)

    if (!searchResult.success || !searchResult.data) {
      return NextResponse.json(
        { error: searchResult.error || 'Failed to generate shopping links' },
        { status: 500 }
      )
    }

    // Prepare links to insert into database
    const linksToInsert: ShoppingLinkInsert[] = []
    const { mercadoLivre, amazon, magalu } = searchResult.data

    if (mercadoLivre) {
      linksToInsert.push({
        gift_id: giftId,
        store: 'mercado-livre',
        url: mercadoLivre,
        title: `${productName} - Mercado Livre`,
        generated_by_ai: true
      })
    }

    if (amazon) {
      linksToInsert.push({
        gift_id: giftId,
        store: 'amazon',
        url: amazon,
        title: `${productName} - Amazon`,
        generated_by_ai: true
      })
    }

    if (magalu) {
      linksToInsert.push({
        gift_id: giftId,
        store: 'magalu',
        url: magalu,
        title: `${productName} - Magazine Luiza`,
        generated_by_ai: true
      })
    }

    // Delete old links for this gift before inserting new ones
    await supabase
      .from('shopping_links')
      .delete()
      .eq('gift_id', giftId)

    // Insert new links
    const { data: insertedLinks, error: insertError } = await supabase
      .from('shopping_links')
      .insert(linksToInsert as any)
      .select() as { data: ShoppingLink[] | null, error: any }

    if (insertError) {
      console.error('Error inserting shopping links:', insertError)
      return NextResponse.json(
        { error: 'Failed to save shopping links' },
        { status: 500 }
      )
    }

    // Update rate limit counter
    const rateLimitUpsert: RateLimitInsert = {
      key: rateLimitKey,
      count: ((rateLimitData as RateLimit | null)?.count || 0) + 1
    }
    
    await supabase
      .from('rate_limits')
      .upsert(rateLimitUpsert as any)

    return NextResponse.json({
      success: true,
      links: insertedLinks,
      cached: false
    })

  } catch (error) {
    console.error('Error in POST shopping-links:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
