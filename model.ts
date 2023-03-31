// Data type
export interface User {
  id: number;
  name: string;
  password: string;
  phone_no?: number;
  date_of_birth?: Date;
  email?: string;
}

export interface Booking {
  start_at?: Date;
  finish_at?: Date;
  participants?: number;
  special_req?: string;
}

export interface Partyroom {
  id: number;
  name?: string;
  phone_no?: number;
  price?: number;
  venue: string;
  style?: string;
  area?: number;
  capacity?: number;
  intro?: string;
  imagefilename?: string;
  user_id?: number;
}

export interface Equipment {
  name: string;
  type: string;
}
