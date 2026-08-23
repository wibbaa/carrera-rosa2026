import { useState } from 'react'
import StepIndicator from '../components/StepIndicator'
import Step1PersonalInfo from './registration/Step1PersonalInfo'
import Step2Payment from './registration/Step2Payment'
import Step3Confirmation from './registration/Step3Confirmation'

export default function Registration() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [folio, setFolio] = useState(null)

  return (
    <main className="min-h-screen bg-paper py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-6">
        <a
          href="/"
          className="font-mono text-xs uppercase tracking-widest text-ink-mute mb-8 inline-block"
        >
          ← Gran Carrera Rosa Nogales
        </a>

        {step < 3 && <StepIndicator current={step} />}

        {step === 1 && (
          <Step1PersonalInfo
            data={formData}
            onNext={(data) => {
              setFormData(data)
              setStep(2)
            }}
          />
        )}

        {step === 2 && (
          <Step2Payment
            data={formData}
            onBack={() => setStep(1)}
            onDone={({ folio }) => {
              setFolio(folio)
              setStep(3)
            }}
          />
        )}

        {step === 3 && <Step3Confirmation folio={folio} name={formData.full_name} />}
      </div>
    </main>
  )
}
