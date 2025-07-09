import { useState } from "react";
import settings from "../../../../public/settings.json";
import CommonForm, {
  type Field,
  type ApiList,
} from "@/Components/common/commonform";

function ProductForm() {
  const productSection = settings.client; // Update if your JSON uses a different key

  const groupedFields = Object.entries(productSection).map(
    ([sectionKey, section]) => ({
      title: section.title || sectionKey,
      sectionKey,
      fields: section.fields
        .filter(
          (field: any) =>
            field.key !== "action" &&
            field.key !== "id" &&
            field.isForm === true
        )
        .map((field: any) => ({
          id: field.key,
          label: field.label,
          type: (field.type || "textinput") as Field["type"],
          className: "w-full",
          errMsg: `Enter ${field.label}`,
          ...(field.type?.includes("dropdown") && field.options
            ? { options: field.options }
            : {}),
          readApi: field.readApi,
          updateApi: field.updateApi,
          apiKey: field.apiKey,
          createKey: field.createKey,
        })),
    })
  );

  // ✅ Use custom product API for all CRUD actions
  const [productApi] = useState<ApiList>({
    create: "http://127.0.0.1:8000/api/products",
    read: "http://127.0.0.1:8000/api/products",
    update: "http://127.0.0.1:8000/api/products",
    delete: "http://127.0.0.1:8000/api/products",
  });

  const [formOpen, setFormOpen] = useState(true);

  const handleFormSubmit = (formData: any) => {
    console.log("Form submitted:", formData);
    setFormOpen(false);
  };

  return (
    <div className="w-full p-2 lg:pr-5">
      {formOpen && (
        <CommonForm
          groupedFields={groupedFields}
          isPopUp={false}
          formOpen={formOpen}
          setFormOpen={setFormOpen}
          formName="Product"
          successMsg="Form submitted successfully"
          faildMsg="Form submission failed"
          initialData={{}}
          onSubmit={handleFormSubmit}
          api={productApi}
        />
      )}
    </div>
  );
}

export default ProductForm;
