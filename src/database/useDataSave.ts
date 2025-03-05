import { useSQLiteContext } from "expo-sqlite";

export type User = {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  isDoc: boolean;
  typeDoc: string;
  doc: string;
  biometria: string;
  createdAt: string;
};

export function useDataSave() {
  const db = useSQLiteContext();

  async function create(
    data: Omit<User, "id, isDoc, typeDoc, doc, biometria">
  ) {
    const statement = await db.prepareAsync(
      `INSERT INTO users (name, CPF, email, telefone) VALUES ($name, $CPF, $email, $telefone)`
    );
    try {
      const result = await statement.executeAsync({
        $name: data.nome,
        $CPF: data.cpf,
        $email: data.email,
        $telefone: data.telefone,
      });
      return result;
    } catch (error) {
      throw error;
    }finally {
      await statement.finalizeAsync();
    }
  }
  async function update() {}
  
  async function find() {

    try {
      const result = await db.getAllAsync<User>('SELECT * FROM users');
      return result;
    } catch (error) {
      throw error;
    }
  }

  return {
    create,
    update,
    find
  };
}
