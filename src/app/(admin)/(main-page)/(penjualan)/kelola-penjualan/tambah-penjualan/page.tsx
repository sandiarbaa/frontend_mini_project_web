import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DefaultInputsPenjualan from "@/components/form/form-elements/DefaultInputsPenjualan";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Tambah Penjualan | Dashboard",
  description: "Halaman untuk menambahkan data penjualan baru",
};

export default function TambahPenjualan() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Penjualan" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1 px-20">
        <div className="space-y-6">
          <DefaultInputsPenjualan />
        </div>
      </div>
    </div>
  );
}
