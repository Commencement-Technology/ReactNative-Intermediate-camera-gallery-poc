import { Text, View } from "react-native";
import React from "react";
import { DARKPURPLE, WHITE } from "../../utils/constants";

type NoRecordsCardProps = {
  text: string;
};

const NoRecordsCard = ({ text }: NoRecordsCardProps) => {
  return (
    <View style={{ width: "90%", marginTop: "2%" }}>
      <View
        style={{ width: "100%", backgroundColor: DARKPURPLE, borderRadius: 15 }}
      >
        <View style={{ paddingVertical: 13 }}>
          <Text
            numberOfLines={2}
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: WHITE,
              alignSelf: "center",
            }}
          >
            {text}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default NoRecordsCard;
