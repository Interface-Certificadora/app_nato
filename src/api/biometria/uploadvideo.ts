// uploadPhotoToApi.ts
export async function uploadPhotoToApi(photoUri: string, clienteId: number, tipoBiometria: string): Promise<any> {
  console.log("📤 Iniciando upload da foto para a API...");

  const formData = new FormData();
  formData.append("file", {
    uri: photoUri,
    name: `biometria_${clienteId}.jpg`,
    type: "image/jpeg",
  } as any);
  formData.append("clienteId", clienteId.toString());
  formData.append("tipoBiometria", tipoBiometria);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/biometria`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        
      },
    });

    if (!response.ok) {
      throw new Error(`Erro no upload: ${response.status} - ${await response.text()}`);
    }

    console.log("Upload bem-sucedido!");
    return await response.json();
  } catch (error) {
    console.error("Erro ao enviar foto para a API:", error);
    throw error;
  }
}
