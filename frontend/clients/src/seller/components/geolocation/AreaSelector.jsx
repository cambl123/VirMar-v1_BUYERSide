// src/seller/components/geolocation/AreaSelector.jsx

import React, { useEffect, useState } from 'react';
import { Box, Select, VStack } from '@chakra-ui/react';

// Sample static data for Rwanda admin hierarchy (simplified)
// Ideally, load this from an API or JSON file for real app
const rwandaAdminData = {
  Kigali: {
    Gasabo: {
      Kimihurura: ['Cell A', 'Cell B', 'Cell C'],
      Kacyiru: ['Cell D', 'Cell E'],
    },
    Nyarugenge: {
      Nyamirambo: ['Cell F', 'Cell G'],
      Kigali: ['Cell H'],
    },
  },
  Southern: {
    Huye: {
      Ngoma: ['Cell I', 'Cell J'],
      Ruhashya: ['Cell K'],
    },
  },
};

const AreaSelector = ({ selection, setSelection }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [cells, setCells] = useState([]);

  // Load provinces on mount
  useEffect(() => {
    setProvinces(Object.keys(rwandaAdminData));
  }, []);

  // When province changes, update districts dropdown
  useEffect(() => {
    if (selection.province && rwandaAdminData[selection.province]) {
      setDistricts(Object.keys(rwandaAdminData[selection.province]));
    } else {
      setDistricts([]);
    }
    setSelection((prev) => ({ ...prev, district: '', sector: '', cell: '' }));
    setSectors([]);
    setCells([]);
  }, [selection.province, setSelection]);

  // When district changes, update sectors dropdown
  useEffect(() => {
    if (selection.province && selection.district) {
      const sectorObj = rwandaAdminData[selection.province][selection.district];
      if (sectorObj) {
        setSectors(Object.keys(sectorObj));
      } else {
        setSectors([]);
      }
    } else {
      setSectors([]);
    }
    setSelection((prev) => ({ ...prev, sector: '', cell: '' }));
    setCells([]);
  }, [selection.district, selection.province, setSelection]);

  // When sector changes, update cells dropdown
  useEffect(() => {
    if (selection.province && selection.district && selection.sector) {
      const cellsArr = rwandaAdminData[selection.province][selection.district][selection.sector];
      if (cellsArr) {
        setCells(cellsArr);
      } else {
        setCells([]);
      }
    } else {
      setCells([]);
    }
    setSelection((prev) => ({ ...prev, cell: '' }));
  }, [selection.sector, selection.district, selection.province, setSelection]);

  // Handle dropdown changes
  const handleChange = (level) => (e) => {
    const value = e.target.value;
    setSelection((prev) => ({ ...prev, [level]: value }));
  };

  return (
    <VStack spacing={4} align="stretch" mt={2}>
      {/* Province */}
      <Box>
        <Select
          placeholder="Select Province"
          value={selection.province}
          onChange={handleChange('province')}
        >
          {provinces.map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </Select>
      </Box>

      {/* District */}
      <Box>
        <Select
          placeholder="Select District"
          value={selection.district}
          onChange={handleChange('district')}
          isDisabled={!districts.length}
        >
          {districts.map((dist) => (
            <option key={dist} value={dist}>
              {dist}
            </option>
          ))}
        </Select>
      </Box>

      {/* Sector */}
      <Box>
        <Select
          placeholder="Select Sector"
          value={selection.sector}
          onChange={handleChange('sector')}
          isDisabled={!sectors.length}
        >
          {sectors.map((sect) => (
            <option key={sect} value={sect}>
              {sect}
            </option>
          ))}
        </Select>
      </Box>

      {/* Cell */}
      <Box>
        <Select
          placeholder="Select Cell"
          value={selection.cell}
          onChange={handleChange('cell')}
          isDisabled={!cells.length}
        >
          {cells.map((cell) => (
            <option key={cell} value={cell}>
              {cell}
            </option>
          ))}
        </Select>
      </Box>
    </VStack>
  );
};

export default AreaSelector;
