"use client";

import React, { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoLanguage } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";

interface DropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  type?: "language" | "location";
}

const Dropdown = ({
  label,
  options,
  value,
  onChange,
  type = "language",
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (value !== "") {
      setIsChanged(true);
    }
  }, [value]);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsChanged(true);
    setIsOpen(false);
  };
  return (
    <div className="dropdown">
      <div className="max-w-96 min-w-40">
        <a
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center cursor-pointer justify-between w-48 px-3 py-2 text-sm font-bold text-gray-saathi-2 md:px-6 md:py-4 md:w-[380px] min-h-10 bg-gray-saathi-1 md:text-3xl rounded-xl md:rounded-2xl hover:bg-gray-200 focus:outline-none"
        >
          {isChanged ? (
            <>
              <div>
                {type === "language" ? <IoLanguage /> : <IoLocationOutline />}
              </div>
              <div className="text-red-saathi">{value}</div>
              <IoMdArrowDropdown className="text-sm md:text-2xl" />
            </>
          ) : (
            <>
              <div>
                {type === "language" ? <IoLanguage /> : <IoLocationOutline />}
              </div>
              {label}
              <IoMdArrowDropdown className="text-sm md:text-2xl" />
            </>
          )}
        </a>
        {isOpen && (
          <ul className="absolute z-50 bg-gray-saathi-1 rounded-2xl w-48 md:w-[380px] overflow-hidden mt-1 shadow-[inset_0px_0px_3px_0px_#00000024]">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleSelect(option)}
                className={`px-4 py-2 cursor-pointer hover:text-white hover:bg-red-saathi text-gray-saathi-2 md:text-2xl ${
                  option === value ? "bg-red-saathi text-white" : ""
                }`}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
