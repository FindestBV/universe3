import { useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Minus, Plus, RotateCcw } from "lucide-react";

const SearchProgress = () => {
  const [progress, setProgress] = useState(0);
  
  const increment = () => {
    setProgress(prev => Math.min(100, prev + 10));
  };
  
  const decrement = () => {
    setProgress(prev => Math.max(0, prev - 10));
  };
  
  const reset = () => {
    setProgress(0);
  };

  return (
    <Card className="w-full max-w-full">
      <CardHeader>
        <CardTitle>Progress Control</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 h-full">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress: {progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
        
        <div className="flex justify-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={decrement}
            disabled={progress === 0}
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={reset}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={increment}
            disabled={progress === 100}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchProgress;