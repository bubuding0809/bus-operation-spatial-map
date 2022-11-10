import { useEffect, useMemo, useState } from "react";

const colorArrayHex = [
  "#FF0000",
  "#0000FF",
  "#008000",
  "#FFFF00",
  "#FFA500",
  "#800080",
  "#FFC0CB",
  "#A52A2A",
  "#808080",
  "#000000",
];

const useColorMap = (data: any, column: string) => {
  const [colorMap, setColorMap] = useState<Map<string, string>>(new Map());
  useEffect(() => {
    const colorMap = new Map<string, string>();
    let i = 0;
    data.forEach((item: any, index: number) => {
      if (!colorMap.has(item[column])) {
        colorMap.set(item[column], colorArrayHex[i]!);
        i++;
      }
    });
    setColorMap(colorMap);
  }, [data, column]);

  return colorMap;
};

export default useColorMap;
