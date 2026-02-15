import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  INDIAN_STATES,
  INDIAN_CITIES,
  getCitiesByState,
  getStateByName,
  OTHER_CITY_VALUE,
  type State,
  type City,
} from "@/lib/indianLocations";

interface StateSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  "data-testid"?: string;
}

export function StateSelect({
  value,
  onValueChange,
  placeholder = "Select state",
  disabled = false,
  required = false,
  error,
  "data-testid": testId = "select-state",
}: StateSelectProps) {
  return (
    <div className="space-y-1">
      <Select value={value || ""} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          data-testid={testId}
          className={error ? "border-destructive" : ""}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {INDIAN_STATES.map((state) => (
            <SelectItem key={state.code} value={state.name}>
              {state.name}
              {state.type === "ut" && (
                <span className="text-xs text-muted-foreground ml-1">(UT)</span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

interface CitySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  stateValue: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  allowCustom?: boolean;
  "data-testid"?: string;
}

export function CitySelect({
  value,
  onValueChange,
  stateValue,
  placeholder = "Select city",
  disabled = false,
  required = false,
  error,
  allowCustom = true,
  "data-testid": testId = "select-city",
}: CitySelectProps) {
  const [isOther, setIsOther] = useState(false);
  const [customCity, setCustomCity] = useState("");

  // Get cities for selected state
  const state = getStateByName(stateValue);
  const cities = state ? getCitiesByState(state.code) : [];

  // Check if current value is a custom city (not in dropdown)
  useEffect(() => {
    if (value && state) {
      const isInList = cities.some(
        (c) => c.name.toLowerCase() === value.toLowerCase()
      );
      if (!isInList && value !== "") {
        setIsOther(true);
        setCustomCity(value);
      } else {
        setIsOther(false);
        setCustomCity("");
      }
    }
  }, [stateValue]);

  // Reset when state changes
  useEffect(() => {
    if (!stateValue) {
      setIsOther(false);
      setCustomCity("");
    }
  }, [stateValue]);

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === OTHER_CITY_VALUE) {
      setIsOther(true);
      setCustomCity("");
      onValueChange("");
    } else {
      setIsOther(false);
      setCustomCity("");
      onValueChange(selectedValue);
    }
  };

  const handleCustomCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCustomCity(newValue);
    onValueChange(newValue);
  };

  if (!stateValue) {
    return (
      <div className="space-y-1">
        <Select disabled>
          <SelectTrigger data-testid={testId}>
            <SelectValue placeholder="Select state first" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Select state first</SelectItem>
          </SelectContent>
        </Select>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  if (isOther) {
    return (
      <div className="space-y-2">
        <Input
          value={customCity}
          onChange={handleCustomCityChange}
          placeholder="Enter city name"
          data-testid={`${testId}-custom`}
          className={error ? "border-destructive" : ""}
        />
        <button
          type="button"
          onClick={() => {
            setIsOther(false);
            setCustomCity("");
            onValueChange("");
          }}
          className="text-xs text-primary hover:underline"
          data-testid={`${testId}-back-to-list`}
        >
          ← Back to city list
        </button>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <Select
        value={value || ""} // Ensure value is always a string to avoid controlled/uncontrolled warning
        onValueChange={handleSelectChange}
        disabled={disabled || !stateValue}
      >
        <SelectTrigger
          data-testid={testId}
          className={error ? "border-destructive" : ""}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {cities.map((city) => (
            <SelectItem key={city.name} value={city.name}>
              {city.name}
            </SelectItem>
          ))}
          {allowCustom && (
            <>
              <div className="h-px bg-border my-1" />
              <SelectItem value={OTHER_CITY_VALUE}>
                <span className="text-muted-foreground">Other (enter manually)</span>
              </SelectItem>
            </>
          )}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

interface PinCodeInputProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  "data-testid"?: string;
}

export function PinCodeInput({
  value,
  onValueChange,
  placeholder = "Enter 6-digit PIN",
  disabled = false,
  required = false,
  error,
  "data-testid": testId = "input-pincode",
}: PinCodeInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Only allow digits and max 6 characters
    const cleanedValue = inputValue.replace(/\D/g, "").slice(0, 6);
    onValueChange(cleanedValue);
  };

  const isValid = value.length === 0 || value.length === 6;

  return (
    <div className="space-y-1">
      <Input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        data-testid={testId}
        className={error || (!isValid && value.length > 0) ? "border-destructive" : ""}
        maxLength={6}
      />
      {value.length > 0 && value.length < 6 && (
        <p className="text-xs text-muted-foreground">
          {6 - value.length} more digit{6 - value.length > 1 ? "s" : ""} needed
        </p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// Validation helpers
export function validatePinCode(pinCode: string): string | null {
  if (!pinCode) return null;
  if (!/^\d{6}$/.test(pinCode)) {
    return "PIN code must be exactly 6 digits";
  }
  // Indian PIN codes start with 1-9 (not 0)
  if (pinCode.startsWith("0")) {
    return "Invalid PIN code";
  }
  return null;
}

export function validatePhoneNumber(phone: string): string | null {
  if (!phone) return null;
  const cleaned = phone.replace(/\D/g, "");
  if (!/^[6-9]\d{9}$/.test(cleaned)) {
    return "Enter a valid 10-digit mobile number";
  }
  return null;
}

// Country codes for phone input dropdown (+91 default for India)
const COUNTRY_CODES = [
  { code: "+91", label: "+91 India", dial: "91" },
  { code: "+1", label: "+1 USA/Canada", dial: "1" },
  { code: "+44", label: "+44 UK", dial: "44" },
  { code: "+971", label: "+971 UAE", dial: "971" },
  { code: "+61", label: "+61 Australia", dial: "61" },
  { code: "+81", label: "+81 Japan", dial: "81" },
  { code: "+86", label: "+86 China", dial: "86" },
  { code: "+33", label: "+33 France", dial: "33" },
  { code: "+49", label: "+49 Germany", dial: "49" },
  { code: "+65", label: "+65 Singapore", dial: "65" },
];

const DEFAULT_COUNTRY_CODE = "+91";

// Phone number input with country code dropdown and number field
interface PhoneInputProps {
  value: string;
  onValueChange: (value: string) => void;
  /** Selected country code e.g. "+91". If not provided, defaults to +91. */
  countryCode?: string;
  /** Called when country code selection changes */
  onCountryCodeChange?: (code: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  "data-testid"?: string;
}

export function PhoneInput({
  value,
  onValueChange,
  countryCode: controlledCountryCode,
  onCountryCodeChange,
  placeholder = "9876543210",
  disabled = false,
  required = false,
  error,
  "data-testid": testId = "input-phone",
}: PhoneInputProps) {
  const [internalCountryCode, setInternalCountryCode] = useState(DEFAULT_COUNTRY_CODE);
  const countryCode = controlledCountryCode ?? internalCountryCode;
  const setCountryCode = onCountryCodeChange ?? setInternalCountryCode;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cleanedValue = inputValue.replace(/\D/g, "").slice(0, 10);
    onValueChange(cleanedValue);
  };

  const formatPhone = (phone: string): string => {
    if (phone.length <= 5) return phone;
    return `${phone.slice(0, 5)}-${phone.slice(5)}`;
  };

  const validationError = validatePhoneNumber(value);

  return (
    <div className="space-y-1">
      <div className="flex gap-2">
        <Select
          value={countryCode}
          onValueChange={setCountryCode}
          disabled={disabled}
        >
          <SelectTrigger
            className="w-[7.5rem] shrink-0"
            data-testid={testId ? `${testId}-country` : undefined}
          >
            <SelectValue placeholder="Code" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRY_CODES.map(({ code, label }) => (
              <SelectItem key={code} value={code}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="tel"
          inputMode="numeric"
          value={formatPhone(value)}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          data-testid={testId}
          className={`flex-1 ${error || (validationError && value.length === 10) ? "border-destructive" : ""}`}
          maxLength={11}
        />
      </div>
      {value.length > 0 && value.length < 10 && (
        <p className="text-xs text-muted-foreground">
          {10 - value.length} more digit{10 - value.length > 1 ? "s" : ""} needed
        </p>
      )}
      {validationError && value.length === 10 && (
        <p className="text-xs text-destructive">{validationError}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// Price input with formatting
interface PriceInputProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  "data-testid"?: string;
}

export function PriceInput({
  value,
  onValueChange,
  placeholder = "Enter price",
  disabled = false,
  required = false,
  error,
  "data-testid": testId = "input-price",
}: PriceInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Remove all non-digits
    const cleanedValue = inputValue.replace(/\D/g, "");
    onValueChange(cleanedValue);
  };

  // Format price in Indian format (lakhs, crores)
  const formatIndianPrice = (num: string): string => {
    if (!num) return "";
    const n = parseInt(num, 10);
    if (isNaN(n)) return "";
    return n.toLocaleString("en-IN");
  };

  // Get human readable format
  const getReadablePrice = (num: string): string => {
    if (!num) return "";
    const n = parseInt(num, 10);
    if (isNaN(n)) return "";
    
    if (n >= 10000000) {
      return `₹${(n / 10000000).toFixed(2)} Cr`;
    } else if (n >= 100000) {
      return `₹${(n / 100000).toFixed(2)} Lac`;
    } else if (n >= 1000) {
      return `₹${(n / 1000).toFixed(1)}K`;
    }
    return `₹${n}`;
  };

  return (
    <div className="space-y-1">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          ₹
        </span>
        <Input
          type="text"
          inputMode="numeric"
          value={formatIndianPrice(value)}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          data-testid={testId}
          className={`pl-8 ${error ? "border-destructive" : ""}`}
        />
      </div>
      {value && parseInt(value) > 0 && (
        <p className="text-xs text-muted-foreground">
          {getReadablePrice(value)}
        </p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
