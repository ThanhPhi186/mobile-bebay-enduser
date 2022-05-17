import {Mixin} from 'helpers';
import {useBaseHook} from 'helpers/hookHelper';
import React, {useState, useEffect} from 'react';
import {ViewProps} from 'react-native';
import {makeStyles, OverlayProps} from 'react-native-elements';
import AppText from 'components/atoms/AppText';
import {View} from 'react-native';

interface IDetailProps extends ViewProps {
  title?: string;
  description?: string;
}
const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    paddingHorizontal: Mixin.moderateSize(16),
    paddingVertical: Mixin.moderateSize(5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  txtTitle: {
    color: '#84888D',
    fontWeight: '400',
    fontSize: Mixin.moderateSize(14),
    marginTop: 0,
    width: '50%',
  },
  txtDescription: {
    color: '#323232',
    fontWeight: '500',
    fontSize: Mixin.moderateSize(14),
    marginTop: 0,
    width: '50%',
    textAlign: 'right',
  },
}));
const ItemTransactionDetail = (props: IDetailProps) => {
  const {theme} = useBaseHook();
  const styles = useStyles(theme);
  return (
    <View style={[styles.container, props.style]}>
      <AppText style={styles.txtTitle}>{props.title}</AppText>
      <AppText style={styles.txtDescription}>{props.description}</AppText>
    </View>
  );
};
export default ItemTransactionDetail;
