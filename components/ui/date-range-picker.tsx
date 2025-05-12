"use client"

import * as React from "react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"

export interface DateRangePickerProps {
  className?: string
  onChange?: (date: DateRange | undefined) => void
}

export function DateRangePicker({ className, onChange }: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  })

  React.useEffect(() => {
    if (onChange) {
      onChange(date)
    }
  }, [date, onChange])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
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
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

interface DatePickerWithRangeProps {
  date: DateRange | undefined
  onDateChange: (date: DateRange) => void
  className?: string
}

export function DatePickerWithRange({ date, onDateChange, className }: DatePickerWithRangeProps) {
  const [selectedPreset, setSelectedPreset] = React.useState<string | undefined>(undefined)

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset)

    const now = new Date()
    let from: Date
    let to: Date = now

    switch (preset) {
      case "last7days":
        from = addDays(now, -7)
        break
      case "last30days":
        from = addDays(now, -30)
        break
      case "lastMonth":
        from = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        to = new Date(now.getFullYear(), now.getMonth(), 0)
        break
      case "thisMonth":
        from = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case "lastQuarter":
        const currentQuarter = Math.floor(now.getMonth() / 3)
        from = new Date(now.getFullYear(), currentQuarter * 3 - 3, 1)
        to = new Date(now.getFullYear(), currentQuarter * 3, 0)
        break
      case "thisQuarter":
        const thisQuarter = Math.floor(now.getMonth() / 3)
        from = new Date(now.getFullYear(), thisQuarter * 3, 1)
        break
      case "thisYear":
        from = new Date(now.getFullYear(), 0, 1)
        break
      case "lastYear":
        from = new Date(now.getFullYear() - 1, 0, 1)
        to = new Date(now.getFullYear() - 1, 11, 31)
        break
      default:
        from = addDays(now, -30)
    }

    onDateChange({ from, to })
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
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
          <div className="flex flex-col sm:flex-row gap-2 p-3 border-b">
            <Select value={selectedPreset} onValueChange={handlePresetChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select preset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7days">Last 7 days</SelectItem>
                <SelectItem value="last30days">Last 30 days</SelectItem>
                <SelectItem value="lastMonth">Last month</SelectItem>
                <SelectItem value="thisMonth">This month</SelectItem>
                <SelectItem value="lastQuarter">Last quarter</SelectItem>
                <SelectItem value="thisQuarter">This quarter</SelectItem>
                <SelectItem value="thisYear">This year</SelectItem>
                <SelectItem value="lastYear">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate) => {
              if (newDate) {
                setSelectedPreset(undefined)
                onDateChange(newDate)
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

// For backward compatibility;
