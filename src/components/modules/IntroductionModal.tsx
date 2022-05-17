import { Mixin } from 'helpers';
import { useBaseHook } from 'helpers/hookHelper';
import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { makeStyles, OverlayProps } from 'react-native-elements';
import { Overlay } from 'react-native-elements/dist/overlay/Overlay';
import AppButton from '../atoms/Button';
import { images } from 'assets'
import AppText from 'components/atoms/AppText';
import { AppCheckBox } from 'components/modules/AppCheckBox';
import { itemWidth } from 'screens/ProfileStack/Profile';
import { BASE_API_URL } from 'utils/Const';
import RenderHtml from 'react-native-render-html';

export interface IBottomModal extends OverlayProps {
  canCancel?: boolean;
  cancelTitle?: string;
  confirmTitle?: string;
  disabledConfirm?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  canDismiss?: boolean;
  title: string;
  title1: string;
  title2: string;
  title3: string;
  imageUrl: string;
  onHideIntro?: (code: boolean) => void;


}
const useStyles = makeStyles(theme => ({
  buttonContainer: {
    width: '100%',
  },
  overlayStyles: {
    position: 'absolute',
    width: '100%',
    bottom: Mixin.moderateSize(0),
    height: '90%',
    borderTopLeftRadius: Mixin.moderateSize(30),
    borderTopRightRadius: Mixin.moderateSize(30)
  },
  cancelButton: {
    marginTop: Mixin.moderateSize(8),
  },
  image: {
    height: Mixin.moderateSize(170),
    width:Mixin.moderateSize(170)
  },
  title: {
    fontWeight: '700',
    fontSize: Mixin.moderateSize(22),
    textAlign: 'center'
  },
  itemContainer: {
    width: '95%',
    backgroundColor: theme.colors?.backgroundItem,
    borderRadius: 10,
    marginVertical: 10
  },
  icon: {
    width: Mixin.moderateSize(30),
    height: Mixin.moderateSize(30),
    position: 'absolute',
    left: -15,
    top: 10,
    backgroundColor: theme.colors?.primary,
    borderRadius: Mixin.moderateSize(15),
    justifyContent: 'center',
    alignItems: 'center'
  },
  normalTxt: {
    fontWeight: '400',
    fontSize: Mixin.moderateSize(16),
  },
}));
export const IntroductionModal = (props: IBottomModal) => {
  const { theme, t, translations } = useBaseHook();
  const {
    confirmTitle = t(translations.confirm),
    cancelTitle = t(translations.cancel),

  } = props;
  const [deActiveOthersDevice, setDeActiveOthersDevice] = useState(false);

  const styles = useStyles(theme);
  const Item = (title: string, id: string) => {
    return (
      <View style={{ width: '95%', alignItems: 'flex-end' }}>
        <View style={styles.itemContainer}>
          <View style={styles.icon}>
            <AppText subtitle3 white>{id}</AppText>
          </View>
          <View style={{ width: '90%', paddingVertical: 15, paddingLeft: 30 }} >
            <AppText style={styles.normalTxt}>{title}</AppText>
          </View>
        </View>
      </View>
    );
  };
  const onHideIntro = (code: boolean) => {
    setDeActiveOthersDevice(!deActiveOthersDevice)
    props.onHideIntro && props.onHideIntro(code);
  };
  return (
    <Overlay
      onBackdropPress={() =>
        props.canDismiss && props.onCancel && props.onCancel()
      }
      overlayStyle={styles.overlayStyles}
      {...props}>
      <View style={{ width: '100%', height: '80%', alignItems: 'center' }}>
        <Image
          resizeMode={'contain'}
          style={styles.image}
          source={{ uri: `${BASE_API_URL}/assets${props.imageUrl}` }}
        />
        <RenderHtml
          contentWidth={
            Mixin.device_width - (Mixin.moderateSize(32) * 3) / 2.5 - 20
          }
          source={{ html: props.title || '' }}
        />
        {Item(props.title1, "1")}
        {props.title2 != '' && Item(props.title2, "2")}
        {props.title3 != '' && Item(props.title3, "3")}
      </View>
      <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <AppCheckBox
          checked={deActiveOthersDevice}
          onPress={() => onHideIntro(!deActiveOthersDevice)}
          title={t(translations.doNotShow)}
        />
      </View>
      <View style={{ width: '100%' }}>
        <AppButton
          title={confirmTitle}
          onPress={() => {
            props.onConfirm && props.onConfirm();
          }}
        />
      </View>
    </Overlay>
  );
};
