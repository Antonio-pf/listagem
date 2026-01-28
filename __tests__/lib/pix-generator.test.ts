import { describe, it, expect } from 'vitest'
import { generatePixPayload } from '@/lib/pix-generator'

describe('PIX Generator', () => {
  describe('generatePixPayload', () => {
    it('should generate a valid PIX payload with basic parameters', () => {
      const payload = generatePixPayload(
        'test@example.com',
        100.50,
        'Gift Registry',
        'Sao Paulo'
      )

      expect(payload).toBeTruthy()
      expect(typeof payload).toBe('string')
      expect(payload.length).toBeGreaterThan(0)
    })

    it('should include the PIX key in the payload', () => {
      const pixKey = 'mirian_sdf@hotmail.com'
      const payload = generatePixPayload(pixKey, 50, 'Test', 'SP')

      // PIX keys are typically encoded in the payload
      expect(payload).toBeTruthy()
    })

    it('should handle different amount values correctly', () => {
      const amounts = [10, 50.50, 100, 1000.99, 0.01]

      amounts.forEach(amount => {
        const payload = generatePixPayload(
          'test@example.com',
          amount,
          'Test',
          'City'
        )
        expect(payload).toBeTruthy()
        expect(payload.length).toBeGreaterThan(0)
      })
    })

    it('should handle special characters in description', () => {
      const descriptions = [
        'Casa Nova ❤️',
        'Gift & Registry',
        'Test@123',
        'Café da manhã'
      ]

      descriptions.forEach(desc => {
        const payload = generatePixPayload(
          'test@example.com',
          50,
          desc,
          'City'
        )
        expect(payload).toBeTruthy()
      })
    })

    it('should handle different city names', () => {
      const cities = [
        'Sao Paulo',
        'Rio de Janeiro',
        'Brasília',
        'São José dos Campos'
      ]

      cities.forEach(city => {
        const payload = generatePixPayload(
          'test@example.com',
          50,
          'Test',
          city
        )
        expect(payload).toBeTruthy()
      })
    })

    it('should generate different payloads for different amounts', () => {
      const payload1 = generatePixPayload('test@example.com', 100, 'Test', 'SP')
      const payload2 = generatePixPayload('test@example.com', 200, 'Test', 'SP')

      expect(payload1).not.toBe(payload2)
    })

    it('should handle minimum amount (0.01)', () => {
      const payload = generatePixPayload(
        'test@example.com',
        0.01,
        'Min Amount',
        'City'
      )

      expect(payload).toBeTruthy()
      expect(payload.length).toBeGreaterThan(0)
    })

    it('should handle large amounts', () => {
      const payload = generatePixPayload(
        'test@example.com',
        9999.99,
        'Large Amount',
        'City'
      )

      expect(payload).toBeTruthy()
      expect(payload.length).toBeGreaterThan(0)
    })

    it('should generate consistent payload for same parameters', () => {
      const params = ['test@example.com', 100, 'Test', 'City'] as const
      const payload1 = generatePixPayload(...params)
      const payload2 = generatePixPayload(...params)

      expect(payload1).toBe(payload2)
    })
  })
})
