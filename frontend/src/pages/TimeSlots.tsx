import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Calendar, Clock, Users, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
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

  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!officeId) return;
      try {
        // Fetch both office details and its timeslots
        const [officeRes, slotsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/offices/${officeId}`), // We need to create this endpoint
          fetch(`http://localhost:5000/api/offices/${officeId}/timeslots`)
        ]);
        const officeData = await officeRes.json();
        const slotsData = await slotsRes.json();

        if (officeData.success) setOffice(officeData.office);
        if (slotsData.success) setSlots(slotsData.timeslots);

      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({ title: "Error", description: "Could not fetch data.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [officeId, toast]);
  
  // Helper functions to format date and time
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Group slots by date for better UI presentation
  const groupedSlots = slots.reduce((acc, slot) => {
    const date = new Date(slot.startTime).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  const handleBookSlot = async () => {
    if (!selectedSlot) return;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ timeslotId: selectedSlot.id }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast({ title: "Booking confirmed!", description: "Your appointment has been successfully booked." });
        navigate('/my-bookings'); // Or refresh data
      } else {
        toast({ title: "Booking Failed", description: data.message, variant: "destructive" });
      }
    } catch (error) {
       toast({ title: "Network Error", description: "Could not connect to the server.", variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  if (!office) {
    return <div className="text-center p-8">Office not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/30 via-background to-secondary/30">
      <Navigation userType="user" userName="John Doe" />
      <div className="container mx-auto px-4 py-8">
        {/* ... (Your header JSX is good, using the 'office' state variable) ... */}

        {slots.length === 0 ? (
          <div className="text-center py-12">No slots available.</div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedSlots).map(([date, dateSlots]) => (
              <div key={date}>
                <h2 className="text-2xl font-semibold text-foreground mb-4">{formatDate(dateSlots[0].startTime)}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dateSlots.map((slot) => {
                    const remainingSpots = slot.capacity - slot.booked_count;
                    const isFull = remainingSpots <= 0;
                    return (
                      <Card key={slot.id} className={isFull ? 'opacity-50' : 'hover:shadow-lg'}>
                        <CardHeader>
                          <CardTitle>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</CardTitle>
                          <Badge variant={isFull ? "destructive" : "success"}>{isFull ? "Full" : "Available"}</Badge>
                        </CardHeader>
                        <CardContent>
                          <p>{remainingSpots} of {slot.capacity} spots available</p>
                          <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedSlot(null)}>
                            <DialogTrigger asChild>
                              <Button className="w-full mt-4" disabled={isFull} onClick={() => setSelectedSlot(slot)}>Book</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader><DialogTitle>Confirm Booking</DialogTitle></DialogHeader>
                              <div>
                                <p><strong>Office:</strong> {office.name}</p>
                                <p><strong>Date:</strong> {formatDate(selectedSlot?.startTime || '')}</p>
                                <p><strong>Time:</strong> {formatTime(selectedSlot?.startTime || '')} - {formatTime(selectedSlot?.endTime || '')}</p>
                                <div className="flex justify-end gap-2 mt-4">
                                  <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                                  <Button onClick={handleBookSlot}>Confirm Booking</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
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
  );
}