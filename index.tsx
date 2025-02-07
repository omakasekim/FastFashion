import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, ScrollView, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LineChart } from 'react-native-chart-kit';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const screenWidth = Dimensions.get("window").width;

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Eco-Points') {
            iconName = 'leaf';
          } else if (route.name === 'Marketplace') {
            iconName = 'cart';
          } else if (route.name === 'Impact Tracker') {
            iconName = 'stats-chart';
          } else {
            iconName = 'person';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Eco-Points" component={PointsScreen} />
      <Tab.Screen name="Marketplace" component={MarketplaceScreen} />
      <Tab.Screen name="Impact Tracker" component={ImpactTrackerScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
  );
}

const HomeScreen: React.FC = () => (
  <ScrollView style={styles.container}>
    <Text style={styles.title}>Eco-Feed & Community Challenges</Text>
    <View style={styles.card}><Text>🌱 Join today's eco challenge: Recycle an old T-shirt!</Text></View>
    <View style={styles.card}><Text>🏆 Top eco-friendly users of the week announced!</Text></View>
    <View style={styles.card}><Text>🌍 Compete in community sustainability goals!</Text></View>
  </ScrollView>
);

const PointsScreen: React.FC = () => {
  const [points, setPoints] = useState(100);
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setPoints(points + 50); // Earn points for verified sustainability actions
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Eco-Points</Text>
      <Text style={styles.points}>{points} Points</Text>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload Proof (Receipt, Image)</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.receiptImage} />}
    </View>
  );
};

const MarketplaceScreen: React.FC = () => (
  <ScrollView style={styles.container}>
    <Text style={styles.title}>Sustainable Marketplace</Text>
    <View style={styles.card}><Text>👕 Eco-Friendly T-shirt - 20 Points</Text></View>
    <View style={styles.card}><Text>👖 Recycled Jeans - 50 Points</Text></View>
  </ScrollView>
);

// {
//     "name": "Eco-Friendly T-shirt",
//     "price": 20,
//     "imageUrl": "https://images.unsplash.com/photo-1593642709921-3b3b7f4a2f3b",
//     "createdAt": "timestamp"
// }

const ImpactTrackerScreen: React.FC = () => {
  const [carbonData, setCarbonData] = useState<number[]>([5, 7, 9, 12, 15, 18, 22]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Impact Tracker</Text>
      <Text>Total Carbon Saved: {carbonData.reduce((a, b) => a + b, 0)} kg</Text>
      <LineChart
        data={{
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
          datasets: [{
            data: carbonData,
          }],
        }}
        width={screenWidth - 20}
        height={220}
        yAxisSuffix="kg"
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: { borderRadius: 16 },
        }}
        bezier
      />
    </View>
  );
};

const ProfileScreen: React.FC = () => (
  <View style={styles.container}><Text style={styles.title}>Profile & Badges</Text>
    <View style={styles.card}><Text>🏆 Eco-Warrior Level 3</Text></View>
    <View style={styles.card}><Text>🔥 Streak: 10 Days of Sustainable Actions!</Text></View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#e0f7fa',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#0288d1',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  receiptImage: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  points: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  
});
