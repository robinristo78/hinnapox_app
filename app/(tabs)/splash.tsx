import React from "react";
import { View, Text, Image } from "react-native";

const Splash = () => {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      {/* Image slightly lower */}
      <Image
        source={require("../../assets/splash.png")}
        resizeMode="contain"
        className="w-60 h-60 mb-10" // moves image down from text
      />

      {/* Overlay text with proper spacing and bold second text */}
      <View className="items-center justify-center space-y-6 px-6">
        <Text className="text-5xl font-bold text-gray-900">
          Hinnapõx
        </Text>
        <Text className="text-lg font-bold text-gray-700 text-center">
          The easy way to check the prices you hate.
        </Text>
      </View>
    </View>
  );
};

export default Splash;
