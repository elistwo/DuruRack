"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";

interface ClientFormattedDateProps {
  dateString: string;
  formatString: string;
}

export const ClientFormattedDate = ({ dateString, formatString }: ClientFormattedDateProps) => {
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const date = new Date(dateString);
      const formatted = format(date, formatString);
      setFormattedDate(formatted);
    } catch (error) {
      console.error("Error formatting date:", error);
      setFormattedDate(dateString);
    }
  }, [dateString, formatString]);

  if (!isClient) {
    return <span>{dateString}</span>;
  }

  return <span>{formattedDate}</span>;
};