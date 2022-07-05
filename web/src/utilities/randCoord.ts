import { canvasHeight, canvasWidth } from 'src/variables'

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function randCoord(
    minX: number = 0,
    minY: number = 0,
    maxX: number = canvasWidth,
    maxY: number = canvasHeight
): [number, number] {
    if (minX < 0) minX = 0
    if (minY < 0) minY = 0
    if (maxX > canvasWidth) maxX = canvasWidth
    if (maxY > canvasHeight) maxY = canvasHeight
    return [getRandomInt(minX, maxX), getRandomInt(minY, maxY)]
}
