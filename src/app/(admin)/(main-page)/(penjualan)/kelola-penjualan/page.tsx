"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Alert from "@/components/ui/alert/Alert";
import PenjualanTable from "@/components/tables/PenjualanTable";

export default function KelolaPenjualan() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const updated = searchParams.get("updated");
  const [showAlert, setShowAlert] = useState<boolean>(!!success);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(!!updated);
  const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setShowAlert(false);
        const url = new URL(window.location.href);
        url.searchParams.delete("success");
        router.replace(url.pathname);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  useEffect(() => {
    if (updated) {
      const timer = setTimeout(() => {
        setUpdateSuccess(false);
        const url = new URL(window.location.href);
        url.searchParams.delete("updated");
        router.replace(url.pathname);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updated, router]);

  useEffect(() => {
    if (deleteSuccess) {
      const timer = setTimeout(() => setDeleteSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [deleteSuccess]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Kelola Penjualan" />

      {showAlert && <Alert variant="success" title="Berhasil!" message="Penjualan berhasil ditambahkan." />}
      {updateSuccess && <Alert variant="success" title="Berhasil!" message="Penjualan berhasil diubah." />}
      {deleteSuccess && <Alert variant="success" title="Berhasil!" message="Penjualan berhasil dihapus." />}

      <div className="space-y-6 pt-5">
        <ComponentCard
          title="Tabel Penjualan"
          desc="Berikut adalah data penjualan yang tercatat."
          buttonExists={true}
          buttonText="Tambah Penjualan"
          buttonHref="/kelola-penjualan/tambah-penjualan"
        >
          <PenjualanTable onDeleteSuccess={() => setDeleteSuccess(true)} />
        </ComponentCard>
      </div>
    </div>
  );
}
