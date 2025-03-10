import * as FileSystem from "expo-file-system";

export async function uploadDocumento(
  arquivoDocumento: string | FormData,
  clienteId: number
): Promise<any> {
  try {
    let formData: FormData;
    
    if (typeof arquivoDocumento === 'string') {
      
      const uriParts = arquivoDocumento.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      let mimeType = 'image/jpeg'; // padrão
      if (fileType.toLowerCase() === 'png') {
        mimeType = 'image/png';
      } else if (fileType.toLowerCase() === 'pdf') {
        mimeType = 'application/pdf';
      }
      
      formData = new FormData();
      formData.append("file", {
        uri: arquivoDocumento,
        name: `documento_${clienteId}.${fileType}`,
        type: mimeType,
      } as any);
      
      formData.append("metadata", JSON.stringify({ clienteId })); 
    } else {
      
      formData = arquivoDocumento;
    }

    console.log(" Enviando arquivo para a API...");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/document`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    console.log(response.json());

    if (!response.ok) {
      throw new Error(` Erro no upload: ${response.status} - ${await response.text()}`);
    }

    console.log(" Upload do documento bem-sucedido!");
    return await response.json();
  } catch (error) {
    console.error(" Erro ao enviar o documento:", error);
    throw error;
  }
}
