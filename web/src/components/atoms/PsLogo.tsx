import mriLogo from "../../assets/mri-logo.png";

// Logo de branding exibida no painel do menu. Avatar oficial MRI Qbox Brasil
// (servido localmente via import — Vite copia pro html/ no build, sem depender
// de rede externa em runtime na NUI).
export default function PsLogo() {
  return (
    <img
      src={mriLogo}
      alt="MRI Qbox Brasil"
      className="w-full h-auto object-contain rounded-lg"
      draggable={false}
    />
  );
}
