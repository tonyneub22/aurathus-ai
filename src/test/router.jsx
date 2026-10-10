import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'

/** render() inside a router, for components that use Link or route hooks. */
export function renderInRouter(ui, { route = '/' } = {}) {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>)
}
