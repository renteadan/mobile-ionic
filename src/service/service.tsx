import axios from 'axios';
import io from 'socket.io-client';
import { BikeList } from '../models/BikeList';
import { Plugins } from '@capacitor/core';
export default class Service {

  host = 'http://localhost:3000';
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

  async getBikes(skip?: number, limit?: number): Promise<BikeList> {
    const params: any = {
      skip: 0,
    };
    if (skip) {
      params.skip = skip;
    }
    if (limit) {
      params.limit = limit;
    }
    try {
      const result = await this.instance.get('/bicycle/list', {
        headers: this.authHeader(),
        params,
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
    const ws = io.connect(this.host);

    ws.on('score', (response: any) => {
      alert(response);
    });
  }

  logout() {
    localStorage.removeItem('myToken');
  }

  async login(data: any) {
    const response = await this.instance.post('/login', data);
    return response.data;
  }
}