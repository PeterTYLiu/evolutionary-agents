import randCoord from 'src/utilities/randCoord'
import fakeWord from 'src/utilities/fakeWord'
import {
    mutationMultiplier,
    reproductionCost,
    distPerTickPerPercent,
    distPerceptiblePerPercent
} from 'src/variables'
export default class Agent {
    id: string
    name: string
    /** Basal metabolic rate, i.e. energy use per unit time */
    periodsSurvived: number
    /** The share of the agent's bmr used for speed, between 0 to 1 */
    speed: number
    /** The share of the agent's bmr used for perception, between 0 to 1 */
    perception: number
    x: number
    y: number
    energy: number
    startingEnergy: number
    distPerTick: number
    distPerceptible: number
    generation: number
    destination: [number, number]
    destinationIsFood: boolean
    reproductionThreshold: number

    constructor(
        x: number = 0,
        y: number = 0,
        /** The share of the agent's bmr used for perception, between 0 to 1 */
        perception: number,
        startingEnergy: number,
        generation: number = 1
    ) {
        if (perception >= 1 || perception <= 0)
            throw new TypeError('Perception must be between 0 and 1')
        this.name = fakeWord()
        this.id =
            generation +
            '-' +
            this.name +
            '-' +
            Math.random().toString().substring(14)
        this.x = x
        this.y = y
        this.periodsSurvived = 0

        this.generation = generation
        // Introduce mutations
        const perceptionMutation =
            1 + (Math.random() - Math.random()) * mutationMultiplier
        const startingEnergyMutation =
            1 + (Math.random() - Math.random()) * mutationMultiplier
        this.perception = perception ** perceptionMutation
        this.speed = 1 - this.perception
        this.distPerTick = this.speed * distPerTickPerPercent
        this.distPerceptible =
            (this.perception * distPerceptiblePerPercent) ** 2
        this.energy = startingEnergy
        this.startingEnergy = Math.round(
            startingEnergy * startingEnergyMutation
        )
        this.reproductionThreshold = this.startingEnergy * 2 + reproductionCost
        this.destination = randCoord()
        this.destinationIsFood = false
    }
}
