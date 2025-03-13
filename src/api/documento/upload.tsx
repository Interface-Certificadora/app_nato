export async function uploadDocumento(formData: FormData, clienteId: number): Promise<any> {
  try {
      const response = await fetch(`https://apinatoapp.redebrasilrp.com.br/document`, {
      method: "POST",
      body: formData,
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
    
    console.log("Upload do documento bem-sucedido!");
    return responseData;
  } catch (error) {
    console.error(" Erro ao enviar o documento:", error);
    throw error;
  }
}