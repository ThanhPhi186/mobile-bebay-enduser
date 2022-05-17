import React from 'react';
import MaskedView from '@react-native-community/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import {Text} from 'react-native';
import {TextProps} from 'react-native-elements';

interface IGradientText extends TextProps {
  colorLinear: Array<string>;
}

const GradientText = (props: IGradientText) => {
  return (
    <MaskedView maskElement={<Text {...props} />}>
      <LinearGradient
        colors={props.colorLinear}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}>
        <Text {...props} style={[props.style, {opacity: 0}]} />
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;
