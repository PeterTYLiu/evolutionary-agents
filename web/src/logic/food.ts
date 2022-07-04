export default class Food {
    id: string
    x: number
    y: number

    constructor(x: number = 0, y: number = 0) {
        this.id = Math.random().toString().substring(2)
        this.x = x
        this.y = y
    }
}
