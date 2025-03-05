import axios from 'axios';


const Request = axios.create({
  baseURL: 'https://apinatoapp.redebrasilrp.com.br',
  headers: {
    'Content-Type': 'application/json',
  },
});

const Api = {

  async getOne(cpf: string) {
    try {
      const req = await Request.get(`/cliente/cpf/${cpf}`);
      return req.data;
    } catch (error: any) {
      if (error.response) {
        return { error: true, status: error.response.status, data: error.response.data };
      } else if (error.request) {
        return { error: true, message: "Sem resposta do servidor" };
      } else {
        return { error: true, message: error.message };
      }
    }
  }
  ,
};

export default Api;