"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Select from "../Select";
import Input from "../input/InputField";
import { ChevronDownIcon } from "../../../icons";
import Button from "../../ui/button/Button";
import { useRouter } from "next/navigation";
import DatePicker from "../date-picker";

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
  const router = useRouter();

  // Fetch pelanggan & barang
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pelangganRes, barangRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/pelanggans"),
          axios.get("http://127.0.0.1:8000/api/barangs"),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi sebelum kirim
    if (!pelangganId || !tgl) {
      alert("Lengkapi tanggal dan pelanggan.");
      return;
    }
    
    if (items.length === 0 || items.some(i => !i.barang_id || !i.qty || i.qty <= 0)) {
      alert("Lengkapi item penjualan (barang & qty).");
      return;
    }

      console.log("Payload dikirim:", {
        tgl,
        pelanggan_id: pelangganId,
        items,
      });
    
    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/api/penjualans", {
        tgl,
        pelanggan_id: pelangganId,
        items,
      });

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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <DatePicker
              id="tgl-penjualan"
              label="Tanggal Penjualan"
              placeholder="Pilih tanggal"
              defaultDate={tgl || undefined}
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              onChange={(selectedDates, dateStr, instance) => {
                setTgl(dateStr); // dateStr = string YYYY-MM-DD
              }}
            />
        </div>

        <div>
          <Label>Pelanggan</Label>
          <div className="relative">
            <Select
              options={pelanggans.map(p => ({ value: p.id.toString(), label: p.nama }))}
              placeholder="Pilih Pelanggan"
              value={pelangganId?.toString() || ""}
              onChange={(value) => setPelangganId(Number(value))}
              className="dark:bg-dark-900"
            />

            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        <div>
          <Label>Items Penjualan</Label>
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <Select
                  options={barangs.map(b => ({ value: b.id.toString(), label: b.nama }))}
                  placeholder="Pilih Barang"
                  value={item.barang_id?.toString() || ""}
                  onChange={(value) => handleItemChange(idx, "barang_id", Number(value))}
                  className="w-1/2 dark:bg-dark-900"
                />

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
                  className="w-1/4 pl-5"
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveItem(idx)}
                  className="px-2"
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
