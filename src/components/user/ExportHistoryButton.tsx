"use client";

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { mockBooks, mockTransactions } from '@/lib/mockData'; // For demo purposes

export function ExportHistoryButton() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    // Simulate data fetching and CSV generation
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, fetch user's issued books history and donation history from Firestore
      const currentUserId = 'user1'; // Assuming current user ID
      const issuedBooksHistory = mockTransactions.filter(t => t.userId === currentUserId && (t.type === 'issue' || t.type === 'return'));
      const donationHistory = mockBooks.filter(b => b.donatedBy?.userId === currentUserId && (b.status === 'donated_pending_approval' || b.status === 'donated_approved'));

      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Issued Books History
      csvContent += "Issued Books History\n";
      csvContent += "Book Title,Transaction Type,Date,Due Date\n";
      issuedBooksHistory.forEach(item => {
        csvContent += `"${item.bookTitle}","${item.type}","${new Date(item.timestamp).toLocaleDateString()}","${item.dueDate ? new Date(item.dueDate).toLocaleDateString() : ''}"\n`;
      });
      csvContent += "\n";

      // Donation History
      csvContent += "Donation History\n";
      csvContent += "Book Title,Author,Date Submitted,Status\n";
      donationHistory.forEach(item => {
        csvContent += `"${item.title}","${item.author}","${item.donatedBy?.date ? new Date(item.donatedBy.date).toLocaleDateString() : ''}","${item.status}"\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "pes_library_history.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: "Your history has been downloaded as a CSV file.",
      });

    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "Could not export your history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleExport} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <Download className="mr-2 h-5 w-5" />
      )}
      Export My History (CSV)
    </Button>
  );
}
