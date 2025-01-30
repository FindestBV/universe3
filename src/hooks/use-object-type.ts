import { type ObjectTypeName, ObjectTypes, type ObjectTypeValue } from "@/types/types";

import { useMemo } from "react";

export function useObjectType(typeValue: ObjectTypeValue) {
  const typeName = useMemo(() => {
    const entry = Object.entries(ObjectTypes).find(([_, value]) => value === typeValue);
    return entry ? (entry[0] as ObjectTypeName) : "Unknown";
  }, [typeValue]);

  return {
    typeName,
    isDocument: typeValue === ObjectTypes.Document,
    isStudy: typeValue === ObjectTypes.Study,
    // Add more helpful predicates as needed
  };
}

export default useObjectType;
