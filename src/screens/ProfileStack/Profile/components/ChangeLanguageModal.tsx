import {Icon, makeStyles} from 'react-native-elements';
import React from 'react';
import {useAppSelector, useBaseHook} from 'helpers/hookHelper';
import {BottomModal} from 'components/atoms/BottomModal';
import {TouchableOpacity, View} from 'react-native';
import {Mixin} from 'helpers';
import AppText from 'components/atoms/AppText';
import {ELanguage} from 'utils/i18n';
import {ILanguage, ListLanguage} from 'models/ILanguage';
import {Image} from 'react-native-elements/dist/image/Image';
import {LanguageActions} from 'stores/actions';
import LanguageServices from 'services/LanguageServices';
interface IChangeLanguageModal {
  isVisible: boolean;
  onCancel: () => void;
  onSelect: (language: ILanguage) => void;
}

const useStyles = makeStyles(theme => ({
  titleContainer: {
    width: '100%',
    paddingHorizontal: Mixin.moderateSize(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainContainer: {
    width: '100%',
    paddingHorizontal: Mixin.moderateSize(16),
    marginTop: Mixin.moderateSize(16),
  },
  languageContainer: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: Mixin.moderateSize(16),
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors?.grey4,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  flag: {
    width: Mixin.moderateSize(40),
    height: Mixin.moderateSize(40),
    marginRight: Mixin.moderateSize(8),
  },
}));

export const ChangeLanguageModal = (props: IChangeLanguageModal) => {
  const {theme, t, translations, dispatch} = useBaseHook();
  const styles = useStyles(theme);
  const currentLanguage = useAppSelector(
    state => state.LanguageReducer.language,
  );
  const onSelect = (language: ILanguage) => {
    dispatch(LanguageActions.changeLanguage.request(language.id));
    props.onSelect(language);
    setTimeout(() => {
      LanguageServices.changeLanguage();
    }, 100);
  };
  const getLanguageTitle = (id: ELanguage) => {
    switch (id) {
      case ELanguage.EN:
        return t(translations.onBoarding.english);
      case ELanguage.FR:
        return t(translations.onBoarding.france_language);
      case ELanguage.HT:
        return t(translations.onBoarding.creole);
      default:
        break;
    }
  };
  const getLanguageName = (id: ELanguage) => {
    switch (id) {
      case ELanguage.EN:
        return t(translations.onBoarding.english);
      case ELanguage.FR:
        return t(translations.onBoarding.france);
      case ELanguage.HT:
        return t(translations.onBoarding.creole_language);
      default:
        break;
    }
  };
  return (
    <BottomModal
      onBackdropPress={() => props.onCancel()}
      disabledConfirm
      isVisible={props.isVisible}>
      <View style={styles.titleContainer}>
        <AppText h6>{t(translations.chooseLanguage)}</AppText>
        {/* <TouchableOpacity onPress={() => props.onCancel()}>
          <AppText subtitle2 style={{color: theme.colors?.primary}}>
            {t(translations.cancel)}
          </AppText>
        </TouchableOpacity> */}
      </View>
      <View style={styles.mainContainer}>
        {ListLanguage.map((language, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onSelect(language)}
              style={[
                styles.languageContainer,
                index === ListLanguage.length - 1 ? styles.lastItem : null,
              ]}>
              <Image style={styles.flag} source={language.icon} />
              <View>
                <AppText subtitle3>{getLanguageTitle(language.id)}</AppText>
                <AppText body3>{getLanguageName(language.id)}</AppText>
              </View>
              {currentLanguage === language.id && (
                <View style={{position: 'absolute', right: 10}}>
                  <Icon
                    color={theme.colors?.primary}
                    name="check"
                    type="material-community"
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </BottomModal>
  );
};
