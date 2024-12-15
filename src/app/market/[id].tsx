import { View, Alert, Modal, StatusBar, ScrollView } from "react-native";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { api } from "@/services/api";
import { useEffect, useRef, useState } from "react";
import Loading from "@/components/loading";
import { Cover } from "@/components/market/cover";
import { PropsDetails, Details } from "@/components/market/details";
import { Coupon } from "@/components/market/coupon";
import { Button } from "@/components/button";
import { useCameraPermissions, CameraView } from "expo-camera";

type DataProps = PropsDetails & {
  cover: string;
};

export default function Market() {
  const [data, setData] = useState<DataProps>();
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [couponIsFetching, setCouponIsFetching] = useState(false);

  const [_, requestPermission] = useCameraPermissions();

  const params = useLocalSearchParams<{ id: string }>();

  console.log(params.id)

  const qrLock = useRef(false);

  async function fetchMarket() {
    try {
      const { data } = await api.get(`/markets/${params.id}`);
      setData(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível carregar os dados", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  }

  async function handleShowModal() {
    try {
      const { granted } = await requestPermission();

      if (!granted) {
        return Alert.alert(
          "Permissão de camera",
          "Você precisa permitir acessar a câmera para usar esse recurso"
        );
      }

      qrLock.current = false;

      setIsVisibleModal(true);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível abrir a câmera", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  }

  async function getCoupon(id: string) {
    try {
      setCouponIsFetching(true);

      const { data } = await api.patch(`/coupons/${id}`);
      console.log(data);

      Alert.alert("Cupom", data.coupon);
      setCoupon(data.coupon);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível utilizar o cupom");
    } finally {
      setCouponIsFetching(false);
    }
  }

  function handleUseCoupon(id: string) {
    setIsVisibleModal(false);

    Alert.alert(
      "Cupom",
      "Não foi possível reutilizar o cupom resgatado, Deseja realmente resgatar o cupom ?",
      [
        { style: "cancel", text: "Não" },
        { text: "Sim", onPress: () => getCoupon(id) },
      ]
    );
  }

  useEffect(() => {
    fetchMarket();
  }, [params.id, Coupon]);

  if (loading) {
    return <Loading />;
  }

  if (!data) {
    return <Redirect href="/home" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" hidden={isVisibleModal} />
      <ScrollView>
        <Cover uri={data.cover} />
        <Details data={data} />
        {coupon && <Coupon code={coupon} />}
      </ScrollView>

      <View style={{ padding: 32 }}>
        <Button onPress={handleShowModal}>
          <Button.Title>Ler QR Code</Button.Title>
        </Button>
      </View>

      <Modal style={{ flex: 1 }} visible={isVisibleModal}>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          onBarcodeScanned={({ data }) => {
            if (data && !qrLock.current) {
              qrLock.current = true;
              setTimeout(() => {
                handleUseCoupon(data);
              }, 500);
            }
          }}
        />
        <View style={{ position: "absolute", bottom: 32, left: 32, right: 32 }}>
          <Button
            onPress={() => setIsVisibleModal(false)}
            isLoading={couponIsFetching}
          >
            <Button.Title>Voltar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
}
