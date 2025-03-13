export async function uploadBio(FormData: FormData): Promise<any> {
  try {
    const response = await fetch (`https://apinatoapp.redebrasilrp.com.br/biometria`, {
      method: "POST",
      body: FormData,
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro no upload: ${response.status} - ${errorText}`);
    }
    const responseData = await response.json();
    console.log("Resposta da API:", responseData);
    console.log("Upload da biometria bem-sucedido!");
    return responseData;
  } catch (error) {
    console.error("Erro ao enviar a biometria:", error);
    throw error;
  }
}