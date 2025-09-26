import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DefaultInputsUbahPenjualan from "@/components/form/form-elements/DefaultInputsUbahPenjualan";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ubah Penjualan | TailAdmin",
  description: "Form ubah penjualan",
};

interface Props {
  params: {
    id: string;
  };
}

export default function UbahPenjualanPage({ params }: Props) {
  return (
    <div>
      <PageBreadcrumb pageTitle="Ubah Penjualan" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1 px-20">
        <div className="space-y-6">
          <DefaultInputsUbahPenjualan id={params.id} />
        </div>
      </div>
    </div>
  );
}
