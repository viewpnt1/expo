import { NavigationContext } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, PixelRatio, View } from 'react-native';
import { DevMenuItemEnum, } from '../DevMenuInternal';
import { StyledView } from '../components/Views';
import Colors from '../constants/Colors';
import DevMenuButton from './DevMenuButton';
class DevMenuItem extends React.PureComponent {
    render() {
        const { item } = this.props;
        switch (item.type) {
            case DevMenuItemEnum.ACTION:
                return React.createElement(DevMenuItemAction, { item: item });
            case DevMenuItemEnum.GROUP:
                return React.createElement(DevMenuItemsList, { items: item.items });
            default:
                return null;
        }
    }
}
let DevMenuItemAction = /** @class */ (() => {
    class DevMenuItemAction extends React.PureComponent {
        constructor() {
            super(...arguments);
            this.action = (...args) => {
                // dispatchActionAsync(...args);
                this.context.push('Test');
            };
        }
        render() {
            const { actionId, isAvailable, label, detail, glyphName } = this.props.item;
            return (React.createElement(StyledView, { style: styles.itemWrapper, lightBackgroundColor: Colors.light.menuItemBackground, lightBorderColor: Colors.light.menuItemBorderColor, darkBackgroundColor: Colors.dark.menuItemBackground, darkBorderColor: Colors.dark.menuItemBorderColor },
                React.createElement(DevMenuButton, { buttonKey: actionId, label: label || '', onPress: this.action, icon: glyphName, isEnabled: isAvailable, detail: detail || '' })));
        }
    }
    DevMenuItemAction.contextType = NavigationContext;
    return DevMenuItemAction;
})();
export default class DevMenuItemsList extends React.PureComponent {
    render() {
        const { items } = this.props;
        return (React.createElement(View, { style: styles.group }, items.map((item, index) => (React.createElement(DevMenuItem, { key: index, item: item })))));
    }
}
const pixel = 1 / PixelRatio.get();
const styles = StyleSheet.create({
    group: {
        marginVertical: 3,
        marginHorizontal: -pixel,
    },
    itemWrapper: {
        borderTopWidth: pixel,
        borderBottomWidth: pixel,
        marginTop: -pixel,
    },
});
//# sourceMappingURL=DevMenuItemsList.js.map