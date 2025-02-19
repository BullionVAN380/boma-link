import { IconType } from 'react-icons';

interface FormInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  autoComplete: string;
  required?: boolean;
  Icon: IconType;
  hint?: string;
}

export default function FormInput({
  id,
  name,
  type,
  label,
  placeholder,
  autoComplete,
  required = true,
  Icon,
  hint
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder={placeholder}
        />
      </div>
      {hint && (
        <p className="mt-1 text-xs text-gray-500">
          {hint}
        </p>
      )}
    </div>
  );
}
