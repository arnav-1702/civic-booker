import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Phone } from "lucide-react";
import { Navigation } from "@/components/ui/navigation";
import { mockOffices } from "@/data/mockData";

export default function Offices() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockOffices.map((office) => (
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
                  <p className="text-muted-foreground text-sm">{office.address}</p>
                </div>
                <div className="flex items-start space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground text-sm">{office.contactInfo}</p>
                </div>
                <Button asChild className="w-full mt-4">
                  <Link to={`/offices/${office.id}/slots`}>
                    View Available Slots
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {mockOffices.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No offices available</h3>
            <p className="text-muted-foreground">Check back later for available government offices.</p>
          </div>
        )}
      </div>
    </div>
  );
}