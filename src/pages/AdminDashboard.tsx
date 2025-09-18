import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Building2, Search, Download } from "lucide-react";
import { Navigation } from "@/components/ui/navigation";
import { mockBookings, mockOffices, mockTimeSlots, mockUsers } from "@/data/mockData";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  // Combine booking data with related information
  const enrichedBookings = mockBookings.map(booking => {
    const slot = mockTimeSlots.find(s => s.id === booking.slot_id);
    const office = mockOffices.find(o => o.id === slot?.office_id);
    const user = mockUsers.find(u => u.id === booking.user_id);
    
    return {
      ...booking,
      slot,
      office,
      user
    };
  });

  // Filter bookings based on search term
  const filteredBookings = enrichedBookings.filter(booking => {
    if (!booking.office || !booking.user || !booking.slot) return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.user.fullName.toLowerCase().includes(searchLower) ||
      booking.user.email.toLowerCase().includes(searchLower) ||
      booking.office.name.toLowerCase().includes(searchLower) ||
      booking.id.toString().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate stats
  const totalBookings = mockBookings.length;
  const confirmedBookings = mockBookings.filter(b => b.status === 'CONFIRMED').length;
  const totalOffices = mockOffices.length;
  const totalSlots = mockTimeSlots.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/30 via-background to-secondary/30">
      <Navigation userType="admin" userName="Admin" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Manage and monitor all appointment bookings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalBookings}</div>
              <p className="text-xs text-success">+{confirmedBookings} confirmed</p>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Offices</CardTitle>
              <Building2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalOffices}</div>
              <p className="text-xs text-muted-foreground">Government offices</p>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Slots</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalSlots}</div>
              <p className="text-xs text-muted-foreground">Available slots</p>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {Math.round((confirmedBookings / totalSlots) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">Booking efficiency</p>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Table */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <CardTitle className="text-xl">All Bookings</CardTitle>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search bookings..."
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
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Booked On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => {
                    if (!booking.office || !booking.user || !booking.slot) return null;
                    
                    return (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">#{booking.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.user.fullName}</p>
                            <p className="text-sm text-muted-foreground">{booking.user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.office.name}</p>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(booking.slot.startTime)}</TableCell>
                        <TableCell>
                          {formatTime(booking.slot.startTime)} - {formatTime(booking.slot.endTime)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={booking.status === 'CONFIRMED' ? 'success' : 'destructive'}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(booking.bookingTime)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            
            {filteredBookings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchTerm ? 'No bookings match your search.' : 'No bookings found.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}