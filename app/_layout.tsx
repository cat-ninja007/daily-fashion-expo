import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { AntDesign } from "@expo/vector-icons";


const RootLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index" 
          options={{
            title: 'Daily Fashion',
            headerStyle: {
              backgroundColor: '#D1E5C2',
            },
            headerTitleAlign: 'center',
            drawerIcon: ({ color, size }) => (
              <AntDesign name="home" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="AddProductScreen" 
          options={{
            title: 'Add Product',
            headerStyle: {
              backgroundColor: '#D1E5C2',
            },
            headerTitleAlign: 'center',

            drawerIcon: ({ color, size }) => (
              <AntDesign name="plus" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

export default RootLayout
