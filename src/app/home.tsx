import { Alert, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Categories, CategoriesProps } from "@/components/categories";
import { PlaceProps } from "@/components/place";
import { Places } from "@/components/places";

type MarketsProps = PlaceProps;

export default function Home() {
  const [categories, setCategories] = useState<CategoriesProps>([]);
  const [category, steCategory] = useState("");
  const [markets, setMarkets] = useState<MarketsProps[]>();

  async function fetchCategories() {
    try {
      const { data } = await api.get("/categories");
      setCategories(data); // Aqui você pode manipular os dados da resposta para montar a lista de categorias
      steCategory(data[0].id);
    } catch (error) {
      console.log(error);
      Alert.alert("Categorias", "Não foi possível carregar as categorias");
    }
  }

  async function fetchMarkets() {
    try {
      if (!category) {
        return;
      }

      const { data } = await api.get("/markets/category/" + category);
      setMarkets(data);
      
    } catch (error) {
      console.log(error);
      Alert.alert("Locais", "Não foi possível encontrar os locais");
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchMarkets();
  }, [category]);

  return (
    <View style={s.container}>
      <Categories
        data={categories}
        onSelect={steCategory}
        selected={category}
      />

      <Places data={markets}/>
      
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CECECE'
  },
});
