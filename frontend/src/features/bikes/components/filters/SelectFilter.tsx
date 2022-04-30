import { Select } from '@mantine/core';
import React from 'react';

interface SelectFilterProps {
  label: string;
  data: Set<string>;
  value: string | null;
  onChange: (value: string | null) => void;
}

const SelectFilter = ({ label, data, value, onChange }: SelectFilterProps) => {
  return (
    <Select
      label={label}
      placeholder="All"
      searchable
      nothingFound="No options"
      data={Array.from(data)}
      value={value}
      onChange={onChange}
      clearable
    />
  );
};

export default SelectFilter;
