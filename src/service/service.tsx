import axios from 'axios';
import { Bike, BikeList } from '../models/BikeList';
import { Plugins } from '@capacitor/core';
export default class Service {

  host = 'http://192.168.0.131:3000';
  instance = axios.create({
    baseURL: this.host
  });

  storage = Plugins.Storage

  authHeader() {
    const token = localStorage.getItem('myToken');

    if (token) {
      return { Authorization: 'Bearer ' + token };
    } else {
      return {};
    }
  }

  async saveLocalBikes(bikes: BikeList): Promise<void> {
    const bikeList = await this.getLocalBikes();
    if(bikeList.data.length > bikes.data.length)
    return;
    await this.storage.set({
      key: 'bikes',
      value: JSON.stringify(bikes),
    });
  }

  async getLocalBikes(): Promise<BikeList> {
    const data = await this.storage.get({
      key: 'bikes',
    });
    if (typeof data.value === 'string') 
      return JSON.parse(data.value);
    return {
      data: [],
      metadata: {
        count: 0,
      }
    };
  }

  async updateBike(bike: Bike) {
    try {
      const result = await this.instance.put(`/bicycle/${bike.id}`, bike ,{
        headers: this.authHeader(),
      });
      return result.data;
    } catch(err) {
      console.log(err);
    }
  }

  async getBikes(filters?: {skip?: number; limit?: number; name?: string}): Promise<BikeList> {
    try {
      const result = await this.instance.get('/bicycle/list', {
        headers: this.authHeader(),
        params: filters,
      });
      await this.saveLocalBikes(result.data);
      return result.data;
    } catch(err) {
      console.log(err);
      const bikes = await this.getLocalBikes();
      alert('Using offline data!');
      return bikes;
    }
  }

  async verify() {
    const token = localStorage.getItem('myToken');
    if(!token)
      return false;
    try {
      const result = await this.instance.post('/verify', {token}, {
        headers: this.authHeader()
      });
      const { data } = result;
      return data.ok;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  getTeamsWithWs() {
    const ws = new WebSocket('ws://localhost:3000');
    ws.onopen = (e) => {
      console.log('open socket');
      ws.send('mesajjj');
    }

    ws.onmessage = (event) => {
      alert(`[message] Data received from server: ${event.data}`);
    };
  }

  logout() {
    localStorage.removeItem('myToken');
  }

  async login(data: any) {
    const response = await this.instance.post('/login', data);
    return response.data;
  }
}