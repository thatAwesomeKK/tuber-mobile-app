import { Text, TouchableOpacity, View } from "react-native";
import React from "react";

import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useUserStore } from "../lib/store";
import { Avatar } from "react-native-paper";
import { CirclePlus, House } from "lucide-react-native";

const BottomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const { user } = useUserStore();

  const icons: { [key: string]: (props: any) => JSX.Element } = {
    index: (props: React.ComponentProps<typeof House>) => <House {...props} />,
    upload: (props: React.ComponentProps<typeof House>) => (
      <CirclePlus {...props} />
    ),
    dash: () => (
      <Avatar.Image
        size={28}
        source={{
          uri: user?.pfp || "https://api.dicebear.com/9.x/micah/png",
        }}
      />
    ),
  };

  const primaryColor = "#673ab7";
  const secondaryColor = "#222";

  return (
    <View className="absolute bottom-5 bg-white flex flex-row mx-10 py-2 rounded-full shadow-xl shadow-black">
      {state.routes.map((route, index) => {
        if (route.name === "upload" && !user) {
          return null;
        }

        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            key={route.key}
            className="flex-1 justify-center items-center"
          >
            <View className="flex justify-center items-center">
              {icons[route.name]({
                color: isFocused ? primaryColor : secondaryColor,
                className: "w-4 h-4",
              })}
              <Text
                className="capitalize"
                style={{ color: isFocused ? primaryColor : secondaryColor }}
              >
                {label as React.ReactNode}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomTabBar;
