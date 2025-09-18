import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Building2, MapPin } from "lucide-react";
import { Navigation } from "@/components/ui/navigation";
import { mockBookings, mockOffices, mockTimeSlots } from "@/data/mockData";

export default function MyBookings() {
  // Mock current user ID
  const currentUserId = 1;
  
  const userBookings = mockBookings
    .filter(booking => booking.user_id === currentUserId)
    .map(booking => {
      const slot = mockTimeSlots.find(s => s.id === booking.slot_id);
      const office = mockOffices.find(o => o.id === slot?.office_id);
      return {
        ...booking,
        slot,
        office
      };
    });

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

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/30 via-background to-secondary/30">
      <Navigation userType="user" userName="John Doe" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Bookings</h1>
          <p className="text-muted-foreground text-lg">
            View and manage your appointment bookings
          </p>
        </div>

        {userBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No bookings yet</h3>
            <p className="text-muted-foreground mb-4">You haven't made any appointments yet.</p>
            <Button asChild>
              <a href="/offices">Browse Offices</a>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {userBookings.map((booking) => {
              if (!booking.slot || !booking.office) return null;
              
              const upcoming = isUpcoming(booking.slot.startTime);
              
              return (
                <Card key={booking.id} className="shadow-card bg-gradient-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-foreground">
                            {booking.office.name}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <p className="text-muted-foreground text-sm">
                              {booking.office.address}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge variant={booking.status === 'CONFIRMED' ? 'success' : 'destructive'}>
                          {booking.status}
                        </Badge>
                        <Badge variant={upcoming ? 'default' : 'secondary'}>
                          {upcoming ? 'Upcoming' : 'Past'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-accent/20 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">Appointment Date</span>
                        </div>
                        <p className="text-foreground font-semibold">
                          {formatDate(booking.slot.startTime)}
                        </p>
                      </div>
                      <div className="bg-accent/20 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">Time</span>
                        </div>
                        <p className="text-foreground font-semibold">
                          {formatTime(booking.slot.startTime)} - {formatTime(booking.slot.endTime)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-muted/20 p-4 rounded-lg">
                      <p className="text-muted-foreground text-sm">
                        <strong>Booking ID:</strong> #{booking.id}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        <strong>Booked on:</strong> {formatDate(booking.bookingTime)} at {formatTime(booking.bookingTime)}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        <strong>Contact:</strong> {booking.office.contactInfo}
                      </p>
                    </div>
                    
                    {upcoming && booking.status === 'CONFIRMED' && (
                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        <Button variant="destructive" size="sm">
                          Cancel Booking
                        </Button>
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