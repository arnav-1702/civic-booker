import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Navigation } from "@/components/ui/navigation";
import { useToast } from "@/hooks/use-toast";

// Define interfaces for our data structures
interface Office {
  id: number;
  name: string;
  location: string;
}
interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  capacity: number;
  booked_count: number;
}

export default function TimeSlots() {
  const { officeId } = useParams<{ officeId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [office, setOffice] = useState<Office | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  // State for managing the single confirmation dialog
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!officeId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [officeRes, slotsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/offices/${officeId}`),
          fetch(`http://localhost:5000/api/offices/${officeId}/timeslots`)
        ]);
        const officeData = await officeRes.json();
        const slotsData = await slotsRes.json();
        if (officeData.success) setOffice(officeData.office);
        if (slotsData.success) setSlots(slotsData.timeslots);
      } catch (error) {
        toast({ title: "Error", description: "Could not fetch data.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [officeId, toast]);
  
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const groupedSlots = slots.reduce((acc, slot) => {
    const date = new Date(slot.startTime).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  const handleBookSlot = async () => {
    if (!selectedSlot) {
      toast({ title: "Error", description: "No slot selected.", variant: "destructive" });
      return;
    }
    
    const token = localStorage.getItem("token");
    if (!token) {
        toast({ title: "Authentication Error", description: "Please log in again.", variant: "destructive" });
        return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ timeslotId: selectedSlot.id }),
      });
      const data = await response.json();
      
      setIsDialogOpen(false);

      if (response.ok && data.success) {
        toast({ title: "Booking confirmed!", description: "Your appointment has been successfully booked." });
        navigate('/my-bookings');
      } else {
        toast({ title: "Booking Failed", description: data.message || "An unknown error occurred.", variant: "destructive" });
      }
    } catch (error) {
       setIsDialogOpen(false);
       toast({ title: "Network Error", description: "Could not connect to the server.", variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate('/offices')} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" />Back to Offices</Button>
          <h1 className="text-4xl font-bold">{office?.name || 'Office Details'}</h1>
          <p className="text-muted-foreground">{office?.location}</p>
          
          <div className="mt-8">
            {slots.length === 0 ? (
              <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">No time slots are available for this office at the moment.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedSlots).map(([date, dateSlots]) => (
                  <div key={date}>
                    <h2 className="text-2xl font-semibold">{formatDate(dateSlots[0].startTime)}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {dateSlots.map((slot) => {
                        const remainingSpots = slot.capacity - slot.booked_count;
                        const isFull = remainingSpots <= 0;
                        return (
                          <Card key={slot.id}>
                            <CardHeader>
                              <CardTitle>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</CardTitle>
                              <Badge variant={isFull ? "destructive" : "default"}>{remainingSpots} / {slot.capacity} spots available</Badge>
                            </CardHeader>
                            <CardContent>
                              {/* --- THIS BUTTON NOW OPENS THE SINGLE DIALOG --- */}
                              <Button
                                className="w-full"
                                disabled={isFull}
                                onClick={() => {
                                  setSelectedSlot(slot);
                                  setIsDialogOpen(true);
                                }}>
                                Book This Slot
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- DIALOG IS MOVED OUTSIDE THE LOOP FOR CORRECT BEHAVIOR --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Booking</DialogTitle></DialogHeader>
          {selectedSlot && (
            <div>
              <p className="mb-1"><strong>Office:</strong> {office?.name}</p>
              <p className="mb-1"><strong>Date:</strong> {formatDate(selectedSlot.startTime)}</p>
              <p><strong>Time:</strong> {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}</p>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="button" onClick={handleBookSlot}>Confirm Booking</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}