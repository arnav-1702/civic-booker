import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Phone, Loader2 } from "lucide-react";
import { Navigation } from "@/components/ui/navigation";
import { useToast } from "@/hooks/use-toast";

// Define an interface for our Office data to match the database
interface Office {
  id: number;
  name: string;
  location: string;
  contact: string;
}

export default function Offices() {
  const { toast } = useToast();
  
  // State to hold the list of offices fetched from the API
  const [offices, setOffices] = useState<Office[]>([]);
  // State to show a loading indicator while fetching
  const [loading, setLoading] = useState(true);

  // This useEffect hook runs once when the component first loads
  useEffect(() => {
    const fetchOffices = async () => {
      try {
        // Make the API call to your backend
        const response = await fetch('http://localhost:5000/api/offices');
        const data = await response.json();

        if (data.success) {
          // Store the fetched offices in our state
          setOffices(data.offices);
        } else {
          toast({ title: "Error", description: "Could not load offices.", variant: "destructive" });
        }
      } catch (error) {
        console.error("Failed to fetch offices:", error);
        toast({ title: "Network Error", description: "Could not connect to the server.", variant: "destructive" });
      } finally {
        // Hide the loading indicator
        setLoading(false);
      }
    };

    fetchOffices();
  }, [toast]); // The dependency array ensures this runs only once

  // Show a loading message while data is being fetched
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading available offices...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/30 via-background to-secondary/30">
      <Navigation userType="user" userName="John Doe" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Government Offices</h1>
          <p className="text-muted-foreground text-lg">
            Select an office to view and book available appointments
          </p>
        </div>

        {/* Check if there are offices to display */}
        {offices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Map over the 'offices' state from the API, not mockOffices */}
            {offices.map((office) => (
              <Card key={office.id} className="shadow-card hover:shadow-elegant transition-all duration-300 hover:scale-105 bg-gradient-card">
                <CardHeader>
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-foreground leading-tight">
                        {office.name}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground text-sm">{office.location}</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground text-sm">{office.contact}</p>
                  </div>
                  <Button asChild className="w-full mt-4">
                    <Link to ={`/offices/${office.id}/slots`}>
                      View Available Slots
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // This message shows only after loading is finished and there are no offices
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No offices available</h3>
            <p className="text-muted-foreground">The admin has not added any offices yet. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}