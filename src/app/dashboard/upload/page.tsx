// src/app/dashboard/upload/page.tsx
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";

export default function UploadPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Lengkapi Data Diri</h1>

      {/* Pakai lagi komponen yang tadi! */}
      <Input label="Nama Lengkap" placeholder="Masukkan nama..." />
      <Input label="Posisi yang Dilamar" placeholder="Contoh: Web Developer" />

      <div className="flex gap-3">
        {/* Tombol dengan variant berbeda */}
        <Button variant="outline">Batal</Button>
        <Button>Simpan Data</Button>
      </div>
    </div>
  );
}
