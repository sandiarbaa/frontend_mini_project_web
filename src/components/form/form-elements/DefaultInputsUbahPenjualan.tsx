"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Select from "../Select";
import Input from "../input/InputField";
import { ChevronDownIcon } from "../../../icons";
import Button from "../../ui/button/Button";
import DatePicker from "../date-picker";
import Alert from "@/components/ui/alert/Alert";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
}

interface Pelanggan {
  id: number;
  nama: string;
}

interface Barang {
  id: number;
  nama: string;
}

interface ItemPenjualan {
  barang_id: number;
  qty: number;
}

export default function DefaultInputsUbahPenjualan({ id }: Props) {
  const [tgl, setTgl] = useState("");
  const [pelangganId, setPelangganId] = useState<number | null>(null);
  const [items, setItems] = useState<{ barang_id: number | null; qty: number; qtyInput?: string }[]>([]);
  const [pelanggans, setPelanggans] = useState<Pelanggan[]>([]);
  const [barangs, setBarangs] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();

  // Fetch data existing penjualan + dropdown pelanggan/barang
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [penjualanRes, pelangganRes, barangRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/penjualans/${id}`),
          axios.get("http://127.0.0.1:8000/api/pelanggans"),
          axios.get("http://127.0.0.1:8000/api/barangs"),
        ]);

        const penjualan = penjualanRes.data.data;
        setTgl(penjualan.tgl);
        setPelangganId(penjualan.pelanggan_id);

        setItems(
          penjualan.item_penjualans?.length
            ? penjualan.item_penjualans.map((i: ItemPenjualan) => ({
                barang_id: i.barang_id,
                qty: i.qty,
                qtyInput: String(i.qty),
              }))
            : [{ barang_id: null, qty: 1, qtyInput: "1" }]
        );

        setPelanggans(pelangganRes.data.data || []);
        setBarangs(barangRes.data.data || []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Error fetching penjualan:", error.response?.data || error.message);
        alert("Gagal mengambil data penjualan");
      }
    };

    fetchData();
  }, [id]);

  const handleAddItem = () => {
    setItems([...items, { barang_id: null, qty: 1, qtyInput: "1" }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemChange = (
    index: number,
    field: "barang_id" | "qty" | "qtyInput",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
  ) => {
    const newItems = [...items];
    if (field === "qty") {
      newItems[index].qty = Number(value);
      newItems[index].qtyInput = String(value);
    } else if (field === "qtyInput") {
      newItems[index].qtyInput = value;
    } else {
      newItems[index][field] = value;
    }
    setItems(newItems);
  };

  // Handle update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pelangganId || !tgl) {
      alert("Lengkapi tanggal dan pelanggan.");
      return;
    }
    if (items.length === 0 || items.some(i => !i.barang_id || !i.qtyInput || Number(i.qtyInput) <= 0)) {
      alert("Lengkapi item penjualan (barang & qty).");
      return;
    }

    setLoading(true);
    try {
      await axios.put(`http://127.0.0.1:8000/api/penjualans/${id}`, {
        tgl,
        pelanggan_id: pelangganId,
        items: items.map(i => ({
          barang_id: i.barang_id,
          qty: Number(i.qtyInput),
        })),
      });

      setShowAlert(true);
      router.push("/kelola-penjualan?updated=1");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error updating penjualan:", error.response?.data || error.message);
      alert("Gagal mengubah penjualan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComponentCard title="Form Ubah Penjualan">
      {showAlert && (
        <Alert
          variant="success"
          title="Berhasil!"
          message="Penjualan berhasil diubah."
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
                  value={item.barang_id ? item.barang_id.toString() : ""}
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
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleAddItem}
            className="mt-2"
          >
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
          {loading ? "Menyimpan..." : "Update Penjualan"}
        </Button>
      </form>
    </ComponentCard>
  );
}
