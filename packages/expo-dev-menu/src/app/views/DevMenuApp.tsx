import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { AppearanceProvider, useColorScheme, ColorSchemeName } from 'react-native-appearance';
import { ThemeContext } from 'react-navigation';

import * as DevMenuInternal from '../DevMenuInternal';
import DevMenuBottomSheet from './DevMenuBottomSheet';

function useUserSettings(renderId): DevMenuInternal.DevMenuSettingsType {
  const [settings, setSettings] = React.useState({});

  React.useEffect(() => {
    async function getUserSettings() {
      const settings = await DevMenuInternal.getSettingsAsync();
      setSettings(settings);
    }

    getUserSettings();
  }, [renderId]);

  return settings;
}

export default class DevMenuRoot extends React.PureComponent<any, any> {
  render() {
    return <DevMenuApp {...this.props} />;
  }
}

function DevMenuApp(props) {
  const colorScheme = useColorScheme();
  const { preferredAppearance = 'no-preference' } = useUserSettings(props.uuid);

  let theme: ColorSchemeName =
    preferredAppearance === 'no-preference' ? colorScheme : preferredAppearance;
  if (theme === 'no-preference') {
    theme = 'light';
  }

  return (
    <AppearanceProvider style={styles.rootView}>
      <ThemeContext.Provider value={theme}>
        <NavigationContainer>
          <DevMenuBottomSheet {...props}>
            {/* <NavigationContainer>
            <Stack.Navigator initialRouteName="Main" mode="modal">
              <Stack.Screen
                name="Main"
                component={DevMenuMainScreen}
                options={DevMenuMainScreen.navigationOptions}
              />
            </Stack.Navigator>
          </NavigationContainer> */}
            {/* <DevMenuMainScreen /> */}
          </DevMenuBottomSheet>
        </NavigationContainer>
      </ThemeContext.Provider>
    </AppearanceProvider>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
  },
});
