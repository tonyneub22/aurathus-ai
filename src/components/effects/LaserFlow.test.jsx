import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import LaserFlow from './LaserFlow'
import { createLaserFlow } from '../../three/laserFlow'

const controller = { update: vi.fn(), dispose: vi.fn() }
vi.mock('../../three/laserFlow', () => ({ createLaserFlow: vi.fn(() => controller) }))

describe('<LaserFlow />', () => {
  it('passes props through to the controller and frees the GPU on unmount', () => {
    const { rerender, unmount } = render(<LaserFlow flowSpeed={0.2} active />)
    expect(createLaserFlow).toHaveBeenCalledTimes(1)
    expect(controller.update).toHaveBeenLastCalledWith({ flowSpeed: 0.2, active: true })

    rerender(<LaserFlow flowSpeed={0.2} active={false} />)
    expect(controller.update).toHaveBeenLastCalledWith({ flowSpeed: 0.2, active: false })
    expect(createLaserFlow).toHaveBeenCalledTimes(1) // props don't rebuild the context

    unmount()
    expect(controller.dispose).toHaveBeenCalled()
  })
})
