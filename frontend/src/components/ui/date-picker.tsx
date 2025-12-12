"use client"

import * as React from "react"
import { format, parse, isValid } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface DatePickerProps {
  date?: Date
  setDate: (date: Date | undefined) => void
  placeholder?: string
}

export function DatePicker({ date, setDate, placeholder = "DD/MM/YYYY" }: DatePickerProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

  React.useEffect(() => {
    if (date) {
      setInputValue(format(date, "dd/MM/yyyy"))
    } else {
      setInputValue("")
    }
  }, [date])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    const parsedDate = parse(value, "dd/MM/yyyy", new Date())

    if (isValid(parsedDate) && value.length === 10) {
      setDate(parsedDate)
    } else if (value === "") {
      setDate(undefined)
    }
  }

  const handleCalendarSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    setIsPopoverOpen(false)
  }

  return (
    <div className="relative w-full max-w-[280px]">
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          className="pl-10"
        />
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-0 h-full px-3 text-muted-foreground hover:bg-transparent"
              aria-label="Open calendar"
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleCalendarSelect}
              defaultMonth={date}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}