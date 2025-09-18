export interface Office {
  id: number;
  name: string;
  address: string;
  contactInfo: string;
}

export interface TimeSlot {
  id: number;
  office_id: number;
  startTime: string;
  endTime: string;
  totalVacancy: number;
  bookedCount: number;
}

export interface Booking {
  id: number;
  user_id: number;
  slot_id: number;
  bookingTime: string;
  status: 'CONFIRMED' | 'CANCELLED';
  userName?: string;
  officeName?: string;
  slotTime?: string;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
}

// Mock data
export const mockOffices: Office[] = [
  {
    id: 1,
    name: "Department of Motor Vehicles",
    address: "123 Government Ave, City Hall",
    contactInfo: "dmv@gov.local | (555) 123-4567"
  },
  {
    id: 2,
    name: "Social Security Administration",
    address: "456 Federal Blvd, Downtown",
    contactInfo: "ssa@gov.local | (555) 234-5678"
  },
  {
    id: 3,
    name: "Passport Office",
    address: "789 International St, Government Center",
    contactInfo: "passport@gov.local | (555) 345-6789"
  },
  {
    id: 4,
    name: "Tax Revenue Office",
    address: "321 Revenue Rd, City Center",
    contactInfo: "tax@gov.local | (555) 456-7890"
  }
];

export const mockTimeSlots: TimeSlot[] = [
  // DMV slots
  { id: 1, office_id: 1, startTime: "2024-09-25T09:00:00", endTime: "2024-09-25T10:00:00", totalVacancy: 5, bookedCount: 2 },
  { id: 2, office_id: 1, startTime: "2024-09-25T10:00:00", endTime: "2024-09-25T11:00:00", totalVacancy: 5, bookedCount: 5 },
  { id: 3, office_id: 1, startTime: "2024-09-25T11:00:00", endTime: "2024-09-25T12:00:00", totalVacancy: 5, bookedCount: 1 },
  { id: 4, office_id: 1, startTime: "2024-09-26T09:00:00", endTime: "2024-09-26T10:00:00", totalVacancy: 5, bookedCount: 0 },
  { id: 5, office_id: 1, startTime: "2024-09-26T10:00:00", endTime: "2024-09-26T11:00:00", totalVacancy: 5, bookedCount: 3 },
  
  // SSA slots
  { id: 6, office_id: 2, startTime: "2024-09-25T08:00:00", endTime: "2024-09-25T09:00:00", totalVacancy: 8, bookedCount: 4 },
  { id: 7, office_id: 2, startTime: "2024-09-25T09:00:00", endTime: "2024-09-25T10:00:00", totalVacancy: 8, bookedCount: 6 },
  { id: 8, office_id: 2, startTime: "2024-09-25T10:00:00", endTime: "2024-09-25T11:00:00", totalVacancy: 8, bookedCount: 8 },
  { id: 9, office_id: 2, startTime: "2024-09-26T08:00:00", endTime: "2024-09-26T09:00:00", totalVacancy: 8, bookedCount: 2 },
  
  // Passport Office slots
  { id: 10, office_id: 3, startTime: "2024-09-25T13:00:00", endTime: "2024-09-25T14:00:00", totalVacancy: 3, bookedCount: 1 },
  { id: 11, office_id: 3, startTime: "2024-09-25T14:00:00", endTime: "2024-09-25T15:00:00", totalVacancy: 3, bookedCount: 0 },
  { id: 12, office_id: 3, startTime: "2024-09-26T13:00:00", endTime: "2024-09-26T14:00:00", totalVacancy: 3, bookedCount: 2 },
  
  // Tax Office slots
  { id: 13, office_id: 4, startTime: "2024-09-25T11:00:00", endTime: "2024-09-25T12:00:00", totalVacancy: 6, bookedCount: 3 },
  { id: 14, office_id: 4, startTime: "2024-09-25T14:00:00", endTime: "2024-09-25T15:00:00", totalVacancy: 6, bookedCount: 1 },
  { id: 15, office_id: 4, startTime: "2024-09-26T11:00:00", endTime: "2024-09-26T12:00:00", totalVacancy: 6, bookedCount: 0 },
];

export const mockBookings: Booking[] = [
  {
    id: 1,
    user_id: 1,
    slot_id: 1,
    bookingTime: "2024-09-20T10:30:00",
    status: 'CONFIRMED',
    userName: "John Doe",
    officeName: "Department of Motor Vehicles",
    slotTime: "2024-09-25T09:00:00"
  },
  {
    id: 2,
    user_id: 2,
    slot_id: 6,
    bookingTime: "2024-09-19T14:15:00",
    status: 'CONFIRMED',
    userName: "Jane Smith",
    officeName: "Social Security Administration",
    slotTime: "2024-09-25T08:00:00"
  },
  {
    id: 3,
    user_id: 1,
    slot_id: 13,
    bookingTime: "2024-09-21T09:45:00",
    status: 'CONFIRMED',
    userName: "John Doe",
    officeName: "Tax Revenue Office",
    slotTime: "2024-09-25T11:00:00"
  }
];

export const mockUsers: User[] = [
  { id: 1, email: "john.doe@email.com", fullName: "John Doe" },
  { id: 2, email: "jane.smith@email.com", fullName: "Jane Smith" }
];