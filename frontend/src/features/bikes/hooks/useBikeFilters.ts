import { Bike } from 'features/bikes/models';
import { useMemo, useState } from 'react';

interface Filters {
  model: string | null;
  color: string | null;
  location: string | null;
  rating: [number, number] | null;
}

export interface UseBikeFiltersReturnProps {
  bikes: Bike[];
  allFilters: {
    models: Set<string>;
    locations: Set<string>;
    colors: Set<string>;
  };
  setFilters: (value: ((prevState: Filters) => Filters) | Filters) => void;
  filters: Filters;
  filteredBikes: Bike[];
}

const useBikeFilters = (bikes: Bike[]): UseBikeFiltersReturnProps => {
  const initialFilters = {
    model: null,
    color: null,
    location: null,
    rating: null,
  };
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const models = useMemo(() => new Set(bikes.map((x) => x.model)), [bikes]);
  const colors = useMemo(() => new Set(bikes.map((x) => x.color)), [bikes]);
  const locations = useMemo(
    () => new Set(bikes.map((x) => x.location)),
    [bikes]
  );

  const filteredBikes = useMemo(
    () =>
      bikes.filter(
        (bike) =>
          (filters.model ? filters.model === bike.model : true) &&
          (filters.color ? filters.color === bike.color : true) &&
          (filters.location ? filters.location === bike.location : true) &&
          (bike.rating && filters.rating
            ? bike.rating >= filters.rating[0] / 25 + 1 &&
              bike.rating <= filters.rating[1] / 25 + 1
            : true)
      ),
    [bikes, filters]
  );

  return {
    bikes,
    filteredBikes,
    allFilters: {
      models,
      colors,
      locations,
    },
    filters,
    setFilters,
  };
};

export default useBikeFilters;
