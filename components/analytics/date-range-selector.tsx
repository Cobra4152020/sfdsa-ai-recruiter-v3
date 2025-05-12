"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type DateRangeSelectorProps = {
  onChange: (range: { from: Date; to: Date; preset?: string }) => void
  defaultPreset?: string
  className?: string
}

export function DateRangeSelector({ onChange, defaultPreset = "last30", className }: DateRangeSelectorProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })

  const [preset, setPreset] = useState<string>(defaultPreset)

  const handlePresetChange = (value: string) => {
    setPreset(value)

    const now = new Date()
    let from: Date

    switch (value) {
      case "last7":
        from = new Date(now)
        from.setDate(from.getDate() - 7)
        break
      case "last30":
        from = new Date(now)
        from.setDate(from.getDate() - 30)
        break
      case "last90":
        from = new Date(now)
        from.setDate(from.getDate() - 90)
        break
      case "thisYear":
        from = new Date(now.getFullYear(), 0, 1)
        break
      case "lastYear":
        from = new Date(now.getFullYear() - 1, 0, 1)
        const to = new Date(now.getFullYear() - 1, 11, 31)
        setDate({ from, to })
        onChange({ from, to, preset: value })
        return
      default:
        from = new Date(now)
        from.setDate(from.getDate() - 30)
    }

    setDate({ from, to: now })
    onChange({ from, to: now, preset: value })
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setDate(range)
      setPreset("custom")
      onChange({ from: range.from, to: range.to, preset: "custom" })
    }
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Select value={preset} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="last7">Last 7 days</SelectItem>
          <SelectItem value="last30">Last 30 days</SelectItem>
          <SelectItem value="last90">Last 90 days</SelectItem>
          <SelectItem value="thisYear">This year</SelectItem>
          <SelectItem value="lastYear">Last year</SelectItem>
          <SelectItem value="custom">Custom range</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateRangeChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
