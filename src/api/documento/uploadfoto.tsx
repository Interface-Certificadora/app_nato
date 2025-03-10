import * as FileSystem from "expo-file-system";

export async function uploadDocumento(
  numeroDocumento: string,
  arquivoDocumento: string,
  clienteId: number,
  tipoDocumento: string,
  validade: string
): Promise<any> {
  console.log("📤 Iniciando upload do documento...");

  try {

    const fileInfo = await FileSystem.getInfoAsync(arquivoDocumento);
    if (!fileInfo.exists) {
      throw new Error("O arquivo de documento não existe no caminho especificado.");
    }

   
    const metadata = JSON.stringify({
      userId: clienteId,
     
  
      validade: validade,
      arquivoDocumento: arquivoDocumento, 
    });

    const formData = new FormData();
    formData.append("file", {
      uri: arquivoDocumento,
      name: `documento_${clienteId}.jpg`,
      type: "image/jpeg",
    } as any);
    formData.append("metadata", metadata);

    console.log("📡 Enviando arquivo para a API...");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documento`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`❌ Erro no upload: ${response.status} - ${await response.text()}`);
    }

    console.log("✅ Upload do documento bem-sucedido!");
    return await response.json();
  } catch (error) {
    console.error("❌ Erro ao enviar o documento:", error);
    throw error;
  }
}
