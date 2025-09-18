import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, Users, ArrowLeft, CheckCircle } from "lucide-react";
import { Navigation } from "@/components/ui/navigation";
import { mockOffices, mockTimeSlots } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export default function TimeSlots() {
  const { officeId } = useParams<{ officeId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const office = mockOffices.find(o => o.id === parseInt(officeId || '0'));
  const slots = mockTimeSlots.filter(slot => slot.office_id === parseInt(officeId || '0'));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const groupSlotsByDate = () => {
    const grouped: { [key: string]: typeof slots } = {};
    slots.forEach(slot => {
      const date = new Date(slot.startTime).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(slot);
    });
    return grouped;
  };

  const handleBookSlot = () => {
    if (selectedSlot) {
      // Mock booking - replace with Supabase
      toast({
        title: "Booking confirmed!",
        description: "Your appointment has been successfully booked.",
      });
      setDialogOpen(false);
      navigate('/my-bookings');
    }
  };

  if (!office) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent/30 via-background to-secondary/30">
        <Navigation userType="user" userName="John Doe" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-2">Office not found</h1>
            <Button onClick={() => navigate('/offices')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Offices
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const groupedSlots = groupSlotsByDate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/30 via-background to-secondary/30">
      <Navigation userType="user" userName="John Doe" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/offices')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Offices
          </Button>
          <h1 className="text-4xl font-bold text-foreground mb-2">{office.name}</h1>
          <p className="text-muted-foreground text-lg">
            Select an available time slot to book your appointment
          </p>
        </div>

        {Object.keys(groupedSlots).length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No slots available</h3>
            <p className="text-muted-foreground">Check back later for available time slots.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedSlots).map(([date, dateSlots]) => (
              <div key={date}>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  {formatDate(dateSlots[0].startTime)}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dateSlots.map((slot) => {
                    const remainingSpots = slot.totalVacancy - slot.bookedCount;
                    const isFull = remainingSpots === 0;
                    
                    return (
                      <Card 
                        key={slot.id} 
                        className={`shadow-card transition-all duration-300 ${
                          isFull 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:shadow-elegant hover:scale-105 cursor-pointer bg-gradient-card'
                        }`}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-primary" />
                              <CardTitle className="text-lg">
                                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                              </CardTitle>
                            </div>
                            <Badge variant={isFull ? "destructive" : remainingSpots <= 2 ? "warning" : "success"}>
                              {isFull ? "Full" : remainingSpots <= 2 ? "Limited" : "Available"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center space-x-2 mb-4">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground text-sm">
                              {remainingSpots} of {slot.totalVacancy} spots available
                            </span>
                          </div>
                          
                          {isFull ? (
                            <Button disabled className="w-full">
                              Fully Booked
                            </Button>
                          ) : (
                            <Dialog open={dialogOpen && selectedSlot === slot.id} onOpenChange={setDialogOpen}>
                              <DialogTrigger asChild>
                                <Button 
                                  className="w-full" 
                                  onClick={() => {
                                    setSelectedSlot(slot.id);
                                    setDialogOpen(true);
                                  }}
                                >
                                  Book This Slot
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle className="flex items-center space-x-2">
                                    <CheckCircle className="h-5 w-5 text-success" />
                                    <span>Confirm Booking</span>
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold text-foreground">{office.name}</h4>
                                    <p className="text-muted-foreground text-sm">{office.address}</p>
                                  </div>
                                  <div className="bg-accent/20 p-4 rounded-lg">
                                    <p className="font-medium text-foreground">
                                      {formatDate(slot.startTime)}
                                    </p>
                                    <p className="text-primary font-semibold">
                                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                    </p>
                                  </div>
                                  <div className="flex space-x-2 pt-4">
                                    <Button variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>
                                      Cancel
                                    </Button>
                                    <Button className="flex-1" onClick={handleBookSlot}>
                                      Confirm Booking
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
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