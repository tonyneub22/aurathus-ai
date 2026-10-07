import { describe, expect, it, vi } from 'vitest'
import { submitConsult } from './consult'
import { site } from '../config/site'

describe('submitConsult', () => {
  it('posts JSON to the configured endpoint', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true })
    await submitConsult({ name: 'Ada' }, fetchImpl)
    expect(fetchImpl).toHaveBeenCalledWith(
      site.consult.endpoint,
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ name: 'Ada' }) }),
    )
  })

  it('throws when the server rejects it', async () => {
    await expect(submitConsult({}, vi.fn().mockResolvedValue({ ok: false, status: 404 }))).rejects.toThrow('404')
  })
})
