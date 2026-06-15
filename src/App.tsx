import { useEffect, useMemo, useState } from 'react'
import './App.css'

type Mode = 'study' | 'quiz'
type TrigFunction = 'sin' | 'cos' | 'tan'

type Flashcard = {
  angle: number
  trig: TrigFunction
  value: string
}

type QuizQuestion = {
  angle: number
  trig: TrigFunction
  answer: string
}

const UNIT_CIRCLE_VALUES: Record<number, { sin: string; cos: string; tan: string }> = {
  0: { sin: '0', cos: '1', tan: '0' },
  30: { sin: '1/2', cos: '√3/2', tan: '√3/3' },
  45: { sin: '√2/2', cos: '√2/2', tan: '1' },
  60: { sin: '√3/2', cos: '1/2', tan: '√3' },
  90: { sin: '1', cos: '0', tan: 'undefined' },
  120: { sin: '√3/2', cos: '-1/2', tan: '-√3' },
  135: { sin: '√2/2', cos: '-√2/2', tan: '-1' },
  150: { sin: '1/2', cos: '-√3/2', tan: '-√3/3' },
  180: { sin: '0', cos: '-1', tan: '0' },
  210: { sin: '-1/2', cos: '-√3/2', tan: '√3/3' },
  225: { sin: '-√2/2', cos: '-√2/2', tan: '1' },
  240: { sin: '-√3/2', cos: '-1/2', tan: '√3' },
  270: { sin: '-1', cos: '0', tan: 'undefined' },
  300: { sin: '-√3/2', cos: '1/2', tan: '-√3' },
  315: { sin: '-√2/2', cos: '√2/2', tan: '-1' },
  330: { sin: '-1/2', cos: '√3/2', tan: '-√3/3' },
}

const STUDY_CARDS: Flashcard[] = [
  // 0°
  { angle: 0, trig: 'sin', value: '0' },
  { angle: 0, trig: 'cos', value: '1' },
  { angle: 0, trig: 'tan', value: '0' },
  
  // 30°
  { angle: 30, trig: 'sin', value: '1/2' },
  { angle: 30, trig: 'cos', value: '√3/2' },
  { angle: 30, trig: 'tan', value: '√3/3' },
  
  // 45°
  { angle: 45, trig: 'sin', value: '√2/2' },
  { angle: 45, trig: 'cos', value: '√2/2' },
  { angle: 45, trig: 'tan', value: '1' },
  
  // 60°
  { angle: 60, trig: 'sin', value: '√3/2' },
  { angle: 60, trig: 'cos', value: '1/2' },
  { angle: 60, trig: 'tan', value: '√3' },
  
  // 90°
  { angle: 90, trig: 'sin', value: '1' },
  { angle: 90, trig: 'cos', value: '0' },
  { angle: 90, trig: 'tan', value: 'undefined' },
  
  // 120°
  { angle: 120, trig: 'sin', value: '√3/2' },
  { angle: 120, trig: 'cos', value: '-1/2' },
  { angle: 120, trig: 'tan', value: '-√3' },
  
  // 135°
  { angle: 135, trig: 'sin', value: '√2/2' },
  { angle: 135, trig: 'cos', value: '-√2/2' },
  { angle: 135, trig: 'tan', value: '-1' },
  
  // 150°
  { angle: 150, trig: 'sin', value: '1/2' },
  { angle: 150, trig: 'cos', value: '-√3/2' },
  { angle: 150, trig: 'tan', value: '-√3/3' },
  
  // 180°
  { angle: 180, trig: 'sin', value: '0' },
  { angle: 180, trig: 'cos', value: '-1' },
  { angle: 180, trig: 'tan', value: '0' },
  
  // 210°
  { angle: 210, trig: 'sin', value: '-1/2' },
  { angle: 210, trig: 'cos', value: '-√3/2' },
  { angle: 210, trig: 'tan', value: '√3/3' },
  
  // 225°
  { angle: 225, trig: 'sin', value: '-√2/2' },
  { angle: 225, trig: 'cos', value: '-√2/2' },
  { angle: 225, trig: 'tan', value: '1' },
  
  // 240°
  { angle: 240, trig: 'sin', value: '-√3/2' },
  { angle: 240, trig: 'cos', value: '-1/2' },
  { angle: 240, trig: 'tan', value: '√3' },
  
  // 270°
  { angle: 270, trig: 'sin', value: '-1' },
  { angle: 270, trig: 'cos', value: '0' },
  { angle: 270, trig: 'tan', value: 'undefined' },
  
  // 300°
  { angle: 300, trig: 'sin', value: '-√3/2' },
  { angle: 300, trig: 'cos', value: '1/2' },
  { angle: 300, trig: 'tan', value: '-√3' },
  
  // 315°
  { angle: 315, trig: 'sin', value: '-√2/2' },
  { angle: 315, trig: 'cos', value: '√2/2' },
  { angle: 315, trig: 'tan', value: '-1' },
  
  // 330°
  { angle: 330, trig: 'sin', value: '-1/2' },
  { angle: 330, trig: 'cos', value: '√3/2' },
  { angle: 330, trig: 'tan', value: '-√3/3' },
]

