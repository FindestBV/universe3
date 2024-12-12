import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePrevious } from '@/hooks/use-previous';

interface CountBtnProps {
  className?: string;
}

export default function CountBtn({ className }: CountBtnProps) {
  const [count, setCount] = useState(0);

  const prevValue = usePrevious(count);

  console.log('Count Button Prev Value Helper', prevValue);


  return (
    <Button
      onClick={() => setCount((count) => count + 1)}
      className={className}
    >
      Count is: {count}
    </Button>
  );
}
