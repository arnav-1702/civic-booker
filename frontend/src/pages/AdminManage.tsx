import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Clock, Plus, Calendar } from "lucide-react";
import { Navigation } from "@/components/ui/navigation";
import { mockOffices } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export default function AdminManage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleCreateOffice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock creation - replace with Supabase
    setTimeout(() => {
      toast({
        title: "Office created successfully!",
        description: "The new government office has been added to the system.",
      });
      setLoading(false);
    }, 1000);
  };

  const handleCreateSlot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock creation - replace with Supabase
    setTimeout(() => {
      toast({
        title: "Time slot created successfully!",
        description: "The new appointment slot has been added.",
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/30 via-background to-secondary/30">
      <Navigation userType="admin" userName="Admin" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Manage System</h1>
          <p className="text-muted-foreground text-lg">
            Create new offices and manage appointment time slots
          </p>
        </div>

        <Tabs defaultValue="offices" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="offices" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Create Office</span>
            </TabsTrigger>
            <TabsTrigger value="slots" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Create Time Slots</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="offices">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5 text-primary" />
                  <span>Create New Government Office</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateOffice} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="officeName">Office Name</Label>
                    <Input
                      id="officeName"
                      type="text"
                      placeholder="e.g. Department of Motor Vehicles"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="officeAddress">Address</Label>
                    <Textarea
                      id="officeAddress"
                      placeholder="Enter the complete address of the office"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactInfo">Contact Information</Label>
                    <Input
                      id="contactInfo"
                      type="text"
                      placeholder="email@gov.local | (555) 123-4567"
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating Office..." : "Create Office"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="slots">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5 text-primary" />
                  <span>Create New Time Slot</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateSlot} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="slotOffice">Select Office</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a government office" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockOffices.map((office) => (
                          <SelectItem key={office.id} value={office.id.toString()}>
                            {office.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="slotDate">Date</Label>
                      <Input
                        id="slotDate"
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="totalVacancy">Total Capacity</Label>
                      <Input
                        id="totalVacancy"
                        type="number"
                        placeholder="e.g. 5"
                        min="1"
                        max="50"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="bg-accent/20 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Calendar className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground mb-1">Time Slot Guidelines</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Ensure end time is after start time</li>
                          <li>• Recommended slot duration: 1-2 hours</li>
                          <li>• Capacity should match office resources</li>
                          <li>• Check for existing slots to avoid conflicts</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating Time Slot..." : "Create Time Slot"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}