const QUIZ_ANGLES = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 300, 315, 330]
const TRIG_FUNCTIONS: TrigFunction[] = ['sin', 'cos', 'tan']

function formatAngleInRadians(angle: number) {
  const exact = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330]
  const fractions = [
    '0', 'π/6', 'π/4', 'π/3', 'π/2', '2π/3', '3π/4', '5π/6', 'π',
    '7π/6', '5π/4', '4π/3', '3π/2', '5π/3', '7π/4', '11π/6',
  ]
  const index = exact.indexOf(angle)
  return index >= 0 ? fractions[index] : `${angle}π/180`
}

function formatPrompt(angle: number, trig: TrigFunction) {
  return `${trig.toUpperCase()}(${formatAngleInRadians(angle)})`
}

function getAnswerFor(angle: number, trig: TrigFunction) {
  return UNIT_CIRCLE_VALUES[angle]?.[trig] ?? '0'
}

function normalizeInput(value: string) {
  return value
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/√\(([^)]+)\)/g, 'sqrt($1)')
    .replace(/√([0-9a-z]+)/g, 'sqrt($1)')
    .replace(/([0-9)])\(/g, '$1*(')
}

function evaluateExpression(expression: string) {
  const cleaned = normalizeInput(expression)
    .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
    .replace(/\^/g, '**')

  try {
    // eslint-disable-next-line no-new-func
    return Function(`"use strict"; return (${cleaned})`)() as number
  } catch {
    return Number.NaN
  }
}

function isAnswerCorrect(userAnswer: string, target: string) {
  if (!userAnswer.trim()) return false
  if (target === 'undefined') return userAnswer.toLowerCase().includes('undefined')

  const userValue = evaluateExpression(userAnswer)
  const targetValue = evaluateExpression(target)

  return Number.isFinite(userValue) && Number.isFinite(targetValue) && Math.abs(userValue - targetValue) < 1e-6
}

