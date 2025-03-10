export async function uploadPhotoToApi(photoUri: string, clienteId: number, tipoBiometria: string): Promise<any> {
  try {
    // Verificar se o URI é uma string válida
    if (typeof photoUri !== 'string') {
      console.error("URI inválido:", photoUri);
      throw new Error("URI deve ser uma string");
    }

    console.log("Tipo do URI:", typeof photoUri);
    console.log("Valor do URI:", photoUri);

    const metadata = JSON.stringify({
      clienteId: clienteId,
      tipoBiometria: tipoBiometria
    });

    const formData = new FormData();
    formData.append("file", {
      uri: photoUri,
      name: `biometria_${clienteId}.jpg`,
      type: "image/jpeg",
    } as any);
    formData.append("metadata", metadata);
    console.log("Enviando arquivo para a API...");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/biometria`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro na resposta da API: ${response.status} - ${errorText}`);
      throw new Error(`Erro no upload: ${response.status} - ${errorText}`);
    }

    console.log("Upload da biometria bem-sucedido!");
    return await response.json();
  } catch (error) {
    console.error("Erro ao enviar a foto para a API:", error);
    throw error;
  }
}