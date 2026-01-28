import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  saveReservation,
  getReservations,
  getReservationByGiftId,
  getReservationsByUser,
  removeReservation,
  canCancelReservation,
} from '@/lib/reservation-storage'
import { supabase } from '@/lib/supabase'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    channel: vi.fn(),
  },
}))

describe('Reservation Storage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('saveReservation', () => {
    it('should save a physical gift reservation successfully', async () => {
      const mockGift = { is_open_value: false }
      const mockReservation = {
        id: '1',
        gift_id: 'gift-123',
        guest_id: 'user-456',
        guest_name: 'João Silva',
        has_companion: true,
        contribution_type: 'physical',
      }

      // Mock gift check (no existing reservation)
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockGift, error: null }),
          }),
        }),
      } as any)

      // Mock reservation check (no existing)
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      } as any)

      // Mock insert
      vi.mocked(supabase.from).mockReturnValueOnce({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockReservation, error: null }),
          }),
        }),
      } as any)

      const result = await saveReservation(
        'gift-123',
        'user-456',
        'João Silva',
        true,
        'physical'
      )

      expect(result.success).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should save a PIX contribution successfully', async () => {
      const mockGift = { is_open_value: false }
      const mockReservation = {
        id: '2',
        gift_id: 'gift-123',
        guest_id: 'user-789',
        guest_name: 'Maria Santos',
        has_companion: false,
        contribution_type: 'pix',
        gift_price: 150.00,
      }

      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockGift, error: null }),
          }),
        }),
      } as any)

      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      } as any)

      vi.mocked(supabase.from).mockReturnValueOnce({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockReservation, error: null }),
          }),
        }),
      } as any)

      const result = await saveReservation(
        'gift-123',
        'user-789',
        'Maria Santos',
        false,
        'pix',
        150.00
      )

      expect(result.success).toBe(true)
    })

    it('should allow multiple reservations for open value gifts', async () => {
      const mockGift = { is_open_value: true }
      const mockReservation = { id: '3', gift_id: 'gift-open-123' }

      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockGift, error: null }),
          }),
        }),
      } as any)

      // No check for existing reservation since it's open value
      vi.mocked(supabase.from).mockReturnValueOnce({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockReservation, error: null }),
          }),
        }),
      } as any)

      const result = await saveReservation(
        'gift-open-123',
        'user-111',
        'Pedro Alves',
        false,
        'pix',
        75.00
      )

      expect(result.success).toBe(true)
    })

    it('should fail if gift is already reserved', async () => {
      const mockGift = { is_open_value: false }
      const existingReservation = { id: '999' }

      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockGift, error: null }),
          }),
        }),
      } as any)

      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: existingReservation, error: null }),
          }),
        }),
      } as any)

      const result = await saveReservation(
        'gift-123',
        'user-456',
        'João Silva',
        true,
        'physical'
      )

      expect(result.success).toBe(false)
      expect(result.error).toBe('Este presente já foi reservado por outra pessoa.')
    })

    it('should handle database errors gracefully', async () => {
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB Error' } }),
          }),
        }),
      } as any)

      const result = await saveReservation(
        'gift-123',
        'user-456',
        'João Silva',
        true,
        'physical'
      )

      expect(result.success).toBe(false)
      expect(result.error).toBe('Erro ao verificar presente.')
    })

    it('should handle insert errors', async () => {
      const mockGift = { is_open_value: false }

      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockGift, error: null }),
          }),
        }),
      } as any)

      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      } as any)

      vi.mocked(supabase.from).mockReturnValueOnce({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Insert failed' } }),
          }),
        }),
      } as any)

      const result = await saveReservation(
        'gift-123',
        'user-456',
        'João Silva',
        true,
        'physical'
      )

      expect(result.success).toBe(false)
      expect(result.error).toBe('Erro ao salvar reserva. Tente novamente.')
    })
  })

  describe('getReservations', () => {
    it('should return all reservations ordered by date', async () => {
      const mockData = [
        {
          gift_id: 'gift-1',
          guest_name: 'João Silva',
          has_companion: true,
          reserved_at: '2024-01-20T10:00:00Z',
          contribution_type: 'physical',
          gift_price: null,
        },
        {
          gift_id: 'gift-2',
          guest_name: 'Maria Santos',
          has_companion: false,
          reserved_at: '2024-01-19T15:30:00Z',
          contribution_type: 'pix',
          gift_price: 200.00,
        },
      ]

      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
        }),
      } as any)

      const result = await getReservations()

      expect(result).toHaveLength(2)
      expect(result[0].giftId).toBe('gift-1')
      expect(result[0].userName).toBe('João Silva')
      expect(result[0].contributionType).toBe('physical')
      expect(result[1].giftPrice).toBe(200.00)
    })

    it('should return empty array on error', async () => {
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: null, error: { message: 'Error' } }),
        }),
      } as any)

      const result = await getReservations()

      expect(result).toEqual([])
    })

    it('should handle null data response', async () => {
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      } as any)

      const result = await getReservations()

      expect(result).toEqual([])
    })
  })

  describe('getReservationByGiftId', () => {
    it('should return reservation for specific gift', async () => {
      const mockData = {
        gift_id: 'gift-123',
        guest_name: 'João Silva',
        has_companion: true,
        reserved_at: '2024-01-20T10:00:00Z',
        contribution_type: 'physical',
        gift_price: null,
      }

      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      } as any)

      const result = await getReservationByGiftId('gift-123')

      expect(result).toBeDefined()
      expect(result?.giftId).toBe('gift-123')
      expect(result?.userName).toBe('João Silva')
    })

    it('should return undefined if reservation not found', async () => {
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      } as any)

      const result = await getReservationByGiftId('gift-999')

      expect(result).toBeUndefined()
    })

    it('should return undefined on error', async () => {
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: { message: 'Error' } }),
          }),
        }),
      } as any)

      const result = await getReservationByGiftId('gift-123')

      expect(result).toBeUndefined()
    })
  })

  describe('getReservationsByUser', () => {
    it('should return all reservations for a specific user', async () => {
      const mockData = [
        {
          gift_id: 'gift-1',
          guest_name: 'João Silva',
          has_companion: true,
          reserved_at: '2024-01-20T10:00:00Z',
          contribution_type: 'physical',
          gift_price: null,
        },
        {
          gift_id: 'gift-2',
          guest_name: 'João Silva',
          has_companion: false,
          reserved_at: '2024-01-19T15:30:00Z',
          contribution_type: 'pix',
          gift_price: 100.00,
        },
      ]

      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      } as any)

      const result = await getReservationsByUser('user-123')

      expect(result).toHaveLength(2)
      expect(result[0].userName).toBe('João Silva')
      expect(result[1].contributionType).toBe('pix')
    })

    it('should return empty array if user has no reservations', async () => {
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      } as any)

      const result = await getReservationsByUser('user-999')

      expect(result).toEqual([])
    })

    it('should return empty array on error', async () => {
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: null, error: { message: 'Error' } }),
          }),
        }),
      } as any)

      const result = await getReservationsByUser('user-123')

      expect(result).toEqual([])
    })
  })

  describe('removeReservation', () => {
    it('should remove reservation if user is the owner', async () => {
      const mockReservation = { guest_id: 'user-123' }

      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: mockReservation, error: null }),
          }),
        }),
      } as any)

      vi.mocked(supabase.from).mockReturnValueOnce({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      } as any)

      const result = await removeReservation('gift-123', 'user-123')

      expect(result.success).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should fail if reservation not found', async () => {
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      } as any)

      const result = await removeReservation('gift-999', 'user-123')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Reserva não encontrada.')
    })

    it('should fail if user is not the owner', async () => {
      const mockReservation = { guest_id: 'user-456' }

      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: mockReservation, error: null }),
          }),
        }),
      } as any)

      const result = await removeReservation('gift-123', 'user-123')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Você só pode cancelar suas próprias reservas.')
    })

    it('should handle delete errors', async () => {
      const mockReservation = { guest_id: 'user-123' }

      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: mockReservation, error: null }),
          }),
        }),
      } as any)

      vi.mocked(supabase.from).mockReturnValueOnce({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: { message: 'Delete failed' } }),
        }),
      } as any)

      const result = await removeReservation('gift-123', 'user-123')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Erro ao cancelar reserva. Tente novamente.')
    })
  })

  describe('canCancelReservation', () => {
    it('should return true if user owns the reservation', async () => {
      const mockData = { guest_id: 'user-123' }

      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      } as any)

      const result = await canCancelReservation('gift-123', 'user-123')

      expect(result).toBe(true)
    })

    it('should return false if user does not own the reservation', async () => {
      const mockData = { guest_id: 'user-456' }

      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      } as any)

      const result = await canCancelReservation('gift-123', 'user-123')

      expect(result).toBe(false)
    })

    it('should return false if reservation not found', async () => {
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      } as any)

      const result = await canCancelReservation('gift-999', 'user-123')

      expect(result).toBe(false)
    })

    it('should return false on error', async () => {
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: { message: 'Error' } }),
          }),
        }),
      } as any)

      const result = await canCancelReservation('gift-123', 'user-123')

      expect(result).toBe(false)
    })
  })
})
