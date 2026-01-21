/**
 * Shopping Search Service
 * 
 * This service integrates with CI&T Flow API to search for product links
 * across multiple e-commerce platforms (Mercado Livre, Amazon, Magazine Luiza)
 */

export interface SearchProductResponse {
  mercadoLivre?: string
  amazon?: string
  magalu?: string
}

export interface ShoppingSearchResult {
  success: boolean
  data?: SearchProductResponse
  error?: string
}

/**
 * CI&T Flow API Configuration
 */
const FLOW_CONFIG = {
  baseUrl: 'https://flow.ciandt.com/advanced-flows',
  flowId: '60311bf0-76bc-4ba0-b299-be332d3a68f4',
  token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IlBmNEhwSlJPNlB5TTd2eU00amRiaHV0T2NMRy0xQTlnZHpQMnNISzM3dHMiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiI3NmYwMWRhZi01NWQ5LTQ2N2UtYTBmZi03NWUzODgxNGJmOWYiLCJpc3MiOiJodHRwczovL2NpdGZsb3dwcmRiMmMuYjJjbG9naW4uY29tLzBhODc5MDU0LWY3YTUtNDdmYS1iODhlLWE1NmIzYzMwYjIwMS92Mi4wLyIsImV4cCI6MTc2OTAwNDAyMiwibmJmIjoxNzY4OTE3NjIyLCJzdWIiOiJlYmM2ZWEyNy1jNmVhLTQyMWMtODQ0OS0wYjhmNjViYzRlZTIiLCJlbWFpbCI6ImFmZWxpcGVAY2lhbmR0LmNvbSIsImdpdmVuX25hbWUiOiJBbnRvbmlvIiwiZmFtaWx5X25hbWUiOiJQaXJlcyBGZWxpcGUiLCJuYW1lIjoiQW50b25pbyBQaXJlcyBGZWxpcGUiLCJpZHAiOiJnb29nbGUuY29tIiwiY2hhbm5lbCI6InBvcnRhbCIsInRlbmFudCI6ImNpYW5kdGl0Iiwicm9sZXMiOiJmbG93Y29yZS51c2VyLGNoYXR3aXRoZG9jcy51c2VyLGJhY2tsb2dyZWZpbmVyLnVzZXIsYmFja2xvZ3JlZmluZXIuYWRtaW4sYWdlbnRydW5uZXIudXNlcixmbG93b3BzLnVzZXIsbWFrZXIudXNlciIsImluZnJhVGVuYW50IjoiY2lhbmR0aXQyIiwiYWNjZXNzUHJvZmlsZXMiOltdLCJ0aWQiOiIwYTg3OTA1NC1mN2E1LTQ3ZmEtYjg4ZS1hNTZiM2MzMGIyMDEiLCJhenAiOiI3NmYwMWRhZi01NWQ5LTQ2N2UtYTBmZi03NWUzODgxNGJmOWYiLCJ2ZXIiOiIxLjAiLCJpYXQiOjE3Njg5MTc2MjJ9.UZNdIECLDvCGyv8mg4sHL-IhHuOnCwC3YJLC4pY_hru7Y2C1vqBof_KGXBzOv7VcfTAkeojm-Sj5AJfp99Fq9w75M1clMoPhiR_PsFQA0ICzUuBHr0NAetgHQ4Yy4QGOoquKM7e5Ky-fneZ9FbZgEPOQ8C71b6sCSc3jGsSC-BSPy5o8e9UXX2123uEcvfjbwbJlPvT9A5MYcpaYVu_r53Fnvpyl7xnAJTwKLwskFaEySm9Qu-mLIoJLhrDSwtHMM6KwdK10iqR12or2PDHUA0O37opP9nv3z_z4DTHO8lfi2A11h72qA2XuBicytVWyECq-lWsr9paC7bddp5XOgw'
}

/**
 * Build the Flow API request payload with proper tweaks configuration
 */
function buildFlowPayload(productQuery: string): object {
  return {
    output_type: 'chat',
    input_type: 'chat',
    input_value: productQuery,
    tweaks: {
      'ChatInput-RBUbF': {
        files: [],
        sender: 'User',
        sender_name: 'User',
        session_id: '',
        should_store_message: true
      },
      'Prompt-WuYn3': {
        template: 'Você como bom consumidor precisar pesquisar o seguinte produto: {produto}\nbusque os melhores preços para ele na amazon, magalu e mercado livre.\n- mais barato\n- seguro',
        tool_placeholder: '',
        produto: ''
      },
      'ChatOutput-lir7z': {
        data_template: '{text}',
        sender: 'Machine',
        sender_name: 'AI',
        session_id: '',
        should_store_message: true
      },
      'LanguageModelComponent-5IbHO': {
        model_name: 'gpt-4.1',
        provider: 'OpenAI',
        stream: false,
        temperature: 0.1
      }
    }
  }
}

/**
 * Search for product links using CI&T Flow API
 * 
 * @param productName - Name of the product to search for
 * @param description - Optional description for better search results
 * @returns Promise with search results or error
 */
