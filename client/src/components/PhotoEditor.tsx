import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Move, RotateCw, ZoomIn, ZoomOut, Check, X } from "lucide-react";

interface PhotoEditorProps {
  imageUrl: string;
  onSave: (editedImageUrl: string) => void;
  onCancel: () => void;
}

export default function PhotoEditor({ imageUrl, onSave, onCancel }: PhotoEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImage(img);
      drawImage(img, 1, { x: 0, y: 0 }, 0);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const drawImage = (img: HTMLImageElement, scaleValue: number, pos: { x: number, y: number }, rotationValue: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Definir tamanho do canvas (quadrado para foto de perfil)
    canvas.width = 400;
    canvas.height = 400;

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Salvar estado do contexto
    ctx.save();

    // Centralizar o ponto de transformação
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Aplicar rotação
    ctx.rotate((rotationValue * Math.PI) / 180);
    
    // Aplicar escala e posição
    ctx.scale(scaleValue, scaleValue);
    ctx.translate(pos.x, pos.y);

    // Calcular dimensões da imagem para manter proporção
    const aspectRatio = img.width / img.height;
    let drawWidth = canvas.width;
    let drawHeight = canvas.height;

    if (aspectRatio > 1) {
      // Imagem mais larga que alta
      drawHeight = drawWidth / aspectRatio;
    } else {
      // Imagem mais alta que larga
      drawWidth = drawHeight * aspectRatio;
    }

    // Desenhar imagem centralizada
    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

    // Restaurar estado do contexto
    ctx.restore();
  };

  useEffect(() => {
    if (image) {
      drawImage(image, scale, position, rotation);
    }
  }, [image, scale, position, rotation]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleScaleChange = (newScale: number[]) => {
    setScale(newScale[0] || 1);
  };

  const handleRotationChange = (newRotation: number[]) => {
    setRotation(newRotation[0] || 0);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Converter canvas para blob
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        onSave(url);
      }
    }, 'image/jpeg', 0.9);
  };

  const resetAdjustments = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-white hover:bg-white/20"
        >
          <X className="w-5 h-5" />
        </Button>
        
        <h2 className="text-white font-bold text-lg">Editar Foto</h2>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className="text-white hover:bg-white/20"
        >
          <Check className="w-5 h-5" />
        </Button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="border-2 border-white/30 rounded-2xl cursor-move bg-white/5"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          
          {/* Guias visuais */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Linha central vertical */}
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/30 transform -translate-x-1/2"></div>
            {/* Linha central horizontal */}
            <div className="absolute left-0 right-0 top-1/2 h-px bg-white/30 transform -translate-y-1/2"></div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="bg-white/10 backdrop-blur-lg p-6 space-y-6">
        {/* Zoom */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-white font-medium flex items-center">
              <ZoomIn className="w-4 h-4 mr-2" />
              Zoom
            </label>
            <span className="text-white/70 text-sm">{(scale * 100).toFixed(0)}%</span>
          </div>
          <Slider
            value={[scale]}
            onValueChange={handleScaleChange}
            min={0.5}
            max={3}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Rotação */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-white font-medium flex items-center">
              <RotateCw className="w-4 h-4 mr-2" />
              Rotação
            </label>
            <span className="text-white/70 text-sm">{rotation}°</span>
          </div>
          <Slider
            value={[rotation]}
            onValueChange={handleRotationChange}
            min={-180}
            max={180}
            step={1}
            className="w-full"
          />
        </div>

        {/* Botões de ação */}
        <div className="flex space-x-4">
          <Button
            onClick={resetAdjustments}
            variant="outline"
            className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            Resetar
          </Button>
          
          <Button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
          >
            Salvar Alterações
          </Button>
        </div>

        {/* Dicas */}
        <div className="text-center">
          <p className="text-white/60 text-sm flex items-center justify-center">
            <Move className="w-4 h-4 mr-2" />
            Arraste para mover • Use os controles para ajustar
          </p>
        </div>
      </div>
    </div>
  );
}