import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Calendar, Users, Shield, CheckCircle, Clock } from "lucide-react";
import { Navigation } from "@/components/ui/navigation";
import heroImage from "@/assets/government-hero.jpg";

const Index = () => {
  const features = [
    {
      icon: Calendar,
      title: "Easy Scheduling",
      description: "Book appointments at government offices with just a few clicks"
    },
    {
      icon: Building2,
      title: "Multiple Offices",
      description: "Access various government departments from one platform"
    },
    {
      icon: Users,
      title: "Real-time Availability",
      description: "See available time slots and remaining capacity instantly"
    },
    {
      icon: CheckCircle,
      title: "Instant Confirmation",
      description: "Get immediate booking confirmation and reminders"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Government building" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
        </div>
        
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Streamline Your <br />
              <span className="text-accent">Government</span> Appointments
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              Book appointments at government offices quickly and efficiently. 
              Skip the lines, save your time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-accent text-lg px-8 py-6" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6" asChild>
                <Link to="/offices">Browse Offices</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-accent/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose GovConnect?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience a modern, efficient way to interact with government services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300 hover:scale-105 bg-gradient-card">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of citizens who have simplified their government interactions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-accent text-lg px-8 py-6" asChild>
                <Link to="/register">Create Account</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Access */}
      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary mr-2" />
              <span className="text-muted-foreground">Government Administration</span>
            </div>
            <Button variant="outline" asChild>
              <Link to="/login" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Admin Access</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
