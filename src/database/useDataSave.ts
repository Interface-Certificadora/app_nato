import { useSQLiteContext } from "expo-sqlite";

export type User = {
  id: number;
  name: string;
  cpf: string;
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
      `INSERT INTO users (name, CPF) VALUES ($name, $CPF)`
    );
    try {
      const result = await statement.executeAsync({
        $name: data.name,
        $CPF: data.cpf
      });
    } catch (error) {
      throw error;
    }
  }
  async function update() {}
  async function find() {}

  return {
    create,
    update,
    find
  };
}
