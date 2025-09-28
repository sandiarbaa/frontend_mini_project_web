"use client";
import React, { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Select from "../Select";
import Input from "../input/InputField";
import { ChevronDownIcon } from "../../../icons";
import Button from "../../ui/button/Button";
import { useRouter } from "next/navigation";
import DatePicker from "../date-picker";
import api from "@/lib/api";
import Alert from "@/components/ui/alert/Alert";

interface Pelanggan {
  id: number;
  nama: string;
}

interface Barang {
  id: number;
  nama: string;
}

export default function DefaultInputsPenjualan() {
  const [tgl, setTgl] = useState("");
  const [pelangganId, setPelangganId] = useState<number | null>(null);
  const [items, setItems] = useState<{ barang_id: number | null; qty: number; qtyInput?: string }[]>([
    { barang_id: null, qty: 1, qtyInput: "1" },
  ]);

  const [pelanggans, setPelanggans] = useState<Pelanggan[]>([]);
  const [barangs, setBarangs] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  // Fetch pelanggan & barang
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pelangganRes, barangRes] = await Promise.all([
          api.get("/pelanggans"),
          api.get("/barangs"),
        ]);
        setPelanggans(pelangganRes.data.data || []);
        setBarangs(barangRes.data.data || []);
      } catch (error) {
        console.error("Gagal fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { barang_id: null, qty: 1, qtyInput: "1" }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return; // jangan hapus kalau tinggal 1
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleItemChange = (index: number, field: "barang_id" | "qty" | "qtyInput", value: any) => {
    const newItems = [...items];
    if (field === "qty") {
      newItems[index].qty = Number(value);
      newItems[index].qtyInput = String(value);
    } else if (field === "qtyInput") {
      newItems[index].qtyInput = value; // string sementara
    } else {
      newItems[index][field] = value;
    }
    setItems(newItems);
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!tgl) newErrors.tgl = "Tanggal wajib diisi";
    if (!pelangganId) newErrors.pelanggan = "Pelanggan wajib dipilih";

    items.forEach((item, idx) => {
      if (!item.barang_id) newErrors[`barang_${idx}`] = "Barang wajib dipilih";
      if (!item.qty || item.qty <= 0) newErrors[`qty_${idx}`] = "Qty wajib lebih dari 0";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      await api.post("/penjualans", {
        tgl,
        pelanggan_id: pelangganId,
        items,
      });

      setShowAlert(true);

      // reset form
      setTgl("");
      setPelangganId(null);
      setItems([{ barang_id: null, qty: 1, qtyInput: "1" }]);

      router.push("/kelola-penjualan?success=1");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Gagal menambahkan penjualan:", error.response?.data || error.message);
      alert("Gagal menambahkan penjualan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComponentCard title="Form Penjualan">
      {showAlert && (
        <Alert
          variant="success"
          title="Berhasil!"
          message="Penjualan berhasil ditambahkan."
          showLink={true}
          linkHref="/kelola-penjualan"
          linkText="Lihat Daftar"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <DatePicker
            id="tgl-penjualan"
            label="Tanggal Penjualan"
            placeholder="Pilih tanggal"
            defaultDate={tgl || undefined}
            onChange={(selectedDates, dateStr) => setTgl(dateStr)}
          />
          {errors.tgl && <p className="mt-1 text-sm text-red-500">{errors.tgl}</p>}
        </div>

        <div>
          <Label>Pelanggan</Label>
          <div className="relative">
            <Select
              options={pelanggans.map((p) => ({ value: p.id.toString(), label: p.nama }))}
              placeholder="Pilih Pelanggan"
              value={pelangganId?.toString() || ""}
              onChange={(value) => setPelangganId(Number(value))}
              className="dark:bg-dark-900"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
          {errors.pelanggan && <p className="mt-1 text-sm text-red-500">{errors.pelanggan}</p>}
        </div>

        <div>
          <Label>Items Penjualan</Label>
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <div className="w-1/2">
                  <Select
                    options={barangs.map((b) => ({ value: b.id.toString(), label: b.nama }))}
                    placeholder="Pilih Barang"
                    value={item.barang_id?.toString() || ""}
                    onChange={(value) => handleItemChange(idx, "barang_id", Number(value))}
                    className="dark:bg-dark-900"
                  />
                  {errors[`barang_${idx}`] && (
                    <p className="mt-1 text-sm text-red-500">{errors[`barang_${idx}`]}</p>
                  )}
                </div>

                <div className="w-1/4">
                  <Input
                    type="number"
                    min={1}
                    value={item.qtyInput ?? ""}
                    onChange={(e) => handleItemChange(idx, "qtyInput", e.target.value)}
                    onBlur={() => {
                      if (item.qtyInput && !isNaN(Number(item.qtyInput))) {
                        handleItemChange(idx, "qty", Number(item.qtyInput));
                      } else {
                        handleItemChange(idx, "qtyInput", "");
                      }
                    }}
                    placeholder="Qty"
                    className="pl-5"
                  />
                  {errors[`qty_${idx}`] && (
                    <p className="mt-1 text-sm text-red-500">{errors[`qty_${idx}`]}</p>
                  )}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveItem(idx)}
                  className="px-2 mt-1"
                >
                  Hapus
                </Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="primary" size="sm" onClick={handleAddItem} className="mt-2">
            Tambah Item
          </Button>
        </div>

        <Button
          type="submit"
          size="sm"
          variant="primary"
          disabled={loading}
          className="mt-4"
        >
          {loading ? "Menyimpan..." : "Simpan Penjualan"}
        </Button>
      </form>
    </ComponentCard>
  );
}
