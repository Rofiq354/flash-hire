// src/components/atoms/Select.tsx
"use client";

import React from "react";
import ReactSelect from "react-select";

export const Select = ({ label, options, onChange, value, id }: any) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      <ReactSelect
        id={id}
        name={id}
        options={options}
        placeholder="Choose a country..."
        className="text-sm"
        styles={{
          control: (base) => ({
            ...base,
            padding: "2px",
            borderRadius: "0.5rem",
            borderColor: "#e2e8f0",
          }),
        }}
        maxMenuHeight={200} // INI KUNCINYA: Membatasi tinggi dropdown
      />
    </div>
  );
};
