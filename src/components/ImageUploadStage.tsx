import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, UploadCloud, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Label } from './ui/label';
import { useNavigate } from 'react-router-dom';
import { uploadFile } from '@/services/api-client';
import { updateProfessionalImageUrl } from '@/services/profissional/profissional.service';


interface ImageUploadStageProps {
    professionalId: string;
    onClose: () => void;
}

export default function ImageUploadStage({ professionalId, onClose }: ImageUploadStageProps) {
    const navigate = useNavigate()
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setImagePreviewUrl(URL.createObjectURL(file));
            stopCamera();
        } else {
            setSelectedFile(null);
            setImagePreviewUrl(null);
            toast.error("Por favor, selecione um arquivo de imagem válido.");
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("Nenhuma imagem selecionada para upload.");
            return;
        }

        setIsUploading(true);
        try {
            const url = await uploadFile('/upload', selectedFile);
            if (!url) return
            // Atuaizar o dado do profissional !
            await updateProfessionalImageUrl(professionalId, url)
            toast.success("Imagem enviada com sucesso!");
            onClose();
            navigate(`/rh/professional/${professionalId}/details`);
        } catch (error) {
            console.error("Erro ao fazer upload da imagem:", error);
            toast.error("Erro ao enviar a imagem.");
        } finally {
            setIsUploading(false);
            stopCamera(); // Garante que a câmera seja parada
        }
    };

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                setStream(mediaStream);
            }
            setSelectedFile(null); // Limpa o arquivo selecionado se iniciar a câmera
            setImagePreviewUrl(null);
        } catch (err) {
            console.error("Erro ao acessar a câmera:", err);
            toast.error("Não foi possível acessar a câmera. Verifique as permissões.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const takePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
                canvasRef.current.toBlob((blob) => {
                    if (blob) {
                        const photoFile = new File([blob], `profile_photo_${professionalId}.png`, { type: 'image/png' });
                        setSelectedFile(photoFile);
                        setImagePreviewUrl(URL.createObjectURL(photoFile));
                        stopCamera(); // Parar a câmera após tirar a foto
                    }
                }, 'image/png');
            }
        }
    };

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, [stream]);

    return (
        <Card className="max-w-xl mx-auto">
            <CardHeader>
                <CardTitle>Upload da Imagem de Perfil</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Para o profissional: **{professionalId.substring(0, 8)}...**
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Opção de Upload de Arquivo Local */}
                <div className="space-y-2">
                    <Label htmlFor="image-upload">Upload de Arquivo Local</Label>
                    <Input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} />
                </div>

                {/* Opção de Captura de Câmera */}
                <div className="space-y-2">
                    <Button onClick={startCamera} disabled={!!stream} className="w-full">
                        <Camera className="mr-2 h-4 w-4" /> Abrir Câmera
                    </Button>
                    {stream && (
                        <div className="relative mt-4">
                            <video ref={videoRef} autoPlay playsInline className="w-full rounded-md border" />
                            <Button
                                onClick={takePhoto}
                                className="absolute bottom-4 left-1/2 -translate-x-1/2"
                            >
                                <Camera className="mr-2 h-4 w-4" /> Tirar Foto
                            </Button>
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={stopCamera}
                                className="absolute top-2 right-2"
                            >
                                <XCircle className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                    <canvas ref={canvasRef} style={{ display: 'none' }} /> {/* Canvas oculto para captura */}
                </div>

                {/* Pré-visualização da Imagem */}
                {imagePreviewUrl && (
                    <div className="mt-4 text-center">
                        <Label>Pré-visualização:</Label>
                        <img src={imagePreviewUrl} alt="Pré-visualização da Imagem" className="max-w-full h-auto mt-2 mx-auto rounded-md border" />
                    </div>
                )}

                <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                    className="w-full mt-6"
                >
                    {isUploading ? "Enviando..." : <><UploadCloud className="mr-2 h-4 w-4" /> Enviar Imagem</>}
                </Button>
                <Button variant="outline" onClick={onClose} className="w-full mt-2">
                    Cancelar
                </Button>
            </CardContent>
        </Card>
    );
}
