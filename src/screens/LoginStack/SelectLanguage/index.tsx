import React, {useState, useEffect} from 'react';
import {FlatList, TouchableOpacity, View, Text} from 'react-native';
import useStyles from './styles';
import {HookHelper, Mixin} from 'helpers';
import {Image} from 'react-native-elements';
import Container from 'components/atoms/Container';
import AppText from 'components/atoms/AppText';
import AppButton from 'components/atoms/Button';
import _ from 'lodash';
import {ELanguage} from 'utils/i18n/index';
import {useGetNavigation} from 'helpers/hookHelper';
import {ILanguage, ListLanguage} from 'models/ILanguage';
import {useDispatch} from 'react-redux';
import {LanguageActions} from 'stores/actions';

interface ILanguageItemProps {
  onPress: () => void;
  language: ILanguage;
  isSelected: boolean;
}

const Item = (props: ILanguageItemProps) => {
  const {theme, t, translations} = HookHelper.useBaseHook();
  const styles = useStyles(theme);

  const getLanguageTitle = (id: ELanguage) => {
    switch (id) {
      case ELanguage.EN:
        return t(translations.onBoarding.english);
      case ELanguage.FR:
        return t(translations.onBoarding.france);
      case ELanguage.HT:
        return t(translations.onBoarding.creole);
      default:
        break;
    }
  };
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[
        styles.itemContainer,
        props.isSelected ? styles.itemSelected : null,
      ]}>
      <Image source={props.language.icon} style={styles.icon} />
      <AppText body2>{getLanguageTitle(props.language.id)}</AppText>
    </TouchableOpacity>
  );
};

export const SelectLanguage = () => {
  const {theme, t, translations} = HookHelper.useBaseHook();
  const {navigation} = useGetNavigation();
  const styles = useStyles(theme);
  const [selectedLanguage, setSelectedLanguage] = useState(ELanguage.EN);
  const dispatch = useDispatch();

  //selectedLanguage = fr

  const onSelectLanguage = (id: ELanguage) => {
    setSelectedLanguage(id);
  };
  const onNext = () => {
    dispatch(LanguageActions.changeLanguage.request(selectedLanguage));
    navigation.navigate('OnBoardingScreen');
  };

  return (
    <Container scrollEnabled={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.BoldText}>
            {t(translations.onBoarding.selectLanguage)}
          </Text>
        </View>
        <View style={styles.contentView}>
          <FlatList
            data={ListLanguage}
            numColumns={2}
            renderItem={item => (
              <Item
                isSelected={item.item.id === selectedLanguage}
                language={item.item}
                onPress={() => onSelectLanguage(item.item.id)}
              />
            )}
            keyExtractor={item => item.id}
            extraData={ListLanguage}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <AppButton
          disabled={_.isEmpty(selectedLanguage)}
          onPress={() => onNext()}
          shadow
          title={t(translations.onBoarding.confirm)}
        />
      </View>
    </Container>
  );
};
