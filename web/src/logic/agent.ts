import randCoord from 'src/utilities/randCoord'
import fakeWord from 'src/utilities/fakeWord'
import { startingFullness, mutationMultiplier } from 'src/variables'
export default class Agent {
    id: string
    /** Basal metabolic rate, i.e. energy use per unit time */
    alive: boolean
    periodsSurvived: number
    /** The share of the agent's bmr used for speed, between 0 to 1 */
    speed: number
    /** The share of the agent's bmr used for perception, between 0 to 1 */
    perception: number
    x: number
    y: number
    fullness: number
    distPerTick: number
    distPerceptible: number
    generation: number
    destination: [number, number]
    destinationIsFood: boolean
    existentialism: number

    constructor(
        x: number = 0,
        y: number = 0,
        /** The share of the agent's bmr used for perception, between 0 to 1 */
        perception: number,
        generation: number = 1
    ) {
        if (perception >= 1 || perception <= 0)
            throw new TypeError('Perception must be between 0 and 1')
        this.id =
            generation +
            '-' +
            fakeWord() +
            '-' +
            Math.random().toString().substring(14)
        this.x = x
        this.y = y
        this.periodsSurvived = 0

        this.alive = true
        this.generation = generation
        // Introduce mutations
        const mutation =
            1 + (Math.random() - Math.random()) * mutationMultiplier
        this.perception = perception * mutation
        this.speed = 1 - this.perception
        this.distPerTick = 10 * this.speed
        this.distPerceptible = this.perception * 75
        this.fullness = startingFullness
        this.destination = randCoord()
        this.destinationIsFood = false
    }
}
