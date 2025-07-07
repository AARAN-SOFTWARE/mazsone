// CommonForm.tsx
import { useEffect, useRef, useState } from "react";
import Button from "../Input/Button";
import { TextArea } from "../Input/TextArea";
import Dropdown from "../Input/Dropdown";
import Switch from "../Input/switch";
import Checkbox from "../Input/checkbox";
import MultiCheckbox from "../Input/MultiCheckbox";
import PasswordInput from "../Input/passwordInput";
import { DatePicker } from "../Datepicker/Datepicker";
import FileUpload from "../Input/FileInput";
import DropdownRead from "../Input/Dropdown-read";
import FloatingInput from "../Input/FloatingInput";
import ImageButton from "../Button/ImageBtn";
import apiClient from "@/pages/app/api/apiClients";
import { format } from "date-fns";

export type Field = {
  className: string;
  id: string;
  label: string;
  type:
    | "textinput"
    | "textarea"
    | "dropdown"
    | "switch"
    | "checkbox"
    | "calendar"
    | "multicheckbox"
    | "password"
    | "date"
    | "file"
    | "dropdownread"
    | "dropdownreadmultiple"
    | "dropdownmultiple";
  options?: string[];
  errMsg: string;
  readApi?: string;
  updateApi?: string;
  apiKey?: string;
  createKey?: string;
};

export type FieldGroup = {
  title: string;
  sectionKey?: string;
  fields: Field[];
};

export interface ApiList {
  create: string;
  read: string;
  update: string;
  delete: string;
}

type CommonFormProps = {
  groupedFields: FieldGroup[];
  isPopUp: boolean;
  formName: string;
  formOpen: boolean;
  setFormOpen?: (open: boolean) => void;
  successMsg: string;
  faildMsg: string;
  initialData?: Record<string, any>;
  onSubmit?: (data: any) => void;
  api: ApiList;
};

