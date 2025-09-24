import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DefaultInputsUbahPelanggan from "@/components/form/form-elements/DefaultInputsUbahPelanggan";
// import DefaultInputsUbahPelanggan from "@/components/form/form-elements/DefaultInputsUbahPelanggan";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ubah Pelanggan | TailAdmin",
  description: "Form ubah pelanggan",
};

interface Props {
  params: {
    id: string;
  };
}

export default function UbahPelangganPage({ params }: Props) {
  return (
    <div>
      <PageBreadcrumb pageTitle="Ubah Pelanggan" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1 px-20">
        <div className="space-y-6">
          <DefaultInputsUbahPelanggan id={params.id} />
        </div>
      </div>
    </div>
  );
}
