"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import QRCode from "react-qr-code"

interface VenmoOptionProps {
  amount: string
  donorName?: string
  donorEmail?: string
  organization?: "both" | "sfdsa" | "protecting"
}

export function VenmoOption({ amount, donorName, donorEmail, organization = "both" }: VenmoOptionProps) {
  const [showQR, setShowQR] = useState(false)
  const { toast } = useToast()

  // Your organization's Venmo username based on selection
  const getVenmoUsername = () => {
    switch (organization) {
      case "sfdsa":
        return "SFDSA-Association"
      case "protecting":
        return "Protecting-SF"
      case "both":
      default:
        return "SFDSA-Recruitment" // Default combined account
    }
  }

  const venmoUsername = getVenmoUsername()

  // Create note based on organization
  const getVenmoNote = () => {
    let note = "Donation"

    if (organization === "both") {
      note += " to SFDSA & Protecting SF"
    } else if (organization === "sfdsa") {
      note += " to SFDSA"
    } else if (organization === "protecting") {
      note += " to Protecting SF"
    }

    if (donorName) {
      note += " from " + donorName
    }

    return note
  }

  // Create Venmo deep link
  const venmoDeepLink = `venmo://paycharge?txn=pay&recipients=${venmoUsername}&amount=${amount}&note=${encodeURIComponent(getVenmoNote())}`

  // Create Venmo web link as fallback
  const venmoWebLink = `https://venmo.com/${venmoUsername}?txn=pay&amount=${amount}&note=${encodeURIComponent(getVenmoNote())}`

  const handleVenmoClick = () => {
    // Log the donation attempt
    if (donorEmail) {
      fetch("/api/donations/log-venmo-attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          donorName,
          donorEmail,
          organization,
        }),
      }).catch((err) => console.error("Error logging Venmo attempt:", err))
    }

    // Try to open the Venmo app
    window.location.href = venmoDeepLink

    // Show a toast with instructions
    toast({
      title: "Opening Venmo",
      description: "If Venmo doesn't open automatically, please use the QR code or copy our username.",
    })

    // Show QR code as fallback
    setShowQR(true)
  }

  return (
    <div className="w-full">
      {!showQR ? (
        <Button
          type="button"
          className="bg-[#3D95CE] hover:bg-[#3D95CE]/90 text-white w-full"
          onClick={handleVenmoClick}
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.5955 2C20.5 2 21.5 2.5 21.9352 3.77148C22.1 4.5 22.1 5.5 21.9 6.60156L17.8 21.5C17.6 22.2 16.9 22.8 16.1 22.8H7.30005C6.70005 22.8 6.20005 22.3 6.20005 21.7C6.20005 21.6 6.20005 21.5 6.20005 21.4L10.4 6.60156C10.7 5.40156 11.7 4.60156 12.9 4.60156H19.6V2H19.5955ZM12.9 6.60156C12.4 6.60156 12 6.90156 11.9 7.40156L7.70005 22.2C7.70005 22.3 7.70005 22.3 7.80005 22.3C7.90005 22.3 7.90005 22.3 8.00005 22.3H16.1C16.3 22.3 16.5 22.1 16.6 21.9L20.7 7.00001C20.8 6.40001 20.8 5.80001 20.7 5.40001C20.6 5.00001 20.2 4.70001 19.7 4.70001H13L12.9 6.60156ZM3.00005 7.60156C2.40005 7.60156 1.90005 8.10156 1.90005 8.70156C1.90005 8.80156 1.90005 8.90156 1.90005 9.00156L4.70005 21.4C4.80005 22.1 5.40005 22.6 6.10005 22.6C6.70005 22.6 7.20005 22.1 7.20005 21.5C7.20005 21.4 7.20005 21.3 7.20005 21.2L4.40005 8.80156C4.30005 8.10156 3.70005 7.60156 3.00005 7.60156Z" />
          </svg>
          Pay with Venmo
        </Button>
      ) : (
        <div className="text-center">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Scan this QR code with your phone's camera:</p>
            <div className="bg-white p-4 inline-block rounded-lg">
              <QRCode value={venmoWebLink} size={180} />
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Or send payment to:</p>
            <div className="flex items-center justify-center">
              <span className="font-medium text-lg">@{venmoUsername}</span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-8 px-2"
                onClick={() => {
                  navigator.clipboard.writeText(venmoUsername)
                  toast({
                    title: "Username copied",
                    description: "Venmo username copied to clipboard",
                  })
                }}
              >
                Copy
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">Please include your name and "Donation" in the payment note.</p>
          </div>

          <Button variant="outline" onClick={() => setShowQR(false)}>
            Back
          </Button>
        </div>
      )}
    </div>
  )
}
