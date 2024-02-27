"use client";

import React, { useState } from "react";
import Image from "next/image";
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
          className="flex justify-between items-center px-3 text-gray-saathi-2 py-2 md:px-6 md:py-4 w-40 md:w-96 min-h-10 font-bold bg-gray-saathi-1 md:text-4xl text-sm rounded-xl md:rounded-2xl hover:bg-gray-200 focus:outline-none"
        >
          {isChanged ? (
            <>
              <div>
                {type === "language" ? <IoLanguage /> : <IoLocationOutline />}
              </div>
              <div className="text-red-saathi">{value}</div>
              <IoMdArrowDropdown className="text-sm md:text-3xl" />
            </>
          ) : (
            <>
              {label}
              <IoMdArrowDropdown className="text-sm md:text-3xl" />
            </>
          )}
        </a>
        {isOpen && (
          <ul className="absolute z-50 bg-gray-saathi-1 rounded-2xl w-40 md:w-96 overflow-hidden mt-1 shadow-[inset_0px_0px_3px_0px_#00000024]">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleSelect(option)}
                className="px-4 py-2 hover:text-white hover:bg-red-saathi text-gray-saathi-2 md:text-2xl cursor-pointer"
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
