import React, { forwardRef, ButtonHTMLAttributes } from "react";
import { Link } from "react-router-dom";

type ButtonProps = {
  to?: string;
  variant?: "primary" | "ghost";
} & ButtonHTMLAttributes<HTMLButtonElement>;

const base = "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
const variants: Record<string, string> = {
  primary: "bg-inbec-blue-light hover:bg-inbec-blue-dark text-white focus:ring-inbec-blue-light",
  ghost: "bg-white/5 hover:bg-white/10 text-white",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ to, variant = "primary", className = "", children, ...rest }, ref) => {
  const classes = `${base} ${variants[variant] ?? variants.primary} ${className}`;
  if (to) {
    return (
      <Link to={to} className={classes} aria-label={rest["aria-label"]}>
        {children}
      </Link>
    );
  }
  return (
    <button ref={ref} className={classes} {...rest}>
      {children}
    </button>
  );
});

Button.displayName = "Button";
export default Button;