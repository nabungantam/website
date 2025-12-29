import { Example } from "@/components/example";
import { BugReportForm } from "@/docs/important-form-pattern/BugReportForm";
import { FormTanstackArray } from "@/docs/important-form-pattern/FormTanstackArray";
import { FormTanstackCheckbox } from "@/docs/important-form-pattern/FormTanstackCheckbox";
import { FormTanstackComplex } from "@/docs/important-form-pattern/FormTanstackComplex";
import { FormTanstackInput } from "@/docs/important-form-pattern/FormTanstackInput";
import { FormTanstackRadioGroup } from "@/docs/important-form-pattern/FormTanstackRadioGroup";
import { FormTanstackSelect } from "@/docs/important-form-pattern/FormTanstackSelect";
import { FormTanstackSwitch } from "@/docs/important-form-pattern/FormTanstackSwitch";
import { FormTanstackTextarea } from "@/docs/important-form-pattern/FormTanstackTextarea";

const page = () => {
  return (
    <div>
      <Example title="Bug Report Form" className="items-center justify-center">
        <BugReportForm />
      </Example>
      <Example
        title="Form Tanstack TextArea"
        className="items-center justify-center"
      >
        <FormTanstackTextarea />
      </Example>
      <Example
        title="Form Tanstack TextInput"
        className="items-center justify-center"
      >
        <FormTanstackInput />
      </Example>
      <Example
        title="Form Tanstack Select"
        className="items-center justify-center"
      >
        <FormTanstackSelect />
      </Example>
      <Example
        title="Form Tanstack Checkbox"
        className="items-center justify-center"
      >
        <FormTanstackCheckbox />
      </Example>
      <Example
        title="Form Tanstack RadioGroup"
        className="items-center justify-center"
      >
        <FormTanstackRadioGroup />
      </Example>
      <Example
        title="Form Tanstack Complex"
        className="items-center justify-center"
      >
        <FormTanstackComplex />
      </Example>
      <Example
        title="Form Tanstack Switch"
        className="items-center justify-center"
      >
        <FormTanstackSwitch />
      </Example>
      <Example
        title="Form Tanstack array"
        className="items-center justify-center"
      >
        <FormTanstackArray />
      </Example>
    </div>
  );
};

export default page;
