function randItem(arr: string[]): string {
    return arr[Math.floor(Math.random() * arr.length)]
}
const nonInitialVowels = ['y', 'ay', 'oy', 'oo', 'oa', 'ee', 'ee']
const nonTerminalVowels = ['ai']
const placementAgnosticVowels = [
    'a',
    'a',
    'e',
    'e',
    'e',
    'e',
    'i',
    'i',
    'o',
    'o',
    'u',
    'ea',
    'a',
    'a',
    'a',
    'a',
    'e',
    'e',
    'e',
    'e',
    'i',
    'i',
    'o',
    'o',
    'u',
    'ea',
    'a',
    'a',
    'e',
    'e',
    'e',
    'e',
    'i',
    'i',
    'o',
    'o',
    'e',
    'e',
    'e',
    'e',
    'i',
    'i',
    'o',
    'o',
    'u',
    'ea',
    'ou'
]
const vowelModifiers = ['r', 'n', 'l', 'ng', 'n', 'n', 'r', 'r', 'll']
const nonTerminalConsonants = [
    'bl',
    'br',
    'wr',
    'tr',
    'pr',
    'pl',
    'dr',
    'fl',
    'fr',
    'gr',
    'gl',
    'cr',
    'cl',
    'sn',
    'shr',
    'thr',
    'str',
    'w',
    'j',
    'h',
    'w',
    'j',
    'h',
    'r',
    'y',
    'n',
    'c',
    'c',
    'l',
    'w',
    'j',
    'h',
    'r',
    'y',
    'n',
    'l',
    'r',
    'y',
    'n',
    'c',
    'c',
    'l',
    'w',
    'j',
    'h',
    'r',
    'y',
    'n',
    'l',
    'v',
    'z',
    'scr',
    'wh',
    'sw',
    'sm'
]
const terminalOnlyConsonants = [
    'ts',
    'ps',
    'ss',
    'ds',
    'ck',
    'bs',
    'ms',
    'gs',
    'cks',
    'ks'
]
const placementAgnosticConsonants = [
    't',
    's',
    'm',
    't',
    's',
    'm',
    'b',
    'p',
    'd',
    'f',
    'g',
    'sm',
    'k',
    't',
    'b',
    'p',
    'm',
    's',
    'd',
    'f',
    'g',
    'k',
    'sh',
    'ch',
    'th',
    'st',
    't',
    's',
    'm',
    't',
    's',
    'm',
    'b',
    'p',
    'd',
    'f',
    'g',
    'k',
    't',
    'b',
    'p',
    'm',
    's',
    'd',
    'f',
    'g',
    'k',
    'sh',
    'ch',
    'th',
    'st',
    't',
    's',
    'm',
    't',
    's',
    'ph',
    'gh',
    'm',
    'b',
    'p',
    'd',
    'f',
    'g',
    'k',
    't',
    'b',
    'p',
    'm',
    's',
    'd',
    'f',
    'g',
    'k',
    'sh',
    'ch',
    'th',
    'st',
    't',
    's',
    'm',
    't',
    's',
    'm',
    'b',
    'p',
    'd',
    'f',
    'g',
    'k',
    't',
    'b',
    'p',
    'm',
    's',
    'd',
    'f',
    'g',
    'k',
    'sh',
    'ch',
    'th',
    'st',
    'x'
]
export default function fakeWord(): string {
    const constructSyllable = (
        initial: boolean = false,
        terminal: boolean = false
    ): string => {
        let syllable = ''
        const startsWithVowel = initial
            ? Math.random() > 0.9
            : Math.random() > 0.05
        const vowelIsModified = Math.random() > 0.8
        const endsWithConsonant = terminal
            ? Math.random() > 0.3
            : Math.random() > 0.05

        if (startsWithVowel) {
            let allowableVowels = [...placementAgnosticVowels]
            if (!initial)
                allowableVowels = [...allowableVowels, ...nonInitialVowels]
            if (!terminal)
                allowableVowels = [...allowableVowels, ...nonTerminalVowels]
            syllable += randItem(allowableVowels)
        } else {
            let allowableConsonants = [
                ...placementAgnosticConsonants,
                ...nonTerminalConsonants
            ]
            syllable += randItem(allowableConsonants)
            let allowableVowels = [
                ...placementAgnosticVowels,
                ...nonInitialVowels
            ]
            if (!terminal)
                allowableVowels = [...allowableVowels, ...nonTerminalVowels]
            syllable += randItem(allowableVowels)
        }

        if (vowelIsModified) syllable += randItem(vowelModifiers)

        if (endsWithConsonant)
            syllable += randItem([
                ...placementAgnosticConsonants,
                ...terminalOnlyConsonants
            ])

        return syllable
    }

    let word = ''
    const numOfSyllables = Math.ceil(Math.random() * 4)

    for (let i = 1; i <= numOfSyllables; i++) {
        let isInitial = i === 1
        let isTerminal = i === numOfSyllables
        word += constructSyllable(isInitial, isTerminal)
    }

    word = word[0].toUpperCase() + word.substring(1)

    return word
}

fakeWord()
