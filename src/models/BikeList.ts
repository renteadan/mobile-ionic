

export interface Bike {
  id: number;
  user_id: number;
  name: string;
  model: string;
  img_url: string;
}

export interface BikeList {
  data: Bike[],
  metadata: {
    count: number
  }
}