import { render } from '@redwoodjs/testing/web'

import SamplesGraph from './SamplesGraph'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('SamplesGraph', () => {
    it('renders successfully', () => {
        expect(() => {
            render(
                <SamplesGraph
                    data={[1, 2, 3]}
                    title="Eggs over time"
                    colour="green"
                    value={0}
                />
            )
        }).not.toThrow()
    })
})
