export default function distBetween(
    point1: [number, number],
    point2: [number, number]
) {
    return ((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2) ** 0.5
}
