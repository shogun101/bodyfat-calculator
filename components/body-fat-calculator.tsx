"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react"

export function BodyFatCalculator() {
  const [currentStep, setCurrentStep] = useState(1)
  const [currentWeight, setCurrentWeight] = useState<number | "">("")
  const [currentBF, setCurrentBF] = useState<number | "">("")
  const [targetDrop, setTargetDrop] = useState<number | "">("")
  const [dailyDeficit, setDailyDeficit] = useState<number | "">("")
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [results, setResults] = useState<{
    fatToLose: number
    daysToGoal: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isInputValid, setIsInputValid] = useState(false)

  // Validate input whenever it changes
  useEffect(() => {
    validateCurrentInput()
  }, [currentWeight, currentBF, targetDrop, dailyDeficit, selectedOption, currentStep])

  const validateCurrentInput = () => {
    switch (currentStep) {
      case 1:
        setIsInputValid(currentWeight !== "" && Number(currentWeight) > 0)
        break
      case 2:
        setIsInputValid(currentBF !== "" && Number(currentBF) > 0 && Number(currentBF) < 100)
        break
      case 3:
        setIsInputValid(targetDrop !== "" && Number(targetDrop) > 0 && Number(targetDrop) < Number(currentBF))
        break
      case 4:
        setIsInputValid(dailyDeficit !== "" && Number(dailyDeficit) > 0)
        break
      default:
        setIsInputValid(false)
    }
  }

  const calculateResults = () => {
    // Clear any previous errors
    setError(null)

    // Perform calculations
    const fatMass = Number(currentWeight) * (Number(currentBF) / 100)
    const leanMass = Number(currentWeight) - fatMass
    const targetBF = Number(currentBF) - Number(targetDrop)
    const targetWeight = leanMass / (1 - targetBF / 100)
    const fatToLose = Number(currentWeight) - targetWeight
    const totalCalories = fatToLose * 7700
    const daysToGoal = totalCalories / Number(dailyDeficit)

    setResults({
      fatToLose: Number.parseFloat(fatToLose.toFixed(2)),
      daysToGoal: Math.ceil(daysToGoal),
    })

    setCurrentStep(5) // Move to results step
  }

  const validateAndNext = (step: number) => {
    switch (step) {
      case 1:
        if (currentWeight === "" || Number(currentWeight) <= 0) {
          setError("Please enter a valid weight")
          return
        }
        break
      case 2:
        if (currentBF === "" || Number(currentBF) <= 0 || Number(currentBF) >= 100) {
          setError("Please enter a valid body fat percentage (between 0 and 100)")
          return
        }
        break
      case 3:
        if (targetDrop === "" || Number(targetDrop) <= 0 || Number(targetDrop) >= Number(currentBF)) {
          setError("Please enter a valid body fat % to lose (must be less than your current body fat %)")
          return
        }
        break
      case 4:
        if (dailyDeficit === "" || Number(dailyDeficit) <= 0) {
          setError("Please enter a valid daily calorie deficit")
          return
        }
        calculateResults()
        return
    }

    setError(null)
    setCurrentStep(step + 1)
  }

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError(null)
    }
  }

  const resetCalculator = () => {
    setCurrentWeight("")
    setCurrentBF("")
    setTargetDrop("")
    setDailyDeficit("")
    setResults(null)
    setError(null)
    setCurrentStep(1)
  }

  const totalSteps = 5
  const progressWidth = `${((currentStep - 1) / (totalSteps - 1)) * 100}%`

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      <style jsx global>{`
        .button-icon-container:hover svg {
          stroke: white;
        }
      `}</style>
      <div className="w-full text-center mb-16">
        {currentStep === 1 && (
          <div className="space-y-12">
            <h2 className="custom-text">What is your current body weight (kg)?</h2>
            <div className="max-w-xs mx-auto">
              <Input
                type="number"
                min="0"
                step="0.1"
                placeholder="eg: 75kg"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value ? Number.parseFloat(e.target.value) : "")}
                className="custom-text text-center border-x-0 border-t-0 border-b border-[#EEEEEE] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            {error && (
              <div className="custom-text mt-4" style={{ color: "#DE2424" }}>
                {error}
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-12">
            <h2 className="custom-text">What is your current body fat percentage?</h2>
            <div className="max-w-xs mx-auto">
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="e.g., 25"
                value={currentBF}
                onChange={(e) => setCurrentBF(e.target.value ? Number.parseFloat(e.target.value) : "")}
                className="custom-text text-center border-x-0 border-t-0 border-b border-[#EEEEEE] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            {error && (
              <div className="custom-text mt-4" style={{ color: "#DE2424" }}>
                {error}
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-12">
            <h2 className="custom-text">How much body fat percentage do you want to lose?</h2>
            <div className="max-w-xs mx-auto">
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="e.g., 5"
                value={targetDrop}
                onChange={(e) => setTargetDrop(e.target.value ? Number.parseFloat(e.target.value) : "")}
                className="custom-text text-center border-x-0 border-t-0 border-b border-[#EEEEEE] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            {error && (
              <div className="custom-text mt-4" style={{ color: "#DE2424" }}>
                {error}
              </div>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-12">
            <h2 className="custom-text">What is your daily calorie deficit?</h2>
            <div className="flex justify-center gap-4 mt-8">
              {["300", "500", "700"].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setDailyDeficit(Number(option))
                    setSelectedOption(option)
                  }}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all bg-transparent`}
                  style={{
                    borderWidth: "0.7px",
                    borderColor: selectedOption === option ? "#000000" : "#999999",
                    backgroundColor: selectedOption === option ? "#000000" : "transparent",
                    color: selectedOption === option ? "white" : "#999999",
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="max-w-xs mx-auto mt-8">
              <Input
                type="number"
                min="0"
                step="50"
                placeholder="Or enter custom value"
                value={dailyDeficit}
                onChange={(e) => {
                  setDailyDeficit(e.target.value ? Number.parseFloat(e.target.value) : "")
                  setSelectedOption(null)
                }}
                className="custom-text text-center border-x-0 border-t-0 border-b border-[#EEEEEE] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            {error && (
              <div className="custom-text mt-4" style={{ color: "#DE2424" }}>
                {error}
              </div>
            )}
          </div>
        )}

        {currentStep === 5 && results && (
          <div className="space-y-8">
            <h2 className="custom-text">Your Results</h2>
            <div className="space-y-4">
              <p className="custom-text">Fat to lose: {results.fatToLose} kg</p>
              <p className="custom-text">Estimated days to goal: {results.daysToGoal} days</p>
              <p className="custom-text italic max-w-xs mx-auto mt-8">
                This is a rough estimate. Actual results may vary due to water weight, muscle loss, and metabolic
                changes.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-auto">
        {currentStep > 1 && (
          <Button
            onClick={goBack}
            className="rounded-full bg-transparent hover:bg-black hover:text-white border border-black transition-all button-icon-container"
            style={{
              width: "4.5rem",
              height: "4.5rem",
              borderWidth: "0.7px",
              borderColor: "#000000",
              color: "#000000",
            }}
          >
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Back</span>
          </Button>
        )}

        {currentStep < 5 && (
          <Button
            onClick={() => isInputValid && validateAndNext(currentStep)}
            disabled={!isInputValid}
            className={`rounded-full ml-4 bg-transparent hover:bg-black hover:text-white border transition-all ${
              isInputValid ? "button-icon-container" : ""
            }`}
            style={{
              width: "4.5rem",
              height: "4.5rem",
              borderWidth: "0.7px",
              borderColor: isInputValid ? "#000000" : "#999999",
              color: isInputValid ? "#000000" : "#999999",
              cursor: isInputValid ? "pointer" : "not-allowed",
            }}
          >
            <ArrowRight className="h-6 w-6" />
            <span className="sr-only">Next</span>
          </Button>
        )}

        {currentStep === 5 && (
          <Button
            onClick={resetCalculator}
            className="rounded-full ml-4 bg-transparent hover:bg-black hover:text-white border transition-all button-icon-container"
            style={{
              width: "4.5rem",
              height: "4.5rem",
              borderWidth: "0.7px",
              borderColor: "#999999",
              color: "#999999",
            }}
          >
            <RotateCcw className="h-6 w-6" />
            <span className="sr-only">Reset</span>
          </Button>
        )}
      </div>
    </div>
  )
}
