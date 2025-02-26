import axios from 'axios';

const Request = axios.create({
  baseURL: 'http://24.152.37.153:3005',
  headers: {
    'Content-Type': 'application/json',
  },
});

const Api = {

  async getOne(cpf: string) {
    try {
      const req = await Request.get(`/${cpf}`);
      const data = req.data;
      return data;
    } catch (error) {
      return error;
    }
  },
};

export default Api;