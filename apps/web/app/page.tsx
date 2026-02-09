"use client";

import Template from "@repo/ui/components/samples/template";
import { Button } from "@repo/ui/components/ui/button";

export default function Home() {
  return (
    <div className="font-sans">
      <Button className="bg-red-500 px-6 font-bold">Test</Button>
      <Template />
    </div>
  );
}
