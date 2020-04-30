import React from 'react';
import { EventSubscription } from 'react-native';
import Animated from 'react-native-reanimated';
import BottomSheet from './BottomSheet';
import DevMenuMainScreen from '../screens/DevMenuMainScreen';
declare type Props = {
    uuid: string;
};
declare class DevMenuBottomSheet extends React.PureComponent<Props, any> {
    ref: React.RefObject<BottomSheet>;
    snapPoints: (string | number)[];
    callbackNode: Animated.Value<0>;
    backgroundOpacity: Animated.Node<number>;
    closeSubscription: EventSubscription | null;
    constructor(props: any);
    componentDidMount(): void;
    componentDidUpdate(prevProps: any): void;
    componentWillUnmount(): void;
    collapse: () => Promise<void>;
    collapseAndClose: () => Promise<void>;
    expand: () => void;
    unsubscribeCloseSubscription: () => void;
    onCloseEnd: () => void;
    providedContext: {
        expand: () => void;
        collapse: () => Promise<void>;
    };
    sheetHeight: Animated.Value<10000>;
    sheetHeightSet: boolean;
    onSheetHeightMeasure: (height: number) => void;
    renderScreen: (screen: any) => JSX.Element;
    renderHeader: () => JSX.Element;
    renderContent: () => JSX.Element;
    screens: {
        name: string;
        component: typeof DevMenuMainScreen;
        options: {
            headerShown: boolean;
        };
    }[];
    render(): JSX.Element;
}
export default DevMenuBottomSheet;
