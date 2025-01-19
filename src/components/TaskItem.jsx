import {
  CheckCircleIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const ParticleEffect = () => {
  const particles = [...Array(12)].map((_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const radius = Math.random() * 100 + 50;
    const delay = Math.random() * 0.2;
    
    const colors = [
      'bg-amber-200',
      'bg-amber-300',
      'bg-green-200',
      'bg-green-300',
      'bg-neutral-200',
      'bg-neutral-300'
    ];
    
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      rotation: Math.random() * 720 - 360,
      scale: Math.random() * 0.8 + 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: 0, 
            y: 0, 
            scale: 0.2,
            opacity: 1,
            rotate: 0 
          }}
          animate={{ 
            x: particle.x, 
            y: particle.y, 
            scale: [0.2, particle.scale, 0],
            opacity: [1, 1, 0],
            rotate: particle.rotation
          }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut",
            times: [0, 0.6, 1],
            delay: particle.delay
          }}
          className={`absolute left-1/2 top-1/2 w-3 h-3 ${particle.color} rounded-full shadow-sm`}
        />
      ))}
    </div>
  );
};

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onEdit,
  difficultyLevel,
}) {
  const level = difficultyLevel || { color: "bg-gray-200", label: "Unknown" };
  const [isDeleting, setIsDeleting] = useState(false);

  const handleTaskComplete = () => {
    if (!task.completed) {
      setIsDeleting(true);
      onToggle(task.id, new Date().toISOString());
      setTimeout(() => onDelete(task.id), 800);
    }
  };

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.2,
            ease: "easeOut"
          }
        }}
        exit={{
          opacity: 0,
          scale: 0.95,
          transition: { 
            duration: 0.15,
            ease: "easeIn"
          }
        }}
        className="relative flex items-center gap-2 py-2 px-3 hover:bg-neutral-50 rounded-md transition-colors"
      >
        {isDeleting && <ParticleEffect />}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleTaskComplete}
          className={`flex-shrink-0 ${task.completed ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          disabled={task.completed}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <CheckCircleIcon
              className={`w-5 h-5 ${
                task.completed 
                  ? "text-green-500 fill-current" 
                  : "text-neutral-400 hover:text-neutral-500"
              }`}
            />
          </motion.div>
        </motion.button>

        <div className="flex-grow flex items-center gap-2">
          <span className={task.completed ? "line-through text-neutral-400" : ""}>
            {task.content}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${level.color}`}>
            {level.label}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {!task.completed && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit(task.id)}
              className="p-1 hover:bg-neutral-100 rounded"
            >
              <PencilIcon className="w-4 h-4 text-neutral-500" />
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsDeleting(true);
              setTimeout(() => onDelete(task.id), 800);
            }}
            className="p-1 hover:bg-neutral-100 rounded"
          >
            <TrashIcon className="w-4 h-4 text-neutral-500" />
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
