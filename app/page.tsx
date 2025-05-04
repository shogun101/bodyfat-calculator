import { BodyFatCalculator } from "@/components/body-fat-calculator"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white p-4 pt-[72px]">
      <nav className="fixed top-0 left-0 w-full flex items-center h-[48px] border-b border-[#EEEEEE] bg-white z-10">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="flex items-center w-fit">
            <span className="mr-2 text-xl" role="img" aria-label="Dumbbell">
              🏋️
            </span>
            <p className="custom-text font-bold">Body Fat Loss Calculator</p>
          </div>
        </div>
      </nav>
      <BodyFatCalculator />
    </main>
  )
}
