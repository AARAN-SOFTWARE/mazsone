import { useEffect, useRef, useState } from "react";
import { DatePicker } from "../SecondaryInput/Datepicker";
import MultiCheckbox from "../Input/MultiCheckbox";
import Switch from "../Input/switch";
import Checkbox from "../Input/checkbox";
import { TextArea } from "../SecondaryInput/TextArea";
import { TextInput } from "../SecondaryInput/TextInput";
import Dropdown from "../SecondaryInput/Dropdown";
import PasswordInput from "../SecondaryInput/PasswordInput";
import AnimateButton from "../Input/animatebutton";
import ImageButton from "../Button/ImageBtn";
import DropdownRead from "../SecondaryInput/DropdownRead";

export type FieldType =
  | "textinput"
  | "textarea"
  | "dropdown"
  | "switch"
  | "checkbox"
  | "multicheckbox"
  | "password"
  | "date"
  | "file"
  | "dropdownread"
  | "dropdownreadmultiple"
  | "dropdownmultiple";

type Field = {
  className?: string;
  id: string;
  label: string;
  type: FieldType;
  options?: string[];
  errMsg?: string;
  placeholder?: string;
  optional?: boolean;
};

interface EditableTableProps {
  fields: Field[];
  onChange?: (data: Record<string, any>[]) => void;
  initialData?: Record<string, any>[];
}

