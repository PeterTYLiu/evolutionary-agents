import { MetaTags } from '@redwoodjs/web'
import { useState, useRef, useEffect } from 'react'
import { SimState } from 'types/types'
import Agent from 'src/logic/agent'
import Food from 'src/logic/food'
import {
    canvasHeight,
    canvasWidth,
    defaultFoodGenRate,
    startingFood,
    defaultAnimationSpeed,
    startingAgents,
    hungerRate,
    startingFullness,
    defaultPerception,
    samplingRate
} from 'src/variables'
import randCoord from 'src/utilities/randCoord'
import distBetween from 'src/utilities/distBetween'

export default function HomePage() {
    const [simState, setSimState] = useState<SimState>('before')
    const [agents, setAgents] = useState<Agent[]>([])
    const [food, setFood] = useState<Food[]>([])
    const [currentTick, setCurrentTick] = useState(1)
    const [foodGenRate, setFoodGenRate] = useState(defaultFoodGenRate)
    // External to simulation
    const [animationSpeed, setAnimationSpeed] = useState(defaultAnimationSpeed)
    const [carryingCapSamples, setCarryingCapSamples] = useState<number[]>([])
    const [avgPerceptSamples, setAvgPerceptSamples] = useState<number[]>([])

    let averagePerception =
        agents.reduce((a, b) => a + b.perception, 0) / agents.length

    const canvasRef = useRef(null)

    const generateAgents = (
        numOfAgents: number,
        startingPerception: number
    ) => {
        let newAgents = []
        for (let i = 0; i < numOfAgents; i++) {
            newAgents.push(new Agent(0, 0, startingPerception, 1))
        }
        setAgents(newAgents)
    }

    const generateFood = (numOfFood: number) => {
        let newFood: Food[] = []
        for (let i = 0; i < numOfFood; i++) {
            let [x, y] = randCoord()
            while (newFood.find((f) => f.x === x && f.y === y)) {
                ;[x, y] = randCoord()
            }
            newFood.push(new Food(x, y))
        }
        setFood(newFood)
    }

    const startSim = () => {
        generateAgents(startingAgents, defaultPerception)
        generateFood(startingFood)
        setSimState('active')
    }

    // Change the state every 50ms
    useEffect(() => {
        if (simState !== 'active') return
        const interval = setInterval(() => {
            // Sample data
            if (currentTick % samplingRate === 0) {
                setCarryingCapSamples([...carryingCapSamples, agents.length])
                setAvgPerceptSamples([
                    ...avgPerceptSamples,
                    Number(averagePerception.toFixed(3))
                ])
            }

            let currentFood = [...food]
            let currentAgents = [...agents]

            // Generate food every ${foodGenRate} ticks
            if (currentTick % foodGenRate === 0) {
                let [x, y] = randCoord()
                while (currentFood.find((f) => f.x === x && f.y === y)) {
                    ;[x, y] = randCoord()
                }
                currentFood.push(new Food(x, y))
            }

            // If agent is completely void of energy, it dies
            currentAgents = currentAgents.filter((a) => a.fullness > 0)

            // Agents get hungry every ${hungerRate} ticks
            if (currentTick % hungerRate === 0) {
                currentAgents.forEach((a) => a.fullness--)
            }

            currentAgents.forEach((a) => {
                a.periodsSurvived++
                // If agent is mature enough and has enough energy, it reproduces
                if (a.fullness > startingFullness * 2) {
                    currentAgents.push(
                        new Agent(
                            a.x + 4,
                            a.y + 4,
                            a.perception,
                            a.generation + 1
                        )
                    )
                    a.fullness -= startingFullness + 5
                }

                let [destX, destY] = a.destination
                let distToDest = distBetween(a.destination, [a.x, a.y])
                // If an agent is on a food, it eats it
                let foodBeingEaten = currentFood.find(
                    (f) => f.x === a.x && f.y === a.y
                )
                if (foodBeingEaten) {
                    currentFood = currentFood.filter(
                        (f) => f.id !== foodBeingEaten.id
                    )
                    a.fullness++
                }

                // Identify the nearest visible piece of food
                let nearestVisibleFood
                currentFood.forEach((f) => {
                    const distToFood = distBetween([f.x, f.y], [a.x, a.y])
                    if (distToFood <= a.distPerceptible) {
                        if (nearestVisibleFood) {
                            let distToPrevNearestFood = distBetween(
                                nearestVisibleFood,
                                [a.x, a.y]
                            )
                            if (distToFood < distToPrevNearestFood)
                                nearestVisibleFood = [f.x, f.y]
                        } else {
                            nearestVisibleFood = [f.x, f.y]
                        }
                    }
                })

                // If the agent is at its destination, make the nearest food or a random location its new destination
                if (a.x === a.destination[0] && a.y === a.destination[1]) {
                    let newDest = nearestVisibleFood ?? randCoord()
                    a.destination = newDest
                    a.destinationIsFood = !!nearestVisibleFood
                    destX = newDest[0]
                    destY = newDest[1]
                    distToDest = distBetween([a.x, a.y], newDest)
                }

                // Otherwise, make sure there is still food at your destination, and confirm that it is still the
                // closest food. If not, make the closest food your destination, if possible.
                else if (nearestVisibleFood) {
                    a.destinationIsFood = !!currentFood.find(
                        (f) =>
                            f.x === a.destination[0] && f.y === a.destination[1]
                    )
                    let distToNearestFood = distBetween(nearestVisibleFood, [
                        a.x,
                        a.y
                    ])
                    if (
                        distToNearestFood < distToDest ||
                        !a.destinationIsFood
                    ) {
                        a.destination = nearestVisibleFood
                        a.destinationIsFood = true
                        destX = nearestVisibleFood[0]
                        destY = nearestVisibleFood[1]
                        distToDest = distBetween([a.x, a.y], nearestVisibleFood)
                    }
                }

                // Agents move toward/to their destination
                if (distToDest <= a.distPerTick) {
                    a.x = destX
                    a.y = destY
                } else {
                    const angleToDestInRads = Math.atan2(
                        destY - a.y,
                        destX - a.x
                    )
                    let dX = Math.cos(angleToDestInRads)
                    let dY = Math.sin(angleToDestInRads)
                    a.x += a.distPerTick * dX
                    a.y += a.distPerTick * dY
                }
            })

            setAgents(currentAgents)
            setFood(currentFood)
            setCurrentTick(currentTick + 1)
        }, animationSpeed)
        return () => clearInterval(interval)
    }, [simState, currentTick])

    // Draw onto the canvas when state changes
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas || simState !== 'active') return
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)

        // Draw the agents' perception areas
        ctx.fillStyle = '#fee'
        agents.forEach((a) => {
            ctx.beginPath()
            ctx.arc(a.x, a.y, a.distPerceptible, 0, 2 * Math.PI)
            ctx.fill()
        })
        // Draw the agents
        ctx.fillStyle = '#f00'
        ctx.strokeStyle = '#f55'
        ctx.font = '14px arial'
        agents.forEach((a) => {
            // Draw the line to the destination
            ctx.setLineDash([4])
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(a.destination[0], a.destination[1])
            ctx.stroke()
            // Draw the background of the energy indicator
            ctx.fillStyle = '#fff'
            ctx.beginPath()
            ctx.arc(a.x, a.y, 10, 0, Math.PI * 2)
            ctx.fill()
            // Draw the outline of the energy indicator
            ctx.fillStyle = '#f00'
            ctx.setLineDash([0])
            ctx.fillText(a.id.split('-')[1], a.x, a.y + 22)
            ctx.beginPath()
            ctx.arc(a.x, a.y, 10, 0, 2 * Math.PI)
            ctx.stroke()
            ctx.beginPath()
            ctx.arc(a.x, a.y, 10, 0, Math.PI * (a.fullness / startingFullness))
            ctx.lineTo(a.x, a.y)
            ctx.fill()
            ctx.beginPath()
            ctx.arc(a.destination[0], a.destination[1], 2, 0, 2 * Math.PI)
            ctx.fill()
        })
        // Draw the food
        ctx.fillStyle = '#666'
        food.forEach((a) => {
            ctx.beginPath()
            ctx.arc(a.x, a.y, 3, 0, 2 * Math.PI)
            ctx.fill()
        })
        // Draw eating, death, and mitosis text
        ctx.font = '14px arial'
        ctx.fillStyle = '#000'
        ctx.textAlign = 'center'
        agents.forEach((a) => {
            let foodBeingEaten = food.find((f) => f.x === a.x && f.y === a.y)
            if (foodBeingEaten) ctx.fillText('RONCH!', a.x, a.y - 6)
            if (a.periodsSurvived < 15) ctx.fillText('Mitosis!', a.x, a.y - 6)
            if (a.fullness === 0) ctx.fillText('ARGH!', a.x, a.y - 6)
        })
    }, [currentTick, simState])

    return (
        <main>
            <MetaTags title="Home" description="Home page" />
            <div>
                <button type="button" onClick={startSim}>
                    Start
                </button>
                <button type="button" onClick={() => setSimState('paused')}>
                    Pause
                </button>
                <button type="button" onClick={() => setSimState('active')}>
                    Resume
                </button>
                <div style={{ display: 'inline' }}>
                    <input
                        type="range"
                        id="animation-speed"
                        name="animation-speed"
                        min="5"
                        max="100"
                        value={animationSpeed}
                        onChange={(e) =>
                            setAnimationSpeed(parseInt(e.target.value))
                        }
                    />
                    <label htmlFor="animation-speed">Frame duration</label>
                </div>
                <div style={{ display: 'inline' }}>
                    <input
                        type="range"
                        id="food-gen"
                        name="food-gen"
                        min="1"
                        max="6"
                        value={foodGenRate}
                        onChange={(e) =>
                            setFoodGenRate(parseInt(e.target.value))
                        }
                    />
                    <label htmlFor="food-gen">Food scarcity</label>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <canvas
                    ref={canvasRef}
                    width={canvasWidth}
                    height={canvasHeight}
                    style={{
                        outline: '1px solid black',
                        flexGrow: '0',
                        flexShrink: '0'
                    }}
                />
                <div style={{ paddingLeft: '16px' }}>
                    <h3>
                        {startingAgents} → {agents.length} agents
                    </h3>
                    <h3>
                        Average perception: {defaultPerception} →{' '}
                        {averagePerception.toFixed(2)}
                    </h3>
                    <h3>Periods: {currentTick}</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Gen</th>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Perception</th>
                                <th>Energy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...agents]
                                .sort((a, b) => {
                                    if (a.perception > b.perception) return -1
                                    else return 1
                                })
                                .map((a) => (
                                    <tr key={a.id}>
                                        <td>{a.generation}</td>
                                        <td>{a.id.split('-')[1]}</td>
                                        <td>{a.periodsSurvived}</td>
                                        <td
                                            style={{
                                                background: `linear-gradient(90deg, lightgreen 0 ${
                                                    a.perception * 100
                                                }%, white ${
                                                    a.perception * 100
                                                }% 100% )`
                                            }}
                                        >
                                            {a.perception.toFixed(2)}
                                        </td>
                                        <td
                                            style={{
                                                background: `linear-gradient(90deg, lightgreen 0 ${
                                                    (a.fullness /
                                                        startingFullness) *
                                                    50
                                                }%, white ${
                                                    (a.fullness /
                                                        startingFullness) *
                                                    50
                                                }% 100% )`
                                            }}
                                        >
                                            {a.fullness}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    )
}
