"use client"

import type React from "react"

export default function MainLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white dark:bg-gray-900 shadow-sm py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">SF Deputy Sheriff</h1>
        </div>
      </header>
      
      <main id="main-content" className="flex-1 pt-16 pb-12 bg-background dark:bg-[#121212]">
        {children}
      </main>
      
      <footer className="bg-gray-100 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <p className="text-center">© {new Date().getFullYear()} San Francisco Deputy Sheriff's Association</p>
        </div>
      </footer>
    </div>
  )
}
