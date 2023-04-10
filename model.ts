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
  id: number;
  start_at?: Date;
  finish_at?: Date;
  participants?: number;
  special_req?: string;
  user_id: number;
  partyroom_id: number;
  price:number
  //try
  is_cancelled: boolean;
  //try
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
  is_hidden?: boolean;
}

export interface Equipment {
  id: number;
  partyroom_id: number;
  name: string;
  type: string;
}

export interface Rating {
  id: number;
  user_id: number;
  partyroom_id: number;
  ratings: number;
  comments: Text;
}
