import TimezoneSelect from '@/components/timezone-select'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface AddTimezoneProps {
  onAddTimezone: (timezone: string) => void
}

export function AddTimezone({ onAddTimezone }: AddTimezoneProps) {
  const [newTimezone, setNewTimezone] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTimezone.trim()) {
      onAddTimezone(newTimezone.trim())
      setNewTimezone('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <TimezoneSelect onSelect={onAddTimezone} />
      <Button type="submit">Add Timezone</Button>
    </form>
  )
}

