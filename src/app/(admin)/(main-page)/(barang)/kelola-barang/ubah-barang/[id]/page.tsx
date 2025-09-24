import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DefaultInputsUbahBarang from "@/components/form/form-elements/DefaultInputsUbahBarang";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ubah Barang | TailAdmin",
  description: "Form ubah barang",
};

interface Props {
  params: {
    id: string;
  };
}

export default function UbahBarangPage({ params }: Props) {
  return (
    <div>
      <PageBreadcrumb pageTitle="Ubah Barang" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1 px-20">
        <div className="space-y-6">
          <DefaultInputsUbahBarang id={params.id} />
        </div>
      </div>
    </div>
  );
}
