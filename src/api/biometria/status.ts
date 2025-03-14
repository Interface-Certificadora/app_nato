export default async function statusBio(clienteId: number): Promise<string> {
    console.log("ID do cliente:", clienteId);
    try {
      const response = await fetch(
        `https://apinatoapp.redebrasilrp.com.br/biometria/statusbio/${clienteId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        console.log("Erro na resposta do servidor:", errorText);
        throw new Error(`Erro na consulta: ${response.status} - ${errorText}`);
      }
      const responseText = await response.text();
      
      try {
        const data = JSON.parse(responseText);
        return data.statusDocumento || "Indefinido";
      } catch (parseError) {
        console.log("Não foi possível interpretar como JSON, usando resposta bruta:", parseError);
        return "REJEITADO" || "Erro";
      }
    } catch (error) {
      console.error("Erro ao consultar o documento:", error);
      return "Erro";
    }
}