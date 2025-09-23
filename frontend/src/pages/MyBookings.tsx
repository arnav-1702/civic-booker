import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Building2, MapPin, Loader2 } from "lucide-react";
import { Navigation } from "@/components/ui/navigation";
import { useToast } from "@/hooks/use-toast";

// Define an interface for our Booking data to match what the backend sends
interface Booking {
  id: number;
  status: string;
  bookingTime: string;
  startTime: string;
  endTime: string;
  officeName: string;
  officeLocation: string;
  officeContact: string;
}

export default function MyBookings() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect runs once when the component is first loaded
  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({ title: "Error", description: "You are not logged in.", variant: "destructive" });
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/appointments/my-bookings', {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();

        if (data.success) {
          setBookings(data.bookings);
        } else {
          toast({ title: "Error", description: data.message, variant: "destructive" });
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        toast({ title: "Network Error", description: "Could not connect to the server.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const isUpcoming = (dateString: string) => new Date(dateString) > new Date();

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/30 via-background to-secondary/30">
      <Navigation userType="user" userName="John Doe" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Bookings</h1>
          <p className="text-muted-foreground text-lg">View and manage your appointment bookings</p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No bookings yet</h3>
            <p className="text-muted-foreground mb-4">You haven't made any appointments yet.</p>
            <Button asChild><Link to="/offices">Browse Offices</Link></Button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const upcoming = isUpcoming(booking.startTime);
              return (
                <Card key={booking.id} className="shadow-card bg-gradient-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-foreground">{booking.officeName}</CardTitle>
                        <p className="text-muted-foreground text-sm">{booking.officeLocation}</p>
                      </div>
                      <Badge variant={upcoming ? 'default' : 'secondary'}>{upcoming ? 'Upcoming' : 'Past'}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-accent/20 p-3 rounded-lg">
                        <p className="text-sm font-medium">Date</p>
                        <p className="font-semibold">{formatDate(booking.startTime)}</p>
                      </div>
                      <div className="bg-accent/20 p-3 rounded-lg">
                        <p className="text-sm font-medium">Time</p>
                        <p className="font-semibold">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</p>
                      </div>
                    </div>
                    {upcoming && (
                      <div className="flex space-x-2 pt-2">
                        <Button variant="destructive" size="sm">Cancel Booking</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}