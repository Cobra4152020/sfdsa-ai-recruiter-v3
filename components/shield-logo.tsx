export function ShieldLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M11.35 2.1L5.66 5.45C4.79 5.91 4.13 6.65 3.76 7.54L1 13.99L12 21.99L23 13.99L20.24 7.54C19.87 6.65 19.21 5.91 18.34 5.45L12.65 2.1C12.24 1.88 11.76 1.88 11.35 2.1Z"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 6.5L9 10.5L11.5 12.5H12.5L15 10.5L12 6.5Z" fill="#FFD700" strokeWidth="0.2" />
    </svg>
  )
}
