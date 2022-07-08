import './NumberInput.scss'

type NumberInputProps = {
    value: number
    name: string
    min: number
    max: number
    setValue(v: number): void
}

const NumberInput = ({ value, name, min, max, setValue }: NumberInputProps) => {
    return (
        <div className="NumberInput">
            <div>
                <h3>{name}</h3>
                <input
                    type="number"
                    name={name}
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => setValue(parseInt(e.target.value))}
                />
            </div>
            <input
                type="range"
                name={name}
                min={min}
                max={max}
                value={value}
                onChange={(e) => setValue(parseInt(e.target.value))}
            />
        </div>
    )
}

export default NumberInput
