import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatInTimeZone } from 'date-fns-tz'

interface TimezoneListProps {
  utc: Date
  timezones: string[]
}

export function TimezoneList({ utc, timezones }: TimezoneListProps) {

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Timezone</TableHead>
          <TableHead>Date & Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {timezones.map((timezone) => {
          return (
            <TableRow key={timezone}>
              <TableCell>{timezone}</TableCell>
              <TableCell>{formatInTimeZone(utc, timezone, 'PPP p')}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

