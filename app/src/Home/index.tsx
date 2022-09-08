import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { categories } from "./categories";

export interface IMarker {
  category: string;
  contact: string;
  description: string;
  id: string;
  latitude: number;
  longitude: number;
  name: string;
}

export default function Home() {
  const [markers, setMarkers] = useState<IMarker[]>([

  ]);
  const [filter, setFilter] = useState("");
  // {
  //   category: "Restaurante",
  //   contact: "91980596809",
  //   description: "teste",
  //   id: "1",
  //   latitude: -1.2937638776005709,
  //   longitude: -47.954515237417915,
  //   name: "Miguelinho quente"
  // }
  const navigation = useNavigation();

  const filteredData = markers.filter((m) => m.category === filter);

  useEffect(() => {
    fetch("http://192.168.3.28:3000/store").then(async (response) => {
      const data = await response.json();


      setMarkers(data);
    })
  }, []);

  if (!markers || markers.length === 0) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Bem vindo</Text>
        <Text style={styles.subTitle}>
          Encontre npm mapa um ponto do comercio local
        </Text>
      </View>

      <MapView style={styles.map}
      initialRegion={{
        latitude: markers[0].latitude,
        longitude: markers[0].longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      >
        {(filter ? filteredData : markers).map((item) => {
          return (
            <Marker
              key={item.id}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              onPress={() => {
                navigation.navigate("Detail" as never, item as never );
              }}
            />
          );
        })}
      </MapView>

      <View style={styles.categoryContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          contentContainerStyle={{
            alignItems: "center",
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setFilter(filter === item.key ? "" : item.key);
              }}
              style={[
                styles.categoryItem,
                filter === item.key ? styles.selectedCategory : null,  
              ]}
              key={item.key}
            >
              <Image style={styles.categoryImage} source={item.image} />
              <Text style={styles.categoryText}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    padding: 20,
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  title: {
    fontSize: 24,
    fontWeight: "400",
    color: "#322153",
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6c6c80",
  },
  map: {
    flex: 1,
  },
  categoryContainer: {
    padding: 10,
  },
  categoryItem: {
    height: 110,
    backgroundColor: "#f0f0f5",
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  categoryImage: {
    width: 50,
    height: 50,
  },
  categoryText: {
    textAlign: "center",
    color: "#6c6c80",
  },
  selectedCategory: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#322153",
  },
});
