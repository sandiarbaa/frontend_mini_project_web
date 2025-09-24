"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Link from "next/link";

import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { useModal } from "@/hooks/useModal";

interface ApiResponse {
  statusCode: number;
  status: string;
  message: string;
  data: Pelanggan[];
}

interface Pelanggan {
  id: number;
  nama: string;
  domisili: string;
  jenis_kelamin: string;
  created_at: string;
}

export default function PelangganTable({ onDeleteSuccess }: { onDeleteSuccess: () => void }) {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { isOpen, openModal, closeModal } = useModal();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchPelanggans = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/pelanggans");
      setResponse(res.data);
    } catch (error) {
      console.error("Gagal fetch pelanggan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPelanggans();
  }, []);

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/pelanggans/${selectedId}`);
      fetchPelanggans();
      closeModal();
      onDeleteSuccess(); // 🔹 kasih tau parent kalau delete sukses
    } catch (error) {
      console.error("Gagal hapus pelanggan:", error);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading data...</p>;
  }

  const columns: string[] = [
    "ID Pelanggan",
    "Nama",
    "Domisili",
    "Jenis Kelamin",
    "Aksi",
  ];

  return (
    <>
      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] mt-4">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {columns.map((col) => (
                    <TableCell
                      key={col}
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400"
                    >
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {response?.data.length ? (
                  response.data.map((p, index) => (
                    <TableRow key={p.id}>
                      <TableCell className="px-4 py-3 dark:text-white">{index + 1}</TableCell>
                      <TableCell className="px-4 py-3 dark:text-white">{p.nama}</TableCell>
                      <TableCell className="px-4 py-3 dark:text-white">{p.domisili}</TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          size="sm"
                          color={p.jenis_kelamin === "PRIA" ? "success" : "warning"}
                        >
                          {p.jenis_kelamin}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 flex gap-2">
                        <Link
                          href={`/kelola-pelanggan/ubah-pelanggan/${p.id}`}
                          className="px-3 py-1 rounded-md bg-blue-500 text-white text-xs hover:bg-blue-600"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedId(p.id);
                            openModal();
                          }}
                          className="px-3 py-1 rounded-md bg-red-500 text-white text-xs hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      Tidak ada data pelanggan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Delete */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[500px] p-5 lg:p-8"
      >
        <h4 className="font-semibold text-gray-800 mb-4 text-title-sm dark:text-white/90">
          Konfirmasi Hapus
        </h4>
        <p className="text-md leading-6 text-gray-500 dark:text-gray-400">
          Apakah kamu yakin ingin menghapus pelanggan ini?
        </p>
        <div className="flex items-center justify-end w-full gap-3 mt-8">
          <Button size="sm" variant="outline" onClick={closeModal}>
            Batal
          </Button>
          <Button size="sm" variant="danger" onClick={handleDelete}>
            Hapus
          </Button>
        </div>
      </Modal>
    </>
  );
}
