import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import ConsultForm from './ConsultForm'
import { site } from '../../config/site'

function fillAndSubmit() {
  const type = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } })
  type(site.consult.fields.name, 'Ada')
  type(site.consult.fields.email, 'ada@example.com')
  type(site.consult.fields.message, 'A new site')
  fireEvent.click(screen.getByRole('button', { name: site.consult.submit }))
}

describe('<ConsultForm />', () => {
  it('sends the entered values and confirms', async () => {
    const send = vi.fn().mockResolvedValue()
    render(<ConsultForm send={send} />)
    fillAndSubmit()
    expect(await screen.findByRole('status')).toHaveTextContent(site.consult.sent)
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Ada', email: 'ada@example.com', message: 'A new site' }),
    )
  })

  it('falls back to the email address, as text, when sending fails', async () => {
    render(<ConsultForm send={vi.fn().mockRejectedValue(new Error('404'))} />)
    fillAndSubmit()
    expect(await screen.findByRole('alert')).toHaveTextContent(site.contact.email)
  })
})
