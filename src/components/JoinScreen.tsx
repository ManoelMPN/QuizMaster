import React, { useState } from 'react';
import { motion } from 'motion/react';
import { QrCode, Users, Timer, Link2, Copy } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import QRCodeModal from './QRCodeModal';
import { Participant } from '../types';

interface JoinScreenProps {
  participants: Participant[];
}

export default function JoinScreen({ participants }: JoinScreenProps) {
  const code = "482915";
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const joinUrl = window.location.origin + "/join";

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[640px] text-center space-y-8"
      >
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-sm">
            <div className="size-2 rounded-full bg-primary animate-pulse" />
            Apresentação Ao Vivo
          </div>
          <h1 className="text-white text-5xl md:text-7xl font-extrabold tracking-tight leading-none">
            Entre no <span className="text-primary">Quiz</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-md mx-auto">
            Escaneie o QR Code abaixo para participar
          </p>
        </div>

        <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/10 shadow-2xl shadow-primary/5">
          <div className="flex flex-col items-center gap-6">
            <div 
              onClick={() => setIsQRModalOpen(true)}
              className="bg-white p-4 rounded-2xl cursor-pointer hover:scale-105 transition-transform shadow-2xl shadow-primary/10 w-full max-w-[240px] aspect-square flex items-center justify-center"
            >
              <QRCodeSVG 
                value={joinUrl} 
                size={200} 
                level="H"
                includeMargin={false}
                fgColor="#151022"
                className="w-full h-full"
              />
            </div>
            <button 
              onClick={() => setIsQRModalOpen(true)}
              className="flex items-center justify-center gap-2 px-8 h-14 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              <QrCode size={20} />
              <span>Ver QR Code Ampliado</span>
            </button>
          </div>
        </div>

        <div className="pt-6">
          <div className="flex items-center justify-center -space-x-3 mb-4">
            {participants.slice(0, 5).map((p) => (
              <div key={p.id} className="size-12 rounded-full border-2 border-[#151022] bg-slate-800 flex items-center justify-center text-2xl shadow-lg">
                {p.name.split(' ')[0]}
              </div>
            ))}
            {participants.length > 5 && (
              <div className="size-12 rounded-full border-2 border-[#151022] bg-primary flex items-center justify-center text-xs font-bold text-white shadow-lg">
                +{participants.length - 5}
              </div>
            )}
            {participants.length === 0 && (
              <div className="size-12 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-700">
                <Users size={20} />
              </div>
            )}
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
            {participants.length === 0 ? 'Aguardando primeiro participante...' : `${participants.length} participantes conectados`}
          </p>
        </div>
      </motion.div>

      <QRCodeModal 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)} 
        url={joinUrl} 
      />

      <footer className="w-full max-w-7xl mx-auto mt-auto px-6 py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-primary" />
            {participants.length} Entraram
          </div>
          <div className="flex items-center gap-2">
            <Timer size={18} className="text-primary" />
            Aguardando Início
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-500">Compartilhar:</span>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg bg-slate-800 text-slate-500 hover:text-primary transition-colors">
              <Link2 size={20} />
            </button>
            <button className="p-2 rounded-lg bg-slate-800 text-slate-500 hover:text-primary transition-colors">
              <Copy size={20} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
