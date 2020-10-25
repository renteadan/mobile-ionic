import axios from 'axios';
import io from 'socket.io-client';

export default class Service {

  host = 'http://localhost:3010';
    instance = axios.create({
    baseURL: this.host
  });

  async getTeams() {
    const result = await this.instance.post('/teams');
    return result.data;
  }

  getTeamsWithWs() {
    const ws = io.connect(this.host);

    ws.on('score', (response: any) => {
      alert(response);
    });
  }
}