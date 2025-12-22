import { EyeOffIcon, EyeIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Box } from "@/components/ui/box";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input, type InputProps } from "@/components/ui/input";
import { createElement, useState } from "react";

type PasswordFieldProps = InputProps & {
  name?: string;
  description?: string | JSX.Element;
  useForm?: boolean;
};

// Helper component for password input with toggle
function PasswordInputToggle({
  passwordVisibility,
  setPasswordVisibility,
  ...inputProps
}: {
  passwordVisibility: boolean;
  setPasswordVisibility: (value: boolean) => void;
} & InputProps) {
  return (
    <Box className="relative">
      <Input
        {...inputProps}
        type={passwordVisibility ? "text" : "password"}
        autoComplete="on"
        className={`pr-12 ${inputProps.className || ""}`}
      />
      <Box
        className="absolute inset-y-0 right-0 flex cursor-pointer items-center p-3 text-muted-foreground"
        onClick={() => setPasswordVisibility(!passwordVisibility)}
      >
        {createElement(passwordVisibility ? EyeOffIcon : EyeIcon, {
          className: "h-4",
        })}
      </Box>
    </Box>
  );
}

// Component that uses form context - only rendered when useForm is true
function PasswordFieldWithForm({
  name,
  placeholder,
  description,
  passwordVisibility,
  setPasswordVisibility,
}: {
  name: string;
  placeholder?: string;
  description?: string | JSX.Element;
  passwordVisibility: boolean;
  setPasswordVisibility: (value: boolean) => void;
}) {
  const { control, getFieldState } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <PasswordInputToggle
              passwordVisibility={passwordVisibility}
              setPasswordVisibility={setPasswordVisibility}
              {...field}
              placeholder={placeholder}
              className={getFieldState(name).error ? "text-destructive" : ""}
            />
          </FormControl>
          <FormMessage />
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
}

export function PasswordField({
  name = "password",
  placeholder = "Enter password",
  description,
  useForm = false, // Default to false - work without form context
  ...inputProps
}: PasswordFieldProps) {
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  // If useForm is true, use form context (will error if not in FormProvider)
  if (useForm === true) {
    return (
      <PasswordFieldWithForm
        name={name}
        placeholder={placeholder}
        description={description}
        passwordVisibility={passwordVisibility}
        setPasswordVisibility={setPasswordVisibility}
      />
    );
  }

  // Default: regular input without form context
  return (
    <PasswordInputToggle
      passwordVisibility={passwordVisibility}
      setPasswordVisibility={setPasswordVisibility}
      placeholder={placeholder}
      {...inputProps}
    />
  );
}