"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-service"
import { ApplicantTable } from "./applicant-table"
import { ApplicantFilters } from "./applicant-filters"
import { ApplicantStats } from "./applicant-stats"
import { ApplicantDetailModal } from "./applicant-detail-modal"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { exportToCSV } from "@/lib/export-utils"

export type Applicant = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  zip_code: string
  referral_source: string
  referral_code: string
  tracking_number: string
  application_status: string
  created_at: string
  updated_at: string
}

export type ApplicantFiltersType = {
  status: string
  referralSource: string
  dateRange: [Date | null, Date | null]
  searchTerm: string
}

export function ApplicantDashboard() {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [filters, setFilters] = useState<ApplicantFiltersType>({
    status: "all",
    referralSource: "all",
    dateRange: [null, null],
    searchTerm: "",
  })

  useEffect(() => {
    fetchApplicants()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filters, applicants])

  async function fetchApplicants() {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("applicants").select("*").order("created_at", { ascending: false })

      if (error) throw error

      setApplicants(data || [])
      setFilteredApplicants(data || [])
    } catch (error) {
      console.error("Error fetching applicants:", error)
    } finally {
      setIsLoading(false)
    }
  }

  function applyFilters() {
    let result = [...applicants]

    // Filter by status
    if (filters.status !== "all") {
      result = result.filter((a) => a.application_status === filters.status)
    }

    // Filter by referral source
    if (filters.referralSource !== "all") {
      result = result.filter((a) => a.referral_source === filters.referralSource)
    }

    // Filter by date range
    if (filters.dateRange[0] && filters.dateRange[1]) {
      const startDate = filters.dateRange[0]
      const endDate = filters.dateRange[1]

      result = result.filter((a) => {
        const createdAt = new Date(a.created_at)
        return createdAt >= startDate && createdAt <= endDate
      })
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      result = result.filter(
        (a) =>
          a.first_name.toLowerCase().includes(searchLower) ||
          a.last_name.toLowerCase().includes(searchLower) ||
          a.email.toLowerCase().includes(searchLower) ||
          a.tracking_number.toLowerCase().includes(searchLower),
      )
    }

    setFilteredApplicants(result)
  }

  async function updateApplicantStatus(id: string, status: string) {
    try {
      const { error } = await supabase
        .from("applicants")
        .update({ application_status: status, updated_at: new Date().toISOString() })
        .eq("id", id)

      if (error) throw error

      // Update local state
      setApplicants((prev) =>
        prev.map((a) => (a.id === id ? { ...a, application_status: status, updated_at: new Date().toISOString() } : a)),
      )

      if (selectedApplicant?.id === id) {
        setSelectedApplicant((prev) =>
          prev ? { ...prev, application_status: status, updated_at: new Date().toISOString() } : null,
        )
      }
    } catch (error) {
      console.error("Error updating applicant status:", error)
    }
  }

  function handleExportCSV() {
    const data = filteredApplicants.map((a) => ({
      "First Name": a.first_name,
      "Last Name": a.last_name,
      Email: a.email,
      Phone: a.phone,
      "ZIP Code": a.zip_code,
      "Tracking Number": a.tracking_number,
      "Referral Source": a.referral_source,
      "Referral Code": a.referral_code || "N/A",
      Status: a.application_status,
      "Created At": new Date(a.created_at).toLocaleString(),
    }))

    exportToCSV(data, "applicants_export")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <ApplicantStats applicants={applicants} />
        <Button
          onClick={handleExportCSV}
          className="flex items-center gap-2"
          disabled={filteredApplicants.length === 0}
        >
          <Download size={16} />
          Export to CSV
        </Button>
      </div>

      <ApplicantFilters filters={filters} setFilters={setFilters} applicants={applicants} />

      <ApplicantTable
        applicants={filteredApplicants}
        isLoading={isLoading}
        onViewDetails={setSelectedApplicant}
        onUpdateStatus={updateApplicantStatus}
      />

      {selectedApplicant && (
        <ApplicantDetailModal
          applicant={selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          onUpdateStatus={updateApplicantStatus}
        />
      )}
    </div>
  )
}
