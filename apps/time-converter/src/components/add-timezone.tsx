import CitySelect from "@/components/city-select";
import { useState } from "react";

interface AddTimezoneProps {
  onAddTimezone: (timezone: string) => void;
  selectedTimezones: string[];
}

export function AddTimezone({
  onAddTimezone,
  selectedTimezones,
}: AddTimezoneProps) {
  const [newTimezone, setNewTimezone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTimezone.trim()) {
      onAddTimezone(newTimezone.trim());
      setNewTimezone("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex items-center">Add Timezone: </div>
      <CitySelect
        onSelect={onAddTimezone}
        value={newTimezone}
        selectedTimezones={selectedTimezones}
      />
    </form>
  );
}
