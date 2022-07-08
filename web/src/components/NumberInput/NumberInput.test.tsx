import { render } from '@redwoodjs/testing/web'

import NumberInput from './NumberInput'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('NumberInput', () => {
    it('renders successfully', () => {
        expect(() => {
            render(
                <NumberInput
                    value={10}
                    name="Number of marmots"
                    min={1}
                    max={100}
                    setValue={(v: number) => {}}
                />
            )
        }).not.toThrow()
    })
})
