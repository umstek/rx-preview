export interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

export default function Button({ children, onClick, disabled }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="transition-colors inline-flex w-full justify-center rounded-md bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-opacity-75 active:bg-indigo-600 active:text-indigo-50 disabled:bg-gray-100 disabled:text-gray-300"
    >
      {children}
    </button>
  );
}
