interface AuthFormProps {
  title: string;
  subtitle: string;
  linkText: string;
  linkHref: string;
  error?: string;
  success?: string;
  children: React.ReactNode;
}

export default function AuthForm({
  title,
  subtitle,
  linkText,
  linkHref,
  error,
  success,
  children
}: AuthFormProps) {
  return (
    <div className="min-h-[400px] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a href={linkHref} className="font-medium text-indigo-600 hover:text-indigo-500">
              {linkText}
            </a>
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm font-medium text-red-800">{error}</div>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm font-medium text-green-800">{success}</div>
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
