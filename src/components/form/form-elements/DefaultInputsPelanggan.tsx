"use client";

import React, { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import { ChevronDownIcon } from "../../../icons";
import Radio from "../input/Radio";
import Button from "../../ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function DefaultInputsPelanggan() {
  const [nama, setNama] = useState<string>("");
  const [domisili, setDomisili] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("PRIA");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const options = [
    { value: "JAK-UT", label: "JAK-UT" },
    { value: "JAK-BAR", label: "JAK-BAR" },
    { value: "JAK-TIM", label: "JAK-TIM" },
    { value: "JAK-SEL", label: "JAK-SEL" },
  ];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!nama.trim()) newErrors.nama = "Nama wajib diisi";
    if (!domisili) newErrors.domisili = "Domisili wajib dipilih";
    if (!jenisKelamin) newErrors.jenis_kelamin = "Jenis kelamin wajib dipilih";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      await api.post("/pelanggans", {
        nama,
        domisili,
        jenis_kelamin: jenisKelamin,
      });

      setShowAlert(true);

      // reset form
      setNama("");
      setDomisili("");
      setJenisKelamin("PRIA");

      router.push("/kelola-pelanggan?success=1");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      alert("Gagal menambahkan pelanggan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComponentCard title="Form">
      {showAlert && (
        <Alert
          variant="success"
          title="Berhasil!"
          message="Pelanggan berhasil ditambahkan."
          showLink={true}
          linkHref="/kelola-pelanggan"
          linkText="Lihat Daftar"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <Label>Nama</Label>
          <Input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Masukkan nama pelanggan"
          />
          {errors.nama && (
            <p className="mt-1 text-sm text-red-500">{errors.nama}</p>
          )}
        </div>

        <div>
          <Label>Domisili</Label>
          <div className="relative">
            <Select
              options={options}
              placeholder="Pilih domisili anda"
              onChange={(value) => setDomisili(value)}
              className="dark:bg-dark-900"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
          {errors.domisili && (
            <p className="mt-1 text-sm text-red-500">{errors.domisili}</p>
          )}
        </div>

        <div>
          <Label>Jenis Kelamin</Label>
          <div className="flex flex-wrap items-center gap-8 mt-3">
            <Radio
              id="radio1"
              name="jenis_kelamin"
              value="PRIA"
              checked={jenisKelamin === "PRIA"}
              onChange={(val) => setJenisKelamin(val)}
              label="Pria"
            />
            <Radio
              id="radio2"
              name="jenis_kelamin"
              value="WANITA"
              checked={jenisKelamin === "WANITA"}
              onChange={(val) => setJenisKelamin(val)}
              label="Wanita"
            />
          </div>
          {errors.jenis_kelamin && (
            <p className="mt-1 text-sm text-red-500">{errors.jenis_kelamin}</p>
          )}
        </div>

        <Button
          type="submit"
          size="sm"
          variant="primary"
          disabled={loading}
          className="mt-4"
        >
          {loading ? "Menyimpan..." : "Simpan Pelanggan"}
        </Button>
      </form>
    </ComponentCard>
  );
}