export async function searchProductLinks(
  productName: string,
  description?: string
): Promise<ShoppingSearchResult> {
  try {
    // Validate input
    if (!productName || productName.trim().length === 0) {
      return {
        success: false,
        error: 'Product name is required'
      }
    }

    // Prepare search query (combine name and description if available)
    const searchQuery = description 
      ? `${productName} - ${description}`
      : productName

    // Build API URL
    const apiUrl = `${FLOW_CONFIG.baseUrl}/api/v1/run/${FLOW_CONFIG.flowId}`

    // Build request payload with proper tweaks configuration
    const payload = buildFlowPayload(searchQuery)

    console.log('Calling Flow API with payload:', JSON.stringify(payload, null, 2))

    // Call CI&T Flow API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'FlowToken': FLOW_CONFIG.token
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Flow API error: ${response.status} ${response.statusText}`, errorText)
      return {
        success: false,
        error: `API request failed: ${response.statusText}`
      }
    }

    const result = await response.json()
    console.log('Flow API response:', JSON.stringify(result, null, 2))
    
    // Parse the response to extract shopping links
    const parsedLinks = parseFlowApiResponse(result)

    // Validate that we got at least one link
    if (!parsedLinks.mercadoLivre && !parsedLinks.amazon && !parsedLinks.magalu) {
      return {
        success: false,
        error: 'No shopping links found in API response'
      }
    }

    return {
      success: true,
      data: parsedLinks
    }

  } catch (error) {
    console.error('Error searching product links:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Parse CI&T Flow API response to extract shopping links
 * 
 * The API returns a chat response that needs to be parsed to extract
 * the actual shopping URLs for each platform. The response structure can vary:
 * - outputs[0].outputs[0].results.message.text (nested structure)
 * - text/message/output_value (direct properties)
 */
function parseFlowApiResponse(apiResponse: any): SearchProductResponse {
  try {
    const links: SearchProductResponse = {}
    
    // Try to extract text content from response
    let responseText = ''
    
    // Handle nested structure: outputs[0].outputs[0].results.message.text
    if (apiResponse.outputs?.[0]?.outputs?.[0]?.results?.message?.text) {
      responseText = apiResponse.outputs[0].outputs[0].results.message.text
    }
    // Handle alternative nested structure
    else if (apiResponse.outputs?.[0]?.results?.message?.text) {
      responseText = apiResponse.outputs[0].results.message.text
    }
    // Handle direct properties
    else if (typeof apiResponse === 'string') {
      responseText = apiResponse
    } else if (apiResponse.output_value) {
      responseText = apiResponse.output_value
    } else if (apiResponse.text) {
      responseText = apiResponse.text
    } else if (apiResponse.message) {
      responseText = apiResponse.message
    }

    console.log('Extracted response text:', responseText)

    if (!responseText) {
      console.warn('No text content found in API response')
      return links
    }

    // Extract URLs from text using regex patterns for each platform
    // Clean URLs by removing markdown formatting and trailing punctuation
    
    // Mercado Livre patterns
    const mlPatterns = [
      /https?:\/\/(?:www\.)?mercadolivre\.com\.br\/[^\s\)]+/gi,
      /https?:\/\/(?:www\.)?mercadolibre\.com\.br\/[^\s\)]+/gi,
      /https?:\/\/produto\.mercadolivre\.com\.br\/[^\s\)]+/gi
    ]
    
    for (const pattern of mlPatterns) {
      const match = responseText.match(pattern)
      if (match && match[0]) {
        links.mercadoLivre = cleanUrl(match[0])
        break
      }
    }

    // Amazon patterns
    const amazonPatterns = [
      /https?:\/\/(?:www\.)?amazon\.com\.br\/[^\s\)]+/gi,
      /https?:\/\/(?:www\.)?amzn\.to\/[^\s\)]+/gi
    ]
    
    for (const pattern of amazonPatterns) {
      const match = responseText.match(pattern)
      if (match && match[0]) {
        links.amazon = cleanUrl(match[0])
        break
      }
    }

    // Magazine Luiza patterns
    const magaluPatterns = [
      /https?:\/\/(?:www\.)?magazineluiza\.com\.br\/[^\s\)]+/gi,
      /https?:\/\/(?:www\.)?magalu\.com\.br\/[^\s\)]+/gi
    ]
    
    for (const pattern of magaluPatterns) {
      const match = responseText.match(pattern)
      if (match && match[0]) {
        links.magalu = cleanUrl(match[0])
        break
      }
    }

    console.log('Parsed links:', links)
    return links

  } catch (error) {
    console.error('Error parsing Flow API response:', error)
    return {}
  }
}

/**
 * Clean URL by removing markdown formatting and trailing punctuation
 */
function cleanUrl(url: string): string {
  return url
    .replace(/[\[\]\(\)]/g, '') // Remove markdown brackets/parentheses
    .replace(/[,;.]+$/, '')      // Remove trailing punctuation
    .trim()
}

/**
 * Validate if a URL is accessible and returns a valid response
 */
export async function validateShoppingLink(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000) // 5 second timeout
    })
    return response.ok
  } catch (error) {
    console.error(`Error validating link ${url}:`, error)
    return false
  }
}
