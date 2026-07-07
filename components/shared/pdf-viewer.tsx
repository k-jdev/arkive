"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion, AnimatePresence } from "motion/react";
import "@/styles/pdf-overrides.css";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiZoomInLine,
  RiZoomOutLine,
  RiFullscreenLine,
  RiFullscreenExitLine,
} from "@remixicon/react";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface PdfViewerProps {
  file: string;
  title?: string;
}

export default function PdfViewer({ file, title }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [containerWidth, setContainerWidth] = useState(0);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageAreaRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  const goToPrevPage = useCallback(() => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  }, [numPages]);

  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  }, []);

  const zoomOut = useCallback(() => {
    const next = Math.max(zoom - 0.25, 0.5);
    setZoom(next);
    if (next <= 1.33) {
      setPanX(0);
      setPanY(0);
    }
  }, [zoom]);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Track container width
  useEffect(() => {
    const el = pageAreaRef.current;
    if (!el) return;

    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentBoxSize[0]?.inlineSize ?? 0;
        if (w > 0) setContainerWidth(w);
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goToPrevPage();
      } else if (
        e.key === "ArrowRight" ||
        e.key === " " ||
        e.key === "PageDown"
      ) {
        e.preventDefault();
        goToNextPage();
      } else if (e.key === "Escape") {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        zoomIn();
      } else if (e.key === "-") {
        e.preventDefault();
        zoomOut();
      } else if (e.key === "0") {
        e.preventDefault();
        resetZoom();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goToPrevPage, goToNextPage, zoomIn, zoomOut, resetZoom]);

  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  // Derived layout values
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  const margin = containerWidth <= 480 ? 24 : 48;
  const baseScale = 0.75;
  const displayWidth =
    containerWidth > 0
      ? Math.round(Math.max(containerWidth - margin, 200) * zoom * baseScale)
      : 0;
  const renderWidth = displayWidth > 0 ? Math.round(displayWidth * dpr) : 0;

  // Pointer events for drag-to-pan
  const [isPanning, setIsPanning] = useState(false);
  const pageTransform = displayWidth > containerWidth;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!pageTransform) return;
      isDragging.current = true;
      setIsPanning(true);
      lastPointer.current = { x: e.clientX, y: e.clientY };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [pageTransform],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };

      const excessX = (displayWidth - containerWidth) / 2;
      const excessY = excessX * 1.4;

      setPanX((prev) => Math.max(-excessX, Math.min(excessX, prev + dx)));
      setPanY((prev) => Math.max(-excessY, Math.min(excessY, prev + dy)));
    },
    [containerWidth, displayWidth],
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
    setIsPanning(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col h-screen h-dvh select-none pt-12"
      style={{ backgroundColor: "#18191B" }}
    >
      {/* Top bar */}
      <div
        className="sticky top-12 z-40 backdrop-blur-md"
        style={{ backgroundColor: "rgba(24,25,27,0.9)" }}
      >
        <div className="max-w-360 mx-auto flex items-center justify-between px-[clamp(16px,4.17vw,80px)] py-4">
          <div className="flex items-center gap-3">
            {title && (
              <span className="text-sm text-white/60 font-medium truncate max-w-50">
                {title}
              </span>
            )}
            <span className="text-xs text-white/30">
              {loading ? "—" : `${pageNumber} / ${numPages}`}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={zoomOut}
              disabled={zoom <= 0.5}
              className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 disabled:opacity-20 transition-colors"
              aria-label="Zoom out"
            >
              <RiZoomOutLine size={18} />
            </button>
            <button
              onClick={resetZoom}
              className="text-xs text-white/40 w-10 text-center tabular-nums hover:text-white/70 transition-colors"
              aria-label="Reset zoom"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={zoomIn}
              disabled={zoom >= 3}
              className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 disabled:opacity-20 transition-colors"
              aria-label="Zoom in"
            >
              <RiZoomInLine size={18} />
            </button>

            <div className="w-px h-5 bg-white/10 mx-1" />

            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors"
              aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <RiFullscreenExitLine size={18} />
              ) : (
                <RiFullscreenLine size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="w-full max-w-360 mx-auto px-[clamp(16px,4.17vw,80px)] flex-1 flex flex-col">
        <div
          ref={pageAreaRef}
          className="flex-1 flex flex-col items-center justify-center overflow-auto w-full"
        >
          {loading && (
            <div className="flex items-center justify-center py-32">
              <div className="flex flex-col items-center gap-4">
                <div className="size-8 rounded-full border-2 border-white/10 border-t-blue-500 animate-spin" />
                <p className="text-sm text-white/30">Loading PDF…</p>
              </div>
            </div>
          )}

          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={null}
            error={
              <div className="flex items-center justify-center py-32">
                <p className="text-sm text-red-400/80">
                  Failed to load PDF. Please try again.
                </p>
              </div>
            }
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={pageNumber}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className={[
                  "flex justify-center w-full max-w-full",
                  pageTransform ? "cursor-grab active:cursor-grabbing" : "",
                ].join(" ")}
                style={{
                  transform: pageTransform
                    ? `translate(${panX}px, ${panY}px)`
                    : undefined,
                  touchAction: pageTransform ? "none" : undefined,
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                {renderWidth > 0 && displayWidth > 0 && (
                  <div
                    style={{
                      width: displayWidth,
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        transform: `scale(${displayWidth / renderWidth})`,
                        transformOrigin: "top left",
                        width: renderWidth,
                        lineHeight: 0,
                      }}
                    >
                      <Page
                        pageNumber={pageNumber}
                        width={renderWidth}
                        renderTextLayer={false}
                        renderAnnotationLayer={true}
                        className="shadow-2xl rounded-sm overflow-hidden"
                        loading={null}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </Document>
        </div>
      </div>

      {/* Bottom nav bar */}
      <div
        className="sticky bottom-0 backdrop-blur-md border-t border-white/5"
        style={{ backgroundColor: "rgba(24,25,27,0.9)" }}
      >
        <div className="max-w-360 mx-auto flex items-center justify-center gap-4 px-[clamp(16px,4.17vw,80px)] py-2">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:hover:bg-transparent transition-all"
            aria-label="Previous page"
          >
            <RiArrowLeftSLine size={20} />
            <span className="text-sm hidden sm:inline">Previous</span>
          </button>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={pageNumber}
              min={1}
              max={numPages || 1}
              onChange={(e) => {
                const val = Math.min(
                  Math.max(Number(e.target.value) || 1, 1),
                  numPages,
                );
                setPageNumber(val);
              }}
              className="w-12 h-8 bg-white/5 border border-white/10 rounded-md text-center text-sm text-white/80 tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:border-blue-500/50"
            />
            <span className="text-sm text-white/30">/ {numPages}</span>
          </div>

          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:hover:bg-transparent transition-all"
            aria-label="Next page"
          >
            <span className="text-sm hidden sm:inline">Next</span>
            <RiArrowRightSLine size={20} />
          </button>

          <div className="w-px h-5 bg-white/10 mx-1" />

          <a
            href={file}
            download
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
            aria-label="Download PDF"
          >
            <span className="text-sm">Download</span>
          </a>
        </div>
      </div>
    </div>
  );
}
