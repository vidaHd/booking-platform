import type { InputProps } from "./input.type";
import { motion } from "framer-motion";

import "./input.scss";

const InputUI = ({
  onClick,
  variant,
  type,
  placeholder,
  value,
  onChange,
}: InputProps) => {
  return (
    <motion.input
      className={`input input-${variant}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
};

export default InputUI;
