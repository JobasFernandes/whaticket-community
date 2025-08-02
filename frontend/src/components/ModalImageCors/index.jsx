import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ZoomIn,
  ZoomOut,
  Download,
  RotateCw,
  RotateCcw
} from "lucide-react";
import api from "../../services/api.js";

const ModalImageCors = ({ imageUrl }) => {
  const [open, setOpen] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [blobUrl, setBlobUrl] = useState("");
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [error, setError] = useState(false);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (!imageUrl) {
      setError(true);
      setFetching(false);
      return;
    }

    const isMountedRef = { current: true };
    let currentBlobUrl = null;

    const fetchImage = async () => {
      try {
        const { data, headers } = await api.get(imageUrl, {
          responseType: "blob"
        });

        if (isMountedRef.current) {
          const url = window.URL.createObjectURL(
            new Blob([data], { type: headers["content-type"] })
          );
          currentBlobUrl = url;
          setBlobUrl(url);
          setError(false);
        }
      } catch (err) {
        console.error("Erro ao carregar imagem:", err);
        if (isMountedRef.current) {
          setError(true);
        }
      } finally {
        if (isMountedRef.current) {
          setFetching(false);
        }
      }
    };

    fetchImage();

    return () => {
      isMountedRef.current = false;
      if (currentBlobUrl) {
        window.URL.revokeObjectURL(currentBlobUrl);
      }
    };
  }, [imageUrl]);

  // Reset position when zoom is 1
  useEffect(() => {
    if (zoom === 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [zoom]);

  // Handle ESC key
  useEffect(() => {
    const handleEscKey = event => {
      if (event.key === "Escape" && open) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    setIsDragging(false);
  };

  const handleZoomIn = e => {
    e?.stopPropagation();
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = e => {
    e?.stopPropagation();
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.25, 0.5);
      if (newZoom <= 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const handleRotateLeft = e => {
    e?.stopPropagation();
    setRotation(prev => (prev - 90) % 360);
  };

  const handleRotateRight = e => {
    e?.stopPropagation();
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDoubleClick = e => {
    e.stopPropagation();
    if (zoom > 1) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setZoom(2);
    }
  };

  const handleContainerClick = e => {
    if (e.target === containerRef.current) {
      handleClose();
    }
  };

  const handleMouseDown = e => {
    if (zoom > 1) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = e => {
    if (isDragging && zoom > 1) {
      e.preventDefault();
      e.stopPropagation();

      const imgElement = imageRef.current;
      if (!imgElement) return;

      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Calculate boundaries based on zoom level
      const boundaryX =
        (imgElement.offsetWidth * zoom - imgElement.offsetWidth) / 2;
      const boundaryY =
        (imgElement.offsetHeight * zoom - imgElement.offsetHeight) / 2;

      const limitedX = Math.min(Math.max(newX, -boundaryX), boundaryX);
      const limitedY = Math.min(Math.max(newY, -boundaryY), boundaryY);

      setPosition({ x: limitedX, y: limitedY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = e => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const imageToShow = fetching ? imageUrl : blobUrl;

  const modalContent = open && (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-[2px] flex flex-col z-[999999]">
      {/* Image Container */}
      <div
        ref={containerRef}
        className="flex justify-center items-center flex-1 w-full h-full relative overflow-hidden"
        onClick={handleContainerClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors backdrop-blur-sm border border-white/20 z-[1000000]"
        >
          <X size={24} className="text-white" />
        </button>

        {/* Main Image */}
        <img
          ref={imageRef}
          src={imageToShow}
          alt="Imagem ampliada"
          className={`max-w-[90%] max-h-[85%] object-contain select-none touch-none ${
            zoom > 1
              ? isDragging
                ? "cursor-grabbing"
                : "cursor-grab"
              : "cursor-pointer"
          }`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
            transition: isDragging ? "none" : "transform 0.3s ease"
          }}
          onClick={e => e.stopPropagation()}
          onDoubleClick={handleDoubleClick}
          onMouseDown={handleMouseDown}
          draggable={false}
        />
      </div>

      {/* Action Bar */}
      <div className="flex justify-center items-center p-4 bg-black/70 mt-auto z-[1000]">
        <div className="flex gap-2">
          {/* Rotate Left */}
          <button
            onClick={handleRotateLeft}
            className="p-3 bg-black/30 hover:bg-black/50 rounded-full transition-colors text-white"
            title="Girar para esquerda"
          >
            <RotateCcw size={20} />
          </button>

          {/* Rotate Right */}
          <button
            onClick={handleRotateRight}
            className="p-3 bg-black/30 hover:bg-black/50 rounded-full transition-colors text-white"
            title="Girar para direita"
          >
            <RotateCw size={20} />
          </button>

          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            className="p-3 bg-black/30 hover:bg-black/50 rounded-full transition-colors text-white"
            title="Aumentar zoom"
          >
            <ZoomIn size={20} />
          </button>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            className="p-3 bg-black/30 hover:bg-black/50 rounded-full transition-colors text-white"
            title="Diminuir zoom"
          >
            <ZoomOut size={20} />
          </button>

          {/* Download */}
          <a
            href={imageToShow}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-black/30 hover:bg-black/50 rounded-full transition-colors text-white"
            title="Baixar"
          >
            <Download size={20} />
          </a>
        </div>
      </div>
    </div>
  );

  if (error || !imageUrl) {
    return (
      <div className="w-64 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Erro ao carregar imagem</span>
      </div>
    );
  }

  return (
    <>
      {/* Thumbnail Image */}
      <div className="relative cursor-pointer group" onClick={handleOpen}>
        <img
          src={imageToShow}
          alt="image"
          className="object-cover w-64 h-48 rounded-lg"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
          <ZoomIn size={24} className="text-white drop-shadow-lg" />
        </div>
      </div>

      {/* Full Screen Modal - Rendered via Portal */}
      {modalContent && createPortal(modalContent, document.body)}
    </>
  );
};

export default ModalImageCors;
