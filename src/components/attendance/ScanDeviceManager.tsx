import { useState, useEffect } from "react";
import { toast } from "sonner";

export const useScanDevice = () => {
  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo | null>(null);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");
        const rearCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes("back") || 
          device.label.toLowerCase().includes("arrière")
        );
        setSelectedDevice(rearCamera || videoDevices[0]);
      } catch (error) {
        console.error("Error getting devices:", error);
        toast.error("Erreur lors de l'accès aux périphériques");
      }
    };

    getDevices();
  }, []);

  return { selectedDevice };
};