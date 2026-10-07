import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import GhostFibers from './GhostFibers'
import { createGhostFibers } from '../../three/ghostFibers'

const controller = { update: vi.fn(), dispose: vi.fn() }
vi.mock('../../three/ghostFibers', () => ({ createGhostFibers: vi.fn(() => controller) }))

describe('<GhostFibers />', () => {
  it('passes props through to the controller and frees the GPU on unmount', () => {
    const { rerender, unmount } = render(<GhostFibers speed={0.1} active still={false} />)
    expect(createGhostFibers).toHaveBeenCalledTimes(1)
    expect(controller.update).toHaveBeenLastCalledWith({ speed: 0.1, active: true, still: false })

    rerender(<GhostFibers speed={0.1} active={false} still />)
    expect(controller.update).toHaveBeenLastCalledWith({ speed: 0.1, active: false, still: true })
    expect(createGhostFibers).toHaveBeenCalledTimes(1) // props don't rebuild the context

    unmount()
    expect(controller.dispose).toHaveBeenCalled()
  })
})
