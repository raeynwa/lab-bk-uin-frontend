import Image from "next/image";
import { Button } from "@/components/ui/button"
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <h1 className="text-3xl font-bold">Lab UIN Banten</h1>
      <Button variant="outline">Button</Button>
      <Button variant="default">Button</Button>
      <Button variant="destructive">Button</Button>
      <Button variant="outline-destructive">Button</Button>
      <Button variant="secondary">Button</Button>
      <Button variant="ghost">Button</Button>
      <Button variant="link">Button</Button>
    </div>
  );
}
