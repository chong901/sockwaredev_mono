import CitySelect from "@/components/city-select";
import { useCities } from "@/components/store/city";

export function AddCity() {
  const { addCity, selectedCities } = useCities();

  return (
    <form className="flex gap-2">
      <CitySelect
        onSelect={addCity}
        buttonText="Add City..."
        selectedCities={selectedCities}
      />
    </form>
  );
}
