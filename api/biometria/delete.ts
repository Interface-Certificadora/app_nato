import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function deleteBio() {
    try {
        const clienteJson = await AsyncStorage.getItem("cliente");
        if (!clienteJson) {
            throw new Error("Nenhum cliente encontrado no armazenamento local.");
        }
        
        const clienteData = JSON.parse(clienteJson);
        const clienteId = clienteData.id;

        if (!clienteId) {
            throw new Error("ID do cliente não encontrado.");
        }
        const response = await fetch(`https://apinatoapp.redebrasilrp.com.br/biometria/${clienteId}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ao excluir o documento: ${response.status} - ${errorText}`);
        }

        const responseData = await response.json();
        console.log("Documento excluido com sucesso:", responseData);

        return responseData;
    } catch (error) {
        console.error("Erro ao excluir o documento:", error);
        throw error;
    }
}
