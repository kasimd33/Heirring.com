import { useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { useRef } from "react";

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export default function AnimatedCounter({
  value,
  duration = 1.5,
  decimals = 0,
  suffix = "",
  prefix = "",
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);

  const num = typeof value === "string" ? parseFloat(value.replace(/[^0-9.]/g, "")) : value;
  const isNumber = !isNaN(num);
  const extra = typeof value === "string" && !isNumber ? value : "";

  useEffect(() => {
    if (!isInView) return;
    if (!isNumber) {
      setDisplay(value);
      return;
    }

    const startTime = performance.now();
    const startValue = 0;

    const update = (now) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      const current = startValue + (num - startValue) * eased;
      setDisplay(decimals > 0 ? current.toFixed(decimals) : Math.floor(current));

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setDisplay(decimals > 0 ? num.toFixed(decimals) : num);
      }
    };

    requestAnimationFrame(update);
  }, [isInView, num, duration, decimals, isNumber, value]);

  if (!isNumber) {
    return <span ref={ref}>{extra || value}</span>;
  }

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
