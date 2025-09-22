import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Clock, Plus, Calendar } from "lucide-react";
import { Navigation } from "@/components/ui/navigation";
import { useToast } from "@/hooks/use-toast";

// Define a type for the office object
interface Office {
  id: number;
  name: string;
  location: string;
  contact: string;
}

export default function AdminManage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [offices, setOffices] = useState<Office[]>([]);

  // State for the create office form
  const [officeName, setOfficeName] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [officeContact, setOfficeContact] = useState("");

  // State for the create time slot form
  const [slotOfficeId, setSlotOfficeId] = useState("");
  const [slotDate, setSlotDate] = useState("");
  const [slotStartTime, setSlotStartTime] = useState("");
  const [slotEndTime, setSlotEndTime] = useState("");
  const [slotCapacity, setSlotCapacity] = useState("");

  // Fetch offices when the component loads to populate the dropdown
  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/offices');
        const data = await response.json();
        if (data.success) {
          setOffices(data.offices);
        }
      } catch (error) {
        console.error("Failed to fetch offices:", error);
        toast({ title: "Error", description: "Could not fetch offices.", variant: "destructive" });
      }
    };
    fetchOffices();
  }, [toast]);

  const handleCreateOffice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch('http://localhost:5000/api/admin/offices', {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token} `},
        body: JSON.stringify({ name: officeName, location: officeAddress, contact: officeContact }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast({ title: "Success!", description: "Office created successfully." });
        setOfficeName("");
        setOfficeAddress("");
        setOfficeContact("");
        // Refresh the office list after creation
        const newOffice = { id: data.officeId, name: officeName, location: officeAddress, contact: officeContact };
        setOffices(prev => [...prev, newOffice]);
      } else {
        toast({ title: "Failed", description: data.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Network Error", description: "Could not connect to the server.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSlot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch('http://localhost:5000/api/admin/timeslots', {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ 
          officeId: slotOfficeId, 
          date: slotDate, 
          startTime: slotStartTime, 
          endTime: slotEndTime, 
          capacity: slotCapacity 
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast({ title: "Success!", description: "Time slot created successfully." });
        // Clear the form
        setSlotOfficeId("");
        setSlotDate("");
        setSlotStartTime("");
        setSlotEndTime("");
        setSlotCapacity("");
      } else {
        toast({ title: "Failed", description: data.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Network Error", description: "Could not connect to the server.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
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
            <TabsTrigger value="offices">Create Office</TabsTrigger>
            <TabsTrigger value="slots">Create Time Slots</TabsTrigger>
          </TabsList>

          <TabsContent value="offices">
            <Card className="shadow-card">
              <CardHeader><CardTitle>Create New Government Office</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleCreateOffice} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="officeName">Office Name</Label>
                    <Input id="officeName" value={officeName} onChange={e => setOfficeName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="officeAddress">Address</Label>
                    <Textarea id="officeAddress" value={officeAddress} onChange={e => setOfficeAddress(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactInfo">Contact Information</Label>
                    <Input id="contactInfo" value={officeContact} onChange={e => setOfficeContact(e.target.value)} required />
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
              <CardHeader><CardTitle>Create New Time Slot</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleCreateSlot} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="slotOffice">Select Office</Label>
                    <Select required value={slotOfficeId} onValueChange={setSlotOfficeId}>
                      <SelectTrigger><SelectValue placeholder="Choose an office" /></SelectTrigger>
                      <SelectContent>
                        {offices.map((office) => (
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
                      <Input id="slotDate" type="date" value={slotDate} onChange={e => setSlotDate(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalVacancy">Total Capacity</Label>
                      <Input id="totalVacancy" type="number" value={slotCapacity} onChange={e => setSlotCapacity(e.target.value)} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input id="startTime" type="time" value={slotStartTime} onChange={e => setSlotStartTime(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input id="endTime" type="time" value={slotEndTime} onChange={e => setSlotEndTime(e.target.value)} required />
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