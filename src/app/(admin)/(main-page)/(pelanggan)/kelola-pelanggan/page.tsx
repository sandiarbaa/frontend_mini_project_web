"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PelangganTable from "@/components/tables/PelangganTable";
import Alert from "@/components/ui/alert/Alert";

export default function KelolaPelanggan() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");   // untuk tambah
  const updated = searchParams.get("updated");   // 🔹 untuk ubah
  const [showAlert, setShowAlert] = useState<boolean>(!!success);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(!!updated); // 🔹 state baru
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
      const timer = setTimeout(() => {
        setDeleteSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [deleteSuccess]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Kelola Pelanggan" />

      {showAlert && (
        <Alert
          variant="success"
          title="Berhasil!"
          message="Pelanggan berhasil ditambahkan."
        />
      )}

      {updateSuccess && (
        <Alert
          variant="success"
          title="Berhasil!"
          message="Pelanggan berhasil diubah."
        />
      )}

      {deleteSuccess && (
        <Alert
          variant="success"
          title="Berhasil!"
          message="Pelanggan berhasil dihapus."
        />
      )}

      <div className="space-y-6 pt-5">
        <ComponentCard
          title="Tabel Pelanggan"
          desc="Berikut adalah data pelanggan yang terdaftar di sistem kami."
          buttonExists={true}
          buttonText="Tambah Pelanggan"
          buttonHref="/kelola-pelanggan/tambah-pelanggan"
        >
          <PelangganTable onDeleteSuccess={() => setDeleteSuccess(true)} />
        </ComponentCard>
      </div>
    </div>
  );
}
