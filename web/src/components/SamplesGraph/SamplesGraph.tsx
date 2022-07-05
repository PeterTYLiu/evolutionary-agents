import { useEffect, useRef } from 'react'

const height = 120
const width = 500

const SamplesGraph = ({
    data,
    title,
    colour,
    value
}: {
    data: number[]
    title: string
    colour: string
    value: number
}) => {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
        ctx.clearRect(0, 0, width, height)
        if (!data.length) return
        // Draw bars
        ctx.fillStyle = colour
        let barWidth = Math.min(width / data.length, 20)
        let max = Math.max(...data)
        for (let i = 0; i < data.length; i++) {
            ctx.beginPath()
            ctx.fillRect(
                barWidth * i,
                (max - data[i]) * (height / max),
                barWidth,
                height
            )
        }
    }, [data])

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{
                paddingTop: '20px',
                flexGrow: '1',
                flexShrink: '1'
            }}
        />
    )
}

export default SamplesGraph