function CommonForm({
  groupedFields,
  isPopUp,
  formName,
  formOpen,
  setFormOpen,
  faildMsg,
  initialData = {},
  onSubmit,
  api,
}: CommonFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (id: string, value: any) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateField = (field: Field, value: any): string => {
    if (
      (Array.isArray(value) && value.length === 0) ||
      value === "" ||
      value === undefined ||
      value === null ||
      (typeof value === "boolean" && value === false)
    )
      return field.errMsg;

    if (
      field.label.toLowerCase().includes("email") &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      return field.errMsg;
    }

    if (
      field.label.toLowerCase().includes("phone") &&
      !/^[6-9]\d{9}$/.test(value)
    ) {
      return field.errMsg;
    }

    return "";
  };

  const handleSubmit = () => {
    const allFields = groupedFields.flatMap((group) => group.fields);
    const errors: Record<string, string> = {};

    allFields.forEach((field) => {
      const value = formData[field.id];
      const error = validateField(field, value);
      if (error) errors[field.id] = error;
    });

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const cleaned = { ...formData };

    for (const key in cleaned) {
      const val = cleaned[key];
      if (val instanceof Date) {
        cleaned[key] = format(val, "yyyy-MM-dd");
      }
    }

    const isUpdate = !!initialData?.id;
    const endpoint = isUpdate ? `${api.update}/${initialData.id}` : api.create;
    const method = isUpdate ? apiClient.put : apiClient.post;

    const formDataToSend = new FormData();
    Object.entries(cleaned).forEach(([key, val]) => {
      if (val instanceof File) {
        formDataToSend.append(key, val);
      } else if (Array.isArray(val)) {
        val.forEach((v) => formDataToSend.append(`${key}[]`, v));
      } else if (typeof val === "boolean") {
        formDataToSend.append(key, val ? "1" : "0");
      } else if (val !== undefined && val !== null && val !== "") {
        formDataToSend.append(key, val);
      }
    });

    method(endpoint, formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        const saved = res.data?.data || {};
        const finalData = {
          id: saved.name || `perm-${Date.now()}`,
          ...cleaned,
        };
        onSubmit?.(finalData);
        setFormOpen?.(false);
      })
      .catch((err) => {
        const validationErrors = err.response?.data?.errors;
        if (validationErrors) {
          console.error("Validation errors:", validationErrors);
          alert(Object.values(validationErrors).flat().join("\n"));
        } else {
          console.error("Form submission failed:", err);
          alert(err.response?.data?.message || faildMsg);
        }
      });
  };

  if (!formOpen) return null;

  return (
    <div className={isPopUp ? "fixed inset-0 bg-black/60 z-50 flex items-center justify-center" : ""}>
      <div
        className={
          isPopUp
            ? "w-full m-5 lg:w-[70%] max-h-[90vh] overflow-y-auto bg-background text-foreground p-2 rounded-md shadow-md border border-ring/30 flex flex-col gap-2"
            : "bg-background h-full m-5 lg:my-10 text-foreground p-2 rounded-md shadow-lg border border-ring flex flex-col gap-5"
        }
      >
        <div className="flex justify-between mx-2">
          <h1 className="text-md py-2 text-foreground/50">{formName} Form</h1>
          <ImageButton
            icon="close"
            className="text-delete w-max"
            onClick={() => {
              setFormData({});
              setFormErrors({});
              setFormOpen?.(false);
            }}
          />
        </div>

        <div className="flex flex-col gap-5 border border-ring/30 p-5 rounded-md">
          {groupedFields.map((group) => (
            <div key={group.title} className="flex flex-col gap-4">
              <h2 className="text-md font-semibold text-primary pb-1">
                {group.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.fields.map((field) => {
                  const err = formErrors[field.id] || "";
                  const value = formData[field.id] || "";
                  const isFileField = field.type === "file";

                  const commonProps = {
                    key: field.id,
                    id: field.id,
                    value,
                    err,
                    onChange: (e: any) =>
                      isFileField
                        ? handleChange(field.id, e)
                        : handleChange(field.id, e.target?.value ?? e),
                    className: `${field.className} rounded-md`,
                    ref: (el: any) => (inputRefs.current[field.id] = el),
                  };

                  switch (field.type) {
                    case "textinput":
                      return (
                        <FloatingInput
                          {...commonProps}
                          label={field.label}
                          type="text"
                        />
                      );
                    case "textarea":
                      return <TextArea {...commonProps} label={field.label} />;
                    case "dropdown":
                    case "dropdownmultiple":
                      return (
                        <Dropdown
                          readApi={""}
                          updateApi={""}
                          {...commonProps}
                          items={field.options || []}
                          multiple={field.type === "dropdownmultiple"}
                          placeholder={field.label}
                          apiKey={field.apiKey}
                          createKey={field.createKey}
                        />
                      );
                    case "dropdownread":
                    case "dropdownreadmultiple":
                      return (
                        <DropdownRead
                          placeholder={""}
                          {...commonProps}
                          label={field.label}
                          items={field.options || []}
                          multiple={field.type === "dropdownreadmultiple"}
                          readApi={field.readApi}
                          apiKey={field.apiKey}
                        />
                      );
                    case "switch":
                      return (
                        <Switch
                          {...commonProps}
                          agreed={!!value}
                          label={!!value ? "Active" : "Inactive"}
                        />
                      );
                    case "checkbox":
                      return (
                        <Checkbox
                          {...commonProps}
                          agreed={!!value}
                          label={field.label}
                        />
                      );
                    case "multicheckbox":
                      return (
                        <MultiCheckbox
                          {...commonProps}
                          label={field.label}
                          options={field.options || []}
                        />
                      );
                    case "password":
                      return (
                        <PasswordInput {...commonProps} label={field.label} />
                      );
                    case "date":
                      return (
                        <DatePicker
                          {...commonProps}
                          model={
                            value instanceof Date
                              ? value
                              : value
                              ? new Date(value)
                              : undefined
                          }
                          label={field.label}
                        />
                      );
                    case "file":
                      return (
                        <FileUpload
                          key={field.id}
                          id={field.id}
                          onChange={(file) => handleChange(field.id, file)}
                        />
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-5 mt-4">
            <Button
              label="Cancel"
              className="bg-delete text-create-foreground"
              onClick={() => {
                setFormData({});
                setFormErrors({});
                setFormOpen?.(false);
              }}
            />
            <Button
              label="Submit"
              className="bg-create text-create-foreground"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommonForm;
