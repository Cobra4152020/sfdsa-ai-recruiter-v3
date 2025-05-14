import ApplyButton from "./apply-button"

export default function CTASection() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="px-6 py-16 mx-auto max-w-7xl sm:py-24 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to start your career as a Deputy Sheriff?
        </h2>
        <p className="max-w-xl mt-4 text-lg text-blue-100">
          Join our team of dedicated professionals and make a difference in the San Francisco community.
        </p>
        <div className="mt-8">
          <ApplyButton
            className="px-8 py-3 text-lg font-medium text-blue-700 bg-white hover:bg-blue-50"
            variant="outline"
            size="lg"
          />
        </div>
      </div>
    </div>
  )
}
