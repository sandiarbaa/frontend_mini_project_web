"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Select from "../Select";
import Input from "../input/InputField";
import { ChevronDownIcon } from "../../../icons";
import Button from "../../ui/button/Button";
import DatePicker from "../date-picker";
import Alert from "@/components/ui/alert/Alert";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  // Fetch data existing penjualan + dropdown
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [penjualanRes, pelangganRes, barangRes] = await Promise.all([
          api.get(`/penjualans/${id}`),
          api.get("/pelanggans"),
          api.get("/barangs"),
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
            : [{ barang_id: null, qty: 1, qtyInput: "" }]
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
    setItems([...items, { barang_id: null, qty: 1, qtyInput: "" }]);
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

    // Auto validate saat ada perubahan
    validate();
  };

  // Validasi form
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!tgl) newErrors.tgl = "Tanggal wajib diisi";
    if (!pelangganId) newErrors.pelanggan = "Pelanggan wajib dipilih";

    items.forEach((i, idx) => {
      if (!i.barang_id) newErrors[`barang_${idx}`] = "Barang wajib dipilih";
      if (!i.qtyInput || Number(i.qtyInput) <= 0) newErrors[`qty_${idx}`] = "Qty harus lebih dari 0";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      await api.put(`/penjualans/${id}`, {
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
          {errors.tgl && <p className="mt-1 text-sm text-red-500">{errors.tgl}</p>}
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
          {errors.pelanggan && <p className="mt-1 text-sm text-red-500">{errors.pelanggan}</p>}
        </div>

        <div>
          <Label>Items Penjualan</Label>
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <div className="flex-1">
                  <Select
                    options={barangs.map(b => ({ value: b.id.toString(), label: b.nama }))}
                    placeholder="Pilih Barang"
                    value={item.barang_id ? item.barang_id.toString() : ""}
                    onChange={(value) => handleItemChange(idx, "barang_id", Number(value))}
                    className="w-full dark:bg-dark-900"
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
                      validate();
                    }}
                    placeholder="Qty"
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
