import { site } from '../config/site'

/** Posts a consultation request. Throws on any non-2xx so the form can show its fallback. */
export async function submitConsult(values, fetchImpl = fetch) {
  const res = await fetchImpl(site.consult.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  })
  if (!res.ok) throw new Error(`Consult request failed: ${res.status}`)
}
