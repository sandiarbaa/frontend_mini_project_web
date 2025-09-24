import React from "react";
import Button from "../ui/button/Button";
import { PlusIcon } from "@/icons";
import Link from "next/link";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  buttonExists?: boolean; // Flag to show/hide the button
  buttonText?: string; // Text for the button
  buttonHref?: string; // Href for the button link
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  buttonExists = false,
  buttonText = "",
  buttonHref = "/",
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="px-6 py-5 flex justify-between">
        <div>
          <h3 className="text-xl font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-md text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>
        {buttonExists && (
          <Link href={buttonHref}>
            <Button size="sm" variant="primary" endIcon={<PlusIcon />} className="mb-5">
              {buttonText}
            </Button>
          </Link>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
