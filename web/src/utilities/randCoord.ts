import { canvasHeight, canvasWidth } from 'src/variables'

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function randCoord(
    width: number = canvasWidth,
    height: number = canvasHeight
): [number, number] {
    return [getRandomInt(0, width), getRandomInt(0, height)]
}
