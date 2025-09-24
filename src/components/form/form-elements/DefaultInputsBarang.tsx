"use client";
import React, { useState } from "react";
import axios from "axios";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import { ChevronDownIcon } from "../../../icons";
import Button from "../../ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { useRouter } from "next/navigation";

export default function DefaultInputsBarang() {
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("");
  const [harga, setHarga] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();

  // opsi kategori contoh (bisa diubah sesuai kebutuhan BE)
  const options = [
    { value: "ATK", label: "Alat Tulis Kantor" },
    { value: "RT", label: "Rumah Tangga" },
    { value: "MASAK", label: "Masak" },
    { value: "ELEKTRONIK", label: "Elektronik" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://127.0.0.1:8000/api/barangs", {
        nama,
        kategori,
        harga: harga === "" ? null : Number(harga),
      });

      // Trigger alert
      setShowAlert(true);

      // reset form
      setNama("");
      setKategori("");
      setHarga("");

      // Redirect ke halaman /kelola-barang
      router.push("/kelola-barang?success=1");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      alert("Gagal menambahkan barang");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComponentCard title="Form Tambah Barang">
      {showAlert && (
        <Alert
          variant="success"
          title="Berhasil!"
          message="Barang berhasil ditambahkan."
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
            required
          />
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
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        {/* Input Harga */}
        <div>
          <Label>Harga</Label>
          <Input
            type="text"
            value={harga ? `Rp ${Number(harga).toLocaleString("id-ID")}` : ""}
            onChange={(e) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const raw: any = e.target.value.replace(/\D/g, ""); // ambil digit aja
              setHarga(raw); // simpan angka murni
            }}
            placeholder="Masukkan harga barang"
            required
          />
        </div>

        {/* Tombol Submit */}
        <Button
          type="submit"
          size="sm"
          variant="primary"
          disabled={loading}
          className="mt-4"
        >
          {loading ? "Menyimpan..." : "Simpan Barang"}
        </Button>
      </form>
    </ComponentCard>
  );
}
