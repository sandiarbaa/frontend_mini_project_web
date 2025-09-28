"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import { ChevronDownIcon } from "../../../icons";
import Button from "../../ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Props {
  id: string;
}

export default function DefaultInputsUbahBarang({ id }: Props) {
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("");
  const [harga, setHarga] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const options = [
    { value: "ATK", label: "Alat Tulis Kantor" },
    { value: "RT", label: "Rumah Tangga" },
    { value: "MASAK", label: "Masak" },
    { value: "ELEKTRONIK", label: "Elektronik" },
  ];

  // Fetch data barang by id
  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const res = await api.get(`/barangs/${id}`);
        const data = res.data.data;

        setNama(data.nama);
        setKategori(data.kategori);
        setHarga(data.harga);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Error fetching barang:", error.response?.data || error.message);
        alert("Gagal mengambil data barang");
      }
    };

    fetchBarang();
  }, [id]);

  // Validasi
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!nama.trim()) newErrors.nama = "Nama barang wajib diisi";
    if (!kategori) newErrors.kategori = "Kategori wajib dipilih";
    if (!harga || harga === 0) newErrors.harga = "Harga wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await api.put(`/barangs/${id}`, {
        nama,
        kategori,
        harga: harga === "" ? null : Number(harga),
      });

      setShowAlert(true);

      router.push("/kelola-barang?updated=1");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      alert("Gagal mengubah barang");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComponentCard title="Form Ubah Barang">
      {showAlert && (
        <Alert
          variant="success"
          title="Berhasil!"
          message="Barang berhasil diubah."
          showLink={true}
          linkHref="/kelola-barang"
          linkText="Lihat Daftar"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Input Nama */}
        <div>
          <Label>Nama Barang</Label>
          <Input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Masukkan nama barang"
          />
          {errors.nama && (
            <p className="mt-1 text-sm text-red-500">{errors.nama}</p>
          )}
        </div>

        {/* Dropdown Kategori */}
        <div>
          <Label>Kategori</Label>
          <div className="relative">
            <Select
              options={options}
              placeholder="Pilih kategori barang"
              onChange={(value) => setKategori(value)}
              className="dark:bg-dark-900"
              value={kategori}
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
          {errors.kategori && (
            <p className="mt-1 text-sm text-red-500">{errors.kategori}</p>
          )}
        </div>

        {/* Input Harga */}
        <div>
          <Label>Harga</Label>
          <Input
            type="text"
            value={harga ? `Rp ${Number(harga).toLocaleString("id-ID")}` : ""}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "");
              setHarga(raw ? Number(raw) : "");
            }}
            placeholder="Masukkan harga barang"
          />
          {errors.harga && (
            <p className="mt-1 text-sm text-red-500">{errors.harga}</p>
          )}
        </div>

        {/* Tombol Submit */}
        <Button
          type="submit"
          size="sm"
          variant="primary"
          disabled={loading}
          className="mt-4"
        >
          {loading ? "Menyimpan..." : "Update Barang"}
        </Button>
      </form>
    </ComponentCard>
  );
}
