import { Button, Group, Paper } from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'tabler-icons-react';

interface BikeSearchProps {
  isLoading: boolean;
}

const BikeSearch = ({ isLoading }: BikeSearchProps) => {
  const navigate = useNavigate();
  const [availability, setAvailability] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const [queryParams] = useSearchParams();

  useEffect(() => {
    if (queryParams.get('from') && queryParams.get('to')) {
      const from = dayjs.unix(parseInt(queryParams.get('from')!, 10)).toDate();
      const to = dayjs.unix(parseInt(queryParams.get('to')!, 10)).toDate();
      setAvailability([from, to]);
    }
  }, []);

  const handleSearch = () => {
    if (!availability[0]?.getTime() || !availability[1]?.getTime()) {
      return;
    }
    navigate(
      `?from=${availability[0].getTime() / 1000}&to=${
        availability[1].getTime() / 1000
      }`
    );
  };

  return (
    <Paper p={16} mb={16}>
      <Group align="flex-end">
        <DateRangePicker
          label="Availability"
          placeholder="Select date range"
          value={availability}
          style={{ minWidth: 360 }}
          onChange={setAvailability}
          required
        />
        <Button
          leftIcon={<Search size={14} />}
          disabled={!availability.every((x) => !!x) || isLoading}
          onClick={handleSearch}
        >
          Search
        </Button>
      </Group>
    </Paper>
  );
};

export default BikeSearch;
