"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import { ChevronDownIcon } from "../../../icons";
import Radio from "../input/Radio";
import Button from "../../ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
}

export default function DefaultInputsUbahPelanggan({ id }: Props) {
  const [nama, setNama] = useState("");
  const [domisili, setDomisili] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("PRIA");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();

  const options = [
    { value: "JAK-UT", label: "JAK-UT" },
    { value: "JAK-BAR", label: "JAK-BAR" },
    { value: "JAK-TIM", label: "JAK-TIM" },
    { value: "JAK-SEL", label: "JAK-SEL" },
  ];

  // Fetch data existing pelanggan
  useEffect(() => {
    const fetchPelanggan = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/pelanggans/${id}`);
        const data = res.data.data;

        console.log('ppp',data.nama);
        setNama(data.nama);
        setDomisili(data.domisili);
        setJenisKelamin(data.jenis_kelamin);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Error fetching pelanggan:", error.response?.data || error.message);
        alert("Gagal mengambil data pelanggan");
      }
    };

    fetchPelanggan();
  }, [id]);

  // Handle update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`http://127.0.0.1:8000/api/pelanggans/${id}`, {
        nama,
        domisili,
        jenis_kelamin: jenisKelamin,
      });

      setShowAlert(true);

      // Redirect setelah sukses
      router.push("/kelola-pelanggan?updated=1");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      alert("Gagal mengubah pelanggan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComponentCard title="Form Ubah Pelanggan">
      {showAlert && (
        <Alert
          variant="success"
          title="Berhasil!"
          message="Pelanggan berhasil diubah."
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
            required
          />
        </div>

        <div>
          <Label>Domisili</Label>
          <div className="relative">
            <Select
              options={options}
              placeholder="Pilih domisili anda"
              onChange={(value) => setDomisili(value)}
              className="dark:bg-dark-900"
              value={domisili}
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
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
        </div>

        <Button
          type="submit"
          size="sm"
          variant="primary"
          disabled={loading}
          className="mt-4"
        >
          {loading ? "Menyimpan..." : "Update Pelanggan"}
        </Button>
      </form>
    </ComponentCard>
  );
}
