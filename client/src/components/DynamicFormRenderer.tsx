import { useQuery } from "@tanstack/react-query";
import { DynamicIcon } from "@/components/DynamicIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INDIAN_STATES } from "@/lib/indianLocations";

interface FieldDef {
  id: string;
  label: string;
  fieldKey: string;
  fieldType: string;
  icon?: string | null;
  placeholder?: string | null;
  isRequired: boolean;
  options?: string[] | null;
  validationRules?: { min?: number; max?: number; charLimit?: number; regex?: string } | null;
  sourceType?: string | null;
  linkedFieldKey?: string | null;
  defaultValue?: string | null;
  displayStyle?: string | null;
}

interface SectionDef {
  id: string;
  name: string;
  icon?: string | null;
  stage: number;
  fields: FieldDef[];
}

interface DynamicFormRendererProps {
  sections: SectionDef[];
  values: Record<string, unknown>;
  onChange: (fieldKey: string, value: unknown) => void;
  errors?: Record<string, string>;
  showSectionHeaders?: boolean;
}

function isCompactField(fieldType: string): boolean {
  return ["text", "alphanumeric", "numeric", "dropdown", "radio", "date", "map"].includes(fieldType);
}

function FieldRenderer({
  field,
  value,
  onChange,
  error,
  parentValue,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  parentValue?: unknown;
}) {
  const { data: categoryOptions } = useQuery<Array<{ id: string; name: string }>>({
    queryKey: ["/api/property-categories"],
    enabled: field.fieldType === "dropdown" && field.sourceType === "category_master",
  });

  const { data: linkedOptions } = useQuery<Array<{ id: string; name: string }>>({
    queryKey: ["/api/property-categories", parentValue],
    enabled:
      field.fieldType === "dropdown" &&
      field.sourceType === "linked_to_parent" &&
      !!parentValue,
  });

  const resolveOptions = (): string[] => {
    if (field.sourceType === "category_master" && categoryOptions) {
      return categoryOptions.map((c) => c.name);
    }
    if (field.sourceType === "state_master") {
      return INDIAN_STATES.map((s) => s.name);
    }
    if (field.sourceType === "linked_to_parent" && linkedOptions) {
      return linkedOptions.map((c) => c.name);
    }
    return field.options ?? [];
  };

  const strValue = typeof value === "string" ? value : (value != null ? String(value) : "");

  switch (field.fieldType) {
    case "text":
    case "alphanumeric": {
      return (
        <Input
          type="text"
          value={strValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? undefined}
          maxLength={field.validationRules?.charLimit ?? undefined}
          data-testid={`input-${field.fieldKey}`}
        />
      );
    }

    case "numeric": {
      return (
        <Input
          type="number"
          value={strValue}
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder={field.placeholder ?? undefined}
          min={field.validationRules?.min ?? undefined}
          max={field.validationRules?.max ?? undefined}
          data-testid={`input-${field.fieldKey}`}
        />
      );
    }

    case "textarea": {
      return (
        <Textarea
          value={strValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? undefined}
          maxLength={field.validationRules?.charLimit ?? undefined}
          data-testid={`textarea-${field.fieldKey}`}
        />
      );
    }

    case "checkbox": {
      const selectedValues = Array.isArray(value) ? (value as string[]) : [];
      const opts = field.options ?? [];
      return (
        <div className="flex flex-col gap-2" data-testid={`checkbox-group-${field.fieldKey}`}>
          {opts.map((opt) => (
            <div key={opt} className="flex items-center gap-2">
              <Checkbox
                id={`${field.fieldKey}-${opt}`}
                checked={selectedValues.includes(opt)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onChange([...selectedValues, opt]);
                  } else {
                    onChange(selectedValues.filter((v) => v !== opt));
                  }
                }}
                data-testid={`checkbox-${field.fieldKey}-${opt}`}
              />
              <Label htmlFor={`${field.fieldKey}-${opt}`} className="font-normal cursor-pointer">
                {opt}
              </Label>
            </div>
          ))}
        </div>
      );
    }

    case "dropdown": {
      const opts = resolveOptions();
      return (
        <Select
          value={strValue || undefined}
          onValueChange={(v) => onChange(v)}
        >
          <SelectTrigger data-testid={`select-${field.fieldKey}`}>
            <SelectValue placeholder={field.placeholder ?? "Select..."} />
          </SelectTrigger>
          <SelectContent>
            {opts.map((opt) => (
              <SelectItem key={opt} value={opt} data-testid={`select-option-${field.fieldKey}-${opt}`}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    case "radio": {
      const opts = field.options ?? [];
      return (
        <RadioGroup
          value={strValue || undefined}
          onValueChange={(v) => onChange(v)}
          data-testid={`radio-group-${field.fieldKey}`}
        >
          {opts.map((opt) => (
            <div key={opt} className="flex items-center gap-2">
              <RadioGroupItem
                value={opt}
                id={`${field.fieldKey}-${opt}`}
                data-testid={`radio-${field.fieldKey}-${opt}`}
              />
              <Label htmlFor={`${field.fieldKey}-${opt}`} className="font-normal cursor-pointer">
                {opt}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );
    }

    case "date": {
      return (
        <Input
          type="date"
          value={strValue}
          onChange={(e) => onChange(e.target.value)}
          data-testid={`input-${field.fieldKey}`}
        />
      );
    }

    case "file_upload": {
      return (
        <Input
          type="file"
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              onChange(files);
            }
          }}
          data-testid={`input-${field.fieldKey}`}
        />
      );
    }

    case "map": {
      return (
        <Input
          type="text"
          value={strValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? "Enter coordinates or address..."}
          data-testid={`input-${field.fieldKey}`}
        />
      );
    }

    default: {
      return (
        <Input
          type="text"
          value={strValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? undefined}
          data-testid={`input-${field.fieldKey}`}
        />
      );
    }
  }
}

export function DynamicFormRenderer({
  sections,
  values,
  onChange,
  errors = {},
  showSectionHeaders = true,
}: DynamicFormRendererProps) {
  return (
    <div className="flex flex-col gap-6" data-testid="dynamic-form-renderer">
      {sections.map((section) => {
        const content = (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.fields.map((field) => {
              const fullWidth = !isCompactField(field.fieldType);
              const parentValue = field.linkedFieldKey ? values[field.linkedFieldKey] : undefined;

              return (
                <div
                  key={field.id}
                  className={fullWidth ? "md:col-span-2" : ""}
                  data-testid={`field-wrapper-${field.fieldKey}`}
                >
                  <Label
                    htmlFor={field.fieldKey}
                    className="flex items-center gap-1.5 mb-1.5"
                    data-testid={`label-${field.fieldKey}`}
                  >
                    {field.icon && (
                      <DynamicIcon name={field.icon} className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{field.label}</span>
                    {field.isRequired && (
                      <span className="text-destructive">*</span>
                    )}
                  </Label>

                  <FieldRenderer
                    field={field}
                    value={values[field.fieldKey]}
                    onChange={(v) => onChange(field.fieldKey, v)}
                    error={errors[field.fieldKey]}
                    parentValue={parentValue}
                  />

                  {errors[field.fieldKey] && (
                    <p
                      className="text-sm text-destructive mt-1"
                      data-testid={`error-${field.fieldKey}`}
                    >
                      {errors[field.fieldKey]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        );

        if (!showSectionHeaders) {
          return (
            <div key={section.id} data-testid={`section-${section.id}`}>
              {content}
            </div>
          );
        }

        return (
          <Card key={section.id} data-testid={`section-card-${section.id}`}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                {section.icon && (
                  <DynamicIcon name={section.icon} className="h-5 w-5" />
                )}
                {section.name}
              </CardTitle>
            </CardHeader>
            <CardContent>{content}</CardContent>
          </Card>
        );
      })}
    </div>
  );
}
