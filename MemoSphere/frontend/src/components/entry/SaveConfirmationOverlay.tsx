import { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SaveConfirmationOverlay = ({ 
  isVisible, 
  onComplete 
}: { 
  isVisible: boolean;
  onComplete: () => void;
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <CheckCircle className="w-16 h-16 text-primary animate-pulse" />
            <p className="text-2xl font-semibold text-primary">Entry Saved!</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SaveConfirmationOverlay;