const phoneRegex = /^[0-9]{10}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function EditableTable({
  fields,
  onChange,
  initialData = [],
}: EditableTableProps) {
  const [tableData, setTableData] = useState<Record<string, any>[]>(
    initialData.length > 0
      ? initialData
      : [Object.fromEntries(fields.map((f) => [f.id, ""]))]
  );
  const [editingRow, setEditingRow] = useState<number>(0);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const inputRefs = useRef<(HTMLElement | null)[][]>([]);

  useEffect(() => {
    inputRefs.current = tableData.map(() => fields.map(() => null));
  }, [tableData.length, fields.length]);

  const handleChange = (rowIndex: number, fieldId: string, value: any) => {
    const updated = [...tableData];
    updated[rowIndex][fieldId] = value;
    setTableData(updated);
    onChange?.(updated);
  };

  const isValidValue = (field: Field, value: any): boolean => {
    if (
      !field.optional &&
      (value === "" || value === null || value === undefined)
    ) {
      alert(`Field "${field.label}" cannot be empty`);
      return false;
    }

    const idLower = field.id.toLowerCase();
    if (idLower.includes("email") && value && !emailRegex.test(value)) {
      alert(`Invalid email in "${field.label}"`);
      return false;
    }

    if (idLower.includes("phone") && value && !phoneRegex.test(value)) {
      alert(`Invalid phone number in "${field.label}"`);
      return false;
    }

    // For read-only dropdowns, check if value exists in options
    if (
      (field.type === "dropdownread" ||
        field.type === "dropdownreadmultiple") &&
      field.options &&
      value
    ) {
      if (field.type === "dropdownreadmultiple") {
        const invalid = (value as string[]).some(
          (v) => !field.options?.includes(v)
        );
        if (invalid) {
          alert(`One or more invalid values in "${field.label}"`);
          return false;
        }
      } else {
        if (!field.options.includes(value)) {
          alert(`Invalid value in "${field.label}"`);
          return false;
        }
      }
    }

    return true;
  };

  const focusNextField = (rowIndex: number, colIndex: number) => {
    const currentField = fields[colIndex];
    const currentValue = tableData[rowIndex][currentField.id];

    // Validate before proceeding
    if (!isValidValue(currentField, currentValue)) return;

    const nextCol = colIndex + 1;
    const nextRow = rowIndex + 1;

    if (nextCol < fields.length) {
      const nextInput = inputRefs.current[rowIndex]?.[nextCol];
      nextInput?.focus?.();
    } else if (nextRow < tableData.length) {
      setEditingRow(nextRow);
      setTimeout(() => inputRefs.current[nextRow]?.[0]?.focus?.(), 0);
    } else {
      const newRow = Object.fromEntries(fields.map((f) => [f.id, ""]));
      const updated = [...tableData, newRow];
      setTableData(updated);
      setEditingRow(updated.length - 1);
      onChange?.(updated);
      setTimeout(
        () => inputRefs.current[updated.length - 1]?.[0]?.focus?.(),
        0
      );
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      focusNextField(rowIndex, colIndex);
    }
  };

  const toggleRowSelect = (rowIndex: number) => {
    setSelectedRows((prev) =>
      prev.includes(rowIndex)
        ? prev.filter((i) => i !== rowIndex)
        : [...prev, rowIndex]
    );
  };

  const deleteSelectedRows = () => {
    const updated = tableData.filter(
      (_, index) => !selectedRows.includes(index)
    );
    setTableData(updated);
    setSelectedRows([]);
    onChange?.(updated);
  };

  const renderFieldInput = (
    field: Field,
    value: any,
    rowIndex: number,
    colIndex: number
  ) => {
    const commonProps = {
      key: `${rowIndex}-${field.id}`,
      ref: (el: HTMLElement | null) => {
        if (!inputRefs.current[rowIndex]) inputRefs.current[rowIndex] = [];
        inputRefs.current[rowIndex][colIndex] = el;
      },
      disabled: editingRow !== rowIndex,
      onKeyDown: (e: React.KeyboardEvent<HTMLElement>) =>
        handleKeyDown(e, rowIndex, colIndex),
      className: `w-full ${field.className || ""} ${
        editingRow !== rowIndex ? "opacity-50" : ""
      }`,
    };

    switch (field.type) {
      case "textinput":
        return (
          <TextInput
            {...commonProps}
            id={field.id}
            err=""
            label=""
            placeholder={field.placeholder}
            type="text"
            value={value || ""}
            onChange={(e) => handleChange(rowIndex, field.id, e.target.value)}
          />
        );
      case "textarea":
        return (
          <TextArea
            {...commonProps}
            id={field.id}
            err=""
            label=""
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => handleChange(rowIndex, field.id, e.target.value)}
          />
        );
      case "dropdown":
        return (
          <Dropdown
            {...commonProps}
            id={field.id}
            err=""
            placeholder={field.placeholder}
            items={field.options || []}
            value={value || ""}
            onChange={(val) => handleChange(rowIndex, field.id, val)}
          />
        );
      case "dropdownmultiple":
        return (
          <Dropdown
            {...commonProps}
            id={field.id}
            err=""
            placeholder={field.placeholder}
            items={field.options || []}
            value={value || []}
            multiple
            onChange={(val) => handleChange(rowIndex, field.id, val)}
          />
        );
      case "dropdownread":
        return (
          <DropdownRead
            {...commonProps}
            id={field.id}
            err=""
            placeholder={field.label}
            items={field.options || []}
            value={value || ""}
            onChange={(val) => handleChange(rowIndex, field.id, val)}
          />
        );
      case "dropdownreadmultiple":
        return (
          <DropdownRead
            {...commonProps}
            id={field.id}
            err=""
            placeholder={field.label}
            items={field.options || []}
            value={value || []}
            multiple
            onChange={(val) => handleChange(rowIndex, field.id, val)}
          />
        );
      case "switch":
        return (
          <Switch
            {...commonProps}
            id={field.id}
            label={field.label}
            agreed={!!value}
            onChange={(val) => handleChange(rowIndex, field.id, val)}
          />
        );
      case "checkbox":
        return (
          <Checkbox
            {...commonProps}
            id={field.id}
            label={field.label}
            err=""
            agreed={!!value}
            onChange={(val) => handleChange(rowIndex, field.id, val)}
          />
        );
      case "multicheckbox":
        return (
          <MultiCheckbox
            {...commonProps}
            id={field.id}
            label={field.label}
            err=""
            options={field.options || []}
            value={value || []}
            onChange={(val) => handleChange(rowIndex, field.id, val)}
          />
        );
      case "password":
        return (
          <PasswordInput
            {...commonProps}
            id={field.id}
            label={field.placeholder}
            value={value || ""}
            onChange={(e) => handleChange(rowIndex, field.id, e.target.value)}
          />
        );
      case "date":
        return (
          <div className="relative z-50">
            <DatePicker
              {...commonProps}
              id={field.id}
              label={field.label}
              formatStr="MMM dd,yyyy"
              model={
                value instanceof Date
                  ? value
                  : value
                  ? new Date(value)
                  : undefined
              }
              onChange={(val) => handleChange(rowIndex, field.id, val)}
            />
          </div>
        );

      default:
        return (
          <input
            {...commonProps}
            type="text"
            placeholder={field.label}
            value={value || ""}
            onChange={(e) => handleChange(rowIndex, field.id, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="w-full">
      {/* This div now only contains the table, and manages its overflow */}
    <div className="overflow-x-auto">
  <table className="w-full text-sm border-collapse">
    <thead>
      <tr className="bg-gray-100 text-gray-700 text-left rounded-t-md">
        <th className="px-2 py-2 text-center border border-gray-200">
          <input
            type="checkbox"
            checked={selectedRows.length === tableData.length && tableData.length > 0}
            onChange={(e) =>
              setSelectedRows(
                e.target.checked ? tableData.map((_, i) => i) : []
              )
            }
          />
        </th>
        <th className="px-2 py-2 border border-gray-200 text-center w-[50px]">No.</th>
        {fields.map((field, i) => (
          <th
            key={i}
            className="px-2 py-2 border border-gray-200 whitespace-nowrap text-sm font-medium"
          >
            {field.label}
            {!field.optional && <span className="text-red-500 ml-1">*</span>}
          </th>
        ))}
        <th className="px-2 py-2 text-center border border-gray-200 w-[40px]">
          <span className="inline-block w-4 h-4">
            ⚙️
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      {tableData.map((row, rowIndex) => (
        <tr key={rowIndex} className="bg-white border-t border-gray-200 hover:bg-gray-50">
          <td className="text-center border border-gray-200 px-2 py-1">
            <input
              type="checkbox"
              checked={selectedRows.includes(rowIndex)}
              onChange={() => toggleRowSelect(rowIndex)}
            />
          </td>
          <td className="text-center border border-gray-200 px-2 py-1 font-mono text-sm text-gray-800">
            {rowIndex + 1}
          </td>
          {fields.map((field, colIndex) => (
            <td
              key={field.id}
              className="border border-gray-200 px-2 py-1 whitespace-nowrap"
            >
              {renderFieldInput(field, row[field.id], rowIndex, colIndex)}
            </td>
          ))}
          <td className="text-center border border-gray-200 px-2 py-1">
            <ImageButton
              icon="edit"
              onClick={() => setEditingRow(rowIndex)}
              className="text-muted-foreground hover:text-foreground"
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  <div className="flex flex-col relative gap-6 my-10  text-lg">
        <AnimateButton
          mode="create"
          label="New Row"
          className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
          onClick={() => {
            const newRow = Object.fromEntries(
              fields.map((f) => [f.id, ""])
            );
            const updated = [...tableData, newRow];
            setTableData(updated);
            setEditingRow(updated.length - 1);
            onChange?.(updated);
            setTimeout(() => {
              const firstInput = inputRefs.current[updated.length - 1]?.[0];
              if (firstInput) firstInput.focus();
            }, 0);
          }}
        />
   <div className="flex justify-between">
    <span className="text-gray-700">Sub Total</span>
    <span className="font-medium text-gray-900">₹ 10,000.00</span>
  </div>
  <div className="flex justify-between">
    <span className="text-gray-700">Discount</span>
    <span className="font-medium text-gray-900">₹ 500.00</span>
  </div>
  <div className="flex justify-between">
    <span className="text-gray-700">GST (18%)</span>
    <span className="font-medium text-gray-900">₹ 1,710.00</span>
  </div>
  <hr className="my-2 border-gray-300" />
  <div className="flex justify-between text-base font-semibold">
    <span className="text-gray-900">Grand Total</span>
    <span className="text-green-600">₹ 11,210.00</span>
  </div>
  </div>
</div>


      {/* These buttons are now outside the scrollable div */}
     

        {selectedRows.length > 0 && (
          <AnimateButton
            mode="delete"
            label="Delete"
            className="text-sm text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
            onClick={deleteSelectedRows}
          />
        )}
      </div>
  );
}

export default EditableTable;