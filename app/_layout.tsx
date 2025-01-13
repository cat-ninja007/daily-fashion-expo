import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { AntDesign } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

const RootLayout: React.FC = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Drawer>
        {/* Home Screen */}
        <Drawer.Screen
          name="index"
          options={{
            title: "Daily Fashion",
            headerStyle: styles.headerStyle,
            headerTitleAlign: "center",
            drawerIcon: ({ color, size }) => (
              <AntDesign name="home" size={size} color={color} />
            ),
          }}
        />

        {/* Add Product Screen */}
        <Drawer.Screen
          name="AddProductScreen"
          options={{
            title: "Add Product",
            headerStyle: styles.headerStyle,
            headerTitleAlign: "center",
            drawerIcon: ({ color, size }) => (
              <AntDesign name="plus" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerStyle: {
    backgroundColor: "#D1E5C2",
  },
});

export default RootLayout;


// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { Drawer } from "expo-router/drawer";
// import { AntDesign } from "@expo/vector-icons";


// const RootLayout = () => {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <Drawer>
//         <Drawer.Screen
//           name="index" 
//           options={{
//             title: 'Daily Fashion',
//             headerStyle: {
//               backgroundColor: '#D1E5C2',
//             },
//             headerTitleAlign: 'center',
//             drawerIcon: ({ color, size }) => (
//               <AntDesign name="home" size={size} color={color} />
//             ),
//           }}
//         />
//         <Drawer.Screen
//           name="AddProductScreen" 
//           options={{
//             title: 'Add Product',
//             headerStyle: {
//               backgroundColor: '#D1E5C2',
//             },
//             headerTitleAlign: 'center',

//             drawerIcon: ({ color, size }) => (
//               <AntDesign name="plus" size={size} color={color} />
//             ),
//           }}
//         />
//       </Drawer>
//     </GestureHandlerRootView>
//   );
// }

// export default RootLayout
