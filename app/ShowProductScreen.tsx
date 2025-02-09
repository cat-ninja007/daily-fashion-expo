import React, { FC, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MediaComponent } from "@/components/MediaComponent";
import { Linking } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen-hooks";
import realm from "@/store/realm";
// import Checkbox from '@react-native-community/checkbox'
import { Checkbox } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import ButtonComponent from "@/components/ButtonComponent";

interface Product {
  id: number;
  productName: string;
  imagePath: string;
  category: number;
  description: string;
  price: number;
  instagram: string;
  facebook: string;
  phoneNumber: string;
}

interface ProductWithChecked extends Product {
  checked: boolean;
}

const ShowProductScreen: FC = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<ProductWithChecked[]>([]);
  const [isBuy, setIsBuy] = useState(false);
  const [contact, setContact] = useState({
    phoneNumber: "",
    instagram: "",
    facebook: "",
  });
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [showButtons, setShowButtons] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDeletePress = () => {
    setShowConfirmModal(true); // Only show the modal, don't delete yet
  };

  const confirmDelete = () => {
    if (selectedProductId !== null) {
      // Access the Realm database and delete the product
      realm.write(() => {
        // Retrieve the product to delete using the primary key
        const productToDelete = realm.objectForPrimaryKey('Product', selectedProductId);
        if (productToDelete) {
          realm.delete(productToDelete); // Delete the product from the database
          console.log("Deleted product with ID:", selectedProductId);
  
          // Update local state to reflect the change
          const updatedProducts = products.filter(product => product.id !== selectedProductId);
          setProducts(updatedProducts);
  
          // Reset the UI state
          setShowConfirmModal(false);
          setShowButtons(false);
          setSelectedProductId(null);
        }
      });
    }
  };
  

  const handleCancel = () => {
    console.log("Cancel action");
    setShowButtons(false);
    setSelectedProductId(null);
  };

  const buyProduct = (
    whatsapp: string,
    instagramId: string,
    facebookId: string
  ) => {
    setContact({
      phoneNumber: whatsapp,
      instagram: instagramId,
      facebook: facebookId,
    });
    setIsBuy(true);
  };

  const onClickMedia = (type: string) => {
    if (type === "whatsapp") {
      Linking.openURL(`https://wa.me/${contact.phoneNumber}`);
    } else if (type === "instagram") {
      Linking.openURL(`https://instagram.com/${contact.instagram}`);
    } else if (type === "facebook") {
      Linking.openURL(`https://facebook.com/${contact.facebook}`);
    }
  };

  const handleImagePress = (imagePath: string) => {
    router.push({
      pathname: "/ImageZoomScreen", // Adjust this based on your file structure
      params: { imagePath },
    });
  };

  const navigateToEditProductScreen = (product: Product) => {
    const productParams = JSON.stringify(product);
    router.push({
      pathname: "/EditProductScreen",
      params: { product: productParams }, // Pass as a string
    });
    console.log("Product to Edit: ", product);
  };

  const logProductDetails = (product: Product) => {
    console.log("Product Details: ", product);
  };

  const toggleCheckbox = (id: number) => {
    const newProducts = products.map((product: ProductWithChecked) =>
      product.id === id ? { ...product, checked: !product.checked } : product
    );
    setProducts(newProducts);
  };


  useEffect(() => {
    const data = params.products as unknown as string;
    try {
      let parsedProducts: ProductWithChecked[] = JSON.parse(
        data
      ) as ProductWithChecked[];
      parsedProducts = parsedProducts.map((product) => ({
        ...product,
        checked: false, // Ensure all products are unchecked initially
      }));

      setProducts(parsedProducts);
    } catch (error) {
      console.error("Failed to parse products: ", error);
    }
    // Reset the selected product ID each time the products are fetched or updated
    setSelectedProductId(null);
  }, [params.products]);

  useEffect(() => {
    // This ensures that every time this screen is revisited, the selectedProductId is reset
    setSelectedProductId(null);
  }, []); // Empty dependency array ensures it only runs on mount

  useFocusEffect(
    React.useCallback(() => {
      // Called when the screen is focused
      setSelectedProductId(null); // Resets whenever the user comes back to the screen
      setShowButtons(false);
      return () => {
        // Optional: Called when the screen is unfocused
        // Useful for any additional clean-up tasks
      };
    }, [])
  );


  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={products}
        contentContainerStyle={styles.flatListContainer}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <Text style={styles.emptyListText}>No products found.</Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemButton}
            onPress={() => navigateToEditProductScreen(item)}
            // onLongPress={() => handleLongPress(item.id)}
            onLongPress={() => {
              setSelectedProductId(item.id);
              setShowButtons(true);
            }}
          >
            <View style={styles.productContainer}>
              <TouchableOpacity
                onPress={() => handleImagePress(item.imagePath)}
              >
                <Image style={styles.image} source={{ uri: item.imagePath }} />
              </TouchableOpacity>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.productName}</Text>
                <Text style={styles.text}>{item.description}</Text>
                <Text style={styles.text}>{item.price}</Text>
              </View>
            </View>
            {/* <Checkbox
              status={isRemove ? "checked" : "unchecked"}
              onPress={() => setIsRemove(!isRemove)}
            /> */}

            {selectedProductId === item.id ? (
              <Checkbox
                status={item.checked ? "checked" : "unchecked"}
                onPress={() => toggleCheckbox(item.id)}
              />
            ) : (
              <TouchableOpacity
                onPress={() =>
                  buyProduct(item.phoneNumber, item.instagram, item.facebook)
                }
              >
                <AntDesign name="shoppingcart" size={30} color="black" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        )}
      />

      {isBuy ? (
        <View style={styles.modalContainer}>
          <View style={styles.box}>
            <TouchableOpacity
              onPress={() => setIsBuy(false)}
              style={styles.cancel}
            >
              <AntDesign name="close" size={30} color="black" />
            </TouchableOpacity>
            <Text style={[styles.sellerText, styles.title]}>
              Contact the seller through this media:
            </Text>
            {contact.phoneNumber !== "" && (
              <MediaComponent
                imageSource={require("@/assets/images/whatsapp.png")}
                value={contact.phoneNumber}
                onPress={() => onClickMedia("whatsapp")}
              />
            )}
            {contact.instagram !== "" && (
              <MediaComponent
                imageSource={require("@/assets/images/instagram.png")}
                value={contact.instagram}
                onPress={() => onClickMedia("instagram")}
              />
            )}
            {contact.facebook !== "" && (
              <MediaComponent
                imageSource={require("@/assets/images/facebook.png")}
                value={contact.facebook}
                onPress={() => onClickMedia("facebook")}
              />
            )}
          </View>
        </View>
      ) : null}

      <Modal
        transparent={true}
        visible={showConfirmModal}
        animationType="slide"
        onRequestClose={() => {
          setShowConfirmModal(false); // Allows dismissing the modal by pressing back on Android
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this item?
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="Delete"
                color="red"
                onPress={confirmDelete} // Confirm the deletion
              />
              <Button
                title="Cancel"
                color="green"
                onPress={() => setShowConfirmModal(false)} // Just close the modal
              />
            </View>
          </View>
        </View>
      </Modal>

      {showButtons && (
        <View style={styles.buttonContainer}>
          <ButtonComponent
            title="Delete"
            onPress={handleDeletePress} // Triggers the modal
            color="red"
          />
          <ButtonComponent
            title="Cancel"
            onPress={handleCancel}
            color="green"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  flatListContainer: {
    padding: 8,
  },
  itemButton: {
    margin: 8,
    padding: 16,
    borderColor: "#7CAFF58",
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productContainer: {
    flex: 1,
    flexDirection: "row",
  },
  image: {
    width: wp("25%"),
    height: wp("25%"),
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  title: {
    color: "black",
    fontSize: hp("2.5%"),
    fontWeight: "bold",
  },
  text: {
    color: "black",
    fontSize: hp("2%"),
  },
  emptyListText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginTop: 50,
  },
  modalContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9",
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "80%",
    backgroundColor: "white",
    padding: 16,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
  },
  cancel: {
    padding: 8,
    position: "absolute",
    right: 8,
    top: 8,
  },
  sellerText: {
    marginBottom: 8,
    marginTop: 32,
  },

  product: {
    marginBottom: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },

  checkbox: {
    position: "absolute",
    right: 0,
  },

  buttonContainer: {
    flexDirection: "row",
    // justifyContent: "space-evenly",
    // paddingVertical: 10,
    height: hp("7%"),
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});

export default ShowProductScreen;
