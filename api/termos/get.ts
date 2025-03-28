export default async function termos(id: string): Promise<boolean> {
    try {
      const response = await fetch(`https://apinatoapp.redebrasilrp.com.br/cliente/termosstatus/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        console.error("Erro na requisição:", response.status);
        return false;
      }
      const data = await response.json();
      return data.termosdeuso;
    } catch (error) {
      console.error("Erro ao verificar termos:", error);
      return false;
    }
  }
  