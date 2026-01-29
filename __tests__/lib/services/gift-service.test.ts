import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getGifts, getGiftById, createGift, updateGift, deleteGift } from '@/lib/services/gift-service'
import { supabase } from '@/lib/supabase'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

describe('Gift Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getGifts', () => {
    it('should return all gifts sorted by name', async () => {
      const mockGifts = [
        { id: '1', name: 'Gift A', description: 'Desc A', image: 'img1.jpg', category: 'Sala', price: 100, is_open_value: false },
        { id: '2', name: 'Gift B', description: 'Desc B', image: 'img2.jpg', category: 'Cozinha', price: 200, is_open_value: false },
      ]

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: mockGifts, error: null }),
        }),
      } as any)

      const gifts = await getGifts()

      expect(gifts).toHaveLength(2)
      expect(gifts[0].name).toBe('Gift A')
      expect(gifts[1].price).toBe(200)
      expect(supabase.from).toHaveBeenCalledWith('gifts')
    })

    it('should return empty array on error', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: null, error: { message: 'Error' } }),
        }),
      } as any)

      const gifts = await getGifts()

      expect(gifts).toEqual([])
    })
  })

  describe('getGiftById', () => {
    it('should return gift by id', async () => {
      const mockGift = { id: '1', name: 'Gift A', description: 'Desc A', image: 'img1.jpg', category: 'Sala', price: 100, is_open_value: false }

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockGift, error: null }),
          }),
        }),
      } as any)

      const gift = await getGiftById('1')

      expect(gift).not.toBeNull()
      expect(gift?.name).toBe('Gift A')
      expect(gift?.price).toBe(100)
    })

    it('should return null if gift not found', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
          }),
        }),
      } as any)

      const gift = await getGiftById('999')

      expect(gift).toBeNull()
    })
  })

  describe('createGift', () => {
    it('should create a new gift successfully', async () => {
      const newGift = {
        name: 'New Gift',
        description: 'New description',
        image: 'new.jpg',
        category: 'Sala',
        price: 150,
        isOpenValue: false,
      }

      const mockCreatedGift = {
        id: 'new-id',
        ...newGift,
        is_open_value: false,
      }

      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockCreatedGift, error: null }),
          }),
        }),
      } as any)

      const result = await createGift(newGift)

      expect(result.success).toBe(true)
      expect(result.gift?.name).toBe('New Gift')
      expect(result.gift?.id).toBe('new-id')
    })

    it('should return error on creation failure', async () => {
      const newGift = {
        name: 'New Gift',
        description: 'New description',
        image: 'new.jpg',
        category: 'Sala',
        price: 150,
      }

      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Creation failed' } }),
          }),
        }),
      } as any)

      const result = await createGift(newGift)

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('updateGift', () => {
    it('should update gift successfully', async () => {
      const updatedData = { name: 'Updated Gift', price: 250 }
      const mockUpdatedGift = {
        id: '1',
        name: 'Updated Gift',
        description: 'Desc',
        image: 'img.jpg',
        category: 'Sala',
        price: 250,
        is_open_value: false,
      }

      vi.mocked(supabase.from).mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockUpdatedGift, error: null }),
            }),
          }),
        }),
      } as any)

      const result = await updateGift('1', updatedData)

      expect(result.success).toBe(true)
      expect(result.gift?.name).toBe('Updated Gift')
      expect(result.gift?.price).toBe(250)
    })
  })

  describe('deleteGift', () => {
    it('should not delete gift with existing reservations', async () => {
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ data: [{ id: 'res-1' }], error: null }),
          }),
        }),
      } as any)

      const result = await deleteGift('1')

      expect(result.success).toBe(false)
      expect(result.error).toContain('reservas')
    })

    it('should delete gift without reservations', async () => {
      vi.mocked(supabase.from)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({ data: [], error: null }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        } as any)

      const result = await deleteGift('1')

      expect(result.success).toBe(true)
    })
  })
})
