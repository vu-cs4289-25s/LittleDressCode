import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import StyleHeader from "@/components/headers/StyleHeader";
import dummy1 from "../../../assets/images/dummy/clothing/img-1.png";
import dummy2 from "../../../assets/images/dummy/clothing/img-2.png";
import dummy3 from "../../../assets/images/dummy/clothing/img-3.png";
import dummy4 from "../../../assets/images/dummy/clothing/img-4.png";
import dummy5 from "../../../assets/images/dummy/clothing/img-5.png";
import dummy6 from "../../../assets/images/dummy/clothing/img-6.png";
import dummy7 from "../../../assets/images/dummy/clothing/img-7.png";
import dummy8 from "../../../assets/images/dummy/clothing/img-8.png";
import dummy9 from "../../../assets/images/dummy/clothing/img-10.png";
import dummy10 from "../../../assets/images/dummy/clothing/img.png";
import dummy11 from "../../../assets/images/dummy/clothing/img-12.png";
import dummy12 from "../../../assets/images/dummy/clothing/img-13.png";
import dummy13 from "../../../assets/images/dummy/clothing/img-14.png";
import TextButton from "@/components/common/TextButton";

// TEMPORARY
const tops = [dummy1, dummy3, dummy4, dummy5, dummy6];
const bottoms = [dummy2, dummy9, dummy10];
const shoes = [dummy11, dummy12, dummy13];

const NewOutfit = () => {
  return (
    <View style={styles.container}>
      <StyleHeader />
      <ScrollView>
        <OutfitRow data={tops} />
        <OutfitRow data={bottoms} />
        <OutfitRow data={shoes} />
      </ScrollView>
      <TextButton title="Next" size="large" color="dark" onPress={{}} />
    </View>
  );
};

const OutfitRow = ({ title, data }) => {
  return (
    <View style={styles.rowContainer}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Image source={item} style={styles.image} />}
      />
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    paddingBottom: 50
  },
});

export default NewOutfit;
