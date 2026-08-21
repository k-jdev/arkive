"use client";

import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("@/components/shared/pdf-viewer"), {
  ssr: false,
});

interface PdfViewerClientProps {
  file: string;
  title?: string;
}

export default function PdfViewerClient({ file, title }: PdfViewerClientProps) {
  return <PdfViewer file={file} title={title} />;
}
