import { Group, Paper, RangeSlider, Text } from '@mantine/core';
import { SelectFilter } from 'features/bikes/components/index';
import { UseBikeFiltersReturnProps } from 'features/bikes/hooks/useBikeFilters';
import { ReactElement } from 'react';

interface BikeFiltersProps {
  bikeFilters: UseBikeFiltersReturnProps;
  alwaysShowFilters?: boolean;
  rightComponent?: ReactElement;
}

const BikeFilters = ({
  bikeFilters: { bikes, allFilters, filters, setFilters },
  alwaysShowFilters,
  rightComponent,
}: BikeFiltersProps) => {
  return bikes.length > 0 || alwaysShowFilters ? (
    <Paper p={16} mb={16}>
      <Group align="flex-end" position="apart">
        <Group align="flex-start">
          <SelectFilter
            label="Model"
            data={allFilters.models}
            value={filters.model}
            onChange={(value) => setFilters({ ...filters, model: value })}
          />
          <SelectFilter
            label="Color"
            data={allFilters.colors}
            value={filters.color}
            onChange={(value) => setFilters({ ...filters, color: value })}
          />
          <SelectFilter
            label="Location"
            data={allFilters.locations}
            value={filters.location}
            onChange={(value) => setFilters({ ...filters, location: value })}
          />
          <Group direction="column">
            <Text size="sm" weight={500}>
              Rating
            </Text>
            <RangeSlider
              value={filters.rating ?? undefined}
              onChange={(value) => setFilters({ ...filters, rating: value })}
              showLabelOnHover={false}
              step={25}
              label={null}
              pb={16}
              marks={[
                { value: 0, label: '1' },
                { value: 25, label: '2' },
                { value: 50, label: '3' },
                { value: 75, label: '4' },
                { value: 100, label: '5' },
              ]}
              style={{ width: 200 }}
            />
          </Group>
        </Group>
        {rightComponent}
      </Group>
    </Paper>
  ) : null;
};

export default BikeFilters;
