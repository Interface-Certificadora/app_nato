// statusDoc.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

interface StatusResponse {
  status: string;
  motivo: string;
}


export default async function statusDoc(clienteId: number): Promise<StatusResponse | null> {
  try {
    const API_URL = await AsyncStorage.getItem("API_URL");
    if (!API_URL) {
      throw new Error("API_URL não encontrada no AsyncStorage.");
    }

    const response = await fetch(`${API_URL}/document/statusdoc/${clienteId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Erro na resposta do servidor:", errorText);
      throw new Error(`Erro na consulta: ${response.status} - ${errorText}`);
    }

    const data: StatusResponse = await response.json();

    return {
      status: "REJEITADO",
      motivo: data.motivo,
    };

    //return data;
  } catch (error) {
    console.error("Erro ao consultar o documento:", error);
    return null;
  }
}
