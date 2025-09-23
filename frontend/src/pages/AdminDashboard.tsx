import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, Building2, Search, Download, Loader2, Users } from "lucide-react";
import { Navigation } from "@/components/ui/navigation";
import { useToast } from "@/hooks/use-toast";

// Define TypeScript interfaces for the data you'll fetch from the API
interface EnrichedBooking {
  id: number;
  bookingTime: string;
  status: 'CONFIRMED' | 'CANCELLED';
  user: { fullName: string; email: string; };
  office: { name: string; };
  slot: { startTime: string; endTime: string; };
}

interface AdminStats {
  totalBookings: number;
  confirmedBookings: number;
  totalOffices: number;
  totalSlots: number;
  occupancyRate: number;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  
  // State variables to hold live data from the backend
  const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  // This function fetches all necessary data from your backend API
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast({ title: "Authentication Error", description: "Admin token not found.", variant: "destructive" });
        setLoading(false);
        return;
      }

      const apiHeaders = { 'Authorization':` Bearer ${token}`};

      // Fetch both stats and bookings in parallel for efficiency
      const [statsResponse, bookingsResponse] = await Promise.all([
        fetch('http://localhost:5000/api/admin/stats', { headers: apiHeaders }),
        fetch('http://localhost:5000/api/admin/bookings', { headers: apiHeaders })
      ]);

      const statsData = await statsResponse.json();
      const bookingsData = await bookingsResponse.json();

      if (statsData.success) {
        setStats(statsData.stats);
      } else {
        toast({ title: "Error fetching stats", description: statsData.message, variant: "destructive" });
      }

      if (bookingsData.success) {
        setBookings(bookingsData.bookings);
      } else {
        toast({ title: "Error fetching bookings", description: bookingsData.message, variant: "destructive" });
      }

    } catch (error) {
      console.error("Failed to fetch admin data:", error);
      toast({ title: "Network Error", description: "Could not connect to the server.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  
  // useEffect runs this fetch function once when the component first loads
  useEffect(() => {
    fetchData();
  }, []);

  // Handler for cancelling a booking (requires a backend endpoint)
  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/admin/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token} `}
      });

      const data = await response.json();

      if (data.success) {
        toast({ title: "Success", description: "Booking has been cancelled." });
        // Refresh the data to show the change immediately
        fetchData();
      } else {
        toast({ title: "Cancellation Failed", description: data.message, variant: "destructive" });
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      toast({ title: "Network Error", description: "Could not connect to the server.", variant: "destructive" });
    }
  };

  // Filter logic now operates on the live data stored in the state
  const filteredBookings = bookings.filter(booking => {
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.user.fullName.toLowerCase().includes(searchLower) ||
      booking.user.email.toLowerCase().includes(searchLower) ||
      booking.office.name.toLowerCase().includes(searchLower) ||
      booking.id.toString().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Show a loading screen while data is being fetched
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/30 via-background to-secondary/30">
      <Navigation userType="admin" userName="Admin" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground text-lg">Manage and monitor all appointment bookings</p>
        </div>

        {/* Stats Cards - now populated from the 'stats' state */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats?.totalBookings ?? 0}</div>
              <p className="text-xs text-success">+{stats?.confirmedBookings ?? 0} confirmed</p>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Offices</CardTitle>
              <Building2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats?.totalOffices ?? 0}</div>
              <p className="text-xs text-muted-foreground">Government offices</p>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Time Slots</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats?.totalSlots ?? 0}</div>
              <p className="text-xs text-muted-foreground">Across all offices</p>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats?.occupancyRate ?? 0}%</div>
              <p className="text-xs text-muted-foreground">Booking efficiency</p>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Table - now populated from the 'bookings' state */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <CardTitle className="text-xl">All Bookings</CardTitle>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by user, office, ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Office</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Booked On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">#{booking.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{booking.user.fullName}</div>
                        <div className="text-sm text-muted-foreground">{booking.user.email}</div>
                      </TableCell>
                      <TableCell>{booking.office.name}</TableCell>
                      <TableCell>
                        <div>{formatDate(booking.slot.startTime)}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatTime(booking.slot.startTime)} - {formatTime(booking.slot.endTime)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={booking.status === 'CONFIRMED' ? 'success' : 'destructive'}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(booking.bookingTime)}</TableCell>
                      <TableCell className="text-right">
                        {booking.status === 'CONFIRMED' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {bookings.length > 0 && filteredBookings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No bookings match your search.</p>
              </div>
            )}

            {bookings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No bookings have been made yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}