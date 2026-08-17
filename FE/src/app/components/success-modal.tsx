import { CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  platformName: string;
}

export function SuccessModal({ isOpen, onClose, platformName }: SuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] p-8 w-full max-w-[360px] mx-4 text-center"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1, duration: 0.4 }}
              className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-7 h-7 text-green-500" />
            </motion.div>

            <h3 className="text-gray-900 mb-2" style={{ fontSize: "1.125rem", fontWeight: 700 }}>
              Successfully Connected!
            </h3>
            <p className="text-gray-500 mb-8" style={{ fontSize: "0.8125rem", lineHeight: 1.6 }}>
              Your {platformName} account has been linked to Messiq. You can now manage it from your dashboard.
            </p>

            <button
              onClick={onClose}
              className="w-full h-11 bg-[#8B7CF6] hover:bg-[#7C6BEF] text-white rounded-xl transition-colors"
              style={{ fontSize: "0.875rem", fontWeight: 600 }}
            >
              Continue
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