function App() {
  const [mode, setMode] = useState<Mode>('study')
  const [revealedCard, setRevealedCard] = useState(false)
  const [cardIndex, setCardIndex] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizDone, setQuizDone] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<string[]>([])
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [typedAnswer, setTypedAnswer] = useState('')
  const [feedback, setFeedback] = useState('')

  const currentCard = STUDY_CARDS[cardIndex]

  const currentQuestion = quizQuestions[questionIndex]

  useEffect(() => {
    if (!quizStarted || quizDone || timeLeft <= 0) return

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer)
          setQuizDone(true)
          setQuizStarted(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [quizStarted, quizDone, timeLeft])

  const startQuiz = () => {
    const generated: QuizQuestion[] = Array.from({ length: 30 }, () => {
      const angle = QUIZ_ANGLES[Math.floor(Math.random() * QUIZ_ANGLES.length)]
      const trig = TRIG_FUNCTIONS[Math.floor(Math.random() * TRIG_FUNCTIONS.length)]
      return { angle, trig, answer: getAnswerFor(angle, trig) }
    })

    setQuizQuestions(generated)
    setQuestionIndex(0)
    setScore(0)
    setQuizAnswers(new Array(30).fill(''))
    setTypedAnswer('')
    setFeedback('')
    setTimeLeft(120)
    setQuizStarted(true)
    setQuizDone(false)
    setMode('quiz')
  }

  const handleAnswerSubmission = () => {
    if (!currentQuestion) return

    const correct = isAnswerCorrect(typedAnswer, currentQuestion.answer)
    const nextAnswers = [...quizAnswers]
    nextAnswers[questionIndex] = typedAnswer
    setQuizAnswers(nextAnswers)

    if (correct) {
      setScore((prev) => prev + 1)
      setFeedback('Correct! Nice work.')
    } else {
      setFeedback(`Not quite. The value is ${currentQuestion.answer}.`)
    }

    if (questionIndex === quizQuestions.length - 1) {
      setQuizDone(true)
      setQuizStarted(false)
      return
    }

    setTimeout(() => {
      setQuestionIndex((prev) => prev + 1)
      setTypedAnswer('')
      setFeedback('')
    }, 500)
  }

  const keypad = useMemo(
    () => ['7', '8', '9', '√', '4', '5', '6', '/', '1', '2', '3', '(', '0', '.', ')', '1/2'],
    [],
  )

  const insertValue = (symbol: string) => {
    if (symbol === '√') {
      setTypedAnswer((prev) => `${prev}√()`)
      return
    }
    if (symbol === '1/2') {
      setTypedAnswer((prev) => `${prev}1/2`)
      return
    }
    setTypedAnswer((prev) => `${prev}${symbol}`)
  }

  const nextStudyCard = () => {
    setCardIndex((prev) => (prev + 1) % STUDY_CARDS.length)
    setRevealedCard(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleAnswerSubmission()
    }
  }

  return (
    <main className="app-shell">
      <header className="hero-panel">
        <p className="eyebrow">Unit circle practice</p>
        <h1>Speed Trig Practice</h1>
        <p className="subtitle">
          Build confidence with unit circle flashcards, then race through a two-minute quiz.
        </p>
        <div className="mode-switcher">
          <button className={mode === 'study' ? 'mode-button active' : 'mode-button'} onClick={() => setMode('study')}>
            Study mode
          </button>
          <button className={mode === 'quiz' ? 'mode-button active' : 'mode-button'} onClick={() => setMode('quiz')}>
            Quiz mode
          </button>
        </div>
      </header>

      <section className="content-grid single-mode">
        {mode === 'study' ? (
          <article className="panel study-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Study mode</p>
                <h2>Flashcard practice</h2>
              </div>
              <button className="ghost-button" onClick={nextStudyCard}>Next card</button>
            </div>
            <button
              type="button"
              className={`flashcard ${revealedCard ? 'revealed' : ''}`}
              onClick={() => setRevealedCard((prev) => !prev)}
            >
              <span className="flashcard-label">Click to reveal</span>
              <strong>{formatPrompt(currentCard.angle, currentCard.trig)}</strong>
              <span className="flashcard-value">{revealedCard ? getAnswerFor(currentCard.angle, currentCard.trig) : 'Tap to see the value'}</span>
            </button>
            <p className="helper-text">Use this deck to review common unit circle values before you test yourself.</p>
          </article>
        ) : (
          <article className="panel quiz-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Quiz mode</p>
                <h2>Two-minute challenge</h2>
              </div>
              <button className="accent-button" onClick={startQuiz}>Start quiz</button>
            </div>
            <div className="stat-row">
              <span>Time: {timeLeft}s</span>
              <span>Questions: {quizStarted ? questionIndex + 1 : 0}/30</span>
              <span>Score: {score}</span>
            </div>

            {!quizStarted && !quizDone && (
              <div className="empty-state">
                <p>Press start to generate 30 random unit circle questions.</p>
              </div>
            )}

            {quizStarted && currentQuestion && (
              <div className="quiz-card">
                <p className="quiz-prompt">Find the value for {formatPrompt(currentQuestion.angle, currentQuestion.trig)}.</p>
                <input
                  type="text"
                  value={typedAnswer}
                  onChange={(event) => setTypedAnswer(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your answer here"
                  className="answer-input"
                />
                <div className="keypad-grid">
                  {keypad.map((item) => (
                    <button key={item} type="button" className="keypad-button" onClick={() => insertValue(item)}>
                      {item}
                    </button>
                  ))}
                </div>
                <div className="quiz-actions">
                  <button className="accent-button" onClick={handleAnswerSubmission}>Submit answer</button>
                  <button className="ghost-button" onClick={() => setTypedAnswer('')}>Clear</button>
                </div>
                <p className="feedback-text">{feedback || 'Hint: use symbols like sqrt(3), /, and parentheses to enter exact values.'}</p>
              </div>
            )}

            {quizDone && (
              <div className="results-card">
                <h3>Time is up!</h3>
                <p>You answered {score} out of 30 questions correctly.</p>
                <button className="accent-button" onClick={startQuiz}>Try again</button>
              </div>
            )}
          </article>
        )}
      </section>
    </main>
  )
}

export default App
