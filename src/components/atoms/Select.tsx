// src/components/atoms/Select.tsx
"use client";

import React from "react";
import ReactSelect from "react-select";

export const Select = ({
  label,
  options,
  placeholder = "Choose a country...",
  id,
}: any) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-foreground">
          {label}
        </label>
      )}
      <ReactSelect
        id={id}
        name={id}
        options={options}
        placeholder={placeholder}
        className="text-sm"
        styles={{
          control: (base) => ({
            ...base,
            padding: "2px",
            borderRadius: "0.5rem",
            backgroundColor: "var(--input)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
            boxShadow: "none",
            "&:hover": {
              borderColor: "var(--primary)",
            },
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: "var(--card)",
            borderRadius: "0.5rem",
            border: "1px solid var(--border)",
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "var(--primary)" : "transparent",
            color: state.isFocused
              ? "var(--primary-foreground)"
              : "var(--card-foreground)",
            cursor: "pointer",
            "&:active": {
              backgroundColor: "var(--primary-hover)",
            },
          }),
          singleValue: (base) => ({
            ...base,
            color: "var(--foreground)",
          }),
          placeholder: (base) => ({
            ...base,
            color: "var(--muted)",
          }),
        }}
        maxMenuHeight={200}
      />
    </div>
  );
};
