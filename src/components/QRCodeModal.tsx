import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export default function QRCodeModal({ isOpen, onClose, url }: QRCodeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-10 shadow-2xl text-center"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-8">
              <h2 className="text-3xl font-black text-white mb-2">Escaneie para entrar</h2>
              <p className="text-slate-400">Aponte a câmera do seu celular para o código abaixo</p>
            </div>

            <div className="bg-white p-8 rounded-3xl inline-block mb-10 shadow-2xl shadow-primary/20">
              <QRCodeSVG 
                value={url} 
                size={320} 
                level="H"
                includeMargin={false}
                fgColor="#151022"
              />
            </div>

            <div className="flex gap-4">
              <button className="flex-1 h-14 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                <Download size={20} />
                Baixar Código
              </button>
              <button className="flex-1 h-14 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2">
                <Share2 size={20} />
                Compartilhar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
