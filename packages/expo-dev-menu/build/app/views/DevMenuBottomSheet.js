import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View, Dimensions, TouchableOpacity, } from 'react-native';
import Animated from 'react-native-reanimated';
import DevMenuContext from '../DevMenuContext';
import { closeMenuAsync } from '../DevMenuInternal';
import Colors from '../constants/Colors';
import * as DevMenu from './DevMenuModule';
import BottomSheet from './BottomSheet';
import DevMenuMainScreen from '../screens/DevMenuMainScreen';
import LayoutRuler from '../components/LayoutRuler';
const Stack = createStackNavigator();
const BOTTOM_PADDING = 40;
// @refresh
class DevMenuBottomSheet extends React.PureComponent {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        // ref = React.createRef<ScrollBottomSheet<any>>();
        this.snapPoints = [0, '60%', '75%', '90%'];
        // snapPoints = ['10%', '35%', '100%'];
        this.callbackNode = new Animated.Value(0);
        this.backgroundOpacity = this.callbackNode.interpolate({
            inputRange: [0, 1],
            outputRange: [0.5, 0],
        });
        this.closeSubscription = null;
        this.collapse = () => {
            this.ref.current?.snapTo(0);
            // this.ref.current && this.ref.current.snapTo(this.snapPoints.length - 1);
            // Use setTimeout until there is a better solution to execute something once the sheet is fully collapsed.
            return new Promise(resolve => setTimeout(resolve, 300));
        };
        this.collapseAndClose = async () => {
            await this.collapse();
            await closeMenuAsync();
        };
        this.expand = () => {
            this.ref.current && this.ref.current.snapTo(1);
        };
        this.unsubscribeCloseSubscription = () => {
            if (this.closeSubscription) {
                this.closeSubscription.remove();
                this.closeSubscription = null;
            }
        };
        this.onCloseEnd = () => {
            this.collapseAndClose();
        };
        this.providedContext = {
            expand: this.expand,
            collapse: this.collapse,
        };
        // renderContentOld = () => {
        //   return <View style={styles.bottomSheetContent}>{this.props.children}</View>;
        // };
        this.sheetHeight = new Animated.Value(10000);
        this.sheetHeightSet = false;
        this.onSheetHeightMeasure = (height) => {
            console.log(height);
            if (!this.sheetHeightSet && height > 0) {
                this.sheetHeight.setValue(height + BOTTOM_PADDING);
                this.sheetHeightSet = true;
            }
        };
        this.renderScreen = screen => {
            const ScreenComponent = screen.component;
            return (React.createElement(Stack.Screen, { key: screen.name, name: screen.name, options: screen.options }, props => (React.createElement(LayoutRuler, { property: "height", onMeasure: this.onSheetHeightMeasure },
                React.createElement(ScreenComponent, Object.assign({}, props))))));
        };
        this.renderHeader = () => {
            return (React.createElement(View, { style: styles.bottomSheetHeader },
                React.createElement(HeaderBackButton, null)));
        };
        this.renderContent = () => {
            return (React.createElement(Animated.View, { style: [styles.bottomSheetContent, { height: this.sheetHeight }] },
                React.createElement(Stack.Navigator, { initialRouteName: "Main", headerMode: "float" }, this.screens.map(this.renderScreen))));
        };
        this.screens = [
            {
                name: 'Main',
                component: DevMenuMainScreen,
                options: DevMenuMainScreen.navigationOptions,
            },
            {
                name: 'Test',
                component: TestScreen,
                options: TestScreen.navigationOptions,
            },
            {
                name: 'Test2',
                component: TestScreen,
                options: TestScreen.navigationOptions,
            },
            {
                name: 'Test3',
                component: TestScreen,
                options: TestScreen.navigationOptions,
            },
        ];
        this.sheetHeightSet = false;
        this.sheetHeight.setValue(Dimensions.get('window').height);
    }
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
    render() {
        const providedContext = {
            ...this.props,
            ...this.providedContext,
        };
        return (React.createElement(DevMenuContext.Provider, { value: providedContext },
            React.createElement(View, { style: styles.bottomSheetContainer },
                React.createElement(TouchableWithoutFeedback, { onPress: this.collapseAndClose },
                    React.createElement(Animated.View, { style: [styles.bottomSheetBackground, { opacity: this.backgroundOpacity }] })),
                React.createElement(BottomSheet, { ref: this.ref, initialSnap: 0, snapPoints: this.snapPoints, borderRadius: 10, enabledInnerScrolling: true, enabledContentGestureInteraction: true, callbackNode: this.callbackNode, renderHeader: this.renderHeader, renderContent: this.renderContent }))));
    }
}
let TestScreen = /** @class */ (() => {
    class TestScreen extends React.PureComponent {
        render() {
            return (React.createElement(View, { style: { flex: 1 } },
                React.createElement(View, { style: {
                        height: 400,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'blue',
                        borderBottomColor: 'yellow',
                        borderBottomWidth: 2,
                    } },
                    React.createElement(TouchableOpacity, { onPress: () => this.props.navigation.push('Test2') },
                        React.createElement(View, { style: { height: 100, width: 100, backgroundColor: 'green' } }))),
                React.createElement(View, { style: {
                        height: 400,
                        backgroundColor: 'blue',
                        borderBottomColor: 'yellow',
                        borderBottomWidth: 2,
                    } }),
                React.createElement(View, { style: {
                        height: 400,
                        backgroundColor: 'blue',
                        borderBottomColor: 'yellow',
                        borderBottomWidth: 2,
                    } }),
                React.createElement(View, { style: {
                        height: 400,
                        backgroundColor: 'blue',
                        borderBottomColor: 'yellow',
                        borderBottomWidth: 2,
                    } }),
                React.createElement(View, { style: {
                        height: 400,
                        backgroundColor: 'blue',
                        borderBottomColor: 'yellow',
                        borderBottomWidth: 2,
                    } }),
                React.createElement(View, { style: {
                        height: 400,
                        backgroundColor: 'blue',
                        borderBottomColor: 'yellow',
                        borderBottomWidth: 2,
                    } })));
        }
    }
    TestScreen.navigationOptions = {
        headerShown: true,
    };
    TestScreen.contextType = DevMenuContext;
    return TestScreen;
})();
const styles = StyleSheet.create({
    bottomSheetContainer: {
        flex: 1,
    },
    bottomSheetBackground: {
        flex: 1,
        backgroundColor: '#000',
    },
    bottomSheetHeader: {
        height: 40,
        backgroundColor: Colors.dark.menuBackground,
    },
    bottomSheetContent: {
        paddingBottom: BOTTOM_PADDING,
        backgroundColor: Colors.dark.menuBackground,
    },
});
export default DevMenuBottomSheet;
//# sourceMappingURL=DevMenuBottomSheet.js.map