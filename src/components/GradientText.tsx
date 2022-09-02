import React from "react"
import { View, StyleSheet, Text, TextProps } from "react-native"
import MaskedView from "@react-native-masked-view/masked-view";
import LinearGradient from "react-native-linear-gradient";

interface GradientTextProps extends TextProps {
   colors: string[];
   start?: { x: number; y: number };
   end?: { x: number; y: number };
   locations?: number[];
}
export function GradientText({ colors, start, end, locations, ...rest }: GradientTextProps) {
   return (
      <MaskedView maskElement={<Text {...rest} />}>
         <LinearGradient
            end={end}
            start={start}
            colors={colors}
            locations={locations}
         >
            <Text {...rest} style={[rest.style, { opacity: 0 }]} />
         </LinearGradient>
      </MaskedView>
   )
}

const sheet = StyleSheet.create({

})