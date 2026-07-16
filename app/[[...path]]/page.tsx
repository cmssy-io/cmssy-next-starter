import { buildCmssyMetadata, createCmssyPage } from "@cmssy/next/server";
import { cmssy } from "@/cmssy.config";
import { blocks } from "@/cmssy/blocks";
import { CmssyEditor } from "@/cmssy/editor";

type PageProps = { params: Promise<{ path?: string[] }> };

export async function generateMetadata({ params }: PageProps) {
  const { path } = await params;
  return buildCmssyMetadata(cmssy, path);
}

export default createCmssyPage(cmssy, blocks, { editor: CmssyEditor });
