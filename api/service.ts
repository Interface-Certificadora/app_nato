import axios from "axios";

const Request = axios.create({
  baseURL: "https://apinatoapp.redebrasilrp.com.br",
  headers: {
    "Content-Type": "application/json",
  },
});

const Api = {
  // 1. Obtém dados do cliente por CPF
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
  },

  async patchemail(email: any, id: number) {
    console.log(email, id);
    try {
      const response = await Request.patch(`/cliente/email/${id}`, email, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Atualização enviada:");
      return response;
    } catch (error: any) {
      if (error.response) {
        return { error: true, status: error.response.status, data: error.response.data };
      } else if (error.request) {
        return { error: true, message: "Sem resposta do servidor" };
      } else {
        return { error: true, message: error.message };
      }
    }
  },
};

export default Api;
