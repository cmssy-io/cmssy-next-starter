import type { ReactNode } from "react";
import { CmssyLayoutSlot } from "@cmssy/next/server";
import { cmssy } from "@/cmssy.config";
import { blocks } from "@/cmssy/blocks";
import { EditableLayout } from "@/cmssy/editable-layout";
import "@/styles/globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CmssyLayoutSlot
          config={cmssy}
          blocks={blocks}
          position="header"
          editable={EditableLayout}
        />
        <main>{children}</main>
        <CmssyLayoutSlot
          config={cmssy}
          blocks={blocks}
          position="footer"
          editable={EditableLayout}
        />
      </body>
    </html>
  );
}
