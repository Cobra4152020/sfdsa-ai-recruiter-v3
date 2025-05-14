import ApplyButton from "./apply-button"
import AskSgtKenButton from "./ask-sgt-ken-button"

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="absolute inset-0 bg-[url('/san-francisco-deputy-sheriff.png')] bg-cover bg-center opacity-20"></div>
      <div className="container relative px-4 py-16 mx-auto text-center sm:px-6 sm:py-24 lg:py-32">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Join the San Francisco Deputy Sheriff's Association
        </h1>
        <p className="max-w-lg mx-auto mt-6 text-xl text-blue-100 sm:max-w-3xl">
          Protect our community, build a rewarding career, and become part of something greater. Start your journey with
          us today.
        </p>
        <div className="flex flex-col items-center justify-center max-w-sm gap-4 mx-auto mt-10 sm:flex-row sm:max-w-none sm:justify-center">
          <ApplyButton className="w-full px-8 py-3 text-lg font-medium sm:w-auto" size="lg" />
          <AskSgtKenButton
            className="w-full px-8 py-3 text-lg font-medium text-white bg-transparent border border-white hover:bg-white hover:text-blue-700 sm:w-auto"
            variant="outline"
            size="lg"
          />
        </div>
      </div>
    </div>
  )
}
