import { Alert, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Categories, CategoriesProps } from "@/components/categories";
import { PlaceProps } from "@/components/place";
import { Places } from "@/components/places";
import MapView, {Callout, Marker} from "react-native-maps";
import { colors } from "@/styles/colors";
import { fontFamily } from "@/styles/font-family";
import { router } from "expo-router";
import { useRoute } from "@react-navigation/native";

type MarketsProps = PlaceProps & {
  latitude: number;
  longitude: number;
}

const currentLocation = {
  latitude: -23.561187293883442,
  longitude: -46.656451388116494,
};

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

      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          identifier="current"
          coordinate={{latitude: currentLocation.latitude, longitude: currentLocation.longitude}}
          image={require('@/assets/location.png')}
        />

        {markets && markets.map((item) => (
            <Marker
              key={item.id}
              identifier={item.id}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              image={require('@/assets/pin.png')}
            >
              <Callout onPress={() => router.navigate(`/market/${item.id}`)}>
                <View>
                  <Text style={{fontSize: 14, color: colors.gray[600], fontFamily: fontFamily.medium}}>
                    {item.name}
                  </Text>
                  <Text style={{fontSize: 12, color: colors.gray[600], fontFamily: fontFamily.regular}}>
                    {item.address}
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}
      </MapView>

      <Places data={markets} />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#CECECE",
  },
});
