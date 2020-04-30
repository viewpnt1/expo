import React from 'react';
import { EventSubscription, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Animated from 'react-native-reanimated';

import DevMenuContext from '../DevMenuContext';
import { closeMenuAsync } from '../DevMenuInternal';
import DevMenuMainScreen from '../screens/DevMenuMainScreen';
import DevMenuSettingsScreen from '../screens/DevMenuSettingsScreen';
import BottomSheet from './BottomSheet';
import * as DevMenu from './DevMenuModule';
import DevMenuTestScreen from '../screens/DevMenuTestScreen';

type Props = {
  uuid: string;
};

// @refresh
class DevMenuBottomSheet extends React.PureComponent<Props, any> {
  ref = React.createRef<BottomSheet>();

  snapPoints = [0, '60%', '75%', '90%'];

  callbackNode = new Animated.Value(0);

  backgroundOpacity = this.callbackNode.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0],
  });

  closeSubscription: EventSubscription | null = null;

  componentDidMount() {
    this.expand();

    // Before the dev menu can be actually closed, we need to collapse its sheet view,
    // and this listens for close requests that come from native side to start collapsing the view.
    // The awaited return value of this listener is then send back as a response
    // so the native module knows when it can fully close dev menu (detach its root view).
    this.closeSubscription = DevMenu.listenForCloseRequests(() => {
      // Unsubscribe immediately so we don't accidentally collapse twice.
      // Also componentWillUnmount is not called (why?) when the app is hot reloading this component,
      // despite the componentDidMount is later called after first render.
      this.unsubscribeCloseSubscription();

      // `collapse` returns a promise, so this `return` is important to finish the close event once the view is fully collapsed.
      return this.collapse();
    });
  }

  componentDidUpdate(prevProps) {
    // Make sure it gets expanded once we receive new identifier.
    if (prevProps.uuid !== this.props.uuid) {
      this.expand();
    }
  }

  componentWillUnmount() {
    this.unsubscribeCloseSubscription();
  }

  collapse = (): Promise<void> => {
    this.ref.current?.snapTo(0);

    // Use setTimeout until there is a better solution to execute something once the sheet is fully collapsed.
    return new Promise(resolve => setTimeout(resolve, 300));
  };

  collapseAndClose = async () => {
    await this.collapse();
    await closeMenuAsync();
  };

  expand = () => {
    this.ref.current && this.ref.current.snapTo(1);
  };

  unsubscribeCloseSubscription = () => {
    if (this.closeSubscription) {
      this.closeSubscription.remove();
      this.closeSubscription = null;
    }
  };

  onCloseEnd = () => {
    this.collapseAndClose();
  };

  providedContext = {
    expand: this.expand,
    collapse: this.collapse,
  };

  screens = [
    {
      name: 'Main',
      component: DevMenuMainScreen,
      options: DevMenuMainScreen.navigationOptions,
    },
    {
      name: 'Settings',
      component: DevMenuSettingsScreen,
      options: DevMenuSettingsScreen.navigationOptions,
    },
    {
      name: 'Test',
      component: DevMenuTestScreen,
      options: DevMenuTestScreen.navigationOptions,
    },
  ];

  render() {
    const providedContext = {
      ...this.props,
      ...this.providedContext,
    };

    return (
      <DevMenuContext.Provider value={providedContext}>
        <View style={styles.bottomSheetContainer}>
          <TouchableWithoutFeedback onPress={this.collapseAndClose}>
            <Animated.View
              style={[styles.bottomSheetBackground, { opacity: this.backgroundOpacity }]}
            />
          </TouchableWithoutFeedback>
          <BottomSheet
            ref={this.ref}
            initialSnap={0}
            snapPoints={this.snapPoints}
            callbackNode={this.callbackNode}
            screens={this.screens}
          />
        </View>
      </DevMenuContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  bottomSheetContainer: {
    flex: 1,
  },
  bottomSheetBackground: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default DevMenuBottomSheet;
