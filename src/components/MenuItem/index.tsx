import { Menu } from "@headlessui/react";

export default function MenuItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div>
      <Menu.Item>
        {({ active }) => (
          <button
            onClick={onClick}
            className={`${
              active ? "bg-indigo-100" : "bg-white"
            } text-indigo-600 group flex w-full items-center px-2 py-2 text-sm font-medium`}
          >
            {label}
          </button>
        )}
      </Menu.Item>
    </div>
  );
}
