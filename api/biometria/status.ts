// statusBio.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

// O tipo do retorno (ajuste se a API devolver algo diferente)
interface StatusResponse {
  status: string;
  motivo: string;
}


export default async function statusBio(clienteId: number): Promise<StatusResponse | null> {
  try {
    const API_URL = await AsyncStorage.getItem("API_URL");
    const response = await fetch(`${API_URL}/biometria/statusbio/${clienteId}`, {
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

    return data;
  } catch (error) {
    console.error("Erro ao consultar a biometria:", error);
    return null;
  }
}
