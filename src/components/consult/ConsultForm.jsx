import { useState } from 'react'
import { site } from '../../config/site'
import { submitConsult } from '../../lib/consult'

const { consult } = site

const control =
  'w-full border-0 border-b border-podo-gold/30 bg-transparent py-3 font-serif text-[18px] text-podo-white placeholder:text-podo-white/30 transition-colors duration-500 focus:border-podo-gold focus:outline-none'
const label = 'font-serif text-[13px] font-medium uppercase tracking-[0.28em] text-podo-gold/70'

function Field({ id, text, children }) {
  return (
    <div className="grid gap-1">
      <label htmlFor={id} className={label}>
        {text}
      </label>
      {children}
    </div>
  )
}

/** Request form. `send` is injectable so tests don't touch the network. */
export default function ConsultForm({ send = submitConsult }) {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  async function onSubmit(event) {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    setStatus('sending')
    try {
      await send(values)
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <p role="status" className="font-serif text-[22px] font-light leading-relaxed text-podo-white">
        {consult.sent}
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8">
      <Field id="name" text={consult.fields.name}>
        <input id="name" name="name" required autoComplete="name" className={control} />
      </Field>
      <Field id="email" text={consult.fields.email}>
        <input id="email" name="email" type="email" required autoComplete="email" className={control} />
      </Field>
      <Field id="company" text={consult.fields.company}>
        <input id="company" name="company" autoComplete="organization" className={control} />
      </Field>
      <Field id="interest" text={consult.fields.interest}>
        <select id="interest" name="interest" defaultValue={consult.interests[0]} className={control}>
          {consult.interests.map((option) => (
            <option key={option} value={option} className="bg-podo-black">
              {option}
            </option>
          ))}
        </select>
      </Field>
      <Field id="message" text={consult.fields.message}>
        <textarea id="message" name="message" required rows={5} className={`${control} resize-y`} />
      </Field>

      <div className="grid gap-4">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="justify-self-start border border-podo-gold/50 px-8 py-4 font-serif text-[13px] font-medium uppercase tracking-[0.34em] text-podo-white transition-colors duration-500 hover:border-podo-gold disabled:opacity-50"
        >
          {status === 'sending' ? consult.sending : consult.submit}
        </button>
        {status === 'error' && (
          <p role="alert" className="font-serif text-[17px] text-podo-white/70">
            {consult.failed}{' '}
            <a href={`mailto:${site.contact.email}`} className="text-podo-gold hover:text-podo-gold-hot">
              {site.contact.email}
            </a>
            .
          </p>
        )}
      </div>
    </form>
  )
}
