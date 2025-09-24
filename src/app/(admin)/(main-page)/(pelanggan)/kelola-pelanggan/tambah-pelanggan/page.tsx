import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DefaultInputsPelanggan from "@/components/form/form-elements/DefaultInputsPelanggan";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Form Elements | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function TambahPelanggan() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Pelanggan" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1 px-20">
        <div className="space-y-6">
          <DefaultInputsPelanggan />
        </div>
      </div>
    </div>
  );
}
