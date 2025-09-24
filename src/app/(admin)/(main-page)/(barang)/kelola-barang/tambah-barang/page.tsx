import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DefaultInputsBarang from "@/components/form/form-elements/DefaultInputsBarang";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Tambah Barang | TailAdmin - Next.js Dashboard Template",
  description: "Halaman tambah barang untuk sistem CRUD barang",
};

export default function TambahBarang() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Barang" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1 px-20">
        <div className="space-y-6">
          <DefaultInputsBarang />
        </div>
      </div>
    </div>
  );
}
